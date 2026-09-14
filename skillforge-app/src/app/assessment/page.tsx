"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function AssessmentRedirectPage() {
  const router = useRouter();

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card animate-fade-in" style={{ maxWidth: 520, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: "3.2rem", marginBottom: 16 }}>🎬</div>
          <div className="badge badge-primary" style={{ marginBottom: 16 }}>NEW SIMULATION ENGINE</div>
          <h2 style={{ marginBottom: 12 }}>MCQ Quizzes Have Been Upgraded!</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            SkillForge AI has transitioned to <strong>100% practical Career Simulations</strong>. Instead of multiple-choice tests, you solve real-world problems (bug fixes, data analysis, designs) with authentic materials, difficulty levels (Fresher, Junior, Senior), and repo/file submissions.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary btn-lg" onClick={() => router.push("/careers")}>
              Explore Careers & Select Difficulty →
            </button>
            <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
