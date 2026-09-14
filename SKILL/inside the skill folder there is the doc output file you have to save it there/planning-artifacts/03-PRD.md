# SkillForge AI — Product Requirements Document (PRD)
**Document Type:** PRD  
**Agent:** John (Product Manager) + Mary (Business Analyst) — BMAD Method  
**Version:** 2.0 (Fresh — Generated from scratch)  
**Date:** 2026-09-11  
**Status:** Draft — Pending Review

---

## Document Control

| Section | Owner | Status |
|---|---|---|
| 1. Product Overview | PM (John) | Draft |
| 2. Problem Statement | Analyst (Mary) | Draft |
| 3. User Personas | PM (John) | Draft |
| 4. Business Model | Analyst (Mary) | Draft |
| 5. Product Objectives | PM (John) | Draft |
| 6. Core Feature Modules | PM (John) | Draft |
| 7. AI System Requirements | Architect (Winston) | Draft |
| 8. MVP Scope | PM (John) | Draft |
| 9. Non-Goals | PM (John) | Draft |
| 10. KPIs and Analytics | Analyst (Mary) | Draft |
| 11. Risks | PM (John) + Analyst (Mary) | Draft |
| 12. Open Questions | PM (John) | Draft |

---

# 1. PRODUCT OVERVIEW

## 1.1 Vision

SkillForge AI becomes the trusted layer between education and employment — the place where a person's actual, demonstrated capability is built, verified, and understood by both the person and the employers evaluating them.

## 1.2 Mission

To help every candidate understand exactly where they stand, close real skill gaps through realistic AI-driven practice, and give every recruiter a fair, explainable, evidence-based way to identify the right talent.

## 1.3 What Is SkillForge AI?

SkillForge AI is an AI-powered, two-sided career-readiness and recruitment platform. It connects two sides of the labor market — candidates/students and HR/recruiters — through a shared, verifiable layer of demonstrated skill data.

Core differentiator: It does NOT stop at learning content delivery (like a course platform) or keyword matching (like a traditional ATS/job board). It creates a closed feedback loop:

  Assess -> Identify Gaps -> Simulate -> Grade -> Improve -> Re-assess -> Match -> Hire

## 1.4 Product Context

- Stage: Pre-development. Dev team available. No existing users, no live MVP.
- Business Model: Freemium (candidate side free with usage limits; HR/recruiter side is primary paid tier)
- Launch Market: India (anchor market, global English-first product — assumption pending founder sign-off)

---

# 2. PROBLEM STATEMENT

## 2.1 Candidate / Student Side

| Problem | Impact |
|---|---|
| Resumes and certificates are weak signals of real capability | Candidates struggle to prove skills to recruiters |
| No realistic way to simulate actual job pressure before applying | Candidates are unprepared for real work scenarios |
| Assessment feedback is binary — no actionable improvement direction | Candidates repeat the same mistakes without knowing why |
| Career direction is unclear — no honest skill-to-career mapping | Candidates waste time pursuing paths they are not equipped for |
| Job applications feel like a black box | Candidates do not know why they were rejected or how competitive they are |

## 2.2 HR / Recruiter Side

| Problem | Impact |
|---|---|
| Resume screening is noisy — keyword-optimized CVs do not reflect real competence | High-quality candidates get missed; low-quality ones pass through |
| Traditional skills tests are easy to game and do not reflect job-realistic scenarios | Test results cannot be trusted as a hiring signal |
| No explainable way to justify why a candidate is a strong or weak match | Recruiters cannot defend shortlist decisions to hiring managers |
| Manual review of multiple assessment sources across many candidates is time-consuming | Recruitment velocity suffers |

---

# 3. USER PERSONAS

## 3.1 Student / Early-Career Candidate (Primary Candidate Persona)

| Attribute | Detail |
|---|---|
| Background | Currently studying or recently graduated; limited work experience |
| Core Goal | Understand which career fits, build job-ready skills, get first job |
| Pain Points | Generic advice, unclear if skills are good enough, no realistic job simulation |
| Behaviors | Takes online courses, browses job descriptions, compares to peers |
| SkillForge Value | Assessment -> gap analysis -> simulation -> explainable feedback -> personalized plan |

## 3.2 Experienced Job Seeker / Career Switcher

