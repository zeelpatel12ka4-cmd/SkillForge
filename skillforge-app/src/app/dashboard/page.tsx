"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import BadgeMedallion from "@/components/gamification/BadgeMedallion";
import { authService } from "@/services/authService";
import { gamificationService, UserGamificationProfile } from "@/services/gamificationService";

const SKILLS = [
  { name: "TypeScript & Node.js", score: 86, status: "verified" },
  { name: "Reactive Streaming & Buffers", score: 85, status: "verified" },
  { name: "System Design & Architecture", score: 58, status: "developing" },
  { name: "Distributed Concurrency", score: 48, status: "developing" },
  { name: "SQL & Relational Schemas", score: 90, status: "verified" },
  { name: "Unit & Integration Testing (Jest)", score: 78, status: "verified" },
];

const RECENT_SIMULATIONS = [
  {
    title: "Software Developer — Production Bug Fix",
    level: "Junior",
    score: 82,
    time: "2 hours ago",
    repo: "github.com/arjunsharma/chunked-stream-patch"
  },
  {
    title: "Software Developer — User API Validation",
    level: "Fresher",
    score: 89,
    time: "3 days ago",
    repo: "github.com/arjunsharma/user-validator-fix"
  },
  {
    title: "Data Analyst — Funnel Drop-off Analysis",
    level: "Junior",
    score: 76,
    time: "1 week ago",
    repo: "artifact: checkout_funnel_cohorts.csv"
  }
];

const RECOMMENDATIONS = [
  {
    title: "Attempt Senior Software Simulation",
    reason: "Benchmark your distributed concurrency skills to boost System Design above 75%",
    tier: "High Impact",
    cta: "/careers"
  },
  {
    title: "Review Memory Leak Post-Mortem",
    reason: "Your reasoning rubric in the Junior challenge scored 76% — review streaming backpressure",
    tier: "Insight",
    cta: "/score-report/1"
  },
  {
    title: "Apply with 1-Click to Swiggy & Razorpay",
    reason: "Your 82% verified score qualifies you directly for 3 active engineering positions",
    tier: "Career",
    cta: "/jobs"
  },
];

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 18) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#059669" : score >= 50 ? "#D97706" : "#E11D48";
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease, stroke 0.5s" }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: size > 100 ? "1.5rem" : "1.1rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{score}%</div>
        {size > 100 && <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Readiness</div>}
      </div>
    </div>
  );
}

function DimBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "#059669" : score >= 50 ? "#D97706" : "#E11D48";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>{score}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = authService.getCurrentUser();
  const [profile, setProfile] = useState<UserGamificationProfile>(() =>
    gamificationService.getProfile(currentUser || undefined)
  );

  useEffect(() => {
    const refresh = () => {
      const u = authService.getCurrentUser();
      setProfile(gamificationService.getProfile(u || undefined));
    };
    refresh();
    window.addEventListener("skillforge_xp_updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("skillforge_xp_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

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
              { label: "Workspace" },
              { label: "Candidate Dashboard" }
            ]}
            action={
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: "#8B5CF6", color: "#8B5CF6", fontWeight: 700 }}
                  onClick={() => router.push("/competitions")}
                >
                  🏆 Group Hackathons
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => router.push("/careers")}>
                  Launch Simulation →
                </button>
              </div>
            }
          />

          {/* Group Competitions Callout Banner */}
          <div
            className="card interactive-lift"
            style={{
              marginBottom: 20,
              padding: "18px 24px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              cursor: "pointer",
            }}
            onClick={() => router.push("/competitions")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                }}
              >
                🏆
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span className="badge badge-primary" style={{ fontWeight: 800, fontSize: "0.68rem" }}>
                    LIVE SQUAD HACKATHON
                  </span>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                    Multi-Role Engine (UI/UX + Frontend + Backend + DevOps)
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-primary)" }}>
                  Real-Time FinTech Payment Settlement Engine — ₹2,50,000 Prize Pool
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  Solo Matchmaking pairs you with senior mentors. Get Dual AI grading for both team rank &amp; individual role score!
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-sm"
              style={{ background: "#6366F1", fontWeight: 700 }}
              onClick={(e) => {
                e.stopPropagation();
                router.push("/competitions");
              }}
            >
              Join Squad Challenge →
            </button>
          </div>

          {/* Real-time Gamification & Badges Showcase Card */}
          <div
            className="card"
            style={{
              padding: "18px 24px",
              marginBottom: 24,
              border: "1px solid var(--border-default)",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              {/* Level & XP Gauge */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    color: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <span style={{ fontSize: "0.58rem", opacity: 0.85 }}>LVL</span>
                  <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>{profile.level}</span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {profile.rankTitle}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: "0.68rem" }}>
                      🔥 {profile.streakDays}d Streak
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <div
                      style={{
                        width: 140,
                        height: 6,
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
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                      {profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Earned Badges Showcase */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {profile.badges.length > 0 ? (
                  profile.badges.slice(0, 4).map((b) => (
                    <div
                      key={b.badgeId}
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push("/badges")}
                      title={`${b.title} (${b.tier.toUpperCase()})`}
                    >
                      <BadgeMedallion
                        title=""
                        tier={b.tier}
                        shape={b.shape}
                        icon={b.icon}
                        isUnlocked={true}
                        rankPosition={b.rankPosition}
                        scoreAchieved={b.scoreAchieved}
                        size={48}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                    No badges earned yet. Complete your first challenge to unlock!
                  </div>
                )}

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.78rem", color: "#8B5CF6", fontWeight: 700 }}
                  onClick={() => router.push("/badges")}
                >
                  View All Badges ({profile.badges.length}) →
                </button>
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary-light)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Candidate Overview
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              {currentUser?.fullName || "Arjun Sharma"}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Target Track: <strong>Software Developer</strong> · {profile.completedSimulationsCount} Verified Technical Deliverables Recorded
            </p>
          </div>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 1fr", gap: 18, marginBottom: 20 }}>
          {/* Career Readiness Score */}
          <div
            className="card interactive-lift"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              padding: 24,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 4 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Simulation Readiness
              </div>
              <div className="img-zoom-box animate-float" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(79, 70, 229, 0.3)" }} title="Accredited Verification">
                <img src="/images/verified-badge.jpg" alt="Verified Badge" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            <ScoreRing score={82} size={124} />
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>Software Developer</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Evaluated against enterprise rubrics
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: "auto" }} onClick={() => router.push("/skill-gap")}>
              View Detailed Skill Matrix →
            </button>
          </div>

          {/* Dimension breakdown */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.88rem" }}>
              Core Competency Dimensions
            </div>
            <DimBar label="Technical Correctness" score={85} />
            <DimBar label="Problem-Solving & Diagnostics" score={80} />
            <DimBar label="Code Quality & Test Rigor" score={78} />
            <DimBar label="Reasoning & Edge Cases" score={72} />
            <DimBar label="Communication & Post-Mortem" score={86} />
          </div>

          {/* Recommended actions */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 4 }}>Priority Milestones</div>
            {RECOMMENDATIONS.map((r) => (
              <div
                key={r.title}
                style={{
                  padding: "10px 12px",
                  background: "var(--bg-surface-2)",
                  borderRadius: 8,
                  border: "1px solid var(--border-default)",
                  cursor: "pointer",
                }}
                onClick={() => router.push(r.cta)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)" }}>{r.title}</div>
                  <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>{r.tier}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{r.reason}</div>
              </div>
            ))}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => router.push("/careers")}
              style={{ marginTop: "auto" }}
            >
              Configure Next Simulation →
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {/* Skill Profile */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.88rem", display: "flex", justifyContent: "space-between" }}>
              <span>Verified Skill Matrix</span>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/skill-gap")}>
                Full Report
              </button>
            </div>
            {SKILLS.map((s) => {
              const isVerified = s.status === "verified";
              const color = isVerified ? "#059669" : "#D97706";
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 170, fontSize: "0.78rem", color: "var(--text-secondary)", flexShrink: 0 }}>{s.name}</div>
                  <div style={{ flex: 1, height: 5, background: "var(--bg-surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.score}%`, background: color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color, width: 32, textAlign: "right" }}>{s.score}%</span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: isVerified ? "rgba(5, 150, 105, 0.1)" : "rgba(217, 119, 6, 0.1)",
                      color,
                      border: `1px solid ${isVerified ? "rgba(5, 150, 105, 0.2)" : "rgba(217, 119, 6, 0.2)"}`,
                      flexShrink: 0,
                    }}
                  >
                    {isVerified ? "VERIFIED" : "EXPAND"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recent Graded Simulations */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.88rem", display: "flex", justifyContent: "space-between" }}>
              <span>Recent Simulation Deliverables</span>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/simulation")}>
                History
              </button>
            </div>
            {RECENT_SIMULATIONS.map((r) => (
              <div key={r.title} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-default)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.title}
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>{r.level}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2, fontFamily: "JetBrains Mono, monospace" }}>
                    {r.repo} • {r.time}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: "1rem", color: r.score >= 75 ? "#059669" : "#D97706" }}>
                    {r.score}%
                  </div>
                  <div style={{ fontSize: "0.58rem", color: "var(--text-tertiary)", fontWeight: 700 }}>AI SCORE</div>
                </div>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 12 }} onClick={() => router.push("/simulation")}>
              View All Technical Deliverables →
            </button>
          </div>
        </div>
      </main>
    </div>
    </RoleGuard>
  );
}
