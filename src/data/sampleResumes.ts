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
