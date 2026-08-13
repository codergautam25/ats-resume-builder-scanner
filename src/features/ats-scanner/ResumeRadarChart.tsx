import React, { useState } from 'react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Tooltip, Legend,
} from 'recharts';
import { ATSAnalysis, SkillCategory } from '../../types';
import { Target, BarChart2, Info, CheckCircle, AlertTriangle, Layers, Sparkles, Flame, Rocket } from 'lucide-react';

interface ResumeRadarChartProps {
  scoreBreakdown: ATSAnalysis['scoreBreakdown'];
  overallScore: number;
  foundKeywords?: string[];
  missingKeywords?: string[];
  skillCategories?: SkillCategory[];
  jobDescription?: string;
}

interface SkillCategoryRadarItem {
  subject: string;
  candidate: number;
  target: number;
  matchedList: string[];
  missingList: string[];
  description: string;
}

// Helper: Filter out non-skill noise (dates, years, locations, metadata)
function isSkillNoiseToken(str: string): boolean {
  if (!str) return true;
  const s = str.trim().toLowerCase();
  if (s.length < 2) return true;
  // Match dates: "dec 2023", "2023", "present", "jan 2020", "present", "dec"
  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present|current|ongoing)/i.test(s)) return true;
  if (/^\d{4}\s*[-–—]\s*(\d{4}|present)$/i.test(s)) return true;
  if (/^(kolkata|bengaluru|bangalore|mumbai|delhi|pune|hyderabad|chennai|india|usa|remote|location|email|phone)$/i.test(s)) return true;
  if (/^(tata consultancy services|accenture|company|organization|college|university)$/i.test(s)) return true;
  return false;
}

// ─── Domain-adaptive Category Definitions ────────────────────────────────────

// 1. ServiceNow / ITSM / ITOM Domain Categories
const SERVICENOW_CATEGORY_DEFS = [
  {
    name: 'ServiceNow Platform & Scripting',
    desc: 'GlideRecord, GlideSystem, Business Rules, Script Includes, Client Scripts & Server Scripting',
    tokens: [
      'servicenow', 'glide', 'gliderecord', 'glidesystem', 'business rules', 'script includes',
      'client scripts', 'ui actions', 'ui policies', 'data lookup', 'scoped app', 'javascript'
    ],
  },
  {
    name: 'ITSM & ITOM Modules',
    desc: 'Incident, Problem, Change, Service Catalog, CMDB, Discovery & Service Mapping',
    tokens: [
      'itsm', 'itom', 'cmdb', 'service catalog', 'incident management', 'change management',
      'problem management', 'discovery', 'service mapping', 'ire', 'service graph', 'event management'
    ],
  },
  {
    name: 'IntegrationHub & APIs',
    desc: 'IntegrationHub, Spokes, Scripted REST APIs, Web Services, OAuth & Mid Server',
    tokens: [
      'integrationhub', 'integration hub', 'spoke', 'rest api', 'scripted rest', 'soap',
      'mid server', 'oauth', 'webhooks', 'postman', 'json api'
    ],
  },
  {
    name: 'Workflow & Automation',
    desc: 'Flow Designer, Subflows, ATF Automated Test Framework & Scheduled Jobs',
    tokens: [
      'flow designer', 'atf', 'automated test framework', 'subflow', 'workflow',
      'scheduled jobs', 'events', 'notifications', 'process automation'
    ],
  },
  {
    name: 'UI & Next Experience',
    desc: 'Service Portal, Next Experience UI Builder, Workspaces & Widget Development',
    tokens: [
      'service portal', 'ui builder', 'next experience', 'workspace', 'widget',
      'angularjs', 'html', 'css', 'page designer'
    ],
  },
  {
    name: 'Platform Governance & Agile',
    desc: 'ACLs, Update Sets, ITIL, Agile, Scrum & Instance Administration',
    tokens: [
      'acl', 'update sets', 'itil', 'agile', 'scrum', 'instance administration',
      'git', 'servicenow certified', 'sysadmin'
    ],
  },
];

