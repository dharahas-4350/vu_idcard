import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/LOGO_d66eb575.jpg"
            alt="Vignan University"
            className="h-5 w-auto object-contain"
          />
          <span className="font-semibold text-slate-800">Vignan ID Card Generator</span>
          <span className="text-slate-400">·</span>
          <span>Day Scholar (Horizontal) & Hosteler (Vertical) ID Cards</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Standard Physical Match (CR80 ID-1)
          </span>
          <span>·</span>
          <span>Vadlamudi, Guntur - 522213</span>
        </div>
      </div>
    </footer>
  );
};
