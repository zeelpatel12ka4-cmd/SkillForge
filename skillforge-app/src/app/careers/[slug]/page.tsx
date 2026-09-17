"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { getCareerBySlug, CareerDefinition } from "@/data/careerRegistry";
import { getSimulation } from "@/data/simulationBank";
import { deliverableService } from "@/services/deliverableService";
import { SeniorityLevel, SimulationDefinition } from "@/types/simulation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CareerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const [career, setCareer] = useState<CareerDefinition | null>(null);
  const [fresherSim, setFresherSim] = useState<SimulationDefinition | null>(null);
  const [juniorSim, setJuniorSim] = useState<SimulationDefinition | null>(null);
  const [seniorSim, setSeniorSim] = useState<SimulationDefinition | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const c = getCareerBySlug(slug);
      setCareer(c);

      const f = getSimulation(c.code, "fresher");
      const j = getSimulation(c.code, "junior");
      const s = getSimulation(c.code, "senior");
      setFresherSim(f);
      setJuniorSim(j);
      setSeniorSim(s);

      // Check candidate's completed deliverables for this career
      const deliverables = deliverableService.getAllDeliverables();
      const trackDeliverables = deliverables.filter((d) =>
        d.careerTrack.toLowerCase().includes(c.name.toLowerCase()) ||
        d.careerTrack.toLowerCase().includes(c.code.toLowerCase())
      );
      const levelsDone = new Set<string>();
      trackDeliverables.forEach((d) => {
        const ct = d.careerTrack.toLowerCase();
        if (ct.includes("fresher")) levelsDone.add("fresher");
        if (ct.includes("junior")) levelsDone.add("junior");
        if (ct.includes("senior")) levelsDone.add("senior");
      });

      // Also check local simulation attempt submissions
      ["fresher", "junior", "senior"].forEach((lvl) => {
        try {
          const raw = localStorage.getItem(`skillforge_sim_linear_${c.code}_${lvl}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.isSubmitted) levelsDone.add(lvl);
          }
        } catch (_) {}
      });

      setCompletedLevels(levelsDone);
    } catch (err) {
      console.error("Failed to load career detail:", err);
    }
  }, [slug]);

  if (!career || !fresherSim || !juniorSim || !seniorSim) {
    return (
      <div className="app-layout">
        <Sidebar role="CANDIDATE" />
        <main className="app-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--border-default)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p>Loading Career Discipline...</p>
          </div>
        </main>
      </div>
    );
  }

  const levelsCount = 3;
  const completedCount = completedLevels.size;
  const progressPercent = Math.round((completedCount / levelsCount) * 100);

  const tiers: Array<{
    level: SeniorityLevel;
    label: string;
    badgeText: string;
    sim: SimulationDefinition;
    accent: string;
    focus: string;
  }> = [
    {
      level: "fresher",
      label: "FRESHER",
      badgeText: "Guided Practical Tasks",
      sim: fresherSim,
      accent: "#10B981",
      focus: "Focus: Understand → implement defensive checks → validate with unit tests."
    },
    {
      level: "junior",
      label: "JUNIOR",
      badgeText: "Production-Style Problems (Flagship)",
      sim: juniorSim,
      accent: "#6366F1",
      focus: "Focus: Diagnose incident telemetry → design streaming fix → defend canary rollout."
    },
    {
      level: "senior",
      label: "SENIOR",
      badgeText: "Architecture & Scale Trade-offs",
      sim: seniorSim,
      accent: "#8B5CF6",
      focus: "Focus: Analyze high concurrency → architect idempotency & locking → define recovery."
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "SkillForge", href: "/dashboard" },
            { label: "Careers", href: "/careers" },
            { label: career.name }
          ]}
        />

        {/* Career Hero */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 36px 28px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: 200,
            background: `radial-gradient(circle at top right, ${career.color}15 0%, transparent 70%)`,
            pointerEvents: "none"
          }} />

          {/* Breadcrumb back link */}
          <Link
            href="/careers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              marginBottom: 16,
              textDecoration: "none"
            }}
          >
            <span>←</span>
            <span>Back to Career Paths</span>
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: "2rem" }}>{career.emoji}</span>
                <span className="badge badge-primary" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {career.badge}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>
                  Track Code: <strong>{career.code}</strong>
                </span>
              </div>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 10 }}>
                {career.name}
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 820, lineHeight: 1.6 }}>
                {career.description}
              </p>
            </div>

            {/* Quick Readiness Card */}
            <div style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 24px",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                Career Progress
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 900, color: progressPercent > 0 ? "var(--color-primary)" : "var(--text-primary)" }}>
                  {progressPercent}%
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                  ({completedCount} of {levelsCount} Tiers)
                </span>
              </div>
              <div style={{
                height: 6,
                width: "100%",
                borderRadius: "var(--radius-full)",
                background: "var(--border-subtle)",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-primary)"
                }} />
              </div>
            </div>
          </div>

          {/* Skills Covered */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 10 }}>
              Skills Covered in this Career Track
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {career.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: "0.82rem",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                    fontWeight: 600
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section: SIMULATION PATH */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="badge badge-success" style={{ letterSpacing: "0.05em", fontSize: "0.72rem" }}>
              STEP-BY-STEP PROGRESSION
            </span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            SIMULATION PATH
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Complete sequential work simulations to build verified evidence of production-level capability.
          </p>
        </div>

        {/* Simulation Level Cards (3 Tiers) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {tiers.map((tier, idx) => {
            const isCompleted = completedLevels.has(tier.level);
            const taskCount = tier.sim.tasks.length;
            const materialsCount = tier.sim.materials.length;

            return (
              <div
                key={tier.level}
                className="card"
                style={{
                  padding: 28,
                  borderRadius: "var(--radius-xl)",
                  border: isCompleted ? "1px solid var(--color-success)" : "1px solid var(--border-default)",
                  background: "var(--bg-surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  position: "relative"
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      background: `${tier.accent}15`,
                      border: `1px solid ${tier.accent}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      color: tier.accent
                    }}>
                      0{idx + 1}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          {tier.label}
                        </span>
                        <span style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          background: `${tier.accent}18`,
                          color: tier.accent,
                          textTransform: "uppercase"
                        }}>
                          {tier.badgeText}
                        </span>
                        {isCompleted && (
                          <span className="badge badge-success" style={{ fontSize: "0.72rem" }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: 4, color: "var(--text-primary)" }}>
                        {tier.sim.title}
                      </h3>
                    </div>
                  </div>

                  {/* Meta Pills */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      ⏱️ <strong>~{tier.sim.estimatedMinutes} mins</strong>
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      📋 <strong>{taskCount} Tasks</strong>
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      📄 <strong>{materialsCount} Materials</strong>
                    </span>
                  </div>
                </div>

                {/* Scenario Description */}
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {tier.sim.scenario}
                </p>

                {/* Focus Callout */}
                <div style={{
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-subtle)",
                  borderLeft: `4px solid ${tier.accent}`,
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  fontWeight: 500
                }}>
                  {tier.focus}
                </div>

                {/* Tasks Overview & CTA */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-subtle)"
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)", marginRight: 4 }}>
                      Tasks in Sequence:
                    </span>
                    {tier.sim.tasks.map((t, tIdx) => (
                      <span
                        key={t.id}
                        style={{
                          fontSize: "0.78rem",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-default)",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {tIdx + 1}. {t.title.slice(0, 32)}...
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/simulation/1?track=${career.code}&level=${tier.level}`}
                    className="btn btn-primary"
                    style={{
                      padding: "10px 24px",
                      borderRadius: "var(--radius-md)",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      textDecoration: "none"
                    }}
                  >
                    <span>{isCompleted ? "Retake Simulation" : "Start Simulation"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
