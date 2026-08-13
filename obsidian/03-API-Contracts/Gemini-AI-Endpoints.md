# Gemini AI API Contracts & Endpoints

## 🔌 API Routes Overview

All API requests are handled by the Express backend (`server/`) and powered by Google Gemini AI (`@google/genai`).

| Route Path | HTTP Method | Description | Primary AI Model |
| :--- | :--- | :--- | :--- |
| `/api/scan-resume` | POST | Full ATS resume analysis against job description | `gemini-2.5-flash` |
| `/api/rewrite-bullet` | POST | Generates 3 optimized versions of a resume bullet | `gemini-2.5-flash` |
| `/api/suggest-metrics` | POST | Recommends quantifiable metrics for experience items | `gemini-2.5-flash` |
| `/api/hr-simulation` | POST | Simulates recruiter feedback across personas | `gemini-2.5-pro` |
| `/api/interview-prep` | POST | Generates custom STAR interview questions & answers | `gemini-2.5-flash` |
| `/api/career-pulse` | POST | Evaluates role transition readiness & gap analysis | `gemini-2.5-flash` |
| `/api/quick-fix` | POST | Applies automated section fixes to resume JSON | `gemini-2.5-flash` |

## 🔑 Environment Requirements
- `GEMINI_API_KEY`: Required API Key for Google Gemini.

Related: [[System-Overview]], [[Modular-Structure]]
