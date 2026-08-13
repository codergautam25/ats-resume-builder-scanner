import * as pdfjsLib from 'pdfjs-dist';
import { humanizeText } from './humanizer';

// Configure pdfjs worker for client browser execution
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

// ─── Readability Guard ────────────────────────────────────────────────────────
// Returns true if the text is human-readable (printable ASCII / Unicode).
// Rejects binary blobs, base64 artifacts, %PDF streams, and heavy mojibake.
function isReadableText(text: string): boolean {
  if (!text || text.trim().length < 30) return false;

  const sample = text.slice(0, 3000);

  // 1. Reject if contains PDF binary header/stream/font array markers
  if (/%PDF-|endobj|endstream|startxref|\/Filter|\/Length\s+\d|\/Annots|\/StructParents|\/DW\s+0|\/Contents/i.test(sample)) return false;

  // 2. Reject if contains PDF font metric bracket arrays e.g. [365.23438 0 0 277.83203] or xref tables
  if (/\[\d{2,}\.?\d*\s+\d+.*?\d{2,}\.?\d*\]/.test(sample) || /\b00000\d{5}\s+00000\s+n\b/.test(sample)) return false;

  // 3. Reject binary symbol noise like #jJx=, C~k, {z67, cO p,Cp
  const binarySymbols = sample.match(/([#=~\]\}\{_\\\/%*^$+<>]{2,}|#[a-zA-Z0-9]{2,}=|~[a-zA-Z])/g) || [];
  if (binarySymbols.length > 2) return false;

  // 4. Reject if non-Latin / non-ASCII extended Unicode ratio > 3% (Font CID encoding mojibake e.g. 붮, ޭ, ۆ, 巷, Ƨ)
  const latinAndPunctuation = sample.replace(/[^\x09\x0A\x0D\x20-\x7E\u00C0-\u024F]/g, '');
  const nonLatinGarbageRatio = (sample.length - latinAndPunctuation.length) / sample.length;
  if (nonLatinGarbageRatio > 0.03) return false;

  // 5. Must contain AT LEAST 2 standard resume structural keywords
  const resumeKeywords = [
    'experience', 'education', 'skills', 'summary', 'projects', 'work', 'university',
    'college', 'engineer', 'developer', 'analyst', 'manager', 'specialist', 'lead',
    'certified', 'contact', 'email', 'phone', 'technologies', 'certifications', 'profile'
  ];
  const lowerSample = sample.toLowerCase();
  const matchedKeywords = resumeKeywords.filter((kw) => lowerSample.includes(kw));
  if (matchedKeywords.length < 2) return false;

  return true;
}

// ─── Deep Cleaner ─────────────────────────────────────────────────────────────
// Strips every artifact type we know about, then normalises whitespace
function deepClean(text: string): string {
  if (!text) return '';

  let t = text;

  // 1. Strip zero-width / invisible Unicode
  t = t.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  t = t.replace(/\u00A0/g, ' ');

  // 2. Strip control characters (keep tab, LF, CR)
  t = t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Strip remaining C1 control / high Latin-1 garbage (e.g. \x80-\x9F)
  t = t.replace(/[\x80-\x9F]/g, '');

  // 4. Strip Unicode replacement characters & common mojibake sequences
  t = t.replace(/\uFFFD/g, '');
  // strip sequences of ≥3 non-letter, non-digit, non-space chars that are
  // almost certainly binary artifacts  (e.g.    ☐☐☐  ◆◆◆)
  t = t.replace(/[^\x09\x0A\x0D\x20-\x7E\u00C0-\u024F\u0900-\u097F\u4E00-\u9FFF]{3,}/g, ' ');

  // 5. Remove PDF internal stream, font dictionary & xref table syntax
  t = t.replace(/%PDF-[\d.]+/gi, '');
  t = t.replace(/\b(endobj|endstream|startxref|xref|trailer)\b/gi, '');
  t = t.replace(/\/(?:Filter|Length|Type|Font|MediaBox|Resources|Page|Pages|Catalog|Annots|StructParents|Parent|DW|Contents)\s*\/?/gi, '');
  t = t.replace(/<<[^>]*>>/g, ' ');   // dictionary objects
  t = t.replace(/\[\d{2,}\.?\d*[\s\d.\-\[\]]+\]/g, ' '); // font metric array tables like [365.23438 0 0 277.83203]
  t = t.replace(/\b00000\d{5}\s+00000\s+f?\s*n?\b/gi, ' '); // xref offset entries
  t = t.replace(/\d+\s+\d+\s+obj\b/g, ''); // "12 0 obj"
  t = t.replace(/stream[\s\S]*?endstream/g, ''); // binary stream blocks
  t = t.replace(/^[<>\s/\\|-]{2,}$/gm, ''); // standalone << or >> or //

  // Filter out lines that are standalone PDF keywords or font matrix coordinates
  t = t
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^(stream|endstream|obj|endobj|xref|trailer|startxref|>>|<<|%%EOF)$/i.test(trimmed)) return false;
      if (/^\d{4,}\s+\d+\.\d+$/.test(trimmed)) return false; // font matrix coordinate lines
      if (/^\[?\d{2,}\.?\d*[\s\d.\-\[\]]+\]?$/.test(trimmed)) return false; // font width arrays
      if (/^00000\d{5}/.test(trimmed)) return false; // xref index lines
      return true;
    })
    .join('\n');

  // 6. Strip embedded link debug tokens from resumeParser
  t = t.replace(/\[DOCUMENT_EMBEDDED_LINKS\][\s\S]*/gi, '');
  t = t.replace(/Embedded Links:\s*[^\n]*/gi, '');

  // 7. Fix common OCR / PDF extraction date anomalies
  t = t.replace(/\bPresen\b/gi, 'Present');
  t = t.replace(/\bCurren\b/gi, 'Current');

  // 8. Normalise whitespace & Humanize text
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/\n[ \t]+/g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');

  return humanizeText(t.trim());
}

