import React from 'react';
import { SalaryInsights } from '../../types';
import { DollarSign, Gift, TrendingUp, Award, Building, Sparkles, ShieldCheck } from 'lucide-react';

interface SalaryAndPerksCardProps {
  salaryInsights?: SalaryInsights;
  experienceYears?: number;
}

export const SalaryAndPerksCard: React.FC<SalaryAndPerksCardProps> = ({
  salaryInsights,
  experienceYears = 4,
}) => {
  // Fallbacks if backend doesn't provide full data
  const defaultInsights: SalaryInsights = {
    estimatedBaseRange: '$145,000 – $195,000 / yr',
    totalCompRange: '$175,000 – $240,000 / yr (TC)',
    equityAndBonus: '$25,000 - $50,000 / yr in ISOs / RSUs + 10-15% performance bonus',
    perks: [
      '100% Remote / Hybrid Flexibility ($1,500 Home Office Stipend)',
      'Unlimited PTO + $2,000 Annual Learning & Certification Budget',
      'Top-tier Health, Dental, Vision & 401(k) 4% Match',
      'Hardware choice (Latest M3 Max MacBook Pro / Dual Monitors)',
    ],
    topPayingMarkets: [
      'San Francisco / Bay Area ($180k - $240k Base)',
      'New York City ($170k - $225k Base)',
      'Seattle / Austin / Remote ($150k - $205k Base)',
    ],
    negotiationLeverage: 'Highlighting quantified system scalability metrics and full-stack ownership provides 15-20% higher offer leverage during compensation discussions.',
  };

  const insights = salaryInsights || defaultInsights;

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/60 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">
              Market Salary Benchmarks & Total Compensation Insights
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Estimated market valuation, total compensation breakdown, remote perks, and negotiation leverage based on your profile.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>High Pay Tier Benchmark</span>
        </span>
      </div>

      {/* Primary Comp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/90 p-4 rounded-xl border border-emerald-800/50 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Estimated Base Salary</span>
          </span>
          <div className="text-xl font-black text-white">{insights.estimatedBaseRange}</div>
          <span className="text-[10px] text-slate-400 block">Based on tech skills & depth</span>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-xl border border-emerald-800/50 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Estimated Total Comp (TC)</span>
          </span>
          <div className="text-xl font-black text-amber-300">{insights.totalCompRange}</div>
          <span className="text-[10px] text-slate-400 block">Base + Stock RSUs + Annual Bonus</span>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-xl border border-emerald-800/50 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5" />
            <span>Equity & Bonus Tier</span>
          </span>
          <div className="text-sm font-bold text-slate-200">{insights.equityAndBonus}</div>
          <span className="text-[10px] text-slate-400 block">Typical startup or tech enterprise offer</span>
        </div>
      </div>

      {/* Perks and Top Markets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perks */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>Standard High-Paying Perks & Benefits</span>
          </div>

          <ul className="space-y-2">
            {insights.perks.map((perk, idx) => (
              <li key={idx} className="text-xs text-slate-200 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold text-sm leading-none mt-0.5">✓</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Geographic / Remote Markets */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Top Salary Tech Hubs</span>
          </div>

          <ul className="space-y-2">
            {insights.topPayingMarkets.map((mkt, idx) => (
              <li key={idx} className="text-xs text-slate-200 flex items-start space-x-2">
                <span className="text-indigo-400 font-bold text-sm leading-none mt-0.5">•</span>
                <span>{mkt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Offer Negotiation Strategy */}
      <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-800/80 text-xs text-emerald-100 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-emerald-300 uppercase tracking-wide text-[11px] block">Compensation Negotiation Leverage Tip:</span>
          <p className="leading-relaxed">{insights.negotiationLeverage}</p>
        </div>
      </div>
    </div>
  );
};
