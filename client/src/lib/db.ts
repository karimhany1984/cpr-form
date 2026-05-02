// IndexedDB utilities for offline CPR data storage

export interface CPRCase {
  id: string;
  // Patient Data
  patientName: string;
  medicalId: string;
  
  // Admission Data
  admissionDate: string;
  diagnosis: string;
  department: string;
  
  // Code Blue Response
  cardiacArrestDate: string;
  cardiacArrestLocation: string;
  codeBlueAnnouncementTime: string;
  cprStartTime: string;
  codeBlueTeamArrivalTime: string;
  responseTime: string; // minutes
  
  // CPR Quality
  cprCycles: number;
  defibrillationUsed: boolean;
  cprEndTime: string;
  totalResuscitationTime: string; // minutes
  resuscitationOutcome: 'success' | 'failure'; // نجاة / وفاة
  
  // Documentation
  cprFormExists: boolean;
  cprFormComplete: boolean;
  
  // Discharge Data
  dischargeDate: string;
  dischargeStatus: string;
  
  // Death Cases
  deathBefore24Hours: boolean;
  deathAfter24Hours: boolean;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  hospitalName: string;
  governorate: string;
  month: string;
  year: number;
  synced: boolean;
}

const DB_NAME = 'CPRFormDB';
const DB_VERSION = 1;
const STORE_NAME = 'cprCases';

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('month', 'month', { unique: false });
        store.createIndex('year', 'year', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

export async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    db = await initDB();
  }
  return db;
}

export async function saveCPRCase(cprCase: CPRCase): Promise<string> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const caseToSave = {
      ...cprCase,
      updatedAt: Date.now(),
      synced: false,
    };
    
    const request = cprCase.id ? store.put(caseToSave) : store.add(caseToSave);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as string);
  });
}

export async function getCPRCase(id: string): Promise<CPRCase | undefined> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAllCPRCases(): Promise<CPRCase[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getCPRCasesByMonth(month: string, year: number): Promise<CPRCase[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('month');
    const request = index.getAll(month);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result.filter(c => c.year === year);
      resolve(results);
    };
  });
}

export async function deleteCPRCase(id: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function clearAllCPRCases(): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function exportToExcel(month: string, year: number, hospitalName: string, governorate: string): Promise<Blob> {
  const cases = await getCPRCasesByMonth(month, year);
  
  // Create CSV content
  const headers = [
    'م',
    'اسم المريض الرباعي',
    'الرقم الطبي الموحد',
    'تاريخ دخول المستشفى',
    'التشخيص',
    'القسم',
    'تاريخ حدوث توقف القلب',
    'المكان/القسم',
    'وقت اعلان Code Blue',
    'وقت بداية CPR',
    'وقت وصول فريق Code Blue',
    'زمن الاستجابة (دقائق)',
    'عدد دورات CPR',
    'استخدام الصدمات الكهربائية',
    'ساعة انتهاء CPR',
    'مدة الانعاش الكلية (دقائق)',
    'نتيجة الانعاش',
    'يوجد نموذج توثيق',
    'النموذج كامل البيانات',
    'تاريخ الخروج',
    'الحالة عند الخروج',
    'وفاة قبل 24 ساعة',
    'وفاة بعد 24 ساعة'
  ];

  const rows = cases.map((cprCase, index) => [
    index + 1,
    cprCase.patientName,
    cprCase.medicalId,
    cprCase.admissionDate,
    cprCase.diagnosis,
    cprCase.department,
    cprCase.cardiacArrestDate,
    cprCase.cardiacArrestLocation,
    cprCase.codeBlueAnnouncementTime,
    cprCase.cprStartTime,
    cprCase.codeBlueTeamArrivalTime,
    cprCase.responseTime,
    cprCase.cprCycles,
    cprCase.defibrillationUsed ? 'نعم' : 'لا',
    cprCase.cprEndTime,
    cprCase.totalResuscitationTime,
    cprCase.resuscitationOutcome === 'success' ? 'نجاة' : 'وفاة',
    cprCase.cprFormExists ? 'نعم' : 'لا',
    cprCase.cprFormComplete ? 'نعم' : 'لا',
    cprCase.dischargeDate,
    cprCase.dischargeStatus,
    cprCase.deathBefore24Hours ? 'نعم' : 'لا',
    cprCase.deathAfter24Hours ? 'نعم' : 'لا'
  ]);

  // Create CSV string
  let csv = '\uFEFF'; // BOM for UTF-8
  csv += headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
  });

  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
