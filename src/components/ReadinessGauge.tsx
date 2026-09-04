import React from 'react';
import { StudentProfile } from '../types';
import { calculateReadiness, getCategoryMeta } from '../utils/calculator';
import { Award, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  student: StudentProfile;
}

export const ReadinessGauge: React.FC<Props> = ({ student }) => {
  const readiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );

  const meta = getCategoryMeta(readiness.category);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // We use 270 degree arc for gauge look
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (Math.min(100, Math.max(0, readiness.score)) / 100) * arcLength;

  // Calculate distance to next tier
  let nextTierInfo = null;
  if (readiness.category === 'Needs Attention') {
    const diff = Number((50 - readiness.score).toFixed(1));
    nextTierInfo = { label: 'Needs Improvement', pointsNeeded: Math.max(0.1, diff), target: 50 };
  } else if (readiness.category === 'Needs Improvement') {
    const diff = Number((70 - readiness.score).toFixed(1));
    nextTierInfo = { label: 'Placement Ready', pointsNeeded: Math.max(0.1, diff), target: 70 };
  } else if (readiness.category === 'Placement Ready') {
    const diff = Number((85 - readiness.score).toFixed(1));
    nextTierInfo = { label: 'Tier 1 Prime', pointsNeeded: Math.max(0.1, diff), target: 85 };
  }

  const factors = [
    {
      id: 'academic',
      name: 'Academics & CGPA',
      weight: '25%',
      raw: student.academicScore,
      points: readiness.breakdown.academicContribution,
      maxPts: 25,
      color: '#6366f1',
    },
    {
      id: 'technical',
      name: 'Technical & Coding',
      weight: '25%',
      raw: student.technicalSkill,
      points: readiness.breakdown.technicalContribution,
      maxPts: 25,
      color: '#8b5cf6',
    },
    {
      id: 'aptitude',
      name: 'Aptitude & Logic',
      weight: '15%',
      raw: student.aptitude,
      points: readiness.breakdown.aptitudeContribution,
      maxPts: 15,
      color: '#06b6d4',
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      weight: '15%',
      raw: student.communication,
      points: readiness.breakdown.communicationContribution,
      maxPts: 15,
      color: '#10b981',
    },
    {
      id: 'projects',
      name: 'Projects Portfolio',
      weight: '10%',
      raw: student.projects,
      points: readiness.breakdown.projectsContribution,
      maxPts: 10,
      color: '#f59e0b',
    },
    {
      id: 'exposure',
      name: 'Industry Exposure',
      weight: '10%',
      raw: student.exposure,
      points: readiness.breakdown.exposureContribution,
      maxPts: 10,
      color: '#ec4899',
    },
  ];

  return (
    <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8 pb-6 border-b border-white/10">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width={size}
            height={size}
            className="transform -rotate-[135deg]"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1f2333"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={meta.badgeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center text in Gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pt-2">
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-white/50">
              READINESS
            </span>
            <span
              id="gauge-readiness-score"
              className="font-syne text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
            >
              {readiness.score.toFixed(1)}
            </span>
            <span className="font-mono-code text-[11px] text-white/40">OUT OF 100</span>
          </div>
        </div>

        {/* Index Details & Status */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold font-mono-code uppercase tracking-wider border flex items-center gap-1.5"
              style={{
                borderColor: `${meta.badgeColor}50`,
                backgroundColor: `${meta.badgeColor}15`,
                color: meta.badgeColor,
              }}
            >
              <Award className="w-3.5 h-3.5" />
              {readiness.category}
            </span>
            <span className="font-mono-code text-xs text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/5">
              {meta.tierLabel}
            </span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            {meta.description}
          </p>

          {/* Next tier milestone */}
          {nextTierInfo ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181b28] border border-white/10 text-xs font-mono-code">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-white/60">Milestone:</span>
              <span className="text-indigo-300 font-semibold">
                +{nextTierInfo.pointsNeeded} pts
              </span>
              <span className="text-white/60">needed to reach</span>
              <span className="text-white font-semibold flex items-center">
                {nextTierInfo.label} <ChevronRight className="w-3 h-3 text-white/40" />
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Highest Readiness Bracket Achieved (Tier 1 Prime)</span>
            </div>
          )}
        </div>
      </div>

      {/* 6 Factor Weight Contributions */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-xs uppercase tracking-wider text-white/50">
            COMPOSITE FACTOR WEIGHT DISTRIBUTION (100% TOTAL)
          </span>
          <span className="font-mono-code text-[11px] text-white/40">
            SCORE × WEIGHT = POINTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {factors.map((f) => {
            const pct = (f.points / f.maxPts) * 100;
            return (
              <div
                key={f.id}
                className="p-3 rounded-lg bg-[#181b28]/70 border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                  <span className="text-white/80 font-medium truncate">{f.name}</span>
                  <span className="text-white/40 text-[10px]">{f.weight}</span>
                </div>

                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-lg font-syne font-bold text-white">
                    {f.raw}
                    <span className="text-[11px] text-white/40 font-mono-code font-normal">
                      /100
                    </span>
                  </span>
                  <span className="font-mono-code text-xs font-semibold text-indigo-300">
                    +{f.points.toFixed(2)}{' '}
                    <span className="text-[10px] text-white/40 font-normal">pts</span>
                  </span>
                </div>

                <div className="w-full bg-[#24293c] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: f.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
