import { supabase, isSupabaseConfigured, UserProfile, UserRole } from "@/lib/supabase";

export interface AuthResponse {
  user: UserProfile | null;
  confirmationRequired?: boolean;
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
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const redirectUrl = `${origin}/auth/callback`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              role,
              company: company || null,
            },
          },
        });

        if (error) return { user: null, confirmationRequired: false, error: error.message };

        if (data.user) {
          const confirmationRequired = !data.session;
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            role,
            company,
            verified_credentials_count: 0,
            created_at: new Date().toISOString(),
          };

          try {
            await supabase.from("profiles").upsert([
              {
                id: data.user.id,
                email: profile.email,
                full_name: fullName,
                role,
                company: company || null,
              },
            ]);
          } catch (e) {
            console.warn("Profiles upsert note:", e);
          }

          if (!confirmationRequired && typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          }

          return { user: profile, confirmationRequired, error: null };
        }
      } catch (err: any) {
        console.warn("Supabase signup error:", err);
        return { user: null, confirmationRequired: false, error: err.message || "Failed to register" };
      }
    }

    return {
      user: null,
      confirmationRequired: false,
      error: "Supabase connection is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and ANON_KEY.",
    };
  },

  /**
   * Resend signup email confirmation
   */
  async resendConfirmationEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    if (isSupabaseConfigured()) {
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const redirectUrl = `${origin}/auth/callback`;
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) return { success: false, error: error.message };
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to resend confirmation email" };
      }
    }
    return { success: true, error: null };
  },

  /**
   * Synchronize auth state with real Supabase session on startup/route check
   */
  async syncSession(): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const role = (profileData?.role || session.user.user_metadata?.role || "CANDIDATE") as UserRole;
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            full_name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "SkillForge User",
            role,
            company: profileData?.company || session.user.user_metadata?.company,
            verified_credentials_count: profileData?.verified_credentials_count || 0,
            created_at: profileData?.created_at || session.user.created_at,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          }
          return profile;
        } else {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (stored) {
              try {
                const u = JSON.parse(stored);
                if (u.id && !u.id.startsWith("demo-") && !u.id.startsWith("prof-")) {
                  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
                  return null;
                }
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn("Session sync notice:", err);
      }
    }
    return this.getCurrentUser();
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
        return { user: null, error: "Authentication failed. Please verify your credentials." };
      } catch (err: any) {
        return { user: null, error: err.message || "Authentication error" };
      }
    }

    return { user: null, error: "Supabase connection is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and ANON_KEY." };
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
