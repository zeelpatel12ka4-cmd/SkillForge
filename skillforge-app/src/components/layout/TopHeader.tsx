"use client";
import React from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import DatabaseStatusBadge from "@/components/ui/DatabaseStatusBadge";
import XPHeaderPill from "@/components/gamification/XPHeaderPill";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

interface TopHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  action?: React.ReactNode;
  actionButton?: { label: string; href: string };
}

export default function TopHeader({ breadcrumbs, action, actionButton }: TopHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
        paddingBottom: 16,
        borderBottom: "1px solid var(--border-subtle)",
        flexWrap: "wrap",
        gap: 14,
      }}
    >
      {/* Breadcrumb path */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={b.label}>
            {idx > 0 && <span style={{ color: "var(--text-muted)" }}>/</span>}
            {b.href ? (
              <Link
                href={b.href}
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  transition: "color 0.15s",
                }}
              >
                {b.label}
              </Link>
            ) : (
              <span
                style={{
                  color: idx === breadcrumbs.length - 1 ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: idx === breadcrumbs.length - 1 ? 700 : 500,
                }}
              >
                {b.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {/* Real-Time Candidate XP & Level Pill */}
        <XPHeaderPill />

        {/* Global Notifications Bell */}
        <NotificationDropdown />

        {/* UI/UX Pro Max Theme Switcher */}
        <ThemeSwitcher />

        {/* Supabase Database Connection Status */}
        <DatabaseStatusBadge />

        {/* Environment status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "rgba(16, 185, 129, 0.08)",
            borderRadius: 99,
            border: "1px solid rgba(16, 185, 129, 0.2)",
            fontSize: "0.72rem",
            color: "#34D399",
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          <span>v2.4 Live</span>
        </div>

        {actionButton && (
          <Link href={actionButton.href} className="btn btn-primary btn-sm">
            {actionButton.label}
          </Link>
        )}

        {action}
      </div>
    </div>
  );
}
