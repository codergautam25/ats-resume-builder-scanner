import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, History, PlusCircle, RefreshCw } from 'lucide-react';

interface RecentWorkIngestionCardProps {
  onIngestRecentWork: (recentWorkText: string) => Promise<void>;
  isResolving: boolean;
}

export const RecentWorkIngestionCard: React.FC<RecentWorkIngestionCardProps> = ({
  onIngestRecentWork,
  isResolving,
}) => {
  const [inputText, setInputText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const samplePrompts = [
    "I recently learned Docker and containerized a Node.js microservice.",
    "I completed a course on AWS Cloud Practitioner & Terraform.",
    "I built a full-stack Next.js project with PostgreSQL and Redis caching.",
    "I integrated Gemini AI API to generate automated PR code summaries.",
    "I optimized slow SQL queries, reducing load times from 500ms to 90ms.",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isResolving) return;

    try {
      await onIngestRecentWork(inputText.trim());
      setSuccessMessage('Successfully merged into your resume and recalculated ATS score!');
      setInputText('');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Update Resume with Recent Learning or Tech Accomplishments</h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Did you recently learn a new technology, complete a project, or achieve a work metric? Tell Gemini AI to auto-update your resume bullets and re-evaluate your ATS match score!
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Instant ATS Re-Score</span>
        </span>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-indigo-300">Quick-Select Common Recent Accomplishments:</p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/50 transition text-left flex items-center space-x-1"
            >
              <PlusCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., I recently learned Docker and built a microservice with Redis caching. I also configured GitHub Actions CI/CD pipeline..."
          rows={3}
          className="w-full p-3.5 text-xs bg-slate-800/90 border border-indigo-700/60 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
        />

        {successMessage && (
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!inputText.trim() || isResolving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition ${
              !inputText.trim() || isResolving
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
            }`}
          >
            {isResolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                <span>AI Merging & Recalculating ATS Score...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>AI Merge Into My Resume & Re-Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
