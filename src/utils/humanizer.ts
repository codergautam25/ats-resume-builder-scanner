import humanizeString from 'humanize-string';
import humanizeDuration from 'humanize-duration';
import { ResumeData, WorkExperience, Project, Education, SkillCategory, Certification } from '../types';

/**
 * Humanizer Utility Engine
 * Removes AI writing patterns, corporate buzzwords, robotic phrasing,
 * em-dashes, superficial -ing tails, and filler words based on Wikipedia's "Signs of AI writing" guidelines.
 */

// ── 1. AI Buzzwords & Inflated Terminology Dictionary ───────────────────────
const AI_BUZZWORD_REPLACEMENTS: [RegExp, string][] = [
  // High-frequency AI inflated words
  [/\btestament to\b/gi, 'proof of'],
  [/\bstands as a?\b/gi, 'is'],
  [/\bserves as a?\b/gi, 'is'],
  [/\bpivotal role\b/gi, 'key role'],
  [/\bveritable tapestry\b/gi, 'combination'],
  [/\btapestry of\b/gi, 'range of'],
  [/\blandscape of\b/gi, 'field of'],
  [/\bevolving landscape\b/gi, 'changing market'],
  [/\bdelve into\b/gi, 'explore'],
  [/\bdelve deep into\b/gi, 'examine'],
  [/\bfostering an environment\b/gi, 'building a team'],
  [/\bfostering\b/gi, 'encouraging'],
  [/\bgarnered\b/gi, 'earned'],
  [/\bunderscores the importance of\b/gi, 'shows'],
  [/\bunderscores\b/gi, 'highlights'],
  [/\bseamlessly integrate[sd]?\b/gi, 'integrate'],
  [/\bseamless integration\b/gi, 'integration'],
  [/\bgame-changer\b/gi, 'major improvement'],
  [/\bgroundbreaking\b/gi, 'new'],
  [/\bparadigm shift\b/gi, 'change'],
  [/\bsynergistic\b/gi, 'combined'],
  [/\bsynergy\b/gi, 'cooperation'],
  [/\bempower(ing|s|ed)?\b/gi, 'enable'],
  [/\bleverag(ing|e|es|ed)\b/gi, 'using'],
  [/\butiliz(ing|e|es|ed)\b/gi, 'using'],
  [/\bholistic approach\b/gi, 'complete approach'],
  [/\brobust solution\b/gi, 'reliable system'],
  [/\bcutting-edge\b/gi, 'modern'],
  [/\bstate-of-the-art\b/gi, 'modern'],
  [/\bnext-generation\b/gi, 'modern'],
  [/\bvalue-added\b/gi, 'helpful'],
  [/\bthought leader\b/gi, 'expert'],
  [/\bthought leadership\b/gi, 'expertise'],
  [/\bmission-critical\b/gi, 'critical'],
  [/\bbeacon of\b/gi, 'example of'],
  [/\bnestled in\b/gi, 'located in'],
  [/\brich history\b/gi, 'history'],
  [/\bvibrant community\b/gi, 'community'],
  [/\bindelible mark\b/gi, 'lasting impact'],
];

// ── 2. AI Filler Phrases & Hedging ──────────────────────────────────────────
const AI_FILLER_REPLACEMENTS: [RegExp, string][] = [
  [/\bin order to achieve\b/gi, 'to achieve'],
  [/\bin order to\b/gi, 'to'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bin the event that\b/gi, 'if'],
  [/\bhas the ability to\b/gi, 'can'],
  [/\bit is important to note that\b/gi, ''],
  [/\bit should be noted that\b/gi, ''],
  [/\bneedless to say\b/gi, ''],
  [/\bit goes without saying that\b/gi, ''],
  [/\bfor all intents and purposes\b/gi, ''],
  [/\bwith that being said\b/gi, 'however,'],
  [/\bat the end of the day\b/gi, 'ultimately,'],
  [/\bin today's fast-paced world\b/gi, 'today'],
  [/\bin the modern digital era\b/gi, 'today'],
];

// ── 3. Conversational AI Chatbot Openers / Closers ──────────────────────────
const AI_CHATBOT_ARTIFACTS: RegExp[] = [
  /^here is an? (overview|summary|breakdown|analysis).*\n?/gi,
  /^certainly!.*\n?/gi,
  /^of course!.*\n?/gi,
  /^i hope this helps!.*\n?/gi,
  /^let me know if you would like me to.*\n?/gi,
  /^would you like me to.*\n?/gi,
  /^sure! here is.*\n?/gi,
  /i hope this helps!/gi,
  /let me know if you need any adjustments/gi,
];

/**
 * Humanizes any raw string by removing AI tells, em dashes, filler words, and corporate jargon.
 */
export function humanizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let t = text;

  // 1. Remove Chatbot conversational artifacts
  for (const pattern of AI_CHATBOT_ARTIFACTS) {
    t = t.replace(pattern, '');
  }

  // 2. Convert curly quotes & apostrophes to straight quotes
  t = t.replace(/[“”]/g, '"');
  t = t.replace(/[‘’]/g, "'");

  // 3. Remove Em Dashes (—) and En Dashes (–) — replace with commas, colons, or clean spaces
  t = t.replace(/\s*[—–]\s*/g, ', ');
  t = t.replace(/--+/g, ', ');

  // 4. Remove decorative emojis from bullet points and titles
  t = t.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 5. Replace AI Buzzwords
  for (const [pattern, replacement] of AI_BUZZWORD_REPLACEMENTS) {
    t = t.replace(pattern, replacement);
  }

  // 6. Replace AI Filler Phrases
  for (const [pattern, replacement] of AI_FILLER_REPLACEMENTS) {
    t = t.replace(pattern, replacement);
  }

  // 7. Fix superficial -ing participle tails (e.g., ", ensuring maximum efficiency")
  t = t.replace(/,\s*(ensuring|reflecting|symbolizing|contributing to|fostering|cultivating|showcasing|underscoring)\s+([^.,;]+)/gi, (match, verb, rest) => {
    return `. This ${verb.replace(/ing$/, 'es')} ${rest}`;
  });

  // 8. Fix excessive inline bolding clutter e.g. **OKRs** -> OKRs
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1');

  // 9. Clean up multiple spaces & double commas
  t = t.replace(/,\s*,+/g, ',');
  t = t.replace(/\.\s*\./g, '.');
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/\n\s*\n+/g, '\n\n');

  return t.trim();
}

