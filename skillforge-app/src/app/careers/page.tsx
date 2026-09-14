"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";

interface Track {
  emoji: string;
  name: string;
  code: string;
  badge: string;
  color: string;
  skills: string[];
  desc: string;
  materialsPreview: string[];
  submissionType: string;
  levels: {
    fresher: { title: string; desc: string; time: string; scope: string };
    junior: { title: string; desc: string; time: string; scope: string };
    senior: { title: string; desc: string; time: string; scope: string };
  };
  image?: string;
}

const TRACKS: Track[] = [
  {
    emoji: "💻",
    name: "Software Developer",
    code: "SD",
    badge: "Core Engineering",
    color: "#6366F1",
    image: "/images/swe-simulation.jpg",
    skills: ["TypeScript", "Node.js", "System Design", "SQL", "Git", "Testing"],
    desc: "Build scalable backend APIs and web applications. Diagnose production memory leaks, optimize concurrency, and submit code via GitHub.",
    materialsPreview: ["Starter Repository (Git clone)", "Production JVM/Node Error Logs", "OpenAPI Spec & Schemas", "Database Query Execution Plan"],
    submissionType: "Public GitHub Repository URL + Architecture Write-up",
    levels: {
      fresher: {
        title: "API Validation & Unit Test Coverage",
        desc: "Diagnose failing signup API endpoints, fix null-pointer edge cases, and add passing unit tests.",
        time: "45 mins",
        scope: "Validator patch · 6 Unit tests"
      },
      junior: {
        title: "Production Incident: Memory Leak & Streaming Fix",
        desc: "Resolve OutOfMemoryError during 50MB uploads, refactor to chunked streaming, and write a hotfix proposal.",
        time: "60 mins",
        scope: "Stream handler · Backpressure · Canary strategy"
      },
      senior: {
        title: "High-Throughput Flash Sale: Distributed Concurrency Bug",
        desc: "Prevent inventory overselling under 25,000 req/sec race condition using distributed locking & idempotency keys.",
        time: "90 mins",
        scope: "Redis Redlock · Lua script · Eventual consistency"
      }
    }
  },
  {
    emoji: "📊",
    name: "Data Analyst",
    code: "DA",
    badge: "Business Intelligence",
    color: "#0EA5E9",
    image: "/images/data-simulation.jpg",
    skills: ["SQL", "Python", "Cohort Analysis", "Tableau", "Excel", "A/B Testing"],
    desc: "Transform unstructured raw metrics into business intelligence. Perform cohort retention, query optimization, and build executive dashboards.",
    materialsPreview: ["Raw CSV Dataset (50,000 orders)", "Data Dictionary & Schema", "Stakeholder Business Questions", "Executive Template"],
    submissionType: "Cleaned CSV / Report Upload + Dashboard Link (Tableau/PowerBI/Colab)",
    levels: {
      fresher: {
        title: "Customer Churn Data Cleanup & KPI Aggregation",
        desc: "Clean raw transaction logs, handle missing values, and calculate Monthly Recurring Revenue (MRR) retention rate.",
        time: "45 mins",
        scope: "Data munging · Null handling · MRR metrics"
      },
      junior: {
        title: "E-Commerce Funnel Drop-off Analysis & Cohorts",
        desc: "Identify checkout funnel drop-offs across mobile vs web platforms and produce statistical hypothesis test results.",
        time: "60 mins",
        scope: "Funnel drop-off · Chi-square test · Mobile segmentation"
      },
      senior: {
        title: "Multi-Touch Attribution Model & Predictive LTV",
        desc: "Build algorithmic attribution model comparing first-click vs Shapley value attribution for a ₹20M marketing budget.",
        time: "90 mins",
        scope: "Shapley values · Markov chain · Budget re-allocation"
      }
    }
  },
  {
    emoji: "🎨",
    name: "UI / UX Designer",
    code: "UX",
    badge: "Product Design",
    color: "#EC4899",
    image: "/images/ux-simulation.jpg",
    skills: ["Figma", "Design Systems", "Accessibility (WCAG)", "Prototyping", "Wireframing"],
    desc: "Craft human-centered experiences from wireframe to interactive design systems. Address usability friction and accessibility standards.",
    materialsPreview: ["Design System Component Tokens", "User Interview Recordings & Personas", "Usability Audit Heuristics"],
    submissionType: "Figma Prototype URL + Design Rationale & Assets Upload",
    levels: {
      fresher: {
        title: "Mobile Onboarding Flow & Form UX Overhaul",
        desc: "Redesign multi-step mobile registration with micro-interactions and WCAG AA color contrast compliance.",
        time: "45 mins",
        scope: "3 Screen flows · Input validation UX · Contrast audit"
      },
      junior: {
        title: "B2B SaaS Analytics Dashboard & Design System",
        desc: "Design responsive data grid, filter drawer, and data visualization cards following modular design tokens.",
        time: "60 mins",
        scope: "Responsive grid · Filter sheet · High-density UI"
      },
      senior: {
        title: "Complex Multi-Tenant Platform Architecture",
        desc: "Architect scalable enterprise permissioning UI, cross-platform design token engine, and comprehensive design audit.",
        time: "90 mins",
        scope: "Enterprise RBAC · Global token schema · Usability heuristics"
      }
    }
  },
  {
    emoji: "🤖",
    name: "AI / ML Engineer",
    code: "AI",
    badge: "Machine Learning",
    color: "#8B5CF6",
    image: "/images/ai-simulation.jpg",
    skills: ["Python", "PyTorch", "LoRA Fine-tuning", "RAG Pipelines", "Vector DBs", "MLOps"],
    desc: "Build, fine-tune, and deploy machine learning models and LLM agent workflows for enterprise-scale workloads.",
    materialsPreview: ["Training / Validation Dataset", "Baseline PyTorch Architecture", "MLflow Metric Logs", "Inference Latency Profile"],
    submissionType: "GitHub / Google Colab Notebook URL + Evaluation Metrics Report",
    levels: {
      fresher: {
        title: "Tabular Classification & Feature Engineering",
        desc: "Handle class imbalance using SMOTE/focal loss, engineer polynomial features, and evaluate ROC-AUC.",
        time: "45 mins",
        scope: "Imbalance correction · AUC-ROC > 0.85 · Baseline model"
      },
      junior: {
        title: "Fine-Tuning Domain LLM with LoRA & RAG Pipeline",
        desc: "Build a retrieval-augmented generation pipeline with vector search and optimize chunking strategy.",
        time: "60 mins",
        scope: "LoRA weights · Qdrant retrieval · ROUGE-L evaluation"
      },
      senior: {
        title: "Production Model Drift Detection & Distributed Serving",
        desc: "Architect real-time drift monitoring with EvidentlyAI and optimize Triton inference latency under p99 SLAs.",
        time: "90 mins",
        scope: "Data drift telemetry · Triton inference server · p99 < 30ms"
      }
    }
  },
  {
    emoji: "🔒",
    name: "Cyber Security",
    code: "CS",
    badge: "SecOps",
    color: "#F43F5E",
    image: "/images/security-simulation.jpg",
    skills: ["OWASP Top 10", "Incident Triage", "PCAP Analysis", "Linux Hardening", "SIEM"],
    desc: "Defend production infrastructure against modern vulnerabilities. Triage alerts, analyze packet dumps, and patch zero-days.",
    materialsPreview: ["PCAP Network Packet Capture", "SIEM Splunk Alert Logs", "Vulnerable Microservice Source Code"],
    submissionType: "Incident Triage Report (PDF) + Security Remediation Patch",
    levels: {
      fresher: {
        title: "OWASP Top 10 Audit & SQLi Vulnerability Patch",
        desc: "Identify parameter injection vulnerability in auth service, patch with prepared statements, and document findings.",
        time: "45 mins",
        scope: "SQL injection patch · Prepared statements · Verification"
      },
      junior: {
        title: "Live Ransomware Containment & Incident Response",
        desc: "Analyze lateral movement in compromised VPC, isolate malicious processes, and write immediate containment playbook.",
        time: "60 mins",
        scope: "Network isolation · Forensic log analysis · Post-incident runbook"
      },
      senior: {
        title: "Zero-Trust Architecture & Supply Chain Attack Triage",
        desc: "Investigate compromised npm dependency, trace malicious exfiltration channels, and overhaul zero-trust boundaries.",
        time: "90 mins",
        scope: "Supply-chain audit · Reverse engineering · Zero-trust policy"
      }
    }
  },
  {
    emoji: "🗂️",
    name: "Product Manager",
    code: "PM",
    badge: "Product Strategy",
    color: "#10B981",
    image: "/images/pm-simulation.jpg",
    skills: ["Product Specs (PRD)", "User Research", "Prioritization", "Metrics", "Roadmapping"],
    desc: "Drive cross-functional product direction. Translate user needs into rigorous PRDs, North Star metrics, and release strategies.",
    materialsPreview: ["Customer Churn Interviews", "Mixpanel Usage Funnels", "Competitor Feature Matrix"],
    submissionType: "Comprehensive PRD Document (Doc / Notion Link) + Executive Strategy",
    levels: {
      fresher: {
        title: "Feature Specification: Push Notification Engine",
        desc: "Write complete user stories, acceptance criteria, and edge cases for a user engagement notification center.",
        time: "45 mins",
        scope: "User stories · Acceptance criteria · Edge cases"
      },
      junior: {
        title: "B2B Monetization & Self-Serve Billing PRD",
        desc: "Design tiered pricing plans, checkout upgrade flow, and define quantitative churn reduction targets.",
        time: "60 mins",
        scope: "Tiered pricing spec · Self-serve onboarding · Churn KPIs"
      },
      senior: {
        title: "AI Copilot Strategy & Technical Feasibility Roadmap",
        desc: "Lead 12-month generative AI product strategy balancing GPU operational costs, safety guardrails, and customer ROI.",
        time: "90 mins",
        scope: "12-month roadmap · Unit economics · Safety guardrails"
      }
    }
  },
  {
    emoji: "📢",
    name: "Digital Marketing",
    code: "DM",
    badge: "Growth & Acquisition",
    color: "#F59E0B",
    image: "/images/marketing-simulation.jpg",
    skills: ["SEO Strategy", "Google Ads", "Meta Ads", "Funnel Analytics", "Copywriting"],
    desc: "Orchestrate multi-channel acquisition campaigns. Optimize conversion rates, ad spend efficiency, and content flywheels.",
    materialsPreview: ["Google Ads Campaign Performance Data", "Creative Ad Copy Variants", "Landing Page Heatmaps"],
    submissionType: "Growth Strategy Deck (PDF / Slide Link) + Ad Copy Sheet",
    levels: {
      fresher: {
        title: "Meta Ads Audience Targeting & Creative Copy",
        desc: "Build 3 high-converting ad angle variants and structure lookalike audiences for a D2C product launch.",
        time: "45 mins",
        scope: "3 Ad creatives · Audience segmentation · Copy angles"
      },
      junior: {
        title: "Search Intent Keyword Matrix & Technical SEO",
        desc: "Perform SERP gap analysis, resolve crawling indexation issues, and optimize high-intent landing pages.",
        time: "60 mins",
        scope: "Technical SEO audit · Keyword cluster · Core Web Vitals"
      },
      senior: {
        title: "Omnichannel Growth Playbook & CAC Optimization",
        desc: "Reallocate ₹5M monthly marketing budget across paid search, influencer loops, and lifecycle retention to drop CAC by 35%.",
        time: "90 mins",
        scope: "Budget reallocation · CAC reduction · LTV/CAC model"
      }
    }
  },
  {
    emoji: "💼",
    name: "Sales",
    code: "SA",
    badge: "Enterprise Revenue",
    color: "#F97316",
    image: "/images/sales-simulation.jpg",
    skills: ["Enterprise Discovery", "Objection Handling", "Negotiation", "CRM", "Closing"],
    desc: "Master high-stakes enterprise conversations. Handle aggressive pushbacks, articulate ROI, and engineer closing strategies.",
    materialsPreview: ["Prospect Enterprise Profile & Tech Stack", "Recorded Discovery Call Audio Transcript", "Pricing Matrix"],
    submissionType: "Executive Pitch Deck (PDF / Link) + Written Objection Handling Cadence",
    levels: {
      fresher: {
        title: "Cold Outreach Cadence & Initial Discovery Call",
        desc: "Craft personalized 3-step outbound sequences and write opening discovery questions targeting VP of Engineering.",
        time: "45 mins",
        scope: "Outreach cadence · MEDDPICC discovery questions"
      },
      junior: {
        title: "Enterprise Pricing Negotiation & Vendor Comparison",
        desc: "Handle customer pushback claiming competitor is 30% cheaper, defend unit economics, and close multi-year commitment.",
        time: "60 mins",
        scope: "ROI defensibility · Competitor teardown · Contract terms"
      },
      senior: {
        title: "Multi-Stakeholder Enterprise RFP & Security Review",
        desc: "Navigate complex procurement hurdles involving CISO, CFO, and Head of Procurement for an 8-figure SaaS contract.",
        time: "90 mins",
        scope: "Security questionnaire · CFO justification · Master services agreement"
      }
    }
  }
];

