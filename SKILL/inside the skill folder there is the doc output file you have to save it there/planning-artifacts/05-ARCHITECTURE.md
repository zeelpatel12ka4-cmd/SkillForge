# SkillForge AI — System Architecture Document (TRD)
**Document Type:** Architecture / Technical Requirements Document  
**Agent:** Winston (System Architect) — BMAD Method  
**Version:** 1.0  
**Date:** 2026-09-11  
**Status:** Draft — Pending Review

---

# 1. ARCHITECTURE PHILOSOPHY

Boring technology for stability. Developer productivity as architecture. Every decision tied to business value. We do not over-engineer before we have users, but we also do not paint ourselves into a corner.

---

# 2. SYSTEM OVERVIEW

SkillForge AI is a two-sided SaaS platform with a shared skill intelligence data layer at its core. The architecture must support:
- AI-heavy, latency-sensitive operations (grading, matching)
- A content library that grows independently of code deployments
- Role-based access across four distinct user types
- Horizontal scalability without a redesign

## 2.1 High-Level Architecture

  [Client Layer]
    Candidate Web App (React/Next.js)
    HR Web App (React/Next.js)
    Admin Console (React/Next.js)

  [API Gateway]
    Authentication / Authorization (JWT + RBAC)
    Rate Limiting
    Request Routing

  [Service Layer]
    Auth Service
    Profile Service
    Career Service
    Assessment Service
    Simulation Service
    Grading Service (AI-heavy, async)
    Skill Graph Service
    Skill Gap Service
    Recommendation Service
    Job Service
    Matching Service (AI-heavy, async)
    Analytics Service
    Gamification Service (Post-MVP)
    Admin Service
    Notification Service

  [AI Inference Layer]
    LLM Provider (TBD — OpenAI / Gemini / Anthropic)
    Grading Engine
    Matching Engine
    Feedback Engine

  [Data Layer]
    Primary Database: PostgreSQL (relational — user, skill, job, assessment, score data)
    Search Index: Elasticsearch or pgvector (candidate/job skill matching queries)
    Object Storage: S3-compatible (simulation scenario content, rubric files, media)
    Cache: Redis (session data, frequently read career/skill taxonomy)
    Message Queue: RabbitMQ or SQS (async grading and matching jobs)

  [Infra / Platform]
    Container Orchestration: Docker + Kubernetes (or managed equivalent)
    CI/CD: GitHub Actions
    Monitoring: Prometheus + Grafana (or managed APM)
    Logging: Structured JSON logs -> centralized log aggregation

---

# 3. DATA ARCHITECTURE

## 3.1 Core Entity Model (Logical)

  User (id, email, password_hash, role, verified, created_at)
    |-- Profile_Candidate (user_id, education, experience, interests, goals, completion_pct)
    |-- Profile_Recruiter (user_id, company_id, title)

  Career (id, name, description, required_skill_ids[], created_at, updated_at)
  Skill (id, name, category, career_ids[], created_at)

  Assessment (id, candidate_id, career_id, question_ids[], submitted_at, graded_at)
    |-- Question (id, type, content, rubric_id, skill_tags[], difficulty)
    |-- Answer (id, assessment_id, question_id, response_content, submitted_at)
    |-- Score (id, answer_id, dimension_scores{}, overall_score, explanation, confidence, graded_at)

  Simulation (id, candidate_id, career_id, scenario_id, started_at, completed_at)
    |-- Scenario (id, career_id, premise, task_ids[])
    |-- Task (id, scenario_id, prompt, rubric_id, checkpoint_order)
    |-- Performance (id, task_id, candidate_id, score_id, decision_content)

  SkillGraph (candidate_id, skill_id, score, confidence, last_updated)
  SkillGap (id, candidate_id, career_id, missing_skills[], weak_skills[], strong_skills[], priority_skills[], computed_at)
  LearningRecommendation (id, candidate_id, skill_gap_id, content_refs[], created_at)

  Company (id, name, industry, created_at)
  Job (id, company_id, required_skills[], preferred_skills[], experience_level, assessment_criteria, status, created_at)
  Application (id, job_id, candidate_id, status, applied_at)
  CandidateMatch (id, job_id, candidate_id, overall_match_pct, dimension_scores{}, missing_skills[], strong_skills[], confidence, computed_at)

  Achievement (id, candidate_id, type, earned_at)
  XP (candidate_id, total_xp, level, last_updated)

