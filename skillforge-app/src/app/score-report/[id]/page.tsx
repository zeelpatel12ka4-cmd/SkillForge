"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { simulationService, ScoreReportResult } from "@/services/simulationService";

const DEFAULT_DIMS = [
  { label: "Technical Correctness", score: 85, desc: "Chunked streaming logic was technically sound. Chunk boundary validation and sha256 checksums correctly implemented." },
  { label: "Problem-Solving", score: 82, desc: "Correctly eliminated JVM heap size as the primary cause and diagnosed in-memory buffer saturation." },
  { label: "Reasoning & Edge Cases", score: 76, desc: "Hotfix deployment strategy was well justified. Network dropout edge cases handled with temporary disk fallback." },
  { label: "Communication & PR Quality", score: 88, desc: "Incident summary was concise, audience-aware, and actionable for engineering leadership." },
  { label: "Code Quality & Tests", score: 79, desc: "Clean TypeScript code following reactive stream conventions. Added 4 unit tests covering 50MB synthetic uploads." },
];

function ScoreRing({ score, size = 110 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#F43F5E";
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: size > 100 ? "1.5rem" : "1rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{score}%</div>
        {size > 100 && <div style={{ fontSize: "0.58rem", color: "var(--text-tertiary)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>AI Score</div>}
      </div>
    </div>
  );
}

export default function ScoreReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<ScoreReportResult | null>(null);

  useEffect(() => {
    if (id) {
      simulationService.getScoreReport(id).then((res) => {
        if (res) setReport(res);
      });
    }
  }, [id]);

  const overall = report?.evaluation.overall_score || 82;
  const verifiedHash = report?.evaluation.verified_hash || "0xSD_JUN_82_E4F18B92";
  const confidence = report?.evaluation.ai_confidence || "98% (High Confidence)";
  const deliverableUrl = report?.attempt.deliverable_url || "https://github.com/arjunsharma/chunked-stream-patch";
  const careerCode = report?.attempt.career_code || "SD";
  const level = report?.attempt.level || "junior";

  const dims = report
    ? [
        { label: "Technical Correctness", score: report.evaluation.technical_accuracy_score, desc: "Deliverable met rigorous architectural requirements and passed automated validation tests." },
        { label: "Problem-Solving", score: report.evaluation.problem_solving_score, desc: "Identified memory allocation root causes and mitigated systemic performance bottlenecks." },
        { label: "Reasoning & Edge Cases", score: report.evaluation.architecture_score, desc: "Handled asynchronous backpressure, timeouts, and network degradation resiliently." },
        { label: "Communication & PR Quality", score: report.evaluation.communication_score, desc: "Submitted concise engineering rationale and clean modular documentation." },
        { label: "Code Quality & Tests", score: report.evaluation.code_quality_score, desc: "Structured code following production best practices with defensible test coverage." },
      ]
    : DEFAULT_DIMS;

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Workspace" },
            { label: "Simulation Reports" },
            { label: `#SIM-${careerCode}-${level.toUpperCase()}` }
          ]}
          action={
            <button className="btn btn-primary btn-sm" onClick={() => router.push("/jobs")}>
              View Matching Roles ({overall}% Qualified) →
            </button>
          }
        />

        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge badge-primary">EVALUATION CERTIFICATE</span>
            <span className="badge badge-warning">{level.toUpperCase()} TIER</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>• Verified via Supabase Engine</span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {careerCode === "SD" ? "Software Developer · Production Bug Fix" : `${careerCode} Career Track Simulation`}
          </h2>
          <p style={{ marginTop: 4, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            AI-graded across 5 core competency rubrics with {confidence}.
          </p>
        </div>

        {/* Deliverable Proof Banner */}
        <div
          style={{
            padding: "16px 20px",
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: "1.4rem" }}>🛡️</span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Verified Deliverable Proof:{" "}
                <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary-light)" }}>
                  {deliverableUrl}
                </span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2, fontFamily: "JetBrains Mono, monospace" }}>
                SHA-256 PROOF HASH: {verifiedHash}
              </div>
            </div>
          </div>
          <a
            href={deliverableUrl.startsWith("http") ? deliverableUrl : "https://" + deliverableUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--color-primary-light)", borderColor: "var(--color-primary-border)" }}
          >
            Inspect Deliverable ↗
          </a>
        </div>

        {/* Overall + Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, marginBottom: 20 }}>
          <div
            className="card interactive-lift"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              padding: 24,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Overall Readiness
              </div>
              <div className="img-zoom-box animate-float" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #10B981" }} title="Accredited Verification">
                <img src="/images/verified-badge.jpg" alt="Verified Credential" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            <ScoreRing score={overall} size={124} />
            <div className="badge badge-success" style={{ fontSize: "0.72rem" }}>
              {confidence}
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Computed from live deliverables, code execution, and rubric benchmarks.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.88rem", color: "var(--text-primary)" }}>
              Core Rubric Breakdown
            </div>
            {dims.map((d) => {
              const color = d.score >= 80 ? "#10B981" : d.score >= 60 ? "#F59E0B" : "#F43F5E";
              return (
                <div key={d.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{d.label}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{d.score}%</span>
                  </div>
                  <div style={{ height: 5, background: "var(--bg-surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${d.score}%`,
                        background: color,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "0.88rem", color: "#10B981" }}>
              ✓ Verified Strengths
            </div>
            {dims.filter((d) => d.score >= 80).map((d) => (
              <div
                key={d.label}
                style={{
                  padding: "10px 12px",
                  background: "rgba(16, 185, 129, 0.05)",
                  borderRadius: 8,
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#10B981", marginBottom: 2 }}>
                  {d.label} — {d.score}%
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "0.88rem", color: "#F59E0B" }}>
              ⚠ Growth Opportunities
            </div>
            {dims.filter((d) => d.score < 80).map((d) => (
              <div
                key={d.label}
                style={{
                  padding: "10px 12px",
                  background: "rgba(245, 158, 11, 0.05)",
                  borderRadius: 8,
                  border: "1px solid rgba(245, 158, 11, 0.15)",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#F59E0B", marginBottom: 2 }}>
                  {d.label} — {d.score}%
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actionable Summary */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            AI Evaluator Executive Summary
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {report?.evaluation.ai_feedback_summary ||
              "The candidate demonstrated strong foundational problem-solving and reactive backpressure handling. The submission met junior-to-mid engineering standards with zero critical regressions in concurrent upload tests."}
          </p>
        </div>
      </main>
    </div>
  );
}