| Attribute | Detail |
|---|---|
| Background | Has work experience; switching fields or targeting a specific new role |
| Core Goal | Prove capability despite non-traditional background; close specific gaps fast |
| Pain Points | ATS filters penalize non-traditional resumes; certificates have weak recruiter signal |
| Behaviors | Applies to multiple roles; researches specific job requirements; time-constrained |
| SkillForge Value | Simulation proves role-realistic capability regardless of resume history |

## 3.3 HR Recruiter (Primary Paying Persona)

| Attribute | Detail |
|---|---|
| Background | Manages sourcing, screening, and shortlisting for multiple open roles simultaneously |
| Core Goal | Fill roles with genuinely qualified candidates; reduce screening time |
| Pain Points | High application volume, low signal quality; risk of bad hires |
| Behaviors | Scans resumes quickly; relies on keyword filters; escalates shortlists to managers |
| SkillForge Value | Explainable AI match scores with per-dimension breakdown replace resume guessing |

## 3.4 Hiring Manager

| Attribute | Detail |
|---|---|
| Background | Owns the open role; makes or heavily influences the final hiring decision |
| Core Goal | Hire someone who will actually perform; avoid costly mis-hires |
| Pain Points | Relies on recruiter summaries and short interviews; limited visibility into real capability |
| Behaviors | Reviews small finalist shortlist; conducts final interview; asks for evidence |
| SkillForge Value | Assessment and simulation evidence behind each shortlisted candidate; consistent comparison |

## 3.5 Platform Admin (Internal)

| Attribute | Detail |
|---|---|
| Background | Internal SkillForge AI team member |
| Core Goal | Keep content accurate, platform operating, integrity maintained |
| Pain Points | Content staleness; cheating signals; misconfigured access |
| Behaviors | Periodically updates content libraries; monitors integrity; manages roles |
| SkillForge Value | Admin console with content management, moderation tools, and access control |

---

# 4. BUSINESS MODEL

## 4.1 Model: Freemium (Two-Sided)

| Side | Pricing |
|---|---|
| Candidate | Free (usage-limited at scale — exact limits to be decided) |
| HR / Recruiter | Paid subscription (primary revenue source) |

## 4.2 Growth Flywheel

  More Candidate Assessments
    -> Richer Skill Data Asset
    -> Better Matching Quality
    -> Higher Recruiter-Perceived Value
    -> HR Paid Adoption
    -> Revenue -> Fund Content + AI Improvement -> More Candidates

Note: This flywheel is a strategic hypothesis, not a validated outcome. It must be tested during and after MVP.

## 4.3 Unit Economics Watch Items

- AI inference cost per candidate assessment/simulation must stay within sustainable bounds relative to Freemium pricing
- Usage limits on the free candidate tier directly control cost exposure at scale
- Pricing tiers, seat-based vs. usage-based pricing: DATA REQUIRED — Founder decision

---

# 5. PRODUCT OBJECTIVES

## 5.1 Core Product Objectives

| ID | Objective | Why It Matters |
|---|---|---|
| P1 | Closed Career-Readiness Loop | Every stage feeds the next with structured data; the loop is a product requirement not a marketing narrative |
| P2 | Explainable AI | Every AI score affecting a user must include a human-readable rationale — what was evaluated, how the score was generated, what should improve |
| P3 | Demonstrated Skill Over Resume Claims | Prioritize performance evidence over self-reported skills while still combining both for a full picture |
| P4 | Shared Skill Intelligence Layer | Candidate assessment data and recruiter matching consume the same underlying skill data — not two disconnected systems |
| P5 | Multi-Career Architecture | Architecture supports multiple career tracks; which tracks are in MVP is a separate scope decision |
| P6 | Personalized Improvement | Specific, prioritized, individualized recommendations — not generic study advice |
| P7 | Human-in-the-Loop Recruitment | System assists but never autonomously makes final hiring decisions |
| P8 | Trust, Explainability, and Fairness by Design | Explainable, auditable, consistent, fair, and human-reviewable AI evaluation |

## 5.2 MVP Objectives (Must Prove at Launch)

