"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { gamificationService, UserGamificationProfile } from "@/services/gamificationService";

export default function XPHeaderPill() {
  const [profile, setProfile] = useState<UserGamificationProfile | null>(null);

  const refreshProfile = () => {
    const user = authService.getCurrentUser();
    if (user?.role === "CANDIDATE" || !user) {
      const current = gamificationService.getProfile(user || undefined);
      setProfile(current);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    refreshProfile();

    const handleUpdate = () => refreshProfile();
    window.addEventListener("skillforge_xp_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("skillforge_xp_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (!profile) return null;

  const currentLevelMin = profile.currentLevelBaseXp || 0;
  const nextLevelMax = profile.nextLevelXp || 500;
  const xpInCurrentLevel = Math.max(0, profile.xp - currentLevelMin);
  const xpRequiredForLevel = Math.max(1, nextLevelMax - currentLevelMin);
  const percentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForLevel) * 100));

  return (
    <Link
      href="/badges"
      className="interactive-lift"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "4px 12px 4px 6px",
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border-default)",
        borderRadius: 99,
        textDecoration: "none",
        cursor: "pointer",
      }}
      title="View Unlocked Badges & XP Progression"
    >
      {/* Level Badge Circle */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "0.72rem",
          boxShadow: "0 2px 6px rgba(99, 102, 241, 0.4)",
        }}
      >
        L{profile.level}
      </div>

      {/* Progress Bar & Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: "0.68rem" }}>
          <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
            {profile.xp.toLocaleString()} XP
          </span>
          <span style={{ color: "var(--text-tertiary)", fontSize: "0.62rem" }}>
            Next Lvl: {profile.nextLevelXp.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            width: 76,
            height: 4,
            background: "var(--border-default)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Badges Count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: "0.68rem",
          fontWeight: 800,
          color: "#F59E0B",
          paddingLeft: 4,
          borderLeft: "1px solid var(--border-default)",
        }}
      >
        <span>🏆</span>
        <span>{profile.badges.length}</span>
      </div>
    </Link>
  );
}
