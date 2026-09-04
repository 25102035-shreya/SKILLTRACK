import React from 'react';
import { StudentProfile } from '../types';
import { calculateReadiness, getCategoryMeta } from '../utils/calculator';
import { ReadinessGauge } from './ReadinessGauge';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

interface Props {
  student: StudentProfile;
}

export const ReadinessAnalysis: React.FC<Props> = ({ student }) => {
  const readiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );

  const meta = getCategoryMeta(readiness.category);

  // Analyze strengths and opportunities
  const dimensions = [
    { name: 'Academics & CGPA', score: student.academicScore, weight: 0.25 },
    { name: 'Technical & Coding', score: student.technicalSkill, weight: 0.25 },
    { name: 'Aptitude & Logic', score: student.aptitude, weight: 0.15 },
    { name: 'Communication', score: student.communication, weight: 0.15 },
    { name: 'Projects Portfolio', score: student.projects, weight: 0.10 },
    { name: 'Industry Exposure', score: student.exposure, weight: 0.10 },
  ].sort((a, b) => b.score - a.score);

  const strengths = dimensions.filter((d) => d.score >= 75);
  const growthAreas = dimensions.filter((d) => d.score < 70);

  // Placement Drive Eligibility Tiers
  const driveTiers = [
    {
      name: 'Tier 1 Product & High-Growth Tech',
      benchmark: 85,
      compensation: '14 - 28+ LPA',
      roles: 'SDE-1, Machine Learning Engineer, Systems Architect',
      isEligible: readiness.score >= 85,
      delta: Number((85 - readiness.score).toFixed(1)),
    },
    {
      name: 'Tier 2 Enterprise & Core Tech',
      benchmark: 70,
      compensation: '7 - 14 LPA',
      roles: 'Software Engineer, Data Analyst, Cloud DevOps',
      isEligible: readiness.score >= 70,
      delta: Number((70 - readiness.score).toFixed(1)),
    },
    {
      name: 'Foundation & Mass IT Placement',
      benchmark: 50,
      compensation: '4 - 7 LPA',
      roles: 'Associate Consultant, QA Automation, Tech Support',
      isEligible: readiness.score >= 50,
      delta: Number((50 - readiness.score).toFixed(1)),
    },
  ];

  return (
    <div id="readiness-analysis-section" className="space-y-6">
      {/* Primary Circular Gauge & Factor Distribution */}
      <ReadinessGauge student={student} />

      {/* Drive Eligibility Matrix */}
      <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> CAMPUS DRIVE ELIGIBILITY
            </span>
            <h3 className="font-syne text-base font-bold text-white mt-0.5">
              Target Company Bracket Feasibility
            </h3>
          </div>
          <span className="font-mono-code text-xs text-white/40">
            CURRENT: {readiness.score.toFixed(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {driveTiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                tier.isEligible
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-[#181b28]/60 border-white/10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-syne text-xs font-bold text-white leading-tight">
                    {tier.name}
                  </span>
                  {tier.isEligible ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      ELIGIBLE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                      +{tier.delta} PTS
                    </span>
                  )}
                </div>

                <div className="font-mono-code text-[11px] text-indigo-300 font-semibold">
                  Comp: {tier.compensation}
                </div>

                <p className="text-[11px] text-white/60 leading-relaxed">
                  {tier.roles}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-code text-white/40">
                <span>Cutoff: ≥{tier.benchmark} Pts</span>
                <span className={tier.isEligible ? 'text-emerald-400' : 'text-amber-400'}>
                  {tier.isEligible ? 'Target Met' : `${tier.delta} pts away`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytical Strengths vs Growth Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Strengths */}
        <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-syne text-sm font-bold text-white">
              Primary Competitive Strengths
            </h4>
          </div>

          {strengths.length > 0 ? (
            <div className="space-y-2.5">
              {strengths.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#181b28]/70 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono-code text-white/90">{s.name}</span>
                  </div>
                  <span className="font-syne font-bold text-xs text-emerald-300">
                    {s.score}/100
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-white/50 pt-1 leading-relaxed">
                Leverage these high-scoring pillars in interview self-introductions and resume highlights.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#181b28]/50 border border-white/5 text-xs text-white/50 text-center">
              No dimensions currently exceed 75/100. Focus on boosting one primary area to build an anchor strength.
            </div>
          )}
        </div>

        {/* Growth Priorities */}
        <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-syne text-sm font-bold text-white">
              Targeted Growth Priorities
            </h4>
          </div>

          {growthAreas.length > 0 ? (
            <div className="space-y-2.5">
              {growthAreas.map((g) => (
                <div
                  key={g.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#181b28]/70 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono-code text-white/90">{g.name}</span>
                  </div>
                  <span className="font-syne font-bold text-xs text-amber-300">
                    {g.score}/100
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-white/50 pt-1 leading-relaxed">
                Addressing these areas will yield the highest mathematical gain towards advancing your readiness tier.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center">
              Excellent! All six foundational metrics are above standard baseline thresholds (≥70).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
