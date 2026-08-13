import React, { useState } from 'react';
import { Sparkles, X, Check, Lock, Tag, FileText } from 'lucide-react';
import { BulletMetadata } from '../../types';

interface BulletRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  contextTitle: string;
  jobDescription?: string;
  bulletMetadata?: BulletMetadata;
  onSelectOption: (newText: string) => void;
}

export const BulletRewriteModal: React.FC<BulletRewriteModalProps> = ({
  isOpen,
  onClose,
  originalText,
  contextTitle,
  jobDescription,
  bulletMetadata,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  const [goal, setGoal] = useState<'quantify' | 'verbs' | 'keywords' | 'concise'>('quantify');
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: originalText,
          goal:
            goal === 'quantify'
              ? 'Quantify Impact & Add Measurable Percentages/Metrics'
              : goal === 'verbs'
              ? 'Use High-Impact Past Tense Action Verbs'
              : goal === 'keywords'
              ? 'Weave in High-Priority Target Job Keywords'
              : 'Make Executive Concise & Crisp',
          contextPosition: contextTitle,
          jobDescription,
          privateNote: bulletMetadata?.privateNote,
          contextTags: bulletMetadata?.contextTags,
        }),
      });

      if (!res.ok) throw new Error('Rewrite request failed');
      const data = await res.json();
      if (data.options && Array.isArray(data.options)) {
        setOptions(data.options);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate options. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">AI Bullet Point Optimizer</h3>
            <p className="text-xs text-slate-500">Context: {contextTitle}</p>
          </div>
        </div>

        {/* Original Bullet Display */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Original Bullet:</span>
            "{originalText}"
          </div>

          {(bulletMetadata?.privateNote || (bulletMetadata?.contextTags && bulletMetadata.contextTags.length > 0)) && (
            <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
              <span className="font-extrabold text-indigo-600 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Including Private AI Context Metadata:</span>
              </span>
              {bulletMetadata.privateNote && (
                <p className="text-slate-600 italic bg-indigo-50/50 p-2 rounded border border-indigo-100">
                  Note: "{bulletMetadata.privateNote}"
                </p>
              )}
              {bulletMetadata.contextTags && bulletMetadata.contextTags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {bulletMetadata.contextTags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Goal Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Optimization Goal:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'quantify', label: '📊 Add Metrics & Numbers' },
              { id: 'verbs', label: '⚡ Stronger Action Verbs' },
              { id: 'keywords', label: '🎯 Target Job Keywords' },
              { id: 'concise', label: '✂️ Concise & Direct' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id as any)}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition ${
                  goal === g.id
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          onClick={handleRewrite}
          disabled={isLoading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating AI Bullet Points...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate 3 Optimized Bullet Options</span>
            </>
          )}
        </button>

        {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

        {/* Options List */}
        {options.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Select an Option to Replace:</span>
            {options.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  onSelectOption(opt);
                  onClose();
                }}
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-xs text-slate-800 cursor-pointer transition flex items-start space-x-2 group"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                  {i + 1}
                </div>
                <div className="flex-1 leading-relaxed">{opt}</div>
                <Check className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
