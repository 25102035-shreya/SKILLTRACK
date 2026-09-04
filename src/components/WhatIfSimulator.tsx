import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { calculateGoalSeek, calculateReadiness, getCategoryMeta } from '../utils/calculator';
import { RotateCcw, Check, Sparkles, Sliders, Target, ArrowRight, TrendingUp, Zap } from 'lucide-react';

interface Props {
  student: StudentProfile;
  onApplyHypothetical: (updates: Partial<StudentProfile>) => void;
}

export const WhatIfSimulator: React.FC<Props> = ({ student, onApplyHypothetical }) => {
  // Local hypothetical states initialized from student
  const [hypoTech, setHypoTech] = useState<number>(student.technicalSkill);
  const [hypoProjects, setHypoProjects] = useState<number>(student.projects);
  const [hypoAptitude, setHypoAptitude] = useState<number>(student.aptitude);
  const [hypoComm, setHypoComm] = useState<number>(student.communication);
  const [hypoExposure, setHypoExposure] = useState<number>(student.exposure);

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number>(85);

  // Sync with student updates
  useEffect(() => {
    setHypoTech(student.technicalSkill);
    setHypoProjects(student.projects);
    setHypoAptitude(student.aptitude);
    setHypoComm(student.communication);
    setHypoExposure(student.exposure);
  }, [student]);

  const currentResult = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );

  const simulatedResult = calculateReadiness(
    student.academicScore,
    hypoTech,
    hypoAptitude,
    hypoComm,
    hypoProjects,
    hypoExposure
  );

  const delta = Number((simulatedResult.score - currentResult.score).toFixed(2));
  const simulatedMeta = getCategoryMeta(simulatedResult.category);
  const currentMeta = getCategoryMeta(currentResult.category);

  // Goal seek calculation
  const goalSeek = calculateGoalSeek(student, selectedGoal);

  const handleApply = () => {
    onApplyHypothetical({
      technicalSkill: hypoTech,
      projects: hypoProjects,
      aptitude: hypoAptitude,
      communication: hypoComm,
      exposure: hypoExposure,
    });
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2400);
  };

  const handleApplyGoalSeek = () => {
    const updates: Partial<StudentProfile> = {};
    goalSeek.requiredGains.forEach((g) => {
      updates[g.dimension] = g.needed;
    });
    onApplyHypothetical(updates);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2400);
  };

  const applyPreset = (
    name: string,
    modifiers: { tech?: number; proj?: number; apt?: number; comm?: number; exp?: number }
  ) => {
    setActivePreset(name);
    if (modifiers.tech !== undefined) setHypoTech(Math.min(100, student.technicalSkill + modifiers.tech));
    if (modifiers.proj !== undefined) setHypoProjects(Math.min(100, student.projects + modifiers.proj));
    if (modifiers.apt !== undefined) setHypoAptitude(Math.min(100, student.aptitude + modifiers.apt));
    if (modifiers.comm !== undefined) setHypoComm(Math.min(100, student.communication + modifiers.comm));
    if (modifiers.exp !== undefined) setHypoExposure(Math.min(100, student.exposure + modifiers.exp));
  };

  const handleResetSimulation = () => {
    setActivePreset(null);
    setHypoTech(student.technicalSkill);
    setHypoProjects(student.projects);
    setHypoAptitude(student.aptitude);
    setHypoComm(student.communication);
    setHypoExposure(student.exposure);
  };

  return (
    <div id="what-if-simulator-section" className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> WHAT-IF PREDICTIVE ENGINE
          </span>
          <h3 className="font-syne text-lg font-bold text-white mt-0.5">
            Scenario Modeling & Goal Seeking
          </h3>
        </div>

        <button
          type="button"
          onClick={handleResetSimulation}
          className="text-xs font-mono-code text-white/50 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reset Levers
        </button>
      </div>

      {/* Comparison Cards: Current vs Simulated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current State */}
        <div className="p-4 rounded-xl bg-[#181b28]/60 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono-code text-white/40 uppercase tracking-wider block">
              CURRENT BASELINE SCORE
            </span>
            <div className="font-syne text-3xl font-extrabold text-white mt-1">
              {currentResult.score.toFixed(1)}
              <span className="text-xs font-mono-code text-white/40 font-normal"> / 100</span>
            </div>
            <div
              className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-mono-code font-bold uppercase border"
              style={{
                borderColor: `${currentMeta.badgeColor}40`,
                backgroundColor: `${currentMeta.badgeColor}15`,
                color: currentMeta.badgeColor,
              }}
            >
              {currentResult.category}
            </div>
          </div>
          <p className="text-[11px] text-white/50 font-mono-code mt-3">
            Current student academic & skill matrix
          </p>
        </div>

        {/* Simulated State */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1c1f30] to-[#141624] border border-indigo-500/40 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-indigo-300 uppercase tracking-wider block">
                SIMULATED OUTCOME
              </span>
              <span
                className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded ${
                  delta > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : delta < 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {delta > 0 ? `+${delta.toFixed(2)} PTS` : `${delta.toFixed(2)} PTS`}
              </span>
            </div>

            <div className="font-syne text-3xl font-extrabold text-white mt-1">
              {simulatedResult.score.toFixed(1)}
              <span className="text-xs font-mono-code text-white/40 font-normal"> / 100</span>
            </div>

            <div
              className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-mono-code font-bold uppercase border"
              style={{
                borderColor: `${simulatedMeta.badgeColor}40`,
                backgroundColor: `${simulatedMeta.badgeColor}15`,
                color: simulatedMeta.badgeColor,
              }}
            >
              {simulatedResult.category}
            </div>
          </div>

          <button
            type="button"
            id="apply-hypo-btn"
            onClick={handleApply}
            className="w-full mt-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono-code font-bold text-xs uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            {appliedNotification ? (
              <>
                <Check className="w-3.5 h-3.5" /> Applied to Profile
              </>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5" /> Apply Simulation to Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Action Scenarios */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/50 block">
          One-Click Strategic Scenarios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('bootcamp', { tech: 15, proj: 10 })}
            className={`p-3 rounded-lg border text-left transition-all font-mono-code cursor-pointer ${
              activePreset === 'bootcamp'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-[#181b28]/80 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Zap className="w-3 h-3" /> Coding Bootcamp
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              +15 Tech Skills, +10 Projects
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('capstone', { proj: 20, exp: 15 })}
            className={`p-3 rounded-lg border text-left transition-all font-mono-code cursor-pointer ${
              activePreset === 'capstone'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-[#181b28]/80 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3 h-3" /> Production Capstone
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              +20 Projects, +15 Industry Exp.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('interview', { comm: 15, apt: 10 })}
            className={`p-3 rounded-lg border text-left transition-all font-mono-code cursor-pointer ${
              activePreset === 'interview'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-[#181b28]/80 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Target className="w-3 h-3" /> Interview Drills
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              +15 Communication, +10 Aptitude
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Simulation Sliders */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <span className="font-mono-code text-[11px] uppercase tracking-wider text-white/50 font-semibold block">
          FINE-GRAINED GROWTH LEVERS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Technical */}
          <div className="p-3 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-white/80 font-medium">Technical Skill (25%)</span>
              <span className="text-white font-bold">{hypoTech}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hypoTech}
              onChange={(e) => setHypoTech(Number(e.target.value))}
              className="w-full h-1.5 bg-[#24293c] appearance-none cursor-pointer rounded accent-indigo-500"
            />
          </div>

          {/* Projects */}
          <div className="p-3 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-white/80 font-medium">Projects Portfolio (10%)</span>
              <span className="text-white font-bold">{hypoProjects}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hypoProjects}
              onChange={(e) => setHypoProjects(Number(e.target.value))}
              className="w-full h-1.5 bg-[#24293c] appearance-none cursor-pointer rounded accent-indigo-500"
            />
          </div>

          {/* Aptitude */}
          <div className="p-3 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-white/80 font-medium">Aptitude & Logic (15%)</span>
              <span className="text-white font-bold">{hypoAptitude}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hypoAptitude}
              onChange={(e) => setHypoAptitude(Number(e.target.value))}
              className="w-full h-1.5 bg-[#24293c] appearance-none cursor-pointer rounded accent-indigo-500"
            />
          </div>

          {/* Communication */}
          <div className="p-3 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-white/80 font-medium">Communication (15%)</span>
              <span className="text-white font-bold">{hypoComm}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hypoComm}
              onChange={(e) => setHypoComm(Number(e.target.value))}
              className="w-full h-1.5 bg-[#24293c] appearance-none cursor-pointer rounded accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Automated Goal Seek Section */}
      <div className="p-4 rounded-xl bg-[#181b28]/80 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="font-syne text-sm font-bold text-white">
              Goal Seek Optimizer
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono-code text-white/50">Target Score:</span>
            {[70, 75, 80, 85, 90].map((tgt) => (
              <button
                key={tgt}
                type="button"
                onClick={() => setSelectedGoal(tgt)}
                className={`px-2 py-0.5 rounded text-xs font-mono-code transition-all cursor-pointer ${
                  selectedGoal === tgt
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-[#12141c] text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {tgt}
              </button>
            ))}
          </div>
        </div>

        {goalSeek.requiredGains.length > 0 ? (
          <div className="space-y-2 pt-1">
            <div className="text-xs text-white/70">
              To reach a readiness index of <strong>{selectedGoal}.0</strong> (
              {selectedGoal >= 85 ? 'Tier 1 Prime' : 'Placement Ready'}), achieve these
              proportional milestones:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {goalSeek.requiredGains.map((g) => (
                <div
                  key={g.label}
                  className="p-2 rounded bg-[#12141c] border border-white/5 text-xs font-mono-code"
                >
                  <div className="text-white/60 text-[10px] truncate">{g.label}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/40">{g.current}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-300 font-bold">{g.needed} (+{g.gain})</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleApplyGoalSeek}
              className="mt-2 text-xs font-mono-code text-indigo-300 hover:text-indigo-200 flex items-center gap-1 underline cursor-pointer"
            >
              Apply this Goal Seek trajectory to profile →
            </button>
          </div>
        ) : (
          <div className="text-xs text-emerald-400 font-mono-code">
            ✓ Target index of {selectedGoal} is already achieved by current profile!
          </div>
        )}
      </div>
    </div>
  );
};
