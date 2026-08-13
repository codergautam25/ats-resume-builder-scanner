import React, { useState, useEffect } from 'react';
import { Header, ExportToolbar, FormatGallery, BulletRewriteModal, PromptHistoryModal, ClarificationModal, MetricSuggestionsModal, HumanizedOutreachModal } from './components';
import { ScannerStep, ATSScoreCard, ResumeEditor, ResumePreview, CareerPulse, InterviewPrep, HRPersonaSimulator, ResumeVersionManager, JobCheckerTab, DynamicCareerRoadmapTab } from './features';

import { ResumeData, ATSAnalysis, TemplateOptions, PromptHistoryItem, ResumeSnapshot, BulletMetadata } from './types';
import { SAMPLE_SOFTWARE_ENGINEER, SAMPLE_SERVICENOW_DEVELOPER, SAMPLE_PRODUCT_MANAGER } from './data/sampleResumes';
import { exportToPDF, triggerPrintResume } from './utils/pdfExport';
import { parseResumeTextToStructuredData, createEmptyResumeData, stripPdfCoordinateNoise } from './utils/resumeParser';
import { sanitizeAndFixResumeData, autoFormatResumeData, autoFormatAndFixAnalysis } from './utils/resumeSanitizer';
import { autofillKeywordIntoResume } from './utils/autofillKeywordHelper';
import { Zap, CheckCircle2, X, Check } from 'lucide-react';

