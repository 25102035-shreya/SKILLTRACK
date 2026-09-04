export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface Career {
  id: string;
  roleName: string;
  category?: 'Software' | 'Data & AI' | 'DevOps & Cloud' | 'Core Engineering';
  requiredSkills: Record<string, number>;
  description?: string;
}

export interface StudentProfile {
  id?: string;
  name: string;
  branch?: string;
  batch?: string;
  targetRole?: string;
  academicScore: number; // 0-100 (Weight: 25%)
  technicalSkill: number; // 0-100 (Weight: 25%)
  aptitude: number; // 0-100 (Weight: 15%)
  communication: number; // 0-100 (Weight: 15%)
  projects: number; // 0-100 (Weight: 10%)
  exposure: number; // 0-100 (Weight: 10%)
  skillsInventory?: Record<string, number>;
}

export type ReadinessCategory =
  | 'Highly Prepared'
  | 'Placement Ready'
  | 'Needs Improvement'
  | 'Needs Attention';

export interface ReadinessResult {
  score: number;
  category: ReadinessCategory;
  breakdown: {
    academicContribution: number;
    technicalContribution: number;
    aptitudeContribution: number;
    communicationContribution: number;
    projectsContribution: number;
    exposureContribution: number;
  };
}

export interface SkillGapItem {
  skill: string;
  requiredLevel: number;
  studentScore: number;
  gap: number;
  status: 'Good' | 'Medium Priority' | 'High Priority';
}

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'strength';
  dimension: string;
  title: string;
  description: string;
  impactScore: string;
  timeframe: string;
}

export interface GoalSeekResult {
  targetScore: number;
  isPossible: boolean;
  requiredGains: {
    dimension: keyof Omit<StudentProfile, 'id' | 'name' | 'branch' | 'batch' | 'targetRole' | 'skillsInventory'>;
    label: string;
    current: number;
    needed: number;
    gain: number;
    weight: number;
  }[];
}
