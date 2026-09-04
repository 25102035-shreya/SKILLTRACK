import React, { useState } from 'react';
import { Career, StudentProfile } from '../types';
import { calculateCareerMatchScore, calculateSkillGaps } from '../utils/calculator';
import { Plus, X, Briefcase, CheckCircle2, AlertTriangle, Filter, Sparkles } from 'lucide-react';

interface Props {
  student: StudentProfile;
  careers: Career[];
  onAddCareer: (career: Career) => void;
}

export const SkillGapAnalysis: React.FC<Props> = ({ student, careers, onAddCareer }) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careers[0]?.id || 'java-dev');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Custom role form state
  const [customRoleName, setCustomRoleName] = useState('');
  const [customCategory, setCustomCategory] = useState<'Software' | 'Data & AI' | 'DevOps & Cloud' | 'Core Engineering'>('Software');
  const [customDescription, setCustomDescription] = useState('');
  const [customSkill1, setCustomSkill1] = useState('Core Skill');
  const [customReq1, setCustomReq1] = useState(80);
  const [customSkill2, setCustomSkill2] = useState('Framework & Tools');
  const [customReq2, setCustomReq2] = useState(75);
  const [customSkill3, setCustomSkill3] = useState('Architecture & System');
  const [customReq3, setCustomReq3] = useState(70);

  const selectedCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];
  const gaps = selectedCareer ? calculateSkillGaps(selectedCareer, student) : [];
  const matchScore = selectedCareer ? calculateCareerMatchScore(selectedCareer, student) : 0;

  const categories = ['All', 'Software', 'Data & AI', 'DevOps & Cloud', 'Core Engineering'];

  const filteredCareers = careers.filter((c) => {
    if (categoryFilter === 'All') return true;
    return c.category === categoryFilter;
  });

  const handleCreateCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return;

    const newCareer: Career = {
      id: `custom-${Date.now()}`,
      roleName: customRoleName.trim(),
      category: customCategory,
      description: customDescription.trim() || 'Custom benchmark role created by user.',
      requiredSkills: {
        [customSkill1.trim() || 'Core Competency']: Number(customReq1),
        [customSkill2.trim() || 'Tools & Frameworks']: Number(customReq2),
        [customSkill3.trim() || 'Advanced Practice']: Number(customReq3),
      },
    };

    onAddCareer(newCareer);
    setSelectedCareerId(newCareer.id);
    setShowAddCustom(false);
    setCustomRoleName('');
    setCustomDescription('');
  };

  return (
    <div id="skill-gap-section" className="bg-[#12141c] border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> CAREER SKILL GAP ANALYZER
          </span>
          <h3 className="font-syne text-lg font-bold text-white mt-0.5">
            Industry Benchmark Alignment
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="add-custom-role-btn"
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="text-xs font-mono-code text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {showAddCustom ? (
              <>
                <X className="w-3.5 h-3.5" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add Target Role
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[10px] font-mono-code text-white/40 uppercase mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-mono-code transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-[#181b28] text-white/60 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filteredCareers.map((c) => {
          const isSelected = c.id === selectedCareerId;
          const roleMatch = calculateCareerMatchScore(c, student);
          return (
            <button
              key={c.id}
              type="button"
              id={`career-card-${c.id}`}
              onClick={() => setSelectedCareerId(c.id)}
              className={`p-3 rounded-xl text-left transition-all border font-mono-code cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50 text-white shadow-lg'
                  : 'bg-[#181b28]/70 border-white/10 text-white/70 hover:text-white hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase text-indigo-400 font-semibold truncate">
                    {c.category || 'Career'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      roleMatch >= 80
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : roleMatch >= 65
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {roleMatch}% Fit
                  </span>
                </div>
                <div className="font-syne font-bold text-xs text-white leading-tight">
                  {c.roleName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Custom Career Sub-form */}
      {showAddCustom && (
        <form
          onSubmit={handleCreateCareer}
          className="p-4 rounded-xl bg-[#181b28] border border-indigo-500/40 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono-code font-bold text-indigo-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Define Custom Target Job Benchmark
            </span>
            <span className="text-[10px] font-mono-code text-white/40">
              CUSTOM BENCHMARK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/60">
                Job Title
              </label>
              <input
                type="text"
                required
                value={customRoleName}
                onChange={(e) => setCustomRoleName(e.target.value)}
                placeholder="e.g. SRE / Observability Specialist"
                className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/60">
                Domain Category
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
              >
                <option value="Software">Software</option>
                <option value="Data & AI">Data & AI</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Core Engineering">Core Engineering</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono-code uppercase tracking-wider text-white/60">
              Role Brief / Requirements Description
            </label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="e.g. Focus on high-availability cloud microservices and incident automation."
              className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-[#12141c] border border-white/5 space-y-1.5">
              <input
                type="text"
                value={customSkill1}
                onChange={(e) => setCustomSkill1(e.target.value)}
                placeholder="Skill 1"
                className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between text-xs font-mono-code text-white/60">
                <span>Bench:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customReq1}
                  onChange={(e) => setCustomReq1(Number(e.target.value))}
                  className="w-14 bg-[#181b28] border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#12141c] border border-white/5 space-y-1.5">
              <input
                type="text"
                value={customSkill2}
                onChange={(e) => setCustomSkill2(e.target.value)}
                placeholder="Skill 2"
                className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between text-xs font-mono-code text-white/60">
                <span>Bench:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customReq2}
                  onChange={(e) => setCustomReq2(Number(e.target.value))}
                  className="w-14 bg-[#181b28] border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#12141c] border border-white/5 space-y-1.5">
              <input
                type="text"
                value={customSkill3}
                onChange={(e) => setCustomSkill3(e.target.value)}
                placeholder="Skill 3"
                className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white font-mono-code focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between text-xs font-mono-code text-white/60">
                <span>Bench:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customReq3}
                  onChange={(e) => setCustomReq3(Number(e.target.value))}
                  className="w-14 bg-[#181b28] border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
          >
            Save Target Career Role
          </button>
        </form>
      )}

      {/* Selected Career Overview & Gap Breakdown */}
      {selectedCareer && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#181b28]/80 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne text-base font-bold text-white">
                  {selectedCareer.roleName}
                </span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedCareer.category || 'Domain'}
                </span>
              </div>
              {selectedCareer.description && (
                <p className="text-xs text-white/60 mt-1 max-w-xl">
                  {selectedCareer.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-mono-code text-[10px] text-white/50 uppercase">
                  COMPOSITE FIT
                </div>
                <div className="font-syne text-2xl font-extrabold text-white">
                  {matchScore}%
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm ${
                  matchScore >= 80
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : matchScore >= 65
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {matchScore >= 80 ? 'A' : matchScore >= 65 ? 'B' : 'C'}
              </div>
            </div>
          </div>

          {/* Skill Gaps Breakdown Table / Visual Bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-code text-white/50 uppercase">
              <span>Required Competency</span>
              <span>Student vs Benchmark Gap</span>
            </div>

            <div className="space-y-2.5">
              {gaps.map((item) => {
                const hasGap = item.gap > 0;
                const pct = Math.min(100, Math.round((item.studentScore / item.requiredLevel) * 100));

                return (
                  <div
                    key={item.skill}
                    className="p-3 rounded-lg bg-[#12141c] border border-white/5 hover:border-white/15 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono-code">
                      <div className="flex items-center gap-2">
                        {hasGap ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-white font-medium">{item.skill}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-white/60">
                          Student: <strong className="text-white">{item.studentScore}</strong> / Benchmark:{' '}
                          <strong className="text-white">{item.requiredLevel}</strong>
                        </span>

                        {hasGap ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            -{item.gap} PTS GAP
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            MET {item.gap < 0 ? `(+${Math.abs(item.gap)})` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar comparison */}
                    <div className="w-full bg-[#181b28] h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          !hasGap
                            ? 'bg-emerald-500'
                            : pct >= 80
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
