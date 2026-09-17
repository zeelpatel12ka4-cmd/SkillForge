"use client";
import React, { useState } from "react";
import { Material } from "@/types/simulation";
import MaterialViewerModal from "./MaterialViewerModal";

interface MaterialsPanelProps {
  materials: Material[];
  reviewedMaterialIds: Set<string>;
  onToggleReviewed: (id: string) => void;
  onContinueToTask?: () => void;
}

export default function MaterialsPanel({
  materials,
  reviewedMaterialIds,
  onToggleReviewed,
  onContinueToTask,
}: MaterialsPanelProps) {
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "logs":
        return "📄";
      case "code":
        return "📁";
      case "dataset":
        return "📊";
      case "docs":
        return "📑";
      case "config":
        return "⚙️";
      case "metrics":
        return "📈";
      default:
        return "📄";
    }
  };

  const reviewedCount = materials.filter((m) => reviewedMaterialIds.has(m.id)).length;
  const allReviewed = materials.length > 0 && reviewedCount === materials.length;

  return (
    <div
      className="card"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        padding: "26px 32px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="badge badge-primary"
            style={{ letterSpacing: "0.06em", fontSize: "0.74rem", fontWeight: 800 }}
          >
            REQUIRED MATERIALS
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
            Inspect all source evidence before completing the task
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: allReviewed ? "var(--color-success)" : "var(--text-secondary)" }}>
            {reviewedCount} of {materials.length} Reviewed
          </span>
          {allReviewed && (
            <span style={{ fontSize: "0.85rem", color: "var(--color-success)" }}>✓ Ready</span>
          )}
        </div>
      </div>

      {/* Materials List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {materials.map((mat) => {
          const isReviewed = reviewedMaterialIds.has(mat.id);

          return (
            <div
              key={mat.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                padding: "16px 20px",
                borderRadius: "var(--radius-lg)",
                background: isReviewed ? "rgba(16, 185, 129, 0.04)" : "var(--bg-subtle)",
                border: isReviewed
                  ? "1px solid rgba(16, 185, 129, 0.3)"
                  : "1px solid var(--border-subtle)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Checkbox and Title */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 260 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    paddingTop: 3,
                  }}
                  title={isReviewed ? "Marked as reviewed" : "Click to mark as reviewed"}
                >
                  <input
                    type="checkbox"
                    checked={isReviewed}
                    onChange={() => onToggleReviewed(mat.id)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "var(--color-primary)",
                      cursor: "pointer",
                    }}
                  />
                </label>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.1rem" }}>{getIcon(mat.type)}</span>
                    <h4
                      style={{
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {mat.title}
                    </h4>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "1px 6px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {mat.type}
                    </span>
                    {isReviewed && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "var(--color-success)",
                        }}
                      >
                        ✓ Reviewed
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.4 }}>
                    {mat.description}
                  </p>
                </div>
              </div>

              {/* Action Button: Open Material */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setActiveMaterial(mat)}
                  className="btn btn-secondary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    borderRadius: "var(--radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>Open {mat.type === "code" ? "Repository" : "Material"}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Callout & Continue Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 14,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
          Every material contains essential clues needed to satisfy acceptance criteria.
        </span>

        {onContinueToTask && (
          <button
            onClick={onContinueToTask}
            className="btn btn-primary"
            style={{
              padding: "9px 20px",
              fontSize: "0.88rem",
              fontWeight: 700,
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Continue to Task</span>
            <span>↓</span>
          </button>
        )}
      </div>

      {/* Active Modal Viewer */}
      {activeMaterial && (
        <MaterialViewerModal
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
          onMarkReviewed={(id) => onToggleReviewed(id)}
          isReviewed={reviewedMaterialIds.has(activeMaterial.id)}
        />
      )}
    </div>
  );
}
