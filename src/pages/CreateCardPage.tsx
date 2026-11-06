import React, { useState, useEffect, useRef } from 'react';
import { StudentData, CardTemplate, CardOrientation, CardTheme, FontStyleOption, IDCardRecord } from '../types';
import { StudentForm } from '../components/form/StudentForm';
import { IDCardPreview } from '../components/idcard/IDCardPreview';
import { TemplateSelector } from '../components/idcard/TemplateSelector';
import { ExportActions } from '../components/idcard/ExportActions';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface CreateCardPageProps {
  onNavigate: (tab: string) => void;
  initialCardData?: IDCardRecord | null;
}

const defaultStudentData: StudentData = {
  name: 'Maya Lin',
  rollNumber: 'CS-2024-0482',
  email: 'maya.lin@stanford.edu',
  phone: '+1 (555) 234-8901',
  dateOfBirth: '2004-06-15',
  gender: 'Female',
  photograph: '/src/assets/images/student_portrait_avatar_1793772629050.jpg',
  collegeName: 'Stanford Institute of Technology',
  department: 'Computer Science & Engineering',
  course: 'B.S. in Computer Science',
  academicYear: '2025-2026',
  semester: 'Semester 4',
  admissionYear: '2024',
  graduationYear: '2028',
  bloodGroup: 'O+',
  collegeAddress: '450 Jane Stanford Way, Stanford, CA 94305',
  emergencyContact: '+1 (555) 987-6543 (Parent)',
};

export const CreateCardPage: React.FC<CreateCardPageProps> = ({ onNavigate, initialCardData }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<StudentData>(() => {
    if (initialCardData?.studentData) {
      return initialCardData.studentData as StudentData;
    }
    const saved = localStorage.getItem('campusid_form_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultStudentData;
  });

  // Customization State
  const [template, setTemplate] = useState<CardTemplate>(
    initialCardData?.template || 'classic-blue'
  );
  const [orientation, setOrientation] = useState<CardOrientation>(
    initialCardData?.cardLayout || 'vertical'
  );
  const [fontStyle, setFontStyle] = useState<FontStyleOption>(
    initialCardData?.fontStyle || 'modern'
  );
  const [collegeLogo, setCollegeLogo] = useState<string>(
    initialCardData?.collegeLogo || '/src/assets/images/university_crest_logo_1793772629151.jpg'
  );
  const [verificationCode, setVerificationCode] = useState<string>(
    initialCardData?.verificationCode || `CID-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
  );
  const [cardStatus, setCardStatus] = useState<'Draft' | 'Generated' | 'Saved'>('Generated');
  const [isFlipped, setIsFlipped] = useState(false);

  // Submission & Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-save form progress to localStorage
  useEffect(() => {
    localStorage.setItem('campusid_form_draft', JSON.stringify(formData));
  }, [formData]);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Student Name is required';
    if (!formData.rollNumber.trim()) errs.rollNumber = 'Student ID / Roll Number is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.collegeName.trim()) errs.collegeName = 'College name is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    if (!formData.course.trim()) errs.course = 'Course is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the form?')) {
      const emptyState: StudentData = {
        name: '',
        rollNumber: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Female',
        photograph: '',
        collegeName: '',
        department: '',
        course: '',
        academicYear: '2025-2026',
        semester: 'Semester 1',
        admissionYear: '2024',
        graduationYear: '2028',
        bloodGroup: 'O+',
        collegeAddress: '',
        emergencyContact: '',
      };
      setFormData(emptyState);
      localStorage.removeItem('campusid_form_draft');
      setCardStatus('Draft');
    }
  };

  const handleLoadSample = () => {
    setFormData(defaultStudentData);
    setTemplate('classic-blue');
    setOrientation('vertical');
    setCardStatus('Generated');
    setErrors({});
  };

  const handleSaveToVault = async () => {
    if (!validateForm()) {
      alert('Please correct errors in the student form before saving.');
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);

    try {
      const payload: Partial<IDCardRecord> = {
        studentData: formData,
        template,
        cardLayout: orientation,
        fontStyle,
        collegeLogo,
        verificationCode,
        status: 'Saved',
        cardValidity: `${formData.admissionYear || '2024'} – ${formData.graduationYear || '2028'}`,
      };

      const savedCard = await api.createIDCard(payload);
      setVerificationCode(savedCard.verificationCode);
      setCardStatus('Saved');
      setSuccessMessage('Identity Card successfully saved to your vault with cryptographic QR verification!');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error('Failed to save ID Card:', err);
      alert(err.message || 'Error saving ID Card. You can still export it directly as PNG or PDF!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Left Corner Back Option */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Digital College ID Card Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Fill the student data below or pick templates. Changes reflect dynamically on the live 3D card preview.
          </p>
        </div>

        {/* Status notice */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Live Auto-Sync Active</span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-emerald-700 font-bold hover:underline ml-4 whitespace-nowrap cursor-pointer"
          >
            View in Vault →
          </button>
        </div>
      )}

      {/* Main Split Grid (Form on Left, Sticky Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Template Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Template Selector & Color Customizer */}
          <TemplateSelector
            selectedTemplate={template}
            onSelectTemplate={(t) => {
              setTemplate(t);
              setCardStatus('Generated');
            }}
            orientation={orientation}
            onSelectOrientation={(o) => {
              setOrientation(o);
              setCardStatus('Generated');
            }}
            fontStyle={fontStyle}
            onSelectFontStyle={setFontStyle}
            collegeLogo={collegeLogo}
            onLogoUpload={setCollegeLogo}
          />

          {/* Student Information Form */}
          <StudentForm
            formData={formData}
            onChange={(newData) => {
              setFormData(newData);
              setCardStatus('Draft');
            }}
            orientation={orientation}
            onOrientationChange={setOrientation}
            onReset={handleReset}
            errors={errors}
          />
        </div>

        {/* Right Column: Live Sticky ID Card Preview & Export Actions (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          {/* Live Card Preview Card Container */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
            <IDCardPreview
              ref={cardRef}
              student={formData}
              template={template}
              orientation={orientation}
              fontStyle={fontStyle}
              collegeLogo={collegeLogo}
              verificationCode={verificationCode}
              status={cardStatus}
              isFlipped={isFlipped}
              onFlipToggle={() => setIsFlipped(!isFlipped)}
            />
          </div>

          {/* Export & Download Controls */}
          <ExportActions
            cardTargetId="id-card-print-target"
            studentName={formData.name || 'Student'}
            rollNumber={formData.rollNumber || 'ID'}
            isFlipped={isFlipped}
            onFlipToggle={() => setIsFlipped(!isFlipped)}
            onSaveToVault={handleSaveToVault}
            isSaving={isSaving}
          />

          {/* Quick QR Verification Link */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Simulate QR Verification Scan</span>
            </div>
            <button
              onClick={() => onNavigate(`verify:${verificationCode}`)}
              className="text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              Verify Code →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
