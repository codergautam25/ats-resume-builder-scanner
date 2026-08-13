import { deepCleanText, extractSocialLinksFromText } from "../../src/utils/resumeParser";

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function matchesKeyword(text: string, kw: string): boolean {
  if (!text || !kw) return false;
  try {
    const escaped = escapeRegExp(kw);
    return new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, "i").test(text);
  } catch (e) {
    return text.toLowerCase().includes(kw.toLowerCase());
  }
}

// Multi-Domain Knowledge Base for Heuristic Evaluation across ServiceNow, Data Engineering, Python, DevOps, Cloud, Salesforce, etc.
const DOMAIN_SKILL_TREES: Record<string, {
  keywords: string[];
  certifications: string[];
  courses: { name: string; url: string; provider: string }[];
  suitableRoles: string[];
}> = {
  servicenow: {
    keywords: [
      "ServiceNow", "ITSM", "ITOM", "ITBM", "CSA", "CAD", "Service Portal", "Flow Designer",
      "IntegrationHub", "Business Rules", "Client Scripts", "GlideRecord", "ITIL", "CMDB",
      "ServiceNow REST API", "Mid Server", "Script Includes", "UI Policies"
    ],
    certifications: [
      "ServiceNow Certified System Administrator (CSA)",
      "ServiceNow Certified Application Developer (CAD)",
      "ServiceNow Certified Implementation Specialist (CIS - ITSM / ITOM)"
    ],
    courses: [
      { name: "ServiceNow Fundamentals & CSA Exam Prep", url: "https://nowlearning.servicenow.com", provider: "Now Learning Portal" },
      { name: "ServiceNow CAD Application Developer Training", url: "https://nowlearning.servicenow.com", provider: "ServiceNow Official" },
      { name: "ServiceNow IntegrationHub & Scripting Masterclass", url: "https://www.udemy.com", provider: "Udemy" }
    ],
    suitableRoles: [
      "ServiceNow Developer", "ServiceNow Technical Consultant", "ServiceNow System Administrator", "ServiceNow Solutions Architect"
    ]
  },
  data_engineering: {
    keywords: [
      "Python", "PySpark", "Apache Spark", "SQL", "Apache Airflow", "Snowflake", "Databricks",
      "dbt", "ETL", "ELT", "BigQuery", "Redshift", "Kafka", "Data Warehousing", "Data Lake",
      "Hadoop", "Hive", "Data Pipelines", "Parquet", "Presto", "Delta Lake"
    ],
    certifications: [
      "Databricks Certified Data Engineer Associate",
      "Snowflake SnowPro Core Certification",
      "AWS Certified Data Engineer Associate"
    ],
    courses: [
      { name: "Data Engineering with PySpark & Databricks", url: "https://www.coursera.org", provider: "Coursera / Databricks" },
      { name: "Building Modern Data Pipelines with Apache Airflow & dbt", url: "https://www.udemy.com", provider: "Udemy" },
      { name: "Snowflake Cloud Data Platform Complete Masterclass", url: "https://www.snowflake.com", provider: "Snowflake Academy" }
    ],
    suitableRoles: [
      "Senior Data Engineer", "Data Infrastructure Engineer", "Analytics Engineer", "Big Data Architect"
    ]
  },
  python_backend: {
    keywords: [
      "Python", "FastAPI", "Django", "Flask", "Asyncio", "Pytest", "Pandas", "NumPy",
      "PostgreSQL", "Redis", "Celery", "SQLAlchemy", "REST APIs", "GraphQL", "Docker", "Poetry"
    ],
    certifications: [
      "PCEP - Certified Entry-Level Python Programmer",
      "PCPP - Certified Professional in Python Programming",
      "AWS Certified Developer Associate"
    ],
    courses: [
      { name: "Advanced Python & Asyncio Microservices Architecture", url: "https://realpython.com", provider: "Real Python" },
      { name: "FastAPI Production REST APIs & Microservices", url: "https://www.udemy.com", provider: "Udemy" },
      { name: "Python Testing with Pytest & TDD Best Practices", url: "https://testdriven.io", provider: "TestDriven.io" }
    ],
    suitableRoles: [
      "Senior Python Backend Engineer", "API Platform Engineer", "Python Systems Architect", "Full Stack Python Lead"
    ]
  },
  cloud_devops: {
    keywords: [
      "AWS", "GCP", "Azure", "Terraform", "Docker", "Kubernetes", "CI/CD", "GitHub Actions",
      "Jenkins", "Ansible", "Helm", "Prometheus", "Grafana", "Linux", "Bash", "CloudFormation"
    ],
    certifications: [
      "AWS Certified Solutions Architect Associate / Professional",
      "Certified Kubernetes Administrator (CKA)",
      "HashiCorp Certified: Terraform Associate"
    ],
    courses: [
      { name: "AWS Certified Solutions Architect Course", url: "https://www.acloudguru.com", provider: "A Cloud Guru / Pluralsight" },
      { name: "Kubernetes Certified Administrator (CKA) Hands-On", url: "https://kodekloud.com", provider: "KodeKloud" },
      { name: "Terraform Infrastructure as Code Complete Guide", url: "https://www.udemy.com", provider: "Udemy" }
    ],
    suitableRoles: [
      "DevOps / SRE Lead", "Cloud Infrastructure Architect", "Kubernetes Systems Specialist"
    ]
  },
  generic_tech: {
    keywords: [
      "TypeScript", "JavaScript", "React", "Node.js", "Python", "Go", "Java", "C++", "C#",
      "SQL", "PostgreSQL", "MongoDB", "Redis", "Kafka", "AWS", "GCP", "Azure", "Docker",
      "Kubernetes", "GraphQL", "REST APIs", "CI/CD", "System Design", "Microservices",
      "LLM", "PyTorch", "TensorFlow", "Vector DB", "RAG", "Terraform", "Git", "Agile"
    ],
    certifications: [
      "AWS Certified Developer", "Meta Front-End / Back-End Developer Professional"
    ],
    courses: [
      { name: "Full Stack Software Engineering Specialization", url: "https://www.coursera.org", provider: "Coursera" },
      { name: "System Design & Distributed Scalable Architecture", url: "https://www.educative.io", provider: "Educative" }
    ],
    suitableRoles: [
      "Senior Full Stack Lead", "Software Engineer", "Systems Architect"
    ]
  }
};

