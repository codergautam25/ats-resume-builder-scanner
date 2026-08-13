# ATS Resume AI - Resume Builder & Scanner

AI-powered ATS scanner, resume editor, career-gap analyst, and HR persona simulator.
Built with React 19, Express, Google Gemini AI, Tailwind CSS, Recharts, Apple Design Principles.

## Table of Contents

1. Features
2. Quick Start - Local Dev
3. Environment Variables
4. Docker - Single Container
5. Docker Compose - Recommended
6. Production Build and Run without Docker
7. API Reference
8. Running E2E Tests
9. Project Structure
10. Troubleshooting

## Features

- Upload & Scan: Parse PDF/text resumes and extract structured data
- ATS Score & Gaps: Full ATS audit with score breakdown, radar chart, and keyword gap analysis
- Resume Editor: In-browser WYSIWYG editor with 1-click format fix and AI rewrites
- Live Preview: Real-time PDF-ready resume preview with PDF export
- Career Pulse: AI-powered market demand, salary benchmarks, and role trends
- Interview Prep: Role-tailored interview questions with STAR-guide answers
- HR Persona Simulator: Fortune 500 recruiter simulation with tone critique
- Domain Scope & Strength: Post-upload Core Strength vs Growth Scope visual analysis

## Quick Start - Local Dev

### Prerequisites

- Node.js >= 20.x (tested on v24.13.0)
- npm >= 10.x
- Gemini API Key from https://aistudio.google.com/app/apikey

### 1. Install

    git clone https://github.com/your-org/ats-resume-builder.git
    cd ats-resume-builder
    npm install

### 2. Configure Environment

    cp .env.example .env
    # Edit .env and set GEMINI_API_KEY=your_key_here

### 3. Run in Dev Mode

    npm run dev

App starts at http://localhost:3000 with HMR.

## Environment Variables

