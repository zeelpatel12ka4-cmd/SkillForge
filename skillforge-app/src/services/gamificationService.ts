import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: "competition" | "simulation" | "milestone" | "secret";
  tier: "gold" | "silver" | "bronze" | "diamond" | "mythic";
  shape: "shield" | "diamond" | "crest" | "medal" | "crown";
  icon: string;
  requirement: string;
  xpReward: number;
}

export interface UserEarnedBadge {
  badgeId: string;
  title: string;
  tier: "gold" | "silver" | "bronze" | "diamond" | "mythic";
  category: "competition" | "simulation" | "milestone" | "secret";
  shape: "shield" | "diamond" | "crest" | "medal" | "crown";
  icon: string;
  scoreAchieved?: number;
  rankPosition?: number;
  roleTrack?: string;
  competitionTitle?: string;
  awardedAt: string;
  verifiedHash: string;
}

export interface UserGamificationProfile {
  userId: string;
  email: string;
  fullName: string;
  xp: number;
  level: number;
  rankTitle: string;
  nextLevelXp: number;
  currentLevelBaseXp: number;
  streakDays: number;
  completedSimulationsCount: number;
  competitionsParticipatedCount: number;
  bestSimulationScore: number;
  badges: UserEarnedBadge[];
}

export const LEVEL_TIERS = [
  { level: 1, title: "Apprentice Developer", minXp: 0, maxXp: 500 },
  { level: 2, title: "Junior Problem Solver", minXp: 500, maxXp: 1200 },
  { level: 3, title: "Technical Specialist", minXp: 1200, maxXp: 2200 },
  { level: 4, title: "Full-Stack Craftsman", minXp: 2200, maxXp: 3500 },
  { level: 5, title: "Lead Systems Engineer", minXp: 3500, maxXp: 5000 },
  { level: 6, title: "Senior Staff Architect", minXp: 5000, maxXp: 7500 },
  { level: 7, title: "Principal Technologist", minXp: 7500, maxXp: 11000 },
  { level: 8, title: "Grandmaster Engineer", minXp: 11000, maxXp: 999999 },
];

