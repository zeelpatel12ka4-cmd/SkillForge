# SkillForge AI — Epics and User Stories
**Document Type:** Epics and Stories  
**Agent:** Winston (Architect) + John (PM) — BMAD Method  
**Version:** 1.0  
**Date:** 2026-09-11  
**Status:** Draft — Pending Sprint Planning

---

# EPIC 1: User Authentication and Profile (Module A)

**Goal:** Enable candidates and recruiters to securely register, verify, and maintain their accounts and profiles.

## Story A-1: Candidate Registration
**As a** new candidate,  
**I want to** register with my email and password,  
**So that** I can access the platform and start my career assessment journey.

**Acceptance Criteria:**
- AC1: I can submit a registration form with email, password, and role selection (Candidate)
- AC2: I receive an email verification link after registration
- AC3: Unverified users cannot access assessment or simulation features
- AC4: Duplicate email registration returns a clear, friendly error
- AC5: Password is stored hashed (bcrypt) — verified via code review, not UI

## Story A-2: HR Recruiter Registration
**As a** HR recruiter,  
**I want to** register my account with company affiliation,  
**So that** I can create job postings and evaluate candidates.

**Acceptance Criteria:**
- AC1: I can register with email, password, and role selection (HR/Recruiter)
- AC2: I can enter my company name during profile setup
- AC3: I receive an email verification link after registration
- AC4: After verification, I land on the HR dashboard

## Story A-3: Candidate Profile Setup
**As a** verified candidate,  
**I want to** complete my profile with education, experience, and career interests,  
**So that** the platform can personalize my career recommendations and roadmap.

**Acceptance Criteria:**
- AC1: Profile setup wizard collects education, experience, career interests, and goals
- AC2: Profile completion percentage is displayed and updates as fields are filled
- AC3: Incomplete profile does not block assessment access, but shows a gentle prompt to complete

## Story A-4: Login and Session Management
**As a** registered user,  
**I want to** log in securely and stay logged in across sessions,  
**So that** I do not have to re-authenticate on every visit.

**Acceptance Criteria:**
- AC1: Login with email/password works for all roles
- AC2: JWT access token expires in 15 minutes; refresh token rotates silently
- AC3: Logout invalidates the session
- AC4: Invalid credentials return a clear error without revealing which field is wrong

---

# EPIC 2: Career Discovery (Module B)

**Goal:** Help candidates identify a target career and understand its required skills.

## Story B-1: Browse Career Tracks
**As a** candidate,  
**I want to** browse all supported career tracks with their required skill sets,  
**So that** I can discover which careers are available on the platform.

**Acceptance Criteria:**
- AC1: I can view a list of all supported career tracks
- AC2: Each career shows a name, description, and list of required skills
- AC3: I can search and filter career tracks by name or skill

## Story B-2: Select Target Career
**As a** candidate,  
**I want to** select one or more target careers,  
**So that** the platform can generate a personalized roadmap for me.

**Acceptance Criteria:**
- AC1: I can select a target career from the career browser
- AC2: Selecting a career triggers a personalized roadmap using my current Skill Graph (or prompts me to take my first assessment if no data exists)
- AC3: I can change my target career at any time; roadmap and gap analysis recompute automatically

---

# EPIC 3: AI Skill Assessment (Module C)

**Goal:** Deliver a multi-format assessment that measures both knowledge and practical capability.

## Story C-1: Take a Skill Assessment
**As a** candidate,  
**I want to** take a structured assessment for my selected career track,  
**So that** I can understand my current skill level and identify gaps.

**Acceptance Criteria:**
- AC1: I can start an assessment for any supported career track
- AC2: Assessment includes at least two question types (MCQ + scenario/practical)
- AC3: My responses are captured correctly for all question types including free-text
- AC4: I receive a confirmation screen after submission — "Grading in progress"

## Story C-2: Assessment Progress and Resume
**As a** candidate,  
**I want to** be warned before leaving an assessment mid-way,  
**So that** I do not accidentally lose my progress.

**Acceptance Criteria:**
- AC1: Exiting mid-assessment shows a warning modal
- AC2: If resume is supported: partial progress is saved and I can return to continue
- AC3: If resume is not supported: warning clearly states progress will be lost

---

# EPIC 4: AI Grading System (Module D)

**Goal:** Convert assessment and simulation responses into explainable, multi-dimension scores.

## Story D-1: View Explainable Assessment Score Report
**As a** candidate,  
**I want to** see a detailed, explainable breakdown of my assessment score,  
**So that** I understand exactly what I did well and what I need to improve.

**Acceptance Criteria:**
- AC1: Score report shows an overall score plus a score for each graded dimension
- AC2: Each dimension shows a strength or weakness label and a specific rationale text
- AC3: A confidence indicator is displayed (e.g., "High confidence" / "Limited data — take more assessments")
- AC4: I can see which specific answers/decisions drove my strengths and weaknesses

## Story D-2: Grading Failure Recovery
**As a** candidate,  
**I want to** be notified if grading fails or takes too long,  
**So that** I am not left wondering what happened to my assessment.

**Acceptance Criteria:**
- AC1: If grading is not completed within a reasonable time, I receive a notification
- AC2: I am never shown a silent failure — always a clear status or retry option
- AC3: I can contact support if grading is stuck

---

# EPIC 5: AI Career Simulation (Module E)

**Goal:** Let candidates experience and be evaluated on realistic role-based scenarios.

## Story E-1: Complete a Career Simulation
**As a** candidate,  
**I want to** work through a realistic simulation of my target career,  
**So that** I can practice actual job scenarios and receive performance feedback.

