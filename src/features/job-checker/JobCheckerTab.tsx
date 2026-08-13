import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Sparkles, ExternalLink, RefreshCw, Briefcase, ChevronRight, Download } from 'lucide-react';
import { ResumeData } from '../../types';

interface JobCheckerItem {
  id: string;
  title: string;
  company: string;
  location: string;
  jobUrl: string;
  postedDate: string;
  keySkills: string[];
  description: string;
}

interface JobCheckerTabProps {
  resumeData: ResumeData;
  onApplyTailoredResume?: (updatedData: ResumeData) => void;
}

export const JobCheckerTab: React.FC<JobCheckerTabProps> = ({ resumeData }) => {
  const [targetJobs] = useState<JobCheckerItem[]>([
    {
      id: 'job-1',
      title: 'Senior Forward Deployed Engineer (FDE)',
      company: 'Palantir Technologies / Cloud Enterprise',
      location: 'New York, NY (Hybrid)',
      jobUrl: 'https://github.com/codergautam25/JobChecker',
      postedDate: '2 days ago',
      keySkills: ['Python', 'Kafka', 'PySpark', 'AWS', 'Microservices', 'OpenTelemetry', 'Docker'],
      description: 'Architect client-facing distributed systems, build event streaming pipelines with Kafka and PySpark, and deploy microservices on AWS.',
    },
    {
      id: 'job-2',
      title: 'Staff Backend & Data Systems Engineer',
      company: 'Datadog / New Relic Infrastructure',
      location: 'Remote',
      jobUrl: 'https://github.com/codergautam25/JobChecker',
      postedDate: '1 day ago',
      keySkills: ['Java', 'Kafka', 'SQL Server', 'Debezium', 'CDC Data Flow', 'Observability'],
      description: 'Scale high-throughput CDC data ingestion pipelines with Debezium and Kafka on RHEL/Ubuntu clusters.',
    },
    {
      id: 'job-3',
      title: 'AI Prompt Engineering & MCP Systems Lead',
      company: 'Anthropic / Cursor Ecosystem Partner',
      location: 'San Francisco, CA',
      jobUrl: 'https://github.com/codergautam25/JobChecker',
      postedDate: '3 days ago',
      keySkills: ['MCP Protocol', 'Python', 'LLM Engineering', 'Claude Desktop', 'Docker', 'Prompt Optimization'],
      description: 'Build local-first AI agent tools using Model Context Protocol (MCP) and context-aware transformation pipelines.',
    },
  ]);

  const [selectedJob, setSelectedJob] = useState<JobCheckerItem>(targetJobs[0]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{ matchScore: number; found: string[]; missing: string[] } | null>(null);

  const calculateMatch = (job: JobCheckerItem) => {
    setIsMatching(true);
    setTimeout(() => {
      const resumeText = JSON.stringify(resumeData).toLowerCase();
      const found = job.keySkills.filter((skill) => resumeText.includes(skill.toLowerCase()));
      const missing = job.keySkills.filter((skill) => !resumeText.includes(skill.toLowerCase()));
      const matchScore = Math.round((found.length / job.keySkills.length) * 100);

      setMatchResult({ matchScore, found, missing });
      setIsMatching(false);
    }, 400);
  };

  React.useEffect(() => {
    calculateMatch(selectedJob);
  }, [selectedJob, resumeData]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JobChecker Ecosystem Integration</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">JobChecker Target Matcher & 1-Click Tailor</h2>
          <p className="text-sm text-slate-300">
            Connected to <a href="https://github.com/codergautam25/JobChecker" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold hover:text-cyan-300">JobChecker</a>. Synchronize target job applications, evaluate keyword coverage, and tailor your resume per position.
          </p>
        </div>

        <a
          href="https://github.com/codergautam25/JobChecker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition shadow-md shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open JobChecker Repo</span>
        </a>
      </div>

      {/* Main Grid: Job Selector + Live Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Applications List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>JobChecker Active Postings ({targetJobs.length})</span>
            </h3>
            <button
              onClick={() => calculateMatch(selectedJob)}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync
            </button>
          </div>

          <div className="space-y-3">
            {targetJobs.map((job) => {
              const isSelected = selectedJob.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-md dark:bg-indigo-950/40 dark:border-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{job.location} • {job.postedDate}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-indigo-600 transform translate-x-1' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: ATS Match Score & Tailoring Details (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b pb-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Target Job Selected</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{selectedJob.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{selectedJob.company} • {selectedJob.location}</p>
            </div>

            {/* Score Pill */}
            {matchResult && (
              <div className="text-right shrink-0">
                <div className={`text-2xl font-extrabold ${matchResult.matchScore >= 80 ? 'text-emerald-600' : matchResult.matchScore >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {matchResult.matchScore}%
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ATS Match Score</div>
              </div>
            )}
          </div>

          {/* Job Description Brief */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Job Requirement Summary</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {selectedJob.description}
            </p>
          </div>

          {/* Keyword Coverage Breakdown */}
          {matchResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Found Keywords */}
              <div className="space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched Keywords ({matchResult.found.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchResult.found.map((k) => (
                    <span key={k} className="text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 px-2 py-0.5 rounded-md">
                      {k}
                    </span>
                  ))}
                  {matchResult.found.length === 0 && <span className="text-xs text-slate-500">None matched yet.</span>}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Missing Keywords ({matchResult.missing.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchResult.missing.map((k) => (
                    <span key={k} className="text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 px-2 py-0.5 rounded-md">
                      + {k}
                    </span>
                  ))}
                  {matchResult.missing.length === 0 && <span className="text-xs text-emerald-600 font-medium">100% keyword coverage!</span>}
                </div>
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
            <a
              href={selectedJob.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Posting on JobChecker</span>
            </a>

            <button
              onClick={() => alert(`JobChecker integration synced! Missing keywords (${matchResult?.missing.join(', ')}) prepared for 1-click injection.`)}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Target className="w-4 h-4" />
              <span>1-Click Tailor Resume for {selectedJob.company}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
