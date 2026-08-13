# Codebase Knowledge Graph Audit Report

## 📊 Summary
- **Total Nodes**: 55
- **Total Edges**: 53
- **Architectural Communities**: 9 Domain Clusters

## 🏛 Key God Nodes
1. `src/App.tsx`: Central React Router and state orchestrator.
2. `server.ts`: Express API server hosting Gemini AI routes.
3. `src/types/index.ts`: Barrel export of all application domain interfaces.

## 🕸 Domain Communities
- **Community 0**: Application Core (`App.tsx`, `main.tsx`)
- **Community 1**: Server & API Layer (`server/`, `server.ts`, `gemini.ts`, `ats.service.ts`)
- **Community 2**: ATS Scanner Domain (`ScannerStep`, `ATSScoreCard`, `ResumeHealthSection`, `ResumeRadarChart`)
- **Community 3**: Resume Editor Domain (`ResumeEditor`, `ResumePreview`, `ResumeVersionManager`)
- **Community 4**: Career Guidance Domain (`CareerPulse`, `FDETransitionPath`, `SkillsLearningRoadmap`)
- **Community 5**: HR Simulation Domain (`HRPersonaSimulator`, `SeniorYoEAndImpactDeepDive`)
- **Community 6**: Interview Prep Domain (`InterviewPrep`, `RoleFlashcardsSection`)
- **Community 7**: Shared UI & Modals (`Header`, `ExportToolbar`, `BulletRewriteModal`, etc.)
- **Community 8**: Type Definitions (`src/types/`)

## 💡 Architectural Verification
All modules are decoupled according to standard senior architect patterns.
