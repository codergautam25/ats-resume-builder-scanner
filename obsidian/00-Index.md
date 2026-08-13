# ATS Resume Builder & Scanner - Obsidian Knowledge Base

Welcome to the central Obsidian Vault for the **ATS Resume Builder & Scanner** codebase.

## 📌 Architecture & Design Notes
- [[System-Overview]] — High-level architecture, tech stack, and data flows.
- [[Modular-Structure]] — Directory layout, modularization rules, and component patterns.

## 🧩 Component Architecture
- [[Feature-Modules]] — Domain feature modules (`ats-scanner`, `resume-editor`, `career-guidance`, `hr-simulation`, `interview-prep`).
- [[Shared-UI]] — Reusable atomic UI elements and application modal overlays.

## 🔌 API & AI Services
- [[Gemini-AI-Endpoints]] — Express API routes and Google Gemini 2.5/2.0 integration specs.
- [[PDF-Parsing-And-Schema-Mapping]] — Multi-tier PDF parsing, artifact sanitization, and structured field mapping specs.

## 📐 Architectural Decision Records (ADRs)
- [[ADR-001-Modular-Architecture]] — Decision record for modularizing monolithic `server.ts` and `src/components/`.

## 🕸 Knowledge Graph
- Knowledge Graph visualization: `graphify-out/graph.html`
- Knowledge Graph report: `graphify-out/GRAPH_REPORT.md`
