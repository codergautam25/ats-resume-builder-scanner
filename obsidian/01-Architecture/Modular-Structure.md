# Modular Architecture Guide

## 🏗 Directory Organization

```
ats-resume-builder-&-scanner/
├── server/                     # Backend Architecture
│   ├── index.ts                # Express app initialization & static Vite dev server setup
│   ├── config/
│   │   └── gemini.ts           # Gemini AI SDK client factory & configuration
│   ├── routes/                 # Express Router modular handlers
│   │   ├── ats.routes.ts       # Scanner, scoring, and keyword fix endpoints
│   │   ├── resume.routes.ts    # Bullet rewriter, metrics, and versioning endpoints
│   │   ├── guidance.routes.ts  # Career pulse, gap analysis, and roadmap endpoints
│   │   └── interview.routes.ts # HR persona simulator & interview flashcards endpoints
│   └── services/               # Gemini AI prompt execution & parsing logic
│       ├── gemini.service.ts
│       ├── ats.service.ts
│       └── resumeParser.service.ts
├── src/                        # Frontend Architecture
│   ├── main.tsx                # Entrypoint
│   ├── App.tsx                 # Core layout & feature tab router
│   ├── types/                  # Domain-split TypeScript interfaces
│   │   ├── index.ts            # Barrel export file
│   │   ├── resume.ts
│   │   ├── ats.ts
│   │   ├── hr.ts
│   │   └── interview.ts
│   ├── components/             # Reusable UI & Modal components
│   │   ├── ui/                 # Header, ExportToolbar, FormatGallery, etc.
│   │   └── modals/             # BulletRewriteModal, MetricSuggestionsModal, etc.
│   └── features/               # Domain-specific Feature Components
│       ├── ats-scanner/        # ScannerStep, ATSScoreCard, ResumeHealth, RadarChart
│       ├── resume-editor/      # ResumeEditor, ResumePreview, VersionManager
│       ├── career-guidance/    # CareerPulse, FDETransitionPath, Roadmap
│       ├── hr-simulation/      # HRPersonaSimulator, SeniorImpact
│       └── interview-prep/     # InterviewPrep, RoleFlashcards
```

Related: [[System-Overview]], [[Feature-Modules]], [[ADR-001-Modular-Architecture]]
