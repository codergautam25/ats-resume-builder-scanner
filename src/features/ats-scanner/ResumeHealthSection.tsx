import React, { useState } from 'react';
import { ResumeHealth, HealthCheckItem } from '../../types';
import { Activity, AlertTriangle, CheckCircle2, XCircle, Sparkles, HelpCircle, ShieldCheck, ArrowRight, Eye, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { QuickFixModal } from '../../components/modals/QuickFixModal';

interface ResumeHealthSectionProps {
  resumeHealth?: ResumeHealth;
  onFixTask?: (task: HealthCheckItem) => void;
  onAddSkillOrBullet?: (text: string) => void;
  onApplyQuickFix?: (selectedText: string, scoreGain?: number, checkTitle?: string) => void;
}

export const ResumeHealthSection: React.FC<ResumeHealthSectionProps> = ({
  resumeHealth,
  onFixTask,
  onAddSkillOrBullet,
  onApplyQuickFix,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'issues' | 'buzzwords' | 'contact' | 'formatting'>('all');
  const [quickFixItem, setQuickFixItem] = useState<HealthCheckItem | null>(null);
  const [fixedKeys, setFixedKeys] = useState<Set<string>>(new Set());
  const [appliedOptionKeys, setAppliedOptionKeys] = useState<Set<string>>(new Set());

  // Fallback / default health evaluation if backend hasn't provided explicit object
  const defaultChecks: HealthCheckItem[] = [
    {
      type: 'buzzwords',
      status: 'warning',
      title: 'Overused Buzzwords & Vague Clichés',
      issueCount: 2,
      details: 'Detected terms like "results-driven" and "team player". ATS algorithms and recruiters prefer concrete skill verbs and quantifiable metrics over generic self-descriptors.',
      actionTask: 'Replace generic buzzwords with active impact verbs (e.g. "engineered", "scaled", "delivered") and metric proof.',
      affectedItems: ['"results-driven"', '"team player"'],
    },
    {
      type: 'contact',
      status: 'passed',
      title: 'Contact Information & Profile Links',
      issueCount: 0,
      details: 'FullName, professional Email, Phone, Location, and LinkedIn profile link are clearly present and parseable.',
      actionTask: 'No action required. Contact section passes ATS parser standards.',
      affectedItems: ['Email Verified', 'Phone Verified', 'LinkedIn Link Present'],
    },
    {
      type: 'formatting',
      status: 'passed',
      title: 'ATS Formatting & Column Layout Integrity',
      issueCount: 0,
      details: 'Standard single-column layout without tables, graphic text frames, or unparseable custom elements.',
      actionTask: 'Keep bullet points concise (between 40 and 180 characters) for optimal ATS scanning.',
      affectedItems: [],
    },
    {
      type: 'metrics',
      status: 'warning',
      title: 'Quantified Experience Metrics',
      issueCount: 1,
      details: '3 out of 5 experience bullet points contain quantifiable numbers (% latency, $ savings, user count). Adding metrics to remaining bullets will boost impact score.',
      actionTask: 'Quantify remaining work highlights with estimated numbers, team sizes, or efficiency improvements.',
      affectedItems: ['Nexus Software Solutions bullet #1 needs metrics'],
    },
    {
      type: 'structure',
      status: 'passed',
      title: 'Section Header Completeness',
      issueCount: 0,
      details: 'All standard headers present: Summary, Work Experience, Technical Skills, Education.',
      actionTask: 'Maintain standard capital header titles for maximum ATS parser recognition.',
      affectedItems: [],
    },
  ];

  const rawChecks = resumeHealth?.checks?.length ? resumeHealth.checks : defaultChecks;

  // Enhance checks with local fixed state
  const checks = rawChecks.map((c) => {
    const isFixed = c.status === 'passed' || c.isFixed || fixedKeys.has(c.title);
    return {
      ...c,
      status: isFixed ? ('passed' as const) : c.status,
      issueCount: isFixed ? 0 : c.issueCount,
      details: isFixed && fixedKeys.has(c.title) ? '✓ Quick Fix Applied: Replaced problematic phrasing with ATS-optimized metrics bullet in resume draft.' : c.details,
      isFixed,
    };
  });

  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const criticalCount = checks.filter((c) => c.status === 'critical').length;

  const healthScore = checks.length > 0
    ? Math.min(100, Math.round((passedCount / checks.length) * 100))
    : (resumeHealth?.healthScore ?? 85);

  const handleExecuteQuickFix = (selectedText: string, scoreGain: number = 15, itemTitle?: string) => {
    const targetTitle = itemTitle || quickFixItem?.title || '';
    if (targetTitle) {
      setFixedKeys((prev) => new Set(prev).add(targetTitle));
    }

    if (onApplyQuickFix) {
      onApplyQuickFix(selectedText, scoreGain, targetTitle);
    } else if (onAddSkillOrBullet) {
      onAddSkillOrBullet(selectedText);
    }

    setQuickFixItem(null);
  };

  const filteredChecks = checks.filter((item) => {
    if (activeFilter === 'issues') return item.status !== 'passed';
    if (activeFilter === 'buzzwords') return item.type === 'buzzwords';
    if (activeFilter === 'contact') return item.type === 'contact';
    if (activeFilter === 'formatting') return item.type === 'formatting' || item.type === 'structure';
    return true;
  });

  const getStatusIcon = (status: HealthCheckItem['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
    }
  };

  const getStatusBadge = (status: HealthCheckItem['status'], isFixed?: boolean) => {
    if (isFixed) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">✓ Fix Applied</span>;
    }
    switch (status) {
      case 'passed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Passed</span>;
      case 'warning':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">Needs Review</span>;
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200">Critical Fix</span>;
    }
  };

  return (
    <div className="bg-white border border-teal-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-600 rounded-xl text-white shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <span>Resume Health & Content Quality Audit</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated audit for buzzwords, missing contact info, formatting issues, and metric depth.
            </p>
          </div>
        </div>

        {/* Health Summary Gauge Pill */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700">Resume Health Index</div>
            <div className="text-[11px] text-slate-500">{passedCount} of {checks.length} checks passed</div>
          </div>
          <div className={`text-xl font-black px-3 py-1 rounded-lg border ${
            healthScore >= 85 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            {healthScore}%
          </div>
        </div>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="block font-bold text-slate-700">Passed Checks</span>
            <span className="text-xs text-emerald-700 font-medium">Clean & ATS Ready</span>
          </div>
          <span className="text-lg font-black text-emerald-700">{passedCount}</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="block font-bold text-slate-700">Warnings</span>
            <span className="text-xs text-amber-700 font-medium">Minor Enhancements</span>
          </div>
          <span className="text-lg font-black text-amber-700">{warningCount}</span>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="block font-bold text-slate-700">Critical Issues</span>
            <span className="text-xs text-rose-700 font-medium">Fix for ATS Parsers</span>
          </div>
          <span className="text-lg font-black text-rose-700">{criticalCount}</span>
        </div>

        <div className="bg-teal-50/70 border border-teal-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="block font-bold text-slate-700">Total Scanned</span>
            <span className="text-xs text-teal-700 font-medium">Health Modules</span>
          </div>
          <span className="text-lg font-black text-teal-700">{checks.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Checks ({checks.length})
        </button>

        <button
          onClick={() => setActiveFilter('issues')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
            activeFilter === 'issues'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Issues & Warnings ({warningCount + criticalCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('buzzwords')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'buzzwords'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Buzzwords Audit
        </button>

        <button
          onClick={() => setActiveFilter('contact')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'contact'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Contact & Links
        </button>

        <button
          onClick={() => setActiveFilter('formatting')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'formatting'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Formatting & Structure
        </button>
      </div>

      {/* Health Checks List */}
      <div className="space-y-3">
        {filteredChecks.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition ${
              item.status === 'passed'
                ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                : item.status === 'warning'
                ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                : 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                {getStatusIcon(item.status)}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>

                  {/* Affected items / tags */}
                  {item.affectedItems && item.affectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.affectedItems.map((aff, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-mono font-medium"
                        >
                          {aff}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Improvement Task & Interactive Fix Options Box */}
              {item.status !== 'passed' && !item.isFixed ? (
                <div className="sm:min-w-[280px] bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1 text-teal-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Action Improvement Task:</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Needs Review
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-snug">{item.actionTask}</p>

                  {/* ⚡ Quick-Fix Action Trigger */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">
                      3 AI Variations Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickFixItem(item)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>⚡ Quick-Fix Issue</span>
                    </button>
                  </div>

                  {/* Fix Options Section */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wide block">
                      Recommended Fix Options:
                    </span>
                    <div className="space-y-1.5">
                      {(item.fixOptions || (
                        item.type === 'buzzwords' ? [
                          {
                            optionTitle: 'Option A: Active Engineering Verb Replacement',
                            description: 'Replace generic clichés with active engineering verbs & metric proof.',
                            suggestedText: 'Engineered high-concurrency microservices delivering 99.99% system availability across enterprise client integrations.',
                          },
                          {
                            optionTitle: 'Option B: Quantified Leadership Addition',
                            description: 'Add team size, system throughput, or architectural scope.',
                            suggestedText: 'Spearheaded frontend architecture overhaul with React & TypeScript across a team of 6 engineers.',
                          },
                        ] : item.type === 'metrics' ? [
                          {
                            optionTitle: 'Option A: Throughput & Performance Metric',
                            description: 'Quantify latency, uptime, or deployment speed.',
                            suggestedText: 'Optimized cloud infrastructure on AWS, reducing deployment cycle duration from 4 hours to 12 minutes.',
                          },
                          {
                            optionTitle: 'Option B: User Growth & Scale Metric',
                            description: 'Add user count, data throughput, or cost efficiency metrics.',
                            suggestedText: 'Scaled backend microservices to support 250,000+ daily active users with 35% latency reduction.',
                          },
                        ] : [
                          {
                            optionTitle: 'Option A: Standard ATS Optimization',
                            description: 'Refine section formatting and improve parser clarity.',
                            suggestedText: 'Streamlined technical architecture workflows by enforcing clean automated CI/CD code validation.',
                          },
                          {
                            optionTitle: 'Option B: Quantitative Outcome Focus',
                            description: 'Add quantifiable deliverables to work highlights.',
                            suggestedText: 'Spearheaded core platform feature delivery, increasing engineering throughput by 30%.',
                          },
                        ]
                      )).map((opt, oIdx) => {
                        const optKey = `${item.title}_${oIdx}`;
                        const isOptApplied = appliedOptionKeys.has(optKey) || item.isFixed;
                        return (
                          <div
                            key={oIdx}
                            className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 hover:border-teal-300 transition"
                          >
                            <div className="font-bold text-[11px] text-slate-800 flex items-center justify-between">
                              <span>{opt.optionTitle}</span>
                              {isOptApplied && (
                                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded">
                                  ✓ Applied
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-600">{opt.description}</p>
                            {opt.suggestedText && (
                              <div className="bg-white p-1.5 rounded border border-slate-200/80 text-[10px] font-mono text-slate-800 flex items-center justify-between gap-1">
                                <span className="truncate italic max-w-[150px]">"{opt.suggestedText}"</span>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {isOptApplied ? (
                                    <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded border border-emerald-300 flex items-center space-x-0.5">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Applied</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAppliedOptionKeys((prev) => new Set(prev).add(optKey));
                                        handleExecuteQuickFix(opt.suggestedText!, 10, item.title);
                                      }}
                                      className="px-2 py-0.5 text-[9px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded shadow-2xs flex items-center space-x-1 transition"
                                    >
                                      <Zap className="w-3 h-3 fill-slate-950" />
                                      <span>Apply</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(opt.suggestedText!);
                                      alert('Copied suggested fix to clipboard!');
                                    }}
                                    className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded border border-teal-200"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 text-xs font-bold self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>✓ Issue Resolved & Quick Fix Applied (+Score Reflected)</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick-Fix Modal with 3 AI-Generated Variations */}
      {quickFixItem && (
        <QuickFixModal
          item={quickFixItem}
          onClose={() => setQuickFixItem(null)}
          onApplyFix={(selectedText, scoreGain) => {
            handleExecuteQuickFix(selectedText, scoreGain || 15, quickFixItem.title);
          }}
          isAlreadyFixed={quickFixItem.isFixed}
        />
      )}
    </div>
  );
};
