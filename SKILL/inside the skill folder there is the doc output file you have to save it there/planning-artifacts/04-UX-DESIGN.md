# SkillForge AI — UX Design Document (DESIGN.md)
**Document Type:** UX Design  
**Agent:** Sally (UX Designer) — BMAD Method  
**Version:** 1.0  
**Date:** 2026-09-11  
**Status:** Draft — Pending Review

---

# 1. DESIGN PHILOSOPHY

## 1.1 Core Design Principles

1. **Evidence Over Impressions** — Every score, gap, and recommendation must show its reasoning. Users should never have to trust a number they cannot understand.
2. **Progress Feels Real** — Candidates must feel movement and growth at every session. The platform should make "I'm improving" tangible, not abstract.
3. **Recruiter Time Is Precious** — HR screens should eliminate friction, not add steps. Information hierarchy is aggressive — most important signal is always above the fold.
4. **Confidence Through Clarity** — Anxiety around career readiness is the enemy. The design must present hard truths (skill gaps, low scores) with empathy and a clear next step, never a dead end.
5. **Human Always in Control** — AI suggestions are clearly framed as suggestions. Recruiters and hiring managers always retain visible, explicit control.

---

# 2. DESIGN SYSTEM

## 2.1 Color Palette

| Token | Role | Value (Hex) |
|---|---|---|
| `--color-primary` | Brand / CTA buttons | #4F46E5 (Indigo-600) |
| `--color-primary-light` | Hover states, highlights | #818CF8 (Indigo-400) |
| `--color-success` | Skill strong, improvement | #10B981 (Emerald-500) |
| `--color-warning` | Skill weak, attention needed | #F59E0B (Amber-500) |
| `--color-danger` | Skill missing, error states | #EF4444 (Red-500) |
| `--color-neutral-900` | Primary text | #111827 |
| `--color-neutral-600` | Secondary text, captions | #4B5563 |
| `--color-neutral-100` | Surface / card backgrounds | #F3F4F6 |
| `--color-bg` | Page background | #F9FAFB |
| `--color-hr-accent` | HR side accent | #7C3AED (Violet-600) |

## 2.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display (Hero) | Inter | 700 | 48px / 3rem |
| Heading 1 | Inter | 700 | 32px / 2rem |
| Heading 2 | Inter | 600 | 24px / 1.5rem |
| Heading 3 | Inter | 600 | 20px / 1.25rem |
| Body | Inter | 400 | 16px / 1rem |
| Small / Caption | Inter | 400 | 14px / 0.875rem |
| Monospace (Code/Score) | JetBrains Mono | 500 | 14px / 0.875rem |

## 2.3 Spacing System (8px base)

4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

## 2.4 Component Library (Core)

- **ScoreRing** — Circular progress ring with percentage label, color-coded by threshold (green >70, amber 40-70, red <40)
- **SkillBadge** — Pill tag with skill name and status color (missing/weak/strong)
- **DimensionBar** — Horizontal progress bar for each graded dimension with label and score
- **MatchCard** — Candidate card for recruiter view (name, overall match %, top 3 dimensions, shortlist CTA)
- **SimulationStep** — Scenario task card with prompt, input area, and optional timer
- **GapAlert** — Prominent card showing a missing/weak skill with a specific recommended next action
- **ExplainPanel** — Expandable side panel showing the "why" behind a score or match

---

# 3. INFORMATION ARCHITECTURE

## 3.1 Candidate Navigation

  Dashboard
    Career Section
      Explore Careers
      My Target Careers
      Career Roadmap
    Assessments
      Available Assessments
      Assessment History
      Score Reports
    Simulations
      Available Simulations
      Simulation History
      Simulation Reports
    Skill Profile
      Skill Graph (visual)
      Skill Gap Report
      Career Readiness Score
    Progress
      XP / Levels / Achievements (Module H — Post-MVP)
      Score History Over Time
    Jobs
      Matched Jobs
      My Applications
    Settings
      Profile
      Account
      Privacy

## 3.2 HR Navigation

  HR Dashboard
    Company Profile
    Job Postings
      Create Job
      Active Jobs
      Closed Jobs
    Candidates
      Pool (per job, ranked)
      Candidate Profile View
      Comparison View
    Pipeline
      Shortlisted
      Interview Stage
      Hired / Rejected
    Analytics (Post-MVP)
      Pipeline Funnel
      Score Distributions
    Settings
      Company / Team
      Account

## 3.3 Admin Console

  Admin Console
    Content Management (Careers, Questions, Simulations, Rubrics)
    Integrity / Moderation (Flagged Accounts, Cheating Signals)
    User and Role Management
    Platform Configuration

---

# 4. KEY SCREENS

## 4.1 Candidate Dashboard

**Purpose:** Central hub for progress and next actions

**Layout:**
- Top: Career Readiness Score (ScoreRing, large) + Target Career label
- Middle Left: Recommended Next Action card (primary CTA — "Take your next simulation" / "Review gap report")
- Middle Right: Skill gap summary (top 3 priority gaps as SkillBadge + GapAlert)
- Bottom: Recent Activity feed (last 3 assessments/simulations with scores)

**States:**
- Empty (new user): "Complete your first assessment to see your readiness score" — no empty skeleton, a warm welcome CTA instead
- Loading: Skeleton loaders for score widgets only
- Error: "Unable to load dashboard — Retry" with support link

