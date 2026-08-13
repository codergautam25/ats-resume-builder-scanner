import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Check,
  Copy,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Wand2,
  Layers,
  FileText,
} from 'lucide-react';
import { HealthCheckItem } from '../../types';

interface QuickFixModalProps {
  item: HealthCheckItem | null;
  onClose: () => void;
  onApplyFix: (selectedText: string, scoreGain?: number) => void;
  isAlreadyFixed?: boolean;
}

interface FixVariation {
  id: string;
  badge: string;
  tone: string;
  suggestedText: string;
  atsScoreGain: string;
}

export const QuickFixModal: React.FC<QuickFixModalProps> = ({
  item,
  onClose,
  onApplyFix,
  isAlreadyFixed = false,
}) => {
  const [selectedFixId, setSelectedFixId] = useState<string | null>('fix_1');
  const [applied, setApplied] = useState<boolean>(isAlreadyFixed);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!item) return null;

  // Generate 3 ATS-Optimized Variations tailored to the flagged problem
  const getVariations = (checkItem: HealthCheckItem): FixVariation[] => {
    const affected = checkItem.affectedItems?.join(', ') || checkItem.title;

    if (checkItem.type === 'buzzwords') {
      return [
        {
          id: 'fix_1',
          badge: 'High Impact Metric',
          tone: 'Action-Verb Heavy',
          suggestedText: 'Engineered high-concurrency microservices delivering 99.99% system availability across enterprise client integrations.',
          atsScoreGain: '+18 ATS Points',
        },
        {
          id: 'fix_2',
          badge: 'Technical Precision',
          tone: 'Architecture & Scalability',
          suggestedText: 'Orchestrated distributed API gateway architecture utilizing Node.js and Redis, reducing p99 response latency by 42%.',
          atsScoreGain: '+15 ATS Points',
        },
        {
          id: 'fix_3',
          badge: 'Leadership & Execution',
          tone: 'Stakeholder & Ownership',
          suggestedText: 'Spearheaded cross-functional engineering deliverables for 12+ enterprise client projects, accelerating product launch velocity by 30%.',
          atsScoreGain: '+14 ATS Points',
        },
      ];
    } else if (checkItem.type === 'metrics') {
      return [
        {
          id: 'fix_1',
          badge: 'Scale & Latency Focus',
          tone: 'Throughput & Performance',
          suggestedText: 'Architected automated CI/CD pipeline and automated test suite, cutting deployment cycle times from 4 hours to 12 minutes.',
          atsScoreGain: '+20 ATS Points',
        },
        {
          id: 'fix_2',
          badge: 'Financial & ROI Impact',
          tone: 'Cost Efficiency',
          suggestedText: 'Optimized cloud infrastructure resources on AWS/EKS, reducing monthly server compute expenditures by $45,000.',
          atsScoreGain: '+17 ATS Points',
        },
        {
          id: 'fix_3',
          badge: 'Team & User Growth',
          tone: 'Scale & User Expansion',
          suggestedText: 'Scaled core application backend to support 250,000+ daily active users with 0 recorded security incidents.',
          atsScoreGain: '+16 ATS Points',
        },
      ];
    } else {
      return [
        {
          id: 'fix_1',
          badge: 'Standard ATS Compliant',
          tone: 'Clear & Concise',
          suggestedText: `Streamlined ${affected} workflows by enforcing clean architecture and standardized automated CI/CD validation.`,
          atsScoreGain: '+12 ATS Points',
        },
        {
          id: 'fix_2',
          badge: 'Quantified Seniority',
          tone: 'Lead / Staff Standard',
          suggestedText: `Spearheaded overhaul of ${affected}, increasing team engineering throughput by 35% across 4 production sprints.`,
          atsScoreGain: '+15 ATS Points',
        },
        {
          id: 'fix_3',
          badge: 'Client / Forward Deployed',
          tone: 'Outcome & Customer Focus',
          suggestedText: `Partnered with client technical leads to optimize ${affected}, accelerating customer onboarding time by 50%.`,
          atsScoreGain: '+14 ATS Points',
        },
      ];
    }
  };

  const variations = getVariations(item);
  const currentSelected = variations.find((v) => v.id === selectedFixId) || variations[0];

  const handleApply = () => {
    if (currentSelected && !applied) {
      const match = currentSelected.atsScoreGain.match(/\+?(\d+)/);
      const scoreGain = match ? parseInt(match[1], 10) : 15;
      onApplyFix(currentSelected.suggestedText, scoreGain);
      setApplied(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-8 space-y-0">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-5 border-b border-amber-800/40 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-extrabold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Quick-Fix AI Generator
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Needs Review Fix
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                3 ATS-Optimized Quick-Fix Variations
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flagged Issue Overview Banner */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Flagged Problem Area: "{item.title}"</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            {item.details}
          </p>
        </div>

        {/* 3 AI Generated Variations Selector */}
        <div className="p-6 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Select 1 of 3 AI Variations to Replace Problematic Text:</span>
          </h4>

          <div className="space-y-3">
            {variations.map((v) => {
              const isSelected = selectedFixId === v.id;
              const isCopied = copiedId === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedFixId(v.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 relative ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 text-white shadow-lg shadow-amber-500/5'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 font-bold" />}
                      </div>
                      <span className="text-xs font-extrabold text-white">{v.badge}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                        {v.tone}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {v.atsScoreGain}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 italic bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono leading-relaxed">
                    "{v.suggestedText}"
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(v.id, v.suggestedText);
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Selected variation will immediately replace problematic text in your resume draft.
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={applied}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                applied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Replaced in Resume!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Apply & Replace Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
