export interface InterviewQuestion {
  id: string;
  category: 'Behavioral' | 'Technical' | 'System Design' | 'Client / Forward Deployed' | 'Role-Fit';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  contextWhyAsked: string;
  starGuide: {
    situationTask: string;
    action: string;
    result: string;
  };
  sampleIdealAnswer: string;
  keyPointsToInclude: string[];
}

export interface InterviewPrepData {
  targetRole: string;
  companyName?: string;
  overallMatchSummary: string;
  questions: InterviewQuestion[];
}

export interface AnswerEvaluationResponse {
  score: number;
  verdict: 'Excellent' | 'Good' | 'Needs Improvement';
  strengths: string[];
  missingElements: string[];
  polishedAnswer: string;
  coachingTip: string;
}

export interface Flashcard {
  id: string;
  category: 'System Design & Architecture' | 'Coding & CS Core' | 'Behavioral & STAR' | 'Cloud & Infrastructure' | 'Domain & Role-Specific';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  answer: string;
  hint?: string;
  tags: string[];
  roleTarget?: string;
}

export interface FlashcardSet {
  targetRole: string;
  lastGenerated?: string;
  cards: Flashcard[];
}
