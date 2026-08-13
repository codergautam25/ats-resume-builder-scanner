import { SuitableRole, FutureProofRecommendation, SkillLearningItem } from './career';

export interface ClarificationQuestion {
  id: string;
  section: 'skills' | 'experience' | 'projects' | 'summary' | 'general';
  targetItemTitle?: string;
  question: string;
  context: string;
  suggestedAnswerOptions?: string[];
  userAnswer?: string;
}

export interface SalaryInsights {
  estimatedBaseRange: string;
  totalCompRange: string;
  equityAndBonus: string;
  perks: string[];
  topPayingMarkets: string[];
  negotiationLeverage: string;
}

export interface FDERoleComparison {
  fdeFitScore: number;
  fdeSalaryRange: string;
  clientFacingGaps: string[];
  missingFDETech: string[];
  recommendedAdditionsToResume: string[];
  roleComparisons: {
    roleName: string;
    fitPercentage: number;
    salaryBenchmark: string;
    keyPrerequisiteToHighlight: string;
  }[];
}

export interface HealthCheckFixOption {
  optionTitle: string;
  description: string;
  suggestedText?: string;
}

export interface HealthCheckItem {
  type: 'buzzwords' | 'contact' | 'formatting' | 'metrics' | 'structure';
  status: 'passed' | 'warning' | 'critical';
  title: string;
  issueCount?: number;
  details: string;
  actionTask: string;
  affectedItems?: string[];
  fixOptions?: HealthCheckFixOption[];
  isFixed?: boolean;
}

export interface ResumeHealth {
  healthScore: number;
  passedChecksCount: number;
  totalChecksCount: number;
  checks: HealthCheckItem[];
}

export interface CareerGuidance {
  suitableRoles: SuitableRole[];
  futureProofStrategies: FutureProofRecommendation[];
  nextSteps: string[];
}

export interface ATSAnalysis {
  overallScore: number;
  scoreBreakdown: {
    impactMetricsScore: number;
    keywordMatchScore: number;
    actionVerbsScore: number;
    formattingReadabilityScore: number;
    sectionCompletenessScore: number;
  };
  keyStrengths: string[];
  criticalIssues: string[];
  missingKeywords: string[];
  foundKeywords: string[];
  dismissedKeywords?: string[];
  skillLearningRoadmap?: SkillLearningItem[];
  careerGuidance?: CareerGuidance;
  resumeHealth?: ResumeHealth;
  salaryInsights?: SalaryInsights;
  fdeRoleComparison?: FDERoleComparison;
  actionableRecommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    suggestedFix?: string;
    isApplied?: boolean;
  }[];
  clarificationQuestions?: ClarificationQuestion[];
}

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  promptText: string;
  actionType: 'analysis' | 'jd_match' | 'work_ingestion' | 'clarification' | 'manual_edit';
}
