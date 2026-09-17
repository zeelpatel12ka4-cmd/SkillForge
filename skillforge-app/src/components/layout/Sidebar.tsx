"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/authService";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const CANDIDATE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Badges & XP", href: "/badges", icon: "badge", badge: "Milestones" },
  { label: "Careers", href: "/careers", icon: "domain", badge: "Simulations" },
  { label: "Group Competitions", href: "/competitions", icon: "trophy", badge: "Squads" },
  { label: "Skill Diagnostics", href: "/skill-gap", icon: "radar" },
  { label: "Verified Jobs", href: "/jobs", icon: "work" },
];

const HR_NAV: NavItem[] = [
  { label: "Talent ATS", href: "/hr/dashboard", icon: "monitoring" },
  { label: "Job Requisitions", href: "/hr/jobs", icon: "badge" },
  { label: "Candidate Inspector", href: "/hr/candidates/1", icon: "verified", badge: "Proof" },
  { label: "Competition Sourcing", href: "/competitions", icon: "trophy" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Command Center", href: "/admin", icon: "dashboard" },
  { label: "Manage Competitions", href: "/admin/competitions", icon: "trophy", badge: "Create" },
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "HR Subscriptions", href: "/admin/subscriptions", icon: "credit-card" },
  { label: "Deliverables Audit", href: "/admin/deliverables", icon: "verified" },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
    domain: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    code: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    trophy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    radar: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
      </svg>
    ),
    work: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    monitoring: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    badge: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    verified: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    "credit-card": (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Sidebar({ role }: { role: "CANDIDATE" | "RECRUITER" | "ADMIN" }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = authService.getCurrentUser();

  const nav = role === "ADMIN" ? ADMIN_NAV : role === "RECRUITER" ? HR_NAV : CANDIDATE_NAV;

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/auth/login");
  };

  return (
    <aside
      className="app-sidebar"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        boxShadow: "1px 0 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: "0 18px 18px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 14 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: role === "ADMIN" ? "linear-gradient(135deg,#DC2626,#7C3AED)" : "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 13,
              boxShadow: "0 2px 8px var(--color-primary-glow)",
            }}
          >
            SF
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Skill<span className="gradient-text">Forge</span>
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                background: role === "ADMIN" ? "rgba(220, 38, 38, 0.1)" : "var(--color-primary-bg)",
                color: role === "ADMIN" ? "#DC2626" : "var(--color-primary)",
                border: `1px solid ${role === "ADMIN" ? "rgba(220, 38, 38, 0.25)" : "var(--color-primary-border)"}`,
              }}
            >
              {role === "ADMIN" ? "ADMIN" : role === "RECRUITER" ? "RECRUITER" : "CANDIDATE"}
            </span>
          </div>
        </Link>
      </div>

      {/* Section Header */}
      <div
        style={{
          padding: "0 18px",
          marginBottom: 8,
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "var(--text-tertiary)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {role === "ADMIN" ? "SYSTEM CONTROL" : role === "RECRUITER" ? "ATS WORKFLOW" : "CANDIDATE LAB"}
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 10px" }}>
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                color: active ? "var(--color-primary)" : "var(--text-secondary)",
                background: active ? "var(--color-primary-bg)" : "transparent",
                fontWeight: active ? 700 : 500,
                fontSize: "0.84rem",
                borderLeft: active ? "3px solid var(--color-primary)" : "3px solid transparent",
                borderTop: active ? "1px solid var(--color-primary-border)" : "1px solid transparent",
                borderRight: active ? "1px solid var(--color-primary-border)" : "1px solid transparent",
                borderBottom: active ? "1px solid var(--color-primary-border)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ color: active ? "var(--color-primary)" : "var(--text-tertiary)", display: "flex", alignItems: "center" }}>
                <NavIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.62rem",
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: item.badge === "Squads" ? "rgba(16, 185, 129, 0.12)" : "var(--color-primary-bg)",
                    color: item.badge === "Squads" ? "#059669" : "var(--color-primary)",
                    border: `1px solid ${item.badge === "Squads" ? "rgba(16, 185, 129, 0.3)" : "var(--color-primary-border)"}`,
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Identity & Sign Out Card */}
      <div style={{ padding: "14px", borderTop: "1px solid var(--border-subtle)" }}>
        <div
          style={{
            padding: "10px 12px",
            background: "var(--bg-surface-2)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: role === "ADMIN" ? "#DC2626" : role === "RECRUITER" ? "#8B5CF6" : "#6366F1",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {currentUser?.full_name ? currentUser.full_name[0].toUpperCase() : "U"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentUser?.full_name || (role === "ADMIN" ? "Admin" : role === "RECRUITER" ? "Recruiter" : "Candidate")}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>
                {role}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              padding: 4,
              fontSize: "0.9rem",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EF4444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
