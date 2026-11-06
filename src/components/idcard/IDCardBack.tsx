import React from 'react';
import { StudentData } from '../../types';
import { BarcodeSVG } from './BarcodeSVG';

interface IDCardBackProps {
  student: StudentData;
}

export const IDCardBack: React.FC<IDCardBackProps> = ({ student }) => {
  const fatherName = student.fatherName ? student.fatherName.toUpperCase() : '—';
  const studentAddress = student.studentAddress || '—';
  const phoneNo = student.phone || student.emergencyContact || '—';
  const regNo = student.rollNumber ? student.rollNumber.toUpperCase() : '0000000000';

  // Back of card is always horizontal (standard landscape) as requested
  return (
    <div className="relative w-[500px] h-[315px] rounded-2xl shadow-xl overflow-hidden border border-slate-300 bg-white font-sans select-none flex flex-col justify-between">
      {/* Top Section: Student Personal & Residential Information */}
      <div className="px-6 pt-5 pb-3 text-left space-y-2 text-xs">
        {/* Father Name */}
        <div className="grid grid-cols-12 items-baseline">
          <span className="col-span-3 font-bold text-slate-900 tracking-wide">Father Name</span>
          <span className="col-span-9 font-bold text-slate-800 uppercase tracking-wide">
            {fatherName}
          </span>
        </div>

        {/* Address */}
        <div className="grid grid-cols-12 items-baseline">
          <span className="col-span-3 font-bold text-slate-900 tracking-wide">Address</span>
          <span className="col-span-9 font-bold text-slate-800 leading-snug">
            {studentAddress}
          </span>
        </div>

        {/* Phone No */}
        <div className="grid grid-cols-12 items-baseline pt-0.5">
          <span className="col-span-3 font-bold text-slate-900 tracking-wide">Phone No</span>
          <span className="col-span-9 font-bold text-slate-900 font-mono tracking-wider">
            {phoneNo}
          </span>
        </div>
      </div>

      {/* Middle Solid Black Web Ribbon */}
      <div className="w-full bg-black py-1.5 px-4 flex items-center justify-center">
        <span className="text-white font-sans text-xs tracking-wider font-medium">
          www.vignan.ac.in
        </span>
      </div>

      {/* Bottom Section: Institution Return Instructions & Barcode */}
      <div className="px-6 py-2.5 text-center flex flex-col items-center justify-between flex-1">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-slate-900">
            If Found Please return to
          </p>
          <p className="text-xs font-extrabold text-slate-900 tracking-tight">
            Vignan's Foundation For Science, Technology & Research
          </p>
          <p className="text-[10px] font-bold text-slate-700 leading-tight">
            Vadlamudi(Post), Chebrolu(MD), Guntur(Dist) - 522213, Tel: 0863-2344700
          </p>
        </div>

        {/* Authentic Linear Code-128 Barcode */}
        <div className="pt-1.5 w-full flex justify-center">
          <BarcodeSVG value={regNo} height={38} />
        </div>
      </div>
    </div>
  );
};
