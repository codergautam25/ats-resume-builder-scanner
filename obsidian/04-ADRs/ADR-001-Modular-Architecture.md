# ADR-001: Modular Architecture & Directory Reorganization

- **Status**: Approved & Implemented
- **Date**: 2026-08-09
- **Author**: Senior Architect

## 💡 Context
The codebase initially suffered from architectural monoliths:
1. `server.ts` was an 85KB monolithic file containing route handling, Gemini API prompts, PDF parsing, text sanitization, and server setup.
2. `src/components/` stored 32 UI components flatly without distinguishing domain feature components from atomic shared UI elements.
3. `src/types.ts` contained 10KB of unorganized TypeScript interfaces.

## 🎯 Decision
We decided to enforce a clean 3-tier modular architecture:
1. **Server Layer (`server/`)**: Express setup in `server/index.ts`, Gemini configuration in `server/config/gemini.ts`, API routes in `server/routes/`, and services in `server/services/`.
2. **Feature Domain Layer (`src/features/`)**: Partition frontend components into 5 domain modules (`ats-scanner`, `resume-editor`, `career-guidance`, `hr-simulation`, `interview-prep`).
3. **Atomic Shared UI Layer (`src/components/`)**: Retain reusable UI controls (`ui/`) and global modals (`modals/`).
4. **Partitioned Types (`src/types/`)**: Split interfaces by domain and export via barrel `index.ts`.
5. **Obsidian Vault & Graphify**: Maintain cross-linked markdown notes under `obsidian/` and generate AST knowledge graph via `graphify`.

## 🚀 Consequences
- Significantly improved maintainability, code searchability, and testability.
- Clear ownership of AI prompts, services, and route handlers.
- Preserved 100% backward compatibility of external endpoints and UI behavior.
