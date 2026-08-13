import { SideProjectOrAccomplishment } from '../types';

export interface OllamaModelInfo {
  name: string;
  size?: number;
  digest?: string;
}

export interface GenerateAccomplishmentParams {
  domain?: string;
  targetRole?: string;
  targetJobDescription?: string;
  currentSkills?: string[];
  modelName?: string;
}

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Fetch available installed models from local Ollama service.
 */
export async function getLocalOllamaModels(): Promise<OllamaModelInfo[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: any) => ({
      name: m.name,
      size: m.size,
      digest: m.digest,
    }));
  } catch (err) {
    console.warn('Ollama service check warning:', err);
    return [];
  }
}

/**
 * Pre-curated ServiceNow Accomplishments & Side Projects for instant alignment.
 */
export const SERVICENOW_CURATED_ACCOMPLISHMENTS: SideProjectOrAccomplishment[] = [
  {
    id: 'sn-spoke-01',
    title: 'ServiceNow IntegrationHub Custom Spoke for Enterprise Security & Octa Sync',
    category: 'ServiceNow Store App',
    description: 'Designed and developed a custom IntegrationHub Spoke utilizing REST API Web Services and OAuth2 authentication to automate employee provisioning and security role mapping directly within ServiceNow Workflow / Flow Designer.',
    technologies: ['ServiceNow Flow Designer', 'IntegrationHub', 'REST Web Services', 'OAuth2', 'GlideAPI', 'JavaScript'],
    link: 'https://github.com/servicenow-dev/enterprise-okta-spoke',
    impactMetrics: 'Automated 95% of identity provisioning requests, reducing manual SLA resolution time from 4 hours to 90 seconds.',
    domain: 'ServiceNow',
    date: '2024 - Present'
  },
  {
    id: 'sn-atf-02',
    title: 'Automated Test Framework (ATF) Regression Testing Suite for Service Catalog',
    category: 'Personal Lab',
    description: 'Built a modular, reusable ATF test framework covering 40+ Service Catalog items, RITM workflow approvals, and custom UI Policies to eliminate regression bugs during major platform family upgrades (Washington / Xanadu).',
    technologies: ['ServiceNow ATF (Automated Test Framework)', 'Service Catalog', 'Workflow', 'UI Policies', 'Client Scripts'],
    impactMetrics: 'Cut platform upgrade validation cycles from 3 weeks to 2 days while maintaining zero critical defects in production.',
    domain: 'ServiceNow',
    date: '2024'
  },
  {
    id: 'sn-community-03',
    title: 'ServiceNow Developer Community Contributor & Custom UI Builder Widgets',
    category: 'Community Work',
    description: 'Published open-source ServiceNow Service Portal widgets and Next Experience UI Builder components for real-time ticket escalation visualization and SLA threshold monitors.',
    technologies: ['ServiceNow Service Portal', 'UI Builder', 'Next Experience', 'AngularJS', 'GlideRecord', 'CSS3'],
    link: 'https://developer.servicenow.com/dev.do',
    impactMetrics: 'Downloaded by 1,200+ ServiceNow administrators across community developer forums.',
    domain: 'ServiceNow',
    date: '2023 - 2024'
  },
  {
    id: 'sn-ai-04',
    title: 'AI Incident Auto-Categorization & Root Cause Recommender',
    category: 'Side Project',
    description: 'Integrated local Ollama LLM and ServiceNow Predictive Intelligence APIs to automatically classify incoming IT Service Management (ITSM) incidents and generate recommended KB article solutions.',
    technologies: ['ServiceNow ITSM', 'Predictive Intelligence', 'Ollama LLM', 'Python', 'Scripted REST APIs'],
    impactMetrics: 'Boosted first-contact incident resolution (FCR) by 34% in lab benchmarks.',
    domain: 'ServiceNow',
    date: '2024'
  }
];

/**
 * Generate side projects and unlisted accomplishments using local Ollama LLM or domain fallback.
 */
