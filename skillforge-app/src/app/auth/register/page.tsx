"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "hr" ? "RECRUITER" : "CANDIDATE";
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">(defaultRole as any);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { user, error } = await authService.signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role,
      company: role === "RECRUITER" ? form.company : undefined,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    setStep(2);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-page)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,70,229,0.1), transparent)", pointerEvents: "none" }} />
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 460, position: "relative", padding: 32 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
            SF
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>Skill<span className="gradient-text">Forge</span> AI</span>
        </Link>

        {step === 1 ? (
          <>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6, color: "var(--text-primary)" }}>Create your account</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>Free forever for candidates. Direct Supabase credential sync.</p>

            {errorMsg && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontSize: "0.82rem", marginBottom: 18 }}>
                {errorMsg}
              </div>
            )}

            {/* Role toggle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24, background: "var(--bg-surface-2)", padding: 5, borderRadius: "var(--radius-md)" }}>
              {(["CANDIDATE", "RECRUITER"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: "10px 0",
                    borderRadius: "var(--radius-sm)",
                    background: role === r ? "var(--color-primary)" : "transparent",
                    color: role === r ? "#fff" : "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {r === "CANDIDATE" ? "👩‍💻 Candidate" : "🏢 HR Recruiter"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Arjun Sharma"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">Work / Primary Email</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              {role === "RECRUITER" && (
                <div>
                  <label className="input-label">Company Name</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Acme Technologies Inc."
                    required
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <label className="input-label">Password</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Min 8 characters"
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: 6, padding: "13px 0", fontWeight: 700 }} disabled={loading}>
                {loading ? "Registering in Supabase…" : "Create Account →"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-tertiary)", marginTop: 22 }}>
              Already have an account? <Link href="/auth/login" style={{ color: "var(--color-primary-light)", fontWeight: 600 }}>Log in</Link>
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 10, color: "var(--text-primary)" }}>Account Created!</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              Your profile has been created for <strong style={{ color: "var(--text-primary)" }}>{form.email}</strong>.
            </p>

            <div style={{ padding: 18, background: "var(--bg-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", textAlign: "left", marginBottom: 24 }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 8 }}>
                Profile Activated
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                ✓ Role: <strong>{role === "RECRUITER" ? "Enterprise HR Recruiter" : "Verified Candidate"}</strong><br />
                ✓ Full Name: {form.fullName}<br />
                ✓ Simulation Access: 8 Specialized Tracks Ready
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={() => router.push(role === "RECRUITER" ? "/hr/dashboard" : "/dashboard")}
            >
              Continue to {role === "RECRUITER" ? "Recruiter ATS" : "Dashboard"} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
