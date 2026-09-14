"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { authService } from "@/services/authService";
import { UserProfile, UserRole } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await authService.getAllProfiles();
    setUsers(list);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      await authService.updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err: any) {
      alert("Error updating role: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = filterRole === "ALL"
    ? users
    : users.filter((u) => u.role === filterRole);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="ADMIN" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Admin Console", href: "/admin" },
              { label: "User Management & Roles" }
            ]}
          />

          {/* Page Title */}
          <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="badge" style={{ background: "rgba(220, 38, 38, 0.1)", color: "#DC2626", border: "1px solid rgba(220, 38, 38, 0.25)", fontWeight: 800 }}>
                  ROLE &amp; ACCESS CONTROL
                </span>
                <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>• Supabase Profiles Table</span>
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
                User Performance &amp; Role Manager
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Inspect registered candidates, track verified simulation proofs, and manage recruiter &amp; admin privileges.
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 6, background: "var(--bg-surface-2)", padding: 4, borderRadius: 8 }}>
              {["ALL", "CANDIDATE", "RECRUITER", "ADMIN"].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    background: filterRole === r ? "#DC2626" : "transparent",
                    color: filterRole === r ? "#FFFFFF" : "var(--text-secondary)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {r === "ALL" ? "All Users" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="card" style={{ padding: 0, border: "1px solid var(--border-default)" }}>
            <div className="table-responsive">
              <div style={{ minWidth: 800 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1.2fr 130px 150px 180px",
                    padding: "14px 22px",
                    background: "var(--bg-surface-2)",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <div>User Profile &amp; Contact</div>
                  <div>Company / Stated Goal</div>
                  <div>Verified Proofs</div>
                  <div>Assigned Role</div>
                  <div style={{ textAlign: "right" }}>Change Permission</div>
                </div>

            {filteredUsers.map((u) => {
              const isUpdating = updatingId === u.id;
              return (
                <div
                  key={u.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1.2fr 130px 150px 180px",
                    padding: "18px 22px",
                    borderTop: "1px solid var(--border-default)",
                    alignItems: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  {/* Name & Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: u.role === "ADMIN" ? "#DC2626" : u.role === "RECRUITER" ? "#8B5CF6" : "#6366F1",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {u.full_name ? u.full_name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>{u.full_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
                        {u.email}
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                    {u.company || "Independent Candidate"}
                  </div>

                  {/* Verified Credentials */}
                  <div>
                    <span className="badge badge-success" style={{ fontSize: "0.72rem" }}>
                      🛡️ {u.verified_credentials_count || 1} Proof Badge(s)
                    </span>
                  </div>

                  {/* Current Role Badge */}
                  <div>
                    <span
                      className="badge"
                      style={{
                        fontSize: "0.72rem",
                        background: u.role === "ADMIN" ? "rgba(220, 38, 38, 0.1)" : u.role === "RECRUITER" ? "rgba(139, 92, 246, 0.1)" : "rgba(99, 102, 241, 0.1)",
                        color: u.role === "ADMIN" ? "#DC2626" : u.role === "RECRUITER" ? "#8B5CF6" : "#6366F1",
                        fontWeight: 700,
                      }}
                    >
                      {u.role}
                    </span>
                  </div>

                  {/* Role Selector */}
                  <div style={{ textAlign: "right" }}>
                    <select
                      className="input-field"
                      style={{ padding: "4px 8px", fontSize: "0.76rem", width: "auto", display: "inline-block" }}
                      value={u.role}
                      disabled={isUpdating}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    >
                      <option value="CANDIDATE">Candidate</option>
                      <option value="RECRUITER">HR Recruiter</option>
                      <option value="ADMIN">Platform Admin</option>
                    </select>
                  </div>
                </div>
              );
            })}
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>👥</div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  No Users Registered Yet
                </h4>
                <p style={{ fontSize: "0.82rem", maxWidth: 440, margin: "6px auto 0" }}>
                  As real candidates and HR recruiters register on the platform, their authentication records will appear here in real time.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