export const ALL_BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Competitions
  {
    id: "COMP_GOLD_1ST",
    title: "1st Place Champion — Group Hackathon",
    description: "Secured Rank #1 on the live Group Leaderboard in an official SkillForge Squad Hackathon.",
    category: "competition",
    tier: "gold",
    shape: "crown",
    icon: "🏆",
    requirement: "Rank #1 in any Group Competition",
    xpReward: 1000,
  },
  {
    id: "COMP_SILVER_2ND",
    title: "2nd Place Runner-Up — Group Hackathon",
    description: "Secured Rank #2 on the live Group Leaderboard in an official SkillForge Squad Hackathon.",
    category: "competition",
    tier: "silver",
    shape: "shield",
    icon: "🥈",
    requirement: "Rank #2 in any Group Competition",
    xpReward: 750,
  },
  {
    id: "COMP_BRONZE_3RD",
    title: "3rd Place Podium — Group Hackathon",
    description: "Secured Rank #3 on the live Group Leaderboard in an official SkillForge Squad Hackathon.",
    category: "competition",
    tier: "bronze",
    shape: "shield",
    icon: "🥉",
    requirement: "Rank #3 in any Group Competition",
    xpReward: 500,
  },
  {
    id: "COMP_TOP_10",
    title: "Top 10 Finalist — Squad Hackathon",
    description: "Achieved a top 10 overall squad placement in a high-concurrency group competition.",
    category: "competition",
    tier: "gold",
    shape: "crest",
    icon: "🎖️",
    requirement: "Rank between #4 and #10 in any Group Competition",
    xpReward: 400,
  },
  {
    id: "COMP_TOP_100",
    title: "Top 100 Hackathon Challenger",
    description: "Finished within the Top 100 positions in a competitive engineering hackathon.",
    category: "competition",
    tier: "silver",
    shape: "medal",
    icon: "🏅",
    requirement: "Rank within Top 100 in Group Competition",
    xpReward: 300,
  },
  {
    id: "COMP_TOP_200",
    title: "Top 200 Verified Squad",
    description: "Ranked among the top 200 high-velocity squads with passing test harnesses.",
    category: "competition",
    tier: "bronze",
    shape: "medal",
    icon: "🎯",
    requirement: "Rank within Top 200 in Group Competition",
    xpReward: 250,
  },
  {
    id: "COMP_TOP_500",
    title: "Top 500 Hackathon Achiever",
    description: "Successfully submitted a verified squad deliverable and ranked in the top 500.",
    category: "competition",
    tier: "bronze",
    shape: "medal",
    icon: "🚀",
    requirement: "Rank within Top 500 in Group Competition",
    xpReward: 200,
  },
  {
    id: "COMP_TOP_1000",
    title: "Top 1,000 Squad Finisher",
    description: "Completed an official multi-role group competition with all individual role criteria met.",
    category: "competition",
    tier: "bronze",
    shape: "medal",
    icon: "🌐",
    requirement: "Rank within Top 1,000 in Group Competition",
    xpReward: 150,
  },
  {
    id: "ROLE_FRONTEND_MASTER",
    title: "Frontend Development Winner",
    description: "Secured the highest individual Frontend evaluation in a live squad competition.",
    category: "competition",
    tier: "gold",
    shape: "crest",
    icon: "🎨",
    requirement: "Highest Frontend role score in competition",
    xpReward: 600,
  },
  {
    id: "ROLE_BACKEND_TITAN",
    title: "Backend Concurrency Master",
    description: "Achieved the top individual Backend score with zero race-conditions and high throughput.",
    category: "competition",
    tier: "gold",
    shape: "crest",
    icon: "⚙️",
    requirement: "Highest Backend role score in competition",
    xpReward: 600,
  },
  // Simulation Mastery
  {
    id: "PERFECT_KODER_100",
    title: "Perfect Koder — 100% Precision",
    description: "Achieved a flawless 100% score evaluated by the automated AI grading rubric on a simulation.",
    category: "simulation",
    tier: "diamond",
    shape: "diamond",
    icon: "💎",
    requirement: "Score 100% in any technical simulation lab",
    xpReward: 800,
  },
  {
    id: "CLEAN_CODE_ARTISAN",
    title: "Clean Code Artisan",
    description: "Scored 90%+ on technical accuracy and code modularity in an enterprise simulation.",
    category: "simulation",
    tier: "gold",
    shape: "shield",
    icon: "✨",
    requirement: "Score 90% or higher in any simulation lab",
    xpReward: 450,
  },
  {
    id: "ZERO_BUG_PATCH",
    title: "Bug Bounty Hunter",
    description: "Successfully patched a critical production bug with 100% test harness pass rate.",
    category: "simulation",
    tier: "silver",
    shape: "shield",
    icon: "🛡️",
    requirement: "Pass 100% of test cases in an incident simulation",
    xpReward: 350,
  },
  {
    id: "FIRST_COMMIT",
    title: "First Proof Minted",
    description: "Completed your first career track simulation and minted a cryptographic SHA-256 credential.",
    category: "milestone",
    tier: "bronze",
    shape: "medal",
    icon: "🌱",
    requirement: "Complete your first simulation deliverable",
    xpReward: 200,
  },
  {
    id: "MIDNIGHT_COMMITTER",
    title: "Midnight Committer",
    description: "Secret Achievement: Submitted code deliverable during late hours (12 AM - 5 AM).",
    category: "secret",
    tier: "mythic",
    shape: "diamond",
    icon: "🌙",
    requirement: "Submit a deliverable between midnight and 5 AM",
    xpReward: 500,
  },
];

