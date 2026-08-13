import React, { useState, useEffect } from 'react';
import { ResumeData, HRPersonaReview, ToneCritique } from '../../types';
import {
  UserCheck,
  Building2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  FileText,
  Briefcase,
  Zap,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  Copy
} from 'lucide-react';

interface HRPersonaSimulatorProps {
  resumeData: ResumeData;
  onResumeDataChange: (newData: ResumeData) => void;
  targetRole?: string;
}

const PERSONA_PRESETS = [
  {
    id: 'fortune_500',
    companyTier: 'Fortune 500 Enterprise (e.g. Microsoft, Goldman Sachs, Apple)',
    recruiterRole: 'Senior Talent Acquisition Manager',
    icon: Building2,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Strict focus on corporate alignment, leadership impact, metric verification, and formal executive language.'
  },
  {
    id: 'top_tech',
    companyTier: 'Top Tier Silicon Valley Tech (e.g. Google, Meta, Palantir, Stripe)',
    recruiterRole: 'Lead Technical Recruiter & Engineering Hiring Manager',
    icon: Zap,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Evaluates architectural scale, system ownership, modern tech stack precision, and zero-fluff engineering depth.'
  },
  {
    id: 'scaleup',
    companyTier: 'High-Growth Scaleup / AI Unicorn (e.g. OpenAI, Databricks, Anthropic)',
    recruiterRole: 'Head of People & Engineering Lead',
    icon: Flame,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Looks for high velocity, builder mindset, end-to-end product delivery, and proactive problem-solving tone.'
  },
  {
    id: 'consulting',
    companyTier: 'Top Strategy Consulting & Advisory (e.g. McKinsey, BCG, Bain)',
    recruiterRole: 'Principal Executive Hiring Lead',
    icon: Award,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Prioritizes quantitative business outcome metrics, structured communication, and client-facing professionalism.'
  }
];

