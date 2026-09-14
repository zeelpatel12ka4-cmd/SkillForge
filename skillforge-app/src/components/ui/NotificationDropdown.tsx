"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notificationService, NotificationItem } from "@/services/notificationService";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = () => {
    const list = notificationService.getNotifications();
    setNotifications(list);
    setUnreadCount(list.filter((n) => !n.read).length);
  };

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("skillforge_notifications_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("skillforge_notifications_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    load();
  };

  const handleItemClick = (n: NotificationItem) => {
    notificationService.markAsRead(n.id);
    load();
    setIsOpen(false);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "application":
        return "🚀";
      case "deliverable":
        return "🛡️";
      case "gamification":
        return "⭐";
      case "competition":
        return "🏆";
      default:
        return "⚡";
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="btn-notifications-bell"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          fontSize: "1rem",
          transition: "all 0.15s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        aria-label="View notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: "0.65rem",
              fontWeight: 800,
              width: 17,
              height: 17,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg-surface)",
              boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            width: 320,
            maxWidth: "90vw",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 18px 38px -8px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0,0,0,0.05)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-surface-2)",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>📭</div>
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => {
                const Content = (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--border-subtle)",
                      background: n.read ? "transparent" : "var(--color-primary-bg)",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{getIcon(n.type)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {n.title}
                        </div>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: 6 }}>
                          {n.timestamp}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                    </div>
                    {!n.read && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", marginTop: 6, flexShrink: 0 }} />
                    )}
                  </div>
                );

                return n.linkUrl ? (
                  <Link key={n.id} href={n.linkUrl} style={{ textDecoration: "none" }}>
                    {Content}
                  </Link>
                ) : (
                  Content
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: "8px 16px",
                borderTop: "1px solid var(--border-subtle)",
                textAlign: "center",
                background: "var(--bg-surface-2)",
              }}
            >
              <button
                onClick={() => {
                  notificationService.clearAll();
                  load();
                }}
                style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", cursor: "pointer" }}
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
