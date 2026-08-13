import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flame,
  Award,
  Sparkles,
  Bell,
  CheckCircle2,
  Plus,
  Calendar,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  ChevronRight,
  BarChart2,
  RefreshCw,
  Target,
  Send,
  Trash2,
} from 'lucide-react';

interface TechWorkLog {
  id: string;
  date: string;
  projectTitle: string;
  impactMetrics: string;
  category: 'System Architecture' | 'AI / LLM' | 'Cloud Infrastructure' | 'Client Onboarding' | 'Performance';
  syncedToResume?: boolean;
}

const STORAGE_KEY_TIME = 'resume_edit_time_seconds';
const STORAGE_KEY_LOGS = 'resume_tech_work_logs';
const STORAGE_KEY_STREAK = 'resume_last_update_date';

export const ResumeEditingTrackerDashboard: React.FC = () => {
  // Timer State
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // Tech Work Completion Logs
  const [techLogs, setTechLogs] = useState<TechWorkLog[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMetrics, setNewMetrics] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TechWorkLog['category']>('System Architecture');

  // Reminders & Nudges
  const [reminderFrequency, setReminderFrequency] = useState<'weekly' | 'biweekly' | 'sprint'>('sprint');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);

  // Load persisted data
  useEffect(() => {
    try {
      const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
      if (savedTime) setTotalSeconds(parseInt(savedTime, 10) || 0);

      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (savedLogs) {
        setTechLogs(JSON.parse(savedLogs));
      } else {
        // Initial sample technical logs
        const defaultLogs: TechWorkLog[] = [
          {
            id: 'log_1',
            date: '3 days ago',
            projectTitle: 'Deployed Multi-Region Kafka Cluster',
            impactMetrics: 'Reduced message processing latency by 45% across 4 client sites',
            category: 'Cloud Infrastructure',
            syncedToResume: true,
          },
          {
            id: 'log_2',
            date: 'Yesterday',
            projectTitle: 'Agentic RAG Tool Calling Gateway',
            impactMetrics: 'Integrated 12 REST endpoints with 99.8% execution accuracy in production',
            category: 'AI / LLM',
            syncedToResume: false,
          },
        ];
        setTechLogs(defaultLogs);
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(defaultLogs));
      }
    } catch (e) {
      console.error('Failed loading tracker storage', e);
    }
  }, []);

  // Timer Tick Interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
        setTotalSeconds((prev) => {
          const updated = prev + 1;
          localStorage.setItem(STORAGE_KEY_TIME, updated.toString());
          return updated;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLog: TechWorkLog = {
      id: `log_${Date.now()}`,
      date: 'Just now',
      projectTitle: newTitle.trim(),
      impactMetrics: newMetrics.trim() || 'High-impact technical deliverable completed.',
      category: newCategory,
      syncedToResume: false,
    };

    const updated = [newLog, ...techLogs];
    setTechLogs(updated);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_STREAK, new Date().toISOString());

    setNewTitle('');
    setNewMetrics('');
    setShowAddLogModal(false);
  };

  const handleToggleSync = (id: string) => {
    const updated = techLogs.map((log) =>
      log.id === id ? { ...log, syncedToResume: !log.syncedToResume } : log
    );
    setTechLogs(updated);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  };

  const handleDeleteLog = (id: string) => {
    const updated = techLogs.filter((l) => l.id !== id);
    setTechLogs(updated);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  };

  // Helper time formatters
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const unsyncedCount = techLogs.filter((l) => !l.syncedToResume).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Header & Motivational Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white shadow-md">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white">Resume Edit Time & Achievement Tracker</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>Career Freshness High</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Track active refinement time and continuously log new technical wins before you forget metrics.
            </p>
          </div>
        </div>

        {/* Live Timer Control */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Session Focus</span>
            <span className="text-sm font-mono font-extrabold text-indigo-400">
              {formatTime(sessionSeconds)}
            </span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow ${
              isTimerRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Mini-Dashboard Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Time Logged */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Refinement Time</span>
            <BarChart2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-white">
            {formatTime(totalSeconds)}
          </div>
          <p className="text-[11px] text-slate-400">Invested across revisions</p>
        </div>

        {/* Card 2: Tech Wins Logged */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Technical Wins</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-amber-300">
            {techLogs.length} Accomplishments
          </div>
          <p className="text-[11px] text-slate-400">
            {unsyncedCount > 0 ? `${unsyncedCount} ready to add to resume` : 'All synced to resume'}
          </p>
        </div>

        {/* Card 3: Freshness Index */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Resume Freshness</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-emerald-400">
            {unsyncedCount === 0 ? '100% Up to Date' : '92% Fresh'}
          </div>
          <p className="text-[11px] text-slate-400">Updated within last 7 days</p>
        </div>

        {/* Card 4: Reminder Nudge status */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Sprint Reminders</span>
            <Bell className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-extrabold text-purple-300 capitalize">
            {reminderEnabled ? `${reminderFrequency} Prompt` : 'Paused'}
          </div>
          <p className="text-[11px] text-slate-400">Nudges after major shipped PRs</p>
        </div>
      </div>

      {/* Motivational Reminder Callout Banner */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 p-4 rounded-xl border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-indigo-200">
              💡 Proactive Career Habit: Log Impact While It's Fresh
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Engineers forget 60% of quantitative project metrics within 3 months. Log new architectures, scale stats, and client wins immediately after shipping.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddLogModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 flex-shrink-0 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Log Technical Win</span>
        </button>
      </div>

      {/* Logged Technical Work / Accomplishments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="uppercase tracking-wider text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recent Completed Technical Milestones ({techLogs.length})</span>
          </span>

          <span className="text-[11px] text-indigo-300">
            Click "+ Add to Resume" to incorporate into your active draft
          </span>
        </div>

        <div className="space-y-2.5">
          {techLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                log.syncedToResume
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                  : 'bg-slate-800/90 border-slate-700/90 text-white hover:border-indigo-500/50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-white">{log.projectTitle}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                    {log.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">• {log.date}</span>
                </div>

                <p className="text-xs text-slate-300 font-mono">
                  📊 {log.impactMetrics}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  onClick={() => handleToggleSync(log.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                    log.syncedToResume
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                  }`}
                >
                  {log.syncedToResume ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>In Resume</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Sync to Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                  title="Remove log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Add Technical Win Modal / Inline Drawer */}
      {showAddLogModal && (
        <form
          onSubmit={handleAddLog}
          className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-xs font-extrabold text-indigo-300 border-b border-slate-800 pb-2">
            <span>Log a New Technical Project Win or Metric</span>
            <button
              type="button"
              onClick={() => setShowAddLogModal(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project Title (e.g., Designed Real-time LLM Guardrails Gateway)"
              className="sm:col-span-6 bg-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="sm:col-span-6 bg-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="System Architecture">System Architecture</option>
              <option value="AI / LLM">AI / LLM</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Client Onboarding">Client Onboarding</option>
              <option value="Performance">Performance</option>
            </select>

            <input
              type="text"
              value={newMetrics}
              onChange={(e) => setNewMetrics(e.target.value)}
              placeholder="Quantified Impact Metric (e.g., Reduced p99 latency by 35% for 10M daily requests)"
              className="sm:col-span-10 bg-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="sm:col-span-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg transition"
            >
              Save Log
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
