export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "application" | "deliverable" | "gamification" | "competition" | "system";
  read: boolean;
  linkUrl?: string;
}

const LOCAL_STORAGE_NOTIFICATIONS_KEY = "skillforge_notifications";

export const notificationService = {
  /**
   * Get all notifications
   */
  getNotifications(): NotificationItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
      if (!raw) {
        const initial: NotificationItem[] = [
          {
            id: "notif-welcome",
            title: "Welcome to SkillForge AI",
            message: "All incident simulations and group hackathons are evaluated live by Google Gemini AI.",
            timestamp: "Just now",
            type: "system",
            read: false,
            linkUrl: "/dashboard",
          },
        ];
        localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  /**
   * Add a new notification
   */
  addNotification(params: {
    title: string;
    message: string;
    type?: NotificationItem["type"];
    linkUrl?: string;
  }): NotificationItem {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: params.title,
      message: params.message,
      timestamp: "Just now",
      type: params.type || "system",
      read: false,
      linkUrl: params.linkUrl,
    };

    if (typeof window !== "undefined") {
      const current = this.getNotifications();
      const updated = [newItem, ...current.slice(0, 19)]; // Keep latest 20
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("skillforge_notifications_updated", { detail: newItem }));
    }

    return newItem;
  },

  /**
   * Mark a notification as read
   */
  markAsRead(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getNotifications();
      const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("skillforge_notifications_updated"));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getNotifications();
      const updated = current.map((n) => ({ ...n, read: true }));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("skillforge_notifications_updated"));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Clear all notifications
   */
  clearAll(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("skillforge_notifications_updated"));
  },

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  },
};
