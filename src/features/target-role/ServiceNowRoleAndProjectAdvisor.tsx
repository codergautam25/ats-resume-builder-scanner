import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Briefcase,
  Layers,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu,
  Plus,
  BookOpen,
  DollarSign,
  Clock,
  Target,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import {
  ServiceNowAdvisorSuggestions,
  SuggestedRoleOption,
  SuggestedProjectOption,
  suggestRolesAndProjectsWithOllama,
  SERVICENOW_CURATED_ROLES,
  SERVICENOW_CURATED_PROJECTS,
  getLocalOllamaModels,
  OllamaModelInfo,
} from '../../services/ollamaService';
import { Project } from '../../types';

interface ServiceNowRoleAndProjectAdvisorProps {
  experienceText?: string;
  currentSkills?: string[];
  onSelectTargetRole?: (roleTitle: string) => void;
  onAddProjectToResume?: (proj: Project) => void;
}

export const ServiceNowRoleAndProjectAdvisor: React.FC<ServiceNowRoleAndProjectAdvisorProps> = ({
  experienceText = '',
  currentSkills = [],
  onSelectTargetRole,
  onAddProjectToResume,
}) => {
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ServiceNowAdvisorSuggestions>({
    candidateDomain: 'ServiceNow',
    currentSeniority: 'ServiceNow Developer (5+ YoE)',
    suggestedRoles: SERVICENOW_CURATED_ROLES,
    suggestedProjects: SERVICENOW_CURATED_PROJECTS,
  });
  const [addedProjectIds, setAddedProjectIds] = useState<Record<string, boolean>>({});
  const [selectedModel, setSelectedModel] = useState<string>('qwen2.5-coder:1.5b');
  const [ollamaModels, setOllamaModels] = useState<OllamaModelInfo[]>([]);

  useEffect(() => {
    getLocalOllamaModels().then((models) => {
      setOllamaModels(models);
      if (models.length > 0) setSelectedModel(models[0].name);
    });
  }, []);

  const handleGenerateAdvisorOllama = async () => {
    setIsLoading(true);
    try {
      const res = await suggestRolesAndProjectsWithOllama({
        candidateDomain: 'ServiceNow',
        experienceText,
        currentSkills,
        modelName: selectedModel,
      });
      setSuggestions(res);
    } catch (err) {
      console.error('Advisor generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = (proj: SuggestedProjectOption) => {
    if (onAddProjectToResume) {
      const formattedProj: Project = {
        id: `proj-sn-${Date.now()}`,
        title: proj.title,
        subtitle: `${proj.focusModule} Project`,
        startDate: '2024',
        endDate: 'Present',
        highlights: [
          proj.description,
          `Key Impact: ${proj.impactMetrics}`,
          ...proj.stepByStepMilestones.map((m) => `Milestone: ${m}`),
        ],
        technologies: proj.technologies,
      };
      onAddProjectToResume(formattedProj);
      setAddedProjectIds((prev) => ({ ...prev, [proj.id]: true }));
    }
  };

  const filteredProjects =
    activeModuleFilter === 'ALL'
      ? suggestions.suggestedProjects
      : suggestions.suggestedProjects.filter(
          (p) => p.focusModule.toUpperCase() === activeModuleFilter || p.technologies.some((t) => t.toUpperCase().includes(activeModuleFilter))
        );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-6 backdrop-blur-xl">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base tracking-wide flex items-center">
              ServiceNow Career Roles & Hands-On Projects Advisor
              <span className="ml-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Ollama Local LLM Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              AI recommendations on what roles and hands-on projects you can do based on your ServiceNow experience (ITSM, CMDB, Flow Designer, ATF)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {ollamaModels.length > 0 && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              {ollamaModels.map((m) => (
                <option key={m.name} value={m.name}>
                  🤖 {m.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleGenerateAdvisorOllama}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
            {isLoading ? 'Analyzing Experience via Ollama...' : '⚡ Re-Analyze & Generate with Ollama'}
          </button>
        </div>
      </div>

      {/* SECTION 1: TARGET ROLES CANDIDATE CAN DO */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-cyan-400" />
            Target ServiceNow Roles You Can Transition To (Based on Experience)
          </h4>
          <span className="text-xs text-slate-400">Calculated Match % & Salary Range</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.suggestedRoles.map((role, idx) => (
            <div
              key={idx}
              className="bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {role.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {role.matchPercentage}% Match
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center text-emerald-400 font-medium">
                    <DollarSign className="w-3 h-3 mr-0.5" />
                    {role.avgSalaryRange}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-0.5 text-slate-500" />
                    {role.timeframe}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{role.description}</p>

                {/* Focus Modules */}
                <div className="pt-1">
                  <span className="block text-[10px] font-medium text-slate-500 mb-1">Focus ServiceNow Modules:</span>
                  <div className="flex flex-wrap gap-1">
                    {role.focusModules.map((mod, mIdx) => (
                      <span key={mIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 border border-slate-800 font-medium">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Skills to Study */}
                <div>
                  <span className="block text-[10px] font-medium text-slate-500 mb-1">Key Topics to Master:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300">
                    {role.keySkillsToStudy.slice(0, 3).map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center">
                        <ChevronRight className="w-3 h-3 text-cyan-500 mr-1 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {onSelectTargetRole && (
                <button
                  type="button"
                  onClick={() => onSelectTargetRole(role.title)}
                  className="w-full py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500 active:scale-[0.98] transition-all flex items-center justify-center space-x-1"
                >
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Set as Target Role</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: HANDS-ON PROJECTS CANDIDATE CAN DO (ITSM, CMDB, INTEGRATIONHUB, SERVICE PORTAL) */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-cyan-400" />
              Recommended Hands-On ServiceNow Projects You Can Build
            </h4>
            <p className="text-xs text-slate-400">Step-by-step projects focusing on CMDB, ITSM, IntegrationHub & Service Portal</p>
          </div>

          {/* Module Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'ITSM', 'CMDB', 'INTEGRATIONHUB', 'SERVICE PORTAL'].map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setActiveModuleFilter(mod)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  activeModuleFilter === mod
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => {
            const isAdded = addedProjectIds[proj.id];
            return (
              <div
                key={proj.id}
                className={`bg-slate-950/90 border rounded-2xl p-5 space-y-3 transition-all ${
                  isAdded ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-100 block">{proj.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                        {proj.focusModule}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                        {proj.difficulty}
                      </span>
                    </div>
                  </div>

                  {onAddProjectToResume && (
                    <button
                      type="button"
                      onClick={() => handleAddProject(proj)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95 shadow-md shadow-cyan-900/30'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Added ✓</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          <span>Add to Resume</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

                {/* Impact Metric */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 text-xs text-emerald-400 font-medium flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{proj.impactMetrics}</span>
                </div>

                {/* Step by Step Milestones */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center">
                    <BookOpen className="w-3 h-3 mr-1 text-cyan-400" />
                    Implementation Milestones:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {proj.stepByStepMilestones.map((m, mIdx) => (
                      <li key={mIdx} className="flex items-start">
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-cyan-400 border border-slate-800 text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">
                          {mIdx + 1}
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {proj.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
