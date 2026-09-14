"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";

const FEATURED_SIMULATIONS = [
  {
    id: "1",
    track: "Software Developer",
    code: "SD",
    emoji: "💻",
    color: "#6366F1",
    image: "/images/swe-simulation.jpg",
    title: "Production Bug: Chunked Stream Handler & OOM Fix",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 4,
    deliverables: "GitHub Repo URL + Hotfix Strategy",
    desc: "Diagnose out-of-memory crashes on 50MB file uploads and implement reactive streaming backpressure."
  },
  {
    id: "2",
    track: "Data Analyst",
    code: "DA",
    emoji: "📊",
    color: "#0EA5E9",
    image: "/images/data-simulation.jpg",
    title: "E-Commerce Funnel Drop-off & Cohort Analysis",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 4,
    deliverables: "Cleaned CSV / Report + Dashboard Link",
    desc: "Identify checkout drop-offs across mobile platforms and produce statistically significant conversion insights."
  },
  {
    id: "3",
    track: "UI / UX Designer",
    code: "UX",
    emoji: "🎨",
    color: "#EC4899",
    image: "/images/ux-simulation.jpg",
    title: "B2B SaaS Analytics Dashboard & Design System",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 3,
    deliverables: "Figma Prototype URL + Design Rationale",
    desc: "Design responsive data grids and filter drawers complying with WCAG AA accessibility standards."
  },
  {
    id: "4",
    track: "AI / ML Engineer",
    code: "AI",
    emoji: "🤖",
    color: "#8B5CF6",
    image: "/images/ai-simulation.jpg",
    title: "Domain LLM Fine-Tuning with LoRA & RAG Pipeline",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 4,
    deliverables: "Google Colab / GitHub Notebook + Metrics",
    desc: "Build retrieval-augmented generation pipeline with vector search and evaluate retrieval precision."
  },
  {
    id: "5",
    track: "Cyber Security",
    code: "CS",
    emoji: "🔒",
    color: "#F43F5E",
    image: "/images/security-simulation.jpg",
    title: "Live Incident Triage & Zero-Day Patching",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 3,
    deliverables: "PCAP Forensics Report + Remediation Patch",
    desc: "Contain unauthorized lateral movement in cloud VPC, analyze PCAP logs, and apply zero-trust firewall rules."
  },
  {
    id: "6",
    track: "Product Manager",
    code: "PM",
    emoji: "🗂️",
    color: "#10B981",
    image: "/images/pm-simulation.jpg",
    title: "B2B Monetization PRD & Roadmapping Strategy",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 3,
    deliverables: "Comprehensive PRD Document + Executive Roadmap",
    desc: "Author user stories, acceptance criteria, and quantitative retention KPIs for self-serve tiered pricing."
  },
  {
    id: "7",
    track: "Digital Marketing",
    code: "DM",
    emoji: "📢",
    color: "#F59E0B",
    image: "/images/marketing-simulation.jpg",
    title: "Omnichannel Acquisition & CAC Optimization",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 3,
    deliverables: "Growth Strategy Deck + Ad Copy Matrix",
    desc: "Optimize high-intent search landing pages, restructure lookalike ad creatives, and cut customer acquisition cost."
  },
  {
    id: "8",
    track: "Sales & RevOps",
    code: "SA",
    emoji: "💼",
    color: "#F97316",
    image: "/images/sales-simulation.jpg",
    title: "Enterprise Deal Closing & Objection Handling",
    levels: ["Fresher", "Junior", "Senior"],
    duration: "45 - 90 mins",
    materialsCount: 3,
    deliverables: "Executive Pitch Deck + Objection Playbook",
    desc: "Defend enterprise SaaS ROI against competitor pricing pushbacks and negotiate multi-year contract terms."
  }
];

const PAST_SIMULATIONS = [
  {
    track: "Software Developer",
    level: "Junior",
    title: "Production Incident: Memory Leak & Streaming Fix",
    score: 82,
    date: "Today (2h ago)",
    repo: "github.com/arjunsharma/chunked-stream-patch",
    status: "Graded"
  },
  {
    track: "Software Developer",
    level: "Fresher",
    title: "User Profile API Validation Bug",
    score: 89,
    date: "3 days ago",
    repo: "github.com/arjunsharma/user-validator-fix",
    status: "Graded"
  }
];

export default function SimulationHubPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<"fresher" | "junior" | "senior">("junior");

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Workspace" },
            { label: "Technical Simulations" }
          ]}
          action={
            <button className="btn btn-primary btn-sm" onClick={() => router.push("/careers")}>
              Browse All 8 Tracks →
            </button>
          }
        />

        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary-light)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            Technical Challenges
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Career Simulations</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4, maxWidth: 680 }}>
            Solve realistic engineering incidents and data missions. Submit verified code repositories and analytical deliverables for AI multi-dimensional evaluation.
          </p>
        </div>

        {/* Level Filter Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Evaluation Rigor:</span>
          {(["fresher", "junior", "senior"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: selectedLevel === lvl ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                background: selectedLevel === lvl ? "var(--color-primary-bg)" : "transparent",
                color: selectedLevel === lvl ? "var(--color-primary-light)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.76rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textTransform: "capitalize",
              }}
            >
              {lvl === "fresher" ? "Fresher Tier (0-1 yrs)" : lvl === "junior" ? "Junior Tier (1-3 yrs)" : "Senior Tier (4+ yrs)"}
            </button>
          ))}
        </div>

        {/* Featured Simulations Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 32 }}>
          {FEATURED_SIMULATIONS.map((sim) => (
            <div
              key={sim.id}
              className="card interactive-lift"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border-default)",
                padding: (sim as any).image ? 0 : 22,
                overflow: "hidden",
              }}
            >
              {(sim as any).image && (
                <div className="img-zoom-box" style={{ height: 130, width: "100%", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
                  <img
                    src={(sim as any).image}
                    alt={sim.title}
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
                      Live Simulator
                    </span>
                  </div>
                </div>
              )}

              <div style={{ padding: (sim as any).image ? 20 : 0, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: `${sim.color}15`,
                    border: `1px solid ${sim.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {sim.emoji}
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: sim.color }}>{sim.track}</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)" }}>{sim.title}</div>
                </div>
              </div>

              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                {sim.desc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16, fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                <div>⏱ Benchmark Duration: {sim.duration}</div>
                <div>📂 Materials Included: {sim.materialsCount} artifacts</div>
                <div>📤 Deliverable: {sim.deliverables}</div>
              </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", fontWeight: 600, marginTop: "auto" }}
                  onClick={() => router.push(`/simulation/1?track=${sim.code}&level=${selectedLevel}`)}
                >
                  Launch {selectedLevel.toUpperCase()} Simulation →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Past Submissions Section */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Verified Simulation Records</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/score-report/1")}>
              View Latest Report →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PAST_SIMULATIONS.map((p) => (
              <div
                key={p.title}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "var(--bg-surface-2)",
                  borderRadius: 8,
                  border: "1px solid var(--border-default)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>{p.track}</span>
                    <span className="badge badge-warning" style={{ fontSize: "0.68rem" }}>{p.level}</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem" }}>{p.title}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontFamily: "JetBrains Mono, monospace" }}>
                    📦 {p.repo} • Completed {p.date}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#10B981" }}>{p.score}%</div>
                    <div style={{ fontSize: "0.58rem", color: "var(--text-tertiary)", fontWeight: 700 }}>AI SCORE</div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => router.push("/score-report/1")}
                  >
                    Report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
