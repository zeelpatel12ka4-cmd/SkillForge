/**
 * SkillForge AI — Product Manager (PM) Simulation Packages
 * Tracks: Fresher, Junior, Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const PM_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-PM-FRE-001",
  version: "1.0.0",
  careerCode: "PM",
  level: "fresher",
  title: "Push Notification Preference Engine PRD & User Stories",
  status: "active",
  roleContext: {
    roleTitle: "Associate Product Manager (APM)",
    team: "User Engagement & Lifecycle",
    companyContext: "Consumer marketplace with 1,500,000 monthly active shoppers.",
    reportingTo: "Senior Product Manager",
  },
  scenario:
    "User churn reports indicate that 24% of mobile users who disable push notifications do so because of notification spam during late night hours. Currently, the app sends one-size-fits-all marketing broadcasts with no user preference controls or quiet hours. You must author a Product Requirements Document (PRD) for a granular 'Notification Preferences & Quiet Hours Center', define 4 detailed user stories with Gherkin acceptance criteria (Given/When/Then), prioritize edge cases (GDPR opt-out, transactional vs marketing notifications, time zone overrides), and articulate release success metrics.",
  businessContext:
    "Push notification opt-out rates rose from 14% to 31% over the last two quarters, impairing re-engagement campaign efficacy and reducing monthly active buyer retention by 8%.",
  objective:
    "Frame user problems from qualitative feedback, author a complete PRD with 4 user stories and Gherkin acceptance criteria, prioritize edge cases, and define measurable North Star KPIs.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["Product Requirements Document (PRD) formatting", "User Story structure (As a... I want... So that...)", "Gherkin syntax (Given/When/Then)", "Mobile notification guidelines (iOS APNs / Android FCM)"],
  learningOutcomes: [
    "Translating customer churn complaints into clear product specifications",
    "Writing rigorous user stories and unambiguous acceptance criteria",
    "Distinguishing regulatory/transactional alerts from promotional messages",
    "Defining quantitative product adoption and retention metrics",
  ],
  skills: ["Product Specs (PRD)", "User Stories", "Acceptance Criteria (Gherkin)", "Prioritization", "KPIs & Metrics"],
  materials: [
    {
      id: "mat-pm-fre-1",
      title: "Customer Support & Review Sentiment Log (Excerpt)",
      type: "docs",
      description: "App Store negative reviews and customer support ticket transcripts regarding notifications.",
      filename: "notification_feedback_sample.md",
      relevance: "Used in Task 1 to frame the user problem and requirements.",
      content: `## User Feedback Samples
1. Review (1-star): "I love the app deals, but waking me up at 2:30 AM with a 10% coupon is ridiculous! Had to completely turn off app notifications in iOS settings."
2. Ticket #49201: "I need order shipping updates, but I don't want 5 marketing push alerts every day about shoes I already bought."
3. Review (2-stars): "No way to choose what notifications I receive. It's all or nothing. Fix this please!"`,
    },
    {
      id: "mat-pm-fre-2",
      title: "Regulatory & Technical Notification Constraints",
      type: "docs",
      description: "Legal compliance standards for mobile notifications.",
      filename: "notification_compliance_guide.md",
      relevance: "Used in Task 2 and Task 3 to address edge cases.",
      content: `### Mandatory Requirements
1. Transactional vs Promotional: Critical security alerts (Password Reset, Fraud Alerts, Order Delivery Confirmation) MUST bypass Quiet Hours and cannot be disabled by promotional toggles.
2. Time Zone Respect: Quiet Hours must calculate against the user's local device time zone, not server UTC.
3. Frequency Capping: Maximum of 2 promotional notifications per user per 24-hour window.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Problem Framing, Target Personas & North Star KPI",
      type: "investigation",
      dimension: "Problem Framing & Customer Empathy",
      objective: "Frame the customer friction and define measurable success criteria.",
      context: "Review notification_feedback_sample.md in Materials.",
      prompt:
        "Frame the product initiative:\n1. Problem Statement: Summarize the core user friction leading to high notification opt-out rates.\n2. Primary Target Persona: Define an archetype shopper (Goals, Frustrations, Notification Sensitivity).\n3. North Star Metric & Counter Metric: What primary metric defines success (e.g. % of users with push enabled), and what counter-metric ensures we do not harm engagement?",
      constraints: ["Include both a North Star KPI and an explicit Counter Metric."],
      expectedOutput: "A structured problem framing document with persona and metric definitions.",
      acceptanceCriteria: [
        "Articulates the 'all-or-nothing' notification fatigue problem clearly",
        "Defines an empathetic shopper persona with realistic constraints",
        "Proposes North Star metric (e.g. Push Opt-in Retention Rate) and Counter Metric (e.g. Daily Active Open Rate)",
      ],
      skills: ["Problem Framing", "User Personas", "North Star Metrics"],
      evidenceRequired: ["Problem statement", "Persona profile", "KPI and counter-metric"],
      validationRules: [
        { id: "pm-fre-t1-rule1", description: "North Star metric definition", type: "document_structure", expectedSnippet: "North Star" },
        { id: "pm-fre-t1-rule2", description: "Counter metric definition", type: "document_structure", expectedSnippet: "counter" },
      ],
      rubricWeight: 30,
      hints: ["A good counter-metric guards against unintended consequences (e.g. if marketing revenue drops drastically when quiet hours are introduced)."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "User Stories & Gherkin Acceptance Criteria (4 Stories)",
      type: "implementation",
      dimension: "PRD Specification & Acceptance Criteria",
      objective: "Author 4 complete user stories with Given/When/Then acceptance criteria.",
      context: "Write developer-ready specifications for engineering and QA.",
      prompt:
        "Write 4 User Stories in standard format (As a [user], I want [action], So that [benefit]):\nStory 1: Category Toggles (Promotions, Order Updates, Price Drops).\nStory 2: Quiet Hours Scheduler (Start time, End time, local time zone).\nStory 3: Urgent Transactional Override (Bypassing quiet hours for OTP / fraud alerts).\nStory 4: Frequency Cap Guardrail (Max 2 promotional pushes/day).\nFor EACH story, provide at least 1 testable scenario in Gherkin syntax (Given / When / Then).",
      constraints: ["Must include all 4 stories with valid Gherkin syntax."],
      expectedOutput: "4 fully detailed user stories with Gherkin acceptance criteria.",
      acceptanceCriteria: [
        "All 4 stories written in proper user story format",
        "Each story has at least one complete Given/When/Then acceptance test scenario",
        "Explicitly addresses local time zone handling and transactional overrides",
      ],
      skills: ["User Stories", "Gherkin Acceptance Criteria", "PRD Authoring"],
      evidenceRequired: ["4 complete user stories", "Gherkin test scenarios"],
      validationRules: [
        { id: "pm-fre-t2-rule1", description: "User story format", type: "document_structure", expectedSnippet: "As a" },
        { id: "pm-fre-t2-rule2", description: "Gherkin syntax", type: "document_structure", expectedSnippet: "Given" },
      ],
      rubricWeight: 45,
      hints: ["Gherkin format: Given a user has enabled Quiet Hours between 10 PM and 7 AM, When a promotional push is scheduled at 11 PM, Then the message is queued until 7:01 AM."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Edge Cases & Rollout Phasing (RICE Prioritization)",
      type: "communication",
      dimension: "Prioritization & Trade-off Defense",
      objective: "Identify edge cases and prioritize feature phases using the RICE framework.",
      context: "Prepare the phased engineering roadmap for sprint planning.",
      prompt:
        "Define edge cases and rollout phases:\n1. Identify 3 critical edge cases (e.g. User travels across time zones mid-quiet-hours, iOS system permission is disabled while in-app toggle is ON, rapid consecutive orders).\n2. Apply the RICE framework (Reach, Impact, Confidence, Effort) to rank MVP features vs Phase 2 features.\n3. Draft a 1-paragraph launch memo for Customer Support.",
      constraints: ["Provide RICE scoring logic for at least 3 features."],
      expectedOutput: "Edge cases analysis, RICE scoring table, and support launch memo.",
      acceptanceCriteria: [
        "Analyzes realistic mobile edge cases",
        "Provides clear RICE scoring justifying MVP scope vs Phase 2",
        "Includes concise, empathetic support memo for user inquiries",
      ],
      skills: ["RICE Prioritization", "Edge Case Analysis", "Product Operations"],
      evidenceRequired: ["Edge cases list", "RICE table", "Support memo"],
      validationRules: [
        { id: "pm-fre-t3-rule1", description: "RICE scoring", type: "document_structure", expectedSnippet: "RICE" },
        { id: "pm-fre-t3-rule2", description: "Edge cases discussion", type: "document_structure", expectedSnippet: "time zone" },
      ],
      rubricWeight: 25,
      hints: ["RICE Score = (Reach * Impact * Confidence) / Effort. Explain the scale you use for Impact (e.g. 0.5 to 3.0)."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy",
    description: "Submit comprehensive PRD document link with user stories, Gherkin specs, and RICE scoring.",
    fields: [
      { name: "prdUrl", label: "PRD Document URL (Notion / Google Docs)", type: "url", placeholder: "https://notion.so/skillforge/notification-preferences-prd", required: true, helpText: "Link to your formatted PRD document." },
      { name: "notes", label: "PRD Executive Summary & User Stories", type: "text", placeholder: "Paste your problem framing, 4 user stories with Gherkin criteria, and RICE table...", required: true, helpText: "Include your North Star KPIs, Gherkin scenarios, and edge case rules." },
    ],
    validationRules: [
      { id: "deliv-pm-fre-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "spec_completeness", name: "PRD Rigor & Gherkin Acceptance Criteria", weight: 40, description: "Completeness and clarity of 4 user stories, Gherkin scenarios, and transactional exemptions.", criteria: ["All 4 stories present", "Flawless Given/When/Then syntax", "Exhaustive acceptance criteria"] },
    { id: "problem_framing", name: "Problem Framing & Metric Selection", weight: 30, description: "Empathy for user friction and selection of rigorous North Star and Counter metrics.", criteria: ["Clear problem statement", "Realistic user persona", "Sound counter-metric design"] },
    { id: "prioritization", name: "Prioritization & Edge Case Rigor", weight: 30, description: "Mathematical soundness of RICE framework and thoroughness of edge case handling.", criteria: ["Realistic RICE scoring", "Complex mobile edge cases addressed", "Actionable support launch memo"] },
  ],
  hints: ["Make sure transactional notifications (like OTPs or delivery tracking) can never be accidentally silenced by marketing quiet hours."],
  progression: {
    onSuccess: {
      recommendedTrack: "PM",
      recommendedLevel: "junior",
      rationale: "Candidate demonstrated solid PRD writing and user empathy. Advance to Junior: B2B Monetization & Tiered Pricing PRD.",
    },
    onRemediation: {
      recommendedTrack: "PM",
      recommendedLevel: "fresher",
      targetSkill: "Gherkin Acceptance Criteria",
      rationale: "Practice writing unambiguous Given/When/Then test criteria before designing enterprise monetization models.",
    },
  },
};

export const PM_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-PM-JUN-001",
  version: "1.0.0",
  careerCode: "PM",
  level: "junior",
  title: "B2B SaaS Monetization & Self-Serve Tiered Pricing PRD",
  status: "active",
  roleContext: {
    roleTitle: "Product Manager (Monetization & Growth)",
    team: "Billing, Packaging & Self-Serve Revenue",
    companyContext: "B2B Developer Tooling SaaS with 80,000 active developers on the free tier.",
    reportingTo: "Head of Product",
  },
  scenario:
    "The executive board has mandated a transition from a generous pure freemium model to a self-serve tiered monetization structure (Starter, Professional, and Enterprise). Currently, 92% of active teams consume significant cloud compute on the free tier without ever hitting a monetization trigger. Recent sales data indicates high-value teams want to self-serve upgrade with a credit card instead of waiting for a 14-day enterprise sales cycle. You must design the packaging and pricing tiers, define the usage-based metering paywalls (API calls, team seats, retention history), write a PRD for the self-serve checkout upgrade flow, specify quantitative churn reduction and conversion targets, and author an executive launch memo.",
  businessContext:
    "Free tier infrastructure costs surged to ₹4,200,000/month while free-to-paid conversion languishes at 1.4%. Accelerating self-serve conversion to 3.5% is the primary company milestone for Series B fundraising.",
  objective:
    "Architect tiered feature packaging, write a self-serve checkout PRD with edge cases (proration, grace periods), model quantitative conversion and churn KPIs, and draft a C-suite alignment memo.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["SaaS pricing models (Seat-based, Usage-based, Hybrid)", "Self-serve checkout workflows (Stripe billing logic)", "Key metrics (CAC, LTV, Net Retention Rate, Churn)", "Executive memos"],
  learningOutcomes: [
    "Designing tiered SaaS packaging without alienating developer community goodwill",
    "Writing PRDs for payment checkout, proration, and subscription lifecycles",
    "Defining quantitative conversion funnels and churn mitigation guardrails",
    "Managing executive trade-offs between user growth and immediate monetization",
  ],
  skills: ["Monetization & Pricing", "PRD Authoring", "SaaS Packaging", "Funnel Analytics", "Executive Communication"],
  materials: [
    {
      id: "mat-pm-jun-1",
      title: "Free Tier Usage Distribution & Willingness-to-Pay Survey",
      type: "docs",
      description: "Survey data from 1,200 active developer teams and compute consumption logs.",
      filename: "monetization_survey_summary.md",
      relevance: "Used in Task 1 to set feature gates and paywall thresholds.",
      content: `## User Research Insights
1. Usage Distribution: 80% of teams use < 5,000 API calls/month. The top 12% consume 85% of all server compute (> 100,000 calls/month).
2. Willingness to Pay: 45% of surveyed engineering leads stated they would gladly expense a $49/seat or $99/team plan via corporate card to unlock team RBAC and 90-day log retention.
3. Top Requested Paid Features: SSO (Google/Okta), Custom Domains, 90-day audit logs, Priority Slack support.`,
    },
    {
      id: "mat-pm-jun-2",
      title: "Stripe Billing Lifecycle Rules & Proration Policy",
      type: "config",
      description: "Engineering requirements for handling plan upgrades and downgrades.",
      filename: "billing_lifecycle_rules.json",
      relevance: "Used in Task 2 to specify checkout and billing edge cases.",
      content: `{
  "billing_rules": {
    "upgrade_policy": "Immediate proration credit applied; tier benefits unlocked instantly",
    "downgrade_policy": "Effective at end of current billing cycle; data retained for 30 days before truncation",
    "dunning_period": "7-day grace period with 3 automated email reminders before workspace freeze"
  }
}`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Packaging Strategy & Tiered Paywall Matrix",
      type: "investigation",
      dimension: "Problem Framing & Customer Empathy",
      objective: "Design 3 distinct pricing tiers (Free, Pro, Enterprise) with defendable feature gates.",
      context: "Analyze monetization_survey_summary.md in Materials.",
      prompt:
        "Design the tiered packaging structure:\n1. Define the 3 Tiers: Free Developer, Professional Team ($49/month), and Enterprise (Custom/Contact Sales).\n2. Specify Feature Gates: Allocate API limits, seat counts, data retention duration, and SSO across the 3 tiers.\n3. Defend the Paywall Threshold: Why does setting the Free limit at 10,000 API calls/month protect 80% of hobbyists while effectively monetizing the top 20% high-compute teams?",
      constraints: ["Must include exact numeric limits and prices for all 3 tiers."],
      expectedOutput: "A structured pricing matrix table with feature gate defense.",
      acceptanceCriteria: [
        "Defines Free, Pro, and Enterprise tiers with explicit pricing and feature allocations",
        "Appropriately gates enterprise features (SSO, audit logs) behind higher tiers",
        "Justifies the API call threshold using the 80/20 compute consumption distribution",
      ],
      skills: ["SaaS Packaging", "Monetization Strategy", "Pricing Psychology"],
      evidenceRequired: ["Pricing tier table", "Feature gate defense"],
      validationRules: [
        { id: "pm-jun-t1-rule1", description: "Pricing tiers table", type: "document_structure", expectedSnippet: "Enterprise" },
        { id: "pm-jun-t1-rule2", description: "Feature gate justification", type: "document_structure", expectedSnippet: "retention" },
      ],
      rubricWeight: 30,
      hints: ["Keep SSO behind the Enterprise tier; this is the classic 'SSO Wall' that drives large companies to negotiate enterprise contracts."],
      timeEstimateMins: 18,
    },
    {
      id: 2,
      title: "Self-Serve Checkout & Billing Lifecycle PRD",
      type: "implementation",
      dimension: "PRD Specification & Acceptance Criteria",
      objective: "Write the functional PRD for in-app upgrade, Stripe payment modal, and billing lifecycle.",
      context: "Specify the user journey from paywall prompt to invoice generation.",
      prompt:
        "Author the Checkout & Billing PRD:\n1. User Flow: Detail the step-by-step upgrade flow (Trigger banner -> Plan selection -> Credit card input -> Instant tier unlock).\n2. Billing Edge Cases: Specify behavior for mid-month upgrade proration, card payment failure (7-day dunning), and plan downgrade.\n3. Cancellation UX: Design a 2-step cancellation flow with qualitative exit survey and pause-subscription option.",
      constraints: ["Must address all billing lifecycle rules (proration, dunning, cancellation)."],
      expectedOutput: "A complete functional PRD section covering the checkout lifecycle.",
      acceptanceCriteria: [
        "Clearly specifies seamless in-app credit card checkout experience",
        "Handles proration calculations and dunning grace periods accurately",
        "Designs constructive cancellation flow that gathers churn insights without hostile dark patterns",
      ],
      skills: ["PRD Authoring", "Billing UX", "Stripe Billing Workflows"],
      evidenceRequired: ["Functional PRD specification", "Billing edge case handling"],
      validationRules: [
        { id: "pm-jun-t2-rule1", description: "Proration handling", type: "document_structure", expectedSnippet: "proration" },
        { id: "pm-jun-t2-rule2", description: "Dunning period handling", type: "document_structure", expectedSnippet: "dunning" },
      ],
      rubricWeight: 40,
      hints: ["Never immediately lock users out when their card fails; provide a 7-day grace period so critical production APIs don't break."],
      timeEstimateMins: 24,
    },
    {
      id: 3,
      title: "Quantitative Targets & Executive Alignment Memo",
      type: "communication",
      dimension: "Executive Communication Clarity",
      objective: "Model quantitative conversion KPIs and author an executive memo for the CEO and CFO.",
      context: "Present the monetization rollout plan to executive leadership.",
      prompt:
        "Write an Executive Alignment Memo:\n1. Financial Projections: Calculate estimated monthly revenue if free-to-paid conversion increases from 1.4% to 3.0% across 80,000 teams ($49/month average).\n2. Success & Risk Metrics: Define conversion funnel targets (Paywall view -> Checkout started -> Paid) and Net Revenue Retention (NRR) target.\n3. Developer Community Risk Mitigation: How will leadership communicate this change to avoid developer backlash on HackerNews/Reddit?",
      constraints: ["Include explicit revenue calculation and community messaging strategy."],
      expectedOutput: "A structured C-suite memo with financial model and community communication plan.",
      acceptanceCriteria: [
        "Computes monthly incremental revenue projection correctly: ~2,400 paying teams * $49 = ~$117,600/month",
        "Outlines clear stage-by-stage funnel conversion targets",
        "Proposes transparent, generous developer grandfathering policy to prevent community backlash",
      ],
      skills: ["Executive Strategy", "Financial Modeling", "PR & Developer Relations"],
      evidenceRequired: ["Executive Memo", "Revenue projection calculation", "Grandfathering strategy"],
      validationRules: [
        { id: "pm-jun-t3-rule1", description: "Revenue calculation", type: "numerical", expectedSnippet: "117" },
        { id: "pm-jun-t3-rule2", description: "Memo structure", type: "document_structure", requiredSections: ["Financial", "Metrics", "Community"], minWordCount: 50 },
      ],
      rubricWeight: 30,
      hints: ["Grandfathering existing active free users with a 6-month grace period turns potential critics into loyal advocates."],
      timeEstimateMins: 18,
    },
  ],
  deliverable: {
    type: "Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy",
    description: "Submit comprehensive Monetization PRD document link and executive alignment memo.",
    fields: [
      { name: "prdUrl", label: "PRD Document URL", type: "url", placeholder: "https://notion.so/skillforge/tiered-monetization-prd", required: true, helpText: "Link to your formatted packaging and checkout PRD." },
      { name: "notes", label: "Executive Memo & Financial Calculations", type: "text", placeholder: "Paste your pricing tier matrix, Stripe lifecycle specifications, and financial model...", required: true, helpText: "Include your financial projections and developer community communication plan." },
    ],
    validationRules: [
      { id: "deliv-pm-jun-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "spec_completeness", name: "PRD Rigor & Billing Lifecycle Specification", weight: 40, description: "Technical completeness of checkout user flow, proration logic, dunning, and cancellation UX.", criteria: ["Comprehensive billing lifecycle", "Clean edge case handling", "Flawless checkout user journeys"] },
    { id: "problem_framing", name: "Packaging Strategy & Feature Paywalls", weight: 35, description: "Rigor of tier design based on customer usage distribution and willingness-to-pay insights.", criteria: ["Sound 3-tier structure", "Justified API limits", "Strategic enterprise feature gating"] },
    { id: "executive_clarity", name: "Executive Communication & Financial Modeling", weight: 25, description: "Clarity of C-suite memo, mathematical accuracy of revenue projections, and developer community empathy.", criteria: ["Accurate financial math", "Compelling executive memo", "Protective community grandfathering"] },
  ],
  hints: ["Ensure that you clearly separate plan upgrade proration (instant) from downgrade adjustments (end-of-cycle)."],
  progression: {
    onSuccess: {
      recommendedTrack: "PM",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent product commercialization and packaging. Advance to Senior: 12-Month Generative AI Copilot Strategy & Feasibility Roadmap.",
    },
    onRemediation: {
      recommendedTrack: "PM",
      recommendedLevel: "junior",
      targetSkill: "SaaS Packaging & Billing Lifecycle",
      rationale: "Review SaaS billing lifecycles and proration logic before managing large enterprise roadmaps.",
    },
  },
};

export const PM_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-PM-SEN-001",
  version: "1.0.0",
  careerCode: "PM",
  level: "senior",
  title: "12-Month Generative AI Copilot Strategy & Technical Feasibility Roadmap",
  status: "active",
  roleContext: {
    roleTitle: "Principal / Group Product Manager (AI Platform)",
    team: "Core Platform & Future Horizons",
    companyContext: "Enterprise Customer Experience (CX) SaaS platform generating ₹2,000,000,000 in annual recurring revenue.",
    reportingTo: "Chief Product Officer (CPO) & Board of Directors",
  },
  scenario:
    "The Board of Directors has demanded a comprehensive 12-month Generative AI Copilot product strategy to compete against market entrants. While sales leads are demanding immediate multi-modal agent capabilities, engineering leadership has cautioned that unconstrained LLM token usage will erode gross margins (GPU cloud inference costs could exceed 40% of ARR without strict caching and small-model routing). Furthermore, enterprise infosec buyers refuse to adopt the platform without zero-data-retention guarantees and strict prompt injection safety guardrails. You must author an executive AI product roadmap, formulate a unit economics model balancing gross margins with capability, specify safety and compliance guardrails, and defend your trade-offs in an executive decision memo for the CPO and Board.",
  businessContext:
    "Competitors are aggressively pitching 'AI First' support automation, putting ₹300,000,000 in enterprise renewals at risk. A rigorous product strategy balancing technical feasibility, unit economics, and safety is required.",
  objective:
    "Formulate an enterprise Generative AI Copilot strategy, model unit economics (token costs vs gross margins), design safety guardrails, and author an executive board decision memo.",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Generative AI architecture concepts (LLMs, Small Language Models, RAG, Prompt Caching)", "Unit economics & SaaS Gross Margin modeling", "AI Safety & Security (Prompt Injection, Data Privacy, EU AI Act)", "12-Month Product Roadmapping"],
  learningOutcomes: [
    "Architecting viable enterprise GenAI product strategies",
    "Modeling token economics and cloud inference cost impact on SaaS gross margins",
    "Designing multi-layer AI safety, data privacy, and compliance guardrails",
    "Defending strategic roadmaps to the Board of Directors and C-suite",
  ],
  skills: ["AI Product Strategy", "Unit Economics Modeling", "Roadmapping", "AI Safety & Governance", "Executive Leadership"],
  materials: [
    {
      id: "mat-pm-sen-1",
      title: "Inference Cost Modeling & LLM Token Telemetry",
      type: "docs",
      description: "Cost metrics comparing Frontier models (GPT-4 / Claude Opus) vs Small Open Models (Llama-3-8B) with caching.",
      filename: "llm_unit_economics_benchmark.md",
      relevance: "Used in Task 2 to model gross margin impact and token routing.",
      content: `## Model Economics Benchmark (per 1,000 conversations)
1. Frontier Model Only: 1,000 queries * 4,000 input tokens * $0.005/1k + 500 output tokens * $0.015/1k = $27.50 per 1,000 conversations.
2. Intelligent Cascaded Routing: 75% handled by Fine-tuned Llama-3-8B ($0.40/1k convos), 25% escalated to Frontier ($6.88/1k convos) = Blended Cost: $7.28 per 1,000 conversations (73.5% cost reduction!).
3. Prompt Caching Impact: 40% additional latency and cost reduction on repeated system prompt contexts.`,
    },
    {
      id: "mat-pm-sen-2",
      title: "Enterprise InfoSec & Safety Compliance Requirements",
      type: "docs",
      description: "Mandatory security standards required by Fortune 500 financial clients.",
      filename: "enterprise_infosec_ai_mandates.md",
      relevance: "Used in Task 1 and Task 3 to define safety guardrails.",
      content: `### Mandatory Enterprise Mandates
1. Zero Data Retention: Customer conversation telemetry must NEVER be retained by external foundation model providers for training.
2. Prompt Injection Defense: Must include automated input sanitization and output guardrails detecting jailbreaks and data exfiltration.
3. Hallucination Risk Disclaimers: Copilot actions affecting billing or customer records require explicit human-in-the-loop confirmation.`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "12-Month Phased Copilot Product Roadmap",
      type: "architecture",
      dimension: "PRD Specification & Acceptance Criteria",
      objective: "Formulate a phased 4-quarter roadmap (Q1: Copilot Assist -> Q2: Hybrid RAG -> Q3: Agentic Actions -> Q4: Autonomous Workflows).",
      context: "Balance customer value against technical engineering complexity.",
      prompt:
        "Architect the 12-month AI Copilot roadmap across 4 quarters:\n1. Q1 (Foundation & Summarization): Internal agent assist, ticket summarization, human-in-the-loop.\n2. Q2 (Enterprise Knowledge RAG): Semantic retrieval over private enterprise knowledge bases, citation grounding.\n3. Q3 (Multi-Turn Agent Actions): Read/write API tool-calling (Order refund, Address change) with human authorization.\n4. Q4 (Proactive Autonomous Resolution): Self-healing customer workflows with automated SLA tracking.\nFor EACH quarter, define: Core Deliverable, Technical Enablers, and Key Customer Milestones.",
      constraints: ["Must detail all 4 quarters with technical enablers and milestones."],
      expectedOutput: "A structured 4-quarter roadmap specification table with quarterly milestone definitions.",
      acceptanceCriteria: [
        "Clearly divides the 12-month horizon into logical progression from Assist to Autonomous",
        "Includes technical enablers (Prompt caching, Vector DBs, Tool-calling runtime)",
        "Defines objective customer value milestones for each quarter",
      ],
      skills: ["Product Roadmapping", "GenAI Architecture", "Technical Strategy"],
      evidenceRequired: ["4-Quarter Roadmap Table", "Technical enablers per phase"],
      validationRules: [
        { id: "pm-sen-t1-rule1", description: "Quarterly roadmap phases", type: "document_structure", expectedSnippet: "Q1" },
        { id: "pm-sen-t1-rule2", description: "Agentic action milestone", type: "document_structure", expectedSnippet: "Autonomous" },
      ],
      rubricWeight: 35,
      hints: ["Start with high-volume, low-risk use cases like Ticket Summarization in Q1 before granting write-action permissions in Q3."],
      timeEstimateMins: 25,
    },
    {
      id: 2,
      title: "Unit Economics Model: Cascaded Model Routing & Margin Protection",
      type: "implementation",
      dimension: "Prioritization & Trade-off Defense",
      objective: "Model the financial impact of GPU token consumption and defend cascaded model routing.",
      context: "Analyze llm_unit_economics_benchmark.md in Materials.",
      prompt:
        "Formulate the GenAI Unit Economics model:\n1. The Problem: Show how routing 100% of queries to frontier models at $27.50/1k convos erodes gross margin to < 50% for a $500/month customer with 25,000 conversations.\n2. The Solution (Cascaded Routing): Model the blended economics of routing 75% of routine queries to fine-tuned Llama-3-8B and 25% to frontier models, restoring gross margin to > 78%.\n3. Packaging & Add-On Pricing: Recommend whether the AI Copilot should be bundled into base seats or sold as a consumption-based credit pack (e.g. $100/10k AI actions).",
      constraints: ["Show step-by-step financial margin arithmetic."],
      expectedOutput: "A mathematical unit economics model with pricing and margin defense.",
      acceptanceCriteria: [
        "Calculates unconstrained frontier model cost vs revenue correctly",
        "Proves that cascaded routing preserves > 75% SaaS gross margins",
        "Justifies consumption credit pack packaging to prevent runaway GPU infrastructure liability",
      ],
      skills: ["Unit Economics", "Financial Modeling", "Pricing Architecture"],
      evidenceRequired: ["Financial calculation table", "Cascaded routing margin proof", "Packaging recommendation"],
      validationRules: [
        { id: "pm-sen-t2-rule1", description: "Cascaded routing calculation", type: "numerical", expectedSnippet: "7.28" },
        { id: "pm-sen-t2-rule2", description: "Gross margin defense", type: "numerical", expectedSnippet: "78" },
      ],
      rubricWeight: 35,
      hints: ["In B2B SaaS, gross margins must remain above 75% for healthy enterprise valuation; consumption packs protect against extreme usage outliers."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "AI Safety, Privacy Guardrails & Executive Board Decision Memo",
      type: "communication",
      dimension: "Executive Communication Clarity",
      objective: "Author an executive decision memo addressing safety, compliance, and enterprise market positioning.",
      context: "Present final strategy to CPO and Board of Directors.",
      prompt:
        "Author the Executive Board Decision Memo:\n1. Executive Summary & Strategic Rationale.\n2. Safety & Compliance Architecture: How will the system enforce Zero Data Retention, prompt injection defense, and human-in-the-loop authorization for sensitive actions?\n3. Key Strategic Risks & Mitigation: (E.g. Foundation model vendor lock-in, hallucination liability).\n4. Board Investment Ask: Headcount, GPU infrastructure budget, and expected Year-1 ARR impact.",
      constraints: ["Format with executive precision and board-level brevity."],
      expectedOutput: "A formal executive decision memo with safety architecture and investment ask.",
      acceptanceCriteria: [
        "Articulates compelling C-suite business case for AI Copilot",
        "Outlines comprehensive multi-layer safety guardrails",
        "Directly addresses enterprise infosec compliance (Zero Data Retention)",
        "Includes concrete ROI and Year-1 revenue projections",
      ],
      skills: ["Executive Strategy", "Board Presentation", "AI Safety & Governance"],
      evidenceRequired: ["Executive Board Decision Memo"],
      validationRules: [
        { id: "pm-sen-t3-rule1", description: "Zero data retention", type: "document_structure", expectedSnippet: "Zero Data Retention" },
        { id: "pm-sen-t3-rule2", description: "Board memo structure", type: "document_structure", requiredSections: ["Summary", "Safety", "Risks", "Investment"], minWordCount: 55 },
      ],
      rubricWeight: 30,
      hints: ["Reassure the board that by using open weights with vLLM/Triton for tier-1 routine queries, the company avoids vendor lock-in with OpenAI or Anthropic."],
      timeEstimateMins: 30,
    },
  ],
  deliverable: {
    type: "Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy",
    description: "Submit 12-Month GenAI Copilot Roadmap, Unit Economics Model, and Executive Board Memo.",
    fields: [
      { name: "prdUrl", label: "Strategy Deck / Roadmap URL", type: "url", placeholder: "https://notion.so/skillforge/ai-copilot-strategy-roadmap", required: true, helpText: "Link to your 12-month product roadmap and unit economics workbook." },
      { name: "notes", label: "Executive Board Decision Memo", type: "text", placeholder: "Paste your 4-quarter roadmap, cascaded margin calculations, and Board memo...", required: true, helpText: "Include your unit economics model, safety architecture, and board investment ask." },
    ],
    validationRules: [
      { id: "deliv-pm-sen-1", description: "URL format", type: "code_static", expectedSnippet: "http" },
    ],
  },
  rubric: [
    { id: "spec_completeness", name: "12-Month Phased Roadmap & Technical Feasibility", weight: 35, description: "Depth and engineering feasibility of 4-quarter roadmap from Assist to Autonomous Agent.", criteria: ["Pragmatic quarterly phasing", "Robust technical enablers", "Clear customer milestone definitions"] },
    { id: "prioritization", name: "Unit Economics & Cascaded Model Architecture", weight: 35, description: "Mathematical rigor of token inference costs, cascaded model routing, and margin defense.", criteria: ["Accurate financial modeling", "Viable cascaded routing strategy", "Sound credit-pack packaging defense"] },
    { id: "executive_clarity", name: "Executive Board Memo & Safety Governance", weight: 30, description: "Executive presence of board memo, thoroughness of AI safety guardrails, and compliance.", criteria: ["Board-level communication rigor", "Zero Data Retention adherence", "Realistic enterprise ROI projections"] },
  ],
  hints: ["Ensure that you explicitly address the human-in-the-loop confirmation requirement for irreversible customer actions."],
  progression: {
    onSuccess: {
      recommendedTrack: "SALES",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated master-level product strategy and commercial acumen. Cross-track advance: Senior Enterprise Sales & RFP Negotiation Strategy.",
    },
    onRemediation: {
      recommendedTrack: "PM",
      recommendedLevel: "senior",
      targetSkill: "GenAI Unit Economics & Roadmapping",
      rationale: "Review LLM token economics and cascaded small-model architectures before leading enterprise AI platform strategies.",
    },
  },
};
