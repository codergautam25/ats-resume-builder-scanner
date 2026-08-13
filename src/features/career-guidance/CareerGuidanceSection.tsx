import React from 'react';
import { CareerGuidance, SuitableRole, FutureProofRecommendation } from '../../types';
import { Compass, Briefcase, TrendingUp, ArrowUpRight, DollarSign, CheckSquare, Sparkles, Award } from 'lucide-react';

interface CareerGuidanceSectionProps {
  careerGuidance?: CareerGuidance;
  detectedSkills: string[];
}

export const CareerGuidanceSection: React.FC<CareerGuidanceSectionProps> = ({
  careerGuidance,
  detectedSkills,
}) => {
  // Fallback data if Gemini AI guidance is partial or loading
  const fallbackRoles: SuitableRole[] = [
    {
      roleTitle: 'Senior Full Stack Software Engineer',
      matchPercentage: 92,
      whySuited: 'Strong combination of React frontend, Node.js microservices, and SQL database optimization.',
      keySkillMatches: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    },
    {
      roleTitle: 'Backend Cloud & Microservices Engineer',
      matchPercentage: 88,
      whySuited: 'Proven experience with serverless cloud functions, REST APIs, and database indexing.',
      keySkillMatches: ['Node.js', 'AWS', 'Docker', 'PostgreSQL'],
    },
    {
      roleTitle: 'AI Solutions & Full-Stack Engineer',
      matchPercentage: 82,
      whySuited: 'Good foundation in web APIs and modern JavaScript; ready for LLM / Gemini API integration.',
      keySkillMatches: ['TypeScript', 'Node.js', 'REST APIs', 'Cloud Services'],
    },
  ];

  const fallbackFutureProof: FutureProofRecommendation[] = [
    {
      domain: 'AI Engineering & Agentic LLM Applications',
      marketDemand: 'Ultra High',
      salaryTier: '$160,000 – $240,000+',
      description: 'Building production AI agents, RAG pipelines, and embedding models using Gemini, LangChain, and Vector Databases.',
      learningPath: 'Build 1 app integrating Gemini 1.5/2.0 API, function calling, and structured JSON outputs.',
    },
    {
      domain: 'Cloud Native & Distributed Systems Architecture',
      marketDemand: 'High',
      salaryTier: '$150,000 – $220,000+',
      description: 'Designing high-availability cloud infrastructure with Kubernetes, Terraform, and event-driven Kafka architectures.',
      learningPath: 'Gain AWS Solutions Architect Associate certification or build a Kubernetes-deployed microservice.',
    },
    {
      domain: 'DevOps, CI/CD & MLOps Pipelines',
      marketDemand: 'High',
      salaryTier: '$140,000 – $200,000+',
      description: 'Automating deployment pipelines, monitoring telemetry with Prometheus/Grafana, and managing model deployments.',
      learningPath: 'Implement automated GitHub Actions CI/CD with Docker container security scanning.',
    },
  ];

  const fallbackNextSteps: string[] = [
    'Quantify 2 unmeasured bullet points in your work history with concrete metrics (e.g., % latency drop, $ saved, team size).',
    'Add 2 missing ATS technical keywords (e.g. Docker, GraphQL, or CI/CD) into your Skills section or project descriptions.',
    'Build and link a 1-page modern showcase project demonstrating Gemini AI or Cloud architecture on GitHub.',
  ];

  const rolesToDisplay = careerGuidance?.suitableRoles?.length ? careerGuidance.suitableRoles : fallbackRoles;
  const futureProofToDisplay = careerGuidance?.futureProofStrategies?.length ? careerGuidance.futureProofStrategies : fallbackFutureProof;
  const nextStepsToDisplay = careerGuidance?.nextSteps?.length ? careerGuidance.nextSteps : fallbackNextSteps;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/60 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600/90 rounded-xl text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">
              Career Path Strategy & Market Suitability
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              AI-driven role alignment, high-paying tech domains, and strategic next steps to stay competitive and secure.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>High-Value Career Match</span>
        </span>
      </div>

      {/* Grid: Best-Fit Roles vs Future-Proof High-Paying Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suitable Roles */}
        <div className="bg-slate-800/80 rounded-xl p-5 border border-indigo-800/50 space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-sm text-white">Roles That Best Fit Your Experience</h4>
          </div>

          <div className="space-y-3">
            {rolesToDisplay.map((role, idx) => (
              <div key={idx} className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-indigo-200">{role.roleTitle}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold rounded-md border border-emerald-500/30">
                    {role.matchPercentage}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{role.whySuited}</p>

                {role.keySkillMatches && role.keySkillMatches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {role.keySkillMatches.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-800/60 font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Future Proof High-Paying Domains */}
        <div className="bg-slate-800/80 rounded-xl p-5 border border-indigo-800/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Future-Proof & High-Paying Paths to Pursue</h4>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700">
              High Market Demand
            </span>
          </div>

          <div className="space-y-3">
            {futureProofToDisplay.map((item, idx) => (
              <div key={idx} className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-emerald-300">{item.domain}</span>
                  <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{item.salaryTier}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                <div className="text-[11px] text-indigo-200 bg-indigo-950/60 p-2 rounded border border-indigo-900 flex items-start space-x-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Recommended Path:</strong> {item.learningPath}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Immediate Next Steps Action Checklist */}
      <div className="bg-slate-800/90 p-5 rounded-xl border border-indigo-700/60 space-y-3">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <CheckSquare className="w-4 h-4 text-indigo-400" />
          <span>What You Should Do Next (Action Checklist)</span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-200">
          {nextStepsToDisplay.map((step, idx) => (
            <li
              key={idx}
              className="p-3 bg-slate-900/90 rounded-lg border border-slate-700/80 flex items-start space-x-2 leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
