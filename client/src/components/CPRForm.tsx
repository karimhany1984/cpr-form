import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CPRCase } from '@/lib/db';
import { AlertCircle } from 'lucide-react';

interface CPRFormProps {
  onSubmit: (data: Omit<CPRCase, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Promise<void>;
  initialData?: CPRCase;
  isLoading?: boolean;
}

export function CPRForm({ onSubmit, initialData, isLoading = false }: CPRFormProps) {
  const [formData, setFormData] = useState<Omit<CPRCase, 'id' | 'createdAt' | 'updatedAt' | 'synced'>>({
    // Hospital Info
    hospitalName: initialData?.hospitalName || '',
    governorate: initialData?.governorate || '',
    month: initialData?.month || '',
    year: initialData?.year || new Date().getFullYear(),
    
    // Patient Data (بيانات المريض)
    patientName: initialData?.patientName || '',
    medicalId: initialData?.medicalId || '',
    
    // Admission Data (بيانات الدخول)
    admissionDate: initialData?.admissionDate || '',
    diagnosis: initialData?.diagnosis || '',
    department: initialData?.department || '',
    
    // Code Blue Response (الاستجابة للCode Blue)
    cardiacArrestDate: initialData?.cardiacArrestDate || '',
    cardiacArrestLocation: initialData?.cardiacArrestLocation || '',
    codeBlueAnnouncementTime: initialData?.codeBlueAnnouncementTime || '',
    cprStartTime: initialData?.cprStartTime || '',
    codeBlueTeamArrivalTime: initialData?.codeBlueTeamArrivalTime || '',
    responseTime: initialData?.responseTime || '',
    
    // CPR Quality (جودة عملية الإنعاش)
    cprCycles: initialData?.cprCycles || 0,
    defibrillationUsed: initialData?.defibrillationUsed || false,
    cprEndTime: initialData?.cprEndTime || '',
    totalResuscitationTime: initialData?.totalResuscitationTime || '',
    resuscitationOutcome: initialData?.resuscitationOutcome || 'success',
    
    // Documentation (التوثيق)
    cprFormExists: initialData?.cprFormExists || false,
    cprFormComplete: initialData?.cprFormComplete || false,
    
    // Discharge Data (بيانات الخروج)
    dischargeDate: initialData?.dischargeDate || '',
    dischargeStatus: initialData?.dischargeStatus || '',
    
    // Death Cases (حالات الوفاة)
    deathBefore24Hours: initialData?.deathBefore24Hours || false,
    deathAfter24Hours: initialData?.deathAfter24Hours || false,
  });

  const [activeStep, setActiveStep] = useState<'meta' | 'patient' | 'admission' | 'arrest' | 'cpr' | 'documentation' | 'discharge'>('meta');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.governorate) newErrors.governorate = 'Governorate is required';
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.medicalId) newErrors.medicalId = 'Medical ID is required';
    if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!formData.cardiacArrestDate) newErrors.cardiacArrestDate = 'Cardiac arrest date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      setFormData({
        hospitalName: '',
        governorate: '',
        month: '',
        year: new Date().getFullYear(),
        patientName: '',
        medicalId: '',
        admissionDate: '',
        diagnosis: '',
        department: '',
        cardiacArrestDate: '',
        cardiacArrestLocation: '',
        codeBlueAnnouncementTime: '',
        cprStartTime: '',
        codeBlueTeamArrivalTime: '',
        responseTime: '',
        cprCycles: 0,
        defibrillationUsed: false,
        cprEndTime: '',
        totalResuscitationTime: '',
        resuscitationOutcome: 'success',
        cprFormExists: false,
        cprFormComplete: false,
        dischargeDate: '',
        dischargeStatus: '',
        deathBefore24Hours: false,
        deathAfter24Hours: false,
      });
      setActiveStep('meta');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const steps = [
    { id: 'meta', label: 'Hospital Info', icon: '🏥', arabic: 'معلومات المستشفى' },
    { id: 'patient', label: 'Patient Data', icon: '👤', arabic: 'بيانات المريض' },
    { id: 'admission', label: 'Admission', icon: '📋', arabic: 'بيانات الدخول' },
    { id: 'arrest', label: 'Cardiac Arrest', icon: '⏱️', arabic: 'توقف القلب' },
    { id: 'cpr', label: 'CPR Details', icon: '❤️', arabic: 'تفاصيل الإنعاش' },
    { id: 'documentation', label: 'Documentation', icon: '📄', arabic: 'التوثيق' },
    { id: 'discharge', label: 'Discharge', icon: '✓', arabic: 'الخروج' },
  ];

  const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <Label className="block mb-2 font-semibold text-sm">{label}</Label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-4 border-b">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeStep === step.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{step.icon}</span>
            <span className="text-sm font-medium">{step.label}</span>
          </button>
        ))}
      </div>

      {/* Hospital Info */}
      {activeStep === 'meta' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>🏥</span> معلومات المستشفى
          </h2>
          <FormField label="Hospital Name" error={errors.hospitalName}>
            <Input
              value={formData.hospitalName}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
              placeholder="Enter hospital name"
            />
          </FormField>
          <FormField label="Governorate" error={errors.governorate}>
            <Input
              value={formData.governorate}
              onChange={(e) => handleInputChange('governorate', e.target.value)}
              placeholder="Enter governorate"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Month" error={errors.month}>
              <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Year">
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Patient Data - بيانات المريض */}
      {activeStep === 'patient' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>👤</span> بيانات المريض
          </h2>
          <FormField label="اسم المريض الرباعي" error={errors.patientName}>
            <Input
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              placeholder="Enter full name"
            />
          </FormField>
          <FormField label="الرقم الطبي الموحد" error={errors.medicalId}>
            <Input
              value={formData.medicalId}
              onChange={(e) => handleInputChange('medicalId', e.target.value)}
              placeholder="Enter medical ID"
            />
          </FormField>
        </div>
      )}

      {/* Admission Data - بيانات الدخول */}
      {activeStep === 'admission' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>📋</span> بيانات الدخول
          </h2>
          <FormField label="تاريخ دخول المستشفى" error={errors.admissionDate}>
            <Input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleInputChange('admissionDate', e.target.value)}
            />
          </FormField>
          <FormField label="التشخيص">
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              placeholder="Enter diagnosis"
              rows={3}
            />
          </FormField>
          <FormField label="القسم">
            <Input
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Enter department"
            />
          </FormField>
        </div>
      )}

      {/* Cardiac Arrest - توقف القلب */}
      {activeStep === 'arrest' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>⏱️</span> الاستجابة للCode Blue
          </h2>
          <FormField label="تاريخ حدوث توقف القلب" error={errors.cardiacArrestDate}>
            <Input
              type="date"
              value={formData.cardiacArrestDate}
              onChange={(e) => handleInputChange('cardiacArrestDate', e.target.value)}
            />
          </FormField>
          <FormField label="المكان / القسم">
            <Input
              value={formData.cardiacArrestLocation}
              onChange={(e) => handleInputChange('cardiacArrestLocation', e.target.value)}
              placeholder="Enter location/department"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="وقت اعلان Code Blue">
              <Input
                type="time"
                value={formData.codeBlueAnnouncementTime}
                onChange={(e) => handleInputChange('codeBlueAnnouncementTime', e.target.value)}
              />
            </FormField>
            <FormField label="وقت بداية CPR">
              <Input
                type="time"
                value={formData.cprStartTime}
                onChange={(e) => handleInputChange('cprStartTime', e.target.value)}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="وقت وصول فريق الCode Blue كاملا">
              <Input
                type="time"
                value={formData.codeBlueTeamArrivalTime}
                onChange={(e) => handleInputChange('codeBlueTeamArrivalTime', e.target.value)}
              />
            </FormField>
            <FormField label="زمن الاستجابة للCode Blue (دقائق)">
              <Input
                type="number"
                value={formData.responseTime}
                onChange={(e) => handleInputChange('responseTime', e.target.value)}
                placeholder="0"
              />
            </FormField>
          </div>
        </div>
      )}

      {/* CPR Details - جودة عملية الإنعاش */}
      {activeStep === 'cpr' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>❤️</span> جودة عملية الإنعاش القلبية التنفسية
          </h2>
          <FormField label="عدد دورات CPR">
            <Input
              type="number"
              value={formData.cprCycles}
              onChange={(e) => handleInputChange('cprCycles', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </FormField>
          <FormField label="استخدام الصدمات الكهربائية">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.defibrillationUsed}
                onCheckedChange={(checked) => handleInputChange('defibrillationUsed', checked)}
              />
              <span className="text-sm">نعم، تم استخدام الصدمات الكهربائية</span>
            </div>
          </FormField>
          <FormField label="ساعة انتهاء CPR">
            <Input
              type="time"
              value={formData.cprEndTime}
              onChange={(e) => handleInputChange('cprEndTime', e.target.value)}
            />
          </FormField>
          <FormField label="مدة الانعاش الكلية (دقائق)">
            <Input
              type="number"
              value={formData.totalResuscitationTime}
              onChange={(e) => handleInputChange('totalResuscitationTime', e.target.value)}
              placeholder="0"
            />
          </FormField>
          <FormField label="نتيجة الانعاش النهائية">
            <Select value={formData.resuscitationOutcome} onValueChange={(value) => handleInputChange('resuscitationOutcome', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">نجاة (Success)</SelectItem>
                <SelectItem value="failure">وفاة (Failure)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      )}

      {/* Documentation - التوثيق */}
      {activeStep === 'documentation' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>📄</span> التوثيق
          </h2>
          <FormField label="يوجد نموذج توثيق CPR">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.cprFormExists}
                onCheckedChange={(checked) => handleInputChange('cprFormExists', checked)}
              />
              <span className="text-sm">نعم، يوجد نموذج توثيق</span>
            </div>
          </FormField>
          <FormField label="نموذج التوثيق كامل البيانات">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.cprFormComplete}
                onCheckedChange={(checked) => handleInputChange('cprFormComplete', checked)}
              />
              <span className="text-sm">نعم، النموذج كامل البيانات</span>
            </div>
          </FormField>
        </div>
      )}

      {/* Discharge & Outcomes - بيانات الخروج */}
      {activeStep === 'discharge' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>✓</span> بيانات الخروج وحالات الوفاة
          </h2>
          <FormField label="تاريخ الخروج">
            <Input
              type="date"
              value={formData.dischargeDate}
              onChange={(e) => handleInputChange('dischargeDate', e.target.value)}
            />
          </FormField>
          <FormField label="الحالة عند الخروج">
            <Input
              value={formData.dischargeStatus}
              onChange={(e) => handleInputChange('dischargeStatus', e.target.value)}
              placeholder="Enter discharge status"
            />
          </FormField>
          <FormField label="وفاة قبل 24 ساعة من CPR">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.deathBefore24Hours}
                onCheckedChange={(checked) => handleInputChange('deathBefore24Hours', checked)}
              />
              <span className="text-sm">نعم، المريض توفي قبل 24 ساعة</span>
            </div>
          </FormField>
          <FormField label="وفاة بعد 24 ساعة من CPR">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.deathAfter24Hours}
                onCheckedChange={(checked) => handleInputChange('deathAfter24Hours', checked)}
              />
              <span className="text-sm">نعم، المريض توفي بعد 24 ساعة</span>
            </div>
          </FormField>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const currentIndex = steps.findIndex(s => s.id === activeStep);
            if (currentIndex > 0) {
              setActiveStep(steps[currentIndex - 1].id as any);
            }
          }}
          disabled={activeStep === 'meta'}
        >
          Previous
        </Button>
        {activeStep !== 'discharge' ? (
          <Button
            type="button"
            onClick={() => {
              const currentIndex = steps.findIndex(s => s.id === activeStep);
              if (currentIndex < steps.length - 1) {
                setActiveStep(steps[currentIndex + 1].id as any);
              }
            }}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            className="ml-auto bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Saving...' : 'Save Case'}
          </Button>
        )}
      </div>
    </form>
  );
}
