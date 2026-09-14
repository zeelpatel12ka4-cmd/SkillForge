-- ==============================================================================
-- MIGRATION: GROUP COMPETITIONS & RAZORPAY SUBSCRIPTIONS
-- ==============================================================================
-- Paste into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xqdkszifdifruwnsjdxs/sql/new
-- ==============================================================================

-- 1. COMPETITIONS TABLE
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

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.competition_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('forming', 'ready', 'submitted')) DEFAULT 'forming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARTICIPANTS TABLE
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

-- 4. SUBMISSIONS TABLE
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

-- 5. INDIVIDUAL EVALUATIONS TABLE
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

-- 6. SUBSCRIPTIONS TABLE
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

-- 7. RLS
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

-- 8. SEED FLAGSHIP COMPETITION
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
