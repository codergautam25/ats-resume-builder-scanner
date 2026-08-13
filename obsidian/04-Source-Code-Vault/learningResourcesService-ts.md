---
date: 2026-08-13
type: source-code
project: ATS-ResumAI
author: Antigravity AI Architect
tags: [obsidian-vault, resumai, source-code]
---
# learningResourcesService.ts - Free L&D Registry

```typescript
/**
 * Learning Resources Service
 * Multi-source free learning resource resolver — no API keys required.
 * Sources: YouTube search deep links, GitHub API (60 req/hr, no auth),
 * freeCodeCamp, roadmap.sh, official documentation registries, Ollama LLM.
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

export interface LearningResource {
  id: string;
  type: 'youtube_search' | 'official_doc' | 'github_repo' | 'freecodecamp' | 'roadmap_sh' | 'ollama_generated' | 'platform_course' | 'community';
  title: string;
  url: string;
  duration?: string;
  isFree: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  description: string;
  tags: string[];
}

export interface OllamaStudyPlan {
  candidateName: string;
  domain: string;
  targetRole: string;
  weeks: Array<{
    week: string;
    focus: string;
    dailyTasks: string[];
    milestone: string;
  }>;
  rawText: string;
}

// ─── YouTube Search Deep-link Builder ─────────────────────────────────────────
function ytSearch(query: string, label: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate', tags: string[] = []): LearningResource {
  const q = encodeURIComponent(query);
  return {
    id: `yt-${q}`,
    type: 'youtube_search',
    title: `YouTube: ${label}`,
    url: `https://www.youtube.com/results?search_query=${q}`,
    isFree: true,
    difficulty,
    source: 'YouTube',
    description: `Search YouTube for top-rated "${label}" tutorials. Filter by "This year" for latest content.`,
    tags,
  };
}

function officialDoc(title: string, url: string, description: string, tags: string[], difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'): LearningResource {
  return {
    id: `doc-${url.replace(/[^a-z0-9]/gi, '-').slice(0, 40)}`,
    type: 'official_doc',
    title,
    url,
    isFree: true,
    difficulty,
    source: 'Official Documentation',
    description,
    tags,
  };
}

function platformCourse(title: string, url: string, source: string, description: string, duration: string, tags: string[], difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'): LearningResource {
  return {
    id: `course-${source.toLowerCase().replace(/\s/g, '-')}-${title.slice(0, 20).replace(/\s/g, '-')}`,
    type: 'platform_course',
    title,
    url,
    duration,
    isFree: true,
    difficulty,
    source,
    description,
    tags,
  };
}

function communityLink(title: string, url: string, source: string, description: string, tags: string[]): LearningResource {
  return {
    id: `community-${url.replace(/[^a-z0-9]/gi, '-').slice(0, 40)}`,
    type: 'community',
    title,
    url,
    isFree: true,
    difficulty: 'Intermediate',
    source,
    description,
    tags,
  };
}

