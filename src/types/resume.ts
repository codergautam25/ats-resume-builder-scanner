export interface BulletMetadata {
  privateNote?: string;
  contextTags?: string[];
  isHighlighted?: boolean;
  highlightColor?: 'yellow' | 'blue' | 'purple' | 'emerald' | 'amber';
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  highlights: string[];
  bulletMetadata?: Record<number, BulletMetadata>;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
  technologies?: string[];
  bulletMetadata?: Record<number, BulletMetadata>;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  hackerrank?: string;
  scaler?: string;
  portfolio?: string;
  customLinks?: SocialLink[];
  targetRole?: string;
  targetJobDescription?: string;
}

export interface SideProjectOrAccomplishment {
  id: string;
  title: string;
  category: 'Side Project' | 'Open Source' | 'Community Work' | 'Unlisted Accomplishment' | 'ServiceNow Store App' | 'Personal Lab' | string;
  description: string;
  technologies: string[];
  link?: string;
  impactMetrics?: string;
  domain?: string;
  date?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skillCategories: SkillCategory[];
  certifications: Certification[];
  languages?: string[];
  sideProjectsAndAccomplishments?: SideProjectOrAccomplishment[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  timestamp: string;
  resumeData: ResumeData;
  overallScore?: number;
}

export interface ResumeSnapshot {
  id: string;
  label: string;
  note?: string;
  timestamp: string;
  resumeData: ResumeData;
  score?: number | null;
  targetRole?: string;
}

export type TemplateStyle = 'executive' | 'tech' | 'harvard' | 'corporate' | 'original';

export interface TemplateOptions {
  style: TemplateStyle;
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'sm' | 'md' | 'lg';
  lineSpacing: 'tight' | 'normal' | 'relaxed';
  showIcons: boolean;
}