export default function CareersPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [hardness, setHardness] = useState<"fresher" | "junior" | "senior">("junior");

  const openHardnessModal = (track: Track) => {
    setSelectedTrack(track);
    setHardness("junior");
  };

  const handleLaunchSimulation = () => {
    if (!selectedTrack) return;
    router.push(`/simulation/1?track=${selectedTrack.code}&level=${hardness}`);
  };

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "SkillForge" },
            { label: "Career Tracks" }
          ]}
        />

        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="badge badge-primary">PRACTICAL CAREER SIMULATIONS</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
              8 Technical Roles • 3 Rigor Tiers • Zero MCQ Quizzes
            </span>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Explore Career Simulations</h2>
          <p style={{ marginTop: 6, color: "var(--text-secondary)", maxWidth: 720, fontSize: "0.9rem" }}>
            Select your discipline to launch an authentic company assignment. Select your experience level (Fresher, Junior, or Senior), analyze real technical materials, and submit your verified repository for explainable AI evaluation.
          </p>
        </div>

        {/* Tracks Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 20 }}>
          {TRACKS.map((t) => (
            <div
              key={t.code}
              className="card interactive-lift"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border-default)",
                cursor: "pointer",
                overflow: "hidden",
                padding: t.image ? 0 : 24,
              }}
              onClick={() => openHardnessModal(t)}
            >
              {t.image && (
                <div className="img-zoom-box" style={{ height: 140, width: "100%", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(15, 23, 42, 0.45) 0%, transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 10,
                  }}>
                    <span className="badge badge-primary" style={{ background: "rgba(255, 255, 255, 0.95)", color: "var(--color-primary)", fontWeight: 700 }}>
                      Featured Track
                    </span>
                  </div>
                </div>
              )}

              <div style={{ padding: t.image ? 20 : 0, display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Header inside Card */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: `${t.color}15`,
                        border: `1px solid ${t.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                      }}
                    >
                      {t.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{t.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>{t.badge}</div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "var(--bg-surface-2)",
                      color: t.color,
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    {t.code}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                  {t.desc}
                </p>

                {/* Skills Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {t.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "var(--bg-surface-2)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", fontWeight: 600, fontSize: "0.85rem", marginTop: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openHardnessModal(t);
                  }}
                >
                  Configure Simulation →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── PROFESSIONAL HARDNESS MODAL ── */}
        {selectedTrack && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.5)",
              backdropFilter: "blur(12px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setSelectedTrack(null)}
          >
            <div
              className="card animate-fade-in"
              style={{
                maxWidth: 680,
                width: "100%",
                padding: 32,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.15)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedTrack(null)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>

              {/* Modal Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      background: `${selectedTrack.color}15`,
                      border: `1px solid ${selectedTrack.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    {selectedTrack.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: selectedTrack.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Simulation Rigor Selection
                    </div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {selectedTrack.name}
                    </h3>
                  </div>
                </div>

                <div
                  className="img-zoom-box animate-float"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    border: "2px solid rgba(79, 70, 229, 0.3)",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
                    flexShrink: 0,
                    marginRight: 40,
                  }}
                  title="Accredited AI Verification"
                >
                  <img
                    src="/images/verified-badge.jpg"
                    alt="Accredited SkillForge Badge"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Segmented Hardness Selector */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
                  Select Evaluation Tier:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {/* Fresher */}
                  <div
                    onClick={() => setHardness("fresher")}
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${hardness === "fresher" ? "var(--color-success)" : "var(--border-default)"}`,
                      background: hardness === "fresher" ? "var(--color-success-bg)" : "var(--bg-surface-2)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-success)" }}>Fresher</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>0 - 1 yrs</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                      Fundamental bug triage & unit tests.
                    </div>
                  </div>

                  {/* Junior */}
                  <div
                    onClick={() => setHardness("junior")}
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${hardness === "junior" ? "var(--color-primary)" : "var(--border-default)"}`,
                      background: hardness === "junior" ? "var(--color-primary-bg)" : "var(--bg-surface-2)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-primary)" }}>Junior</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>1 - 3 yrs</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                      Production incidents & edge-case fixes.
                    </div>
                  </div>

                  {/* Senior */}
                  <div
                    onClick={() => setHardness("senior")}
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${hardness === "senior" ? "var(--color-danger)" : "var(--border-default)"}`,
                      background: hardness === "senior" ? "var(--color-danger-bg)" : "var(--bg-surface-2)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-danger)" }}>Senior</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>4+ yrs</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                      Distributed systems & concurrency bugs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenario details card */}
              <div
                style={{
                  borderRadius: 10,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-default)",
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                {selectedTrack.image && (
                  <div style={{ height: 85, width: "100%", position: "relative", overflow: "hidden" }}>
                    <img
                      src={selectedTrack.image}
                      alt={selectedTrack.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to right, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.5) 60%, transparent 100%)",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 18px",
                      gap: 12,
                    }}>
                      <span className="badge badge-primary" style={{ background: "rgba(255, 255, 255, 0.95)", color: selectedTrack.color, fontWeight: 800 }}>
                        {selectedTrack.badge}
                      </span>
                      <span style={{ color: "#FFFFFF", fontSize: "0.8rem", fontWeight: 600 }}>
                        Enterprise Workspace Simulation
                      </span>
                    </div>
                  </div>
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)" }}>
                      ASSIGNED TECHNICAL MISSION
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
                        ⏱ {selectedTrack.levels[hardness].time}
                      </span>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                        {selectedTrack.levels[hardness].scope}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: 4 }}>
                    {selectedTrack.levels[hardness].title}
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {selectedTrack.levels[hardness].desc}
                  </p>
                </div>
              </div>

              {/* Materials & Submission Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 12, background: "var(--bg-surface-2)", borderRadius: 8, border: "1px solid var(--border-default)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>
                    📁 INCLUDED ASSETS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: "0.75rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                    {selectedTrack.materialsPreview.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: 12, background: "var(--bg-surface-2)", borderRadius: 8, border: "1px solid var(--border-default)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>
                    📤 GRADED DELIVERABLE
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", lineHeight: 1.5, margin: 0 }}>
                    {selectedTrack.submissionType}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedTrack(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, fontWeight: 700 }}
                  onClick={handleLaunchSimulation}
                >
                  Launch {hardness.toUpperCase()} Simulation →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
