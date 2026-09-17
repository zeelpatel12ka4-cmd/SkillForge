"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import {
  competitionService,
  CompetitionRecord,
  CompetitionTeam,
  GroupLeaderboardEntry,
  IndividualLeaderboardEntry,
} from "@/services/competitionService";
import { authService } from "@/services/authService";

export default function CompetitionWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const compId = (params?.id as string) || "comp-fintech-01";
  const currentUser = authService.getCurrentUser();

  const [competition, setCompetition] = useState<CompetitionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"workspace" | "group_leaderboard" | "individual_leaderboard">("workspace");
  const [teams, setTeams] = useState<CompetitionTeam[]>([]);
  const [groupLeaderboard, setGroupLeaderboard] = useState<GroupLeaderboardEntry[]>([]);
  const [indivLeaderboard, setIndivLeaderboard] = useState<IndividualLeaderboardEntry[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");

  // Submission state
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [archNotes, setArchNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      competitionService.getCompetition(compId).then(setCompetition);
      competitionService.getTeams(compId).then(setTeams);
      competitionService.getLeaderboard(compId).then((res) => {
        setGroupLeaderboard(res.groupStandings);
        setIndivLeaderboard(res.individualStandings);
      });
    };
    loadData();
    window.addEventListener("skillforge_competitions_updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("skillforge_competitions_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, [compId]);

  const userEmail = currentUser?.email?.toLowerCase();
  const userId = currentUser?.id;
  const myTeam = teams.find((t) =>
    t.competitionId === compId &&
    t.members.some(
      (m) =>
        (userId && m.userId === userId) ||
        (userEmail && m.email?.toLowerCase() === userEmail)
    )
  );

  const [quickJoining, setQuickJoining] = useState(false);
  const handleQuickJoinSolo = async (role: string = "Frontend Developer") => {
    setQuickJoining(true);
    try {
      const candidateName =
        currentUser?.full_name ||
        (currentUser as any)?.fullName ||
        currentUser?.email?.split("@")[0] ||
        "Candidate Contributor";
      const candidateEmail = currentUser?.email || "candidate@skillforge.com";

      const res = await competitionService.joinSolo({
        competitionId: compId,
        participant: {
          userId: currentUser?.id,
          name: candidateName,
          email: candidateEmail,
          role,
          experienceLevel: "junior",
        },
      });

      const updatedTeams = await competitionService.getTeams(compId);
      setTeams(updatedTeams);
      alert(res.message);
    } catch (err: any) {
      alert(err.message || "Failed to join squad");
    } finally {
      setQuickJoining(false);
    }
  };

  const handleSubmitSquadProject = async () => {
    if (!repoUrl.trim()) {
      alert("Please provide your team's repository URL before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const candidateName =
        currentUser?.full_name ||
        (currentUser as any)?.fullName ||
        currentUser?.email?.split("@")[0] ||
        "Engineering Contributor";
      const candidateEmail = currentUser?.email || "candidate@skillforge.com";

      const teamId = myTeam?.id || `team-${Date.now()}`;
      const teamName = myTeam?.teamName || `${candidateName}'s Squad`;

      const contributions = myTeam && myTeam.members.length > 0
        ? myTeam.members.map((m) => ({
            userId: m.userId,
            email: m.email,
            participantName: m.name,
            role: m.role,
            notes: (userEmail && m.email?.toLowerCase() === userEmail)
              ? (archNotes.trim() || "Implemented core system architecture modules and tests.")
              : "Collaborated on system components and integration.",
            experienceLevel: m.experienceLevel,
          }))
        : [
            {
              userId: currentUser?.id,
              email: candidateEmail,
              participantName: candidateName,
              role: "Backend & Full-Stack Lead",
              notes: archNotes.trim() || "Architected and delivered end-to-end challenge requirements.",
              experienceLevel: "junior" as const,
            },
          ];

      const res = await competitionService.submitProject({
        competitionId: compId,
        teamId,
        teamName,
        repoUrl: repoUrl.trim(),
        liveDemoUrl: demoUrl.trim() || undefined,
        architectureNotes: archNotes.trim() || "Implemented architecture solution according to challenge guidelines.",
        roleContributions: contributions,
      });
      setSubmittedResult(res);

      const lb = await competitionService.getLeaderboard(compId);
      setGroupLeaderboard(lb.groupStandings);
      setIndivLeaderboard(lb.individualStandings);
      setActiveTab("individual_leaderboard");
    } catch (err: any) {
      alert("Submission failed. Please check your repository URL and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIndividualLeaderboard = filterRole === "all"
    ? indivLeaderboard
    : indivLeaderboard.filter((i) => i.role.toLowerCase().includes(filterRole.toLowerCase()));

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Workspace" },
            { label: "Group Competitions", href: "/competitions" },
            { label: competition?.title.substring(0, 32) + "…" || "Challenge" }
          ]}
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={`btn btn-sm ${activeTab === "workspace" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setActiveTab("workspace")}
              >
                🛠️ Squad Workspace
              </button>
              <button
                className={`btn btn-sm ${activeTab === "group_leaderboard" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setActiveTab("group_leaderboard")}
              >
                🏆 Group Leaderboard
              </button>
              <button
                className={`btn btn-sm ${activeTab === "individual_leaderboard" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setActiveTab("individual_leaderboard")}
              >
                🎖️ Individual Leaderboard
              </button>
            </div>
          }
        />

        {/* Challenge Header Card */}
        <div
          className="card"
          style={{
            padding: "20px 24px",
            marginBottom: 24,
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-default)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="badge badge-primary">SQUAD COMPETITION</span>
              <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>• 4 Specialized Roles Required</span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              {competition?.title || "FinTech Challenge"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Prize Pool</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#8B5CF6" }}>{competition?.prizePool}</div>
            </div>
            <div style={{ width: 1, height: 32, background: "var(--border-default)" }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Challenge Closes</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>6d 14h 22m</div>
            </div>
          </div>
        </div>

        {/* ── TAB 1: SQUAD WORKSPACE & SUBMISSION ── */}
        {activeTab === "workspace" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
            {/* Left Column: Problem Brief & Deliverables Submission */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Mission Scenario Brief */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Mission Problem Brief
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.7, marginBottom: 16 }}>
                  {competition?.problemStatement}
                </p>
                <div style={{ padding: 14, background: "var(--bg-surface-2)", borderRadius: 8, border: "1px solid var(--border-default)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
                    Collaborative Architecture Objective:
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {competition?.scenarioBrief}
                  </p>
                </div>
              </div>

              {/* Starter Kit & Git Repos */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                  Starter Repositories &amp; Specs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ padding: "10px 14px", background: "var(--bg-surface-2)", borderRadius: 6, border: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                      git clone {competition?.starterRepoUrl}
                    </span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigator.clipboard.writeText(`git clone ${competition?.starterRepoUrl}`)}
                      style={{ fontSize: "0.72rem" }}
                    >
                      Copy Clone 📋
                    </button>
                  </div>
                </div>
              </div>

              {/* Squad Project Submission Form */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                      Submit Squad Project
                    </h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      Triggers Dual AI Evaluation: Team Rank + Individual Role Marks.
                    </div>
                  </div>
                  <span className="badge badge-primary">Dual AI Scored</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="input-label">Squad Monorepo GitHub URL <span style={{ color: "#EF4444" }}>*</span></label>
                    <input
                      type="url"
                      className="input-field"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/my-squad/fintech-settlement"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>

                  <div>
                    <label className="input-label">Live Cloud Demo / Dashboard URL (Optional)</label>
                    <input
                      type="url"
                      className="input-field"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://settlement-demo.skillforge.app"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>

                  <div>
                    <label className="input-label">Architecture &amp; Contribution Breakdown</label>
                    <textarea
                      className="input-field"
                      style={{ minHeight: 100, resize: "vertical" }}
                      value={archNotes}
                      onChange={(e) => setArchNotes(e.target.value)}
                      placeholder="Briefly describe each member's module contribution..."
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", fontWeight: 700, marginTop: 6 }}
                    disabled={submitting}
                    onClick={handleSubmitSquadProject}
                  >
                    {submitting ? "Dual AI Evaluation Running Rubrics…" : "Submit Squad Deliverable & Calculate Dual Scores ✓"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Squad Roster & Mentorship Pairing */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {myTeam ? (
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Your Balanced Squad
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {myTeam.teamName}
                      </div>
                    </div>
                    <span className={`badge ${myTeam.members.length >= 4 ? "badge-success" : "badge-primary"}`}>
                      {myTeam.members.length >= 4 ? "Squad Full (4/4)" : `Forming (${myTeam.members.length}/4)`}
                    </span>
                  </div>

                  {/* Invite Code Box */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-surface-2)", borderRadius: 8, marginBottom: 16, border: "1px dashed var(--border-default)" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>
                        Squad Invite Code
                      </div>
                      <div style={{ fontSize: "0.86rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#8B5CF6" }}>
                        {myTeam.inviteCode}
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(myTeam.inviteCode);
                        alert(`Squad invite code (${myTeam.inviteCode}) copied to clipboard! Share it with your peers to join.`);
                      }}
                      style={{ fontSize: "0.72rem" }}
                    >
                      Copy Code 📋
                    </button>
                  </div>

                  {/* Real Team Members List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                    {myTeam.members.map((m) => {
                      const isYou = (userId && m.userId === userId) || (userEmail && m.email?.toLowerCase() === userEmail);
                      return (
                        <div
                          key={m.id || m.email}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: isYou ? "var(--color-primary-bg)" : "var(--bg-surface-2)",
                            border: isYou ? "1px solid var(--color-primary-border)" : "1px solid var(--border-default)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: m.isTeamLead ? "#8B5CF6" : isYou ? "var(--color-primary)" : "#10B981",
                                color: "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.78rem",
                                fontWeight: 800,
                              }}
                            >
                              {(m.name || "P")[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                {m.name} {isYou && <span style={{ color: "var(--color-primary)", fontSize: "0.7rem" }}>(You)</span>}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
                                {m.role} {m.isTeamLead && "• Team Lead"}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span className={`badge ${m.experienceLevel === "senior" ? "badge-success" : m.experienceLevel === "junior" ? "badge-primary" : "badge-neutral"}`} style={{ fontSize: "0.68rem" }}>
                              {m.experienceLevel.charAt(0).toUpperCase() + m.experienceLevel.slice(1)} Tier
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Vacant seats */}
                    {Array.from({ length: Math.max(0, 4 - myTeam.members.length) }).map((_, idx) => (
                      <div
                        key={`vacant-${idx}`}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px dashed var(--border-default)",
                          background: "rgba(255, 255, 255, 0.02)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "var(--bg-surface-3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem",
                              color: "var(--text-tertiary)",
                              fontWeight: 700,
                            }}
                          >
                            +
                          </div>
                          <div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                              Open Squad Seat #{myTeam.members.length + idx + 1}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>
                              Share invite code with peers to join
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-neutral" style={{ fontSize: "0.64rem" }}>
                          Vacant
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 12, background: "rgba(16, 185, 129, 0.08)", borderRadius: 8, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", marginBottom: 2 }}>
                      💡 Squad Collaboration Active
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      Collaborate on your shared monorepo. Once ready, submit your solution for Dual AI Evaluation to earn group rank and individual role credentials!
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: 24, border: "1px solid var(--border-default)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                    Squad Status
                  </div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
                    Not Enrolled in a Squad Yet
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                    This hackathon requires a 4-person multi-disciplinary squad. Join via quick solo matchmaking or register on the competitions hub!
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: "100%", fontWeight: 700 }}
                      disabled={quickJoining}
                      onClick={() => handleQuickJoinSolo("Backend Developer")}
                    >
                      {quickJoining ? "Pairing Squad…" : "⚡ Quick Match Solo into a Squad"}
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ width: "100%" }}
                      onClick={() => router.push("/competitions")}
                    >
                      Join / Create Squad with Invite Code →
                    </button>
                  </div>
                </div>
              )}

              {/* Dual Evaluation Guarantee */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Dual Evaluation Guarantee
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>1. Group Score:</strong> Evaluates complete system throughput, architecture cohesion, and end-to-end user experience.
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>2. Individual Role Score:</strong> AI isolates your specific pull requests and commits. If your teammates struggle, your individual excellence is still recognized and awarded a verified credential hash!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: GROUP LEADERBOARD ── */}
        {activeTab === "group_leaderboard" && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  🏆 Squad Standings (Group Leaderboard)
                </h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  Ranked by overall architectural completeness, latency under load, and end-to-end tests.
                </div>
              </div>
              <span className="badge badge-success">Top 3 Win ₹50,000</span>
            </div>

            <div className="table-responsive">
              <div style={{ minWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
                {groupLeaderboard.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🏆</div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                      No Squad Submissions Yet
                    </h4>
                    <p style={{ fontSize: "0.82rem", maxWidth: 460, margin: "0 auto 16px" }}>
                      Form your multi-role engineering squad and submit your solution in the Workspace tab to claim Rank #1!
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("workspace")}>
                      Go to Workspace Tab →
                    </button>
                  </div>
                ) : (
                  groupLeaderboard.map((team) => (
                  <div
                    key={team.teamId}
                    style={{
                      padding: "18px 22px",
                      background: team.rank === 1 ? "rgba(139, 92, 246, 0.04)" : "var(--bg-surface-2)",
                      borderRadius: "var(--radius-md)",
                      border: team.rank === 1 ? "2px solid #8B5CF6" : "1px solid var(--border-default)",
                      display: "grid",
                      gridTemplateColumns: "60px 1.5fr 1fr 140px auto",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: team.rank === 1 ? "#8B5CF6" : "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                      #{team.rank}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>
                        {team.teamName}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: 2 }}>
                        {team.aiVerdict}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {team.members.map((m) => (
                        <span key={m.name} style={{ fontSize: "0.68rem", padding: "2px 6px", background: "var(--bg-surface)", borderRadius: 4, border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                          {m.name} ({m.role})
                        </span>
                      ))}
                    </div>

                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Overall AI Score</div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#10B981" }}>
                        {team.overallScore}%
                      </div>
                    </div>

                    <a
                      href={`https://${team.repoUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Inspect Monorepo ↗
                    </a>
                  </div>
                )))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: INDIVIDUAL ROLE LEADERBOARD ── */}
        {activeTab === "individual_leaderboard" && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  🎖️ Individual Role Standings
                </h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  Individual contributors ranked by role competency — isolated from team score variances.
                </div>
              </div>

              {/* Role filter buttons */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { id: "all", label: "All Roles" },
                  { id: "frontend", label: "Frontend" },
                  { id: "backend", label: "Backend" },
                  { id: "ui", label: "UI / UX" },
                  { id: "devops", label: "DevOps / DB" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterRole(f.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: filterRole === f.id ? "1px solid var(--color-primary)" : "1px solid var(--border-default)",
                      background: filterRole === f.id ? "var(--color-primary-bg)" : "var(--bg-surface-2)",
                      color: filterRole === f.id ? "var(--color-primary)" : "var(--text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-responsive">
              <div style={{ minWidth: 720, display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredIndividualLeaderboard.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🎖️</div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                      No Individual Role Submissions Yet
                    </h4>
                    <p style={{ fontSize: "0.82rem", maxWidth: 460, margin: "0 auto" }}>
                      {filterRole === "all" ? "No candidates have submitted for this competition yet." : `No submissions recorded for the ${filterRole} track yet.`}
                    </p>
                  </div>
                ) : (
                  filteredIndividualLeaderboard.map((indiv, idx) => (
                  <div
                    key={indiv.participantName}
                    style={{
                      padding: "16px 20px",
                      background: "var(--bg-surface-2)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                      display: "grid",
                      gridTemplateColumns: "50px 1.5fr 1fr 140px 180px",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: idx < 3 ? "var(--color-primary)" : "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {indiv.participantName}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: 2 }}>
                        {indiv.roleFeedback}
                      </div>
                    </div>

                    <div>
                      <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                        {indiv.role}
                      </span>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                        Squad: {indiv.teamName}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Individual Score</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#10B981" }}>
                        {indiv.individualScore}%
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)", display: "block" }}>
                        {indiv.verifiedHash}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "#10B981", fontWeight: 700 }}>
                        ✓ Verified Skill Proof
                      </span>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
