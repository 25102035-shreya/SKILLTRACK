import React, { useState, useEffect } from 'react';
import { StudentProfile, Career } from './types';
import { DEFAULT_CAREERS, SAMPLE_STUDENTS } from './data/careers';

import {
  calculateCareerMatchScore,
  calculateReadiness,
  getCategoryMeta,
} from './utils/calculator';

import { StudentProfileForm } from './components/StudentProfileForm';
import { ReadinessAnalysis } from './components/ReadinessAnalysis';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ActionRoadmap } from './components/ActionRoadmap';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { ExportReportModal } from './components/ExportReportModal';

import {
  Check,
  Award,
  Terminal,
  FileText,
  Compass,
  Sliders,
  Briefcase,
  User,
} from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('skilltrack_student_v2');

      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Use default profile
    }

    return SAMPLE_STUDENTS[0];
  });

  const [careers, setCareers] = useState<Career[]>(() => {
    try {
      const saved = localStorage.getItem('skilltrack_careers_v2');

      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Use default careers
    }

    return DEFAULT_CAREERS;
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'careers' | 'simulator' | 'roadmap' | 'terminal'
  >('overview');

  const [showExportModal, setShowExportModal] = useState(false);
  const [showTerminalDrawer, setShowTerminalDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /* ---------------------------------
     SAVE STUDENT AUTOMATICALLY
  ---------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        'skilltrack_student_v2',
        JSON.stringify(student)
      );
    } catch {
      // Ignore storage errors
    }
  }, [student]);

  /* ---------------------------------
     SAVE CAREERS AUTOMATICALLY
  ---------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        'skilltrack_careers_v2',
        JSON.stringify(careers)
      );
    } catch {
      // Ignore storage errors
    }
  }, [careers]);

  /* ---------------------------------
     TOAST
  ---------------------------------- */

  const showToast = (message: string) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  /* ---------------------------------
     SAVE PROFILE
  ---------------------------------- */

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    showToast(`Profile updated for ${newProfile.name || 'Student'}`);
  };

  /* ---------------------------------
     RESET PROFILE
  ---------------------------------- */

  const handleReset = () => {
    const defaultStudent = SAMPLE_STUDENTS[0];

    setStudent(defaultStudent);

    showToast(
      `Profile reset to ${defaultStudent.name}`
    );
  };

  /* ---------------------------------
     ADD CAREER
  ---------------------------------- */

  const handleAddCareer = (newCareer: Career) => {
    setCareers((previousCareers) => [
      ...previousCareers,
      newCareer,
    ]);

    showToast(
      `Added target benchmark: ${newCareer.roleName}`
    );
  };

  /* ---------------------------------
     WHAT-IF SIMULATOR
  ---------------------------------- */

  const handleApplyHypothetical = (
    updates: Partial<StudentProfile>
  ) => {
    setStudent((previousStudent) => ({
      ...previousStudent,
      ...updates,
    }));

    showToast(
      'Simulated parameters applied to active profile!'
    );
  };

  /* ---------------------------------
     READINESS CALCULATION
  ---------------------------------- */

  const readiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );

  const categoryMeta = getCategoryMeta(
    readiness.category
  );

  const targetCareer =
    careers.find((career) =>
      career.roleName
        .toLowerCase()
        .includes(
          student.targetRole?.toLowerCase() || ''
        )
    ) || careers[0];

  return (
    <div className="min-h-screen bg-[#090a10] text-[#f8fafc] flex flex-col selection:bg-indigo-600 selection:text-white antialiased">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="border-b border-white/10 bg-[#0c0d14]/95 backdrop-blur-md sticky top-0 z-30">

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* BRAND */}

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Award className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="font-syne text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  SkillTrack
                </h1>

                <span className="hidden sm:inline font-mono-code text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
                  Intelligence v2.4
                </span>

              </div>

              <span className="text-[10px] font-mono-code text-white/40 hidden md:block">
                Placement Readiness & Career Skill Gap Architecture
              </span>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-2">

            {/* STUDENT */}

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141622] border border-white/10 text-xs font-mono-code">

              <User className="w-3.5 h-3.5 text-indigo-400" />

              <span className="text-white font-medium max-w-[150px] truncate">
                {student.name || 'Student'}
              </span>

              <span className="text-white/40">
                •
              </span>

              <span className="text-white/60 text-[11px]">
                {student.branch
                  ? student.branch.split(' ')[0]
                  : 'Engineering'}
              </span>

            </div>

            {/* READINESS */}

            <div
              className="font-mono-code text-xs font-bold px-3 py-1.5 rounded-lg border tracking-wider flex items-center gap-1.5 shadow-sm"
              style={{
                borderColor: `${categoryMeta.badgeColor}50`,
                backgroundColor: `${categoryMeta.badgeColor}15`,
                color: categoryMeta.badgeColor,
              }}
            >

              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor:
                    categoryMeta.badgeColor,
                }}
              />

              <span>
                {readiness.score.toFixed(1)}
              </span>

            </div>

            {/* REPORT */}

            <button
              type="button"
              onClick={() =>
                setShowExportModal(true)
              }
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Export Placement Readiness Audit Report"
            >

              <FileText className="w-3.5 h-3.5" />

              <span className="hidden sm:inline">
                Audit Report
              </span>

            </button>

            {/* TERMINAL */}

            <button
              type="button"
              onClick={() =>
                setShowTerminalDrawer(
                  !showTerminalDrawer
                )
              }
              className={`px-3 py-1.5 rounded-lg border font-mono-code text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                showTerminalDrawer
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-[#141622] border-white/10 text-white/70 hover:text-white hover:border-white/25'
              }`}
              title="Toggle Java Console Terminal"
            >

              <Terminal className="w-3.5 h-3.5 text-emerald-400" />

              <span className="hidden lg:inline">
                CLI Emulator
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* =========================================
          CENTERED MAIN WORKSPACE
      ========================================= */}

      <div className="flex-1 w-full">

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">

            {/* =====================================
                STUDENT PROFILE
            ====================================== */}

            <aside className="w-full lg:sticky lg:top-20 z-10">

              <StudentProfileForm
                student={student}
                onSaveProfile={handleSaveProfile}
                onReset={handleReset}
              />

            </aside>

            {/* =====================================
                DASHBOARD
            ====================================== */}

            <main className="w-full min-w-0 space-y-6">

              {/* TABS */}

              <div className="flex border-b border-white/10 bg-[#12141c] rounded-xl p-1 font-mono-code text-xs overflow-x-auto">

                {/* OVERVIEW */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('overview')
                  }
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >

                  <Award className="w-3.5 h-3.5" />

                  <span>
                    [01] READINESS OVERVIEW
                  </span>

                </button>

                {/* CAREERS */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('careers')
                  }
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'careers'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >

                  <Briefcase className="w-3.5 h-3.5" />

                  <span>
                    [02] CAREER SKILL GAPS
                  </span>

                </button>

                {/* SIMULATOR */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('simulator')
                  }
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'simulator'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >

                  <Sliders className="w-3.5 h-3.5" />

                  <span>
                    [03] WHAT-IF SIMULATOR
                  </span>

                </button>

                {/* ROADMAP */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('roadmap')
                  }
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'roadmap'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >

                  <Compass className="w-3.5 h-3.5" />

                  <span>
                    [04] ACTION ROADMAP
                  </span>

                </button>

                {/* TERMINAL */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('terminal')
                  }
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'terminal'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >

                  <Terminal className="w-3.5 h-3.5" />

                  <span>
                    [05] JAVA CLI
                  </span>

                </button>

              </div>

              {/* =================================
                  ACTIVE TAB
              ================================== */}

              <div className="space-y-6">

                {/* OVERVIEW */}

                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in duration-200">

                    <ReadinessAnalysis
                      student={student}
                    />

                    <ActionRoadmap
                      student={student}
                      career={targetCareer}
                    />

                  </div>
                )}

                {/* CAREERS */}

                {activeTab === 'careers' && (
                  <div className="space-y-6 animate-in fade-in duration-200">

                    <SkillGapAnalysis
                      student={student}
                      careers={careers}
                      onAddCareer={handleAddCareer}
                    />

                  </div>
                )}

                {/* SIMULATOR */}

                {activeTab === 'simulator' && (
                  <div className="space-y-6 animate-in fade-in duration-200">

                    <WhatIfSimulator
                      student={student}
                      onApplyHypothetical={
                        handleApplyHypothetical
                      }
                    />

                  </div>
                )}

                {/* ROADMAP */}

                {activeTab === 'roadmap' && (
                  <div className="space-y-6 animate-in fade-in duration-200">

                    <ActionRoadmap
                      student={student}
                      career={targetCareer}
                    />

                  </div>
                )}

                {/* TERMINAL */}

                {activeTab === 'terminal' && (
                  <div className="space-y-6 animate-in fade-in duration-200">

                    <ConsoleTerminal
                      student={student}
                      careers={careers}
                      onUpdateStudent={
                        handleSaveProfile
                      }
                    />

                  </div>
                )}

              </div>

            </main>

          </div>

        </div>

      </div>

      {/* =========================================
          TERMINAL DRAWER
      ========================================== */}

      {showTerminalDrawer &&
        activeTab !== 'terminal' && (
          <div className="fixed bottom-4 right-4 z-40 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-5 duration-300">

            <div className="relative">

              <ConsoleTerminal
                student={student}
                careers={careers}
                onUpdateStudent={
                  handleSaveProfile
                }
              />

            </div>

          </div>
        )}

      {/* =========================================
          EXPORT MODAL
      ========================================== */}

      {showExportModal && (
        <ExportReportModal
          student={student}
          career={targetCareer}
          onClose={() =>
            setShowExportModal(false)
          }
        />
      )}

      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="border-t border-white/10 bg-[#0c0d14]">

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code text-white/40">

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />

            <span>
              SKILLTRACK PERFORMANCE ENGINE
            </span>

            <span className="text-white/20">
              |
            </span>

            <span>
              CAMPUS PLACEMENT INTELLIGENCE
            </span>

          </div>

          <div className="hidden lg:block text-white/30 text-[11px]">

            FORMULA: 0.25·Acad + 0.25·Tech +
            0.15·Apt + 0.15·Comm + 0.10·Proj +
            0.10·Exp = 100 PTS

          </div>

          <div className="text-[11px] text-white/50">

            POWERED BY VITE • JAVA ARCHITECTURE
            COMPATIBLE

          </div>

        </div>

      </footer>

      {/* =========================================
          TOAST
      ========================================== */}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151722] border border-indigo-500 text-white px-4 py-3 rounded-xl shadow-2xl font-mono-code text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">

          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">

            <Check className="w-3.5 h-3.5" />

          </div>

          <span>
            {toastMessage}
          </span>

        </div>
      )}

    </div>
  );
}
