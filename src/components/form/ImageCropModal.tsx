import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Check, X, Move, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  // Normalized zoom factor: 1.0 means the image fills the crop box completely (cover)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imageReady, setImageReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  // Target ID card passport photo dimensions (Standard 4:5 ratio: 240px x 300px on screen)
  const CROP_WIDTH = 240;
  const CROP_HEIGHT = 300;

  // Whenever the modal opens or the source changes, pre-calculate dimensions reliably
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      setImageReady(false);
      return;
    }

    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsProcessing(false);

    // Create an in-memory image loader to guarantee getting width/height without relying on DOM lifecycle
    const preloader = new Image();
    preloader.crossOrigin = 'anonymous';

    preloader.onload = () => {
      const nw = preloader.naturalWidth || preloader.width || 400;
      const nh = preloader.naturalHeight || preloader.height || 500;
      setNaturalSize({ width: nw, height: nh });
      setImageReady(true);
    };

    preloader.onerror = () => {
      console.warn('Preloader failed, falling back to default dimensions');
      setNaturalSize({ width: 400, height: 500 });
      setImageReady(true);
    };

    preloader.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Base scale calculation: ensures the image fills the entire 240x300 frame without black bars
  const baseScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? Math.max(CROP_WIDTH / naturalSize.width, CROP_HEIGHT / naturalSize.height)
      : 1;

  const currentScale = baseScale * zoom;

  // Pointer event handlers with pointer capture (smooth dragging on mouse, trackpad, and touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Generate cropped output on a high-resolution 480x600 canvas (exact 4:5 ratio)
  const handleApplyCrop = () => {
    if (!imageSrc) {
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const nw = (img && img.naturalWidth) || naturalSize.width || 400;
      const nh = (img && img.naturalHeight) || naturalSize.height || 500;

      // High-resolution canvas output (480px x 600px, 4:5 passport ratio)
      const OUTPUT_WIDTH = 480;
      const OUTPUT_HEIGHT = 600;

      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_WIDTH;
      canvas.height = OUTPUT_HEIGHT;
      const ctx = canvas.getContext('2d');

      if (!ctx || !img) {
        // Safe fallback if canvas context is unavailable
        onCropComplete(imageSrc);
        onClose();
        return;
      }

      // Smooth image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Scale multiplier from on-screen 240x300 preview to 480x600 high-res output
      const scaleToOutput = OUTPUT_WIDTH / CROP_WIDTH; // 2.0

      ctx.save();
      ctx.scale(scaleToOutput, scaleToOutput);

      // Translate to center of crop box, then add user pan offset
      ctx.translate(CROP_WIDTH / 2 + pan.x, CROP_HEIGHT / 2 + pan.y);

      // Apply the exact total scale that the user sees on screen
      ctx.scale(currentScale, currentScale);

      // Draw the image centered at the origin
      ctx.drawImage(img, -nw / 2, -nh / 2, nw, nh);
      ctx.restore();

      // Export as high quality JPEG data URL
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onCropComplete(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Crop export failed, falling back to source image:', err);
      onCropComplete(imageSrc);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Crop Profile Photo</h3>
              <p className="text-[11px] text-slate-500">
                Position face inside the frame (4:5 Passport Ratio)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Crop Stage Area */}
        <div className="relative bg-slate-950 p-6 flex flex-col items-center justify-center select-none overflow-hidden min-h-[360px]">
          {/* Crop Box Container */}
          <div
            className="relative overflow-hidden border-2 border-red-500 shadow-2xl rounded-lg cursor-grab active:cursor-grabbing bg-slate-900 touch-none"
            style={{ width: `${CROP_WIDTH}px`, height: `${CROP_HEIGHT}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* The Image Element */}
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop target"
                crossOrigin="anonymous"
                className="absolute pointer-events-none max-w-none origin-center"
                style={{
                  left: '50%',
                  top: '50%',
                  width: naturalSize.width ? `${naturalSize.width}px` : 'auto',
                  height: naturalSize.height ? `${naturalSize.height}px` : 'auto',
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${currentScale})`,
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                }}
              />
            )}

            {/* Rule of Thirds Alignment Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div />
            </div>

            {/* Target Face Outline Helper */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-35">
              <div className="w-36 h-44 rounded-full border border-dashed border-white" />
            </div>
          </div>

          {/* Drag instruction badge */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
            <Move className="w-3 h-3 text-red-400" />
            <span>Drag photo to center face</span>
          </div>
        </div>

        {/* Zoom and Position Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, parseFloat((z - 0.2).toFixed(2))))}
              className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="1"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3.5, parseFloat((z + 0.2).toFixed(2))))}
              className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono text-slate-600 w-10 text-right font-semibold">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={handleReset}
              title="Reset Zoom & Alignment"
              className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-red-300 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Cropping...' : 'Done / Crop Photo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
