"use client";
import React from "react";
import Link from "next/link";
import { SeniorityLevel } from "@/types/simulation";

interface SimulationHeaderProps {
  careerName: string;
  careerCode: string;
  level: SeniorityLevel;
  title: string;
  estimatedMinutes: number;
  skills: string[];
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  timeLeftSeconds?: number;
  onExit?: () => void;
}

export default function SimulationHeader({
  careerName,
  careerCode,
  level,
  title,
  estimatedMinutes,
  skills,
  currentStep,
  totalSteps,
  stepLabel,
  timeLeftSeconds,
}: SimulationHeaderProps) {
  const mins = timeLeftSeconds !== undefined ? String(Math.floor(timeLeftSeconds / 60)).padStart(2, "0") : null;
  const secs = timeLeftSeconds !== undefined ? String(timeLeftSeconds % 60).padStart(2, "0") : null;
  const isLowTime = timeLeftSeconds !== undefined && timeLeftSeconds < 600;

  const levelColorMap: Record<SeniorityLevel, string> = {
    fresher: "#10B981",
    junior: "#6366F1",
    senior: "#8B5CF6",
  };

  const levelColor = levelColorMap[level] || "var(--color-primary)";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        padding: "24px 28px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Top Bar: Breadcrumb, Level, Timer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href={`/careers/${careerCode.toLowerCase()}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>←</span>
            <span>Career Path</span>
          </Link>
          <span style={{ color: "var(--border-default)" }}>/</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            {careerName}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              background: `${levelColor}18`,
              color: levelColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {level}
          </span>
          <span className="badge badge-subtle" style={{ fontSize: "0.72rem" }}>
            Simulation 01
          </span>
        </div>

        {/* Timer & Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {mins && secs && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: "var(--radius-md)",
                background: isLowTime ? "#F43F5E18" : "var(--bg-subtle)",
                color: isLowTime ? "#F43F5E" : "var(--text-secondary)",
                border: isLowTime ? "1px solid #F43F5E40" : "1px solid var(--border-subtle)",
                fontSize: "0.85rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span>⏱️</span>
              <span>
                {mins}:{secs}
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              background: "var(--bg-subtle)",
              padding: "4px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            Step {currentStep} of {totalSteps}: <span style={{ color: "var(--color-primary)" }}>{stepLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 900,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          marginBottom: 10,
        }}
      >
        {title}
      </h1>

      {/* Meta Footer: Estimated Time & Skill Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Assessed Skills:
          </span>
          {skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-subtle)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                fontWeight: 600,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
          Estimated Duration: <strong>~{estimatedMinutes} minutes</strong>
        </div>
      </div>
    </div>
  );
}
