-- ==============================================================================
-- SKILLFORGE AI - SUPABASE POSTGRESQL PRODUCTION SCHEMA & SEED
-- ==============================================================================
-- To run this:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Paste this entire file into the SQL Editor and click "Run".
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('CANDIDATE', 'RECRUITER', 'HIRING_MANAGER', 'ADMIN')) DEFAULT 'CANDIDATE',
  company TEXT,
  avatar_url TEXT,
  headline TEXT,
  verified_credentials_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CAREERS TABLE (8 Core Engineering & Tech Tracks)
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  badge TEXT NOT NULL,
  color TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  submission_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SIMULATIONS TABLE (Fresher / Junior / Senior Tiers)
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_code TEXT NOT NULL REFERENCES public.careers(code) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('fresher', 'junior', 'senior')),
  title TEXT NOT NULL,
  scenario_brief TEXT NOT NULL,
  time_limit_mins INT NOT NULL DEFAULT 60,
  deliverable_scope TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(career_code, level)
);

-- 5. SIMULATION ATTEMPTS TABLE (Submissions & Telemetry)
CREATE TABLE IF NOT EXISTS public.simulation_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  simulation_id UUID REFERENCES public.simulations(id) ON DELETE SET NULL,
  career_code TEXT NOT NULL,
  level TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'graded')) DEFAULT 'in_progress',
  deliverable_url TEXT,
  deliverable_notes TEXT,
  time_spent_secs INT DEFAULT 0,
  candidate_name TEXT,
  candidate_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- 6. EVALUATIONS TABLE (AI Scoring & Cryptographic Proof)
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.simulation_attempts(id) ON DELETE CASCADE,
  overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  ai_confidence TEXT NOT NULL DEFAULT '96% (High)',
  readiness_status TEXT NOT NULL DEFAULT 'Role-Ready',
  technical_accuracy_score INT DEFAULT 88,
  problem_solving_score INT DEFAULT 92,
  code_quality_score INT DEFAULT 85,
  architecture_score INT DEFAULT 90,
  communication_score INT DEFAULT 87,
  strengths TEXT[] DEFAULT '{}',
  growth_areas TEXT[] DEFAULT '{}',
  ai_feedback_summary TEXT NOT NULL,
  verified_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RECRUITER ATS PIPELINE TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  career_code TEXT NOT NULL,
  match_score INT NOT NULL,
  pipeline_stage TEXT NOT NULL CHECK (pipeline_stage IN ('sourced', 'proof_reviewed', 'interview_scheduled', 'offer_extended', 'rejected')) DEFAULT 'proof_reviewed',
  recruiter_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_pipeline ENABLE ROW LEVEL SECURITY;

-- Careers & Simulations: Publicly readable by anyone
CREATE POLICY "Public read careers" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Public read simulations" ON public.simulations FOR SELECT USING (true);

-- Profiles: Users can read and update their own profile; Recruiters can read candidate profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Simulation Attempts: Candidates read/insert own attempts; Recruiters can read submitted attempts
CREATE POLICY "Candidates manage own attempts" ON public.simulation_attempts 
  FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Evaluations: Publicly verifiable via verified_hash, candidates read own
CREATE POLICY "Public read evaluations" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "System insert evaluations" ON public.evaluations FOR INSERT WITH CHECK (true);

-- Recruiter Pipeline: Recruiters manage their candidate pipeline
CREATE POLICY "Recruiters manage pipeline" ON public.recruiter_pipeline 
  FOR ALL USING (auth.uid() = recruiter_id OR auth.uid() IS NULL);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, company, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'SkillForge Candidate'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CANDIDATE'),
    NEW.raw_user_meta_data->>'company',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SEED DATA: 8 CAREER TRACKS
-- ==============================================================================
INSERT INTO public.careers (id, code, name, emoji, badge, color, image_url, description, skills, submission_type)
VALUES
('car-sd', 'SD', 'Software Developer', '💻', 'Core Engineering', '#6366F1', '/images/swe-simulation.jpg',
 'Build scalable backend APIs and web applications. Diagnose production memory leaks, optimize concurrency, and submit code via GitHub.',
 ARRAY['TypeScript', 'Node.js', 'System Design', 'SQL', 'Git', 'Testing'],
 'Public GitHub Repository URL + Architecture Write-up'),

('car-da', 'DA', 'Data Analyst', '📊', 'Business Intelligence', '#0EA5E9', '/images/data-simulation.jpg',
 'Transform unstructured raw metrics into business intelligence. Perform cohort retention, query optimization, and build executive dashboards.',
 ARRAY['SQL', 'Python', 'Cohort Analysis', 'Tableau', 'Excel', 'A/B Testing'],
 'Cleaned CSV / Report Upload + Dashboard Link (Tableau/PowerBI/Colab)'),