| ID | Objective | Priority |
|---|---|---|
| M1 | Candidate registration and basic profile | P0 |
| M2 | Career and skill track selection | P0 |
| M3 | Initial skill assessment (mixed question types) | P0 |
| M4 | AI grading with explainability | P0 |
| M5 | Skill gap analysis | P0 |
| M6 | Career simulation (at least one track) | P0 |
| M7 | Simulation grading with explainability | P0 |
| M8 | Verified skill profile | P0 |
| M9 | HR job creation with structured requirements | P0 |
| M10 | Explainable candidate matching (recruiter-facing) | P0 |
| M11 | Personalized improvement recommendations (basic) | P1 |
| M12 | Re-assessment with score comparison | P1 |
| M13 | Basic candidate-facing job matching | P1 |

---

# 6. CORE FEATURE MODULES

## Module A — User Authentication and Profile
- Registration (email/password; OAuth provider to be decided)
- Role selection at signup: Candidate or HR
- Candidate profile: education, experience, career interests, goals
- HR profile: company affiliation
- Profile completion tracking

## Module B — Career Discovery
- Browse and search supported career tracks with required skill sets
- Select one or more target careers
- Generate a personalized career roadmap using Skill Graph data
- Career recommendations based on profile (rules-based at MVP; AI-assisted as future enhancement)

## Module C — AI Skill Assessment
- Multi-format question types: MCQ, technical/conceptual, scenario-based, practical task
- Free-text and structured response capture
- Timestamped submissions for anti-cheating analysis
- Curated/static question sets per career track at MVP (adaptive difficulty is future)

## Module D — Advanced Grading System
- Multi-dimension AI evaluation against per-career rubrics
- Dimensions: Accuracy, Technical Correctness, Problem-Solving, Reasoning, Practical Application, Communication, Completeness, Efficiency, Role-Specific Competency
- Explainable score breakdown per dimension
- Confidence indicator per submission
- Partial credit for partially correct reasoning

## Module E — AI Career Simulation
- Role-specific scenario with tasks, decisions, and constraints
- Multi-checkpoint evaluation during simulation
- Post-simulation performance report (multi-dimension, explainable)
- Linear scenario structure at MVP; dynamic branching as future enhancement

## Module F — Skill Gap Engine
- Compare candidate Skill Graph against target career required skill set
- Classify skills as Missing, Weak, Strong, Priority
- Auto-recompute after each new assessment or simulation result

## Module G — Personalized Learning / Improvement
- Map identified priority gaps to available practice content, topics, or simulations
- Re-generate recommendations after each re-assessment
- Recommendations must reference the specific gap driving each suggestion

## Module H — Gamification (Post-MVP)
- XP for completed assessments/simulations
- Level tracking and career-readiness progression
- Achievements and badges for milestones
- Leaderboards (opt-in, privacy-aware)

## Module I — HR Smart Recruiter
- Company profile creation
- Structured job posting: required skills, preferred skills, experience level, assessment criteria
- Job requirements structured for direct consumption by the AI Matching Engine

## Module J — AI Candidate Matching
- Overall match score plus per-dimension sub-scores
- Missing/weak skills and strong-match areas per candidate-job pair
- Full explanation of how each score was generated
- Confidence indicator when candidate assessment data is sparse
- No protected attributes used as matching inputs

## Module K — HR Analytics (Post-MVP)
- Pipeline stage counts per job
- Assessment/match score distributions across candidate pool
- Basic hiring funnel metrics (Applied -> Shortlisted -> Interviewed -> Hired)

---

# 7. AI SYSTEM REQUIREMENTS

## 7.1 Cross-Cutting AI Principles

| Requirement | Detail |
|---|---|
| Explainability | Every AI output affecting a user decision must include a "why" — no unexplained scores anywhere |
| Hallucination Prevention | All AI outputs must be anchored to actual submitted candidate data and defined rubrics — free-form generation without a factual anchor is avoided by design |
| Human Override | Every AI-driven decision affecting a candidate or hiring outcome must have a human review/override path |
| Confidence Scores | Grading and matching engines must surface confidence, particularly where input data is sparse |
| No Protected Attributes | Gender, age, ethnicity, disability status, or other protected attributes must not be used as inputs to any scoring or matching system |

## 7.2 AI Engine Summary

