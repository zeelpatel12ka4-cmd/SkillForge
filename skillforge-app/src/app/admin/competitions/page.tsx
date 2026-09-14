"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { competitionService, CompetitionRecord } from "@/services/competitionService";

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<CompetitionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [scenarioBrief, setScenarioBrief] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [prizePool, setPrizePool] = useState("₹50,000 + Top Recruiter Fast-Tracks");
  const [starterRepo, setStarterRepo] = useState("https://github.com/skillforge-labs/group-starter");

  // Edit Modal State
  const [editingComp, setEditingComp] = useState<CompetitionRecord | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editProblem, setEditProblem] = useState("");
  const [editBrief, setEditBrief] = useState("");
  const [editTeamSize, setEditTeamSize] = useState(4);
  const [editPrizePool, setEditPrizePool] = useState("");
  const [editStarterRepo, setEditStarterRepo] = useState("");
  const [editStatus, setEditStatus] = useState<"draft" | "active" | "evaluating" | "completed">("active");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadCompetitions();

    const handleUpdate = () => {
      loadCompetitions();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("skillforge_competitions_updated", handleUpdate);
      return () => window.removeEventListener("skillforge_competitions_updated", handleUpdate);
    }
  }, []);

  const loadCompetitions = async () => {
    const list = await competitionService.getCompetitions();
    setCompetitions(list);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const created = await competitionService.createCompetition({
        title,
        problemStatement,
        scenarioBrief,
        teamSize,
        prizePool,
        starterRepoUrl: starterRepo,
        requiredRoles: [
          { role: "Frontend Developer", count: 1, skills: ["Next.js", "State Management", "Data Grid"] },
          { role: "Backend Developer", count: 1, skills: ["Node.js/Go", "Distributed Locking", "APIs"] },
          { role: "UI / UX Designer", count: 1, skills: ["Figma", "Design Tokens", "Accessibility"] },
          { role: "Database & DevOps", count: 1, skills: ["PostgreSQL", "Docker", "Load Testing"] },
        ],
      });
      setShowCreateModal(false);
      setTitle("");
      setProblemStatement("");
      setScenarioBrief("");
      setTeamSize(4);
      setPrizePool("₹50,000 + Top Recruiter Fast-Tracks");
      await loadCompetitions();
      showToast(`Competition "${created.title}" launched successfully!`);
    } catch (err: any) {
      alert("Error creating competition: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (comp: CompetitionRecord) => {
    setEditingComp(comp);
    setEditTitle(comp.title);
    setEditProblem(comp.problemStatement);
    setEditBrief(comp.scenarioBrief);
    setEditTeamSize(comp.teamSize || 4);
    setEditPrizePool(comp.prizePool);
    setEditStarterRepo(comp.starterRepoUrl);
    setEditStatus(comp.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;

    setSavingEdit(true);
    try {
      const updated = await competitionService.updateCompetition(editingComp.id, {
        title: editTitle,
        problemStatement: editProblem,
        scenarioBrief: editBrief,
        teamSize: editTeamSize,
        prizePool: editPrizePool,
        starterRepoUrl: editStarterRepo,
        status: editStatus,
      });

      setEditingComp(null);
      await loadCompetitions();
      showToast(`Competition "${updated?.title || editTitle}" updated successfully!`);
    } catch (err: any) {
      alert("Error updating competition: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (comp: CompetitionRecord) => {
    if (!confirm(`Are you sure you want to delete "${comp.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await competitionService.deleteCompetition(comp.id);
      await loadCompetitions();
      showToast(`Competition "${comp.title}" deleted.`);
    } catch (err: any) {
      alert("Error deleting competition: " + err.message);
    }
  };

  const filteredCompetitions = competitions.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || c.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesQuery && matchesStatus;
  });

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="ADMIN" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Admin Console", href: "/admin" },
              { label: "Group Competitions Manager" }
            ]}
            action={
              <button
                id="btn-create-competition"
                className="btn btn-primary btn-sm"
                style={{ background: "#DC2626", boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)" }}
                onClick={() => setShowCreateModal(true)}
              >
                + Launch New Competition
              </button>
            }
          />

          {/* Toast Notification */}
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 10000,
                background: "#059669",
                color: "#FFFFFF",
                padding: "12px 20px",
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Page Title & KPI Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="badge" style={{ background: "rgba(220, 38, 38, 0.1)", color: "#DC2626", border: "1px solid rgba(220, 38, 38, 0.25)", fontWeight: 800 }}>
                MULTI-CHALLENGE HUB
              </span>
              <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>
                • Unlimited Concurrent Hackathons &amp; Squad Challenges
              </span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Group Competitions Manager
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Launch, edit, and orchestrate group competitions without limits. Manage problem statements, prize pools, squad sizes, and live status.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--color-primary)" }}>
                {competitions.length}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Total Competitions
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Unlimited active &amp; drafts
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#10B981" }}>
                {competitions.filter((c) => c.status === "active").length}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Active &amp; Live
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Open for squad registrations
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#F59E0B" }}>
                {competitions.filter((c) => c.status === "draft").length}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Drafts / Staging
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                Unpublished challenges
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#8B5CF6" }}>
                {competitions.filter((c) => c.status === "completed" || c.status === "evaluating").length}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                Evaluating / Completed
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                AI scoring &amp; placement
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div style={{ flex: "1 1 280px" }}>
              <input
                type="text"
                placeholder="Search competition by title or challenge keyword..."
                className="input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", fontSize: "0.85rem" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                Status:
              </span>
              {["ALL", "ACTIVE", "DRAFT", "EVALUATING", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? "btn-primary" : "btn-ghost"}`}
                  style={{
                    fontSize: "0.74rem",
                    padding: "4px 12px",
                    background: statusFilter === st ? "var(--color-primary)" : "var(--bg-surface-2)",
                    color: statusFilter === st ? "#FFFFFF" : "var(--text-primary)",
                  }}
                >
                  {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Competitions Table with Responsive Scroll Container */}
          <div className="card" style={{ padding: 0, border: "1px solid var(--border-default)" }}>
            <div className="table-responsive">
              <div style={{ minWidth: 860 }}>
                {/* Table Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 110px 140px 130px 110px 220px",
                    padding: "14px 20px",
                    background: "var(--bg-surface-2)",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  <div>Competition &amp; Problem Statement</div>
                  <div>Squad Size</div>
                  <div>Prize Pool</div>
                  <div>Required Roles</div>
                  <div>Status</div>
                  <div style={{ textAlign: "right" }}>Actions</div>
                </div>

                {/* Empty State */}
                {filteredCompetitions.length === 0 ? (
                  <div style={{ padding: "48px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏆</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>
                      No competitions found
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                      {competitions.length === 0
                        ? "No competitions have been created yet. Launch your first group challenge!"
                        : "No competitions match your current filters."}
                    </p>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 14, background: "#DC2626" }}
                      onClick={() => setShowCreateModal(true)}
                    >
                      + Launch New Competition
                    </button>
                  </div>
                ) : (
                  filteredCompetitions.map((comp) => {
                    const statusBadgeClass =
                      comp.status === "active"
                        ? "badge-success"
                        : comp.status === "draft"
                        ? "badge-warning"
                        : comp.status === "evaluating"
                        ? "badge-primary"
                        : "badge-ghost";

                    return (
                      <div
                        key={comp.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.4fr 110px 140px 130px 110px 220px",
                          padding: "16px 20px",
                          borderTop: "1px solid var(--border-default)",
                          alignItems: "center",
                          fontSize: "0.85rem",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Competition Info */}
                        <div style={{ paddingRight: 12 }}>
                          <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                            {comp.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                              marginTop: 4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 380,
                            }}
                            title={comp.problemStatement}
                          >
                            {comp.problemStatement}
                          </div>
                        </div>

                        {/* Squad Size */}
                        <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, fontSize: "0.82rem" }}>
                          {comp.teamSize} Members
                        </div>

                        {/* Prize Pool */}
                        <div style={{ color: "#8B5CF6", fontWeight: 700, fontSize: "0.82rem" }}>
                          {comp.prizePool}
                        </div>

                        {/* Required Roles */}
                        <div>
                          <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>
                            {comp.requiredRoles?.length || 4} Roles Required
                          </span>
                        </div>

                        {/* Status */}
                        <div>
                          <span className={`badge ${statusBadgeClass}`} style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                            {comp.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: "0.75rem", padding: "5px 10px", color: "var(--color-primary)" }}
                            onClick={() => openEditModal(comp)}
                            title="Edit competition details"
                          >
                            ✏️ Edit
                          </button>
                          <a
                            href={`/competitions/${comp.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: "0.75rem", padding: "5px 10px" }}
                            title="Open candidate workspace"
                          >
                            ↗ View
                          </a>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: "0.75rem", padding: "5px 8px", color: "#EF4444" }}
                            onClick={() => handleDelete(comp)}
                            title="Delete competition"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ── EDIT COMPETITION MODAL ── */}
          {editingComp && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(10px)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
              onClick={() => setEditingComp(null)}
            >
              <div
                className="card animate-fade-in"
                style={{
                  maxWidth: 640,
                  width: "100%",
                  padding: 28,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setEditingComp(null)}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span className="badge" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--color-primary)", border: "1px solid rgba(79, 70, 229, 0.25)", fontWeight: 800 }}>
                    COMPETITION EDITOR
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    ID: {editingComp.id}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>
                  Edit Competition Details
                </h3>

                <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Challenge Title <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Problem Statement (What the squads must solve) <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      className="input-field"
                      required
                      style={{ minHeight: 85, resize: "vertical" }}
                      value={editProblem}
                      onChange={(e) => setEditProblem(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Scenario &amp; Multi-Role Collaboration Brief <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      className="input-field"
                      required
                      style={{ minHeight: 75, resize: "vertical" }}
                      value={editBrief}
                      onChange={(e) => setEditBrief(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 12 }}>
                    <div>
                      <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                        Squad Size
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={editTeamSize}
                        onChange={(e) => setEditTeamSize(Number(e.target.value))}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                        Prize Pool
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={editPrizePool}
                        onChange={(e) => setEditPrizePool(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                        Live Status
                      </label>
                      <select
                        className="input-field"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        style={{ fontWeight: 600 }}
                      >
                        <option value="active">🟢 Active (Live)</option>
                        <option value="draft">🟡 Draft (Hidden)</option>
                        <option value="evaluating">🟣 Evaluating (Grading)</option>
                        <option value="completed">⚪ Completed (Concluded)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Starter Git Repository URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={editStarterRepo}
                      onChange={(e) => setEditStarterRepo(e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => setEditingComp(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 2, background: "var(--color-primary)", fontWeight: 700 }}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "Saving Updates…" : "Save Competition Changes ✓"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── CREATE COMPETITION MODAL ── */}
          {showCreateModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(10px)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
              onClick={() => setShowCreateModal(false)}
            >
              <div
                className="card animate-fade-in"
                style={{
                  maxWidth: 640,
                  width: "100%",
                  padding: 28,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span className="badge" style={{ background: "rgba(220, 38, 38, 0.1)", color: "#DC2626", border: "1px solid rgba(220, 38, 38, 0.25)", fontWeight: 800 }}>
                    ADMIN CREATOR
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    Unlimited Competitions Engine
                  </span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>
                  Launch New Group Competition
                </h3>

                <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Challenge Title <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      placeholder="e.g. Distributed Fraud Detection & Streaming Pipeline"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Problem Statement (What the squads must solve) <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      className="input-field"
                      required
                      style={{ minHeight: 85, resize: "vertical" }}
                      placeholder="Specify the technical challenge, concurrency bottlenecks, and deliverables..."
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Scenario &amp; Multi-Role Collaboration Brief <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      className="input-field"
                      required
                      style={{ minHeight: 75, resize: "vertical" }}
                      placeholder="Explain how the Frontend, Backend, UI/UX, and DevOps members must collaborate..."
                      value={scenarioBrief}
                      onChange={(e) => setScenarioBrief(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                        Squad Size
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={teamSize}
                        onChange={(e) => setTeamSize(Number(e.target.value))}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                        Prize Pool
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: "0.82rem" }}>
                      Starter Git Repository URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={starterRepo}
                      onChange={(e) => setStarterRepo(e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>

                  <div style={{ padding: 12, background: "var(--bg-surface-2)", borderRadius: 8, border: "1px solid var(--border-default)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    <strong>Multi-Competition Engine:</strong> You can create and run as many competitions as needed simultaneously. Each competition gets its own dedicated squad matchmaking room and live dual AI leaderboard!
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 2, background: "#DC2626", fontWeight: 700 }}
                      disabled={creating}
                    >
                      {creating ? "Deploying Competition…" : "Publish Group Competition Live →"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
}
