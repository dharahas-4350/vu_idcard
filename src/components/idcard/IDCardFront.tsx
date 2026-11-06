import React from 'react';
import { StudentData, CardOrientation } from '../../types';

interface IDCardFrontProps {
  student: StudentData;
  orientation?: CardOrientation;
}

export const IDCardFront: React.FC<IDCardFrontProps> = ({
  student,
  orientation = 'horizontal',
}) => {
  const isHostler = student.studentType === 'hostler' || orientation === 'vertical';

  // Format student details from inputs, with clean neutral fallbacks for display
  const studentName = student.name ? student.name.toUpperCase() : 'STUDENT FULL NAME';
  const regNo = student.rollNumber ? student.rollNumber.toUpperCase() : 'REGISTRATION NO';
  const courseStr = student.course ? student.course.toUpperCase() : 'COURSE / BRANCH';
  const sectionStr = student.section ? `Sec - ${student.section}` : '';
  const batchStr = student.academicYear || 'BATCH YEARS';

  // Photo: empty until uploaded
  const photoSrc = student.photograph || '';

  // ==========================================
  // 1. DAY SCHOLAR (HORIZONTAL / LANDSCAPE)
  // EXACT REPLICA OF USER REFERENCE IMAGE
  // ==========================================
  if (!isHostler) {
    return (
      <div className="relative w-[500px] h-[315px] rounded-2xl shadow-xl overflow-hidden border border-slate-300 bg-white font-sans select-none flex flex-col justify-between">
        {/* Semi-transparent watermark seal in bottom right corner */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 opacity-20 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 fill-current">
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" />
            <polygon points="50,15 61,38 85,38 66,54 73,78 50,63 27,78 34,54 15,38 39,38" fill="currentColor" opacity="0.8" />
            <circle cx="50" cy="50" r="16" fill="white" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
          </svg>
        </div>

        {/* Top Header with Vignan Logo */}
        <div className="pt-3 px-6 pb-2 text-center flex flex-col items-center">
          <img
            src="/assets/aistudio/LOGO_d66eb575.jpg"
            alt="Vignan's Foundation for Science, Technology & Research"
            className="h-14 w-auto object-contain max-w-[440px]"
          />
        </div>

        {/* Blue Divider Line */}
        <div className="h-[2px] bg-[#1a4480] w-full" />

        {/* Main Card Body */}
        <div className="flex-1 px-6 py-3 flex items-center relative z-10 gap-5">
          {/* Photo & Vertical "STUDENT" Text */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Student Portrait Box */}
            <div className="w-[124px] h-[155px] border border-slate-400 bg-slate-100 overflow-hidden shadow-xs flex items-center justify-center">
              {student.photograph ? (
                <img
                  src={photoSrc}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                  <span className="text-[10px] uppercase font-semibold">Upload Photo</span>
                </div>
              )}
            </div>

            {/* Vertical "STUDENT" word running along the photo edge */}
            <div className="flex flex-col justify-between h-[150px] text-slate-700 font-bold text-xs tracking-widest select-none py-1">
              <span>S</span>
              <span>T</span>
              <span>U</span>
              <span>D</span>
              <span>E</span>
              <span>N</span>
              <span>T</span>
            </div>
          </div>

          {/* Details on Right */}
          <div className="flex-1 flex flex-col justify-between h-[155px] py-1 text-left">
            <div className="space-y-2">
              {/* Full Name */}
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight tracking-wide font-sans">
                {studentName}
              </h2>

              {/* Registration Number */}
              <p className="text-xl font-extrabold text-slate-900 font-sans tracking-wider">
                {regNo}
              </p>

              {/* Course & Section */}
              <p className="text-sm font-bold text-slate-800 tracking-wide">
                {courseStr} &nbsp; {sectionStr}
              </p>

              {/* Batch Years */}
              <p className="text-sm font-bold text-slate-800 tracking-wide">
                {batchStr}
              </p>
            </div>

            {/* Bottom Right: Registrar Signature & Title */}
            <div className="self-end text-center mr-2">
              <div className="font-serif italic text-base text-slate-800 leading-none select-none tracking-wide -rotate-6">
                K. S. Rao
              </div>
              <div className="border-t border-slate-600 mt-0.5 pt-0.5">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                  Registrar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle baseline */}
        <div className="h-1 bg-slate-100 w-full" />
      </div>
    );
  }

  // ==========================================
  // 2. HOSTELER (VERTICAL / PORTRAIT FRONT)
  // ==========================================
  return (
    <div className="relative w-[320px] h-[500px] rounded-2xl shadow-xl overflow-hidden border border-slate-300 bg-white font-sans select-none flex flex-col justify-between">
      {/* Semi-transparent watermark seal */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 opacity-20 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 fill-current">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" />
          <polygon points="50,15 61,38 85,38 66,54 73,78 50,63 27,78 34,54 15,38 39,38" fill="currentColor" opacity="0.8" />
          <circle cx="50" cy="50" r="16" fill="white" />
          <circle cx="50" cy="50" r="10" fill="currentColor" />
        </svg>
      </div>

      {/* Top Header Logo */}
      <div className="pt-3 px-3 pb-2 text-center flex flex-col items-center">
        <img
          src="/assets/aistudio/LOGO_d66eb575.jpg"
          alt="Vignan University"
          className="h-12 w-auto object-contain max-w-[280px]"
        />
        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-blue-900 text-white text-[9px] font-bold uppercase tracking-wider">
          Hosteler Residential Pass
        </div>
      </div>

      {/* Blue Divider Line */}
      <div className="h-[2px] bg-[#1a4480] w-full" />

      {/* Center Content */}
      <div className="px-4 py-3 flex-1 flex flex-col items-center justify-between relative z-10">
        {/* Photo with vertical STUDENT badge */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-[110px] h-[135px] border border-slate-400 bg-slate-100 overflow-hidden shadow-xs flex items-center justify-center">
            {student.photograph ? (
              <img
                src={photoSrc}
                alt={studentName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <span className="text-[10px] uppercase font-semibold">Upload Photo</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between h-[130px] text-slate-700 font-bold text-[10px] tracking-widest select-none py-1">
            <span>S</span>
            <span>T</span>
            <span>U</span>
            <span>D</span>
            <span>E</span>
            <span>N</span>
            <span>T</span>
          </div>
        </div>

        {/* Student Details */}
        <div className="text-center w-full px-2 space-y-1.5 mt-2">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight tracking-wide font-sans">
            {studentName}
          </h2>
          <p className="text-lg font-extrabold text-slate-900 font-sans tracking-wider">
            {regNo}
          </p>
          <p className="text-xs font-bold text-slate-800 tracking-wide">
            {courseStr} &nbsp; {sectionStr}
          </p>
          <p className="text-xs font-bold text-slate-800 tracking-wide">
            {batchStr}
          </p>
        </div>

        {/* Registrar Signature */}
        <div className="self-end text-center mr-4 mt-2">
          <div className="font-serif italic text-sm text-slate-800 leading-none select-none tracking-wide -rotate-6">
            K. S. Rao
          </div>
          <div className="border-t border-slate-600 mt-0.5 pt-0.5">
            <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider block">
              Registrar
            </span>
          </div>
        </div>
      </div>

      {/* Bottom baseline */}
      <div className="h-1 bg-slate-100 w-full" />
    </div>
  );
};
