import React, { useState, useEffect } from 'react';
import { InterviewPrepData, InterviewQuestion, AnswerEvaluationResponse } from '../../types';
import { RoleFlashcardsSection } from './RoleFlashcardsSection';
import {
  MessageSquare,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Send,
  Award,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Layers,
  ThumbsUp,
  Lightbulb,
  Copy,
  Check,
  Zap,
  Target,
  Brain,
  MessageCircle,
} from 'lucide-react';

interface InterviewPrepProps {
  resumeText?: string;
  jobDescription?: string;
  targetRole?: string;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({
  resumeText = '',
  jobDescription = '',
  targetRole = 'Forward Deployed Engineer (FDE)',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'flashcards'>('questions');
  const [prepData, setPrepData] = useState<InterviewPrepData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active question filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('');

  // Interactive Practice State per question
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, AnswerEvaluationResponse>>({});
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState<string | null>(null);
  const [practicedQuestions, setPracticedQuestions] = useState<Set<string>>(new Set());
  const [activeTabPerQuestion, setActiveTabPerQuestion] = useState<Record<string, 'practice' | 'star' | 'sample'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Default high-quality FDE interview questions if API call is loading or offline
  const defaultPrepData: InterviewPrepData = {
    targetRole: 'Forward Deployed Engineer (FDE)',
    overallMatchSummary:
      'Candidates for FDE and Solutions roles are evaluated on dual tracks: deep full-stack technical architecture and rapid client discovery leadership. Interviewers will test your ability to scope integration boundaries, handle client pushback, and build production-ready prototypes on tight deadlines.',
    questions: [
      {
        id: 'q1',
        category: 'Client / Forward Deployed',
        difficulty: 'Hard',
        question:
          'Walk me through a time when a client requested a technical feature that was architecturally unsound or outside project scope during an on-site deployment. How did you handle it?',
        contextWhyAsked:
          'FDEs work directly with non-technical client stakeholders and CTOs on-site. Interviewers want to see how you balance client satisfaction with engineering sanity without damaging relationship trust.',
        starGuide: {
          situationTask:
            'Describe a high-stakes deployment where a client requested an unfeasible or risky API integration requirement on tight deadline.',
          action:
            'Explain how you conducted a rapid technical spike, presented data-driven trade-offs, proposed a safer alternative phase 1 architecture, and re-aligned stakeholders.',
          result:
            'Mention meeting the launch deadline with 100% uptime, saving 3 weeks of re-work, and securing client executive praise.',
        },
        sampleIdealAnswer:
          'During an enterprise rollout for a financial client, the client CTO requested that we bypass API authentication controls to speed up legacy database sync. Recognizing the severe zero-trust security risk, I scheduled a 30-minute whiteboard discovery session. I demonstrated how a lightweight token-gated gateway could be implemented in under 4 hours without sacrificing latency. We deployed the secure gateway on schedule, achieved sub-50ms query times, and the client commended our proactive security posture.',
        keyPointsToInclude: [
          'Diplomatic stakeholder communication',
          'Data-backed trade-off analysis',
          'Compromise architecture that preserved security',
          'Quantifiable deployment metric or speedup',
        ],
      },
      {
        id: 'q2',
        category: 'Technical',
        difficulty: 'Medium',
        question:
          'How do you design a resilient data ingestion pipeline when integrating an enterprise customer’s legacy REST/SQL database with modern LLM RAG pipelines?',
        contextWhyAsked:
          'As an FDE, you will frequently connect client legacy infrastructure to modern AI models. Interviewers test your knowledge of rate limiting, error handling, vector embeddings, and schema reconciliation.',
        starGuide: {
          situationTask:
            'Detail an integration project where customer data was messy, unindexed, or constrained by strict API rate limits.',
          action:
            'Outline using batch ETL queues, asynchronous retries, chunking strategies for vector indexing, and fallback cache mechanisms.',
          result:
            'State metrics like processing 500k records/hour with zero data loss and achieving sub-second query retrieval times.',
        },
        sampleIdealAnswer:
          'I designed an integration pipeline for a healthcare client with legacy SQL databases. To ingest 200,000 patient records into a vector search database without overloading their production servers, I built a micro-batch ETL worker in TypeScript using BullMQ and Redis. I implemented exponential backoff retries and dynamic batch sizing based on server response latency. The pipeline completed ingestion in 45 minutes with 0% dropped packets and enabled sub-300ms RAG context retrieval.',
        keyPointsToInclude: [
          'Batch processing & backpressure handling',
          'Vector database indexing strategy (Pinecone/pgvector)',
          'Error handling & zero-data-loss guarantees',
          'Latency metrics & throughput benchmarks',
        ],
      },
      {
        id: 'q3',
        category: 'System Design',
        difficulty: 'Hard',
        question:
          'Design an end-to-end multi-tenant customer dashboard system that requires real-time websocket updates, RBAC security, and isolated database schemas.',
        contextWhyAsked:
          'Tests your ability to architect scalable B2B enterprise software with enterprise-grade isolation and real-time responsiveness.',
        starGuide: {
          situationTask:
            'Focus on designing a multi-tenant platform for enterprise customers demanding strict data separation.',
          action:
            'Discuss database tenant isolation patterns (row-level security vs separate schemas), JWT token claims for RBAC, and WebSocket connection scaling.',
          result:
            'Demonstrate complete data privacy compliance, zero cross-tenant leakage, and sub-100ms real-time event distribution.',
        },
        sampleIdealAnswer:
          'I architected a multi-tenant enterprise portal supporting over 50 client organizations. For database isolation, I implemented PostgreSQL Row Level Security (RLS) bound to tenant IDs inside signed JWT tokens. For real-time updates, I utilized Express WebSockets paired with a Redis Pub/Sub cluster to broadcast live status changes. This architecture guaranteed 100% tenant data isolation while maintaining sub-50ms message latency across 10,000 concurrent socket connections.',
        keyPointsToInclude: [
          'PostgreSQL Row Level Security (RLS) or tenant isolation',
          'Redis Pub/Sub & WebSockets for real-time state',
          'Role-Based Access Control (RBAC) token security',
          'Concurrency scaling benchmarks',
        ],
      },
      {
        id: 'q4',
        category: 'Behavioral',
        difficulty: 'Medium',
        question:
          'Tell me about a time when a critical bug occurred in production during a live client demonstration or pilot launch. What steps did you take immediately and post-incident?',
        contextWhyAsked:
          'FDEs operate in high-pressure environments where live demos and pilot rollouts can hit unexpected edge cases. Interviewers evaluate composure, rapid troubleshooting, and post-mortem accountability.',
        starGuide: {
          situationTask:
            'Describe a live demo or pilot deployment where an unexpected error broke a core user flow.',
          action:
            'Detail remaining calm, checking server logs, applying a quick feature flag bypass or hotfix, and communicating transparently with client leaders.',
          result:
            'Highlight resolving the issue within minutes, successfully closing the pilot, and implementing automated regression testing.',
        },
        sampleIdealAnswer:
          'During a pilot launch with an enterprise partner, an unexpected API CORS error blocked document uploads in front of their VP of Ops. I remained calm, opened our developer console, identified an origin mismatch in our proxy, and toggled a fallback client-side validation flow within 90 seconds. After completing a successful demo, I ran a root-cause post-mortem, patched the CORS middleware, and added automated staging environment checks to prevent recurrence.',
        keyPointsToInclude: [
          'Graceful poise under client pressure',
          'Rapid root-cause diagnosis via logs/DevTools',
          'Immediate mitigation vs permanent fix strategy',
          'Transparent client post-mortem communication',
        ],
      },
      {
        id: 'q5',
        category: 'Role-Fit',
        difficulty: 'Easy',
        question:
          'Why are you specifically pursuing a Forward Deployed Engineering role rather than a pure backend or pure customer success position?',
        contextWhyAsked:
          'Checks candidate self-awareness and alignment with the unique hybrid nature of FDE roles—combining hands-on production coding with direct client impact.',
        starGuide: {
          situationTask:
            'Articulate your passion for both deep technical building and immediate human problem-solving in the field.',
          action:
            'Connect past experiences where writing code directly solved a pressing customer bottleneck.',
          result:
            'Summarize how FDE represents your ideal sweet spot for career growth, ownership, and product feedback loops.',
        },
        sampleIdealAnswer:
          'I thrive at the intersection of deep code craftsmanship and real-world client impact. While I love building distributed systems, I find it immensely rewarding when the code I write directly solves a client bottleneck on day one. FDE allows me to own the entire feedback loop—from listening to client pain points in the morning to shipping production features in the afternoon. That rapid feedback loop makes me a significantly sharper engineer and trusted client partner.',
        keyPointsToInclude: [
          'Passion for rapid client feedback loops',
          'Balance of technical rigor and stakeholder empathy',
          'Drive for high-velocity ownership and delivery',
        ],
      },
    ],
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview questions.');
      }

      const resData = await response.json();
      if (resData.data && resData.data.questions?.length > 0) {
        setPrepData(resData.data);
        setActiveQuestionId(resData.data.questions[0].id);
      } else {
        setPrepData(defaultPrepData);
        setActiveQuestionId(defaultPrepData.questions[0].id);
      }
    } catch (err: any) {
      console.warn('Using default high-impact interview questions:', err);
      setError('Used tailored default question set. Click Refresh to regenerate with AI.');
      if (!prepData) {
        setPrepData(defaultPrepData);
        setActiveQuestionId(defaultPrepData.questions[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!prepData) {
      fetchQuestions();
    }
  }, []);

  const data = prepData || defaultPrepData;

  const categories = ['All', 'Behavioral', 'Technical', 'System Design', 'Client / Forward Deployed', 'Role-Fit'];

  const filteredQuestions = data.questions.filter((q) => {
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory;
  });

  const activeQuestion = data.questions.find((q) => q.id === activeQuestionId) || filteredQuestions[0] || data.questions[0];

  const handleEvaluateAnswer = async (qId: string) => {
    const answer = userAnswers[qId];
    if (!answer || answer.trim().length < 10) {
      alert('Please type or paste a complete practice response before requesting AI feedback.');
      return;
    }

    setEvaluatingQuestionId(qId);
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          contextWhyAsked: activeQuestion.contextWhyAsked,
          userAnswer: answer,
          targetRole: data.targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate practice answer.');
      }

      const resData = await response.json();
      if (resData.data) {
        setEvaluations((prev) => ({ ...prev, [qId]: resData.data }));
        setPracticedQuestions((prev) => new Set(prev).add(qId));
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
      alert('Could not evaluate answer. Please check connection and try again.');
    } finally {
      setEvaluatingQuestionId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentTab = activeTabPerQuestion[activeQuestion?.id || ''] || 'practice';

  const setQuestionTab = (tab: 'practice' | 'star' | 'sample') => {
    if (activeQuestion) {
      setActiveTabPerQuestion((prev) => ({ ...prev, [activeQuestion.id]: tab }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Section Navigation: STAR Practice vs Role Flashcards */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('questions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
            activeSubTab === 'questions'
              ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-indigo-400'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>STAR Method Practice Questions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('flashcards')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
            activeSubTab === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-indigo-400'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Role Study Flashcards</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-500/30 ml-1">
            New
          </span>
        </button>
      </div>

      {activeSubTab === 'flashcards' ? (
        <RoleFlashcardsSection
          resumeText={resumeText}
          jobDescription={jobDescription}
          targetRole={targetRole}
        />
      ) : (
        <>
          {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Interview Prep & AI Practice Studio</h2>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  STAR Method Practice
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Targeted interview questions generated specifically from your resume and target job requirements. Practice answers with instant AI feedback.
              </p>
            </div>
          </div>

          <button
            onClick={fetchQuestions}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating Questions...' : 'Regenerate Questions'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-amber-950/50 border border-amber-800 text-amber-200 px-4 py-2 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Positioning Summary */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Candidate Positioning & Strategy for {data.targetRole}</span>
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">{data.overallMatchSummary}</p>
        </div>

        {/* Practice Progress Bar */}
        <div className="flex items-center justify-between text-xs bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Practice Progress:</span>
            <span className="font-extrabold text-white">
              {practicedQuestions.size} of {data.questions.length} Questions Practiced
            </span>
          </div>

          <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden hidden sm:block">
            <div
              className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(practicedQuestions.size / Math.max(data.questions.length, 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Practice Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List Navigation */}
        <div className="lg:col-span-5 space-y-3">
          {/* Category Filters */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Filter Category</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Selector Cards */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredQuestions.map((q, idx) => {
              const isSelected = activeQuestion?.id === q.id;
              const isPracticed = practicedQuestions.has(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 relative ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-extrabold">
                      Q{idx + 1} • {q.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {isPracticed && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Practiced</span>
                        </span>
                      )}

                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                          q.difficulty === 'Hard'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold leading-snug line-clamp-2">{q.question}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Question Interactive Workspace */}
        {activeQuestion && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Active Question Top Bar */}
            <div className="space-y-3 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-extrabold tracking-widest text-indigo-400">
                  {activeQuestion.category} • {activeQuestion.difficulty} Difficulty
                </span>

                <button
                  onClick={() => handleCopy(activeQuestion.question, 'q-text')}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center space-x-1"
                >
                  {copiedId === 'q-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'q-text' ? 'Copied' : 'Copy Question'}</span>
                </button>
              </div>

              <h3 className="text-base md:text-lg font-extrabold text-white leading-snug">{activeQuestion.question}</h3>

              {/* Context Why Asked Callout */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-1">
                <span className="font-extrabold text-amber-400 flex items-center space-x-1 text-[11px] uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why Interviewers Ask This</span>
                </span>
                <p className="leading-relaxed">{activeQuestion.contextWhyAsked}</p>
              </div>
            </div>

            {/* View Mode Tabs (Practice Workspace / STAR Guide / Ideal Model Answer) */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setQuestionTab('practice')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'practice'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Practice Response & Feedback</span>
              </button>

              <button
                onClick={() => setQuestionTab('star')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'star'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>STAR Framework Guide</span>
              </button>

              <button
                onClick={() => setQuestionTab('sample')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'sample'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Model Ideal Answer</span>
              </button>
            </div>

            {/* TAB 1: PRACTICE & AI EVALUATION */}
            {currentTab === 'practice' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Draft Your Practice Answer (Speak or Type):</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {(userAnswers[activeQuestion.id] || '').length} chars
                    </span>
                  </label>

                  <textarea
                    rows={6}
                    value={userAnswers[activeQuestion.id] || ''}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                    }
                    placeholder="Structure using STAR: Situation/Task, Actions taken, and Quantifiable Results achieved..."
                    className="w-full bg-slate-950 text-slate-100 text-xs p-3.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans placeholder-slate-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleEvaluateAnswer(activeQuestion.id)}
                    disabled={evaluatingQuestionId === activeQuestion.id}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shadow-md disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${evaluatingQuestionId === activeQuestion.id ? 'animate-spin' : ''}`} />
                    <span>
                      {evaluatingQuestionId === activeQuestion.id ? 'Analyzing Answer...' : 'Submit Answer for AI Feedback'}
                    </span>
                  </button>

                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    Evaluates clarity, metrics, STAR structure & impact
                  </span>
                </div>

                {/* AI Evaluation Feedback Box */}
                {evaluations[activeQuestion.id] && (
                  <div className="bg-slate-950 border border-indigo-900/80 rounded-xl p-4 space-y-3.5 mt-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-extrabold text-sm text-white">AI Interviewer Evaluation Report</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400 font-bold">Score:</span>
                        <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-mono">
                          {evaluations[activeQuestion.id].score} / 10
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            evaluations[activeQuestion.id].verdict === 'Excellent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : evaluations[activeQuestion.id].verdict === 'Good'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {evaluations[activeQuestion.id].verdict}
                        </span>
                      </div>
                    </div>

                    {/* Strengths & Missing Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50 space-y-1">
                        <span className="font-extrabold text-emerald-400 flex items-center space-x-1 text-[11px] uppercase">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>What Worked Well</span>
                        </span>
                        <ul className="list-disc list-inside text-emerald-200/90 space-y-1 text-[11px] leading-snug">
                          {evaluations[activeQuestion.id].strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-900/50 space-y-1">
                        <span className="font-extrabold text-amber-400 flex items-center space-x-1 text-[11px] uppercase">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Key Elements Missing</span>
                        </span>
                        <ul className="list-disc list-inside text-amber-200/90 space-y-1 text-[11px] leading-snug">
                          {evaluations[activeQuestion.id].missingElements.map((miss, i) => (
                            <li key={i}>{miss}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Polished Answer Suggestion */}
                    <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase text-indigo-400 flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Polished High-Impact STAR Response Version</span>
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "{evaluations[activeQuestion.id].polishedAnswer}"
                      </p>
                    </div>

                    {/* Coaching Tip */}
                    <div className="text-xs bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-900/80 text-indigo-200 flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Delivery Coach Tip:</strong> {evaluations[activeQuestion.id].coachingTip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: STAR FRAMEWORK GUIDE */}
            {currentTab === 'star' && (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>STAR Answer Blueprint for this Question</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-indigo-400 uppercase text-[10px] tracking-wider">
                      1. Situation & Task
                    </span>
                    <p className="text-slate-200 leading-relaxed">{activeQuestion.starGuide.situationTask}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-indigo-400 uppercase text-[10px] tracking-wider">
                      2. Action Taken (Engineering & Leadership)
                    </span>
                    <p className="text-slate-200 leading-relaxed">{activeQuestion.starGuide.action}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider">
                      3. Quantifiable Result & Impact
                    </span>
                    <p className="text-slate-200 leading-relaxed">{activeQuestion.starGuide.result}</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Must-Mention Talking Points
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeQuestion.keyPointsToInclude.map((pt, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-indigo-300 rounded-lg text-xs font-medium">
                        • {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MODEL SAMPLE ANSWER */}
            {currentTab === 'sample' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Ideal High-Score Model Response</span>
                  </h4>

                  <button
                    onClick={() => handleCopy(activeQuestion.sampleIdealAnswer, 'sample-text')}
                    className="text-xs text-indigo-300 hover:text-white transition flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    {copiedId === 'sample-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'sample-text' ? 'Copied Model Answer' : 'Copy Response'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
                  <p className="whitespace-pre-line">{activeQuestion.sampleIdealAnswer}</p>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400 text-[11px]">Pro Tip for Delivery:</span>
                  <p>
                    Deliver this answer smoothly in approximately 60-90 seconds. Keep your tone confident, articulate quantifiable metrics explicitly, and end with the positive business or client outcome.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
