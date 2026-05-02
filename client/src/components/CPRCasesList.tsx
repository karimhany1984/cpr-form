import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CPRCase } from '@/lib/db';
import { Trash2, Edit2, Download } from 'lucide-react';

interface CPRCasesListProps {
  cases: CPRCase[];
  onEdit: (caseData: CPRCase) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  isLoading?: boolean;
}

export function CPRCasesList({ cases, onEdit, onDelete, onExport, isLoading = false }: CPRCasesListProps) {
  if (cases.length === 0) {
    return (
      <div className="workflow-card p-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No cases recorded yet</h3>
        <p className="text-gray-500">Start by adding a new CPR case to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">Recorded Cases ({cases.length})</h2>
        <Button onClick={onExport} disabled={isLoading} className="flex items-center gap-2">
          <Download size={18} />
          Export to Excel
        </Button>
      </div>

      <div className="grid gap-4">
        {cases.map((cprCase) => (
          <Card key={cprCase.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Patient Name</p>
                <p className="font-semibold text-gray-900">{cprCase.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Medical ID</p>
                <p className="font-mono text-gray-700">{cprCase.medicalId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Outcome</p>
                <p className={`font-semibold ${
                  cprCase.resuscitationOutcome === 'success' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {cprCase.resuscitationOutcome === 'success' ? '✓ نجاة' : '✗ وفاة'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                <p className="text-gray-700">{cprCase.admissionDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-blue-600 font-semibold">CPR Cycles</p>
                <p className="text-lg font-bold text-blue-900">{cprCase.cprCycles}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <p className="text-xs text-orange-600 font-semibold">Response Time</p>
                <p className="text-lg font-bold text-orange-900">{cprCase.responseTime} min</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-green-600 font-semibold">Total Duration</p>
                <p className="text-lg font-bold text-green-900">{cprCase.totalResuscitationTime} min</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cprCase)}
                className="flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this case?')) {
                    onDelete(cprCase.id);
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
