import React, { useState, forwardRef } from 'react';
import { StudentData, CardOrientation } from '../../types';
import { IDCardFront } from './IDCardFront';
import { IDCardBack } from './IDCardBack';
import { RotateCw, ShieldCheck } from 'lucide-react';

interface IDCardPreviewProps {
  student: StudentData;
  orientation: CardOrientation;
  isFlipped?: boolean;
  onFlipToggle?: () => void;
  template?: any;
  theme?: any;
  fontStyle?: any;
  collegeLogo?: string;
  signatureText?: string;
  verificationCode?: string;
  status?: string;
}

export const IDCardPreview = forwardRef<HTMLDivElement, IDCardPreviewProps>(
  (
    {
      student,
      orientation,
      isFlipped: controlledFlipped,
      onFlipToggle: controlledToggle,
    },
    ref
  ) => {
    const [localFlipped, setLocalFlipped] = useState(false);

    const isFlipped = controlledFlipped !== undefined ? controlledFlipped : localFlipped;
    const handleFlip = () => {
      if (controlledToggle) {
        controlledToggle();
      } else {
        setLocalFlipped(!localFlipped);
      }
    };

    // Card dimensions: Front is horizontal for Day Scholar, vertical for Hosteler. Back is always horizontal.
    const isCurrentlyHorizontal = isFlipped || orientation === 'horizontal';
    const cardWidth = isCurrentlyHorizontal ? 500 : 320;
    const cardHeight = isCurrentlyHorizontal ? 315 : 500;

    return (
      <div className="flex flex-col items-center w-full">
        {/* Top Control Bar for Preview */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isFlipped ? 'Card Reverse (Back Side)' : 'Card Obverse (Front Side)'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Official Template
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Front / Back Toggle Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => isFlipped && handleFlip()}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  !isFlipped
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Front View
              </button>
              <button
                type="button"
                onClick={() => !isFlipped && handleFlip()}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  isFlipped
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Back View
              </button>
            </div>

            {/* Quick Flip icon button */}
            <button
              type="button"
              onClick={handleFlip}
              title="Flip Card View"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Card Stage - Flat render without 3D backface culling issues for flawless exports */}
        <div
          className="relative py-4 flex items-center justify-center w-full"
          style={{ minHeight: `${Math.max(cardHeight + 20, 340)}px` }}
        >
          {/* Active Visible Card Container */}
          <div
            id="id-card-print-target"
            ref={ref}
            className="cursor-pointer transition-all duration-300"
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
            }}
            onClick={handleFlip}
          >
            {!isFlipped ? (
              <div id="id-card-front-target" className="w-full h-full">
                <IDCardFront student={student} orientation={orientation} />
              </div>
            ) : (
              <div id="id-card-back-target" className="w-full h-full">
                <IDCardBack student={student} />
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Always-Available Offscreen Export Targets for Instant Capture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '0',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <div
            id="id-card-front-export-source"
            style={{
              width: `${orientation === 'horizontal' ? 500 : 320}px`,
              height: `${orientation === 'horizontal' ? 315 : 500}px`,
            }}
          >
            <IDCardFront student={student} orientation={orientation} />
          </div>

          <div
            id="id-card-back-export-source"
            style={{
              width: '500px',
              height: '315px',
            }}
          >
            <IDCardBack student={student} />
          </div>
        </div>

        {/* Interactive Flip Hint */}
        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-red-600" />
          <span>Click on the card or use Front/Back View buttons to flip views</span>
        </p>
      </div>
    );
  }
);