export function detectDomainFromText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("servicenow") || lower.includes("itsm") || lower.includes("itom") || lower.includes("gliderecord") || lower.includes("csa") || lower.includes("cad")) {
    return "servicenow";
  }
  if (lower.includes("pyspark") || lower.includes("airflow") || lower.includes("snowflake") || lower.includes("databricks") || lower.includes("dbt") || lower.includes("data engineer") || lower.includes("etl")) {
    return "data_engineering";
  }
  if (lower.includes("python") || lower.includes("django") || lower.includes("fastapi") || lower.includes("flask") || lower.includes("asyncio")) {
    return "python_backend";
  }
  if (lower.includes("terraform") || lower.includes("kubernetes") || lower.includes("devops") || lower.includes("docker") || lower.includes("sre") || lower.includes("aws")) {
    return "cloud_devops";
  }
  return "generic_tech";
}

export function buildFallbackAnalysis(rawResumeText: string, jobDescription?: string, extraWorkNotes?: string) {
  if (rawResumeText.includes('%PDF-')) {
    rawResumeText = rawResumeText
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('%PDF')) return false;
        if (/^\d+\s+\d+\s+obj/i.test(trimmed)) return false;
        if (/^(endobj|stream|endstream|xref|trailer|startxref)/i.test(trimmed)) return false;
        if (/^\/Filter|\/Length|\/Type|\/Font|\/MediaBox|\/Parent|\/Resources/i.test(trimmed)) return false;
        if (/^[<>\/\[\]\(\)\d\s\.\-]{8,}$/.test(trimmed)) return false;
        return true;
      })
      .join('\n');
  }

  const cleanedText = deepCleanText(rawResumeText);
  const lines = cleanedText.split('\n').map((l) => deepCleanText(l).trim()).filter(Boolean);

  const combinedText = `${rawResumeText} ${jobDescription || ''} ${extraWorkNotes || ''}`;
  const domainKey = detectDomainFromText(combinedText);
  const domainInfo = DOMAIN_SKILL_TREES[domainKey] || DOMAIN_SKILL_TREES.generic_tech;

  const emailMatch = rawResumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawResumeText.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const email = emailMatch ? emailMatch[0] : "";
  const phone = phoneMatch ? phoneMatch[0] : "";

  const social = extractSocialLinksFromText(rawResumeText);

  let fullName = "";
  let headline = "";

  const headerBlacklist = [
    'resume', 'curriculum vitae', 'cv', 'summary', 'experience', 'work experience',
    'education', 'skills', 'projects', 'certifications', 'contact', 'profile',
    'employment', 'technical skills', 'academic background', '%pdf', 'pdf',
    'python', 'java', 'flask', 'kafka', 'aws', 'sql', 'microservices', 'pyspark',
    'react', 'node', 'docker', 'c++', 'c#', 'javascript', 'typescript', 'servicenow'
  ];

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    let line = lines[i];
    line = line.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    line = line.replace(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '');
    line = line.replace(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/g, '');
    line = line.replace(/\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|[A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})\b/gi, '');
    line = line.replace(/\b(Linkedin|Github|Leetcode|Hackerrank|Scaler|Portfolio)\b/gi, '');
    line = line.replace(/^(resume|cv|curriculum vitae)\s*[:-]?\s*/i, '').trim();

    if (!line) continue;
    const parts = line.split(/[-–—|•,]/).map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      const lowerPart = part.toLowerCase();
      if (
        part.length >= 2 &&
        part.length < 50 &&
        !headerBlacklist.some((h) => lowerPart.includes(h)) &&
        !/\d/.test(part)
      ) {
        if (!fullName) {
          fullName = part;
        } else if (!headline && part.toLowerCase() !== fullName.toLowerCase()) {
          headline = part;
          break;
        }
      }
    }
    if (fullName && headline) break;
  }

  if (!fullName && emailMatch) {
    fullName = emailMatch[0].split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Domain & Job Description keyword matching
  const targetKeywords = Array.from(new Set([...domainInfo.keywords, ...DOMAIN_SKILL_TREES.generic_tech.keywords]));
  const foundKeywords: string[] = [];
  targetKeywords.forEach((kw) => {
    if (matchesKeyword(rawResumeText, kw)) {
      foundKeywords.push(kw);
    }
  });

  let missingKeywords: string[] = [];
  if (jobDescription) {
    missingKeywords = targetKeywords.filter((kw) =>
      matchesKeyword(jobDescription, kw) && !foundKeywords.includes(kw)
    );
  }
  if (missingKeywords.length === 0) {
    missingKeywords = domainInfo.keywords.filter((kw) => !foundKeywords.includes(kw)).slice(0, 4);
  }

  const hasMetrics = /\d+%|\$\d+|\d+\s*x|\b(increased|decreased|improved|reduced|grew)\b/i.test(cleanedText);
  const impactMetricsScore = hasMetrics ? 85 : 55;
  const keywordMatchScore = Math.min(100, Math.round((foundKeywords.length / Math.max(1, targetKeywords.length / 3)) * 100));
  const actionVerbsScore = 80;
  const formattingReadabilityScore = 88;
  const sectionCompletenessScore = 85;

  const overallScore = Math.round(
    impactMetricsScore * 0.25 +
    keywordMatchScore * 0.35 +
    actionVerbsScore * 0.15 +
    formattingReadabilityScore * 0.15 +
    sectionCompletenessScore * 0.1
  );

  // Generate domain-tailored skill learning roadmap with course suggestions
  const skillLearningRoadmap = missingKeywords.map((kw, idx) => {
    const course = domainInfo.courses[idx % domainInfo.courses.length] || domainInfo.courses[0];
    return {
      skillName: kw,
      priority: idx < 2 ? ("high" as const) : ("medium" as const),
      whyLearn: `Essential keyword for ${domainKey.replace('_', ' ').toUpperCase()} roles. Improves ATS relevance and technical screen pass rate.`,
      estimatedTime: "1-2 weeks",
      actionStep: `Recommended Course: "${course.name}" on ${course.provider} (${course.url}).`,
    };
  });

  return {
    overallScore,
    scoreBreakdown: {
      impactMetricsScore,
      keywordMatchScore,
      actionVerbsScore,
      formattingReadabilityScore,
      sectionCompletenessScore,
    },
    keyStrengths: [
      `Detected ${domainKey.replace('_', ' ').toUpperCase()} domain specialization`,
      `Extracted core skills: ${foundKeywords.slice(0, 5).join(', ') || 'technical experience'}.`,
      hasMetrics ? "Contains quantifiable impact metrics (% & numbers)" : "Clean readable section formatting",
    ],
    criticalIssues: [
      missingKeywords.length > 0
        ? `Incorporate critical missing domain keywords: ${missingKeywords.slice(0, 4).join(', ')}`
        : "Add quantifiable performance metrics to remaining work highlights",
    ],
    missingKeywords,
    foundKeywords,
    skillLearningRoadmap,
    careerGuidance: {
      suitableRoles: domainInfo.suitableRoles.map((r, i) => ({
        roleTitle: r,
        matchPercentage: Math.max(75, 95 - i * 5),
        whySuited: `Strong alignment with candidate's ${domainKey.replace('_', ' ')} expertise and skill profile.`,
        keySkillMatches: foundKeywords.slice(0, 4),
      })),
      futureProofStrategies: [
        {
          domain: `${domainKey.replace('_', ' ').toUpperCase()} Mastery & Certifications`,
          marketDemand: "Ultra High" as const,
          salaryTier: "$130k - $210k+",
          description: `Obtain official domain certifications such as ${domainInfo.certifications[0]}.`,
          learningPath: `Complete recommended courses on ${domainInfo.courses[0].provider}.`,
        },
      ],
      nextSteps: [
        `Complete course: ${domainInfo.courses[0].name}`,
        `Prepare for ${domainInfo.certifications[0]}`,
        "Incorporate metric-backed achievements into resume bullet points",
      ],
    },
    actionableRecommendations: [
      {
        priority: "high" as const,
        category: "Keywords",
        title: `Incorporate missing ${domainKey.replace('_', ' ')} keywords`,
        description: `Add ${missingKeywords.slice(0, 4).join(', ')} to your work experience and skills sections.`,
        suggestedFix: "Use bullet rewriter to integrate missing keywords naturally into experience.",
      },
    ],
    parsedResumeData: {
      personalInfo: {
        fullName: fullName || "Candidate Name",
        headline: headline || `${domainKey.replace('_', ' ').toUpperCase()} Specialist`,
        email,
        phone,
        location: "Location",
        linkedin: social.linkedin,
        github: social.github,
        leetcode: social.leetcode,
        hackerrank: social.hackerrank,
        scaler: social.scaler,
        portfolio: social.portfolio,
      },
      summary: `Experienced ${headline || domainKey.replace('_', ' ')} specialist focused on building scalable, reliable solutions.`,
      experience: [],
      education: [],
      projects: [],
      skillCategories: [
        {
          category: "Technical Skills",
          skills: foundKeywords.length > 0 ? foundKeywords : domainInfo.keywords.slice(0, 6),
        },
      ],
      certifications: domainInfo.certifications.map((certName, idx) => ({
        id: `cert_${idx}`,
        name: certName,
        issuer: "Official Provider",
        date: "Recommended",
      })),
    },
  };
}