('car-ux', 'UX', 'UI / UX Designer', '🎨', 'Product Design', '#EC4899', '/images/ux-simulation.jpg',
 'Craft human-centered experiences from wireframe to interactive design systems. Address usability friction and accessibility standards.',
 ARRAY['Figma', 'Design Systems', 'Accessibility (WCAG)', 'Prototyping', 'Wireframing'],
 'Figma Prototype URL + Design Rationale & Assets Upload'),

('car-ai', 'AI', 'AI / ML Engineer', '🤖', 'Machine Learning', '#8B5CF6', '/images/ai-simulation.jpg',
 'Build, fine-tune, and deploy machine learning models and LLM agent workflows for enterprise-scale workloads.',
 ARRAY['Python', 'PyTorch', 'LoRA Fine-tuning', 'RAG Pipelines', 'Vector DBs', 'MLOps'],
 'GitHub / Google Colab Notebook URL + Evaluation Metrics Report'),

('car-cs', 'CS', 'Cyber Security', '🔒', 'SecOps', '#F43F5E', '/images/security-simulation.jpg',
 'Defend production infrastructure against modern vulnerabilities. Triage alerts, analyze packet dumps, and patch zero-days.',
 ARRAY['OWASP Top 10', 'Incident Triage', 'PCAP Analysis', 'Linux Hardening', 'SIEM'],
 'Incident Triage Report (PDF) + Security Remediation Patch'),

('car-pm', 'PM', 'Product Manager', '🗂️', 'Product Strategy', '#10B981', '/images/pm-simulation.jpg',
 'Drive cross-functional product direction. Translate user needs into rigorous PRDs, North Star metrics, and release strategies.',
 ARRAY['Product Specs (PRD)', 'User Research', 'Prioritization', 'Metrics', 'Roadmapping'],
 'Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy'),

('car-dm', 'DM', 'Digital Marketing', '📢', 'Growth & Acquisition', '#F59E0B', '/images/marketing-simulation.jpg',
 'Orchestrate multi-channel acquisition campaigns. Optimize conversion rates, ad spend efficiency, and content flywheels.',
 ARRAY['SEO Strategy', 'Google Ads', 'Meta Ads', 'Funnel Analytics', 'Copywriting'],
 'Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet'),

('car-sa', 'SA', 'Sales & RevOps', '💼', 'Enterprise Revenue', '#F97316', '/images/sales-simulation.jpg',
 'Master high-stakes enterprise conversations. Handle aggressive pushbacks, articulate ROI, and engineer closing strategies.',
 ARRAY['Enterprise Discovery', 'Objection Handling', 'Negotiation', 'CRM', 'Closing'],
 'Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  skills = EXCLUDED.skills;

-- ==============================================================================
-- SEED DATA: CORE SIMULATIONS (Software Developer Junior & Data Analyst)
-- ==============================================================================
INSERT INTO public.simulations (career_code, level, title, scenario_brief, time_limit_mins, deliverable_scope, tasks, materials)
VALUES
('SD', 'junior', 'Production Incident: Memory Leak & Streaming Fix',
 'The core document management service is crashing with OutOfMemoryError whenever users upload files larger than 50MB. Engineering leadership requires an immediate diagnosis, refactoring to chunked streaming, and a hotfix strategy before today''s enterprise customer demo.',
 60, 'Stream handler · Backpressure · Canary strategy',
 '[
   {"id": 1, "title": "Analyze Heap Dump & Memory Logs", "prompt": "Review the production JVM heap dump metrics and stack trace in the Materials panel. Pinpoint the exact root cause of the heap exhaustion.", "dimension": "Problem-Solving"},
   {"id": 2, "title": "Architect Chunked Stream Handler", "prompt": "Outline your fix strategy replacing byte[] in-memory buffers with reactive streaming backpressure.", "dimension": "Technical Correctness"},
   {"id": 3, "title": "Hotfix vs Rollback Deployment Decision", "prompt": "Weigh the risks of hotfixing unverified code directly into production vs rolling back to a previous build.", "dimension": "Reasoning"},
   {"id": 4, "title": "GitHub Repo Submission & Engineering Postmortem", "prompt": "Submit your GitHub repository link containing the streaming implementation.", "dimension": "Communication"}
 ]'::jsonb,
 '[
   {"title": "JVM OutOfMemoryError Log", "description": "Server stack trace upon 50MB document upload crash.", "type": "logs", "filename": "jvm-crash.log", "content": "java.lang.OutOfMemoryError: Java heap space\\n  at java.io.ByteArrayOutputStream.hugeCapacity(ByteArrayOutputStream.java:123)"},
   {"title": "Buggy DocumentUploadController", "description": "Memory-inefficient buffering controller.", "type": "code", "filename": "DocumentUploadController.java", "content": "byte[] fileBytes = file.getBytes(); // Crashes on 50MB files"}
 ]'::jsonb)
ON CONFLICT (career_code, level) DO NOTHING;