// ─── Curated Free Learning Resource Registry ──────────────────────────────────
// Maps skill name keywords → array of LearningResources
const CURATED_REGISTRY: Record<string, LearningResource[]> = {

  // ══════════════════════════════════════════════════
  //  SERVICENOW SKILLS
  // ══════════════════════════════════════════════════
  'integration hub': [
    officialDoc(
      'ServiceNow Integration Hub — Official Docs',
      'https://docs.servicenow.com/bundle/utah-application-development/page/administer/integrationhub/concept/integrationhub-overview.html',
      'Complete Integration Hub docs covering spokes, actions, triggers, and OAuth2 flow configuration.',
      ['servicenow', 'integration', 'spoke', 'api'],
      'Intermediate'
    ),
    platformCourse(
      'Integration Hub Fundamentals — NowLearning',
      'https://nowlearning.servicenow.com/lxp/en/pages/learning-detail?id=learning_path&path_id=1&spa=1',
      'ServiceNow NowLearning',
      'Free official ServiceNow learning path covering Integration Hub spokes, actions, and enterprise integration patterns.',
      '15 Hours',
      ['servicenow', 'integration', 'free-official'],
      'Intermediate'
    ),
    ytSearch('servicenow integration hub spoke tutorial 2024', 'ServiceNow Integration Hub Spoke Tutorial', 'Intermediate', ['servicenow', 'integration hub']),
    communityLink(
      'ServiceNow Developer Community — Integration Hub',
      'https://developer.servicenow.com/dev.do#!/reference/api/tokyo/server',
      'ServiceNow Developer Portal',
      'Free community resources, code snippets, and developer documentation for Integration Hub.',
      ['servicenow', 'developer', 'community']
    ),
  ],

  'cmdb': [
    officialDoc(
      'ServiceNow CMDB — Official Docs & Health Policies',
      'https://docs.servicenow.com/bundle/utah-it-operations-management/page/product/cmdb/concept/c_CMDBoverview.html',
      'Complete CMDB documentation covering CI class model, IRE reconciliation, CMDB Health Dashboard, and service mapping.',
      ['servicenow', 'cmdb', 'ire', 'discovery'],
      'Advanced'
    ),
    platformCourse(
      'CMDB Health & Service Graph Architecture',
      'https://nowlearning.servicenow.com/lxp/en/pages/learning-detail?id=course_detail&course_id=CMDB_FUND',
      'ServiceNow NowLearning',
      'Official free course on CMDB health policies, duplicate CI removal, and Identification Reconciliation Engine (IRE).',
      '12 Hours',
      ['servicenow', 'cmdb', 'ire'],
      'Advanced'
    ),
    ytSearch('servicenow cmdb tutorial identification reconciliation', 'ServiceNow CMDB IRE Tutorial', 'Advanced', ['servicenow', 'cmdb']),
    ytSearch('servicenow discovery cmdb service mapping', 'ServiceNow Discovery & Service Mapping', 'Advanced', ['servicenow', 'discovery']),
  ],

  'atf': [
    officialDoc(
      'ServiceNow ATF — Automated Test Framework Docs',
      'https://docs.servicenow.com/bundle/utah-application-development/page/build/automated-test-framework/concept/automated-test-framework.html',
      'Official ATF documentation covering test suites, test runners, record-level assertions, and CI/CD pipeline integration.',
      ['servicenow', 'atf', 'testing', 'cicd'],
      'Intermediate'
    ),
    platformCourse(
      'ATF Masterclass: Automated Testing in ServiceNow',
      'https://nowlearning.servicenow.com',
      'ServiceNow NowLearning',
      'Official training on designing ATF test suites, running automated regression tests, and integrating with CI/CD pipelines.',
      '10 Hours',
      ['servicenow', 'atf', 'testing'],
      'Intermediate'
    ),
    ytSearch('servicenow automated test framework ATF tutorial CI/CD', 'ServiceNow ATF CI/CD Pipeline Tutorial', 'Intermediate', ['servicenow', 'atf', 'testing']),
  ],

  'flow designer': [
    officialDoc(
      'ServiceNow Flow Designer — Official Docs',
      'https://docs.servicenow.com/bundle/utah-build-workflows/page/administer/flow-designer/concept/flow-designer.html',
      'Complete Flow Designer documentation covering triggers, actions, spokes, and enterprise workflow automation patterns.',
      ['servicenow', 'flow designer', 'workflow'],
      'Intermediate'
    ),
    ytSearch('servicenow flow designer tutorial 2024', 'ServiceNow Flow Designer Tutorial', 'Beginner', ['servicenow', 'flow designer']),
    ytSearch('servicenow flow designer advanced subflows actions', 'ServiceNow Flow Designer Advanced', 'Advanced', ['servicenow', 'flow designer']),
    platformCourse(
      'Flow Designer Core Concepts',
      'https://developer.servicenow.com/dev.do#!/learn/learning-plans/utah/new_to_servicenow/app_store_learnv2_buildingapps_utah_flowdesignercoreconcepts',
      'ServiceNow Developer Portal',
      'Free official learning plan covering Flow Designer triggers, conditions, and reusable subflows for enterprise automation.',
      '8 Hours',
      ['servicenow', 'flow designer'],
      'Beginner'
    ),
  ],

  'glide': [
    officialDoc(
      'GlideRecord API — ServiceNow Developer Reference',
      'https://developer.servicenow.com/dev.do#!/reference/api/tokyo/server/no-namespace/c_GlideRecordScopedAPI',
      'Complete GlideRecord Scoped API reference for server-side scripting, Business Rules, and Script Includes.',
      ['servicenow', 'glide', 'scripting', 'api'],
      'Intermediate'
    ),
    ytSearch('servicenow glide record scripted rest api tutorial', 'ServiceNow GlideRecord & Scripted REST API', 'Intermediate', ['servicenow', 'scripting']),
    communityLink(
      'ServiceNow Developer Portal — Script Learning Path',
      'https://developer.servicenow.com/dev.do#!/learn/learning-plans',
      'ServiceNow Developer Portal',
      'Free scripting learning paths covering Business Rules, Client Scripts, UI Actions, GlideRecord, and REST APIs.',
      ['servicenow', 'scripting', 'glide']
    ),
  ],

  'service portal': [
    officialDoc(
      'Next Experience UI Builder — ServiceNow Docs',
      'https://docs.servicenow.com/bundle/utah-next-experience/page/administer/next-experience-ui-builder/concept/next-experience-ui-builder-overview.html',
      'Official Next Experience UI Builder documentation covering components, data resources, client state parameters, and workspace design.',
      ['servicenow', 'service portal', 'ui builder', 'next experience'],
      'Advanced'
    ),
    ytSearch('servicenow next experience UI builder workspace tutorial 2024', 'ServiceNow Next Experience UI Builder', 'Advanced', ['servicenow', 'ui builder']),
    ytSearch('servicenow service portal widget tutorial AngularJS', 'ServiceNow Service Portal Widget Tutorial', 'Intermediate', ['servicenow', 'service portal']),
    platformCourse(
      'Next Experience UI Builder — NowLearning',
      'https://nowlearning.servicenow.com',
      'ServiceNow NowLearning',
      'Official free training on building responsive workspaces, custom components, and UX flows using Next Experience UI Builder.',
      '14 Hours',
      ['servicenow', 'ui builder'],
      'Advanced'
    ),
  ],

  // ══════════════════════════════════════════════════
  //  DATA ENGINEERING SKILLS
  // ══════════════════════════════════════════════════
  'flink': [
    officialDoc(
      'Apache Flink Official Documentation',
      'https://flink.apache.org/docs/stable/',
      'Complete Apache Flink docs covering DataStream API, stateful functions, windowing, and Flink SQL for stream processing.',
      ['flink', 'streaming', 'java', 'python'],
      'Advanced'
    ),
    platformCourse(
      'Apache Flink Training — Official Free Course',
      'https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/overview/',
      'Apache Flink Project',
      'Free official Flink training covering DataStream API, stateful computations, and event time processing.',
      '20 Hours',
      ['flink', 'streaming'],
      'Advanced'
    ),
    ytSearch('apache flink tutorial java python 2024', 'Apache Flink Tutorial 2024', 'Advanced', ['flink', 'streaming']),
    communityLink(
      'Awesome Apache Flink — GitHub',
      'https://github.com/wuchong/awesome-flink',
      'GitHub Community',
      'Curated list of awesome Apache Flink frameworks, libraries, and resources.',
      ['flink', 'github', 'awesome-list']
    ),
  ],

  'delta lake': [
    officialDoc(
      'Delta Lake Documentation',
      'https://docs.delta.io/latest/index.html',
      'Official Delta Lake docs covering ACID transactions, time travel, Z-ordering, and PySpark integration.',
      ['delta lake', 'databricks', 'pyspark', 'spark'],
      'Intermediate'
    ),
    platformCourse(
      'Databricks Academy — Free Courses',
      'https://www.databricks.com/learn/training/home',
      'Databricks Academy',
      'Free Databricks courses on Delta Lake architecture, PySpark optimization, Unity Catalog, and Lakehouse patterns.',
      '20 Hours',
      ['databricks', 'delta lake', 'pyspark'],
      'Intermediate'
    ),
    ytSearch('databricks delta lake pyspark tutorial 2024', 'Databricks Delta Lake Tutorial', 'Intermediate', ['delta lake', 'databricks']),
  ],

  'terraform': [
    officialDoc(
      'Terraform Documentation — HashiCorp',
      'https://developer.hashicorp.com/terraform/docs',
      'Complete Terraform docs covering providers, modules, state management, and AWS/GCP/Azure resource provisioning.',
      ['terraform', 'iac', 'aws', 'devops'],
      'Intermediate'
    ),
    platformCourse(
      'HashiCorp Learn — Free Terraform Tutorials',
      'https://developer.hashicorp.com/terraform/tutorials',
      'HashiCorp Learn',
      'Free official Terraform tutorials covering AWS, GCP, Azure, and module development with hands-on labs.',
      '12 Hours',
      ['terraform', 'iac', 'aws'],
      'Intermediate'
    ),
    ytSearch('terraform aws tutorial 2024 for beginners', 'Terraform AWS Tutorial 2024', 'Intermediate', ['terraform', 'aws', 'iac']),
    communityLink(
      'Awesome Terraform — GitHub',
      'https://github.com/shuaibiyy/awesome-terraform',
      'GitHub Community',
      'Curated list of Terraform modules, tools, and learning resources.',
      ['terraform', 'github', 'awesome-list']
    ),
  ],

  'kafka': [
    officialDoc(
      'Apache Kafka Documentation',
      'https://kafka.apache.org/documentation/',
      'Official Apache Kafka docs covering brokers, producers, consumers, Kafka Streams, and Schema Registry.',
      ['kafka', 'streaming', 'avro', 'schema registry'],
      'Intermediate'
    ),
    platformCourse(
      'Confluent Developer Free Courses',
      'https://developer.confluent.io/courses/',
      'Confluent Developer',
      'Free hands-on Kafka courses: Kafka Fundamentals, Schema Registry, Kafka Streams, ksqlDB, and CDC with Debezium.',
      '25 Hours',
      ['kafka', 'confluent', 'schema registry'],
      'Intermediate'
    ),
    ytSearch('apache kafka tutorial for beginners 2024', 'Apache Kafka Tutorial', 'Beginner', ['kafka', 'streaming']),
  ],

  'pyspark': [
    officialDoc(
      'PySpark API Documentation — Apache Spark',
      'https://spark.apache.org/docs/latest/api/python/index.html',
      'Complete PySpark API reference covering DataFrames, SparkSQL, MLlib, Structured Streaming, and GraphX.',
      ['pyspark', 'spark', 'python', 'data engineering'],
      'Intermediate'
    ),
    platformCourse(
      'freeCodeCamp — Data Analysis with Python',
      'https://www.freecodecamp.org/learn/data-analysis-with-python/',
      'freeCodeCamp',
      'Free Python data analysis curriculum covering NumPy, Pandas, and Matplotlib as foundation for PySpark.',
      '15 Hours',
      ['python', 'data analysis', 'free'],
      'Beginner'
    ),
    ytSearch('pyspark tutorial for beginners 2024 python', 'PySpark Tutorial for Beginners', 'Intermediate', ['pyspark', 'spark', 'python']),
  ],

  'opentelemetry': [
    officialDoc(
      'OpenTelemetry Documentation',
      'https://opentelemetry.io/docs/',
      'Official OpenTelemetry docs covering instrumentation, collectors, exporters, and observability pipelines for metrics/traces/logs.',
      ['opentelemetry', 'observability', 'tracing', 'metrics'],
      'Intermediate'
    ),
    ytSearch('opentelemetry tutorial python 2024 distributed tracing', 'OpenTelemetry Tutorial Python', 'Intermediate', ['opentelemetry', 'observability']),
    communityLink(
      'CNCF Observability Resources',
      'https://www.cncf.io/projects/opentelemetry/',
      'CNCF',
      'OpenTelemetry project page with community resources, SIGs, and official adopter guides.',
      ['opentelemetry', 'cncf', 'observability']
    ),
  ],

  // ══════════════════════════════════════════════════
  //  CLOUD / DEVOPS SKILLS
  // ══════════════════════════════════════════════════
  'kubernetes': [
    officialDoc(
      'Kubernetes Official Documentation',
      'https://kubernetes.io/docs/home/',
      'Official Kubernetes docs covering pods, deployments, services, RBAC, Helm, and production cluster management.',
      ['kubernetes', 'k8s', 'cloud', 'devops'],
      'Intermediate'
    ),
    platformCourse(
      'CNCF Free Kubernetes Training',
      'https://training.linuxfoundation.org/resources/free-courses/',
      'Linux Foundation / CNCF',
      'Free official Kubernetes training courses including Introduction to Kubernetes (LFS158) on edX.',
      '20 Hours',
      ['kubernetes', 'k8s', 'cncf', 'free'],
      'Beginner'
    ),
    platformCourse(
      'Killer.sh — CKA/CKAD Simulator Practice',
      'https://killer.sh',
      'Killer.sh',
      'Free simulator sessions for Certified Kubernetes Administrator (CKA) exam with realistic lab environments.',
      '15 Hours',
      ['kubernetes', 'cka', 'certification'],
      'Advanced'
    ),
    ytSearch('kubernetes tutorial for beginners 2024 k8s', 'Kubernetes Tutorial for Beginners 2024', 'Beginner', ['kubernetes', 'k8s']),
    communityLink(
      'roadmap.sh/devops — DevOps Skill Map',
      'https://roadmap.sh/devops',
      'roadmap.sh',
      'Community-driven visual DevOps roadmap showing all skills from beginner to expert, with resource links.',
      ['kubernetes', 'devops', 'roadmap']
    ),
  ],

  'docker': [
    officialDoc(
      'Docker Official Documentation',
      'https://docs.docker.com/get-started/',
      'Complete Docker docs covering images, containers, Compose, networking, volumes, and Docker Registry patterns.',
      ['docker', 'containers', 'devops'],
      'Beginner'
    ),
    platformCourse(
      'Play with Docker — Free Hands-on Labs',
      'https://labs.play-with-docker.com/',
      'Play with Docker',
      'Free browser-based Docker lab environment — no installation needed. Practice Dockerfile, Compose, Swarm in real containers.',
      'Self-paced',
      ['docker', 'containers', 'labs'],
      'Beginner'
    ),
    ytSearch('docker tutorial for beginners 2024 full course', 'Docker Tutorial for Beginners', 'Beginner', ['docker', 'containers']),
    communityLink(
      'roadmap.sh/docker',
      'https://roadmap.sh/docker',
      'roadmap.sh',
      'Visual Docker skill roadmap from beginner to production-grade containerization.',
      ['docker', 'roadmap']
    ),
  ],

  'aws': [
    platformCourse(
      'AWS Skill Builder — Free Tier (600+ Courses)',
      'https://skillbuilder.aws',
      'AWS Skill Builder',
      'Free AWS training platform with 600+ courses including AWS Cloud Practitioner Essentials, Solutions Architect, and Well-Architected.',
      'Self-paced',
      ['aws', 'cloud', 'certification'],
      'Beginner'
    ),
    officialDoc(
      'AWS Well-Architected Framework',
      'https://aws.amazon.com/architecture/well-architected/',
      'Free AWS architecture best practices guide covering the 6 pillars: reliability, security, performance, cost, sustainability, and operations.',
      ['aws', 'architecture', 'well-architected'],
      'Intermediate'
    ),
    ytSearch('aws solutions architect tutorial 2024 full course', 'AWS Solutions Architect Tutorial 2024', 'Intermediate', ['aws', 'cloud', 'solutions architect']),
  ],

  // ══════════════════════════════════════════════════
  //  AI / ML SKILLS
  // ══════════════════════════════════════════════════
  'llm': [
    platformCourse(
      'DeepLearning.AI Short Courses — Free',
      'https://www.deeplearning.ai/short-courses/',
      'DeepLearning.AI',
      'Free 1-2 hour short courses on LangChain, RAG, Function Calling, Vector DBs, LLM Ops — industry-leading curriculum by Andrew Ng.',
      '1-2 Hours each',
      ['llm', 'ai', 'langchain', 'rag'],
      'Intermediate'
    ),
    officialDoc(
      'LangChain Documentation',
      'https://python.langchain.com/docs/get_started/introduction',
      'Complete LangChain docs covering chains, agents, RAG pipelines, tools, and LLM integration patterns.',
      ['langchain', 'llm', 'rag', 'agents'],
      'Intermediate'
    ),
    ytSearch('LLM RAG tutorial langchain 2024 python', 'LangChain RAG Tutorial 2024', 'Intermediate', ['llm', 'langchain', 'rag']),
  ],

  'vector database': [
    officialDoc(
      'Qdrant Vector Database Documentation',
      'https://qdrant.tech/documentation/',
      'Free, open-source vector database docs covering collections, search, filtering, and hybrid search patterns.',
      ['vector database', 'qdrant', 'embeddings', 'ai'],
      'Intermediate'
    ),
    ytSearch('vector database qdrant tutorial python 2024', 'Qdrant Vector Database Tutorial', 'Intermediate', ['vector db', 'embeddings']),
  ],

  // ══════════════════════════════════════════════════
  //  GENERAL PROGRAMMING SKILLS
  // ══════════════════════════════════════════════════
  'python': [
    platformCourse(
      'freeCodeCamp — Scientific Computing with Python',
      'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
      'freeCodeCamp',
      'Free Python curriculum covering data structures, OOP, algorithms, file I/O, and libraries like NumPy and Pandas.',
      '40 Hours',
      ['python', 'free', 'beginner'],
      'Beginner'
    ),
    officialDoc(
      'Python Official Tutorial',
      'https://docs.python.org/3/tutorial/',
      'Official Python 3 tutorial covering all core language features, standard library, and best practices.',
      ['python', 'official'],
      'Beginner'
    ),
    platformCourse(
      'Real Python Tutorials',
      'https://realpython.com',
      'Real Python',
      'Free Python tutorials covering web dev, data science, automation, testing, and advanced Python patterns.',
      'Self-paced',
      ['python', 'tutorials'],
      'Intermediate'
    ),
    communityLink(
      'roadmap.sh/python',
      'https://roadmap.sh/python',
      'roadmap.sh',
      'Community-driven Python skill roadmap from beginner to expert level.',
      ['python', 'roadmap']
    ),
  ],
};

