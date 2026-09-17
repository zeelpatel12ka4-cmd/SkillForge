"use client";
import React from "react";
import Link from "next/link";

interface SimulationCompletionCardProps {
  careerName: string;
  careerCode: string;
  level: string;
  simulationTitle: string;
  tasksCompleted: number;
  totalTasks: number;
  evidenceItemsCount: number;
  submittedAt: string;
}

export default function SimulationCompletionCard({
  careerName,
  careerCode,
  level,
  simulationTitle,
  tasksCompleted,
  totalTasks,
  evidenceItemsCount,
  submittedAt,
}: SimulationCompletionCardProps) {
  return (
    <div
      className="card"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        padding: "48px 36px",
        textAlign: "center",
        maxWidth: "680px",
        margin: "20px auto 40px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Success Badge */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#10B981",
          fontSize: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          border: "2px solid rgba(16, 185, 129, 0.3)",
        }}
      >
        ✓
      </div>

      <div style={{ display: "inline-block", marginBottom: 12 }}>
        <span
          className="badge badge-success"
          style={{ letterSpacing: "0.06em", fontSize: "0.75rem", fontWeight: 800 }}
        >
          SIMULATION SUBMITTED
        </span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
        Your Work Has Been Recorded
      </h2>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
        Your practical engineering and analytical artifacts have been archived and queued for rubric-grounded evaluation.
      </p>

      {/* Summary Box */}
      <div
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          textAlign: "left",
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Simulation:</span>
          <strong style={{ color: "var(--text-primary)" }}>
            {careerName} — <span style={{ textTransform: "capitalize" }}>{level}</span>
          </strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Challenge Title:</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{simulationTitle}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Sequenced Tasks Completed:</span>
          <strong style={{ color: "var(--color-success)" }}>
            {tasksCompleted} / {totalTasks} Tasks
          </strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Evidence Submitted:</span>
          <strong style={{ color: "var(--text-primary)" }}>{evidenceItemsCount} Items</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Evaluation Status:</span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(99, 102, 241, 0.12)",
              color: "var(--color-primary)",
            }}
          >
            Pending AI Review
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
          <span>Submission Recorded:</span>
          <span>{submittedAt}</span>
        </div>
      </div>

      {/* Return to Career Path CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <Link
          href={`/careers/${careerCode.toLowerCase()}`}
          className="btn btn-primary"
          style={{
            padding: "12px 32px",
            fontSize: "0.96rem",
            fontWeight: 800,
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>Return to Career Path</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