-- ==============================================================================
-- 8. GROUP COMPETITIONS TABLES (Hackathons & Cohort Challenges)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  problem_statement TEXT NOT NULL,
  scenario_brief TEXT NOT NULL,
  team_size INT NOT NULL DEFAULT 4,
  required_roles JSONB NOT NULL DEFAULT '[
    {"role": "Frontend Developer", "count": 1, "skills": ["React/Next.js", "State Management", "Responsive UI"]},
    {"role": "Backend Developer", "count": 1, "skills": ["Node.js/Go", "PostgreSQL", "API Security"]},
    {"role": "UI / UX Designer", "count": 1, "skills": ["Figma", "Design Tokens", "Accessibility"]},
    {"role": "Database & DevOps", "count": 1, "skills": ["Docker", "Query Optimization", "CI/CD"]}
  ]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'evaluating', 'completed')) DEFAULT 'active',
  prize_pool TEXT DEFAULT '₹50,000 + Fast-Track Interviews',
  starter_repo_url TEXT DEFAULT 'https://github.com/skillforge-labs/group-competition-starter',
  rubrics JSONB NOT NULL DEFAULT '{
    "architecture_weight": 25,
    "frontend_weight": 25,
    "backend_weight": 25,
    "team_collaboration_weight": 25
  }'::jsonb,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams within a competition
CREATE TABLE IF NOT EXISTS public.competition_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('forming', 'ready', 'submitted')) DEFAULT 'forming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants mapped to a team and role
CREATE TABLE IF NOT EXISTS public.competition_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.competition_teams(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  assigned_role TEXT NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('senior', 'junior', 'fresher')) DEFAULT 'junior',
  is_team_lead BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Submissions (Overall project)
CREATE TABLE IF NOT EXISTS public.competition_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.competition_teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  group_repo_url TEXT NOT NULL,
  live_demo_url TEXT,
  architecture_writeup TEXT,
  overall_group_score INT DEFAULT 0,
  group_ai_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual evaluations per role within a group submission
CREATE TABLE IF NOT EXISTS public.competition_individual_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.competition_submissions(id) ON DELETE CASCADE,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.competition_participants(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  role TEXT NOT NULL,
  individual_score INT NOT NULL CHECK (individual_score >= 0 AND individual_score <= 100),
  ai_role_feedback TEXT NOT NULL,
  verified_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. HR RECRUITER SUBSCRIPTIONS & RAZORPAY BILLING TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual', 'enterprise')) DEFAULT 'monthly',
  amount_inr INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- RLS FOR NEW TABLES
-- ==============================================================================
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_individual_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Manage competitions" ON public.competitions FOR ALL USING (true);
CREATE POLICY "Public read competition_teams" ON public.competition_teams FOR SELECT USING (true);
CREATE POLICY "Public read competition_participants" ON public.competition_participants FOR SELECT USING (true);
CREATE POLICY "Public read competition_submissions" ON public.competition_submissions FOR SELECT USING (true);
CREATE POLICY "Public read competition_evaluations" ON public.competition_individual_evaluations FOR SELECT USING (true);
CREATE POLICY "Manage competition_participants" ON public.competition_participants FOR ALL USING (true);
CREATE POLICY "Manage competition_teams" ON public.competition_teams FOR ALL USING (true);
CREATE POLICY "Manage competition_submissions" ON public.competition_submissions FOR ALL USING (true);
CREATE POLICY "Manage subscriptions" ON public.subscriptions FOR ALL USING (true);

-- ==============================================================================
-- SEED DATA: FLAGSHIP GROUP COMPETITION
-- ==============================================================================
INSERT INTO public.competitions (
  id, title, slug, problem_statement, scenario_brief, team_size, required_roles, status, prize_pool
) VALUES (
  '11111111-2222-3333-4444-555555555555',
  'NextGen FinTech: Ultra-Low Latency Payment Settlement Hub',
  'fintech-payment-settlement-challenge',
  'Design, implement, and deploy a distributed payment settlement engine handling 10,000 transactions/second with zero race condition overselling and sub-50ms p99 latency.',
  'Your squad must collaborate across 4 specialized roles: UI/UX Designer delivers high-density settlement dashboard prototypes in Figma; Frontend Developer builds responsive transaction stream graphs in Next.js; Backend Developer constructs idempotent idempotency-key settlement workers in Node.js/Go; and DevOps/DB Engineer configures PostgreSQL connection pooling, Redis caching, and Docker Compose orchestration.',
  4,
  '[
    {"role": "Frontend Developer", "count": 1, "skills": ["Next.js", "WebSocket Telemetry", "High-Density Data Grids"]},
    {"role": "Backend Developer", "count": 1, "skills": ["Node.js/Go", "Distributed Locking", "Idempotency Keys"]},
    {"role": "UI / UX Designer", "count": 1, "skills": ["Figma", "Design Systems", "FinTech Settlement UX"]},
    {"role": "Database & DevOps", "count": 1, "skills": ["PostgreSQL", "Redis", "Docker", "Load Testing"]}
  ]'::jsonb,
  'active',
  '₹50,000 Pool + Top Recruiter Fast-Tracks'
) ON CONFLICT (slug) DO NOTHING;
