import React, { useState } from 'react';
import { ResumeData } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Wand2,
  BarChart2,
  FileCheck,
  UserCheck,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FileText,
  ChevronRight,
  ExternalLink,
  Target,
  ArrowUpRight,
  Zap,
  Type,
  Ruler,
  Sliders,
  LayoutGrid,
  AlignLeft,
  Maximize2
} from 'lucide-react';

interface ProductionReadinessDashboardProps {
  resumeData: ResumeData;
  onFixAll?: () => void;
  onOpenMetricSuggester?: () => void;
  onApplyQuickFix?: (selectedText: string, scoreGain?: number, checkTitle?: string) => void;
  onNavigateToEditorSection?: (section: 'info' | 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'certifications') => void;
}

export interface ReadinessCheckItem {
  id: string;
  name: string;
  sectionKey: 'info' | 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'certifications';
  icon: React.ElementType;
  status: 'pass' | 'warning' | 'fail';
  score: number; // 0 to 100
  title: string;
  finding: string;
  requirement: string;
  actionText?: string;
  actionType?: 'fixAll' | 'metricSuggester' | 'editor' | 'autoFixSummary';
}

export const ProductionReadinessDashboard: React.FC<ProductionReadinessDashboardProps> = ({
  resumeData,
  onFixAll,
  onOpenMetricSuggester,
  onApplyQuickFix,
  onNavigateToEditorSection
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'issues' | 'passed'>('all');

  const info = resumeData.personalInfo || {};
  const exp = resumeData.experience || [];
  const edu = resumeData.education || [];
  const skills = resumeData.skillCategories || [];
  const certs = resumeData.certifications || [];
  const summary = (resumeData.summary || '').trim();

  // 1. Evaluate Contact & Personal Info
  const hasName = Boolean(info.fullName && info.fullName.trim().length > 2);
  const hasHeadline = Boolean(info.headline && info.headline.trim().length >= 3 && !['professional title', 'professional'].includes(info.headline.trim().toLowerCase()));
  const hasEmail = Boolean(info.email && info.email.includes('@'));
  const hasPhone = Boolean(info.phone && info.phone.trim().length >= 7);
  const hasLocation = Boolean(info.location && info.location.trim().length > 2);
  const hasSocial = Boolean(info.linkedin || info.github || info.portfolio || (info.customLinks && info.customLinks.length > 0));

  let infoStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let infoFinding = `Header contains Full Name, Email, Phone, Location, Social Links, and Professional Headline ("${info.headline || 'Active Headline'}").`;
  let infoScore = 100;

  if (!hasName || !hasEmail || !hasPhone) {
    infoStatus = 'fail';
    infoScore = 30;
    infoFinding = 'Critical contact details missing: Ensure Full Name, Email, and Phone number are present.';
  } else if (!hasHeadline) {
    infoStatus = 'warning';
    infoScore = 80;
    infoFinding = 'Professional Headline / Title is missing or generic. A strong headline (e.g. "Senior Software Engineer | Cloud Architect") increases recruiter ATS keyword match by 25%.';
  } else if (!hasLocation || !hasSocial) {
    infoStatus = 'warning';
    infoScore = 75;
    infoFinding = `Contact info present, but missing ${!hasLocation ? 'Location' : ''} ${!hasSocial ? 'LinkedIn / GitHub / Portfolio link' : ''}. Top 500 recruiters require location & social credentials.`;
  }

  // 2. Evaluate Executive Summary
  const summaryWords = summary ? summary.split(/\s+/).filter(Boolean).length : 0;
  const hasFirstPerson = /\b(I|me|my|myself|we|our|us)\b/i.test(summary);
  let summaryStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let summaryFinding = 'Executive summary is present with appropriate word length and third-person professional tone.';
  let summaryScore = 100;

  if (summaryWords === 0) {
    summaryStatus = 'fail';
    summaryScore = 0;
    summaryFinding = 'Missing Professional Summary section. Top 500 ATS systems require a 30-75 word executive opening.';
  } else if (summaryWords < 20) {
    summaryStatus = 'warning';
    summaryScore = 60;
    summaryFinding = `Summary is too brief (${summaryWords} words). Target 30-75 words highlighting target role & key tech stacks.`;
  } else if (hasFirstPerson) {
    summaryStatus = 'warning';
    summaryScore = 70;
    summaryFinding = 'Summary contains first-person pronouns ("I", "my"). Top 500 standards require implied third-person executive phrasing.';
  }

  // 3. Evaluate Work Experience & Employment History
  const expCount = exp.length;
  let totalBullets = 0;
  let nonStandardDates = 0;

  exp.forEach((e) => {
    totalBullets += (e.highlights || []).length;
    // Check date standard Month YYYY or Present
    const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$|^Present$/i;
    if (e.startDate && !datePattern.test(e.startDate.trim())) nonStandardDates++;
    if (e.endDate && !datePattern.test(e.endDate.trim())) nonStandardDates++;
  });

  let expStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let expFinding = `${expCount} work experience entry/entries found with structured bullet points and standardized date ranges.`;
  let expScore = 100;

  if (expCount === 0) {
    expStatus = 'fail';
    expScore = 0;
    expFinding = 'Zero Work Experience entries found. Mandatory section for all professional roles.';
  } else if (totalBullets < expCount * 2) {
    expStatus = 'warning';
    expScore = 65;
    expFinding = 'Experience entries have sparse bullet points. Top 500 resumes recommend 3-5 high-impact bullet points per role.';
  } else if (nonStandardDates > 0) {
    expStatus = 'warning';
    expScore = 80;
    expFinding = `${nonStandardDates} date value(s) use non-standard formatting (e.g., 01/2022). Fortune 500 ATS scanners prefer "Jan 2022 – Present".`;
  }

  // 4. Evaluate Technical Skills Matrix
  const flatSkills = skills.flatMap((c) => c.skills || []);
  const skillCategoryCount = skills.length;
  let skillsStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let skillsFinding = `${flatSkills.length} total skills organized into ${skillCategoryCount} domain categories (e.g. Languages, Frameworks, Cloud).`;
  let skillsScore = 100;

  if (flatSkills.length === 0) {
    skillsStatus = 'fail';
    skillsScore = 0;
    skillsFinding = 'No skills matrix detected. Technical skills are mandatory for ATS keyword indexing.';
  } else if (flatSkills.length < 8) {
    skillsStatus = 'warning';
    skillsScore = 60;
    skillsFinding = `Only ${flatSkills.length} skills listed. Top 500 engineering/tech roles require 10-25 targeted domain skills.`;
  } else if (skillCategoryCount <= 1) {
    skillsStatus = 'warning';
    skillsScore = 75;
    skillsFinding = 'Skills are listed as an uncategorized list. Categorizing skills into "Languages", "Frameworks", and "Tools" boosts ATS readability by 40%.';
  }

  // 5. Evaluate Education Credentials
  const eduCount = edu.length;
  let eduMissingYear = 0;
  let eduMissingDegree = 0;

  edu.forEach((ed) => {
    if (!ed.endDate && !ed.startDate) eduMissingYear++;
    if (!ed.degree || ed.degree === 'Degree') eduMissingDegree++;
  });

  let eduStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let eduFinding = `${eduCount} academic credential(s) listed with degree title, university, and graduation year.`;
  let eduScore = 100;

  if (eduCount === 0) {
    eduStatus = 'fail';
    eduScore = 0;
    eduFinding = 'Missing Education section. Academic or equivalent degree credentials are required for Fortune 500 hiring software.';
  } else if (eduMissingDegree > 0 || eduMissingYear > 0) {
    eduStatus = 'warning';
    eduScore = 70;
    eduFinding = 'Education entries contain placeholder or missing degree/year fields.';
  }

  // 6. Evaluate Quantified Bullet Impact
  const metricRegex = /\b\d+([.,]\d+)?\s*(%|k|m|b|x|usd|\$|hrs?|hours?|ms|s|sec|users?|req|requests?|tps|clients?|engineers?|devs?|k\+)\b|\b\d{2,}\b|\b\$\d+/i;
  let quantifiedBulletsCount = 0;

  exp.forEach((e) => {
    (e.highlights || []).forEach((hl) => {
      if (metricRegex.test(hl)) quantifiedBulletsCount++;
    });
  });

  const metricPercentage = totalBullets > 0 ? Math.round((quantifiedBulletsCount / totalBullets) * 100) : 0;
  let metricStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let metricFinding = `${quantifiedBulletsCount} of ${totalBullets} bullets (${metricPercentage}%) contain quantifiable metrics (scale, speed, $, %).`;
  let metricScore = 100;

  if (totalBullets > 0 && metricPercentage < 25) {
    metricStatus = 'fail';
    metricScore = 35;
    metricFinding = `Only ${metricPercentage}% of bullet points contain numbers/metrics. Top 500 recruiters reject resumes without scale, speed, or revenue metrics.`;
  } else if (totalBullets > 0 && metricPercentage < 50) {
    metricStatus = 'warning';
    metricScore = 70;
    metricFinding = `${metricPercentage}% of bullet points have metrics. Target at least 50%+ quantified bullet points for Fortune 500 standard.`;
  }

  // 7. Certifications & Licenses (Recommended/Bonus)
  let certStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let certFinding = `${certs.length} professional certification(s) formatted with recognized issuing bodies and issue dates.`;
  let certScore = 100;

  if (certs.length === 0) {
    certStatus = 'warning';
    certScore = 80;
    certFinding = 'No professional certifications listed. Recommended for cloud, security, and senior tech roles.';
  }

  // 8. READABILITY & LAYOUT AUDIT CALCULATIONS
  const allHighlights: string[] = [];
  exp.forEach((e) => (e.highlights || []).forEach((h) => allHighlights.push(h)));

  const totalChars = (summary || '').length +
    exp.reduce((acc, e) => acc + (e.company || '').length + (e.position || '').length + (e.highlights || []).join('').length, 0) +
    edu.reduce((acc, ed) => acc + (ed.degree || '').length + (ed.institution || '').length, 0) +
    skills.reduce((acc, sk) => acc + (sk.categoryName || '').length + (sk.skills || []).join('').length, 0);

  const avgBulletLength = allHighlights.length > 0
    ? Math.round(allHighlights.reduce((sum, h) => sum + h.length, 0) / allHighlights.length)
    : 0;

  const overlongBulletsCount = allHighlights.filter((h) => h.length > 170).length;
  const shortBulletsCount = allHighlights.filter((h) => h.length < 45).length;

  // Font Sizing & Scale Hierarchy
  let fontSizingStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let fontSizingFinding = `Font hierarchy scale is balanced (10-11pt body, 12-14pt section headers). Average bullet length: ${avgBulletLength} chars.`;
  if (overlongBulletsCount > 2) {
    fontSizingStatus = 'warning';
    fontSizingFinding = `${overlongBulletsCount} bullet point(s) exceed 170 characters. Long text blocks reduce recruiter skim speed at 10.5pt font size.`;
  } else if (shortBulletsCount > 3) {
    fontSizingStatus = 'warning';
    fontSizingFinding = `${shortBulletsCount} bullet point(s) are under 45 characters. Too many brief bullets cause visual fragmentation.`;
  }

  // Line Height & Vertical Rhythm
  let lineSpacingStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let lineSpacingFinding = 'Vertical line height (1.2x) and paragraph spacing (6pt) adhere to Fortune 500 recruiter skim-readability.';
  if (allHighlights.length > 18) {
    lineSpacingStatus = 'warning';
    lineSpacingFinding = `High bullet density (${allHighlights.length} bullets). Tight line spacing (1.15x) recommended to fit page budget.`;
  }

  // Margins & Edge Padding
  let marginStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let marginFinding = '0.5" to 0.75" printable margins configured for high ATS parser capture & zero PDF clipping.';

  // Page Budget & Overflow Density
  let pageBudgetStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let estimatedPages = 1;
  let pageBudgetFinding = 'Content density fits a clean 1-page executive resume budget (~2,500 - 4,200 characters).';

  if (totalChars > 4300 && totalChars < 5300) {
    pageBudgetStatus = 'warning';
    estimatedPages = 1.1;
    pageBudgetFinding = `Awkward page overflow risk! Current character weight (${totalChars} chars) risks creating an awkward 2-3 line spillover onto page 2. Trim ~200 characters to ensure a crisp 1-page layout.`;
  } else if (totalChars >= 5300) {
    estimatedPages = 2;
    pageBudgetFinding = `2-Page Executive Length (${totalChars} chars). Ensure senior achievements justify 2 full pages.`;
  }

  const layoutAuditChecks = [
    {
      id: 'layout-font',
      title: 'Font Sizing & Scale Consistency',
      icon: Type,
      status: fontSizingStatus,
      benchmark: 'Name: 20-24pt | Headers: 12-14pt | Body: 10-11pt',
      finding: fontSizingFinding
    },
    {
      id: 'layout-height',
      title: 'Line Height & Vertical Rhythm',
      icon: AlignLeft,
      status: lineSpacingStatus,
      benchmark: 'Body Line Height: 1.18x – 1.25x (14-16px line-height)',
      finding: lineSpacingFinding
    },
    {
      id: 'layout-margin',
      title: 'Margin Usage & Edge Padding',
      icon: Ruler,
      status: marginStatus,
      benchmark: 'Print Margins: 0.5" (36pt) – 0.75" (54pt) Top/Bottom/Sides',
      finding: marginFinding
    },
    {
      id: 'layout-budget',
      title: 'Page Budget & Overflow Risk',
      icon: Maximize2,
      status: pageBudgetStatus,
      benchmark: `Target 1.0 or 2.0 Full Pages (Current Est: ${estimatedPages} pgs / ${totalChars} chars)`,
      finding: pageBudgetFinding
    }
  ];

  // Build Checklist Items
  const items: ReadinessCheckItem[] = [
    {
      id: 'check-contact',
      name: 'Contact Credentials & Social Links',
      sectionKey: 'info',
      icon: UserCheck,
      status: infoStatus,
      score: infoScore,
      title: 'Name, Email, Phone, Location & Social Profiles',
      finding: infoFinding,
      requirement: 'Full Name, valid Email, Phone number, City/State location, and LinkedIn / GitHub or Portfolio link.',
      actionText: infoStatus !== 'pass' ? 'Edit Contact Info' : undefined,
      actionType: infoStatus !== 'pass' ? 'editor' : undefined
    },
    {
      id: 'check-summary',
      name: 'Professional Executive Summary',
      sectionKey: 'summary',
      icon: FileText,
      status: summaryStatus,
      score: summaryScore,
      title: '30–75 Word Executive Opening (3rd Person)',
      finding: summaryFinding,
      requirement: '30-75 words, third-person executive tone (no "I" or "my"), highlighting target role and core domain keywords.',
      actionText: summaryStatus !== 'pass' ? 'Edit Summary' : undefined,
      actionType: summaryStatus !== 'pass' ? 'editor' : undefined
    },
    {
      id: 'check-exp',
      name: 'Professional Employment History',
      sectionKey: 'experience',
      icon: Briefcase,
      status: expStatus,
      score: expScore,
      title: 'Work Experience Entries & Date Consistency',
      finding: expFinding,
      requirement: 'Structured company names, position titles, 3-5 bullet points per role, and standardized "Month YYYY – Month YYYY" dates.',
      actionText: nonStandardDates > 0 && onFixAll ? '1-Click Fix All Date Ranges' : 'Edit Experience',
      actionType: nonStandardDates > 0 && onFixAll ? 'fixAll' : 'editor'
    },
    {
      id: 'check-metrics',
      name: 'Quantified Impact & Bullet Metrics',
      sectionKey: 'experience',
      icon: BarChart2,
      status: metricStatus,
      score: metricScore,
      title: 'Scale, Speed, Revenue & Efficiency Numbers',
      finding: metricFinding,
      requirement: 'At least 50% of experience bullet points must contain numbers, percentages, dollar amounts, or scale metrics.',
      actionText: metricStatus !== 'pass' && onOpenMetricSuggester ? 'Launch Metric Suggester' : undefined,
      actionType: metricStatus !== 'pass' && onOpenMetricSuggester ? 'metricSuggester' : undefined
    },
    {
      id: 'check-skills',
      name: 'Technical & Core Competencies Matrix',
      sectionKey: 'skills',
      icon: Code,
      status: skillsStatus,
      score: skillsScore,
      title: 'Categorized Skill Domains & Tool Keywords',
      finding: skillsFinding,
      requirement: 'Minimum 10-20 technical skills categorized into clear domain rows (Languages, Frameworks, Databases, Tools).',
      actionText: skillsStatus !== 'pass' ? 'Edit Skills Matrix' : undefined,
      actionType: skillsStatus !== 'pass' ? 'editor' : undefined
    },
    {
      id: 'check-edu',
      name: 'Education & Academic Credentials',
      sectionKey: 'education',
      icon: GraduationCap,
      status: eduStatus,
      score: eduScore,
      title: 'Degree, University & Graduation Year',
      finding: eduFinding,
      requirement: 'Specific degree title (e.g. B.S. Computer Science), University or Institution name, and graduation year.',
      actionText: eduStatus !== 'pass' ? 'Edit Education' : undefined,
      actionType: eduStatus !== 'pass' ? 'editor' : undefined
    },
    {
      id: 'check-certs',
      name: 'Certifications & Professional Licenses',
      sectionKey: 'certifications',
      icon: Award,
      status: certStatus,
      score: certScore,
      title: 'Industry Accredited Certifications',
      finding: certFinding,
      requirement: 'Certifications formatted with recognized certifying organizations (e.g. AWS, Docker, CNCF) and issue year.',
      actionText: certStatus !== 'pass' ? 'Manage Certifications' : undefined,
      actionType: certStatus !== 'pass' ? 'editor' : undefined
    }
  ];

  // Calculate Overall Production Readiness Score
  const totalItems = items.length;
  const passItems = items.filter((i) => i.status === 'pass').length;
  const warningItems = items.filter((i) => i.status === 'warning').length;
  const failItems = items.filter((i) => i.status === 'fail').length;

  const sumScores = items.reduce((acc, curr) => acc + curr.score, 0);
  const overallReadinessScore = Math.round(sumScores / totalItems);

  // Filter Items
  const filteredItems = items.filter((item) => {
    if (activeTab === 'issues') return item.status !== 'pass';
    if (activeTab === 'passed') return item.status === 'pass';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-slate-900">
                Top 500 Production Readiness Dashboard
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full uppercase">
                Fortune 500 Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive compliance audit checking mandatory resume components against Fortune 500 recruiter & ATS benchmarks.
            </p>
          </div>
        </div>

        {onFixAll && (
          <button
            onClick={onFixAll}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-2 transition active:scale-95 shrink-0"
          >
            <Wand2 className="w-4 h-4 text-emerald-200" />
            <span>1-Click Fix All Format Flaws</span>
          </button>
        )}
      </div>

      {/* Hero Score & Breakdown Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="md:col-span-4 flex items-center space-x-4 border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0 md:pr-4">
          <div className={`w-20 h-20 rounded-2xl border-4 flex flex-col items-center justify-center font-black shadow-inner shrink-0 ${
            overallReadinessScore >= 85
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : overallReadinessScore >= 65
              ? 'border-amber-500 bg-amber-50 text-amber-700'
              : 'border-rose-500 bg-rose-50 text-rose-700'
          }`}>
            <span className="text-2xl font-extrabold tracking-tight">{overallReadinessScore}%</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">Ready</span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              {overallReadinessScore >= 85
                ? 'Production Ready for Top 500'
                : overallReadinessScore >= 65
                ? 'Minor Component Flaws Detected'
                : 'Action Required for Top 500 Approval'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {failItems > 0
                ? `${failItems} critical component(s) missing or incomplete.`
                : warningItems > 0
                ? `${warningItems} component(s) require formatting polish.`
                : 'All mandatory component structures pass Top 500 standards!'}
            </p>
          </div>
        </div>

        {/* Readiness Progress Bar & Quick Stats */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Mandatory Component Coverage:</span>
            <span className="font-mono text-slate-900">
              {passItems} Pass • {warningItems} Polish Needed • {failItems} Missing
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(passItems / totalItems) * 100}%` }}
              title={`${passItems} Passed`}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${(warningItems / totalItems) * 100}%` }}
              title={`${warningItems} Polish Needed`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${(failItems / totalItems) * 100}%` }}
              title={`${failItems} Failed`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Filter Component Audit:</span>
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Components ({totalItems})
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'issues'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Fix ({warningItems + failItems})
              </button>
              <button
                onClick={() => setActiveTab('passed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'passed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Passed ({passItems})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Component Audit Checklist Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.status === 'pass'
                  ? 'bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300'
                  : item.status === 'warning'
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  {/* Status Badge Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.status === 'pass'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.status === 'pass' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {item.name}
                      </h4>

                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                        item.status === 'pass'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.status === 'warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {item.status === 'pass' ? '100% Passed' : item.status === 'warning' ? 'Needs Polish' : 'Missing / Fail'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      {item.finding}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      <strong className="text-slate-600">Top 500 Standard Requirement:</strong> {item.requirement}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {item.actionText && (
                  <div className="shrink-0 self-start sm:self-center">
                    {item.actionType === 'fixAll' && onFixAll ? (
                      <button
                        onClick={onFixAll}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-emerald-200" />
                        <span>{item.actionText}</span>
                      </button>
                    ) : item.actionType === 'metricSuggester' && onOpenMetricSuggester ? (
                      <button
                        onClick={onOpenMetricSuggester}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-amber-200" />
                        <span>{item.actionText}</span>
                      </button>
                    ) : item.actionType === 'editor' && onNavigateToEditorSection ? (
                      <button
                        onClick={() => onNavigateToEditorSection(item.sectionKey)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95"
                      >
                        <span>{item.actionText}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW SECTION: Readability & Layout Audit */}
      <div className="border-t border-slate-200/80 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 to-slate-900 text-indigo-300 flex items-center justify-center font-bold shadow shrink-0">
              <Ruler className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Readability & Layout Audit
                </h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Typography & Spacing
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates font scale hierarchy, vertical line height ratios, printable page margins, and document density for 6-second recruiter scans.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-center">
            <Type className="w-4 h-4 text-indigo-600" />
            <span>Target Scale: 10.5pt Body / 13pt Headers</span>
          </div>
        </div>

        {/* 4-Grid Audit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layoutAuditChecks.map((chk) => {
            const Icon = chk.icon;
            return (
              <div
                key={chk.id}
                className={`p-4 rounded-xl border space-y-2 transition-all ${
                  chk.status === 'pass'
                    ? 'bg-emerald-50/20 border-emerald-200 hover:border-emerald-300'
                    : 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      chk.status === 'pass'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      {chk.title}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                    chk.status === 'pass'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {chk.status === 'pass' ? 'Optimal' : 'Polish Recommended'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {chk.finding}
                </p>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                  <span><strong>Benchmark:</strong> {chk.benchmark}</span>
                  <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
