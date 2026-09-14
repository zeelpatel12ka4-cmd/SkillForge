"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const CAREER_TRACKS = [
  { code: "SWE-01", name: "Software Developer", icon: "💻", color: "var(--color-primary)", tags: ["Next.js", "Docker", "PostgreSQL", "Node.js"], sim: "Production Memory Leak & Redis Cache", image: "/images/swe-simulation.jpg" },
  { code: "DAT-02", name: "Data Analyst", icon: "📊", color: "#0284C7", tags: ["SQL", "Tableau", "Python", "ETL Pipelines"], sim: "Revenue Churn Root-Cause Analysis", image: "/images/data-simulation.jpg" },
  { code: "MKT-03", name: "Digital Marketing", icon: "📢", color: "#D97706", tags: ["CAC Optimization", "SEO", "Meta Ads", "A/B Testing"], sim: "B2B SaaS Growth Funnel Turnaround", image: "/images/marketing-simulation.jpg" },
  { code: "AML-04", name: "AI / ML Engineer", icon: "🤖", color: "#7C3AED", tags: ["PyTorch", "HuggingFace", "RAG", "Model Serving"], sim: "LLM Hallucination Reduction Pipeline", image: "/images/ai-simulation.jpg" },
  { code: "DES-05", name: "UI / UX Designer", icon: "🎨", color: "#DB2777", tags: ["Figma", "Design Systems", "User Research", "WCAG"], sim: "FinTech Mobile Checkout Redesign", image: "/images/ux-simulation.jpg" },
  { code: "SEC-06", name: "Cyber Security", icon: "🔒", color: "#DC2626", tags: ["OWASP", "SIEM", "Pen Testing", "Zero Trust"], sim: "Incident Response & Privilege Escalation Patch", image: "/images/security-simulation.jpg" },
  { code: "PRD-07", name: "Product Manager", icon: "🗂️", color: "#059669", tags: ["PRD Writing", "Sprint Metrics", "User Stories", "Roadmapping"], sim: "Q3 Priority Conflict & Stakeholder Defense", image: "/images/pm-simulation.jpg" },
  { code: "SLS-08", name: "Sales & RevOps", icon: "💼", color: "#EA580C", tags: ["HubSpot", "Outbound SDR", "Enterprise Pitch", "Pipeline Modeling"], sim: "Enterprise Objection Handling & Deal Close", image: "/images/sales-simulation.jpg" },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"candidate" | "recruiter">("candidate");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", color: "var(--text-primary)", transition: "background-color 0.25s ease" }}>
      {/* ── TOP NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        height: "64px",
        padding: "0 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(248, 250, 252, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-default)",
        boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
        transition: "all 0.25s ease",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, color: "#FFFFFF", fontSize: "0.95rem",
            boxShadow: "0 2px 10px var(--color-primary-glow)"
          }}>
            SF
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                Skill<span className="gradient-text">Forge</span>
              </span>
              <span style={{
                fontSize: "0.65rem", fontWeight: 800, color: "var(--color-primary)",
                background: "var(--color-primary-bg)", border: "1px solid var(--color-primary-border)",
                padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em"
              }}>
                ENTERPRISE
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/careers" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}>
            8 Career Tracks
          </Link>
          <Link href="/dashboard" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}>
            Candidate Demo
          </Link>
          <Link href="/hr/dashboard" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}>
            Recruiter ATS
          </Link>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace",
            color: "#059669", background: "rgba(5, 150, 105, 0.08)",
            padding: "4px 10px", borderRadius: 99, border: "1px solid rgba(5, 150, 105, 0.2)"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
            Engine v2.4 Live
          </div>
        </div>

        {/* CTA & Theme Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeSwitcher />
          <Link href="/auth/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link href="/careers" className="btn btn-primary btn-sm">
            Launch Simulation →
          </Link>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        minHeight: "90vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "130px 24px 70px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Soft Background Orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 400,
          background: "radial-gradient(ellipse at center, var(--color-primary-glow) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 940 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "var(--color-primary-bg)",
            border: "1px solid var(--color-primary-border)",
            fontSize: "0.78rem", fontWeight: 700, color: "var(--color-primary)",
            letterSpacing: "0.06em", marginBottom: 24
          }}>
            <span>⚡</span> ZERO MULTIPLE-CHOICE QUIZZES · 100% REAL PRODUCTION DELIVERABLES
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            marginBottom: 24
          }}>
            Don&apos;t just claim your skills.<br />
            <span className="gradient-text">Prove them in live simulations.</span>
          </h1>

          <p style={{
            fontSize: "1.18rem",
            color: "var(--text-secondary)",
            maxWidth: 680,
            margin: "0 auto 36px",
            lineHeight: 1.65
          }}>
            Select from <strong>8 career tracks</strong> and <strong>3 hardness tiers</strong> (Fresher, Junior, Senior).
            Inspect server stack traces, clone starter repositories, and submit verified code repositories for AI rubric grading and direct recruiter shortlisting.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
            <Link href="/careers" className="btn btn-primary btn-lg" style={{ fontSize: "1rem", padding: "14px 28px" }}>
              Choose Track & Hardness Level →
            </Link>
            <Link href="/hr/candidates/1" className="btn btn-ghost btn-lg" style={{ fontSize: "1rem", padding: "14px 28px" }}>
              Inspect ATS Candidate Evaluation
            </Link>
          </div>

          {/* Hardness Badge Selector Visual */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            padding: "10px 20px", background: "var(--bg-card)",
            border: "1px solid var(--border-default)", borderRadius: 99,
            boxShadow: "var(--shadow-sm)"
          }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600 }}>Hardness Tiers:</span>
            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>🌱 Fresher (30m)</span>
            <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>⚡ Junior (60m)</span>
            <span className="badge badge-danger" style={{ fontSize: "0.75rem" }}>🔥 Senior (90m)</span>
          </div>

          {/* ── 3D EDTECH SIMULATION HERO SHOWCASE WITH FLOATING BADGES ── */}
          <div
            className="animate-fade-in"
            style={{
              position: "relative",
              width: "100%",
              marginTop: 48,
              borderRadius: "var(--radius-xl)",
              padding: 8,
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(5, 150, 105, 0.2) 100%)",
              boxShadow: "0 28px 70px -12px rgba(79, 70, 229, 0.18), 0 16px 32px -8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              className="img-zoom-box"
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border-default)",
                background: "var(--bg-surface)",
                position: "relative",
                aspectRatio: "16 / 9",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <img
                src="/images/hero-edtech.jpg"
                alt="Next-Gen EdTech Career Simulation Engine"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Floating Glass Badge 1 - Top Left Live Incident */}
              <div
                className="glass-badge animate-float"
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  padding: "8px 16px",
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "default",
                }}
              >
                <span
                  className="beacon-indicator"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A" }}>
                  Live Incident: Heap OOM #INC-4091
                </span>
                <span className="badge badge-warning" style={{ fontSize: "0.68rem" }}>
                  Junior Tier
                </span>
              </div>

              {/* Floating Glass Badge 2 - Top Right AI Grading Precision */}
              <div
                className="glass-badge animate-float-delayed"
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  padding: "8px 16px",
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "1rem" }}>⚡</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A" }}>
                  98% Rubric Precision
                </span>
                <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                  (Zero MCQ Guesswork)
                </span>
              </div>

              {/* Floating Glass Badge 3 - Bottom Left Verified Git Deliverables */}
              <div
                className="glass-badge animate-float"
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  padding: "10px 16px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "var(--color-primary-bg)",
                    border: "1px solid var(--color-primary-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  📦
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>
                    Verified Git Hash Deliverable
                  </div>
                  <div style={{ fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)" }}>
                    git#7f2a1b9 · hotfix/stream-backpressure
                  </div>
                </div>
              </div>

              {/* Floating Glass Badge 4 - Bottom Right Recruiter Match */}
              <div
                className="glass-badge animate-float-delayed"
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  padding: "8px 16px",
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4F46E5" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>
                  Direct Interview Shortlist
                </span>
                <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                  82% Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TERMINAL & ATS PREVIEW ── */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Toggle Switch */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{
            display: "inline-flex", background: "var(--bg-surface-2)",
            padding: 4, borderRadius: 10, border: "1px solid var(--border-default)"
          }}>
            <button
              onClick={() => setActiveTab("candidate")}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "none",
                background: activeTab === "candidate" ? "var(--bg-surface)" : "transparent",
                color: activeTab === "candidate" ? "var(--color-primary)" : "var(--text-secondary)",
                fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                boxShadow: activeTab === "candidate" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s"
              }}
            >
              💻 Candidate Simulation Workspace
            </button>
            <button
              onClick={() => setActiveTab("recruiter")}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "none",
                background: activeTab === "recruiter" ? "var(--bg-surface)" : "transparent",
                color: activeTab === "recruiter" ? "var(--color-primary)" : "var(--text-secondary)",
                fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                boxShadow: activeTab === "recruiter" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s"
              }}
            >
              🏢 Recruiter ATS Evidence Portal
            </button>
          </div>
        </div>

        {/* Card Frame */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)"
        }}>
          {/* Titlebar */}
          <div style={{
            background: "var(--bg-surface-2)",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-default)",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
              <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", marginLeft: 10 }}>
                {activeTab === "candidate" ? "skillforge-sim-worker // terminal-preview" : "skillforge-ats-verifier // candidate-ranking"}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontFamily: "JetBrains Mono, monospace" }}>
              ENVIRONMENT: PRODUCTION
            </div>
          </div>

          {/* Window Body */}
          {activeTab === "candidate" ? (
            <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 28, background: "var(--bg-card)" }}>
              {/* Terminal Logs */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>
                    CRITICAL BUG INCIDENT: #INC-4091
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>Junior Difficulty (60m)</span>
                </div>
                <div style={{
                  background: "#090D16",
                  border: "1px solid #1E293B",
                  borderRadius: "var(--radius-sm)",
                  padding: "18px 20px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: "#E2E8F0"
                }}>
                  <div style={{ color: "#FB7185", marginBottom: 6 }}>
                    [FATAL] 11:42:09.102 worker-pod-3 FatalError: Heap limit allocation exceeded
                  </div>
                  <div style={{ color: "#94A3B8" }}>
                    &gt; POST /api/v1/checkout/process-batch - 504 Gateway Timeout (12,410ms)
                  </div>
                  <div style={{ color: "#64748B", margin: "8px 0" }}>
                    at TransactionPool.allocateBuffer (/app/dist/pool.js:142:19)<br />
                    at async CheckoutService.commit (/app/dist/services.js:88:9)
                  </div>
                  <div style={{ color: "#34D399" }}>
                    $ git clone git@github.com:skillforge-org/payment-gateway-mock.git
                  </div>
                  <div style={{ color: "#818CF8", marginTop: 4 }}>
                    $ git checkout -b fix/heap-leak-patch
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    readOnly
                    value="https://github.com/arjun-sharma-dev/payment-gateway-mock"
                    style={{
                      flex: 1,
                      background: "var(--bg-surface-2)",
                      border: "1px solid var(--border-default)",
                      borderRadius: 6,
                      padding: "10px 14px",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.85rem",
                      color: "var(--text-primary)"
                    }}
                  />
                  <Link href="/simulation/1?track=SD&level=junior" className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center" }}>
                    Submit Code →
                  </Link>
                </div>
              </div>

              {/* Hardware Telemetry & Objective */}
              <div style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 12 }}>
                    SIMULATION HARDWARE TELEMETRY
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                        <span style={{ color: "var(--text-secondary)" }}>Heap Memory Pressure</span>
                        <span style={{ color: "#E11D48", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>82% (Critical)</span>
                      </div>
                      <div style={{ height: 6, background: "var(--bg-surface-3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: "82%", height: "100%", background: "#E11D48" }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                        <span style={{ color: "var(--text-secondary)" }}>Node CPU Throttle</span>
                        <span style={{ color: "var(--color-warning)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>44% (Moderate)</span>
                      </div>
                      <div style={{ height: 6, background: "var(--bg-surface-3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: "44%", height: "100%", background: "var(--color-warning)" }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 24, padding: "14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-default)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Evaluation Rubric:</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      • Memory allocation profiling &amp; buffer reuse<br />
                      • Docker healthcheck endpoint configuration<br />
                      • Clean Git commit history &amp; architecture write-up
                    </div>
                  </div>
                </div>

                <Link href="/simulation/1?track=SD&level=junior" className="btn btn-ghost btn-sm" style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
                  Launch Full Interactive Workspace ↗
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: "32px", background: "var(--bg-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>Senior Software Engineer Pipeline (#REQ-SWE-88)</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Ranked automatically by verified simulation score — zero resume keyword screening</div>
                </div>
                <Link href="/hr/candidates/1" className="btn btn-primary btn-sm">
                  Open ATS Candidate Inspector →
                </Link>
              </div>

              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden"
              }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "60px 1.5fr 1fr 1fr 120px 140px",
                  padding: "12px 18px", background: "var(--bg-surface-2)",
                  fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.05em"
                }}>
                  <div>RANK</div>
                  <div>CANDIDATE</div>
                  <div>SIMULATION DELIVERABLE</div>
                  <div>AI CONFIDENCE</div>
                  <div>MATCH SCORE</div>
                  <div>ACTION</div>
                </div>

                {[
                  { rank: "#1", name: "Arjun Sharma", track: "Software Dev (Junior)", repo: "github.com/arjun-dev/fix-pool", score: "94%", conf: "98% (High)" },
                  { rank: "#2", name: "Priya Patel", track: "Software Dev (Junior)", repo: "github.com/priya-p/mem-guard", score: "89%", conf: "96% (High)" },
                  { rank: "#3", name: "Rohan Verma", track: "Software Dev (Fresher)", repo: "github.com/rohan-v/patch-demo", score: "84%", conf: "92% (High)" },
                ].map((c) => (
                  <div key={c.rank} style={{
                    display: "grid", gridTemplateColumns: "60px 1.5fr 1fr 1fr 120px 140px",
                    padding: "16px 18px", borderTop: "1px solid var(--border-default)",
                    alignItems: "center", fontSize: "0.85rem"
                  }}>
                    <div style={{ fontWeight: 800, color: "var(--color-primary)", fontFamily: "JetBrains Mono, monospace" }}>{c.rank}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{c.track}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)" }}>{c.repo}</span>
                    </div>
                    <div>
                      <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>{c.conf}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--color-success)" }}>{c.score}</span>
                    </div>
                    <div>
                      <Link href="/hr/candidates/1" className="btn btn-primary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                        Inspect Proof →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 8 CAREER TRACKS SECTION ── */}
      <section style={{ padding: "80px 24px 100px", borderTop: "1px solid var(--border-default)", background: "var(--bg-surface-2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 54 }}>
            <span className="badge badge-primary" style={{ marginBottom: 14 }}>AUTHENTIC WORKSPACES</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Explore the 8 Specialized Career Tracks
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 580, margin: "12px auto 0" }}>
              Each career track has customized starter kits, authentic data, and 3 difficulty tiers to match your experience.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
            {CAREER_TRACKS.map((t) => (
              <div
                key={t.code}
                className="card interactive-lift"
                style={{
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  cursor: "pointer",
                  overflow: "hidden",
                  padding: (t as any).image ? 0 : 24,
                }}
                onClick={() => router.push("/careers")}
              >
                {(t as any).image && (
                  <div className="img-zoom-box" style={{ height: 140, width: "100%", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
                    <img
                      src={(t as any).image}
                      alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 10,
                    }}>
                      <span className="badge badge-primary" style={{ background: "rgba(255, 255, 255, 0.9)", color: "var(--color-primary)", fontWeight: 700 }}>
                        Featured Track
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: (t as any).image ? 20 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: "var(--bg-surface-2)", border: `1px solid var(--border-default)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.3rem"
                    }}>
                      {t.icon}
                    </div>
                    <span style={{
                      fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace",
                      color: "var(--text-tertiary)", fontWeight: 700
                    }}>
                      #{t.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                    {t.name}
                  </h3>

                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>
                    <strong>Scenario:</strong> {t.sim}
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {t.tags.map((tg) => (
                      <span key={tg} style={{
                        fontSize: "0.68rem", padding: "2px 6px",
                        background: "var(--bg-surface-2)",
                        border: "1px solid var(--border-default)",
                        borderRadius: 4, color: "var(--text-secondary)"
                      }}>
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderTop: "1px solid var(--border-default)",
                  padding: (t as any).image ? "12px 20px" : "14px 0 0",
                  background: (t as any).image ? "var(--bg-surface-2)" : "transparent"
                }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700 }}>
                    Fresher · Junior · Senior
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON SECTION ── */}
      <section style={{ padding: "90px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span className="badge badge-warning" style={{ marginBottom: 12 }}>WHY EVIDENCE WINS</span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            Quizzes vs. SkillForge Simulations
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          background: "var(--bg-card)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)", overflow: "hidden",
          boxShadow: "var(--shadow-md)"
        }}>
          {/* Traditional Quiz */}
          <div style={{ padding: "32px", background: "#FFF5F5", borderRight: "1px solid #FED7D7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ color: "#DC2626", fontSize: "1.2rem" }}>✕</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#DC2626" }}>Generic MCQ Assessments</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", color: "#475569" }}>
              <div>• Memorization tricks that don&apos;t reflect day-to-day engineering</div>
              <div>• High vulnerability to ChatGPT tab switching and guesswork</div>
              <div>• Zero artifact for your portfolio or interview defense</div>
              <div>• Recruiters ignore raw test scores with no code verification</div>
            </div>
          </div>

          {/* SkillForge AI */}
          <div style={{ padding: "32px", background: "#F0FDF4", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#059669", fontSize: "1.2rem" }}>✓</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#059669" }}>SkillForge Career Simulations</h3>
              </div>
              <div
                className="img-zoom-box animate-float"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "2px solid #10B981",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/images/verified-badge.jpg"
                  alt="SkillForge Verified Shield"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", color: "#1E293B" }}>
              <div>• Real production stack traces, raw datasets, and Figma briefs</div>
              <div>• Git commits, public repository URLs, and architectural notes</div>
              <div>• Verified GitHub hash badge linked permanently to your report</div>
              <div>• Top HR recruiters fast-track direct interviews based on your code</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "36px 36px",
        borderTop: "1px solid var(--border-default)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, background: "var(--bg-surface)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#FFFFFF", fontSize: "0.8rem"
          }}>
            SF
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
            Skill<span className="gradient-text">Forge</span> AI
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginLeft: 8 }}>
            © 2026 SkillForge AI. Enterprise Career Simulations.
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          <Link href="/careers" style={{ color: "var(--text-secondary)" }}>8 Tracks</Link>
          <Link href="/dashboard" style={{ color: "var(--text-secondary)" }}>Candidate Portal</Link>
          <Link href="/hr/dashboard" style={{ color: "var(--text-secondary)" }}>Recruiter ATS</Link>
          <Link href="/skill-gap" style={{ color: "var(--text-secondary)" }}>Skill Diagnostics</Link>
        </div>
      </footer>
    </div>
  );
}
