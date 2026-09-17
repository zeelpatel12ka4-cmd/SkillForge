"use client";
import React from "react";

interface SubmissionChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting: boolean;
  tasksCompleted: number;
  totalTasks: number;
  materialsReviewed: number;
  totalMaterials: number;
  hasDeliverables: boolean;
}

export default function SubmissionChecklistModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  tasksCompleted,
  totalTasks,
  materialsReviewed,
  totalMaterials,
  hasDeliverables,
}: SubmissionChecklistModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: "520px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: "1.3rem" }}>📋</span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              READY TO SUBMIT?
            </h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
            Review your pre-submission checklist. You will not be able to edit your responses after submitting.
          </p>
        </div>

        {/* Checklist */}
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: tasksCompleted === totalTasks ? "#10B981" : "#F59E0B", fontSize: "1.1rem" }}>
              {tasksCompleted === totalTasks ? "✓" : "○"}
            </span>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
              All {totalTasks} sequenced tasks answered ({tasksCompleted}/{totalTasks})
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: materialsReviewed === totalMaterials ? "#10B981" : "#38BDF8", fontSize: "1.1rem" }}>
              {materialsReviewed === totalMaterials ? "✓" : "○"}
            </span>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
              Diagnostic materials reviewed ({materialsReviewed}/{totalMaterials})
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: hasDeliverables ? "#10B981" : "#F43F5E", fontSize: "1.1rem" }}>
              {hasDeliverables ? "✓" : "✕"}
            </span>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
              Required deliverables and evidence attached
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#10B981", fontSize: "1.1rem" }}>✓</span>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
              Audit trail and timestamps initialized
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div
          style={{
            margin: "0 28px 20px",
            padding: "12px 16px",
            background: "rgba(244, 63, 94, 0.08)",
            border: "1px solid rgba(244, 63, 94, 0.25)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.82rem",
            color: "#F43F5E",
            lineHeight: 1.4,
          }}
        >
          ⚠️ <strong>Final Submission:</strong> Once submitted, your evidence will be locked and sent for multi-dimensional evaluation.
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid var(--border-default)",
            background: "var(--bg-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-secondary"
            style={{ padding: "9px 18px", fontSize: "0.88rem", fontWeight: 600 }}
          >
            Go Back
          </button>

          <button
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              padding: "9px 24px",
              fontSize: "0.88rem",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isSubmitting ? "Recording Work..." : "Confirm & Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