## 3.2 Shared Skill Intelligence Layer

  [Candidate Assessment + Simulation]
    -> writes to -> SkillGraph (per candidate, per skill, with score + confidence)
    -> triggers -> SkillGap recomputation
    -> triggers -> LearningRecommendation regeneration

  [HR Matching Engine]
    -> reads from -> SkillGraph + Job.required_skills
    -> writes to -> CandidateMatch

  Both sides read from and write to the same SkillGraph, SkillGap, and Score tables.
  There is no separate "HR copy" of candidate data.

---

# 4. API ARCHITECTURE

## 4.1 API Design Principles

- RESTful APIs with OpenAPI 3.1 specification
- JWT authentication; role checked at API layer (not UI-layer-only)
- Versioned endpoints: /api/v1/...
- All responses use consistent envelope: { data, error, meta }
- Pagination on all list endpoints (cursor-based preferred over offset)
- Rate limiting: configurable per endpoint and role tier

## 4.2 API Categories

| Category | Key Endpoints |
|---|---|
| Auth | POST /auth/register, POST /auth/login, POST /auth/verify-email, POST /auth/refresh |
| Profile | GET/PUT /candidates/:id/profile, GET/PUT /recruiters/:id/profile |
| Career | GET /careers, GET /careers/:id, GET /candidates/:id/roadmap |
| Assessment | GET /assessments?career=:id, POST /assessments/:id/submit, GET /candidates/:id/assessments |
| Simulation | GET /simulations?career=:id, POST /simulations/:id/decisions, GET /candidates/:id/simulations |
| Grading (Internal) | POST /grading/trigger, GET /grading/:id/result |
| Skill Graph | GET /candidates/:id/skill-graph |
| Skill Gap | GET /candidates/:id/skill-gap?career=:id |
| Recommendation | GET /candidates/:id/recommendations |
| Job | POST /jobs, GET /jobs/:id, PUT /jobs/:id, GET /companies/:id/jobs |
| Matching | GET /jobs/:id/candidates (ranked), GET /jobs/:id/candidates/:cid/match |
| Application | POST /applications, GET /applications/:id, PUT /applications/:id/status |
| Analytics | GET /jobs/:id/funnel, GET /jobs/:id/score-distribution |
| Admin | Full CRUD on content entities; GET /admin/flagged, PUT /admin/users/:id/role |

## 4.3 Async Operations (Queue-Based)

Operations that are AI-heavy and should not block the HTTP response:

| Operation | Trigger | Queue | Consumer |
|---|---|---|---|
| Assessment Grading | POST /assessments/:id/submit | grading_queue | Grading Service |
| Simulation Grading | Final decision submitted | grading_queue | Grading Service |
| Candidate Matching | Job published OR new candidate assessment graded | matching_queue | Matching Service |
| Recommendation Generation | SkillGap recomputed | recommendation_queue | Recommendation Service |
| Skill Graph Update | Score written | skillgraph_queue | Skill Graph Service |

Client polls for status or receives a push notification/webhook on completion.

---

# 5. SECURITY ARCHITECTURE

## 5.1 Authentication and Authorization

| Layer | Mechanism |
|---|---|
| Authentication | JWT (access token: 15 min expiry; refresh token: 7 days, rotated on use) |
| Authorization | Role-Based Access Control (RBAC) — roles: CANDIDATE, RECRUITER, HIRING_MANAGER, ADMIN |
| API enforcement | Every protected endpoint validates JWT and checks role at middleware level |
| Candidate data isolation | Recruiters can only access candidate data for their own company's job postings/applications |