| Engine | Input | AI Logic | Output |
|---|---|---|---|
| Assessment Engine | Career/skill area, question bank | Rules-based/curated selection at MVP | Assembled question set |
| Grading Engine | Responses + rubric | LLM-assisted evaluation of free-text; deterministic for MCQ | Score, explanation, confidence |
| Skill Gap Engine | Skill Graph + career requirements | Weighted comparison/classification | Missing/weak/strong/priority skill list |
| Career Recommendation Engine | Profile data | Rules-based at MVP; AI-assisted as future | Ranked career suggestions |
| Simulation Engine | Career track + decisions | Curated linear scenarios at MVP | Scenario prompts, performance capture |
| Feedback Engine | Score + gap data | Template-guided NLG anchored to rubric data | Readable feedback + recommendations |
| Candidate Matching Engine | Skill Graph + job requirements | Weighted scoring; no protected attributes | Match %, dimension scores, gap list, explanation |
| HR Recruitment Intelligence | Pipeline + match data | Descriptive aggregation at MVP | Funnel views, score distributions |

---

# 8. MVP SCOPE

## MUST HAVE (Launch)

| Feature | Module | Priority |
|---|---|---|
| Candidate registration, profile, onboarding | A | P0 |
| Career/skill track selection (limited set) | B | P0 |
| Initial skill assessment (mixed question types) | C | P0 |
| AI grading with explainability | D | P0 |
| Skill gap analysis | F | P0 |
| Career simulation (minimum one track) | E | P0 |
| Simulation grading with explainability | D, E | P0 |
| Verified skill profile | A, D | P0 |
| HR job creation with structured requirements | I | P0 |
| Explainable candidate matching (recruiter-facing) | J | P0 |

## SHOULD HAVE (Early Post-MVP)

| Feature | Ref |
|---|---|
| Personalized improvement recommendations (deeper) | M11, G |
| Re-assessment with score-over-time comparison | M12, C, F |
| Basic candidate-facing job matching | M13, J |
| AI-assisted job requirement extraction from free text | I, 9.2 |
| Additional career tracks beyond MVP set | P5 |

## POST-MVP

| Feature | Ref |
|---|---|
| Gamification (XP, levels, achievements, leaderboards) | H |
| HR Analytics (pipeline funnel, score distributions) | K |
| Candidate comparison view (HR) | I |
| Adaptive assessment difficulty | D |
| Dynamic/branching simulations | E |
| Predictive HR analytics | Future |
| Institutional/B2B2C partnerships | Future — validation required |

---

# 9. NON-GOALS

| ID | Non-Goal | Why |
|---|---|---|
| N1 | Not a full LMS | Product is positioned beyond "another learning platform" |
| N2 | Not an autonomous hiring decision-maker | Human-in-the-loop is a core safety and trust principle |
| N3 | No protected-attribute scoring | Core fairness requirement |
| N4 | Not a general-purpose job board | Differentiation is skill verification and matching, not listing aggregation |
| N5 | Not an MVP-level institutional management platform | B2B2C is unvalidated future exploration |
| N6 | Not a replacement for human hiring judgment | System informs, never substitutes, recruiter/hiring manager judgment |
| N7 | Not a simple MCQ/testing platform | Simulations and multi-dimension grading are core, not optional |
| N8 | Not a resume keyword-ranking system | Matching engine uses demonstrated skill data, not keyword filtering |

---

# 10. KPIs AND ANALYTICS

Note: All numeric targets are DATA REQUIRED — no fabricated figures used anywhere in this document. Targets to be set once real usage data exists.

## 10.1 Candidate-Side Metrics

| Metric | Definition |
|---|---|
| Assessment Completion Rate | % of started assessments that reach submission |
| Simulation Completion Rate | % of started simulations that reach submission |
| Skill Improvement Rate | % of candidates with positive score delta on re-assessment |
| Career Readiness Score Progression | Average score trend per active candidate over time |
| Day-7 / Day-30 Retention | % of new candidates returning after 7 and 30 days |
| Activation Rate | % of new registrants completing first assessment |

## 10.2 HR-Side Metrics

| Metric | Definition |
|---|---|
| Match Score Usage Rate | % of recruiters using match scores in shortlisting decisions |
| Shortlisting Rate | % of viewed candidates moved to Shortlisted stage |
| Time-to-Shortlist | Days from job posting to first shortlisted candidate |
| HR Paid Conversion | % of HR accounts converting from free trial to paid |
| HR Account Retention | % of paid HR accounts renewing after first term |

## 10.3 Product-Level Metrics

