import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Map,
  ChevronRight,
  Circle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
} from 'lucide-react';
import { CuratedLAndDSkill, DynamicFutureRoleOption } from '../../utils/dynamicDomainRoadmap';

interface SkillProgressionMapProps {
  primaryRoleTitle: string;
  targetRoleOptions: DynamicFutureRoleOption[];
  curatedSkillsToMaster: CuratedLAndDSkill[];
  candidateName?: string;
  selectedRoleIndex: number;
  onSelectRole: (idx: number) => void;
  onSkillClick?: (skillName: string) => void;
}

const ImportanceColor = {
  Critical: { ring: 'ring-rose-500/60', bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800 border-rose-200', bar: 'bg-rose-500', dot: 'bg-rose-500' },
  High: { ring: 'ring-amber-400/60', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-200', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  Medium: { ring: 'ring-blue-400/50', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800 border-blue-200', bar: 'bg-blue-500', dot: 'bg-blue-500' },
};

// Radial progress ring SVG
const RadialProgress: React.FC<{ current: number; target: number; size?: number }> = ({
  current,
  target,
  size = 52,
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const currentDash = (current / 100) * circumference;
  const gapDash = ((target - current) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      {/* Current */}
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="#6366f1" strokeWidth="5"
        strokeDasharray={`${currentDash} ${circumference - currentDash}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      {/* Gap (target) */}
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="#c7d2fe" strokeWidth="5"
        strokeDasharray={`${gapDash} ${circumference - gapDash}`}
        strokeDashoffset={-currentDash}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const SkillProgressionMap: React.FC<SkillProgressionMapProps> = ({
  primaryRoleTitle,
  targetRoleOptions,
  curatedSkillsToMaster,
  candidateName,
  selectedRoleIndex,
  onSelectRole,
  onSkillClick,
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [visibleSkills, setVisibleSkills] = useState<Set<number>>(new Set());
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectedRole = targetRoleOptions[selectedRoleIndex] || targetRoleOptions[0];

  // Intersection observer for skill entry animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setVisibleSkills((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.2 }
    );

    skillRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [curatedSkillsToMaster.length]);

  return (
    <div className="space-y-6">
      {/* Phase Timeline Header */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Map className="w-5 h-5 text-indigo-600" />
          <span>0. Visual Skill Progression Map</span>
        </h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Curated for {candidateName || 'Candidate'}
        </span>
      </div>

      {/* 3-Phase Path */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        {/* Phase strip */}
        <div className="grid grid-cols-3 text-center text-xs font-bold">
          <div className="bg-slate-100 py-2 text-slate-600 border-r border-slate-200">📍 Phase 1 — NOW</div>
          <div className="bg-indigo-600 py-2 text-white border-r border-indigo-700">🚀 Phase 2 — BRIDGE (Study This)</div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-white">🏆 Phase 3 — TARGET ROLE</div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200">
          {/* Phase 1: Current Skills */}
          <div className="p-5 space-y-3 bg-slate-50/50">
            <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center space-x-1">
              <Circle className="w-3 h-3 text-slate-400" />
              <span>Current Skills Detected</span>
            </div>
            <div className="text-[11px] font-bold text-slate-500 mb-2">
              {primaryRoleTitle}
            </div>
            <div className="space-y-2">
              {curatedSkillsToMaster.map((skill, sIdx) => {
                const colors = ImportanceColor[skill.importance];
                return (
                  <div key={sIdx} className={`flex items-center justify-between rounded-lg px-3 py-1.5 border ${colors.bg} ${colors.ring} ring-1`}>
                    <span className={`text-[11px] font-semibold ${colors.text} truncate mr-2`}>{skill.skillName.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-600 shrink-0">{skill.currentProficiency}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 2: Skills to Study (Bridge) */}
          <div className="p-5 space-y-3 bg-indigo-50/30">
            <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wide flex items-center space-x-1">
              <Zap className="w-3 h-3 text-indigo-500" />
              <span>What to Study</span>
            </div>
            <div className="space-y-3">
              {curatedSkillsToMaster.map((skill, sIdx) => {
                const colors = ImportanceColor[skill.importance];
                const gap = skill.targetProficiency - skill.currentProficiency;
                return (
                  <div
                    key={sIdx}
                    className={`rounded-xl p-3 border cursor-pointer transition-all hover:shadow-md ${
                      hoveredSkill === skill.skillName ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white'
                    }`}
                    onMouseEnter={() => setHoveredSkill(skill.skillName)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => onSkillClick?.(skill.skillName)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-800 leading-tight">{skill.skillName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${colors.badge}`}>
                        +{gap}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full flex">
                        <div className={`h-full ${colors.bar} opacity-60`} style={{ width: `${skill.currentProficiency}%` }} />
                        <div className={`h-full ${colors.bar}`} style={{ width: `${gap}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium">
                      <span>Current: {skill.currentProficiency}%</span>
                      <span className="text-indigo-600 font-bold">Target: {skill.targetProficiency}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 3: Target Role Cards */}
          <div className="p-5 space-y-3 bg-emerald-50/20">
            <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Target Roles</span>
            </div>
            <div className="space-y-2">
              {targetRoleOptions.map((role, rIdx) => (
                <div
                  key={rIdx}
                  onClick={() => onSelectRole(rIdx)}
                  className={`rounded-xl p-3 border cursor-pointer transition-all ${
                    rIdx === selectedRoleIndex
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">{role.roleTitle}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      rIdx === selectedRoleIndex ? 'bg-emerald-600 text-white' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {role.matchPercentage}%
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600">{role.expectedSalaryRange}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{role.timeHorizon}</div>
                  {rIdx === selectedRoleIndex && (
                    <div className="flex items-center mt-1 text-[9px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" />
                      Active Focus
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connecting Arrow Banner */}
        <div className="bg-gradient-to-r from-slate-100 via-indigo-100 to-emerald-100 px-6 py-3 flex items-center justify-between text-xs text-slate-600 font-medium border-t border-slate-200">
          <span className="text-slate-500">📌 Click any "Bridge" skill card to jump to its learning resources below</span>
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>Active Target: {selectedRole?.roleTitle || 'Select a role'}</span>
          </div>
        </div>
      </div>

      {/* Skill Proficiency Ring Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {curatedSkillsToMaster.map((skill, sIdx) => {
          const colors = ImportanceColor[skill.importance];
          const isVisible = visibleSkills.has(sIdx);
          return (
            <div
              key={sIdx}
              ref={(el) => { skillRefs.current[sIdx] = el; }}
              data-idx={sIdx}
              className={`flex flex-col items-center p-3 bg-white border ${colors.ring} ring-1 rounded-2xl cursor-pointer hover:shadow-md transition-all ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transition: `opacity 0.4s ease ${sIdx * 0.1}s, transform 0.4s ease ${sIdx * 0.1}s` }}
              onClick={() => onSkillClick?.(skill.skillName)}
            >
              <div className="relative">
                <RadialProgress current={skill.currentProficiency} target={skill.targetProficiency} size={52} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-700">{skill.currentProficiency}%</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className={`text-[9px] font-extrabold uppercase ${colors.text}`}>{skill.importance}</div>
                <div className="text-[10px] font-semibold text-slate-700 mt-0.5 leading-tight text-center">
                  {skill.skillName.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
