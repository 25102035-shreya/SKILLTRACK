import React, { useState } from 'react';
import { Career, StudentProfile } from '../types';
import { calculateCareerMatchScore, calculateReadiness, calculateSkillGaps, getCategoryMeta } from '../utils/calculator';
import { X, Copy, Check, Printer, Download, Award, ShieldCheck } from 'lucide-react';

interface Props {
  student: StudentProfile;
  career?: Career;
  onClose: () => void;
}

export const ExportReportModal: React.FC<Props> = ({ student, career, onClose }) => {
  const [copied, setCopied] = useState(false);

  const readiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  );
  const meta = getCategoryMeta(readiness.category);
  const gaps = career ? calculateSkillGaps(career, student) : [];
  const matchScore = career ? calculateCareerMatchScore(career, student) : 0;

  const handleCopySummary = () => {
    const text = `
SKILLTRACK PLACEMENT READINESS AUDIT REPORT
==========================================
Student: ${student.name}
Branch: ${student.branch || 'N/A'}
Batch: ${student.batch || 'Class of 2026'}
Target Role: ${career?.roleName || student.targetRole || 'Software Development Engineer'}

OVERALL READINESS INDEX: ${readiness.score.toFixed(1)} / 100
CLASSIFICATION: ${readiness.category} (${meta.tierLabel})

COMPOSITE METRIC BREAKDOWN:
• Academics (25%): ${student.academicScore}/100 (+${readiness.breakdown.academicContribution} pts)
• Technical & Coding (25%): ${student.technicalSkill}/100 (+${readiness.breakdown.technicalContribution} pts)
• Aptitude & Logic (15%): ${student.aptitude}/100 (+${readiness.breakdown.aptitudeContribution} pts)
• Communication (15%): ${student.communication}/100 (+${readiness.breakdown.communicationContribution} pts)
• Projects Portfolio (10%): ${student.projects}/100 (+${readiness.breakdown.projectsContribution} pts)
• Industry Exposure (10%): ${student.exposure}/100 (+${readiness.breakdown.exposureContribution} pts)

TARGET ROLE FIT: ${matchScore}% MATCH
${gaps.map((g) => `• ${g.skill}: Required ${g.requiredLevel}, Student ${g.studentScore} ${g.gap > 0 ? `(Gap: -${g.gap})` : '(Met)'}`).join('\n')}

Generated via SkillTrack Performance Intelligence
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12141c] border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#12141c]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne text-base font-bold text-white">
                Placement Readiness Audit Card
              </h3>
              <p className="text-[11px] font-mono-code text-white/50">
                Official evaluation scorecard summary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Scorecard Content */}
        <div className="p-6 space-y-6 print:p-0">
          {/* Card Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code text-indigo-300 uppercase">
                STUDENT PROFILE
              </div>
              <div className="font-syne text-2xl font-bold text-white mt-0.5">
                {student.name}
              </div>
              <div className="text-xs text-white/60 font-mono-code mt-0.5">
                {student.branch || 'Engineering Major'} • {student.batch || 'Class of 2026'}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono-code text-white/50 uppercase">
                READINESS INDEX
              </div>
              <div className="font-syne text-4xl font-extrabold text-white">
                {readiness.score.toFixed(1)}
                <span className="text-sm font-normal text-white/50">/100</span>
              </div>
              <div
                className="text-xs font-mono-code font-bold uppercase mt-1"
                style={{ color: meta.badgeColor }}
              >
                {readiness.category}
              </div>
            </div>
          </div>

          {/* Metric Breakdown Table */}
          <div className="space-y-2">
            <span className="text-xs font-mono-code uppercase text-white/50 block">
              EVALUATION FACTORS (WEIGHTED FORMULA)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono-code text-xs">
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">ACADEMICS (25%)</span>
                <span className="text-lg font-bold text-white">{student.academicScore}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.academicContribution} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">TECHNICAL (25%)</span>
                <span className="text-lg font-bold text-white">{student.technicalSkill}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.technicalContribution} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">APTITUDE (15%)</span>
                <span className="text-lg font-bold text-white">{student.aptitude}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.aptitudeContribution} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">COMMUNICATION (15%)</span>
                <span className="text-lg font-bold text-white">{student.communication}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.communicationContribution} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">PROJECTS (10%)</span>
                <span className="text-lg font-bold text-white">{student.projects}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.projectsContribution} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181b28] border border-white/5">
                <span className="text-[10px] text-white/40 block">EXPOSURE (10%)</span>
                <span className="text-lg font-bold text-white">{student.exposure}/100</span>
                <span className="text-[10px] text-indigo-300 block">+{readiness.breakdown.exposureContribution} pts</span>
              </div>
            </div>
          </div>

          {/* Career Benchmark Summary */}
          {career && (
            <div className="p-4 rounded-xl bg-[#181b28]/60 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between font-mono-code text-xs">
                <span className="text-white/70">
                  Target Role: <strong className="text-white">{career.roleName}</strong>
                </span>
                <span className="text-emerald-400 font-bold">{matchScore}% Fit Score</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {gaps.map((g) => (
                  <div
                    key={g.skill}
                    className="flex items-center justify-between text-xs font-mono-code py-1 border-b border-white/5"
                  >
                    <span className="text-white/80">{g.skill}</span>
                    <span className={g.gap > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      {g.gap > 0 ? `Needs +${g.gap} pts` : 'Benchmark Met'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[10px] font-mono-code text-white/40 flex items-center justify-between pt-2 border-t border-white/10">
            <span>SkillTrack Performance Intelligence Platform</span>
            <span>Verified System Calculations</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-white/10 bg-[#151722] flex items-center justify-end gap-2.5 sticky bottom-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-lg bg-[#1e2235] hover:bg-[#252a42] text-white text-xs font-mono-code font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Text Summary
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono-code font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
