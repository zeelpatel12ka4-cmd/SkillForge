"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RoleGuard from "@/components/auth/RoleGuard";
import { jobService } from "@/services/jobService";
import { authService } from "@/services/authService";

const ALL_SKILLS = ["JavaScript","TypeScript","Python","React","Node.js","SQL","PostgreSQL","System Design","Algorithms","Testing","CI/CD","Docker","Kubernetes","REST APIs","GraphQL","Git","Data Structures","OOP","Clean Code","Security Basics"];

const STEPS = ["Job Basics", "Required Skills", "Criteria & Preferences", "Review & Publish"];

export default function CreateJobPage() {
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | number>("1");
  const [form, setForm] = useState({ title: "", description: "", level: "", required: [] as string[], preferred: [] as string[], experience: "", criteria: "" });

  const toggleSkill = (skill: string, field: "required" | "preferred") => {
    setForm(p => {
      const curr = p[field];
      return { ...p, [field]: curr.includes(skill) ? curr.filter(s => s !== skill) : [...curr, skill] };
    });
  };

  const handlePublish = async () => {
    setPublishing(true);
    const user = authService.getCurrentUser();
    const newJob = await jobService.createJob({
      title: form.title,
      description: form.description,
      level: form.level,
      requiredSkills: form.required,
      preferredSkills: form.preferred,
      experience: form.experience,
      criteria: form.criteria,
      company: user?.company || "Enterprise Recruiter",
    });
    setCreatedJobId(newJob.id);
    setPublishing(false);
    setStep(4);
  };

  const published = step === 4;
  if (published) return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="RECRUITER" />
        <main className="main-content">
          <div style={{ maxWidth: 640, margin: "60px auto", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>Job Posting Live!</h2>
            <p style={{ color: "#94A3B8", marginBottom: 32 }}>"{form.title}" is now active in the candidate marketplace with auto-matching configured.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href={`/hr/candidates/${createdJobId}`} className="btn btn-primary" style={{ background: "#7C3AED", textDecoration: "none" }}>⚡ View Matching Candidates</a>
              <a href="/hr/jobs" className="btn btn-ghost" style={{ textDecoration: "none" }}>Back to Jobs</a>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="RECRUITER" />
      <main className="app-main">
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7C3AED", letterSpacing: "0.1em", marginBottom: 6 }}>NEW JOB POSTING</div>
          <h2 style={{ fontWeight: 800 }}>Create a Job</h2>
        </div>
        {/* Step progress */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, position: "relative" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= step ? "#7C3AED" : "rgba(255,255,255,0.08)", border: `1px solid ${i <= step ? "#7C3AED" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: i <= step ? "#fff" : "#64748B", flexShrink: 0, transition: "all 0.3s" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: i === step ? 700 : 400, color: i === step ? "#F1F5F9" : "#64748B" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ position: "absolute", top: 24, left: 28, right: 0, height: 1, background: i < step ? "#7C3AED" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 700 }}>
          {step === 0 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 24 }}>Job Basics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label className="input-label">Job Title *</label>
                  <input className="input-field" placeholder="e.g. Software Developer" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
                </div>
                <div>
                  <label className="input-label">Seniority Level *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {["Junior", "Mid-Level", "Senior"].map(l => (
                      <button key={l} onClick={() => setForm(p => ({...p, level: l}))} style={{ padding: "10px 0", borderRadius: 10, border: `1px solid ${form.level === l ? "#7C3AED" : "rgba(255,255,255,0.1)"}`, background: form.level === l ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.03)", color: form.level === l ? "#7C3AED" : "#94A3B8", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Job Description *</label>
                  <textarea className="input-field" style={{ minHeight: 120, resize: "vertical" }} placeholder="Describe the role, team, and key responsibilities..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 8 }}>Required Skills</h3>
              <p style={{ fontSize: "0.85rem", marginBottom: 24 }}>These skills will be used by the AI matching engine to rank candidates. Required skills must be non-empty to publish.</p>
              <div style={{ marginBottom: 20 }}>
                <label className="input-label">Required Skills * ({form.required.length} selected)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ALL_SKILLS.map(s => {
                    const sel = form.required.includes(s);
                    return <button key={s} onClick={() => toggleSkill(s, "required")} style={{ padding: "6px 12px", borderRadius: 99, border: `1px solid ${sel ? "#4F46E5" : "rgba(255,255,255,0.1)"}`, background: sel ? "rgba(79,70,229,0.14)" : "rgba(255,255,255,0.03)", color: sel ? "#818CF8" : "#94A3B8", fontSize: "0.8rem", fontWeight: sel ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}>{sel ? "✓ " : ""}{s}</button>;
                  })}
                </div>
              </div>
              <div>
                <label className="input-label">Preferred Skills (optional) ({form.preferred.length} selected)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ALL_SKILLS.filter(s => !form.required.includes(s)).map(s => {
                    const sel = form.preferred.includes(s);
                    return <button key={s} onClick={() => toggleSkill(s, "preferred")} style={{ padding: "6px 12px", borderRadius: 99, border: `1px solid ${sel ? "#7C3AED" : "rgba(255,255,255,0.1)"}`, background: sel ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)", color: sel ? "#A78BFA" : "#64748B", fontSize: "0.8rem", fontWeight: sel ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}>{sel ? "✓ " : ""}{s}</button>;
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 24 }}>Criteria & Preferences</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label className="input-label">Minimum Experience</label>
                  <input className="input-field" placeholder="e.g. 2+ years of professional experience" value={form.experience} onChange={e => setForm(p => ({...p, experience: e.target.value}))} />
                </div>
                <div>
                  <label className="input-label">Assessment Criteria Notes (optional)</label>
                  <textarea className="input-field" style={{ minHeight: 100, resize: "vertical" }} placeholder="Any specific areas you want the AI matching engine to weight more heavily?" value={form.criteria} onChange={e => setForm(p => ({...p, criteria: e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ marginBottom: 24 }}>Review & Publish</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Job Title", form.title || "—"], ["Seniority", form.level || "—"], ["Required Skills", form.required.join(", ") || "— (empty: cannot publish)"], ["Preferred Skills", form.preferred.join(", ") || "None"], ["Experience", form.experience || "Not specified"]].map(([l, v]) => (
                  <div key={l as string} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 160, fontSize: "0.8rem", fontWeight: 700, color: "#64748B", flexShrink: 0 }}>{l}</div>
                    <div style={{ fontSize: "0.85rem", color: v === "— (empty: cannot publish)" ? "#EF4444" : "#F1F5F9" }}>{v}</div>
                  </div>
                ))}
              </div>
              {form.required.length === 0 && (
                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, fontSize: "0.85rem", color: "#EF4444" }}>
                  ⚠ Required skills cannot be empty. Go back and select at least one.
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(p => p - 1)}>← Back</button>}
            {step < 3 ? (
              <button className="btn btn-primary" style={{ background: "#7C3AED", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}
                disabled={step === 0 && (!form.title || !form.level)}
                onClick={() => setStep(p => p + 1)}>
                Continue →
              </button>
            ) : (
              <button className="btn btn-success" disabled={form.required.length === 0 || publishing} onClick={handlePublish}>
                {publishing ? "Publishing Job Posting…" : "🚀 Publish Job Posting"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  </RoleGuard>
);
}
