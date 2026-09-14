# SkillForge AI — MVP Sprint Plan
**Document Type:** Sprint Planning  
**Agent:** John (PM) + Winston (Architect) — BMAD Method  
**Version:** 1.0  
**Date:** 2026-09-11  
**Status:** Draft — Pending Team Velocity Calibration

---

# PRE-SPRINT READINESS CHECK

Before Sprint 1 begins, the following must be complete:

| Item | Owner | Status |
|---|---|---|
| Domain and TLD acquired | Founder | Pending |
| Cloud provider account set up (AWS / GCP / Azure) | Engineering | Pending |
| AI/LLM provider selected and API key provisioned | Engineering + Founder | Pending |
| MVP career tracks decided (which tracks ship first) | Founder | OPEN QUESTION |
| Content creation started: questions + rubrics for MVP tracks | Content Team | Pending |
| Simulation scenarios drafted for MVP tracks | Content Team | Pending |
| Candidate profile visibility model decided | Founder | OPEN QUESTION |
| Design system tokens and component library started | Design | Pending |

---

# SPRINT 0 — Foundation (Weeks 1-2)

**Goal:** Dev environment, CI/CD, repo structure, database schema, base API scaffold

| Task | Epic | Type | Priority |
|---|---|---|---|
| Initialize monorepo structure (frontend + backend services) | Infra | Setup | P0 |
| Set up Docker Compose for local development | Infra | Setup | P0 |
| Configure GitHub Actions CI pipeline (lint + test on PR) | Infra | Setup | P0 |
| Provision staging and production environments | Infra | Setup | P0 |
| Design and migrate initial PostgreSQL schema (User, Profile, Skill, Career, Assessment, Simulation, Score, Job, CandidateMatch) | Data | Setup | P0 |
| Set up Redis cache layer | Infra | Setup | P0 |
| Set up message queue (RabbitMQ or SQS) | Infra | Setup | P0 |
| Scaffold Auth Service (register, login, JWT, email verification) | A | Backend | P0 |
| Set up structured logging and basic observability | Infra | Setup | P0 |
| Define OpenAPI 3.1 spec skeleton for all planned endpoints | All | Design | P0 |
| Create design system base in Next.js (color tokens, typography, spacing) | Design | Frontend | P0 |

---

# SPRINT 1 — Auth, Profile, and Career Discovery (Weeks 3-4)

**Goal:** Candidates and recruiters can register, verify, and set up profiles. Careers can be browsed and selected.

| Story | Epic | Type | Priority |
|---|---|---|---|
| A-1: Candidate Registration | A | Full-stack | P0 |
| A-2: HR Recruiter Registration | A | Full-stack | P0 |
| A-3: Candidate Profile Setup | A | Full-stack | P0 |
| A-4: Login and Session Management | A | Full-stack | P0 |
| B-1: Browse Career Tracks | B | Full-stack | P0 |
| B-2: Select Target Career | B | Full-stack | P0 |
| Seed career track data for MVP tracks | Data | Backend | P0 |
| Seed skill taxonomy for MVP career tracks | Data | Backend | P0 |
| Candidate dashboard shell (empty state) | Design | Frontend | P0 |
| HR dashboard shell (empty state) | Design | Frontend | P0 |

**Sprint 1 Exit Criteria:**
- Candidate can register, verify, complete profile, and select a target career
- HR can register, verify, and access the HR dashboard
- Career browser shows real career and skill data

---

# SPRINT 2 — Assessment (Weeks 5-6)

**Goal:** Candidates can take a full multi-format assessment for a supported career track.

| Story | Epic | Type | Priority |
|---|---|---|---|
| C-1: Take a Skill Assessment | C | Full-stack | P0 |
| C-2: Assessment Progress and Resume | C | Full-stack | P0 |
| Assessment question seeding for MVP tracks (MCQ + scenario/practical) | Data | Content | P0 |
| Assessment screen UI (progress bar, question types, navigation) | C | Frontend | P0 |
| Assessment submission API and queue dispatch | C | Backend | P0 |
| Grading queue consumer scaffold | D | Backend | P0 |
| "Grading in progress" status polling or push notification | D | Full-stack | P0 |

