import React, { useState, useEffect, useRef } from 'react';
import { StudentData, CardOrientation } from '../types';
import { StudentForm } from '../components/form/StudentForm';
import { IDCardPreview } from '../components/idcard/IDCardPreview';
import { ExportActions } from '../components/idcard/ExportActions';
import { CreditCard, Compass, Home } from 'lucide-react';

const VIGNAN_COLLEGE_NAME = "Vignan's Foundation for Science, Technology & Research";
const VIGNAN_COLLEGE_ADDRESS = "Vadlamudi(Post), Chebrolu(MD), Guntur(Dist) - 522213, Tel: 0863-2344700";

// Completely blank default student state - every student starts with empty info
const blankStudentData: StudentData = {
  name: '',
  rollNumber: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'Male',
  photograph: '',
  collegeName: VIGNAN_COLLEGE_NAME,
  department: '',
  course: '',
  section: '',
  academicYear: '',
  semester: '',
  admissionYear: '',
  graduationYear: '',
  bloodGroup: 'O+',
  collegeAddress: VIGNAN_COLLEGE_ADDRESS,
  emergencyContact: '',
  studentType: 'dayscholar',
  fatherName: '',
  studentAddress: '',
};

export const HomePage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Form State: starts with completely empty info for every student
  const [formData, setFormData] = useState<StudentData>(() => {
    const saved = localStorage.getItem('vignan_id_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved data had specific hardcoded demo names from prior builds, clear it
        if (parsed.name && parsed.name.includes('DHARAHAS')) {
          localStorage.removeItem('vignan_id_draft');
          return blankStudentData;
        }
        return {
          ...blankStudentData,
          ...parsed,
          collegeName: VIGNAN_COLLEGE_NAME,
          collegeAddress: VIGNAN_COLLEGE_ADDRESS,
        };
      } catch {}
    }
    return blankStudentData;
  });

  const [orientation, setOrientation] = useState<CardOrientation>(() => {
    return formData.studentType === 'hostler' ? 'vertical' : 'horizontal';
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save draft in localStorage
  useEffect(() => {
    localStorage.setItem('vignan_id_draft', JSON.stringify(formData));
  }, [formData]);

  const handleOrientationChange = (newOrientation: CardOrientation) => {
    setOrientation(newOrientation);
  };

  // Clear Option: resets all filled details to completely empty
  const handleResetForm = () => {
    setFormData(blankStudentData);
    setOrientation('horizontal');
    localStorage.removeItem('vignan_id_draft');
    setErrors({});
  };

  const isDayScholar = (formData.studentType || 'dayscholar') === 'dayscholar';

  return (
    <>
      {/* =========================================================================
          1. MAIN SCREEN WORKSPACE (HIDDEN ON PRINT)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 no-print print:hidden">
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Vignan ID Card Generator
          </h1>
          <p className="text-sm text-slate-600">
            Upload your photo, enter your details, and select{' '}
            <strong className="text-red-700">Day Scholar (Horizontal)</strong> or{' '}
            <strong className="text-blue-900">Hosteler (Vertical)</strong> to generate your official ID card.
          </p>
        </div>

        {/* Main 2-Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-6 space-y-6">
            <StudentForm
              formData={formData}
              onChange={(newData) => {
                setFormData(newData);
                if (newData.studentType === 'hostler' && orientation !== 'vertical') {
                  setOrientation('vertical');
                } else if (newData.studentType === 'dayscholar' && orientation !== 'horizontal') {
                  setOrientation('horizontal');
                }
              }}
              orientation={orientation}
              onOrientationChange={handleOrientationChange}
              onReset={handleResetForm}
              errors={errors}
            />
          </div>

          {/* Right Column: Live Card Stage & Export Actions */}
          <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-5">
            {/* Live Card Preview Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col items-center">
              {/* Header info bar */}
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Live ID Card Preview
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isDayScholar
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {isDayScholar ? (
                      <>
                        <Compass className="w-3 h-3" /> Day Scholar (Horizontal)
                      </>
                    ) : (
                      <>
                        <Home className="w-3 h-3" /> Hosteler (Vertical Front)
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* ID Card Component */}
              <IDCardPreview
                ref={cardRef}
                student={formData}
                orientation={orientation}
                isFlipped={isFlipped}
                onFlipToggle={() => setIsFlipped(!isFlipped)}
              />
            </div>

            {/* Export Actions: Complete PDF (2 Pages) & Both PNGs */}
            <ExportActions
              studentName={formData.name || 'Vignan_Student'}
              rollNumber={formData.rollNumber || 'ID'}
              isFlipped={isFlipped}
              onFlipToggle={() => setIsFlipped(!isFlipped)}
            />

            {/* Helper Note */}
            <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span>Standard Physical CR80 Dimensions</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                85.6mm × 54mm (300 DPI)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