export const HRPersonaSimulator: React.FC<HRPersonaSimulatorProps> = ({
  resumeData,
  onResumeDataChange,
  targetRole
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('top_tech');
  const [companyTier, setCompanyTier] = useState<string>(PERSONA_PRESETS[1].companyTier);
  const [recruiterRole, setRecruiterRole] = useState<string>(PERSONA_PRESETS[1].recruiterRole);

  const [review, setReview] = useState<HRPersonaReview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('All');
  const [appliedCritiqueIds, setAppliedCritiqueIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof PERSONA_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setCompanyTier(preset.companyTier);
    setRecruiterRole(preset.recruiterRole);
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/hr-persona-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          companyTier,
          recruiterRole
        })
      });

      const resText = await res.text();
      let resJson: any = {};
      try {
        resJson = JSON.parse(resText);
      } catch {
        throw new Error('Failed to parse server response. Please retry.');
      }

      if (!res.ok) {
        throw new Error(resJson?.error || 'Failed to simulate HR review.');
      }

      if (resJson?.data) {
        setReview(resJson.data);
      } else {
        throw new Error('Invalid review data returned from server.');
      }
    } catch (err: any) {
      console.error('HR Persona simulation error:', err);
      setError(err.message || 'Server communication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation on load if no review present
  useEffect(() => {
    if (!review && !isLoading) {
      handleRunSimulation();
    }
  }, []);

  // Handler: Apply 1-Click Polish to Resume
  const handleApplyRewrite = (critique: ToneCritique) => {
    if (!critique.originalText || !critique.suggestedRewrite) return;

    let updated = false;
    const original = critique.originalText.trim();
    const rewrite = critique.suggestedRewrite.trim();

    // 1. Check summary
    let newSummary = resumeData.summary;
    if (newSummary.includes(original)) {
      newSummary = newSummary.replace(original, rewrite);
      updated = true;
    }

    // 2. Check work experience highlights & position
    const newExperience = resumeData.experience.map((exp) => {
      let updatedPos = exp.position;
      if (updatedPos.includes(original)) {
        updatedPos = updatedPos.replace(original, rewrite);
        updated = true;
      }

      const newHighlights = exp.highlights.map((h) => {
        if (h.includes(original)) {
          updated = true;
          return h.replace(original, rewrite);
        }
        return h;
      });

      return { ...exp, position: updatedPos, highlights: newHighlights };
    });

    // 3. Check project highlights & title
    const newProjects = resumeData.projects.map((proj) => {
      let updatedTitle = proj.title;
      if (updatedTitle.includes(original)) {
        updatedTitle = updatedTitle.replace(original, rewrite);
        updated = true;
      }

      const newHighlights = proj.highlights.map((h) => {
        if (h.includes(original)) {
          updated = true;
          return h.replace(original, rewrite);
        }
        return h;
      });

      return { ...proj, title: updatedTitle, highlights: newHighlights };
    });

    if (updated) {
      onResumeDataChange({
        ...resumeData,
        summary: newSummary,
        experience: newExperience,
        projects: newProjects
      });
    } else {
      // If exact string match failed, append/replace at top of summary or experience
      if (critique.section === 'Summary') {
        onResumeDataChange({
          ...resumeData,
          summary: `${rewrite} ${resumeData.summary}`.trim()
        });
      } else if (resumeData.experience.length > 0) {
        const firstExp = { ...resumeData.experience[0] };
        firstExp.highlights = [rewrite, ...firstExp.highlights];
        const newExpList = [...resumeData.experience];
        newExpList[0] = firstExp;
        onResumeDataChange({
          ...resumeData,
          experience: newExpList
        });
      }
    }

    setAppliedCritiqueIds((prev) => new Set(prev).add(critique.id));
  };

  const filteredCritiques = review?.toneCritiques
    ? review.toneCritiques.filter((c) =>
        activeSectionFilter === 'All' ? true : c.section.toLowerCase() === activeSectionFilter.toLowerCase()
      )
    : [];

  const getDecisionColor = (decision: string) => {
    if (decision.includes('Fast-Track') || decision.includes('Proceed')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (decision.includes('Hold') || decision.includes('Refinement')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Informal Phrasing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Passive Voice':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Vague / Lack of Impact':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Buzzword Overuse':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Subtle Arrogance / Overpromise':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Persona Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold rounded-full flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>HR Persona Simulator</span>
              </span>
              <span className="text-xs text-slate-400">Top 500 Corporate Recruiter Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Simulated Top 500 Recruiter Review
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Examine your resume through the eyes of an elite corporate talent recruiter. Uncover hidden tone defects, passive voice, informal phrasing, and unvarnished recruiter thoughts before real hiring managers see your application.
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating HR Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Re-Run HR Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Recruiter Personas */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Select Recruiter Persona & Company Environment:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PERSONA_PRESETS.map((preset) => {
              const IconComp = preset.icon;
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-xl text-left border transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${preset.badgeColor}`}>
                        {preset.id.replace('_', ' ').toUpperCase()}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="flex items-start space-x-2.5 mb-2">
                      <IconComp className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                      <h4 className="text-xs font-bold text-white leading-snug">{preset.companyTier}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Review Results Dashboard */}
      {review && (
        <div className="space-y-8">
          {/* 1. Recruiter Decision & Verdict Hero Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Verdict Summary & Badge */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${getDecisionColor(review.verdict.recruiterDecision)}`}>
                    {review.verdict.recruiterDecision}
                  </span>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-medium">
                    Perceived Level: <strong className="text-white">{review.verdict.seniorityAlignment}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span>Recruiter's First 6-Second Glance Verdict:</span>
                </h3>

                <blockquote className="p-4 bg-slate-800/80 border-l-4 border-indigo-500 rounded-r-xl text-slate-200 text-sm italic leading-relaxed">
                  "{review.verdict.firstImpression}"
                </blockquote>
              </div>

              {/* Tone Score & Rating Card */}
              <div className="lg:col-span-4 bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tone & Phrasing Score</span>
                <div className="relative flex items-center justify-center">
                  <div className="text-4xl font-extrabold text-white">{review.verdict.toneScore}</div>
                  <span className="text-xs text-slate-400 ml-1">/ 100</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      review.verdict.toneScore >= 80
                        ? 'bg-emerald-500'
                        : review.verdict.toneScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${review.verdict.toneScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {review.verdict.toneScore >= 80
                    ? '✓ Professional Fortune 500 corporate alignment.'
                    : '⚠ Tone contains informal phrasing or weak passive verbs.'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Line-by-Line Tone & Phrasing Critique Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <span>Tone & Phrasing Line-by-Line Critiques ({review.toneCritiques.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Specific text flagged for informal tone, passive voice, weak action verbs, or vague impact.
                </p>
              </div>

              {/* Section Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {['All', 'Summary', 'Experience', 'Projects', 'Education'].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setActiveSectionFilter(sec)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      activeSectionFilter === sec
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {filteredCritiques.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-400 text-sm">
                No tone issues found for the section: <strong>{activeSectionFilter}</strong>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredCritiques.map((critique) => {
                  const isApplied = appliedCritiqueIds.has(critique.id);
                  return (
                    <div
                      key={critique.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isApplied
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-700 text-slate-200 rounded-full border border-slate-600">
                            {critique.section}
                          </span>
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getCategoryBadge(critique.issueCategory)}`}>
                            {critique.issueCategory}
                          </span>
                        </div>

                        <button
                          onClick={() => handleApplyRewrite(critique)}
                          disabled={isApplied}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                            isApplied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Applied to Resume Draft</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                              <span>1-Click Apply Polish</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Original Phrasing */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-3">
                        <div className="lg:col-span-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 block">
                            Original Non-Professional Phrasing:
                          </span>
                          <p className="text-xs text-rose-200 font-medium leading-relaxed">
                            "{critique.originalText}"
                          </p>
                        </div>

                        <div className="lg:col-span-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                            Top 500 HR-Approved Polish:
                          </span>
                          <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                            "{critique.suggestedRewrite}"
                          </p>
                        </div>
                      </div>

                      {/* Unvarnished Recruiter Thought */}
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2.5">
                        <UserCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-amber-300 block">
                            Unvarnished Recruiter Impression:
                          </span>
                          <p className="text-xs text-amber-100/90 italic leading-relaxed">
                            "{critique.recruiterThought}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Strengths vs. Red Flags Dual Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white space-y-4">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>What Catches Their Eye (Strengths)</span>
              </h3>
              <ul className="space-y-2.5">
                {review.recruiterFeedback.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white space-y-4">
              <h3 className="text-lg font-bold text-amber-400 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>What Makes Them Hesitate (Red Flags)</span>
              </h3>
              <ul className="space-y-2.5">
                {review.recruiterFeedback.redFlags.map((rf, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200 leading-relaxed">
                    <span className="text-amber-400 font-bold shrink-0">⚠</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Strategic Tone Advice & Action Items */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>Top Recommended Action Items to Sound Like an Elite Candidate</span>
              </h3>
              <p className="text-xs text-slate-400">
                Strategic recommendations from Fortune 500 corporate talent directors.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed">
              <strong className="text-purple-300 block mb-1">Corporate Tone & Style Guidance:</strong>
              {review.recruiterFeedback.toneAndStyleAdvice}
            </div>

            <div className="space-y-3">
              {review.topActionItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
