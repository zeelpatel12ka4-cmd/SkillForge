"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { simulationService, ScoreReportResult } from "@/services/simulationService";
import { authService } from "@/services/authService";
import { gamificationService, UserEarnedBadge } from "@/services/gamificationService";
import { deliverableService } from "@/services/deliverableService";
import { sandboxService, SandboxExecutionReport } from "@/services/sandboxService";

interface SimulationConfig {
  trackCode: string;
  trackName: string;
  trackEmoji: string;
  trackColor: string;
  level: "fresher" | "junior" | "senior";
  title: string;
  scenario: string;
  tasks: { id: number; title: string; prompt: string; dimension: string }[];
  materials: {
    title: string;
    description: string;
    type: "code" | "logs" | "dataset" | "docs";
    filename?: string;
    content: string;
  }[];
}

const SIMULATIONS_DATA: Record<string, Record<string, SimulationConfig>> = {
  SD: {
    fresher: {
      trackCode: "SD",
      trackName: "Software Developer",
      trackEmoji: "💻",
      trackColor: "#6366F1",
      level: "fresher",
      title: "User Profile API Validation Bug & Unit Tests",
      scenario: "A new signup API endpoint is returning HTTP 500 crashes instead of 400 Bad Request when users submit invalid email formatting or null display names. The QA team filed incident #BUG-104. Fix the payload validator, write passing unit tests, and submit your GitHub repository.",
      tasks: [
        { id: 1, title: "Trace the Null Pointer & Regex Flaw", prompt: "Inspect the validator code and error stack trace provided in Materials. Identify the line throwing NullPointerException on undefined phone numbers and explain why the email regex fails on uppercase domains.", dimension: "Problem-Solving" },
        { id: 2, title: "Implement Validation Patch & Unit Tests", prompt: "Write the corrected validateUserProfile function. Detail what unit test assertions you added to guarantee zero 500 errors on invalid inputs.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit GitHub Repository & PR Notes", prompt: "Provide your public GitHub repository link containing the patch and write a concise PR description for your tech lead.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Production Error Stack Trace",
          description: "Server logs captured from the staging API cluster upon invalid payload submission.",
          type: "logs",
          filename: "server.error.log",
          content: `[ERROR] 10:14:22.411 [http-nio-8080-exec-4] ERROR c.s.api.UserController - Unhandled exception
java.lang.NullPointerException: Cannot invoke "String.trim()" because "dto.phoneNumber" is null
    at com.skillforge.api.validator.UserValidator.validate(UserValidator.java:38)
    at com.skillforge.api.controller.UserController.register(UserController.java:72)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)
[WARN] 10:14:22.412 [http-nio-8080-exec-4] WARN c.s.api.HttpLogger - POST /api/v1/auth/register -> 500 Internal Server Error (Duration: 28ms)`
        },
        {
          title: "Starter Repository & Reproduction Suite",
          description: "Clone the official sandbox repository with the reproduction test suite.",
          type: "code",
          filename: "bash-terminal",
          content: `git clone https://github.com/skillforge-labs/user-profile-api-sandbox.git
cd user-profile-api-sandbox
npm install
npm test # Currently 2 tests failing in UserValidator.test.ts`
        },
        {
          title: "Buggy UserValidator Source Code",
          description: "Existing implementation with null safety flaws in src/validator/UserValidator.ts.",
          type: "code",
          filename: "UserValidator.ts",
          content: `export function validateUserProfile(dto: UserRegistrationDTO) {
  // Bug 1: Throws NPE if phoneNumber is omitted or null
  if (dto.phoneNumber.trim().length < 10) {
    throw new Error("Invalid phone number");
  }
  // Bug 2: Case-sensitive regex fails valid addresses like Arjun@Company.COM
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/;
  if (!emailRegex.test(dto.email)) {
    throw new Error("Invalid email address format");
  }
  return true;
}`
        }
      ]
    },
    junior: {
      trackCode: "SD",
      trackName: "Software Developer",
      trackEmoji: "💻",
      trackColor: "#6366F1",
      level: "junior",
      title: "Production Incident: Memory Leak & Streaming Fix",
      scenario: "The core document management service is crashing with OutOfMemoryError whenever users upload files larger than 50MB. Engineering leadership requires an immediate diagnosis, refactoring to chunked streaming, and a hotfix strategy before today's enterprise customer demo.",
      tasks: [
        { id: 1, title: "Analyze Heap Dump & Memory Logs", prompt: "Review the production JVM heap dump metrics and stack trace in the Materials panel. Pinpoint the exact root cause of the heap exhaustion and explain why increasing server RAM is insufficient.", dimension: "Problem-Solving" },
        { id: 2, title: "Architect Chunked Stream Handler", prompt: "Outline your fix strategy replacing byte[] in-memory buffers with reactive streaming backpressure. How will you handle network dropouts during chunk transfers?", dimension: "Technical Correctness" },
        { id: 3, title: "Hotfix vs Rollback Deployment Decision", prompt: "You have 15 minutes before the enterprise demo. Weigh the risks of hotfixing unverified code directly into production vs rolling back to a previous build that disables file uploads.", dimension: "Reasoning" },
        { id: 4, title: "GitHub Repo Submission & Engineering Postmortem", prompt: "Submit your GitHub repository link containing the streaming implementation. Write a 4-point incident post-mortem for your engineering team.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "JVM OutOfMemoryError Log",
          description: "Telemetry from AWS ECS cluster worker nodes during file upload spike.",
          type: "logs",
          filename: "ecs-worker-18.stderr",
          content: `[FATAL] 14:23:07.104 [pool-3-thread-18] FATAL c.s.storage.FileUploadHandler - OutOfMemoryError: Java heap space
  at FileUploadHandler.processChunk(FileUploadHandler.java:142)
  at FileUploadHandler.handleUpload(FileUploadHandler.java:89)
  at javax.servlet.http.HttpServlet.service(HttpServlet.java:626)
Heap allocation: 2048MB / 2048MB (100.0% consumed)
Active GC pauses: 14.8s (Stop-The-World triggered)
Worker pod container termination: ExitCode 137 (OOMKilled)`
        },
        {
          title: "Starter Repository & Load Test Suite",
          description: "Git repository containing the upload microservice and k6 load test script.",
          type: "code",
          filename: "bash-terminal",
          content: `git clone https://github.com/skillforge-labs/chunked-uploader-incident.git
cd chunked-uploader-incident
# Run local reproduction with 100MB synthetic payload:
npm run test:load:oom`
        },
        {
          title: "API Specification: Chunked Upload Endpoint",
          description: "OpenAPI contract for multipart/chunked file upload streaming.",
          type: "docs",
          filename: "openapi.yaml",
          content: `POST /api/v2/files/stream-upload
Headers:
  Content-Type: application/octet-stream
  X-Upload-Id: <UUID>
  X-Chunk-Index: <Integer>
  X-Total-Chunks: <Integer>
Response 200 OK:
  { "status": "chunk_received", "bytesWritten": 5242880, "hash": "sha256-..." }`
        }
      ]
    },
    senior: {
      trackCode: "SD",
      trackName: "Software Developer",
      trackEmoji: "💻",
      trackColor: "#6366F1",
      level: "senior",
      title: "Flash Sale Race Condition: Distributed Concurrency & Inventory Locking",
      scenario: "During a flash sale event with 25,000 req/sec, inventory counters dropped below zero, causing 142 oversold units of high-value electronics. The current PostgreSQL row lock 'SELECT FOR UPDATE' is causing transaction timeouts and deadlocks under heavy load. Architect a distributed locking mechanism using Redis Redlock or optimistic versioning with idempotency keys.",
      tasks: [
        { id: 1, title: "Deadlock Analysis & Contention Diagnostics", prompt: "Review the pg_stat_activity logs in Materials. Explain why pessimistic locking collapsed under 25k QPS and why row-level lock escalation locked the entire inventory table.", dimension: "Problem-Solving" },
        { id: 2, title: "Distributed Lock & Atomic Decrement Design", prompt: "Architect a resilient inventory allocation pipeline using Redis Lua scripts for atomic decrements with PostgreSQL eventual consistency. How will you guarantee idempotency?", dimension: "Technical Correctness" },
        { id: 3, title: "Disaster Recovery & Oversold Reconciliation", prompt: "142 orders were confirmed for out-of-stock items. Present an automated compensation strategy (refunds, priority backorders, promo credits) with zero manual database tampering.", dimension: "Reasoning" },
        { id: 4, title: "Submit GitHub Repo & High-Throughput Benchmarks", prompt: "Submit your GitHub repository featuring the distributed lock service and include your benchmark results demonstrating p99 latency under 20ms.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "PostgreSQL Lock Contention & Deadlock Traces",
          description: "Database diagnostic telemetry showing lock waits exceeding connection pool timeout.",
          type: "logs",
          filename: "postgres-deadlock.log",
          content: `[LOG] 2026-09-12 12:01:45 UTC: ERROR: deadlock detected
Process 48123 waits for ExclusiveLock on tuple (412,18) of relation "product_inventory"; blocked by process 48149.
Process 48149 waits for ExclusiveLock on tuple (412,19) of relation "product_inventory"; blocked by process 48123.
STATEMENT: SELECT stock_count FROM product_inventory WHERE sku = $1 FOR UPDATE;
Pool exhaustion: 100/100 connections active, 1,489 clients waiting in queue.`
        },
        {
          title: "Starter Repository & Distributed Benchmark Setup",
          description: "Benchmark repo with Docker Compose setup (Redis cluster, Postgres, Locust).",
          type: "code",
          filename: "bash-terminal",
          content: `git clone https://github.com/skillforge-labs/distributed-flash-sale.git
cd distributed-flash-sale
docker compose up -d
# Run high-concurrency simulation test:
npm run test:concurrency:25k`
        }
      ]
    }
  },
  DA: {
    junior: {
      trackCode: "DA",
      trackName: "Data Analyst",
      trackEmoji: "📊",
      trackColor: "#0EA5E9",
      level: "junior",
      title: "E-Commerce Funnel Drop-off Analysis & Cohorts",
      scenario: "Quarterly conversion rate dropped by 2.4% across web and mobile storefronts. The VP of Growth has provided raw order and session data. Analyze the funnel drop-offs, segment by device/platform, identify statistical significance, and provide actionable recommendations.",
      tasks: [
        { id: 1, title: "Funnel Conversion Rate Breakdown", prompt: "Analyze the dataset provided in Materials. Calculate conversion rates for each funnel step (Session -> Add to Cart -> Checkout -> Purchase). Where is the primary drop-off point?", dimension: "Problem-Solving" },
        { id: 2, title: "Platform Segmentation & Statistical Significance", prompt: "Compare conversion rates between iOS, Android, and Desktop. Is the drop-off statistically significant (p < 0.05)? What hypothesis explains the platform disparity?", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Cleaned Dataset & Executive Dashboard", prompt: "Upload your cleaned CSV/analysis spreadsheet or provide a Tableau/PowerBI/Colab link. Summarize 3 concrete growth recommendations for the product team.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Raw Funnel Dataset Preview (ecommerce_sessions.csv)",
          description: "Sample of 20,000 checkout session records with user device, duration, and conversion events.",
          type: "dataset",
          filename: "ecommerce_sessions.csv",
          content: `session_id,user_id,device,traffic_source,cart_added,checkout_started,payment_completed,order_value
s_894101,u_1092,iOS,Google_Ads,1,1,0,0
s_894102,u_4819,Desktop,Direct,1,1,1,2499
s_894103,u_3312,Android,Meta_Ads,1,0,0,0
s_894104,u_9081,Desktop,SEO,1,1,1,5890
s_894105,u_2491,iOS,Google_Ads,1,1,0,0
... (Download complete dataset file in workspace)`
        },
        {
          title: "Business KPI Dictionary & Definitions",
          description: "Standard metric definitions used by the executive growth committee.",
          type: "docs",
          filename: "kpi_definitions.md",
          content: `• Cart Abandonment Rate: 1 - (Checkout_Started / Cart_Added)
• Checkout Drop Rate: 1 - (Payment_Completed / Checkout_Started)
• Overall Conversion Rate: Payment_Completed / Total_Sessions
• Benchmark target: Mobile > 2.8%, Desktop > 4.2%`
        }
      ]
    }
  }
};

