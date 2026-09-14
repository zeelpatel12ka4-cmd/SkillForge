# SkillForge AI — Career Tracks Specification
**Document Type:** Career Tracks Spec  
**Agent:** Winston (Architect) + John (PM) + Mary (Analyst) — BMAD Method  
**Version:** 1.0  
**Date:** 2026-09-11  
**Decision:** OQ2 RESOLVED — 8 career tracks confirmed for MVP  
**Status:** Approved — Engineering + Content team can build from this

---

# CONFIRMED MVP CAREER TRACKS

| # | Track | Code | Domain | Difficulty Tier |
|---|---|---|---|---|
| 1 | Software Developer | SD | Technology | Intermediate |
| 2 | Data Analyst | DA | Data / Analytics | Intermediate |
| 3 | Digital Marketing | DM | Marketing | Entry–Intermediate |
| 4 | AI / ML Engineer | AI | Technology / AI | Advanced |
| 5 | UI / UX Designer | UX | Design | Entry–Intermediate |
| 6 | Cyber Security | CS | Security / Technology | Intermediate–Advanced |
| 7 | Product Manager | PM | Product | Intermediate |
| 8 | Sales | SA | Business | Entry–Intermediate |

---

# UNIVERSAL GRADING DIMENSIONS (Apply to All Tracks)

These dimensions apply across every assessment and simulation. Track-specific weighting varies (see per-track section).

| Dimension | Code | Description |
|---|---|---|
| Accuracy | ACC | Correctness of factual / technical answers |
| Technical Correctness | TC | Soundness of technical approach or solution |
| Problem-Solving Ability | PS | Quality of approach to open-ended / scenario problems |
| Reasoning | RSN | Clarity and validity of justification given |
| Practical Application | PA | Ability to apply knowledge to a realistic task |
| Communication | COM | Clarity of explanations and decisions communicated |
| Completeness | CMP | Whether the response fully addresses the question or task |
| Efficiency | EFF | Time/resource-consciousness of approach where relevant |
| Role-Specific Competency | RSC | Fit of response to the specific career role expectations |

---

# TRACK 1 — SOFTWARE DEVELOPER (SD)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| Programming Fundamentals (logic, data structures, algorithms) | Core Technical | P0 |
| Object-Oriented Programming | Core Technical | P0 |
| Version Control (Git) | Core Technical | P0 |
| REST API Design and Consumption | Core Technical | P0 |
| Debugging and Troubleshooting | Core Technical | P0 |
| Database Basics (SQL / NoSQL concepts) | Core Technical | P0 |
| System Design Fundamentals | Core Technical | P1 |
| Testing Fundamentals (unit, integration) | Quality | P1 |
| Clean Code and Code Review | Quality | P1 |
| Security Awareness (OWASP basics) | Security | P2 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Accuracy | 20% |
| Technical Correctness | 30% |
| Problem-Solving Ability | 20% |
| Reasoning | 15% |
| Completeness | 10% |
| Communication | 5% |

## Simulation Scenario Outline
**Scenario: "The Production Bug"**
- Context: You are a junior developer at a SaaS company. A critical bug has been reported by a customer in production. You have 2 hours before an important client demo.
- Task 1: Analyse the provided error log and identify the root cause from 3 possible options.
- Task 2: Write a fix strategy (code pseudocode or written explanation acceptable).
- Task 3: Decide — hotfix now vs. rollback to previous version. Justify your decision.
- Task 4: Write a brief incident summary for your team lead.
- Evaluated On: TC (fix strategy quality), PS (root cause identification), RSN (hotfix vs rollback justification), COM (incident summary clarity), EFF (decision speed and pragmatism)

---

# TRACK 2 — DATA ANALYST (DA)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| SQL (queries, joins, aggregations) | Core Technical | P0 |
| Data Cleaning and Preparation | Core Technical | P0 |
| Data Visualization (charts, dashboards) | Core Technical | P0 |
| Statistical Thinking (mean, variance, distributions) | Core Technical | P0 |
| Excel / Google Sheets (advanced) | Core Technical | P0 |
| Business Problem Translation (data to insight) | Analytical | P0 |
| Python or R basics (for data manipulation) | Core Technical | P1 |
| A/B Testing Fundamentals | Analytical | P1 |
| Storytelling with Data | Communication | P1 |
| Dashboard Tools (Tableau, Power BI, Looker) | Tools | P2 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Accuracy | 20% |
| Technical Correctness | 25% |
| Problem-Solving Ability | 20% |
| Reasoning | 15% |
| Communication | 10% |
| Completeness | 10% |

