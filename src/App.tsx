import React, { useState, useEffect } from 'react';
import { StudentProfile, Career } from './types';
import { DEFAULT_CAREERS, SAMPLE_STUDENTS } from './data/careers';
import { calculateCareerMatchScore, calculateReadiness, getCategoryMeta } from './utils/calculator';
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
  Layers,
  ChevronDown,
  User,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('skilltrack_student_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return SAMPLE_STUDENTS[0];
  });

  const [careers, setCareers] = useState<Career[]>(() => {
    try {
      const saved = localStorage.getItem('skilltrack_careers_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CAREERS;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'simulator' | 'roadmap' | 'terminal'>('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTerminalDrawer, setShowTerminalDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('skilltrack_student_v2', JSON.stringify(student));
    } catch {
      // ignore
    }
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem('skilltrack_careers_v2', JSON.stringify(careers));
    } catch {
      // ignore
    }
  }, [careers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    showToast(`Profile updated for ${newProfile.name}`);
  };

  const handleReset = () => {
    setStudent(SAMPLE_STUDENTS[0]);
    showToast('Reset to default benchmark (Aarav Patel)');
  };

  const handleAddCareer = (newCareer: Career) => {
    setCareers((prev) => [...prev, newCareer]);
    showToast(`Added target benchmark: ${newCareer.roleName}`);
  };

  const handleApplyHypothetical = (updates: Partial<StudentProfile>) => {
    setStudent((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast('Simulated parameters applied to active profile!');
  };

  const readiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );

  const categoryMeta = getCategoryMeta(readiness.category);
  const targetCareer = careers.find((c) => c.roleName.toLowerCase().includes(student.targetRole?.toLowerCase() || '')) || careers[0];

  return (
    <div className="min-h-screen bg-[#090a10] text-[#f8fafc] flex flex-col selection:bg-indigo-600 selection:text-white antialiased">
      {/* Executive Top Navigation Bar */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-3 bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-syne text-lg sm:text-xl font-extrabold tracking-tight text-white">
                SkillTrack
              </h1>
              <span className="font-mono-code text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
                Intelligence v2.4
              </span>
            </div>
            <span className="text-[10px] font-mono-code text-white/40 hidden sm:block">
              Placement Readiness & Career Skill Gap Architecture
            </span>
          </div>
        </div>

        {/* Center/Right Actions & Live Readiness */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Quick Active Student Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141622] border border-white/10 text-xs font-mono-code">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white font-medium">{student.name}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60 text-[11px]">
              {student.branch ? student.branch.split(' ')[0] : 'Engineering'}
            </span>
          </div>

          {/* Readiness Index Tag */}
          <div
            className="font-mono-code text-xs font-bold px-3 py-1.5 rounded-lg border tracking-wider flex items-center gap-1.5 shadow-sm"
            style={{
              borderColor: `${categoryMeta.badgeColor}50`,
              backgroundColor: `${categoryMeta.badgeColor}15`,
              color: categoryMeta.badgeColor,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: categoryMeta.badgeColor }} />
            <span>INDEX: {readiness.score.toFixed(1)}</span>
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Export Placement Readiness Audit Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Report</span>
          </button>

          {/* Java CLI Toggle */}
          <button
            type="button"
            onClick={() => setShowTerminalDrawer(!showTerminalDrawer)}
            className={`px-3 py-1.5 rounded-lg border font-mono-code text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              showTerminalDrawer
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-[#141622] border-white/10 text-white/70 hover:text-white hover:border-white/25'
            }`}
            title="Toggle Java Console Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">CLI Emulator</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:grid lg:grid-cols-[330px_1fr] gap-6 items-start">
        {/* Left Sticky Sidebar: Reactive Student Profile Form */}
        <aside className="w-full lg:sticky lg:top-20 z-10">
          <StudentProfileForm
            student={student}
            onSaveProfile={handleSaveProfile}
            onReset={handleReset}
          />
        </aside>

        {/* Right Dashboard Area */}
        <main className="w-full space-y-6">
          {/* Main Segmented Navigation Bar */}
          <div className="flex border-b border-white/10 bg-[#12141c] rounded-xl p-1 font-mono-code text-xs overflow-x-auto">
            <button
              type="button"
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>[01] READINESS OVERVIEW</span>
            </button>

            <button
              type="button"
              id="tab-careers"
              onClick={() => setActiveTab('careers')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'careers'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>[02] CAREER SKILL GAPS</span>
            </button>

            <button
              type="button"
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>[03] WHAT-IF SIMULATOR</span>
            </button>

            <button
              type="button"
              id="tab-roadmap"
              onClick={() => setActiveTab('roadmap')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>[04] ACTION ROADMAP</span>
            </button>

            <button
              type="button"
              id="tab-terminal"
              onClick={() => setActiveTab('terminal')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>[05] JAVA CLI</span>
            </button>
          </div>

          {/* Active View Container */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ReadinessAnalysis student={student} />
                <ActionRoadmap student={student} career={targetCareer} />
              </div>
            )}

            {activeTab === 'careers' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <SkillGapAnalysis
                  student={student}
                  careers={careers}
                  onAddCareer={handleAddCareer}
                />
              </div>
            )}

            {activeTab === 'simulator' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <WhatIfSimulator
                  student={student}
                  onApplyHypothetical={handleApplyHypothetical}
                />
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ActionRoadmap student={student} career={targetCareer} />
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ConsoleTerminal
                  student={student}
                  careers={careers}
                  onUpdateStudent={handleSaveProfile}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Slide-over / Docked CLI Terminal Drawer */}
      {showTerminalDrawer && activeTab !== 'terminal' && (
        <div className="fixed bottom-4 right-4 z-40 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="relative">
            <ConsoleTerminal
              student={student}
              careers={careers}
              onUpdateStudent={handleSaveProfile}
            />
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <ExportReportModal
          student={student}
          career={targetCareer}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Global Footer */}
      <footer className="border-t border-white/10 px-4 sm:px-6 py-4 bg-[#0c0d14] text-xs font-mono-code text-white/40 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>SKILLTRACK PERFORMANCE ENGINE</span>
          <span className="text-white/20">|</span>
          <span>CAMPUS PLACEMENT INTELLIGENCE</span>
        </div>

        <div className="hidden lg:block text-white/30 text-[11px]">
          FORMULA: 0.25·Acad + 0.25·Tech + 0.15·Apt + 0.15·Comm + 0.10·Proj + 0.10·Exp = 100 PTS
        </div>

        <div className="text-[11px] text-white/50">
          POWERED BY VERCEL / VITE • JAVA ARCHITECTURE COMPATIBLE
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151722] border border-indigo-500 text-white px-4 py-3 rounded-xl shadow-2xl font-mono-code text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