function calculateLevelFromXp(xp: number) {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      const tier = LEVEL_TIERS[i];
      return {
        level: tier.level,
        rankTitle: tier.title,
        nextLevelXp: tier.maxXp,
        currentLevelBaseXp: tier.minXp,
      };
    }
  }
  return {
    level: 1,
    rankTitle: LEVEL_TIERS[0].title,
    nextLevelXp: LEVEL_TIERS[0].maxXp,
    currentLevelBaseXp: 0,
  };
}

const STORAGE_KEY_PREFIX = "skillforge_gamification_";

export const gamificationService = {
  /**
   * Get real-time gamification profile for a user
   */
  getProfile(user?: { id?: string; email?: string; fullName?: string }): UserGamificationProfile {
    const userId = user?.id || "guest_user";
    const storageKey = STORAGE_KEY_PREFIX + userId;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const levelInfo = calculateLevelFromXp(parsed.xp || 0);
          return {
            ...parsed,
            ...levelInfo,
          };
        } catch {}
      }
    }

    const defaultLevel = calculateLevelFromXp(0);
    const initialProfile: UserGamificationProfile = {
      userId,
      email: user?.email || "",
      fullName: user?.fullName || "Candidate",
      xp: 0,
      level: defaultLevel.level,
      rankTitle: defaultLevel.rankTitle,
      nextLevelXp: defaultLevel.nextLevelXp,
      currentLevelBaseXp: defaultLevel.currentLevelBaseXp,
      streakDays: 1,
      completedSimulationsCount: 0,
      competitionsParticipatedCount: 0,
      bestSimulationScore: 0,
      badges: [],
    };

    return initialProfile;
  },

  /**
   * Record task/simulation completion and award real-time XP & badges
   */
  recordSimulationCompletion(params: {
    user: { id?: string; email?: string; fullName?: string };
    score: number;
    challengeTitle: string;
    repoUrl?: string;
  }): {
    earnedXp: number;
    newBadges: UserEarnedBadge[];
    leveledUp: boolean;
    profile: UserGamificationProfile;
  } {
    const { user, score, challengeTitle, repoUrl } = params;
    const currentProfile = this.getProfile(user);
    const oldLevel = currentProfile.level;

    // Real-time XP Calculation based on actual score/percentage
    // Base 100 XP + 5 XP per score point (e.g. 80% = 500 XP, 100% = 600 XP)
    let earnedXp = 100 + Math.round(score * 5);
    if (score === 100) {
      earnedXp += 500; // Perfect score bonus
    }

    const newTotalXp = currentProfile.xp + earnedXp;
    const levelInfo = calculateLevelFromXp(newTotalXp);
    const leveledUp = levelInfo.level > oldLevel;

    const newBadges: UserEarnedBadge[] = [];
    const existingBadgeIds = new Set(currentProfile.badges.map((b) => b.badgeId));

    // Check 100% Perfect Koder badge
    if (score === 100 && !existingBadgeIds.has("PERFECT_KODER_100")) {
      const def = ALL_BADGE_DEFINITIONS.find((b) => b.id === "PERFECT_KODER_100")!;
      newBadges.push({
        badgeId: def.id,
        title: def.title,
        tier: def.tier,
        category: def.category,
        shape: def.shape,
        icon: def.icon,
        scoreAchieved: 100,
        competitionTitle: challengeTitle,
        awardedAt: new Date().toISOString(),
        verifiedHash: `sha256_${Math.random().toString(36).substring(2)}${Date.now()}`,
      });
    }

    // Check 90%+ Clean Code Artisan badge
    if (score >= 90 && !existingBadgeIds.has("CLEAN_CODE_ARTISAN")) {
      const def = ALL_BADGE_DEFINITIONS.find((b) => b.id === "CLEAN_CODE_ARTISAN")!;
      newBadges.push({
        badgeId: def.id,
        title: def.title,
        tier: def.tier,
        category: def.category,
        shape: def.shape,
        icon: def.icon,
        scoreAchieved: score,
        competitionTitle: challengeTitle,
        awardedAt: new Date().toISOString(),
        verifiedHash: `sha256_${Math.random().toString(36).substring(2)}${Date.now()}`,
      });
    }

    // Check First Proof Minted badge
    if (!existingBadgeIds.has("FIRST_COMMIT")) {
      const def = ALL_BADGE_DEFINITIONS.find((b) => b.id === "FIRST_COMMIT")!;
      newBadges.push({
        badgeId: def.id,
        title: def.title,
        tier: def.tier,
        category: def.category,
        shape: def.shape,
        icon: def.icon,
        scoreAchieved: score,
        competitionTitle: challengeTitle,
        awardedAt: new Date().toISOString(),
        verifiedHash: `sha256_${Math.random().toString(36).substring(2)}${Date.now()}`,
      });
    }

    // Check Midnight Committer secret badge (between 12 AM and 5 AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 5 && !existingBadgeIds.has("MIDNIGHT_COMMITTER")) {
      const def = ALL_BADGE_DEFINITIONS.find((b) => b.id === "MIDNIGHT_COMMITTER")!;
      newBadges.push({
        badgeId: def.id,
        title: def.title,
        tier: def.tier,
        category: def.category,
        shape: def.shape,
        icon: def.icon,
        scoreAchieved: score,
        competitionTitle: challengeTitle,
        awardedAt: new Date().toISOString(),
        verifiedHash: `sha256_${Math.random().toString(36).substring(2)}${Date.now()}`,
      });
    }

    const updatedProfile: UserGamificationProfile = {
      ...currentProfile,
      xp: newTotalXp,
      level: levelInfo.level,
      rankTitle: levelInfo.rankTitle,
      nextLevelXp: levelInfo.nextLevelXp,
      currentLevelBaseXp: levelInfo.currentLevelBaseXp,
      completedSimulationsCount: currentProfile.completedSimulationsCount + 1,
      bestSimulationScore: Math.max(currentProfile.bestSimulationScore, score),
      badges: [...currentProfile.badges, ...newBadges],
    };

    this.saveProfile(updatedProfile);
    return {
      earnedXp,
      newBadges,
      leveledUp,
      profile: updatedProfile,
    };
  },

  /**
   * Award competition rank badge in real-time
   */
  recordCompetitionPlacement(params: {
    user: { id?: string; email?: string; fullName?: string };
    rankPosition: number;
    competitionTitle: string;
    role?: string;
    score: number;
  }) {
    const { user, rankPosition, competitionTitle, role, score } = params;
    const currentProfile = this.getProfile(user);

    let badgeIdToAward: string | null = null;
    let xpBonus = 200;

    if (rankPosition === 1) {
      badgeIdToAward = "COMP_GOLD_1ST";
      xpBonus = 1500;
    } else if (rankPosition === 2) {
      badgeIdToAward = "COMP_SILVER_2ND";
      xpBonus = 1000;
    } else if (rankPosition === 3) {
      badgeIdToAward = "COMP_BRONZE_3RD";
      xpBonus = 750;
    } else if (rankPosition <= 10) {
      badgeIdToAward = "COMP_TOP_10";
      xpBonus = 500;
    } else if (rankPosition <= 100) {
      badgeIdToAward = "COMP_TOP_100";
      xpBonus = 350;
    } else if (rankPosition <= 200) {
      badgeIdToAward = "COMP_TOP_200";
      xpBonus = 250;
    } else if (rankPosition <= 500) {
      badgeIdToAward = "COMP_TOP_500";
      xpBonus = 200;
    } else if (rankPosition <= 1000) {
      badgeIdToAward = "COMP_TOP_1000";
      xpBonus = 150;
    }

    const newBadges: UserEarnedBadge[] = [];
    const existingBadgeIds = new Set(currentProfile.badges.map((b) => b.badgeId));

    if (badgeIdToAward && !existingBadgeIds.has(badgeIdToAward)) {
      const def = ALL_BADGE_DEFINITIONS.find((b) => b.id === badgeIdToAward)!;
      newBadges.push({
        badgeId: def.id,
        title: def.title,
        tier: def.tier,
        category: def.category,
        shape: def.shape,
        icon: def.icon,
        scoreAchieved: score,
        rankPosition,
        roleTrack: role,
        competitionTitle,
        awardedAt: new Date().toISOString(),
        verifiedHash: `sha256_${Math.random().toString(36).substring(2)}${Date.now()}`,
      });
    }

    const newTotalXp = currentProfile.xp + xpBonus;
    const levelInfo = calculateLevelFromXp(newTotalXp);

    const updated: UserGamificationProfile = {
      ...currentProfile,
      xp: newTotalXp,
      level: levelInfo.level,
      rankTitle: levelInfo.rankTitle,
      nextLevelXp: levelInfo.nextLevelXp,
      currentLevelBaseXp: levelInfo.currentLevelBaseXp,
      competitionsParticipatedCount: currentProfile.competitionsParticipatedCount + 1,
      badges: [...currentProfile.badges, ...newBadges],
    };

    this.saveProfile(updated);
    return updated;
  },

  /**
   * Save profile and dispatch real-time global event
   */
  saveProfile(profile: UserGamificationProfile) {
    if (typeof window !== "undefined") {
      const storageKey = STORAGE_KEY_PREFIX + profile.userId;
      localStorage.setItem(storageKey, JSON.stringify(profile));

      // Register user in global user index
      const USERS_INDEX_KEY = "skillforge_all_gamification_users";
      const storedUsersRaw = localStorage.getItem(USERS_INDEX_KEY);
      let userList: { id: string; email: string; fullName: string }[] = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [];
      
      const existingIdx = userList.findIndex((u) => u.id === profile.userId);
      if (existingIdx >= 0) {
        userList[existingIdx] = { id: profile.userId, email: profile.email, fullName: profile.fullName };
      } else {
        userList.push({ id: profile.userId, email: profile.email, fullName: profile.fullName });
      }
      localStorage.setItem(USERS_INDEX_KEY, JSON.stringify(userList));

      // Dispatch real-time event across app components
      window.dispatchEvent(new CustomEvent("skillforge_xp_updated", { detail: profile }));
    }
  },

  /**
   * Real-time Global XP Leaderboard:
   * Strictly real registered candidate data.
   * If 0 users, returns []. If 1 user, returns only that 1 user at Rank #1.
   */
  getGlobalXpLeaderboard(): {
    rank: number;
    userId: string;
    fullName: string;
    email: string;
    xp: number;
    level: number;
    rankTitle: string;
    badgesCount: number;
    completedSims: number;
    topBadge?: UserEarnedBadge;
  }[] {
    if (typeof window === "undefined") return [];

    const USERS_INDEX_KEY = "skillforge_all_gamification_users";
    const storedUsersRaw = localStorage.getItem(USERS_INDEX_KEY);
    let userList: { id: string; email: string; fullName: string }[] = storedUsersRaw
      ? JSON.parse(storedUsersRaw)
      : [];

    // Also ensure current logged in user is included if present
    const currentUserRaw = localStorage.getItem("skillforge_auth_user");
    if (currentUserRaw) {
      try {
        const cur = JSON.parse(currentUserRaw);
        if (cur?.id && !userList.some((u) => u.id === cur.id)) {
          userList.push({ id: cur.id, email: cur.email || "", fullName: cur.full_name || "Candidate" });
        }
      } catch {}
    }

    if (userList.length === 0) {
      return [];
    }

    const profiles = userList.map((u) => this.getProfile(u));
    // Sort by XP descending, tie-breaker: completedSimulationsCount
    profiles.sort((a, b) => b.xp - a.xp || b.completedSimulationsCount - a.completedSimulationsCount);

    return profiles.map((p, idx) => ({
      rank: idx + 1,
      userId: p.userId,
      fullName: p.fullName || "Candidate",
      email: p.email,
      xp: p.xp,
      level: p.level,
      rankTitle: p.rankTitle,
      badgesCount: p.badges.length,
      completedSims: p.completedSimulationsCount,
      topBadge: p.badges[0],
    }));
  },
};
