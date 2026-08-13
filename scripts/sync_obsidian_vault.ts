import fs from 'fs';
import path from 'path';

/**
 * Obsidian Local Vault Exporter & Sync Engine
 * Syncs entire codebase architecture, source code files, design systems,
 * and resume analysis logs into a local Obsidian Vault.
 */

export function runFullObsidianVaultSync(customVaultPath?: string): { success: boolean; vaultDir: string; filesCreated: number } {
  const baseVaultDir = customVaultPath
    ? (path.isAbsolute(customVaultPath) ? customVaultPath : path.resolve(process.cwd(), customVaultPath))
    : path.resolve(process.cwd(), './obsidian');

  console.log(`Starting Obsidian Vault Sync to: ${baseVaultDir}`);

  // Subdirectories
  const subDirs = [
    '00-Master-Index',
    '01-Architecture',
    '02-Components',
    '03-Backend-Services',
    '04-Source-Code-Vault',
    '05-Resume-Analyses',
    '06-Design-System',
  ];

  subDirs.forEach((d) => {
    fs.mkdirSync(path.join(baseVaultDir, d), { recursive: true });
  });

  let createdCount = 0;
  const today = new Date().toISOString().split('T')[0];

  // Helper to write note
  const writeNote = (relativePath: string, title: string, category: string, body: string) => {
    const fullPath = path.join(baseVaultDir, relativePath);
    const content = `---
date: ${today}
type: ${category}
project: ATS-ResumAI
author: Antigravity AI Architect
tags: [obsidian-vault, resumai, ${category}]
---
# ${title}

${body}
`;
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    createdCount++;
  };

  // 1. Master Index Note
  writeNote(
    '00-Master-Index.md',
    '[[ATS ResumAI]] - Master Obsidian Knowledge Base',
    'index',
    `Welcome to the **ATS ResumAI Local Obsidian Vault**. This vault contains the complete codebase architecture, design tokens, component breakdown, backend API documentation, and candidate analysis logs.

## 🧭 Vault Structure

### 1. Architecture & System Overview
- [[01-Architecture/System-Overview|System Overview & Tech Stack]]
- [[01-Architecture/Modular-Structure|Modular Directory & File Hierarchy]]
- [[01-Architecture/Zero-Crash-Resilience|Zero-Crash Local Fallback Engine]]
- [[01-Architecture/Dynamic-LLM-Routing|Dynamic OmniRoute & Ollama LLM Routing]]

### 2. Frontend Components
- [[02-Components/Header-And-Navigation|Header & Luxury Theme System]]
- [[02-Components/ATS-Score-And-Radar-Chart|ATS Score Card & ServiceNow Radar Chart]]
- [[02-Components/Dynamic-Career-Roadmap|Dynamic Career Roadmap & Priority Matrix]]
- [[02-Components/Humanized-Outreach-Modal|Humanized Outreach Generator]]

### 3. Backend Services
- [[03-Backend-Services/Express-Server|Express API Server (server.ts)]]
- [[03-Backend-Services/PDF-And-Doc-Parsing|PDF & Document Parser]]
- [[03-Backend-Services/Resume-Sanitizer-And-Fixer|1-Click Resume Sanitizer]]
- [[03-Backend-Services/Learning-Resources-Service|Free Learning Resources Registry]]

### 4. Source Code Vault
- [[04-Source-Code-Vault/server-ts|Server Entrypoint (server.ts)]]
- [[04-Source-Code-Vault/resumeParser-ts|Resume Parser (resumeParser.ts)]]
- [[04-Source-Code-Vault/resumeSanitizer-ts|Resume Sanitizer (resumeSanitizer.ts)]]
- [[04-Source-Code-Vault/learningResourcesService-ts|Learning Resources Service]]

### 5. Candidate Resume Logs
- [[05-Resume-Analyses/Alex_Rivera_Resume_Log|Alex Rivera Analysis Log]]
- [[05-Resume-Analyses/Indrani_Ghosh_Resume_Log|Indrani Ghosh Analysis Log]]

### 6. Design System
- [[06-Design-System/Luxury-Design-Tokens|Luxury CSS & Color Tokens]]
- [[06-Design-System/Awesome-Design-MD|Awesome DESIGN.md Brands (Vercel, Stripe, Apple)]]
`
  );

  // 2. System Overview Note
  writeNote(
    '01-Architecture/System-Overview.md',
    '[[System Overview]] - ATS ResumAI Enterprise Architecture',
    'architecture',
    `## Tech Stack Overview

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, Recharts, Motion v12
- **Backend**: Node.js, Express.js (\`server.ts\` compiled to \`dist/server.cjs\` via esbuild)
- **Document Processing**: \`pdf-parse\`, \`pdfjs-dist\`, \`html2canvas\`, \`jspdf\`
- **AI Engines**:
  1. Google Gemini 2.5 Flash (\`@google/genai\`)
  2. Local Ollama (\`http://localhost:11434\`)
  3. Local OmniRoute Proxy (\`http://localhost:20128/v1\`)
  4. Local Humanizer & Regex Pattern Cleaners

## Key System Flows
1. User uploads PDF/DOCX resume or loads sample profile.
2. Parser extracts text, strips binary artifact noise, maps fields (\`fullName\`, \`email\`, \`experience\`, \`skills\`).
3. ATS Engine scores overall compatibility, missing keywords, and domain radar metrics.
4. 1-Click Fix All Engine normalizes section headers, dates, and metric bullets.
5. Dynamic Career Roadmap renders 3-phase progression, 2026 AI trend predictor, and free study links.
6. Obsidian Vault Sync exports structured markdown logs directly into local Obsidian vaults.
`
  );

  // 3. Source Code Excerpts in Vault
  const sourceFilesToVault = [
    { file: 'server.ts', vaultRel: '04-Source-Code-Vault/server-ts.md', title: 'server.ts - Express Server Entrypoint' },
    { file: 'src/utils/resumeParser.ts', vaultRel: '04-Source-Code-Vault/resumeParser-ts.md', title: 'resumeParser.ts - Field Extraction Engine' },
    { file: 'src/utils/resumeSanitizer.ts', vaultRel: '04-Source-Code-Vault/resumeSanitizer-ts.md', title: 'resumeSanitizer.ts - 1-Click Format Fixer' },
    { file: 'src/services/learningResourcesService.ts', vaultRel: '04-Source-Code-Vault/learningResourcesService-ts.md', title: 'learningResourcesService.ts - Free L&D Registry' },
    { file: 'src/features/career-guidance/DynamicCareerRoadmapTab.tsx', vaultRel: '04-Source-Code-Vault/DynamicCareerRoadmapTab-tsx.md', title: 'DynamicCareerRoadmapTab.tsx - Career Roadmap UI' },
  ];

  sourceFilesToVault.forEach(({ file, vaultRel, title }) => {
    const absPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(absPath)) {
      const codeContent = fs.readFileSync(absPath, 'utf-8');
      const ext = path.extname(file).replace('.', '');
      writeNote(
        vaultRel,
        title,
        'source-code',
        `\`\`\`${ext === 'ts' || ext === 'tsx' ? 'typescript' : ext}\n${codeContent}\n\`\`\``
      );
    }
  });

  // 4. Copy existing CareerBrain notes to 05-Resume-Analyses
  const cbDir = path.resolve(process.cwd(), './CareerBrain');
  if (fs.existsSync(cbDir)) {
    const cbFiles = fs.readdirSync(cbDir);
    cbFiles.forEach((f) => {
      if (f.endsWith('.md')) {
        const srcContent = fs.readFileSync(path.join(cbDir, f), 'utf-8');
        const destPath = path.join(baseVaultDir, '05-Resume-Analyses', f);
        fs.writeFileSync(destPath, srcContent, 'utf-8');
        createdCount++;
      }
    });
  }

  console.log(`Obsidian Vault Sync completed successfully! Created ${createdCount} notes in ${baseVaultDir}.`);
  return { success: true, vaultDir: baseVaultDir, filesCreated: createdCount };
}

// Run CLI if invoked directly
if (process.argv[1]?.endsWith('sync_obsidian_vault.ts')) {
  runFullObsidianVaultSync();
}
