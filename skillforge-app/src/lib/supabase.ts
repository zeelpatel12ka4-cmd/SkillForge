import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Returns true if real Supabase environment variables have been supplied in .env.local
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project.supabase.co") &&
    !supabaseAnonKey.includes("your-anon-key") &&
    supabaseUrl.startsWith("http")
  );
}

// Fallback safe client for static build & offline demo mode
const safeUrl = isSupabaseConfigured() ? supabaseUrl : "https://placeholder-project.supabase.co";
const safeAnonKey = isSupabaseConfigured() ? supabaseAnonKey : "placeholder-anon-key";

export const supabase = createBrowserClient(safeUrl, safeAnonKey);

export type UserRole = "CANDIDATE" | "RECRUITER" | "HIRING_MANAGER" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  company?: string;
  avatar_url?: string;
  headline?: string;
  verified_credentials_count?: number;
  created_at?: string;
}

export interface CareerTrackRecord {
  id: string;
  code: string;
  name: string;
  emoji: string;
  badge: string;
  color: string;
  image_url?: string;
  description: string;
  skills: string[];
  submission_type: string;
}

export interface SimulationRecord {
  id: string;
  career_code: string;
  level: "fresher" | "junior" | "senior";
  title: string;
  scenario_brief: string;
  time_limit_mins: number;
  deliverable_scope: string;
  tasks: Array<{
    id: number;
    title: string;
    prompt: string;
    dimension: string;
  }>;
  materials: Array<{
    title: string;
    description: string;
    type: "code" | "logs" | "dataset" | "docs";
    filename?: string;
    content: string;
  }>;
}

export interface SimulationAttemptRecord {
  id: string;
  user_id?: string;
  simulation_id?: string;
  career_code: string;
  level: string;
  status: "in_progress" | "submitted" | "graded";
  deliverable_url?: string;
  deliverable_notes?: string;
  time_spent_secs?: number;
  candidate_name?: string;
  candidate_email?: string;
  created_at?: string;
  submitted_at?: string;
}

export interface EvaluationRecord {
  id: string;
  attempt_id: string;
  overall_score: number;
  ai_confidence: string;
  readiness_status: string;
  technical_accuracy_score: number;
  problem_solving_score: number;
  code_quality_score: number;
  architecture_score: number;
  communication_score: number;
  strengths: string[];
  growth_areas: string[];
  ai_feedback_summary: string;
  verified_hash: string;
  created_at?: string;
}

export interface RecruiterPipelineRecord {
  id: string;
  recruiter_id?: string;
  candidate_id?: string;
  evaluation_id?: string;
  candidate_name: string;
  candidate_email: string;
  career_code: string;
  match_score: number;
  pipeline_stage: "sourced" | "proof_reviewed" | "interview_scheduled" | "offer_extended" | "rejected";
  recruiter_notes?: string;
  created_at?: string;
}
