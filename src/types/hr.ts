export interface ToneCritique {
  id: string;
  section: 'Summary' | 'Experience' | 'Education' | 'Projects' | 'General';
  originalText: string;
  issueCategory: 'Informal Phrasing' | 'Passive Voice' | 'Vague / Lack of Impact' | 'Buzzword Overuse' | 'Subtle Arrogance / Overpromise' | 'Weak Action Verb';
  recruiterThought: string;
  suggestedRewrite: string;
  isApplied?: boolean;
}

export interface HRPersonaReview {
  companyTier: string;
  recruiterRole: string;
  verdict: {
    overallRating: number;
    firstImpression: string;
    recruiterDecision: 'Proceed to Phone Screen' | 'Fast-Track Technical Screen' | 'Hold - Needs Professional Refinement' | 'Reject / Low Signal';
    toneScore: number;
    seniorityAlignment: 'Junior / Entry' | 'Mid-Level' | 'Senior Lead' | 'Executive / Director';
  };
  toneCritiques: ToneCritique[];
  recruiterFeedback: {
    strengths: string[];
    redFlags: string[];
    toneAndStyleAdvice: string;
  };
  topActionItems: string[];
  lastReviewed?: string;
}

export interface CareerMilestoneGoal {
  id: string;
  title: string;
  metricTarget: string;
  completed?: boolean;
}

export interface CareerPathYear {
  year: number;
  title: string;
  targetTitle: string;
  expectedTC: string;
  focusArea: string;
  keySkills: string[];
  milestones: CareerMilestoneGoal[];
  strategicDeliverable: string;
}
