"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { getAllCareers, CareerDefinition } from "@/data/careerRegistry";
import { deliverableService } from "@/services/deliverableService";

export default function CareersPage() {
  const careers: CareerDefinition[] = getAllCareers();
  const [progressByTrack, setProgressByTrack] = useState<Record<string, number>>({});

  useEffect(() => {
    // Dynamically calculate candidate progress per track from deliverables
    const deliverables = deliverableService.getAllDeliverables();
    const progressMap: Record<string, number> = {};

    careers.forEach((c) => {
      const matching = deliverables.filter((d) =>
        d.careerTrack.toLowerCase().includes(c.name.toLowerCase()) ||
        d.careerTrack.toLowerCase().includes(c.code.toLowerCase())
      );
      if (matching.length === 0) {
        progressMap[c.code] = 0;
      } else {
        // e.g. 1 simulation completed = 33%, 2 = 66%, 3 = 100%
        const count = Math.min(3, matching.length);
        progressMap[c.code] = Math.round((count / 3) * 100);
      }
    });

    setProgressByTrack(progressMap);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "SkillForge", href: "/dashboard" },
            { label: "Career Paths" }
          ]}
        />

        {/* Page Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="badge badge-primary" style={{ letterSpacing: "0.06em", fontSize: "0.75rem", fontWeight: 700 }}>
              PRACTICAL WORK SIMULATIONS
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              8 Disciplines • 3 Seniority Tiers • 24 Realistic Work Scenarios
            </span>
          </div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            CAREER PATHS
          </h1>
          <p style={{ marginTop: 8, color: "var(--text-secondary)", maxWidth: 780, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Build verified proof of real-world skills through structured work simulations. Step into authentic team incidents, review real diagnostic materials, and submit professional engineering and business deliverables.
          </p>
        </div>

        {/* Careers Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
          alignItems: "stretch"
        }}>
          {careers.map((career) => {
            const progress = progressByTrack[career.code] ?? 0;
            const simCount = career.availableLevels.length;

            return (
              <div
                key={career.code}
                className="card interactive-lift"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 24,
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-surface)",
                  position: "relative",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <div>
                  {/* Top Bar: Icon, Name & Badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 46,
                        height: 46,
                        borderRadius: "var(--radius-md)",
                        background: `${career.color}18`,
                        border: `1px solid ${career.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem"
                      }}>
                        {career.emoji}
                      </div>
                      <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                          {career.name}
                        </h2>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                          {career.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.55,
                    marginBottom: 18,
                    minHeight: 48
                  }}>
                    {career.description}
                  </p>

                  {/* Core Skills Tags */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)", marginBottom: 8 }}>
                      Core Skills
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {career.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          style={{
                            fontSize: "0.78rem",
                            padding: "3px 9px",
                            borderRadius: "var(--radius-full)",
                            background: "var(--bg-subtle)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border-subtle)",
                            fontWeight: 500
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {career.skills.length > 5 && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", alignSelf: "center", paddingLeft: 2 }}>
                          +{career.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Available Levels & Simulation Count */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-subtle)",
                    marginBottom: 18
                  }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase" }}>
                        Available Levels
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "capitalize" }}>
                        Fresher • Junior • Senior
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase" }}>
                        Simulations
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: career.color }}>
                        {simCount} Scenarios
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text-tertiary)" }}>
                        Track Completion
                      </span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: progress > 0 ? "var(--color-primary)" : "var(--text-tertiary)" }}>
                        {progress}%
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
                        width: `${progress}%`,
                        borderRadius: "var(--radius-full)",
                        background: progress > 0 ? "var(--color-primary)" : "transparent",
                        transition: "width 0.4s ease"
                      }} />
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/careers/${career.slug}`}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px 16px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none"
                  }}
                >
                  <span>View Career</span>
                  <span style={{ fontSize: "1.1rem" }}>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
