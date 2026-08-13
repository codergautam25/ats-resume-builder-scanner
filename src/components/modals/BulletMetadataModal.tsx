import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Tag,
  Lock,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Highlighter,
  FileText,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { BulletMetadata } from '../../types';

interface BulletMetadataModalProps {
  bulletText: string;
  contextTitle: string;
  initialMetadata?: BulletMetadata;
  onSave: (metadata: BulletMetadata) => void;
  onClose: () => void;
}

const PRESET_TAGS = [
  '#Leadership',
  '#SystemDesign',
  '#MetricsAndImpact',
  '#ClientFacing',
  '#Architecture',
  '#Security',
  '#IncidentResponse',
  '#CloudScale',
  '#CostEfficiency',
  '#ProductStrategy',
  '#Mentorship',
  '#AIPipeline',
];

const HIGHLIGHT_COLORS: { id: 'yellow' | 'blue' | 'purple' | 'emerald' | 'amber'; name: string; bgClass: string; borderClass: string; textClass: string }[] = [
  { id: 'yellow', name: 'Warm Gold', bgClass: 'bg-amber-100', borderClass: 'border-amber-400', textClass: 'text-amber-800' },
  { id: 'blue', name: 'Electric Blue', bgClass: 'bg-blue-100', borderClass: 'border-blue-400', textClass: 'text-blue-800' },
  { id: 'purple', name: 'Royal Purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-400', textClass: 'text-purple-800' },
  { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-400', textClass: 'text-emerald-800' },
  { id: 'amber', name: 'Vibrant Amber', bgClass: 'bg-orange-100', borderClass: 'border-orange-400', textClass: 'text-orange-800' },
];

export const BulletMetadataModal: React.FC<BulletMetadataModalProps> = ({
  bulletText,
  contextTitle,
  initialMetadata,
  onSave,
  onClose,
}) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(initialMetadata?.isHighlighted ?? true);
  const [highlightColor, setHighlightColor] = useState<'yellow' | 'blue' | 'purple' | 'emerald' | 'amber'>(
    initialMetadata?.highlightColor ?? 'yellow'
  );
  const [privateNote, setPrivateNote] = useState<string>(initialMetadata?.privateNote || '');
  const [tags, setTags] = useState<string[]>(initialMetadata?.contextTags || []);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  const togglePresetTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const addCustomTag = () => {
    if (!customTagInput.trim()) return;
    let formatted = customTagInput.trim();
    if (!formatted.startsWith('#')) formatted = `#${formatted}`;
    if (!tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    setCustomTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      isHighlighted,
      highlightColor,
      privateNote: privateNote.trim() || undefined,
      contextTags: tags.length > 0 ? tags : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-xl w-full text-white shadow-2xl overflow-hidden my-8 space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-5 border-b border-indigo-800/40 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Highlighter className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-extrabold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                  Bullet Metadata & AI Context
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Private Note</span>
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                Private Notes & Context Tags
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bullet Preview Display */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">
            Target Bullet ({contextTitle}):
          </span>
          <p className="text-xs text-slate-200 italic font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
            "{bulletText}"
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* SECTION 1: VISUAL HIGHLIGHT & COLOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Highlight Bullet in Editor Canvas</span>
              </label>

              <button
                type="button"
                onClick={() => setIsHighlighted(!isHighlighted)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition ${
                  isHighlighted
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isHighlighted ? '✓ Highlighted' : 'Disabled'}
              </button>
            </div>

            {isHighlighted && (
              <div className="flex items-center space-x-2 pt-1">
                {HIGHLIGHT_COLORS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setHighlightColor(col.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center space-x-1.5 ${
                      highlightColor === col.id
                        ? `${col.bgClass} ${col.borderClass} ${col.textClass} ring-2 ring-white/50 scale-105`
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80" />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: PRIVATE NOTE FOR AI */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Private Context / Background Note for AI Analysis</span>
            </label>

            <textarea
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              placeholder="e.g. Managed 8 engineers and $1.2M annual budget. Key accomplishment for Senior / Lead engineering applications..."
              rows={3}
              className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder-slate-600 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>Use this space to log unlisted metrics, team sizes, budget details, or target keywords.</span>
            </p>
          </div>

          {/* SECTION 3: CONTEXT TAGS */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Context Tags (Categorize Skill Domain)</span>
            </label>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePresetTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder="Add custom tag (e.g., #KafkaStreaming)..."
                className="flex-1 text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-200"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Selected Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Active Tags:</span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-rose-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* PRIVACY GUARANTEE BANNER */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-amber-200">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>🔒 Strict Privacy Guarantee:</strong> These private notes & context tags are stored strictly in your draft metadata. They feed AI analysis & bullet rewrites, but are <strong>100% excluded</strong> from exported/printed PDF resumes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Private Metadata</span>
          </button>
        </div>
      </div>
    </div>
  );
};
