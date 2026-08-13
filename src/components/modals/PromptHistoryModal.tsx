import React from 'react';
import { PromptHistoryItem } from '../../types';
import { Terminal, X, Copy, Check, Clock, Sparkles, Send } from 'lucide-react';

interface PromptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptHistory: PromptHistoryItem[];
  onReRunPrompt?: (promptText: string) => void;
}

export const PromptHistoryModal: React.FC<PromptHistoryModalProps> = ({
  isOpen,
  onClose,
  promptHistory,
  onReRunPrompt,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type: PromptHistoryItem['actionType']) => {
    switch (type) {
      case 'analysis':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Resume Audit</span>;
      case 'jd_match':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Job Description Match</span>;
      case 'work_ingestion':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Work Ingestion</span>;
      case 'clarification':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Clarification Answers</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">Prompt</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Given Prompt & Job Description History</h3>
              <p className="text-[11px] text-slate-400">
                Log of all user prompts, custom instructions, and target job descriptions passed to Gemini AI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {promptHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium">No previous prompts recorded in this session yet.</p>
              <p className="text-[11px] text-slate-400">
                When you paste job descriptions, answer clarification doubts, or ingest work, prompt logs will appear here.
              </p>
            </div>
          ) : (
            promptHistory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(item.actionType)}
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(item.id, item.promptText)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    {onReRunPrompt && (
                      <button
                        onClick={() => {
                          onReRunPrompt(item.promptText);
                          onClose();
                        }}
                        className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-700 flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Re-run</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                  {item.promptText}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
