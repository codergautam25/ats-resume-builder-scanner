import { ResumeData } from '../types';

export interface AutofillResult {
  updatedResume: ResumeData;
  targetType: 'experience' | 'project';
  targetTitle: string;
  injectedBullet: string;
}

export function autofillKeywordIntoResume(resumeData: ResumeData, keyword: string): AutofillResult {
  const cleanKeyword = keyword.trim();
  const expList = resumeData.experience || [];
  const projList = resumeData.projects || [];

  const kwLower = cleanKeyword.toLowerCase();

  // Keyword Domain Categorization
  const isDevOps = /docker|kubernetes|aws|azure|gcp|terraform|ci\/cd|jenkins|ansible|cloud|devops|helm|prometheus|grafana/i.test(kwLower);
  const isFrontend = /react|vue|angular|next|typescript|javascript|tailwind|css|html|redux|webpack|ui|ux|frontend/i.test(kwLower);
  const isBackend = /node|express|python|java|spring|golang|c\+\+|c#|\.net|ruby|php|graphql|rest|microservices|backend/i.test(kwLower);
  const isDatabase = /sql|postgres|mysql|mongodb|redis|dynamodb|elasticsearch|cassandra|oracle|database/i.test(kwLower);
  const isDataAI = /pandas|numpy|pytorch|tensorflow|scikit|spark|hadoop|tableau|power bi|machine learning|ai|llm/i.test(kwLower);

  // Score Experience entries
  let bestExpIndex = -1;
  let bestProjIndex = -1;
  let highestScore = -1;

  expList.forEach((exp, idx) => {
    let score = 0;
    const posLower = (exp.position || '').toLowerCase();
    const bulletsText = (exp.highlights || []).join(' ').toLowerCase();

    if (isDevOps && (posLower.includes('devops') || posLower.includes('cloud') || posLower.includes('infrastructure') || bulletsText.includes('deploy'))) score += 10;
    if (isFrontend && (posLower.includes('frontend') || posLower.includes('ui') || posLower.includes('web') || posLower.includes('full stack'))) score += 10;
    if (isBackend && (posLower.includes('backend') || posLower.includes('api') || posLower.includes('full stack') || posLower.includes('software'))) score += 10;
    if (isDatabase && (bulletsText.includes('database') || posLower.includes('backend') || posLower.includes('data'))) score += 10;
    if (isDataAI && (posLower.includes('data') || posLower.includes('ml') || posLower.includes('ai') || posLower.includes('analytics'))) score += 10;

    // Favor more recent experience (earlier index)
    score += (expList.length - idx) * 2;

    if (score > highestScore) {
      highestScore = score;
      bestExpIndex = idx;
    }
  });

  // Score Project entries
  projList.forEach((proj, idx) => {
    let score = 0;
    const nameLower = (proj.title || '').toLowerCase();
    const descLower = (proj.highlights || []).join(' ').toLowerCase();
    const techText = (proj.technologies || []).join(' ').toLowerCase();

    if (isDevOps && (techText.includes('docker') || descLower.includes('deploy') || nameLower.includes('cloud'))) score += 8;
    if (isFrontend && (techText.includes('react') || nameLower.includes('app') || nameLower.includes('ui'))) score += 8;
    if (isBackend && (techText.includes('node') || techText.includes('api') || nameLower.includes('service'))) score += 8;

    if (score > highestScore + 2) {
      highestScore = score;
      bestProjIndex = idx;
      bestExpIndex = -1;
    }
  });

  // Default to first experience if available, or first project
  if (bestExpIndex === -1 && bestProjIndex === -1) {
    if (expList.length > 0) bestExpIndex = 0;
    else if (projList.length > 0) bestProjIndex = 0;
  }

  // Generate ATS-optimized Bullet Point
  let bulletText = '';
  if (isDevOps) {
    bulletText = `Orchestrated deployment & containerization using ${cleanKeyword}, accelerating CI/CD pipeline efficiency by 35% and minimizing runtime downtime.`;
  } else if (isFrontend) {
    bulletText = `Engineered responsive, state-driven user interfaces leveraging ${cleanKeyword}, improving user retention and lowering client load times by 28%.`;
  } else if (isBackend) {
    bulletText = `Architected scalable server-side APIs and microservices incorporating ${cleanKeyword}, boosting request throughput and system reliability.`;
  } else if (isDatabase) {
    bulletText = `Optimized data storage, indexing, and query execution using ${cleanKeyword}, achieving a 40% reduction in database query latency.`;
  } else if (isDataAI) {
    bulletText = `Implemented data pipelines and analytical models with ${cleanKeyword}, empowering data-driven decision making across core workflows.`;
  } else {
    bulletText = `Utilized ${cleanKeyword} within core engineering workflows, streamlining feature delivery and enhancing overall technical maintainability.`;
  }

  const updatedResume: ResumeData = JSON.parse(JSON.stringify(resumeData));

  // Also add keyword to Skill Categories
  const categories = updatedResume.skillCategories || [];
  if (categories.length > 0) {
    const targetCat = categories.find((c) => {
      const catName = (c.category || '').toLowerCase();
      if (isDevOps && (catName.includes('cloud') || catName.includes('devops') || catName.includes('tools'))) return true;
      if (isFrontend && (catName.includes('frontend') || catName.includes('framework'))) return true;
      if (isBackend && (catName.includes('backend') || catName.includes('language'))) return true;
      if (isDatabase && (catName.includes('database') || catName.includes('data'))) return true;
      return false;
    }) || categories[0];

    if (!targetCat.skills.some((s) => s.toLowerCase() === kwLower)) {
      targetCat.skills.push(cleanKeyword);
    }
  } else {
    categories.push({
      category: 'Core Competencies',
      skills: [cleanKeyword]
    });
  }
  updatedResume.skillCategories = categories;

  let targetType: 'experience' | 'project' = 'experience';
  let targetTitle = '';

  if (bestExpIndex !== -1 && expList.length > 0) {
    targetType = 'experience';
    const target = updatedResume.experience[bestExpIndex];
    const highlights = target.highlights || [];

    if (!highlights.some((h) => h.toLowerCase().includes(kwLower))) {
      highlights.push(bulletText);
    }
    target.highlights = highlights;
    targetTitle = `${target.position || 'Role'} at ${target.company || 'Company'}`;
  } else if (bestProjIndex !== -1 && projList.length > 0) {
    targetType = 'project';
    const target = updatedResume.projects[bestProjIndex];
    const highlights = target.highlights || [];
    const technologies = target.technologies || [];

    if (!technologies.some((t) => t.toLowerCase() === kwLower)) {
      technologies.push(cleanKeyword);
    }
    if (!highlights.some((h) => h.toLowerCase().includes(kwLower))) {
      highlights.push(bulletText);
    }
    target.highlights = highlights;
    target.technologies = technologies;
    targetTitle = `Project: ${target.title || 'Personal Project'}`;
  } else {
    targetType = 'experience';
    targetTitle = 'Skills Matrix';
  }

  return {
    updatedResume,
    targetType,
    targetTitle,
    injectedBullet: bulletText
  };
}
