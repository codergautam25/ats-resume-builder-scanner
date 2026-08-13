import React, { useState } from 'react';
import {
  ResumeData,
  WorkExperience,
  Education,
  Project,
  SkillCategory,
  Certification,
  ResumeVersion,
  BulletMetadata,
} from '../../types';
import {
  Plus,
  Trash2,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Highlighter,
  Tag,
  Lock,
  FileText,
  Info,
  Target,
  Layers,
} from 'lucide-react';
import { ResumeVersionManager } from './ResumeVersionManager';
import { BulletMetadataModal } from '../../components/modals/BulletMetadataModal';
import { TargetJobRoleCard } from '../target-role/TargetJobRoleCard';
import { SideProjectsAndAccomplishmentsSection } from './SideProjectsAndAccomplishmentsSection';

import { synthesizeSmartHeadline } from '../../utils/resumeSanitizer';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenBulletRewrite: (text: string, context: string, metadata?: BulletMetadata) => void;
  jobDescription?: string;
  overallScore?: number;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onChange,
  onOpenBulletRewrite,
  jobDescription,
  overallScore = 82,
}) => {
  const [activeSection, setActiveSection] = useState<'info' | 'target' | 'summary' | 'experience' | 'skills' | 'projects' | 'sideProjects' | 'education' | 'certifications'>('target');

  const [activeMetadataModal, setActiveMetadataModal] = useState<{
    section: 'experience' | 'projects';
    itemIndex: number;
    bulletIndex: number;
    text: string;
    title: string;
    metadata?: BulletMetadata;
  } | null>(null);

  // Update personal info
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  // Update summary
  const updateSummary = (value: string) => {
    onChange({
      ...resumeData,
      summary: value,
    });
  };

  // Work Experience Operations
  const updateExperience = (index: number, updatedItem: WorkExperience) => {
    const list = [...resumeData.experience];
    list[index] = updatedItem;
    onChange({ ...resumeData, experience: list });
  };

  const addExperience = () => {
    const newItem: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      position: "Job Title",
      location: "City, State",
      startDate: "2023-01",
      endDate: "Present",
      isCurrent: true,
      highlights: ["Achieved measurable impact using key technologies..."],
    };
    onChange({ ...resumeData, experience: [newItem, ...resumeData.experience] });
  };

  const removeExperience = (index: number) => {
    const list = resumeData.experience.filter((_, i) => i !== index);
    onChange({ ...resumeData, experience: list });
  };

  const updateHighlight = (expIndex: number, hlIndex: number, text: string) => {
    const list = [...resumeData.experience];
    const item = { ...list[expIndex] };
    item.highlights = [...item.highlights];
    item.highlights[hlIndex] = text;
    list[expIndex] = item;
    onChange({ ...resumeData, experience: list });
  };

  const addHighlight = (expIndex: number) => {
    const list = [...resumeData.experience];
    const item = { ...list[expIndex] };
    item.highlights = [...item.highlights, "Spearheaded projects resulting in 20%+ efficiency gains..."];
    list[expIndex] = item;
    onChange({ ...resumeData, experience: list });
  };

  const removeHighlight = (expIndex: number, hlIndex: number) => {
    const list = [...resumeData.experience];
    const item = { ...list[expIndex] };
    item.highlights = item.highlights.filter((_, i) => i !== hlIndex);
    if (item.bulletMetadata && item.bulletMetadata[hlIndex]) {
      const updatedMeta = { ...item.bulletMetadata };
      delete updatedMeta[hlIndex];
      item.bulletMetadata = updatedMeta;
    }
    list[expIndex] = item;
    onChange({ ...resumeData, experience: list });
  };

  // Project Operations
  const updateProject = (index: number, updatedItem: Project) => {
    const list = [...resumeData.projects];
    list[index] = updatedItem;
    onChange({ ...resumeData, projects: list });
  };

  const addProject = () => {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      title: "New Key Technical Project",
      subtitle: "Scalable Full-Stack Platform",
      link: "https://github.com/example/project",
      highlights: ["Engineered responsive UI and microservices architecture..."],
    };
    onChange({ ...resumeData, projects: [newItem, ...resumeData.projects] });
  };

  const removeProject = (index: number) => {
    const list = resumeData.projects.filter((_, i) => i !== index);
    onChange({ ...resumeData, projects: list });
  };

  const updateProjectHighlight = (projIndex: number, hlIndex: number, text: string) => {
    const list = [...resumeData.projects];
    const item = { ...list[projIndex] };
    item.highlights = [...item.highlights];
    item.highlights[hlIndex] = text;
    list[projIndex] = item;
    onChange({ ...resumeData, projects: list });
  };

  const addProjectHighlight = (projIndex: number) => {
    const list = [...resumeData.projects];
    const item = { ...list[projIndex] };
    item.highlights = [...item.highlights, "Architected high-throughput data processing..."];
    list[projIndex] = item;
    onChange({ ...resumeData, projects: list });
  };

  const removeProjectHighlight = (projIndex: number, hlIndex: number) => {
    const list = [...resumeData.projects];
    const item = { ...list[projIndex] };
    item.highlights = item.highlights.filter((_, i) => i !== hlIndex);
    if (item.bulletMetadata && item.bulletMetadata[hlIndex]) {
      const updatedMeta = { ...item.bulletMetadata };
      delete updatedMeta[hlIndex];
      item.bulletMetadata = updatedMeta;
    }
    list[projIndex] = item;
    onChange({ ...resumeData, projects: list });
  };

  // Metadata Save Handler
  const handleSaveBulletMetadata = (savedMeta: BulletMetadata) => {
    if (!activeMetadataModal) return;
    const { section, itemIndex, bulletIndex } = activeMetadataModal;

    if (section === 'experience') {
      const list = [...resumeData.experience];
      const item = { ...list[itemIndex] };
      const bulletMetadata = { ...(item.bulletMetadata || {}) };
      bulletMetadata[bulletIndex] = savedMeta;
      item.bulletMetadata = bulletMetadata;
      list[itemIndex] = item;
      onChange({ ...resumeData, experience: list });
    } else if (section === 'projects') {
      const list = [...resumeData.projects];
      const item = { ...list[itemIndex] };
      const bulletMetadata = { ...(item.bulletMetadata || {}) };
      bulletMetadata[bulletIndex] = savedMeta;
      item.bulletMetadata = bulletMetadata;
      list[itemIndex] = item;
      onChange({ ...resumeData, projects: list });
    }

    setActiveMetadataModal(null);
  };

  // Skill Categories Operations
  const updateSkillCategoryName = (index: number, category: string) => {
    const cats = [...resumeData.skillCategories];
    cats[index].category = category;
    onChange({ ...resumeData, skillCategories: cats });
  };

  const updateSkillsList = (index: number, skillsCsv: string) => {
    const cats = [...resumeData.skillCategories];
    cats[index].skills = skillsCsv.split(',').map((s) => s.trim()).filter(Boolean);
    onChange({ ...resumeData, skillCategories: cats });
  };

  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      category: "New Skill Group",
      skills: ["Skill 1", "Skill 2"],
    };
    onChange({ ...resumeData, skillCategories: [...resumeData.skillCategories, newCat] });
  };

  const removeSkillCategory = (index: number) => {
    const cats = resumeData.skillCategories.filter((_, i) => i !== index);
    onChange({ ...resumeData, skillCategories: cats });
  };

  const getContainerStyle = (meta?: BulletMetadata) => {
    if (!meta || !meta.isHighlighted) return 'bg-slate-50 border-slate-200';
    switch (meta.highlightColor) {
      case 'yellow':
        return 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300/70';
      case 'blue':
        return 'bg-blue-50/90 border-blue-300 ring-1 ring-blue-300/70';
      case 'purple':
        return 'bg-purple-50/90 border-purple-300 ring-1 ring-purple-300/70';
      case 'emerald':
        return 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300/70';
      case 'amber':
        return 'bg-orange-50/90 border-orange-300 ring-1 ring-orange-300/70';
      default:
        return 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300/70';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Resume Versioning Manager */}
      <ResumeVersionManager
        currentResume={resumeData}
        overallScore={overallScore}
        onRestoreVersion={(ver: ResumeVersion) => onChange(ver.resumeData)}
      />

      {/* Editor Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'target', label: 'Target Job & Ollama LLM', icon: Target },
          { id: 'info', label: 'Contact Info', icon: User },
          { id: 'summary', label: 'Summary', icon: Sparkles },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'skills', label: 'Skills Matrix', icon: Code },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'sideProjects', label: 'Side Projects & Accomplishments', icon: Layers },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === tab.id
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION: TARGET JOB ROLE & OLLAMA LLM */}
      {activeSection === 'target' && (
        <TargetJobRoleCard
          personalInfo={resumeData.personalInfo}
          onUpdateTargetRole={(targetRole, targetJobDescription) => {
            onChange({
              ...resumeData,
              personalInfo: {
                ...resumeData.personalInfo,
                targetRole,
                targetJobDescription,
              },
            });
          }}
          onAddAccomplishment={(acc) => {
            const current = resumeData.sideProjectsAndAccomplishments || [];
            if (!current.some((item) => item.title.toLowerCase() === acc.title.toLowerCase())) {
              onChange({
                ...resumeData,
                sideProjectsAndAccomplishments: [...current, acc],
              });
            }
          }}
          currentSkills={(resumeData.skillCategories || []).flatMap((c) => c.skills)}
        />
      )}

      {/* SECTION: SIDE PROJECTS & UNLISTED ACCOMPLISHMENTS */}
      {activeSection === 'sideProjects' && (
        <SideProjectsAndAccomplishmentsSection
          items={resumeData.sideProjectsAndAccomplishments || []}
          onChange={(items) => onChange({ ...resumeData, sideProjectsAndAccomplishments: items })}
          onOpenOllamaGenerator={() => setActiveSection('target')}
        />
      )}

      {/* SECTION 1: PERSONAL INFO */}
      {activeSection === 'info' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Information & Contact Bar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Professional Title / Headline</label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = synthesizeSmartHeadline(resumeData);
                    updatePersonalInfo('headline', generated);
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-blue-50 transition"
                  title="Auto-generate professional headline from extracted resume data"
                >
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={resumeData.personalInfo.headline}
                onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                placeholder="e.g. Senior Software Engineer | Full Stack Specialist"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Location (City, State / Country)</label>
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">LinkedIn URL</label>
              <input
                type="text"
                value={resumeData.personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">GitHub URL</label>
              <input
                type="text"
                value={resumeData.personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">LeetCode Profile URL</label>
              <input
                type="text"
                value={resumeData.personalInfo.leetcode || ''}
                onChange={(e) => updatePersonalInfo('leetcode', e.target.value)}
                placeholder="https://leetcode.com/u/username"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">HackerRank Profile URL</label>
              <input
                type="text"
                value={resumeData.personalInfo.hackerrank || ''}
                onChange={(e) => updatePersonalInfo('hackerrank', e.target.value)}
                placeholder="https://hackerrank.com/username"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Scaler Profile URL</label>
              <input
                type="text"
                value={resumeData.personalInfo.scaler || ''}
                onChange={(e) => updatePersonalInfo('scaler', e.target.value)}
                placeholder="https://scaler.com/profile/username"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Portfolio Website</label>
              <input
                type="text"
                value={resumeData.personalInfo.portfolio || ''}
                onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                placeholder="https://myportfolio.com"
                className="w-full text-xs p-2.5 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROFESSIONAL SUMMARY */}
      {activeSection === 'summary' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Professional Summary</span>
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Write a high-impact 3-sentence summary highlighting your experience, key skills, and quantifiable achievements.
          </p>

          <textarea
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={5}
            className="w-full p-3.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed"
          />
        </div>
      )}

      {/* SECTION 3: WORK EXPERIENCE */}
      {activeSection === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Work Experience Items</h3>
              <p className="text-xs text-slate-500">Highlight bullet points, tag skill domains, and log private AI context notes.</p>
            </div>
            <button
              onClick={addExperience}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          {resumeData.experience.map((exp, expIdx) => (
            <div key={exp.id || expIdx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative">
              <button
                onClick={() => removeExperience(expIdx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Company Name</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(expIdx, { ...exp, company: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Position Title</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(expIdx, { ...exp, position: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Location</label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => updateExperience(expIdx, { ...exp, location: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-slate-600">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(expIdx, { ...exp, startDate: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-slate-600">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(expIdx, { ...exp, endDate: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Points Highlights with Metadata & Private Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Key Accomplishments & Bullet Points
                  </label>
                  <button
                    onClick={() => addHighlight(expIdx)}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                {exp.highlights.map((hl, hlIdx) => {
                  const meta = exp.bulletMetadata?.[hlIdx];
                  const hasMeta = meta && (meta.privateNote || (meta.contextTags && meta.contextTags.length > 0) || meta.isHighlighted);
                  const activeTagCount = meta?.contextTags?.length || 0;

                  return (
                    <div
                      key={hlIdx}
                      className={`p-3 rounded-xl border transition space-y-2.5 ${getContainerStyle(meta)}`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-slate-400 font-bold mt-1">•</span>
                        <textarea
                          value={hl}
                          onChange={(e) => updateHighlight(expIdx, hlIdx, e.target.value)}
                          rows={2}
                          className="flex-1 text-xs p-2 bg-white/90 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed"
                        />
                        <div className="flex flex-col sm:flex-row items-center gap-1.5 flex-shrink-0">
                          {/* Private Notes & Tags Button */}
                          <button
                            onClick={() =>
                              setActiveMetadataModal({
                                section: 'experience',
                                itemIndex: expIdx,
                                bulletIndex: hlIdx,
                                text: hl,
                                title: `${exp.position} at ${exp.company}`,
                                metadata: meta,
                              })
                            }
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition ${
                              hasMeta
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                            title="Add private notes or context tags for AI analysis"
                          >
                            <Highlighter className="w-3.5 h-3.5 text-indigo-300" />
                            <span className="hidden sm:inline">
                              {hasMeta ? 'Notes & Tags' : 'Private Notes'}
                            </span>
                            {activeTagCount > 0 && (
                              <span className="px-1.5 py-0.2 bg-indigo-900 text-indigo-200 rounded-full text-[10px] font-mono">
                                {activeTagCount}
                              </span>
                            )}
                          </button>

                          {/* AI Rewrite Button */}
                          <button
                            onClick={() => onOpenBulletRewrite(hl, `${exp.position} at ${exp.company}`, meta)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1"
                            title="Rewrite this bullet using AI"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">AI Rewrite</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeHighlight(expIdx, hlIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display attached private note snippet and context tags if available */}
                      {hasMeta && (
                        <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-indigo-700 font-extrabold uppercase">
                            <span className="flex items-center space-x-1">
                              <Lock className="w-3 h-3 text-amber-500" />
                              <span>Private AI Context Metadata</span>
                            </span>
                            <span className="text-slate-400 italic">Excluded from PDF export</span>
                          </div>

                          {meta?.privateNote && (
                            <p className="text-slate-700 italic bg-slate-50 p-1.5 rounded border border-slate-200">
                              "{meta.privateNote}"
                            </p>
                          )}

                          {meta?.contextTags && meta.contextTags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-0.5">
                              {meta.contextTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 4: SKILLS MATRIX */}
      {activeSection === 'skills' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Categorized Skill Groups</h3>
              <p className="text-xs text-slate-500">Group skills cleanly (e.g., Languages, Frameworks, Cloud & Tools)</p>
            </div>
            <button
              onClick={addSkillCategory}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-4">
            {resumeData.skillCategories.map((cat, catIdx) => (
              <div key={catIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                <button
                  onClick={() => removeSkillCategory(catIdx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="max-w-xs">
                  <label className="text-[11px] font-semibold text-slate-600">Category Name</label>
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => updateSkillCategoryName(catIdx, e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={cat.skills.join(', ')}
                    onChange={(e) => updateSkillsList(catIdx, e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: PROJECTS */}
      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Key Technical Projects</h3>
              <p className="text-xs text-slate-500">Add highlight bullet points, tag technology stack, and log private context.</p>
            </div>
            <button
              onClick={addProject}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {resumeData.projects.map((proj, projIdx) => (
            <div key={proj.id || projIdx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative">
              <button
                onClick={() => removeProject(projIdx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(projIdx, { ...proj, title: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={proj.subtitle || ''}
                    onChange={(e) => updateProject(projIdx, { ...proj, subtitle: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Project Link / GitHub URL</label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(projIdx, { ...proj, link: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Project Highlights & Accomplishments</label>
                  <button
                    onClick={() => addProjectHighlight(projIdx)}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                {proj.highlights.map((hl, hlIdx) => {
                  const meta = proj.bulletMetadata?.[hlIdx];
                  const hasMeta = meta && (meta.privateNote || (meta.contextTags && meta.contextTags.length > 0) || meta.isHighlighted);

                  return (
                    <div key={hlIdx} className={`p-3 rounded-xl border transition space-y-2 ${getContainerStyle(meta)}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-slate-400 font-bold mt-1">•</span>
                        <textarea
                          value={hl}
                          onChange={(e) => updateProjectHighlight(projIdx, hlIdx, e.target.value)}
                          rows={2}
                          className="flex-1 text-xs p-2 bg-white/90 border border-slate-300 rounded-lg text-slate-800 leading-relaxed"
                        />
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() =>
                              setActiveMetadataModal({
                                section: 'projects',
                                itemIndex: projIdx,
                                bulletIndex: hlIdx,
                                text: hl,
                                title: proj.title,
                                metadata: meta,
                              })
                            }
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-1 transition ${
                              hasMeta
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            <Highlighter className="w-3.5 h-3.5 text-indigo-300" />
                            <span className="hidden sm:inline">Notes & Tags</span>
                          </button>

                          <button
                            onClick={() => removeProjectHighlight(projIdx, hlIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {hasMeta && (
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                          {meta?.privateNote && <p className="text-slate-700 italic">"{meta.privateNote}"</p>}
                          {meta?.contextTags && (
                            <div className="flex flex-wrap gap-1">
                              {meta.contextTags.map((t) => (
                                <span key={t} className="px-1.5 py-0.2 font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 6: EDUCATION */}
      {activeSection === 'education' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Education & Academic Credentials</h3>
          <p className="text-xs text-slate-500">
            View or edit your academic background, degree titles, and institution credentials.
          </p>
          <div className="space-y-3">
            {resumeData.education.map((edu, eduIdx) => (
              <div key={edu.id || eduIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const list = [...resumeData.education];
                        list[eduIdx].degree = e.target.value;
                        onChange({ ...resumeData, education: list });
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const list = [...resumeData.education];
                        list[eduIdx].institution = e.target.value;
                        onChange({ ...resumeData, education: list });
                      }}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: CERTIFICATIONS */}
      {activeSection === 'certifications' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Certifications & Licenses</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Each certification entry separates Certification Name, Issuing Organization, and Issue Date/Year into dedicated fields for Fortune 500 ATS compliance.
              </p>
            </div>
            <button
              onClick={() => {
                const newCert: Certification = {
                  id: `cert-${Date.now()}`,
                  name: '',
                  issuer: 'Certification Body',
                  date: new Date().getFullYear().toString(),
                };
                onChange({
                  ...resumeData,
                  certifications: [...(resumeData.certifications || []), newCert],
                });
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="space-y-3">
            {(resumeData.certifications || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No certifications added yet. Click "Add Certification" to add your credentials.</p>
            ) : (
              (resumeData.certifications || []).map((cert, certIdx) => (
                <div key={cert.id || certIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                  <button
                    onClick={() => {
                      const updated = (resumeData.certifications || []).filter((_, idx) => idx !== certIdx);
                      onChange({ ...resumeData, certifications: updated });
                    }}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                    title="Remove Certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <div className="sm:col-span-1">
                      <label className="text-[11px] font-semibold text-slate-600">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        placeholder="e.g. Docker Certified Associate"
                        onChange={(e) => {
                          const list = [...(resumeData.certifications || [])];
                          list[certIdx] = { ...list[certIdx], name: e.target.value };
                          onChange({ ...resumeData, certifications: list });
                        }}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Issuing Organization / Body</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        placeholder="e.g. Docker / Mirantis"
                        onChange={(e) => {
                          const list = [...(resumeData.certifications || [])];
                          list[certIdx] = { ...list[certIdx], issuer: e.target.value };
                          onChange({ ...resumeData, certifications: list });
                        }}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Issue Date / Year</label>
                      <input
                        type="text"
                        value={cert.date}
                        placeholder="e.g. 2020"
                        onChange={(e) => {
                          const list = [...(resumeData.certifications || [])];
                          list[certIdx] = { ...list[certIdx], date: e.target.value };
                          onChange({ ...resumeData, certifications: list });
                        }}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BULLET METADATA MODAL */}
      {activeMetadataModal && (
        <BulletMetadataModal
          bulletText={activeMetadataModal.text}
          contextTitle={activeMetadataModal.title}
          initialMetadata={activeMetadataModal.metadata}
          onSave={handleSaveBulletMetadata}
          onClose={() => setActiveMetadataModal(null)}
        />
      )}
    </div>
  );
};
