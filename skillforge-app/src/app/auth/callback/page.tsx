"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured, UserProfile, UserRole } from "@/lib/supabase";
import { authService } from "@/services/authService";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function processAuthCallback() {
      let code = searchParams.get("code");
      let errorParam = searchParams.get("error");
      let errorDescription = searchParams.get("error_description");

      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace(/^#/, "");
        const hashParams = new URLSearchParams(hash);
        if (!code && hashParams.get("code")) code = hashParams.get("code");
        if (!errorParam && hashParams.get("error")) errorParam = hashParams.get("error");
        if (!errorDescription && hashParams.get("error_description")) {
          errorDescription = hashParams.get("error_description");
        }

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } catch (e) {
            console.warn("Error setting session from hash:", e);
          }
        }
      }

      if (errorParam || errorDescription) {
        if (!mounted) return;
        setStatus("error");
        setErrorMessage(errorDescription || errorParam || "The email confirmation link is invalid or has expired.");
        return;
      }

      if (!isSupabaseConfigured()) {
        // Fallback for offline demo
        if (!mounted) return;
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1500);
        return;
      }

      try {
        // 1. If PKCE code is provided in URL query parameters, exchange it for a verified session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn("exchangeCodeForSession error:", error);
            // Check if there is already an active session regardless
            const { data: currentSession } = await supabase.auth.getSession();
            if (!currentSession?.session) {
              if (!mounted) return;
              setStatus("error");
              setErrorMessage(error.message || "Failed to confirm email with the provided security code.");
              return;
            }
          }
        }

        // 2. Retrieve verified user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          // If no code, check if session was established via implicit token or onAuthStateChange
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session?.user) {
            if (!mounted) return;
            setStatus("error");
            setErrorMessage("No active authentication session could be confirmed. The link may have expired.");
            return;
          }
        }

        const activeUser = user || (await supabase.auth.getUser()).data.user;
        if (!activeUser) {
          if (!mounted) return;
          setStatus("error");
          setErrorMessage("Failed to load user profile after email confirmation.");
          return;
        }

        // 3. Synchronize user profile into Supabase profiles table
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .single();

        const role = (existingProfile?.role || activeUser.user_metadata?.role || "CANDIDATE") as UserRole;
        const fullName = existingProfile?.full_name || activeUser.user_metadata?.full_name || activeUser.email?.split("@")[0] || "Candidate";
        const company = existingProfile?.company || activeUser.user_metadata?.company;

        const verifiedProfile: UserProfile = {
          id: activeUser.id,
          email: activeUser.email || "",
          full_name: fullName,
          role: role,
          company: company,
          verified_credentials_count: existingProfile?.verified_credentials_count || 0,
          created_at: existingProfile?.created_at || activeUser.created_at,
        };

        try {
          await supabase.from("profiles").upsert([
            {
              id: activeUser.id,
              email: activeUser.email,
              full_name: fullName,
              role: role,
              company: company || null,
            },
          ]);
        } catch (e) {
          console.warn("Supabase profiles sync note:", e);
        }

        // 4. Update local session cache
        if (typeof window !== "undefined") {
          localStorage.setItem("skillforge_auth_user", JSON.stringify(verifiedProfile));
        }

        if (!mounted) return;
        setStatus("success");

        // 5. Navigate to appropriate portal based on role
        setTimeout(() => {
          if (role === "ADMIN") {
            router.replace("/admin");
          } else if (role === "RECRUITER") {
            router.replace("/hr/dashboard");
          } else {
            router.replace("/dashboard");
          }
        }, 1200);
      } catch (err: any) {
        if (!mounted) return;
        console.error("Auth callback exception:", err);
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred while confirming your email.");
      }
    }

    processAuthCallback();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResendLoading(true);
    const { success, error } = await authService.resendConfirmationEmail(resendEmail);
    setResendLoading(false);
    if (success) {
      setResendSuccess(true);
    } else {
      setErrorMessage(error || "Failed to resend confirmation email");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg-page)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,70,229,0.1), transparent)",
          pointerEvents: "none",
        }}
      />
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: 480, position: "relative", padding: 36, textAlign: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            SF
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Skill<span className="gradient-text">Forge</span> AI
          </span>
        </Link>

        {status === "verifying" && (
          <div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "3px solid rgba(79,70,229,0.2)",
                borderTopColor: "var(--color-primary)",
                animation: "spin 0.9s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
              Verifying Email Confirmation
            </h2>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Exchanging security tokens with Supabase and setting up your verified capability profile…
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 18px",
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
              Email Confirmed!
            </h2>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              Your account is fully verified. Redirecting you to your workspace now…
            </p>
            <div style={{ fontSize: "0.78rem", color: "var(--color-primary-light)", fontFamily: "JetBrains Mono, monospace" }}>
              ⚡ Launching session…
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 18px",
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
              Confirmation Link Expired or Invalid
            </h2>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#EF4444",
                fontSize: "0.82rem",
                textAlign: "left",
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              {errorMessage}
            </div>

            {resendSuccess ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#10B981",
                  fontSize: "0.84rem",
                  marginBottom: 18,
                }}
              >
                ✓ A new confirmation link was dispatched to <strong>{resendEmail}</strong>. Please check your inbox!
              </div>
            ) : (
              <form onSubmit={handleResend} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, textAlign: "left" }}>
                <label className="input-label" style={{ fontSize: "0.78rem" }}>Resend Confirmation Email</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="your-email@example.com"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    style={{ flex: 1, fontSize: "0.84rem" }}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={resendLoading || !resendEmail}
                    style={{ whiteSpace: "nowrap", fontSize: "0.82rem" }}
                  >
                    {resendLoading ? "Sending…" : "Resend Link"}
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Link href="/auth/login" className="btn btn-primary" style={{ flex: 1, fontSize: "0.85rem" }}>
                Return to Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-secondary" style={{ flex: 1, fontSize: "0.85rem" }}>
                Create New Account
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-primary-light)", fontFamily: "JetBrains Mono, monospace" }}>
            Loading auth callback handler…
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
