import React, { useState, useCallback } from 'react';
import {
  BookOpen,
  Youtube,
  Globe,
  Github,
  Cpu,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Map,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Zap,
  GraduationCap,
} from 'lucide-react';
import {
  LearningResource,
  OllamaStudyPlan,
  getResourcesForSkill,
  fetchGitHubLearningRepos,
  generatePersonalizedStudyPlanWithOllama,
  getRoadmapShLink,
} from '../../services/learningResourcesService';
import { CuratedLAndDSkill } from '../../utils/dynamicDomainRoadmap';
import { getLocalOllamaModels, OllamaModelInfo } from '../../services/ollamaService';

interface SkillLearningResourcesPanelProps {
  skill: CuratedLAndDSkill;
  candidateName?: string;
  targetRole?: string;
  domain?: string;
  allSkillsToStudy?: string[];
  isExpanded: boolean;
  onToggle: () => void;
  skillRef?: React.RefObject<HTMLDivElement>;
}

const ResourceTypeIcon: Record<LearningResource['type'], React.ReactNode> = {
  youtube_search: <Youtube className="w-3.5 h-3.5 text-red-500" />,
  official_doc: <FileText className="w-3.5 h-3.5 text-blue-500" />,
  github_repo: <Github className="w-3.5 h-3.5 text-slate-700" />,
  freecodecamp: <Globe className="w-3.5 h-3.5 text-green-600" />,
  roadmap_sh: <Map className="w-3.5 h-3.5 text-cyan-600" />,
  ollama_generated: <Cpu className="w-3.5 h-3.5 text-purple-500" />,
  platform_course: <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />,
  community: <Globe className="w-3.5 h-3.5 text-emerald-600" />,
};

const ResourceTypeBadge: Record<LearningResource['type'], string> = {
  youtube_search: 'bg-red-50 text-red-700 border-red-200',
  official_doc: 'bg-blue-50 text-blue-700 border-blue-200',
  github_repo: 'bg-slate-100 text-slate-700 border-slate-300',
  freecodecamp: 'bg-green-50 text-green-700 border-green-200',
  roadmap_sh: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  ollama_generated: 'bg-purple-50 text-purple-700 border-purple-200',
  platform_course: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  community: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const DifficultyBadge: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-800',
  Intermediate: 'bg-amber-100 text-amber-800',
  Advanced: 'bg-rose-100 text-rose-800',
};

