import React, { useState } from 'react';
import {
  FileSearch,
  Edit3,
  Eye,
  HelpCircle,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Terminal,
  Brain,
  History,
  UserCheck,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { SAMPLE_SOFTWARE_ENGINEER, SAMPLE_PRODUCT_MANAGER } from '../../data/sampleResumes';
import { ResumeData } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeTab: 'scan' | 'analysis' | 'edit' | 'preview' | 'pulse' | 'interview' | 'hr-persona' | 'job-checker';
  setActiveTab: (tab: 'scan' | 'analysis' | 'edit' | 'preview' | 'pulse' | 'interview' | 'hr-persona' | 'job-checker') => void;
  overallScore: number | null;
  clarificationCount: number;
  onLoadSample: (sample: ResumeData) => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onOpenPromptHistory?: () => void;
  onOpenVersions?: () => void;
  onSyncObsidian?: () => void;
  onOpenOutreach?: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  overallScore,
  clarificationCount,
  onLoadSample,
  onExportPDF,
  onPrint,
  onOpenPromptHistory,
  onOpenVersions,
  onSyncObsidian,
  onOpenOutreach,
  isAnalyzing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: Array<{
    id: HeaderProps['activeTab'];
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'scan', label: 'Upload & Scan', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'analysis', label: 'ATS Score', icon: <HelpCircle className="w-4 h-4" />, badge: clarificationCount },
    { id: 'edit', label: 'Resume Editor', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
    { id: 'pulse', label: 'Career Roadmap', icon: <Compass className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Prep', icon: <Brain className="w-4 h-4" /> },
    { id: 'hr-persona', label: 'HR Persona', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'job-checker', label: 'JobChecker', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <header className="glass-header sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight font-display text-default">
                  ATS ResumAI
                </span>
                <span className="badge badge-primary hidden sm:inline-flex">
                  v3.6 Luxury
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1 p-1 rounded-full surface-input border border-default overflow-x-auto max-w-2xl scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab ${isActive ? 'active' : ''}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* ATS Score Indicator */}
            {overallScore !== null && (
              <div
                onClick={() => setActiveTab('analysis')}
                className="cursor-pointer hidden lg:flex items-center space-x-2 px-3 py-1 rounded-xl surface-card border border-default hover:border-indigo-500/50 transition shadow-xs"
                title="Click to view ATS Analysis"
              >
                <span className="text-xs font-semibold text-secondary">ATS Score:</span>
                <span
                  className={`font-black text-sm ${
                    overallScore >= 80
                      ? 'text-emerald-400'
                      : overallScore >= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {overallScore}%
                </span>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Prompt History */}
            {onOpenPromptHistory && (
              <button
                type="button"
                onClick={onOpenPromptHistory}
                className="btn btn-secondary btn-sm hidden sm:inline-flex"
                title="View prompt history log"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Prompts</span>
              </button>
            )}

            {/* Revisions History */}
            {onSyncObsidian && (
              <button
                type="button"
                onClick={onSyncObsidian}
                className="btn btn-secondary btn-sm hidden sm:inline-flex border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                title="Sync analysis & missing skills to local Obsidian Career Brain vault"
              >
                <span>💜 Obsidian</span>
              </button>
            )}

            {onOpenOutreach && (
              <button
                type="button"
                onClick={onOpenOutreach}
                className="btn btn-secondary btn-sm hidden sm:inline-flex border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                title="Generate 8th-grade humanized recruiter outreach DMs"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden md:inline">Outreach</span>
              </button>
            )}

            {/* Sample Selector */}
            <div className="relative group hidden sm:block">
              <button type="button" className="btn btn-secondary btn-sm">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sample</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 surface-card border border-default rounded-xl shadow-xl py-1 hidden group-hover:block z-50 animate-scale-in">
                <div className="px-3 py-1 font-label text-muted">Pre-loaded Samples</div>
                <button
                  type="button"
                  onClick={() => onLoadSample(SAMPLE_SOFTWARE_ENGINEER)}
                  className="w-full text-left px-3 py-2 text-xs text-default hover:bg-indigo-500/10 flex flex-col transition"
                >
                  <span className="font-bold text-indigo-400">Senior Engineer</span>
                  <span className="text-[10px] text-secondary">Full Stack & AWS</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLoadSample(SAMPLE_PRODUCT_MANAGER)}
                  className="w-full text-left px-3 py-2 text-xs text-default hover:bg-emerald-500/10 flex flex-col border-t border-subtle transition"
                >
                  <span className="font-bold text-emerald-400">Product Manager</span>
                  <span className="text-[10px] text-secondary">Fintech & SaaS</span>
                </button>
              </div>
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={onExportPDF}
              className="btn btn-primary btn-sm"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={onPrint}
              className="btn btn-ghost btn-sm p-1.5 hidden sm:inline-flex"
              title="Print Resume"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm xl:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Tablet Navigation Pill Bar */}
        <div className="hidden md:flex xl:hidden overflow-x-auto py-2 border-t border-subtle space-x-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${isActive ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-subtle space-y-1 animate-slide-up">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-secondary hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
