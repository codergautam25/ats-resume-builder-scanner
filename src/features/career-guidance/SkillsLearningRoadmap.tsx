import React, { useState } from 'react';
import { SkillLearningItem } from '../../types';
import {
  BookOpen,
  Check,
  Clock,
  Lightbulb,
  Plus,
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  GraduationCap,
  PlayCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { SkillLearningResourcesModal } from '../../components/modals/SkillLearningResourcesModal';

interface SkillsLearningRoadmapProps {
  roadmap: SkillLearningItem[];
  missingKeywords: string[];
  onAddSkill: (skillName: string) => void;
  onDismissSkill: (skillName: string) => void;
  onAutofillKeyword?: (keyword: string) => void;
}

export const SkillsLearningRoadmap: React.FC<SkillsLearningRoadmapProps> = ({
  roadmap,
  missingKeywords,
  onAddSkill,
  onDismissSkill,
  onAutofillKeyword,
}) => {
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<SkillLearningItem | null>(null);

  // Fallback: If AI didn't populate roadmap items for some missing keywords, build fallback items
  const itemsMap = new Map<string, SkillLearningItem>();

  (roadmap || []).forEach((item) => {
    itemsMap.set(item.skillName.toLowerCase(), item);
  });

  (missingKeywords || []).forEach((kw) => {
    const key = kw.toLowerCase();
    if (!itemsMap.has(key)) {
      itemsMap.set(key, {
        skillName: kw,
        priority: 'high',
        whyLearn: `Frequently requested keyword in target job postings for this role. Adding this skill increases ATS keyword match score.`,
        estimatedTime: '3-7 days',
        actionStep: `Build a mini project or complete a hands-on tutorial implementing ${kw}.`,
      });
    }
  });

  const allItems = Array.from(itemsMap.values());

  if (allItems.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">No Critical Skill Gaps Detected!</h3>
        <p className="text-xs text-slate-600">
          Your resume already covers the key technical stack and skills required for this job role.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 border border-rose-200 flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>High Priority (Must Have)</span>
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Medium Priority (Competitive)</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 border border-blue-200 flex items-center space-x-1">
            <Lightbulb className="w-3 h-3 text-blue-600" />
            <span>Low Priority (Bonus Skill)</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-indigo-200/80 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Which Skills Should You Learn & Why? (Priority Roadmap)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Targeted skill gaps identified between your current resume and industry requirements. Follow this priority matrix to boost your ATS compatibility and interview callback rate.
          </p>
        </div>

        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto flex items-center space-x-1">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span>{allItems.length} Recommended Skills</span>
        </span>
      </div>

      {/* Skill Priority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allItems.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-slate-900 text-sm">{item.skillName}</span>
                {getPriorityBadge(item.priority)}
              </div>

              {/* Why Learn & Rationale */}
              <div className="text-xs text-slate-700 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-indigo-700 flex items-center space-x-1">
                  <span>💡 Why Learn This Skill?</span>
                </p>
                <p className="leading-relaxed text-slate-700">{item.whyLearn}</p>
              </div>

              {/* Action Step & Time */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 pt-1">
                {item.estimatedTime && (
                  <span className="flex items-center space-x-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. Time: <strong>{item.estimatedTime}</strong></span>
                  </span>
                )}
                {item.actionStep && (
                  <span className="flex items-center space-x-1 text-indigo-700 font-semibold">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]" title={item.actionStep}>
                      {item.actionStep}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Includes 'Start Learning' & 'Autofill' Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 mt-2">
              <button
                type="button"
                onClick={() => setSelectedSkillForModal(item)}
                className="flex-1 min-w-[110px] py-2 px-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-lg shadow-xs flex items-center justify-center space-x-1 transition active:scale-95"
                title={`Open free learning resources & roadmap for ${item.skillName}`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-200" />
                <span>Start Learning</span>
              </button>

              {onAutofillKeyword && (
                <button
                  type="button"
                  onClick={() => onAutofillKeyword(item.skillName)}
                  className="py-2 px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs flex items-center justify-center space-x-1 transition active:scale-95"
                  title={`Instantly inject ${item.skillName} into the most relevant experience or project section`}
                >
                  <Zap className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
                  <span>Autofill</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onAddSkill(item.skillName)}
                className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center space-x-1 transition"
                title={`Add ${item.skillName} to my resume skills`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Skill</span>
              </button>

              <button
                type="button"
                onClick={() => onDismissSkill(item.skillName)}
                className="py-2 px-2.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-medium text-xs rounded-lg flex items-center justify-center transition"
                title={`I haven't worked with ${item.skillName} / Dismiss`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Free Learning Resources & Roadmap Modal */}
      {selectedSkillForModal && (
        <SkillLearningResourcesModal
          skillItem={selectedSkillForModal}
          onClose={() => setSelectedSkillForModal(null)}
          onAddSkill={(skill) => {
            onAddSkill(skill);
          }}
        />
      )}
    </div>
  );
};