## 5.2 Data Protection

| Concern | Approach |
|---|---|
| Password storage | bcrypt hash (cost factor >= 12); never stored in plaintext |
| Transport | HTTPS/TLS 1.2+ enforced; HSTS header |
| PII at rest | Sensitive fields (email, profile data) encrypted at rest in database |
| API rate limiting | Per-IP + per-user-token rate limiting on all public endpoints |
| Audit logging | Admin actions, score overrides, and role changes logged with actor, timestamp, and change |

## 5.3 AI Data Handling

- Candidate responses used for grading only
- Use of candidate data to train/improve AI models requires explicit informed consent (Open Question — policy decision required before implementation)
- Protected attributes (gender, age, ethnicity) must not be stored in any field consumed by grading or matching engines — enforced at schema level, not just policy

---

# 6. AI INFRASTRUCTURE

## 6.1 LLM Integration

| Aspect | Decision |
|---|---|
| Provider | TBD — OpenAI GPT-4o / Google Gemini / Anthropic Claude (evaluate for cost, latency, grading quality) |
| Integration | REST API calls from Grading Service and Matching Service |
| Prompt design | Structured rubric-anchored prompts; candidate response included verbatim; no fabrication of specifics allowed |
| Fallback | If LLM call fails: retry x2, then queue for manual review; candidate sees "Grading in progress" |

## 6.2 Grading Engine Architecture

  INPUT: Assessment/Simulation submission + Rubric for career/skill
  STEP 1: Identify response type (MCQ -> deterministic; free-text -> LLM)
  STEP 2 (MCQ): Score against answer key; record dimension contribution
  STEP 2 (Free-text): LLM call with rubric prompt; parse structured score response
  STEP 3: Aggregate dimension scores using weighted formula per career track
  STEP 4: Generate explanation text (template-guided NLG anchored to rubric + submission)
  STEP 5: Assign confidence score (based on data completeness, LLM confidence)
  STEP 6: Write Score record + trigger SkillGraph update
  OUTPUT: Score entity with overall, dimensions, explanation, confidence

## 6.3 Matching Engine Architecture

  INPUT: Candidate SkillGraph + Job requirements
  STEP 1: Pull candidate SkillGraph for all required skills in the job
  STEP 2: For each required skill — compare score vs. job threshold
  STEP 3: Classify as missing (no data or below threshold), weak (near threshold), or strong (above threshold)
  STEP 4: Compute weighted overall match % using job-specific dimension weights
  STEP 5: Generate per-dimension explanation
  STEP 6: Assign confidence (lower if candidate has sparse assessment history)
  STEP 7: Write CandidateMatch record
  OUTPUT: CandidateMatch entity with overall %, dimension scores, missing/strong skill lists, confidence, explanation

---

# 7. INFRASTRUCTURE AND DEPLOYMENT

## 7.1 Environments

| Environment | Purpose |
|---|---|
| Development | Local developer machines; Docker Compose for services |
| Staging | Production-mirror; used for QA, load testing, demo |
| Production | Live environment; auto-scaled |

## 7.2 CI/CD Pipeline

  Push to feature branch
    -> Lint + Unit tests (PR required to pass)
    -> PR review (human)
    -> Merge to main
    -> Staging deploy (automated)
    -> Integration tests (automated)
    -> Manual QA sign-off
    -> Production deploy (manual trigger or automated for low-risk changes)

## 7.3 Scalability Strategy

- All services are stateless; horizontal scaling via Kubernetes HPA
- Database: read replicas for high-read services (Matching, Skill Graph reads)
- AI grading/matching: queue-backed; auto-scale consumers based on queue depth
- Content (questions, rubrics, scenarios): served from S3 with CDN; not database-bottlenecked

