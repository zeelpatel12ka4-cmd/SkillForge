"use client";
import { useEffect, useState } from "react";

export type ThemeKey = "clean-light" | "emerald-light" | "sky-light" | "obsidian-dark";

export const THEMES: { key: ThemeKey; name: string; dot: string; desc: string }[] = [
  {
    key: "clean-light",
    name: "Clean Light",
    dot: "#4F46E5",
    desc: "Stripe & Apple Crisp Indigo (Default)",
  },
  {
    key: "emerald-light",
    name: "Emerald Light",
    dot: "#059669",
    desc: "Fresh Mint & Growth Tech",
  },
  {
    key: "sky-light",
    name: "Cyan Sky Light",
    dot: "#0284C7",
    desc: "Clean Sky & SaaS Modern",
  },
  {
    key: "obsidian-dark",
    name: "Obsidian Dark",
    dot: "#1E293B",
    desc: "High-Contrast Dark Mode",
  },
];

export default function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("clean-light");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read from localStorage, strictly defaulting to clean-light
    const saved = localStorage.getItem("skillforge-theme") as ThemeKey;
    // If previously saved as obsidian-dark or not found, reset to clean-light for a pure light mode experience
    const initial = (saved && saved !== "obsidian-dark" && THEMES.some((t) => t.key === saved))
      ? saved
      : "clean-light";
    setCurrentTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    if (saved === "obsidian-dark") {
      try {
        localStorage.setItem("skillforge-theme", "clean-light");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const changeTheme = (key: ThemeKey) => {
    setCurrentTheme(key);
    document.documentElement.setAttribute("data-theme", key);
    if (key === "obsidian-dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    try {
      localStorage.setItem("skillforge-theme", key);
    } catch (e) {
      // ignore
    }
    setIsOpen(false);
  };

  const activeThemeObj = THEMES.find((t) => t.key === currentTheme) || THEMES[0];

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm"
        title="Theme Selector"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: compact ? "4px 8px" : "6px 12px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: activeThemeObj.dot,
            boxShadow: `0 0 6px ${activeThemeObj.dot}80`,
          }}
        />
        {!compact && <span>{activeThemeObj.name}</span>}
        <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 998 }}
          />
          <div
            className="animate-fade-in"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              zIndex: 999,
              width: 240,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: 6,
              boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "var(--text-tertiary)",
                letterSpacing: "0.08em",
                padding: "6px 10px 4px",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: 4,
              }}
            >
              COLOR THEME
            </div>
            {THEMES.map((theme) => {
              const active = theme.key === currentTheme;
              return (
                <button
                  key={theme.key}
                  onClick={() => changeTheme(theme.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    background: active ? "var(--color-primary-bg)" : "transparent",
                    border: active ? "1px solid var(--color-primary-border)" : "1px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: theme.dot,
                      boxShadow: active ? `0 0 8px ${theme.dot}90` : "none",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "var(--color-primary)" : "var(--text-primary)",
                      }}
                    >
                      {theme.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-tertiary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {theme.desc}
                    </div>
                  </div>
                  {active && (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