## 4.2 Assessment Screen

**Purpose:** Deliver and capture multi-format assessment responses

**Layout:**
- Top: Progress bar (Question X of Y) + optional timer
- Center: Question card — adapts to type (MCQ: radio buttons; scenario: text area; practical: structured input)
- Bottom: Previous / Next / Submit navigation
- Sidebar: Question overview map (clickable to jump)

**States:**
- Submitting: "Submitting your responses…" overlay with spinner
- Success: "Assessment submitted — grading in progress. You will be notified when your report is ready."
- Abandon: Warning modal — "Are you sure you want to exit? Your progress will be saved." (if resume is supported; else "Your progress will be lost")
- Error: Retry prompt with support link

## 4.3 Score Report Screen

**Purpose:** Show explainable grading results post-assessment

**Layout:**
- Top: Overall Score (ScoreRing, large) + Confidence indicator chip
- Section: Dimension Scores (DimensionBar for each dimension with label and score)
- Section: Strengths (green SkillBadge list) | Weaknesses (amber SkillBadge list)
- Section: Explanation Panel (ExplainPanel — expandable per-dimension rationale text)
- Bottom: Next Step CTA — "View your Skill Gap Report" / "Start Recommended Simulation"

## 4.4 Simulation Screen

**Purpose:** Deliver and capture role-realistic scenario decisions

**Layout:**
- Top: Scenario context banner (role, company, situation premise)
- Center: Current task/decision prompt (SimulationStep card)
- Input area: Varies by task type (text, choice, ranking)
- Bottom: Submit Decision / Next checkpoint navigation
- Optional: Time indicator (narrative deadline shown as text, not a countdown by default at MVP)

**States:**
- Between steps: "Recording your decision…" micro-transition
- Mid-failure: Partial progress save prompt ("An error occurred. Your progress up to this point has been saved. Resume or start over?")
- Completion: "Simulation complete — generating your performance report…" with progress animation

## 4.5 Skill Gap Report Screen

**Purpose:** Show gap analysis vs. selected target career

**Layout:**
- Header: Target career label + Career Readiness Score (small ScoreRing)
- Main: Three columns — Missing Skills (red), Weak Skills (amber), Strong Skills (green) — each as SkillBadge list
- Below each gap: "Recommended next action" link (connects to Module G recommendations)
- Priority flags on the top 3 most critical missing/weak skills

**Empty State:** "Select a target career and complete an assessment to see your gap report"

## 4.6 HR Job Creation Screen

**Purpose:** Create a structured, matchable job posting

**Layout:**
- Step 1: Job basics (title, description, seniority level)
- Step 2: Required skills selector (multi-select from skill taxonomy with optional manual add)
- Step 3: Preferred skills + experience criteria + assessment criteria
- Step 4: Review and publish
- Progress indicator across steps

**Validation:** Inline error per required field; "Required skills cannot be empty" blocking publish

## 4.7 Candidate Ranking Screen (HR)

**Purpose:** Show ranked candidate list per job

**Layout:**
- Top: Job title + active filters/sort controls
- Candidate list: MatchCard per candidate (name, avatar, match %, top 3 dimension chips, shortlist CTA)
- Hover: Expand to show missing/strong skills summary without leaving the list
- Pagination or infinite scroll

**Empty State:** "No candidates match this job yet. Check back after candidates apply."

## 4.8 Candidate Profile View (HR)

**Purpose:** Full candidate evidence view for a recruiter

**Layout:**
- Header: Name, Career Readiness Score, Target Career, Application status chip
- Tabs: Overview | Assessment Reports | Simulation Reports | Match Breakdown
- Match Breakdown tab: DimensionBar for each match dimension with score and explanation
- ExplainPanel: "Why this match score" expandable section with full rationale

## 4.9 Candidate Comparison Screen (HR)

**Purpose:** Side-by-side candidate comparison for a job

**Layout:**
- Left column: Dimension labels (fixed)
- Each subsequent column: One candidate — name, avatar, score per dimension (DimensionBar, aligned row by row)
- Bottom row: Shortlist / Pass CTA per candidate
- "Add candidate" button to add more columns (up to a reasonable limit)

**Empty State:** "Select at least 2 candidates to compare"

---

# 5. RESPONSIVE BEHAVIOR

| Breakpoint | Candidate | HR |
|---|---|---|
| Mobile (< 768px) | Full experience supported; dashboard, assessment, simulation, gap report are primary mobile flows | Primarily desktop-first; mobile read-only views for candidate profiles acceptable at MVP |
| Tablet (768-1024px) | Optimized | Optimized |
| Desktop (> 1024px) | Full experience | Primary target |

Note: Final platform priority between mobile and desktop for each side is an OPEN QUESTION pending MVP scope decision.

---

# 6. ACCESSIBILITY

Target: WCAG 2.1 Level AA as directional target (final commitment pending founder validation given MVP resourcing constraints)

Requirements:
- All interactive elements must have visible focus states
- Color is never the sole indicator of meaning (SkillBadge uses icon + color + text label)
- ScoreRing and DimensionBar include text alternatives for screen readers
- Keyboard navigation supported for all primary flows
- Form errors identified by text, not color alone

---

*Generated by Ultron (BMAD Method — bmad-ux) for SkillForge AI Platform — 2026-09-11*
