"use client";
import React from "react";
import { RoleContext } from "@/types/simulation";

interface MissionBriefCardProps {
  scenarioTitle: string;
  roleContext: RoleContext;
  scenario: string;
  businessContext: string;
  objective: string;
}

export default function MissionBriefCard({
  scenarioTitle,
  roleContext,
  scenario,
  businessContext,
  objective,
}: MissionBriefCardProps) {
  return (
    <div
      className="card"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        padding: "28px 32px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Badge Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span
          className="badge badge-primary"
          style={{ letterSpacing: "0.06em", fontSize: "0.74rem", fontWeight: 800 }}
        >
          MISSION BRIEF
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
          Real-World Incident Context
        </span>
      </div>

      <h2
        style={{
          fontSize: "1.45rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          marginBottom: 16,
        }}
      >
        {scenarioTitle}
      </h2>

      {/* Role Context Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          padding: "14px 18px",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          marginBottom: 22,
        }}
      >
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
            Your Role
          </div>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {roleContext.roleTitle}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
            Assigned Team
          </div>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {roleContext.team}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
            Reporting To
          </div>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {roleContext.reportingTo}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
            Company Environment
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.3 }}>
            {roleContext.companyContext}
          </div>
        </div>
      </div>

      {/* Structured Situation & Objective */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            Your Situation
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
            {scenario}
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            Business & Organizational Impact
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
            {businessContext}
          </p>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-lg)",
            background: "rgba(99, 102, 241, 0.05)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: 4 }}>
            🎯 Your Core Objective
          </h3>
          <p style={{ fontSize: "0.93rem", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
            {objective}
          </p>
        </div>
      </div>
    </div>
  );
}
