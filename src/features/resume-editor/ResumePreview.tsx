import React from 'react';
import { ResumeData, TemplateOptions } from '../../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { isKnownSocialOrEmailDomain } from '../../utils/linkExtractor';
import { isValidHumanName, isValidLocation, cleanEmail } from '../../utils/resumeParser';
import { formatEmailHandleToHumanName } from '../../utils/resumeSanitizer';

const formatDateForDisplay = (dateStr: string | undefined): string => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  let clean = dateStr.replace(/^[–—\-\s,]+|[–—\-\s,]+$/g, '').trim();
  if (/^Presen/i.test(clean) || clean === 'Pr' || clean === 'Pres' || clean === 'Current' || clean.toLowerCase() === 'present.') {
    return 'Present';
  }
  return clean;
};

const renderDateRange = (startDate?: string, endDate?: string): string => {
  const start = formatDateForDisplay(startDate);
  let end = formatDateForDisplay(endDate);
  if (!end || /^Presen/i.test(end) || end === 'Pr' || end === 'Pres') {
    end = 'Present';
  }
  if (start && end) {
    if (start === end) return start;
    return `${start} – ${end}`;
  }
  if (end) return end;
  if (start) return start;
  return 'Present';
};

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateOptions: TemplateOptions;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  templateOptions,
}) => {
  const rawPersonalInfo = resumeData?.personalInfo || {
    fullName: 'Candidate Name',
    headline: 'Professional Title',
    email: '',
    phone: '',
    location: '',
  };

  let renderedEmail = cleanEmail(rawPersonalInfo.email || '');

  // Guard against raw PDF stream tokens & binary noise in render
  let cleanFullName = (rawPersonalInfo.fullName || '').trim();
  if (!isValidHumanName(cleanFullName)) {
    cleanFullName = renderedEmail
      ? renderedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Candidate Name';
  }

  let cleanPhone = (rawPersonalInfo.phone || '').trim();
  if (cleanPhone && (/\.\d{3,}/.test(cleanPhone) || /^\d{4,}\s+\d+\.\d+$/.test(cleanPhone) || cleanPhone.includes('>>') || cleanPhone.includes('<<'))) {
    cleanPhone = '';
  }

  let cleanLocation = (rawPersonalInfo.location || '').trim();
  if (cleanLocation && !isValidLocation(cleanLocation)) {
    cleanLocation = '';
  }

  const personalInfo = {
    ...rawPersonalInfo,
    fullName: cleanFullName,
    email: renderedEmail,
    phone: cleanPhone,
    location: cleanLocation,
  };
  const summary = resumeData?.summary || '';
  const experience = resumeData?.experience || [];
  const rawEducation = resumeData?.education || [];
  const education = rawEducation.filter((edu) => {
    const deg = (edu.degree || '').toLowerCase();
    const inst = (edu.institution || '').toLowerCase();
    const fld = (edu.fieldOfStudy || '').toLowerCase();

    if (inst.includes('embedded links:') || deg.includes('embedded links:') || fld.includes('embedded links:')) {
      return false;
    }
    if (inst.includes('https://') || deg.includes('https://') || inst.includes('http://') || deg.includes('http://')) {
      return false;
    }
    if (deg === 'degree' && (inst === 'university' || inst === 'university / institution')) {
      return false;
    }
    return true;
  });
  const projects = resumeData?.projects || [];
  const skillCategories = resumeData?.skillCategories || [];
  const certifications = resumeData?.certifications || [];
  const sideProjectsAndAccomplishments = resumeData?.sideProjectsAndAccomplishments || [];

  const { style, primaryColor, fontFamily, fontSize } = templateOptions;

  const getFontClass = () => {
    if (fontFamily === 'serif') return 'font-serif';
    if (fontFamily === 'mono') return 'font-mono';
    return 'font-sans';
  };

  const getFontSizeClass = () => {
    if (fontSize === 'sm') return 'text-[11px] leading-tight';
    if (fontSize === 'lg') return 'text-[13px] leading-relaxed';
    return 'text-[12px] leading-normal';
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    let clean = url.trim().replace(/[\s,;.)\]]+$/, '');
    if (!clean) return '';
    return clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
  };

  const renderSocialLinkIcon = (label: string, url: string, isDarkMode = false) => {
    const lowerLabel = label.toLowerCase();
    const lowerUrl = url.toLowerCase();
    const iconClass = "w-3.5 h-3.5 inline shrink-0 mr-1";

    if (lowerLabel.includes('linkedin') || lowerUrl.includes('linkedin.com')) {
      return <Linkedin className={`${iconClass} ${isDarkMode ? 'text-cyan-400' : 'text-[#0A66C2]'}`} />;
    }
    if (lowerLabel.includes('github') || lowerUrl.includes('github.com')) {
      return <Github className={`${iconClass} ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`} />;
    }
    if (lowerLabel.includes('portfolio') || lowerLabel.includes('website') || lowerLabel.includes('globe') || lowerLabel.includes('blog') || lowerLabel.includes('dev.to') || lowerLabel.includes('medium')) {
      return <Globe className={`${iconClass} ${isDarkMode ? 'text-cyan-400' : 'text-emerald-600'}`} />;
    }
    return <LinkIcon className={iconClass} />;
  };

  const getSocialLinks = () => {
    const links: { label: string; url: string }[] = [];
    const added = new Set<string>();

    const add = (label: string, url?: string) => {
      if (!url) return;
      const clean = url.trim().replace(/[\s,;.)\]]+$/, '');
      if (!clean) return;
      if (label.toLowerCase() === 'portfolio' && isKnownSocialOrEmailDomain(clean)) {
        return;
      }
      const formatted = formatUrl(clean);
      const key = formatted.toLowerCase().replace(/\/$/, '');
      if (!added.has(key)) {
        added.add(key);
        links.push({ label, url: formatted });
      }
    };

    add('Linkedin', personalInfo.linkedin);
    add('Github', personalInfo.github);
    add('Leetcode', personalInfo.leetcode);
    add('Hackerrank', personalInfo.hackerrank);
    add('Scaler', personalInfo.scaler);
    if (personalInfo.portfolio && !isKnownSocialOrEmailDomain(personalInfo.portfolio)) {
      add('Portfolio', personalInfo.portfolio);
    }

    if (personalInfo.customLinks && Array.isArray(personalInfo.customLinks)) {
      personalInfo.customLinks.forEach((item) => {
        add(item.label || 'Link', item.url);
      });
    }

    return links;
  };

  const renderContactBar = (isDarkMode = false) => {
    const socialLinks = getSocialLinks();
    const iconColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';
    const textColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
    const linkColor = isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800';
    const pipeColor = isDarkMode ? 'text-slate-600' : 'text-slate-400';

    return (
      <div className={`flex flex-col items-center justify-center space-y-1 text-xs mt-2.5 font-medium ${textColor}`}>
        {/* Row 1: Location | Phone */}
        {(personalInfo.location || personalInfo.phone) && (
          <div className="flex items-center justify-center flex-wrap">
            {personalInfo.location && (
              <span className="inline-flex items-center space-x-1">
                <MapPin className={`w-3.5 h-3.5 ${iconColor} inline mr-0.5`} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.location && personalInfo.phone && (
              <span className={`mx-2.5 ${pipeColor} font-normal`}>|</span>
            )}
            {personalInfo.phone && (
              <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="inline-flex items-center space-x-1 hover:underline transition">
                <Phone className={`w-3.5 h-3.5 ${iconColor} inline mr-0.5`} />
                <span>{personalInfo.phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Row 2: Links with Brand Icons */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-y-1">
            {socialLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className={`mx-2.5 ${pipeColor} font-normal`}>|</span>}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkColor} hover:underline font-medium transition inline-flex items-center`}
                >
                  {renderSocialLinkIcon(link.label, link.url, isDarkMode)}
                  <span>{link.label}</span>
                </a>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Row 3: Email */}
        {personalInfo.email && (
          <div className="flex items-center justify-center">
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center space-x-1 hover:underline transition">
              <Mail className={`w-3.5 h-3.5 ${iconColor} inline mr-1`} />
              <span>{personalInfo.email}</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    let cleanText = text
      .replace(/\[DOCUMENT_EMBEDDED_LINKS\][\s\S]*/gi, '')
      .replace(/Embedded Links:\s*[^\n]*/gi, '')
      .trim();

    if (cleanText.includes('**')) {
      const parts = cleanText.split('**');
      return (
        <>
          {parts.map((part, idx) =>
            idx % 2 === 1 ? (
              <strong key={idx} className="font-semibold text-slate-900">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </>
      );
    }
    return cleanText;
  };

  return (
    <div className="flex justify-center w-full py-6 bg-slate-200/60 min-h-screen">
      {/* Printable Resume Canvas Container */}
      <div
        id="resume-preview-container"
        className={`bg-white text-slate-900 shadow-xl rounded-none w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 border border-slate-300 ${getFontClass()} ${getFontSizeClass()} print:p-0 print:shadow-none print:border-none print:w-full print:max-w-none`}
        style={{ color: '#111827' }}
      >
        {/* TEMPLATE STYLE: ORIGINAL DRAFT / EXECUTIVE MODERN */}
        {(style === 'executive' || style === 'original') && (
          <div className="space-y-5">
            {style === 'original' && (
              <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1 print:hidden">
                <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Original Uploaded Document Layout Preview (72% ATS Compliance)</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-normal">
                  This format mirrors your uploaded raw document layout. Note that multi-column boxes, non-standard margins, or unparsed graphics may lower parsing accuracy in corporate ATS engines (Workday, Taleo). Switch to <strong>Executive Modern</strong> or <strong>Harvard Classic ATS</strong> above for 100% HR compatibility.
                </p>
              </div>
            )}

            {/* Header */}
            <div className="border-b-2 pb-4 text-center" style={{ borderColor: primaryColor }}>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase" style={{ color: primaryColor }}>
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              {personalInfo.headline && (
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{personalInfo.headline}</p>
              )}

              {/* 3-Row Contact Section */}
              {renderContactBar(false)}
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Professional Summary
                </h2>
                <p className="text-slate-800 text-xs leading-relaxed pt-1">{summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {experience && experience.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Work Experience
                </h2>

                <div className="space-y-3.5">
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {renderDateRange(exp.startDate, exp.endDate)}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-xs text-slate-700 italic font-medium">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800 text-xs pt-0.5">
                          {exp.highlights.map((hl, i) => (
                            <li key={i}>{renderFormattedText(hl)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Matrix */}
            {skillCategories && skillCategories.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Technical Skills & Competencies
                </h2>

                <div className="space-y-1 text-xs">
                  {skillCategories.map((cat, i) => (
                    <div key={i} className="flex items-start">
                      <span className="font-bold text-slate-900 min-w-[150px]">{cat.category}:</span>
                      <span className="text-slate-800 flex-1">{cat.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Key Technical Projects
                </h2>

                <div className="space-y-2">
                  {projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="space-y-0.5">
                      <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                        <span>{proj.title} {proj.subtitle && <span className="font-normal italic text-slate-600">— {proj.subtitle}</span>}</span>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="font-normal text-blue-700 hover:text-blue-800 underline text-[11px] flex items-center space-x-1">
                            <Globe className="w-3 h-3 inline mr-0.5 text-blue-600" />
                            <span>{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </a>
                        )}
                      </div>
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800 text-xs">
                          {proj.highlights.map((hl, i) => (
                            <li key={i}>{renderFormattedText(hl)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Side Projects & Key Accomplishments */}
            {sideProjectsAndAccomplishments && sideProjectsAndAccomplishments.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Side Projects & Unlisted Accomplishments
                </h2>

                <div className="space-y-2">
                  {sideProjectsAndAccomplishments.map((acc, idx) => (
                    <div key={acc.id || idx} className="space-y-0.5 text-xs">
                      <div className="flex items-baseline justify-between font-bold text-slate-900">
                        <span>{acc.title} <span className="font-normal text-slate-600 text-[11px]">({acc.category})</span></span>
                        {acc.date && <span className="text-[11px] text-slate-600 font-normal">{acc.date}</span>}
                      </div>
                      <p className="text-slate-800 text-xs">{acc.description}</p>
                      {acc.impactMetrics && (
                        <p className="text-slate-900 font-medium text-xs">💡 Impact: {acc.impactMetrics}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Education
                </h2>

                <div className="space-y-1.5">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree || 'Degree'}</span>
                        {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                        {edu.institution && <span className="italic text-slate-700"> — {edu.institution}</span>}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <span className="font-semibold text-slate-600">
                          {edu.startDate && edu.endDate && edu.startDate !== edu.endDate
                            ? `${edu.startDate} – ${edu.endDate}`
                            : edu.endDate || edu.startDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: '#e2e8f0' }}>
                  Certifications & Licenses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {certifications.map((c, idx) => (
                    <div key={c.id || idx} className="p-2 bg-slate-50 border border-slate-200/80 rounded flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        {c.issuer && <span className="text-[11px] text-slate-600 block">{c.issuer}</span>}
                      </div>
                      {c.date && <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">{c.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HARVARD CLASSIC TEMPLATE */}
        {style === 'harvard' && (
          <div className="space-y-4 font-serif">
            {/* Header Centered */}
            <div className="text-center border-b pb-3" style={{ borderColor: '#000' }}>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{personalInfo.fullName || 'Candidate Name'}</h1>
              {personalInfo.headline && (
                <p className="text-xs italic text-slate-700 mt-0.5">{personalInfo.headline}</p>
              )}
              {renderContactBar(false)}
            </div>

            {summary && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ borderColor: '#000' }}>
                  Summary
                </h2>
                <p className="text-xs text-slate-900 leading-relaxed">{summary}</p>
              </div>
            )}

            {experience && experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ borderColor: '#000' }}>
                  Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx}>
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      <div className="flex justify-between italic text-xs text-slate-800 mb-1">
                        <span>{exp.position}</span>
                        <span>{renderDateRange(exp.startDate, exp.endDate)}</span>
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc pl-4 text-xs space-y-0.5 text-slate-900">
                          {exp.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillCategories && skillCategories.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ borderColor: '#000' }}>
                  Skills
                </h2>
                <div className="text-xs space-y-0.5">
                  {skillCategories.map((sc, i) => (
                    <p key={i}>
                      <strong>{sc.category}:</strong> {sc.skills.join(', ')}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ borderColor: '#000' }}>
                  Education
                </h2>
                <div className="space-y-1.5">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex justify-between text-xs">
                      <div>
                        <strong>{edu.institution}</strong> — {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </div>
                      <span>{edu.endDate || edu.startDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ borderColor: '#000' }}>
                  Key Projects
                </h2>
                <div className="space-y-2">
                  {projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="text-xs">
                      <div className="flex items-baseline justify-between">
                        <strong>
                          {proj.title}
                          {proj.subtitle && <span className="font-normal italic"> — {proj.subtitle}</span>}
                        </strong>
                        {proj.link && (
                          <a
                            href={formatUrl(proj.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-blue-700 hover:underline text-[11px] inline-flex items-center ml-2"
                          >
                            <Globe className="w-3 h-3 inline mr-0.5 text-blue-600" />
                            <span>{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </a>
                        )}
                      </div>
                      {proj.highlights && (
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-900 mt-0.5">
                          {proj.highlights.map((h, i) => (
                            <li key={i}>{renderFormattedText(h)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ borderColor: '#000' }}>
                  Certifications & Licenses
                </h2>
                <div className="space-y-1 text-xs">
                  {certifications.map((c, idx) => (
                    <div key={c.id || idx} className="flex justify-between">
                      <div>
                        <strong>{c.name}</strong> {c.issuer ? `— ${c.issuer}` : ''}
                      </div>
                      {c.date && <span className="font-mono text-slate-600">{c.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TECH MINIMAL TEMPLATE & CORPORATE TEMPLATE */}
        {(style === 'tech' || style === 'corporate') && (
          <div className="space-y-5">
            <div className="bg-slate-900 text-white p-6 rounded-lg space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{personalInfo.fullName || 'Candidate Name'}</h1>
              {personalInfo.headline && (
                <p className="text-xs text-cyan-400 font-mono font-semibold">{personalInfo.headline}</p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300 font-mono pt-1">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {getSocialLinks().map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center"
                  >
                    {renderSocialLinkIcon(link.label, link.url, true)}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {summary && (
              <div className="p-3.5 bg-slate-50 border-l-4 border-slate-900 text-xs text-slate-800">
                {summary}
              </div>
            )}

            {experience && experience.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
                  // WORK EXPERIENCE
                </h2>
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-slate-900">
                      <span>{exp.position} @ {exp.company}</span>
                      <span className="font-mono text-slate-600">{renderDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                    {exp.highlights && (
                      <ul className="list-disc pl-4 text-xs space-y-1 text-slate-800">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {skillCategories && skillCategories.length > 0 && (
              <div>
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                  // TECH STACK & COMPETENCIES
                </h2>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {skillCategories.map((cat, i) => (
                    <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded">
                      <span className="font-bold font-mono text-slate-900">{cat.category}: </span>
                      <span className="text-slate-800">{cat.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                  // EDUCATION & ACADEMICS
                </h2>
                <div className="space-y-2 text-xs">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                        {edu.institution && <span className="text-slate-600"> ({edu.institution})</span>}
                      </div>
                      <span className="font-mono text-slate-500">{edu.endDate || edu.startDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                  // TECHNICAL PROJECTS
                </h2>
                <div className="space-y-2 text-xs">
                  {projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="p-2 bg-slate-50 border border-slate-200 rounded space-y-1">
                      <div className="font-bold text-slate-900 flex justify-between items-baseline">
                        <span>{proj.title} {proj.subtitle && <span className="font-normal italic text-slate-600">— {proj.subtitle}</span>}</span>
                        {proj.link && (
                          <a
                            href={formatUrl(proj.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-cyan-700 hover:text-cyan-800 hover:underline text-[11px] inline-flex items-center ml-2"
                          >
                            <Globe className="w-3 h-3 inline mr-1 text-cyan-600" />
                            <span>{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </a>
                        )}
                      </div>
                      {proj.highlights && (
                        <ul className="list-disc pl-4 text-slate-800 space-y-0.5">
                          {proj.highlights.map((h, i) => (
                            <li key={i}>{renderFormattedText(h)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
