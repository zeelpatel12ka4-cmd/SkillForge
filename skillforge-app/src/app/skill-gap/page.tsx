"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deliverableService, DeliverableItem } from "@/services/deliverableService";
import { simulationEngine } from "@/services/simulationEngine";
import { SkillGapItem } from "@/types/simulation";

export default function SkillGapPage() {
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delivs = deliverableService.getUserDeliverables();
    setDeliverables(delivs);
    setLoading(false);
  }, []);

  const hasDeliverables = deliverables.length > 0;
  const avgScore = hasDeliverables
    ? Math.round(deliverables.reduce((acc, d) => acc + (d.aiScore || 0), 0) / deliverables.length)
    : 0;

  const latestDeliverable = deliverables[0];
  const careerTrackCode = latestDeliverable?.careerTrack?.includes("Data")
    ? "DA"
    : latestDeliverable?.careerTrack?.includes("Design") || latestDeliverable?.careerTrack?.includes("UX")
    ? "UX"
    : latestDeliverable?.careerTrack?.includes("AI")
    ? "AI"
    : latestDeliverable?.careerTrack?.includes("Security") || latestDeliverable?.careerTrack?.includes("CYBER")
    ? "CYBER"
    : latestDeliverable?.careerTrack?.includes("Product")
    ? "PM"
    : latestDeliverable?.careerTrack?.includes("Marketing")
    ? "DM"
    : latestDeliverable?.careerTrack?.includes("Sales")
    ? "SALES"
    : "SD";

  const level = latestDeliverable?.careerTrack?.toLowerCase().includes("senior")
    ? "senior"
    : latestDeliverable?.careerTrack?.toLowerCase().includes("fresher")
    ? "fresher"
    : "junior";

  // Derive skill gaps from the simulation engine
  const rubricScores = {
    technical_correctness: avgScore || 75,
    problem_solving: avgScore ? Math.min(100, avgScore + 3) : 75,
    architecture: avgScore || 75,
    code_quality: avgScore ? Math.max(50, avgScore - 4) : 70,
  };

  const dynamicGaps: SkillGapItem[] = hasDeliverables
    ? simulationEngine.calculateSkillGaps(careerTrackCode as any, level as any, rubricScores, {})
    : [];

  const missingSkills = dynamicGaps.filter((g) => g.status === "critical_gap");
  const weakSkills = dynamicGaps.filter((g) => g.status === "growth_area");
  const strongSkills = dynamicGaps.filter((g) => g.status === "verified_strength");

  const recommendation = simulationEngine.recommendNextSimulation(
    careerTrackCode as any,
    level as any,
    avgScore || 75,
    dynamicGaps
  );

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopHeader
          breadcrumbs={[
            { label: "Talent Workspace", href: "/dashboard" },
            { label: "Skill Diagnostics & Gap Mitigation" },
          ]}
          actionButton={{
            label: "Explore Career Tracks",
            href: "/careers",
          }}
        />

        <main className="app-main animate-fade-in" style={{ padding: "32px 40px" }}>
          {/* Header Summary */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "28px 32px",
              marginBottom: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 24,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="badge badge-primary" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  DIAGNOSTIC ENGINE: {hasDeliverables ? "ACTIVE" : "PENDING EVALUATION"}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                  Track: {hasDeliverables ? latestDeliverable.careerTrack : "Unassessed Candidate"}
                </span>
              </div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                  letterSpacing: "-0.03em",
                }}
              >
                Targeted Skill Gap Analysis
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: 640, lineHeight: 1.6 }}>
                {hasDeliverables
                  ? `Based on ${deliverables.length} verified practical simulation deliverable(s). Solve targeted real-world scenarios to close critical gaps and unlock Tier-1 recruiter shortlists.`
                  : "You have not completed any work simulations yet. Complete your first career challenge to unlock an evidence-based skill gap diagnosis."}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-default)",
                padding: "16px 24px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    color: hasDeliverables ? "var(--color-warning)" : "var(--text-tertiary)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {hasDeliverables ? `${avgScore}%` : "0%"}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    marginTop: 4,
                    letterSpacing: "0.08em",
                  }}
                >
                  CAREER READINESS
                </div>
              </div>
              <div style={{ width: 1, height: 44, background: "var(--border-default)" }} />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-success)", fontWeight: 700 }}>
                  {hasDeliverables ? `+${Math.max(12, 100 - avgScore)}% Potential` : "Diagnostic Ready"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                  {hasDeliverables ? "By completing 1 targeted simulation" : "Complete first practical lab"}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Action Card */}
          <div
            style={{
              background: "rgba(99, 102, 241, 0.06)",
              border: "1px solid rgba(99, 102, 241, 0.22)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "rgba(99, 102, 241, 0.12)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              ⚡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-primary)", marginBottom: 2 }}>
                {hasDeliverables ? `Next Recommended Step: ${recommendation.title}` : "Begin Your First Work Simulation"}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {hasDeliverables
                  ? recommendation.rationale
                  : "Select from 8 career tracks (Software Developer, Data Analyst, UX Designer, Cyber Security, etc.) to evaluate your job readiness."}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                router.push(
                  hasDeliverables
                    ? `/simulation/1?track=${recommendation.careerCode}&level=${recommendation.level}`
                    : "/careers"
                )
              }
              style={{ flexShrink: 0 }}
            >
              {hasDeliverables ? "Launch Simulation →" : "Explore Careers →"}
            </button>
          </div>

          {/* 3-Column Diagnostic Matrix */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
            {/* Missing Skills */}
            <div className="card" style={{ borderColor: "rgba(225,29,72,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E11D48" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Critical Gaps</h3>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#E11D48",
                    background: "rgba(225,29,72,0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {missingSkills.length} DETECTED
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {missingSkills.length === 0 ? (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>
                    {hasDeliverables ? "No critical skill gaps detected." : "Complete a simulation to detect gaps."}
                  </p>
                ) : (
                  missingSkills.map((s) => (
                    <div
                      key={s.skill}
                      style={{
                        padding: "12px 14px",
                        background: "rgba(225,29,72,0.04)",
                        border: "1px solid rgba(225,29,72,0.15)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {s.skill}
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "#E11D48",
                            background: "rgba(225,29,72,0.12)",
                            padding: "2px 6px",
                            borderRadius: 3,
                          }}
                        >
                          {s.score}%
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        Target: {s.targetScore}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Growth Areas */}
            <div className="card" style={{ borderColor: "rgba(217,119,6,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Growth Opportunities</h3>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#D97706",
                    background: "rgba(217,119,6,0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {weakSkills.length} IN PROGRESS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {weakSkills.length === 0 ? (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>
                    {hasDeliverables ? "No growth areas currently flagged." : "Pending first simulation evaluation."}
                  </p>
                ) : (
                  weakSkills.map((s) => (
                    <div
                      key={s.skill}
                      style={{
                        padding: "12px 14px",
                        background: "rgba(217,119,6,0.04)",
                        border: "1px solid rgba(217,119,6,0.15)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {s.skill}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "#D97706",
                            fontWeight: 700,
                          }}
                        >
                          {s.score}% / {s.targetScore}%
                        </span>
                      </div>
                      <div style={{ height: 4, background: "var(--bg-surface-3)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${s.score}%`, height: "100%", background: "#D97706" }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Verified Strengths */}
            <div className="card" style={{ borderColor: "rgba(5,150,105,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Verified Strengths</h3>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#059669",
                    background: "rgba(5,150,105,0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {strongSkills.length} VERIFIED
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {strongSkills.length === 0 ? (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>
                    {hasDeliverables ? "Complete senior simulations to verify strengths." : "Zero verified skills."}
                  </p>
                ) : (
                  strongSkills.map((s) => (
                    <div
                      key={s.skill}
                      style={{
                        padding: "12px 14px",
                        background: "rgba(5,150,105,0.04)",
                        border: "1px solid rgba(5,150,105,0.15)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#059669", fontWeight: 800, fontSize: "0.85rem" }}>✓</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {s.skill}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontFamily: "JetBrains Mono, monospace",
                          color: "#059669",
                          fontWeight: 700,
                        }}
                      >
                        {s.score}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Curated Simulations Catalog */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                  Curated Simulations to Close Critical Gaps
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Solve realistic practical work challenges across all 8 canonical career tracks.
                </p>
              </div>
              <Link href="/careers" className="btn btn-ghost btn-sm">
                View All 8 Career Tracks →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  title: "Chunked Stream Handler & OOM Crash Fix",
                  track: "Software Developer",
                  hardness: "Junior",
                  time: "60 mins",
                  code: "SD",
                  level: "junior",
                  deliverable: "Public GitHub Repo URL + Architecture Write-up",
                },
                {
                  title: "E-Commerce Checkout Drop-off & Cohort Hypothesis Testing",
                  track: "Data Analyst",
                  hardness: "Junior",
                  time: "60 mins",
                  code: "DA",
                  level: "junior",
                  deliverable: "Cleaned CSV / Report + Dashboard Link",
                },
                {
                  title: "B2B SaaS Analytics Grid & Modular Design System",
                  track: "UI / UX Designer",
                  hardness: "Junior",
                  time: "60 mins",
                  code: "UX",
                  level: "junior",
                  deliverable: "Figma Prototype URL + Design Rationale",
                },
                {
                  title: "Live Cloud VPC Ransomware Containment & Incident Forensics",
                  track: "Cyber Security",
                  hardness: "Junior",
                  time: "60 mins",
                  code: "CS",
                  level: "junior",
                  deliverable: "Incident Triage Report (PDF) + Security Remediation Patch",
                },
              ].map((sim, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {sim.track}
                      </span>
                      <span className="badge badge-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {sim.hardness}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-tertiary)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        ⏱ {sim.time}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                      {sim.title}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Deliverable:</div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontFamily: "JetBrains Mono, monospace",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {sim.deliverable}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push(`/simulation/1?track=${sim.code}&level=${sim.level}`)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Launch Simulation →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
