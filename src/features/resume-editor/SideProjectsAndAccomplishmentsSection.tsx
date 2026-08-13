import React, { useState } from 'react';
import { SideProjectOrAccomplishment } from '../../types';
import { FolderGit2, Plus, Trash2, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { SERVICENOW_CURATED_ACCOMPLISHMENTS } from '../../services/ollamaService';

interface SideProjectsAndAccomplishmentsSectionProps {
  items: SideProjectOrAccomplishment[];
  onChange: (items: SideProjectOrAccomplishment[]) => void;
  onOpenOllamaGenerator?: () => void;
}

export const SideProjectsAndAccomplishmentsSection: React.FC<SideProjectsAndAccomplishmentsSectionProps> = ({
  items = [],
  onChange,
  onOpenOllamaGenerator,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddItem = () => {
    const newItem: SideProjectOrAccomplishment = {
      id: `acc-${Date.now()}`,
      title: 'ServiceNow Automated Workflow / Spoke Implementation',
      category: 'Side Project',
      description: 'Engineered an automated script and REST API integration to streamline incident routing and SLA resolution.',
      technologies: ['ServiceNow Flow Designer', 'REST API', 'JavaScript'],
      impactMetrics: 'Reduced resolution SLA times by 40%.',
      domain: 'ServiceNow',
      date: '2024',
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const handleAddServiceNowTemplate = (acc: SideProjectOrAccomplishment) => {
    // Avoid duplicate additions by ID or title
    if (!items.some((i) => i.title.toLowerCase() === acc.title.toLowerCase())) {
      onChange([...items, { ...acc, id: `acc-sn-${Date.now()}-${Math.random()}` }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updated: Partial<SideProjectOrAccomplishment>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              Side Projects, Open Source & Unlisted Accomplishments
            </h3>
            <p className="text-xs text-slate-400">
              Highlight ServiceNow Store apps, community contributions, open-source work, and personal labs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenOllamaGenerator && (
            <button
              type="button"
              onClick={onOpenOllamaGenerator}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Ollama AI Generator
            </button>
          )}

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Add New Entry
          </button>
        </div>
      </div>

      {/* Pre-Curated ServiceNow Quick Add Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Quick Add ServiceNow Curated Store Apps & Labs
          </span>
          <span className="text-[10px] text-slate-500">1-Click Insert</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SERVICENOW_CURATED_ACCOMPLISHMENTS.map((acc) => {
            const exists = items.some((i) => i.title.toLowerCase() === acc.title.toLowerCase());
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleAddServiceNowTemplate(acc)}
                disabled={exists}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-all flex items-center ${
                  exists
                    ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30 opacity-70 cursor-default'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-cyan-500 hover:text-cyan-300 active:scale-95'
                }`}
              >
                {exists ? 'Added ✓ ' : '+ '}
                {acc.title.slice(0, 45)}...
              </button>
            );
          })}
        </div>
      </div>

      {/* Accomplishments Item List */}
      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl space-y-2">
          <FolderGit2 className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-xs text-slate-400">No side projects or unlisted accomplishments added yet.</p>
          <p className="text-[11px] text-slate-500">Use the quick add bar above or click "Ollama AI Generator" to generate tailored ServiceNow labs!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 pr-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Project / Accomplishment Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                      placeholder="e.g. ServiceNow IntegrationHub Custom Spoke"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Category / Type</label>
                    <select
                      value={item.category}
                      onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ServiceNow Store App">ServiceNow Store App</option>
                      <option value="Side Project">Side Project</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Personal Lab">Personal Lab</option>
                      <option value="Community Work">Community Work</option>
                      <option value="Unlisted Accomplishment">Unlisted Accomplishment</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-all"
                  title="Remove entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                  placeholder="Describe technical implementation details, APIs used, and architecture..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Impact Metrics & Results</label>
                  <input
                    type="text"
                    value={item.impactMetrics || ''}
                    onChange={(e) => handleUpdateItem(item.id, { impactMetrics: e.target.value })}
                    placeholder="e.g. Reduced provisioning SLA from 4 hrs to 90 seconds"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Technologies Used (Comma Separated)</label>
                  <input
                    type="text"
                    value={(item.technologies || []).join(', ')}
                    onChange={(e) =>
                      handleUpdateItem(item.id, {
                        technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Flow Designer, IntegrationHub, REST API, GlideAPI"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
