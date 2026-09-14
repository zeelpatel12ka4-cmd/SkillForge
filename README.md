# SkillForge AI 🚀
### Enterprise Proof-of-Skill & Multi-Role Squad Simulation Platform

SkillForge is a comprehensive career readiness and talent verification platform featuring real-time interactive incident simulations, in-browser code sandbox execution, Google Gemini AI 2.5 Flash evaluations, automated ATS candidate pipelines, Razorpay recruiter subscriptions, and multi-role squad competitions.

---

## 🌟 Key Features

### 1. In-Browser Simulation Lab & Live Incident Sandbox
- **Realistic Incident Workspaces:** Hands-on scenarios across 8 engineering and business tracks (Software Developer, Data Analyst, UX Designer, Product Manager, Cybersecurity, DevOps, etc.) and 3 rigor tiers (Fresher, Junior, Senior).
- **In-Browser Code Editor:** Candidate writes fixes directly in a syntax-highlighted editor without requiring local dev setups.
- **Incident Test Harness:** Instant client-side assertion testing with runtime pass/fail logs and duration metrics.
- **💡 AI Mentor Diagnostics:** Real-time tactical hints powered by **Google Gemini 2.5 Flash**.

### 2. Universal Google Gemini 2.5 Flash Evaluation Engine
- Multi-dimensional technical grading across 4 core rubrics: Architecture, Code Quality, Security, and Performance.
- Cryptographically verified SHA-256 deliverable proofs minted on completion.
- Automated gamification engine awarding real-time XP, level progressions, and verified skill badges.

### 3. Multi-Role Squad Competitions (Hackathons)
- Cross-functional team formation (Frontend, Backend, UI/UX, DevOps/Database).
- Admin management console to launch, edit, and audit concurrent hackathons.
- Squad and individual real-time leaderboards with role-specific performance weighting.

### 4. Recruiter Talent ATS & One-Click Apply
- Verified jobs board with real-time semantic candidate-to-job matching percentages.
- Recruiter ATS Inspector with stage synchronization (`reviewing`, `interview`, `shortlisted`, `pool`).
- Transparent candidate skill gap analysis and proof inspections.

### 5. Administrator Command Center
- Role-based access control (`CANDIDATE`, `RECRUITER`, `ADMIN`).
- Razorpay subscription & billing engine for recruiter company activations.
- Candidate deliverables audit with live verification controls.

---

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Modular CSS Design System & Theme Engine (Clean Light / Emerald Light / Dark)
- **AI Engine:** Google Gemini 2.5 Flash API
- **Database & Auth:** Supabase PostgreSQL & Auth / Local reactive state store
- **Payments:** Razorpay API Gateway

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/zeelpatel12ka4-cmd/SkillForge.git
cd SkillForge/skillforge-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure
```
SKILLFORGE/
├── DOC/                       # Project Requirements Document & System Specs
├── SKILL/                     # Career track diagnostics & skill blueprints
└── skillforge-app/            # Main Next.js Fullstack Application
    ├── src/
    │   ├── app/               # Next.js App Router (Pages & API Routes)
    │   │   ├── admin/         # Admin Command Center
    │   │   ├── api/           # Gemini AI & Razorpay API Endpoints
    │   │   ├── auth/          # Authentication flows
    │   │   ├── competitions/  # Multi-role Squad Hackathons
    │   │   ├── hr/            # Recruiter Talent ATS
    │   │   ├── jobs/          # Verified Job Board
    │   │   └── simulation/    # Interactive Simulation Lab & Sandbox
    │   ├── components/        # Layout, UI components, Modals, TopHeader
    │   ├── services/          # Gemini, ATS, Payments, Gamification, Sandboxing
    │   └── styles/            # Design system, themes, and global CSS
    └── public/                # Static assets & icons
```

---

## 📄 License
This project is proprietary and confidential. Built for enterprise proof-of-skill talent verification.
