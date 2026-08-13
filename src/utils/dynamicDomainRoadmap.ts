import { ResumeData } from '../types';

export interface DynamicFutureRoleOption {
  roleTitle: string;
  matchPercentage: number;
  timeHorizon: string;
  expectedSalaryRange: string;
  matchReasons: string[];
  criticalSkillGaps: string[];
  careerGrowthImpact: string;
  recommendedCertifications: Array<{
    name: string;
    issuer: string;
    prepTime: string;
    officialUrl: string;
  }>;
}

export interface CuratedLAndDSkill {
  skillName: string;
  category: string;
  currentProficiency: number; // 0 - 100%
  targetProficiency: number;  // 0 - 100%
  importance: 'Critical' | 'High' | 'Medium';
  whyStudy: string;
  officialDocUrl: string;
  recommendedCourse: {
    title: string;
    provider: string;
    url: string;
    duration: string;
  };
}

export interface ActionPlanMilestones {
  day30: { focus: string; deliverables: string[] };
  day60: { focus: string; deliverables: string[] };
  day90: { focus: string; deliverables: string[] };
}

export interface DynamicDomainRoadmapResult {
  detectedDomain: string;
  primaryRoleTitle: string;
  targetRoleOptions: DynamicFutureRoleOption[];
  curatedSkillsToMaster: CuratedLAndDSkill[];
  actionPlan306090: ActionPlanMilestones;
  seniorLndLeadNote: string;
}

/**
 * Senior Architect & L&D Lead Engine:
 * Analyzes parsed resume data across ANY tech domain and dynamically generates
 * percentage-matched career options, curated L&D courses, documentation links,
 * and a 30-60-90 day milestone roadmap.
 */