export async function generateAccomplishmentsWithOllama(
  params: GenerateAccomplishmentParams
): Promise<SideProjectOrAccomplishment[]> {
  const {
    domain = 'ServiceNow',
    targetRole = 'ServiceNow Technical Architect',
    targetJobDescription = '',
    currentSkills = [],
    modelName = 'qwen2.5-coder:1.5b',
  } = params;

  // Try local Ollama LLM API first
  try {
    const prompt = `You are a Senior Talent Architect & Lead L&D Specialist.
Candidate Domain: ${domain}
Target Job Role: ${targetRole}
Target Job Description: ${targetJobDescription || 'Senior Architect / Lead position in ' + domain}
Current Skills: ${currentSkills.join(', ') || domain + ' development, architecture, workflows, APIs'}

Generate exactly 3 realistic, high-impact Side Projects, Open Source works, or Unlisted Accomplishments for this target role.
Return ONLY a valid JSON array of objects with keys:
- title (string)
- category (string, e.g. "ServiceNow Store App", "Side Project", "Open Source", "Personal Lab", "Community Work")
- description (string, detailed technical accomplishment)
- technologies (array of strings)
- impactMetrics (string, quantifying results like "% improvement", "reduced MTTR by X")
- domain (string)
- date (string, e.g. "2024")`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawContent = data?.message?.content || '';
      // Parse JSON out of markdown block if present
      const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: `ollama-${Date.now()}-${idx}`,
            title: item.title || `${domain} Custom Implementation`,
            category: item.category || 'Side Project',
            description: item.description || '',
            technologies: Array.isArray(item.technologies) ? item.technologies : [domain],
            impactMetrics: item.impactMetrics || 'Enhanced workflow efficiency and platform stability.',
            domain: item.domain || domain,
            date: item.date || '2024',
          }));
        }
      }
    }
  } catch (err) {
    console.warn('Ollama endpoint call failed or timed out, returning curated domain fallback:', err);
  }

  // Domain-specific fallbacks
  if (domain.toLowerCase().includes('servicenow') || targetRole.toLowerCase().includes('servicenow')) {
    return SERVICENOW_CURATED_ACCOMPLISHMENTS;
  }

  // General Tech Fallback
  return [
    {
      id: `gen-01-${Date.now()}`,
      title: `${targetRole || domain} Automated Workflow & API Spoke`,
      category: 'Side Project',
      description: `Architected a high-throughput automated workflow integration engine for ${domain}, connecting enterprise APIs with automated validation pipelines.`,
      technologies: [domain, 'REST API', 'JSON', 'Automation'],
      impactMetrics: 'Streamlined operational SLA execution time by 65%.',
      domain: domain,
      date: '2024',
    },
    {
      id: `gen-02-${Date.now()}`,
      title: 'Automated Testing & Regression Suite',
      category: 'Personal Lab',
      description: `Built an end-to-end automated testing suite designed to validate custom business logic, UI rules, and backend scripts prior to production deployments.`,
      technologies: ['Automated Testing', 'CI/CD', 'Quality Engineering'],
      impactMetrics: 'Achieved 99.4% release stability across version upgrades.',
      domain: domain,
      date: '2024',
    },
  ];
}

export interface SuggestedRoleOption {
  title: string;
  matchPercentage: number;
  timeframe: string;
  avgSalaryRange: string;
  description: string;
  focusModules: string[];
  keySkillsToStudy: string[];
}

export interface SuggestedProjectOption {
  id: string;
  title: string;
  focusModule: 'ITSM' | 'CMDB' | 'IntegrationHub' | 'Service Portal' | 'ITOM' | 'Custom Apps' | string;
  description: string;
  technologies: string[];
  difficulty: 'Intermediate' | 'Advanced' | 'Architect Level';
  impactMetrics: string;
  stepByStepMilestones: string[];
}

export interface ServiceNowAdvisorSuggestions {
  candidateDomain: string;
  currentSeniority: string;
  suggestedRoles: SuggestedRoleOption[];
  suggestedProjects: SuggestedProjectOption[];
}

