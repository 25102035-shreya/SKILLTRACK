import { ActionItem, Career, GoalSeekResult, ReadinessCategory, ReadinessResult, SkillGapItem, StudentProfile } from '../types';

export function calculateReadiness(
  academicScore: number,
  tech: number,
  apt: number,
  comm: number,
  proj: number,
  exp: number
): ReadinessResult {
  const academic = Math.min(100, Math.max(0, Number(academicScore) || 0));
  const technical = Math.min(100, Math.max(0, Number(tech) || 0));
  const aptitude = Math.min(100, Math.max(0, Number(apt) || 0));
  const communication = Math.min(100, Math.max(0, Number(comm) || 0));
  const projects = Math.min(100, Math.max(0, Number(proj) || 0));
  const exposure = Math.min(100, Math.max(0, Number(exp) || 0));

  const academicContribution = academic * 0.25;
  const technicalContribution = technical * 0.25;
  const aptitudeContribution = aptitude * 0.15;
  const communicationContribution = communication * 0.15;
  const projectsContribution = projects * 0.10;
  const exposureContribution = exposure * 0.10;

  const score = Number(
    (
      academicContribution +
      technicalContribution +
      aptitudeContribution +
      communicationContribution +
      projectsContribution +
      exposureContribution
    ).toFixed(2)
  );

  return {
    score,
    category: getCategory(score),
    breakdown: {
      academicContribution: Number(academicContribution.toFixed(2)),
      technicalContribution: Number(technicalContribution.toFixed(2)),
      aptitudeContribution: Number(aptitudeContribution.toFixed(2)),
      communicationContribution: Number(communicationContribution.toFixed(2)),
      projectsContribution: Number(projectsContribution.toFixed(2)),
      exposureContribution: Number(exposureContribution.toFixed(2)),
    },
  };
}

export function getCategory(score: number): ReadinessCategory {
  if (score >= 85) return 'Highly Prepared';
  if (score >= 70) return 'Placement Ready';
  if (score >= 50) return 'Needs Improvement';
  return 'Needs Attention';
}

export function getCategoryMeta(category: ReadinessCategory) {
  switch (category) {
    case 'Highly Prepared':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        badgeColor: '#10b981',
        ring: 'ring-emerald-500',
        barColor: 'bg-emerald-500',
        tierLabel: 'Tier 1 Prime',
        minThreshold: 85,
        nextTier: null,
        pointsNeededForNext: 0,
        description: 'Elite readiness profile. High-confidence eligibility for tier-1 engineering, product, and R&D campus placement drives.',
      };
    case 'Placement Ready':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/40',
        badgeColor: '#6366f1',
        ring: 'ring-indigo-500',
        barColor: 'bg-indigo-500',
        tierLabel: 'Tier 2 Ready',
        minThreshold: 70,
        nextTier: 'Highly Prepared' as ReadinessCategory,
        description: 'Solid profile meeting all standard placement benchmarks. Capable of clearing standard aptitude, technical, and interview rounds.',
      };
    case 'Needs Improvement':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        badgeColor: '#f59e0b',
        ring: 'ring-amber-500',
        barColor: 'bg-amber-500',
        tierLabel: 'Foundation Tier',
        minThreshold: 50,
        nextTier: 'Placement Ready' as ReadinessCategory,
        description: 'Approaching placement threshold. Targeted effort required in primary technical competencies and practical project exposure.',
      };
    case 'Needs Attention':
    default:
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        badgeColor: '#f43f5e',
        ring: 'ring-rose-500',
        barColor: 'bg-rose-500',
        tierLabel: 'Critical Intervention',
        minThreshold: 0,
        nextTier: 'Needs Improvement' as ReadinessCategory,
        description: 'Urgent intervention required. Significant gap across core academics, technical problem solving, or communication.',
      };
  }
}