export const SkillLearningResourcesPanel: React.FC<SkillLearningResourcesPanelProps> = ({
  skill,
  candidateName,
  targetRole,
  domain,
  allSkillsToStudy = [],
  isExpanded,
  onToggle,
  skillRef,
}) => {
  const [omniToast, setOmniToast] = useState<string | null>(null);
  const [githubResources, setGithubResources] = useState<LearningResource[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<OllamaStudyPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('qwen2.5-coder:1.5b');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const curatedResources = getResourcesForSkill(skill.skillName);

  const handleLoadGitHub = useCallback(async () => {
    if (githubResources.length > 0) return;
    setGithubLoading(true);
    const repos = await fetchGitHubLearningRepos(skill.skillName.split(' ')[0]);
    setGithubResources(repos);
    setGithubLoading(false);
  }, [skill.skillName, githubResources.length]);

  const handleGeneratePlan = useCallback(async () => {
    setPlanLoading(true);
    if (!modelsLoaded) {
      const models = await getLocalOllamaModels();
      if (models.length > 0) setSelectedModel(models[0].name);
      setOllamaModels(models);
      setModelsLoaded(true);
    }
    const plan = await generatePersonalizedStudyPlanWithOllama({
      candidateName: candidateName || 'Candidate',
      domain: domain || 'Technology',
      skillsToStudy: allSkillsToStudy.length > 0 ? allSkillsToStudy : [skill.skillName],
      currentLevel: skill.currentProficiency < 50 ? 'Beginner' : skill.currentProficiency < 75 ? 'Intermediate' : 'Experienced',
      targetRole: targetRole || 'Senior Engineer',
      modelName: selectedModel,
    });
    setStudyPlan(plan);
    setPlanLoading(false);
  }, [candidateName, domain, allSkillsToStudy, skill, targetRole, selectedModel, modelsLoaded]);

  const roadmapShLink = domain ? getRoadmapShLink(domain) : null;

  return (
    <div ref={skillRef} id={`skill-panel-${skill.skillName.replace(/\s/g, '-')}`} className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 transition bg-slate-50/50 shadow-xs">
      {/* Skill Header — always visible */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-indigo-50/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {skill.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                skill.importance === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-200' : 
                skill.importance === 'High' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {skill.importance} Gap
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">{skill.skillName}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{skill.whyStudy}</p>
          </div>

          {/* Proficiency meter */}
          <div className="flex-shrink-0 w-44 space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
              <span>Now: {skill.currentProficiency}%</span>
              <span className="text-indigo-600">Goal: {skill.targetProficiency}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-indigo-400 rounded-l-full" style={{ width: `${skill.currentProficiency}%` }} />
              <div className="h-full bg-indigo-600" style={{ width: `${skill.targetProficiency - skill.currentProficiency}%` }} />
            </div>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
          <span className="text-xs text-indigo-600 font-bold hidden sm:block">
            {curatedResources.length} Resources
          </span>
          {isExpanded
            ? <ChevronDown className="w-5 h-5 text-slate-500" />
            : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-white p-5 space-y-5">
          {/* Why Study */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-900">
            <div className="font-bold text-indigo-700 flex items-center space-x-1.5 mb-1">
              <Zap className="w-4 h-4" />
              <span>Why This Matters for {targetRole || 'Your Target Role'}:</span>
            </div>
            <p className="leading-relaxed">{skill.whyStudy}</p>
          </div>

          {/* OmniGet Toast Notification Banner */}
          {omniToast && (
            <div className="p-3 bg-indigo-950 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-md animate-fade-in">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400">📋</span>
                <span>{omniToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setOmniToast(null)}
                className="text-indigo-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Resources Grid */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Free Learning Resources — Where to Study</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {curatedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all gap-3"
                >
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 flex-1 min-w-0"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {ResourceTypeIcon[resource.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${ResourceTypeBadge[resource.type]}`}>
                          {resource.source}
                        </span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${DifficultyBadge[resource.difficulty]}`}>
                          {resource.difficulty}
                        </span>
                        {resource.duration && (
                          <span className="text-[9px] text-slate-500">{resource.duration}</span>
                        )}
                        {resource.isFree && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors flex items-center space-x-1">
                        <span className="truncate">{resource.title}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{resource.description}</p>
                    </div>
                  </a>

                  {/* OmniGet Copy Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(resource.url);
                      setOmniToast(`URL copied! Press your OmniGet hotkey to begin download.`);
                      setTimeout(() => setOmniToast(null), 4000);
                    }}
                    className="px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-md text-xs font-mono border border-indigo-500/30 transition shrink-0 self-start sm:self-center"
                    title="Copy resource URL to clipboard for OmniGet video/document downloader"
                  >
                    📋 Copy for OmniGet
                  </button>
                </div>
              ))}

              {/* GitHub Repos — lazy loaded */}
              {githubLoading && (
                <div className="flex items-center justify-center p-4 border border-dashed border-slate-300 rounded-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400 mr-2" />
                  <span className="text-xs text-slate-500">Loading GitHub repos...</span>
                </div>
              )}
              {githubResources.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                >
                  <Github className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-300">GitHub</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors flex items-center space-x-1">
                      <span className="truncate">{repo.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{repo.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Load GitHub button */}
            {githubResources.length === 0 && !githubLoading && (
              <button
                type="button"
                onClick={handleLoadGitHub}
                className="mt-3 flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-indigo-700 transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Load live GitHub awesome-list repos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* roadmap.sh link if applicable */}
            {roadmapShLink && (
              <a
                href={roadmapShLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center space-x-2 text-xs font-bold text-cyan-700 hover:text-cyan-900 transition"
              >
                <Map className="w-3.5 h-3.5" />
                <span>View interactive roadmap.sh skill map for this domain →</span>
              </a>
            )}
          </div>

          {/* Official Doc quick link */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <a
              href={skill.officialDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official Documentation →</span>
            </a>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500">{skill.recommendedCourse.provider}</div>
              <a
                href={skill.recommendedCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                {skill.recommendedCourse.title} ({skill.recommendedCourse.duration}) →
              </a>
            </div>
          </div>

          {/* ═══ Ollama 30-Day Study Plan Generator ═══ */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-4 space-y-3 border border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">🤖 Generate Personalized 30-Day Study Plan with Ollama</span>
              </div>
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={planLoading}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-sm"
              >
                {planLoading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />Generating...</>
                  : <><Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />Generate My Plan</>
                }
              </button>
            </div>

            {studyPlan && (
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studyPlan.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-400">{week.week}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{week.focus}</span>
                      </div>
                      <ul className="space-y-1">
                        {week.dailyTasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1 border-t border-slate-700 text-[10px] font-bold text-emerald-400">
                        🏁 Milestone: {week.milestone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
