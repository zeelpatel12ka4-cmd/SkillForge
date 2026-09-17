/**
 * SkillForge AI — Canonical Career Registry
 * Single source of truth for career tracks, competencies, and progression rules.
 */

import { CareerCode, SeniorityLevel } from "@/types/simulation";

export interface CareerProgressionRule {
  level: SeniorityLevel;
  minReadinessScore: number;
  expectedDeliverableScope: string;
  recommendedNextLevel?: SeniorityLevel;
}

export interface CareerDefinition {
  code: CareerCode;
  aliases: string[];
  name: string;
  badge: string;
  emoji: string;
  color: string;
  image: string;
  description: string;
  skills: string[];
  roleType: "engineering" | "data" | "design" | "security" | "product" | "growth" | "revenue";
  taskModes: string[];
  availableLevels: SeniorityLevel[];
  submissionType: string;
  materialsPreview: string[];
  rubricDimensions: { id: string; name: string; defaultWeight: number }[];
  progressionRules: Record<SeniorityLevel, CareerProgressionRule>;
}

export const CANONICAL_CAREERS: Record<CareerCode, CareerDefinition> = {
  SD: {
    code: "SD",
    aliases: ["SWE", "DEV", "SOFTWARE", "ENGINEERING", "DEVOPS", "DO"],
    name: "Software Developer",
    badge: "Core Engineering",
    emoji: "💻",
    color: "#6366F1",
    image: "/images/swe-simulation.jpg",
    description: "Build scalable backend APIs and resilient services. Diagnose memory leaks, manage distributed concurrency, and deliver production patches.",
    skills: ["TypeScript", "Node.js", "System Design", "SQL", "Git", "Unit Testing", "Distributed Locks", "Backpressure"],
    roleType: "engineering",
    taskModes: ["code_patch", "architecture_memo", "github_repo", "post_mortem"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Public GitHub Repository URL + Architecture Write-up",
    materialsPreview: ["Starter Sandbox Repo", "JVM / Node Error Logs", "OpenAPI Specification", "Database Schema & Query Plan"],
    rubricDimensions: [
      { id: "technical_correctness", name: "Technical Correctness", defaultWeight: 30 },
      { id: "problem_solving", name: "Problem-Solving & Root Cause Analysis", defaultWeight: 25 },
      { id: "architecture", name: "Architecture & Scale Resiliency", defaultWeight: 20 },
      { id: "code_quality", name: "Code Quality & Testing", defaultWeight: 15 },
      { id: "communication", name: "Engineering Communication", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "API null-safety patch · 6 Unit tests", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Reactive stream handler · Backpressure buffer · Canary post-mortem", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "Distributed Redlock · Idempotency keys · Eventual consistency model" },
    },
  },

  DA: {
    code: "DA",
    aliases: ["DATA", "ANALYST", "BI", "ANALYTICS"],
    name: "Data Analyst",
    badge: "Business Intelligence",
    emoji: "📊",
    color: "#0EA5E9",
    image: "/images/data-simulation.jpg",
    description: "Transform unstructured raw metrics into business intelligence. Perform cohort retention, query optimization, and build executive dashboards.",
    skills: ["SQL", "Python", "Cohort Analysis", "Tableau", "Excel", "Hypothesis Testing", "Data Munging", "Attribution Modeling"],
    roleType: "data",
    taskModes: ["cleaned_dataset", "sql_queries", "executive_dashboard", "insight_deck"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Cleaned CSV / Report Upload + Dashboard Link (Tableau/PowerBI/Colab)",
    materialsPreview: ["Raw CSV Transaction Logs (50,000 orders)", "Data Dictionary & ERD", "Stakeholder Requirements", "Dashboard Metric Wireframe"],
    rubricDimensions: [
      { id: "data_integrity", name: "Data Integrity & Cleaning", defaultWeight: 25 },
      { id: "analytical_rigor", name: "Analytical Rigor & Statistics", defaultWeight: 30 },
      { id: "query_optimization", name: "SQL & Query Structure", defaultWeight: 20 },
      { id: "business_acumen", name: "Business Acumen & Recommendations", defaultWeight: 15 },
      { id: "visualization", name: "Visualization & Reporting", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "Reconciled CSV logs · MRR retention calculations", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Checkout drop-off funnel · Chi-square significance · Friction triage", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "Algorithmic Shapley attribution · Markov chains · ₹20M budget shift" },
    },
  },

  UX: {
    code: "UX",
    aliases: ["UI", "DESIGN", "PRODUCT_DESIGN", "UIUX"],
    name: "UI / UX Designer",
    badge: "Product Design",
    emoji: "🎨",
    color: "#EC4899",
    image: "/images/ux-simulation.jpg",
    description: "Craft human-centered experiences from wireframe to interactive design systems. Address usability friction and accessibility standards.",
    skills: ["Figma", "Design Systems", "Accessibility (WCAG 2.1 AA)", "Prototyping", "Information Architecture", "Micro-Interactions", "Token Architecture"],
    roleType: "design",
    taskModes: ["figma_prototype", "design_tokens", "accessibility_audit", "design_rationale"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Figma Prototype URL + Design Rationale & Assets Upload",
    materialsPreview: ["Design System Component Tokens", "User Interview Recordings & Personas", "Usability Audit Heuristics", "Screen Flow Wireframes"],
    rubricDimensions: [
      { id: "interaction_design", name: "Interaction Design & Usability", defaultWeight: 30 },
      { id: "accessibility", name: "Accessibility & WCAG Compliance", defaultWeight: 25 },
      { id: "design_system", name: "Design System Architecture & Tokens", defaultWeight: 20 },
      { id: "visual_hierarchy", name: "Visual Hierarchy & Information Flow", defaultWeight: 15 },
      { id: "design_rationale", name: "Annotated Design Rationale", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "Mobile onboarding flow · WCAG AA contrast matrix · Input validation UX", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "B2B SaaS analytics grid · Filter drawer sheet · High-density UI tokens", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "Multi-tenant RBAC platform UI · Multi-platform token engine · Governance spec" },
    },
  },

  AI: {
    code: "AI",
    aliases: ["ML", "DATA_SCIENCE", "AIML", "MACHINE_LEARNING"],
    name: "AI / ML Engineer",
    badge: "Machine Learning",
    emoji: "🤖",
    color: "#8B5CF6",
    image: "/images/ai-simulation.jpg",
    description: "Build, fine-tune, and deploy machine learning models and LLM agent workflows for enterprise-scale workloads.",
    skills: ["Python", "PyTorch", "LoRA Fine-tuning", "RAG Pipelines", "Vector DBs", "MLOps", "Model Drift", "Triton Inference"],
    roleType: "engineering",
    taskModes: ["colab_notebook", "rag_pipeline", "metrics_report", "inference_api"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Google Colab / GitHub Notebook URL + Evaluation Metrics Report",
    materialsPreview: ["Training & Validation Dataset", "Baseline PyTorch Architecture", "Vector Retrieval Logs", "Inference Latency Profile"],
    rubricDimensions: [
      { id: "modeling_technique", name: "Modeling Technique & Algorithms", defaultWeight: 30 },
      { id: "evaluation_metrics", name: "Evaluation Metrics & Validation", defaultWeight: 25 },
      { id: "pipeline_architecture", name: "Pipeline Architecture & Retrieval", defaultWeight: 20 },
      { id: "latency_optimization", name: "Inference Latency & Efficiency", defaultWeight: 15 },
      { id: "reproducibility", name: "Code Cleanliness & Reproducibility", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "Class imbalance correction · AUC-ROC > 0.88 · Baseline classifier pipeline", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Domain RAG chunking · Vector similarity search · Hallucination benchmark", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "Triton inference server · Real-time drift telemetry · p99 < 25ms SLA" },
    },
  },

  CYBER: {
    code: "CYBER",
    aliases: ["CS", "SECURITY", "SECOPS", "INFOSEC"],
    name: "Cyber Security",
    badge: "SecOps",
    emoji: "🔒",
    color: "#F43F5E",
    image: "/images/security-simulation.jpg",
    description: "Defend production infrastructure against modern vulnerabilities. Triage alerts, analyze packet dumps, and patch zero-days.",
    skills: ["OWASP Top 10", "Incident Triage", "PCAP Analysis", "Linux Hardening", "SIEM", "Zero-Trust", "Remediation", "IAM"],
    roleType: "security",
    taskModes: ["incident_report", "forensics_timeline", "code_patch", "zero_trust_policy"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Incident Triage Report (PDF) + Security Remediation Patch",
    materialsPreview: ["PCAP Network Packet Capture", "SIEM Splunk Alert Telemetry", "Vulnerable Microservice Source Code", "VPC Architecture Diagram"],
    rubricDimensions: [
      { id: "threat_identification", name: "Threat Identification & Triage", defaultWeight: 30 },
      { id: "remediation_quality", name: "Remediation & Patch Soundness", defaultWeight: 30 },
      { id: "forensic_analysis", name: "Forensic Analysis & Traceability", defaultWeight: 20 },
      { id: "defense_in_depth", name: "Defense in Depth & Zero-Trust", defaultWeight: 10 },
      { id: "incident_reporting", name: "Incident Reporting & Advisory", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "SQL injection vulnerability patch · Prepared statements · Vulnerability advisory", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "VPC lateral isolation · Ransomware timeline · Immediate containment playbook", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "Compromised dependency triage · Malicious exfiltration analysis · Zero-trust policy" },
    },
  },

  PM: {
    code: "PM",
    aliases: ["PRODUCT", "PRODUCT_MANAGER", "PROD_MGMT"],
    name: "Product Manager",
    badge: "Product Strategy",
    emoji: "🗂️",
    color: "#10B981",
    image: "/images/pm-simulation.jpg",
    description: "Drive cross-functional product direction. Translate user needs into rigorous PRDs, North Star metrics, and release strategies.",
    skills: ["Product Specs (PRD)", "User Research", "Prioritization (RICE)", "Metrics & KPIs", "Roadmapping", "Unit Economics", "Stakeholder Alignment"],
    roleType: "product",
    taskModes: ["prd_document", "user_stories", "experiment_design", "executive_memo"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy",
    materialsPreview: ["User Interview Transcripts & Churn Telemetry", "Mixpanel Funnel Drops", "Competitor Feature Comparison", "Executive Memo"],
    rubricDimensions: [
      { id: "problem_framing", name: "Problem Framing & Customer Empathy", defaultWeight: 25 },
      { id: "spec_completeness", name: "PRD Specification & Acceptance Criteria", defaultWeight: 30 },
      { id: "metric_definition", name: "Metric Definition & Success Criteria", defaultWeight: 20 },
      { id: "prioritization", name: "Prioritization & Trade-off Defense", defaultWeight: 15 },
      { id: "executive_clarity", name: "Executive Communication Clarity", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "Push notification PRD · 4 User stories with Gherkin acceptance criteria", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Tiered pricing PRD · Self-serve upgrade flow · Quantitative churn reduction targets", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "12-Month GenAI copilot strategy · GPU unit economics · Safety guardrails roadmap" },
    },
  },

  DM: {
    code: "DM",
    aliases: ["MARKETING", "DIGITAL_MARKETING", "GROWTH", "PERFORMANCE_MARKETING"],
    name: "Digital Marketing",
    badge: "Growth & Acquisition",
    emoji: "📢",
    color: "#F59E0B",
    image: "/images/marketing-simulation.jpg",
    description: "Orchestrate multi-channel acquisition campaigns. Optimize conversion rates, ad spend efficiency, and content flywheels.",
    skills: ["SEO Strategy", "Google Ads", "Meta Ads", "Funnel Analytics", "Copywriting", "Attribution", "CAC Optimization", "Core Web Vitals"],
    roleType: "growth",
    taskModes: ["growth_deck", "ad_copy_sheet", "seo_audit", "attribution_model"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet",
    materialsPreview: ["Google Ads & Meta Campaign Telemetry", "Ad Creative Variants & Angles", "Landing Page Heatmaps", "Search Console Crawl Dump"],
    rubricDimensions: [
      { id: "campaign_strategy", name: "Campaign Strategy & Targeting", defaultWeight: 30 },
      { id: "funnel_economics", name: "Funnel Economics & CAC Efficiency", defaultWeight: 25 },
      { id: "content_creative", name: "Content Strategy & Copywriting", defaultWeight: 20 },
      { id: "technical_seo", name: "Technical Optimization & Search Intent", defaultWeight: 15 },
      { id: "data_measurement", name: "Measurement & Reporting Rigor", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "3 High-converting Meta ad variants · Audience targeting breakdown", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Search intent keyword clusters · Technical crawl audit · Landing page copy", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "₹5M budget reallocation model · Multi-channel CAC cut · LTV payback forecast" },
    },
  },

  SALES: {
    code: "SALES",
    aliases: ["SA", "REVOPS", "SOLUTIONS", "ACCOUNT_EXECUTIVE", "ENTERPRISE_SALES"],
    name: "Sales / Solutions",
    badge: "Enterprise Revenue",
    emoji: "💼",
    color: "#F97316",
    image: "/images/sales-simulation.jpg",
    description: "Master high-stakes enterprise conversations. Handle aggressive pushbacks, articulate ROI, and engineer closing strategies.",
    skills: ["Enterprise Discovery", "BANT Qualification", "Objection Handling", "TCO / ROI Modeling", "Negotiation", "RFP Close Plans", "Security Compliance Rebuttals"],
    roleType: "revenue",
    taskModes: ["discovery_notes", "objection_playbook", "tco_model", "proposal_deck"],
    availableLevels: ["fresher", "junior", "senior"],
    submissionType: "Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence",
    materialsPreview: ["Prospect Enterprise Profile & Tech Stack", "Discovery Call Audio Transcript", "Competitive Pricing Battlecard", "Security Questionnaire"],
    rubricDimensions: [
      { id: "discovery_qualification", name: "Discovery & Opportunity Qualification", defaultWeight: 25 },
      { id: "objection_rebuttal", name: "Objection Handling & Value Defense", defaultWeight: 30 },
      { id: "financial_justification", name: "Financial Justification & TCO/ROI", defaultWeight: 20 },
      { id: "solution_architecture", name: "Solution Alignment & Tech Positioning", defaultWeight: 15 },
      { id: "closing_cadence", name: "Closing Cadence & Executive Presence", defaultWeight: 10 },
    ],
    progressionRules: {
      fresher: { level: "fresher", minReadinessScore: 70, expectedDeliverableScope: "BANT qualification scorecard · CRM opportunity notes · Next-step email", recommendedNextLevel: "junior" },
      junior: { level: "junior", minReadinessScore: 78, expectedDeliverableScope: "Enterprise competitor objection playbook · 3-Year TCO financial justification", recommendedNextLevel: "senior" },
      senior: { level: "senior", minReadinessScore: 88, expectedDeliverableScope: "₹500K RFP negotiation close plan · Procurement info-sec defense · Multi-threaded champion strategy" },
    },
  },
};

/**
 * Normalizes input track code or alias into one of the 8 canonical CareerCodes.
 */
export function normalizeTrackCode(input: string): CareerCode {
  if (!input) return "SD";
  const upper = input.toUpperCase().trim();

  // Direct match
  if (upper in CANONICAL_CAREERS) {
    return upper as CareerCode;
  }

  // Alias lookup
  for (const [code, career] of Object.entries(CANONICAL_CAREERS)) {
    if (career.aliases.includes(upper)) {
      return code as CareerCode;
    }
  }

  // Default fallback to SD
  return "SD";
}

/**
 * Returns canonical career definition for given track code or alias.
 */
export function getCanonicalCareer(codeOrAlias: string): CareerDefinition {
  const code = normalizeTrackCode(codeOrAlias);
  const career = CANONICAL_CAREERS[code];
  if (!career) {
    throw new Error(`SIMULATION_NOT_CONFIGURED: Unrecognized career track '${codeOrAlias}'`);
  }
  return career;
}

/**
 * Returns all 8 canonical career definitions.
 */
export function getAllCareers(): CareerDefinition[] {
  return Object.values(CANONICAL_CAREERS);
}
