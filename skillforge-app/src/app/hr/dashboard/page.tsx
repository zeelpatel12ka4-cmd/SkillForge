"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import RazorpayModal from "@/components/payment/RazorpayModal";
import { paymentService, SubscriptionRecord } from "@/services/paymentService";
import { authService } from "@/services/authService";
import { deliverableService } from "@/services/deliverableService";

export default function HRDashboardPage() {
  const router = useRouter();
  const currentUser = authService.getCurrentUser();
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);
  const [deliverables, setDeliverables] = useState<any[]>([]);

  const checkSubscription = async () => {
    setLoadingSub(true);
    const sub = await paymentService.getSubscription(currentUser?.id);
    setSubscription(sub);
    setLoadingSub(false);
  };

  const loadDeliverables = () => {
    setDeliverables(deliverableService.getAllDeliverables());
  };

  useEffect(() => {
    checkSubscription();
    loadDeliverables();
    window.addEventListener("skillforge_deliverable_created", loadDeliverables);
    return () => {
      window.removeEventListener("skillforge_deliverable_created", loadDeliverables);
    };
  }, []);

  const testedCount = deliverables.length;
  const shortlistedCount = deliverables.filter((d) => d.status === "VERIFIED").length;
  const avgMatch =
    deliverables.length > 0
      ? Math.round(deliverables.reduce((acc, d) => acc + d.aiScore, 0) / deliverables.length)
      : 0;

  const STATS = [
    { label: "Active Roles", value: "4", change: "Frontend, Backend, DevOps, Data", color: "#8B5CF6" },
    { label: "Tested Engineers", value: String(testedCount), change: "verified via GitHub submissions", color: "#6366F1" },
    { label: "Shortlisted Candidates", value: String(shortlistedCount), change: "verified proof available", color: "#F59E0B" },
    { label: "Average Match Score", value: testedCount > 0 ? `${avgMatch}%` : "N/A", change: "real-time submission average", color: "#10B981" },
  ];

  const JOBS = [
    { id: 1, title: "Software Developer (Backend)", dept: "Core Engineering", candidates: testedCount, shortlisted: shortlistedCount, avgMatch: avgMatch || 80, status: "Active", posted: "Live" },
    { id: 2, title: "Senior Full Stack Architect", dept: "Platform Systems", candidates: 0, shortlisted: 0, avgMatch: 0, status: "Active", posted: "Live" },
    { id: 3, title: "Growth Data Analyst", dept: "Growth & Product", candidates: 0, shortlisted: 0, avgMatch: 0, status: "Active", posted: "Live" },
    { id: 4, title: "Associate Product Manager", dept: "Product Operations", candidates: 0, shortlisted: 0, avgMatch: 0, status: "Active", posted: "Live" },
  ];

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="RECRUITER" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Recruiter Portal" },
              { label: "Executive Dashboard" }
            ]}
            action={
              <div style={{ display: "flex", gap: 10 }}>
                {subscription ? (
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: "#10B981", color: "#10B981", fontWeight: 700 }}
                    onClick={() => setShowPayModal(true)}
                  >
                    ✓ Plan: {subscription.planType === "annual" ? "Pro Annual" : "Pro Monthly"}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: "#F59E0B", color: "#fff", fontWeight: 700 }}
                    onClick={() => setShowPayModal(true)}
                  >
                    ⚡ Unlock Pro (₹500/mo)
                  </button>
                )}

                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: "#8B5CF6" }}
                  onClick={() => router.push("/hr/jobs/create")}
                >
                  + Create New Role
                </button>
              </div>
            }
          />

          {/* Subscription Banner if not subscribed */}
          {!loadingSub && !subscription && (
            <div
              className="card animate-fade-in"
              style={{
                marginBottom: 24,
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                    RECRUITER SUBSCRIPTION REQUIRED
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>
                    Razorpay Gateway Integration
                  </span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Unlock Full Candidate Sourcing &amp; Cryptographic Proof Verification
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  Access candidate GitHub repos, AI evaluation rubrics, and group competition talent starting at <strong>₹500 / month</strong> or <strong>₹5,000 / year</strong> (save ₹1,000 / 2 months free).
                </p>
              </div>
              <button
                className="btn btn-primary"
                style={{
                  background: "#0C2340",
                  color: "#3395FF",
                  border: "1px solid #3395FF",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onClick={() => setShowPayModal(true)}
              >
                <span>💳 Pay with Razorpay</span>
              </button>
            </div>
          )}

          {/* Active Subscription Banner */}
          {!loadingSub && subscription && (
            <div
              className="card"
              style={{
                marginBottom: 24,
                background: "rgba(16, 185, 129, 0.06)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10B981",
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
                <div>
                  <span style={{ fontWeight: 800, fontSize: "0.86rem", color: "var(--text-primary)" }}>
                    Active {subscription.planType === "annual" ? "Enterprise Pro Annual (₹5,000/yr)" : "Recruiter Pro Monthly (₹500/mo)"}
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginLeft: 8 }}>
                    • Valid until {new Date(subscription.expiresAt).toLocaleDateString()} (Payment Ref: {subscription.paymentId?.slice(0, 16)}...)
                  </span>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}
                onClick={() => setShowPayModal(true)}
              >
                Change Plan / Invoice
              </button>
            </div>
          )}

          {/* Page Title */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Hiring Pipeline Overview
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              {currentUser?.fullName || "Priya Nair"} ({currentUser?.company || "Tech Talent Partner"})
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Review candidate simulation rankings, monitor job posting conversion, and fast-track verified engineers.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {STATS.map((s) => (
              <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color, letterSpacing: "-0.03em", marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Job listings Section */}
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Active Hiring Pipelines</div>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/hr/jobs")}>
              View All Positions →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {JOBS.map((j) => (
              <div
                key={j.id}
                className="card"
                style={{
                  padding: "18px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 20,
                  alignItems: "center",
                  cursor: "pointer",
                  border: "1px solid var(--border-default)",
                }}
                onClick={() => router.push(`/hr/candidates/${j.id}`)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.borderColor = "rgba(139, 92, 246, 0.4)";
                  target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.borderColor = "var(--border-default)";
                  target.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{j.title}</div>
                    <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                      {j.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 20, fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>🏢 {j.dept}</span>
                    <span style={{ color: "var(--text-secondary)" }}>👥 {j.candidates} evaluated</span>
                    <span style={{ color: "#F59E0B", fontWeight: 600 }}>⭐ {j.shortlisted} shortlisted</span>
                    <span style={{ color: "#10B981", fontWeight: 600 }}>📊 {j.avgMatch}% avg score</span>
                    <span style={{ color: "var(--text-muted)" }}>Posted {j.posted}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: "#8B5CF6", fontWeight: 600 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/hr/candidates/${j.id}`);
                    }}
                  >
                    Inspect Candidates →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline recommendation callout */}
          <div
            className="card"
            style={{
              background: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
                9 Candidates Ready for Technical Interview
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                All candidates have submitted verifiable GitHub repositories and exceeded the 75% simulation benchmark.
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "var(--color-primary)", borderColor: "var(--border-default)", flexShrink: 0, marginLeft: 20 }}
              onClick={() => router.push("/hr/candidates/1")}
            >
              Review Shortlists →
            </button>
          </div>

          {/* Razorpay Subscription Modal */}
          <RazorpayModal
            isOpen={showPayModal}
            onClose={() => setShowPayModal(false)}
            onSuccess={() => {
              setShowPayModal(false);
              checkSubscription();
            }}
          />
        </main>
      </div>
    </RoleGuard>
  );
}
