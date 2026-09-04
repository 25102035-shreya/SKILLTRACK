import React from 'react';
import { Career, StudentProfile } from '../types';
import { generateActionRoadmap } from '../utils/calculator';
import { CheckCircle2, Clock, Zap, ArrowUpRight, Award, Compass } from 'lucide-react';

interface Props {
  student: StudentProfile;
  career?: Career;
}

export const ActionRoadmap: React.FC<Props> = ({ student, career }) => {
  const actions = generateActionRoadmap(student, career);

  return (
    <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> PERSONALIZED ACTION PLAN
          </span>
          <h3 className="font-syne text-lg font-bold text-white mt-0.5">
            Tactical Placement Roadmap
          </h3>
        </div>
        <div className="text-xs font-mono-code text-white/50">
          Target Role: <strong className="text-white">{career?.roleName || 'General SDE'}</strong>
        </div>
      </div>

      <div className="space-y-3.5">
        {actions.map((item) => {
          const isHigh = item.priority === 'high';
          const isStrength = item.priority === 'strength';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isHigh
                  ? 'bg-rose-500/5 border-rose-500/30'
                  : isStrength
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-[#181b28]/70 border-white/10'
              }`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300'
                        : isStrength
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {isHigh ? 'High Priority' : isStrength ? 'Core Strength' : 'Medium Priority'}
                  </span>
                  <span className="text-[11px] font-mono-code text-white/50">
                    {item.dimension}
                  </span>
                </div>

                <div className="font-syne font-bold text-sm text-white">
                  {item.title}
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="flex items-center gap-1 text-[11px] font-mono-code text-indigo-300 font-semibold">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{item.impactScore}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono-code text-white/40">
                  <Clock className="w-3 h-3" />
                  <span>{item.timeframe}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
