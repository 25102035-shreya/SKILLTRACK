import React, { useState, useEffect, useRef } from 'react';
import { Career, StudentProfile } from '../types';
import { calculateReadiness, getCategory } from '../utils/calculator';
import { CornerDownLeft, Trash2, Terminal, Play, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  student: StudentProfile | null;
  careers: Career[];
  onUpdateStudent: (student: StudentProfile) => void;
}

type Step =
  | 'IDLE_MENU'
  | 'CREATE_PROFILE_NAME'
  | 'ENTER_ACADEMIC'
  | 'ENTER_TECH'
  | 'ENTER_APT'
  | 'ENTER_COMM'
  | 'ENTER_PROJ'
  | 'ENTER_EXP'
  | 'SELECT_CAREER'
  | 'WHAT_IF_INPUT';

export const ConsoleTerminal: React.FC<Props> = ({ student, careers, onUpdateStudent }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<Step>('IDLE_MENU');
  const [tempProfile, setTempProfile] = useState<Partial<StudentProfile>>({});
  const [timeString, setTimeString] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const printMenu = () => {
    return [
      '===== SKILLTRACK CLI MENU =====',
      '1. Create / Rename Student Profile',
      '2. Enter / Override Performance Data',
      '3. Run Live Readiness Audit',
      '4. Career Skill Gap Analysis',
      '5. What-If Simulation Query',
      '6. Clear Terminal Buffer',
      'Select option (1-6):',
    ];
  };

  // Initialize terminal on mount
  useEffect(() => {
    const welcome = [
      'Java SkillTrack Console Application [Version 2.0.4-LTS]',
      'Virtual Runtime: OpenJDK 64-Bit Server VM',
      'Active Student Context: ' + (student?.name || 'Aarav Patel'),
      'Console synchronized with GUI state.',
      ...printMenu(),
    ];
    setLogs(welcome);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLines = (lines: string[]) => {
    setLogs((prev) => [...prev, ...lines]);
  };

  const handleCommand = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input && step === 'IDLE_MENU') return;

    addLines([`$ ${input}`]);
    setInputValue('');

    switch (step) {
      case 'IDLE_MENU': {
        const choice = parseInt(input, 10);
        if (choice === 1) {
          addLines(['Enter Student Name: ']);
          setStep('CREATE_PROFILE_NAME');
        } else if (choice === 2) {
          if (!student) {
            addLines(['Create profile first!', ...printMenu()]);
            return;
          }
          addLines(['Enter Academic Score (0-100): ']);
          setTempProfile({ name: student.name });
          setStep('ENTER_ACADEMIC');
        } else if (choice === 3) {
          if (!student) {
            addLines(['Create profile first!', ...printMenu()]);
            return;
          }
          const res = calculateReadiness(
            student.academicScore,
            student.technicalSkill,
            student.aptitude,
            student.communication,
            student.projects,
            student.exposure
          );
          addLines([
            '',
            '--- READINESS AUDIT RESULT ---',
            `Student: ${student.name}`,
            `Readiness Score: ${res.score.toFixed(2)} / 100`,
            `Category Tier: ${getCategory(res.score)}`,
            `Breakdown: Acad(${res.breakdown.academicContribution}) Tech(${res.breakdown.technicalContribution}) Apt(${res.breakdown.aptitudeContribution}) Comm(${res.breakdown.communicationContribution}) Proj(${res.breakdown.projectsContribution}) Exp(${res.breakdown.exposureContribution})`,
            '',
            ...printMenu(),
          ]);
        } else if (choice === 4) {
          if (!student) {
            addLines(['Create profile first!', ...printMenu()]);
            return;
          }
          const lines = ['', 'Select Target Career:'];
          careers.forEach((c, idx) => {
            lines.push(`${idx + 1}. ${c.roleName}`);
          });
          lines.push('Enter choice number: ');
          addLines(lines);
          setStep('SELECT_CAREER');
        } else if (choice === 5) {
          if (!student) {
            addLines(['Create profile first!', ...printMenu()]);
            return;
          }
          const currentScore = calculateReadiness(
            student.academicScore,
            student.technicalSkill,
            student.aptitude,
            student.communication,
            student.projects,
            student.exposure
          ).score;

          addLines([
            '',
            '--- WHAT-IF SIMULATOR ---',
            `Current Readiness: ${currentScore.toFixed(2)} (Tech: ${student.technicalSkill})`,
            'Enter hypothetical Technical Score (0-100):',
          ]);
          setStep('WHAT_IF_INPUT');
        } else if (choice === 6) {
          setLogs(['Terminal buffer cleared.', ...printMenu()]);
        } else {
          addLines(['Invalid option! Please enter 1-6.', ...printMenu()]);
        }
        break;
      }

      case 'CREATE_PROFILE_NAME': {
        const newName = input || 'Student';
        const newStudent: StudentProfile = {
          name: newName,
          branch: student?.branch || 'Computer Science',
          batch: student?.batch || 'Class of 2026',
          academicScore: 78,
          technicalSkill: 75,
          aptitude: 75,
          communication: 70,
          projects: 65,
          exposure: 60,
        };
        onUpdateStudent(newStudent);
        addLines([`Profile active for: ${newName}`, ...printMenu()]);
        setStep('IDLE_MENU');
        break;
      }

      case 'ENTER_ACADEMIC': {
        const val = parseFloat(input);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        setTempProfile((p) => ({ ...p, academicScore: val }));
        addLines(['Enter Technical / Coding Score (0-100): ']);
        setStep('ENTER_TECH');
        break;
      }

      case 'ENTER_TECH': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        setTempProfile((p) => ({ ...p, technicalSkill: val }));
        addLines(['Enter Aptitude & Logic Score (0-100): ']);
        setStep('ENTER_APT');
        break;
      }

      case 'ENTER_APT': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        setTempProfile((p) => ({ ...p, aptitude: val }));
        addLines(['Enter Communication Score (0-100): ']);
        setStep('ENTER_COMM');
        break;
      }

      case 'ENTER_COMM': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        setTempProfile((p) => ({ ...p, communication: val }));
        addLines(['Enter Projects Portfolio Score (0-100): ']);
        setStep('ENTER_PROJ');
        break;
      }

      case 'ENTER_PROJ': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        setTempProfile((p) => ({ ...p, projects: val }));
        addLines(['Enter Industry Exposure Score (0-100): ']);
        setStep('ENTER_EXP');
        break;
      }

      case 'ENTER_EXP': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input. Numbers only.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        const updated: StudentProfile = {
          ...student,
          name: tempProfile.name || student?.name || 'Student',
          academicScore: tempProfile.academicScore ?? 75,
          technicalSkill: tempProfile.technicalSkill ?? 70,
          aptitude: tempProfile.aptitude ?? 70,
          communication: tempProfile.communication ?? 65,
          projects: tempProfile.projects ?? 60,
          exposure: val,
        };
        onUpdateStudent(updated);
        addLines(['Profile successfully updated from CLI!', ...printMenu()]);
        setStep('IDLE_MENU');
        break;
      }

      case 'SELECT_CAREER': {
        const idx = parseInt(input, 10) - 1;
        if (idx >= 0 && idx < careers.length) {
          const selected = careers[idx];
          const lines = [
            '',
            `--- SKILL GAPS FOR ${selected.roleName.toUpperCase()} ---`,
          ];
          const tech = student?.technicalSkill || 70;
          Object.entries(selected.requiredSkills).forEach(([skill, req]) => {
            const reqNum = Number(req);
            const gap = reqNum - tech;
            if (gap > 0) {
              lines.push(`• ${skill}: Required ${reqNum} | Student ${tech} => GAP -${gap} PTS`);
            } else {
              lines.push(`• ${skill}: Required ${reqNum} | Student ${tech} => BENCHMARK MET`);
            }
          });
          lines.push('', ...printMenu());
          addLines(lines);
        } else {
          addLines(['Invalid selection.', ...printMenu()]);
        }
        setStep('IDLE_MENU');
        break;
      }

      case 'WHAT_IF_INPUT': {
        const val = parseInt(input, 10);
        if (isNaN(val)) {
          addLines(['Invalid input.', ...printMenu()]);
          setStep('IDLE_MENU');
          return;
        }
        if (!student) return;
        const currentScore = calculateReadiness(
          student.academicScore,
          student.technicalSkill,
          student.aptitude,
          student.communication,
          student.projects,
          student.exposure
        ).score;

        const newScore = calculateReadiness(
          student.academicScore,
          val,
          student.aptitude,
          student.communication,
          student.projects,
          student.exposure
        ).score;

        const diff = newScore - currentScore;
        addLines([
          '',
          `Hypothetical Technical Score: ${val}`,
          `Baseline Readiness: ${currentScore.toFixed(2)}`,
          `Predicted Readiness: ${newScore.toFixed(2)} (${diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} pts)`,
          `Predicted Tier: ${getCategory(newScore)}`,
          '',
          ...printMenu(),
        ]);
        setStep('IDLE_MENU');
        break;
      }
    }
  };

  return (
    <div className="bg-[#0b0c11] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono-code text-xs flex flex-col">
      {/* Terminal Bar */}
      <div className="bg-[#141620] px-4 py-2.5 border-b border-white/10 flex justify-between items-center text-[11px]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
          </div>
          <span className="text-white/80 font-bold tracking-wider flex items-center gap-1.5 ml-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            SKILLTRACK_CLI.JAR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[10px] hidden sm:inline">{timeString}</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/40 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setLogs(printMenu())}
            className="text-white/40 hover:text-white transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Log View */}
      <div
        className={`p-4 overflow-y-auto space-y-1 text-[11px] leading-relaxed text-white/80 select-text transition-all ${
          isExpanded ? 'h-96' : 'h-48'
        }`}
      >
        {logs.map((line, idx) => (
          <div
            key={idx}
            className={
              line.startsWith('=====')
                ? 'text-indigo-400 font-bold mt-1'
                : line.startsWith('---')
                ? 'text-emerald-400 font-bold'
                : line.startsWith('$')
                ? 'text-white font-bold'
                : line.includes('GAP')
                ? 'text-rose-400'
                : line.includes('MET')
                ? 'text-emerald-400'
                : 'text-white/70'
            }
          >
            {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-2 bg-[#10121a] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-white/30 uppercase mr-1 flex items-center gap-1 shrink-0">
          <Play className="w-3 h-3 text-indigo-400" /> CLI:
        </span>
        <button
          type="button"
          onClick={() => handleCommand('3')}
          className="px-2.5 py-1 text-[10px] rounded bg-[#181b28] border border-white/10 hover:border-indigo-500 text-white/80 shrink-0 cursor-pointer"
        >
          [3] Run Audit
        </button>
        <button
          type="button"
          onClick={() => handleCommand('4')}
          className="px-2.5 py-1 text-[10px] rounded bg-[#181b28] border border-white/10 hover:border-indigo-500 text-white/80 shrink-0 cursor-pointer"
        >
          [4] Skill Gaps
        </button>
        <button
          type="button"
          onClick={() => handleCommand('5')}
          className="px-2.5 py-1 text-[10px] rounded bg-[#181b28] border border-white/10 hover:border-indigo-500 text-white/80 shrink-0 cursor-pointer"
        >
          [5] What-If
        </button>
        <button
          type="button"
          onClick={() => handleCommand('2')}
          className="px-2.5 py-1 text-[10px] rounded bg-[#181b28] border border-white/10 hover:border-indigo-500 text-white/80 shrink-0 cursor-pointer"
        >
          [2] Enter Data
        </button>
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputValue);
        }}
        className="px-4 py-2.5 bg-[#141620] border-t border-white/10 flex items-center gap-2.5"
      >
        <span className="text-emerald-400 font-bold select-none text-xs font-mono-code">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            step === 'IDLE_MENU'
              ? 'Enter command option (1-6) or click quick action...'
              : 'Enter value and press Enter...'
          }
          className="flex-1 bg-transparent text-white placeholder-white/20 focus:outline-none font-mono-code text-xs"
        />
        <button
          type="submit"
          className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
          title="Send command"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