## Simulation Scenario Outline
**Scenario: "The Revenue Drop"**
- Context: You are a data analyst at an e-commerce company. The Head of Growth says revenue dropped 18% last month. They want to know why before the board meeting tomorrow.
- Task 1: Given a sample dataset summary, identify the 3 most likely hypotheses for the drop.
- Task 2: Write the SQL queries you would run to investigate each hypothesis (pseudocode acceptable).
- Task 3: Interpret a sample chart showing the data — what does it tell you?
- Task 4: Write a 3-bullet executive summary of your findings for a non-technical stakeholder.
- Evaluated On: PS (hypothesis quality), TC (SQL logic), ACC (chart interpretation), COM (executive summary), RSN (reasoning from data to conclusion)

---

# TRACK 3 — DIGITAL MARKETING (DM)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| SEO Fundamentals (on-page, off-page, technical) | Core | P0 |
| Paid Advertising (Google Ads, Meta Ads basics) | Core | P0 |
| Content Marketing Strategy | Core | P0 |
| Email Marketing | Core | P0 |
| Social Media Marketing | Core | P0 |
| Analytics and Reporting (GA4, UTM tracking) | Analytics | P0 |
| Conversion Rate Optimization basics | Growth | P1 |
| Marketing Funnel Design (TOFU/MOFU/BOFU) | Strategy | P1 |
| Copywriting for Digital | Creative | P1 |
| Marketing Automation basics | Tools | P2 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Accuracy | 20% |
| Practical Application | 25% |
| Problem-Solving Ability | 20% |
| Communication | 20% |
| Reasoning | 10% |
| Completeness | 5% |

## Simulation Scenario Outline
**Scenario: "The Launch Campaign"**
- Context: You are the digital marketing manager for a SaaS startup launching a new productivity tool. Budget is $5,000 for the first month. Goal: 500 trial signups.
- Task 1: Allocate the $5,000 budget across channels. Justify each allocation decision.
- Task 2: Write the headline and first paragraph of a landing page for this tool (targeting small business owners).
- Task 3: Define 3 KPIs you would track in week 1, and what action you take if each is below target.
- Task 4: The campaign is live. CTR on ads is high but signup conversion is 0.8% (target: 3%). What do you do?
- Evaluated On: RSN (budget allocation), COM + PA (landing page copy), ACC (KPI selection), PS (conversion troubleshooting)

---

# TRACK 4 — AI / ML ENGINEER (AI)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| Python (NumPy, Pandas, scikit-learn) | Core Technical | P0 |
| Machine Learning Fundamentals (supervised, unsupervised) | Core Technical | P0 |
| Model Evaluation (accuracy, precision, recall, F1, AUC) | Core Technical | P0 |
| Feature Engineering | Core Technical | P0 |
| Deep Learning Basics (neural networks, backpropagation) | Core Technical | P0 |
| Data Preprocessing and Pipelines | Core Technical | P0 |
| Model Deployment Fundamentals (APIs, containers) | MLOps | P1 |
| LLM and Prompt Engineering Basics | Emerging | P1 |
| Experiment Tracking (MLflow, W&B basics) | MLOps | P1 |
| AI Ethics and Bias Awareness | Ethics | P1 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Technical Correctness | 35% |
| Problem-Solving Ability | 25% |
| Reasoning | 20% |
| Accuracy | 10% |
| Completeness | 10% |

## Simulation Scenario Outline
**Scenario: "The Classifier That Lied"**
- Context: You are an ML engineer at a fintech company. A fraud detection model was deployed 3 weeks ago. It has 99% accuracy — but the fraud team says they are still catching the same number of fraudsters manually. Something is wrong.
- Task 1: Explain why 99% accuracy alone might be meaningless for this problem.
- Task 2: Which metric should be prioritized: precision or recall? Why?
- Task 3: The model is predicting almost everything as "not fraud." What are the 3 most likely causes?
- Task 4: Propose a retraining strategy and one change to the evaluation process going forward.
- Evaluated On: TC (metric understanding), RSN (precision vs recall), PS (root cause diagnosis), PA (retraining proposal)