export function calculateSkillGaps(career: Career, student: StudentProfile): SkillGapItem[] {
  return Object.entries(career.requiredSkills).map(([skill, reqLevel]) => {
    // Check if student has a specific skill score, otherwise use their global technical skill
    const studentScore = student.skillsInventory?.[skill] ?? student.technicalSkill;
    const gap = reqLevel - studentScore;
    let status: 'Good' | 'Medium Priority' | 'High Priority' = 'Good';
    if (gap > 0) {
      status = gap <= 12 ? 'Medium Priority' : 'High Priority';
    }

    return {
      skill,
      requiredLevel: reqLevel,
      studentScore,
      gap: Math.max(0, gap),
      status,
    };
  });
}

export function calculateCareerMatchScore(career: Career, student: StudentProfile): number {
  const items = calculateSkillGaps(career, student);
  if (items.length === 0) return 100;

  const totalMet = items.reduce((acc, curr) => {
    const ratio = Math.min(1, curr.studentScore / curr.requiredLevel);
    return acc + ratio;
  }, 0);

  const rawMatch = (totalMet / items.length) * 100;
  // Blend with general student technical skill
  const composite = (rawMatch * 0.7) + (student.technicalSkill * 0.3);
  return Math.min(100, Math.max(0, Math.round(composite)));
}

export function generateActionRoadmap(student: StudentProfile, career?: Career): ActionItem[] {
  const items: ActionItem[] = [];

  // Technical & Coding
  if (student.technicalSkill < 70) {
    items.push({
      id: 'act-tech-1',
      priority: 'high',
      dimension: 'Technical Skill (Weight: 25%)',
      title: 'Structured DSA & Core Language Mastery',
      description: 'Solve 2 LeetCode/HackerRank problems daily focusing on Arrays, HashMaps, and Binary Search to push technical proficiency above 75.',
      impactScore: '+4.5 to +6.0 Readiness Pts',
      timeframe: 'Next 30 Days',
    });
  } else if (student.technicalSkill < 85) {
    items.push({
      id: 'act-tech-2',
      priority: 'medium',
      dimension: 'Technical Skill (Weight: 25%)',
      title: 'Advanced System Design & Complex Algorithms',
      description: 'Practice dynamic programming, graph traversals, and microservice architectures for top-tier placement interviews.',
      impactScore: '+2.5 to +3.8 Readiness Pts',
      timeframe: '45-60 Days',
    });
  } else {
    items.push({
      id: 'act-tech-3',
      priority: 'strength',
      dimension: 'Technical Skill (Weight: 25%)',
      title: 'Competitive Coding & Tech Mentorship',
      description: 'Lead technical mock rounds and showcase open-source contributions in your portfolio.',
      impactScore: 'Core Placement Strength',
      timeframe: 'Ongoing',
    });
  }

  // Projects
  if (student.projects < 70) {
    items.push({
      id: 'act-proj-1',
      priority: 'high',
      dimension: 'Projects (Weight: 10%)',
      title: 'Build & Deploy Full-Stack Capstone',
      description: 'Ship an end-to-end production application featuring user auth, database indexing, and a live hosted demo URL on GitHub.',
      impactScore: '+2.0 to +3.0 Readiness Pts',
      timeframe: 'Next 21 Days',
    });
  } else {
    items.push({
      id: 'act-proj-2',
      priority: 'strength',
      dimension: 'Projects (Weight: 10%)',
      title: 'Production Metrics & README Polish',
      description: 'Add architectural diagrams, CI/CD badges, and performance benchmarks to your project repositories.',
      impactScore: 'Portfolio Ready',
      timeframe: '1-2 Weeks',
    });
  }

  // Aptitude
  if (student.aptitude < 75) {
    items.push({
      id: 'act-apt-1',
      priority: 'high',
      dimension: 'Aptitude & Logic (Weight: 15%)',
      title: 'Timed Quantitative & Logical Reasoning Drills',
      description: 'Complete 30-minute timed mock tests on speed math, probability, and analytical puzzles to pass initial screening cutoffs.',
      impactScore: '+2.2 to +3.5 Readiness Pts',
      timeframe: 'Next 14 Days',
    });
  }

  // Communication & Exposure
  if (student.communication < 70) {
    items.push({
      id: 'act-comm-1',
      priority: 'medium',
      dimension: 'Communication (Weight: 15%)',
      title: 'Behavioral STAR Format Mock Interviews',
      description: 'Practice explaining technical architecture decisions and non-technical problem resolution using the Situation-Task-Action-Result format.',
      impactScore: '+2.0 to +3.0 Readiness Pts',
      timeframe: '30 Days',
    });
  }

  if (student.exposure < 60) {
    items.push({
      id: 'act-exp-1',
      priority: 'medium',
      dimension: 'Industry Exposure (Weight: 10%)',
      title: 'Virtual Internship / Open Source Hackathon',
      description: 'Participate in a weekend hackathon or industry virtual internship program to demonstrate teamwork and practical tooling.',
      impactScore: '+1.5 to +2.5 Readiness Pts',
      timeframe: '45 Days',
    });
  }

  // Career-specific gap recommendation
  if (career) {
    const gaps = calculateSkillGaps(career, student).filter((g) => g.gap > 0);
    if (gaps.length > 0) {
      const topGap = gaps.sort((a, b) => b.gap - a.gap)[0];
      items.unshift({
        id: `act-career-${career.id}`,
        priority: 'high',
        dimension: `Target Role: ${career.roleName}`,
        title: `Bridge Critical Skill Gap: ${topGap.skill}`,
        description: `Target role requires score of ${topGap.requiredLevel} in ${topGap.skill} (current: ${topGap.studentScore}). Focus on core documentation and building a dedicated module.`,
        impactScore: `Close ${topGap.gap} Pt Deficit`,
        timeframe: 'Immediate Priority',
      });
    }
  }

  return items;
}