/**
 * Humanizes an isolated bullet point to sound punchy, active, and human-written.
 */
export function humanizeBulletPoint(bullet: string): string {
  if (!bullet) return '';

  let clean = humanizeText(bullet);

  // Remove leading bullet symbols / numbers
  clean = clean.replace(/^[-•*➢▪–+o\d+\.]\s*/, '').trim();

  // Ensure active past-tense verb at start if starting with passive phrasing
  clean = clean.replace(/^was responsible for\s+/i, 'Managed ');
  clean = clean.replace(/^worked on\s+/i, 'Built ');
  clean = clean.replace(/^helped with\s+/i, 'Supported ');
  clean = clean.replace(/^assisted in\s+/i, 'Executed ');
  clean = clean.replace(/^involved in\s+/i, 'Led ');

  // Capitalize first letter
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Ensure clean ending punctuation
  clean = clean.replace(/[\s,;:-]+$/, '');
  if (clean.length > 0 && !clean.endsWith('.') && !clean.endsWith('!') && !clean.endsWith('%')) {
    clean += '.';
  }

  return clean;
}

/**
 * Humanizes camelCase / snake_case identifiers into human-readable label strings.
 * e.g., "personalInfo" -> "Personal Info", "fdeRoleComparison" -> "FDE Role Comparison"
 */
export function humanizeIdentifier(identifier: string): string {
  if (!identifier) return '';
  return humanizeString(identifier);
}

/**
 * Humanizes a millisecond or second duration into human-readable text.
 * e.g., 3600000 -> "1 hour"
 */
export function humanizeDurationFormatted(milliseconds: number): string {
  return humanizeDuration(milliseconds, { largest: 2, round: true });
}

/**
 * Humanizes an entire ResumeData object end-to-end:
 * Humanizes summary, work highlights, project highlights, headlines, and certification names.
 */
export function humanizeResumeData(data: ResumeData): ResumeData {
  if (!data) return data;

  const clone: ResumeData = JSON.parse(JSON.stringify(data));

  // 1. Humanize Personal Info & Headline
  if (clone.personalInfo) {
    if (clone.personalInfo.headline) {
      clone.personalInfo.headline = humanizeText(clone.personalInfo.headline);
    }
  }

  // 2. Humanize Summary
  if (clone.summary) {
    clone.summary = humanizeText(clone.summary);
  }

  // 3. Humanize Work Experience
  if (clone.experience && Array.isArray(clone.experience)) {
    clone.experience = clone.experience.map((exp: WorkExperience) => ({
      ...exp,
      position: humanizeText(exp.position || ''),
      company: humanizeText(exp.company || ''),
      highlights: (exp.highlights || []).map(humanizeBulletPoint).filter(Boolean),
    }));
  }

  // 4. Humanize Projects
  if (clone.projects && Array.isArray(clone.projects)) {
    clone.projects = clone.projects.map((proj: Project) => ({
      ...proj,
      title: humanizeText(proj.title || ''),
      subtitle: proj.subtitle ? humanizeText(proj.subtitle) : '',
      highlights: (proj.highlights || []).map(humanizeBulletPoint).filter(Boolean),
    }));
  }

  // 5. Humanize Skill Categories
  if (clone.skillCategories && Array.isArray(clone.skillCategories)) {
    clone.skillCategories = clone.skillCategories.map((cat: SkillCategory) => ({
      ...cat,
      category: humanizeIdentifier(cat.category || 'Skills'),
      skills: (cat.skills || []).map((s) => humanizeText(s)).filter(Boolean),
    }));
  }

  // 6. Humanize Certifications
  if (clone.certifications && Array.isArray(clone.certifications)) {
    clone.certifications = clone.certifications.map((cert: Certification) => ({
      ...cert,
      name: humanizeText(cert.name || ''),
      issuer: humanizeText(cert.issuer || ''),
    }));
  }

  return clone;
}
