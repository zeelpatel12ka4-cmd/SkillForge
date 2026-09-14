"use client";
import React from "react";

export interface BadgeMedallionProps {
  title: string;
  tier: "gold" | "silver" | "bronze" | "diamond" | "mythic";
  shape?: "shield" | "diamond" | "crest" | "medal" | "crown";
  icon: string;
  isUnlocked: boolean;
  rankPosition?: number;
  scoreAchieved?: number;
  size?: number;
  onClick?: () => void;
}

const TIER_COLORS = {
  gold: {
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
    border: "#D97706",
    glow: "rgba(245, 158, 11, 0.35)",
    text: "#B45309",
    tagBg: "#F59E0B",
    tagText: "#FFFFFF",
  },
  silver: {
    bg: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #94A3B8 100%)",
    border: "#64748B",
    glow: "rgba(148, 163, 184, 0.35)",
    text: "#475569",
    tagBg: "#64748B",
    tagText: "#FFFFFF",
  },
  bronze: {
    bg: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #D97706 100%)",
    border: "#B45309",
    glow: "rgba(217, 119, 6, 0.3)",
    text: "#9A3412",
    tagBg: "#B45309",
    tagText: "#FFFFFF",
  },
  diamond: {
    bg: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #0284C7 100%)",
    border: "#0284C7",
    glow: "rgba(14, 165, 233, 0.4)",
    text: "#0369A1",
    tagBg: "#0284C7",
    tagText: "#FFFFFF",
  },
  mythic: {
    bg: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 50%, #7C3AED 100%)",
    border: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.4)",
    text: "#6D28D9",
    tagBg: "#7C3AED",
    tagText: "#FFFFFF",
  },
};

export default function BadgeMedallion({
  title,
  tier,
  shape = "shield",
  icon,
  isUnlocked,
  rankPosition,
  scoreAchieved,
  size = 72,
  onClick,
}: BadgeMedallionProps) {
  const colors = TIER_COLORS[tier] || TIER_COLORS.gold;

  // Custom SVG Shape Clips
  const getClipPath = () => {
    switch (shape) {
      case "diamond":
        return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
      case "crest":
        return "polygon(50% 0%, 95% 20%, 80% 85%, 50% 100%, 20% 85%, 5% 20%)";
      case "crown":
        return "polygon(50% 0%, 85% 15%, 100% 55%, 75% 100%, 25% 100%, 0% 55%, 15% 15%)";
      case "medal":
        return "circle(50% at 50% 50%)";
      case "shield":
      default:
        return "polygon(50% 0%, 100% 15%, 85% 80%, 50% 100%, 15% 80%, 0% 15%)";
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        position: "relative",
        filter: isUnlocked ? `drop-shadow(0 4px 12px ${colors.glow})` : "grayscale(0.95) opacity(0.6)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={isUnlocked ? "interactive-lift" : ""}
    >
      {/* Outer Glow & Border Container */}
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* The Clipped Shape with Metallic Sheen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            clipPath: getClipPath(),
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 2px 6px rgba(255,255,255,0.7), inset 0 -3px 8px rgba(0,0,0,0.15)",
            position: "relative",
          }}
        >
          {/* Shimmer Highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Icon */}
          <span
            style={{
              fontSize: size * 0.42,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              lineHeight: 1,
            }}
          >
            {isUnlocked ? icon : "🔒"}
          </span>
        </div>

        {/* Rank Badge / Score Pill */}
        {isUnlocked && rankPosition && (
          <div
            style={{
              position: "absolute",
              bottom: -6,
              background: colors.tagBg,
              color: colors.tagText,
              fontSize: size * 0.16,
              fontWeight: 900,
              padding: "2px 7px",
              borderRadius: 99,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              letterSpacing: "-0.02em",
              border: "1.5px solid #FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            {rankPosition === 1
              ? "1st Place"
              : rankPosition === 2
              ? "2nd Place"
              : rankPosition === 3
              ? "3rd Place"
              : `#${rankPosition}`}
          </div>
        )}

        {isUnlocked && !rankPosition && scoreAchieved !== undefined && (
          <div
            style={{
              position: "absolute",
              bottom: -6,
              background: scoreAchieved === 100 ? "#0284C7" : "#059669",
              color: "#FFFFFF",
              fontSize: size * 0.15,
              fontWeight: 900,
              padding: "2px 6px",
              borderRadius: 99,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              border: "1.5px solid #FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            {scoreAchieved}%
          </div>
        )}
      </div>

      {/* Label Text below */}
      {title && (
        <div
          style={{
            marginTop: 10,
            fontSize: "0.74rem",
            fontWeight: 700,
            color: isUnlocked ? "var(--text-primary)" : "var(--text-tertiary)",
            textAlign: "center",
            maxWidth: size * 1.5,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
