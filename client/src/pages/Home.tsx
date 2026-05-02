import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CPRForm } from '@/components/CPRForm';
import { CPRCasesList } from '@/components/CPRCasesList';
import { useCPRCases } from '@/hooks/useCPRCases';
import { CPRCase, exportToExcel } from '@/lib/db';
import { toast } from 'sonner';
import { WifiOff, Wifi } from 'lucide-react';

export default function Home() {
  const { cases, loading, error, addCase, updateCase, removeCase, loadCasesByMonth } = useCPRCases();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);
  const [editingCase, setEditingCase] = useState<CPRCase | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddCase = async (data: Omit<CPRCase, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    try {
      await addCase(data);
      toast.success('Case saved successfully!');
    } catch (error) {
      toast.error('Failed to save case');
      console.error(error);
    }
  };

  const handleUpdateCase = async (id: string, data: Omit<CPRCase, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    try {
      await updateCase(id, data);
      toast.success('Case updated successfully!');
      setEditingCase(null);
    } catch (error) {
      toast.error('Failed to update case');
      console.error(error);
    }
  };

  const handleDeleteCase = async (id: string) => {
    try {
      await removeCase(id);
      toast.success('Case deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete case');
      console.error(error);
    }
  };

  const handleExport = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error('Please select month and year to export');
      return;
    }

    try {
      setIsExporting(true);
      const blob = await exportToExcel(selectedMonth, selectedYear, '', '');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CPR_Report_${selectedMonth}_${selectedYear}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterByMonth = async (month: string, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    if (month) {
      await loadCasesByMonth(month, year);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">CPR Data Entry Form</h1>
              <p className="text-blue-100 text-sm">Hospital CPR Case Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                <Wifi size={16} />
                <span className="text-sm">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-orange-500 bg-opacity-20 px-3 py-1 rounded-full">
                <WifiOff size={16} />
                <span className="text-sm">Offline Mode</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="entry" className="flex items-center gap-2">
              <span>📝</span> New Entry
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <span>📊</span> View Cases
            </TabsTrigger>
          </TabsList>

          {/* New Entry Tab */}
          <TabsContent value="entry" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Add New CPR Case</h2>
                <p className="text-gray-600">Fill in the CPR case details step by step. All data is saved locally on your device.</p>
              </div>
              <CPRForm onSubmit={editingCase ? (data) => handleUpdateCase(editingCase.id, data) : handleAddCase} initialData={editingCase || undefined} />
            </div>
          </TabsContent>

          {/* View Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Filter Section */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4">Filter & Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => handleFilterByMonth(e.target.value, selectedYear)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Months</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => handleFilterByMonth(selectedMonth, parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleExport}
                      disabled={isExporting || cases.length === 0}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isExporting ? 'Exporting...' : 'Export to Excel'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cases List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <span className="text-4xl">⏳</span>
                  </div>
                  <p className="text-gray-600 mt-4">Loading cases...</p>
                </div>
              ) : (
                <CPRCasesList
                  cases={cases}
                  onEdit={(caseData) => {
                    setEditingCase(caseData);
                    (document.querySelector('[value="entry"]') as HTMLButtonElement)?.click();
                  }}
                  onDelete={handleDeleteCase}
                  onExport={handleExport}
                  isLoading={isExporting}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">CPR Data Entry Form • Works Offline • All data saved locally</p>
          <p className="text-xs text-gray-500 mt-2">Version 1.0 • Hospital CPR Management System</p>
        </div>
      </footer>
    </div>
  );
}
