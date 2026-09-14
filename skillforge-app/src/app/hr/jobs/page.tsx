"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { deliverableService } from "@/services/deliverableService";

const INITIAL_JOBS = [
  {
    id: 1,
    title: "Software Developer (Backend)",
    track: "Software Developer",
    code: "SD",
    dept: "Engineering",
    experienceLevel: "Junior / Mid",
    simRequired: "Production Bug Fix (Junior Level)",
    candidates: 0,
    shortlisted: 0,
    avgMatch: 0,
    status: "Active",
    posted: "Live"
  },
  {
    id: 2,
    title: "Senior Full Stack Architect",
    track: "Software Developer",
    code: "SD",
    dept: "Core Platform",
    experienceLevel: "Senior",
    simRequired: "Flash Sale Concurrency Bug (Senior Level)",
    candidates: 0,
    shortlisted: 0,
    avgMatch: 0,
    status: "Active",
    posted: "Live"
  },
  {
    id: 3,
    title: "Growth Data Analyst",
    track: "Data Analyst",
    code: "DA",
    dept: "Growth & Product",
    experienceLevel: "Junior",
    simRequired: "Checkout Funnel Drop-off Analysis (Junior Level)",
    candidates: 0,
    shortlisted: 0,
    avgMatch: 0,
    status: "Active",
    posted: "Live"
  },
  {
    id: 4,
    title: "Associate Product Manager",
    track: "Product Manager",
    code: "PM",
    dept: "Product Operations",
    experienceLevel: "Fresher / Entry",
    simRequired: "Notification Center PRD (Fresher Level)",
    candidates: 0,
    shortlisted: 0,
    avgMatch: 0,
    status: "Active",
    posted: "Live"
  }
];

export default function HRJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const rawDeliverables = deliverableService.getAllDeliverables();
    const count = rawDeliverables.length;
    const shortlisted = rawDeliverables.filter((d) => d.status === "VERIFIED").length;
    const avg =
      count > 0
        ? Math.round(rawDeliverables.reduce((a, d) => a + d.aiScore, 0) / count)
        : 0;

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === 1) {
          return {
            ...j,
            candidates: count,
            shortlisted,
            avgMatch: avg || (count > 0 ? 80 : 0),
          };
        }
        return j;
      })
    );
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.dept.toLowerCase().includes(search.toLowerCase()) ||
      j.track.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="RECRUITER" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Recruiter Portal" },
            { label: "Job Postings" }
          ]}
          action={
            <button
              className="btn btn-primary btn-sm"
              style={{ background: "#8B5CF6" }}
              onClick={() => router.push("/hr/jobs/create")}
            >
              + Post New Position
            </button>
          }
        />

        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            Position Management
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Active Job Requisitions</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Manage active roles, customize required technical simulation benchmarks, and inspect candidate rankings.
          </p>
        </div>

        {/* Search & Counter Strip */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search roles by title, department, or track code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420 }}
          />
          <div style={{ marginLeft: "auto" }}>
            <span className="badge badge-success">
              ● {filtered.length} Active Positions
            </span>
          </div>
        </div>

        {/* Jobs List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((j) => (
            <div
              key={j.id}
              className="card"
              style={{
                padding: "20px 24px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "center",
                border: "1px solid var(--border-default)",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = "rgba(139, 92, 246, 0.4)";
                target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = "var(--border-default)";
                target.style.transform = "translateY(0)";
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>{j.title}</h3>
                  <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                    {j.status.toUpperCase()}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: "0.68rem" }}>
                    {j.experienceLevel}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--color-primary-light)", marginBottom: 10 }}>
                  Required Benchmark: <strong>{j.simRequired}</strong>
                </div>

                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>🏢 {j.dept}</span>
                  <span style={{ color: "var(--text-secondary)" }}>👥 {j.candidates} evaluated</span>
                  <span style={{ color: "#F59E0B", fontWeight: 600 }}>⭐ {j.shortlisted} shortlisted</span>
                  <span style={{ color: "#10B981", fontWeight: 600 }}>📊 {j.avgMatch}% avg score</span>
                  <span style={{ color: "var(--text-muted)" }}>Posted {j.posted}</span>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: "#8B5CF6", fontWeight: 600 }}
                  onClick={() => router.push(`/hr/candidates/${j.id}`)}
                >
                  View Ranked Candidates →
                </button>
              </div>
            </div>
          ))}
        </div>
        </main>
      </div>
    </RoleGuard>
  );
}
