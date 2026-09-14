# ⚡ SkillForge AI - Supabase Database Setup Guide

SkillForge uses Supabase (PostgreSQL + Row Level Security + Auth) for scalable, secure candidate simulations, verified credential badges, and recruiter ATS candidate pipelines.

---

### Step 1: Create a Supabase Project
1. Go to [https://database.new](https://database.new) (or log in at [supabase.com](https://supabase.com)).
2. Create a new project named **SkillForge** (or your preferred name).
3. Select your preferred region and set a database password.

---

### Step 2: Run the SQL Schema & Seed
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar (or navigate to `/project/_/sql`).
2. Open [`supabase/schema.sql`](./schema.sql) in this repository.
3. Copy the entire contents of `schema.sql` and paste it into the Supabase SQL Editor.
4. Click **Run** (green button).

This sets up:
- ✅ **`profiles`** table linked to `auth.users` with automated sign-up trigger
- ✅ **`careers`** table pre-seeded with all 8 career tracks
- ✅ **`simulations`** table pre-seeded with Fresher/Junior/Senior simulation briefs
- ✅ **`simulation_attempts`** table for candidate repository submissions & timing
- ✅ **`evaluations`** table with cryptographic proof hashes & 5-dimension rubric scores
- ✅ **`recruiter_pipeline`** table for recruiter ATS candidate ranking
- ✅ **Row Level Security (RLS)** policies ensuring private candidate deliverables

---

### Step 3: Add Credentials to `.env.local`
1. In the Supabase Dashboard, click **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **`anon` `public`** API Key.
3. Open `.env.local` in `skillforge-app/` and update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

4. Restart your dev server:
```bash
npm run dev
```

---

### Step 4: Verify Connection
- Open [http://localhost:3001](http://localhost:3001)
- The header badge will change from **🟡 DB: Demo Mode** to **🟢 Supabase Live**!
- Any new candidate simulation submission will now be permanently stored in your Supabase PostgreSQL database!
