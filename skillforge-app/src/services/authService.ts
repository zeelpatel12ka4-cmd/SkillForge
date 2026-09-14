import { supabase, isSupabaseConfigured, UserProfile, UserRole } from "@/lib/supabase";

export interface AuthResponse {
  user: UserProfile | null;
  error: string | null;
}

const LOCAL_STORAGE_USER_KEY = "skillforge_auth_user";
const LOCAL_STORAGE_ALL_PROFILES_KEY = "skillforge_all_profiles";

export const authService = {
  /**
   * Register a new user with Supabase Auth or mock demo store
   */
  async signUp(params: {
    email: string;
    password?: string;
    fullName: string;
    role: UserRole;
    company?: string;
  }): Promise<AuthResponse> {
    const { email, password = "Password123!", fullName, role, company } = params;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              company: company || null,
            },
          },
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            role,
            company,
            verified_credentials_count: 0,
            created_at: new Date().toISOString(),
          };

          await supabase.from("profiles").upsert([
            {
              id: data.user.id,
              email: profile.email,
              full_name: fullName,
              role,
              company: company || null,
            },
          ]);

          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          }
          return { user: profile, error: null };
        }
      } catch (err: any) {
        console.warn("Supabase signup error, falling back to local demo profile:", err);
      }
    }

    // Demo Mode Fallback
    const demoUser: UserProfile = {
      id: "demo-" + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName,
      role,
      company,
      verified_credentials_count: 1,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      const existing = this.getLocalProfiles();
      localStorage.setItem(LOCAL_STORAGE_ALL_PROFILES_KEY, JSON.stringify([demoUser, ...existing]));
    }

    return { user: demoUser, error: null };
  },

  /**
   * Sign in existing user with Supabase Auth or mock demo
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profileData?.full_name || data.user.user_metadata?.full_name || "SkillForge User",
            role: (profileData?.role || data.user.user_metadata?.role || "CANDIDATE") as UserRole,
            company: profileData?.company,
            verified_credentials_count: profileData?.verified_credentials_count || 1,
            created_at: profileData?.created_at,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          }
          return { user: profile, error: null };
        }
      } catch (err: any) {
        console.warn("Supabase signin error, using demo authentication:", err);
      }
    }

    // Demo Mode Fallback: infer role from email
    const lowerEmail = email.toLowerCase();
    const isAdmin = lowerEmail.includes("admin");
    const isHr = lowerEmail.includes("hr") || lowerEmail.includes("recruiter");

    const role: UserRole = isAdmin ? "ADMIN" : isHr ? "RECRUITER" : "CANDIDATE";
    const fullName = isAdmin
      ? "Platform Administrator"
      : isHr
      ? "Sarah Jenkins (Recruiter)"
      : "Arjun Sharma (Candidate)";

    const demoProfile: UserProfile = {
      id: isAdmin ? "prof-admin-1" : isHr ? "prof-rec-1" : "prof-cand-1",
      email,
      full_name: fullName,
      role,
      company: isHr ? "Stripe Global Recruiting" : undefined,
      verified_credentials_count: 2,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      const existing = this.getLocalProfiles();
      const updated = [demoProfile, ...existing.filter((p) => p.email !== email)];
      localStorage.setItem(LOCAL_STORAGE_ALL_PROFILES_KEY, JSON.stringify(updated));
    }

    return { user: demoProfile, error: null };
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("SignOut exception:", err);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser(): UserProfile | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Get all registered user profiles (For Admin Panel)
   */
  async getAllProfiles(): Promise<UserProfile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            email: p.email,
            full_name: p.full_name || "Anonymous User",
            role: p.role as UserRole,
            company: p.company,
            avatar_url: p.avatar_url,
            verified_credentials_count: p.verified_credentials_count || 0,
            created_at: p.created_at,
          }));
        }
      } catch (err) {
        console.warn("Error fetching profiles from Supabase:", err);
      }
    }

    return this.getLocalProfiles();
  },

  getLocalProfiles(): UserProfile[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_ALL_PROFILES_KEY);
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch {}
      }
      const cur = this.getCurrentUser();
      if (cur) return [cur];
    }
    return [];
  },

  /**
   * Admin updates a user's role (Promote to Recruiter or Admin)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ role: newRole })
          .eq("id", userId);

        if (error) throw error;
      } catch (err) {
        console.warn("Error updating user role in Supabase:", err);
      }
    }

    // Update local cache
    if (typeof window !== "undefined") {
      const list = this.getLocalProfiles();
      const updated = list.map((p) => (p.id === userId ? { ...p, role: newRole } : p));
      localStorage.setItem(LOCAL_STORAGE_ALL_PROFILES_KEY, JSON.stringify(updated));

      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ ...current, role: newRole }));
      }
    }

    return true;
  },
};
