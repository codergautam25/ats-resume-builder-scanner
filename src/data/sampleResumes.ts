import { ResumeData } from '../types';

export const SAMPLE_SOFTWARE_ENGINEER: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    headline: "Senior Full Stack Engineer & Cloud Architect",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexrivera-tech",
    github: "https://github.com/alexrivera-dev",
    leetcode: "https://leetcode.com/u/alexrivera",
    hackerrank: "https://hackerrank.com/alexrivera",
    scaler: "https://scaler.com/profile/alexrivera",
    portfolio: "https://alexrivera.dev"
  },
  summary: "Results-driven Senior Full Stack Engineer with 6+ years of experience designing scalable microservices, high-throughput web applications, and distributed systems. Expert in TypeScript, React, Node.js, Python, and AWS. Proven track record of reducing system latency by 40% and leading high-performing Agile teams to deliver high-impact cloud solutions.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Cloud Innovations",
      position: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      isCurrent: true,
      highlights: [
        "Architected real-time streaming analytics dashboard servicing 2M+ active daily users using React, Node.js, and Apache Kafka, reducing data rendering latency by 42%.",
        "Engineered serverless backend API on AWS Lambda & DynamoDB, cutting monthly cloud infrastructure overhead by $18,000.",
        "Led cross-functional team of 6 software engineers, conducting peer code reviews and implementing CI/CD automated pipelines with GitHub Actions.",
        "Refactored legacy monolith into modular GraphQL microservices, increasing API response times by 35% under peak load."
      ]
    },
    {
      id: "exp-2",
      company: "Nexus Software Solutions",
      position: "Full Stack Developer",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      isCurrent: false,
      highlights: [
        "Built customer portal web applications utilizing React, Redux, PostgreSQL, and Express, serving over 500,000 active customer accounts.",
        "Implemented OAuth 2.0 and JWT security protocols, eliminating authorization vulnerabilities across 12 internal microservices.",
        "Optimized SQL query performance and indexed PostgreSQL tables, reducing database read response time from 450ms to 85ms."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.85 / 4.0",
      honors: ["Dean's Honor List", "Tau Beta Pi Engineering Honor Society"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "DevMetrics - Open Source Developer Performance Monitor",
      subtitle: "Full-Stack Analytics Tool",
      link: "github.com/alexrivera-dev/devmetrics",
      startDate: "2023-01",
      endDate: "2023-08",
      highlights: [
        "Created open-source CLI & dashboard tracking Git commit metrics and code quality benchmarks, gaining 1,400+ GitHub stars.",
        "Integrated Gemini AI API for automatic code review generation and pull request summary insights."
      ],
      technologies: ["React", "TypeScript", "Node.js", "Docker", "Gemini API"]
    }
  ],
  skillCategories: [
    {
      category: "Languages & Core",
      skills: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL", "HTML5/CSS3"]
    },
    {
      category: "Frameworks & Libraries",
      skills: ["React", "Next.js", "Node.js", "Express", "GraphQL", "Tailwind CSS", "Redux Toolkit"]
    },
    {
      category: "Cloud, DevOps & Databases",
      skills: ["AWS (Lambda, S3, ECS, DynamoDB)", "Docker", "PostgreSQL", "MongoDB", "Redis", "Git", "CI/CD"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023-05"
    }
  ]
};

export const SAMPLE_PRODUCT_MANAGER: ResumeData = {
  personalInfo: {
    fullName: "Elena Rostova",
    headline: "Lead Product Manager | Fintech & AI Products",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 890-1234",
    location: "New York, NY",
    linkedin: "linkedin.com/in/elena-rostova-pm",
    portfolio: "elenarostova.com"
  },
  summary: "Data-driven Lead Product Manager with 7+ years of experience leading cross-functional engineering, UX, and marketing teams to scale B2B SaaS platforms. Managed product roadmaps generating $12M+ ARR, optimized user onboarding funnels by 28%, and launched generative AI integrations.",
  experience: [
    {
      id: "exp-1",
      company: "FinTech Pulse Inc.",
      position: "Senior Product Manager",
      location: "New York, NY",
      startDate: "2021-08",
      endDate: "Present",
      isCurrent: true,
      highlights: [
        "Spearheaded product strategy for automated credit risk assessment engine, increasing quarterly loan approvals by $24M while maintaining risk metrics.",
        "Partnered with engineering leadership to deliver AI feature pipeline on time, driving 34% boost in daily user engagement across 120k active SMB clients.",
        "Conduct user research interviews and A/B testing campaigns, reducing user onboarding drop-off rate from 41% to 18%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Columbia Business School",
      degree: "Master of Business Administration (MBA)",
      fieldOfStudy: "Technology & Product Management",
      location: "New York, NY",
      startDate: "2018-09",
      endDate: "2020-05"
    }
  ],
  projects: [],
  skillCategories: [
    {
      category: "Product Leadership",
      skills: ["Product Strategy", "Roadmap Execution", "Agile / Scrum", "User Research", "A/B Testing", "OKRs"]
    },
    {
      category: "Analytics & Tools",
      skills: ["Mixpanel", "Google Analytics", "Jira", "Figma", "SQL Data Analysis", "Tableau"]
    }
  ],
  certifications: []
};

export const SAMPLE_SERVICENOW_DEVELOPER: ResumeData = {
  personalInfo: {
    fullName: "Indrani Ghosh",
    headline: "Senior ServiceNow Lead Consultant & Solution Architect",
    email: "indrani.ghosh@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "https://linkedin.com/in/indranighosh-servicenow",
    github: "https://github.com/indranighosh-sn",
    portfolio: "https://indranighosh.dev"
  },
  summary: "Results-oriented Senior ServiceNow Lead Consultant with 6+ years of expertise in ServiceNow ITSM, Flow Designer, IntegrationHub, CMDB Service Graph Connectors, Automated Test Framework (ATF), and Scripted REST APIs. Spearheaded enterprise-scale ServiceNow integrations for Fortune 500 clients at Tata Consultancy Services, achieving 45% faster incident response and 99.9% workflow execution uptime.",
  experience: [
    {
      id: "sn-exp-1",
      company: "Tata Consultancy Services Limited",
      position: "Senior ServiceNow Consultant",
      location: "Bengaluru, India",
      startDate: "2021-06",
      endDate: "Present",
      isCurrent: true,
      highlights: [
        "Architected enterprise ServiceNow IntegrationHub & Spoke pipelines connecting ServiceNow ITSM with Jira, Salesforce, and AWS, automating 15,000+ monthly change requests.",
        "Implemented CMDB & Service Graph Connectors for 80,000+ infrastructure CIs, achieving 99.4% CMDB data accuracy and eliminating manual CI reconciliation.",
        "Engineered custom Scripted REST APIs, Script Includes, Business Rules, UI Actions, and ACL security protocols across ITSM & Service Catalog modules.",
        "Automated regression test suites using Automated Test Framework (ATF) CI/CD integration, cutting upgrade testing cycle duration by 60%."
      ]
    },
    {
      id: "sn-exp-2",
      company: "Global Tech Solutions",
      position: "ServiceNow Developer",
      location: "Kolkata, India",
      startDate: "2018-08",
      endDate: "2021-05",
      isCurrent: false,
      highlights: [
        "Configured Service Catalog items, Record Producers, and Flow Designer subflows, streamlining IT service requests for 25,000+ enterprise employees.",
        "Developed GlideRecord server-side scripts, Client Scripts, and UI Policies for complex incident escalation and automated SLA tracking.",
        "Built custom Inbound Email Actions and notification triggers, reducing ticket assignment turnaround time from 2 hours to under 4 minutes."
      ]
    }
  ],
  education: [
    {
      id: "sn-edu-1",
      institution: "West Bengal University of Technology",
      degree: "Bachelor of Technology (B.Tech)",
      fieldOfStudy: "Computer Science & Engineering",
      location: "Kolkata, India",
      startDate: "2014-08",
      endDate: "2018-05",
      gpa: "8.6 / 10.0"
    }
  ],
  projects: [
    {
      id: "sn-proj-1",
      title: "ServiceNow Automated IntegrationHub Spoke for AWS Cloud Governance",
      subtitle: "Enterprise Integration Project",
      link: "github.com/indranighosh-sn/servicenow-aws-spoke",
      startDate: "2023-02",
      endDate: "2023-10",
      highlights: [
        "Designed custom IntegrationHub Spoke automating AWS EC2 instance provisioning directly from ServiceNow Service Portal requests.",
        "Enforced security ACL policies and OAuth 2.0 token authentication for seamless REST API communication."
      ],
      technologies: ["ServiceNow IntegrationHub", "Flow Designer", "GlideRecord", "JavaScript", "AWS REST APIs"]
    }
  ],
  skillCategories: [
    {
      category: "ServiceNow Core Modules",
      skills: ["ServiceNow ITSM", "Flow Designer", "IntegrationHub & Spokes", "CMDB & Service Graph Connectors", "Automated Test Framework (ATF)", "Service Catalog Development", "SLA Configuration"]
    },
    {
      category: "ServiceNow Scripting & Security",
      skills: ["Glide APIs (GlideRecord/GlideSystem)", "Script Includes", "Business Rules", "Client Scripts", "UI Policies", "UI Actions", "ACLs (Access Control Lists)", "Inbound Email Actions", "Scripted REST APIs"]
    },
    {
      category: "Tools & Governance",
      skills: ["JavaScript (ServiceNow)", "Agile / Scrum", "ITIL v4 Governance", "REST/SOAP Integrations", "Git", "JSON/XML"]
    }
  ],
  certifications: [
    {
      id: "sn-cert-1",
      name: "ServiceNow Certified System Administrator (CSA)",
      issuer: "ServiceNow",
      date: "2022-04"
    },
    {
      id: "sn-cert-2",
      name: "ServiceNow Certified Application Developer (CAD)",
      issuer: "ServiceNow",
      date: "2023-01"
    },
    {
      id: "sn-cert-3",
      name: "ServiceNow Certified Implementation Specialist – ITSM (CIS-ITSM)",
      issuer: "ServiceNow",
      date: "2023-09"
    }
  ]
};
