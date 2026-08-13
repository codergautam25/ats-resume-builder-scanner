import React, { useState } from 'react';
import { Upload, FileText, Target, PlusCircle, Sparkles, AlertCircle, ArrowRight, CheckCircle2, RefreshCw, AlertTriangle, ShieldCheck, Wand2, Eye } from 'lucide-react';
import { parseUploadedFile } from '../../utils/fileParser';
import { parseResumeTextToStructuredData, stripPdfCoordinateNoise } from '../../utils/resumeParser';
import { TemplateStyle } from '../../types';

interface ScannerStepProps {
  rawText: string;
  setRawText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  extraWorkNotes: string;
  setExtraWorkNotes: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onLoadSampleResume?: (sampleType?: 'swe' | 'servicenow' | 'pm') => void;
  onSelectTemplateStyle?: (style: TemplateStyle) => void;
  onGoToPreview?: () => void;
}

export const ScannerStep: React.FC<ScannerStepProps> = ({
  rawText,
  setRawText,
  jobDescription,
  setJobDescription,
  extraWorkNotes,
  setExtraWorkNotes,
  onAnalyze,
  isAnalyzing,
  errorMessage,
  onLoadSampleResume,
  onSelectTemplateStyle,
  onGoToPreview,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsingStep, setParsingStep] = useState<'reading' | 'extracting' | 'structuring' | 'complete' | null>(null);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'how' | 'analyze' | 'formats'>('how');

  const parsedStats = React.useMemo(() => {
    if (!rawText.trim()) return null;
    const parsed = parseResumeTextToStructuredData(rawText);

    const hasEmail = Boolean(parsed.personalInfo.email);
    const hasPhone = Boolean(parsed.personalInfo.phone);
    const hasLinkedin = Boolean(parsed.personalInfo.linkedin);
    const expCount = parsed.experience.length;
    const hasMetrics = parsed.experience.some((e) =>
      e.highlights.some((hl) => /\b\d+(%|k|\+|ms|\$)\b/i.test(hl))
    );

    const issues: string[] = [];
    if (!hasEmail) issues.push('Missing email address in header');
    if (!hasPhone) issues.push('Missing phone contact number');
    if (!hasLinkedin) issues.push('Missing LinkedIn profile URL');
    if (!hasMetrics) issues.push('Work highlights lack quantified metrics (%, $, scale)');
    if (parsed.skillCategories.some((cat) => cat.skills.some((s) => s.length > 35))) {
      issues.push('Full sentences in skills list (auto-repositioned to Experience)');
    }

    const rawAtsScore = Math.max(50, 100 - issues.length * 10);

    return {
      name: parsed.personalInfo.fullName || 'Candidate',
      expCount,
      skillGroupCount: parsed.skillCategories.length,
      eduCount: parsed.education.length,
      projCount: parsed.projects.length,
      hasEmail,
      hasPhone,
      hasLinkedin,
      hasMetrics,
      rawAtsScore,
      issues,
    };
  }, [rawText]);

  const [parseError, setParseError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setUploadedFileName(file.name);
    setIsParsingFile(true);
    setParsingStep('reading');
    setParseError(null);

    try {
      setParsingStep('extracting');
      const text = await parseUploadedFile(file);

      const isFailureMessage = text.startsWith('PDF parsing failed');
      if (isFailureMessage) {
        setParseError(text);
        setIsParsingFile(false);
        setParsingStep(null);
        return;
      }

      setParsingStep('structuring');
      const cleanExtractedText = stripPdfCoordinateNoise(text);
      setRawText(cleanExtractedText);
      setParsingStep('complete');
      setTimeout(() => setIsParsingFile(false), 1000);
    } catch (err) {
      console.error('File parse error:', err);
      setParseError('Failed to read this file. Please try a different PDF or paste your resume text directly.');
      setIsParsingFile(false);
      setParsingStep(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Luxury Banner */}
      <div className="card bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/50 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Optimization & Skill Clarification Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Scan Your Resume for ATS & Human Perfection
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Upload your resume, paste your target job description, and add any extra accomplishments. Gemini AI will analyze keyword matches, structure ATS-compliant formatting, and ask clarifying questions.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Analysis Notice</p>
            <p className="text-xs text-rose-200 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Main Section (Column 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Resume Upload Box */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="section-title">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>1. Upload Resume PDF / Document</span>
              </label>
              {uploadedFileName && (
                <span className="badge badge-success flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{uploadedFileName}</span>
                </span>
              )}
            </div>

            {/* Drag & Drop File Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`drop-zone p-8 text-center ${dragActive ? 'active' : ''}`}
            >
              <input
                type="file"
                id="resume-file-input"
                className="hidden"
                accept=".txt,.md,.json,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-file-input" className="cursor-pointer space-y-3 block">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-default">
                    Drop your resume PDF here, or <span className="text-indigo-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-secondary mt-1">Supports PDF, DOCX, TXT, Markdown, or JSON up to 5MB</p>
                </div>
              </label>
            </div>

            {/* Parsing Progress */}
            {isParsingFile && (
              <div className="p-4 surface-elevated border border-indigo-500/30 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Parsing Document: {uploadedFileName || 'Resume'}</span>
                  </div>
                  <span className="badge badge-primary">
                    {parsingStep === 'reading' && 'Step 1/3: Reading'}
                    {parsingStep === 'extracting' && 'Step 2/3: Extracting Text'}
                    {parsingStep === 'structuring' && 'Step 3/3: Structuring'}
                    {parsingStep === 'complete' && 'Parsed Successfully!'}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        parsingStep === 'reading'
                          ? '30%'
                          : parsingStep === 'extracting'
                          ? '65%'
                          : parsingStep === 'structuring'
                          ? '90%'
                          : '100%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Raw Text Textarea */}
            <div className="space-y-2 pt-2">
              <div className="flex flex-wrap justify-between items-center text-xs text-secondary gap-1">
                <span className="font-semibold">Or paste raw text content below:</span>
                <div className="flex items-center space-x-2">
                  {rawText.trim() && (
                    <button
                      type="button"
                      onClick={() => setRawText(stripPdfCoordinateNoise(rawText))}
                      className="text-indigo-400 hover:underline font-bold flex items-center space-x-1 text-[11px] bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20"
                      title="Clean PDF coordinate floats"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Clean Float Coordinates</span>
                    </button>
                  )}
                  {onLoadSampleResume && !rawText.trim() && (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] text-muted">Try sample:</span>
                      <button
                        type="button"
                        onClick={() => onLoadSampleResume('swe')}
                        className="text-indigo-400 hover:underline font-bold flex items-center space-x-1 text-[11px] bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20"
                      >
                        <span>⚡ Full Stack</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onLoadSampleResume('servicenow')}
                        className="text-purple-300 hover:underline font-bold flex items-center space-x-1 text-[11px] bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/30"
                      >
                        <span>💜 ServiceNow</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onLoadSampleResume('pm')}
                        className="text-emerald-400 hover:underline font-bold flex items-center space-x-1 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                      >
                        <span>📈 PM</span>
                      </button>
                    </div>
                  )}
                  <span>{rawText.length} characters</span>
                </div>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => {
                  const cleanedInput = stripPdfCoordinateNoise(e.target.value);
                  setRawText(cleanedInput);
                }}
                placeholder="Paste your existing resume text here... (PDF coordinate floats will be auto-cleaned)"
                rows={7}
                className="input font-mono text-xs"
              />

              {parsedStats && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      <span>Parsed: {parsedStats.name}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="badge badge-neutral">{parsedStats.expCount} Positions</span>
                      <span className="badge badge-neutral">{parsedStats.skillGroupCount} Skill Groups</span>
                      <span className="badge badge-neutral">{parsedStats.eduCount} Education</span>
                    </div>
                  </div>

                  {/* Pre-flight Audit Card */}
                  <div className="card-elevated p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle pb-2.5">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="text-xs font-extrabold text-default">ATS Pre-Flight Audit</h4>
                          <p className="text-[10px] text-secondary">Automatic parser check against Workday, Taleo, Greenhouse</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 px-3 py-1 rounded-xl surface-card border border-default text-xs">
                        <span className="text-secondary text-[11px]">Raw File Score:</span>
                        <span className={parsedStats.issues.length === 0 ? 'text-emerald-400 font-black' : 'text-amber-400 font-black'}>
                          {parsedStats.rawAtsScore}% Match
                        </span>
                      </div>
                    </div>

                    {parsedStats.issues.length > 0 ? (
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>{parsedStats.issues.length} Parser Gaps Detected:</span>
                        </span>
                        <ul className="grid grid-cols-1 gap-1 pl-4 text-[11px] text-secondary list-disc">
                          {parsedStats.issues.map((iss, iIdx) => (
                            <li key={iIdx}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Zero structural defects detected! Clean single-column format.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions 3-Tab Pill Container */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-subtle pb-3">
              {(['how', 'analyze', 'formats'] as const).map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveInstructionTab(tabKey)}
                  className={`nav-tab ${activeInstructionTab === tabKey ? 'active' : ''}`}
                >
                  {tabKey === 'how' && 'How to Use'}
                  {tabKey === 'analyze' && 'What We Analyze'}
                  {tabKey === 'formats' && 'Supported Formats'}
                </button>
              ))}
            </div>

            {activeInstructionTab === 'how' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 surface-elevated rounded-xl border border-default space-y-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="text-xs font-bold text-default">Upload & Input</h4>
                  <p className="text-[11px] text-secondary">Drop your resume PDF or paste raw text. Paste target job posting for keyword matching.</p>
                </div>
                <div className="p-4 surface-elevated rounded-xl border border-default space-y-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="text-xs font-bold text-default">AI Deep Scan</h4>
                  <p className="text-[11px] text-secondary">Gemini AI evaluates ATS score, keyword coverage, formatting, and generates clarification questions.</p>
                </div>
                <div className="p-4 surface-elevated rounded-xl border border-default space-y-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="text-xs font-bold text-default">Export & Land Offers</h4>
                  <p className="text-[11px] text-secondary">Apply 1-click fixes, export high-scoring vector PDF, and review your career roadmap.</p>
                </div>
              </div>
            )}

            {activeInstructionTab === 'analyze' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 surface-elevated rounded-xl border border-default">
                  <span className="font-bold text-indigo-400 block">Keyword Match</span>
                  <span className="text-[11px] text-secondary">Hard & soft skill alignment with JD</span>
                </div>
                <div className="p-3 surface-elevated rounded-xl border border-default">
                  <span className="font-bold text-emerald-400 block">Quantified Impact</span>
                  <span className="text-[11px] text-secondary">Metrics (%, $, scale, velocity)</span>
                </div>
                <div className="p-3 surface-elevated rounded-xl border border-default">
                  <span className="font-bold text-amber-400 block">ATS Formatting</span>
                  <span className="text-[11px] text-secondary">Single-column structural integrity</span>
                </div>
                <div className="p-3 surface-elevated rounded-xl border border-default">
                  <span className="font-bold text-purple-400 block">HR Executive Appeal</span>
                  <span className="text-[11px] text-secondary">Leadership & clarity tone</span>
                </div>
              </div>
            )}

            {activeInstructionTab === 'formats' && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge badge-neutral">PDF Documents (.pdf)</span>
                <span className="badge badge-neutral">Word Documents (.docx)</span>
                <span className="badge badge-neutral">Plain Text (.txt)</span>
                <span className="badge badge-neutral">Markdown (.md)</span>
                <span className="badge badge-neutral">JSON Data (.json)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar (Column 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 space-y-6 sticky top-20">
            
            {/* Target Job Role Input */}
            <div className="space-y-3">
              <label className="section-title text-sm">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>2. Target Job Description</span>
              </label>

              <div className="flex flex-wrap gap-1">
                {[
                  { title: 'Software Eng', text: 'Seeking Software Engineer: TypeScript, Node.js, React, Python, PostgreSQL, Docker, AWS, microservices.' },
                  { title: 'Full Stack', text: 'Seeking Full Stack Engineer: React, TypeScript, Node.js, GraphQL, AWS Lambda, Docker, PostgreSQL, CI/CD.' },
                  { title: 'Data/AI Eng', text: 'Seeking Data/AI Engineer: Python, PyTorch, SQL, Spark, BigQuery, Kafka, LLM APIs, Vector Databases.' },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setJobDescription(preset.text)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/20 transition"
                  >
                    + {preset.title}
                  </button>
                ))}
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job description to run keyword match..."
                rows={5}
                className="input text-xs"
              />
            </div>

            {/* Unlisted Accomplishments Input */}
            <div className="space-y-3 pt-3 border-t border-subtle">
              <label className="section-title text-sm">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>3. Side Projects / Unlisted Accomplishments</span>
              </label>
              <textarea
                value={extraWorkNotes}
                onChange={(e) => setExtraWorkNotes(e.target.value)}
                placeholder="Unlisted projects, metrics, certifications, soft skills..."
                rows={3}
                className="input text-xs"
              />
            </div>

            {/* Quick Checklist */}
            <div className="space-y-2 pt-3 border-t border-subtle">
              <span className="font-label text-muted">Quick Scan Checklist</span>
              <ul className="space-y-1.5 text-xs text-secondary">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${rawText ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Resume Content Loaded</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${jobDescription ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Target Job Description Added</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${extraWorkNotes ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Extra Work Notes Included</span>
                </li>
              </ul>
            </div>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="btn btn-primary btn-xl w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>⚡ Analyze Resume Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
