import React, { useState } from 'react';
import { HelpCircle, Check, X, Sparkles, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { ClarificationQuestion } from '../../types';

interface ClarificationModalProps {
  questions: ClarificationQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswers: (answers: { questionId: string; question: string; answer: string }[]) => void;
  isResolving: boolean;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  questions,
  isOpen,
  onClose,
  onSubmitAnswers,
  isResolving,
}) => {
  if (!isOpen || questions.length === 0) return null;

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleTextChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleOptionSelect = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = () => {
    const formatted = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || "No additional detail provided.",
    }));
    onSubmitAnswers(formatted);
  };

  const answeredCount = Object.values(answers).filter((a): a is string => typeof a === 'string' && a.trim().length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">AI Skill & Experience Clarification</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                {questions.length} Doubts Found
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Gemini AI detected a few ambiguities or unquantified metrics in your resume. Answering these will significantly boost your ATS score and impress recruiters.
            </p>
          </div>
        </div>

        {/* Question List */}
        <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Question #{idx + 1} • {q.section}
                </span>
                {q.targetItemTitle && (
                  <span className="text-[11px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md font-medium">
                    {q.targetItemTitle}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-800 leading-snug">{q.question}</p>

              <div className="text-xs text-slate-500 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/50 flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Why AI is asking:</strong> {q.context}
                </span>
              </div>

              {/* Quick Answer Option Pills */}
              {q.suggestedAnswerOptions && q.suggestedAnswerOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.suggestedAnswerOptions.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect(q.id, opt)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Freeform Answer Input */}
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                placeholder="Type your answer or metric details here..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>
              Answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Skip for now
            </button>

            <button
              onClick={handleSubmit}
              disabled={isResolving}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
            >
              {isResolving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Resolve & Update Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
