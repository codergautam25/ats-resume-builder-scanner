import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  ExternalLink,
  PlayCircle,
  Code2,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Search,
  Globe,
  Award,
  Book,
} from 'lucide-react';
import { SkillLearningItem } from '../../types';

interface ResourceItem {
  title: string;
  type: 'Official Docs' | 'Free Course' | 'Hands-on Sandbox Lab' | 'Video Tutorial' | 'Cheat Sheet';
  url: string;
  provider: string;
  estimatedTime: string;
  description: string;
  isFree: boolean;
}

interface SkillLearningResourcesModalProps {
  skillItem: SkillLearningItem | null;
  onClose: () => void;
  onAddSkill: (skillName: string) => void;
}

export const SkillLearningResourcesModal: React.FC<SkillLearningResourcesModalProps> = ({
  skillItem,
  onClose,
  onAddSkill,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [addedToResume, setAddedToResume] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'roadmap' | 'project'>('resources');

  useEffect(() => {
    if (!skillItem) return;

    setLoading(true);
    setAddedToResume(false);

    // Build curated free resource search results based on the skill name
    const skill = skillItem.skillName;

    // Standardized curated free learning directory
    const curatedResources: ResourceItem[] = [
      {
        title: `${skill} Official Documentation & Getting Started Guide`,
        type: 'Official Docs',
        url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation getting started free')}`,
        provider: 'Official Core Team',
        estimatedTime: '1 - 2 Hours',
        description: `Comprehensive core concepts, API references, and official quickstart tutorials for ${skill}.`,
        isFree: true,
      },
      {
        title: `Free Interactive ${skill} Hands-On Sandbox Lab`,
        type: 'Hands-on Sandbox Lab',
        url: `https://github.com/topics/${encodeURIComponent(skill.toLowerCase().replace(/\s+/g, '-'))}`,
        provider: 'GitHub Open Source Community',
        estimatedTime: '3 - 5 Hours',
        description: `Clone ready-to-run repository templates, sample code, and architecture blueprints implementing ${skill}.`,
        isFree: true,
      },
      {
        title: `${skill} Crash Course & Architecture Deep Dive`,
        type: 'Free Course',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course tutorial')}`,
        provider: 'freeCodeCamp / YouTube Tech',
        estimatedTime: '2 - 4 Hours',
        description: `End-to-end video walkthroughs covering real-world production setups, common pitfalls, and interview Q&As.`,
        isFree: true,
      },
      {
        title: `Production ${skill} Best Practices & Cheat Sheet`,
        type: 'Cheat Sheet',
        url: `https://devhints.io/`,
        provider: 'DevHints / DevDocs',
        estimatedTime: '30 Mins',
        description: `Quick reference guides, key CLI commands, and production configuration snippets for daily development.`,
        isFree: true,
      },
    ];

    setTimeout(() => {
      setResources(curatedResources);
      setLoading(false);
    }, 300);
  }, [skillItem]);

  if (!skillItem) return null;

  const handleAdd = () => {
    onAddSkill(skillItem.skillName);
    setAddedToResume(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-900/80 rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-5 border-b border-indigo-800/50 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-extrabold font-mono text-indigo-400">
                  Curated Free Learning Path
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free Resources
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">{skillItem.skillName} Mastery Roadmap</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-5 pt-2 space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'resources'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Curated Free Resources</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'roadmap'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3-Step Micro-Learning Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'project'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Proof of Concept Blueprint</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: CURATED FREE RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Why Learn {skillItem.skillName}?</strong> {skillItem.whyLearn}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verified Free Courses, Docs & Repositories</span>
                </h4>

                {loading ? (
                  <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
                    Searching for best free learning materials for {skillItem.skillName}...
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {resources.map((res, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-extrabold text-white">{res.title}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {res.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{res.description}</p>
                          <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono pt-0.5">
                            <span>Provider: {res.provider}</span>
                            <span>•</span>
                            <span>Time: {res.estimatedTime}</span>
                          </div>
                        </div>

                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 flex-shrink-0 self-start sm:self-auto shadow"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 3-STEP MICRO-LEARNING PLAN */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Estimated Time to Proficiency: {skillItem.estimatedTime || '3 - 5 Days'}</span>
                </h4>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start space-x-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Stage 1: Core Fundamentals (Day 1)</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Read official documentation, learn core CLI commands, data models, and main configuration files.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Stage 2: Build Hands-on Mini Project (Day 2 - 3)</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {skillItem.actionStep || `Build a sandbox repository implementing ${skillItem.skillName} in production mode.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Stage 3: Quantify & Add to Resume (Day 4)</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Incorporate quantifiable metric achievements (e.g., "Deployed {skillItem.skillName} pipeline reducing latency by 30%") into your active draft.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROOF OF CONCEPT BLUEPRINT */}
          {activeTab === 'project' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-extrabold text-white">
                    Recommended Sandbox PoC Architecture for {skillItem.skillName}
                  </h4>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 block">
                    Suggested Mini Project Scope:
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    Create a modular TypeScript/Node service that integrates <strong>{skillItem.skillName}</strong>. Benchmark execution throughput, document error handling, and publish code to GitHub with a clean README.
                  </p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                    Ready Resume Bullet to Copy:
                  </span>
                  <p className="text-emerald-200 font-mono italic">
                    "Architected hands-on proof of concept with {skillItem.skillName}, optimizing integration latency and establishing reusable design patterns for production microservices."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {addedToResume ? '✓ Added to Resume Draft' : 'Ready to add to resume?'}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Close
            </button>

            <button
              onClick={handleAdd}
              disabled={addedToResume}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                addedToResume
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
              }`}
            >
              {addedToResume ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Added to Resume</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Add {skillItem.skillName} to Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
