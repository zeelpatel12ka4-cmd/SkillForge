"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { atsService } from "@/services/atsService";
import { authService } from "@/services/authService";
import { jobService, JobListing } from "@/services/jobService";

export default function CandidateJobsPage() {
  const router = useRouter();
  const currentUser = authService.getCurrentUser();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filter, setFilter] = useState("all");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [applyingId, setApplyingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadJobs = () => {
    setJobs(jobService.getJobs());
    const existing = atsService.getJobApplications().map((a) => String(a.jobId));
    setAppliedJobIds(existing);
  };

  useEffect(() => {
    loadJobs();
    window.addEventListener("skillforge_job_created", loadJobs);
    window.addEventListener("skillforge_application_submitted", loadJobs);
    return () => {
      window.removeEventListener("skillforge_job_created", loadJobs);
      window.removeEventListener("skillforge_application_submitted", loadJobs);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApply = async (j: JobListing) => {
    setApplyingId(j.id);
    try {
      const app = await atsService.applyToJob({
        jobId: String(j.id),
        jobTitle: j.title,
        company: j.company,
        candidateId: currentUser?.id,
        candidateName: currentUser?.full_name || (currentUser as any)?.fullName || currentUser?.email?.split("@")[0] || "Candidate",
        candidateEmail: currentUser?.email || "candidate@skillforge.com",
        careerTrack: j.track,
        candidateScore: j.candidateScore || 80,
        requiredSkills: j.tags,
      });

      setAppliedJobIds((prev) => [...prev, String(j.id)]);
      showToast(`🚀 Application submitted to ${j.company}! Gemini Semantic Fit: ${app.matchPercentage}%.`);
    } catch (err: any) {
      alert("Error applying: " + err.message);
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = jobs.filter(
    (j) => filter === "all" || j.track.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Workspace" },
            { label: "Job Opportunities" }
          ]}
          action={
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/careers")}>
              Boost Your Score →
            </button>
          }
        />

        {toastMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: "12px 18px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "var(--radius-md)",
              color: "#10B981",
              fontWeight: 600,
              fontSize: "0.85rem",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary-light)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            Direct Hiring Opportunities
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Verified Opportunities</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Top tech organizations skip traditional resume screenings when you exceed their simulation benchmarks.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {["all", "Software Developer", "Data Analyst", "UI / UX Designer"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
                border: filter === t ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                background: filter === t ? "var(--color-primary-bg)" : "transparent",
                color: filter === t ? "var(--color-primary-light)" : "var(--text-secondary)",
                textTransform: "capitalize",
              }}
            >
              {t === "all" ? "All Tracks" : t}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((j) => {
            const candidateScore = j.candidateScore ?? 0;
            const isQualified = candidateScore >= j.minScore;
            return (
              <div
                key={j.id}
                className="card"
                style={{
                  padding: "22px 26px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 24,
                  alignItems: "center",
                  border: isQualified ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid var(--border-default)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>{j.title}</div>
                    <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>{j.company}</span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: 10 }}>
                    📍 {j.location} • 💰 {j.salary} • Required Benchmark: <strong>{j.minScore}%</strong>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                    {j.description}
                  </p>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {j.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.7rem",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "var(--bg-surface-2)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", minWidth: 150 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: isQualified ? "#10B981" : "#F59E0B", letterSpacing: "-0.02em" }}>
                      {j.candidateScore}%
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: isQualified ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: isQualified ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {isQualified ? "QUALIFIED" : `${j.minScore - candidateScore}% DEFICIT`}
                    </span>
                  </div>

                  {appliedJobIds.includes(String(j.id)) ? (
                    <button
                      className="btn btn-sm"
                      style={{
                        width: "100%",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#10B981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        fontWeight: 700,
                        cursor: "default",
                      }}
                      disabled
                    >
                      ✓ Applied
                    </button>
                  ) : isQualified ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: "100%", background: "#10B981", fontWeight: 600 }}
                      onClick={() => handleApply(j)}
                      disabled={applyingId === j.id}
                    >
                      {applyingId === j.id ? "Analyzing Fit..." : "Apply with Score →"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ width: "100%" }}
                      onClick={() => router.push("/careers")}
                    >
                      Improve Score →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
