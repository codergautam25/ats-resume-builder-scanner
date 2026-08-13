import React, { useState } from 'react';
import { ResumeData, WorkExperience, Project } from '../../types';
import {
  BarChart2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Layers,
  HelpCircle,
  X,
  ChevronRight,
  Plus,
  RefreshCw,
  Target
} from 'lucide-react';

interface MetricSuggestionsModalProps {
  resumeData: ResumeData;
  onResumeDataChange: (newData: ResumeData) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface BulletMetricAnalysis {
  id: string;
  section: 'Experience' | 'Projects';
  parentTitle: string; // e.g. "Software Engineer @ Google" or "E-Commerce App"
  expIndex: number;
  highlightIndex: number;
  currentBullet: string;
  hasMetric: boolean;
  whereToAdd: string; // "At the end of the technical impact phrase"
  suggestedMetrics: {
    category: 'Scale / Traffic' | 'Latency / Speed' | 'Reliability / Quality' | 'Cost / Efficiency';
    label: string;
    suggestedText: string;
  }[];
}

export const MetricSuggestionsModal: React.FC<MetricSuggestionsModalProps> = ({
  resumeData,
  onResumeDataChange,
  isOpen,
  onClose
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unquantified' | 'quantified'>('unquantified');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedBulletIds, setAppliedBulletIds] = useState<Set<string>>(new Set());
  const [generatingForId, setGeneratingForId] = useState<string | null>(null);
  const [aiSuggestionsMap, setAiSuggestionsMap] = useState<Record<string, string[]>>({});

  if (!isOpen) return null;

  // Helper to test if bullet has numbers/metrics
  const hasMetricRegex = /\b\d+([.,]\d+)?\s*(%|k|m|b|x|usd|\$|hrs?|hours?|ms|s|sec|users?|req|requests?|tps|clients?|engineers?|devs?|k\+)\b|\b\d{2,}\b|\b\$\d+/i;

  // Build analysis list for all experience & project bullets
  const analyses: BulletMetricAnalysis[] = [];

  resumeData.experience.forEach((exp, expIdx) => {
    (exp.highlights || []).forEach((hl, hlIdx) => {
      const hasMetric = hasMetricRegex.test(hl);
      const bulletId = `exp-${expIdx}-${hlIdx}`;

      // Generate contextual suggestions based on bullet keywords
      const lower = hl.toLowerCase();
      let scaleMetric = 'handling 50,000+ daily active users with 99.9% availability';
      let speedMetric = 'reducing response latency by 35% (from 450ms to 290ms)';
      let qualityMetric = 'increasing automated test coverage from 60% to 92%';
      let costMetric = 'saving $18,000 annually in AWS server overhead';
      let whereText = 'Append at the end of the action phrase to quantify business impact.';

      if (lower.includes('api') || lower.includes('microservice') || lower.includes('backend') || lower.includes('server')) {
        scaleMetric = 'processing 120,000+ daily API requests with zero downtime';
        speedMetric = 'reducing endpoint response latency by 45% (from 600ms to 330ms)';
        qualityMetric = 'cutting production API error rates by 65%';
        costMetric = 'reducing cloud computing costs by $24,000/year';
        whereText = 'Insert after the service or feature name (e.g., "engineered microservices processing 120k+ daily requests...")';
      } else if (lower.includes('frontend') || lower.includes('ui') || lower.includes('react') || lower.includes('component')) {
        scaleMetric = 'serving 80,000+ monthly web visitors across desktop and mobile';
        speedMetric = 'improving Core Web Vitals and cutting LCP render time by 40%';
        qualityMetric = 'boosting user conversion rate by 18% through responsive UI refactoring';
        costMetric = 'reducing frontend bundle size by 350KB, decreasing load time by 1.8s';
        whereText = 'Add at the end of the UI bullet (e.g., "improving page load time by 40% for 80K+ visitors")';
      } else if (lower.includes('database') || lower.includes('sql') || lower.includes('query') || lower.includes('cache')) {
        scaleMetric = 'indexing 2.5M+ database records for real-time query retrieval';
        speedMetric = 'optimizing SQL query execution time from 2.4s down to 180ms';
        qualityMetric = 'improving cache hit ratio to 94% using Redis';
        costMetric = 'cutting database IOPS costs by 30%';
        whereText = 'Place after query or database optimization details (e.g., "reducing query execution time by 85%")';
      } else if (lower.includes('ci/cd') || lower.includes('pipeline') || lower.includes('docker') || lower.includes('deploy')) {
        scaleMetric = 'automating deployment pipelines for 14 cross-functional microservices';
        speedMetric = 'reducing CI/CD build and release times from 25 minutes to 6 minutes';
        qualityMetric = 'reducing post-release rollback frequency by 80%';
        costMetric = 'saving 15+ developer-hours per week in manual deployment tasks';
        whereText = 'Add after the pipeline technology name (e.g., "cutting deployment time from 25 min to 6 min")';
      }

      analyses.push({
        id: bulletId,
        section: 'Experience',
        parentTitle: `${exp.position} @ ${exp.company}`,
        expIndex: expIdx,
        highlightIndex: hlIdx,
        currentBullet: hl,
        hasMetric,
        whereToAdd: whereText,
        suggestedMetrics: [
          { category: 'Scale / Traffic', label: 'Scale Metric', suggestedText: `${hl.trim().replace(/\.$/, '')}, ${scaleMetric}.` },
          { category: 'Latency / Speed', label: 'Speed Metric', suggestedText: `${hl.trim().replace(/\.$/, '')}, ${speedMetric}.` },
          { category: 'Reliability / Quality', label: 'Quality Metric', suggestedText: `${hl.trim().replace(/\.$/, '')}, ${qualityMetric}.` },
          { category: 'Cost / Efficiency', label: 'Cost Metric', suggestedText: `${hl.trim().replace(/\.$/, '')}, ${costMetric}.` }
        ]
      });
    });
  });

  // Calculate statistics
  const totalBullets = analyses.length;
  const quantifiedBullets = analyses.filter((a) => a.hasMetric).length;
  const unquantifiedBullets = totalBullets - quantifiedBullets;
  const metricPercentage = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;

  // Filter analyses list
  const filteredAnalyses = analyses.filter((item) => {
    if (activeFilter === 'unquantified') return !item.hasMetric;
    if (activeFilter === 'quantified') return item.hasMetric;
    return true;
  });

  // Apply a suggested metric to resume state
  const handleApplyMetricSuggestion = (item: BulletMetricAnalysis, newText: string) => {
    if (item.section === 'Experience') {
      const newExp = resumeData.experience.map((exp, eIdx) => {
        if (eIdx !== item.expIndex) return exp;
        const newHighlights = [...exp.highlights];
        newHighlights[item.highlightIndex] = newText;
        return { ...exp, highlights: newHighlights };
      });
      onResumeDataChange({
        ...resumeData,
        experience: newExp
      });
    }
    setAppliedBulletIds((prev) => new Set(prev).add(item.id));
  };

  // Generate Custom AI Metric Suggestions via Backend
  const handleGenerateAiMetrics = async (item: BulletMetricAnalysis) => {
    setGeneratingForId(item.id);
    try {
      const res = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: item.currentBullet,
          targetRole: resumeData.personalInfo.targetRole || 'Software Engineer',
          mode: 'quantify'
        })
      });

