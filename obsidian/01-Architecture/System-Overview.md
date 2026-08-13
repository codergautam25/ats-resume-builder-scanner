# System Overview

## 🎯 Purpose
The **ATS Resume Builder & Scanner** is an AI-powered resume analysis, optimization, and career guidance platform. It scans resumes against job descriptions, calculates ATS match scores, generates bullet point rewrites, simulates HR recruiter feedback, and offers interview preparation flashcards and career progression roadmaps.

## 🛠 Technology Stack
- **Frontend Core**: React 19, TypeScript 5.8, Vite 6
- **Styling & Motion**: TailwindCSS 4, Motion (Framer Motion), Lucide React Icons, Recharts
- **PDF & Canvas Export**: `html2canvas`, `jspdf`, `pdfjs-dist`, `pdf-parse`
- **Backend Core**: Express 4, Node.js, `tsx` / `esbuild`
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.0 Flash)

## 🔄 Core Data Flow
```
User Resume + Job Description 
       │
       ▼
[Frontend UI] ──(REST API Request)──► [Express Server]
                                           │
                                           ▼
                                    [Gemini AI Engine]
                                           │
                                           ▼
[Frontend Dashboard] ◄──(JSON Response)────┘
  ├── ATS Score & Radar Breakdown
  ├── Resume Bullet AI Rewriter
  ├── HR Persona Feedback
  └── Career Path Roadmap
```

Related: [[Modular-Structure]], [[Gemini-AI-Endpoints]], [[ADR-001-Modular-Architecture]]
