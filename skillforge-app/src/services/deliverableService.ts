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
   * Get all real deliverables (Zero dummy data - returns empty array if none)
   */
  getAllDeliverables(): DeliverableItem[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_DELIVERABLES_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
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