      const resText = await res.text();
      let resJson: any = {};
      try {
        resJson = JSON.parse(resText);
      } catch {
        throw new Error('Failed to parse AI metric response');
      }

      if (resJson?.data?.rewrittenBullet) {
        setAiSuggestionsMap((prev) => ({
          ...prev,
          [item.id]: [
            resJson.data.rewrittenBullet,
            `${item.currentBullet.trim().replace(/\.$/, '')}, driving 35% performance improvement across high-throughput production environments.`,
            `${item.currentBullet.trim().replace(/\.$/, '')}, resulting in $30,000+ annual cost savings and 99.9% system availability.`
          ]
        }));
      }
    } catch (err) {
      console.error('AI Metric Generation error:', err);
    } finally {
      setGeneratingForId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center shadow">
              <BarChart2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">
                  Quantifiable Metric Suggester
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold rounded-full uppercase">
                  Recruiter Priority #1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact guidance on <strong className="text-amber-300">WHERE</strong> and <strong className="text-amber-300">WHAT</strong> metrics (scale, speed, dollars, %, users) to add to your bullet points.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Density Score & Summary Banner */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <span>Quantified Bullet Metric Density:</span>
                <span className={`px-2 py-0.5 rounded-md font-mono ${
                  metricPercentage >= 60
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {quantifiedBullets} / {totalBullets} Bullets ({metricPercentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    metricPercentage >= 60 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(metricPercentage, 5)}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {unquantifiedBullets > 0 ? (
                  <>
                    <strong className="text-amber-400">{unquantifiedBullets} out of {totalBullets} bullets lack metrics.</strong> Fortune 500 recruiters prioritize candidates with quantified scale, efficiency, and revenue impact.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400">Excellent! All bullet points contain numbers or quantifiable metrics.</strong> Your resume demonstrates high technical & business impact.
                  </>
                )}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="md:col-span-4 flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveFilter('unquantified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'unquantified'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Needs Metrics ({unquantifiedBullets})
                </button>
                <button
                  onClick={() => setActiveFilter('quantified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'quantified'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quantified ({quantifiedBullets})
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'all'
                      ? 'bg-slate-700 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({totalBullets})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable List of Bullet Analyses */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">No bullets matching filter: {activeFilter}</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All your bullets in this category already have quantifiable metrics or look great!
              </p>
            </div>
          ) : (
            filteredAnalyses.map((item) => {
              const isApplied = appliedBulletIds.has(item.id);
              const customAiOptions = aiSuggestionsMap[item.id] || [];
              const isGenerating = generatingForId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isApplied
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : item.hasMetric
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {/* Header info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                        {item.parentTitle}
                      </span>
                      {item.hasMetric ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Already Quantified</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Lacks Numbers / Scale</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleGenerateAiMetrics(item)}
                      disabled={isGenerating}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating AI Metrics...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                          <span>AI Custom Metrics</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Current Bullet Text */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Current Bullet Text:
                    </span>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      "{item.currentBullet}"
                    </p>
                  </div>

                  {/* WHERE to add metrics guidance */}
                  {!item.hasMetric && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 mb-4">
                      <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[11px] font-extrabold text-amber-300 block">
                          WHERE to add metrics:
                        </span>
                        <p className="text-xs text-amber-100/90 leading-relaxed">
                          {item.whereToAdd}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Custom AI generated options if requested */}
                  {customAiOptions.length > 0 && (
                    <div className="mb-4 space-y-2 p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl">
                      <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Tailored Gemini AI Metric Options:</span>
                      </span>
                      <div className="space-y-2">
                        {customAiOptions.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
                          >
                            <p className="text-slate-200 font-medium leading-relaxed flex-1">"{opt}"</p>
                            <button
                              onClick={() => handleApplyMetricSuggestion(item, opt)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg shrink-0 transition"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WHAT metrics to add (Preset Options Grid) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      WHAT metrics can be added (Choose & 1-Click Apply):
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.suggestedMetrics.map((sm, smIdx) => (
                        <div
                          key={smIdx}
                          className="p-3 bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl flex flex-col justify-between space-y-2 transition group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {sm.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">{sm.label}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition">
                              "{sm.suggestedText}"
                            </p>
                          </div>

                          <button
                            onClick={() => handleApplyMetricSuggestion(item, sm.suggestedText)}
                            className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-lg transition flex items-center justify-center space-x-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>1-Click Apply Metric</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            Tip: Exact metric numbers don't need to be precise down to the digit; standard realistic engineering estimates (e.g. 50K+, 35%, $20K) are standard and accepted.
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
