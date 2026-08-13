import React, { useState, useEffect } from 'react';
import { ResumeData, ResumeSnapshot } from '../../types';
import {
  History,
  Save,
  RotateCcw,
  GitCompare,
  Trash2,
  X,
  Plus,
  Check,
  Download,
  Upload,
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Briefcase,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResumeVersionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentResumeData: ResumeData;
  currentScore?: number | null;
  onLoadSnapshot: (snapshot: ResumeSnapshot) => void;
  targetRole?: string;
}

const STORAGE_KEY = 'resume_snapshots_v1';

export const ResumeVersionManager: React.FC<ResumeVersionManagerProps> = ({
  isOpen,
  onClose,
  currentResumeData,
  currentScore,
  onLoadSnapshot,
  targetRole,
}) => {
  const [snapshots, setSnapshots] = useState<ResumeSnapshot[]>([]);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [selectedForCompare, setSelectedForCompare] = useState<[string | null, string | null]>([null, null]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load from localStorage on mount or when modal opens
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
          return;
        }
      }
      
      // Default initial snapshots if none exist
      const defaultInitialSnapshots: ResumeSnapshot[] = [
        {
          id: 'snap_v1_initial',
          label: 'Original Resume Upload',
          note: 'Initial raw resume parsed before ATS optimization',
          timestamp: new Date(Date.now() - 3600000 * 24 * 2).toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          score: 68,
          targetRole: 'Software Engineer',
          resumeData: {
            ...currentResumeData,
            summary: 'Senior Full Stack Engineer with experience in web applications and cloud servers.',
            experience: currentResumeData.experience.map((exp, idx) => {
              if (idx === 0) {
                return {
                  ...exp,
                  highlights: exp.highlights.slice(0, 2),
                };
              }
              return exp;
            }),
          },
        },
        {
          id: 'snap_v2_fde_tailored',
          label: 'FDE & Systems Tailored V2',
          note: 'Enhanced with Vector DBs, RAG pipelines, and client discovery metrics',
          timestamp: new Date(Date.now() - 3600000 * 3).toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          score: 91,
          targetRole: 'Forward Deployed Engineer (FDE)',
          resumeData: currentResumeData,
        },
      ];

      setSnapshots(defaultInitialSnapshots);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialSnapshots));
    } catch (e) {
      console.error('Failed loading snapshots from local storage', e);
    }
  }, [isOpen]);

  // Persist to localStorage
  const saveSnapshotsToStorage = (updated: ResumeSnapshot[]) => {
    setSnapshots(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving snapshots to localStorage', e);
    }
  };

  const handleCreateSnapshot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const labelToSave = newLabel.trim() || `Revision ${snapshots.length + 1} - ${currentResumeData.personalInfo.headline || 'Resume'}`;
    const newSnap: ResumeSnapshot = {
      id: `snap_${Date.now()}`,
      label: labelToSave,
      note: newNote.trim() || undefined,
      timestamp: new Date().toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      resumeData: JSON.parse(JSON.stringify(currentResumeData)),
      score: currentScore || null,
      targetRole: targetRole || currentResumeData.personalInfo.headline,
    };

    const updated = [newSnap, ...snapshots];
    saveSnapshotsToStorage(updated);
    setNewLabel('');
    setNewNote('');
    setActiveSnapshotId(newSnap.id);
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume snapshot revision?')) {
      const updated = snapshots.filter((s) => s.id !== id);
      saveSnapshotsToStorage(updated);
      if (selectedForCompare[0] === id) setSelectedForCompare([null, selectedForCompare[1]]);
      if (selectedForCompare[1] === id) setSelectedForCompare([selectedForCompare[0], null]);
    }
  };

  const handleLoadSnapshot = (snapshot: ResumeSnapshot) => {
    onLoadSnapshot(snapshot);
    setActiveSnapshotId(snapshot.id);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshots, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resume_version_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const merged = [...imported, ...snapshots].filter(
            (v, idx, self) => idx === self.findIndex((t) => t.id === v.id)
          );
          saveSnapshotsToStorage(merged);
          alert(`Successfully imported ${imported.length} snapshot revisions!`);
        }
      } catch (err) {
        alert('Failed to parse JSON version file.');
      }
    };
    reader.readAsText(file);
  };

  // Compare diff logic
  const getSnapshotById = (id: string | null) => snapshots.find((s) => s.id === id);

  const snapA = getSnapshotById(selectedForCompare[0]) || {
    id: 'current',
    label: 'Current Active Resume',
    timestamp: 'Live Active State',
    resumeData: currentResumeData,
    score: currentScore,
  };

  const snapB = getSnapshotById(selectedForCompare[1]) || snapshots[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-850 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <span>Resume Version Control & Revision History</span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Local Storage Persisted
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Save instant snapshots of your resume, compare revisions side-by-side, and toggle between tailored versions anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isComparing ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isComparing ? 'Exit Diff View' : 'Compare Revisions'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Save New Snapshot Form */}
          <form onSubmit={handleCreateSnapshot} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center space-x-1.5">
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Save Current Active Resume as New Revision Snapshot</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={`Revision Label (e.g., FDE Tailored V${snapshots.length + 1})`}
                className="md:col-span-5 bg-slate-950 text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
              />

              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Optional Note (e.g., Added Agentic RAG keywords & 40% latency metric)"
                className="md:col-span-5 bg-slate-950 text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
              />

              <button
                type="submit"
                className="md:col-span-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Save Snapshot</span>
              </button>
            </div>
          </form>

          {/* VIEW MODE 1: LIST OF REVISION SNAPSHOTS */}
          {!isComparing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="uppercase tracking-wider text-[11px] text-slate-400">
                  Saved Revisions ({snapshots.length})
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportJSON}
                    className="text-xs text-indigo-300 hover:text-white transition flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    <Download className="w-3 h-3" />
                    <span>Backup JSON</span>
                  </button>

                  <label className="text-xs text-indigo-300 hover:text-white transition flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {snapshots.length === 0 ? (
                <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <History className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No saved resume revisions yet. Click "Save Snapshot" above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {snapshots.map((snap) => {
                    const isActive = activeSnapshotId === snap.id;
                    const totalSkills = snap.resumeData.skillCategories?.reduce(
                      (acc, c) => acc + c.skills.length,
                      0
                    ) || 0;

                    return (
                      <div
                        key={snap.id}
                        className={`p-4 rounded-xl border transition-all space-y-3 relative flex flex-col justify-between ${
                          isActive
                            ? 'bg-indigo-950/70 border-indigo-500 shadow-lg ring-1 ring-indigo-500/50'
                            : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-extrabold text-sm text-white">{snap.label}</h4>
                                {isActive && (
                                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                    Active Load
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span>Saved {snap.timestamp}</span>
                              </span>
                            </div>

                            {snap.score && (
                              <div className="px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white font-mono text-xs font-extrabold flex items-center space-x-1 shadow-sm">
                                <Sparkles className="w-3 h-3 text-indigo-200" />
                                <span>{snap.score} ATS</span>
                              </div>
                            )}
                          </div>

                          {snap.note && (
                            <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 italic">
                              "{snap.note}"
                            </p>
                          )}

                          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-slate-900 p-2 rounded-lg text-slate-300">
                            <div>
                              <span className="text-slate-500 block">Headline</span>
                              <span className="font-bold truncate block">{snap.resumeData.personalInfo.headline || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Experience</span>
                              <span className="font-bold text-white">{snap.resumeData.experience?.length || 0} Jobs</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Skills</span>
                              <span className="font-bold text-indigo-400">{totalSkills} Keywords</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
                          <button
                            onClick={() => handleLoadSnapshot(snap)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Revision</span>
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedForCompare([snap.id, snapshots[0]?.id || null]);
                                setIsComparing(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center space-x-1"
                            >
                              <GitCompare className="w-3 h-3" />
                              <span>Diff</span>
                            </button>

                            <button
                              onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                              title="Delete snapshot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* VIEW MODE 2: REVISION COMPARISON / DIFF VIEW */
            <div className="space-y-5">
              {/* Diff Selector Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/90 p-4 rounded-xl border border-slate-700">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Version A (Base Revision):
                  </label>
                  <select
                    value={selectedForCompare[0] || 'current'}
                    onChange={(e) => setSelectedForCompare([e.target.value, selectedForCompare[1]])}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="current">Current Active Draft</option>
                    {snapshots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.timestamp})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    Version B (Comparison Target):
                  </label>
                  <select
                    value={selectedForCompare[1] || (snapshots[0]?.id || 'current')}
                    onChange={(e) => setSelectedForCompare([selectedForCompare[0], e.target.value])}
                    className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="current">Current Active Draft</option>
                    {snapshots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.timestamp})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Diff Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Panel A */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase font-extrabold">Version A</span>
                      <h4 className="font-extrabold text-sm text-white">{snapA.label}</h4>
                    </div>

                    <button
                      onClick={() => handleLoadSnapshot(snapA as any)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Load This
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Summary</span>
                      <p className="text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {snapA.resumeData.summary || 'No summary'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Skills Overview</span>
                      <div className="flex flex-wrap gap-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {snapA.resumeData.skillCategories?.flatMap((c) => c.skills).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Experience Highlights Count</span>
                      <div className="bg-slate-900 p-2 rounded-lg text-slate-300 font-mono text-xs">
                        {snapA.resumeData.experience?.map((exp, i) => (
                          <div key={i} className="py-1 border-b border-slate-800 last:border-none">
                            <strong>{exp.company}</strong> ({exp.position}): {exp.highlights?.length || 0} bullet points
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel B */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-extrabold">Version B</span>
                      <h4 className="font-extrabold text-sm text-white">{snapB.label}</h4>
                    </div>

                    <button
                      onClick={() => handleLoadSnapshot(snapB as any)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Load This
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Summary</span>
                      <p className="text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {snapB.resumeData.summary || 'No summary'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Skills Overview</span>
                      <div className="flex flex-wrap gap-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {snapB.resumeData.skillCategories?.flatMap((c) => c.skills).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Experience Highlights Count</span>
                      <div className="bg-slate-900 p-2 rounded-lg text-slate-300 font-mono text-xs">
                        {snapB.resumeData.experience?.map((exp, i) => (
                          <div key={i} className="py-1 border-b border-slate-800 last:border-none">
                            <strong>{exp.company}</strong> ({exp.position}): {exp.highlights?.length || 0} bullet points
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
