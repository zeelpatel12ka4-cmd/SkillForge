"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "true";
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (emailToUse?: string, passwordToUse?: string) => {
    const email = emailToUse || form.email;
    const password = passwordToUse || form.password;
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);

    const { user, error } = await authService.signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (user?.role === "ADMIN") {
      router.push("/admin");
    } else if (user?.role === "RECRUITER") {
      router.push("/hr/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleResend = async () => {
    if (!form.email) return;
    setResending(true);
    const { success, error } = await authService.resendConfirmationEmail(form.email);
    setResending(false);
    if (success) {
      setResendSuccess(true);
    } else {
      setErrorMsg(error || "Failed to resend confirmation email.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-page)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,70,229,0.08), transparent)", pointerEvents: "none" }} />
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 460, position: "relative", padding: 32 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
            SF
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>Skill<span className="gradient-text">Forge</span> AI</span>
        </Link>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6, color: "var(--text-primary)" }}>Welcome back</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 22 }}>
          Log in with your verified credentials to access your workspace.
        </p>

        {confirmed && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontSize: "0.84rem", marginBottom: 18 }}>
            ✓ Email confirmed successfully! You can now log in below.
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontSize: "0.82rem", marginBottom: 18 }}>
            <div>{errorMsg}</div>
            {errorMsg.toLowerCase().includes("not confirmed") && (
              <div style={{ marginTop: 8 }}>
                {resendSuccess ? (
                  <span style={{ color: "#10B981", fontWeight: 600 }}>✓ Confirmation email sent! Please check your inbox.</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || !form.email}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.75rem", marginTop: 4 }}
                  >
                    {resending ? "Sending…" : `Resend Confirmation to ${form.email || "your email"}`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="input-label">Email Address</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@company.com"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: "100%", padding: "12px 0", fontWeight: 700 }} disabled={loading}>
            {loading ? "Authenticating with Supabase…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-tertiary)", marginTop: 22 }}>
          No account? <Link href="/auth/register" style={{ color: "var(--color-primary-light)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-primary-light)", fontFamily: "JetBrains Mono, monospace" }}>
            Loading login portal…
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
