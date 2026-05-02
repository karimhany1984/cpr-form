import { useEffect, useState, useCallback } from 'react';
import { CPRCase, saveCPRCase, getCPRCase, getAllCPRCases, getCPRCasesByMonth, deleteCPRCase, initDB } from '@/lib/db';

export function useCPRCases() {
  const [cases, setCases] = useState<CPRCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database on mount
  useEffect(() => {
    initDB()
      .then(() => loadAllCases())
      .catch(err => {
        setError('Failed to initialize database: ' + err.message);
        setLoading(false);
      });
  }, []);

  const loadAllCases = useCallback(async () => {
    try {
      setLoading(true);
      const allCases = await getAllCPRCases();
      setCases(allCases.sort((a, b) => b.createdAt - a.createdAt));
      setError(null);
    } catch (err) {
      setError('Failed to load cases: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCasesByMonth = useCallback(async (month: string, year: number) => {
    try {
      setLoading(true);
      const monthlyCases = await getCPRCasesByMonth(month, year);
      setCases(monthlyCases.sort((a, b) => b.createdAt - a.createdAt));
      setError(null);
    } catch (err) {
      setError('Failed to load monthly cases: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addCase = useCallback(async (cprCase: Omit<CPRCase, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    try {
      const newCase: CPRCase = {
        ...cprCase,
        id: `cpr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        synced: false,
      };
      await saveCPRCase(newCase);
      setCases(prev => [newCase, ...prev]);
      return newCase;
    } catch (err) {
      setError('Failed to save case: ' + (err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    }
  }, []);

  const updateCase = useCallback(async (id: string, updates: Partial<CPRCase>) => {
    try {
      const existingCase = await getCPRCase(id);
      if (!existingCase) throw new Error('Case not found');
      
      const updatedCase: CPRCase = {
        ...existingCase,
        ...updates,
        id,
        updatedAt: Date.now(),
        synced: false,
      };
      await saveCPRCase(updatedCase);
      setCases(prev => prev.map(c => c.id === id ? updatedCase : c));
      return updatedCase;
    } catch (err) {
      setError('Failed to update case: ' + (err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    }
  }, []);

  const removeCase = useCallback(async (id: string) => {
    try {
      await deleteCPRCase(id);
      setCases(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete case: ' + (err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    }
  }, []);

  return {
    cases,
    loading,
    error,
    loadAllCases,
    loadCasesByMonth,
    addCase,
    updateCase,
    removeCase,
  };
}
