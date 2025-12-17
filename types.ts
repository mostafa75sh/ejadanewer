export type EvidenceType = 'IMAGE' | 'LINK' | 'VIDEO' | 'PDF' | 'TEXT';

export interface Evidence {
  id: string;
  type: EvidenceType;
  content: string; // URL, Base64, or Text
  notes?: string;
}

export type IndicatorType = 'NUMBER' | 'PERCENTAGE' | 'DATE';

export interface Result {
  id: string;
  name: string;
  weight: number;
  indicatorType: IndicatorType;
  targetLow: string;
  targetExpected: string;
  targetHigh: string;
  actualPerformance: string;
  evidence: Evidence[];
}

export type ObjectiveClassification = 'ANNUAL_PLAN' | 'TASKS' | 'DEVELOPMENT';

export interface Objective {
  id: string;
  text: string;
  classification: ObjectiveClassification;
  weight: number;
  results: Result[];
}

export interface EmployeeProfile {
  name: string;
  jobTitle: string;
  institution: string;
  managerName: string;
  governorate: string;
  period: 'FIRST' | 'SECOND';
  year: string;
  schoolLogo?: string;
}

export interface AppState {
  profile: EmployeeProfile;
  objectives: Objective[];
}

export const GOVERNORATES = [
  "مسقط",
  "ظفار",
  "مسندم",
  "البريمي",
  "الداخلية",
  "شمال الباطنة",
  "جنوب الباطنة",
  "شمال الشرقية",
  "جنوب الشرقية",
  "الظاهرة",
  "الوسطى"
];

export const CLASSIFICATIONS: Record<ObjectiveClassification, string> = {
  ANNUAL_PLAN: "الخطة السنوية",
  TASKS: "هدف يساهم في تحقيق المهام والاختصاصات الوظيفية",
  DEVELOPMENT: "تطوير وتحسين العمل"
};