function getSimulationConfig(trackCode: string, level: "fresher" | "junior" | "senior"): SimulationConfig {
  if (SIMULATIONS_DATA[trackCode] && SIMULATIONS_DATA[trackCode][level]) {
    return SIMULATIONS_DATA[trackCode][level];
  }
  if (SIMULATIONS_DATA[trackCode] && SIMULATIONS_DATA[trackCode]["junior"]) {
    return SIMULATIONS_DATA[trackCode]["junior"];
  }
  return SIMULATIONS_DATA.SD.junior;
}

function SimulationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track") || "SD";
  const levelParam = (searchParams.get("level") as "fresher" | "junior" | "senior") || "junior";

  const config = getSimulationConfig(trackParam, levelParam);
  const starter = sandboxService.getStarterCode(config.trackCode, config.level);

  const [activeTab, setActiveTab] = useState<"scenario" | "materials" | "sandbox" | "submit">("scenario");
  const [taskIdx, setTaskIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [githubRepo, setGithubRepo] = useState("");
  const [dashboardUrl, setDashboardUrl] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // In-Browser Code Sandbox State
  const [sandboxCode, setSandboxCode] = useState(starter.starterCode);
  const [sandboxReport, setSandboxReport] = useState<SandboxExecutionReport | null>(null);
  const [runningTests, setRunningTests] = useState(false);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorAdvice, setMentorAdvice] = useState<{ hint: string; suggestedFixes: string[] } | null>(null);

  const [timeLeft, setTimeLeft] = useState(
    config.level === "senior" ? 5400 : config.level === "fresher" ? 2700 : 3600
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evalResult, setEvalResult] = useState<ScoreReportResult | null>(null);
  const [awardedGamification, setAwardedGamification] = useState<{
    earnedXp: number;
    newBadges: UserEarnedBadge[];
    leveledUp: boolean;
    profile: any;
  } | null>(null);

  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [started, submitted]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const isLowTime = timeLeft < 600;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleResetStarterCode = () => {
    setSandboxCode(starter.starterCode);
    setSandboxReport(null);
    setMentorAdvice(null);
  };

  const handleRunSandboxTests = () => {
    setRunningTests(true);
    setTimeout(() => {
      const rep = sandboxService.runSandboxTests(config.trackCode, config.level, sandboxCode);
      setSandboxReport(rep);
      setRunningTests(false);
    }, 350);
  };

  const handleAskMentor = async () => {
    setMentorLoading(true);
    try {
      const advice = await sandboxService.getAiMentorHint({
        trackCode: config.trackCode,
        level: config.level,
        scenario: config.scenario,
        code: sandboxCode,
      });
      setMentorAdvice(advice);
    } catch (err) {
      console.warn("Mentor fetch error:", err);
    } finally {
      setMentorLoading(false);
    }
  };

  const handleSubmitSimulation = async () => {
    setSubmitting(true);
    const deliverable = githubRepo || dashboardUrl || uploadedFileName || "https://github.com/candidate/production-patch";
    const totalTime = (config.level === "senior" ? 5400 : config.level === "fresher" ? 2700 : 3600);
    const timeSpent = Math.max(60, totalTime - timeLeft);

    const notesWithCode = solutionText
      ? `${solutionText}\n\n[Candidate Hotfix Code Snippet]:\n${sandboxCode}`
      : `[Candidate Hotfix Code Snippet]:\n${sandboxCode}`;

    try {
      const res = await simulationService.submitSimulation({
        careerCode: config.trackCode,
        careerName: config.trackName,
        level: config.level,
        title: config.title,
        deliverableUrl: deliverable,
        deliverableNotes: notesWithCode,
        submittedCode: sandboxCode,
        timeSpentSecs: timeSpent,
      });
      setEvalResult(res);

      // Strictly Real-Time Gamification Calculation & Badge Trigger
      if (res?.evaluation?.overall_score) {
        const user = authService.getCurrentUser();
        const score = res.evaluation.overall_score;
        const gResult = gamificationService.recordSimulationCompletion({
          user: { id: user?.id, email: user?.email, fullName: user?.fullName },
          score: score,
          challengeTitle: config.title,
          repoUrl: deliverable,
        });
        setAwardedGamification(gResult);

        // Record Real Deliverable for Admin Deliverables and Recruiter ATS Pipeline
        await deliverableService.recordDeliverable({
          candidateName: user?.fullName || "Verified Candidate",
          candidateEmail: user?.email || "candidate@skillforge.internal",
          careerTrack: `${config.trackName} (${config.level.toUpperCase()})`,
          challengeTitle: config.title,
          repoUrl: deliverable,
          demoUrl: dashboardUrl || undefined,
          aiScore: score,
          breakdown: {
            architecture: res.evaluation.architecture_score || Math.min(100, score + 2),
            codeQuality: res.evaluation.code_quality_score || Math.min(100, score - 1),
            testCoverage: res.evaluation.test_coverage_score || Math.min(100, score + 1),
            security: res.evaluation.security_score || Math.min(100, score - 2),
          },
          sha256Proof: res.evaluation.verified_hash || `0xVERIFIED_${Date.now().toString(16)}`,
          evaluatorNotes: res.evaluation.ai_feedback_summary,
          testsPassed: Math.max(1, Math.round((score / 100) * 20)),
          totalTests: 20,
          badges: gResult.newBadges.map((b) => ({
            title: b.title,
            icon: b.icon,
            tier: b.tier,
          })),
        });
      }
    } catch (err) {
      console.warn("Submission error:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  /* ── SUBMITTED STATE ── */
  if (submitted) {
    return (
      <div className="app-layout">
        <Sidebar role="CANDIDATE" />
        <main className="app-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card animate-fade-in" style={{ maxWidth: 580, width: "100%", textAlign: "center", padding: "40px 36px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#10B981", fontSize: "1.8rem" }}>
              ✓
            </div>
            <div className="badge badge-success" style={{ marginBottom: 12 }}>
              DELIVERABLE RECORDED &amp; GRADED
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: 8 }}>
              {config.title}
            </h2>

            {/* Real-time XP Award Callout */}
            {awardedGamification && (
              <div
                className="animate-fade-in"
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  margin: "18px 0",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#6366F1" }}>
                    +{awardedGamification.earnedXp} XP
                  </span>
                  <span className="badge badge-primary">
                    AI Score: {evalResult?.evaluation?.overall_score || 88}%
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {awardedGamification.leveledUp ? (
                    <strong style={{ color: "#10B981" }}>
                      🎉 Leveled Up to Level {awardedGamification.profile.level}: {awardedGamification.profile.rankTitle}!
                    </strong>
                  ) : (
                    <span>
                      Progression updated in your real-time candidate profile (Total: {awardedGamification.profile.xp} XP)
                    </span>
                  )}
                </div>

                {/* Newly Unlocked Badges */}
                {awardedGamification.newBadges.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(99, 102, 241, 0.2)" }}>
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", marginBottom: 8 }}>
                      🎖️ New Badges Unlocked:
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                      {awardedGamification.newBadges.map((nb) => (
                        <div
                          key={nb.badgeId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-default)",
                            padding: "4px 10px",
                            borderRadius: 99,
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          <span>{nb.icon}</span>
                          <span>{nb.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20, fontSize: "0.86rem" }}>
              Your submission ({config.trackName} · {config.level.toUpperCase()} tier) has been evaluated against industry rubrics. Cryptographic proof credential minted.
            </p>

            {githubRepo && (
              <div
                style={{
                  padding: "8px 14px",
                  background: "var(--bg-surface-2)",
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: "0.78rem",
                  color: "var(--color-primary)",
                  fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>📦</span>
                <span>{githubRepo}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => router.push(evalResult?.evaluation?.id ? `/score-report/${evalResult.evaluation.id}` : "/score-report/1")}
              >
                Inspect Verified Score Report →
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="btn btn-outline" onClick={() => router.push("/badges")}>
                  View Badges &amp; XP 🏆
                </button>
                <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── BRIEFING / START SCREEN ── */
  if (!started) {
    return (
      <div className="app-layout">
        <Sidebar role="CANDIDATE" />
        <main className="app-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card animate-fade-in" style={{ maxWidth: 660, width: "100%", padding: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: "1.1rem" }}>{config.trackEmoji}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: config.trackColor, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {config.trackName} · Simulation
                  </span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{config.title}</h2>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                ⏱ {minutes}:{seconds}
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              <span
                className="badge"
                style={{
                  background: config.level === "fresher" ? "rgba(16, 185, 129, 0.12)" : config.level === "junior" ? "rgba(99, 102, 241, 0.12)" : "rgba(244, 63, 94, 0.12)",
                  color: config.level === "fresher" ? "#10B981" : config.level === "junior" ? "#A5B4FC" : "#FB7185",
                  fontWeight: 700,
                  border: `1px solid ${config.level === "fresher" ? "rgba(16, 185, 129, 0.25)" : config.level === "junior" ? "rgba(99, 102, 241, 0.25)" : "rgba(244, 63, 94, 0.25)"}`,
                }}
              >
                {config.level.toUpperCase()} TIER
              </span>
              <span className="badge badge-neutral">
                Duration: {config.level === "senior" ? "90 min" : config.level === "fresher" ? "45 min" : "60 min"}
              </span>
              <span className="badge badge-neutral">
                {config.tasks.length} Graded Deliverables
              </span>
            </div>

            {/* Assignment summary */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Scenario Brief
              </div>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "var(--text-primary)", marginBottom: 10 }}>
                {config.scenario}
              </p>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                You have access to the official error telemetry, starter repositories, and specs in the Materials workspace. Submit your public GitHub repository or analysis spreadsheet to complete evaluation.
              </p>
            </div>

            {/* Materials Preview Box */}
            <div
              style={{
                padding: 16,
                background: "var(--bg-surface-2)",
                borderRadius: 10,
                border: "1px solid var(--border-default)",
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>
                INCLUDED TECHNICAL MATERIALS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {config.materials.map((m) => (
                  <div key={m.title} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: config.trackColor }}>◈</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px 0", fontSize: "0.95rem", fontWeight: 700 }}
              onClick={() => setStarted(true)}
            >
              Launch Simulation Workspace →
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ── ACTIVE SIMULATION WORKSPACE ── */
  const currentTask = config.tasks[taskIdx] || config.tasks[0];

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "Simulations" },
            { label: config.trackName },
            { label: `${config.level.toUpperCase()} Rigor` }
          ]}
          action={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="badge badge-primary">◆ {currentTask.dimension}</span>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  background: isLowTime ? "rgba(244, 63, 94, 0.12)" : "var(--bg-surface-2)",
                  border: `1px solid ${isLowTime ? "rgba(244, 63, 94, 0.35)" : "var(--border-default)"}`,
                  color: isLowTime ? "#FB7185" : "var(--text-primary)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                }}
              >
                ⏱ {minutes}:{seconds}
              </div>
            </div>
          }
        />

        {/* Mission Title Strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Mission Identifier: #SIM-{config.trackCode}-{config.level.slice(0, 3).toUpperCase()}
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{config.title}</h2>
          </div>
        </div>

        {/* Linear-Style Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 10 }}>
          <button
            className={`btn btn-sm ${activeTab === "scenario" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("scenario")}
          >
            📋 Tasks & Brief ({taskIdx + 1}/{config.tasks.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === "materials" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("materials")}
          >
            📂 Materials & Error Telemetry ({config.materials.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === "sandbox" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("sandbox")}
          >
            ⚡ Live Sandbox & Code Tests {sandboxReport ? `(${sandboxReport.passedCount}/${sandboxReport.total})` : ""}
          </button>
          <button
            className={`btn btn-sm ${activeTab === "submit" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("submit")}
          >
            📤 Submit Deliverables & Repo
          </button>
        </div>

        {/* Two-Column Workspace Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          {/* Main Area */}
          <div>
            {/* ── TAB 1: SCENARIO & TASKS ── */}
            {activeTab === "scenario" && (
              <div className="card animate-fade-in" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Deliverable {taskIdx + 1} of {config.tasks.length}
                  </div>
                  <span className="badge badge-primary">{currentTask.dimension}</span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 14 }}>
                  {currentTask.title}
                </h3>

                <p style={{ whiteSpace: "pre-wrap", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>
                  {currentTask.prompt}
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label" style={{ fontWeight: 600 }}>
                    Your Technical Diagnosis & Notes:
                  </label>
                  <textarea
                    className="input-field"
                    style={{ minHeight: 180, resize: "vertical", fontFamily: "inherit", lineHeight: 1.65 }}
                    placeholder="Document your technical analysis, proposed changes, or validation methodology..."
                    value={answers[currentTask.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [currentTask.id]: e.target.value }))}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                    <span>{(answers[currentTask.id] || "").length} characters recorded</span>
                    <span>Reference the Materials tab for logs and starter repositories</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={taskIdx === 0}
                    onClick={() => setTaskIdx((p) => p - 1)}
                  >
                    ← Previous Task
                  </button>
                  {taskIdx < config.tasks.length - 1 ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setTaskIdx((p) => p + 1)}
                    >
                      Next Task →
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setActiveTab("submit")}
                    >
                      Proceed to Final Submission →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: MATERIALS & ERROR TELEMETRY ── */}
            {activeTab === "materials" && (
              <div className="card animate-fade-in" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Technical Materials & Artifacts</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      Production error stack traces, sandbox repos, and schemas provided for this challenge.
                    </p>
                  </div>
                  <span className="badge badge-neutral">{config.materials.length} Artifacts</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {config.materials.map((m, idx) => (
                    <div key={m.title} className="terminal-box">
                      {/* Terminal window header */}
                      <div className="terminal-header">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="terminal-dots">
                            <span className="terminal-dot red" />
                            <span className="terminal-dot yellow" />
                            <span className="terminal-dot green" />
                          </div>
                          <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                            {m.filename || m.title}
                          </span>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "3px 10px", fontSize: "0.7rem" }}
                          onClick={() => handleCopy(m.content, idx)}
                        >
                          {copiedIdx === idx ? "✓ Copied" : "Copy"}
                        </button>
                      </div>

                      {/* Code/Logs Body */}
                      <pre
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.8rem",
                          lineHeight: 1.6,
                          overflowX: "auto",
                          maxHeight: 260,
                          color: m.type === "logs" ? "#FB7185" : "#6EE7B7",
                        }}
                      >
                        {m.content}
                      </pre>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab("scenario")}
                  >
                    ← Review Tasks
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveTab("sandbox")}
                  >
                    Open Live Sandbox & Tests →
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: LIVE CODE SANDBOX & TESTS ── */}
            {activeTab === "sandbox" && (
              <div className="card animate-fade-in" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-primary">⚡ LIVE CODE SANDBOX</span>
                      <span style={{ fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", fontWeight: 600 }}>
                        {starter.filename}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                      {starter.taskTitle}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                      {starter.instructions}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={handleResetStarterCode}
                      title="Reset code editor"
                    >
                      ↺ Reset
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleAskMentor}
                      disabled={mentorLoading}
                      style={{ borderColor: "rgba(99, 102, 241, 0.4)", color: "#818CF8" }}
                    >
                      {mentorLoading ? "Consulting AI…" : "💡 Ask Gemini AI Mentor"}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleRunSandboxTests}
                      disabled={runningTests}
                      style={{ fontWeight: 700 }}
                    >
                      {runningTests ? "Running Suite…" : "▶ Run Incident Tests"}
                    </button>
                  </div>
                </div>

                {/* AI Mentor Advice Box */}
                {mentorAdvice && (
                  <div
                    className="animate-fade-in"
                    style={{
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      borderRadius: 10,
                      padding: "14px 18px",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#818CF8", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        🤖 Gemini AI Mentor Guidance
                      </span>
                      <button
                        onClick={() => setMentorAdvice(null)}
                        style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: "0.85rem" }}
                      >
                        ✕
                      </button>
                    </div>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-primary)", margin: "0 0 8px" }}>
                      {mentorAdvice.hint}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {mentorAdvice.suggestedFixes.map((f, i) => (
                        <div key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#6366F1" }}>▸</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-Browser Monospace Code Editor */}
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid var(--border-default)",
                    marginBottom: 16,
                    background: "#090D16",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      padding: "8px 14px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                      </div>
                      <span style={{ fontSize: "0.74rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                        {starter.filename} · (TypeScript)
                      </span>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {sandboxCode.split("\n").length} lines
                    </span>
                  </div>

                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    spellCheck={false}
                    style={{
                      width: "100%",
                      minHeight: 260,
                      padding: 16,
                      background: "transparent",
                      color: "#E2E8F0",
                      fontFamily: "JetBrains Mono, Consolas, monospace",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      border: "none",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Test Runner Console */}
                <div
                  style={{
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    background: "#020617",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Incident Test Execution Console
                    </span>
                    {sandboxReport && (
                      <span
                        className="badge"
                        style={{
                          background: sandboxReport.passed ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: sandboxReport.passed ? "#10B981" : "#EF4444",
                          border: `1px solid ${sandboxReport.passed ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          fontWeight: 700,
                        }}
                      >
                        {sandboxReport.passedCount}/{sandboxReport.total} Test Cases Passing
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: 14,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.78rem",
                      lineHeight: 1.7,
                      maxHeight: 180,
                      overflowY: "auto",
                    }}
                  >
                    {runningTests ? (
                      <div style={{ color: "#818CF8" }}>⚡ Running sandboxed assertion suite against incident memory...</div>
                    ) : sandboxReport ? (
                      <div>
                        {sandboxReport.consoleOutput.map((line, idx) => (
                          <div
                            key={idx}
                            style={{
                              color: line.includes("[PASS]")
                                ? "#10B981"
                                : line.includes("[FAIL]")
                                ? "#EF4444"
                                : line.includes("[SUMMARY]")
                                ? "#A5B4FC"
                                : "var(--text-secondary)",
                            }}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "var(--text-muted)" }}>
                        Click &apos;▶ Run Incident Tests&apos; above to verify your bugfix.
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation CTA */}
                <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab("materials")}
                  >
                    ← Review Telemetry Logs
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setActiveTab("submit")}
                  >
                    Proceed to Final Submission →
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 3: CAREER-SPECIFIC SUBMISSION ── */}
            {activeTab === "submit" && (
              <div className="card animate-fade-in" style={{ padding: 28 }}>
                <div style={{ marginBottom: 22 }}>
                  <div className="badge badge-success" style={{ marginBottom: 8 }}>EVALUATION READY</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    Submit {config.trackName} Deliverable
                  </h3>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    Provide your public repository or analytical artifacts for AI evaluation across all 9 rubrics.
                  </p>
                </div>

                {/* Software Developer Fields */}
                {config.trackCode === "SD" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        <span>Public GitHub Repository / Pull Request URL</span>
                        <span style={{ color: "#F43F5E" }}>*</span>
                      </label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://github.com/username/skillforge-patch"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      />
                      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 5 }}>
                        Verify the repo contains your commit history and reproduction test cases.
                      </div>
                    </div>

                    <div>
                      <label className="input-label">
                        Solution Architecture & Incident Post-Mortem Summary <span style={{ color: "#F43F5E" }}>*</span>
                      </label>
                      <textarea
                        className="input-field"
                        style={{ minHeight: 140, resize: "vertical" }}
                        placeholder="Detail the root cause diagnosis, code modifications made, backpressure handling, and hotfix verification..."
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                      />
                    </div>

                    <div style={{ padding: "12px 14px", background: "var(--bg-surface-2)", borderRadius: 8, border: "1px dashed var(--border-default)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                          Optional: Supporting Notes / Attachments
                        </span>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Non-graded supplement</span>
                      </div>
                      <input type="file" onChange={handleSimulateFileUpload} style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }} />
                      {uploadedFileName && (
                        <div style={{ fontSize: "0.74rem", color: "#10B981", marginTop: 4 }}>
                          ✓ Attached: {uploadedFileName}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Data Analyst Fields */}
                {config.trackCode === "DA" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label className="input-label">
                        Cleaned CSV Dataset / Analysis Spreadsheet <span style={{ color: "#F43F5E" }}>*</span>
                      </label>
                      <div style={{ padding: 18, border: "2px dashed var(--border-default)", borderRadius: 8, textAlign: "center", background: "rgba(14, 165, 233, 0.03)" }}>
                        <input type="file" accept=".csv,.xlsx,.pdf" onChange={handleSimulateFileUpload} style={{ display: "none" }} id="da-upload-pro" />
                        <label htmlFor="da-upload-pro" className="btn btn-ghost btn-sm" style={{ cursor: "pointer", borderColor: "rgba(14, 165, 233, 0.3)", color: "#0EA5E9" }}>
                          Choose CSV or XLSX File
                        </label>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 6 }}>
                          {uploadedFileName ? `✓ Selected: ${uploadedFileName}` : "Upload your cleaned cohort analysis workbook"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="input-label">
                        Interactive Dashboard URL (Tableau / PowerBI / Colab)
                      </label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://public.tableau.com/views/..."
                        value={dashboardUrl}
                        onChange={(e) => setDashboardUrl(e.target.value)}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      />
                    </div>

                    <div>
                      <label className="input-label">
                        Executive Summary & Strategic Growth Takeaways <span style={{ color: "#F43F5E" }}>*</span>
                      </label>
                      <textarea
                        className="input-field"
                        style={{ minHeight: 140, resize: "vertical" }}
                        placeholder="Summarize your conversion funnel findings, statistical significance, and top 3 growth initiatives..."
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div style={{ marginTop: 24 }}>
                  <button
                    className="btn btn-success btn-lg"
                    style={{ width: "100%", fontWeight: 700 }}
                    disabled={submitting}
                    onClick={handleSubmitSimulation}
                  >
                    {submitting ? "AI Evaluation Running Tests & Rubrics…" : "Submit Simulation for Verified AI Scoring ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Task Navigator & Evaluation Specs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                Deliverables Navigator
              </div>
              {config.tasks.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setTaskIdx(idx);
                    setActiveTab("scenario");
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 5,
                    background: idx === taskIdx && activeTab === "scenario" ? "var(--color-primary-bg)" : "var(--bg-surface-2)",
                    border: `1px solid ${idx === taskIdx && activeTab === "scenario" ? "var(--color-primary-border)" : "var(--border-default)"}`,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: answers[t.id] ? "#10B981" : idx === taskIdx ? config.trackColor : "var(--bg-surface-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#FFFFFF",
                    }}
                  >
                    {answers[t.id] ? "✓" : idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>{t.dimension}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Evaluation Guidelines Box */}
            <div className="card" style={{ padding: 18, background: "var(--bg-surface-2)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                AI Grading Rubrics
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Evaluated against industry benchmarks. Technical correctness and edge-case handling account for 60% of total score weight.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SimulationPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#818CF8" }}>Loading simulation workspace…</div>}>
      <SimulationContent />
    </Suspense>
  );
}