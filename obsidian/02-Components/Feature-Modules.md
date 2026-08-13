# Feature Modules

The frontend is divided into 5 core feature domain modules under `src/features/`:

## 1. `ats-scanner/`
- `ScannerStep.tsx`: Initial file upload, job description input, and parsing trigger.
- `ATSScoreCard.tsx`: Match score visualization, missing keywords, and section-by-section breakdown.
- `ResumeHealthSection.tsx`: Actionable recommendations for formatting, impact metrics, and clarity.
- `ResumeRadarChart.tsx`: Visual radar chart mapping skill alignment.

## 2. `resume-editor/`
- `ResumeEditor.tsx`: Full interactive resume builder and live form editor.
- `ResumePreview.tsx`: Real-time rendered resume template preview.
- `ResumeVersionManager.tsx`: Snapshot version history, diff viewer, and rollback capabilities.

## 3. `career-guidance/`
- `CareerPulse.tsx`: Industry demand trends and candidate positioning.
- `FDETransitionPath.tsx`: Forward Deployed Engineer transition roadmap.
- `SkillsLearningRoadmap.tsx`: Recommended skills, learning resources, and timelines.
- `CareerGapAnalysisComponent.tsx`: Detection and framing of career gaps.

## 4. `hr-simulation/`
- `HRPersonaSimulator.tsx`: Multi-persona AI feedback (Tech Recruiter, Engineering Manager, Executive).
- `SeniorYoEAndImpactDeepDive.tsx`: Analysis of leadership, ownership, and scope of impact.

## 5. `interview-prep/`
- `InterviewPrep.tsx`: Tailored technical and behavioral interview questions with STAR answers.
- `RoleFlashcardsSection.tsx`: Dynamic flashcards for fast revision before interviews.

Related: [[Shared-UI]], [[Modular-Structure]]
