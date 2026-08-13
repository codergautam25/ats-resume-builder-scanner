import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Code2,
  Sparkles,
  Target,
  PlusCircle,
  Zap,
  Users,
  ShieldCheck,
  Server,
  TrendingUp,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { FDERoleComparison } from '../../types';

interface FDETransitionPathProps {
  fdeData?: FDERoleComparison;
  onAddSkillOrBullet?: (text: string) => void;
}

interface CompetencyPillar {
  id: string;
  title: string;
  category: 'client' | 'technical' | 'security';
  icon: any;
  score: number; // 0 - 100
  gapDescription: string;
  recommendedAction: string;
}

interface BridgeProject {
  id: string;
  title: string;
  difficulty: 'Intermediate' | 'Advanced';
  timeEstimate: string;
  techStack: string[];
  description: string;
  resumeBullet: string;
  targetGapsAddressed: string[];
}

interface LearningModule {
  id: string;
  title: string;
  type: 'Video Course' | 'Hands-on Lab' | 'Architecture Blueprint';
  duration: string;
  provider: string;
  topics: string[];
  completed?: boolean;
}

export const FDETransitionPath: React.FC<FDETransitionPathProps> = ({
  fdeData,
  onAddSkillOrBullet,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'modules'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'client' | 'technical' | 'security'>('all');
  const [addedProjects, setAddedProjects] = useState<Set<string>>(new Set());
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  // 1. Competency Pillars & Gap Analysis
  const competencyPillars: CompetencyPillar[] = [
    {
      id: 'pillar_1',
      title: 'Client Technical Discovery & Stakeholder Alignment',
      category: 'client',
      icon: Users,
      score: 62,
      gapDescription: 'Lacks explicit mention of facilitating technical discovery workshops with external client CTOs/Architects.',
      recommendedAction: 'Highlight discovery sessions, requirements mapping, and architecture decision logs in project highlights.',
    },
    {
      id: 'pillar_2',
      title: 'Rapid Customer PoC & Prototyping',
      category: 'client',
      icon: Zap,
      score: 75,
      gapDescription: 'Needs proof of building custom client integration adapters within 1-2 week sprint windows.',
      recommendedAction: 'Add a bullet emphasizing 2-week PoC prototyping and client onboarding acceleration.',
    },
    {
      id: 'pillar_3',
      title: 'Distributed Data Ingestion & API Gateways',
      category: 'technical',
      icon: Server,
      score: 88,
      gapDescription: 'Missing real-time streaming pipeline tech (Kafka, EventBridge, or gRPC).',
      recommendedAction: 'Incorporate Kafka/PySpark data contract patterns into project highlights.',
    },
    {
      id: 'pillar_4',
      title: 'Enterprise Security, SSO & OAuth Federated Auth',
      category: 'security',
      icon: ShieldCheck,
      score: 68,
      gapDescription: 'No SAML 2.0, Okta/Auth0 enterprise SSO, or multi-tenant RBAC listed in skills.',
      recommendedAction: 'Complete enterprise authentication project or add SAML/OAuth 2.0 to skill categories.',
    },
    {
      id: 'pillar_5',
      title: 'Quantifiable Customer Retention & Business Impact',
      category: 'client',
      icon: TrendingUp,
      score: 82,
      gapDescription: 'Metrics focus heavily on internal code quality rather than customer onboarding time or ARR impact.',
      recommendedAction: 'Frame achievements around "reduced client integration time by X%" or "accelerated deal closing".',
    },
  ];

  // 2. Targeted Bridge Projects to fill the gaps
  const bridgeProjects: BridgeProject[] = [
    {
      id: 'proj_bridge_1',
      title: 'Enterprise Multi-Tenant API Gateway with SAML/Okta SSO',
      difficulty: 'Advanced',
      timeEstimate: '2 Weeks (15 hrs)',
      techStack: ['TypeScript', 'Node.js', 'Okta SAML', 'OAuth 2.0', 'Redis'],
      description: 'Architect a secure multi-tenant API proxy gateway featuring automated client onboarding, rate limiting, and enterprise identity provider (SAML 2.0) federation.',
      resumeBullet: 'Engineered multi-tenant API gateway with SAML SSO & OAuth 2.0 integrations, reducing enterprise client onboarding time by 45%.',
      targetGapsAddressed: ['Enterprise Security', 'Client Technical Discovery'],
    },
    {
      id: 'proj_bridge_2',
      title: 'Real-Time Client Discovery PoC Playground (Gemini Agentic Tools)',
      difficulty: 'Intermediate',
      timeEstimate: '1 Week (8 hrs)',
      techStack: ['React', 'Gemini SDK', 'Tool Calling', 'Vector DB', 'Tailwind'],
      description: 'Build an interactive customer prototype playground using Gemini function calling to dynamically ingest client data schemas and generate tailored solution demos.',
      resumeBullet: 'Architected rapid customer PoC playground leveraging LLM tool calling and vector retrieval, accelerating client sales engineering cycles by 50%.',
      targetGapsAddressed: ['Rapid Customer PoC', 'AI & Agentic Systems'],
    },
    {
      id: 'proj_bridge_3',
      title: 'Distributed Kafka Event Streaming & Data Contract Pipeline',
      difficulty: 'Advanced',
      timeEstimate: '2 Weeks (12 hrs)',
      techStack: ['Apache Kafka', 'PySpark / Node.js', 'Docker', 'PostgreSQL'],
      description: 'Construct a resilient data ingestion pipeline handling client event streams with automated schema validation and dead-letter queue retry mechanics.',
      resumeBullet: 'Deployed distributed Kafka data ingestion pipeline processing 500k+ daily events with 99.99% message delivery reliability across client integrations.',
      targetGapsAddressed: ['Distributed Data Pipelines', 'Reliability'],
    },
  ];

  // 3. Learning Modules
  const learningModules: LearningModule[] = [
    {
      id: 'mod_1',
      title: 'Forward Deployed Engineering: Field Discovery & Requirements Scoping',
      type: 'Architecture Blueprint',
      duration: '2.5 Hours',
      provider: 'FDE Career Academy',
      topics: ['Client Workshops', 'Technical Discovery', 'Scope Negotiation', 'Architecture Diagrams'],
    },
    {
      id: 'mod_2',
      title: 'Enterprise Single Sign-On (SAML 2.0, OAuth 2.0 & OIDC Deep Dive)',
      type: 'Hands-on Lab',
      duration: '4 Hours',
      provider: 'Cloud Security Institute',
      topics: ['Okta Integration', 'Multi-tenant RBAC', 'JWT Validation', 'API Security'],
    },
    {
      id: 'mod_3',
      title: 'Designing High-Throughput Customer Integration Adapters',
      type: 'Video Course',
      duration: '3.5 Hours',
      provider: 'System Design Guild',
      topics: ['REST/GraphQL Gateways', 'Rate Limiting', 'Webhook Retries', 'Data Contracts'],
    },
  ];

  const filteredPillars = selectedCategory === 'all'
    ? competencyPillars
    : competencyPillars.filter((p) => p.category === selectedCategory);

  const handleAddProjectBullet = (project: BridgeProject) => {
    setAddedProjects((prev) => new Set(prev).add(project.id));
    if (onAddSkillOrBullet) {
      onAddSkillOrBullet(project.resumeBullet);
    }
  };

  const toggleModuleCompletion = (modId: string) => {
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const overallFDEFit = Math.round(
    competencyPillars.reduce((acc, curr) => acc + curr.score, 0) / competencyPillars.length
  );

  return (
    <div className="bg-slate-900 border border-indigo-900/80 rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Header & FDE Transition Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/50 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white">FDE Role Transition Path</h3>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Forward Deployed Target</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Targeted evaluation of your background against Forward Deployed Engineer (FDE) requirements, highlighting experience gaps and actionable bridge projects.
            </p>
          </div>
        </div>

        {/* Readiness Meter Badge */}
        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">FDE Readiness Score</span>
            <span className="text-lg font-mono font-black text-indigo-400">{overallFDEFit}% Match</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center font-bold text-xs text-white">
            {overallFDEFit}%
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>1. Gap Analysis ({competencyPillars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Targeted Bridge Projects ({bridgeProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Learning Modules ({learningModules.length})</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="flex items-center space-x-1 px-2 text-[11px] text-slate-400">
            <span className="font-bold">Filter Gaps:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('client')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedCategory === 'client' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
            >
              Client-Facing
            </button>
            <button
              onClick={() => setSelectedCategory('technical')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedCategory === 'technical' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setSelectedCategory('security')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedCategory === 'security' ? 'bg-indigo-600 text-white' : 'hover:text-white'
              }`}
            >
              Security
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: COMPETENCY GAP ANALYSIS */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
            <Layers className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Forward Deployed Engineers bridge core system software with customer deployment. Below is your strength vs. gap profile across the 5 mandatory FDE competency pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-slate-900 rounded-lg text-indigo-400 border border-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{pillar.title}</h4>
                        <span className="text-[10px] font-mono text-indigo-300 uppercase">
                          {pillar.category} Competency
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className={`h-full transition-all duration-500 ${
                            pillar.score >= 80
                              ? 'bg-emerald-400'
                              : pillar.score >= 65
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${pillar.score}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-mono font-bold ${
                          pillar.score >= 80
                            ? 'text-emerald-400'
                            : pillar.score >= 65
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {pillar.score}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="space-y-1">
                      <span className="text-amber-400 font-bold flex items-center space-x-1 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Identified Resume Gap:</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {pillar.gapDescription}
                      </p>
                    </div>

                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                      <span className="text-indigo-300 font-bold flex items-center space-x-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Recommended Resume Fix:</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {pillar.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TARGETED BRIDGE PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
            <Code2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300">
                Portfolio-Ready FDE Bridge Projects
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Building one or two of these hands-on architecture projects will directly resolve the experience gaps above and give you bulletproof talking points in FDE technical interviews.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {bridgeProjects.map((proj) => {
              const isAdded = addedProjects.has(proj.id);
              return (
                <div
                  key={proj.id}
                  className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-3 hover:border-indigo-500/50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-extrabold text-white">{proj.title}</h4>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {proj.difficulty}
                        </span>
                        <span className="text-xs font-mono text-slate-400">• {proj.timeEstimate}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    </div>

                    <button
                      onClick={() => handleAddProjectBullet(proj)}
                      disabled={isAdded}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 self-start sm:self-auto flex-shrink-0 ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Bullet Added to Draft</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Add Bullet to Resume</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                      Tech Stack:
                    </span>
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Generated Resume Bullet Preview */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                      Target Resume Bullet Preview:
                    </span>
                    <p className="text-slate-200 italic">"{proj.resumeBullet}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-purple-300">
                Curated FDE Mastery Learning Modules
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Targeted quick-study blueprints to master enterprise discovery workshops, client onboarding security, and high-throughput integration patterns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {learningModules.map((mod) => {
              const isCompleted = completedModules.has(mod.id);
              return (
                <div
                  key={mod.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isCompleted
                      ? 'bg-slate-950/80 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-800/90 border-slate-700 text-white hover:border-purple-500/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-300">
                      <span>{mod.type}</span>
                      <span>{mod.duration}</span>
                    </div>

                    <h4 className="text-xs font-extrabold text-white leading-snug">{mod.title}</h4>

                    <span className="text-[10px] text-slate-400 block">{mod.provider}</span>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Core Concepts:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {mod.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleModuleCompletion(mod.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 mt-2 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Module Completed</span>
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>Start Learning</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
