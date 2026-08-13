import React, { useState } from 'react';
import { ATSAnalysis, ResumeData } from '../../types';
import { CheckCircle, AlertCircle, HelpCircle, Plus, Sparkles, TrendingUp, ShieldCheck, Zap, AlertTriangle, X, Trash2, UserCheck, Wand2, Check, BarChart2, Compass } from 'lucide-react';
import { SkillsLearningRoadmap } from '../career-guidance/SkillsLearningRoadmap';
import { RecentWorkIngestionCard } from '../../components/ui/RecentWorkIngestionCard';
import { ResumeRadarChart } from './ResumeRadarChart';
import { CareerGuidanceSection } from '../career-guidance/CareerGuidanceSection';
import { ResumeHealthSection } from './ResumeHealthSection';
import { SalaryAndPerksCard } from '../../components/ui/SalaryAndPerksCard';
import { FDERoleComparisonSection } from '../career-guidance/FDERoleComparisonSection';
import { FDETransitionPath } from '../career-guidance/FDETransitionPath';
import { SeniorYoEAndImpactDeepDive } from '../hr-simulation/SeniorYoEAndImpactDeepDive';
import { CareerPulse } from '../career-guidance/CareerPulse';
import { ResumeEditingTrackerDashboard } from '../../components/ui/ResumeEditingTrackerDashboard';
import { ProductionReadinessDashboard } from '../../components/ui/ProductionReadinessDashboard';

