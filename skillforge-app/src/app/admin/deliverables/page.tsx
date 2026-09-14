"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { deliverableService, DeliverableItem } from "@/services/deliverableService";

export default function AdminDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<DeliverableItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const loadDeliverables = () => {
    setDeliverables(deliverableService.getAllDeliverables());
  };

  useEffect(() => {
    loadDeliverables();
    window.addEventListener("skillforge_deliverable_created", loadDeliverables);
    window.addEventListener("storage", loadDeliverables);
    return () => {
      window.removeEventListener("skillforge_deliverable_created", loadDeliverables);
      window.removeEventListener("storage", loadDeliverables);
    };
  }, []);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleUpdateStatus = (id: string, newStatus: DeliverableItem["status"]) => {
    deliverableService.updateDeliverableStatus(id, newStatus);
    loadDeliverables();
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filtered = deliverables.filter((d) => {
    const matchesSearch =
      d.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.careerTrack.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVerified = deliverables.filter((d) => d.status === "VERIFIED").length;
  const totalPending = deliverables.filter((d) => d.status === "PENDING").length;
  const totalFlagged = deliverables.filter((d) => d.status === "FLAGGED").length;
  const avgScore = deliverables.length > 0
    ? Math.round(deliverables.reduce((acc, curr) => acc + curr.aiScore, 0) / deliverables.length)
    : 0;

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="ADMIN" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Admin Console", href: "/admin" },
              { label: "Deliverables & Code Audit" },
            ]}
          />

          {/* Page Title Header */}
          <div
            style={{
              marginBottom: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  className="badge"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    color: "#10B981",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    fontWeight: 800,
                  }}
                >
                  VERIFIED PROOF AUDIT
                </span>
                <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>
                  • SHA-256 Cryptographic Sandbox Proofs
                </span>
              </div>
              <h2
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Deliverables &amp; Code Proof Audit
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Audit candidate GitHub repositories, inspect automated AI rubric evaluations, test harness passing rates, and SHA-256 credential signatures.
              </p>
            </div>
          </div>

          {/* Summary KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--color-primary)" }}>
                {deliverables.length}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Total Submissions
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Across all simulation labs
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10B981" }}>
                {totalVerified}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Verified Credentials
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Cryptographically minted
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F59E0B" }}>
                {totalPending}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Pending Review
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Awaiting admin verification
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#8B5CF6" }}>
                {avgScore}%
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Average AI Score
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Standardized rubric score
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
              <input
                type="text"
                placeholder="Search candidate name, challenge title, track..."
                className="input"
                style={{ width: "100%", maxWidth: 420 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                Status:
              </span>
              {["ALL", "VERIFIED", "PENDING", "FLAGGED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.75rem", padding: "4px 12px" }}
                >
                  {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Deliverables Table */}
          <div className="card" style={{ padding: 0, border: "1px solid var(--border-default)" }}>
            <div className="table-responsive">
              <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--bg-secondary)",
                    borderBottom: "1px solid var(--border-default)",
                    fontSize: "0.76rem",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <th style={{ padding: "14px 20px" }}>Candidate &amp; Track</th>
                  <th style={{ padding: "14px 16px" }}>Challenge &amp; Deliverable</th>
                  <th style={{ padding: "14px 16px" }}>AI Evaluation</th>
                  <th style={{ padding: "14px 16px" }}>Tests</th>
                  <th style={{ padding: "14px 16px" }}>SHA-256 Proof</th>
                  <th style={{ padding: "14px 16px" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid var(--border-default)",
                      fontSize: "0.85rem",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {/* Candidate */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "var(--color-primary-light)",
                            color: "var(--color-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            flexShrink: 0,
                          }}
                        >
                          {item.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                            {item.candidateName}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                            {item.careerTrack}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Challenge & Repo */}
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          maxWidth: 240,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.challengeTitle}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--color-primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            textDecoration: "none",
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          </svg>
                          Repository
                        </a>
                        {item.demoUrl && (
                          <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>•</span>
                        )}
                        {item.demoUrl && (
                          <a
                            href={item.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "0.72rem",
                              color: "#10B981",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              textDecoration: "none",
                            }}
                          >
                            🔗 Demo
                          </a>
                        )}
                      </div>
                    </td>

                    {/* AI Score */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            color:
                              item.aiScore >= 90
                                ? "#10B981"
                                : item.aiScore >= 80
                                ? "#F59E0B"
                                : "#EF4444",
                          }}
                        >
                          {item.aiScore}/100
                        </div>
                        <div
                          style={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            background: "var(--border-default)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${item.aiScore}%`,
                              height: "100%",
                              background:
                                item.aiScore >= 90
                                  ? "#10B981"
                                  : item.aiScore >= 80
                                  ? "#F59E0B"
                                  : "#EF4444",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: 2 }}>
                        Arch: {item.breakdown.architecture} • Code: {item.breakdown.codeQuality}
                      </div>
                    </td>

                    {/* Tests */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color:
                            item.testsPassed === item.totalTests ? "#10B981" : "#F59E0B",
                        }}
                      >
                        {item.testsPassed}/{item.totalTests} Pass
                      </span>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
                        {Math.round((item.testsPassed / item.totalTests) * 100)}% coverage
                      </div>
                    </td>

                    {/* Proof Hash */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <code
                          style={{
                            fontSize: "0.72rem",
                            background: "var(--bg-secondary)",
                            padding: "2px 6px",
                            borderRadius: 4,
                            border: "1px solid var(--border-default)",
                            fontFamily: "monospace",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {item.sha256Proof.slice(0, 8)}...{item.sha256Proof.slice(-6)}
                        </code>
                        <button
                          onClick={() => handleCopy(item.sha256Proof)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            color: copiedHash === item.sha256Proof ? "#10B981" : "var(--text-tertiary)",
                          }}
                          title="Copy Full SHA-256 Hash"
                        >
                          {copiedHash === item.sha256Proof ? "✓" : "📋"}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 16px" }}>
                      {item.status === "VERIFIED" && (
                        <span className="badge badge-success">Verified Proof</span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="badge badge-warning">Pending Audit</span>
                      )}
                      {item.status === "FLAGGED" && (
                        <span className="badge badge-danger">Flagged</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                      >
                        Inspect Audit 🔍
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🛡️</div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                  No Candidate Deliverables Recorded Yet
                </h4>
                <p style={{ fontSize: "0.82rem", maxWidth: 460, margin: "0 auto 16px" }}>
                  Real-time code submissions from career simulations will appear here automatically with full cryptographic SHA-256 proofs, test harness results, and AI rubric breakdowns.
                </p>
              </div>
            )}
          </div>

          {/* Audit Detail Modal */}
          {selectedItem && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 20,
              }}
              onClick={() => setSelectedItem(null)}
            >
              <div
                className="card"
                style={{
                  width: "100%",
                  maxWidth: 700,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: 28,
                  boxShadow: "var(--shadow-xl)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-primary">{selectedItem.careerTrack}</span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>
                        {selectedItem.submittedAt}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {selectedItem.challengeTitle}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      Candidate: <strong>{selectedItem.candidateName}</strong> ({selectedItem.candidateEmail})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.4rem",
                      cursor: "pointer",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Score Summary Banner */}
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", fontWeight: 700 }}>
                      AI COMPOSITE SCORE
                    </div>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 900,
                        color: selectedItem.aiScore >= 90 ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {selectedItem.aiScore}/100
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Architecture</div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                        {selectedItem.breakdown.architecture}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Code Quality</div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                        {selectedItem.breakdown.codeQuality}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Test Harness</div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                        {selectedItem.breakdown.testCoverage}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Security</div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                        {selectedItem.breakdown.security}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Evaluator Notes */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                    🤖 AI Evaluator Feedback
                  </h4>
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-default)",
                      borderRadius: 8,
                      padding: 14,
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedItem.evaluatorNotes}
                  </div>
                </div>

                {/* Links & Repository */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                    📂 Submitted Code Artifacts
                  </h4>
                  <div style={{ display: "flex", gap: 12 }}>
                    <a
                      href={selectedItem.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span>🐙 GitHub Repository</span>
                    </a>
                    {selectedItem.demoUrl && (
                      <a
                        href={selectedItem.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <span>🚀 Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Cryptographic Proof Card */}
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: "1rem" }}>🛡️</span>
                    <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#10B981" }}>
                      Cryptographic SHA-256 Proof Signature
                    </span>
                  </div>
                  <code
                    style={{
                      display: "block",
                      fontSize: "0.72rem",
                      background: "rgba(0,0,0,0.03)",
                      padding: "8px 10px",
                      borderRadius: 6,
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      color: "var(--text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {selectedItem.sha256Proof}
                  </code>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                    Verifiable against candidate git commit hash and SkillForge automated testing sandbox logs.
                  </div>
                </div>

                {/* Admin Audit Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border-default)",
                    paddingTop: 18,
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleUpdateStatus(selectedItem.id, "VERIFIED")}
                      className="btn btn-sm"
                      style={{
                        background: "#10B981",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      ✓ Mint Verified Credential
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedItem.id, "FLAGGED")}
                      className="btn btn-sm"
                      style={{
                        background: "#EF4444",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      🚩 Flag for Plagiarism/Manual Audit
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="btn btn-sm btn-outline"
                  >
                    Close
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
