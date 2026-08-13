---
date: 2026-08-13
type: architecture
project: ATS-ResumAI
author: Antigravity AI Architect
tags: [obsidian-vault, resumai, architecture]
---
# [[System Overview]] - ATS ResumAI Enterprise Architecture

## Tech Stack Overview

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, Recharts, Motion v12
- **Backend**: Node.js, Express.js (`server.ts` compiled to `dist/server.cjs` via esbuild)
- **Document Processing**: `pdf-parse`, `pdfjs-dist`, `html2canvas`, `jspdf`
- **AI Engines**:
  1. Google Gemini 2.5 Flash (`@google/genai`)
  2. Local Ollama (`http://localhost:11434`)
  3. Local OmniRoute Proxy (`http://localhost:20128/v1`)
  4. Local Humanizer & Regex Pattern Cleaners

## Key System Flows
1. User uploads PDF/DOCX resume or loads sample profile.
2. Parser extracts text, strips binary artifact noise, maps fields (`fullName`, `email`, `experience`, `skills`).
3. ATS Engine scores overall compatibility, missing keywords, and domain radar metrics.
4. 1-Click Fix All Engine normalizes section headers, dates, and metric bullets.
5. Dynamic Career Roadmap renders 3-phase progression, 2026 AI trend predictor, and free study links.
6. Obsidian Vault Sync exports structured markdown logs directly into local Obsidian vaults.