interface ATSScoreCardProps {
  analysis: ATSAnalysis;
  resumeData?: ResumeData;
  jobDescription?: string;
  onOpenClarificationModal: () => void;
  onAddSkill: (skill: string) => void;
  onDismissMissingKeyword: (skill: string) => void;
  onRemoveFoundKeyword: (skill: string) => void;
  onIngestRecentWork: (recentWorkText: string) => Promise<void>;
  isResolving: boolean;
  onApplyQuickFix?: (selectedText: string, scoreGain?: number, checkTitle?: string) => void;
  onOpenHRPersona?: () => void;
  onFixAll?: () => void;
  onOpenMetricSuggester?: () => void;
  onNavigateToEditorSection?: (section: 'info' | 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'certifications') => void;
  onAutofillKeyword?: (keyword: string) => void;
  onNavigateToRoadmap?: () => void;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  analysis,
  resumeData,
  jobDescription = '',
  onOpenClarificationModal,
  onAddSkill,
  onDismissMissingKeyword,
  onRemoveFoundKeyword,
  onIngestRecentWork,
  isResolving,
  onApplyQuickFix,
  onOpenHRPersona,
  onFixAll,
  onOpenMetricSuggester,
  onNavigateToEditorSection,
  onAutofillKeyword,
  onNavigateToRoadmap,
}) => {
  const [appliedRecIndices, setAppliedRecIndices] = useState<Set<number>>(new Set());
  const [fixAllSuccessMsg, setFixAllSuccessMsg] = useState<string | null>(null);

  const handleTriggerFixAll = () => {
    if (onFixAll) {
      onFixAll();
    }
    setFixAllSuccessMsg('✓ Applied Fix All: Standardized date ranges, extracted contact links & normalized section headers!');
    setTimeout(() => setFixAllSuccessMsg(null), 6000);
  };
  const {
    overallScore = 0,
    scoreBreakdown = {
      impactMetricsScore: 50,
      keywordMatchScore: 50,
      actionVerbsScore: 50,
      formattingReadabilityScore: 50,
      sectionCompletenessScore: 50,
    },
    keyStrengths = [],
    criticalIssues = [],
    missingKeywords = [],
    foundKeywords = [],
    skillLearningRoadmap = [],
    actionableRecommendations = [],
    clarificationQuestions = [],
  } = analysis || {};

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  const getBadgeColor = (priority: string) => {
    if (priority === 'high') return 'badge badge-danger';
    if (priority === 'medium') return 'badge badge-warning';
    return 'badge badge-primary';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Doubt Clarification Banner Callout */}
      {clarificationQuestions && clarificationQuestions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 border-2 border-amber-400/40 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 shadow">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Gemini AI Has {clarificationQuestions.length} Doubts to Resolve
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 max-w-2xl">
                The scanner found vague metrics or missing skill contexts in your resume. Clarifying these answers will optimize your ATS match score significantly.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenClarificationModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Answer {clarificationQuestions.length} Clarifying Questions</span>
          </button>
        </div>
      )}

      {/* AI Role & Free Study Advisor Callout Banner */}
      {onNavigateToRoadmap && (
        <div className="surface-card border border-indigo-500/30 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
              <Compass className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-default text-base font-display">
                  AI Target Role & Free Study Advisor
                </h3>
                <span className="badge badge-primary">100% Free Resources</span>
              </div>
              <p className="text-xs text-secondary mt-1 max-w-2xl">
                Based on your uploaded resume, AI automatically evaluates what roles you can pursue (e.g. ServiceNow Architect, Cloud Lead), what skills to study, and where to study for free (NowLearning, official docs, YouTube, roadmap.sh).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToRoadmap}
            className="btn btn-primary btn-md w-full sm:w-auto shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none shadow-md"
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Launch Role & Study Roadmap</span>
          </button>
        </div>
      )}

      {/* 3-Card AI Quick Action Suite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: HR Persona Review */}
        <div className="surface-card border border-default p-5 rounded-2xl space-y-3 shadow-xs hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="badge badge-primary">6-Sec Recruiter</span>
          </div>
          <div>
            <h3 className="font-extrabold text-default text-sm font-display">Recruiter Review Simulator</h3>
            <p className="text-xs text-secondary mt-1 leading-snug">
              Get an unvarnished 6-second recruiter review. Detect weak verbs and informal tone.
            </p>
          </div>
          {onOpenHRPersona && (
            <button
              type="button"
              onClick={onOpenHRPersona}
              className="btn btn-secondary btn-sm w-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch HR Persona</span>
            </button>
          )}
        </div>

        {/* Card 2: 1-Click Fix All ATS Flaws */}
        <div className="surface-card border border-emerald-500/30 p-5 rounded-2xl space-y-3 shadow-xs hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <span className="badge badge-success">1-Click Resolution</span>
          </div>
          <div>
            <h3 className="font-extrabold text-default text-sm font-display">1-Click Fix All Format Flaws</h3>
            <p className="text-xs text-secondary mt-1 leading-snug">
              Auto-standardizes date ranges, section headers, contact links, and bullet metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTriggerFixAll}
            className="btn btn-primary btn-sm w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-none"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Fix All Flaws Now</span>
          </button>
        </div>

        {/* Card 3: Metric Suggester */}
        <div className="surface-card border border-amber-500/30 p-5 rounded-2xl space-y-3 shadow-xs hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center border border-amber-500/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="badge badge-warning">Quantified Scale</span>
          </div>
          <div>
            <h3 className="font-extrabold text-default text-sm font-display">Quantifiable Metric Suggester</h3>
            <p className="text-xs text-secondary mt-1 leading-snug">
              Injects numbers, percentages, and scale metrics into work experience bullets.
            </p>
          </div>
          {onOpenMetricSuggester && (
            <button
              type="button"
              onClick={onOpenMetricSuggester}
              className="btn btn-secondary btn-sm w-full"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Suggester</span>
            </button>
          )}
        </div>
      </div>

      {fixAllSuccessMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{fixAllSuccessMsg}</span>
        </div>
      )}

      {/* Main Score Hero Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Overall Score Meter */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall ATS Score</span>
          
          <div className="relative my-4 flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(overallScore)}`}>
              <span className="text-4xl font-extrabold tracking-tight">{overallScore}</span>
              <span className="text-xs font-semibold text-slate-500">out of 100</span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600">
            {overallScore >= 80 ? '🎉 Excellent! Top 5% ATS Candidate' : overallScore >= 60 ? '⚡ Good start, but has ATS filter risks' : '⚠️ Needs restructuring for ATS approval'}
          </p>
        </div>

        {/* 5 Category Breakdown Bars */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>ATS Category Performance Breakdown</span>
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Quantified Metrics & Impact', score: scoreBreakdown?.impactMetricsScore ?? 50, icon: Zap },
              { label: 'Target Job Keyword Alignment', score: scoreBreakdown?.keywordMatchScore ?? 50, icon: ShieldCheck },
              { label: 'Action Verbs & Phrasing Strength', score: scoreBreakdown?.actionVerbsScore ?? 50, icon: Sparkles },
              { label: 'Format & Readability Ease', score: scoreBreakdown?.formattingReadabilityScore ?? 50, icon: CheckCircle },
              { label: 'Section Completeness & Order', score: scoreBreakdown?.sectionCompletenessScore ?? 50, icon: AlertCircle },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <cat.icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat.label}</span>
                  </span>
                  <span className={cat.score >= 75 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {cat.score}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: Interactive Radar Chart Matrix */}
      <ResumeRadarChart
        scoreBreakdown={scoreBreakdown}
        overallScore={overallScore}
        foundKeywords={analysis.foundKeywords}
        missingKeywords={analysis.missingKeywords}
        skillCategories={resumeData?.skillCategories ?? []}
        jobDescription={jobDescription}
      />

      {/* SECTION: Top 500 Production Readiness Dashboard */}
      {resumeData && (
        <ProductionReadinessDashboard
          resumeData={resumeData}
          onFixAll={onFixAll}
          onOpenMetricSuggester={onOpenMetricSuggester}
          onApplyQuickFix={onApplyQuickFix}
          onNavigateToEditorSection={onNavigateToEditorSection}
        />
      )}

      {/* SECTION: Resume Health & Content Audit Check */}
      <ResumeHealthSection
        resumeHealth={analysis.resumeHealth}
        onAddSkillOrBullet={(text) => onAddSkill(text)}
        onApplyQuickFix={onApplyQuickFix}
      />

      {/* SECTION: Resume Editing Tracker & Achievement Logger Dashboard */}
      <ResumeEditingTrackerDashboard />

      {/* SECTION: Recent Work / Learning Quick Ingestion Card */}
      <RecentWorkIngestionCard
        onIngestRecentWork={onIngestRecentWork}
        isResolving={isResolving}
      />

      {/* SECTION: Salary Insights & Perks Breakdown */}
      <SalaryAndPerksCard
        salaryInsights={analysis.salaryInsights}
      />

      {/* SECTION: Forward Deployed Engineer (FDE) & Role Comparison */}
      <FDERoleComparisonSection
        fdeData={analysis.fdeRoleComparison}
        onAddSkillOrBullet={(text) => onAddSkill(text)}
      />

      {/* SECTION: FDE Transition Path & Competency Gap Visualizer */}
      <FDETransitionPath
        fdeData={analysis.fdeRoleComparison}
        onAddSkillOrBullet={(text) => onAddSkill(text)}
      />

      {/* SECTION: Senior Years of Experience (YoE) & Impact Quantification Deep Dive */}
      <SeniorYoEAndImpactDeepDive
        onAddSkillOrBullet={(text) => onAddSkill(text)}
        detectedSkills={foundKeywords}
      />

      {/* SECTION: Live Market Career Pulse with Google Search Grounding */}
      <CareerPulse
        onAddSkillToResume={onAddSkill}
      />

      {/* SECTION: Career Strategy, Suitable Roles & Future Proof Path */}
      <CareerGuidanceSection
        careerGuidance={analysis.careerGuidance}
        detectedSkills={foundKeywords}
      />

      {/* SECTION: Skills To Learn Priority Roadmap */}
      <SkillsLearningRoadmap
        roadmap={skillLearningRoadmap || []}
        missingKeywords={missingKeywords || []}
        onAddSkill={onAddSkill}
        onDismissSkill={onDismissMissingKeyword}
        onAutofillKeyword={onAutofillKeyword}
      />

      {/* Keywords Grid (Missing vs Found) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Keywords (Actionable with Remove option) */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 text-sm">Missing ATS Keywords</h3>
            </div>
            <div className="flex items-center space-x-2">
              {onAutofillKeyword && missingKeywords.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    missingKeywords.forEach((kw) => onAutofillKeyword(kw));
                  }}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1 transition active:scale-95"
                  title="Instantly autofill all missing keywords into relevant project and experience sections"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Autofill All ({missingKeywords.length})</span>
                </button>
              )}
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full">
                {missingKeywords.length} Needed
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            These keywords are requested in target job postings. Click <strong className="text-amber-700">"⚡ Autofill"</strong> to inject a skill directly into your most relevant work experience or project as an ATS bullet, click <strong>"+"</strong> to add to skills list, or <strong>"✕"</strong> to dismiss.
          </p>

          <div className="flex flex-wrap gap-2">
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-emerald-600 font-semibold italic">All required keywords covered!</p>
            ) : (
              missingKeywords.map((kw, i) => (
                <div
                  key={i}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-200 shadow-2xs"
                >
                  {onAutofillKeyword && (
                    <button
                      type="button"
                      onClick={() => onAutofillKeyword(kw)}
                      className="hover:text-amber-900 text-amber-700 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded text-[11px] font-black flex items-center space-x-1 transition"
                      title={`Autofill "${kw}" into relevant experience/project as an ATS bullet point`}
                    >
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                      <span>Autofill</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onAddSkill(kw)}
                    className="hover:text-emerald-700 flex items-center space-x-1 font-bold"
                    title={`Add "${kw}" to skill categories`}
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{kw}</span>
                  </button>

                  <span className="text-rose-300">|</span>

                  <button
                    type="button"
                    onClick={() => onDismissMissingKeyword(kw)}
                    className="hover:text-rose-950 p-0.5 rounded transition text-rose-400 hover:text-rose-600"
                    title={`Dismiss "${kw}"`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Found Keywords (with option to remove if user didn't actually work on it) */}
        <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 text-sm">Detected Resume Keywords</h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
              {foundKeywords.length} Matched
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These skills were detected on your resume. Click <strong>"✕"</strong> if you want to remove any keyword you didn't work on.
          </p>

          <div className="flex flex-wrap gap-2">
            {foundKeywords.map((kw, i) => (
              <div
                key={i}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFoundKeyword(kw)}
                  className="hover:text-rose-600 text-emerald-600 p-0.5 transition"
                  title={`Remove "${kw}" from resume skills`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Strengths & Critical Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Key Resume Strengths</span>
          </h4>
          <ul className="space-y-2">
            {keyStrengths.map((str, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Critical ATS Format Risks</span>
          </h4>
          <ul className="space-y-2">
            {criticalIssues.map((issue, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Priority Actionable Optimization Steps</span>
          </h3>

          <button
            type="button"
            onClick={handleTriggerFixAll}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Fix All Recommended Edits</span>
          </button>
        </div>

        <div className="space-y-3">
          {actionableRecommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getBadgeColor(rec.priority)}`}>
                  {rec.priority} priority • {rec.category}
                </span>
              </div>
              <h5 className="font-bold text-slate-800 text-xs">{rec.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

              {rec.suggestedFix && (
                <div className="mt-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="leading-relaxed">
                    <span className="text-blue-600 font-bold">Suggested Fix: </span>
                    {rec.suggestedFix}
                  </div>
                  {appliedRecIndices.has(i) || rec.isApplied ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] rounded-lg flex items-center space-x-1 self-start sm:self-auto flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Quick Fix Applied</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedRecIndices((prev) => new Set(prev).add(i));
                        if (onApplyQuickFix) {
                          onApplyQuickFix(rec.suggestedFix!, 10, rec.title);
                        } else {
                          onAddSkill(rec.suggestedFix!);
                        }
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition active:scale-95 flex-shrink-0 self-start sm:self-auto"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>⚡ Apply Quick Fix (+10 Points)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

