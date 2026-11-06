import React, { useRef, useState } from 'react';
import { StudentData, CardOrientation } from '../../types';
import {
  User,
  Upload,
  RotateCcw,
  Trash2,
  Building,
  Compass,
  Home,
  Check,
  Crop,
} from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface StudentFormProps {
  formData: StudentData;
  onChange: (data: StudentData) => void;
  orientation: CardOrientation;
  onOrientationChange: (orientation: CardOrientation) => void;
  onReset: () => void;
  errors?: Record<string, string>;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  onChange,
  orientation,
  onOrientationChange,
  onReset,
  errors = {},
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof StudentData, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handlePhoneChange = (rawVal: string) => {
    // Keep only numeric digits (allow user to type or paste with +91, dashes, or spaces)
    let digits = rawVal.replace(/\D/g, '');
    // If pasted with India country code 91 and has 12 digits, strip leading 91
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    }
    // Limit to exactly 10 digits
    digits = digits.slice(0, 10);

    onChange({
      ...formData,
      phone: digits,
      emergencyContact: digits,
    });
  };

  const handleSelectStudentType = (type: 'dayscholar' | 'hostler') => {
    // Dayscholar -> Horizontal card; Hosteler -> Vertical front card
    const newOrientation: CardOrientation = type === 'dayscholar' ? 'horizontal' : 'vertical';
    onOrientationChange(newOrientation);
    onChange({
      ...formData,
      studentType: type,
    });
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImageForCrop(reader.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const clearPhoto = () => {
    handleChange('photograph', '');
    setRawImageForCrop('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isDayScholar = (formData.studentType || 'dayscholar') === 'dayscholar';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header with Clear Details Button */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Student Details Entry</h2>
          <p className="text-xs text-slate-500">Institution info pre-filled; enter student details below</p>
        </div>

        <div>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Clear all filled student details"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Details</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* STEP 1: UPLOAD PHOTO & CROP */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>1. Upload Student Photo (Cropped to Passport Size)</span>
              <span className="text-red-500">*</span>
            </label>
            {formData.photograph && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Photo Attached (4:5 Ratio)
              </span>
            )}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
              dragActive
                ? 'border-red-500 bg-red-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            {/* Photo Preview Frame */}
            <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-white border border-slate-300 shadow-xs flex items-center justify-center shrink-0">
              {formData.photograph ? (
                <img
                  src={formData.photograph}
                  alt="Student Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <User className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] font-medium block">No Photo</span>
                </div>
              )}
            </div>

            {/* Upload Action */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-xs text-slate-600">
                Drag & drop student color passport photograph here, or browse.
              </p>
              <p className="text-[11px] text-slate-500">Auto-crops to exact 4:5 ID card passport dimensions</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.photograph ? 'Change Photo' : 'Choose Photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {formData.photograph && (
                  <button
                    type="button"
                    onClick={() => {
                      setRawImageForCrop(formData.photograph);
                      setCropModalOpen(true);
                    }}
                    className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    title="Adjust crop or zoom"
                  >
                    <Crop className="w-3.5 h-3.5 text-slate-500" />
                    <span>Crop / Adjust</span>
                  </button>
                )}

                {formData.photograph && (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: SELECT DAY SCHOLAR OR HOSTELER */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>2. Select Category & Card Layout</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-semibold text-slate-600">
              {isDayScholar ? 'Horizontal Card (Landscape)' : 'Vertical Front (Portrait)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Day Scholar Button */}
            <button
              type="button"
              onClick={() => handleSelectStudentType('dayscholar')}
              className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                isDayScholar
                  ? 'border-red-600 bg-red-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isDayScholar ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">Day Scholar</span>
                  {isDayScholar && (
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Horizontal Layout (Exact official card format)
                </p>
              </div>
            </button>

            {/* Hosteler Button */}
            <button
              type="button"
              onClick={() => handleSelectStudentType('hostler')}
              className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                !isDayScholar
                  ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  !isDayScholar ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">Hosteler</span>
                  {!isDayScholar && (
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vertical Front Layout + Horizontal Back
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 3: FILL STUDENT DETAILS (BLANK BY DEFAULT) */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            3. Fill Student Information (Card Front)
          </label>

          {/* Student Name & Registration Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter student full name"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration / Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => handleChange('rollNumber', e.target.value)}
                placeholder="Enter registration / roll number"
                className={`w-full px-3 py-2 text-sm font-mono font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  errors.rollNumber ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.rollNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.rollNumber}</p>
              )}
            </div>
          </div>

          {/* Branch / Course & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course / Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                placeholder="e.g. B.TECH CSE"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section
              </label>
              <input
                type="text"
                value={formData.section || ''}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="e.g. 01, 15 (renders as Sec - 15)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Academic Batch Years */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Batch / Years <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => handleChange('academicYear', e.target.value)}
              placeholder="e.g. 2024 - 2028"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Card Back Information Section */}
          <div className="pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
              4. Fill Parent & Address Details (Card Back)
            </label>

            <div className="space-y-4">
              {/* Father Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Father Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName || ''}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  placeholder="Enter father's full name"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Student Permanent Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Residential Address
                </label>
                <textarea
                  rows={2}
                  value={formData.studentAddress || ''}
                  onChange={(e) => handleChange('studentAddress', e.target.value)}
                  placeholder="Enter permanent house address, village/city, district, and pincode"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                />
              </div>

              {/* Contact Phone Number (10 Digits) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Contact Phone Number (10 Digits)
                  </label>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      (formData.phone || '').length === 10
                        ? 'text-emerald-600 font-bold'
                        : (formData.phone || '').length > 0
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {(formData.phone || '').length}/10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={formData.phone || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 ${
                    (formData.phone || '').length === 10
                      ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/20 text-slate-900 font-bold'
                      : (formData.phone || '').length > 0
                      ? 'border-amber-300 focus:ring-amber-500'
                      : 'border-slate-200 focus:ring-red-600'
                  }`}
                />
                {(formData.phone || '').length > 0 && (formData.phone || '').length < 10 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Please enter full 10-digit mobile number ({10 - (formData.phone || '').length} digits left)
                  </p>
                )}
                {(formData.phone || '').length === 10 && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Valid 10-digit mobile number
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pre-filled Institutional Details (Default) */}
          <div className="pt-3 border-t border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Default Institution Information (Pre-filled)</span>
            </label>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 shrink-0">Institution:</span>
                <span className="font-medium text-slate-900">{formData.collegeName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 shrink-0">Campus Address:</span>
                <span className="text-slate-700">{formData.collegeAddress}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 shrink-0">Official Website:</span>
                <span className="text-red-700 font-mono font-semibold">www.vignan.ac.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Crop & Alignment Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={rawImageForCrop || formData.photograph}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={(croppedDataUrl) => {
          handleChange('photograph', croppedDataUrl);
          setCropModalOpen(false);
        }}
      />
    </div>
  );
};
