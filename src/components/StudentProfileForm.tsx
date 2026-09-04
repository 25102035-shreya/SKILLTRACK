import React from 'react';
import { StudentProfile } from '../types';
import { SAMPLE_STUDENTS } from '../data/careers';
import { RotateCcw, User, BookOpen, Sparkles, Check } from 'lucide-react';

interface Props {
  student: StudentProfile;
  onSaveProfile: (student: StudentProfile) => void;
  onReset: () => void;
}

export const StudentProfileForm: React.FC<Props> = ({ student, onSaveProfile, onReset }) => {
  const updateField = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    onSaveProfile({
      ...student,
      [key]: value,
    });
  };

  const metrics = [
    {
      key: 'academicScore' as const,
      label: 'Academics & CGPA',
      weight: '25%',
      value: student.academicScore,
      color: '#6366f1',
      desc: 'University GPA, foundational coursework & exam records',
    },
    {
      key: 'technicalSkill' as const,
      label: 'Technical & Coding',
      weight: '25%',
      value: student.technicalSkill,
      color: '#8b5cf6',
      desc: 'Data structures, algorithms & programming proficiency',
    },
    {
      key: 'aptitude' as const,
      label: 'Aptitude & Logic',
      weight: '15%',
      value: student.aptitude,
      color: '#06b6d4',
      desc: 'Quantitative problem solving & cognitive assessment',
    },
    {
      key: 'communication' as const,
      label: 'Communication Skills',
      weight: '15%',
      value: student.communication,
      color: '#10b981',
      desc: 'Verbal articulation, interview presence & team interaction',
    },
    {
      key: 'projects' as const,
      label: 'Projects Portfolio',
      weight: '10%',
      value: student.projects,
      color: '#f59e0b',
      desc: 'Real-world capstones, production repos & architecture',
    },
    {
      key: 'exposure' as const,
      label: 'Industry Exposure',
      weight: '10%',
      value: student.exposure,
      color: '#ec4899',
      desc: 'Internships, open source contributions & hackathons',
    },
  ];

  return (
    <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-6">
      {/* Header & Quick Profiles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> STUDENT PROFILE
            </span>
            <h2 className="font-syne text-lg font-bold text-white mt-0.5">
              Evaluation Metrics
            </h2>
          </div>

          <button
            type="button"
            id="reset-profile-btn"
            onClick={onReset}
            className="text-xs font-mono-code text-white/50 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Reset to default benchmark"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/50 block">
            Select Preset Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_STUDENTS.map((sample) => {
              const isSelected = student.name === sample.name;
              return (
                <button
                  key={sample.name}
                  type="button"
                  id={`load-sample-${sample.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSaveProfile(sample)}
                  className={`px-3 py-2 rounded-lg text-left transition-all border font-mono-code text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-[#181b28]/80 border-white/10 text-white/70 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold truncate">{sample.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-white/40 truncate">
                    {sample.academicScore}% Acad
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Student Information Fields */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/60">
              Student Full Name
            </label>
            <input
              id="student-name-input"
              type="text"
              value={student.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Aarav Patel"
              className="w-full bg-[#181b28] border border-white/10 rounded-lg px-3 py-2 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code uppercase tracking-wider text-white/50 truncate block">
                Branch / Major
              </label>
              <input
                type="text"
                value={student.branch || ''}
                onChange={(e) => updateField('branch', e.target.value)}
                placeholder="Computer Science"
                className="w-full bg-[#181b28] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono-code uppercase tracking-wider text-white/50 truncate block">
                Target Role
              </label>
              <input
                type="text"
                value={student.targetRole || ''}
                onChange={(e) => updateField('targetRole', e.target.value)}
                placeholder="Java / Full Stack"
                className="w-full bg-[#181b28] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sliders: Real-Time Responsive Inputs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-white/50 font-semibold">
            METRIC SLIDERS (LIVE REACTIVE)
          </span>
          <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Auto-Synced
          </span>
        </div>

        <div className="space-y-3.5">
          {metrics.map((m) => (
            <div
              key={m.key}
              className="p-2.5 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-1.5"
            >
              <div className="flex justify-between items-center text-xs font-mono-code">
                <label
                  htmlFor={`input-${m.key}`}
                  className="font-medium text-white/80 flex items-center gap-1.5"
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: m.color }}
                  />
                  <span>{m.label}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40">{m.weight}</span>
                  <span className="font-bold text-white text-xs px-1.5 py-0.5 rounded bg-white/10">
                    {m.value}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  id={`slider-${m.key}`}
                  min="0"
                  max="100"
                  value={m.value}
                  onChange={(e) => updateField(m.key, Number(e.target.value))}
                  className="flex-1 h-2 bg-[#24293c] appearance-none cursor-pointer rounded-lg accent-indigo-500"
                />
                <input
                  id={`input-${m.key}`}
                  type="number"
                  min="0"
                  max="100"
                  value={m.value}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    updateField(m.key, val);
                  }}
                  className="w-12 bg-[#12141c] border border-white/10 rounded px-1 py-0.5 text-center text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <p className="text-[10px] text-white/40 font-mono-code truncate">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Maximize / Level Presets */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
        <span className="text-white/40 text-[10px] uppercase">Set All Metrics:</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              onSaveProfile({
                ...student,
                academicScore: 60,
                technicalSkill: 60,
                aptitude: 60,
                communication: 60,
                projects: 60,
                exposure: 60,
              });
            }}
            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[10px] cursor-pointer"
          >
            60%
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveProfile({
                ...student,
                academicScore: 75,
                technicalSkill: 75,
                aptitude: 75,
                communication: 75,
                projects: 75,
                exposure: 75,
              });
            }}
            className="px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] cursor-pointer"
          >
            75% Ready
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveProfile({
                ...student,
                academicScore: 90,
                technicalSkill: 90,
                aptitude: 90,
                communication: 90,
                projects: 90,
                exposure: 90,
              });
            }}
            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold cursor-pointer"
          >
            90% Prime
          </button>
        </div>
      </div>
    </div>
  );
};