| Metric | Definition |
|---|---|
| DAU / MAU (Candidate) | Daily and Monthly Active Users on candidate side |
| DAU / MAU (HR) | Daily and Monthly Active Users on HR side |
| Feature Adoption | % of eligible users engaging with simulation, matching, gamification |
| Freemium Conversion | % of recruiter accounts converting to paid tier |

---

# 11. RISKS

| Risk | Description | Mitigation |
|---|---|---|
| AI Grading Accuracy | Scores could be systematically wrong without early detection | Rubric-anchored scoring; confidence scores; human override paths; manual spot-checking during pilot |
| AI Hallucination | Free-text grading could fabricate specifics not in the candidate's actual response | Anchor all explanations to submitted content and defined rubrics; avoid AI-generated content at MVP |
| Recruitment Bias | Matching/grading could reflect proxy bias even without protected attributes | Explicit protected attribute exclusion; ongoing monitoring commitment once real data exists |
| Data Privacy | Candidate performance data is sensitive | Role-based access control; encrypted transport; audit logs; geography-specific compliance once launch market confirmed |
| Two-Sided Cold Start | Candidates need recruiter value to stay; recruiters need candidate volume to pay | MVP focuses on proving the closed loop narrowly before over-building |
| AI Inference Cost | Free candidate tier with AI-heavy grading could create unsustainable unit economics | Usage limits on free tier; cost monitoring; inference cost optimization at scale |
| Content Creation Bottleneck | Nearly every AI engine depends on curated content libraries that do not yet exist | Must be explicitly resourced and planned for in MVP build timeline |
| Gaming/Cheating | Candidates could game assessments to inflate scores | Response-time analysis; re-assessment cooldowns; scenario-based design that resists generic AI tool answers |
| Poor AI Recommendations | Generic improvement recommendations reduce engagement | Recommendations must reference specific identified gaps; flag gaps with no content mapping rather than show filler |

---

# 12. OPEN QUESTIONS

| # | Question | Originating Section | Priority |
|---|---|---|---|
| OQ1 | Confirm target geography — India-first or different? | 1.4 | High |
| OQ2 | Which specific career tracks are included at MVP? | 8 | High |
| OQ3 | Candidate profile visibility to recruiters — platform-wide or opt-in/application-based? | 9 | High |
| OQ4 | Exact HR pricing structure — seat-based vs. usage-based? | 4 | High |
| OQ5 | Exact free-tier usage limits for candidates (number of assessments/simulations per period) | 4, 8 | High |
| OQ6 | Is Hiring Manager a distinct platform login/role at MVP? | 3.4 | Medium |
| OQ7 | Should Student and Experienced Job Seeker have differentiated onboarding flows? | 3 | Medium |
| OQ8 | Is Admin purely internal, or should a company admin role exist at MVP? | 3.5 | Medium |
| OQ9 | Allow resuming a partially completed assessment, or require restart? | 6-C | Medium |
| OQ10 | Simulation branching — linear (MVP) or dynamic? | 6-E | Medium |
| OQ11 | Re-assessment cooldown duration | 6-D | Low |
| OQ12 | Can candidate response data be used to improve/train AI models? | 9 | Medium |
| OQ13 | Target latency, availability SLA, and WCAG accessibility level | All | Low |
| OQ14 | Which OAuth providers to support at MVP? | 6-A | Low |

---

# 13. ASSUMPTIONS

| ID | Assumption | Status |
|---|---|---|
| A1 | Business model is Freemium: candidate side free with usage limits; HR side is primary paid tier | Confirmed |
| A2 | Product is pre-development: no existing users, no live MVP yet | Confirmed |
| A3 | Target geography: India as initial pilot/anchor market, global English-first | Assumed — pending founder sign-off |
| A4 | No proprietary market research, user interviews, or analytics exist yet | Confirmed |
| A5 | MVP assessment/simulation content is curated/static, not AI-generated | Assumed — flagged for founder confirmation |
| A6 | MVP career-track coverage is limited to a subset of supported tracks; exact subset undecided | Open — Data Required |
| A7 | Candidate profile visibility to recruiters (platform-wide vs. opt-in) is unresolved | Open — High priority |

---

*Generated by Ultron (BMAD Method — bmad-prd) for SkillForge AI Platform — 2026-09-11*

