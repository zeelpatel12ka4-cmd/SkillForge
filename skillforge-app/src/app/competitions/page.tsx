"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { competitionService, CompetitionRecord, CompetitionTeam } from "@/services/competitionService";
import { authService } from "@/services/authService";

export default function CompetitionsPage() {
  const router = useRouter();
  const currentUser = authService.getCurrentUser();
  const [competitions, setCompetitions] = useState<CompetitionRecord[]>([]);
  const [selectedComp, setSelectedComp] = useState<CompetitionRecord | null>(null);
  const [joinMode, setJoinMode] = useState<"solo" | "team">("solo");

  // Solo form
  const [soloRole, setSoloRole] = useState("Frontend Developer");
  const [soloLevel, setSoloLevel] = useState<"senior" | "junior" | "fresher">("junior");

  // Team form
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [joining, setJoining] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      competitionService.getCompetitions().then((list) => {
        // Show active, evaluating, and completed competitions to candidates (hide draft)
        setCompetitions(list.filter((c) => c.status !== "draft"));
      });
    };
    load();

    if (typeof window !== "undefined") {
      window.addEventListener("skillforge_competitions_updated", load);
      return () => window.removeEventListener("skillforge_competitions_updated", load);
    }
  }, []);

  const handleRegister = async () => {
    if (!selectedComp) return;
    setJoining(true);
    setSuccessMsg(null);

    try {
      const participant = {
        userId: currentUser?.id,
        name: currentUser?.full_name || "Engineering Contributor",
        email: currentUser?.email || "candidate@skillforge.internal",
        role: soloRole,
        experienceLevel: soloLevel,
      };

      let res;
      if (joinMode === "solo") {
        res = await competitionService.joinSolo({
          competitionId: selectedComp.id,
          participant,
        });
      } else {
        res = await competitionService.createOrJoinTeam({
          competitionId: selectedComp.id,
          teamName: teamName || undefined,
          inviteCode: inviteCode || undefined,
          participant,
        });
      }

      setSuccessMsg(res.message);
      setTimeout(() => {
        router.push(`/competitions/${selectedComp.id}`);
      }, 1600);
    } catch (err: any) {
      alert(err.message || "Registration error");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Workspace" },
            { label: "Group Competitions" }
          ]}
          action={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="badge badge-success">Live Hackathons</span>
            </div>
          }
        />

        {/* Page Title & Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="badge badge-primary">COLLABORATIVE SQUAD CHALLENGES</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>• Real Production Scenarios</span>
          </div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Group Competitions &amp; Hackathons
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 740, lineHeight: 1.6, marginTop: 4 }}>
            Collaborate in balanced multi-disciplinary squads (UI/UX, Frontend, Backend, DevOps). Compete for live prizes and top recruiter fast-tracks with <strong>Dual AI Evaluation</strong>: your team earns a group score, while your individual contributions are graded and ranked independently!
          </p>
        </div>

        {/* Competitions Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="card interactive-lift"
              style={{
                padding: 0,
                overflow: "hidden",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Competition Banner Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)",
                  borderBottom: "1px solid var(--border-default)",
                  padding: "24px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className="badge badge-success" style={{ fontWeight: 800 }}>ACTIVE CHALLENGE</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8B5CF6", fontFamily: "JetBrains Mono, monospace" }}>
                      🏆 {comp.prizePool}
                    </span>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>• Squad Size: {comp.teamSize} Members</span>
                  </div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {comp.title}
                  </h3>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{ fontWeight: 700, fontSize: "0.88rem" }}
                    onClick={() => setSelectedComp(comp)}
                  >
                    Join Competition Squad →
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: "0.85rem" }}
                    onClick={() => router.push(`/competitions/${comp.id}`)}
                  >
                    View Live Leaderboard ↗
                  </button>
                </div>
              </div>

              {/* Body Brief & Roles */}
              <div style={{ padding: "26px 28px" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                    Mission Problem Statement
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                    {comp.problemStatement}
                  </p>
                </div>

                {/* Required Roles Matrix */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                    Required Squad Roles (4 Specialized Seats):
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    {(comp.requiredRoles || []).map((r) => (
                      <div
                        key={r.role}
                        style={{
                          padding: "12px 14px",
                          background: "var(--bg-surface-2)",
                          borderRadius: 8,
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {r.role}
                          </span>
                          <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>
                            {r.count} Seat
                          </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {r.skills.map((s) => (
                            <span key={s} style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Propositions */}
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid var(--border-subtle)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <div>🤝 <strong>Smart Matchmaking:</strong> Seniors paired with juniors for real mentorship.</div>
                  <div>⚖️ <strong>Dual AI Scoring:</strong> Individual marks isolated from group performance.</div>
                  <div>🛡️ <strong>Verified Hash:</strong> Cryptographic badge linked to top candidate profiles.</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SQUAD REGISTRATION MODAL ── */}
        {selectedComp && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(10px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setSelectedComp(null)}
          >
            <div
              className="card animate-fade-in"
              style={{
                maxWidth: 580,
                width: "100%",
                padding: 32,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedComp(null)}
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

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="badge badge-primary">REGISTRATION</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>{selectedComp.title}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 20 }}>
                Join Competition Squad
              </h3>

              {successMsg ? (
                <div style={{ padding: 20, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>✓</div>
                  <div style={{ fontWeight: 700, color: "#10B981", fontSize: "0.95rem" }}>{successMsg}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 6 }}>
                    Redirecting to your squad workspace…
                  </div>
                </div>
              ) : (
                <>
                  {/* Join Mode Tabs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22, background: "var(--bg-surface-2)", padding: 4, borderRadius: 8 }}>
                    <button
                      type="button"
                      onClick={() => setJoinMode("solo")}
                      style={{
                        padding: "8px 0",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        background: joinMode === "solo" ? "var(--color-primary)" : "transparent",
                        color: joinMode === "solo" ? "#FFFFFF" : "var(--text-secondary)",
                      }}
                    >
                      ⚡ Join Solo (Smart Match)
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinMode("team")}
                      style={{
                        padding: "8px 0",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        background: joinMode === "team" ? "var(--color-primary)" : "transparent",
                        color: joinMode === "team" ? "#FFFFFF" : "var(--text-secondary)",
                      }}
                    >
                      👥 Create / Join Pre-formed Team
                    </button>
                  </div>

                  {/* Choose Assigned Role */}
                  <div style={{ marginBottom: 18 }}>
                    <label className="input-label">Your Engineering Role in the Squad</label>
                    <select
                      className="input-field"
                      value={soloRole}
                      onChange={(e) => setSoloRole(e.target.value)}
                    >
                      {selectedComp.requiredRoles.map((r) => (
                        <option key={r.role} value={r.role}>{r.role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="input-label">Your Experience Tier (Used for Balanced Pairing)</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {(["fresher", "junior", "senior"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSoloLevel(lvl)}
                          style={{
                            padding: "8px",
                            borderRadius: 6,
                            border: soloLevel === lvl ? "2px solid var(--color-primary)" : "1px solid var(--border-default)",
                            background: soloLevel === lvl ? "var(--color-primary-bg)" : "var(--bg-surface-2)",
                            color: soloLevel === lvl ? "var(--color-primary)" : "var(--text-secondary)",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {lvl === "senior" ? "Senior (4+y)" : lvl === "junior" ? "Junior (1-3y)" : "Fresher (0-1y)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preformed Team Inputs */}
                  {joinMode === "team" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20, padding: 16, background: "var(--bg-surface-2)", borderRadius: 8 }}>
                      <div>
                        <label className="input-label">Create Squad Name (Leave blank if joining existing)</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Distributed ByteForce"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="input-label">Or Enter Team Invite Code</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. ALPHA-77"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        />
                        <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                          If your squad has fewer than 4 members, our engine will automatically match solo peers to fill missing roles!
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", fontWeight: 700 }}
                    disabled={joining}
                    onClick={handleRegister}
                  >
                    {joining ? "Matching Balanced Squad Engine…" : "Confirm Registration & Enter Workspace →"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