## 7.4 Observability

| Signal | Tool |
|---|---|
| Metrics | Prometheus + Grafana (or cloud-native equivalent) |
| Logging | Structured JSON; centralized log aggregation (e.g., CloudWatch, Datadog) |
| Tracing | OpenTelemetry for distributed traces across services |
| Alerting | PagerDuty-compatible alerts on: error rate > threshold; grading queue depth > threshold; AI inference failure rate |
| AI Monitoring | Score consistency checks; confidence distribution monitoring; explanation quality spot-checking |

---

# 8. TECHNOLOGY STACK DECISIONS

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js (React) + TypeScript | Strong ecosystem; SSR for SEO; Vercel deployment path |
| Backend Services | Node.js (TypeScript) + Express or NestJS | Team familiarity assumed; strong ecosystem; TypeScript type safety |
| Primary Database | PostgreSQL | Relational, proven, supports JSONB for flexible score/dimension storage |
| Search/Matching | pgvector (initial) or Elasticsearch | pgvector avoids a separate service at MVP; migrate to Elasticsearch at scale if needed |
| Cache | Redis | Session cache, rate limiting, frequently read taxonomy data |
| Queue | RabbitMQ or AWS SQS | Async AI jobs; SQS if deploying on AWS for operational simplicity |
| Object Storage | AWS S3 or compatible | Content library (questions, rubrics, scenarios) |
| AI/LLM | TBD (OpenAI / Gemini / Claude) | Evaluate based on cost, latency, grading quality — Data Required |
| Container | Docker + Kubernetes | Horizontal scaling, environment consistency |
| CI/CD | GitHub Actions | Tight GitHub integration; free for private repos up to limits |
| Monitoring | Prometheus + Grafana | Open-source; avoid vendor lock-in at MVP scale |

Note: Final tech stack decisions require founder/CTO sign-off. Alternatives exist at each layer.

---

# 9. ARCHITECTURE DECISIONS (ADRs)

## ADR-001: Shared Skill Intelligence Layer

**Decision:** Candidate-facing features and recruiter-facing features both read from and write to the same SkillGraph, Score, and SkillGap tables. There is no duplication of skill data.

**Rationale:** Core product objective P4. Duplication creates synchronization bugs and weakens matching accuracy.

**Consequence:** Schema design must support both use cases from day one. Any schema change to skill/score entities affects both sides of the platform.

## ADR-002: Async Grading and Matching via Message Queue

**Decision:** AI grading and candidate matching are dispatched to a message queue and processed asynchronously. The API returns immediately with a "processing" status.

**Rationale:** LLM inference latency is unpredictable and can range from 2 to 30+ seconds. Blocking the HTTP response creates a poor user experience and risks timeouts.

**Consequence:** Client must poll for status or receive a push notification on completion. UX must handle the "grading in progress" state gracefully.

## ADR-003: Curated Content at MVP (No AI-Generated Questions/Scenarios)

**Decision:** Assessment questions and simulation scenarios are curated and maintained by Admin at MVP. AI-generated content is explicitly excluded.

**Rationale:** AI-generated content introduces hallucination risk that is unacceptable for scored assessments. Curation provides quality control. This decision may be revisited post-MVP once strong validation controls are in place.

**Consequence:** Content creation is a significant pre-launch dependency that must be resourced explicitly.

## ADR-004: Protected Attributes Excluded at Schema Level

**Decision:** Gender, age, ethnicity, disability status, and other protected attributes are not stored in any database field consumed by the Grading Engine or Matching Engine.

**Rationale:** Policy-only exclusion is insufficient. If the data exists in the schema, a future engineer could inadvertently include it. Schema-level exclusion makes this a technical guarantee.

**Consequence:** Profile schema must be designed with this constraint from the start.

---

*Generated by Ultron (BMAD Method — bmad-architecture) for SkillForge AI Platform — 2026-09-11*
