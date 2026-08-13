import React, { useState, useEffect } from 'react';
import { Target, Sparkles, Cpu, CheckCircle2, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { PersonalInfo, SideProjectOrAccomplishment } from '../../types';
import { getLocalOllamaModels, generateAccomplishmentsWithOllama, SERVICENOW_CURATED_ACCOMPLISHMENTS, OllamaModelInfo } from '../../services/ollamaService';

interface TargetJobRoleCardProps {
  personalInfo: PersonalInfo;
  onUpdateTargetRole: (targetRole: string, targetJobDescription: string) => void;
  onAddAccomplishment?: (acc: SideProjectOrAccomplishment) => void;
  currentSkills?: string[];
}

export const TargetJobRoleCard: React.FC<TargetJobRoleCardProps> = ({
  personalInfo,
  onUpdateTargetRole,
  onAddAccomplishment,
  currentSkills = [],
}) => {
  const [targetRole, setTargetRole] = useState(personalInfo.targetRole || 'ServiceNow Technical Architect');
  const [targetJobDescription, setTargetJobDescription] = useState(personalInfo.targetJobDescription || '');
  const [selectedModel, setSelectedModel] = useState<string>('qwen2.5-coder:1.5b');
  const [ollamaModels, setOllamaModels] = useState<OllamaModelInfo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAccomplishments, setGeneratedAccomplishments] = useState<SideProjectOrAccomplishment[]>([]);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load local Ollama models on mount
    getLocalOllamaModels().then((models) => {
      setOllamaModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0].name);
      }
    });
  }, []);

  const handleSaveTarget = () => {
    onUpdateTargetRole(targetRole, targetJobDescription);
  };

  const handleGenerateOllama = async () => {
    setIsGenerating(true);
    try {
      // Determine domain based on role/description
      const combined = `${targetRole} ${targetJobDescription}`.toLowerCase();
      let domain = 'ServiceNow';
      if (combined.includes('data') || combined.includes('pyspark') || combined.includes('kafka')) domain = 'Data Engineering & Observability';
      else if (combined.includes('aws') || combined.includes('cloud') || combined.includes('kubernetes')) domain = 'Cloud Architecture';
      else if (combined.includes('react') || combined.includes('full stack') || combined.includes('node')) domain = 'Full Stack Engineering';

      const results = await generateAccomplishmentsWithOllama({
        domain,
        targetRole,
        targetJobDescription,
        currentSkills,
        modelName: selectedModel,
      });

      setGeneratedAccomplishments(results);
    } catch (err) {
      console.error('Failed to generate accomplishments:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInjectAccomplishment = (acc: SideProjectOrAccomplishment) => {
    if (onAddAccomplishment) {
      onAddAccomplishment(acc);
      setAddedIds((prev) => ({ ...prev, [acc.id]: true }));
    }
  };

  const handleInjectAllServiceNow = () => {
    if (onAddAccomplishment) {
      SERVICENOW_CURATED_ACCOMPLISHMENTS.forEach((acc) => {
        onAddAccomplishment(acc);
        setAddedIds((prev) => ({ ...prev, [acc.id]: true }));
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 space-y-4 backdrop-blur-xl">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Target Job Role & LLM Domain Alignment</h3>
            <p className="text-xs text-slate-400">Configure target role, job description & generate accomplishments via Ollama LLM</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-3.5 h-3.5 mr-1" />
            Ollama LLM Ready
          </span>
        </div>
      </div>

      {/* Target Role Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Title / Domain Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            onBlur={handleSaveTarget}
            placeholder="e.g. ServiceNow Technical Architect / Lead Solutions Engineer"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Local Ollama LLM Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          >
            {ollamaModels.length > 0 ? (
              ollamaModels.map((m) => (
                <option key={m.name} value={m.name}>
                  🤖 {m.name} (Local Ollama LLM)
                </option>
              ))
            ) : (
              <>
                <option value="qwen2.5-coder:1.5b">🤖 qwen2.5-coder:1.5b (Local)</option>
                <option value="llama3.1:8b">🤖 llama3.1:8b (Local)</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Description & Key Requirements (Optional)</label>
        <textarea
          rows={2}
          value={targetJobDescription}
          onChange={(e) => setTargetJobDescription(e.target.value)}
          onBlur={handleSaveTarget}
          placeholder="Paste key responsibilities or target job requirements here to tailor generated side projects and accomplishments..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-600 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleGenerateOllama}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-cyan-900/30 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
            {isGenerating ? 'Generating via Ollama LLM...' : '⚡ Generate Target Accomplishments with Ollama'}
          </button>

          <button
            type="button"
            onClick={handleInjectAllServiceNow}
            className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            + Load ServiceNow Pre-Curated Labs (4)
          </button>
        </div>
      </div>

      {/* Generated Results Carousel / List */}
      {generatedAccomplishments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-cyan-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Ollama Generated Side Projects & Accomplishments
            </h4>
            <span className="text-[11px] text-slate-400">Click to inject into resume</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedAccomplishments.map((acc) => {
              const isAdded = addedIds[acc.id];
              return (
                <div
                  key={acc.id}
                  className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isAdded
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-950 border-slate-800 hover:border-cyan-500/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-100 pr-2">{acc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                      {acc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{acc.description}</p>
                  {acc.impactMetrics && (
                    <p className="text-[11px] text-emerald-400 font-medium">💡 Impact: {acc.impactMetrics}</p>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {acc.technologies.slice(0, 3).map((tech, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInjectAccomplishment(acc)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? 'Added ✓' : '+ Add to Resume'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
