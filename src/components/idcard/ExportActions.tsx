import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FileText, CheckCircle, Loader2, Layers } from 'lucide-react';

interface ExportActionsProps {
  cardTargetId?: string;
  studentName?: string;
  rollNumber?: string;
  isFlipped?: boolean;
  onFlipToggle?: () => void;
  onSaveToVault?: () => Promise<void>;
  isSaving?: boolean;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  studentName = 'Student',
  rollNumber = 'ID',
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const safeFilename = `${(studentName || 'Vignan_Student').trim().replace(/\s+/g, '_')}_${(rollNumber || 'ID').trim().replace(/[^a-zA-Z0-9]/g, '')}`;

  const captureSource = async (targetId: string): Promise<{ dataUrl: string; width: number; height: number }> => {
    let el = document.getElementById(targetId);
    if (!el) {
      el = document.getElementById('id-card-print-target');
    }
    if (!el) {
      throw new Error(`Element ${targetId} not found in DOM`);
    }

    const dataUrl = await toPng(el, {
      pixelRatio: 3,
      cacheBust: true,
      quality: 0.98,
    });

    return {
      dataUrl,
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  };

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Download Both Sides as PNGs (Front & Back sequentially)
  const handleDownloadBothPNG = async () => {
    setLoadingAction('both-png');
    try {
      const front = await captureSource('id-card-front-export-source');
      triggerDownload(front.dataUrl, `${safeFilename}_Front.png`);

      await new Promise((res) => setTimeout(res, 350));

      const back = await captureSource('id-card-back-export-source');
      triggerDownload(back.dataUrl, `${safeFilename}_Back.png`);

      setExportSuccess('Both Front & Back PNGs downloaded directly!');
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err: any) {
      console.error('Both PNG export failed:', err);
      alert('Could not download both PNGs. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Download Complete PDF (Page 1 = Front Side, Page 2 = Back Side)
  const handleDownloadPDF = async () => {
    setLoadingAction('pdf');
    try {
      const front = await captureSource('id-card-front-export-source');
      const back = await captureSource('id-card-back-export-source');

      const isFrontLandscape = front.width >= front.height;
      const pdf = new jsPDF({
        orientation: isFrontLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isFrontLandscape ? [85.6, 54] : [54, 85.6],
      });

      // Page 1: Front View
      const fWidth = isFrontLandscape ? 85.6 : 54;
      const fHeight = isFrontLandscape ? 54 : 85.6;
      pdf.addImage(front.dataUrl, 'PNG', 0, 0, fWidth, fHeight, undefined, 'FAST');

      // Page 2: Back View (Standard CR80 landscape: 85.6mm x 54mm)
      pdf.addPage([85.6, 54], 'landscape');
      pdf.addImage(back.dataUrl, 'PNG', 0, 0, 85.6, 54, undefined, 'FAST');

      pdf.save(`${safeFilename}_Complete_IDCard.pdf`);

      setExportSuccess('Complete 2-Page ID Card PDF downloaded!');
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err: any) {
      console.error('PDF export failed:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Download ID Card
          </h4>
          <p className="text-[11px] text-slate-500">
            Generate official 300 DPI graphics for verified card production
          </p>
        </div>
        {exportSuccess && (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" /> {exportSuccess}
          </span>
        )}
      </div>

      {/* Strictly kept ONLY the requested download options: Complete PDF and Both PNGs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Complete PDF (2 Pages) */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={loadingAction !== null}
          className="py-3 px-3.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-red-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
          title="Download Front & Back together in a 2-page print-ready PDF"
        >
          {loadingAction === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-700" />
          ) : (
            <FileText className="w-4 h-4 text-red-700" />
          )}
          <span>{loadingAction === 'pdf' ? 'Generating PDF...' : 'Complete PDF (2 Pages)'}</span>
        </button>

        {/* Both Sides (PNGs) */}
        <button
          type="button"
          onClick={handleDownloadBothPNG}
          disabled={loadingAction !== null}
          className="py-3 px-3.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
          title="Download Front & Back PNG images with a single click"
        >
          {loadingAction === 'both-png' ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
          ) : (
            <Layers className="w-4 h-4 text-blue-700" />
          )}
          <span>{loadingAction === 'both-png' ? 'Downloading...' : 'Both Sides (PNGs)'}</span>
        </button>
      </div>
    </div>
  );
};