**Sprint 2 Exit Criteria:**
- Candidate can start, answer, and submit a full assessment for at least one career track
- Submission is dispatched to grading queue; candidate sees "grading in progress" status

---

# SPRINT 3 — AI Grading and Score Reports (Weeks 7-8)

**Goal:** Submitted assessments are graded by AI; candidates receive explainable score reports.

| Story | Epic | Type | Priority |
|---|---|---|---|
| D-1: View Explainable Assessment Score Report | D | Full-stack | P0 |
| D-2: Grading Failure Recovery | D | Full-stack | P0 |
| Grading Engine — MCQ deterministic scoring | D | Backend (AI) | P0 |
| Grading Engine — Free-text LLM rubric evaluation | D | Backend (AI) | P0 |
| Grading Engine — Dimension aggregation and normalization | D | Backend (AI) | P0 |
| Grading Engine — Explanation text generation (template-guided NLG) | D | Backend (AI) | P0 |
| Grading Engine — Confidence score calculation | D | Backend (AI) | P0 |
| Score entity write + SkillGraph update trigger | D | Backend | P0 |
| Score report screen UI (ScoreRing, DimensionBar, ExplainPanel) | D | Frontend | P0 |
| Rubric seeding for MVP career tracks | Data | Content | P0 |

**Sprint 3 Exit Criteria:**
- Assessment submissions are graded end-to-end (MCQ + free-text)
- Candidate sees a full explainable score report with overall score, dimensions, strengths, weaknesses, and rationale
- SkillGraph is updated correctly after grading

---

# SPRINT 4 — Skill Gap Engine and Recommendations (Weeks 9-10)

**Goal:** Candidates see their skill gap versus target career and receive personalized improvement recommendations.

| Story | Epic | Type | Priority |
|---|---|---|---|
| F-1: View Skill Gap Report | F | Full-stack | P0 |
| G-1: View Personalized Improvement Recommendations | G | Full-stack | P1 |
| Skill Gap Engine implementation | F | Backend | P0 |
| Skill Gap recompute trigger on new Score | F | Backend | P0 |
| Recommendation Engine — gap-to-content mapping | G | Backend | P1 |
| Skill Gap Report screen UI (SkillBadge, GapAlert) | F | Frontend | P0 |
| Recommendations UI | G | Frontend | P1 |
| Career Roadmap display (post career selection + gap data) | B | Frontend | P0 |

**Sprint 4 Exit Criteria:**
- Candidate sees a Skill Gap Report that auto-updates after assessment grading
- Missing, Weak, and Strong skills are clearly categorized with priority flags
- At least basic personalized recommendations are shown for identified gaps

---

# SPRINT 5 — Career Simulation (Weeks 11-12)

**Goal:** Candidates can complete at least one career simulation and receive a multi-dimension performance report.

| Story | Epic | Type | Priority |
|---|---|---|---|
| E-1: Complete a Career Simulation | E | Full-stack | P0 |
| E-2: View Simulation Performance Report | E | Full-stack | P0 |
| Simulation scenario seeding for at least one MVP career track | Data | Content | P0 |
| Simulation screen UI (SimulationStep, narrative context, input capture) | E | Frontend | P0 |
| Simulation decision capture API | E | Backend | P0 |
| Simulation grading (reuse grading engine with simulation-specific rubric + dimension weights) | E, D | Backend (AI) | P0 |
| Simulation performance report screen UI | E | Frontend | P0 |
| Career Readiness Score computation (composite of assessment + simulation scores) | D, F | Backend | P0 |
| Career Readiness Score displayed on Candidate Dashboard | D | Frontend | P0 |

**Sprint 5 Exit Criteria:**
- Candidate can complete a full simulation end-to-end for at least one career track
- Performance report shows multi-dimension scores and explainable rationale
- Career Readiness Score on dashboard reflects combined assessment + simulation data

---