// ─── getRoadmapShLink ─────────────────────────────────────────────────────────
export function getRoadmapShLink(domain: string): string | null {
  const d = domain.toLowerCase();
  if (d.includes('data engineering') || d.includes('pyspark') || d.includes('kafka')) return 'https://roadmap.sh/data-engineering';
  if (d.includes('devops') || d.includes('kubernetes') || d.includes('cloud')) return 'https://roadmap.sh/devops';
  if (d.includes('full stack') || d.includes('fullstack')) return 'https://roadmap.sh/full-stack';
  if (d.includes('python')) return 'https://roadmap.sh/python';
  if (d.includes('ai') || d.includes('ml')) return 'https://roadmap.sh/ai-engineer';
  if (d.includes('backend')) return 'https://roadmap.sh/backend';
  if (d.includes('servicenow')) return null; // Not on roadmap.sh
  return null;
}

// ─── getResourcesForSkill ─────────────────────────────────────────────────────
export function getResourcesForSkill(skillName: string): LearningResource[] {
  const lc = skillName.toLowerCase();

  // Try exact/partial registry match
  const matched: LearningResource[] = [];
  for (const [key, resources] of Object.entries(CURATED_REGISTRY)) {
    if (lc.includes(key) || key.split(' ').some(w => lc.includes(w) && w.length > 4)) {
      matched.push(...resources);
    }
  }

  if (matched.length > 0) {
    // Dedupe by id
    const seen = new Set<string>();
    return matched.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; }).slice(0, 6);
  }

  // Fallback: generate YouTube search link + GitHub search + roadmap.sh
  const searchQuery = skillName.toLowerCase().replace(/\s+/g, '+') + '+tutorial+2024';
  return [
    ytSearch(`${skillName} tutorial 2024`, `${skillName} Tutorial`, 'Intermediate', [skillName.toLowerCase()]),
    {
      id: `gh-${skillName.replace(/\s/g, '-')}`,
      type: 'github_repo',
      title: `GitHub: Search "awesome ${skillName}"`,
      url: `https://github.com/search?q=awesome+${encodeURIComponent(skillName)}&type=repositories&sort=stars`,
      isFree: true,
      difficulty: 'Intermediate',
      source: 'GitHub',
      description: `Find community-curated awesome lists and learning repositories for ${skillName}.`,
      tags: [skillName.toLowerCase(), 'github'],
    },
    {
      id: `roadmap-${skillName.replace(/\s/g, '-')}`,
      type: 'roadmap_sh',
      title: 'roadmap.sh — Skill Roadmaps',
      url: 'https://roadmap.sh',
      isFree: true,
      difficulty: 'Beginner',
      source: 'roadmap.sh',
      description: `Browse community-driven roadmaps to find the best learning path for ${skillName}.`,
      tags: ['roadmap', skillName.toLowerCase()],
    },
  ];
}

