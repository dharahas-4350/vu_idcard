import React from 'react';
import { RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Wordmark & University Crest */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/LOGO_d66eb575.jpg"
              alt="Vignan University Crest"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                Vignan ID Card Generator
              </span>
              <span className="text-[10px] tracking-wider font-semibold text-red-600 uppercase mt-0.5">
                VFSTR • Official Student ID Portal
              </span>
            </div>
          </div>

          {/* Quick Clear Action */}
          <div className="flex items-center gap-2">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Clear all student details"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Form</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
