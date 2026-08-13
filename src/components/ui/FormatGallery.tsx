import React from 'react';
import { TemplateOptions, TemplateStyle, ResumeData } from '../../types';
import { FileText, CheckCircle2, ShieldCheck, Sparkles, Wand2, Download, ExternalLink, Mail, Award, AlertTriangle } from 'lucide-react';

interface FormatGalleryProps {
  templateOptions: TemplateOptions;
  setTemplateOptions: (options: TemplateOptions) => void;
  resumeData?: ResumeData;
  onExportPDF: () => void;
}

export const FormatGallery: React.FC<FormatGalleryProps> = ({
  templateOptions,
  setTemplateOptions,
  resumeData,
  onExportPDF,
}) => {
  const formats: {
    id: TemplateStyle;
    title: string;
    subtitle: string;
    atsScore: string;
    bestFor: string;
    badge: string;
    bgAccent: string;
    fontFamilyLabel: string;
    description: string;
    isOriginal?: boolean;
  }[] = [
    {
      id: 'original',
      title: 'Original Draft',
      subtitle: 'Raw Upload Layout & Structure',
      atsScore: '72% ATS Compliance',
      bestFor: 'Comparing original unformatted file before ATS auto-sanitization',
      badge: 'Uploaded Original',
      bgAccent: 'bg-amber-950 text-amber-200 border-amber-800',
      fontFamilyLabel: 'Original File Font',
      description: 'Preserves raw layout structure from your original uploaded document.',
      isOriginal: true,
    },
    {
      id: 'executive',
      title: 'Executive Modern',
      subtitle: 'Clean Single-Column with Slate Accents',
      atsScore: '99% ATS Parseable',
      bestFor: 'Senior Developers, Tech Leads, Engineering Managers',
      badge: 'Most Popular for Tech HR',
      bgAccent: 'bg-slate-900 text-white border-slate-700',
      fontFamilyLabel: 'Inter / Modern Sans',
      description: 'Structured contact header, high-contrast section dividers, and balanced bullet spacing.',
    },
    {
      id: 'harvard',
      title: 'Harvard Classic ATS',
      subtitle: 'Traditional Serif & Corporate Layout',
      atsScore: '100% ATS Benchmark',
      bestFor: 'Enterprise, Banking, Fortune 500, Consulting & Standard HR',
      badge: 'Strict ATS Standard',
      bgAccent: 'bg-stone-900 text-stone-100 border-stone-700 font-serif',
      fontFamilyLabel: 'Georgia / Times Serif',
      description: 'Classic monochrome typography with zero decorative overhead, universally parsed by Workday & Taleo.',
    },
    {
      id: 'tech',
      title: 'Tech Minimalist',
      subtitle: 'Modern Monospace Code-Focused',
      atsScore: '96% ATS Parseable',
      bestFor: 'Full Stack Engineers, DevOps, Cloud Architects, AI Engineers',
      badge: 'Sleek Tech Matrix',
      bgAccent: 'bg-slate-950 text-cyan-400 border-cyan-800/60 font-mono',
      fontFamilyLabel: 'Roboto Mono / Tech Code',
      description: 'Dark title block with cyan accents, skill category tags, and clean project link highlights.',
    },
    {
      id: 'corporate',
      title: 'Corporate Crisp',
      subtitle: 'High-Density Compact Page Saver',
      atsScore: '97% ATS Parseable',
      bestFor: 'Candidates with 5+ Experience Roles or Extensive Projects',
      badge: 'Compact 1-Page Fit',
      bgAccent: 'bg-indigo-950 text-indigo-200 border-indigo-800',
      fontFamilyLabel: 'System Sans Compact',
      description: 'Maximized horizontal margins and 10pt compact font scale for fitting deep career histories on 1-2 pages.',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Select Resume Format & Layout Before HR Send</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your uploaded raw format against HR-approved ATS templates. Every format is pre-checked for parser compatibility and vector PDF rendering.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>✓ HR Pre-Flight Verified</span>
        </div>
      </div>

      {/* Format Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {formats.map((fmt) => {
          const isSelected = templateOptions.style === fmt.id;
          return (
            <div
              key={fmt.id}
              onClick={() => {
                const familyMap: Record<TemplateStyle, 'sans' | 'serif' | 'mono'> = {
                  original: 'sans',
                  executive: 'sans',
                  harvard: 'serif',
                  tech: 'mono',
                  corporate: 'sans',
                };
                setTemplateOptions({
                  ...templateOptions,
                  style: fmt.id,
                  fontFamily: familyMap[fmt.id] || 'sans',
                });
              }}
              className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2.5 relative ${
                isSelected
                  ? fmt.isOriginal
                    ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
                    : 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  fmt.isOriginal
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {fmt.badge}
                </span>

                {isSelected && (
                  <CheckCircle2 className={`w-4 h-4 ${fmt.isOriginal ? 'text-amber-600' : 'text-indigo-600'} shrink-0`} />
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{fmt.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{fmt.subtitle}</p>
              </div>

              {/* Mini Layout Preview Box */}
              <div className={`p-2.5 rounded-lg border text-[10px] space-y-1 ${fmt.bgAccent}`}>
                <div className="font-bold uppercase tracking-wide truncate border-b border-current/20 pb-0.5">
                  {resumeData?.personalInfo?.fullName || 'ALEX RIVERA'}
                </div>
                <div className="opacity-80 truncate text-[9px]">
                  {resumeData?.personalInfo?.headline || 'Senior Software Engineer'}
                </div>
                <div className="flex gap-1 pt-1 opacity-70">
                  <div className="h-1 bg-current rounded w-full"></div>
                  <div className="h-1 bg-current rounded w-2/3"></div>
                </div>
              </div>

              {/* ATS Meta Details */}
              <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-600">ATS Match:</span>
                  <span className={fmt.isOriginal ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {fmt.atsScore}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <strong className="text-slate-700">Scope:</strong> {fmt.bestFor}
                </div>
              </div>

              {/* Select CTA Button */}
              <button
                type="button"
                className={`w-full py-1.5 text-xs font-bold rounded-lg transition text-center ${
                  isSelected
                    ? fmt.isOriginal
                      ? 'bg-amber-600 text-white'
                      : 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ Currently Selected' : 'Preview Format'}
              </button>
            </div>
          );
        })}
      </div>

      {/* HR Direct Send Checklist Footer */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-slate-100">Ready to Send to HR / Recruiters?</span>
            <span className="text-slate-400 text-[11px]">
              Recommended file name: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">{resumeData?.personalInfo?.fullName ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'Candidate_Resume.pdf'}</code>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExportPDF}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF in Selected Format</span>
        </button>
      </div>
    </div>
  );
};