# SPRINT 6 — HR Job Creation and Candidate Matching (Weeks 13-14)

**Goal:** HR can create job postings; AI matching engine ranks candidates with explainable match scores.

| Story | Epic | Type | Priority |
|---|---|---|---|
| I-1: Create a Job Posting | I | Full-stack | P0 |
| I-2: Manage Job Posting Status | I | Full-stack | P0 |
| J-1: View Ranked Candidates for a Job | J | Full-stack | P0 |
| J-2: View Full Candidate Match Breakdown | J | Full-stack | P0 |
| J-3: Shortlist a Candidate | J | Full-stack | P0 |
| Matching Engine implementation (weighted skill comparison) | J | Backend (AI) | P0 |
| Matching queue consumer (triggered on new assessment graded or new job published) | J | Backend | P0 |
| HR job creation screen UI (multi-step form) | I | Frontend | P0 |
| Candidate ranking screen UI (MatchCard, filters, sort) | J | Frontend | P0 |
| Candidate profile view for HR (assessment + simulation reports + match breakdown) | J | Frontend | P0 |
| Shortlisting pipeline view | J | Frontend | P0 |

**Sprint 6 Exit Criteria:**
- HR can create a job posting with structured skill requirements
- Candidates with assessments are ranked by AI match score with full explainability
- HR can shortlist candidates and track them in the pipeline

---

# SPRINT 7 — Admin Console, Hardening, Integration Testing (Weeks 15-16)

**Goal:** Admin operations, security hardening, end-to-end integration tests, and MVP launch readiness.

| Story | Epic | Type | Priority |
|---|---|---|---|
| ADM-1: Manage Career and Skill Content | Admin | Full-stack | P0 |
| ADM-2: Moderate Integrity Signals | Admin | Full-stack | P0 |
| Role-Based Access Control audit (all API endpoints verified) | Infra | Security | P0 |
| Audit logging (admin actions, score overrides, role changes) | Infra | Security | P0 |
| End-to-end integration tests (candidate full loop + HR full loop) | Testing | QA | P0 |
| Performance testing (grading and matching queue throughput baseline) | Testing | QA | P0 |
| Security scan (dependency audit + basic penetration test) | Security | QA | P0 |
| Accessibility pass on primary candidate flows (WCAG 2.1 AA directional) | Design | Frontend | P1 |
| Error monitoring and alerting setup | Infra | Ops | P0 |
| Load test staging environment | Infra | Ops | P0 |
| Staging UAT with internal stakeholders | QA | Testing | P0 |
| Production deployment checklist | Infra | Ops | P0 |

**Sprint 7 Exit Criteria:**
- All MVP Must-Have features pass end-to-end integration tests
- Security audit complete, critical findings resolved
- Staging UAT approved by stakeholders
- Production deployment ready

---

# SPRINT STATUS LEGEND

| Symbol | Meaning |
|---|---|
| Not Started | Work not yet begun |
| In Progress | Actively being worked on |
| Blocked | Cannot proceed — dependency or decision needed |
| Done | Complete and verified |
| Deferred | Moved to a later sprint |

---

# MVP LAUNCH CHECKLIST

- [ ] All Sprint 0-7 exit criteria met
- [ ] End-to-end candidate loop works without manual intervention (AC-1 from PRD)
- [ ] Every AI score includes explanation and confidence indicator (AC-2)
- [ ] HR can create job, rank candidates, and shortlist (AC-3)
- [ ] No protected attributes in grading or matching pipeline (AC-4 — schema review)
- [ ] No autonomous hiring decision possible (AC-5 — UX and backend verified)
- [ ] Skill Gap Reports auto-update (AC-6)
- [ ] All MVP Must-Have features pass integration test suite (AC-7)
- [ ] Content: questions, rubrics, and at least 1 simulation scenario per MVP career track
- [ ] Security audit complete
- [ ] Monitoring and alerting active in production
- [ ] Runbook for on-call incident response prepared

---

*Generated by Ultron (BMAD Method — bmad-sprint-planning) for SkillForge AI Platform — 2026-09-11*
