"use client";
import { useState, useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function DatabaseStatusBadge() {
  const [configured, setConfigured] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  const handleCopySchemaNotice = () => {
    navigator.clipboard.writeText("Run the file: supabase/schema.sql in your Supabase SQL Editor.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.72rem",
          fontWeight: 700,
          fontFamily: "JetBrains Mono, monospace",
          padding: "4px 10px",
          borderRadius: 99,
          border: configured ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
          background: configured ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
          color: configured ? "#059669" : "#D97706",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        title="Click to view database connection details"
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: configured ? "#10B981" : "#F59E0B",
            boxShadow: configured ? "0 0 6px #10B981" : "0 0 6px #F59E0B",
          }}
        />
        {configured ? "Supabase Live" : "DB: Demo Mode"}
      </button>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: 540,
              width: "100%",
              padding: 28,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-default)",
                borderRadius: "50%",
                width: 28,
                height: 28,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-primary)",
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: configured ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                  border: configured ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                {configured ? "⚡" : "⚙️"}
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  {configured ? "Connected to Live Supabase" : "Supabase Connection Guide"}
                </h3>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 2 }}>
                  PostgreSQL · Row Level Security · Real-time Auth
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              {configured
                ? "Your SkillForge application is connected directly to your live Supabase PostgreSQL database. Simulation deliverables, verified credentials, and recruiter ATS candidate updates persist automatically."
                : "SkillForge is currently operating in seamless local demo mode. To connect your live cloud database, configure your Supabase Project credentials."}
            </p>

            <div
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ color: "var(--text-tertiary)", marginBottom: 6 }}>// .env.local Configuration</div>
              <div style={{ color: "var(--text-primary)" }}>
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleCopySchemaNotice}
                style={{ width: "100%", fontWeight: 600, fontSize: "0.85rem" }}
              >
                {copied ? "✓ Copied Migration Path!" : "Copy SQL Schema Path (supabase/schema.sql) 📋"}
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => setModalOpen(false)}
                style={{ width: "100%", fontSize: "0.82rem" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