// 2. Data Engineering & Big Data Domain Categories
const DATA_ENGINEERING_CATEGORY_DEFS = [
  {
    name: 'Stream Processing & Kafka',
    desc: 'Apache Kafka, Flink, Event Streaming & Schema Registry',
    tokens: ['kafka', 'flink', 'streaming', 'schema registry', 'kinesis', 'pubsub', 'avro'],
  },
  {
    name: 'PySpark & Lakehouse',
    desc: 'Databricks, Delta Lake, PySpark & Distributed Dataframes',
    tokens: ['pyspark', 'spark', 'databricks', 'delta lake', 'pyspark dataframe', 'hadoop'],
  },
  {
    name: 'Cloud Data Platforms',
    desc: 'AWS EMR, EC2, S3, BigQuery, Snowflake & Data Warehousing',
    tokens: ['aws', 'emr', 'ec2', 's3', 'snowflake', 'bigquery', 'redshift', 'dbt'],
  },
  {
    name: 'Databases & Storage',
    desc: 'SQL Server, PostgreSQL, MongoDB, Redis & Data Modeling',
    tokens: ['sql server', 'postgresql', 'mysql', 'mongodb', 'redis', 'sql', 'nosql'],
  },
  {
    name: 'Observability & Pipelines',
    desc: 'OpenTelemetry, New Relic, Metrics, Logs & Airflow DAGs',
    tokens: ['opentelemetry', 'new relic', 'newrelic', 'prometheus', 'grafana', 'airflow', 'etl'],
  },
  {
    name: 'Engineering & Delivery',
    desc: 'Python, Java, Microservices, Git & Agile Practices',
    tokens: ['python', 'java', 'microservices', 'git', 'agile', 'scrum', 'docker'],
  },
];

// 3. General Software & Cloud Systems (Default)
const GENERAL_CATEGORY_DEFS = [
  {
    name: 'Languages & Core Tech',
    desc: 'Programming languages, scripting & web stacks',
    tokens: ['typescript', 'javascript', 'python', 'golang', 'java', 'c#', 'c++', 'react', 'vue', 'html', 'css'],
  },
  {
    name: 'Backend & APIs',
    desc: 'Server-side frameworks, API design & microservices',
    tokens: ['nodejs', 'express', 'fastapi', 'django', 'spring', 'rest api', 'graphql', 'grpc', 'microservices'],
  },
  {
    name: 'Cloud & DevOps',
    desc: 'Cloud platforms, containers, IaC & pipelines',
    tokens: ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'helm', 'terraform', 'cicd', 'github actions', 'linux'],
  },
  {
    name: 'Data & Analytics',
    desc: 'Databases, SQL, NoSQL & analytics pipelines',
    tokens: ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'kafka', 'spark', 'pyspark', 'snowflake'],
  },
  {
    name: 'AI & System Design',
    desc: 'ML/AI frameworks, LLMs & system architecture',
    tokens: ['machine learning', 'pytorch', 'tensorflow', 'llm', 'rag', 'system design', 'distributed systems'],
  },
  {
    name: 'Delivery & Processes',
    desc: 'Git, testing, security, Agile & Scrum',
    tokens: ['git', 'agile', 'scrum', 'jira', 'unit testing', 'jest', 'cypress', 'security', 'itil'],
  },
];

// Normalize token for comparison (strip punctuation and spaces)
function normalizeToken(s: string): string {
  return s.toLowerCase().replace(/[.\s\-_/]/g, '');
}

// Precise token matcher to prevent substring bugs (e.g. "dec2023" matching "ec2")
function skillMatchesCategoryToken(candidateSkill: string, categoryTokens: string[]): boolean {
  if (isSkillNoiseToken(candidateSkill)) return false;
  const normSkill = normalizeToken(candidateSkill);
  if (!normSkill) return false;

  return categoryTokens.some((token) => {
    const normToken = normalizeToken(token);

    // Exact match
    if (normSkill === normToken) return true;

    // For multi-word tokens (e.g. "flow designer", "service catalog"), check token substring
    if (token.includes(' ') && normSkill.includes(normToken)) return true;

    // For single-word tokens, require length >= 4 for substring or word boundary
    if (normToken.length >= 4 && (normSkill.includes(normToken) || normToken.includes(normSkill))) return true;

    // For short tokens (e.g. "ec2", "aws", "gcp", "atf", "sql", "git"), require exact match or word boundary
    if (normToken.length < 4) {
      const regex = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(candidateSkill);
    }

    return false;
  });
}

