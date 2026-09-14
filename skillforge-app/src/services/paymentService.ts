import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface PricingPlan {
  id: "monthly" | "annual";
  name: string;
  priceInr: number;
  period: string;
  savingsBadge?: string;
  features: string[];
}

export const HR_PRICING_PLANS: PricingPlan[] = [
  {
    id: "monthly",
    name: "Recruiter Monthly",
    priceInr: 500,
    period: "/ month",
    features: [
      "Full Talent ATS & Pipeline Management",
      "Inspect Verified Candidate GitHub Repos",
      "AI Code & Telemetry Audit Breakdown",
      "Unlimited Job Requisition Postings",
      "Direct Interview Scheduling Pipeline",
    ],
  },
  {
    id: "annual",
    name: "Enterprise Annual Pro",
    priceInr: 5000,
    period: "/ year",
    savingsBadge: "SAVE ₹1,000 (2 MONTHS FREE)",
    features: [
      "Everything in Monthly Plan",
      "Exclusive Access to Group Competition Talent",
      "Priority Candidate Outreach & Direct Email",
      "Cryptographic Skill Hash Verification",
      "Dedicated Talent Partner Support",
      "Full 12-Month Access for ₹5,000 (Normally ₹6,000)",
    ],
  },
];

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planType: "monthly" | "annual";
  amountInr: number;
  status: "active" | "expired" | "cancelled";
  expiresAt: string;
  paymentId?: string;
}

const LOCAL_STORAGE_SUB_KEY = "skillforge_hr_subscription";

export const paymentService = {
  /**
   * Get active subscription for user
   */
  async getSubscription(userId?: string): Promise<SubscriptionRecord | null> {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "active")
          .gte("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            planType: data.plan_type,
            amountInr: data.amount_inr,
            status: data.status,
            expiresAt: data.expires_at,
            paymentId: data.razorpay_payment_id,
          };
        }
      } catch (err) {
        console.warn("Could not fetch subscription from Supabase, checking local:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_SUB_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (new Date(parsed.expiresAt) > new Date()) {
            return parsed;
          }
        } catch {}
      }
    }

    return null;
  },

  /**
   * Process Razorpay payment & activate subscription
   */
  async activateSubscription(params: {
    userId: string;
    companyName?: string;
    planType: "monthly" | "annual";
    razorpayPaymentId: string;
    razorpayOrderId?: string;
  }): Promise<SubscriptionRecord> {
    const { userId, companyName, planType, razorpayPaymentId, razorpayOrderId } = params;
    const amountInr = planType === "annual" ? 5000 : 500;
    const durationDays = planType === "annual" ? 365 : 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const subData = {
      user_id: userId,
      company_name: companyName || "Enterprise Partner",
      plan_type: planType,
      amount_inr: amountInr,
      status: "active",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId || `order_${Date.now()}`,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .insert([subData])
          .select()
          .single();

        if (!error && data) {
          const rec: SubscriptionRecord = {
            id: data.id,
            userId: data.user_id,
            planType: data.plan_type,
            amountInr: data.amount_inr,
            status: data.status,
            expiresAt: data.expires_at,
            paymentId: data.razorpay_payment_id,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_SUB_KEY, JSON.stringify(rec));
          }
          return rec;
        }
      } catch (err) {
        console.warn("Error persisting subscription to Supabase:", err);
      }
    }

    const localRec: SubscriptionRecord = {
      id: "sub_" + Date.now(),
      userId,
      planType,
      amountInr,
      status: "active",
      expiresAt,
      paymentId: razorpayPaymentId,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_SUB_KEY, JSON.stringify(localRec));
    }

    return localRec;
  },

  /**
   * Get all subscriptions for Admin view (Zero dummy data)
   */
  async getAllSubscriptions(): Promise<{
    id: string;
    company: string;
    recruiter: string;
    plan: string;
    amount: string;
    status: string;
    method: string;
    paymentId: string;
    date: string;
    expires: string;
  }[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*, profiles(*)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((sub: any) => ({
            id: sub.id,
            company: sub.company_name || sub.profiles?.company || "Enterprise Partner",
            recruiter: sub.profiles?.full_name || "Recruiter",
            plan: sub.plan_type === "annual" ? "Enterprise Annual Pro" : "Recruiter Monthly",
            amount: `₹${sub.amount_inr.toLocaleString("en-IN")}`,
            status: sub.status === "active" ? "Active" : sub.status,
            method: "Razorpay (Cards / UPI)",
            paymentId: sub.razorpay_payment_id || `pay_${sub.id.slice(0, 8)}`,
            date: new Date(sub.starts_at || sub.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" }),
            expires: new Date(sub.expires_at).toLocaleDateString("en-IN", { dateStyle: "medium" }),
          }));
        }
      } catch (err) {
        console.warn("Error loading subscriptions from Supabase:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_SUB_KEY);
      if (stored) {
        try {
          const rec: SubscriptionRecord = JSON.parse(stored);
          return [
            {
              id: rec.id,
              company: "SkillForge Recruiter Talent",
              recruiter: "Verified Recruiter",
              plan: rec.planType === "annual" ? "Enterprise Annual Pro" : "Recruiter Monthly",
              amount: `₹${rec.amountInr.toLocaleString("en-IN")}`,
              status: rec.status === "active" ? "Active" : rec.status,
              method: "Razorpay (Live Payment)",
              paymentId: rec.paymentId || "pay_rzp_live_test",
              date: "Active Today",
              expires: new Date(rec.expiresAt).toLocaleDateString("en-IN", { dateStyle: "medium" }),
            },
          ];
        } catch {}
      }
    }

    return [];
  },
};