export const SERVICENOW_CURATED_ROLES: SuggestedRoleOption[] = [
  {
    title: 'ServiceNow Technical Architect',
    matchPercentage: 92,
    timeframe: '6 - 12 Months',
    avgSalaryRange: '$165,000 - $220,000 TC',
    description: 'Lead enterprise ServiceNow architecture, IntegrationHub design, CMDB governance, and technical solution blueprints across ITSM, ITOM, and custom Scoped Apps.',
    focusModules: ['ITSM', 'CMDB', 'IntegrationHub', 'Flow Designer', 'Scoped Apps'],
    keySkillsToStudy: ['IntegrationHub Spoke Development', 'CMDB Health & Identification Reconciliation Engine (IRE)', 'Domain Separation', 'Scripted REST APIs'],
  },
  {
    title: 'ServiceNow CMDB & ITOM Solutions Lead',
    matchPercentage: 85,
    timeframe: '9 - 15 Months',
    avgSalaryRange: '$175,000 - $235,000 TC',
    description: 'Drive automated IT Infrastructure Discovery, Service Mapping, CMDB Health Dashboard policies, and Event Management rules for enterprise IT operations.',
    focusModules: ['CMDB', 'Discovery', 'Service Mapping', 'Event Management', 'ITOM'],
    keySkillsToStudy: ['Discovery Patterns', 'SNMP/WMI Scanners', 'Service Mapping', 'Event Management Alert Rules'],
  },
  {
    title: 'ServiceNow Custom App & Service Portal Developer',
    matchPercentage: 88,
    timeframe: '3 - 6 Months',
    avgSalaryRange: '$145,000 - $185,000 TC',
    description: 'Build modern Next Experience UI Builder workspaces, custom Service Portal widgets, and automated business workflows for Service Catalog fulfillment.',
    focusModules: ['Service Portal', 'UI Builder', 'Next Experience', 'Service Catalog', 'GlideAPI'],
    keySkillsToStudy: ['UI Builder Components', 'AngularJS / React in Portal', 'RESTful GlideRecord Web Services', 'ATF Suite'],
  },
];

export const SERVICENOW_CURATED_PROJECTS: SuggestedProjectOption[] = [
  {
    id: 'proj-cmdb-01',
    title: 'Enterprise CMDB Automated Health & IRE Reconciliation Engine',
    focusModule: 'CMDB',
    description: 'Implement a comprehensive CMDB health policy framework using Identification and Reconciliation Engine (IRE) rules, automated orphan CI cleanup scripts, and relationship mapping for server/database CIs.',
    technologies: ['ServiceNow CMDB', 'IRE Engine', 'Discovery', 'GlideRecord Scripting', 'Business Rules'],
    difficulty: 'Architect Level',
    impactMetrics: 'Achieved 98.5% CMDB accuracy score and reduced duplicate CIs by 92%.',
    stepByStepMilestones: [
      'Configure Identification & Reconciliation Rules (IRE) for Hardware & Software CIs',
      'Create Scheduled Jobs for CMDB Health Dashboard Orphan & Stale CI audits',
      'Build automated CI Relationship Mapper for Application-to-Server dependencies',
    ],
  },
  {
    id: 'proj-itsm-02',
    title: 'Automated Incident-to-RITM Router & SLA Escalation Spoke',
    focusModule: 'ITSM',
    description: 'Design a Flow Designer workflow that analyzes incoming ITSM incidents, auto-converts major recurring issues into Service Catalog Requested Items (RITM), and triggers SLA escalation alerts to Manager Slack/Teams channels.',
    technologies: ['ITSM (Incident/Problem/Change)', 'Flow Designer', 'IntegrationHub', 'REST Web Services'],
    difficulty: 'Intermediate',
    impactMetrics: 'Reduced incident MTTR by 45% and automated 90% of routine catalog requests.',
    stepByStepMilestones: [
      'Create Flow Designer trigger for P1/P2 Incident state transitions',
      'Configure Scripted REST API endpoint for external webhooks (Slack/Teams)',
      'Automate RITM creation and approval task assignment',
    ],
  },
  {
    id: 'proj-portal-03',
    title: 'Next Experience UI Builder Workspace & Real-Time Executive Dashboard',
    focusModule: 'Service Portal',
    description: 'Construct an executive Service Portal workspace featuring custom data visualization widgets for active RITM progress, SLA burn-down charts, and 1-click catalog item requests.',
    technologies: ['Service Portal', 'Next Experience UI Builder', 'JavaScript', 'CSS3', 'GlideAggregate'],
    difficulty: 'Intermediate',
    impactMetrics: 'Increased portal self-service adoption by 60% across 5,000+ enterprise users.',
    stepByStepMilestones: [
      'Design Responsive Layout in Next Experience UI Builder',
      'Build custom Data Resources using GlideAggregate script APIs',
      'Embed real-time SLA progress bar components and quick-request buttons',
    ],
  },
  {
    id: 'proj-hub-04',
    title: 'ServiceNow IntegrationHub Multi-System Sync Spoke (Jira & GitHub)',
    focusModule: 'IntegrationHub',
    description: 'Develop a custom IntegrationHub Spoke utilizing OAuth2 authentication to perform 2-way bi-directional synchronization between ServiceNow Change Requests and Jira/GitHub release deployments.',
    technologies: ['IntegrationHub', 'OAuth2', 'REST Web Services', 'Scripted REST APIs', 'Flow Designer'],
    difficulty: 'Advanced',
    impactMetrics: 'Eliminated manual change logging overhead and accelerated CI/CD release velocity by 3x.',
    stepByStepMilestones: [
      'Create IntegrationHub OAuth2 Connection & Credential Alias',
      'Build Custom Action Definition for Jira Issue creation & GitHub PR sync',
      'Hook Action into ServiceNow Change Management approval flow',
    ],
  },
];