export const ResumeRadarChart: React.FC<ResumeRadarChartProps> = ({
  scoreBreakdown,
  overallScore,
  foundKeywords = [],
  missingKeywords = [],
  skillCategories = [],
  jobDescription = '',
}) => {
  const [activeMode, setActiveMode] = useState<'skills' | 'ats'>('skills');

  // ── 1. Detect Domain to load Adaptive Category Definitions ───────────────
  const activeCategoryDefs = React.useMemo(() => {
    const allText = [
      jobDescription,
      ...foundKeywords,
      ...skillCategories.flatMap(c => c.skills)
    ].join(' ').toLowerCase();

    if (allText.includes('servicenow') || allText.includes('itsm') || allText.includes('cmdb') || allText.includes('flow designer') || allText.includes('gliderecord')) {
      return SERVICENOW_CATEGORY_DEFS;
    }
    if (allText.includes('pyspark') || allText.includes('flink') || (allText.includes('kafka') && allText.includes('data'))) {
      return DATA_ENGINEERING_CATEGORY_DEFS;
    }
    return GENERAL_CATEGORY_DEFS;
  }, [jobDescription, foundKeywords, skillCategories]);

  // ── 2. Build Candidate Skill Pool (filtering out noise/dates) ────────────
  const allCandidateSkills = React.useMemo<string[]>(() => {
    const seen = new Set<string>();
    const all: string[] = [];
    const add = (s: string) => {
      if (!s || isSkillNoiseToken(s)) return;
      const key = s.trim().toLowerCase();
      if (key && !seen.has(key)) { seen.add(key); all.push(s.trim()); }
    };
    foundKeywords.forEach(add);
    skillCategories.forEach(cat => cat.skills.forEach(add));
    return all;
  }, [foundKeywords, skillCategories]);

  // ── 3. Build Job Description Token Set ──────────────────────────────────
  const jdNormTokens = React.useMemo<Set<string>>(() => {
    if (!jobDescription) return new Set();
    const jdLower = jobDescription.toLowerCase();
    const tokens = new Set<string>();
    activeCategoryDefs.forEach(cat =>
      cat.tokens.forEach(t => {
        if (jdLower.includes(t.toLowerCase())) tokens.add(normalizeToken(t));
      })
    );
    return tokens;
  }, [jobDescription, activeCategoryDefs]);

  // ── 4. Compute Radar Data per Category ──────────────────────────────────
  const computedSkillRadarData = React.useMemo<SkillCategoryRadarItem[]>(() => {
    return activeCategoryDefs.map((catDef) => {
      const matchedSet = new Set<string>();
      const missingSet = new Set<string>();

      catDef.tokens.forEach((token) => {
        const tokenNorm = normalizeToken(token);

        const coveredByCandidate = allCandidateSkills.some(skill =>
          skillMatchesCategoryToken(skill, [token])
        );

        const requiredByJD = jobDescription
          ? jdNormTokens.has(tokenNorm) || jobDescription.toLowerCase().includes(token.toLowerCase())
          : missingKeywords.some(m => !isSkillNoiseToken(m) && skillMatchesCategoryToken(m, [token]));

        if (coveredByCandidate) {
          const label = allCandidateSkills.find(s => skillMatchesCategoryToken(s, [token])) || token;
          matchedSet.add(label);
        } else if (requiredByJD) {
          const label = missingKeywords.find(m => skillMatchesCategoryToken(m, [token])) || token;
          missingSet.add(label);
        }
      });

      allCandidateSkills.forEach(skill => {
        const alreadyInMatched = [...matchedSet].some(m => m.toLowerCase() === skill.toLowerCase());
        if (!alreadyInMatched && skillMatchesCategoryToken(skill, catDef.tokens)) {
          matchedSet.add(skill);
        }
      });

      const matchedList = [...matchedSet].filter(s => !isSkillNoiseToken(s));
      const missingList = [...missingSet].filter(s => !isSkillNoiseToken(s));

      const total = matchedList.length + missingList.length;
      let candidatePercentage: number;
      if (total === 0) {
        candidatePercentage = matchedList.length > 0 ? 85 : 40;
      } else {
        candidatePercentage = Math.round((matchedList.length / total) * 100);
      }
      if (matchedList.length > 0) {
        candidatePercentage = Math.max(70, candidatePercentage);
      }
      candidatePercentage = Math.min(100, Math.max(30, candidatePercentage));

      return {
        subject: catDef.name,
        candidate: candidatePercentage,
        target: 100,
        matchedList,
        missingList,
        description: catDef.desc,
      };
    });
  }, [allCandidateSkills, missingKeywords, jdNormTokens, jobDescription, activeCategoryDefs]);

  const strongestDomain = React.useMemo(() => {
    if (!computedSkillRadarData.length) return null;
    return [...computedSkillRadarData]
      .filter(d => d.matchedList.length > 0)
      .sort((a, b) => b.candidate - a.candidate)[0] ?? null;
  }, [computedSkillRadarData]);

  const scopeDomain = React.useMemo(() => {
    if (!computedSkillRadarData.length) return null;
    return [...computedSkillRadarData]
      .filter(d => d.missingList.length > 0)
      .sort((a, b) => b.missingList.length - a.missingList.length)[0] ?? null;
  }, [computedSkillRadarData]);

  const atsCriteriaData = [
    { subject: 'Impact & Metrics', score: scoreBreakdown.impactMetricsScore || 60, fullMark: 100, description: 'Quantifiable bullet points with %, numbers & dollars' },
    { subject: 'Keyword Match', score: scoreBreakdown.keywordMatchScore || 70, fullMark: 100, description: 'Role-specific tech stack and ATS keyword overlap' },
    { subject: 'Action Verbs', score: scoreBreakdown.actionVerbsScore || 75, fullMark: 100, description: 'Strong past-tense power verbs leading bullet points' },
    { subject: 'Readability', score: scoreBreakdown.formattingReadabilityScore || 85, fullMark: 100, description: 'ATS-parseable fonts, clear line spacing, and structure' },
    { subject: 'Completeness', score: scoreBreakdown.sectionCompletenessScore || 90, fullMark: 100, description: 'Complete experience, education, skills, and summary headers' },
  ];

  return (
    <div className="card p-6 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-default text-base font-display">Skill Alignment & ATS Radar Matrix</h3>
          </div>
          <p className="text-xs text-secondary">
            {allCandidateSkills.length > 0
              ? `Mapped ${allCandidateSkills.length} detected skills across domain categories vs job requirements.`
              : 'Visual breakdown comparing candidate skills against job benchmarks.'}
          </p>
        </div>

        <div className="flex items-center p-1 surface-input rounded-xl border border-default self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('skills')}
            className={`nav-tab ${activeMode === 'skills' ? 'active' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill vs Job Alignment</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('ats')}
            className={`nav-tab ${activeMode === 'ats' ? 'active' : ''}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ATS Criteria Score</span>
          </button>
        </div>
      </div>

      {/* Core Strength & Growth Banners — Grid Alignment Fix */}
      {activeMode === 'skills' && (strongestDomain || scopeDomain) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strongestDomain && (
            <div className="p-4 rounded-xl surface-card border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-success flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>Core Technical Strength</span>
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {strongestDomain.candidate}% Mastery
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-default">{strongestDomain.subject}</h4>
              <p className="text-xs text-secondary leading-snug">{strongestDomain.description}</p>
              {strongestDomain.matchedList.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {strongestDomain.matchedList.slice(0, 6).map((sk, i) => (
                    <span key={i} className="badge badge-success">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {scopeDomain && (
            <div className="p-4 rounded-xl surface-card border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-primary flex items-center space-x-1">
                  <Rocket className="w-3 h-3 text-purple-400" />
                  <span>Highest Scope for Growth</span>
                </span>
                <span className="font-mono text-xs font-bold text-purple-400">
                  {scopeDomain.candidate}% Match
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-default">{scopeDomain.subject}</h4>
              <p className="text-xs text-secondary leading-snug">
                Acquiring missing skills in this domain unlocks the largest ATS match jump.
              </p>
              {scopeDomain.missingList.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {scopeDomain.missingList.slice(0, 5).map((sk, i) => (
                    <span key={i} className="badge badge-warning">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Missing: {sk}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Radar Chart & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 h-[320px] sm:h-[360px] w-full relative surface-card rounded-xl p-2 border border-default">
          <ResponsiveContainer width="100%" height="100%">
            {activeMode === 'skills' ? (
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={computedSkillRadarData}>
                <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as SkillCategoryRadarItem;
                      return (
                        <div className="surface-elevated text-default p-3 rounded-xl shadow-xl text-xs space-y-2 max-w-[280px] border border-default">
                          <p className="font-bold text-indigo-400 border-b border-subtle pb-1">{d.subject}</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-secondary">Your Match:</span>
                            <span className="font-bold text-emerald-400">{d.candidate}%</span>
                          </div>
                          {d.matchedList.length > 0 && (
                            <div>
                              <p className="text-emerald-400 font-bold text-[10px] mb-1">✓ Matched ({d.matchedList.length})</p>
                              <p className="text-[10px] text-secondary">{d.matchedList.slice(0, 6).join(', ')}</p>
                            </div>
                          )}
                          {d.missingList.length > 0 && (
                            <div>
                              <p className="text-rose-400 font-bold text-[10px] mb-1">✗ Missing ({d.missingList.length})</p>
                              <p className="text-[10px] text-muted">{d.missingList.slice(0, 4).join(', ')}</p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '8px' }} />
                <Radar name="Target Role Benchmark (100%)" dataKey="target" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeDasharray="4 4" />
                <Radar name="Your Candidate Skill Match" dataKey="candidate" stroke="#10b981" fill="#10b981" fillOpacity={0.4} dot={{ r: 4, fill: '#10b981' }} />
              </RadarChart>
            ) : (
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={atsCriteriaData}>
                <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="surface-elevated p-3 rounded-xl shadow-xl text-xs space-y-1 max-w-[220px] border border-default">
                          <p className="font-bold text-indigo-400">{d.subject}</p>
                          <p className="text-sm font-extrabold text-emerald-400">{d.score} / 100</p>
                          <p className="text-[11px] text-secondary">{d.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar name="ATS Criteria Score" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.45} dot={{ r: 4, fill: '#4f46e5' }} />
              </RadarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Detailed List */}
        <div className="lg:col-span-5 space-y-3 surface-card p-4 rounded-xl border border-default">
          <div className="flex items-center justify-between border-b border-subtle pb-2">
            <h4 className="text-xs font-bold text-default uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeMode === 'skills' ? 'Skill Match Breakdown' : 'ATS Performance'}</span>
            </h4>
            <span className="badge badge-primary">Score: {overallScore}%</span>
          </div>

          {activeMode === 'skills' ? (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {computedSkillRadarData.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-default surface-input space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-default">{item.subject}</span>
                    <span className={`font-mono font-bold text-right ${item.candidate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.candidate}%
                    </span>
                  </div>

                  <div className="progress-track">
                    <div className={`progress-fill ${item.candidate >= 80 ? 'progress-fill-success' : 'progress-fill-warning'}`} style={{ width: `${item.candidate}%` }} />
                  </div>

                  {item.matchedList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.matchedList.slice(0, 4).map((m, i) => (
                        <span key={i} className="badge badge-success">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>{m}</span>
                        </span>
                      ))}
                      {item.matchedList.length > 4 && (
                        <span className="text-[10px] text-muted font-bold">+{item.matchedList.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {atsCriteriaData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-default">
                    <span>{item.subject}</span>
                    <span className={`font-mono ${item.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="text-[10px] text-muted leading-tight">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-[11px] text-muted flex items-center space-x-1 border-t border-subtle">
            <Info className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <span>Mapped {allCandidateSkills.length} detected skills. Hover chart for details.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