// ─── fetchGitHubLearningRepos ─────────────────────────────────────────────────
export async function fetchGitHubLearningRepos(skill: string): Promise<LearningResource[]> {
  try {
    const q = encodeURIComponent(`awesome ${skill} learn`);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${q}&sort=stars&per_page=3`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((repo: any): LearningResource => ({
      id: `gh-repo-${repo.id}`,
      type: 'github_repo',
      title: `⭐ ${repo.full_name} (${(repo.stargazers_count / 1000).toFixed(1)}k stars)`,
      url: repo.html_url,
      isFree: true,
      difficulty: 'Intermediate',
      source: 'GitHub',
      description: repo.description || `Curated list of awesome ${skill} resources and tools.`,
      tags: [skill.toLowerCase(), 'github', 'awesome-list'],
    }));
  } catch {
    return [];
  }
}

// ─── generatePersonalizedStudyPlanWithOllama ─────────────────────────────────
export async function generatePersonalizedStudyPlanWithOllama(params: {
  candidateName: string;
  domain: string;
  skillsToStudy: string[];
  currentLevel: string;
  targetRole: string;
  modelName?: string;
}): Promise<OllamaStudyPlan> {
  const { candidateName, domain, skillsToStudy, currentLevel, targetRole, modelName = 'qwen2.5-coder:1.5b' } = params;

  const prompt = `You are a Senior L&D Lead Architect. Create a personalized 30-day learning plan.
Candidate: ${candidateName}, Domain: ${domain}, Current Level: ${currentLevel}, Target Role: ${targetRole}
Skills to master: ${skillsToStudy.join(', ')}

Return ONLY a valid JSON object with this structure:
{
  "weeks": [
    { "week": "Week 1 (Day 1-7)", "focus": "Topic name", "dailyTasks": ["Task 1", "Task 2", "Task 3"], "milestone": "What they achieve" },
    { "week": "Week 2 (Day 8-14)", "focus": "Topic name", "dailyTasks": ["Task 1", "Task 2", "Task 3"], "milestone": "What they achieve" },
    { "week": "Week 3 (Day 15-21)", "focus": "Topic name", "dailyTasks": ["Task 1", "Task 2", "Task 3"], "milestone": "What they achieve" },
    { "week": "Week 4 (Day 22-30)", "focus": "Topic name", "dailyTasks": ["Task 1", "Task 2", "Task 3"], "milestone": "What they achieve" }
  ]
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

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
      const rawText = data?.message?.content || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.weeks && Array.isArray(parsed.weeks)) {
          return { candidateName, domain, targetRole, weeks: parsed.weeks, rawText };
        }
      }
    }
  } catch (err) {
    console.warn('Ollama study plan generation failed, using fallback:', err);
  }

  // Fallback static plan
  return {
    candidateName,
    domain,
    targetRole,
    rawText: '',
    weeks: [
      {
        week: 'Week 1 (Day 1-7)',
        focus: skillsToStudy[0] || 'Core Foundations',
        dailyTasks: [
          `Study official documentation for ${skillsToStudy[0] || 'primary skill'}`,
          'Complete 1 hands-on tutorial from the resources listed below',
          'Build a small proof-of-concept project',
        ],
        milestone: `Understand core concepts and architecture of ${skillsToStudy[0] || domain}`,
      },
      {
        week: 'Week 2 (Day 8-14)',
        focus: skillsToStudy[1] || 'Intermediate Patterns',
        dailyTasks: [
          `Deep-dive into ${skillsToStudy[1] || 'intermediate patterns'} via YouTube tutorials`,
          'Complete a full project integrating both Week 1 and Week 2 skills',
          'Write a technical summary of what you learned and add it to your GitHub',
        ],
        milestone: `Complete an end-to-end project using ${skillsToStudy.slice(0, 2).join(' + ')}`,
      },
      {
        week: 'Week 3 (Day 15-21)',
        focus: skillsToStudy[2] || 'Advanced Applications',
        dailyTasks: [
          'Study advanced certification prep materials',
          `Build a portfolio project showcasing ${targetRole} skills`,
          'Practice mock interview questions on core concepts',
        ],
        milestone: `Ready for ${targetRole} technical screening rounds`,
      },
      {
        week: 'Week 4 (Day 22-30)',
        focus: 'Resume & Interview Preparation',
        dailyTasks: [
          'Update resume with all newly acquired skills and projects',
          'Apply to 5 target companies for the target role',
          'Conduct 2 mock technical interviews with peers',
        ],
        milestone: `Submit applications for ${targetRole} positions with confidence`,
      },
    ],
  };
}

```