/**
 * Call Ollama LLM to dynamically suggest target roles and hands-on projects (ITSM, CMDB, IntegrationHub, Service Portal)
 * tailored to candidate's exact experience.
 */
export async function suggestRolesAndProjectsWithOllama(params: {
  candidateDomain?: string;
  experienceText?: string;
  currentSkills?: string[];
  modelName?: string;
}): Promise<ServiceNowAdvisorSuggestions> {
  const { candidateDomain = 'ServiceNow', experienceText = '', currentSkills = [], modelName = 'qwen2.5-coder:1.5b' } = params;

  try {
    const prompt = `You are a Senior ServiceNow Lead Architect & Career Advisor.
Analyze candidate experience text: "${experienceText.slice(0, 1200) || 'ServiceNow Developer with 5 years experience in ITSM, Flow Designer, ATF, Service Catalog, UI Actions, Client Scripts'}"
Candidate Skills: ${currentSkills.join(', ') || 'ServiceNow, ITSM, Flow Designer, ATF, Service Catalog'}

Suggest:
1. 3 target future roles (with title, matchPercentage, timeframe, avgSalaryRange, description, focusModules (array), keySkillsToStudy (array)).
2. 4 hands-on ServiceNow projects focused on ITSM, CMDB, IntegrationHub, and Service Portal (with title, focusModule, description, technologies (array), difficulty, impactMetrics, stepByStepMilestones (array)).

Return ONLY a valid JSON object with keys: candidateDomain, currentSeniority, suggestedRoles, suggestedProjects.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawContent = data?.message?.content || '';
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.suggestedRoles && parsed.suggestedProjects) {
          return {
            candidateDomain: parsed.candidateDomain || candidateDomain,
            currentSeniority: parsed.currentSeniority || 'ServiceNow Developer / Lead Analyst',
            suggestedRoles: parsed.suggestedRoles,
            suggestedProjects: parsed.suggestedProjects,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Ollama role/project suggestion call failed, returning curated ServiceNow advisor fallback:', err);
  }

  return {
    candidateDomain: candidateDomain,
    currentSeniority: 'ServiceNow Developer (5+ YoE)',
    suggestedRoles: SERVICENOW_CURATED_ROLES,
    suggestedProjects: SERVICENOW_CURATED_PROJECTS,
  };
}