export default function App() {
  // Theme Initialization
  useEffect(() => {
    const savedTheme = (localStorage.getItem('raiTheme') as 'dark' | 'light') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'scan' | 'analysis' | 'edit' | 'preview' | 'pulse' | 'interview' | 'hr-persona' | 'job-checker'>('scan');

  // Input Data States (Default to clean empty state so nothing is added in the beginning)
  const [rawText, setRawText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [extraWorkNotes, setExtraWorkNotes] = useState<string>('');

  // Active Resume & Analysis Data
  const [resumeData, setResumeData] = useState<ResumeData>(createEmptyResumeData());
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  // Auto-parse raw text when uploaded or typed
  const handleRawTextChange = (text: string) => {
    const cleanedText = stripPdfCoordinateNoise(text);
    setRawText(cleanedText);
    if (cleanedText && cleanedText.trim()) {
      const parsed = parseResumeTextToStructuredData(cleanedText);
      setResumeData(parsed);
    } else {
      setResumeData(createEmptyResumeData());
    }
  };

  const handleLoadSampleResume = (sampleType: 'swe' | 'servicenow' | 'pm' = 'servicenow') => {
    if (sampleType === 'servicenow') {
      const sampleText = `Indrani Ghosh
Senior ServiceNow Lead Consultant & Solution Architect
indrani.ghosh@example.com | +91 98765 43210 | Bengaluru, India
LinkedIn: linkedin.com/in/indranighosh-servicenow | GitHub: github.com/indranighosh-sn

SUMMARY
Results-oriented Senior ServiceNow Lead Consultant with 6+ years of expertise in ServiceNow ITSM, Flow Designer, IntegrationHub, CMDB Service Graph Connectors, Automated Test Framework (ATF), and Scripted REST APIs. Spearheaded enterprise-scale ServiceNow integrations for Fortune 500 clients at Tata Consultancy Services, achieving 45% faster incident response and 99.9% workflow execution uptime.

WORK EXPERIENCE
Tata Consultancy Services Limited - Senior ServiceNow Consultant (2021-Present)
- Architected enterprise ServiceNow IntegrationHub & Spoke pipelines connecting ServiceNow ITSM with Jira, Salesforce, and AWS, automating 15,000+ monthly change requests.
- Implemented CMDB & Service Graph Connectors for 80,000+ infrastructure CIs, achieving 99.4% CMDB data accuracy and eliminating manual CI reconciliation.
- Engineered custom Scripted REST APIs, Script Includes, Business Rules, UI Actions, and ACL security protocols across ITSM & Service Catalog modules.
- Automated regression test suites using Automated Test Framework (ATF) CI/CD integration, cutting upgrade testing cycle duration by 60%.

Global Tech Solutions - ServiceNow Developer (2018-2021)
- Configured Service Catalog items, Record Producers, and Flow Designer subflows, streamlining IT service requests for 25,000+ enterprise employees.
- Developed GlideRecord server-side scripts, Client Scripts, and UI Policies for complex incident escalation and automated SLA tracking.
- Built custom Inbound Email Actions and notification triggers, reducing ticket assignment turnaround time from 2 hours to under 4 minutes.

SKILLS
ServiceNow ITSM, Flow Designer, IntegrationHub & Spokes, CMDB & Service Graph Connectors, Automated Test Framework (ATF), Service Catalog Development, SLA Configuration, Glide APIs (GlideRecord/GlideSystem), Script Includes, Business Rules, Client Scripts, UI Policies, UI Actions, ACLs (Access Control Lists), Inbound Email Actions, Scripted REST APIs, JavaScript (ServiceNow), Agile / Scrum, ITIL v4 Governance, REST/SOAP Integrations`;

      setRawText(sampleText);
      setJobDescription(`Seeking a Senior ServiceNow Technical Lead / Architect to design enterprise IntegrationHub spokes, CMDB connectors, and Flow Designer automation workflows. Requirements: 5+ years experience in ServiceNow ITSM, Glide APIs (GlideRecord/GlideSystem), Script Includes, Business Rules, ACLs, ATF CI/CD automation, ITIL v4, CSA and CAD certifications.`);
      setExtraWorkNotes(`Designed custom IntegrationHub Spoke automating AWS EC2 instance provisioning directly from ServiceNow Service Portal requests.`);
      setResumeData(SAMPLE_SERVICENOW_DEVELOPER);
      return;
    }

    if (sampleType === 'pm') {
      const sampleText = `Elena Rostova
Lead Product Manager | Fintech & AI Products
elena.rostova@example.com | +1 (555) 890-1234 | New York, NY
LinkedIn: linkedin.com/in/elena-rostova-pm

SUMMARY
Data-driven Lead Product Manager with 7+ years leading cross-functional engineering, UX, and marketing teams to scale B2B SaaS platforms. Managed product roadmaps generating $12M+ ARR, optimized user onboarding funnels by 28%, and launched generative AI integrations.

WORK EXPERIENCE
FinTech Pulse Inc. - Senior Product Manager (2021-Present)
- Spearheaded product strategy for automated credit risk assessment engine, increasing quarterly loan approvals by $24M while maintaining risk metrics.
- Partnered with engineering leadership to deliver AI feature pipeline on time, driving 34% boost in daily user engagement across 120k active SMB clients.

SKILLS
Product Strategy, Roadmap Execution, Agile / Scrum, User Research, A/B Testing, Mixpanel, Google Analytics, Jira, Figma, SQL Data Analysis`;

      setRawText(sampleText);
      setJobDescription(`Seeking a Lead Product Manager to own B2B SaaS product roadmaps. Requirements: 5+ years product leadership, user research, OKRs, A/B testing, SQL analytics, Jira, Figma, and AI feature deployment.`);
      setExtraWorkNotes(`Launched automated credit risk assessment engine increasing approvals by $24M.`);
      setResumeData(SAMPLE_PRODUCT_MANAGER);
      return;
    }

    // Default: Full Stack SWE (Alex Rivera)
    const sampleText = `Alex Rivera
Senior Full Stack Engineer
alex.rivera@example.com | +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/alexrivera-dev

SUMMARY
Senior Full Stack Engineer with 6+ years experience in microservices, React, Node.js, Python, and AWS. Reduced latency by 40%.

WORK EXPERIENCE
Apex Cloud Innovations - Senior Full Stack Engineer (2022-Present)
- Built analytics dashboard for 2M daily users using React, Node.js, Kafka, reducing rendering latency by 42%.
- Built serverless API on AWS Lambda & DynamoDB, cutting cloud costs by $18,000/month.
- Led team of 6 engineers with code reviews and CI/CD pipelines.

Nexus Software Solutions - Full Stack Developer (2019-2022)
- Built web apps using React, PostgreSQL, Express for 500k active users.
- Optimized SQL queries and indexed PostgreSQL tables to speed up reads from 450ms to 85ms.

SKILLS
TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Redis, GraphQL, CI/CD`;

    setRawText(sampleText);
    setJobDescription(`Seeking a Senior Full Stack Software Engineer to build high-scale cloud platforms. Requirements: 5+ years experience in React, TypeScript, Node.js, GraphQL, AWS Lambda, Docker, PostgreSQL, microservices architecture, CI/CD pipelines, and performance optimization.`);
    setExtraWorkNotes(`Also built an open-source CLI tool in Node.js called DevMetrics with 1,400 GitHub stars. Implemented Gemini AI API for auto PR summaries.`);
    setResumeData(SAMPLE_SOFTWARE_ENGINEER);
  };

  // Loading & Error States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Modals & History
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState<boolean>(false);
  const [isPromptHistoryOpen, setIsPromptHistoryOpen] = useState<boolean>(false);
  const [isVersionManagerOpen, setIsVersionManagerOpen] = useState<boolean>(false);
  const [isMetricSuggesterOpen, setIsMetricSuggesterOpen] = useState<boolean>(false);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState<boolean>(false);
  const [obsidianToast, setObsidianToast] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([
    {
      id: 'init_p1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      promptText: 'Job Description Match Target:\nSeeking a Senior Full Stack Software Engineer to build high-scale cloud platforms. Requirements: 5+ years experience in React, TypeScript, Node.js, GraphQL, AWS Lambda, Docker, PostgreSQL, microservices architecture, CI/CD pipelines.',
      actionType: 'jd_match',
    },
  ]);
  const [bulletRewrite, setBulletRewrite] = useState<{
    isOpen: boolean;
    text: string;
    context: string;
    bulletMetadata?: BulletMetadata;
  }>({
    isOpen: false,
    text: '',
    context: '',
  });

  // Export Template Options
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({
    style: 'executive',
    primaryColor: '#1e3a8a',
    fontFamily: 'sans',
    fontSize: 'md',
    lineSpacing: 'normal',
    showIcons: true,
  });

  // Handler: Scan & Analyze Resume with Gemini AI
  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawResumeText: rawText,
          jobDescription,
          extraWorkNotes,
        }),
      });

      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error(`Server error (${res.status}). Please check input or retry.`);
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze resume.');
      }
      if (data.resumeData) {
        setResumeData(sanitizeAndFixResumeData(data.resumeData));
      }
      if (data.analysis) {
        setAnalysis(data.analysis);
        setActiveTab('analysis');

        // Log prompt into history
        const newPromptLog: PromptHistoryItem = {
          id: `p_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          promptText: `Resume Analysis Prompt:\nResume Raw Length: ${rawText.length} chars\nJob Description: "${jobDescription.slice(0, 300)}..."\nExtra Notes: "${extraWorkNotes || 'None'}"`,
          actionType: jobDescription ? 'jd_match' : 'analysis',
        };
        setPromptHistory((prev) => [newPromptLog, ...prev]);

        // Automatically prompt clarification modal if doubts exist!
        if (data.analysis.clarificationQuestions && data.analysis.clarificationQuestions.length > 0) {
          setIsClarificationModalOpen(true);
        }
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      setAnalysisError(err.message || 'Error communicating with Gemini AI server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Resolve Doubts & Apply Clarification Answers
  const handleResolveDoubts = async (answers: { questionId: string; question: string; answer: string }[]) => {
    setIsResolving(true);
    try {
      const res = await fetch('/api/resolve-doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          userAnswers: answers,
          jobDescription,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data?.details || data?.error || 'Failed to update resume with clarification answers.';
        throw new Error(errorMsg);
      }

      if (data.resumeData) {
        setResumeData(sanitizeAndFixResumeData(data.resumeData));
      }
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      setIsClarificationModalOpen(false);

      // Log prompt history
      const formattedAnswers = answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n');
      setPromptHistory((prev) => [
        {
          id: `p_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          promptText: `Clarification / Work Ingestion Answers:\n${formattedAnswers}`,
          actionType: 'clarification',
        },
        ...prev,
      ]);
    } catch (err: any) {
      console.error('Resolve error:', err);
      alert(`Error updating resume: ${err.message || 'Please try again in a few moments.'}`);
    } finally {
      setIsResolving(false);
    }
  };

  // Handler: Smartly add skill keyword, URL, certification, or work experience bullet
  const handleAddSkillOrBulletToResume = (text: string) => {
    if (!text) return;
    const trimmed = text.trim();

    // Check if URL or Social link
    if (/linkedin\.com/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, linkedin: trimmed }
      }));
      return;
    }
    if (/github\.com/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, github: trimmed }
      }));
      return;
    }
    if (/leetcode\.com/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, leetcode: trimmed }
      }));
      return;
    }
    if (/hackerrank\.com/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, hackerrank: trimmed }
      }));
      return;
    }
    if (/scaler\.com/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, scaler: trimmed }
      }));
      return;
    }
    if (/^https?:\/\//i.test(trimmed) || /\.(dev|io|com|app|me)\b/i.test(trimmed)) {
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, portfolio: trimmed }
      }));
      return;
    }

    // Check if Certification
    if (/certified|certification|license/i.test(trimmed) && trimmed.length < 100) {
      const cleanCertName = trimmed.replace(/^(add|include|obtain)\s+/i, '').trim();
      const newCert = {
        id: `cert-${Date.now()}`,
        name: cleanCertName,
        issuer: 'Professional Certification Body',
        date: '2024'
      };
      setResumeData(sanitizeAndFixResumeData({
        ...resumeData,
        certifications: [...(resumeData.certifications || []), newCert]
      }));
      return;
    }

    const isSentence = trimmed.length > 30 || /^(Engineered|Orchestrated|Spearheaded|Built|Developed|Designed|Optimized|Scaled|Implemented|Delivered|Executed|Architected|Spearheading)\b/i.test(trimmed);

    if (isSentence) {
      // Add as bullet point to first experience entry
      const updatedExp = [...resumeData.experience];
      if (updatedExp.length > 0) {
        const firstExp = { ...updatedExp[0] };
        const highlights = [...(firstExp.highlights || [])];
        if (!highlights.includes(trimmed)) {
          highlights.push(trimmed);
        }
        firstExp.highlights = highlights;
        updatedExp[0] = firstExp;
        setResumeData(sanitizeAndFixResumeData({ ...resumeData, experience: updatedExp }));
      } else {
        // Fallback to skill if no experience entries exist
        handleAddSkillToResume(trimmed);
      }
    } else {
      handleAddSkillToResume(trimmed);
    }
  };

  // Handler: Add Missing Skill directly into resume with immutable updates
  const handleAddSkillToResume = (skillName: string) => {
    let updatedCategories = resumeData.skillCategories.map((cat, idx) => {
      if (idx === 0) {
        if (!cat.skills.includes(skillName)) {
          return { ...cat, skills: [...cat.skills, skillName] };
        }
      }
      return cat;
    });

    if (updatedCategories.length === 0) {
      updatedCategories = [{
        category: 'Core Competencies',
        skills: [skillName],
      }];
    }

    setResumeData(sanitizeAndFixResumeData({ ...resumeData, skillCategories: updatedCategories }));

    // Also update missingKeywords & foundKeywords list in analysis UI
    if (analysis) {
      setAnalysis({
        ...analysis,
        missingKeywords: analysis.missingKeywords.filter((k) => k !== skillName),
        foundKeywords: [...analysis.foundKeywords, skillName],
        skillLearningRoadmap: analysis.skillLearningRoadmap?.filter((item) => item.skillName !== skillName),
      });
    }
  };

  // Toast State for Autofill feedback
  const [autofillToast, setAutofillToast] = useState<{ message: string; target: string; keyword: string } | null>(null);

  // Handler: Autofill Keyword into relevant Experience or Project section
  const handleAutofillKeyword = (keyword: string) => {
    if (!keyword) return;
    const result = autofillKeywordIntoResume(resumeData, keyword);
    const sanitized = sanitizeAndFixResumeData(result.updatedResume);
    setResumeData(sanitized);

    // Update analysis state
    if (analysis) {
      const updatedMissing = (analysis.missingKeywords || []).filter((k) => k.toLowerCase() !== keyword.toLowerCase());
      const updatedFound = analysis.foundKeywords.some((k) => k.toLowerCase() === keyword.toLowerCase())
        ? analysis.foundKeywords
        : [...analysis.foundKeywords, keyword];
      const updatedKwScore = Math.min(100, (analysis.scoreBreakdown?.keywordMatchScore || 60) + 6);
      const updatedOverallScore = Math.min(100, (analysis.overallScore || 70) + 3);

      setAnalysis({
        ...analysis,
        overallScore: updatedOverallScore,
        missingKeywords: updatedMissing,
        foundKeywords: updatedFound,
        scoreBreakdown: {
          ...analysis.scoreBreakdown,
          keywordMatchScore: updatedKwScore,
        },
        skillLearningRoadmap: analysis.skillLearningRoadmap?.filter((item) => item.skillName.toLowerCase() !== keyword.toLowerCase()),
      });
    }

    setAutofillToast({
      keyword,
      target: result.targetTitle,
      message: `Injected "${keyword}" into ${result.targetTitle} with an ATS-optimized bullet point!`
    });

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setAutofillToast(null);
    }, 6000);
  };

  // Handler: Apply Quick Fix & Boost Score across Analysis
  const handleApplyQuickFix = (selectedText: string, scoreGain: number = 10, checkTitle?: string) => {
    handleAddSkillOrBulletToResume(selectedText);

    if (analysis) {
      const updatedOverallScore = Math.min(100, (analysis.overallScore || 70) + scoreGain);

      const updatedBreakdown = {
        impactMetricsScore: Math.min(100, (analysis.scoreBreakdown?.impactMetricsScore || 50) + 8),
        keywordMatchScore: Math.min(100, (analysis.scoreBreakdown?.keywordMatchScore || 50) + 8),
        actionVerbsScore: Math.min(100, (analysis.scoreBreakdown?.actionVerbsScore || 50) + 8),
        formattingReadabilityScore: Math.min(100, (analysis.scoreBreakdown?.formattingReadabilityScore || 50) + 5),
        sectionCompletenessScore: Math.min(100, (analysis.scoreBreakdown?.sectionCompletenessScore || 50) + 5),
      };

      let updatedHealth = analysis.resumeHealth;
      if (updatedHealth && updatedHealth.checks) {
        let matchFound = false;
        const updatedChecks = updatedHealth.checks.map((check) => {
          if (checkTitle && (
            check.title.toLowerCase() === checkTitle.toLowerCase() ||
            check.type === checkTitle ||
            checkTitle.toLowerCase().includes(check.type) ||
            check.title.toLowerCase().includes(checkTitle.toLowerCase())
          )) {
            matchFound = true;
            return {
              ...check,
              status: 'passed' as const,
              issueCount: 0,
              isFixed: true,
              details: `✓ Quick Fix Applied: Replaced problematic content with optimized text in draft.`,
            };
          }
          return check;
        });

        if (!matchFound) {
          const firstPendingIdx = updatedChecks.findIndex((c) => c.status !== 'passed' && !c.isFixed);
          if (firstPendingIdx !== -1) {
            updatedChecks[firstPendingIdx] = {
              ...updatedChecks[firstPendingIdx],
              status: 'passed' as const,
              issueCount: 0,
              isFixed: true,
              details: `✓ Quick Fix Applied: Replaced problematic content with optimized text in draft.`,
            };
          }
        }

        const passedCount = updatedChecks.filter((c) => c.status === 'passed' || c.isFixed).length;
        const newHealthScore = Math.min(100, Math.round((passedCount / updatedChecks.length) * 100));

        updatedHealth = {
          ...updatedHealth,
          checks: updatedChecks,
          passedChecksCount: passedCount,
          healthScore: newHealthScore,
        };
      }

      setAnalysis({
        ...analysis,
        overallScore: updatedOverallScore,
        scoreBreakdown: updatedBreakdown,
        resumeHealth: updatedHealth,
      });

      setAutofillToast({
        keyword: 'Quick Fix',
        target: checkTitle || 'Resume Audit',
        message: `✓ Quick Fix Applied! Updated draft resume & boosted ATS Health Score to ${updatedHealth?.healthScore || 90}%.`
      });

      setTimeout(() => {
        setAutofillToast(null);
      }, 5000);
    }
  };

  // Handler: Dismiss missing keyword (if user didn't work on it)
  const handleDismissMissingKeyword = (skillName: string) => {
    if (analysis) {
      setAnalysis({
        ...analysis,
        missingKeywords: analysis.missingKeywords.filter((k) => k !== skillName),
        dismissedKeywords: [...(analysis.dismissedKeywords || []), skillName],
        skillLearningRoadmap: analysis.skillLearningRoadmap?.filter((item) => item.skillName !== skillName),
      });
    }
  };

  // Handler: Remove found keyword from resume and analysis
  const handleRemoveFoundKeyword = (skillName: string) => {
    // 1. Remove from resume skill categories
    const cleanedCategories = resumeData.skillCategories.map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) => s.toLowerCase() !== skillName.toLowerCase()),
    })).filter((cat) => cat.skills.length > 0);

    setResumeData({ ...resumeData, skillCategories: cleanedCategories });

    // 2. Remove from analysis foundKeywords
    if (analysis) {
      setAnalysis({
        ...analysis,
        foundKeywords: analysis.foundKeywords.filter((k) => k.toLowerCase() !== skillName.toLowerCase()),
      });
    }
  };

  // Handler: Ingest recent work / tech accomplishments
  const handleIngestRecentWork = async (recentWorkText: string) => {
    await handleResolveDoubts([
      {
        questionId: `recent_work_${Date.now()}`,
        question: 'What recent technical work, certifications, or learning accomplishments have you completed?',
        answer: recentWorkText,
      },
    ]);
  };

  // Handler: Load Sample Resume
  const handleLoadSample = (sample: ResumeData) => {
    setResumeData(sample);
    setActiveTab('preview');
  };

  // PDF & Print Actions
  const handleExportPDF = async () => {
    setActiveTab('preview');
    setTimeout(async () => {
      const nameStr = (resumeData.personalInfo?.fullName || 'Candidate').replace(/\s+/g, '_');
      const fileName = `${nameStr}_ATS_Resume.pdf`;
      const success = await exportToPDF('resume-preview-container', fileName);
      if (!success) {
        console.warn('Canvas PDF export fallback triggered. Launching print dialog.');
        triggerPrintResume();
      }
    }, 300);
  };

  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => {
      triggerPrintResume();
    }, 300);
  };

  const handleFixAllCommonIssues = () => {
    const { formattedData, updatedAnalysis } = autoFormatAndFixAnalysis(resumeData, analysis);
    setResumeData(formattedData);
    setAnalysis(updatedAnalysis);
  };

  const handleSyncObsidian = async () => {
    try {
      const candidateName = resumeData.personalInfo?.fullName || 'Candidate';
      const targetRole = resumeData.personalInfo?.targetRole || resumeData.personalInfo?.headline || 'Software Engineer';
      const atsScore = analysis?.overallScore || 85;
      const missingKeywords = analysis?.missingKeywords || [];
      const foundKeywords = analysis?.foundKeywords || [];
      const summary = resumeData.summary || '';

      const res = await fetch('/api/sync-obsidian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          targetRole,
          atsScore,
          missingKeywords,
          foundKeywords,
          summary,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setObsidianToast(`✓ Synced note "${data.fileName}" to Obsidian Vault at ${data.filePath}!`);
        setTimeout(() => setObsidianToast(null), 5000);
      }
    } catch (err: any) {
      setObsidianToast(`✕ Failed to sync to Obsidian Vault: ${err.message}`);
      setTimeout(() => setObsidianToast(null), 5000);
    }
  };

  return (
    <div className="min-h-screen surface-base text-default font-sans flex flex-col transition-colors duration-300">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overallScore={analysis ? analysis.overallScore : null}
        clarificationCount={analysis?.clarificationQuestions?.length || 0}
        onLoadSample={handleLoadSampleResume}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onOpenPromptHistory={() => setIsPromptHistoryOpen(true)}
        onOpenVersions={() => setIsVersionManagerOpen(true)}
        onSyncObsidian={handleSyncObsidian}
        onOpenOutreach={() => setIsOutreachModalOpen(true)}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Obsidian Sync Toast Banner */}
        {obsidianToast && (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/90 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold shadow-md flex items-center justify-between transition animate-fade-in">
            <div className="flex items-center space-x-3">
              <span className="text-lg">💜</span>
              <span>{obsidianToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setObsidianToast(null)}
              className="text-purple-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Autofill Keyword Toast Notification Banner */}
        {autofillToast && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-medium shadow-md flex flex-wrap items-center justify-between gap-3 border border-amber-300 transition">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-wider text-slate-950 flex items-center space-x-1">
                  <span>⚡ Autofill Applied:</span>
                  <span className="underline font-black bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded text-[11px]">{autofillToast.keyword}</span>
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Targeted: <strong>{autofillToast.target}</strong> — Added high-impact ATS bullet point & updated skill stack.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-lg shadow-xs transition"
              >
                View in Resume Editor →
              </button>
              <button
                onClick={() => setAutofillToast(null)}
                className="p-1 hover:bg-slate-950/20 rounded-lg transition text-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <ScannerStep
            rawText={rawText}
            setRawText={handleRawTextChange}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            extraWorkNotes={extraWorkNotes}
            setExtraWorkNotes={setExtraWorkNotes}
            onAnalyze={handleAnalyzeResume}
            isAnalyzing={isAnalyzing}
            errorMessage={analysisError}
            onLoadSampleResume={handleLoadSampleResume}
            onSelectTemplateStyle={(st) => setTemplateOptions({ ...templateOptions, style: st })}
            onGoToPreview={() => setActiveTab('preview')}
          />
        )}

        {activeTab === 'analysis' && (
          <div>
            {analysis ? (
              <ATSScoreCard
                analysis={analysis}
                resumeData={resumeData}
                jobDescription={jobDescription}
                onOpenClarificationModal={() => setIsClarificationModalOpen(true)}
                onAddSkill={handleAddSkillToResume}
                onDismissMissingKeyword={handleDismissMissingKeyword}
                onRemoveFoundKeyword={handleRemoveFoundKeyword}
                onIngestRecentWork={handleIngestRecentWork}
                isResolving={isResolving}
                onApplyQuickFix={handleApplyQuickFix}
                onOpenHRPersona={() => setActiveTab('hr-persona')}
                onFixAll={handleFixAllCommonIssues}
                onOpenMetricSuggester={() => setIsMetricSuggesterOpen(true)}
                onNavigateToEditorSection={() => setActiveTab('edit')}
                onAutofillKeyword={handleAutofillKeyword}
                onNavigateToRoadmap={() => setActiveTab('pulse')}
              />
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-slate-600 text-sm font-medium">No ATS Analysis available yet.</p>
                <button
                  onClick={() => setActiveTab('scan')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Go to Step 1: Scan Your Resume
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <ResumeEditor
            resumeData={resumeData}
            onChange={setResumeData}
            onOpenBulletRewrite={(text, context, meta) =>
              setBulletRewrite({ isOpen: true, text, context, bulletMetadata: meta })
            }
            jobDescription={jobDescription}
            overallScore={analysis?.overallScore}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <FormatGallery
              templateOptions={templateOptions}
              setTemplateOptions={setTemplateOptions}
              resumeData={resumeData}
              onExportPDF={handleExportPDF}
            />

            <ExportToolbar
              templateOptions={templateOptions}
              setTemplateOptions={setTemplateOptions}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
              resumeData={resumeData}
              onResumeDataChange={setResumeData}
              onSwitchToEdit={() => setActiveTab('edit')}
            />

            <ResumePreview resumeData={resumeData} templateOptions={templateOptions} />
          </div>
        )}

        {activeTab === 'interview' && (
          <InterviewPrep
            resumeText={rawText}
            jobDescription={jobDescription}
            targetRole={resumeData.personalInfo.targetRole || 'Forward Deployed Engineer (FDE)'}
          />
        )}

        {activeTab === 'hr-persona' && (
          <HRPersonaSimulator
            resumeData={resumeData}
            onResumeDataChange={setResumeData}
            targetRole={resumeData.personalInfo.targetRole || 'Forward Deployed Engineer (FDE)'}
          />
        )}

        {activeTab === 'pulse' && (
          <DynamicCareerRoadmapTab
            resumeData={resumeData}
            onAddSkillToResume={handleAddSkillToResume}
            onAddCertificationToResume={(cert) => {
              setResumeData((prev) => ({
                ...prev,
                certifications: [...(prev.certifications || []), cert],
              }));
            }}
            onAddProjectToResume={(proj) => {
              setResumeData((prev) => ({
                ...prev,
                projects: [...(prev.projects || []), proj],
              }));
            }}
          />
        )}

        {activeTab === 'job-checker' && (
          <JobCheckerTab
            resumeData={resumeData}
          />
        )}
      </main>

      {/* Clarification Q&A Modal */}
      {analysis && (
        <ClarificationModal
          questions={analysis.clarificationQuestions || []}
          isOpen={isClarificationModalOpen}
          onClose={() => setIsClarificationModalOpen(false)}
          onSubmitAnswers={handleResolveDoubts}
          isResolving={isResolving}
        />
      )}

      {/* Single Bullet Point Rewrite Modal */}
      <BulletRewriteModal
        isOpen={bulletRewrite.isOpen}
        onClose={() => setBulletRewrite({ ...bulletRewrite, isOpen: false })}
        originalText={bulletRewrite.text}
        contextTitle={bulletRewrite.context}
        jobDescription={jobDescription}
        bulletMetadata={bulletRewrite.bulletMetadata}
        onSelectOption={(newText) => {
          // Find and replace matching highlight text in resumeData
          const updatedExp = resumeData.experience.map((exp) => ({
            ...exp,
            highlights: exp.highlights.map((h) => (h === bulletRewrite.text ? newText : h)),
          }));
          setResumeData({ ...resumeData, experience: updatedExp });
        }}
      />
      {/* Prompt & JD History Modal */}
      <PromptHistoryModal
        isOpen={isPromptHistoryOpen}
        onClose={() => setIsPromptHistoryOpen(false)}
        promptHistory={promptHistory}
        onReRunPrompt={(promptText) => {
          setJobDescription(promptText);
          setActiveTab('scan');
        }}
      />

      {/* Metric Suggestions Modal */}
      <MetricSuggestionsModal
        resumeData={resumeData}
        onResumeDataChange={setResumeData}
        isOpen={isMetricSuggesterOpen}
        onClose={() => setIsMetricSuggesterOpen(false)}
      />

      {/* Resume Versioning & Local Storage Snapshots Modal */}
      <ResumeVersionManager
        isOpen={isVersionManagerOpen}
        onClose={() => setIsVersionManagerOpen(false)}
        currentResumeData={resumeData}
        currentScore={analysis?.overallScore}
        onLoadSnapshot={(snap) => {
          setResumeData(snap.resumeData);
          setIsVersionManagerOpen(false);
        }}
        targetRole={resumeData.personalInfo.targetRole || 'Forward Deployed Engineer (FDE)'}
      />

      {/* Humanized Outreach Generator Modal */}
      <HumanizedOutreachModal
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
        resumeData={resumeData}
      />
    </div>
  );
}
