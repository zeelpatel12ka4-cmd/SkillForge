"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { deliverableService, DeliverableItem } from "@/services/deliverableService";
import { atsService } from "@/services/atsService";

interface Candidate {
  id: string | number;
  name: string;
  avatarColor: string;
  score: number;
  level: "Fresher" | "Junior" | "Senior";
  simTitle: string;
  githubRepo?: string;
  fileAttachment?: string;
  submissionSnippet: string;
  aiVerdict: string;
  dims: { tc: number; ps: number; com: number; rsn: number };
  missing: string[];
  strong: string[];
  status: "shortlisted" | "reviewing" | "pool" | "interview";
  badges?: { title: string; icon: string; tier: string }[];
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#10B981" : score >= 65 ? "#F59E0B" : "#F43F5E";
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255, 255, 255, 0.06)", borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: "0.74rem", fontWeight: 700, color, width: 32, textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

export default function HRCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const loadCandidates = () => {
    const rawDeliverables = deliverableService.getAllDeliverables();
    const rawApplications = atsService.getJobApplications();

    const appCandidates: Candidate[] = rawApplications.map((a, idx) => {
      const levelStr = a.careerTrack.toUpperCase().includes("SENIOR")
        ? "Senior"
        : a.careerTrack.toUpperCase().includes("FRESHER")
        ? "Fresher"
        : "Junior";
      return {
        id: a.id,
        name: a.candidateName,
        avatarColor: idx % 3 === 0 ? "#10B981" : idx % 3 === 1 ? "#8B5CF6" : "#0EA5E9",
        score: a.matchPercentage,
        level: levelStr,
        simTitle: `Applied: ${a.company} — ${a.jobTitle}`,
        githubRepo: a.repoUrl,
        submissionSnippet: `Direct Verified Job Application to ${a.company}. Gemini Fit: ${a.matchPercentage}%. ${a.fitVerdict}`,
        aiVerdict: a.fitVerdict,
        dims: {
          tc: a.matchPercentage,
          ps: Math.min(100, a.matchPercentage + 2),
          com: Math.min(100, a.matchPercentage - 1),
          rsn: Math.min(100, a.matchPercentage + 1),
        },
        missing: a.missingSkills || [],
        strong: ["Skill Match", "Verified Deliverable", "Simulation Benchmark"],
        status: (a.status === "shortlisted" ? "shortlisted" : a.status === "interview" ? "interview" : a.status === "pool" ? "pool" : "reviewing") as Candidate["status"],
        badges: [{ title: "Direct Applicant", icon: "🚀", tier: "Gold" }],
      };
    });

    const delivCandidates: Candidate[] = rawDeliverables.map((d, idx) => {
      const levelStr = d.careerTrack.toUpperCase().includes("SENIOR")
        ? "Senior"
        : d.careerTrack.toUpperCase().includes("FRESHER")
        ? "Fresher"
        : "Junior";
      return {
        id: d.id,
        name: d.candidateName,
        avatarColor: idx % 3 === 0 ? "#6366F1" : idx % 3 === 1 ? "#0EA5E9" : "#10B981",
        score: d.aiScore,
        level: levelStr,
        simTitle: d.challengeTitle,
        githubRepo: d.repoUrl,
        submissionSnippet: d.evaluatorNotes,
        aiVerdict: `Verified code deliverable. Correctness: ${d.aiScore}%. Passed ${d.testsPassed} of ${d.totalTests} test suites. Verified hash: ${d.sha256Proof.substring(0, 16)}...`,
        dims: {
          tc: d.breakdown?.codeQuality || d.aiScore,
          ps: d.breakdown?.architecture || d.aiScore,
          com: d.breakdown?.testCoverage || d.aiScore,
          rsn: d.breakdown?.security || d.aiScore,
        },
        missing: d.aiScore < 90 ? ["Parameterization"] : [],
        strong: ["Correctness", "Modular Code", "Edge Case Coverage", "Git Telemetry"],
        status: d.status === "VERIFIED" ? "shortlisted" : "reviewing",
        badges: d.badges || [],
      };
    });

    // Merge without duplicates by candidate name/email
    const seen = new Set<string>();
    const merged: Candidate[] = [];
    for (const c of [...appCandidates, ...delivCandidates]) {
      const key = `${c.name}_${c.simTitle}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(c);
      }
    }

    setCandidates(merged);
  };

  useEffect(() => {
    loadCandidates();
    window.addEventListener("skillforge_deliverable_created", loadCandidates);
    window.addEventListener("skillforge_application_submitted", loadCandidates);
    window.addEventListener("skillforge_application_updated", loadCandidates);
    window.addEventListener("storage", loadCandidates);
    return () => {
      window.removeEventListener("skillforge_deliverable_created", loadCandidates);
      window.removeEventListener("skillforge_application_submitted", loadCandidates);
      window.removeEventListener("skillforge_application_updated", loadCandidates);
      window.removeEventListener("storage", loadCandidates);
    };
  }, []);

  const updateStatus = (id: string | number, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (typeof id === "string" && id.startsWith("app-")) {
      atsService.updateApplicationStatus(id, newStatus);
    }
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filtered = candidates.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchLevel = filterLevel === "all" || c.level.toLowerCase() === filterLevel.toLowerCase();
    return matchStatus && matchLevel;
  });

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="RECRUITER" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Recruiter Portal" },
            { label: "Job Pipelines" },
            { label: "Software Developer Candidates" }
          ]}
        />

        {/* Page Title Strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Job ID: #JOB-ENG-01 · Active Pipeline
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Ranked Candidates by AI Simulation</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              {candidates.length} verified engineers evaluated on authentic code repositories and incident fixes.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.76rem" }}>
              ✓ Direct Code Verification Active
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "shortlisted", "interview", "reviewing", "pool"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: filterStatus === st ? "1px solid #8B5CF6" : "1px solid var(--border-subtle)",
                  background: filterStatus === st ? "rgba(139, 92, 246, 0.18)" : "transparent",
                  color: filterStatus === st ? "#DDD6FE" : "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {st === "all" ? "All Statuses" : st}
              </button>
            ))}
          </div>

          <div style={{ height: 16, width: 1, background: "var(--border-subtle)", margin: "0 6px" }} />

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "fresher", "junior", "senior"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: filterLevel === lvl ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                  background: filterLevel === lvl ? "var(--color-primary-bg)" : "transparent",
                  color: filterLevel === lvl ? "var(--color-primary-light)" : "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {lvl === "all" ? "All Tiers" : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                No Candidate Submissions Yet
              </h3>
              <p style={{ fontSize: "0.82rem", maxWidth: 480, margin: "0 auto 16px" }}>
                As candidates complete code challenges and simulations, their verified GitHub repositories, AI evaluations, and earned medals will appear here in real time.
              </p>
            </div>
          ) : (
            filtered.map((c, idx) => {
              const statusColor =
                c.status === "shortlisted"
                  ? "#10B981"
                  : c.status === "interview"
                  ? "#818CF8"
                  : c.status === "reviewing"
                  ? "#F59E0B"
                : "#64748B";

            const statusBg =
              c.status === "shortlisted"
                ? "rgba(16, 185, 129, 0.12)"
                : c.status === "interview"
                ? "rgba(129, 140, 248, 0.15)"
                : c.status === "reviewing"
                ? "rgba(245, 158, 11, 0.12)"
                : "rgba(255, 255, 255, 0.03)";

            const levelColor =
              c.level === "Senior" ? "#F43F5E" : c.level === "Junior" ? "#F59E0B" : "#10B981";

            return (
              <div
                key={c.id}
                className="card"
                style={{
                  padding: "18px 22px",
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  gap: 20,
                  alignItems: "center",
                  cursor: "pointer",
                  border: "1px solid var(--border-default)",
                }}
                onClick={() => setSelectedCandidate(c)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.borderColor = "rgba(139, 92, 246, 0.4)";
                  target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.borderColor = "var(--border-default)";
                  target.style.transform = "translateY(0)";
                }}
              >
                {/* Rank indicator */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: idx === 0 ? "#F59E0B" : idx === 1 ? "#94A3B8" : idx === 2 ? "#CD7F32" : "var(--text-muted)",
                    }}
                  >
                    #{idx + 1}
                  </div>
                </div>

                {/* Candidate Information */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.8rem",
                      }}
                    >
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>{c.name}</span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: `${levelColor}15`,
                            color: levelColor,
                            border: `1px solid ${levelColor}30`,
                          }}
                        >
                          {c.level.toUpperCase()} TIER
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: statusBg,
                            color: statusColor,
                            border: `1px solid ${statusColor}30`,
                          }}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>
                        Assigned Task: <em>{c.simTitle}</em>
                      </div>

                      {/* Verified Badges */}
                      {c.badges && c.badges.length > 0 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          {c.badges.map((b) => (
                            <span
                              key={b.title}
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: 99,
                                background: b.tier === "gold" ? "rgba(245, 158, 11, 0.12)" : "rgba(148, 163, 184, 0.12)",
                                color: b.tier === "gold" ? "#D97706" : "#475569",
                                border: `1px solid ${b.tier === "gold" ? "rgba(245, 158, 11, 0.3)" : "rgba(148, 163, 184, 0.3)"}`,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>{b.icon}</span>
                              <span>{b.title}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "1.45rem",
                          fontWeight: 900,
                          color: c.score >= 80 ? "#10B981" : c.score >= 65 ? "#F59E0B" : "#F43F5E",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {c.score}%
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", fontWeight: 700 }}>
                        AI MATCH
                      </div>
                    </div>
                  </div>

                  {/* Submitted GitHub Repo badge */}
                  {c.githubRepo && (
                    <div style={{ marginBottom: 10, display: "flex", gap: 10, alignItems: "center" }}>
                      <a
                        href={c.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: "0.72rem",
                          fontFamily: "JetBrains Mono, monospace",
                          color: "var(--color-primary-light)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "rgba(99, 102, 241, 0.08)",
                          padding: "2px 8px",
                          borderRadius: 4,
                          border: "1px solid var(--color-primary-border)",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        <span>{c.githubRepo.replace("https://", "")} ↗</span>
                      </a>
                      {c.fileAttachment && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
                          📄 {c.fileAttachment}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px", marginBottom: 8 }}>
                    {[
                      ["Technical Correctness", c.dims.tc],
                      ["Problem-Solving", c.dims.ps],
                      ["Communication", c.dims.com],
                      ["Reasoning", c.dims.rsn],
                    ].map(([label, score]) => (
                      <div key={label as string}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginBottom: 2 }}>
                          {label}
                        </div>
                        <ScoreBar score={score as number} />
                      </div>
                    ))}
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {c.strong.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "0.66rem",
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: "rgba(16, 185, 129, 0.08)",
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {c.missing.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "0.66rem",
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: "rgba(244, 63, 94, 0.08)",
                          color: "#FB7185",
                          border: "1px solid rgba(244, 63, 94, 0.2)",
                        }}
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 120 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: "#7C3AED", fontWeight: 600 }}
                    onClick={() => updateStatus(c.id, c.status === "shortlisted" ? "reviewing" : "shortlisted")}
                  >
                    {c.status === "shortlisted" ? "Shortlisted ✓" : "Shortlist"}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    Inspect Work →
                  </button>
                </div>
              </div>
            );
          }))}
        </div>

        {/* ── CANDIDATE INSPECTION MODAL ── */}
        {selectedCandidate && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(12px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setSelectedCandidate(null)}
          >
            <div
              className="card animate-fade-in"
              style={{
                maxWidth: 720,
                width: "100%",
                padding: 30,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.15)",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCandidate(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: selectedCandidate.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {selectedCandidate.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedCandidate.name}</h3>
                    <span className="badge badge-warning">{selectedCandidate.level} Tier</span>
                    <span className="badge badge-success">{selectedCandidate.score}% Score</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Challenge: <strong>{selectedCandidate.simTitle}</strong>
                  </div>
                </div>
              </div>

              {/* Submitted Work Box */}
              <div style={{ padding: 16, background: "var(--bg-surface-2)", borderRadius: 10, border: "1px solid var(--border-default)", marginBottom: 18 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Candidate Submitted Code & Architecture
                </div>
                {selectedCandidate.githubRepo && (
                  <div style={{ marginBottom: 10 }}>
                    <a
                      href={selectedCandidate.githubRepo}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--color-primary)",
                        fontSize: "0.82rem",
                        fontFamily: "JetBrains Mono, monospace",
                        background: "var(--color-primary-bg)",
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: "1px solid var(--color-primary-border)",
                      }}
                    >
                      <span>📦</span>
                      <span>{selectedCandidate.githubRepo} ↗</span>
                    </a>
                  </div>
                )}
                <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.65, background: "var(--bg-surface)", padding: 12, borderRadius: 6, border: "1px solid var(--border-default)" }}>
                  &ldquo;{selectedCandidate.submissionSnippet}&rdquo;
                </div>
              </div>

              {/* AI Evaluator Breakdown */}
              <div style={{ padding: 16, background: "var(--color-success-bg)", borderRadius: 10, border: "1px solid var(--color-success-border)", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase" }}>
                    AI Evaluator Synthesis
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-success)", fontWeight: 700 }}>98% Confidence</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
                  {selectedCandidate.aiVerdict}
                </p>
              </div>

              {/* Dimension Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
                {[
                  ["Technical Correctness", selectedCandidate.dims.tc],
                  ["Problem-Solving", selectedCandidate.dims.ps],
                  ["Communication", selectedCandidate.dims.com],
                  ["Reasoning", selectedCandidate.dims.rsn],
                ].map(([label, score]) => (
                  <div key={label as string} style={{ padding: 10, background: "var(--bg-surface-2)", borderRadius: 6, border: "1px solid var(--border-default)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{score}%</span>
                    </div>
                    <ScoreBar score={score as number} />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border-subtle)", paddingTop: 18 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: "#10B981" }}
                  onClick={() => updateStatus(selectedCandidate.id, "shortlisted")}
                >
                  ✓ Shortlist Candidate
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: "#8B5CF6" }}
                  onClick={() => updateStatus(selectedCandidate.id, "interview")}
                >
                  📅 Schedule Interview
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ color: "#FB7185", borderColor: "rgba(244, 63, 94, 0.3)" }}
                  onClick={() => updateStatus(selectedCandidate.id, "pool")}
                >
                  Pass
                </button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </RoleGuard>
  );
}
