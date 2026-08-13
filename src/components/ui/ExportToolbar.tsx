import React, { useState } from 'react';
import { ResumeData, TemplateOptions, TemplateStyle } from '../../types';
import { Download, Printer, Palette, Wand2, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { sanitizeAndFixResumeData, autoFormatResumeData, runHRReadinessAudit, HRReadinessAuditIssue } from '../../utils/resumeSanitizer';

interface ExportToolbarProps {
  templateOptions: TemplateOptions;
  setTemplateOptions: (options: TemplateOptions) => void;
  onExportPDF: () => void;
  onPrint: () => void;
  resumeData?: ResumeData;
  onResumeDataChange?: (data: ResumeData) => void;
  onSwitchToEdit?: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  templateOptions,
  setTemplateOptions,
  onExportPDF,
  onPrint,
  resumeData,
  onResumeDataChange,
  onSwitchToEdit,
}) => {
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [autoFixSuccessMsg, setAutoFixSuccessMsg] = useState<string | null>(null);

  const auditIssues: HRReadinessAuditIssue[] = resumeData ? runHRReadinessAudit(resumeData) : [];
  const criticalCount = auditIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = auditIssues.filter((i) => i.severity === 'warning').length;

  const handle1ClickAutoFix = () => {
    if (resumeData && onResumeDataChange) {
      const formatted = autoFormatResumeData(resumeData);
      onResumeDataChange(formatted);
      setAutoFixSuccessMsg('✓ Standardized date ranges & section headers! Cleaned social links, removed Education link noise & optimized for ATS parsing.');
      setTimeout(() => setAutoFixSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-3 max-w-5xl mx-auto">
      {/* Top Banner: HR Readiness & Auto-Fix Notification */}
      {autoFixSuccessMsg && (
        <div className="p-3 bg-emerald-900/90 text-emerald-100 border border-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{autoFixSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Main Toolbar Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold">Resume Template & Layout Engine</span>
            </div>

            {/* HR Readiness Audit Badge */}
            {resumeData && (
              <button
                onClick={() => setShowAuditModal(!showAuditModal)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1.5 transition ${
                  criticalCount > 0
                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60 hover:bg-amber-900'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {criticalCount > 0
                    ? `HR Readiness: ${criticalCount} Warning${criticalCount > 1 ? 's' : ''}`
                    : 'HR Ready (100% Format Passed)'}
                </span>
                {showAuditModal ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1-Click Auto Format Button */}
            {resumeData && onResumeDataChange && (
              <button
                onClick={handle1ClickAutoFix}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
                title="Automatically standardize date ranges, clean section headers, relocate certifications, and format social links for 100% ATS readability."
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
                <span>Auto-Format</span>
              </button>
            )}

            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download ATS PDF</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print / Vector PDF</span>
            </button>
          </div>
        </div>

        {/* HR Readiness Audit Expandable Details Bar */}
        {showAuditModal && resumeData && (
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>HR & ATS Recruiter Readiness Audit</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {auditIssues.length === 0 ? '✓ Zero formatting flaws detected' : `${auditIssues.length} Formatting Advice Items`}
              </span>
            </div>

            {auditIssues.length === 0 ? (
              <p className="text-emerald-400 font-medium">
                ✓ Perfect structure! Candidate contact details, experience highlights, and section headings pass modern ATS standards and are 100% ready to send to HR.
              </p>
            ) : (
              <div className="space-y-2">
                {auditIssues.map((issue) => (
                  <div key={issue.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                        <AlertTriangle className={`w-3.5 h-3.5 ${issue.severity === 'critical' ? 'text-amber-400' : 'text-blue-400'}`} />
                        <span>{issue.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{issue.description}</p>
                    </div>

                    {issue.autoFixAvailable && (
                      <button
                        onClick={handle1ClickAutoFix}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-md shrink-0"
                      >
                        Auto Fix
                      </button>
                    )}
                    {!issue.autoFixAvailable && onSwitchToEdit && (
                      <button
                        onClick={onSwitchToEdit}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] rounded-md shrink-0 border border-slate-700"
                      >
                        Edit Field
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Control Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Template Picker */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Template Design</label>
            <select
              value={templateOptions.style}
              onChange={(e) =>
                setTemplateOptions({ ...templateOptions, style: e.target.value as TemplateStyle })
              }
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="executive">Executive Modern (Slate & Crisp)</option>
              <option value="tech">Tech Minimal (Clean & Tech Matrix)</option>
              <option value="harvard">Harvard Classic (Traditional Serif)</option>
              <option value="corporate">Corporate Crisp (High Density)</option>
            </select>
          </div>

          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Font Pairings</label>
            <select
              value={templateOptions.fontFamily}
              onChange={(e) =>
                setTemplateOptions({ ...templateOptions, fontFamily: e.target.value as any })
              }
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="sans">Inter / Modern Sans</option>
              <option value="serif">Georgia / Traditional Serif</option>
              <option value="mono">Roboto Mono / Tech Mono</option>
            </select>
          </div>

          {/* Primary Accent Color */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Header Accent Color</label>
            <div className="flex items-center space-x-2 pt-1">
              {['#0f172a', '#1e3a8a', '#065f46', '#7c2d12', '#4c1d95', '#111827'].map((col) => (
                <button
                  key={col}
                  onClick={() => setTemplateOptions({ ...templateOptions, primaryColor: col })}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    templateOptions.primaryColor === col ? 'border-white scale-110 shadow' : 'border-transparent opacity-80'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Font Size & Spacing */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Typography Scale</label>
            <div className="flex items-center space-x-2">
              <select
                value={templateOptions.fontSize}
                onChange={(e) => setTemplateOptions({ ...templateOptions, fontSize: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="sm">Compact (10pt)</option>
                <option value="md">Standard (11pt)</option>
                <option value="lg">Large (12pt)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