**Acceptance Criteria:**
- AC1: I can start a simulation for at least one supported career track at MVP
- AC2: Simulation presents a scenario premise followed by sequential task/decision prompts
- AC3: My decisions are captured at each checkpoint
- AC4: On completion, I see a "Generating your report…" screen before the performance report loads

## Story E-2: View Simulation Performance Report
**As a** candidate,  
**I want to** review my simulation performance across multiple dimensions,  
**So that** I can understand how I performed and what to improve.

**Acceptance Criteria:**
- AC1: Performance report shows overall score + per-dimension scores
- AC2: Report highlights key decisions and their evaluation
- AC3: Report includes strengths, weaknesses, and links to recommended improvement actions

---

# EPIC 6: Skill Gap Engine and Recommendations (Modules F + G)

**Goal:** Identify specific skill gaps and generate personalized improvement plans.

## Story F-1: View Skill Gap Report
**As a** candidate,  
**I want to** see a clear breakdown of my skill gaps versus my target career,  
**So that** I know exactly what to work on.

**Acceptance Criteria:**
- AC1: Skill gap report shows Missing, Weak, and Strong skill categories for my target career
- AC2: The top 3 most critical gaps are visually flagged as priority
- AC3: Report auto-updates after each new assessment or simulation without manual action
- AC4: If no assessment data exists, I see a prompt to take my first assessment — not an empty/misleading report

## Story G-1: View Personalized Improvement Recommendations
**As a** candidate,  
**I want to** receive specific, actionable recommendations tied to my identified skill gaps,  
**So that** I know what to do next rather than receiving generic advice.

**Acceptance Criteria:**
- AC1: Each recommendation references the specific gap it addresses
- AC2: If a gap has no available content mapping, it is flagged explicitly — no generic filler recommendation
- AC3: Recommendations are regenerated automatically after each re-assessment

---

# EPIC 7: HR Job Management (Module I)

**Goal:** Allow recruiters to create structured job postings that the AI matching engine can consume.

## Story I-1: Create a Job Posting
**As a** HR recruiter,  
**I want to** create a structured job posting with required and preferred skills,  
**So that** the AI matching engine can rank candidates against this job.

**Acceptance Criteria:**
- AC1: I can create a job posting with title, description, required skills, preferred skills, experience level, and assessment criteria
- AC2: Required skills must be selected (blocking publish if empty)
- AC3: Published job is immediately queryable by the matching engine
- AC4: Draft jobs are not visible to candidates

## Story I-2: Manage Job Posting Status
**As a** HR recruiter,  
**I want to** activate, pause, and close job postings,  
**So that** I can control which roles are actively surfacing candidates.

**Acceptance Criteria:**
- AC1: I can change a job's status between Draft, Active, and Closed
- AC2: Only Active jobs appear in candidate job matching results
- AC3: Closing a job does not delete its candidate data (pipeline must remain accessible)

---

# EPIC 8: AI Candidate Matching (Module J)

**Goal:** Score and rank candidates against job requirements with full explainability.

## Story J-1: View Ranked Candidates for a Job
**As a** HR recruiter,  
**I want to** see a ranked list of candidates for my job posting with explainable match scores,  
**So that** I can quickly identify the strongest candidates without manual resume review.

**Acceptance Criteria:**
- AC1: Candidate list is ranked by overall match score (highest first)
- AC2: Each candidate card shows overall match %, top dimension scores, and missing/strong skill summary
- AC3: A confidence indicator is shown when a candidate has sparse assessment data
- AC4: No protected attributes are visible or used in the ranking

## Story J-2: View Full Candidate Match Breakdown
**As a** HR recruiter,  
**I want to** drill into a candidate's full match breakdown for my job,  
**So that** I understand exactly why they received their match score before deciding to shortlist.

**Acceptance Criteria:**
- AC1: Candidate profile shows a full per-dimension match score breakdown
- AC2: An "Explain this score" section provides a human-readable rationale
- AC3: Missing skills and strong-match skills are clearly separated
- AC4: I can access the candidate's underlying assessment and simulation reports from this view

## Story J-3: Shortlist a Candidate
**As a** HR recruiter,  
**I want to** move a candidate to the Shortlisted stage,  
**So that** I can track them through the recruitment pipeline.

**Acceptance Criteria:**
- AC1: I can shortlist a candidate with a single action from the ranked list or candidate profile view
- AC2: Shortlisted candidates appear in a dedicated pipeline stage view
- AC3: The final hiring decision always requires an explicit human action — the system never auto-hires

---

# EPIC 9: Admin Operations

**Goal:** Enable internal admins to maintain content, integrity, and platform configuration.

## Story ADM-1: Manage Career and Skill Content
**As a** platform admin,  
**I want to** add, edit, and remove career tracks, assessment questions, simulation scenarios, and rubrics,  
**So that** content stays accurate without requiring engineering involvement.

**Acceptance Criteria:**
- AC1: Admin can create, update, and deactivate career tracks, questions, scenarios, and rubrics via the admin console
- AC2: Changes to rubrics do not retroactively alter already-issued scores (new scores only)
- AC3: Admin actions are logged with actor, timestamp, and change detail

## Story ADM-2: Moderate Integrity Signals
**As a** platform admin,  
**I want to** view and act on flagged accounts or suspicious assessment patterns,  
**So that** I can maintain the integrity of assessment scores.

**Acceptance Criteria:**
- AC1: Admin can view a list of flagged accounts (triggered by response-time anomalies)
- AC2: Admin can take actions: warn, restrict, or ban an account
- AC3: All moderation actions are logged

---

*Generated by Ultron (BMAD Method — bmad-create-epics-and-stories) for SkillForge AI Platform — 2026-09-11*
