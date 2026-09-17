"use client";
import React from "react";
import { DeliverableDefinition } from "@/types/simulation";

interface FinalDeliverableCardProps {
  deliverableDef: DeliverableDefinition;
  deliverableValues: Record<string, string>;
  careerName: string;
  onUpdateValue: (fieldKey: string, value: string) => void;
  onSubmitClick: () => void;
  canSubmit: boolean;
}

export default function FinalDeliverableCard({
  deliverableDef,
  deliverableValues,
  careerName,
  onUpdateValue,
  onSubmitClick,
  canSubmit,
}: FinalDeliverableCardProps) {
  const fields = deliverableDef.fields || [];

  return (
    <div
      id="deliverables-section"
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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span
          className="badge badge-primary"
          style={{ letterSpacing: "0.06em", fontSize: "0.74rem", fontWeight: 800 }}
        >
          FINAL DELIVERABLES
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
          {careerName} Professional Evidence Submission
        </span>
      </div>

      <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
        Submit Candidate Evidence
      </h2>
      <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
        Attach your professional work artifacts below. These deliverables will be evaluated against career rubric criteria and archived in your candidate profile.
      </p>

      {/* Dynamic Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
        {fields.map((field) => {
          const value = deliverableValues[field.name] || "";
          const isUrl = field.type === "url";

          return (
            <div key={field.name}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {field.label} {field.required && <span style={{ color: "#F43F5E" }}>*</span>}
                </label>
                {field.type && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                    {field.type}
                  </span>
                )}
              </div>

              {field.type === "code" || field.name.toLowerCase().includes("notes") || field.name.toLowerCase().includes("description") || field.name.toLowerCase().includes("summary") ? (
                <textarea
                  value={value}
                  onChange={(e) => onUpdateValue(field.name, e.target.value)}
                  placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}...`}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    fontFamily: field.type === "code" ? "monospace" : "inherit",
                    outline: "none",
                  }}
                />
              ) : (
                <input
                  type={isUrl ? "url" : "text"}
                  value={value}
                  onChange={(e) => onUpdateValue(field.name, e.target.value)}
                  placeholder={field.placeholder || (isUrl ? "https://..." : "")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              )}

              {field.helpText && (
                <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                  {field.helpText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          paddingTop: 18,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          🔒 Ensure all links are public or accessible for automated evaluation.
        </div>

        <button
          onClick={onSubmitClick}
          disabled={!canSubmit}
          className="btn btn-primary"
          style={{
            padding: "12px 28px",
            fontSize: "0.95rem",
            fontWeight: 800,
            borderRadius: "var(--radius-md)",
            opacity: canSubmit ? 1 : 0.6,
            cursor: canSubmit ? "pointer" : "not-allowed",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>Review Checklist & Submit</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
