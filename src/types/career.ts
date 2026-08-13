export interface SkillLearningItem {
  skillName: string;
  priority: 'high' | 'medium' | 'low';
  whyLearn: string;
  estimatedTime?: string;
  actionStep?: string;
}

export interface SuitableRole {
  roleTitle: string;
  matchPercentage: number;
  whySuited: string;
  keySkillMatches: string[];
}

export interface FutureProofRecommendation {
  domain: string;
  marketDemand: 'Ultra High' | 'High' | 'Growing';
  salaryTier: string;
  description: string;
  learningPath: string;
}

export interface InDemandSkillItem {
  name: string;
  category: 'AI & Machine Learning' | 'Cloud & Systems' | 'Client-Facing & Solutions' | 'Data & Integration' | 'Security & DevOps';
  growthTrend: string;
  demandLevel: 'Critical' | 'High' | 'Growing';
  description: string;
}

export interface EmergingTrendItem {
  title: string;
  category: string;
  description: string;
  industryImpact: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface CareerPulseData {
  targetRole: string;
  lastUpdated: string;
  searchQueryUsed: string;
  summaryOverview: string;
  inDemandSkills: InDemandSkillItem[];
  emergingTrends: EmergingTrendItem[];
  topHiringSectors: string[];
  salaryMomentum: string;
  recommendedActionItems: string[];
  groundingSources: GroundingSource[];
}

export interface CareerCompetencyGap {
  title: string;
  description: string;
  impactLevel: 'Critical' | 'High' | 'Medium';
  remedy: string;
}

export interface RecommendedCertification {
  id: string;
  title: string;
  issuer: string;
  estimatedTimeToComplete: string;
  relevanceScore: number;
  whyRecommended: string;
  prerequisites?: string;
}

export interface RecommendedProjectBlueprint {
  id: string;
  title: string;
  category: string;
  estimatedTime: string;
  techStack: string[];
  description: string;
  keyBulletPointsToAdd: string[];
}

export interface QuarterlyRoadmapMilestone {
  quarter: string;
  focusArea: string;
  milestones: string[];
  targetOutcome: string;
}

export interface CareerGapAnalysisData {
  targetRole: string;
  readinessScore: number;
  matchSummary: string;
  keyGaps: CareerCompetencyGap[];
  recommendedCertifications: RecommendedCertification[];
  recommendedProjects: RecommendedProjectBlueprint[];
  quarterlyRoadmap: QuarterlyRoadmapMilestone[];
}
