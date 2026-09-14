import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SkillForge AI — Enterprise Career Simulation Engine",
  description: "AI-powered career readiness and technical incident simulations. Solve real-world engineering bugs, analyze funnels, and match directly with top engineering teams.",
  keywords: "career simulations, engineering incident, job simulation, skill gap analysis, technical interview",
  openGraph: {
    title: "SkillForge AI",
    description: "Prove your skills with real technical deliverables. Land your dream role.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="clean-light" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Public+Sans:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('skillforge-theme');
                  // Default to clean-light if unset or if previously saved as obsidian-dark
                  var theme = (saved && saved !== 'obsidian-dark') ? saved : 'clean-light';
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'clean-light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