---

# TRACK 5 — UI / UX DESIGNER (UX)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| UX Research Methods (user interviews, surveys, usability testing) | Research | P0 |
| Information Architecture and Navigation Design | Core | P0 |
| Wireframing and Prototyping | Core | P0 |
| Visual Design Principles (hierarchy, contrast, spacing, color) | Visual | P0 |
| Interaction Design and Micro-interactions | Core | P0 |
| Accessibility (WCAG basics) | Quality | P0 |
| Figma (or equivalent tool) proficiency | Tools | P0 |
| User Journey Mapping | Research | P1 |
| Design Systems | Advanced | P1 |
| Usability Heuristics (Nielsen's 10) | Core | P1 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Practical Application | 30% |
| Reasoning | 25% |
| Communication | 20% |
| Role-Specific Competency | 15% |
| Completeness | 10% |

## Simulation Scenario Outline
**Scenario: "The Checkout That Nobody Completes"**
- Context: You are a UX designer at an e-commerce company. The checkout flow has a 68% abandonment rate — the industry average is 45%. You have been asked to diagnose and propose a fix.
- Task 1: List 5 usability heuristics violations you would check for first in a checkout flow.
- Task 2: Design a user research plan: what method, who you recruit, and what 3 questions you ask.
- Task 3: You are given a wireframe of the current 5-step checkout. Identify 3 specific friction points and explain why each causes abandonment.
- Task 4: Propose a revised information architecture for the checkout flow. Sketch or describe it.
- Evaluated On: RSC (heuristics knowledge), RSN (research plan quality), PA (friction point identification), COM (IA proposal clarity)

---

# TRACK 6 — CYBER SECURITY (CS)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| Networking Fundamentals (TCP/IP, DNS, HTTP/S, firewalls) | Core Technical | P0 |
| OWASP Top 10 Vulnerabilities | Core Technical | P0 |
| Security Principles (CIA triad, least privilege, defense in depth) | Core Technical | P0 |
| Incident Response Fundamentals | Core Technical | P0 |
| Cryptography Basics (symmetric, asymmetric, hashing) | Core Technical | P0 |
| Threat Modelling Basics | Core Technical | P1 |
| Penetration Testing Concepts | Advanced | P1 |
| Security Compliance Awareness (GDPR, ISO 27001 basics) | Compliance | P1 |
| Log Analysis and SIEM basics | Detection | P1 |
| Social Engineering Awareness | Human Factors | P1 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Technical Correctness | 30% |
| Problem-Solving Ability | 25% |
| Accuracy | 20% |
| Reasoning | 15% |
| Role-Specific Competency | 10% |

## Simulation Scenario Outline
**Scenario: "The 3AM Alert"**
- Context: You are a security analyst on call. At 3AM you receive an alert: unusual outbound traffic spike from an internal server, 2GB transferred to an unknown external IP in the last 30 minutes.
- Task 1: List your first 5 immediate actions in order of priority.
- Task 2: What type of attack or incident does this pattern most likely indicate? Give 2 possible explanations.
- Task 3: The server is running a public-facing web app. Which OWASP vulnerability category would you investigate first and why?
- Task 4: Draft a brief incident escalation message for your CISO.
- Evaluated On: RSC (first response protocol), PS (attack hypothesis quality), TC (OWASP reasoning), COM (escalation message)

---

# TRACK 7 — PRODUCT MANAGER (PM)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| Product Strategy and Vision | Core | P0 |
| User Research and Discovery | Core | P0 |
| Requirements Definition (PRD, user stories) | Core | P0 |
| Prioritization Frameworks (RICE, MoSCoW, ICE) | Core | P0 |
| Roadmap Planning | Core | P0 |
| Metrics and KPIs (defining and tracking) | Analytics | P0 |
| Stakeholder Communication | Communication | P0 |
| Agile / Scrum Fundamentals | Process | P1 |
| Competitive Analysis | Strategy | P1 |
| Go-to-Market Planning basics | GTM | P1 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Problem-Solving Ability | 25% |
| Reasoning | 25% |
| Communication | 20% |
| Practical Application | 20% |
| Role-Specific Competency | 10% |

## Simulation Scenario Outline
**Scenario: "The Feature War"**
- Context: You are a PM at a B2B SaaS company. Engineering has capacity for one more feature this quarter. Three stakeholders are lobbying for three different features: (A) the Sales team wants a CRM integration, (B) Support wants a self-service help center, (C) the CEO wants an AI-powered analytics dashboard.
- Task 1: Apply the RICE framework to score all three features. Justify your assumptions.
- Task 2: Which feature do you recommend? Write a 3-sentence justification you would give to a stakeholder whose feature was not chosen.
- Task 3: The CEO overrides you and insists on the analytics dashboard. How do you respond and what do you do next?
- Task 4: Write 3 success metrics for whichever feature you recommended.
- Evaluated On: RSC (RICE application), RSN (recommendation justification), COM (stakeholder pushback response), PA (success metric quality)

---

# TRACK 8 — SALES (SA)

## Required Skills
| Skill | Category | Priority |
|---|---|---|
| Sales Process (prospecting, qualification, pitching, closing) | Core | P0 |
| Objection Handling | Core | P0 |
| Customer Needs Discovery (SPIN, BANT, MEDDIC basics) | Core | P0 |
| Product Knowledge and Value Proposition | Core | P0 |
| CRM Usage and Pipeline Management | Tools | P0 |
| Negotiation Fundamentals | Core | P0 |
| Cold Outreach (email, LinkedIn, phone) | Outbound | P1 |
| Sales Metrics (quota, conversion rate, ACV, churn) | Analytics | P1 |
| Storytelling and Demonstration | Communication | P1 |
| Account Management basics | Retention | P2 |

## Assessment Dimension Weights
| Dimension | Weight |
|---|---|
| Practical Application | 30% |
| Communication | 25% |
| Problem-Solving Ability | 20% |
| Role-Specific Competency | 15% |
| Reasoning | 10% |

## Simulation Scenario Outline
**Scenario: "The Reluctant Buyer"**
- Context: You are an account executive at a SaaS company selling a project management tool (price: $200/user/month). You are on a 30-minute discovery call with the VP of Operations at a 200-person company. They said in the intro email they are "happy with their current tool."
- Task 1: Write the first 3 questions you would ask to discover their real pain points. Explain why each question.
- Task 2: The prospect says: "Your price is way too high — we pay $50/user/month now." Write your response.
- Task 3: The prospect seems interested but says "I need to think about it." What do you say and what is your next step to keep the deal moving?
- Task 4: After the call, write the follow-up email (subject line + 4 sentences max).
- Evaluated On: RSC (discovery questions), PA (objection handling), COM (follow-up email), PS (next step strategy)

---

# CONTENT CREATION REQUIREMENTS

Based on the above, the content team needs to produce per track:

| Deliverable | Quantity per Track | Total (8 tracks) |
|---|---|---|
| MCQ Questions | 20 per track | 160 questions |
| Scenario / Practical Questions | 10 per track | 80 questions |
| Grading Rubrics | 1 per skill area | ~80 rubrics |
| Simulation Scenario (full script) | 1 per track | 8 scenarios |
| Simulation Task Rubrics | 4 tasks per scenario | 32 task rubrics |

**Total Content Artifacts: ~360 items — this is a significant pre-launch dependency.**

Priority order for content creation:
1. Software Developer (most demand, benchmark track)
2. Data Analyst
3. Product Manager
4. AI/ML Engineer
5. UI/UX Designer
6. Digital Marketing
7. Cyber Security
8. Sales

---

# DATABASE SEED REQUIREMENTS

Engineering must seed the following before Sprint 1 assessment stories:

```sql
-- 8 Career records
-- ~80 Skill records (10 per track)
-- Career <-> Skill mappings with priority flags
-- Question bank (160 MCQ + 80 scenario questions per above)
-- Rubric records linked to each question and simulation task
-- Simulation Scenario records (8)
-- Simulation Task records (32 total, 4 per scenario)
```

---

# OPEN QUESTION UPDATE

| OQ# | Question | Status |
|---|---|---|
| OQ2 | Which career tracks at MVP? | RESOLVED: 8 tracks listed above |

---

*Generated by Ultron (BMAD Method) for SkillForge AI Platform — 2026-09-11*
