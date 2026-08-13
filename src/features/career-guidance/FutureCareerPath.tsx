import React, { useState } from 'react';
import { CareerPathYear, CareerMilestoneGoal } from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Circle,
  PlusCircle,
  Check,
  ChevronRight,
  ShieldAlert,
  Zap,
  Target,
  Rocket,
  Sparkles,
  DollarSign,
  Layers,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Compass,
} from 'lucide-react';

interface FutureCareerPathProps {
  onAddSkillToResume?: (skillName: string) => void;
  targetRole?: string;
}

export const FutureCareerPath: React.FC<FutureCareerPathProps> = ({
  onAddSkillToResume,
  targetRole = 'Forward Deployed Engineer (FDE)',
}) => {
  const [levelTrack, setLevelTrack] = useState<'staff' | 'principal'>('staff');
  const [expandedYear, setExpandedYear] = useState<number | null>(1);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(
    new Set(['y1_m1', 'y1_m2'])
  );
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const staffPathData: CareerPathYear[] = [
    {
      year: 1,
      title: 'Year 1: Senior Field Engineer & Tech Lead',
      targetTitle: 'Senior FDE (L5 -> L6 Pipeline)',
      expectedTC: '$210,000 – $265,000 TC',
      focusArea: 'Autonomous Integration Execution & Client Architecture Scoping',
      keySkills: [
        'Agentic RAG Orchestration',
        'Enterprise SSO / SAML Security',
        'Client Discovery Workshops',
        'Real-time Streaming ETL (Kafka)',
      ],
      strategicDeliverable:
        'Deliver 4+ production customer pilot integrations on-site; reduce average integration onboarding cycle from 6 weeks to 10 days.',
      milestones: [
        {
          id: 'y1_m1',
          title: 'Lead On-Site Technical Discovery',
          metricTarget: 'Conduct technical workshops with 5+ client CTOs & scope API boundary contracts.',
          completed: true,
        },
        {
          id: 'y1_m2',
          title: 'Build Reusable Tool-Calling Gateway',
          metricTarget: 'Architect a standardized REST/GraphQL connector used across 3 major deployments.',
          completed: true,
        },
        {
          id: 'y1_m3',
          title: 'Quantify Integration ROI Metric',
          metricTarget: 'Publish internal case study proving 40% latency reduction in field deployment pipelines.',
          completed: false,
        },
      ],
    },
    {
      year: 2,
      title: 'Year 2: Staff Forward Deployed Engineer (L6)',
      targetTitle: 'Staff FDE / Field Tech Lead',
      expectedTC: '$280,000 – $350,000 TC',
      focusArea: 'Multi-Client Architecture Strategy & Systemic Platform Playbooks',
      keySkills: [
        'Multi-Tenant Cloud Governance',
        'Executive C-Suite Stakeholder Scoping',
        'LLM Fine-Tuning & Evaluation',
        'Field Deployment Playbook Design',
      ],
      strategicDeliverable:
        'Standardize the company-wide FDE Deployment Playbook; mentor 4 junior/mid FDEs and lead high-risk account renewals.',
      milestones: [
        {
          id: 'y2_m1',
          title: 'Author Enterprise Deployment Standard',
          metricTarget: 'Define security & data governance standards adopted by 100% of engineering field teams.',
          completed: false,
        },
        {
          id: 'y2_m2',
          title: 'Expand Account Expansion ARR',
          metricTarget: 'Partner with Solutions Director to expand 3 flagship accounts by >$1.5M in incremental ARR.',
          completed: false,
        },
        {
          id: 'y2_m3',
          title: 'Cross-Functional Product Feedback Loop',
          metricTarget: 'Drive 8 major platform features from client field friction points back into core product roadmap.',
          completed: false,
        },
      ],
    },
    {
      year: 3,
      title: 'Year 3: Principal FDE / Global Solutions Architect (L7)',
      targetTitle: 'Principal FDE & Global Field Lead',
      expectedTC: '$380,000 – $480,000+ TC',
      focusArea: 'Strategic Ecosystem Leadership & Critical Escalation Mastery',
      keySkills: [
        'Organization-Wide AI Strategy',
        'High-Stakes Account Escalations',
        'Zero-Trust AI Sandbox Security',
        'Strategic Partner Ecosystems',
      ],
      strategicDeliverable:
        'Serve as the global authority for mission-critical client deployments; advise C-suite executives on AI transformation.',
      milestones: [
        {
          id: 'y3_m1',
          title: 'Global Client AI Transformation Blueprint',
          metricTarget: 'Architect & execute multi-region AI deployment for Fortune 50 enterprise client.',
          completed: false,
        },
        {
          id: 'y3_m2',
          title: 'Field Engineering Mentorship Engine',
          metricTarget: 'Build the organization’s FDE academy, scaling field engineering headcount by 30% with 95% retention.',
          completed: false,
        },
        {
          id: 'y3_m3',
          title: 'C-Suite Strategic Advisory Board',
          metricTarget: 'Establish quarterly advisory sessions with top 10 key client CTOs & CISOs.',
          completed: false,
        },
      ],
    },
  ];

  const principalPathData: CareerPathYear[] = [
    {
      year: 1,
      title: 'Year 1: Staff FDE & Strategic Account Lead',
      targetTitle: 'Staff FDE (Level 6)',
      expectedTC: '$260,000 – $320,000 TC',
      focusArea: 'High-Value Client Engagements & Multi-Team Architectural Ownership',
      keySkills: [
        'Vector DB Scalability at Scale',
        'Executive Client Technical Steering',
        'API Gateway & SLA Enforcement',
        'Rapid Proof-of-Concept Acceleration',
      ],
      strategicDeliverable:
        'Direct technical integration strategy for top 3 strategic clients generating over $5M ARR.',
      milestones: [
        {
          id: 'p1_m1',
          title: 'Unblock Mission-Critical Deployments',
          metricTarget: 'Resolve 100% of tier-1 escalation bottlenecks within 48 hours across accounts.',
          completed: true,
        },
        {
          id: 'p1_m2',
          title: 'Design Scalable Client Sandbox',
          metricTarget: 'Build isolated testing sandboxes that cut client validation phase from 1 month to 3 days.',
          completed: false,
        },
      ],
    },
    {
      year: 2,
      title: 'Year 2: Principal FDE & Field Technical Director',
      targetTitle: 'Principal FDE (Level 7)',
      expectedTC: '$360,000 – $450,000 TC',
      focusArea: 'Company-Wide Technology Strategy & Partner Integration Ecosystems',
      keySkills: [
        'Enterprise AI Architecture',
        'Multi-Cloud Compliance (SOC2/FedRAMP)',
        'Global Engineering Strategy',
        'Commercial Deal Architecture',
      ],
      strategicDeliverable:
        'Establish strategic technical alliances with cloud hyperscalers (AWS, GCP, Azure) for field co-selling.',
      milestones: [
        {
          id: 'p2_m1',
          title: 'Co-Architect Hyperscaler Integration',
          metricTarget: 'Launch joint solution template featured in major cloud partner marketplace.',
          completed: false,
        },
        {
          id: 'p2_m2',
          title: 'Scale Technical Field Org',
          metricTarget: 'Oversee hiring bar and technical standards for 20+ global field engineers.',
          completed: false,
        },
      ],
    },
    {
      year: 3,
      title: 'Year 3: Distinguished Field Architect / Partner (L8)',
      targetTitle: 'Distinguished Architect & Partner',
      expectedTC: '$500,000 – $700,000+ TC (Equity Heavy)',
      focusArea: 'Industry Technical Vision & C-Level Board-Level Leadership',
      keySkills: [
        'Board-Level Technical Communication',
        'M&A Technical Due Diligence',
        'Global Field Infrastructure',
        'Industry Standards Authoring',
      ],
      strategicDeliverable:
        'Drive long-term technical vision for enterprise AI field deployments industry-wide.',
      milestones: [
        {
          id: 'p3_m1',
          title: 'Industry Keynote & Standard Authoring',
          metricTarget: 'Deliver keynote at top tech summit on Enterprise Autonomous AI Systems.',
          completed: false,
        },
        {
          id: 'p3_m2',
          title: 'Multi-Million Dollar Deal Scoping',
          metricTarget: 'Directly technical-close $20M+ multi-year transformational enterprise contract.',
          completed: false,
        },
      ],
    },
  ];

  const currentPath = levelTrack === 'staff' ? staffPathData : principalPathData;

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSkill = (skillName: string) => {
    setAddedSkills((prev) => new Set(prev).add(skillName));
    if (onAddSkillToResume) {
      onAddSkillToResume(skillName);
    }
  };

  // Calculate overall progress percentage
  const totalMilestonesCount = currentPath.reduce((acc, y) => acc + y.milestones.length, 0);
  const completedCount = currentPath.reduce(
    (acc, y) => acc + y.milestones.filter((m) => completedMilestones.has(m.id)).length,
    0
  );
  const progressPercent = Math.round((completedCount / totalMilestonesCount) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white shadow-md flex-shrink-0">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Future Career Path: 3-Year Growth Roadmap
              </h3>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Staff & Principal Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Step-by-step 36-month roadmap designed to elevate your profile to Staff (L6) or Principal (L7) FDE leadership.
            </p>
          </div>
        </div>

        {/* Level Track Selector Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setLevelTrack('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
              levelTrack === 'staff'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Staff FDE Track (L6)</span>
          </button>

          <button
            onClick={() => setLevelTrack('principal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
              levelTrack === 'principal'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Principal Track (L7/L8)</span>
          </button>
        </div>
      </div>

      {/* Progress & Milestone Velocity Bar */}
      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Milestone Goal Completion Velocity</span>
            </span>
            <span className="text-indigo-300 font-mono">
              {completedCount} / {totalMilestonesCount} Milestones ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">3-Year Trajectory Compensation</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            {levelTrack === 'staff' ? '$210k ➔ $480k+ TC' : '$260k ➔ $700k+ TC'}
          </span>
        </div>
      </div>

      {/* 3-Year Interactive Step Timeline */}
      <div className="space-y-4 relative">
        {/* Connecting Vertical Timeline Line */}
        <div className="hidden lg:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 z-0"></div>

        {currentPath.map((yearItem) => {
          const isExpanded = expandedYear === yearItem.year;
          const yearCompletedMilestones = yearItem.milestones.filter((m) =>
            completedMilestones.has(m.id)
          ).length;

          return (
            <div
              key={yearItem.year}
              className={`relative z-10 bg-slate-800/90 rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-indigo-500/80 shadow-lg ring-1 ring-indigo-500/30'
                  : 'border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {/* Year Step Banner / Header */}
              <div
                onClick={() => setExpandedYear(isExpanded ? null : yearItem.year)}
                className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-850 hover:bg-slate-800 transition"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl font-extrabold text-sm flex items-center justify-center font-mono shadow ${
                      yearItem.year === 1
                        ? 'bg-indigo-600 text-white'
                        : yearItem.year === 2
                        ? 'bg-purple-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Y{yearItem.year}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm text-white">{yearItem.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-700">
                        {yearItem.targetTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{yearItem.focusArea}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-emerald-400 block">
                      {yearItem.expectedTC}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {yearCompletedMilestones} / {yearItem.milestones.length} Goals
                    </span>
                  </div>

                  <button className="p-1.5 bg-slate-900 rounded-lg text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Year Details Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-700/80 bg-slate-900/60 space-y-5">
                  {/* Strategic Deliverable Highlight */}
                  <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 p-3.5 rounded-xl border border-indigo-800/60 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Year {yearItem.year} Capstone Strategic Deliverable</span>
                    </span>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {yearItem.strategicDeliverable}
                    </p>
                  </div>

                  {/* Required Technical & Leadership Skills */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Core Target Skills to Master:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {yearItem.keySkills.map((skill, sIdx) => {
                        const isAdded = addedSkills.has(skill);
                        return (
                          <div
                            key={sIdx}
                            className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2 text-xs font-bold text-slate-200"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleAddSkill(skill)}
                              disabled={isAdded}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition flex items-center space-x-1 ${
                                isAdded
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>In Resume</span>
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="w-3 h-3" />
                                  <span>+ Resume</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Milestone Goals Checklist */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                      Measurable Milestone Goals:
                    </span>

                    <div className="space-y-2">
                      {yearItem.milestones.map((milestone) => {
                        const isChecked = completedMilestones.has(milestone.id);
                        return (
                          <div
                            key={milestone.id}
                            onClick={() => toggleMilestone(milestone.id)}
                            className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                              isChecked
                                ? 'bg-indigo-950/40 border-indigo-500/60 text-slate-200'
                                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                            }`}
                          >
                            <button className="mt-0.5 text-indigo-400 hover:text-indigo-300 flex-shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500" />
                              )}
                            </button>

                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-bold text-xs ${
                                    isChecked ? 'line-through text-slate-400' : 'text-white'
                                  }`}
                                >
                                  {milestone.title}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {isChecked ? 'Completed Goal' : 'Pending Goal'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-snug">
                                {milestone.metricTarget}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
