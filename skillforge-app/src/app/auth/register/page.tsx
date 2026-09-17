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
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { user, confirmationRequired: isConfirmReq, error } = await authService.signUp({
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

    setConfirmationRequired(Boolean(isConfirmReq));
    setStep(2);
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    setResendStatus(null);
    const { success, error } = await authService.resendConfirmationEmail(form.email);
    setResending(false);
    if (success) {
      setResendStatus("Confirmation email resent successfully! Please check your inbox and spam folder.");
    } else {
      setResendStatus(error || "Failed to resend confirmation email. Please try again.");
    }
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
            <div style={{ fontSize: "3rem", marginBottom: 14 }}>✉️</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
              Account Created. Check Your Email
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              We have dispatched an email confirmation link to:
              <br />
              <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>{form.email}</strong>
            </p>

            <div
              style={{
                padding: "16px 18px",
                background: "var(--bg-surface-2)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-default)",
                textAlign: "left",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Action Required: Confirm Email
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                1. Open the verification email from <strong>SkillForge AI</strong> in your inbox.<br />
                2. Click <strong>Confirm Email</strong> to activate your credential profile.<br />
                3. You will be automatically redirected to your verified dashboard.
              </div>
            </div>

            {resendStatus && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: resendStatus.includes("successfully") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${resendStatus.includes("successfully") ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  color: resendStatus.includes("successfully") ? "#10B981" : "#EF4444",
                  fontSize: "0.82rem",
                  marginBottom: 16,
                  textAlign: "left",
                }}
              >
                {resendStatus}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResendConfirmation}
                disabled={resending}
                style={{ width: "100%", padding: "12px 0", fontSize: "0.85rem", fontWeight: 600 }}
              >
                {resending ? "Resending confirmation email…" : "Didn't receive email? Resend confirmation link"}
              </button>

              <Link
                href="/auth/login"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px 0", fontSize: "0.85rem", fontWeight: 700 }}
              >
                Go to Sign In →
              </Link>
            </div>
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
