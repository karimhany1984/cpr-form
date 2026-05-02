import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    hospitalName: initialData?.hospitalName || '',
    governorate: initialData?.governorate || '',
    month: initialData?.month || '',
    year: initialData?.year || new Date().getFullYear(),
    
    // Patient Data
    patientName: initialData?.patientName || '',
    medicalId: initialData?.medicalId || '',
    
    // Admission Data
    admissionDate: initialData?.admissionDate || '',
    diagnosis: initialData?.diagnosis || '',
    department: initialData?.department || '',
    
    // Code Blue Response
    cardiacArrestDate: initialData?.cardiacArrestDate || '',
    cardiacArrestLocation: initialData?.cardiacArrestLocation || '',
    codeBlueAnnouncementTime: initialData?.codeBlueAnnouncementTime || '',
    cprStartTime: initialData?.cprStartTime || '',
    codeBlueTeamArrivalTime: initialData?.codeBlueTeamArrivalTime || '',
    responseTime: initialData?.responseTime || '',
    
    // CPR Quality
    cprCycles: initialData?.cprCycles || 0,
    defibrillationUsed: initialData?.defibrillationUsed || false,
    cprEndTime: initialData?.cprEndTime || '',
    totalResuscitationTime: initialData?.totalResuscitationTime || '',
    resuscitationOutcome: initialData?.resuscitationOutcome || 'success',
    
    // Documentation
    cprFormExists: initialData?.cprFormExists || false,
    cprFormComplete: initialData?.cprFormComplete || false,
    
    // Discharge Data
    dischargeDate: initialData?.dischargeDate || '',
    dischargeStatus: initialData?.dischargeStatus || '',
    
    // Death Cases
    deathBefore24Hours: initialData?.deathBefore24Hours || false,
    deathAfter24Hours: initialData?.deathAfter24Hours || false,
  });

  const [activeStep, setActiveStep] = useState<'meta' | 'patient' | 'admission' | 'codeblue' | 'cpr' | 'documentation' | 'discharge'>('meta');
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
    { id: 'meta', label: 'Hospital Info', icon: '🏥' },
    { id: 'patient', label: 'Patient Data', icon: '👤' },
    { id: 'admission', label: 'Admission', icon: '📋' },
    { id: 'codeblue', label: 'Code Blue', icon: '🚨' },
    { id: 'cpr', label: 'CPR Details', icon: '❤️' },
    { id: 'documentation', label: 'Documentation', icon: '📄' },
    { id: 'discharge', label: 'Discharge', icon: '✓' },
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

      {/* Hospital Info Step */}
      {activeStep === 'meta' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>🏥</span> Hospital Information
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

      {/* Patient Data Step */}
      {activeStep === 'patient' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>👤</span> Patient Information
          </h2>
          <FormField label="Full Patient Name" error={errors.patientName}>
            <Input
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              placeholder="Enter full name"
            />
          </FormField>
          <FormField label="Medical ID" error={errors.medicalId}>
            <Input
              value={formData.medicalId}
              onChange={(e) => handleInputChange('medicalId', e.target.value)}
              placeholder="Enter medical ID"
            />
          </FormField>
        </div>
      )}

      {/* Admission Data Step */}
      {activeStep === 'admission' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>📋</span> Admission Data
          </h2>
          <FormField label="Admission Date" error={errors.admissionDate}>
            <Input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleInputChange('admissionDate', e.target.value)}
            />
          </FormField>
          <FormField label="Diagnosis">
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              placeholder="Enter diagnosis"
              rows={3}
            />
          </FormField>
          <FormField label="Department">
            <Input
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Enter department"
            />
          </FormField>
        </div>
      )}

      {/* Code Blue Response Step */}
      {activeStep === 'codeblue' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>🚨</span> Code Blue Response
          </h2>
          <FormField label="Cardiac Arrest Date" error={errors.cardiacArrestDate}>
            <Input
              type="date"
              value={formData.cardiacArrestDate}
              onChange={(e) => handleInputChange('cardiacArrestDate', e.target.value)}
            />
          </FormField>
          <FormField label="Cardiac Arrest Location">
            <Input
              value={formData.cardiacArrestLocation}
              onChange={(e) => handleInputChange('cardiacArrestLocation', e.target.value)}
              placeholder="Enter location/department"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Code Blue Announcement Time">
              <Input
                type="time"
                value={formData.codeBlueAnnouncementTime}
                onChange={(e) => handleInputChange('codeBlueAnnouncementTime', e.target.value)}
              />
            </FormField>
            <FormField label="CPR Start Time">
              <Input
                type="time"
                value={formData.cprStartTime}
                onChange={(e) => handleInputChange('cprStartTime', e.target.value)}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Code Blue Team Arrival Time">
              <Input
                type="time"
                value={formData.codeBlueTeamArrivalTime}
                onChange={(e) => handleInputChange('codeBlueTeamArrivalTime', e.target.value)}
              />
            </FormField>
            <FormField label="Response Time (minutes)">
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

      {/* CPR Details Step */}
      {activeStep === 'cpr' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>❤️</span> CPR Details
          </h2>
          <FormField label="Number of CPR Cycles">
            <Input
              type="number"
              value={formData.cprCycles}
              onChange={(e) => handleInputChange('cprCycles', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </FormField>
          <FormField label="Defibrillation Used">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.defibrillationUsed}
                onCheckedChange={(checked) => handleInputChange('defibrillationUsed', checked)}
              />
              <span className="text-sm">Yes, defibrillation was used</span>
            </div>
          </FormField>
          <FormField label="CPR End Time">
            <Input
              type="time"
              value={formData.cprEndTime}
              onChange={(e) => handleInputChange('cprEndTime', e.target.value)}
            />
          </FormField>
          <FormField label="Total Resuscitation Time (minutes)">
            <Input
              type="number"
              value={formData.totalResuscitationTime}
              onChange={(e) => handleInputChange('totalResuscitationTime', e.target.value)}
              placeholder="0"
            />
          </FormField>
          <FormField label="Resuscitation Outcome">
            <Select value={formData.resuscitationOutcome} onValueChange={(value) => handleInputChange('resuscitationOutcome', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success (نجاة)</SelectItem>
                <SelectItem value="failure">Failure (وفاة)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      )}

      {/* Documentation Step */}
      {activeStep === 'documentation' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>📄</span> Documentation
          </h2>
          <FormField label="CPR Form Exists">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.cprFormExists}
                onCheckedChange={(checked) => handleInputChange('cprFormExists', checked)}
              />
              <span className="text-sm">CPR documentation form exists</span>
            </div>
          </FormField>
          <FormField label="CPR Form Complete">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.cprFormComplete}
                onCheckedChange={(checked) => handleInputChange('cprFormComplete', checked)}
              />
              <span className="text-sm">All data fields are complete</span>
            </div>
          </FormField>
        </div>
      )}

      {/* Discharge Step */}
      {activeStep === 'discharge' && (
        <div className="workflow-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>✓</span> Discharge & Outcomes
          </h2>
          <FormField label="Discharge Date">
            <Input
              type="date"
              value={formData.dischargeDate}
              onChange={(e) => handleInputChange('dischargeDate', e.target.value)}
            />
          </FormField>
          <FormField label="Discharge Status">
            <Input
              value={formData.dischargeStatus}
              onChange={(e) => handleInputChange('dischargeStatus', e.target.value)}
              placeholder="Enter discharge status"
            />
          </FormField>
          <FormField label="Death Before 24 Hours">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.deathBefore24Hours}
                onCheckedChange={(checked) => handleInputChange('deathBefore24Hours', checked)}
              />
              <span className="text-sm">Patient died before 24 hours</span>
            </div>
          </FormField>
          <FormField label="Death After 24 Hours">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.deathAfter24Hours}
                onCheckedChange={(checked) => handleInputChange('deathAfter24Hours', checked)}
              />
              <span className="text-sm">Patient died after 24 hours</span>
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