export function calculateGoalSeek(student: StudentProfile, targetScore: number): GoalSeekResult {
  const currentReadiness = calculateReadiness(
    student.academicScore,
    student.technicalSkill,
    student.aptitude,
    student.communication,
    student.projects,
    student.exposure
  ).score;

  const pointsNeeded = targetScore - currentReadiness;

  const dimensions = [
    { key: 'technicalSkill' as const, label: 'Technical & Coding', current: student.technicalSkill, weight: 0.25 },
    { key: 'projects' as const, label: 'Projects Portfolio', current: student.projects, weight: 0.10 },
    { key: 'aptitude' as const, label: 'Aptitude & Logic', current: student.aptitude, weight: 0.15 },
    { key: 'communication' as const, label: 'Communication Skills', current: student.communication, weight: 0.15 },
    { key: 'exposure' as const, label: 'Industry Exposure', current: student.exposure, weight: 0.10 },
    { key: 'academicScore' as const, label: 'Academic Standing', current: student.academicScore, weight: 0.25 },
  ];

  if (pointsNeeded <= 0) {
    return {
      targetScore,
      isPossible: true,
      requiredGains: [],
    };
  }

  // Calculate proportional realistic gains
  const requiredGains = dimensions.map((dim) => {
    // How much would this dimension need if it absorbed the score
    const maxPossibleGain = 100 - dim.current;
    const maxScoreContrib = maxPossibleGain * dim.weight;
    
    // Balanced distribution
    const proportionalGain = Math.min(
      maxPossibleGain,
      Math.round((pointsNeeded / (dim.weight * 3)))
    );

    return {
      dimension: dim.key,
      label: dim.label,
      current: dim.current,
      needed: Math.min(100, dim.current + Math.max(0, proportionalGain)),
      gain: Math.max(0, proportionalGain),
      weight: dim.weight,
    };
  }).filter((g) => g.gain > 0);

  return {
    targetScore,
    isPossible: true,
    requiredGains,
  };
}
