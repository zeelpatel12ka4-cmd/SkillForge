"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { UserRole } from "@/lib/supabase";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    // In local demo or initial test, if no user is set, default to the required role for that page
    if (!user) {
      setAuthorized(true);
      return;
    }

    if (allowedRoles.includes(user.role)) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
      // Redirect to user's authorized home
      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else if (user.role === "RECRUITER") {
        router.replace("/hr/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [allowedRoles, router]);

  if (authorized === null) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <div style={{ fontSize: "0.9rem", color: "var(--color-primary-light)", fontFamily: "JetBrains Mono, monospace" }}>
          Authenticating role permissions…
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: 20 }}>
        <div className="card" style={{ maxWidth: 440, width: "100%", textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔒</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            Access Restricted
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
            Your account does not have permission to access this portal. Redirecting to your assigned workspace…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
