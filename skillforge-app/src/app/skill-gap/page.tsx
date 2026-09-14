"use client";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MISSING = [
  { name: "Containerization (Docker)", priority: "CRITICAL", impact: "+14% Readiness", track: "SD" },
  { name: "CI/CD Pipeline Architecture", priority: "HIGH", impact: "+10% Readiness", track: "SD" },
  { name: "Unit & Integration Testing (Jest/PyTest)", priority: "HIGH", impact: "+8% Readiness", track: "SD" },
];

const WEAK = [
  { name: "System Concurrency & Thread Locking", level: "42%", target: "80%", track: "SD" },
  { name: "Distributed Cache Strategies (Redis)", level: "48%", target: "75%", track: "SD" },
  { name: "REST API Failure Handlers & Circuit Breakers", level: "55%", target: "85%", track: "SD" },
];

const STRONG = [
  { name: "TypeScript / Modern ES6+ Architecture", level: "94%" },
  { name: "PostgreSQL Schema Indexing & Queries", level: "91%" },
  { name: "Git Branching & Pull Request Discipline", level: "88%" },
  { name: "Microservice REST Integration", level: "85%" },
];

export default function SkillGapPage() {
  const router = useRouter();

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopHeader
          breadcrumbs={[
            { label: "Talent Workspace", href: "/dashboard" },
            { label: "Skill Diagnostics & Gap Mitigation" }
          ]}
          actionButton={{
            label: "Explore Career Tracks",
            href: "/careers"
          }}
        />

        <main className="app-main animate-fade-in" style={{ padding: "32px 40px" }}>
          {/* Header Summary */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "28px 32px",
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
            boxShadow: "var(--shadow-card)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className="badge badge-primary" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  DIAGNOSTIC ENGINE: ACTIVE
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                  Track: Software Developer (Junior Level)
                </span>
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.03em" }}>
                Targeted Skill Gap Analysis
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: 640, lineHeight: 1.6 }}>
                Based on your last verified simulation deliverable. Solve targeted real-world scenarios to close critical gaps and unlock Tier-1 recruiter shortlists.
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-default)",
              padding: "16px 24px",
              borderRadius: "var(--radius-md)"
            }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--color-warning)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  67%
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", marginTop: 4, letterSpacing: "0.08em" }}>
                  CAREER READINESS
                </div>
              </div>
              <div style={{ width: 1, height: 44, background: "var(--border-default)" }} />
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-success)", fontWeight: 700 }}>+23% Potential</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>By completing 2 simulations</div>
              </div>
            </div>
          </div>

          {/* Alert: Highest Priority Gaps */}
          <div style={{
            background: "rgba(225,29,72,0.06)",
            border: "1px solid rgba(225,29,72,0.22)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 16
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: "rgba(225,29,72,0.12)",
              color: "#E11D48",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0
            }}>
              ⚡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#E11D48", marginBottom: 2 }}>
                3 Missing Competencies Detected for Junior Role
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Hiring managers for Junior Software Engineers require verified proof of Docker containerization and test coverage.
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => router.push("/simulation/1?track=SD&level=junior")}
              style={{ flexShrink: 0 }}
            >
              Start Junior Simulation →
            </button>
          </div>

          {/* 3-Column Diagnostic Matrix */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
            {/* Missing */}
            <div className="card" style={{ borderColor: "rgba(225,29,72,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E11D48" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Missing Skills</h3>
                </div>
                <span style={{
                  fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace",
                  color: "#E11D48", background: "rgba(225,29,72,0.08)",
                  padding: "2px 8px", borderRadius: 4, fontWeight: 700
                }}>
                  {MISSING.length} UNVERIFIED
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MISSING.map((s) => (
                  <div key={s.name} style={{
                    padding: "12px 14px",
                    background: "rgba(225,29,72,0.04)",
                    border: "1px solid rgba(225,29,72,0.15)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#E11D48", background: "rgba(225,29,72,0.12)", padding: "2px 6px", borderRadius: 3 }}>
                        {s.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 600 }}>
                      Expected Gain: {s.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak */}
            <div className="card" style={{ borderColor: "rgba(217,119,6,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Under Benchmark</h3>
                </div>
                <span style={{
                  fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace",
                  color: "#D97706", background: "rgba(217,119,6,0.08)",
                  padding: "2px 8px", borderRadius: 4, fontWeight: 700
                }}>
                  {WEAK.length} DEVELOPING
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {WEAK.map((s) => (
                  <div key={s.name} style={{
                    padding: "12px 14px",
                    background: "rgba(217,119,6,0.04)",
                    border: "1px solid rgba(217,119,6,0.15)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                      <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "#D97706", fontWeight: 700 }}>
                        {s.level} / {s.target}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--bg-surface-3)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: s.level, height: "100%", background: "#D97706" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strong */}
            <div className="card" style={{ borderColor: "rgba(5,150,105,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Verified Strengths</h3>
                </div>
                <span style={{
                  fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace",
                  color: "#059669", background: "rgba(5,150,105,0.08)",
                  padding: "2px 8px", borderRadius: 4, fontWeight: 700
                }}>
                  {STRONG.length} VERIFIED
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {STRONG.map((s) => (
                  <div key={s.name} style={{
                    padding: "12px 14px",
                    background: "rgba(5,150,105,0.04)",
                    border: "1px solid rgba(5,150,105,0.15)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#059669", fontWeight: 800, fontSize: "0.85rem" }}>✓</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontFamily: "JetBrains Mono, monospace", color: "#059669", fontWeight: 700 }}>
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Real-World Career Simulations */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                  Curated Simulations to Close These Gaps
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Solve real engineering assignments with starter repos, stack traces, and repo submissions.
                </p>
              </div>
              <Link href="/careers" className="btn btn-ghost btn-sm">
                View All 8 Career Tracks →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  title: "Fix Memory Leak & Implement Automated Docker Healthcheck",
                  track: "Software Developer",
                  hardness: "Junior",
                  time: "60 mins",
                  addresses: ["Containerization (Docker)", "REST API Failure Handlers"],
                  deliverable: "GitHub Repo URL + Arch Notes",
                  href: "/simulation/1?track=SD&level=junior"
                },
                {
                  title: "Setup CI/CD GitHub Action Pipeline with Jest Unit Tests",
                  track: "Software Developer",
                  hardness: "Junior",
                  time: "45 mins",
                  addresses: ["Unit & Integration Testing", "CI/CD Pipeline Architecture"],
                  deliverable: "Public GitHub Repo",
                  href: "/simulation/1?track=SD&level=junior"
                },
                {
                  title: "High-Throughput Redis Cache Strategy for Product Catalog",
                  track: "Software Developer",
                  hardness: "Senior",
                  time: "90 mins",
                  addresses: ["Distributed Cache Strategies (Redis)", "System Concurrency"],
                  deliverable: "GitHub Repo + Load Test Log",
                  href: "/simulation/1?track=SD&level=senior"
                }
              ].map((sim, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  gap: 20,
                  flexWrap: "wrap"
                }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {sim.track}
                      </span>
                      <span className="badge badge-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {sim.hardness}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontFamily: "JetBrains Mono, monospace" }}>
                        ⏱ {sim.time}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                      {sim.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Targets:</span>
                      {sim.addresses.map((a) => (
                        <span key={a} style={{
                          fontSize: "0.7rem",
                          background: "var(--color-primary-bg)",
                          color: "var(--color-primary)",
                          padding: "2px 6px",
                          borderRadius: 3
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Deliverable:</div>
                      <div style={{ fontSize: "0.8rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                        {sim.deliverable}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push(sim.href)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Launch Simulation →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
