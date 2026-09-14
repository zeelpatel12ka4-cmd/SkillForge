# SkillForge AI — Product Requirements Document

**Status:** Living document — built section by section
**Last Updated:** Section 1 (Draft)

---

## Document Control

| Section | Status |
|---|---|
| 1. Introduction & Context | Approved |
| 2. Product Objectives | Approved |
| 3. User Personas | Approved (provisional — approved as part of full-PRD generation per user request; open questions in 3 remain unresolved) |
| 4–27 | Drafted in full — Pending Review |

**Process Note:** Per explicit user instruction, Sections 4–27 below are drafted in full in a single pass rather than one-by-one, to allow whole-document review. All PRD Writing Rules still apply (no fabricated statistics, "Data Required" used where real data doesn't exist, assumptions labeled, no silent contradiction of approved Sections 1–3).

**Approved Assumptions Log** (carried forward across all future sections — do not contradict without flagging):

| # | Assumption | Rationale |
|---|---|---|
| A1 | Business model is **Freemium**: candidate side free (with usage limits at scale), HR/recruiter side is the primary paid tier. | Confirmed by user. |
| A2 | Product is **pre-development**: no existing users, no live MVP yet. A dev team is available; API and TLD/domain setup are pending before build starts. | Confirmed by user. |
| A3 | Target geography is **not yet decided**. For this PRD, we assume a **global, English-first product with India as an initial pilot/anchor market** (largest concentration of both entry-level tech job seekers and cost-sensitive ed-tech/HR buyers). This is a placeholder assumption, not a business decision — **flagged as an Open Question** for explicit founder sign-off before go-to-market sections (20, 21, 22) are finalized. | User marked "not decided." |
| A4 | No proprietary market research, user interviews, or analytics exist yet. All market-sizing and behavioral claims will be marked **"Data Required"** rather than fabricated. | Per PRD Writing Rules. |

---

# 1. INTRODUCTION & CONTEXT

## 1.1 Product Overview

SkillForge AI is an AI-powered career-readiness platform that connects two sides of the labor market — **candidates/students** and **HR/recruiters** — through a shared, verifiable layer of demonstrated skill data.

On the candidate side, the platform assesses knowledge and practical ability through AI-graded assessments and realistic career simulations, identifies skill gaps against specific career paths, and generates a personalized improvement plan. On the recruiter side, the platform allows companies to define job requirements and evaluate candidates based on demonstrated performance (assessment + simulation results) rather than resume keywords alone, using an explainable AI matching engine.

The product's core differentiator is that it does not stop at "learning content delivery" (like a course platform) or "keyword matching" (like a traditional ATS/job board) — it creates a **closed feedback loop**: Assess → Identify Gaps → Simulate → Grade → Improve → Re-assess → Match → Hire.

## 1.2 Problem / Opportunity Statement

**Objective:** Address the disconnect between what candidates *claim* to know (resumes, self-reported skills, course certificates) and what they can *actually do*, and give recruiters a reliable, explainable way to evaluate practical ability at scale.

**User Pain Points:**

*Candidate/Student side:*
- Resumes and certificates are weak signals of real capability; candidates struggle to prove skills convincingly.
- Career direction is unclear — candidates often don't know which career fits their current skill set, or what the true skill gap is between where they are and where they want to be.
- Learning platforms teach content but rarely simulate the actual pressure, ambiguity, and decision-making of a real job role.
- Feedback from assessments (quizzes, tests) is typically binary (right/wrong) and doesn't explain *why* a score was given or what to do next.
- Job applications feel like a black box — candidates don't know why they were rejected or how competitive they are.

*HR/Recruiter side:*
- Resume screening is noisy — keyword-optimized resumes don't reliably indicate practical competency.
- Traditional skills tests (generic MCQ platforms) are easy to game, don't reflect job-realistic scenarios, and are hard to compare across roles.
- Recruiters lack an explainable way to justify *why* a candidate is a strong or weak match — creating both inefficiency and potential fairness/bias exposure.
- Manually reviewing candidate skill profiles, assessments, and simulation performance separately across many candidates is time-consuming.

**Problem Background:**
This is a **conceptual/pre-development stage** product with a development team and infrastructure being assembled, but no existing user base, product analytics, or proprietary market research yet. Any competitive or market-sizing claims below are explicitly marked "Data Required" per PRD writing rules — they are not fabricated.

## 1.3 Target Users

| User Type | Description |
|---|---|
| **Students / Early-career candidates** | Individuals exploring career direction, building foundational skills, and seeking their first job or internship. |
| **Job Seekers (experienced)** | Individuals looking to switch careers/roles, validate existing skills, or close specific gaps for a target role. |
| **HR Recruiters** | Individuals sourcing, screening, and shortlisting candidates for open roles within a company. |
| **Hiring Managers** | Role-owners who need to make final hiring decisions and want deeper, role-specific evidence of candidate capability. |
| **Admins** (platform-side) | Internal or institutional admins managing platform configuration, content, and oversight (assumed necessary for MVP operability — to be detailed in Section 3.5). |

*(Full persona detail — background, behaviors, needs — is deferred to Section 3, per structure.)*

## 1.4 Key Observations, Data & Insights

> **Data Required.** No proprietary user research, analytics, surveys, or A/B test data exist at this stage (pre-MVP). The observations below are **reasoned assumptions**, not validated data, and are labeled as such. They should be replaced or confirmed with real research (user interviews, competitor teardown, survey data) before major investment decisions are finalized.

| Observation (Assumed) | Confidence | Notes |
|---|---|---|
| Employers increasingly distrust resume-only screening for technical/practical roles. | Directional / industry-known trend — **Data Required** for hard numbers. | Widely discussed in HR-tech industry; no specific stat cited here. |
| Candidates want actionable, specific feedback (not just pass/fail) to improve. | Reasoned assumption from common ed-tech/assessment UX patterns. | To be validated via candidate interviews. |
| Simulation-based assessment is more predictive of on-the-job performance than static MCQ tests. | Reasoned assumption, common in structured-interview/work-sample literature. | **Data Required** — cite specific studies if used in external-facing materials. |

## 1.5 Impact Sizing

**Qualitative Impact:**
- **Candidates** gain a verified, explainable record of practical skill — reducing anxiety around "Am I job-ready?" and giving a concrete improvement path instead of generic advice.
- **Recruiters/Hiring Managers** gain a faster, more defensible way to shortlist candidates, reducing reliance on subjective resume judgment and lowering mis-hire risk.
- **Institutions** (if pursued as a future B2B2C channel) could use SkillForge AI as a placement-readiness layer for their students.

**Quantitative Impact:**
> **Data Required.** No revenue, cost-savings, or engagement projections are available pre-MVP. Quantitative targets (e.g., candidate activation rate, HR-side conversion to paid, match-accuracy benchmarks) will be defined once assumptions in Sections 20–21 (Analytics & KPIs, MVP Scope) are approved, and ideally validated with early pilot data.

## 1.6 Product Vision

SkillForge AI becomes the trusted layer between education and employment — the place where a person's *actual, demonstrated capability* is built, verified, and understood by both the person and the employers evaluating them, replacing guesswork on both sides of the hiring process with explainable evidence.

## 1.7 Product Mission

To help every candidate understand exactly where they stand, close their real skill gaps through realistic practice and AI-driven feedback, and give every recruiter a fair, explainable, and evidence-based way to identify the right talent.

## 1.8 Goals & Metrics

| Goal | Metric Category | Notes |
|---|---|---|
| Candidates can accurately understand their skill level and gaps | Candidate-side engagement & assessment completion | Detailed metrics in Section 20 |
| Candidates measurably improve skills over time | Re-assessment score delta | Requires re-assessment feature (Module F/G) |
| Recruiters trust and adopt AI match scores | HR adoption / match-to-shortlist conversion | Detailed metrics in Section 20 |
| Platform sustains a healthy free-to-paid funnel (Freemium model, A1) | Candidate → HR monetization funnel | Full model in Section 21 (MVP Scope) and monetization strategy (flagged as **Open Question** — not yet scoped in source brief) |

*(Full metric definitions, targets, and formulas are deferred to Section 20: Analytics & KPIs, to avoid fabricating numeric targets prematurely.)*

## 1.9 Success Metrics

> Primary success metrics will be finalized in Section 20, but at a directional level, Section 1 assumes success is measured across three dimensions:

1. **Candidate Outcomes** — assessment/simulation completion rate, measurable skill-score improvement across re-assessments, career-readiness score trend.
2. **Recruiter Outcomes** — adoption of AI match scores in shortlisting decisions, reduction in time-to-shortlist, recruiter-reported trust/satisfaction with explainability.
3. **Business Health** — free-to-paid conversion on the HR side (per Freemium model, A1), retention of paying recruiter accounts.

No numeric targets (e.g., "+20% conversion") are set here, per PRD rule against fabricated statistics — these will be proposed in Section 20 as **draft targets requiring founder validation**, clearly separated from any real data once available.

---

## Open Questions Raised in Section 1

1. **Target geography** — confirm whether India-pilot-first (assumed, A3) is correct, or if a different launch market should be assumed for market-fit and monetization sections later.
2. **Monetization detail on HR side** — Freemium confirmed, but pricing tiers, seat-based vs. usage-based pricing, and free-tier limits for candidates are undefined. To be addressed properly in Section 21 (MVP Scope) / future monetization section if needed.
3. Whether **Admin** persona (5th user type, Section 3.5) is platform-internal only, or also represents institutional admins (universities/training partners) — affects Information Architecture (Section 12) and Data Model (Section 15).

---

**SECTION 1 STATUS: Approved**

---

# 2. PRODUCT OBJECTIVES

*(Section 1 remains approved and unchanged. This section has been restructured and improved per review feedback; it does not alter any approved assumption A1–A4 or the Open Questions logged in Section 1.)*

Section 2 answers: **"What does SkillForge AI need to achieve?"** — separated cleanly from *how* (features, architecture — later sections).

## 2.1 Business Objectives

The two-sided network effect (candidate skill data → recruiter value → paid adoption) is treated as a **strategic hypothesis**, not a proven fact, since no market or usage data exists yet (A4).

| ID | Business Objective | Why It Matters | Measurement Approach | Target |
|---|---|---|---|---|
| B1 | Build a functioning candidate ↔ recruiter ecosystem where candidate skill data has real value to recruiters. | This is the foundation of the entire business model; without two active sides, neither Freemium tier nor matching has value. | Ratio of "active candidates with completed assessments" to "recruiter searches/views of candidate profiles." | Data Required — Founder Validation |
| B2 | Sustain the Freemium model: candidate side free (with usage limits at scale, per A1), HR/recruiter side as primary revenue. | Confirmed business model (A1); must be protected as the product scales. | % of platform revenue originating from HR/recruiter tier vs. candidate tier. | HR side = primary revenue source (directional target; no % committed — Data Required) |
| B3 | Drive recruiter adoption and retention of paid HR tools. | Recruiter-side revenue depends on recruiters finding the matching/evaluation tools materially better than resume screening. | Paid recruiter account retention rate; repeat job postings per account. | Data Required — Founder Validation |
| B4 | Drive sustainable candidate growth (volume and completion of assessments/simulations), since candidate activity is the raw input to recruiter value. | Strategic hypothesis (B1) only holds if candidate-side engagement is real, not just signups. | Candidate activation rate (registration → first completed assessment); assessment/simulation completion rate. | Data Required — Founder Validation |
| B5 | Keep AI inference cost per candidate assessment/simulation within a sustainable unit-economics band relative to Freemium pricing and usage limits. | Freemium at scale is only viable if free-tier AI cost per user stays bounded; this directly affects usage-limit design (A1). | Cost per assessment / cost per simulation vs. blended revenue per HR account. | Data Required — Founder Validation |
| B6 | Build a defensible skill-data asset over time (accumulated, structured, verified skill and performance data) as a long-term competitive moat. | Differentiates SkillForge AI from generic test platforms or job boards; strengthens matching accuracy over time. | Growth in volume of structured skill-data points per candidate over time (directional, not committed to a number). | Strategic hypothesis — Data Required for any numeric target |

## 2.2 User Objectives

### Candidate / Student

| ID | User | Objective | Expected Outcome |
|---|---|---|---|
| U1 | Candidate | Understand current capability across relevant skills. | Candidate can see a clear, structured skill-level breakdown, not just a pass/fail result. |
| U2 | Candidate | Identify skill gaps relative to a specific target career. | Candidate sees exactly which skills are missing, weak, or strong for a chosen career path. |
| U3 | Candidate | Understand *why* a given score was received. | Candidate receives explainable, reasoned feedback tied to specific answers/decisions — not an opaque number. |
| U4 | Candidate | Practice realistic job scenarios rather than generic quizzes. | Candidate completes a career simulation that reflects real workplace tasks, decisions, and pressure. |
| U5 | Candidate | Improve identified weak skills through a personalized plan. | Candidate receives specific, prioritized recommendations (not generic study advice). |
| U6 | Candidate | Track measurable improvement over time. | Candidate can compare current vs. prior assessment/simulation results and see a trend. |
| U7 | Candidate | Build a credible, verifiable skill profile. | Candidate has a profile reflecting demonstrated performance, usable when applying to jobs on the platform. |
| U8 | Candidate | Understand overall career readiness for a target role. | Candidate sees a consolidated career-readiness indicator, with a clear basis for how it was derived. |
| U9 | Candidate | Discover relevant job opportunities aligned to demonstrated skill. | Candidate is shown/matched to roles consistent with their verified profile, not just self-selected search. |

### HR / Recruiter

| ID | User | Objective | Expected Outcome |
|---|---|---|---|
| U10 | Recruiter | Define job requirements (required + preferred skills, experience). | Recruiter can create a job posting with structured, matchable skill requirements. |
| U11 | Recruiter | Discover relevant candidates for an open role. | Recruiter can find candidates whose verified skill data fits the job's requirements. |
| U12 | Recruiter | Evaluate candidates based on demonstrated skills and performance. | Recruiter sees assessment and simulation results, not just resume/self-reported data. |
| U13 | Recruiter | Understand AI-generated match scores. | Recruiter sees a breakdown of *why* a candidate received a given match score (per-dimension explanation). |
| U14 | Recruiter | Compare multiple candidates on a consistent basis. | Recruiter can view side-by-side comparisons using the same scoring dimensions across candidates. |
| U15 | Recruiter | Reduce manual screening effort. | Recruiter spends less time manually reading resumes to find qualified candidates (directional — no % claimed; Data Required). |
| U16 | Recruiter | Identify skill gaps in candidates relative to the role. | Recruiter sees where a candidate falls short of job requirements, not just an overall score. |
| U17 | Recruiter | Shortlist candidates efficiently. | Recruiter can move qualified candidates through a defined pipeline stage with minimal manual re-entry of data. |

### Hiring Manager

| ID | User | Objective | Expected Outcome |
|---|---|---|---|
| U18 | Hiring Manager | Review evidence of candidate capability beyond a resume. | Hiring Manager can view assessment/simulation evidence behind a recruiter's shortlist decision. |
| U19 | Hiring Manager | Understand candidate strengths and weaknesses. | Hiring Manager sees a clear strengths/weaknesses breakdown per shortlisted candidate. |
| U20 | Hiring Manager | Compare shortlisted candidates before a final decision. | Hiring Manager can view a consistent comparison across final-round candidates. |
| U21 | Hiring Manager | Make an informed final hiring decision. | Hiring Manager retains full decision authority — the system supports but does not replace this judgment (ties to Non-Goal N2/N6). |

### Admin

Scoped narrowly to what MVP-level platform operation requires — **not** expanded into an institutional/B2B2C administration system, per approved constraint.

| ID | User | Objective | Expected Outcome |
|---|---|---|---|
| U22 | Admin | Configure and maintain platform content (career tracks, assessment/simulation content libraries). | Admin can manage the content backing assessments/simulations without engineering involvement for routine updates. |
| U23 | Admin | Moderate platform integrity (e.g., flagged cheating attempts, abuse reports). | Admin has visibility into flagged accounts/content and can take basic corrective action. |
| U24 | Admin | Oversee platform-level configuration and access control. | Admin can manage roles/permissions at a platform-operations level (not institutional account management — that is out of scope, see Non-Goal N5). |

## 2.3 Product Objectives

This subsection defines what the product itself must accomplish — not specific features (deferred to Section 5+).

### P1 — Closed Career-Readiness Loop

The product must support the full loop, without stopping at re-assessment:

```
Assess
  ↓
Identify Skill Gaps
  ↓
Simulate
  ↓
Grade
  ↓
Improve
  ↓
Re-assess
  ↓
Build Verified Skill Profile
  ↓
Match to Relevant Opportunities
```

Each stage must feed the next with structured data — the loop is a product requirement, not a marketing narrative.

### P2 — Explainable AI

Every AI-generated score that affects a candidate or recruiter decision must be explainable. This applies to:
- Assessment scores
- Simulation scores
- Skill scores
- Skill-gap results
- Career recommendations
- Candidate match scores

For each, the product must be able to answer: *What was evaluated? How was the score generated? Where did the user perform well? What should improve?* (Full mechanics deferred to Section 6: AI System Requirements.)

### P3 — Demonstrated Skill Over Resume Claims (Not a Replacement)

The platform prioritizes demonstrated capability and performance evidence over resume keywords or self-reported skills. This does **not** mean resumes/self-reported data are ignored — the product combines relevant candidate-provided information (education, experience, stated interests) with demonstrated performance evidence for a fuller picture.

### P4 — Shared Skill Intelligence Layer

Candidate-side assessment and simulation activity must generate structured skill data that is the *same* underlying data consumed by recruiter-side evaluation and matching — not a duplicated or disconnected system. This is a core architectural objective carried into Section 15 (Data Model).

### P5 — Multi-Career Support (Architecture, Not Committed MVP Scope)

The product architecture must be capable of supporting multiple career tracks (e.g., Software Development, Data Analytics, Marketing, Finance, HR, Product Management, Cybersecurity, Business roles). **Which tracks are included at MVP is not decided here** — that split is finalized in Section 21 (MVP Scope).

### P6 — Personalized Improvement

Assessment and simulation results must drive specific, prioritized, individualized recommendations — identifying strong skills, weak skills, missing skills, priority skills, and recommended practice — rather than generic study advice.

### P7 — Human-in-the-Loop Recruitment

The system assists recruiters and hiring managers with evidence and explainable scoring. **It must not autonomously make final hiring decisions.** Final hiring authority remains with human decision-makers at all times.

### P8 — Trust, Explainability & Fairness by Design

The product must be *designed* to support explainable, auditable, consistent, fair, and human-reviewable AI evaluation. This is a design objective and engineering requirement (detailed in Section 18: AI Safety & Fairness) — it is **not** a claim that the system is already bias-free or validated as fair. That validation is a future, ongoing responsibility, not a one-time launch guarantee.

## 2.4 Short-Term Objectives — Pre-Launch → MVP

Focus: prove the core closed-loop concept end-to-end, not build the full platform.

| ID | MVP Objective | Priority | Success Evidence | Dependency |
|---|---|---|---|---|
| M1 | Candidate onboarding (registration, basic profile) | P0 | Candidate can register and reach the assessment flow. | Module A |
| M2 | Career/skill track selection | P0 | Candidate can select at least one supported career track. | Module B (scoped set — Section 21) |
| M3 | Initial skill assessment | P0 | Candidate completes a structured assessment for the selected track. | Module C |
| M4 | AI grading of assessment | P0 | Assessment produces an explainable score with category breakdown. | Module D, Section 6 |
| M5 | Skill-gap analysis | P0 | Candidate sees specific gaps vs. selected career's required skills. | Module F |
| M6 | Career simulation (at least one track) | P0 | Candidate can complete one realistic scenario-based simulation. | Module E |
| M7 | Simulation grading | P0 | Simulation produces an explainable, multi-dimension performance report. | Module D, E |
| M8 | Personalized improvement recommendations | P1 | Candidate receives specific next-step recommendations post-assessment/simulation. | Module F, G |
| M9 | Re-assessment capability | P1 | Candidate can retake assessment and see score comparison over time. | Module C, F |
| M10 | Verified skill profile | P0 | Candidate has a profile reflecting assessment + simulation results. | Module A, D |
| M11 | Basic job matching (candidate-facing) | P1 | Candidate sees at least directional job/role matches based on profile. | Module J |
| M12 | HR job creation | P0 | Recruiter can create a job posting with required/preferred skills. | Module I |
| M13 | Basic HR candidate evaluation | P0 | Recruiter can view a candidate's assessment/simulation results against a job. | Module I, D |
| M14 | Explainable candidate matching (recruiter-facing) | P0 | Recruiter sees a match score with a per-dimension explanation for a candidate against a job. | Module J, Section 6 |

*(Gamification (Module H) and full HR Analytics (Module K) are treated as P2 — post-MVP candidates — pending final confirmation in Section 21.)*

## 2.5 Long-Term Strategic Objectives

These describe direction, not committed near-term work. Anything not already approved is explicitly marked.

| ID | Strategic Objective | Status |
|---|---|---|
| L1 | Expand career track coverage beyond MVP scope. | Future |
| L2 | Build longitudinal candidate skill profiles that improve over time as more assessment/simulation data accumulates. | Future |
| L3 | Improve AI recommendation and matching accuracy using accumulated performance data (outcome feedback loops). | Future — requires accumulated data not available at launch |
| L4 | Expand recruiter intelligence and deepen HR analytics (e.g., predictive hiring-funnel insights). | Future |
| L5 | Improve candidate-job matching sophistication as skill-data volume grows. | Future |
| L6 | Strengthen skill verification mechanisms (e.g., proctoring, integrity signals) as the platform scales. | Future |
| L7 | Improve career-readiness measurement methodology as outcome data becomes available. | Future |
| L8 | Explore institutional/B2B2C partnerships (e.g., universities, training providers). | **Future / Validation Required** — not approved, not committed |

## 2.6 Non-Goals

Each non-goal states what is excluded, why, and what scope creep it protects against.

| ID | Non-Goal | What Is Excluded | Why | Protects Against |
|---|---|---|---|---|
| N1 | Not a full LMS | Long-form video courses as a primary product offering. | Vision (Section 1.6) positions SkillForge AI beyond "another learning platform." | Drifting into content-library competition instead of assessment/simulation/matching focus. |
| N2 | Not an autonomous hiring decision-maker | The system does not make final "hire/reject" calls. | Human-in-the-loop is a core safety/trust principle (P7, Section 18). | Legal, ethical, and trust risk from fully automated hiring. |
| N3 | No protected-attribute scoring | Gender, age, ethnicity, or other protected attributes are not inferred or used in scoring/matching. | Core fairness requirement (P8, Section 18). | Discriminatory outcomes and fairness/legal exposure. |
| N4 | Not a general-purpose job board | Not competing primarily on job listing volume/breadth at MVP. | Differentiation is skill verification + matching, not listing aggregation. | Diluting focus into a crowded, low-differentiation market. |
| N5 | Not an MVP-level institutional management platform | Full university/institutional administration tooling is out of MVP scope. | B2B2C (L8) is unapproved and unvalidated. | Building unvalidated institutional features before the core B2C/B2B loop is proven. |
| N6 | Not a replacement for human hiring judgment | The product informs but does not substitute for recruiter/hiring manager judgment. | Reinforces P7 and U21. | Over-reliance on AI scores without human review. |
| N7 | Not a simple MCQ/testing platform | MCQs are one input among several (Module C); simulations and multi-dimension grading are core differentiators, not optional add-ons. | Vision explicitly moves beyond static testing (Section 1.1, 1.6). | Product regressing into a commodity quiz tool. |
| N8 | Not a resume-keyword-ranking system disguised as AI recruitment | Resume keyword matching alone does not constitute the matching engine. | Core differentiator is demonstrated-skill evidence (P3, U12). | Recruiter-side trust erosion if the "AI matching" turns out to be superficial keyword filtering. |

## Objective Hierarchy

```
BUSINESS OUTCOME
      ↓
USER OUTCOME
      ↓
PRODUCT OBJECTIVE
      ↓
MVP OBJECTIVE
      ↓
MEASUREMENT
```

**Example chain (illustrative, not the only valid path):**
Business Outcome B1 (functioning ecosystem) → User Outcomes U1–U9 (candidate) + U10–U17 (recruiter) → Product Objective P1 (closed loop) + P4 (shared skill layer) → MVP Objectives M1–M14 → Measurement: activation rate, completion rate, recruiter adoption (Data Required — Founder Validation for all numeric targets).

**Strategic hypothesis chain — labeled explicitly as a hypothesis, not a proven mechanism:**

```
Candidate Growth
      ↓
More Skill Assessments Completed
      ↓
More Demonstrated Skill Data Generated
      ↓
Better / Richer Candidate Profiles
      ↓
Better HR Matching Quality
      ↓
Higher Recruiter-Perceived Value
      ↓
HR Paid Adoption
      ↓
Sustainable Business (B1–B6)
```

> **Strategic Hypothesis Notice:** This chain has not been validated with real usage, market, or cohort data (A4). It is the working growth logic behind the Freemium model (A1) and should be treated as a hypothesis to test during and after MVP, not a guaranteed outcome.

---

## Section 2 Open Questions

1. **Numeric business targets** (paying account counts, activation rate goals, retention targets) — none can be set without founder/business input and/or early pilot data. *(Data Required — Founder Validation)*
2. **Usage-limit design for the free candidate tier** (A1) — what specifically is capped (number of assessments, simulations, re-assessments per period?) is not yet defined and will materially affect Section 21 (MVP Scope) and Section 7 (Grading anti-gaming considerations).
3. **Institutional/B2B2C exploration (L8)** — remains unapproved; needs an explicit founder decision before any related work is scoped, even at a research level.
4. Carried forward from Section 1: **target geography (A3)** and **detailed HR pricing/monetization structure** remain open and will affect Sections 20–22 when reached.

---

## SECTION 2 STATUS

**Approved**

---

# 3. USER PERSONAS

*(Consistent with Sections 1–2. Personas here are reasoned constructs based on the approved product context and objectives, not validated user research — per A4, this is explicitly flagged and should be validated with real interviews when possible.)*

> **Note on scope:** Job Seeker (3.2) and Student/Candidate (3.1) sit on the same underlying candidate platform (Module A–H) but differ meaningfully in motivation, urgency, and behavior, so they are kept as distinct personas rather than merged.

## 3.1 Student / Candidate (Early-Career)

| Attribute | Description |
|---|---|
| **Background** | Currently studying or recently graduated; limited or no full-time work experience. Exploring what career direction fits their skills and interests. |
| **Goals** | Understand which careers suit them; build genuine, job-ready skills; get their first job or internship; feel confident they're "ready" before applying. |
| **Pain Points** | Overwhelmed by generic career advice; unsure if their skills are actually good enough; course certificates don't feel credible to employers; no realistic sense of what the job actually involves day-to-day. |
| **Behaviors** | Takes online courses and quizzes; browses job descriptions to reverse-engineer what skills are needed; compares themselves to peers; likely to abandon platforms that feel like "more homework" without clear payoff. |
| **Needs** | A clear, honest skill baseline; a mapped path from "where I am" to "what a specific job needs"; realistic practice, not just theory; confidence-building through evidence, not guesswork. |
| **Problems with Existing Solutions** | Generic MCQ platforms don't reflect real job scenarios; LMS platforms measure course completion, not capability; career quizzes are shallow (interest-based, not skill-based). |
| **How SkillForge AI Helps** | Assessment → skill-gap analysis → career simulation → explainable grading → personalized improvement plan (P1, P6), giving a concrete, evidence-based readiness path instead of generic advice (U1–U6). |

## 3.2 Job Seeker (Experienced / Career Switcher)

| Attribute | Description |
|---|---|
| **Background** | Has existing work experience, either seeking a new role in the same field or switching careers/roles entirely (e.g., moving into Data Analytics or Product Management from an unrelated background). |
| **Goals** | Validate existing skills credibly; identify and close specific gaps for a target role; get hired faster; prove capability despite a non-traditional or unrelated resume history. |
| **Pain Points** | Resume doesn't reflect true current capability, especially when switching fields; applications feel like a black box; generic skill tests don't reflect the seniority or specificity of the roles they're targeting. |
| **Behaviors** | Applies to multiple roles in parallel; researches specific job requirements closely; more time-constrained than a student (often employed while job-seeking); skeptical of platforms that feel like a "student tool." |
| **Needs** | Fast, credible way to demonstrate capability for a *specific* target role; clear, prioritized gap-closing plan (not a full curriculum); a profile that recruiters actually weight in decisions. |
| **Problems with Existing Solutions** | ATS keyword filtering penalizes non-traditional backgrounds; generic certifications carry limited signal value with recruiters; no realistic way to simulate "can I actually do this job" before applying. |
| **How SkillForge AI Helps** | Career simulation demonstrates role-realistic capability regardless of resume history (P3); explainable match scoring (U13) gives recruiters a reason to consider non-traditional candidates on merit. |

## 3.3 HR Recruiter

| Attribute | Description |
|---|---|
| **Background** | Responsible for sourcing, screening, and shortlisting candidates for open roles, often managing multiple open requisitions and high applicant volume simultaneously. |
| **Goals** | Fill roles with genuinely qualified candidates; reduce time spent manually screening low-fit applicants; defend shortlisting decisions to hiring managers with evidence. |
| **Pain Points** | High applicant volume with low signal quality from resumes alone; time pressure to fill roles quickly; risk of being blamed for a bad hire that "looked good on paper." |
| **Behaviors** | Scans large numbers of resumes/applications quickly; relies on keyword filters and heuristics; escalates only a shortlist to hiring managers; juggles multiple job requisitions at once. |
| **Needs** | A reliable, fast way to separate genuinely capable candidates from resume-optimized ones; explainable evidence they can present upward; consistent comparison criteria across candidates. |
| **Problems with Existing Solutions** | Traditional ATS keyword-matching is gameable and shallow (N8); generic skills-testing tools are easy to cheat and don't map cleanly to specific job requirements. |
| **How SkillForge AI Helps** | AI candidate matching against defined job requirements (Module J) with explainable, per-dimension scoring (P2, U13); assessment/simulation evidence replaces resume-only judgment (P3, U12). |

## 3.4 Hiring Manager

| Attribute | Description |
|---|---|
| **Background** | Owns the role being filled and makes (or heavily influences) the final hiring decision; typically less involved in early-stage screening than the recruiter. |
| **Goals** | Hire someone who will actually perform well in the role; avoid costly mis-hires; make an efficient final decision among a short list of candidates. |
| **Pain Points** | Limited time to personally evaluate every candidate; often relies on the recruiter's summary and a short interview, which may miss real capability gaps; accountable for hire quality without full visibility into how a shortlist was built. |
| **Behaviors** | Reviews a small number of finalist candidates; conducts or attends final interviews; asks for justification behind a recruiter's recommendation. |
| **Needs** | Clear, comparable evidence of finalist capability; visibility into strengths/weaknesses beyond interview impressions; confidence that the shortlist reflects real ability, not just resume polish. |
| **Problems with Existing Solutions** | Interviews alone are a narrow, subjective sample of ability; no structured way to compare finalists on the same dimensions; limited insight into *why* the recruiter's shortlist looks the way it does. |
| **How SkillForge AI Helps** | Access to underlying assessment/simulation evidence behind each shortlisted candidate (U18–U19); consistent side-by-side comparison across the same scoring dimensions (U20); final decision authority remains fully human (P7, N2, N6). |

## 3.5 Admin (Platform-Level Only)

*(Scoped narrowly per approved constraint — not an institutional/B2B2C admin system; see Non-Goal N5.)*

| Attribute | Description |
|---|---|
| **Background** | Internal SkillForge AI team member (not a customer-facing role) responsible for keeping the platform operating correctly, content current, and integrity intact. |
| **Goals** | Keep assessment/simulation content accurate and current; maintain platform integrity (prevent/catch cheating and abuse); ensure platform configuration and access controls are correct. |
| **Pain Points** | Content can go stale as career requirements evolve; cheating/gaming attempts can undermine trust in scores (ties to Section 7 anti-cheating, Section 18 fairness); misconfigured access controls create security/privacy risk. |
| **Behaviors** | Periodically reviews/updates content libraries; monitors flagged accounts or suspicious activity; manages platform-level roles and permissions. |
| **Needs** | Efficient tools to manage content without needing engineering support for routine updates; visibility into integrity/abuse signals; straightforward access-control management. |
| **Problems with Existing Solutions** | N/A — this persona is internal to SkillForge AI, not evaluating external existing solutions. |
| **How SkillForge AI Helps** | This section describes what the *Admin* persona needs *from* SkillForge AI (U22–U24) rather than how SkillForge AI competes with an external tool. |

---

## Section 3 Open Questions

1. Should **Job Seeker (3.2)** and **Student/Candidate (3.1)** eventually have differentiated product experiences (e.g., different onboarding flows or default career tracks), or share one identical candidate flow at MVP? *(Affects Section 10 User Journeys and Section 21 MVP Scope.)*
2. Is the **Admin** persona purely internal (SkillForge AI team), or should it eventually include a limited "company admin" role on the HR side (e.g., managing multiple recruiters under one company account)? This is separate from the institutional/B2B2C question (L8) already flagged as unapproved, and needs its own decision since even a "company admin" (not a university) could be relevant at MVP.

---

## SECTION 3 STATUS

**Approved** (provisional, per full-PRD generation request — open questions above still require founder input)

---

# 4. PRODUCT ECOSYSTEM

## 4.1 Candidate Ecosystem

```
Candidate
   ↓
Career Discovery (select target career / explore options)
   ↓
Initial Skill Assessment
   ↓
AI Grading (explainable, multi-dimension)
   ↓
Skill Graph (structured record of demonstrated skill levels)
   ↓
Skill Gap Engine (compares Skill Graph vs. target career requirements)
   ↓
Career Simulation (realistic role-based scenario)
   ↓
AI Grading (simulation performance)
   ↓
Personalized Improvement Plan
   ↓
Practice / Re-assessment
   ↓
Updated Skill Graph → Career Readiness Score
   ↓
Verified Skill Profile
   ↓
Job Matching → Recruitment (feeds into HR Ecosystem)
```

## 4.2 HR Ecosystem

```
HR / Recruiter
   ↓
Company Profile Setup
   ↓
Job Creation
   ↓
Job Skill Requirements (required + preferred skills, experience)
   ↓
AI Candidate Matching (queries candidate Skill Graphs against job requirements)
   ↓
Candidate Ranking (explainable match scores)
   ↓
Assessment / Simulation Performance Review (drill into evidence per candidate)
   ↓
Candidate Comparison
   ↓
Shortlisting
   ↓
Hiring Manager Review → Interview → Hiring Decision (human-in-the-loop, P7)
```

## 4.3 Shared Core: The Skill Intelligence Layer

Both ecosystems read from and write to the same underlying skill data layer (P4, Section 2.3) — this is the architectural link between the two sides, not two separate systems that happen to share a brand name:

```
        CANDIDATE ECOSYSTEM                    HR ECOSYSTEM
              ↓                                     ↓
     Assessment + Simulation                 Job Requirements
              ↓                                     ↓
              └──────────→  SKILL INTELLIGENCE  ←──────────┘
                             LAYER (shared data:
                             Skill Graph, Scores,
                             Career Readiness)
                                    ↓
                          AI Matching / Recommendation
                                    ↓
                    Candidate-facing job matches  +  Recruiter-facing candidate matches
```

This shared-layer design is why Section 15 (Database/Entity Requirements) treats Skill, Assessment, Simulation, and Score entities as central — recruiter- and candidate-facing features both consume the same tables rather than duplicating them.

---

**SECTION 4 STATUS: Draft — Pending Review**

---

# 5. FEATURE REQUIREMENTS

*(Given the scope of Modules A–K, features are grouped by module. Each entry follows the required attribute set. Sub-features not explicitly detailed here inherit the same pattern and are expanded during implementation planning, not re-litigated in this PRD.)*

## 5.1 Module A — User Authentication & Profile

| Attribute | Detail |
|---|---|
| **Feature Name** | Candidate/Recruiter Registration, Login & Profile Management |
| **Objective** | Allow both candidate and recruiter users to securely create accounts and maintain profile data that feeds the rest of the platform. |
| **User Story** | As a candidate/recruiter, I want to register and maintain my profile so that the platform can personalize assessments, simulations, and matching for me. |
| **Description** | Standard auth (email/password, optionally OAuth) plus role selection (Candidate vs. HR) at signup, feeding into role-specific profile schemas. |
| **Functional Requirements** | FR1: System shall support registration via email/password (OAuth — Data Required, Founder Validation on which providers). FR2: System shall require role selection at signup (Candidate / HR). FR3: Candidate profile shall capture education, experience, career interests, goals. FR4: HR profile shall capture company affiliation. FR5: System shall track profile completion % (Module A). |
| **Inputs** | Email, password, role, profile fields (education, experience, interests, goals, or company info). |
| **Processing** | Credential validation, role-based schema assignment, profile completeness calculation. |
| **Outputs** | Authenticated session; profile completion indicator; role-scoped dashboard access. |
| **User Interaction** | Registration form → email verification → profile setup wizard → dashboard. |
| **AI Behavior** | None directly (this feature is not AI-driven); may optionally suggest career interests based on stated background — **Future**, not MVP. |
| **Edge Cases** | Duplicate email registration; incomplete profile blocking downstream features (assessment/job creation); role-switch requests (candidate wanting HR access, or vice versa) — **Open Question**, not resolved in this PRD. |
| **Error States** | Invalid credentials; unverified email blocking key actions; duplicate account detection. |
| **Acceptance Criteria** | AC1: User can register, verify email, and reach their role-specific dashboard. AC2: Profile completion % updates as fields are filled. AC3: Unverified users cannot access assessment/job-creation features. |
| **Dependencies** | None (foundational). |
| **Priority** | P0 — MVP Critical |

## 5.2 Module B — Career Discovery

| Attribute | Detail |
|---|---|
| **Feature Name** | Career Exploration & Recommendation |
| **Objective** | Help candidates identify a target career and understand its required skills. |
| **User Story** | As a candidate, I want to explore career options and see what skills each requires, so I can choose a target career and know what to work toward. |
| **Description** | Candidate browses/searches supported career tracks; each shows required skill set; system may recommend tracks based on stated interests/background (basic, rules-based, or AI-assisted — mechanism deferred to Section 6). |
| **Functional Requirements** | FR1: System shall list all supported career tracks with required skill sets. FR2: System shall allow a candidate to select one or more target careers. FR3: System shall generate a personalized career roadmap once a target is selected, incorporating current Skill Graph data if available. |
| **Inputs** | Candidate profile data (education, interests), selected career track. |
| **Processing** | Match candidate profile against career skill requirement templates; generate roadmap. |
| **Outputs** | List of career options with required skills; selected career roadmap. |
| **User Interaction** | Browse/search careers → view required skills → select target career → view roadmap. |
| **AI Behavior** | Recommending careers based on profile is an AI/rules-based judgment call — full mechanism in Section 6 (Career Recommendation Engine); must be explainable per P2. |
| **Edge Cases** | Candidate selects a career with no supported assessment/simulation content yet (should be prevented or clearly flagged); candidate changes target career mid-journey (roadmap/gap analysis must recompute). |
| **Error States** | No matching career recommendations available for a sparse profile — system should degrade to showing all tracks rather than failing. |
| **Acceptance Criteria** | AC1: Candidate can view required skills for any listed career. AC2: Selecting a career generates a roadmap referencing the candidate's current Skill Graph (or indicates assessment is needed first). |
| **Dependencies** | Module A (profile data); Module F (skill-gap engine, for roadmap accuracy). |
| **Priority** | P0 — MVP Critical (for the career tracks included in MVP scope, per Section 21) |

## 5.3 Module C — AI Skill Assessment

| Attribute | Detail |
|---|---|
| **Feature Name** | Multi-Format Skill Assessment |
| **Objective** | Measure both knowledge and practical capability for a selected career/skill area. |
| **User Story** | As a candidate, I want to take an assessment that reflects real job knowledge and problem-solving, not just trivia, so my resulting score means something. |
| **Description** | Assessment engine presents a mix of MCQs, technical/conceptual questions, scenario-based questions, and practical/role-based tasks, drawn from the selected career's skill requirements. |
| **Functional Requirements** | FR1: System shall generate/select an assessment set relevant to the candidate's selected career and skill areas. FR2: System shall support multiple question types (MCQ, technical, conceptual, scenario-based, practical task). FR3: System shall capture free-text/practical responses for AI evaluation, not just multiple-choice selection. FR4: System shall timestamp responses to support later anti-cheating analysis (Section 7). |
| **Inputs** | Candidate's selected career/skill area, question responses (structured and free-text). |
| **Processing** | Question selection/sequencing; response capture; hand-off to AI Grading Engine (Module D / Section 6). |
| **Outputs** | Completed assessment submission ready for grading. |
| **User Interaction** | Start assessment → answer sequential questions (mixed formats) → submit → view results (post-grading). |
| **AI Behavior** | Grading of free-text/practical responses is AI-evaluated (Section 6); question selection may be static (MVP) or adaptive (future) — **MVP defaults to static/curated question sets per career track unless otherwise decided (assumption, flagged).** |
| **Edge Cases** | Candidate abandons assessment mid-way (partial submission handling — Open Question: allow resume vs. restart); network interruption during a timed section. |
| **Error States** | Submission failure; ungraded/stuck submission (should have a retry or support path). |
| **Acceptance Criteria** | AC1: Candidate can complete a full assessment for a supported career track end-to-end. AC2: Mixed question types are presented and responses captured correctly for grading. |
| **Dependencies** | Module B (career/skill selection); feeds Module D (grading). |
| **Priority** | P0 — MVP Critical |

## 5.4 Module D — Advanced Grading System

*(Architecture detailed fully in Section 7; feature-level requirement summarized here.)*

| Attribute | Detail |
|---|---|
| **Feature Name** | AI-Powered Explainable Grading |
| **Objective** | Convert raw assessment/simulation responses into a meaningful, multi-dimension, explainable score. |
| **User Story** | As a candidate, I want to understand why I got my score, not just see a number, so I know what to improve. |
| **Functional Requirements** | FR1: System shall score responses across multiple dimensions (accuracy, reasoning, practical application, etc. — full list Section 7). FR2: System shall generate an overall score, category scores, strengths, weaknesses, and improvement recommendations. FR3: System shall provide a human-readable explanation for each score component. |
| **Inputs** | Assessment/simulation responses, grading rubric per career/skill area. |
| **Processing** | Multi-dimension AI evaluation against rubric; score aggregation and normalization (Section 7). |
| **Outputs** | Overall score, category/skill-level scores, strengths, weaknesses, mistakes, recommendations. |
| **AI Behavior** | Core AI evaluation engine — full behavior, confidence scoring, and hallucination-prevention approach detailed in Section 6 and 7. |
| **Edge Cases** | Ambiguous/partial free-text answers; contradictory signals across dimensions (e.g., correct answer but poor reasoning shown). |
| **Error States** | Grading engine failure/timeout — candidate should see a clear "grading in progress/retry" state, never a silent failure. |
| **Acceptance Criteria** | AC1: Every graded submission returns an explainable breakdown, not just a single number. AC2: Candidate can view which specific responses drove strengths/weaknesses. |
| **Dependencies** | Module C, E (assessment and simulation submissions). |
| **Priority** | P0 — MVP Critical |

## 5.5 Module E — AI Career Simulation

| Attribute | Detail |
|---|---|
| **Feature Name** | Realistic Career Simulation |
| **Objective** | Let candidates experience and be evaluated on realistic role-based scenarios beyond static assessment questions. |
| **User Story** | As a candidate, I want to practice a realistic version of the job (e.g., Software Developer tasks and decisions) so I know if I could actually perform in that role. |
| **Functional Requirements** | FR1: System shall generate a role-specific scenario with tasks, problems, decisions, and (where relevant) deadlines. FR2: System shall capture candidate decisions/responses throughout the simulation. FR3: System shall evaluate performance across decision-making, technical skill, problem-solving, communication, prioritization, time management, and adaptability (per approved Module E scope). FR4: System shall produce a detailed performance report at the end. |
| **Inputs** | Selected career track, candidate decisions/responses during the simulation. |
| **Processing** | Scenario generation/sequencing (Section 8); response capture; hand-off to AI Grading Engine. |
| **Outputs** | Simulation performance report (multi-dimension, explainable). |
| **User Interaction** | Select career simulation → work through scenario (tasks/decisions) → receive performance report. |
| **AI Behavior** | Scenario generation and behavior detailed in Section 8 (Career Simulation Engine); evaluation logic shared with Module D/Section 6. |
| **Edge Cases** | Candidate exits mid-simulation; scenario difficulty mismatch (too easy/hard for stated skill level) — difficulty logic deferred to Section 8. |
| **Error States** | Simulation engine failure mid-scenario — must preserve partial progress where feasible rather than losing all data. |
| **Acceptance Criteria** | AC1: Candidate can complete at least one full simulation for a supported career track at MVP. AC2: Performance report reflects the multiple measured dimensions, not a single pass/fail. |
| **Dependencies** | Module B, D. |
| **Priority** | P0 — MVP Critical (for MVP-scoped career tracks) |

## 5.6 Module F — AI Skill Gap Engine

| Attribute | Detail |
|---|---|
| **Feature Name** | Skill Gap Analysis |
| **Objective** | Identify the delta between a candidate's current demonstrated skills and a target career's requirements. |
| **Functional Requirements** | FR1: System shall compare candidate Skill Graph against target career's required skill set. FR2: System shall classify skills as missing, weak, strong, and assign priority. FR3: System shall update automatically after new assessment/simulation results. |
| **Inputs** | Candidate Skill Graph, career skill requirement template. |
| **Processing** | Delta comparison, priority weighting (e.g., weighting core vs. nice-to-have skills — weighting logic Section 7). |
| **Outputs** | Skill gap report (missing/weak/strong/priority skills). |
| **AI Behavior** | Primarily a comparison/classification engine; may use AI to prioritize which gaps matter most for a given career (Section 6). |
| **Edge Cases** | Candidate has no assessment data yet for the target career (should prompt assessment rather than showing an empty/misleading gap report). |
| **Acceptance Criteria** | AC1: Skill gap report updates after each new assessment/simulation. AC2: Report clearly separates missing vs. weak vs. strong skills. |
| **Dependencies** | Module C, D, E (data sources); Module B (target career). |
| **Priority** | P0 — MVP Critical |

## 5.7 Module G — Personalized Learning / Improvement

| Attribute | Detail |
|---|---|
| **Feature Name** | Personalized Improvement Recommendations |
| **Objective** | Turn skill-gap output into specific, actionable next steps. |
| **Functional Requirements** | FR1: System shall recommend topics, practice tasks, or simulations based on identified priority gaps. FR2: Recommendations shall be re-generated after each re-assessment. |
| **Inputs** | Skill gap report (Module F). |
| **Processing** | Map priority gaps to available practice content/simulations/topics. |
| **Outputs** | Personalized recommendation list. |
| **AI Behavior** | Recommendation logic detailed in Section 6 (Recommendation Engine); must avoid generic, one-size-fits-all suggestions (P6). |
| **Edge Cases** | No available content maps to an identified gap (system should flag this rather than silently omitting the gap). |
| **Acceptance Criteria** | AC1: Recommendations reference the specific gap(s) driving them (explainability). |
| **Dependencies** | Module F. |
| **Priority** | P1 — Important (MVP includes basic version per M8; deeper personalization is post-MVP) |

## 5.8 Module H — Gamification

| Attribute | Detail |
|---|---|
| **Feature Name** | XP, Levels, Achievements, Progress |
| **Objective** | Increase engagement and motivation through progress visualization and rewards. |
| **Functional Requirements** | FR1: System shall award XP for completed assessments/simulations. FR2: System shall track levels and career-readiness progression. FR3: System shall support achievements/badges for milestones. FR4: Leaderboards — **Open Question**: global, career-track-specific, or opt-in only (privacy implications, Section 17). |
| **AI Behavior** | None (rules-based system, not AI-driven). |
| **Edge Cases** | Gamification incentivizing gaming/cheating behavior (e.g., rapid low-effort re-attempts for XP) — ties to Section 7 anti-cheating and Section 24 risk. |
| **Acceptance Criteria** | AC1: XP/levels update correctly after each completed activity. |
| **Dependencies** | Modules C, D, E. |
| **Priority** | P2 — Post-MVP candidate (per Section 2.4 M-list) |

## 5.9 Module I — HR Smart Recruiter

*(Full recruiter experience detailed in Section 9; feature-level summary here.)*

| Attribute | Detail |
|---|---|
| **Feature Name** | Job Creation & Requirement Definition |
| **Objective** | Let recruiters define structured, matchable job requirements. |
| **Functional Requirements** | FR1: System shall allow company profile creation. FR2: System shall allow job posting creation with required skills, preferred skills, experience requirements, and assessment criteria. FR3: System shall structure job requirements to be directly consumable by the AI Matching Engine (shared Skill Intelligence Layer, Section 4.3). |
| **Inputs** | Company info, job title/description, required/preferred skills, experience level, assessment criteria. |
| **Outputs** | Structured job posting ready for candidate matching. |
| **AI Behavior** | Optional AI-assisted extraction of structured skill requirements from a free-text job description — **Future/Should-Have**, not MVP-committed (Section 21 to confirm). |
| **Edge Cases** | Vague or incomplete job requirements reducing match quality — system should flag missing critical fields before publishing. |
| **Acceptance Criteria** | AC1: Recruiter can create a complete job posting with structured skill requirements. AC2: Published jobs are queryable by the matching engine. |
| **Dependencies** | Module A (recruiter auth/profile). |
| **Priority** | P0 — MVP Critical |

## 5.10 Module J — AI Candidate Matching

| Attribute | Detail |
|---|---|
| **Feature Name** | Explainable Candidate-Job Matching |
| **Objective** | Score candidates against job requirements using demonstrated skill data, with a full explanation. |
| **Functional Requirements** | FR1: System shall compute an overall match score plus per-dimension sub-scores (e.g., technical skills, problem-solving, communication, experience). FR2: System shall list missing/weak skills and strong-match areas per candidate-job pair. FR3: System shall explain how each score was generated. |
| **Inputs** | Candidate Skill Graph/profile, job requirements. |
| **Processing** | Matching algorithm (Section 6) comparing structured skill data against job requirements; weighting logic (Section 7). |
| **Outputs** | Match score breakdown (as illustrated in the approved product context, e.g., Overall Match: 87%, with sub-scores and missing/strong skill lists). |
| **AI Behavior** | Full matching engine behavior detailed in Section 6; must not use protected attributes (N3); must remain explainable (P2, P8). |
| **Edge Cases** | Candidate has incomplete assessment/simulation data (match score should reflect and disclose lower confidence, not fabricate a high-confidence score). |
| **Acceptance Criteria** | AC1: Every match score includes a per-dimension breakdown and missing/strong-skill lists. AC2: No protected attributes are used as matching inputs (verifiable in system design). |
| **Dependencies** | Shared Skill Intelligence Layer (Section 4.3); Module I. |
| **Priority** | P0 — MVP Critical |

## 5.11 Module K — HR Analytics

| Attribute | Detail |
|---|---|
| **Feature Name** | Recruitment Pipeline & Skill Analytics |
| **Objective** | Give recruiters visibility into pipeline health and candidate pool characteristics. |
| **Functional Requirements** | FR1: System shall show candidate pipeline stage counts. FR2: System shall show assessment/match score distributions across the candidate pool for a job. FR3: System shall show basic hiring funnel metrics (applied → shortlisted → interviewed → hired). |
| **AI Behavior** | Primarily descriptive analytics (not AI-generative) at MVP; predictive analytics (Section 2.5, L4) is a long-term objective, not MVP. |
| **Acceptance Criteria** | AC1: Recruiter can view funnel counts and score distributions for any active job posting. |
| **Dependencies** | Modules I, J. |
| **Priority** | P2 — Post-MVP candidate |

---

**SECTION 5 STATUS: Draft — Pending Review**

---

# 6. AI SYSTEM REQUIREMENTS

For each AI system: Input → Processing → AI Logic → Output → User Action, plus explainability, reliability, hallucination prevention, human override, confidence scores, evaluation criteria, and data requirements.

## 6.1 AI Assessment Engine

| Aspect | Detail |
|---|---|
| Input | Candidate's selected career/skill area; question bank/content library. |
| Processing | Select/sequence questions relevant to career and skill level. |
| AI Logic | Rules-based/curated selection at MVP (assumption, flagged in 5.3); adaptive difficulty is a future enhancement. |
| Output | Assembled assessment ready for candidate response. |
| User Action | Candidate answers questions. |
| Explainability | Question relevance should be traceable to the career/skill requirement it tests. |
| Reliability | Content library must be curated/reviewed (Admin, Module A5) to avoid low-quality or outdated questions. |
| Hallucination Prevention | If questions are AI-generated (vs. curated) in future phases, generated content must be validated against a rubric before use — **not enabled at MVP** given this risk. |
| Human Override | Admin can edit/remove/replace questions. |
| Confidence Scores | N/A at question-selection stage (applies more to grading, below). |
| Data Requirements | Structured question bank per career track, tagged by skill/dimension. |

## 6.2 AI Grading Engine

| Aspect | Detail |
|---|---|
| Input | Candidate assessment/simulation responses (structured + free-text), rubric per career/skill area. |
| Processing | Multi-dimension evaluation against rubric (Section 7 defines dimensions and weighting). |
| AI Logic | LLM/AI-assisted evaluation of free-text and practical responses against defined rubric criteria; structured (MCQ-type) responses graded deterministically where possible, blended with AI-graded components for overall score. |
| Output | Overall score, category scores, strengths, weaknesses, mistakes, recommendations, explanation text. |
| User Action | Candidate reviews score and explanation; may trigger re-assessment or improvement plan. |
| Explainability | **Mandatory** — every score must include a rationale tied to specific responses (P2). |
| Reliability | Grading consistency across repeated/similar submissions should be monitored (Section 19 observability); flagged as a risk area (Section 24) given no existing validation data (A4). |
| Hallucination Prevention | Grading rationale must reference actual submitted content, not fabricated specifics; rubric-anchored scoring reduces free-form hallucination risk. |
| Human Override | Candidates/recruiters can flag a score for review; Admin can review and adjust (Section 17 access control). |
| Confidence Scores | System should surface a confidence indicator per graded submission, especially for ambiguous free-text answers. |
| Data Requirements | Rubric definitions per career/skill/dimension (Section 7); historical graded examples for calibration — **Data Required** at launch (none exist yet), so initial rubric calibration relies on expert-defined criteria rather than historical data. |

## 6.3 Skill Gap Engine

| Aspect | Detail |
|---|---|
| Input | Candidate Skill Graph, target career skill requirement template. |
| Processing | Delta comparison, priority weighting. |
| AI Logic | Primarily rules/weighting-based rather than generative; "AI" here refers to weighted prioritization logic, not free-form generation — reduces hallucination risk by design. |
| Output | Missing/weak/strong/priority skill classification. |
| Explainability | Each classification should reference the specific score(s) driving it. |
| Human Override | N/A generally (deterministic logic), though Admin can adjust career skill-requirement templates. |
| Data Requirements | Career skill-requirement templates per supported track (must be defined/maintained — content dependency, ties to Section 24 risk on content maintenance). |

## 6.4 Career Recommendation Engine

| Aspect | Detail |
|---|---|
| Input | Candidate profile (education, interests, goals), optionally existing Skill Graph. |
| Processing | Match profile signals to career track characteristics. |
| AI Logic | MVP: rules-based matching on stated interests/background (assumption — full AI-driven recommendation is a **Should-Have**, not committed MVP mechanism, pending Section 21). |
| Output | Ranked list of suggested career tracks. |
| Explainability | Recommendation should state which profile signals drove the suggestion. |
| Human Override | Candidate can freely browse/select any track regardless of recommendation. |
| Data Requirements | Career track metadata/tags aligned to common interest/background signals. |

## 6.5 Career Simulation Engine

*(Full detail in Section 8.)*

| Aspect | Detail |
|---|---|
| Input | Selected career track, difficulty/level context. |
| Processing | Scenario assembly from a structured content library of tasks/decisions/problems per role. |
| AI Logic | Scenario sequencing and (optionally) dynamic branching based on candidate decisions — dynamic branching is a **Should-Have/Future** sophistication level; MVP may use a more linear/curated scenario structure (assumption, flagged). |
| Output | Scenario tasks/prompts delivered to candidate; candidate decisions captured for grading. |
| Explainability | Post-simulation report must tie evaluation to specific decisions made. |
| Human Override | Admin curates/edits simulation content library. |
| Data Requirements | Structured simulation scenario library per career track — a significant content-creation dependency (flagged as a build risk in Section 24). |

## 6.6 AI Feedback Engine

| Aspect | Detail |
|---|---|
| Input | Grading output (Module D/6.2), skill gap output (6.3). |
| Processing | Synthesize scores + gaps into human-readable feedback and recommendations. |
| AI Logic | Template-guided natural-language generation anchored to the specific rubric/gap data (to reduce hallucination — generation is constrained to summarizing actual computed data, not inventing new claims). |
| Output | Readable feedback text, prioritized recommendations. |
| Explainability | Inherent — this engine's entire purpose is explanation; must avoid vague boilerplate feedback. |
| Human Override | Candidate/recruiter can flag unhelpful/unclear feedback for Admin review. |

## 6.7 Candidate Matching Engine

*(Feature-level requirement in 5.10; engine detail here.)*

| Aspect | Detail |
|---|---|
| Input | Candidate Skill Graph + profile, job requirements. |
| Processing | Weighted comparison across matching dimensions (technical skills, problem-solving, communication, experience — consistent with the approved example in the product context). |
| AI Logic | Weighted scoring algorithm (Section 7 defines weighting approach); explicitly excludes protected attributes as inputs (N3) — this must be enforced at the data-schema level, not just policy level. |
| Output | Overall match %, per-dimension sub-scores, missing/weak skills, strong-match areas, explanation. |
| Explainability | **Mandatory**, matches the illustrative example already approved in the product context (Overall Match: 87%, sub-scores, missing/strong skills). |
| Reliability | Match accuracy cannot be validated without real hiring-outcome data yet (A4) — flagged as a long-term validation objective (L3), not an MVP claim. |
| Human Override | Recruiter retains full discretion to shortlist/reject regardless of match score (P7, N2). |
| Confidence Scores | Match score should reflect data completeness (e.g., lower confidence if candidate has limited assessment/simulation history). |
| Data Requirements | Structured job requirement schema; candidate Skill Graph (shared layer, Section 4.3). |

## 6.8 HR Recruitment Intelligence

| Aspect | Detail |
|---|---|
| Input | Aggregated match scores, pipeline stage data (Module K). |
| Processing | Descriptive aggregation at MVP; predictive modeling is a long-term objective (L4), not MVP. |
| AI Logic | MVP: statistical aggregation only, no predictive AI claims. |
| Output | Pipeline/funnel views, score distributions. |
| Explainability | Aggregation methodology should be transparent (e.g., clear funnel-stage definitions). |

## 6.9 Recommendation Engine (Personalized Learning)

*(Feature-level requirement in 5.7.)*

| Aspect | Detail |
|---|---|
| Input | Skill gap report, available practice/content/simulation library. |
| Processing | Map priority gaps to available content. |
| AI Logic | Matching/ranking logic against content library metadata — not generative content creation at MVP (content is curated, not AI-authored, reducing hallucination risk). |
| Output | Prioritized recommendation list. |
| Explainability | Each recommendation ties to a specific identified gap. |

### 6.10 Cross-Cutting AI Requirements (All Engines)

| Requirement | Detail |
|---|---|
| Explainability | Every AI output affecting a user decision must include a "why" — no unexplained scores anywhere in the product (P2). |
| Reliability | All engines require monitoring for consistency/drift (Section 19); no reliability benchmarks exist yet (A4) — **Data Required** for any claimed accuracy/reliability figure. |
| Hallucination Prevention | AI outputs must be anchored to actual submitted candidate data and defined rubrics/templates — free-form generation without a factual anchor is avoided by design across all engines above. |
| Human Override | Every AI-driven decision affecting a candidate or hiring outcome must have a human review/override path (P7, P8). |
| Confidence Scores | Grading and matching engines must surface confidence, particularly where input data is sparse. |
| Evaluation Criteria | Formal evaluation methodology (e.g., rubric-alignment testing, human-expert spot checks) is a **Data Required / Founder Validation** item — to be defined before/during MVP build, not fabricated here. |
| Data Requirements | Structured content libraries (questions, rubrics, simulation scenarios, career skill templates) are a foundational, non-trivial content dependency across nearly every AI engine — flagged prominently in Section 24 (Risks). |

---

**SECTION 6 STATUS: Draft — Pending Review**

---

# 7. ADVANCED GRADING SYSTEM

## 7.1 Scoring Dimensions

| Dimension | Applies To | Description |
|---|---|---|
| Accuracy | Assessment | Correctness of factual/technical answers. |
| Technical Correctness | Assessment, Simulation | Soundness of technical approach/solution. |
| Problem-Solving Ability | Assessment, Simulation | Quality of approach to open-ended/scenario problems. |
| Reasoning | Assessment, Simulation | Clarity and validity of justification given. |
| Practical Application | Simulation (primarily) | Ability to apply knowledge to a realistic task. |
| Communication | Simulation (primarily) | Clarity of explanations/decisions communicated during simulation. |
| Completeness | Assessment, Simulation | Whether the response fully addresses the question/task. |
| Efficiency | Simulation (primarily) | Time/resource-consciousness of approach, where relevant to the role. |
| Role-Specific Competency | Simulation (primarily) | Fit of the response to the specific career role's expectations. |

## 7.2 Weighting System

> Exact numeric weights per dimension are **Data Required — Founder Validation** and should ideally be set with subject-matter-expert input per career track, not fabricated generically here. The structure below defines *how* weighting works, without asserting unvalidated numbers.

**Illustrative formula structure (weights are placeholders, not final):**

```
Overall Score = Σ (Dimension Score × Dimension Weight)

where:
  Σ Dimension Weight = 1.0 (normalized)
  Dimension Weights may vary by career track
  (e.g., "Communication" may weight higher for
  Marketing/HR roles than for a narrow technical task)
```

Role-specific weighting (P5, Section 2.3) means the *same* dimension list can carry different weights per career track — this must be configurable, not hardcoded, in the data model (Section 15).

## 7.3 Skill-Level Scoring

Each individual skill within a career's required skill set receives its own sub-score (0–100 or equivalent scale — exact scale **Data Required**), aggregated into category scores, which roll up into the Overall Score.

```
Individual Skill Score → Category Score (group of related skills) → Overall Score
```

## 7.4 Simulation Scoring vs. Assessment Scoring

| | Assessment Scoring | Simulation Scoring |
|---|---|---|
| Primary Focus | Knowledge + structured problem-solving | Practical application under realistic conditions |
| Dimensions Weighted Toward | Accuracy, Technical Correctness, Reasoning | Practical Application, Communication, Efficiency, Role-Specific Competency |
| Grading Trigger | On assessment submission | On simulation completion |
| Feeds | Skill Graph, Skill Gap Engine | Skill Graph, Skill Gap Engine, Career Readiness Score |

## 7.5 AI-Generated Feedback & Confidence

Every score is paired with: (1) a natural-language explanation anchored to specific responses, and (2) a confidence indicator reflecting data sufficiency (e.g., a single short assessment yields lower confidence than assessment + simulation combined).

## 7.6 Partial Credit & Rubric-Based Evaluation

Free-text and practical responses are graded against a defined rubric per question/task (not binary right/wrong), allowing partial credit for partially correct reasoning or incomplete-but-valid approaches. Rubrics are defined per career/skill/task and maintained by Admin (content dependency, Section 24).

## 7.7 Anti-Cheating Considerations

| Concern | Mitigation Approach (MVP-level) |
|---|---|
| Copy-pasted or externally-sourced answers | Response-time analysis (unusually fast complete answers flagged); **not** claiming full plagiarism detection at MVP — **Data Required** for any such capability claim. |
| Repeated re-attempts to "farm" a good score | Re-assessment cooldown period — **Open Question**, exact cooldown duration **Data Required — Founder Validation**. |
| Using AI tools to generate assessment answers | Acknowledged as a real risk (Section 24); MVP-level mitigation is limited (e.g., scenario/practical framing that's harder to answer via generic AI tools); full detection tooling is a **Future** investment, not promised at MVP. |

## 7.8 Score Normalization

Scores across different question/task difficulty levels and career tracks must be normalized to a common scale (e.g., 0–100) so that Career Readiness Scores are comparable across users — exact normalization methodology is an implementation detail to finalize during build, not fabricated with false precision here.

## 7.9 Final Career Readiness Score

```
Career Readiness Score =
    f( Assessment Scores, Simulation Scores, Skill Gap Coverage, Recency of Data )

Where:
- Recency matters: stale assessment data (e.g., taken long ago) may be
  weighted lower than recent performance — exact decay function
  is Data Required / Founder Validation, not fabricated here.
```

The Career Readiness Score is the single, explainable summary metric shown to candidates (U8) and optionally referenced by recruiters as one input among several (never the sole factor, per P3/P7).

---

**SECTION 7 STATUS: Draft — Pending Review**

---

# 8. CAREER SIMULATION ENGINE

## 8.1 Simulation Generation & Scenario Generation

Each simulation is built from a structured content library per career track containing: a scenario premise, a sequence of tasks/decisions, associated deadlines/constraints (where role-realistic), and a grading rubric per decision point.

## 8.2 Task Generation & Difficulty

| Aspect | MVP Approach | Future Enhancement |
|---|---|---|
| Task Source | Curated, Admin-maintained scenario library | AI-assisted scenario generation (flagged: requires strong hallucination controls before use) |
| Difficulty | Fixed per scenario (e.g., "entry-level Software Developer scenario") | Adaptive difficulty based on candidate's Skill Graph |
| Branching | Primarily linear with limited decision points (assumption, flagged — full dynamic branching is a Should-Have/Future sophistication) | Fully dynamic, decision-driven branching scenarios |

## 8.3 Role-Specific Scenarios (Examples, Consistent with Approved Context)

| Career Track | Example Scenario Elements |
|---|---|
| Software Developer | Bug triage under a deadline, code review decision, prioritizing feature vs. tech debt |
| Data Analyst | Ambiguous dataset investigation, stakeholder question requiring data-backed answer |
| Marketing | Campaign prioritization under budget constraint, messaging decision for a target segment |
| Finance | Budget variance investigation, resource allocation trade-off |
| HR | Handling a conflicting stakeholder request, policy application scenario |
| Product Management | Feature prioritization trade-off, cross-functional stakeholder conflict |
| Cybersecurity | Incident triage under time pressure, risk prioritization decision |
| Business (general) | Cross-functional prioritization and resource trade-off scenario |

*(Exact scenario content for each is a content-development task, not defined line-by-line in this PRD.)*

## 8.4 User Decisions & AI Evaluation

Candidate decisions at each scenario checkpoint are captured and evaluated against the dimensions in Section 7.1 (weighted toward Practical Application, Communication, Efficiency, Role-Specific Competency, per 7.4).

## 8.5 Time-Based Challenges

Where role-realistic (e.g., "you have limited time to respond to this incident"), simulations may include a soft or hard time constraint. Whether time pressure is simulated (e.g., a countdown) or purely narrative (a stated deadline within an untimed UI) is an **Open Question** to resolve during UX design (Section 13).

## 8.6 Performance Scoring & Feedback

Performance is scored per decision point and aggregated into an overall simulation score using the same weighting framework as Section 7, then combined into the candidate's Skill Graph and Career Readiness Score (Section 7.9).

## 8.7 Simulation Report

The end-of-simulation report includes: overall performance score, per-dimension breakdown, key decisions and their evaluation, strengths, weaknesses, and links to relevant improvement recommendations (Module G).

---

**SECTION 8 STATUS: Draft — Pending Review**

---

# 9. HR SMART RECRUITER

## 9.1 HR Dashboard

Central view for a recruiter: active job postings, pipeline summary per job, recent candidate matches, and quick access to shortlisted candidates.

## 9.2 Job Creation & Requirement Extraction

Structured job creation (5.9) with required/preferred skills, experience level, and assessment criteria. AI-assisted extraction of structured requirements from a pasted job description is a **Should-Have**, not MVP-committed (consistent with 5.9).

## 9.3 Candidate Discovery

Recruiters can search/filter the candidate pool by skill, career track, experience, and match score against a specific job.

## 9.4 AI Candidate Matching & Ranking

Per Section 6.7/5.10 — explainable match scoring, ranked list per job posting.

## 9.5 Candidate Comparison

Side-by-side comparison view showing the same scoring dimensions across 2+ candidates for a given job (supports U14, U20).

## 9.6 Skill Verification

"Verified" in this context means scores are derived from platform-administered assessments/simulations (not self-reported) — this is the platform's definition of skill verification at MVP; deeper anti-cheating/proctoring verification is a **Future** enhancement (Section 7.7, 24).

## 9.7 Assessment & Simulation Reports (Recruiter View)

Recruiters can drill into a specific candidate's assessment and simulation results — same explainable report structure the candidate sees (Section 7, 8), surfaced with recruiter-appropriate framing.

## 9.8 Shortlisting & Recruitment Pipeline

Recruiters move candidates through pipeline stages (e.g., Applied → Reviewed → Shortlisted → Interview → Offer — exact stage set **Data Required/Founder Validation**, a reasonable default is proposed here for MVP purposes only).

## 9.9 Analytics

Per Module K / Section 6.8 — descriptive pipeline and score-distribution analytics at MVP; predictive analytics is long-term (L4).

---

**SECTION 9 STATUS: Draft — Pending Review**

---

# 10. USER JOURNEYS

## 10.1 New Candidate

```
Discover SkillForge AI → Register → Complete Profile → Select Target Career
→ Take Initial Assessment → View Skill Gap Report → View Career Roadmap
→ (Optional) Start Simulation → View Combined Career Readiness Score
```

## 10.2 Existing Candidate (Returning)

```
Log In → View Dashboard (progress, career readiness score, recommendations)
→ Continue Improvement Plan (practice / new simulation / re-assessment)
```

## 10.3 Candidate Preparing for a Career

```
Select/Confirm Target Career → Review Required Skills → Review Current Skill
Gap → Follow Personalized Improvement Plan → Practice Recommended Areas
```

## 10.4 Candidate Completing Assessment

```
Start Assessment → Answer Mixed-Format Questions → Submit → AI Grading
(async or near-real-time) → View Explainable Score Report → View Updated
Skill Graph
```

## 10.5 Candidate Completing Simulation

```
Select Career Simulation → Read Scenario Premise → Work Through Tasks/
Decisions → Submit Final Decisions → AI Grading → View Simulation Report
→ View Updated Career Readiness Score
```

## 10.6 Candidate Improving Skills

```
View Skill Gap Report → View Personalized Recommendations → Complete
Recommended Practice/Topics → Trigger Re-assessment → Compare New Score
vs. Previous → Updated Skill Graph
```

## 10.7 Candidate Applying for a Job

```
Browse/View Matched Jobs → View Job Requirements → Review Own Match
Score for That Job (if available) → Apply → Application Status Visible
in Candidate Dashboard
```

## 10.8 Recruiter Creating a Job

```
Log In (HR) → (First time: Create Company Profile) → Create Job Posting
→ Define Required/Preferred Skills, Experience, Assessment Criteria
→ Publish Job → Job Becomes Queryable by Matching Engine
```

## 10.9 Recruiter Reviewing Candidates

```
Open Job Posting → View Ranked Candidate List (Match Scores) → Open
Candidate Profile → Review Assessment/Simulation Reports → Compare
Candidates (2+) → Note/Tag Candidate
```

## 10.10 Recruiter Shortlisting a Candidate

```
Review Candidate → Confirm Match Score & Evidence → Move Candidate to
"Shortlisted" Pipeline Stage → (Optional) Share with Hiring Manager
→ Proceed to Interview Stage (outside or within platform — Open Question)
```

---

**SECTION 10 STATUS: Draft — Pending Review**

---

# 11. WORKFLOW DIAGRAMS

## 11.1 Candidate Core Loop (Full Workflow)

```
START
  ↓
Registration
  ↓
Profile Setup
  ↓
Career Interest Selection
  ↓
Initial Skill Assessment
  ↓
Skill Analysis (AI Grading)
  ↓
Skill Gap Detection
  ↓
Career Recommendation / Roadmap
  ↓
Career Simulation
  ↓
AI Grading (Simulation)
  ↓
Performance Report
  ↓
Personalized Improvement Plan
  ↓
Practice / Learning
  ↓
Re-assessment
  ↓
DECISION: Skill Score Improved?
 ↙ YES              ↘ NO
Career Readiness     Return to Personalized
Profile Updated      Improvement Plan
 ↓                        ↓
Job Matching        (loop back to Practice/Learning)
 ↓
Application
 ↓
END (feeds into HR Workflow, 11.2)
```

## 11.2 HR Core Loop (Full Workflow)

```
START
  ↓
HR Registration
  ↓
Company Profile
  ↓
Create Job
  ↓
Define Job Requirements
  ↓
DECISION: Requirements Complete/Valid?
 ↙ NO                    ↘ YES
Prompt for Missing        AI Job Analysis
Fields                     ↓
 ↓ (loop back)        Candidate Pool Query
                           ↓
                      AI Candidate Matching
                           ↓
                      Candidate Ranking
                           ↓
                      Candidate Profile Analysis
                           ↓
                      Assessment Review
                           ↓
                      Simulation Review
                           ↓
                      DECISION: Candidate Meets Bar?
                       ↙ YES              ↘ NO
                      Shortlist            Reject / Keep in Pool
                       ↓
                      Interview / Hiring Process (Human Decision, P7)
                       ↓
                      END
```

## 11.3 AI Grading Sub-Workflow

```
START (Assessment or Simulation Submitted)
  ↓
Parse Responses (structured + free-text)
  ↓
Apply Rubric per Dimension (Section 7.1)
  ↓
DECISION: Response Type?
 ↙ Structured (MCQ)     ↘ Free-text / Practical
Deterministic Scoring     AI-Assisted Rubric Evaluation
 ↓                              ↓
        Aggregate Dimension Scores (Weighted, Section 7.2)
                    ↓
        Generate Explanation Text
                    ↓
        Assign Confidence Score
                    ↓
        Update Skill Graph
                    ↓
                  END
```

## 11.4 Candidate Matching Sub-Workflow

```
START (Recruiter Views Job's Candidate Pool)
  ↓
Pull Candidate Skill Graphs (Shared Layer, 4.3)
  ↓
Compare Against Job Requirements (Per Dimension)
  ↓
DECISION: Sufficient Candidate Data?
 ↙ NO                         ↘ YES
Flag Lower Confidence Score    Compute Full-Confidence Match Score
 ↓                                   ↓
        Generate Per-Dimension Breakdown + Missing/Strong Skills
                    ↓
        Rank Candidates for Recruiter View
                    ↓
                  END
```

---

**SECTION 11 STATUS: Draft — Pending Review**

---

# 12. INFORMATION ARCHITECTURE

## 12.1 Candidate-Side Navigation

```
Candidate Dashboard
├── Career Section
│   ├── Explore Careers
│   ├── My Target Career(s)
│   └── Career Roadmap
├── Assessment Section
│   ├── Available Assessments
│   ├── Assessment History
│   └── Score Reports
├── Simulation Section
│   ├── Available Simulations
│   ├── Simulation History
│   └── Simulation Reports
├── Skill Profile
│   ├── Skill Graph
│   ├── Skill Gap Report
│   └── Career Readiness Score
├── Progress
│   ├── XP / Levels / Achievements (Module H)
│   └── Score History Over Time
├── Jobs
│   ├── Matched Jobs
│   └── My Applications
└── Settings
    ├── Profile
    ├── Account
    └── Privacy (Section 17)
```

## 12.2 HR-Side Navigation

```
HR Dashboard
├── Company Profile
├── Job Postings
│   ├── Create Job
│   ├── Active Jobs
│   └── Closed Jobs
├── Candidate Management
│   ├── Candidate Pool (per job)
│   ├── Ranked Candidates
│   ├── Candidate Profile View
│   └── Comparison View
├── Pipeline
│   ├── Shortlisted
│   ├── Interview Stage
│   └── Hired / Rejected
├── Analytics (Module K)
│   ├── Pipeline Funnel
│   └── Score Distributions
└── Settings
    ├── Company/Team
    └── Account
```

## 12.3 Admin Navigation (Platform-Level Only, per 3.5)

```
Admin Console
├── Content Management (Career Tracks, Assessments, Simulations, Rubrics)
├── Integrity / Moderation (Flagged Accounts, Cheating Signals)
├── User & Role Management
└── Platform Configuration
```

---

**SECTION 12 STATUS: Draft — Pending Review**

---

# 13. UI / UX REQUIREMENTS

*(Major screens summarized; full visual design deferred to design phase, not fabricated here.)*

| Screen | Purpose | Key Components | Empty State | Loading State | Error State | Success State |
|---|---|---|---|---|---|---|
| Candidate Dashboard | Central hub for progress and next actions | Career readiness score, recommended next action, recent activity | "Complete your first assessment to get started" prompt | Skeleton loader for score widgets | "Unable to load dashboard — retry" | N/A (persistent view) |
| Assessment Screen | Deliver and capture assessment responses | Question display, answer input (varies by type), progress indicator, timer (if applicable) | N/A (always has content once started) | "Preparing your assessment…" | Submission failure retry prompt | "Assessment submitted — grading in progress" |
| Score Report Screen | Show explainable grading results | Overall score, dimension breakdown chart, strengths/weaknesses, explanation text, recommendations | N/A | "Grading your responses…" | "Grading failed — retry / contact support" | Full report displayed with clear next-step CTA |
| Simulation Screen | Deliver realistic scenario tasks | Scenario narrative, task/decision prompts, decision input, (optional) time indicator | N/A | "Loading scenario…" | Partial-progress recovery prompt on failure | "Simulation complete — view your report" |
| Skill Gap Report Screen | Show gap analysis vs. target career | Missing/weak/strong/priority skill lists, links to recommendations | "Select a target career and complete an assessment to see your gap report" | Skeleton loader | "Unable to load gap report" | N/A |
| HR Job Creation Screen | Structured job posting creation | Job fields, required/preferred skill selectors, experience/assessment criteria fields | N/A (form) | N/A | Validation errors per required field | "Job published" confirmation |
| Candidate Ranking Screen (HR) | Ranked candidate list per job | Match score, quick-view dimension summary, filter/sort controls | "No candidates match this job yet" | Skeleton loader for list | "Unable to load candidates — retry" | N/A |
| Candidate Comparison Screen (HR) | Side-by-side candidate comparison | Aligned dimension rows across 2+ candidates | "Select at least 2 candidates to compare" | Skeleton loader | N/A | N/A |
| HR Analytics Screen | Pipeline/funnel visibility | Funnel chart, score distribution chart | "No active jobs yet" | Skeleton loader for charts | "Unable to load analytics" | N/A |

**Responsive Behavior:** All screens must support both desktop (recruiter-heavy usage likely desktop-first) and mobile (candidate usage likely mobile-inclusive) — exact platform priority is an **Open Question** for Section 21 (MVP Scope), since building fully responsive experiences for every screen at MVP has real cost/time trade-offs.

---

**SECTION 13 STATUS: Draft — Pending Review**

---

# 14. DATA REQUIREMENTS

| Data Category | Examples | Sensitivity |
|---|---|---|
| User Data | Name, email, role, auth credentials | High (PII) |
| Skill Data | Skill Graph entries, skill scores over time | Medium (behavioral/performance) |
| Assessment Data | Assessment attempts, timestamps, question sets used | Medium |
| Question Data | Question content, rubric tags, career/skill mapping | Low (content, not personal) |
| Simulation Data | Scenario content, candidate decisions during simulation | Medium |
| Score Data | Overall/category/dimension scores, confidence values | Medium |
| Career Data | Career track definitions, required skill templates | Low (content) |
| Job Data | Job postings, required/preferred skills, experience criteria | Low–Medium (company-confidential in some fields) |
| Candidate Data (HR-facing) | Candidate profile, Skill Graph, application status, as visible to recruiters | High (PII + performance data) |
| Recruiter Data | Recruiter profile, company affiliation | Medium |
| Analytics Data | Aggregated pipeline/funnel metrics, score distributions | Low (aggregated) — must ensure aggregation prevents re-identification of individuals where required by policy (Section 17) |

All PII and performance data handling must comply with Section 17 (Security & Privacy). No specific data-residency or regulatory regime (e.g., GDPR, India's DPDP Act) is assumed here since target geography (A3) is unresolved — **Open Question**, carried forward.

---

**SECTION 14 STATUS: Draft — Pending Review**

---

# 15. DATABASE / ENTITY REQUIREMENTS

## 15.1 Core Entities & Relationships (Logical Model)

```
User (1) ──< Profile (1)
User (1) ──< Role [Candidate | Recruiter | Admin]

Profile (Candidate) (1) ──< Skill (many, via SkillGraph junction)
Profile (Candidate) (1) ──< Assessment (many)
Profile (Candidate) (1) ──< Simulation (many)
Profile (Candidate) (1) ──< SkillGap (many)
Profile (Candidate) (1) ──< LearningRecommendation (many)
Profile (Candidate) (1) ──< Application (many)
Profile (Candidate) (1) ──< Achievement (many)
Profile (Candidate) (1) ──< XP (1, aggregate)

Career (1) ──< Skill (many, required-skill mapping)
Career (1) ──< Assessment (many, template/instance relationship)
Career (1) ──< Simulation (many, template relationship)

Assessment (1) ──< Question (many)
Question (1) ──< Answer (many, candidate responses)
Answer (1) ──< Score (1)

Simulation (1) ──< Scenario (1)
Scenario (1) ──< Task (many)
Task (1) ──< Performance (1, candidate's evaluated performance on that task)

SkillGap (many) ──> Skill (references)
SkillGap (many) ──> LearningRecommendation (drives)

Company (1) ──< Recruiter (many, via Profile)
Company (1) ──< Job (many)
Job (1) ──< CandidateMatch (many)
CandidateMatch (many) ──> Profile (Candidate) (references)
CandidateMatch (many) ──> Job (references)

Job (1) ──< Application (many)
Application (many) ──> Profile (Candidate) (references)
Application (1) ──< Interview (0 or many)

Leaderboard (1) ──< Profile (Candidate) (many, ranked entries)
```

## 15.2 Entity Notes

| Entity | Key Attributes (Illustrative) | Notes |
|---|---|---|
| User | id, email, password_hash, role | Auth root entity |
| Profile | user_id, education, experience, interests, goals | Split candidate/recruiter fields at schema level |
| Skill | id, name, category, career_ids (many-to-many) | Master skill taxonomy |
| Career | id, name, required_skills, description | Master career-track taxonomy |
| Assessment | id, career_id, question_ids, candidate_id, submitted_at | An instance of a candidate taking an assessment |
| Question | id, type, content, rubric_id, skill_tags | Content library entity |
| Answer | id, question_id, response_content, submitted_at | Raw candidate response |
| Score | id, answer_id or simulation_task_id, dimension_scores, overall_score, explanation, confidence | Central grading output entity — **shared** between candidate and HR views (P4) |
| Simulation | id, career_id, candidate_id, scenario_id, completed_at | An instance of a candidate completing a simulation |
| Scenario | id, career_id, premise, task_ids | Content library entity |
| Task | id, scenario_id, prompt, rubric_id | Individual decision point within a scenario |
| Performance | id, task_id, candidate_id, score_id | Evaluated result for a specific task |
| SkillGap | id, candidate_id, career_id, missing_skills, weak_skills, strong_skills, priority_skills | Recomputed after each new Score |
| LearningRecommendation | id, candidate_id, skill_gap_id, recommended_content_ids | Generated from SkillGap |
| Company | id, name, industry | HR-side root entity |
| Job | id, company_id, required_skills, preferred_skills, experience_level, assessment_criteria | Structured for matching engine consumption |
| Application | id, job_id, candidate_id, status, applied_at | Candidate ↔ Job link |
| CandidateMatch | id, job_id, candidate_id, overall_match, dimension_scores, missing_skills, strong_skills, confidence | Output of Section 6.7 matching engine |
| Recruiter | user_id, company_id | Specialization of Profile for HR role |
| Interview | id, application_id, stage, scheduled_at, outcome | Optional — exact interview-management scope is **Open Question** for Section 21 |
| Achievement | id, candidate_id, type, earned_at | Module H |
| XP | candidate_id, total_xp, level | Module H |
| Leaderboard | id, scope (global/career-track), entries | Module H — visibility/opt-in rules per Section 17 |

**Design Principle (reaffirming P4):** `Score` and `Skill` (via the candidate's aggregate Skill Graph) are the central shared entities — both candidate-facing screens (Section 12.1) and recruiter-facing screens (Section 12.2, `CandidateMatch`) read from the same underlying data rather than maintaining separate, divergent copies.

---

**SECTION 15 STATUS: Draft — Pending Review**

---

# 16. API / BACKEND REQUIREMENTS

*(Major categories and expected operations — not full endpoint specs, per PRD scope rules.)*

| API Category | Expected Operations |
|---|---|
| Auth API | Register, login, logout, verify email, password reset, role assignment |
| Profile API | Get/update candidate profile, get/update recruiter/company profile |
| Career API | List careers, get career detail (required skills), get career roadmap for candidate |
| Assessment API | Get assessment for career, submit assessment responses, get assessment history/report |
| Simulation API | Get simulation for career, submit simulation decisions, get simulation history/report |
| Grading API | (Internal/service) trigger grading job, retrieve score + explanation + confidence |
| Skill Gap API | Get skill gap report for candidate + career |
| Recommendation API | Get personalized recommendations for candidate |
| Gamification API | Get XP/level/achievements, get leaderboard (opt-in respecting, Section 17) |
| Job API | Create/update/publish/close job, get job detail |
| Matching API | Get ranked candidates for job, get match detail for candidate-job pair |
| Application API | Submit application, get application status, update pipeline stage |
| Analytics API | Get pipeline funnel for job, get score distributions |
| Admin API | Manage content (careers, questions, scenarios, rubrics), manage flagged accounts, manage roles/permissions |

All APIs must enforce role-based access control (Section 17) — e.g., a Candidate-role token cannot access recruiter-only endpoints like `Matching API` ranked-candidate views.

---

**SECTION 16 STATUS: Draft — Pending Review**

---

# 17. SECURITY & PRIVACY

| Area | Requirement |
|---|---|
| Authentication | Secure credential storage (hashed passwords), email verification, session management with expiry. |
| Authorization | Role-based access control (Candidate, Recruiter, Hiring Manager, Admin) enforced at the API layer, not just UI-level hiding. |
| Role-Based Access | Recruiters can only view candidate data relevant to their own company's job postings/applications, not the full candidate pool indiscriminately — **Open Question**: whether candidate profiles are visible platform-wide to any recruiter, or only to those a candidate has applied to / opted into. This materially affects candidate trust and must be resolved before build. |
| Candidate Data Protection | Candidates control visibility of their profile to recruiters (aligns with the Open Question above); performance data (scores) treated as sensitive. |
| HR Data Protection | Job posting and company data protected from competitor visibility where relevant (e.g., draft jobs not public). |
| AI Data Handling | Candidate responses used for grading; whether this data is also used to improve/train AI models is an **Open Question** requiring explicit consent design and policy decision — not assumed here. |
| Secure API Access | All APIs over encrypted transport (HTTPS/TLS); rate limiting on public-facing endpoints. |
| Audit Logs | Admin actions (content changes, account moderation) and score-override actions must be logged for accountability (ties to Section 18 auditability). |

---

**SECTION 17 STATUS: Draft — Pending Review**

---

# 18. AI SAFETY & FAIRNESS

| Principle | Requirement |
|---|---|
| Bias Mitigation | Matching and grading engines must not use protected attributes (gender, age, ethnicity, disability status, etc.) as inputs (N3). Regular review of match/grading outcomes for disparate impact is a **long-term operational requirement** (L-series) once sufficient data exists — cannot be claimed as "validated" at launch (A4). |
| Explainable AI | Every score/match affecting a candidate or hiring outcome must include a human-readable rationale (P2, reaffirmed here as a safety requirement, not just a UX nicety). |
| Human-in-the-Loop | No fully autonomous hiring decisions (N2); recruiters and hiring managers retain final authority (P7, N6). |
| Fair Candidate Evaluation | Scoring rubrics must be applied consistently across candidates for the same career/skill/task — inconsistent rubric application is a fairness risk to monitor (Section 19 observability). |
| No Protected-Attribute Inference | The system must not attempt to infer protected attributes from free-text responses, writing style, or other proxy signals for use in scoring/matching. This must be a design constraint, not just a stated policy. |
| Auditability | Score computations and match computations must be traceable/reconstructable after the fact (ties to audit logs, Section 17). |
| Model Monitoring | Ongoing monitoring for scoring drift, unusual score distributions, or degraded explanation quality — specific monitoring tooling/thresholds are **Data Required**, to be defined during implementation planning, not fabricated here. |

**Important Framing:** These are design *requirements* the system must be built to satisfy — they are not, on their own, a claim that SkillForge AI has been validated as bias-free or fully fair. That validation is an ongoing responsibility requiring real usage data, which does not yet exist (A4).

---

**SECTION 18 STATUS: Draft — Pending Review**

---

# 19. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|---|---|
| Performance | Grading and matching responses should complete within a reasonable time window for a good UX (e.g., near-real-time for simple scoring, async with clear status for complex AI grading) — exact latency targets **Data Required**, to be set once infrastructure/AI provider choices are made. |
| Scalability | Architecture should support growth in candidate/recruiter volume without redesign; exact scale targets are **Data Required** (no traffic projections exist pre-launch). |
| Availability | Core candidate and recruiter flows should target high availability appropriate for a production SaaS product — specific SLA (e.g., 99.9%) is **Data Required — Founder Validation**, not asserted here without basis. |
| Security | Per Section 17. |
| Reliability | AI grading/matching outputs should be consistent for identical/near-identical inputs; inconsistency should be monitored (Section 18). |
| Accessibility | Candidate-facing screens should meet a reasonable accessibility standard (e.g., WCAG 2.1 AA as a directional target) — final commitment **Data Required — Founder Validation**, given resourcing trade-offs at MVP. |
| Maintainability | Content libraries (questions, rubrics, scenarios) must be manageable by Admin without engineering intervention for routine updates (ties to 5.1, Module A, Admin persona). |
| Observability | Logging/monitoring for AI engine performance, grading consistency, and system errors, sufficient to support Section 18 model monitoring. |

---

**SECTION 19 STATUS: Draft — Pending Review**

---

# 20. ANALYTICS & KPIs

*(All numeric targets below are marked "Data Required — Founder Validation" per A4; metric definitions are provided so real targets can be attached later without redefining the metrics themselves.)*

## 20.1 Candidate-Side Metrics

| Metric | Definition | Target |
|---|---|---|
| Assessment Completion Rate | % of started assessments that reach submission | Data Required |
| Simulation Completion Rate | % of started simulations that reach submission | Data Required |
| Skill Improvement Rate | % of candidates showing a positive score delta on re-assessment | Data Required |
| Career Readiness Progression | Average Career Readiness Score trend over time per active candidate | Data Required |
| Engagement | Sessions per active candidate per period | Data Required |
| Retention | % of candidates returning after N days/weeks | Data Required |

## 20.2 HR-Side Metrics

| Metric | Definition | Target |
|---|---|---|
| Candidate Search Usage | Recruiter searches/filters performed per active job | Data Required |
| Match Accuracy | Correlation between high match scores and actual shortlisting/hiring — **cannot be measured meaningfully until real hiring outcomes accumulate** (ties to L3) | Data Required (long-term) |
| Shortlisting Rate | % of viewed candidates moved to Shortlisted stage | Data Required |
| Hiring Conversion | % of shortlisted candidates ultimately hired | Data Required |
| Time-to-Hire | Days from job posting to hire | Data Required |

## 20.3 Product-Level Metrics

| Metric | Definition | Target |
|---|---|---|
| DAU/MAU | Daily/Monthly Active Users, tracked separately for candidate and recruiter sides | Data Required |
| Activation | % of new registrants completing first meaningful action (first assessment for candidates; first job posting for recruiters) | Data Required |
| Retention | Cohort-based return-usage rate | Data Required |
| Feature Adoption | % of eligible users engaging with simulation, matching, gamification features | Data Required |
| Conversion (Freemium → Paid) | % of recruiter accounts converting from free to paid tier (A1) | Data Required |

---

**SECTION 20 STATUS: Draft — Pending Review**

---

# 21. MVP SCOPE

*(Consistent with Short-Term Objectives, Section 2.4, M1–M14.)*

## MUST HAVE (MVP)

| Item | Ref |
|---|---|
| Candidate registration, profile, onboarding | M1, Module A |
| Career/skill track selection (limited track set — exact list Data Required/Founder Validation, but architecture supports multiple per P5) | M2, Module B |
| Initial skill assessment (mixed question types) | M3, Module C |
| AI grading with explainability (assessment) | M4, Module D |
| Skill-gap analysis | M5, Module F |
| Career simulation (at least one track) | M6, Module E |
| Simulation grading with explainability | M7, Module D |
| Verified skill profile | M10 |
| HR job creation with structured requirements | M12, Module I |
| Basic HR candidate evaluation (view assessment/simulation results) | M13 |
| Explainable candidate matching (recruiter-facing) | M14, Module J |

## SHOULD HAVE (Early Post-MVP)

| Item | Ref |
|---|---|
| Personalized improvement recommendations (deeper) | M8, Module G |
| Re-assessment with score-over-time comparison | M9 |
| Basic candidate-facing job matching | M11, Module J |
| AI-assisted job-requirement extraction from free text | Section 5.9, 9.2 |
| Additional career tracks beyond MVP set | P5, L1 |

## COULD HAVE (Later Consideration)

| Item | Ref |
|---|---|
| Gamification (XP, levels, achievements, leaderboards) | Module H |
| HR Analytics (pipeline funnel, score distributions) | Module K |
| Candidate comparison view (HR) | Section 9.5 |
| Adaptive assessment difficulty | Section 6.1 |
| Dynamic/branching simulations | Section 8.2 |

## FUTURE (Explicitly Out of MVP/Near-Term Scope)

| Item | Ref |
|---|---|
| Predictive HR analytics (outcome correlation) | L4 |
| Institutional/B2B2C partnerships | L8 — Validation Required |
| AI-generated (vs. curated) assessment/simulation content | Section 6.1, 8.2 |
| Deep proctoring/anti-cheating tooling | Section 7.7, 24 |
| Full accessibility certification | Section 19 |

**MVP Scope Discipline Note:** Per PRD rule, this scope will not silently expand. Any addition to "Must Have" after this point should be flagged as a scope-change requiring explicit re-approval, not absorbed quietly into later sections.

---

**SECTION 21 STATUS: Draft — Pending Review**

---

# 22. FUTURE ROADMAP

| Phase | Focus |
|---|---|
| Phase 1 (MVP, Section 21 Must-Have) | Prove the closed candidate loop + basic explainable HR matching for a limited set of career tracks. |
| Phase 2 (Should/Could Have) | Deepen personalization, re-assessment loop, gamification, HR analytics; expand career track coverage. |
| Phase 3 | Predictive HR analytics, deeper skill verification/anti-cheating, adaptive assessment/simulation difficulty. |
| Long-Term Vision | Institutional/B2B2C exploration (pending validation, L8); AI-assisted content generation (with strong hallucination controls); a mature, data-validated two-sided marketplace where matching accuracy is measurably tied to real hiring outcomes (L3). |

---

**SECTION 22 STATUS: Draft — Pending Review**

---

# 23. ACCEPTANCE CRITERIA

*(Consolidated view; feature-level acceptance criteria already defined per feature in Section 5 — this section restates the top-level, cross-cutting criteria the MVP as a whole must satisfy.)*

| # | Acceptance Criterion |
|---|---|
| AC-1 | A new candidate can complete registration → assessment → simulation → view an explainable Career Readiness Score without engineering/manual intervention. |
| AC-2 | Every AI-generated score (assessment, simulation, match) includes a human-readable explanation and a confidence indicator. |
| AC-3 | A recruiter can create a job, view ranked candidates with explainable match scores, and shortlist a candidate, without manual data reconciliation. |
| AC-4 | No protected attributes are used as inputs anywhere in the grading or matching pipeline (verifiable via data schema review). |
| AC-5 | No AI system makes a final, unreviewable hiring decision — a human action is always required to move a candidate to "Hired." |
| AC-6 | Skill Gap Reports update automatically after new assessment/simulation data, without manual recomputation. |
| AC-7 | All MVP "Must Have" items (Section 21) function end-to-end in an integration test covering the full candidate loop and full HR loop (Section 11.1, 11.2). |

---

**SECTION 23 STATUS: Draft — Pending Review**

---

# 24. RISKS & MITIGATION

| Risk | Description | Mitigation |
|---|---|---|
| AI Accuracy | Grading/matching accuracy is unvalidated (A4) — scores could be systematically wrong without anyone noticing early on. | Rubric-anchored grading (Section 7); confidence scores; human override paths (Section 6.10); plan for early manual spot-checking during pilot. |
| AI Hallucination | Free-text grading or feedback generation could fabricate specifics not present in the candidate's actual response. | Anchor all generated explanations to actual submitted content and defined rubrics (Section 6.2, 6.6); avoid AI-generated (vs. curated) assessment/simulation content at MVP (Section 6.1, 8.2). |
| Incorrect Grading | A wrong or unfair score damages candidate trust and could mislead recruiters. | Explainability (P2) makes errors easier to spot/flag; audit logs (Section 17) and override paths (Section 6.10). |
| Recruitment Bias | Matching/grading could develop or reflect bias even without using protected attributes directly (proxy bias). | Explicit exclusion of protected attributes (N3); ongoing monitoring commitment (Section 18) once real data exists — flagged as unvalidated at launch. |
| Data Privacy | Candidate performance data is sensitive; mishandling risks trust and potential legal exposure. | Role-based access control, encrypted transport, audit logs (Section 17); geography-specific compliance work needed once A3 is resolved. |
| User Adoption | Two-sided marketplace cold-start problem — candidates need recruiter value to stay, recruiters need candidate volume to pay (B1 hypothesis). | MVP focuses on proving the loop narrowly (Section 21) rather than over-building before adoption is proven; explicit hypothesis framing (Section 2, Objective Hierarchy) rather than assumed success. |
| Scalability | No traffic/usage projections exist yet (A4). | Architecture designed for horizontal scalability in principle; exact capacity planning deferred until usage data exists — not fabricated here. |
| Cost of AI Inference | Freemium candidate side + AI-heavy grading/simulation could create unsustainable unit economics (B5). | Usage limits on free tier (A1); cost monitoring tied to Section 19 observability; may require inference cost optimization before/at scale. |
| Gaming / Cheating | Candidates could game assessments/simulations to inflate Career Readiness Score, undermining recruiter trust. | Response-time analysis, re-assessment cooldowns (Section 7.7) — acknowledged as partial mitigation only at MVP, not a full solution. |
| Poor Recommendations | Generic or irrelevant improvement recommendations reduce candidate trust and engagement (violates P6). | Recommendations must explicitly tie to specific identified gaps (Section 5.7, 6.9); flag gaps with no available content mapping rather than showing a generic filler recommendation. |
| Content Creation Bottleneck (Additional Risk) | Nearly every AI engine depends on curated content libraries (questions, rubrics, scenarios) that do not yet exist (A2/A4) — this is a significant, possibly underestimated build dependency. | Should be explicitly resourced and planned for in the MVP build timeline, not treated as a trivial side-task. |

---

**SECTION 24 STATUS: Draft — Pending Review**

---

# 25. ASSUMPTIONS & DEPENDENCIES

## Assumptions (Consolidated from Sections 1–2, plus new ones introduced in Sections 4–24)

| ID | Assumption |
|---|---|
| A1 | Freemium model: candidate side free with usage limits, HR side primary paid tier. *(Confirmed.)* |
| A2 | Pre-development stage; dev team available; API/domain setup pending. *(Confirmed.)* |
| A3 | Target geography undecided; India-pilot used as a placeholder assumption only. *(Open — carried through every geography-dependent section: 17, 19, 20–22.)* |
| A4 | No proprietary research/analytics exist; no fabricated statistics used anywhere in this PRD. *(Confirmed, applied throughout.)* |
| A5 | MVP assessment/simulation content is curated/static rather than AI-generated, to control hallucination risk (Sections 6.1, 8.2). *(New assumption — flagged for founder confirmation.)* |
| A6 | MVP career-track coverage is limited to a subset of the eight example tracks listed in the approved product context; exact subset is undecided (Section 21). *(New — Data Required.)* |
| A7 | Candidate profile visibility to recruiters (platform-wide vs. opt-in/application-based) is unresolved and materially affects both UX and privacy design (Section 17). *(New — Open Question, high priority.)* |

## Dependencies

| Dependency | Why It Matters |
|---|---|
| Content library creation (questions, rubrics, scenarios) per career track | Nearly every AI engine and MVP feature depends on this content existing before it can function (Section 24). |
| API and domain/infrastructure setup (per A2) | Blocking dependency before development begins, per user's own stated status. |
| Founder decisions on flagged Open Questions | Several sections (17, 20, 21) cannot be fully finalized with real targets/numbers until these are resolved. |
| AI/LLM provider selection | Affects cost modeling (B5), latency (Section 19), and grading/explanation quality (Section 6). |

---

**SECTION 25 STATUS: Draft — Pending Review**

---

# 26. OPEN QUESTIONS

*(Consolidated from every section above — nothing new introduced here that wasn't already flagged in its originating section.)*

| # | Question | Originating Section |
|---|---|---|
| 1 | Confirm target geography (India-pilot assumption, A3) | 1, 3 (carried) |
| 2 | Detailed HR monetization/pricing structure | 1, 2 |
| 3 | Should Job Seeker and Student/Candidate have differentiated onboarding flows? | 3 |
| 4 | Is Admin purely internal, or should a "company admin" (multi-recruiter) role exist at MVP? | 3 |
| 5 | Is Hiring Manager a distinct platform login/role at MVP? | 3 |
| 6 | Exact free-tier usage limits (number of assessments/simulations/re-assessments) | 2, 21 |
| 7 | Institutional/B2B2C exploration — remains unapproved | 2, 22 |
| 8 | Allow resuming a partially completed assessment, or require restart? | 5.3 |
| 9 | Is simulation branching linear (MVP) or dynamic — confirm before content build | 6.5, 8.2 |
| 10 | Re-assessment cooldown duration | 7.7 |
| 11 | Exact interview-stage management scope (in-platform vs. external) | 9.8, 15.2 |
| 12 | Candidate profile visibility model to recruiters (platform-wide vs. opt-in) — **high priority**, affects privacy design broadly | 17, 25 (A7) |
| 13 | Whether candidate response data may be used to improve/train AI models (consent/policy decision) | 17 |
| 14 | Specific latency/availability/accessibility targets (SLA, WCAG level) | 19 |
| 15 | Exact MVP career-track subset (which of the 8 example tracks ship first) | 21, 25 (A6) |

---

**SECTION 26 STATUS: Draft — Pending Review**

---

# 27. FINAL PRODUCT SUMMARY

SkillForge AI is a two-sided, AI-powered career-readiness and recruitment platform built around a single shared skill intelligence layer. Candidates move through a closed loop — assess, identify gaps, simulate, receive explainable AI grading, improve, and re-assess — to build a verified skill profile. Recruiters use that same underlying data to define job requirements and receive explainable, multi-dimension candidate match scores, with final hiring authority always remaining human.

The business model is Freemium (candidate side free with usage limits; HR side as the primary paid tier), currently at the pre-development stage with a development team in place and infrastructure setup pending. The product's core differentiators — realistic career simulation, explainable multi-dimension AI grading, and a shared skill-data layer connecting both sides of the platform — are protected from scope creep by explicit non-goals (Section 2.6) and a disciplined MVP scope (Section 21) that proves the core loop before expanding.

Several open questions (Section 26) — most notably target geography, candidate-data visibility rules, and exact MVP career-track coverage — require explicit founder decisions before the MVP build can be fully finalized. No statistics, market-sizing figures, or performance benchmarks have been fabricated anywhere in this document; wherever real data would normally inform a decision, it has been marked **"Data Required — Founder Validation"** instead.

---

**SECTION 27 STATUS: Draft — Pending Review**

---

# END OF DOCUMENT (Sections 1–27 Complete)

**Overall Document Status:** Sections 1–3 approved (Section 3 provisionally, per full-PRD generation request). Sections 4–27 drafted in full and awaiting your review, per your instruction to generate the complete PRD before review.

Recommended next step: review Section 26 (Open Questions) first, since several of those answers (geography, candidate-data visibility, MVP career-track subset) would meaningfully change details across many other sections if resolved differently.
