"use client";
import React, { useState, useEffect } from "react";
import { Material } from "@/types/simulation";

interface MaterialViewerModalProps {
  material: Material | null;
  onClose: () => void;
  onMarkReviewed?: (id: string) => void;
  isReviewed?: boolean;
}

export default function MaterialViewerModal({
  material,
  onClose,
  onMarkReviewed,
  isReviewed = false,
}: MaterialViewerModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!material) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(material.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
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
          maxWidth: "880px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.4rem" }}>{getIcon(material.type)}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {material.title}
                </h3>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(99, 102, 241, 0.1)",
                    color: "var(--color-primary)",
                  }}
                >
                  {material.type}
                </span>
                {material.filename && (
                  <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", fontFamily: "monospace" }}>
                    ({material.filename})
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                {material.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Relevance callout banner */}
        <div
          style={{
            padding: "10px 24px",
            background: "rgba(16, 185, 129, 0.08)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            fontSize: "0.82rem",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            💡 <strong>Relevance to Task:</strong> {material.relevance}
          </span>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{
              padding: "4px 12px",
              fontSize: "0.78rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
            }}
          >
            {copied ? "✓ Copied Content" : "Copy to Clipboard"}
          </button>
        </div>

        {/* Content Viewer Body */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            flex: 1,
            background: material.type === "logs" || material.type === "code" ? "#0F172A" : "var(--bg-surface)",
            color: material.type === "logs" || material.type === "code" ? "#E2E8F0" : "var(--text-primary)",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: "0.88rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {material.content}
          </pre>
        </div>

        {/* Modal Footer with Checkbox */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-subtle)",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            <input
              type="checkbox"
              checked={isReviewed}
              onChange={() => onMarkReviewed && onMarkReviewed(material.id)}
              style={{ width: 18, height: 18, accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
            <span>Mark this material as reviewed</span>
          </label>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: "0.88rem", fontWeight: 700 }}
          >
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
