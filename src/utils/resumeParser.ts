import { ResumeData, WorkExperience, Education, Project, SkillCategory, Certification } from '../types';
import { sanitizeAndFixResumeData } from './resumeSanitizer';

export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skillCategories: [],
    certifications: [],
  };
}

/**
 * Strict validator for human names. Rejects binary noise, PDF stream tokens, and symbols (#, =, ~, ], }, {, _, /, \, %, *, ^, $, +, <, >).
 */
export function isValidHumanName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 50) return false;

  // Reject symbols like #, =, ~, ], }, {, _, /, \, @, %, *, ^, $, +, <, >, |, ?, !, :, ;
  if (/[#=~\]\}\{_\\\/%*^$+<>|?!:;]/g.test(clean)) return false;

  // Must contain only letters, spaces, hyphens, periods, or apostrophes
  if (!/^[a-zA-Z\s.'\-]{2,50}$/.test(clean)) return false;

  // Must contain at least one vowel
  if (!/[aeiouyAEIOUY]/.test(clean)) return false;

  const lower = clean.toLowerCase();
  const badTokens = [
    'resume', 'cv', 'curriculum', 'vitae', 'summary', 'experience', 'education',
    'skills', 'projects', 'certifications', 'contact', 'profile', 'stream', 'endstream',
    'obj', 'endobj', 'xref', 'trailer', 'startxref', 'competencies', 'technical', 'professional',
    'libraries', 'frameworks', 'tools', 'databases', 'languages', 'present', 'current',
    'senior', 'junior', 'developer', 'engineer', 'analyst', 'architect', 'manager', 'lead',
    'associate', 'intern', 'consultant', 'specialist', 'package', 'development', 'application',
    'india', 'usa', 'united states', 'uk', 'canada', 'australia', 'germany', 'france', 'singapore',
    'service', 'consultancy', 'limited', 'tata'
  ];

  if (badTokens.some((t) => lower === t || lower.includes(t))) return false;

  return true;
}

/**
 * Strict validator for location strings. Rejects binary noise and non-location symbols.
 */
export function isValidLocation(location: string): boolean {
  if (!location || typeof location !== 'string') return false;
  const clean = location.trim();
  if (clean.length < 3 || clean.length > 60) return false;
  return true;
}

/**
 * Cleans extracted emails from leading PDF font coordinate floating-point artifacts (e.g. 435.16404436816407gautamdas251998@gmail.com -> gautamdas251998@gmail.com)
 */
export function cleanEmail(rawEmail: string): string {
  if (!rawEmail) return '';
  let cleaned = rawEmail.trim();
  // Strip leading font coordinate numbers or float prefixes like 435.16404436816407
  cleaned = cleaned.replace(/^[0-9.]+(?=[a-zA-Z])/g, '');
  cleaned = cleaned.replace(/^[^a-zA-Z0-9]+/, '');
  return cleaned;
}

/**
 * Strips PDF floating-point coordinate numbers (e.g., 429.6679545971678Bangalore -> Bangalore, 00043.44 -> "")
 * created when pdf-parse / pdfjs extracts text items with font matrix positioning.
 */
export function stripPdfCoordinateNoise(text: string): string {
  if (!text) return '';
  let cleaned = text;
  // 1. Strip zero-padded or standard float coordinate numbers e.g. 00043.44, 00364.15, 00394.87, 000041.4, 429.66795
  cleaned = cleaned.replace(/\b0*\d{1,5}\.\d{1,15}\b/g, ' ');
  // 2. Strip attached float numbers prefixed to text e.g. 00043.44Indrani, 45.011716Python, 000041.4Experience
  cleaned = cleaned.replace(/0*\d{1,5}\.\d{1,15}(?=[a-zA-Z•+\/])/g, ' ');
  // 3. Strip standalone multi-digit integer coordinate prefixes on lines e.g. 000041.4
  cleaned = cleaned.replace(/^\d{4,}\s+\d+\.\d+/gm, '');
  // 4. Normalise duplicate spaces & multi-newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

/**
 * Deep text cleaning to strip non-standard hidden/control characters, zero-width spaces,
 * OCR/extraction artifacts, and date typos (missing 't's, trailing orphan 'N's, etc.)
 */
export function deepCleanText(text: string): string {
  if (!text) return '';
  let clean = stripPdfCoordinateNoise(text);

  // 1. Strip zero-width & non-printable/control Unicode characters
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');
  clean = clean.replace(/\u00A0/g, ' ');
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  // 2. Strip embedded link debug tokens from text body
  clean = clean.replace(/\[DOCUMENT_EMBEDDED_LINKS\][\s\S]*/gi, '');
  clean = clean.replace(/Embedded Links:\s*[^\n]*/gi, '');

  // 3. Fix OCR / Extraction date anomalies and typos
  clean = clean.replace(/\bPresen\b/gi, 'Present');
  clean = clean.replace(/\bCurren\b/gi, 'Current');
  clean = clean.replace(/\bJanu\b/gi, 'Jan');
  clean = clean.replace(/\bFebru\b/gi, 'Feb');
  clean = clean.replace(/\bMarc\b/gi, 'Mar');
  clean = clean.replace(/\bApri\b/gi, 'Apr');
  clean = clean.replace(/\bAugu\b/gi, 'Aug');
  clean = clean.replace(/\bSept\b/gi, 'Sep');
  clean = clean.replace(/\bNove\b/gi, 'Nov');
  clean = clean.replace(/\bDece\b/gi, 'Dec');

  // 4. Fix trailing orphan single characters attached to years / dates / bullet ends (e.g., "2020 – 2024 N" or "2022 T" or "Present N")
  clean = clean.replace(/(\b(?:19\d\d|20\d\d|Present|Current))\s+[A-Za-zA-Z]\b/g, '$1');
  clean = clean.replace(/(\b\d{4})\s*–\s*([A-Za-zA-Z])\b(?!\w)/g, '$1 – ');

  // 5. Clean up non-standard bullet characters and whitespace
  clean = clean.replace(/[\uF0B7\u25CF\u2022\u25E6\u2023\u2043\u25C6]/g, '•');

  return clean;
}

export interface ExtractedSocialLinks {
  linkedin: string;
  github: string;
  leetcode: string;
  hackerrank: string;
  scaler: string;
  portfolio: string;
}

/**
 * Robust regex-based extraction for social profiles and portfolio links.
 * Validates against platform formats regardless of original text formatting.
 */
export function extractSocialLinksFromText(rawText: string): ExtractedSocialLinks {
  const result: ExtractedSocialLinks = {
    linkedin: '',
    github: '',
    leetcode: '',
    hackerrank: '',
    scaler: '',
    portfolio: '',
  };

  if (!rawText) return result;

  const text = rawText.replace(/[\r\n]+/g, ' ');

  // 1. LinkedIn extraction
  const liUrlMatch = text.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/(?:in|pub|profile)\/([a-zA-Z0-9_.-]+)\/?/i)
    || text.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/([a-zA-Z0-9_.-]+)\/?/i)
    || text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,;()<>]+/i);

  if (liUrlMatch) {
    let raw = liUrlMatch[0].trim().replace(/[.,;)]+$/, '');
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw.replace(/^www\./, '')}`;
    }
    result.linkedin = raw;
  } else {
    const liTextMatch = text.match(/linkedin\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i)
      || text.match(/\b(?:in|profile)\/([a-zA-Z0-9_.-]{3,50})\b/i);
    if (liTextMatch && liTextMatch[1]) {
      const handle = liTextMatch[1].trim();
      const blacklisted = ['com', 'http', 'https', 'in', 'profile', 'jobs', 'company', 'learning', 'feed'];
      if (!blacklisted.includes(handle.toLowerCase())) {
        result.linkedin = `https://linkedin.com/in/${handle}`;
      }
    }
  }

  // 2. GitHub extraction
  const ghUrlMatch = text.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?github\.com\/([a-zA-Z0-9_.-]+)\/?/i)
    || text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,;()<>]+/i);

  if (ghUrlMatch) {
    let raw = ghUrlMatch[0].trim().replace(/[.,;)]+$/, '');
    const pathPart = raw.split('github.com/')[1] || '';
    const blacklisted = ['pricing', 'features', 'login', 'signup', 'about', 'explore', 'trending', 'sponsors', 'topics', 'orgs', 'settings'];
    if (!blacklisted.includes(pathPart.toLowerCase().replace(/\/.*$/, ''))) {
      if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        raw = `https://${raw.replace(/^www\./, '')}`;
      }
      result.github = raw;
    }
  } else {
    const ghTextMatch = text.match(/github\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i);
    if (ghTextMatch && ghTextMatch[1]) {
      const handle = ghTextMatch[1].trim();
      const blacklisted = ['com', 'http', 'https', 'pricing', 'features', 'login'];
      if (!blacklisted.includes(handle.toLowerCase())) {
        result.github = `https://github.com/${handle}`;
      }
    }
  }

  // 3. LeetCode
  const lcUrlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u|profile|users)\/([a-zA-Z0-9_.-]+)\/?/i)
    || text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/([a-zA-Z0-9_.-]+)\/?/i);
  if (lcUrlMatch) {
    let raw = lcUrlMatch[0].trim().replace(/[.,;)]+$/, '');
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw.replace(/^www\./, '')}`;
    }
    result.leetcode = raw;
  } else {
    const lcTextMatch = text.match(/leetcode\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i);
    if (lcTextMatch && lcTextMatch[1] && !['com', 'http', 'https', 'u', 'profile'].includes(lcTextMatch[1].toLowerCase())) {
      result.leetcode = `https://leetcode.com/u/${lcTextMatch[1].trim()}`;
    }
  }

  // 4. HackerRank
  const hrUrlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?:profile\/)?([a-zA-Z0-9_.-]+)\/?/i);
  if (hrUrlMatch) {
    let raw = hrUrlMatch[0].trim().replace(/[.,;)]+$/, '');
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw.replace(/^www\./, '')}`;
    }
    result.hackerrank = raw;
  } else {
    const hrTextMatch = text.match(/hackerrank\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i);
    if (hrTextMatch && hrTextMatch[1] && !['com', 'http', 'https', 'profile'].includes(hrTextMatch[1].toLowerCase())) {
      result.hackerrank = `https://hackerrank.com/${hrTextMatch[1].trim()}`;
    }
  }

  // 5. Scaler
  const scUrlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?scaler\.com\/(?:academy\/profile\/|profile\/|academy\/|mentee\/)?([a-zA-Z0-9_.-]+)\/?/i);
  if (scUrlMatch) {
    let raw = scUrlMatch[0].trim().replace(/[.,;)]+$/, '');
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw.replace(/^www\./, '')}`;
    }
    result.scaler = raw;
  } else {
    const scTextMatch = text.match(/scaler\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i);
    if (scTextMatch && scTextMatch[1] && !['com', 'http', 'https', 'academy', 'profile', 'mentee'].includes(scTextMatch[1].toLowerCase())) {
      result.scaler = `https://scaler.com/profile/${scTextMatch[1].trim()}`;
    }
  }

  // 6. Portfolio / Personal Website
  const urlMatches = text.matchAll(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|me|app|tech|co|site|design|xyz|org|com|net)(?:\/[^\s,;()<>]*)?)/gi);
  const socialDomains = [
    'linkedin.com', 'github.com', 'leetcode.com', 'hackerrank.com', 'scaler.com',
    'codechef.com', 'codeforces.com', 'kaggle.com', 'gmail.com', 'yahoo.com',
    'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'zoho.com',
    'medium.com', 'dev.to', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'
  ];

  for (const match of urlMatches) {
    const matchedUrl = match[0];
    const lower = matchedUrl.toLowerCase();
    if (!socialDomains.some((dom) => lower.includes(dom))) {
      let cleanUrl = matchedUrl.trim().replace(/[.,;)]+$/, '');
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl.replace(/^www\./, '')}`;
      }
      result.portfolio = cleanUrl;
      break;
    }
  }

  return result;
}

/**
 * Specifically parses certification lines like "Docker Certified Associate (University / Org, Year)"
 * or "AWS Solutions Architect - Amazon - 2022" and separates cert name, issuer/organization,
 * and year/date into dedicated fields in the Certification model.
 */
export function parseCertificationEntry(rawCertStr: string, index = 0): Certification {
  const cleanStr = deepCleanText(rawCertStr.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim());
  if (!cleanStr) {
    return {
      id: `cert-${Date.now()}-${index}`,
      name: 'Certification',
      issuer: 'Certification Body',
      date: '',
    };
  }

  let name = cleanStr;
  let issuer = '';
  let date = '';

  // 1. Parenthetical format: "Cert Name (Organization / University, Year)" or "Cert Name (Organization)"
  const parenMatch = cleanStr.match(/^([^(]+)\(([^)]+)\)(.*)$/);
  if (parenMatch) {
    name = parenMatch[1].trim();
    const insideParen = parenMatch[2].trim();
    const afterParen = parenMatch[3].trim();

    const yearMatchInside = insideParen.match(/\b(19\d{2}|20\d{2})\b/);
    const yearMatchAfter = afterParen.match(/\b(19\d{2}|20\d{2})\b/);

    if (yearMatchInside) {
      date = yearMatchInside[1];
      const cleanInside = insideParen
        .replace(/\b(19\d{2}|20\d{2})\b/, '')
        .replace(/^[,\s-]+|[,\s-]+$/g, '')
        .trim();
      if (cleanInside) {
        issuer = cleanInside;
      }
    } else {
      issuer = insideParen;
    }

    if (yearMatchAfter && !date) {
      date = yearMatchAfter[1];
    }
  } else {
    // 2. Dash/pipe/comma separated: "Cert Name - Issuer - 2020" or "Cert Name, Issuer, 2020"
    const yearMatch = cleanStr.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      date = yearMatch[1];
    }

    if (cleanStr.includes(' - ') || cleanStr.includes(' | ') || cleanStr.includes(' @ ') || cleanStr.includes(', ')) {
      const parts = cleanStr
        .split(/\s*[-|@,]\s*/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length >= 2) {
        name = parts[0];
        const nonYearParts = parts.slice(1).filter((p) => !/^(19\d{2}|20\d{2})$/.test(p));
        if (nonYearParts.length > 0) {
          issuer = nonYearParts.join(' - ');
        }
      }
    }
  }

  // Clean trailing punctuation from name & issuer
  name = name.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();
  issuer = issuer.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();

  return {
    id: `cert-${Date.now()}-${index}`,
    name: name || cleanStr,
    issuer: issuer || 'Certification Body',
    date: date || '',
  };
}

export function parseResumeTextToStructuredData(text: string): ResumeData {
  if (!text || !text.trim()) {
    return createEmptyResumeData();
  }

  // Sanitize PDF binary header syntax if raw PDF stream text was passed in
  if (text.includes('%PDF-')) {
    text = text
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('%PDF')) return false;
        if (/^\d+\s+\d+\s+obj/i.test(trimmed)) return false;
        if (/^(endobj|stream|endstream|xref|trailer|startxref)/i.test(trimmed)) return false;
        if (/^\/Filter|\/Length|\/Type|\/Font|\/MediaBox|\/Parent|\/Resources/i.test(trimmed)) return false;
        if (/^[<>\/\[\]\(\)\d\s\.\-]{8,}$/.test(trimmed)) return false;
        return true;
      })
      .join('\n');
  }

  // 1. Try parsing structured JSON if text is valid JSON
  try {
    const jsonParsed = JSON.parse(text);
    if (jsonParsed && typeof jsonParsed === 'object') {
      if (jsonParsed.resumeData) {
        return normalizeResumeData(jsonParsed.resumeData);
      }
      if (
        jsonParsed.personalInfo ||
        jsonParsed.experience ||
        jsonParsed.skillCategories ||
        jsonParsed.education
      ) {
        return normalizeResumeData(jsonParsed);
      }
    }
  } catch {
    // Not JSON, continue with text parsing
  }

  // Deep text clean initial text
  const cleanedFullText = deepCleanText(text);
  const rawLines = cleanedFullText.split('\n').map((l) => deepCleanText(l).trim()).filter(Boolean);

  // 2. Extract Contact Information using regexes from cleaned full text
  const rawEmailMatch = cleanedFullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = rawEmailMatch ? cleanEmail(rawEmailMatch[0]) : '';
  const phoneMatch = cleanedFullText.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  let phone = phoneMatch ? phoneMatch[0] : '';

  // Validate phone is not a font coordinate (e.g. 16797 610.8398)
  if (phone && (/\.\d{3,}/.test(phone) || /^\d{5,}\s+\d+\.\d+$/.test(phone))) {
    phone = '';
  }

  // Social links extraction
  const socialLinks = extractSocialLinksFromText(cleanedFullText);

  // Location heuristic
  const locationMatch = cleanedFullText.match(/\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|[A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})\b/i);
  const location = locationMatch && isValidLocation(locationMatch[0]) ? locationMatch[0] : '';

  // Name & Headline Extraction
  let fullName = '';
  let headline = '';

  const nameBlacklist = [
    'resume', 'curriculum vitae', 'cv', 'summary', 'experience', 'work experience',
    'education', 'skills', 'projects', 'certifications', 'contact', 'profile',
    'employment', 'technical skills', 'academic background', '%pdf', 'pdf',
    'python', 'java', 'flask', 'kafka', 'aws', 'sql', 'microservices', 'pyspark',
    'react', 'node', 'docker', 'c++', 'c#', 'javascript', 'typescript', 'new relic',
    'stream', 'endstream', 'obj', 'endobj', 'xref', 'trailer', 'startxref', '>>', '<<',
    'competencies', 'core competencies', 'key competencies'
  ];

  for (let i = 0; i < Math.min(rawLines.length, 8); i++) {
    let line = rawLines[i];
    if (line.startsWith('%PDF') || line.length < 2) continue;

    // Strip emails, phones, URLs, location, social & contact labels
    line = line.replace(/\b(email|e-mail|mail|phone|mobile|tel|cell|location|address|contact|linkedin|github)\s*[:-]?\s*/gi, '');
    line = line.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    line = line.replace(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '');
    line = line.replace(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/g, '');
    line = line.replace(/\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|[A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})\b/gi, '');
    line = line.replace(/\b(Linkedin|Github|Leetcode|Hackerrank|Scaler|Portfolio)\b/gi, '');
    line = line.replace(/^(resume|cv|curriculum vitae)\s*[:-]?\s*/i, '').trim();

    if (!line) continue;

    const parts = line.split(/[-–—|•,]/).map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      const lowerPart = part.toLowerCase();
      if (
        isValidHumanName(part) &&
        !nameBlacklist.some((h) => lowerPart === h || lowerPart.includes(h))
      ) {
        if (!fullName) {
          fullName = part;
        } else if (!headline && part.toLowerCase() !== fullName.toLowerCase()) {
          headline = part;
          break;
        }
      }
    }
    if (fullName && headline) break;
  }

  if (!fullName && email) {
    fullName = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // 3. Segment Text by Resume Section Headers
  const sectionKeywords: { [key: string]: RegExp } = {
    SKILLS: /^([#*=\-\s\d.]*)\b(skills|technical skills|skill matrix|skills & expertise|core competencies|technologies|tech stack|tools & frameworks|programming languages|competencies)\b/i,
    EXPERIENCE: /^([#*=\-\s\d.]*)\b(work experience|experience|employment history|professional experience|career history|work history|employment|career summary|relevant experience|positions held)\b/i,
    PROJECTS: /^([#*=\-\s\d.]*)\b(projects|key projects|personal projects|technical projects|selected projects|portfolio)\b/i,
    EDUCATION: /^([#*=\-\s\d.]*)\b(education|academic background|academic credentials|qualifications|degrees|educational background)\b/i,
    CERTIFICATIONS: /^([#*=\-\s\d.]*)\b(certifications|certificates|licenses & certifications|licenses|accreditations|key courses|courses|key courses \/ certification)\b/i,
    SUMMARY: /^([#*=\-\s\d.]*)\b(summary|profile|professional summary|executive summary|about me|objective|overview)\b/i,
  };

  const sections: { [key: string]: string[] } = {};
  let currentSection = 'HEADER';
  sections[currentSection] = [];

  for (const line of rawLines) {
    const cleanLine = line.replace(/^[#*=\-\s]+/, '').replace(/[:\s]+$/, '').trim();
    let matchedSection = false;

    for (const [secName, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(cleanLine)) {
        currentSection = secName;
        if (!sections[currentSection]) sections[currentSection] = [];
        matchedSection = true;
        break;
      }
    }

    if (!matchedSection) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // Parse Summary
  const summaryLines = sections['SUMMARY'] || [];
  const summary = deepCleanText(summaryLines.join(' '));

  // Parse Skills
  const skillCategories: SkillCategory[] = [];
  const skillLines = sections['SKILLS'] || [];
  if (skillLines.length > 0) {
    const categoryMap: { [catName: string]: string[] } = {};

    const cleanSkillToken = (s: string): string | null => {
      let clean = deepCleanText(s.replace(/^[-•*#]\s*/, '')).trim();
      clean = clean.replace(/^[,\s;:]+|[,\s;:]+$|\.$/g, '').trim();

      if (!clean || clean.length < 2 || clean.length > 40) return null;
      if (clean.split(/\s+/).length > 5) return null;

      const lower = clean.toLowerCase();
      // Filter out orphan conjunctions and noise
      if (/^(and|or|with|the|in|for|of|to|a|an|patches|reports)$/i.test(lower)) return null;

      // Filter out dates, company names, and locations
      if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present|current)/i.test(lower)) return null;
      if (/(tata consultancy|tcs|accenture|cognizant|infosys|wipro|company|limited)/i.test(lower)) return null;
      if (/^(kolkata|bengaluru|bangalore|mumbai|delhi|pune|hyderabad|chennai|india|usa|remote)$/i.test(lower)) return null;

      // Filter out prose bullet verbs
      if (/^(provided|handled|created|configured|implemented|maintained|improved|resolved|worked on|assisted in)\b/i.test(lower)) return null;

      return clean;
    };

    for (const sLine of skillLines) {
      if (sLine.includes(':')) {
        const parts = sLine.split(':');
        const catName = deepCleanText(parts[0].replace(/^[-•*#]\s*/, '')).trim();
        const skills = parts[1]
          .split(/[,|•;\/]/)
          .map(cleanSkillToken)
          .filter((s): s is string => Boolean(s));
        if (skills.length > 0) {
          categoryMap[catName] = (categoryMap[catName] || []).concat(skills);
        }
      } else {
        const skills = sLine
          .split(/[,|•;\/]/)
          .map(cleanSkillToken)
          .filter((s): s is string => Boolean(s));
        if (skills.length > 0) {
          const defaultCat = 'Technical Skills';
          categoryMap[defaultCat] = (categoryMap[defaultCat] || []).concat(skills);
        }
      }
    }

    for (const [catName, skillsList] of Object.entries(categoryMap)) {
      const uniqueSkills = Array.from(new Set(skillsList));
      if (uniqueSkills.length > 0) {
        skillCategories.push({
          category: catName,
          skills: uniqueSkills,
        });
      }
    }
  }

  // Parse Experience
  const experience: WorkExperience[] = [];
  const expLines = sections['EXPERIENCE'] || [];
  if (expLines.length > 0) {
    const actionVerbsRegex = /^(built|developed|deployed|implemented|created|led|managed|designed|optimized|automated|engineered|integrated|spearheaded|maintained|refactored|configured|increased|reduced|improved|achieved|forwarding|improving|enabling|throughput|delivering|orchestrated|collaborated|executed|formulated|scaled|provided)\b/i;

    let currentExp: WorkExperience | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = deepCleanText(expLines[i].trim());
      if (!line) continue;

      const isBulletChar = /^[-•*➢▪–+o\d+\.]/.test(line);
      const cleanContent = line.replace(/^[-•*➢▪–+o\d+\.]\s*/, '');
      const startsWithActionVerb = actionVerbsRegex.test(cleanContent);
      const explicitDateRangeMatch = line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d\d|19\d\d|\d{1,2}\/\d{4})\b\s*[-–—to]+\s*\b(Present|Current|20\d\d|19\d\d|\d{1,2}\/\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);

      const hasJobTitleKeyword = /Senior|Analyst|Developer|Engineer|Manager|Lead|Architect|Consultant|Specialist|Director|Intern|Associate|Officer/i.test(line);

      const isNewJobHeader = !startsWithActionVerb && !isBulletChar && (
        Boolean(explicitDateRangeMatch) ||
        (!currentExp && hasJobTitleKeyword) ||
        (!currentExp && line.length < 70 && !line.includes('.'))
      );

      if (isNewJobHeader) {
        if (currentExp && (currentExp.company || currentExp.position)) {
          experience.push(currentExp);
        }

        let position = line;
        let company = '';
        let startDate = '';
        let endDate = 'Present';

        if (explicitDateRangeMatch) {
          const rawDates = explicitDateRangeMatch[0];
          position = line.replace(rawDates, '').replace(/[-–—|•,]/g, ' ').trim();
          const dateParts = rawDates.split(/[-–—to]/i).map((d) => deepCleanText(d).trim());
          startDate = dateParts[0] || '';
          endDate = dateParts[1] || 'Present';
        }

        if (position.includes(' - ') || position.includes(' | ') || position.includes(' @ ') || position.includes(' at ')) {
          const parts = position.split(/\s+[-|@]|at\s+/i).map((p) => p.trim()).filter(Boolean);
          position = parts[0] || position;
          company = parts[1] || company;
        }

        if (!company && i + 1 < expLines.length) {
          const nextLine = deepCleanText(expLines[i + 1].trim());
          const nextIsBullet = /^[-•*➢▪–+o\d+\.]/.test(nextLine);
          const nextIsAction = actionVerbsRegex.test(nextLine.replace(/^[-•*➢▪–+o\d+\.]\s*/, ''));
          const nextHasDates = /\b(20\d\d|19\d\d|Present)\b/i.test(nextLine);

          if (!nextIsBullet && !nextIsAction && !nextHasDates && nextLine.length < 60) {
            company = nextLine;
            i++;
          }
        }

        currentExp = {
          id: `exp-${Date.now()}-${experience.length}`,
          company: company || 'Company',
          position: position || headline || 'Role',
          startDate,
          endDate,
          isCurrent: endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current'),
          highlights: [],
        };
      } else if (currentExp) {
        const bulletText = line.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim();
        if (bulletText) {
          currentExp.highlights.push(bulletText);
        }
      } else {
        currentExp = {
          id: `exp-${Date.now()}-${experience.length}`,
          company: 'Company',
          position: headline || 'Software Engineer',
          startDate: '',
          endDate: 'Present',
          isCurrent: true,
          highlights: [line.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim()],
        };
      }
    }
    if (currentExp && (currentExp.company || currentExp.position)) {
      experience.push(currentExp);
    }
  }

  // Parse Education
  const education: Education[] = [];
  const eduLines = sections['EDUCATION'] || [];
  if (eduLines.length > 0) {
    let currentEdu: Education | null = null;
    for (const line of eduLines) {
      const cleanedLine = deepCleanText(line);
      const isDegreeLine = /\b(Bachelor|Master|B\.S|M\.S|B\.A|Ph\.D|B\.Tech|B\.E|M\.Tech|MCA|BCA|MCA\/BCA|Diploma|Degree|Associate|BS|MS|BA|MA|BE|ME|BBA|MBA)\b/i.test(cleanedLine);
      const isInstLine = /\b(University|College|Institute|School|Academy|Maulana)\b/i.test(cleanedLine);
      const dateMatch = cleanedLine.match(/\b(19\d\d|20\d\d)\b(?:\s*[-–—]\s*\b(19\d\d|20\d\d|Present)\b)?/i);

      if (isInstLine || isDegreeLine) {
        if (currentEdu && isInstLine && currentEdu.institution && !currentEdu.institution.includes(cleanedLine)) {
          education.push(currentEdu);
          currentEdu = null;
        }

        if (!currentEdu) {
          currentEdu = {
            id: `edu-${Date.now()}-${education.length}`,
            institution: isInstLine ? cleanedLine.replace(/\b(19\d\d|20\d\d)\b/g, '').trim() : 'University / Institution',
            degree: isDegreeLine ? cleanedLine : 'Degree',
            fieldOfStudy: '',
            startDate: dateMatch && dateMatch[1] ? dateMatch[1] : '',
            endDate: dateMatch && dateMatch[2] ? dateMatch[2] : (dateMatch && dateMatch[1] ? dateMatch[1] : ''),
          };
        } else {
          if (isInstLine && currentEdu.institution === 'University / Institution') {
            currentEdu.institution = cleanedLine.replace(/\b(19\d\d|20\d\d)\b/g, '').trim();
          } else if (isDegreeLine) {
            currentEdu.degree = cleanedLine;
          }
          if (dateMatch) {
            currentEdu.endDate = dateMatch[2] || dateMatch[1] || currentEdu.endDate;
          }
        }
      } else if (currentEdu) {
        const cleanExtra = cleanedLine.replace(/^[-•*]\s*/, '').trim();
        if (cleanExtra) {
          if (!currentEdu.fieldOfStudy && /computer|science|engineering|business|arts|mathematics|data|MCA|BCA/i.test(cleanExtra)) {
            currentEdu.fieldOfStudy = cleanExtra;
          }
        }
      }
    }
    if (currentEdu) education.push(currentEdu);
  }

  // Parse Projects
  const projects: Project[] = [];
  const projLines = sections['PROJECTS'] || [];
  if (projLines.length > 0) {
    let currentProj: Project | null = null;
    for (const line of projLines) {
      const cleanedLine = deepCleanText(line);
      if (!cleanedLine) continue;

      const isBullet = /^[-•*➢▪–+o\d+\.]/.test(cleanedLine.trim());
      const isUrl = /^(?:https?:\/\/|www\.)[^\s]+/i.test(cleanedLine.trim()) || cleanedLine.trim().includes('github.com/');

      if (isUrl) {
        if (currentProj) {
          currentProj.link = cleanedLine.trim();
        }
      } else if (currentProj && (isBullet || /^(built|designed|integrated|improved|created|led|developed|using|context-aware|automating)\b/i.test(cleanedLine.trim()) || /^[a-z]/.test(cleanedLine.trim()))) {
        const bulletText = cleanedLine.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim();
        if (bulletText) currentProj.highlights.push(bulletText);
      } else if (cleanedLine.length < 90 && !isUrl) {
        if (currentProj && (currentProj.title || currentProj.highlights.length > 0)) {
          projects.push(currentProj);
        }
        currentProj = {
          id: `proj-${Date.now()}-${projects.length}`,
          title: cleanedLine,
          highlights: [],
        };
      } else if (currentProj) {
        const bulletText = cleanedLine.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim();
        if (bulletText) currentProj.highlights.push(bulletText);
      }
    }
    if (currentProj && (currentProj.title || currentProj.highlights.length > 0)) {
      projects.push(currentProj);
    }
  }

  // Parse Certifications
  const certifications: Certification[] = [];
  const certLines = sections['CERTIFICATIONS'] || [];
  for (let i = 0; i < certLines.length; i++) {
    const cLine = certLines[i];
    const cleanCert = deepCleanText(cLine.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim());
    if (
      cleanCert &&
      !cleanCert.startsWith('http://') &&
      !cleanCert.startsWith('https://') &&
      !cleanCert.includes('linkedin.com') &&
      !cleanCert.includes('github.com') &&
      !cleanCert.includes('leetcode.com') &&
      !cleanCert.includes('hackerrank.com') &&
      !cleanCert.includes('scaler.com')
    ) {
      certifications.push(parseCertificationEntry(cleanCert, i));
    }
  }

  return normalizeResumeData({
    personalInfo: {
      fullName: fullName || 'Candidate Name',
      headline: headline || 'Lead Engineer',
      email,
      phone,
      location,
      linkedin: socialLinks.linkedin,
      github: socialLinks.github,
      leetcode: socialLinks.leetcode,
      hackerrank: socialLinks.hackerrank,
      scaler: socialLinks.scaler,
      portfolio: socialLinks.portfolio,
    },
    summary,
    experience,
    education,
    projects,
    skillCategories,
    certifications,
  }, text);
}

function normalizeResumeData(data: Partial<ResumeData>, rawDocumentText: string = ''): ResumeData {
  const normalized: ResumeData = {
    personalInfo: {
      fullName: data.personalInfo?.fullName || 'Candidate Name',
      headline: data.personalInfo?.headline || 'Lead Engineer',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || '',
      location: data.personalInfo?.location || '',
      linkedin: data.personalInfo?.linkedin || '',
      github: data.personalInfo?.github || '',
      leetcode: data.personalInfo?.leetcode || '',
      hackerrank: data.personalInfo?.hackerrank || '',
      scaler: data.personalInfo?.scaler || '',
      portfolio: data.personalInfo?.portfolio || '',
      customLinks: data.personalInfo?.customLinks || [],
    },
    summary: data.summary || '',
    experience: data.experience || [],
    education: data.education || [],
    projects: data.projects || [],
    skillCategories: data.skillCategories || [],
    certifications: data.certifications || [],
  };

  return sanitizeAndFixResumeData(normalized, rawDocumentText);
}
