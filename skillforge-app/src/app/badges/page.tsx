"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import BadgeMedallion from "@/components/gamification/BadgeMedallion";
import { authService } from "@/services/authService";
import {
  gamificationService,
  ALL_BADGE_DEFINITIONS,
  BadgeDefinition,
  UserEarnedBadge,
  UserGamificationProfile,
} from "@/services/gamificationService";

export default function BadgesPage() {
  const currentUser = authService.getCurrentUser();
  const [profile, setProfile] = useState<UserGamificationProfile>(
    gamificationService.getProfile(currentUser || undefined)
  );
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedBadge, setSelectedBadge] = useState<{
    def: BadgeDefinition;
    earned?: UserEarnedBadge;
  } | null>(null);
  const [xpLeaderboard, setXpLeaderboard] = useState<any[]>([]);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const user = authService.getCurrentUser();
      setProfile(gamificationService.getProfile(user || undefined));
      setXpLeaderboard(gamificationService.getGlobalXpLeaderboard());
    };

    refresh();
    window.addEventListener("skillforge_xp_updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("skillforge_xp_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const earnedMap = new Map<string, UserEarnedBadge>();
  profile.badges.forEach((b) => earnedMap.set(b.badgeId, b));

  const filteredBadges = ALL_BADGE_DEFINITIONS.filter((def) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "EARNED") return earnedMap.has(def.id);
    if (activeCategory === "LOCKED") return !earnedMap.has(def.id);
    if (activeCategory === "COMPETITION") return def.category === "competition";
    if (activeCategory === "SIMULATION") return def.category === "simulation";
    if (activeCategory === "SECRET") return def.category === "secret";
    return true;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const currentLevelMin = profile.currentLevelBaseXp || 0;
  const nextLevelMax = profile.nextLevelXp || 500;
  const xpInCurrentLevel = Math.max(0, profile.xp - currentLevelMin);
  const xpRequiredForLevel = Math.max(1, nextLevelMax - currentLevelMin);
  const xpPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForLevel) * 100));

  return (
    <RoleGuard allowedRoles={["CANDIDATE", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="CANDIDATE" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Candidate Workspace", href: "/dashboard" },
              { label: "Badges & XP Progression" },
            ]}
          />

          {/* Gamification Hero Banner */}
          <div
            className="card"
            style={{
              padding: "24px 28px",
              marginBottom: 28,
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              {/* Level & Rank */}
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    color: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    boxShadow: "0 6px 16px rgba(99, 102, 241, 0.35)",
                    border: "2px solid #FFFFFF",
                  }}
                >
                  <span style={{ fontSize: "0.68rem", opacity: 0.85, textTransform: "uppercase" }}>LVL</span>
                  <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{profile.level}</span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-primary" style={{ fontWeight: 800 }}>
                      RANK TIER
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                      🔥 {profile.streakDays}-Day Activity Streak
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--text-primary)" }}>
                    {profile.rankTitle}
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Real-time XP updates dynamically with every simulation challenge and hackathon score.
                  </p>
                </div>
              </div>

              {/* XP Gauge & Badges Unlocked */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: "var(--bg-surface)",
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1px solid var(--border-default)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                      {profile.xp.toLocaleString()} XP
                    </span>
                    <span style={{ color: "var(--text-tertiary)" }}>
                      Goal: {profile.nextLevelXp.toLocaleString()} XP
                    </span>
                  </div>
                  <div
                    style={{
                      width: 180,
                      height: 8,
                      background: "var(--border-default)",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${xpPercentage}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                        borderRadius: 99,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                    {profile.nextLevelXp - profile.xp > 0
                      ? `${(profile.nextLevelXp - profile.xp).toLocaleString()} XP to Level ${profile.level + 1}`
                      : "Max Tier Reached!"}
                  </div>
                </div>

                <div style={{ borderLeft: "1px solid var(--border-default)", paddingLeft: 20, textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#F59E0B" }}>
                    {profile.badges.length} / {ALL_BADGE_DEFINITIONS.length}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                    Badges Unlocked
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Navigation Tabs */}
          <div
            className="card"
            style={{
              padding: "14px 18px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: `All Badges (${ALL_BADGE_DEFINITIONS.length})` },
                { id: "EARNED", label: `🏆 Earned (${profile.badges.length})` },
                { id: "LOCKED", label: `🔒 Locked (${ALL_BADGE_DEFINITIONS.length - profile.badges.length})` },
                { id: "LEADERBOARD", label: `⚡ Live XP Leaderboard (${xpLeaderboard.length})` },
                { id: "COMPETITION", label: "Hackathon Ranks" },
                { id: "SIMULATION", label: "Simulation Mastery" },
                { id: "SECRET", label: "Secret Badges" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`btn btn-sm ${activeCategory === tab.id ? "btn-primary" : "btn-ghost"}`}
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "6px 14px",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>
              Strict Real-Time Engine • 0 Fake Profiles
            </div>
          </div>

          {/* Real-Time XP Leaderboard Tab */}
          {activeCategory === "LEADERBOARD" ? (
            <div className="card" style={{ padding: "24px 28px", marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                    ⚡ Platform Real-Time Candidate XP Standings
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Rankings dynamically calculated from completed career simulations and hackathons. Zero synthetic bot records.
                  </p>
                </div>
                <span className="badge badge-primary">
                  {xpLeaderboard.length} Verified {xpLeaderboard.length === 1 ? "Candidate" : "Candidates"}
                </span>
              </div>

              {xpLeaderboard.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                  <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🏅</div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>No Candidate XP Records Yet</h4>
                  <p style={{ fontSize: "0.82rem", maxWidth: 460, margin: "6px auto 16px" }}>
                    Complete your first code simulation to earn XP, advance through Level tiers, and claim Rank #1!
                  </p>
                  <a href="/simulation/1" className="btn btn-primary btn-sm">Start a Simulation →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {xpLeaderboard.map((item) => (
                    <div
                      key={item.userId}
                      style={{
                        padding: "16px 20px",
                        background: item.rank === 1 ? "rgba(99, 102, 241, 0.05)" : "var(--bg-surface-2)",
                        border: item.rank === 1 ? "2px solid #6366F1" : "1px solid var(--border-default)",
                        borderRadius: "var(--radius-md)",
                        display: "grid",
                        gridTemplateColumns: "50px 1.5fr 1fr 120px 120px",
                        gap: 16,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: item.rank === 1 ? "#6366F1" : "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                        #{item.rank}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                          {item.fullName}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                          {item.email}
                        </div>
                      </div>
                      <div>
                        <span className="badge badge-outline" style={{ fontSize: "0.72rem", color: "#8B5CF6", borderColor: "rgba(139, 92, 246, 0.3)" }}>
                          Level {item.level} • {item.rankTitle}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Earned Badges</div>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          🏆 {item.badgesCount}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Total XP</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#10B981" }}>
                          {item.xp} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Badges Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 18,
                  marginBottom: 32,
                }}
              >
                {filteredBadges.map((def) => {
                  const earned = earnedMap.get(def.id);
                  const isUnlocked = Boolean(earned);

                  return (
                    <div
                      key={def.id}
                      className={`card interactive-lift ${isUnlocked ? "animate-fade-in" : ""}`}
                      style={{
                        padding: "22px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        border: isUnlocked ? "1.5px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border-default)",
                        background: isUnlocked ? "var(--bg-surface)" : "var(--bg-surface-2)",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedBadge({ def, earned })}
                    >
                      {/* Tier / Status Tag */}
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          right: 14,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.04em",
                            padding: "2px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                            background:
                              def.tier === "gold"
                                ? "rgba(245, 158, 11, 0.15)"
                                : def.tier === "diamond"
                                ? "rgba(6, 182, 212, 0.15)"
                                : def.tier === "mythic"
                                ? "rgba(168, 85, 247, 0.15)"
                                : "rgba(100, 116, 139, 0.15)",
                            color:
                              def.tier === "gold"
                                ? "#F59E0B"
                                : def.tier === "diamond"
                                ? "#06B6D4"
                                : def.tier === "mythic"
                                ? "#A855F7"
                                : "#94A3B8",
                          }}
                        >
                          {def.tier}
                        </span>
                      </div>

                      {/* Medallion Component */}
                      <div style={{ margin: "8px 0 16px" }}>
                        <BadgeMedallion
                          title={def.title}
                          tier={def.tier}
                          shape={def.shape}
                          icon={def.icon}
                          isUnlocked={isUnlocked}
                          size={64}
                        />
                      </div>

                      <h4
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: isUnlocked ? "var(--text-primary)" : "var(--text-secondary)",
                          marginBottom: 6,
                        }}
                      >
                        {def.title}
                      </h4>

                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                          marginBottom: 14,
                        }}
                      >
                        {def.description}
                      </p>

                      {/* Requirement Card */}
                      <div
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: isUnlocked ? "rgba(16, 185, 129, 0.08)" : "var(--bg-page)",
                          border: `1px solid ${isUnlocked ? "rgba(16, 185, 129, 0.25)" : "var(--border-default)"}`,
                          borderRadius: 8,
                          fontSize: "0.72rem",
                          color: isUnlocked ? "#10B981" : "var(--text-tertiary)",
                          marginBottom: 14,
                          marginTop: "auto",
                          fontWeight: 600,
                        }}
                      >
                        {isUnlocked ? `✓ Requirement Fulfilled` : `Target: ${def.requirement}`}
                      </div>

                      {/* Footer Stats */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid var(--border-default)",
                          paddingTop: 10,
                          fontSize: "0.72rem",
                        }}
                      >
                        <span style={{ fontWeight: 800, color: "#8B5CF6" }}>
                          +{def.xpReward} XP
                        </span>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBadge({ def, earned });
                          }}
                        >
                          Inspect →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredBadges.length === 0 && (
                <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-secondary)" }}>
                  No badges found in this category yet.
                </div>
              )}
            </>
          )}

          {/* Badge Inspection Modal */}
          {selectedBadge && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: 20,
              }}
              onClick={() => setSelectedBadge(null)}
            >
              <div
                className="card animate-fade-in"
                style={{
                  maxWidth: 540,
                  width: "100%",
                  padding: 32,
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBadge(null)}
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
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>

                {/* Medallion Display */}
                <div style={{ marginBottom: 18, transform: "scale(1.25)", display: "inline-block" }}>
                  <BadgeMedallion
                    title=""
                    tier={selectedBadge.def.tier}
                    shape={selectedBadge.def.shape}
                    icon={selectedBadge.def.icon}
                    isUnlocked={Boolean(selectedBadge.earned)}
                    rankPosition={selectedBadge.earned?.rankPosition}
                    scoreAchieved={selectedBadge.earned?.scoreAchieved}
                    size={84}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  <span className="badge badge-primary" style={{ textTransform: "uppercase" }}>
                    {selectedBadge.def.tier} TIER
                  </span>
                  {selectedBadge.earned ? (
                    <span className="badge badge-success">VERIFIED UNLOCKED</span>
                  ) : (
                    <span className="badge badge-neutral">LOCKED</span>
                  )}
                </div>

                <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: 8 }}>
                  {selectedBadge.def.title}
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  {selectedBadge.def.description}
                </p>

                {/* Unlock Requirement or Achievement Data */}
                <div
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 10,
                    padding: 16,
                    textAlign: "left",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 6 }}>
                    Criterion Benchmark:
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {selectedBadge.def.requirement}
                  </div>

                  {selectedBadge.earned && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-default)", fontSize: "0.78rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", marginBottom: 4 }}>
                        <span>Awarded Timestamp:</span>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {new Date(selectedBadge.earned.awardedAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedBadge.earned.scoreAchieved !== undefined && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", marginBottom: 4 }}>
                          <span>Score Achieved:</span>
                          <span style={{ fontWeight: 800, color: "#10B981" }}>
                            {selectedBadge.earned.scoreAchieved}% Precision
                          </span>
                        </div>
                      )}
                      {selectedBadge.earned.rankPosition && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", marginBottom: 4 }}>
                          <span>Competition Placement:</span>
                          <span style={{ fontWeight: 800, color: "#F59E0B" }}>
                            Rank #{selectedBadge.earned.rankPosition}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Proof Hash for Earned Badges */}
                {selectedBadge.earned && (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.06)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#10B981" }}>
                        CRYPTOGRAPHIC PROOF SIGNATURE
                      </div>
                      <code style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                        {selectedBadge.earned.verifiedHash}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopyHash(selectedBadge.earned!.verifiedHash)}
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: "0.72rem", color: copiedHash ? "#10B981" : "var(--color-primary)" }}
                    >
                      {copiedHash ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                )}

                {/* Action CTA */}
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  {selectedBadge.earned ? (
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => {
                        handleCopyHash(selectedBadge.earned!.verifiedHash);
                        alert("Credential verification link copied! Ready to share on LinkedIn or resume.");
                      }}
                    >
                      🚀 Share Proof on LinkedIn / Resume
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => {
                        setSelectedBadge(null);
                        window.location.href = selectedBadge.def.category === "competition" ? "/competitions" : "/careers";
                      }}
                    >
                      Start Challenge to Unlock (+{selectedBadge.def.xpReward} XP) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
}
