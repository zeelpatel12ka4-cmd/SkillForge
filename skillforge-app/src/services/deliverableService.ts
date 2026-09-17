import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface DeliverableItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  avatar: string;
  careerTrack: string;
  challengeTitle: string;
  repoUrl: string;
  demoUrl?: string;
  submittedAt: string;
  aiScore: number;
  breakdown: {
    architecture: number;
    codeQuality: number;
    testCoverage: number;
    security: number;
  };
  sha256Proof: string;
  status: "VERIFIED" | "PENDING" | "FLAGGED";
  evaluatorNotes: string;
  testsPassed: number;
  totalTests: number;
  badges?: { title: string; icon: string; tier: string }[];
}

const LOCAL_STORAGE_DELIVERABLES_KEY = "skillforge_real_deliverables";

const SEED_DELIVERABLES: DeliverableItem[] = [
  {
    id: "deliv-seed-1",
    candidateName: "Arjun Sharma",
    candidateEmail: "arjun.sharma@candidate.com",
    avatar: "AS",
    careerTrack: "Software Developer",
    challengeTitle: "User Profile API Validation Bug & Unit Tests",
    repoUrl: "https://github.com/arjunsharma/user-profile-api-patch",
    demoUrl: "https://user-api-demo.skillforge.live",
    submittedAt: "Yesterday, 4:15 PM",
    aiScore: 92,
    breakdown: {
      architecture: 94,
      codeQuality: 92,
      testCoverage: 95,
      security: 88,
    },
    sha256Proof: "0xSD_FRE_92_A4F90192B881E990",
    status: "VERIFIED",
    evaluatorNotes: "Excellent root-cause triage of null pointer exception and case-sensitive regex flaw. Added 6 comprehensive unit tests achieving 100% branch coverage on user registration.",
    testsPassed: 6,
    totalTests: 6,
    badges: [{ title: "Clean Code", icon: "🛡️", tier: "gold" }, { title: "Unit Test Champion", icon: "⚡", tier: "gold" }],
  },
  {
    id: "deliv-seed-2",
    candidateName: "Priya Patel",
    candidateEmail: "priya.patel@data.in",
    avatar: "PP",
    careerTrack: "Data Analyst",
    challengeTitle: "E-Commerce Funnel Drop-off Analysis & Cohorts",
    repoUrl: "https://github.com/priyapatel/funnel-analytics",
    demoUrl: "https://colab.research.google.com/drive/funnel-demo",
    submittedAt: "2 days ago",
    aiScore: 88,
    breakdown: {
      architecture: 86,
      codeQuality: 90,
      testCoverage: 88,
      security: 89,
    },
    sha256Proof: "0xDA_JUN_88_B7104921CC719A12",
    status: "VERIFIED",
    evaluatorNotes: "Clear cohort retention segmentation between Android and Desktop. Identified a statistically significant (p < 0.01) drop-off at payment gateway step on mobile.",
    testsPassed: 5,
    totalTests: 5,
    badges: [{ title: "Statistical Rigor", icon: "📊", tier: "gold" }],
  },
  {
    id: "deliv-seed-3",
    candidateName: "Devansh Mehta",
    candidateEmail: "devansh.m@cloudsys.io",
    avatar: "DM",
    careerTrack: "DevOps & Cloud Engineer",
    challengeTitle: "Kubernetes CrashLoopBackOff & Rolling Update",
    repoUrl: "https://github.com/devanshm/k8s-pod-resilience",
    demoUrl: "https://grafana.cloudsys.io/d/k8s-telemetry",
    submittedAt: "3 days ago",
    aiScore: 85,
    breakdown: {
      architecture: 88,
      codeQuality: 84,
      testCoverage: 82,
      security: 86,
    },
    sha256Proof: "0xDE_JUN_85_C9801244EE55A331",
    status: "VERIFIED",
    evaluatorNotes: "Fixed readiness/liveness probe misconfiguration and added maxSurge: 25% rolling update strategy with automated canary rollback.",
    testsPassed: 4,
    totalTests: 4,
    badges: [{ title: "Kubernetes Master", icon: "⚡", tier: "gold" }],
  }
];

export const deliverableService = {
  /**
   * Record a new candidate deliverable submission in real-time
   */
  async recordDeliverable(params: {
    candidateName: string;
    candidateEmail: string;
    avatar?: string;
    careerTrack: string;
    challengeTitle: string;
    repoUrl: string;
    demoUrl?: string;
    aiScore: number;
    breakdown?: {
      architecture: number;
      codeQuality: number;
      testCoverage: number;
      security: number;
    };
    sha256Proof: string;
    evaluatorNotes?: string;
    testsPassed?: number;
    totalTests?: number;
    badges?: { title: string; icon: string; tier: string }[];
  }): Promise<DeliverableItem> {
    const initials = params.candidateName
      ? params.candidateName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "CD";

    const breakdown = params.breakdown || {
      architecture: Math.min(100, params.aiScore + 2),
      codeQuality: Math.min(100, params.aiScore - 1),
      testCoverage: Math.min(100, params.aiScore + 1),
      security: Math.min(100, params.aiScore - 2),
    };

    const newDeliverable: DeliverableItem = {
      id: `deliv-${Date.now()}`,
      candidateName: params.candidateName || "Candidate",
      candidateEmail: params.candidateEmail || "candidate@skillforge.internal",
      avatar: params.avatar || initials,
      careerTrack: params.careerTrack,
      challengeTitle: params.challengeTitle,
      repoUrl: params.repoUrl,
      demoUrl: params.demoUrl,
      submittedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      aiScore: params.aiScore,
      breakdown,
      sha256Proof: params.sha256Proof,
      status: "VERIFIED",
      evaluatorNotes:
        params.evaluatorNotes ||
        `Verified real-time submission for ${params.challengeTitle}. Code correctness score: ${params.aiScore}%.`,
      testsPassed: params.testsPassed ?? Math.max(1, Math.round((params.aiScore / 100) * 20)),
      totalTests: params.totalTests ?? 20,
      badges: params.badges || [],
    };

    if (typeof window !== "undefined") {
      const existing = this.getAllDeliverables();
      const updated = [newDeliverable, ...existing.filter((d) => d.id !== newDeliverable.id)];
      localStorage.setItem(LOCAL_STORAGE_DELIVERABLES_KEY, JSON.stringify(updated));

      // Dispatch global event for live admin & recruiter updates
      window.dispatchEvent(new CustomEvent("skillforge_deliverable_created", { detail: newDeliverable }));
    }

    return newDeliverable;
  },

  /**
   * Get all real deliverables (returns seed candidates if store is brand new)
   */
  getAllDeliverables(): DeliverableItem[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_DELIVERABLES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          return SEED_DELIVERABLES;
        }
      }
      return SEED_DELIVERABLES;
    }
    return SEED_DELIVERABLES;
  },

  /**
   * Get deliverables for a specific user by email
   */
  getUserDeliverables(email?: string): DeliverableItem[] {
    const all = this.getAllDeliverables();
    if (!email) return [];
    return all.filter((d) => d.candidateEmail.toLowerCase() === email.toLowerCase());
  },

  /**
   * Update deliverable status (Admin verification or flag)
   */
  updateDeliverableStatus(id: string, newStatus: DeliverableItem["status"]): boolean {
    if (typeof window !== "undefined") {
      const existing = this.getAllDeliverables();
      const updated = existing.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
      localStorage.setItem(LOCAL_STORAGE_DELIVERABLES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("skillforge_deliverable_created", { detail: { id, status: newStatus } }));
      return true;
    }
    return false;
  },
};
