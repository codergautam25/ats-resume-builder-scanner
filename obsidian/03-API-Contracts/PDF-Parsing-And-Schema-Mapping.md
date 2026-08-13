# PDF Parsing & Schema Field Mapping Specification

## Overview

This document specifies the multi-tier PDF parsing, binary artifact sanitization, and structured JSON schema field mapping pipeline used by **ATS Resume AI**.

---

## 🏗 Multi-Tier PDF Extraction Pipeline

```
                              Uploaded PDF Document
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │ 1. Client pdfjs-dist Extraction   │
                     │    - Y/X coordinate line ordering │
                     │    - Annotation link extraction   │
                     └─────────────────┬─────────────────┘
                                       │
                               isReadableText()?
                                ├── YES ──► Output Clean Text
                                │
                                NO
                                │
                                ▼
                     ┌───────────────────────────────────┐
                     │ 2. Server pdf-parse Engine        │
                     │    - Stream buffer decoding       │
                     └─────────────────┬─────────────────┘
                                       │
                               isReadableText()?
                                ├── YES ──► Output Clean Text
                                │
                                NO
                                │
                                ▼
                     ┌───────────────────────────────────┐
                     │ 3. Gemini 2.5 Flash Multimodal OCR│
                     │    - Verbatim document extraction │
                     └─────────────────┬─────────────────┘
                                       │
                               isReadableText()?
                                ├── YES ──► Output Clean Text
                                │
                                NO
                                ▼
               User Notification: Scanned / Encrypted PDF
```

---

## 🛡️ Readability Guard (`isReadableText`)

Rejects non-printable binary garbage, mojibake, and `%PDF-` streams:

- **Length Check**: Minimum 20 printable characters required.
- **PDF Syntax Filter**: Rejects strings containing `%PDF-`, `endobj`, `endstream`, `startxref`.
- **Character Ratio**: Rejects if >10% of characters are non-printable/control characters.
- **Line Structure**: Minimum 5 meaningful text lines required.
- **Word Density**: Requires at least 10 valid word tokens (`[a-zA-Z]{2,}`).

---

## 🧹 Deep Sanitization (`deepClean`)

Performs multi-pass text sanitization:

1. Strips zero-width & non-printable Unicode (`\u200B-\u200D`, `\uFEFF`).
2. Strips C0/C1 control characters (`\x00-\x1F`, `\x7F-\x9F`).
3. Strips Unicode replacement characters (`\uFFFD`) and mojibake runs.
4. Removes leaked PDF metadata syntax (`%PDF-`, `obj`, `stream...endstream`).
5. Fixes OCR date typos (`Presen` ➔ `Present`, `Curren` ➔ `Current`).
6. Normalizes line breaks and whitespace.

---

## 🎯 Structured Field Mapping (`ResumeData`)

Raw parsed text is automatically mapped by Gemini AI into structured JSON fields:

| Field Name | Target Schema Type | Parsed Properties |
|------------|-------------------|-------------------|
| `personalInfo` | `Object` | `fullName`, `headline`, `email`, `phone`, `location`, `linkedin`, `github`, `portfolio` |
| `summary` | `String` | Executive Summary paragraph |
| `experience` | `Array<WorkExperience>` | `company`, `position`, `startDate`, `endDate`, `isCurrent`, `highlights[]` |
| `education` | `Array<Education>` | `institution`, `degree`, `fieldOfStudy`, `startDate`, `endDate`, `gpa` |
| `projects` | `Array<Project>` | `title`, `subtitle`, `link`, `highlights[]`, `technologies[]` |
| `skillCategories` | `Array<SkillCategory>` | `category` (e.g. "Languages"), `skills[]` |
| `certifications` | `Array<Certification>` | `name`, `issuer`, `date` |

---

## 🧪 E2E Automated Verification Report

- **Test Suite**: `tests/pdf_mapping.spec.ts` & `tests/e2e.spec.ts`
- **Result**: **16 / 16 PASSING**
- **Verified Tests**:
  1. `POST /api/parse-document` — Returns clean, artifact-free text without `%PDF-` tokens.
  2. `POST /api/analyze-resume` — Maps raw text accurately into `personalInfo`, `summary`, `experience`, `skillCategories`, and `analysis`.
  3. **UI Editor Sync** — Populates all input fields under Full Name, Email, Skills, and Experience automatically.
