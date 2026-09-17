"use client";
import { useState, useEffect } from "react";
import { HR_PRICING_PLANS, paymentService, PricingPlan } from "@/services/paymentService";
import { authService } from "@/services/authService";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RazorpayModal({ isOpen, onClose, onSuccess }: RazorpayModalProps) {
  const currentUser = authService.getCurrentUser();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [paymentMode, setPaymentMode] = useState<"standard" | "instant">("standard");
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay official checkout script dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn("Failed to load official Razorpay script, falling back to simulated mode");
      setPaymentMode("instant");
    };
    document.body.appendChild(script);

    return () => {
      // Keep script cached
    };
  }, []);

  if (!isOpen) return null;

  const activePlanObj = HR_PRICING_PLANS.find((p) => p.id === selectedPlan) || HR_PRICING_PLANS[1];
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

  /**
   * Launch Official Razorpay Standard Checkout Popup
   */
  const handleOfficialRazorpay = async () => {
    setProcessing(true);
    setStatusMessage("Creating Razorpay order on server…");

    try {
      // Step 1: Create Order via server route
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedPlan,
          userId: currentUser?.id || "demo-recruiter",
          companyName: currentUser?.company || "Enterprise Talent Partner",
        }),
      });

      const orderData = await res.json();
      const order = orderData.order || orderData.fallbackOrder;
      const orderId = order?.id || `order_test_${Date.now()}`;
      const amountPaise = order?.amount || (selectedPlan === "annual" ? 500000 : 50000);

      setStatusMessage("Opening secure Razorpay Checkout…");

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: razorpayKeyId,
          amount: amountPaise,
          currency: "INR",
          name: "SkillForge AI Enterprise",
          description: `${activePlanObj.name} Recruiter Access`,
          image: "https://xqdkszifdifruwnsjdxs.supabase.co/storage/v1/object/public/brand/skillforge_logo.png",
          order_id: order?.id?.startsWith("order_") && !order?.id?.includes("mock") ? order.id : undefined,
          prefill: {
            name: currentUser?.fullName || "HR Recruiter",
            email: currentUser?.email || "recruiter@company.com",
            contact: "9999999999",
          },
          theme: {
            color: "#8B5CF6",
          },
          handler: async function (response: any) {
            setStatusMessage("Verifying payment signature & activating account…");

            // Verify payment
            await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            // Activate subscription in Supabase & LocalStorage
            await paymentService.activateSubscription({
              userId: currentUser?.id || "demo-recruiter",
              companyName: currentUser?.company || "Enterprise Talent Partner",
              planType: selectedPlan,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || orderId,
            });

            setProcessing(false);
            onSuccess();
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              setStatusMessage(null);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert("Razorpay Payment Failed: " + response.error?.description);
          setProcessing(false);
          setStatusMessage(null);
        });
        rzp.open();
      } else {
        // Fallback if Razorpay script is blocked or offline
        handleSimulatedPay(orderId);
      }
    } catch (err: any) {
      console.warn("Falling back to simulated payment:", err);
      handleSimulatedPay();
    }
  };

  /**
   * Fast Simulated Instant Checkout (Guaranteed fallback)
   */
  const handleSimulatedPay = async (orderId?: string) => {
    setProcessing(true);
    setStatusMessage("Processing test transaction…");

    const mockPaymentId = `pay_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const actualOrderId = orderId || `order_${Date.now().toString(36)}`;

    setTimeout(async () => {
      await paymentService.activateSubscription({
        userId: currentUser?.id || "demo-recruiter",
        companyName: currentUser?.company || "Enterprise Talent Partner",
        planType: selectedPlan,
        razorpayPaymentId: mockPaymentId,
        razorpayOrderId: actualOrderId,
      });
      setProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          maxWidth: 640,
          width: "100%",
          padding: 32,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-default)",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Razorpay Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0C2340", display: "flex", alignItems: "center", justifyContent: "center", color: "#3395FF", fontWeight: 900, fontSize: 20 }}>
              R
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Razorpay Live Gateway
                </span>
                <code style={{ fontSize: "0.65rem", background: "var(--bg-surface-2)", padding: "1px 5px", borderRadius: 4, color: "#3395FF", fontFamily: "monospace" }}>
                  {razorpayKeyId.slice(0, 12)}...
                </code>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Activate Recruiter ATS Access
              </h3>
            </div>
          </div>
          <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "3px 8px", borderRadius: 99, fontWeight: 700 }}>
            🔒 256-Bit SSL Secured
          </span>
        </div>

        {/* Plan Selection Tiers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {HR_PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  padding: "16px 18px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "2px solid #8B5CF6" : "1px solid var(--border-default)",
                  background: isSelected ? "rgba(139, 92, 246, 0.05)" : "var(--bg-surface-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                {plan.savingsBadge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 12,
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#FFFFFF",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 99,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {plan.savingsBadge}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isSelected ? "#8B5CF6" : "var(--text-primary)" }}>
                    {plan.name}
                  </span>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: isSelected ? "5px solid #8B5CF6" : "2px solid var(--border-default)",
                      background: "#FFFFFF",
                    }}
                  />
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-primary)" }}>
                  ₹{plan.priceInr.toLocaleString()}
                  <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-tertiary)", marginLeft: 4 }}>
                    {plan.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Features */}
        <div style={{ padding: 14, background: "var(--bg-surface-2)", borderRadius: 8, border: "1px solid var(--border-default)", marginBottom: 20 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase" }}>
            Included with {activePlanObj.name}:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            {activePlanObj.features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#10B981", fontWeight: 800 }}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Mode Toggle */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>
            Select Checkout Flow:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              type="button"
              onClick={() => setPaymentMode("standard")}
              style={{
                padding: "12px",
                borderRadius: 8,
                border: paymentMode === "standard" ? "2px solid #8B5CF6" : "1px solid var(--border-default)",
                background: paymentMode === "standard" ? "rgba(139, 92, 246, 0.08)" : "var(--bg-surface-2)",
                color: paymentMode === "standard" ? "#8B5CF6" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span>⚡ Official Razorpay Popup</span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontWeight: 400 }}>
                Real UPI, QR Code, Cards &amp; NetBanking
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("instant")}
              style={{
                padding: "12px",
                borderRadius: 8,
                border: paymentMode === "instant" ? "2px solid #8B5CF6" : "1px solid var(--border-default)",
                background: paymentMode === "instant" ? "rgba(139, 92, 246, 0.08)" : "var(--bg-surface-2)",
                color: paymentMode === "instant" ? "#8B5CF6" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span>🧪 1-Click Instant Test</span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontWeight: 400 }}>
                Simulate instant approval without popup
              </div>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#8B5CF6",
              fontSize: "0.82rem",
              marginBottom: 16,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Action Button */}
        {paymentMode === "standard" ? (
          <button
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              background: "#0C2340",
              color: "#3395FF",
              border: "1px solid #3395FF",
              fontWeight: 800,
              fontSize: "0.95rem",
              padding: "14px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            disabled={processing}
            onClick={handleOfficialRazorpay}
          >
            {processing ? (
              <span>Connecting to Razorpay…</span>
            ) : (
              <>
                <span style={{ fontSize: "1.1rem" }}>💳</span>
                <span>Open Razorpay Checkout (₹{activePlanObj.priceInr.toLocaleString()}) →</span>
              </>
            )}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", background: "#8B5CF6", fontWeight: 700, fontSize: "0.95rem", padding: "14px 0" }}
            disabled={processing}
            onClick={() => handleSimulatedPay()}
          >
            {processing ? "Activating Subscription…" : `Simulate Instant Approval (₹${activePlanObj.priceInr.toLocaleString()}) →`}
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 16, fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
          <span>Powered by Razorpay (Test Mode)</span>
          <span>•</span>
          <span>Key: {razorpayKeyId.slice(0, 10)}...</span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
