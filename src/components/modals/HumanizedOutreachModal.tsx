import React, { useState } from 'react';
import { Send, X, Copy, Check, Sparkles, Building, Briefcase, UserCheck, MessageSquare } from 'lucide-react';
import { ResumeData } from '../../types';

interface HumanizedOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

export const HumanizedOutreachModal: React.FC<HumanizedOutreachModalProps> = ({
  isOpen,
  onClose,
  resumeData,
}) => {
  const [targetRole, setTargetRole] = useState(resumeData.personalInfo?.targetRole || resumeData.personalInfo?.headline || 'Software Engineer');
  const [companyName, setCompanyName] = useState('Tech Enterprise');
  const [recipientRole, setRecipientRole] = useState<'Recruiter' | 'Hiring Manager' | 'Peer Engineer'>('Recruiter');
  const [outreachText, setOutreachText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const candidateName = resumeData.personalInfo?.fullName || 'Candidate';
  const keySkills = (resumeData.skillCategories || []).flatMap((c) => c.skills || []).slice(0, 5);
  const topAccomplishment = resumeData.experience?.[0]?.highlights?.[0] || 'built high-performance cloud applications';

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          targetRole,
          companyName,
          recipientRole,
          keySkills,
          topAccomplishment,
        }),
      });
      const data = await res.json();
      setOutreachText(data.outreachText || '');
    } catch (err) {
      console.error('Outreach generation error:', err);
      // Fallback
      setOutreachText(`Hi [Name],\n\nI saw you're hiring for a ${targetRole} at ${companyName}. I have strong experience in ${keySkills.join(', ')}.\n\nRecently, I ${topAccomplishment}.\n\nI'd love to share my resume and connect if you have 5 minutes!`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="surface-card border border-default rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-default text-base font-display">
                  Humanized Outreach Generator
                </h3>
                <span className="badge badge-success">8th-Grade Readability</span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Generates warm, high-converting recruiter DMs & cold emails with zero AI jargon.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="font-label text-muted">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="input text-xs"
              placeholder="e.g. ServiceNow Developer"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label text-muted">Target Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input text-xs"
              placeholder="e.g. Accenture / Google"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label text-muted">Recipient Type</label>
            <select
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value as any)}
              className="input text-xs"
            >
              <option value="Recruiter">Technical Recruiter</option>
              <option value="Hiring Manager">Hiring Manager</option>
              <option value="Peer Engineer">Peer Engineer (Referral)</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn btn-primary btn-md w-full"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Writing Humanized Outreach...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate Humanized Messages</span>
            </>
          )}
        </button>

        {/* Output */}
        {outreachText && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-muted flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Generated Outreach Options</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(outreachText)}
                className="btn btn-secondary btn-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy All'}</span>
              </button>
            </div>

            <div className="p-4 surface-input rounded-xl border border-default text-xs font-sans leading-relaxed whitespace-pre-wrap text-default max-h-72 overflow-y-auto">
              {outreachText}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
