"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import RoleGuard from "@/components/auth/RoleGuard";
import { paymentService } from "@/services/paymentService";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = async () => {
    setLoading(true);
    const list = await paymentService.getAllSubscriptions();
    setSubscriptions(list);
    setLoading(false);
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const totalRecruiters = subscriptions.length;
  const annualCount = subscriptions.filter((s) => s.plan.includes("Annual")).length;
  const adoptionPct = totalRecruiters > 0 ? Math.round((annualCount / totalRecruiters) * 100) : 0;

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="app-layout">
        <Sidebar role="ADMIN" />
        <main className="app-main">
          {/* Top Header */}
          <TopHeader
            breadcrumbs={[
              { label: "Admin Console", href: "/admin" },
              { label: "HR Recruiter Subscriptions" }
            ]}
          />

          {/* Page Title */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="badge badge-warning">RAZORPAY REVENUE ENGINE</span>
              <span style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>• Transparent Billing (₹500/mo · ₹5,000/yr)</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
              HR Recruiter Subscriptions &amp; Revenue
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Track real-time recruiter subscription activations, Razorpay transaction logs, and platform revenue metrics.
            </p>
          </div>

          {/* Revenue KPI Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Monthly Recurring Revenue</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10B981", marginTop: 4 }}>
                ₹{totalRecruiters > 0 ? (totalRecruiters * 500).toLocaleString("en-IN") : "0"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#10B981", marginTop: 2 }}>Real-time billing total</div>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Active Paid Recruiters</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#8B5CF6", marginTop: 4 }}>
                {totalRecruiters} {totalRecruiters === 1 ? "Company" : "Companies"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>Verified subscriptions</div>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Annual Plan Adoption</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F59E0B", marginTop: 4 }}>
                {adoptionPct}%
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>{annualCount} annual subscribers</div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="card" style={{ padding: 0, border: "1px solid var(--border-default)" }}>
            <div className="table-responsive">
              <div style={{ minWidth: 800 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1.2fr 100px 140px 140px auto",
                    padding: "14px 22px",
                    background: "var(--bg-surface-2)",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <div>Company &amp; Recruiter</div>
                  <div>Plan Type</div>
                  <div>Amount</div>
                  <div>Razorpay Payment ID</div>
                  <div>Billing Cycle</div>
                  <div style={{ textAlign: "right" }}>Status</div>
                </div>

                {subscriptions.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>💳</div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                      No Active Recruiter Subscriptions Yet
                    </h4>
                    <p style={{ fontSize: "0.82rem", maxWidth: 460, margin: "0 auto" }}>
                      When recruiters unlock Pro access via Razorpay checkout, live transaction records and renewal statuses will appear here in real time.
                    </p>
                  </div>
                ) : (
                  subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1.2fr 100px 140px 140px auto",
                        padding: "18px 22px",
                        borderTop: "1px solid var(--border-default)",
                        alignItems: "center",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>{sub.company}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{sub.recruiter}</div>
                      </div>

                      <div>
                        <span style={{ fontWeight: 700, color: sub.plan.includes("Annual") ? "#8B5CF6" : "var(--text-primary)" }}>
                          {sub.plan}
                        </span>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{sub.method}</div>
                      </div>

                      <div style={{ fontWeight: 900, color: "#10B981" }}>
                        {sub.amount}
                      </div>

                      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "var(--color-primary)" }}>
                        {sub.paymentId}
                      </div>

                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        Expires {sub.expires}
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
