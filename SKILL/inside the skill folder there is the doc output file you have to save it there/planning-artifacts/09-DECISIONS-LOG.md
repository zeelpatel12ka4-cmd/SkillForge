# SkillForge AI — Decisions Log (All Open Questions Resolved)
**Document Type:** Decisions Log  
**Agent:** Ultron (Orchestrator) — BMAD Method  
**Date:** 2026-09-11  
**Status:** ALL OPEN QUESTIONS CLOSED — Ready to Build

---

## DECISION REGISTER

| OQ# | Question | Decision | Date |
|---|---|---|---|
| OQ1 | Launch Geography | **India-first. English language. Global-ready architecture from day one.** | 2026-09-11 |
| OQ2 | MVP Career Tracks | **8 tracks: Software Developer, Data Analyst, Digital Marketing, AI/ML Engineer, UI/UX Designer, Cyber Security, Product Manager, Sales** | 2026-09-11 |
| OQ3 | Candidate Profile Visibility | **Opt-in — candidate explicitly unlocks profile visibility to all recruiters. Default: private.** | 2026-09-11 |
| OQ4 | HR Pricing Model | **Seat-based — charge per recruiter seat per month. Exact price: TBD (Founder to set).** | 2026-09-11 |
| OQ5 | Free Tier Limits (Candidate) | **3 simulation tasks per day, mixable across any career track (e.g., 1 Software Dev + 1 Cyber + 1 UX). Resets daily.** | 2026-09-11 |
| OQ6 | Hiring Manager Role | **Fully separate Hiring Manager login and account at MVP. Distinct from Recruiter.** | 2026-09-11 |

---

## EXPANDED DECISION NOTES

### OQ1 — India-First, Global-Ready
- UI language: English
- Currency: INR for India pricing; USD for global (architecture must support multi-currency)
- Compliance: DPDP Act (India) — data residency and consent requirements apply
- Infrastructure: Indian cloud region as primary (AWS Mumbai / GCP Mumbai), global CDN

### OQ3 — Opt-In Profile Visibility
- Default state: Candidate profile is PRIVATE to all recruiters
- Unlock mechanism: Candidate visits Settings > Privacy > "Make my profile discoverable to recruiters"
- When locked: Recruiter can only see a candidate if that candidate applied to their job posting
- When unlocked: Profile is discoverable in the recruiter's candidate pool search
- Score data: Assessment and simulation scores are ALWAYS gated — visible to recruiter only on application, not on profile browse
- Implementation impact: Profile Service must enforce visibility rules at API level, not just UI

### OQ4 — Seat-Based HR Pricing
- Model: Per recruiter seat per month
- Free tier for HR: TBD — Founder to decide (suggested: 1 free seat, limited to 3 active jobs and 20 candidate views/month)
- Paid tier: All seats beyond free, unlimited jobs, unlimited candidate views, full analytics (Module K)
- Billing: Monthly and annual options (annual discount: Founder to decide)
- Implementation: Subscription entity in DB; seat count enforcement at API level

### OQ5 — Daily Simulation Task Limit (Free Tier)
- Limit: 3 simulation TASKS per day (not 3 full simulations)
- Each simulation has 4 tasks — so a free user can do up to 3 task-checkpoints per day across any career tracks
- Mixable: Can be from any combination of tracks (not locked to one track per day)
- Reset: Midnight IST daily
- Paid upgrade: Unlimited simulation tasks per day
- Anti-gaming: Cooldown of 24 hours before repeating the exact same scenario (prevents farming the same scenario for a better score)
- Implementation: UsageQuota entity: { candidate_id, date, simulation_tasks_used, reset_at }

### OQ6 — Separate Hiring Manager Account
- Hiring Manager is a DISTINCT role (not an extension of Recruiter)
- Capabilities: View shortlisted candidates and their full assessment/simulation reports; compare candidates side-by-side; provide a hiring decision input (Approve to Interview / Pass)
- Cannot: Create jobs, change pipeline stages, access HR analytics, view all candidates (only shortlisted ones shared with them)
- Access model: Recruiter explicitly adds a Hiring Manager to a specific job posting; HM sees only that job's shortlist
- Implementation: RBAC roles = { CANDIDATE, RECRUITER, HIRING_MANAGER, ADMIN } — all 4 at MVP

---

## ROLES CONFIRMED (All 4 at MVP)

| Role | Can Do | Cannot Do |
|---|---|---|
| CANDIDATE | Register, take assessments/simulations, view own scores, apply to jobs, unlock profile visibility | Access HR features |
| RECRUITER | Create jobs, view and rank candidates, shortlist, manage pipeline, add Hiring Managers to jobs | Final hire decision (must flag for HM or log manually) |
| HIRING_MANAGER | View shortlisted candidates on shared jobs, view assessment/simulation reports, approve-to-interview or pass | Create jobs, view non-shortlisted candidates, access analytics |
| ADMIN | Full content management, user moderation, role management, platform config | None — full access |

---

## PROJECT STATUS: READY TO BUILD

Planning Phase: COMPLETE
Open Questions: 0 remaining
Next Step: Sprint 0 — Foundation

Sprint 0 Start Conditions (all met):
- [x] Career tracks decided (OQ2)
- [x] Geography decided (OQ1)
- [x] RBAC roles defined (OQ6)
- [x] Profile visibility model decided (OQ3)
- [x] Pricing model decided (OQ4)
- [x] Free tier limits decided (OQ5)
- [x] Architecture documented (05-ARCHITECTURE.md)
- [x] Tech stack selected (Next.js + Node.js + PostgreSQL + Redis + Queue)
- [x] Design system specified (04-UX-DESIGN.md)
- [x] Epics and stories written (06-EPICS-AND-STORIES.md)
- [x] Sprint plan ready (07-SPRINT-PLAN.md)
- [x] Career tracks fully specced (08-CAREER-TRACKS-SPEC.md)

---

*Locked by Ultron (BMAD Method) for SkillForge AI Platform — 2026-09-11*