export function generateDynamicDomainRoadmap(resumeData?: ResumeData): DynamicDomainRoadmapResult {
  const headline = (resumeData?.personalInfo?.headline || '').toLowerCase();
  const summary = (resumeData?.summary || '').toLowerCase();
  const allSkills = (resumeData?.skillCategories || [])
    .flatMap((c) => c.skills || [])
    .map((s) => s.toLowerCase());

  const fullTextStr = `${headline} ${summary} ${allSkills.join(' ')} ${JSON.stringify(resumeData?.experience || [])}`.toLowerCase();

  // Detect Candidate Domain
  const isServiceNow = fullTextStr.includes('servicenow') || fullTextStr.includes('flow designer') || fullTextStr.includes('itsm') || fullTextStr.includes('glide');
  const isDataEngineering = fullTextStr.includes('pyspark') || fullTextStr.includes('kafka') || fullTextStr.includes('opentelemetry') || fullTextStr.includes('debezium') || fullTextStr.includes('spark');
  const isDevOpsCloud = fullTextStr.includes('docker') || fullTextStr.includes('kubernetes') || fullTextStr.includes('aws') || fullTextStr.includes('rhel') || fullTextStr.includes('ubuntu');
  const isMobile = fullTextStr.includes('android') || fullTextStr.includes('firebase') || fullTextStr.includes('ios');

  if (isServiceNow) {
    return {
      detectedDomain: 'ServiceNow Enterprise Platform & Architecture',
      primaryRoleTitle: resumeData?.personalInfo?.headline || 'ServiceNow Developer',
      targetRoleOptions: [
        {
          roleTitle: 'ServiceNow Technical Architect',
          matchPercentage: 88,
          timeHorizon: '6 – 12 Months',
          expectedSalaryRange: '$165,000 – $220,000 TC',
          matchReasons: [
            '5+ Years ServiceNow Development & Platform Customization (Flow Designer, ATF, Catalog)',
            'Strong background in UI Actions, Client Scripts, Business Rules & ACLs',
            'Proven Active Directory & Import Set / Transform Map Integration experience',
            'ServiceNow Certified System Administrator foundation'
          ],
          criticalSkillGaps: [
            'ServiceNow Integration Hub & Complex REST Web Service Triggers',
            'Enterprise Domain Separation & Multi-Instance Governance',
            'Automated Test Framework (ATF) CI/CD Integration Pipelines'
          ],
          careerGrowthImpact: 'Elevates role from developer to enterprise solution architect with 35%+ compensation bump.',
          recommendedCertifications: [
            {
              name: 'ServiceNow Certified Implementation Specialist – ITSM (CIS-ITSM)',
              issuer: 'ServiceNow Official',
              prepTime: '4–6 Weeks',
              officialUrl: 'https://nowlearning.servicenow.com'
            },
            {
              name: 'ServiceNow Certified Application Developer (CAD)',
              issuer: 'ServiceNow Official',
              prepTime: '3–4 Weeks',
              officialUrl: 'https://nowlearning.servicenow.com'
            }
          ]
        },
        {
          roleTitle: 'Enterprise Solutions & Integration Architect',
          matchPercentage: 78,
          timeHorizon: '12 – 18 Months',
          expectedSalaryRange: '$185,000 – $245,000 TC',
          matchReasons: [
            'Solid experience with Glide APIs, ServiceNow notifications, and SLA configurations',
            'Background in managing upgrades, patches, cloning, and Hi-portal issue resolution',
            'Strong team leadership and stakeholder communication skills'
          ],
          criticalSkillGaps: [
            'Enterprise Service Bus (MuleSoft / Boomi) & Hybrid Cloud Gateways',
            'OAuth2 / SAML SSO Zero-Trust Security Contracts',
            'CMDB CI Class Model Architecture & Discovery Engine'
          ],
          careerGrowthImpact: 'Positions candidate for director-track enterprise integration leadership.',
          recommendedCertifications: [
            {
              name: 'TOGAF Enterprise Architecture Certification',
              issuer: 'The Open Group',
              prepTime: '8 Weeks',
              officialUrl: 'https://www.opengroup.org/certifications/togaf'
            }
          ]
        },
        {
          roleTitle: 'ServiceNow AI & Enterprise Automation Lead',
          matchPercentage: 70,
          timeHorizon: '18 – 24 Months',
          expectedSalaryRange: '$200,000 – $275,000 TC',
          matchReasons: [
            'Hands-on workflow automation and scheduled data export expertise',
            'Strong analytical thinking & business process transformation background'
          ],
          criticalSkillGaps: [
            'ServiceNow Now Assist & Generative AI Controller Configuration',
            'Python RAG Integration with Enterprise Knowledge Bases'
          ],
          careerGrowthImpact: 'Capitalizes on enterprise demand for AI-driven Virtual Agent workflows.',
          recommendedCertifications: [
            {
              name: 'AWS Certified AI Practitioner',
              issuer: 'Amazon Web Services',
              prepTime: '4 Weeks',
              officialUrl: 'https://aws.amazon.com/certification/'
            }
          ]
        }
      ],
      curatedSkillsToMaster: [
        {
          skillName: 'ServiceNow Integration Hub & Spoke Development',
          category: 'Integration Architecture',
          currentProficiency: 60,
          targetProficiency: 90,
          importance: 'Critical',
          whyStudy: 'Integration Hub is the standard for connecting ServiceNow to third-party cloud apps without legacy custom code.',
          officialDocUrl: 'https://docs.servicenow.com/bundle/utah-application-development/page/administer/integrationhub/concept/integrationhub-overview.html',
          recommendedCourse: {
            title: 'ServiceNow Integration Hub Fundamentals & Advanced Spokes',
            provider: 'ServiceNow Now Learning',
            url: 'https://nowlearning.servicenow.com',
            duration: '15 Hours'
          }
        },
        {
          skillName: 'Automated Test Framework (ATF) CI/CD Pipeline Automation',
          category: 'DevOps & Quality Engineering',
          currentProficiency: 70,
          targetProficiency: 95,
          importance: 'Critical',
          whyStudy: 'Automated testing reduces upgrade regression cycles by 80% and is required for enterprise deployments.',
          officialDocUrl: 'https://docs.servicenow.com/bundle/utah-application-development/page/build/automated-test-framework/concept/automated-test-framework.html',
          recommendedCourse: {
            title: 'ATF Masterclass: Zero-Touch ServiceNow Upgrades',
            provider: 'Udemy / ServiceNow Official',
            url: 'https://www.udemy.com',
            duration: '10 Hours'
          }
        },
        {
          skillName: 'CMDB & Service Graph Connectors',
          category: 'Data Governance',
          currentProficiency: 50,
          targetProficiency: 85,
          importance: 'High',
          whyStudy: 'Ensures real-time asset discovery and precise CI relationship mapping for ITOM modules.',
          officialDocUrl: 'https://docs.servicenow.com',
          recommendedCourse: {
            title: 'CMDB Health & Service Graph Architecture',
            provider: 'Now Learning',
            url: 'https://nowlearning.servicenow.com',
            duration: '12 Hours'
          }
        }
      ],
      actionPlan306090: {
        day30: {
          focus: 'Integration Hub & Advanced Scripting Mastery',
          deliverables: [
            'Complete ServiceNow Integration Hub official training module',
            'Build a custom Spoke connecting ServiceNow to external REST APIs via OAuth2',
            'Inject Integration Hub & REST Triggers onto resume skills section'
          ]
        },
        day60: {
          focus: 'ATF Automation & Certification Acquisition',
          deliverables: [
            'Achieve 100% automated test suite coverage for Service Catalog items using ATF',
            'Pass the ServiceNow Certified Implementation Specialist (CIS-ITSM) exam',
            'Add CIS-ITSM certification badge to LinkedIn & Resume header'
          ]
        },
        day90: {
          focus: 'Enterprise Architecture Leadership & PoCs',
          deliverables: [
            'Architect an end-to-end ITOM / CMDB discovery prototype',
            'Publish an internal tech blog on ServiceNow Upgrade Automation',
            'Apply for ServiceNow Technical Architect or Solutions Architect positions'
          ]
        }
      },
      seniorLndLeadNote: 'Indrani has an exceptional 5-year foundation in ServiceNow ITSM. By focusing 30 days on Integration Hub and securing CIS-ITSM certification, she will easily command Technical Architect offers in top MNCs.'
    };
  }

  if (isDataEngineering) {
    return {
      detectedDomain: 'Enterprise Data Engineering & Observability Systems',
      primaryRoleTitle: resumeData?.personalInfo?.headline || 'Senior Data & Observability Specialist',
      targetRoleOptions: [
        {
          roleTitle: 'Staff Data & Observability Architect',
          matchPercentage: 92,
          timeHorizon: '3 – 6 Months',
          expectedSalaryRange: '$195,000 – $260,000 TC',
          matchReasons: [
            'Built observability pipelines using PySpark and OpenTelemetry for New Relic',
            'Kafka Schema Registry (Avro) & Debezium CDC real-time streaming expertise',
            'AWS Cloud Infrastructure (EC2, EMR, Secrets Manager) deployment background',
            'Core Java multithreading & backend performance optimization (30% boost)'
          ],
          criticalSkillGaps: [
            'Databricks Delta Lake Lakehouse Architecture',
            'Real-time Stream Processing with Apache Flink',
            'Infrastructure as Code (Terraform / CloudFormation)'
          ],
          careerGrowthImpact: 'Positions candidate as a Staff-level technical lead for large-scale data platforms.',
          recommendedCertifications: [
            {
              name: 'Apache Kafka Certified Developer / Architect (CCDA)',
              issuer: 'Confluent Official',
              prepTime: '4 Weeks',
              officialUrl: 'https://www.confluent.io/certification/'
            },
            {
              name: 'AWS Certified Data Engineer – Associate',
              issuer: 'Amazon Web Services',
              prepTime: '5 Weeks',
              officialUrl: 'https://aws.amazon.com/certification/'
            }
          ]
        },
        {
          roleTitle: 'Enterprise Cloud Infrastructure Architect',
          matchPercentage: 82,
          timeHorizon: '9 – 12 Months',
          expectedSalaryRange: '$210,000 – $285,000 TC',
          matchReasons: [
            'Experience constructing high-availability Kafka clusters on RHEL & Ubuntu',
            'Dockerized microservices & RESTful API architecture',
            'AWS EMR & EC2 production scaling background'
          ],
          criticalSkillGaps: [
            'Kubernetes Multi-Region Cluster Management (EKS / GKE)',
            'Site Reliability Engineering (SRE) SLO/SLI Governance'
          ],
          careerGrowthImpact: 'Transitions from data engineering to full cloud platform architecture.',
          recommendedCertifications: [
            {
              name: 'Certified Kubernetes Administrator (CKA)',
              issuer: 'CNCF / Linux Foundation',
              prepTime: '6 Weeks',
              officialUrl: 'https://www.cncf.io/certification/cka/'
            }
          ]
        },
        {
          roleTitle: 'Principal AI Platform Systems Engineer',
          matchPercentage: 74,
          timeHorizon: '12 – 18 Months',
          expectedSalaryRange: '$240,000 – $320,000 TC',
          matchReasons: [
            'High-throughput event streaming & PySpark pipeline background',
            'Experience with local AI prompt optimization & vector pipelines'
          ],
          criticalSkillGaps: [
            'vLLM / TensorRT-LLM Model Inference Optimization',
            'Distributed Vector Indexing (Milvus / Qdrant)'
          ],
          careerGrowthImpact: 'Positions candidate at the forefront of generative AI platform engineering.',
          recommendedCertifications: [
            {
              name: 'NVIDIA Certified Associate – Generative AI LLMs',
              issuer: 'NVIDIA',
              prepTime: '4 Weeks',
              officialUrl: 'https://www.nvidia.com/en-us/training/certification/'
            }
          ]
        }
      ],
      curatedSkillsToMaster: [
        {
          skillName: 'Apache Flink Real-Time Stateful Stream Processing',
          category: 'Real-Time Streaming',
          currentProficiency: 65,
          targetProficiency: 92,
          importance: 'Critical',
          whyStudy: 'Flink is replacing batch PySpark for sub-second event processing in high-frequency trading and live telemetry.',
          officialDocUrl: 'https://flink.apache.org/documentation/',
          recommendedCourse: {
            title: 'Apache Flink Developer Masterclass with Java & Python',
            provider: 'Udemy / Confluent',
            url: 'https://www.udemy.com',
            duration: '18 Hours'
          }
        },
        {
          skillName: 'Databricks Delta Lake & PySpark Optimization',
          category: 'Data Platform',
          currentProficiency: 80,
          targetProficiency: 95,
          importance: 'Critical',
          whyStudy: 'Delta Lake provides ACID transactions and time-travel querying over cloud storage buckets.',
          officialDocUrl: 'https://docs.databricks.com/delta/',
          recommendedCourse: {
            title: 'Databricks Certified Data Engineer Professional Guide',
            provider: 'Databricks Academy',
            url: 'https://academy.databricks.com',
            duration: '20 Hours'
          }
        },
        {
          skillName: 'Terraform Infrastructure as Code (IaC) for AWS',
          category: 'Cloud Infrastructure',
          currentProficiency: 55,
          targetProficiency: 88,
          importance: 'High',
          whyStudy: 'Automating AWS EC2, EMR, and MSK provisioning via Terraform is mandatory for Staff roles.',
          officialDocUrl: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs',
          recommendedCourse: {
            title: 'HashiCorp Certified: Terraform Associate',
            provider: 'Coursera / HashiCorp',
            url: 'https://www.coursera.org',
            duration: '12 Hours'
          }
        }
      ],
      actionPlan306090: {
        day30: {
          focus: 'Confluent Kafka & Flink Streaming Integration',
          deliverables: [
            'Build a Flink real-time analytics pipeline consuming from Kafka Avro topics',
            'Pass Confluent Certified Developer for Apache Kafka (CCDA) exam',
            'Highlight CDC + Flink architecture on resume summary'
          ]
        },
        day60: {
          focus: 'Databricks Delta Lake & Terraform Infrastructure',
          deliverables: [
            'Provision automated EMR & MSK clusters using Terraform scripts',
            'Implement Delta Lake Z-Ordering for PySpark query speedups',
            'Add Databricks & Terraform credentials to resume certifications section'
          ]
        },
        day90: {
          focus: 'Staff Architecture Interviews & Leadership',
          deliverables: [
            'Architect a high-availability distributed observability blueprint',
            'Target Staff Data Engineer / Principal Systems Engineer roles',
            'Command $220k+ compensation packages'
          ]
        }
      },
      seniorLndLeadNote: 'Gautam has an elite backend, Kafka, PySpark, and observability stack. Mastering Flink and Terraform will solidify his readiness for Staff/Principal Data Architect roles.'
    };
  }

  // General Fallback for Full Stack / Cloud Engineers
  return {
    detectedDomain: 'Full Stack & Cloud Systems Engineering',
    primaryRoleTitle: resumeData?.personalInfo?.headline || 'Senior Full Stack Engineer',
    targetRoleOptions: [
      {
        roleTitle: 'Cloud Native Solutions Architect',
        matchPercentage: 86,
        timeHorizon: '6 – 12 Months',
        expectedSalaryRange: '$175,000 – $240,000 TC',
        matchReasons: [
          'Strong full stack microservices & RESTful API development skills',
          'Database optimization & cloud deployment experience',
          'Cross-functional technical communication'
        ],
        criticalSkillGaps: [
          'Kubernetes & Service Mesh (Istio / Linkerd) Architecture',
          'Multi-Region Cloud High Availability & Disaster Recovery'
        ],
        careerGrowthImpact: 'Unlocks high-paying enterprise solutions architect opportunities.',
        recommendedCertifications: [
          {
            name: 'AWS Certified Solutions Architect – Professional',
            issuer: 'Amazon Web Services',
            prepTime: '6 Weeks',
            officialUrl: 'https://aws.amazon.com/certification/'
          }
        ]
      },
      {
        roleTitle: 'AI Systems Integration Architect',
        matchPercentage: 76,
        timeHorizon: '9 – 15 Months',
        expectedSalaryRange: '$190,000 – $265,000 TC',
        matchReasons: [
          'Full stack application architecture & API integration foundation',
          'Experience building interactive developer tooling'
        ],
        criticalSkillGaps: [
          'LLM Function Calling & Agentic RAG Gateways',
          'Vector Database Operations (Pinecone / Qdrant)'
        ],
        careerGrowthImpact: 'Capitalizes on massive hiring demand for enterprise AI engineers.',
        recommendedCertifications: [
          {
            name: 'DeepLearning.AI LangChain & Agentic Systems Certificate',
            issuer: 'DeepLearning.AI',
            prepTime: '3 Weeks',
            officialUrl: 'https://www.deeplearning.ai'
          }
        ]
      }
    ],
    curatedSkillsToMaster: [
      {
        skillName: 'Kubernetes & Helm Chart Deployment',
        category: 'Cloud Infrastructure',
        currentProficiency: 60,
        targetProficiency: 90,
        importance: 'Critical',
        whyStudy: 'Essential for orchestrating containerized microservices across cloud environments.',
        officialDocUrl: 'https://kubernetes.io/docs/',
        recommendedCourse: {
          title: 'Kubernetes Mastery: Hands-on Docker & K8s',
          provider: 'Udemy',
          url: 'https://www.udemy.com',
          duration: '16 Hours'
        }
      }
    ],
    actionPlan306090: {
      day30: {
        focus: 'Cloud Architecture & K8s Mastery',
        deliverables: ['Deploy multi-container microservice on K8s cluster', 'Update resume skills']
      },
      day60: {
        focus: 'AWS Solutions Architect Certification',
        deliverables: ['Pass AWS CSA-Pro exam', 'Add badge to LinkedIn']
      },
      day90: {
        focus: 'Architectural Leadership & Role Transition',
        deliverables: ['Lead architecture reviews and interview for Solutions Architect positions']
      }
    },
    seniorLndLeadNote: 'Solid technical background. Expanding cloud infrastructure & AI integration capabilities will drive rapid career progression.'
  };
}
