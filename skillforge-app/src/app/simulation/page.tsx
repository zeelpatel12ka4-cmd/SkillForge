"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SimulationIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/careers");
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 12,
      background: "var(--bg-page)",
      color: "var(--text-secondary)",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: "3px solid var(--border-default)",
        borderTopColor: "var(--color-primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ fontSize: "0.95rem" }}>Redirecting to Career Paths...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