| Variable         | Required | Description                                         |
|------------------|----------|-----------------------------------------------------|
| GEMINI_API_KEY   | Yes      | Google Gemini AI API key                            |
| APP_URL          | No       | Base URL (default: http://localhost:3000)           |
| PORT             | No       | HTTP port (default: 3000)                           |
| NODE_ENV         | No       | development or production                           |

Note: Without GEMINI_API_KEY, all AI endpoints fall back to pre-built local data automatically.

## Docker - Single Container

### Build

    docker build -t ats-resume-ai:latest .

### Run

    docker run -d       --name ats-resume-ai       -p 3000:3000       -e GEMINI_API_KEY=your_api_key_here       -e APP_URL=http://localhost:3000       --restart unless-stopped       ats-resume-ai:latest

### Verify

    docker ps
    docker logs ats-resume-ai -f
    curl http://localhost:3000/api/health

### Stop and Remove

    docker stop ats-resume-ai && docker rm ats-resume-ai

## Docker Compose - Recommended

### 1. Set API key

    cp .env.example .env
    # Edit .env: GEMINI_API_KEY=your_key_here

### 2. Start

    docker compose up -d

### 3. View logs

    docker compose logs -f app

### 4. Rebuild after code changes

    docker compose down && docker compose up -d --build

### 5. Stop

    docker compose down

### 6. Full cleanup including volumes

    docker compose down -v

## Production Build and Run without Docker

    npm install
    npm run build
    GEMINI_API_KEY=your_key node dist/server.cjs
    # or with .env file:
    npm start

This compiles the Vite frontend to dist/assets/ and the Express server to dist/server.cjs.

## API Reference

Base URL: http://localhost:3000/api

| Method | Endpoint                    | Description                          | Key Body Fields                        |
|--------|-----------------------------|--------------------------------------|----------------------------------------|
| GET    | /api/health                 | Health check                         | -                                      |
| POST   | /api/parse-document         | Parse uploaded PDF                   | file (multipart)                       |
| POST   | /api/analyze-resume         | Full ATS analysis                    | rawResumeText, jobDescription          |
| POST   | /api/career-pulse           | Market demand and salary data        | targetRole                             |
| POST   | /api/career-gap-analysis    | Skill gap and career roadmap         | resumeData, targetRole                 |
| POST   | /api/interview-prep         | Interview questions with STAR guides | resumeText, jobDescription, targetRole |
| POST   | /api/evaluate-answer        | Score a candidate interview answer   | question, answer, targetRole           |
| POST   | /api/flashcards             | Generate role-specific flashcards    | targetRole, resumeText                 |
| POST   | /api/hr-persona-review      | Fortune 500 recruiter critique       | resumeData, companyTier, recruiterRole |
| POST   | /api/rewrite-bullet         | AI rewrite a single bullet point     | bullet, context                        |
| POST   | /api/generate-summary       | Executive resume summary             | resumeData, targetRole                 |
| POST   | /api/resolve-doubts         | Answer clarification questions       | question, resumeData                   |

All endpoints return JSON and include graceful fallbacks if the Gemini API is unavailable.

## Running E2E Tests

Requires the server to be running on port 3000 first.

### Install browsers (first time only)

    ./node_modules/.bin/playwright install chromium

### Run all 13 tests

    ./node_modules/.bin/playwright test

### Headed mode (visible browser)

    ./node_modules/.bin/playwright test --headed

### Run a single test

    ./node_modules/.bin/playwright test --grep "analyze-resume"

### View HTML report

    ./node_modules/.bin/playwright show-report test-results/html

Expected result: 13/13 tests passing in about 10 seconds.

## Project Structure

    ats-resume-builder/
    |-- src/
    |   |-- App.tsx                     # Root app with tab routing
    |   |-- index.css                   # Apple Design + Emil Kowalski design system
    |   |-- components/
    |   |   |-- ui/                     # Shared UI (Header, Dashboard, etc.)
    |   |   +-- modals/                 # Modal dialogs
    |   |-- features/
    |   |   |-- ats-scanner/            # ATS Score, Radar Chart, Health Section
    |   |   |-- resume-editor/          # Resume editor sections
    |   |   |-- career-guidance/        # Career Pulse, Gap Analysis
    |   |   |-- hr-simulation/          # HR Persona Simulator
    |   |   +-- interview-prep/         # Interview Q&A, Flashcards
    |   |-- types/                      # TypeScript types (resume, ats, career, hr)
    |   |-- utils/
    |   |   +-- resumeSanitizer.ts      # 1-Click Format Fix logic
    |   +-- data/
    |       +-- sampleResumes.ts        # Built-in sample resumes
    |-- server/
    |   |-- config/gemini.ts            # Gemini client config
    |   +-- services/ats.service.ts     # Domain skill trees
    |-- server.ts                       # Express API server entry point
    |-- tests/e2e.spec.ts               # Playwright E2E tests (13 tests)
    |-- scripts/build_graphify.py       # Codebase knowledge graph builder
    |-- obsidian/                       # Obsidian vault documentation
    |-- .agents/skills/                 # Design engineering skills
    |   |-- emil-design-eng/
    |   |-- animate/
    |   |-- review-animations/
    |   +-- apple-design/
    |-- Dockerfile                      # Multi-stage Docker build
    |-- docker-compose.yml              # Docker Compose config
    |-- .dockerignore
    |-- .env.example                    # Environment variable template
    |-- playwright.config.ts            # Playwright config
    |-- vite.config.ts                  # Vite bundler config
    |-- tsconfig.json
    +-- package.json

## Troubleshooting

### Port 3000 already in use

    lsof -ti:3000 | xargs kill -9

### Gemini API errors

The app works fully without a key using local fallback data. To enable AI features:
1. Get a free key at https://aistudio.google.com/app/apikey
2. Add to .env: GEMINI_API_KEY=your_key
3. Restart the server

### Docker build fails - out of memory

Increase Docker Desktop memory in Settings > Resources > Memory to 4GB or more.

### TypeScript errors

    ./node_modules/.bin/tsc --noEmit

### PDF parsing not working

    npm install

## License

MIT
