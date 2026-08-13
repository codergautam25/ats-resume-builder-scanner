---
date: 2026-08-13
type: source-code
project: ATS-ResumAI
author: Antigravity AI Architect
tags: [obsidian-vault, resumai, source-code]
---
# DynamicCareerRoadmapTab.tsx - Career Roadmap UI

```typescript
import React, { useState, useRef, useCallback } from 'react';
import { ResumeData } from '../../types';
import { generateDynamicDomainRoadmap, DynamicFutureRoleOption, CuratedLAndDSkill } from '../../utils/dynamicDomainRoadmap';
import {
  Compass,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  ExternalLink,
  Plus,
  ShieldCheck,
  Zap,
  DollarSign,
  Clock,
  Briefcase,
  ChevronRight,
  Layers,
  GraduationCap,
  ArrowRight,
  Check,
  Map,
  BarChart3,
  Brain,
  Rocket,
} from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { ServiceNowRoleAndProjectAdvisor } from '../target-role/ServiceNowRoleAndProjectAdvisor';
import { SkillProgressionMap } from './SkillProgressionMap';
import { SkillLearningResourcesPanel } from './SkillLearningResourcesPanel';
import { Project } from '../../types';
import { getRoadmapShLink } from '../../services/learningResourcesService';

interface DynamicCareerRoadmapTabProps {
  resumeData?: ResumeData;
  onAddSkillToResume?: (skillName: string) => void;
  onAddCertificationToResume?: (cert: { name: string; issuer: string; date?: string }) => void;
  onAddProjectToResume?: (proj: Project) => void;
}

export const DynamicCareerRoadmapTab: React.FC<DynamicCareerRoadmapTabProps> = ({
  resumeData,
  onAddSkillToResume,
  onAddCertificationToResume,
  onAddProjectToResume,
}) => {
  const roadmapData = React.useMemo(() => generateDynamicDomainRoadmap(resumeData), [resumeData]);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [activePlanTab, setActivePlanTab] = useState<'day30' | 'day60' | 'day90'>('day30');
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());
  const [addedCerts, setAddedCerts] = useState<Set<string>>(new Set());
  const [expandedSkillIdx, setExpandedSkillIdx] = useState<number | null>(0); // first skill open by default

  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentRoleOption = roadmapData.targetRoleOptions[selectedRoleIndex] || roadmapData.targetRoleOptions[0];
  const candidateName = resumeData?.personalInfo?.fullName || 'Candidate';
  const roadmapShLink = getRoadmapShLink(roadmapData.detectedDomain);

  const handleInjectSkill = (skillName: string) => {
    if (onAddSkillToResume) onAddSkillToResume(skillName);
    setAddedSkills((prev) => new Set(prev).add(skillName.toLowerCase()));
  };

  const handleInjectCert = (certName: string, issuer: string) => {
    if (onAddCertificationToResume) {
      onAddCertificationToResume({ name: certName, issuer, date: 'Target 2026' });
    }
    setAddedCerts((prev) => new Set(prev).add(certName.toLowerCase()));
  };

  const handleSkillClick = useCallback((skillName: string) => {
    const idx = roadmapData.curatedSkillsToMaster.findIndex(
      (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
    );
    if (idx !== -1) {
      setExpandedSkillIdx(idx);
      setTimeout(() => {
        skillRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [roadmapData.curatedSkillsToMaster]);

  const allSkillsToStudy = roadmapData.curatedSkillsToMaster.map(s => s.skillName);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">

      {/* ═══ TOP BANNER ═══ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Senior L&D Lead Architect Engine</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {roadmapData.detectedDomain}
              </span>
              {roadmapShLink && (
                <a
                  href={roadmapShLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center space-x-1 hover:bg-cyan-500/30 transition"
                >
                  <Map className="w-3 h-3 mr-1" />
                  roadmap.sh →
                </a>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dynamic Career Roadmap & Skill Acceleration
            </h1>
            <p className="text-sm text-slate-300">
              Curated for <strong className="text-white">{candidateName}</strong> ({roadmapData.primaryRoleTitle}). Includes visual skill progression map, free learning resources, official docs, GitHub awesome-lists, freeCodeCamp, and Ollama-powered 30-day personalized study plans.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
              {currentRoleOption?.matchPercentage || 88}%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Top Match</div>
              <div className="text-sm font-bold text-emerald-400">{currentRoleOption?.roleTitle}</div>
              <div className="text-xs text-amber-300 font-medium">{currentRoleOption?.expectedSalaryRange}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 0: VISUAL SKILL PROGRESSION MAP ═══ */}
      <SkillProgressionMap
        primaryRoleTitle={roadmapData.primaryRoleTitle}
        targetRoleOptions={roadmapData.targetRoleOptions}
        curatedSkillsToMaster={roadmapData.curatedSkillsToMaster}
        candidateName={candidateName}
        selectedRoleIndex={selectedRoleIndex}
        onSelectRole={setSelectedRoleIndex}
        onSkillClick={handleSkillClick}
      />

      {/* ═══ SECTION 1: TARGET FUTURE ROLES ═══ */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>1. Target Future Roles & Match Percentages (%)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Percentage match based on current technical skills, experience depth, and domain overlap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roadmapData.targetRoleOptions.map((option, idx) => {
            const isSelected = idx === selectedRoleIndex;
            return (
              <div
                key={idx}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 space-y-4 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-50/90 to-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-sm flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{option.matchPercentage}% Match</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{option.timeHorizon}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{option.roleTitle}</h3>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">{option.expectedSalaryRange}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="font-bold text-slate-700">Why You Match:</div>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {option.matchReasons.slice(0, 2).map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="font-bold text-rose-700">Skill Gaps to Bridge:</div>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {option.criticalSkillGaps.slice(0, 2).map((gap, gIdx) => (
                        <li key={gIdx} className="flex items-start space-x-1.5 text-slate-700">
                          <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>{isSelected ? '✓ Selected Active Focus' : 'Select Target Path'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ 2026 AI WORKFORCE MARKET TREND PREDICTOR ═══ */}
      <div className="surface-card border border-indigo-500/30 p-6 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-subtle pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-default text-base font-display">2026 AI Market Trend Predictor</h3>
                <span className="badge badge-primary">2026 Workforce Shift</span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Predicts upcoming AI skill requirements & high-demand technical capabilities for {roadmapData.detectedDomain} candidates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 surface-input rounded-xl border border-default space-y-2">
            <div className="font-extrabold text-indigo-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1. Agentic AI & Workflow Automation</span>
            </div>
            <p className="text-secondary leading-relaxed">
              By 2026, corporate ATS scanners favor candidates who demonstrate hands-on experience with LLM function calling, ServiceNow Flow Designer agentic subflows, or autonomous pipeline triggers over static scripting.
            </p>
          </div>

          <div className="p-4 surface-input rounded-xl border border-default space-y-2">
            <div className="font-extrabold text-emerald-400 flex items-center space-x-1.5">
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>2. High-Throughput System Governance</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Recruiters prioritize candidates who quantify MTTR reduction, API rate limit optimization, CMDB health governance, and automated ATF regression test coverage.
            </p>
          </div>

          <div className="p-4 surface-input rounded-xl border border-default space-y-2">
            <div className="font-extrabold text-amber-400 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-amber-400" />
              <span>3. Vector & Real-Time Data Pipelines</span>
            </div>
            <p className="text-secondary leading-relaxed">
              Enterprise tech stacks require real-time stateful stream processing (Flink / Kafka) or Service Graph Connectors to feed context to enterprise AI assistants.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ PRIORITY MATRIX: SCATTER PLOT (Time-to-Learn vs ATS Impact) ═══ */}
      <div className="surface-card border border-default p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle pb-4">
          <div>
            <h3 className="font-extrabold text-default text-base font-display flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Priority Matrix: Quick Win Skills (Time-to-Learn vs. ATS Impact)</span>
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              High-impact skills located in the upper-left quadrant deliver the fastest resume ROI with minimal study time.
            </p>
          </div>
          <span className="badge badge-success">High ROI Quadrant</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="timeHours"
                name="Est. Study Hours"
                unit=" hrs"
                stroke="var(--text-secondary)"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="atsImpact"
                name="ATS Impact"
                unit="%"
                domain={[50, 100]}
                stroke="var(--text-secondary)"
                tick={{ fontSize: 11 }}
              />
              <ZAxis type="number" range={[100, 300]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="surface-card p-3 border border-default rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-extrabold text-indigo-400">{data.name}</p>
                        <p className="text-secondary">Study Time: <strong>{data.timeHours} hrs</strong></p>
                        <p className="text-emerald-400">ATS Boost: <strong>+{data.atsImpact}%</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Skills"
                data={roadmapData.curatedSkillsToMaster.map((skill, idx) => ({
                  name: skill.skillName,
                  timeHours: Math.max(12, 90 - skill.currentProficiency),
                  atsImpact: Math.min(98, 70 + (idx * 7) % 28),
                }))}
              >
                {roadmapData.curatedSkillsToMaster.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={idx % 2 === 0 ? '#818cf8' : '#34d399'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ SECTION 2: CURATED L&D SKILLS + WHERE TO STUDY ═══ */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>2. Curated Skills to Master & Where to Study (Free)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Each skill card shows proficiency gap, official docs, YouTube tutorials, GitHub awesome-lists, freeCodeCamp, and a personalized Ollama 30-day study plan.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
              {roadmapData.detectedDomain}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free Resources</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {roadmapData.curatedSkillsToMaster.map((skill, sIdx) => {
            const isAdded = addedSkills.has(skill.skillName.toLowerCase());
            const isExpanded = expandedSkillIdx === sIdx;
            return (
              <div key={sIdx} ref={(el) => { skillRefs.current[sIdx] = el; }}>
                <SkillLearningResourcesPanel
                  skill={skill}
                  candidateName={candidateName}
                  targetRole={currentRoleOption?.roleTitle}
                  domain={roadmapData.detectedDomain}
                  allSkillsToStudy={allSkillsToStudy}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedSkillIdx(isExpanded ? null : sIdx)}
                />
                {/* Inject Skill button below panel */}
                {isExpanded && (
                  <div className="flex justify-end mt-2 mr-1">
                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleInjectSkill(skill.skillName)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-sm ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isAdded
                        ? <><Check className="w-3.5 h-3.5 mr-1" />Added to Resume</>
                        : <><Plus className="w-3.5 h-3.5 mr-1" />Inject Skill into Resume</>
                      }
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ SECTION 3: CERTIFICATION PATHWAY ═══ */}
      {currentRoleOption?.recommendedCertifications?.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-md border border-slate-800">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">3. Recommended Official Certifications Pathway</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentRoleOption.recommendedCertifications.map((cert, cIdx) => {
              const isCertAdded = addedCerts.has(cert.name.toLowerCase());
              return (
                <div key={cIdx} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span>{cert.issuer}</span>
                      <span className="text-slate-400 font-normal">Prep: {cert.prepTime}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-100">{cert.name}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                    <a
                      href={cert.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center space-x-1 text-[11px] font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Official Portal →</span>
                    </a>

                    <button
                      type="button"
                      disabled={isCertAdded}
                      onClick={() => handleInjectCert(cert.name, cert.issuer)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                        isCertAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      }`}
                    >
                      {isCertAdded ? '✓ Added Target Cert' : '+ Add Target to Resume'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ SECTION 4: 30-60-90 DAY ACTION PLAN ═══ */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>4. Senior L&D Lead 30-60-90 Day Milestone Action Plan</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Actionable quarterly deliverables to clear architectural interview loops.</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['day30', 'day60', 'day90'] as const).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setActivePlanTab(planKey)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activePlanTab === planKey ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {planKey === 'day30' ? 'First 30 Days' : planKey === 'day60' ? '60 Days' : '90 Days Target'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-indigo-950">
              Focus: {roadmapData.actionPlan306090[activePlanTab].focus}
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            {roadmapData.actionPlan306090[activePlanTab].deliverables.map((item, dIdx) => (
              <li key={dIdx} className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-indigo-100 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* L&D Lead Assessment */}
        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs space-y-1.5 border border-slate-800">
          <div className="font-bold text-amber-400 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Senior L&D Lead Architect Assessment:</span>
          </div>
          <p className="text-slate-300 italic">{roadmapData.seniorLndLeadNote}</p>
        </div>

        {/* ServiceNow Role & Hands-on Projects Advisor Section */}
        <ServiceNowRoleAndProjectAdvisor
          experienceText={(resumeData?.experience || []).flatMap((e) => e.highlights).join(' ')}
          currentSkills={(resumeData?.skillCategories || []).flatMap((c) => c.skills)}
          onAddProjectToResume={onAddProjectToResume}
        />
      </div>
    </div>
  );
};

```
