/**
 * SkillForge AI — Simulation Domain Model & Type Definitions
 * Single source of truth for realistic practical work simulations.
 */

export type CareerCode =
  | "SD"      // Software Developer
  | "DA"      // Data Analyst
  | "UX"      // UI / UX Designer
  | "AI"      // AI / ML Engineer
  | "CYBER"   // Cyber Security
  | "PM"      // Product Manager
  | "DM"      // Digital Marketing
  | "SALES";  // Sales / Solutions

export type SeniorityLevel = "fresher" | "junior" | "senior";

export type TaskType =
  | "investigation"
  | "architecture"
  | "implementation"
  | "validation"
  | "decision"
  | "communication";

export type MaterialType =
  | "code"
  | "logs"
  | "dataset"
  | "docs"
  | "config"
  | "metrics"
  | "transcript";

export type ValidationStrategyType =
  | "code_static"
  | "code_runtime"
  | "sql_static"
  | "sql_runtime"
  | "dataset_rules"
  | "numerical"
  | "document_structure"
  | "design_checklist"
  | "rubric_only"
  | "mixed";

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  description: string;
  content: string;
  filename?: string;
  relevance: string; // Explains which tasks rely on this material
}

export interface ValidationRule {
  id: string;
  description: string;
  type: ValidationStrategyType;
  parameters?: Record<string, any>;
  expectedSnippet?: string;
  prohibitedSnippet?: string;
  minWordCount?: number;
  requiredSections?: string[];
  tolerancePercent?: number;
}

export interface TaskDefinition {
  id: number;
  title: string;
  type: TaskType;
  dimension: string; // Rubric dimension (e.g., Problem-Solving, Technical Correctness)
  objective: string;
  context: string;
  prompt: string;
  constraints: string[];
  expectedOutput: string;
  acceptanceCriteria: string[];
  skills: string[];
  evidenceRequired: string[];
  validationRules: ValidationRule[];
  rubricWeight: number; // Percentage contribution to simulation (e.g. 25%)
  hints: string[];
  timeEstimateMins: number;
}

export interface DeliverableField {
  name: string;
  label: string;
  type: "text" | "url" | "code" | "file";
  placeholder: string;
  required: boolean;
  helpText: string;
}

export interface DeliverableDefinition {
  type: string; // e.g., "GitHub Repo + Architecture Write-up", "Cleaned CSV + Dashboard"
  description: string;
  fields: DeliverableField[];
  validationRules: ValidationRule[];
}

export interface RubricDimension {
  id: string;
  name: string;
  weight: number; // Must sum to 100 across all dimensions
  description: string;
  criteria: string[];
}

export interface SimulationProgression {
  onSuccess: {
    recommendedTrack: string;
    recommendedLevel: SeniorityLevel;
    rationale: string;
  };
  onRemediation: {
    recommendedTrack: string;
    recommendedLevel: SeniorityLevel;
    targetSkill: string;
    rationale: string;
  };
}

export interface SimulationDefinition {
  id: string; // e.g. "SIM-SD-JUN-001"
  version: string; // e.g. "1.0.0"
  careerCode: CareerCode;
  level: SeniorityLevel;
  title: string;
  roleContext: {
    roleTitle: string;
    team: string;
    companyContext: string;
    reportingTo: string;
  };
  scenario: string;
  businessContext: string;
  objective: string;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  learningOutcomes: string[];
  skills: string[];
  tasks: TaskDefinition[];
  materials: Material[];
  deliverable: DeliverableDefinition;
  rubric: RubricDimension[];
  hints: string[];
  progression: SimulationProgression;
  status: "active" | "draft";
}

export interface TaskValidationResult {
  passed: boolean;
  score: number; // 0 - 100
  evidence: string[];
  failures: string[];
  warnings: string[];
  validatorType: string;
}

export interface SimulationAttemptState {
  id: string;
  userId: string;
  simulationId: string;
  careerCode: CareerCode;
  level: SeniorityLevel;
  startedAt: string;
  submittedAt?: string;
  timeSpentSecs: number;
  currentTaskIndex: number;
  taskAnswers: Record<number, string>;
  taskValidationResults: Record<number, TaskValidationResult>;
  deliverables: Record<string, string>;
  status: "in_progress" | "submitted" | "evaluated";
}

export interface SkillGapItem {
  skill: string;
  score: number;
  status: "critical_gap" | "growth_area" | "verified_strength";
  targetScore: number;
  remediationRecommendation: string;
}

export interface DetailedEvaluationResult {
  overallScore: number;
  readinessStatus: string;
  taskScores: Record<number, { score: number; feedback: string }>;
  rubricScores: Record<string, number>;
  skillScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  skillGaps: SkillGapItem[];
  verifiedHash: string;
  evaluatedAt: string;
  model: string;
  reasoningSummary: string;
  recommendedNextSimulation: {
    careerCode: string;
    level: SeniorityLevel;
    title: string;
    rationale: string;
  };
}
