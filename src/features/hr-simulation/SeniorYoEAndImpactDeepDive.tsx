import React, { useState } from 'react';
import {
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Zap,
  Layers,
  ChevronRight,
  Copy,
  Check,
  ShieldAlert,
  BarChart3,
  Sliders,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';

interface TechYoEItem {
  id: string;
  techName: string;
  category: 'Languages & Frameworks' | 'Cloud & Infrastructure' | 'System Architecture' | 'AI & LLM';
  detectedYoE: number;
  seniorTargetYoE: number;
  seniorityStatus: 'Senior Ready' | 'Near Senior' | 'YoE Gap';
  recommendation: string;
}

interface SeniorImpactSuggestion {
  id: string;
  resumeSection: string;
  currentWeakBullet: string;
  suggestedSeniorBullet: string;
  impactGain: string; // e.g. "+35% Senior ATS Multiplier"
  pillarAddressed: 'Scale & Latency' | 'Financial & Cost Savings' | 'Team & Ownership' | 'Reliability & SLA';
}

interface SeniorYoEAndImpactDeepDiveProps {
  onAddSkillOrBullet?: (text: string) => void;
  detectedSkills?: string[];
}

export const SeniorYoEAndImpactDeepDive: React.FC<SeniorYoEAndImpactDeepDiveProps> = ({
  onAddSkillOrBullet,
  detectedSkills = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedBullets, setAddedBullets] = useState<Set<string>>(new Set());

  // Interactive YoE adjustment state
  const [techList, setTechList] = useState<TechYoEItem[]>([
    {
      id: 'yoe_1',
      techName: 'TypeScript / Node.js',
      category: 'Languages & Frameworks',
      detectedYoE: 4.5,
      seniorTargetYoE: 5.0,
      seniorityStatus: 'Senior Ready',
      recommendation: 'Highlight asynchronous event loop performance tuning and strict type design patterns in core packages.',
    },
    {
      id: 'yoe_2',
      techName: 'Distributed Systems & Microservices',
      category: 'System Architecture',
      detectedYoE: 3.0,
      seniorTargetYoE: 5.0,
      seniorityStatus: 'Near Senior',
      recommendation: 'Quantify data consistency strategies (Saga pattern, idempotent endpoints) and multi-region failover.',
    },
    {
      id: 'yoe_3',
      techName: 'AWS / Cloud Infrastructure (Terraform/K8s)',
      category: 'Cloud & Infrastructure',
      detectedYoE: 2.5,
      seniorTargetYoE: 4.0,
      seniorityStatus: 'YoE Gap',
      recommendation: 'Explicitly specify container orchestration (EKS/GKE), Infrastructure as Code, and CI/CD pipelines.',
    },
    {
      id: 'yoe_4',
      techName: 'React / Frontend Architecture',
      category: 'Languages & Frameworks',
      detectedYoE: 4.0,
      seniorTargetYoE: 4.0,
      seniorityStatus: 'Senior Ready',
      recommendation: 'Emphasize state management scaling, bundler optimization (Vite/webpack), and custom design token engines.',
    },
    {
      id: 'yoe_5',
      techName: 'AI, LLM Orchestration & RAG',
      category: 'AI & LLM',
      detectedYoE: 1.5,
      seniorTargetYoE: 2.0,
      seniorityStatus: 'Near Senior',
      recommendation: 'Highlight agentic tool-calling accuracy, vector database embeddings (Pinecone/Weaviate), and latency budgets.',
    },
  ]);

  // Senior Impact Quantification Suggestions
  const impactSuggestions: SeniorImpactSuggestion[] = [
    {
      id: 'imp_1',
      resumeSection: 'Senior Experience - Lead Role',
      currentWeakBullet: 'Built and maintained microservices and cloud APIs for various internal teams.',
      suggestedSeniorBullet: 'Architected 14+ resilient Node.js microservices on AWS EKS processing 15M daily requests at 99.99% uptime, reducing infrastructure spend by $60k/yr.',
      impactGain: '+40% Seniority Rating',
      pillarAddressed: 'Scale & Latency',
    },
    {
      id: 'imp_2',
      resumeSection: 'Cloud & System Design',
      currentWeakBullet: 'Responsible for database setup and performance optimization.',
      suggestedSeniorBullet: 'Spearheaded PostgreSQL query tuning and Redis multi-tier caching, driving p99 API response latency down from 450ms to 85ms under peak load.',
      impactGain: '+35% Seniority Rating',
      pillarAddressed: 'Reliability & SLA',
    },
    {
      id: 'imp_3',
      resumeSection: 'Client & Stakeholder Engineering',
      currentWeakBullet: 'Worked with clients to understand technical requirements and deliver features.',
      suggestedSeniorBullet: 'Facilitated technical discovery workshops with client CTOs to deploy custom integration adapters, accelerating enterprise customer onboarding from 6 weeks to 10 days.',
      impactGain: '+45% Seniority Rating',
      pillarAddressed: 'Financial & Cost Savings',
    },
  ];

  // Helper to adjust YoE interactively
  const handleYoEChange = (id: string, delta: number) => {
    setTechList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newYoE = Math.max(0, Math.round((item.detectedYoE + delta) * 10) / 10);
          let newStatus: TechYoEItem['seniorityStatus'] = 'YoE Gap';
          if (newYoE >= item.seniorTargetYoE) newStatus = 'Senior Ready';
          else if (newYoE >= item.seniorTargetYoE - 1) newStatus = 'Near Senior';

          return { ...item, detectedYoE: newYoE, seniorityStatus: newStatus };
        }
        return item;
      })
    );
  };

  const handleCopyBullet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddBullet = (id: string, text: string) => {
    setAddedBullets((prev) => new Set(prev).add(id));
    if (onAddSkillOrBullet) {
      onAddSkillOrBullet(text);
    }
  };

  const filteredTechs = selectedCategory === 'All'
    ? techList
    : techList.filter((t) => t.category === selectedCategory);

  const seniorReadyCount = techList.filter((t) => t.seniorityStatus === 'Senior Ready').length;
  const overallSeniorityPercent = Math.round((seniorReadyCount / techList.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-indigo-600 rounded-xl text-white shadow-md">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white">Years of Experience (YoE) & Seniority Impact Deep Dive</h3>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Briefcase className="w-3 h-3 text-amber-400" />
                <span>Senior Benchmark Audit</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze your tech stack experience length against Senior/Staff benchmarks and upgrade vague bullet points into high-impact metric statements.
            </p>
          </div>
        </div>

        {/* Overall Seniority Index Card */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2.5 px-3.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Seniority YoE Benchmark</span>
            <span className="text-sm font-mono font-extrabold text-amber-400">
              {seniorReadyCount} of {techList.length} Stack Areas Senior-Ready
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 border-t-amber-400 flex items-center justify-center text-xs font-mono font-bold text-amber-300">
            {overallSeniorityPercent}%
          </div>
        </div>
      </div>

      {/* Part 1: Tech Stack Years of Experience Deep Dive Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              1. Required Tech Stack YoE vs. Senior Expectations
            </h4>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {['All', 'Languages & Frameworks', 'System Architecture', 'Cloud & Infrastructure', 'AI & LLM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'Languages & Frameworks' ? 'Languages' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* YoE Cards / Rows */}
        <div className="grid grid-cols-1 gap-3">
          {filteredTechs.map((item) => {
            const isSeniorReady = item.seniorityStatus === 'Senior Ready';
            const isNearSenior = item.seniorityStatus === 'Near Senior';

            return (
              <div
                key={item.id}
                className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-white">{item.techName}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          isSeniorReady
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isNearSenior
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {item.seniorityStatus}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">{item.category}</span>
                  </div>

                  {/* Interactive YoE Adjuster */}
                  <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-lg border border-slate-800 self-start sm:self-auto">
                    <span className="text-[11px] font-mono text-slate-400">
                      Your YoE: <strong className="text-white">{item.detectedYoE} yrs</strong> / Target:{' '}
                      <strong className="text-indigo-300">{item.seniorTargetYoE}+ yrs</strong>
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleYoEChange(item.id, -0.5)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                        title="Decrease YoE"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleYoEChange(item.id, 0.5)}
                        className="w-5 h-5 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center font-bold text-xs"
                        title="Increase YoE"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isSeniorReady ? 'bg-emerald-400' : isNearSenior ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(100, (item.detectedYoE / item.seniorTargetYoE) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Senior Recommendation */}
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong className="text-amber-300">Senior Positioning Strategy:</strong> {item.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Senior Impact Quantification Advisor */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
            2. Senior Impact Quantification Engine (Before vs. After)
          </h4>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Recruiters reject mid-level resumes that list tasks ("built microservices") instead of senior-level outcomes ("reduced latency by 45%, cutting cloud spend by $60k"). Swap weak statements with these pre-formatted senior bullet points.
        </p>

        <div className="space-y-3">
          {impactSuggestions.map((sug) => {
            const isAdded = addedBullets.has(sug.id);
            const isCopied = copiedId === sug.id;

            return (
              <div
                key={sug.id}
                className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3 hover:border-indigo-500/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-indigo-300">{sug.resumeSection}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {sug.pillarAddressed}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    {sug.impactGain}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Before / Weak */}
                  <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-400 flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Current Weak / Mid-Level Bullet:</span>
                    </span>
                    <p className="text-rose-200/90 text-[11px] italic">"{sug.currentWeakBullet}"</p>
                  </div>

                  {/* After / Senior Quantified */}
                  <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Quantified Senior-Level Bullet:</span>
                    </span>
                    <p className="text-emerald-200 text-[11px] font-medium leading-relaxed">
                      "{sug.suggestedSeniorBullet}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    onClick={() => handleCopyBullet(sug.id, sug.suggestedSeniorBullet)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-950 text-slate-300 border border-slate-700 transition flex items-center space-x-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAddBullet(sug.id, sug.suggestedSeniorBullet)}
                    disabled={isAdded}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Resume</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add to Active Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
