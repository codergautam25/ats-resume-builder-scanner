import React, { useState, useEffect } from 'react';
import { ResumeData, CareerGapAnalysisData } from '../../types';
import {
  Target,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Clock,
  Layers,
  ChevronRight,
  Plus,
  RefreshCw,
  Calendar,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  FileCode2,
  Check
} from 'lucide-react';

interface CareerGapAnalysisComponentProps {
  resumeData?: ResumeData;
  targetRole?: string;
  onAddSkillToResume?: (skillName: string) => void;
  onAddProjectToResume?: (project: { title: string; subtitle?: string; link?: string; highlights: string[]; technologies?: string[] }) => void;
  onAddCertificationToResume?: (cert: { name: string; issuer: string; date?: string }) => void;
}

export const CareerGapAnalysisComponent: React.FC<CareerGapAnalysisComponentProps> = ({
  resumeData,
  targetRole: initialRole = 'Forward Deployed Engineer (FDE)',
  onAddSkillToResume,
  onAddProjectToResume,
  onAddCertificationToResume,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [customJobDesc, setCustomJobDesc] = useState<string>('');
  const [showJobDescInput, setShowJobDescInput] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<CareerGapAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addedCertIds, setAddedCertIds] = useState<Set<string>>(new Set());
  const [addedProjIds, setAddedProjIds] = useState<Set<string>>(new Set());
  const [activeQuarterTab, setActiveQuarterTab] = useState<number>(0);

  const defaultGapData: CareerGapAnalysisData = {
    targetRole: selectedRole || 'Forward Deployed Engineer (FDE)',
    readinessScore: 78,
    matchSummary: `Your profile displays strong foundational engineering capability, but demonstrates a strategic 22% competency gap for high-paying ${selectedRole || 'Forward Deployed Engineer'} requirements expected over the next 6-12 months.`,
    keyGaps: [
      {
        title: 'Distributed Event Architecture & High-Throughput Pipelines',
        description: 'Target roles require proven capability designing fault-tolerant streaming pipelines (Kafka, gRPC, Redis) with sub-second latency SLA requirements.',
        impactLevel: 'Critical',
        remedy: 'Build a real-time event ETL gateway and add system resiliency metrics to your resume experience bullet points.',
      },
      {
        title: 'Enterprise AI Agent Orchestration & Tool-Calling Gateways',
        description: 'Over 65% of enterprise postings for target roles now require hands-on LLM function calling, RAG vector indexing, and SAML/OAuth security controls.',
        impactLevel: 'Critical',
        remedy: 'Acquire AWS Solutions Architect or CKA credentials and add an Enterprise Agentic RAG Gateway project blueprint.',
      },
      {
        title: 'Client-Facing Technical Discovery & Architectural Workshop Leadership',
        description: 'Forward Deployed & Staff roles expect candidate experience scoping API boundaries directly with client CTOs.',
        impactLevel: 'High',
        remedy: 'Rephrase resume experience highlights to frame past engineering projects around customer discovery and integration onboarding ROI.',
      },
    ],
    recommendedCertifications: [
      {
        id: 'cert-aws-sa',
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services (AWS)',
        estimatedTimeToComplete: '4-6 weeks (10 hrs/wk)',
        relevanceScore: 95,
        whyRecommended: 'Essential credential to validate multi-tier enterprise cloud design, security isolation, and disaster recovery.',
        prerequisites: 'Foundational cloud knowledge',
      },
      {
        id: 'cert-cka',
        title: 'CKA: Certified Kubernetes Administrator',
        issuer: 'CNCF / Linux Foundation',
        estimatedTimeToComplete: '6-8 weeks (12 hrs/wk)',
        relevanceScore: 91,
        whyRecommended: 'Demonstrates deep hands-on container orchestration mastery required for enterprise client field deployments.',
        prerequisites: 'Docker & Linux command line',
      },
      {
        id: 'cert-gcp-pca',
        title: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google Cloud Platform',
        estimatedTimeToComplete: '5-7 weeks (10 hrs/wk)',
        relevanceScore: 88,
        whyRecommended: 'Highly sought after by AI startups and enterprise consultancies implementing big data & Vertex AI workflows.',
        prerequisites: 'Cloud fundamentals',
      },
    ],
    recommendedProjects: [
      {
        id: 'proj-gap-rag',
        title: 'Multi-Agent Enterprise RAG Gateway & Tool Orchestrator',
        category: 'AI Infrastructure & Vector Search',
        estimatedTime: '3 weeks',
        techStack: ['TypeScript', 'Node.js', 'Gemini API', 'Pinecone Vector DB', 'Docker'],
        description: 'Architect a production-grade multi-agent LLM orchestrator that processes unstructured enterprise documents into vector stores with role-based access controls.',
        keyBulletPointsToAdd: [
          'Architected a multi-agent RAG pipeline using vector embeddings and sub-second hybrid search, reducing document query latencies by 45%.',
          'Implemented RBAC authentication and OAuth 2.0 token validation for enterprise client data ingestion routes.',
        ],
      },
      {
        id: 'proj-gap-kafka',
        title: 'Real-time High-Throughput Event Streaming ETL Gateway',
        category: 'Distributed Systems & Cloud',
        estimatedTime: '3-4 weeks',
        techStack: ['Kafka', 'Go/Node.js', 'PostgreSQL', 'Grafana', 'Redis'],
        description: 'Engineered a fault-tolerant event processing pipeline streaming 10,000+ messages/sec with automated dead-letter-queue error handling and Grafana telemetry.',
        keyBulletPointsToAdd: [
          'Engineered a distributed Kafka event streaming pipeline handling 10,000+ events/sec with zero packet loss across multi-node clusters.',
          'Implemented automated Grafana telemetry monitoring and circuit breaker patterns to guarantee 99.99% system uptime.',
        ],
      },
    ],
    quarterlyRoadmap: [
      {
        quarter: 'Q1 (Months 1-3)',
        focusArea: 'Foundational Architecture & Cloud Certification',
        milestones: [
          'Complete AWS Certified Solutions Architect Associate coursework & mock exams',
          'Refactor resume experience bullets to highlight system scalability & measurable business metrics',
          'Master LLM function calling and vector embeddings concepts',
        ],
        targetOutcome: 'Earn AWS SA-A Certification & elevate ATS match score above 85%',
      },
      {
        quarter: 'Q2 (Months 4-6)',
        focusArea: 'High-Impact Portfolio Project Build & Deployment',
        milestones: [
          'Build Multi-Agent Enterprise RAG Gateway portfolio project with full documentation',
          'Deploy live preview to Cloud Run with automated CI/CD GitHub Actions pipeline',
          'Add project blueprint directly to resume draft and GitHub portfolio',
        ],
        targetOutcome: 'Complete 1 top-tier production portfolio project with live URL',
      },
      {
        quarter: 'Q3 (Months 7-9)',
        focusArea: 'Advanced System Design & Client Discovery Workshops',
        milestones: [
          'Master System Design interview patterns (Rate Limiting, Load Balancing, DB Sharding)',
          'Obtain secondary CKA certification or lead open-source architecture contributions',
          'Practice technical discovery workshop scenarios with peer engineers',
        ],
        targetOutcome: 'Pass Senior/Staff technical system design bar',
      },
      {
        quarter: 'Q4 (Months 10-12)',
        focusArea: 'Target Role Application Sprints & Offer Negotiation',
        milestones: [
          'Target top 15 target role postings with tailored ATS-optimized resumes',
          'Execute mock interview rounds focusing on STAR storytelling and technical leadership',
          'Evaluate job offers against $200k+ target compensation benchmarks',
        ],
        targetOutcome: 'Secure target role offer with +25-35% compensation step-up',
      },
    ],
  };

  const fetchGapAnalysis = async (roleToAnalyze: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/career-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          targetRole: roleToAnalyze,
          targetJobDescription: customJobDesc,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run AI Career Path Gap Analysis.');
      }

      const resData = await response.json();
      if (resData.data) {
        setAnalysisData(resData.data);
      } else {
        setAnalysisData(defaultGapData);
      }
    } catch (err: any) {
      console.warn('Error fetching gap analysis, using intelligent benchmark model:', err);
      setError('Serving benchmark career path analysis. Click rerun to retry AI connection.');
      setAnalysisData(defaultGapData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGapAnalysis(selectedRole);
  }, []);

  const data = analysisData || defaultGapData;

  const handleAddCert = (cert: { id: string; title: string; issuer: string; estimatedTimeToComplete: string }) => {
    setAddedCertIds((prev) => new Set(prev).add(cert.id));
    if (onAddCertificationToResume) {
      onAddCertificationToResume({
        name: cert.title,
        issuer: cert.issuer,
        date: 'In Progress (Next 6-12 Mo)',
      });
    }
  };

  const handleAddProj = (proj: { id: string; title: string; techStack: string[]; keyBulletPointsToAdd: string[] }) => {
    setAddedProjIds((prev) => new Set(prev).add(proj.id));
    if (onAddProjectToResume) {
      onAddProjectToResume({
        title: proj.title,
        subtitle: 'Production Portfolio Blueprint',
        highlights: proj.keyBulletPointsToAdd,
        technologies: proj.techStack,
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 rounded-xl text-slate-950 shadow-lg shrink-0">
            <Target className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                AI Career Strategy
              </span>
              <span className="text-[10px] font-mono text-slate-400">6–12 Month Outlook</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center space-x-2">
              <span>Career Path Gap Analysis</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-powered gap analysis comparing your current resume against <strong>{selectedRole}</strong> standards for the next 6–12 months.
            </p>
          </div>
        </div>

        {/* Role Selector Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            placeholder="e.g. Forward Deployed Engineer..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none w-full sm:w-60"
          />
          <button
            onClick={() => fetchGapAnalysis(selectedRole)}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-slate-950" />}
            <span>{isLoading ? 'Analyzing...' : 'Run Gap Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Target Role Job Description Toggle */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setShowJobDescInput(!showJobDescInput)}
          className="text-amber-400 font-bold hover:underline flex items-center space-x-1"
        >
          <span>{showJobDescInput ? '▲ Hide Target Job Posting Text' : '▼ Paste Specific Target Job Posting to Tailor Gap Analysis'}</span>
        </button>
        {showJobDescInput && (
          <div className="mt-3 space-y-2">
            <textarea
              value={customJobDesc}
              onChange={(e) => setCustomJobDesc(e.target.value)}
              placeholder="Paste job description requirements here (e.g. key responsibilities, required qualifications)..."
              rows={3}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            />
            <button
              onClick={() => fetchGapAnalysis(selectedRole)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition"
            >
              Analyze with Custom Job Description
            </button>
          </div>
        )}
      </div>

      {/* Hero Match Gauge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl items-center">
        <div className="lg:col-span-4 flex items-center space-x-4 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 lg:pr-4">
          <div className="relative w-24 h-24 rounded-2xl bg-slate-900 border-2 border-amber-500/80 flex flex-col items-center justify-center font-black shadow-inner shrink-0">
            <span className="text-3xl text-amber-400">{data.readinessScore}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">12-Mo Ready</span>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Role Fit</span>
            </span>
            <h3 className="text-sm font-bold text-white mt-1">{data.targetRole}</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              {100 - data.readinessScore}% gap remaining to reach 100% Top-Tier Recruiter Match.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 text-xs text-slate-300 leading-relaxed space-y-2">
          <p className="font-medium">{data.matchSummary}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="font-bold text-slate-400">Next 6-12 Months Priorities:</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 font-semibold">
              {data.recommendedCertifications.length} Certifications Recommended
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 font-semibold">
              {data.recommendedProjects.length} Portfolio Project Blueprints
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Key Competency Gaps */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>1. Key Competency Gaps to Close (Next 6 Months)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.keyGaps.map((gap, idx) => (
            <div
              key={idx}
              className="bg-slate-950/90 border border-rose-900/50 hover:border-rose-700/80 rounded-xl p-4 space-y-2.5 transition flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {gap.impactLevel} Gap
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Gap #{idx + 1}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{gap.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{gap.description}</p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] text-amber-300 space-y-1">
                <strong className="block text-[10px] uppercase font-mono text-amber-400">Action Remedy:</strong>
                <span>{gap.remedy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Recommended Certifications */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>2. Recommended Specific Certifications (Next 6–12 Months)</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Highest ROI Credentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recommendedCertifications.map((cert) => {
            const isAdded = addedCertIds.has(cert.id);
            return (
              <div
                key={cert.id}
                className="bg-slate-950 border border-amber-900/40 hover:border-amber-600/80 rounded-xl p-4 flex flex-col justify-between space-y-3 transition group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
                      {cert.relevanceScore}% Relevance
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{cert.estimatedTimeToComplete}</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-white group-hover:text-amber-300 transition leading-snug">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-amber-400/90">{cert.issuer}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{cert.whyRecommended}</p>

                  {cert.prerequisites && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      <strong>Prereqs:</strong> {cert.prerequisites}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleAddCert(cert)}
                  disabled={isAdded}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    isAdded
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Resume Certifications!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Certification to Resume</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Recommended High-Impact Projects */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            <span>3. Recommended High-Impact Project Types (Portfolio Blueprints)</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">1-Click Add Blueprint</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendedProjects.map((proj) => {
            const isAdded = addedProjIds.has(proj.id);
            return (
              <div
                key={proj.id}
                className="bg-slate-950 border border-indigo-900/50 hover:border-indigo-600/80 rounded-xl p-4 space-y-3 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {proj.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Est. {proj.estimatedTime}</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-slate-900 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-amber-400 font-mono block">Resume Bullet Points Provided:</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      {proj.keyBulletPointsToAdd.map((bp, bIdx) => (
                        <li key={bIdx}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleAddProj(proj)}
                  disabled={isAdded}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    isAdded
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added Project Blueprint to Resume Draft!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>1-Click Add Project Blueprint to Resume</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Quarterly Roadmap (Q1 - Q4 12-Month Timeline) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>4. 12-Month Quarterly Step-by-Step Action Plan</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Quarterly Milestones</span>
        </div>

        {/* Quarter Tabs */}
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {data.quarterlyRoadmap.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQuarterTab(idx)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition whitespace-nowrap text-center ${
                activeQuarterTab === idx
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {q.quarter}
            </button>
          ))}
        </div>

        {/* Selected Quarter Card */}
        {data.quarterlyRoadmap[activeQuarterTab] && (
          <div className="bg-slate-950 border border-emerald-900/50 p-5 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                  {data.quarterlyRoadmap[activeQuarterTab].quarter} Strategic Objective
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  {data.quarterlyRoadmap[activeQuarterTab].focusArea}
                </h4>
              </div>
              <div className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-lg shrink-0">
                Target Outcome: {data.quarterlyRoadmap[activeQuarterTab].targetOutcome}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">Quarterly Key Milestones:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.quarterlyRoadmap[activeQuarterTab].milestones.map((ms, mIdx) => (
                  <div key={mIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ms}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
