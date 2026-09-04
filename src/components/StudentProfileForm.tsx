import React from 'react';
import { StudentProfile } from '../types';
import { SAMPLE_STUDENTS } from '../data/careers';

import {
  RotateCcw,
  User,
  Sparkles,
  Save,
} from 'lucide-react';

interface Props {
  student: StudentProfile;
  onSaveProfile: (student: StudentProfile) => void;
  onReset: () => void;
}

export const StudentProfileForm: React.FC<Props> = ({
  student,
  onSaveProfile,
  onReset,
}) => {

  /* =========================================
     UPDATE ANY STUDENT FIELD
  ========================================== */

  const updateField = <
    K extends keyof StudentProfile
  >(
    key: K,
    value: StudentProfile[K]
  ) => {
    onSaveProfile({
      ...student,
      [key]: value,
    });
  };

  /* =========================================
     METRICS
  ========================================== */

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

  /* =========================================
     CHANGE ALL METRICS
  ========================================== */

  const setAllMetrics = (value: number) => {
    onSaveProfile({
      ...student,
      academicScore: value,
      technicalSkill: value,
      aptitude: value,
      communication: value,
      projects: value,
      exposure: value,
    });
  };

  /* =========================================
     RENDER
  ========================================== */

  return (
    <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col space-y-6">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="space-y-4">

        <div className="flex items-center justify-between pb-3 border-b border-white/10">

          <div>

            <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">

              <User className="w-3.5 h-3.5" />

              STUDENT PROFILE

            </span>

            <h2 className="font-syne text-lg font-bold text-white mt-0.5">

              Edit Profile

            </h2>

          </div>

          <button
            type="button"
            id="reset-profile-btn"
            onClick={onReset}
            className="text-xs font-mono-code text-white/50 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Reset profile"
          >

            <RotateCcw className="w-3 h-3" />

            <span>
              Reset
            </span>

          </button>

        </div>

        {/* =====================================
            PROFILE PRESETS
        ====================================== */}

        <div className="space-y-2">

          <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/50 block">

            Quick Preset

          </label>

          <div className="grid grid-cols-3 gap-2">

            {SAMPLE_STUDENTS.map((sample) => {

              const isSelected =
                student.name === sample.name;

              return (
                <button
                  key={sample.name}
                  type="button"
                  id={`load-sample-${sample.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  onClick={() => {

                    /*
                     * IMPORTANT:
                     * Keep the user's current name.
                     * Only load the sample's other values.
                     */

                    onSaveProfile({
                      ...sample,
                      name:
                        student.name ||
                        sample.name,
                    });

                  }}
                  className={`px-3 py-2 rounded-lg text-left transition-all border font-mono-code text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-[#181b28]/80 border-white/10 text-white/70 hover:text-white hover:border-white/20'
                  }`}
                >

                  <div className="font-bold truncate">

                    {sample.name.split(' ')[0]}

                  </div>

                  <div className="text-[10px] text-white/40 truncate">

                    {sample.academicScore}% Acad

                  </div>

                </button>
              );

            })}

          </div>

        </div>

        {/* =====================================
            NAME
        ====================================== */}

        <div className="space-y-1.5">

          <label
            htmlFor="student-name-input"
            className="text-[11px] font-mono-code uppercase tracking-wider text-white/60"
          >

            Student Full Name

          </label>

          <input
            id="student-name-input"
            type="text"
            value={student.name || ''}
            onChange={(e) =>
              updateField(
                'name',
                e.target.value
              )
            }
            placeholder="Enter your full name"
            autoComplete="name"
            className="w-full bg-[#181b28] border border-white/10 rounded-lg px-3 py-2.5 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />

        </div>

        {/* =====================================
            BRANCH
        ====================================== */}

        <div className="space-y-1.5">

          <label
            htmlFor="student-branch-input"
            className="text-[11px] font-mono-code uppercase tracking-wider text-white/60"
          >

            Branch / Major

          </label>

          <input
            id="student-branch-input"
            type="text"
            value={student.branch || ''}
            onChange={(e) =>
              updateField(
                'branch',
                e.target.value
              )
            }
            placeholder="Computer Engineering"
            className="w-full bg-[#181b28] border border-white/10 rounded-lg px-3 py-2.5 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />

        </div>

        {/* =====================================
            TARGET ROLE
        ====================================== */}

        <div className="space-y-1.5">

          <label
            htmlFor="student-role-input"
            className="text-[11px] font-mono-code uppercase tracking-wider text-white/60"
          >

            Target Career / Role

          </label>

          <input
            id="student-role-input"
            type="text"
            value={student.targetRole || ''}
            onChange={(e) =>
              updateField(
                'targetRole',
                e.target.value
              )
            }
            placeholder="Java Full Stack Developer"
            className="w-full bg-[#181b28] border border-white/10 rounded-lg px-3 py-2.5 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />

        </div>

        {/* EDITING STATUS */}

        <div className="flex items-center gap-2 text-[10px] font-mono-code text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">

          <Save className="w-3 h-3" />

          <span>
            Changes are saved automatically
          </span>

        </div>

      </div>

      {/* =====================================
          METRICS
      ====================================== */}

      <div className="space-y-4 pt-2">

        <div className="flex items-center justify-between">

          <span className="font-mono-code text-[11px] uppercase tracking-wider text-white/50 font-semibold">

            EDIT READINESS METRICS

          </span>

          <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">

            <Sparkles className="w-3 h-3" />

            Live

          </span>

        </div>

        <div className="space-y-3.5">

          {metrics.map((metric) => (

            <div
              key={metric.key}
              className="p-3 rounded-lg bg-[#181b28]/60 border border-white/5 space-y-2"
            >

              {/* LABEL + VALUE */}

              <div className="flex justify-between items-center text-xs font-mono-code">

                <label
                  htmlFor={`input-${metric.key}`}
                  className="font-medium text-white/80 flex items-center gap-1.5"
                >

                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{
                      backgroundColor:
                        metric.color,
                    }}
                  />

                  <span>
                    {metric.label}
                  </span>

                </label>

                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-white/40">

                    {metric.weight}

                  </span>

                  <span className="font-bold text-white text-xs px-1.5 py-0.5 rounded bg-white/10">

                    {metric.value}

                  </span>

                </div>

              </div>

              {/* SLIDER + NUMBER INPUT */}

              <div className="flex items-center gap-2">

                <input
                  type="range"
                  id={`slider-${metric.key}`}
                  min="0"
                  max="100"
                  step="1"
                  value={metric.value}
                  onChange={(e) =>
                    updateField(
                      metric.key,
                      Number(e.target.value)
                    )
                  }
                  className="flex-1 h-2 bg-[#24293c] appearance-none cursor-pointer rounded-lg accent-indigo-500"
                />

                <input
                  id={`input-${metric.key}`}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={metric.value}
                  onChange={(e) => {

                    const raw =
                      e.target.value;

                    if (raw === '') {
                      updateField(
                        metric.key,
                        0
                      );
                      return;
                    }

                    const value =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Number(raw)
                        )
                      );

                    updateField(
                      metric.key,
                      value
                    );

                  }}
                  className="w-14 bg-[#12141c] border border-white/10 rounded px-1.5 py-1 text-center text-white font-mono-code text-xs focus:outline-none focus:border-indigo-500"
                />

              </div>

              <p className="text-[10px] text-white/40 font-mono-code">

                {metric.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* =====================================
          QUICK METRIC BUTTONS
      ====================================== */}

      <div className="pt-3 border-t border-white/10 space-y-3">

        <span className="text-white/40 text-[10px] uppercase font-mono-code block">

          Set All Metrics

        </span>

        <div className="grid grid-cols-3 gap-2">

          <button
            type="button"
            onClick={() =>
              setAllMetrics(60)
            }
            className="px-2 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[10px] cursor-pointer"
          >

            60%

          </button>

          <button
            type="button"
            onClick={() =>
              setAllMetrics(75)
            }
            className="px-2 py-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] cursor-pointer"
          >

            75%

          </button>

          <button
            type="button"
            onClick={() =>
              setAllMetrics(90)
            }
            className="px-2 py-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold cursor-pointer"
          >

            90%

          </button>

        </div>

      </div>

    </div>
  );
};
