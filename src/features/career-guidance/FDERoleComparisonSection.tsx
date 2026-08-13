import React, { useState } from 'react';
import { FDERoleComparison } from '../../types';
import { Cpu, DollarSign, CheckCircle, PlusCircle, ArrowRight, Award, Shield, UserCheck, Sparkles } from 'lucide-react';

interface FDERoleComparisonSectionProps {
  fdeData?: FDERoleComparison;
  onAddSkillOrBullet?: (text: string) => void;
}

export const FDERoleComparisonSection: React.FC<FDERoleComparisonSectionProps> = ({
  fdeData,
  onAddSkillOrBullet,
}) => {
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Default / Fallback FDE analysis
  const defaultFDE: FDERoleComparison = {
    fdeFitScore: 84,
    fdeSalaryRange: '$180,000 – $265,000 / yr + Equity',
    clientFacingGaps: [
      'Missing explicit mention of conducting technical discovery workshops with enterprise clients or stakeholders.',
      'Needs quantifiable proof of accelerating customer deployment onboarding or reducing integration timelines.',
    ],
    missingFDETech: [
      'Forward Deployed Integration (REST/GraphQL Gateways)',
      'Data Ingestion Pipelines & ETL (PySpark, SQL, Kafka)',
      'Enterprise SSO / SAML & API Security Architecture',
    ],
    recommendedAdditionsToResume: [
      'Engineered customer-facing API integrations for 12+ enterprise clients, cutting onboarding integration time by 45%.',
      'Partnered directly with CTOs and product teams to map business requirements into scalable cloud architectures.',
      'Led technical discovery and deployment of RESTful data pipelines handling 100k+ daily transactions.',
    ],
    roleComparisons: [
      {
        roleName: 'Forward Deployed Engineer (FDE)',
        fitPercentage: 84,
        salaryBenchmark: '$180k - $265k + ISOs',
        keyPrerequisiteToHighlight: 'Client-facing deployment, fast customer prototyping, enterprise integrations',
      },
      {
        roleName: 'Solutions Architect / Field Engineer',
        fitPercentage: 89,
        salaryBenchmark: '$170k - $240k + OTE',
        keyPrerequisiteToHighlight: 'Cloud architecture design (AWS/GCP), API security, technical discovery',
      },
      {
        roleName: 'Senior Full Stack Software Engineer',
        fitPercentage: 92,
        salaryBenchmark: '$150k - $210k',
        keyPrerequisiteToHighlight: 'React/TypeScript, Node.js microservices, SQL performance tuning',
      },
      {
        roleName: 'AI Integration & Agentic Systems Lead',
        fitPercentage: 81,
        salaryBenchmark: '$190k - $280k',
        keyPrerequisiteToHighlight: 'Gemini/LLM function calling, RAG vector pipelines, agent orchestration',
      },
    ],
  };

  const data = fdeData || defaultFDE;

  const handleAddClick = (text: string) => {
    setAddedItems((prev) => new Set(prev).add(text));
    if (onAddSkillOrBullet) {
      onAddSkillOrBullet(text);
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/80 text-white rounded-2xl p-6 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
              <span>Forward Deployed Engineer (FDE) & Role Comparison</span>
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Specific analysis for high-paying Client-Facing Engineering, Solutions Architecture, and Staff roles.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-full flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>FDE Fit: {data.fdeFitScore}%</span>
          </span>
        </div>
      </div>

      {/* FDE Salary Benchmark Highlight */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-4 rounded-xl border border-indigo-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 block">
            Target FDE Compensation Benchmark
          </span>
          <div className="text-xl font-black text-amber-300 flex items-center space-x-1 mt-0.5">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>{data.fdeSalaryRange}</span>
          </div>
          <span className="text-[11px] text-slate-300">
            High-leverage engineering roles combining enterprise client deployment with core system coding.
          </span>
        </div>

        <div className="px-3.5 py-2 bg-indigo-600/80 text-white font-bold text-xs rounded-xl shadow-xs border border-indigo-400/40 self-stretch sm:self-auto text-center">
          Top 5% Market Value
        </div>
      </div>

      {/* Role Comparison Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Multi-Role Match & Compensation Comparison</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.roleComparisons.map((role, idx) => (
            <div
              key={idx}
              className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 space-y-2 hover:border-indigo-600/60 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-white">{role.roleName}</span>
                <span className="px-2 py-0.5 text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {role.fitPercentage}% Fit
                </span>
              </div>

              <div className="text-xs text-amber-300 font-extrabold flex items-center space-x-1">
                <span>Salary: {role.salaryBenchmark}</span>
              </div>

              <div className="text-[11px] text-slate-300 leading-snug bg-slate-900/60 p-2 rounded border border-slate-800">
                <strong className="text-indigo-300">Key Prerequisite:</strong> {role.keyPrerequisiteToHighlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps & Missing FDE Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client-Facing Gaps */}
        <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-2">
          <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Client-Facing & Deployment Gaps</span>
          </span>
          <ul className="space-y-1.5">
            {data.clientFacingGaps.map((gap, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing FDE Tech */}
        <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Recommended FDE Tech Keywords</span>
          </span>
          <ul className="space-y-1.5">
            {data.missingFDETech.map((tech, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>{tech}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Additions to Resume for FDE Roles */}
      <div className="bg-indigo-950/60 p-4 rounded-xl border border-indigo-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center space-x-1.5">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Recommended Bullets to Add to Qualify for FDE & High Pay</span>
          </span>
        </div>

        <div className="space-y-2">
          {data.recommendedAdditionsToResume.map((bulletText, idx) => {
            const isAdded = addedItems.has(bulletText);
            return (
              <div
                key={idx}
                className="bg-slate-900/90 p-3 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <p className="text-slate-200 italic leading-relaxed">"{bulletText}"</p>

                <button
                  onClick={() => handleAddClick(bulletText)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1 transition self-end sm:self-auto flex-shrink-0 ${
                    isAdded
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add to Experience</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