// ─── pdfjs Extractor (client-side) ──────────────────────────────────────────
async function extractWithPdfjs(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      // Disable password protection errors — let them surface as exceptions
      disableAutoFetch: false,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];
    const allEmbeddedLinks: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent({ includeMarkedContent: false });

      // Reconstruct text with proper line-break detection using Y-coordinate clusters
      // Group items by approximate Y position (within 4pt) to form "lines"
      const lineMap = new Map<number, string[]>();

      for (const item of textContent.items as any[]) {
        const str: string = (item.str || '').replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        if (!str.trim() && !item.hasEOL) continue;

        const y: number = item.transform ? Math.round(item.transform[5] / 4) * 4 : 0;
        const x: number = item.transform ? item.transform[4] : 0;

        if (!lineMap.has(y)) lineMap.set(y, []);
        // Store with X coordinate for later left-to-right sorting
        lineMap.get(y)!.push(`\x00${String(x).padStart(8, '0')}\x00${str}`);
      }

      // Sort lines top-to-bottom (higher Y = higher on page in PDF coords)
      const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
      const pageLines: string[] = [];

      for (const y of sortedYs) {
        const segments = lineMap.get(y)!
          .sort() // lexicographic sort on the X-padded prefix
          .map(s => s.replace(/^\x00\d+\x00/, '')); // strip the prefix

        const line = segments.join(' ').replace(/\s+/g, ' ').trim();
        if (line) pageLines.push(line);
      }

      pageTexts.push(pageLines.join('\n'));

      // Extract embedded hyperlinks from PDF annotations
      try {
        const annotations = await page.getAnnotations();
        for (const ann of annotations as any[]) {
          const url = ann.url || ann.unsafeUrl;
          if (url && typeof url === 'string' && url.length > 5 && !allEmbeddedLinks.includes(url)) {
            allEmbeddedLinks.push(url);
          }
        }
      } catch {
        // Ignore annotation extraction errors
      }
    }

    let fullText = pageTexts.join('\n\n');

    // Append embedded hyperlinks at the end (helps with LinkedIn/GitHub detection)
    if (allEmbeddedLinks.length > 0) {
      fullText += '\n\n' + allEmbeddedLinks.join('\n');
    }

    const cleaned = deepClean(fullText);
    return isReadableText(cleaned) ? cleaned : null;
  } catch (err) {
    console.warn('[fileParser] pdfjs extraction failed:', err);
    return null;
  }
}

// ─── Server API Fallback (pdf-parse + Gemini OCR) ───────────────────────────
async function extractViaServer(file: File): Promise<string | null> {
  try {
    const base64Data = await fileToBase64(file);
    const res = await fetch('/api/parse-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        base64Data,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.text) return null;

    const cleaned = deepClean(data.text);
    return isReadableText(cleaned) ? cleaned : null;
  } catch (err) {
    console.warn('[fileParser] Server parse endpoint failed:', err);
    return null;
  }
}

// ─── Plain Text Reader ────────────────────────────────────────────────────────
function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = (e.target?.result as string) || '';
      const cleaned = deepClean(raw);
      resolve(cleaned);
    };
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file, 'UTF-8');
  });
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────
export async function parseUploadedFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const isPDF = file.type === 'application/pdf' || name.endsWith('.pdf');

  // ── PDF path ──────────────────────────────────────────────────────────────
  if (isPDF) {
    // 1. Try pdfjs client-side (fastest, no network, works for most digital PDFs)
    const pdfjsResult = await extractWithPdfjs(file);
    if (pdfjsResult) {
      console.log('[fileParser] pdfjs extraction succeeded.');
      return pdfjsResult;
    }

    // 2. Fall back to server (pdf-parse + Gemini multimodal OCR for scanned PDFs)
    console.warn('[fileParser] pdfjs gave no usable text → trying server fallback.');
    const serverResult = await extractViaServer(file);
    if (serverResult) {
      console.log('[fileParser] Server parse succeeded.');
      return serverResult;
    }

    // 3. Last resort: prompt the user (return a helpful message instead of garbage)
    console.error('[fileParser] All PDF extraction strategies failed.');
    return (
      'PDF parsing failed — this PDF may be scanned, image-based, or password-protected.\n\n' +
      'Please copy-paste your resume text directly into the text area below for best results.'
    );
  }

  // ── Plain text / Markdown / JSON ──────────────────────────────────────────
  return readAsText(file);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });
}
