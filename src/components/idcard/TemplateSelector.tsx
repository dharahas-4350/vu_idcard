import React, { useRef } from 'react';
import { CardTemplate, CardOrientation, FontStyleOption } from '../../types';
import { Palette, Layout, Type, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

interface TemplateSelectorProps {
  selectedTemplate: CardTemplate;
  onSelectTemplate: (template: CardTemplate) => void;
  orientation: CardOrientation;
  onSelectOrientation: (orient: CardOrientation) => void;
  fontStyle: FontStyleOption;
  onSelectFontStyle: (font: FontStyleOption) => void;
  collegeLogo?: string;
  onLogoUpload: (logoUrl: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  orientation,
  onSelectOrientation,
  fontStyle,
  onSelectFontStyle,
  collegeLogo,
  onLogoUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const templates: {
    id: CardTemplate;
    name: string;
    description: string;
    colorSwatch: string;
    badgeBg: string;
  }[] = [
    {
      id: 'classic-blue',
      name: 'Classic Blue',
      description: 'Prestigious royal academic identity with gold trims',
      colorSwatch: 'bg-blue-900 border-blue-950',
      badgeBg: 'bg-blue-50 text-blue-900',
    },
    {
      id: 'modern-purple',
      name: 'Modern Purple',
      description: 'Sleek violet & indigo tech university layout',
      colorSwatch: 'bg-purple-900 border-indigo-950',
      badgeBg: 'bg-purple-50 text-purple-900',
    },
    {
      id: 'minimal-white',
      name: 'Minimal White',
      description: 'Clean architectural Scandinavian monochrome style',
      colorSwatch: 'bg-slate-100 border-slate-300',
      badgeBg: 'bg-slate-100 text-slate-900',
    },
    {
      id: 'premium-black',
      name: 'Premium Black',
      description: 'Executive dark carbon card with gold metallic foil',
      colorSwatch: 'bg-neutral-900 border-amber-500/50',
      badgeBg: 'bg-neutral-900 text-amber-300',
    },
    {
      id: 'university-green',
      name: 'University Green',
      description: 'Traditional Ivy League forest green with brass crest',
      colorSwatch: 'bg-emerald-900 border-teal-950',
      badgeBg: 'bg-emerald-50 text-emerald-900',
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // First try backend upload endpoint
      const uploadedUrl = await api.uploadImage(file);
      onLogoUpload(uploadedUrl);
    } catch (err) {
      // Fallback to local Data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onLogoUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const presetLogo = '/src/assets/images/university_crest_logo_1793772629151.jpg';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
      {/* 1. Template Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-700" /> Professional Templates
          </label>
          <span className="text-[11px] text-slate-600 font-medium">5 Styles Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {templates.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onSelectTemplate(tpl.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-5 h-5 rounded-full border shadow-xs ${tpl.colorSwatch}`} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-700" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{tpl.name}</h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-2 leading-tight">
                    {tpl.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Orientation & Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        {/* Orientation */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-blue-700" /> Card Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectOrientation('vertical')}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                orientation === 'vertical'
                  ? 'border-blue-700 bg-blue-50 text-blue-800 ring-1 ring-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Vertical</span>
              <span className="text-[10px] text-slate-600 font-mono">(CR80)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectOrientation('horizontal')}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                orientation === 'horizontal'
                  ? 'border-blue-700 bg-blue-50 text-blue-800 ring-1 ring-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Horizontal</span>
              <span className="text-[10px] text-slate-600 font-mono">(Badge)</span>
            </button>
          </div>
        </div>

        {/* Font Style */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-700" /> Font Typography
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'modern', label: 'Modern Sans' },
              { id: 'classic', label: 'Academic Serif' },
              { id: 'geometric', label: 'Tech Mono' },
            ].map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => onSelectFontStyle(font.id as FontStyleOption)}
                className={`py-2 px-1 text-center rounded-lg border text-[11px] font-semibold transition-all cursor-pointer truncate ${
                  fontStyle === font.id
                    ? 'border-blue-700 bg-blue-50 text-blue-800 ring-1 ring-blue-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. College Crest & Logo Options */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-700" /> College Crest / Seal
        </label>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={collegeLogo || presetLogo}
              alt="College Crest Preview"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUploading ? 'Uploading...' : 'Upload Crest'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            {collegeLogo && collegeLogo !== presetLogo && (
              <button
                type="button"
                onClick={() => onLogoUpload(presetLogo)}
                className="text-xs text-slate-600 hover:text-slate-800 hover:underline cursor-pointer"
              >
                Reset to Default Seal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
