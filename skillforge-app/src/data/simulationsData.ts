export interface SimulationConfig {
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

export const SIMULATIONS_DATA: Record<string, Record<string, SimulationConfig>> = {
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
npm run test:concurrency:25k`
        }
      ]
    }
  },

  DA: {
    fresher: {
      trackCode: "DA",
      trackName: "Data Analyst",
      trackEmoji: "📊",
      trackColor: "#0EA5E9",
      level: "fresher",
      title: "Customer Churn Data Cleanup & KPI Aggregation",
      scenario: "Raw transaction logs from the billing gateway contain duplicate records, null subscription IDs, and inconsistent date timestamps. Clean the dataset, impute missing values, and calculate the Monthly Recurring Revenue (MRR) retention rate.",
      tasks: [
        { id: 1, title: "Deduplication & Missing Data Imputation", prompt: "Identify duplicated charge IDs and write Pandas/SQL queries to clean anomalies without discarding valid customer records.", dimension: "Problem-Solving" },
        { id: 2, title: "Monthly Retention Rate & Cohort Metrics", prompt: "Compute monthly retention cohorts across Q1-Q4. What is the average net revenue churn percentage?", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Cleaned Dataset & Executive Summary", prompt: "Upload the cleaned CSV or link your Colab/Jupyter notebook. Summarize your top 3 findings for the VP of Finance.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Billing Gateway Raw Transactions",
          description: "5,000 raw billing records with duplicate anomalies and formatting errors.",
          type: "dataset",
          filename: "billing_raw.csv",
          content: `tx_id,customer_id,plan_tier,amount,status,timestamp
tx_01928,c_9941,Enterprise,12000,SUCCESS,2026-01-04T10:12:00Z
tx_01929,c_8812,Pro,2400,SUCCESS,2026-01-04T10:14:22Z
tx_01928,c_9941,Enterprise,12000,SUCCESS,2026-01-04T10:12:00Z # Duplicate
tx_01930,c_4411,,499,PENDING,INVALID_DATE`
        },
        {
          title: "Data Dictionary & Metric Standards",
          description: "Accounting guidelines for Net Revenue Retention (NRR) and Churn.",
          type: "docs",
          filename: "finance_dictionary.md",
          content: `• Gross Churn = (Lost ARR from cancellations) / (Starting ARR)
• Net Revenue Retention = (Starting ARR + Expansion - Contraction - Churn) / Starting ARR
• Baseline target: NRR >= 115%`
        }
      ]
    },
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
s_894105,u_2491,iOS,Google_Ads,1,1,0,0`
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
    },
    senior: {
      trackCode: "DA",
      trackName: "Data Analyst",
      trackEmoji: "📊",
      trackColor: "#0EA5E9",
      level: "senior",
      title: "Multi-Touch Attribution Model & Predictive LTV",
      scenario: "The marketing team spends ₹20M quarterly across 6 digital channels. Last-click attribution is overvaluing retargeting ads and starving top-of-funnel discovery. Build an algorithmic Markov Chain or Shapley Value attribution model to optimize budget allocation.",
      tasks: [
        { id: 1, title: "Algorithmic Attribution Model Implementation", prompt: "Compare first-touch, linear, and Shapley value attribution weights. Which channel is most undervalued by current last-touch reporting?", dimension: "Technical Correctness" },
        { id: 2, title: "Customer Lifetime Value (CLV) Cohort Regression", prompt: "Construct a predictive regression model for 12-month customer lifetime value segmented by acquisition channel.", dimension: "Problem-Solving" },
        { id: 3, title: "Budget Re-allocation & Executive Strategy", prompt: "Propose a revised marketing budget reallocation maximizing blended ROAS. Defend your model assumptions to the CFO.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Multi-Touch Journey Dataset (50,000 touchpoints)",
          description: "Customer journey sequences showing touchpoint timestamps, channels, and conversion values.",
          type: "dataset",
          filename: "attribution_journeys.csv",
          content: `journey_id,channel_sequence,converted,total_spend,revenue
j_001,SEO > YouTube_Ad > Retargeting_Display,1,14.20,1850.00
j_002,Google_Search > Direct,1,8.50,920.00
j_003,LinkedIn_Sponsor > Email_Newsletter > None,0,22.00,0.00`
        }
      ]
    }
  },

  UX: {
    fresher: {
      trackCode: "UX",
      trackName: "UI / UX Designer",
      trackEmoji: "🎨",
      trackColor: "#EC4899",
      level: "fresher",
      title: "Design System Token Migration & Mobile Form Usability",
      scenario: "The mobile registration flow has high drop-off on small screens due to contrast issues and poorly sized tap targets. Audit the form against WCAG 2.1 AA accessibility standards and refactor component tokens.",
      tasks: [
        { id: 1, title: "WCAG 2.1 Accessibility & Contrast Audit", prompt: "Inspect color contrasts and tap target dimensions. Identify all violations failing AA compliance.", dimension: "Problem-Solving" },
        { id: 2, title: "Design System Token Standardization", prompt: "Define semantic color tokens, typography scale, and responsive padding variables for mobile viewports.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Figma Prototype & Design Rationale", prompt: "Provide your public Figma prototype link with before/after annotations explaining usability improvements.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "WCAG 2.1 Contrast Telemetry",
          description: "Automated accessibility audit report showing low contrast text elements.",
          type: "docs",
          filename: "contrast_audit.json",
          content: `{"elements": [{"selector": ".helper-text", "ratio": "2.8:1", "status": "FAIL_AA"}, {"selector": ".btn-primary", "ratio": "4.9:1", "status": "PASS"}]}`
        }
      ]
    },
    junior: {
      trackCode: "UX",
      trackName: "UI / UX Designer",
      trackEmoji: "🎨",
      trackColor: "#EC4899",
      level: "junior",
      title: "Checkout Cart Abandonment Redesign & Micro-Interactions",
      scenario: "Mobile checkout abandonment reached 68%. User session replays show confusing coupon inputs and surprise shipping fees. Redesign the checkout flow into an intuitive 2-step experience with clear price transparency.",
      tasks: [
        { id: 1, title: "Friction Point Heatmap Analysis", prompt: "Review user session replay findings and pinpoint the 3 primary friction triggers causing cart abandonment.", dimension: "Problem-Solving" },
        { id: 2, title: "Interactive 2-Step Mobile Checkout Wireframing", prompt: "Design high-fidelity Figma components with seamless order summary transitions and inline input validation.", dimension: "Technical Correctness" },
        { id: 3, title: "Design Defense & Usability Metrics", prompt: "Explain how your micro-interactions reduce cognitive load and define target metrics for post-launch validation.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "User Session Replay Notes",
          description: "Summary of 45 user usability testing sessions highlighting confusion points.",
          type: "docs",
          filename: "usability_notes.md",
          content: `• 78% of users tapped coupon code button expecting instant discount before entering card details.
• 52% of users felt alarmed by hidden ₹149 delivery fee revealed only at final OTP screen.`
        }
      ]
    },
    senior: {
      trackCode: "UX",
      trackName: "UI / UX Designer",
      trackEmoji: "🎨",
      trackColor: "#EC4899",
      level: "senior",
      title: "Multi-Platform Enterprise Design System Architecture",
      scenario: "The engineering team supports Web, iOS, and Android with three fragmented UI component libraries. Architect a unified multi-brand design token system with cross-platform synchronization and dark mode support.",
      tasks: [
        { id: 1, title: "Token Hierarchy & Taxonomy Architecture", prompt: "Structure global tokens, semantic tokens, and component-level tokens in JSON format suitable for Style Dictionary compilation.", dimension: "Technical Correctness" },
        { id: 2, title: "Dark Mode & High Contrast Adaptive Palettes", prompt: "Create algorithmic color pairings that automatically maintain 4.5:1 contrast across light, dark, and OLED themes.", dimension: "Problem-Solving" },
        { id: 3, title: "Design System Governance & Developer Handoff", prompt: "Write the contribution guidelines and release governance documentation for 40+ product designers and 120 engineers.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Multi-Brand Design Token Spec",
          description: "W3C Design Token Community Group schema for tokens.",
          type: "code",
          filename: "tokens.json",
          content: `{"color": {"brand": {"primary": {"value": "#4F46E5", "type": "color"}}, "semantic": {"surface": {"value": "{color.brand.primary}", "type": "color"}}}}`
        }
      ]
    }
  },

  PM: {
    fresher: {
      trackCode: "PM",
      trackName: "Product Manager",
      trackEmoji: "🚀",
      trackColor: "#F59E0B",
      level: "fresher",
      title: "1-Click Social Auth: PRD & User Story Criteria",
      scenario: "Signup drop-off is 35% on email registration. Author a comprehensive Product Requirement Document (PRD) for integrating Google and GitHub One-Tap authentication.",
      tasks: [
        { id: 1, title: "User Persona & Problem Framing", prompt: "Define user personas, core pain points, and why social auth directly targets signup abandonment.", dimension: "Problem-Solving" },
        { id: 2, title: "Functional Requirements & Edge Case Criteria", prompt: "Write functional requirements and Gherkin acceptance criteria (Given/When/Then) for email collision edge cases.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit PRD Specification Document", prompt: "Submit your structured PRD including success metrics, rollback criteria, and engineering timeline estimate.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Customer Support Ticket Synthesis",
          description: "Aggregated user complaints regarding password reset friction and registration drop-offs.",
          type: "docs",
          filename: "support_tickets.txt",
          content: `Ticket #1041: "Can't sign in, keep forgetting whether I registered with work email or personal."
Ticket #1092: "Registration password requires 12 characters with symbol, gave up and closed tab."`
        }
      ]
    },
    junior: {
      trackCode: "PM",
      trackName: "Product Manager",
      trackEmoji: "🚀",
      trackColor: "#F59E0B",
      level: "junior",
      title: "Core Engagement KPI Drop & Product Recovery Strategy",
      scenario: "Weekly Active Users (WAU) declined by 18% following the v3.0 navigation overhaul. Conduct an impact analysis, segment unaffected cohorts, and draft a recovery experiment roadmap.",
      tasks: [
        { id: 1, title: "Root Cause Hypothesis & Cohort Triage", prompt: "Synthesize analytics telemetry and user feedback to isolate which navigation changes caused workflow disruption.", dimension: "Problem-Solving" },
        { id: 2, title: "Hypothesis-Driven Experiment Design", prompt: "Design an A/B testing experiment targeting the affected cohort with clear sample size, duration, and guardrail metrics.", dimension: "Technical Correctness" },
        { id: 3, title: "Executive Stakeholder Alignment Brief", prompt: "Present a 1-page executive mitigation memo balancing user retention against long-term roadmap delivery.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Cohort Retention & Feature Telemetry",
          description: "Pre-launch vs post-launch weekly retention curves across power users and casual users.",
          type: "dataset",
          filename: "retention_metrics.csv",
          content: `week,cohort_size,w1_retention,w2_retention,w3_retention
v2.8_baseline,12500,48.2%,39.1%,35.0%
v3.0_launch,13100,38.4%,28.2%,23.1%`
        }
      ]
    },
    senior: {
      trackCode: "PM",
      trackName: "Product Manager",
      trackEmoji: "🚀",
      trackColor: "#F59E0B",
      level: "senior",
      title: "0-to-1 Enterprise B2B SaaS Product & Packaging Strategy",
      scenario: "Leadership has mandated expanding from self-serve developer subscriptions into 6-figure enterprise security contracts. Define the product tiering, SAML/SSO packaging, and competitive positioning.",
      tasks: [
        { id: 1, title: "Enterprise Feature Tiering & Packaging", prompt: "Define the boundary between Pro and Enterprise tiers (SAML SSO, SOC2 compliance reports, RBAC, audit logs).", dimension: "Problem-Solving" },
        { id: 2, title: "Pricing Model & Unit Economics Defense", prompt: "Model seat-based vs usage-based pricing with gross margin calculations and sales commission incentives.", dimension: "Technical Correctness" },
        { id: 3, title: "Board Deck Product Pitch & Go-To-Market Strategy", prompt: "Submit an executive strategy document outlining sales enablement, customer pilot criteria, and year-one ARR projections.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Enterprise RFP Requirement Matrix",
          description: "Requirements from 8 Fortune 500 security reviews including SOC2 and data residency.",
          type: "docs",
          filename: "enterprise_rfp_specs.md",
          content: `Mandatory: SAML 2.0 (Okta/AzureAD), Audit Log Streaming (SIEM), Custom Data Retention (90-365 days).`
        }
      ]
    }
  },

  DEVOPS: {
    fresher: {
      trackCode: "DEVOPS",
      trackName: "DevOps & Cloud Engineer",
      trackEmoji: "⚡",
      trackColor: "#10B981",
      level: "fresher",
      title: "Docker Image Optimization & Multi-Stage CI/CD Pipeline",
      scenario: "The backend microservice Docker image is 1.4GB, causing deployment times on ECS to exceed 8 minutes. Refactor the Dockerfile using Alpine multi-stage builds to achieve under 120MB image size and build a GitHub Actions pipeline.",
      tasks: [
        { id: 1, title: "Container Bloat & Layer Cache Audit", prompt: "Identify layers inflating image size (devDependencies, package cache, build tools) and explain cache invalidation rules.", dimension: "Problem-Solving" },
        { id: 2, title: "Multi-Stage Dockerfile & Healthcheck Implementation", prompt: "Write an optimized multi-stage Dockerfile with non-root security user and native container health checks.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit GitHub Actions Workflow & Build Metrics", prompt: "Provide your CI/CD yaml configuration and report before/after container sizes and deployment duration.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Legacy Dockerfile",
          description: "Unoptimized single-stage Dockerfile currently in production.",
          type: "code",
          filename: "Dockerfile.legacy",
          content: `FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]`
        }
      ]
    },
    junior: {
      trackCode: "DEVOPS",
      trackName: "DevOps & Cloud Engineer",
      trackEmoji: "⚡",
      trackColor: "#10B981",
      level: "junior",
      title: "Kubernetes CrashLoopBackOff & Zero-Downtime Rolling Update",
      scenario: "A staging Kubernetes deployment is stuck in CrashLoopBackOff following an environment variable refactor. Diagnose pod logs, fix container probe configs, and configure a zero-downtime rolling update strategy.",
      tasks: [
        { id: 1, title: "Diagnose K8s Pod Crash & Event Logs", prompt: "Analyze kubectl describe pod logs in Materials. Why is the pod failing health checks before database migrations complete?", dimension: "Problem-Solving" },
        { id: 2, title: "Deployment Manifest & Probe Refactor", prompt: "Correct readinessProbe and livenessProbe timings and specify maxSurge/maxUnavailable rolling update parameters.", dimension: "Technical Correctness" },
        { id: 3, title: "Incident Runbook & Canary Strategy", prompt: "Submit the updated Kubernetes manifest and write a zero-downtime canary deployment runbook.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Kubectl Describe Pod Output",
          description: "Diagnostic output showing readiness probe failure and container exit 137.",
          type: "logs",
          filename: "kubectl_describe.log",
          content: `Events:
  Type     Reason     Age                From               Message
  Normal   Scheduled  4m                 default-scheduler  Successfully assigned default/api-77bfd to node-3
  Warning  Unhealthy  2m (x5 over 3m)    kubelet            Readiness probe failed: HTTP probe failed with statuscode: 503
  Warning  BackOff    45s (x8 over 2m)   kubelet            Back-off restarting failed container`
        }
      ]
    },
    senior: {
      trackCode: "DEVOPS",
      trackName: "DevOps & Cloud Engineer",
      trackEmoji: "⚡",
      trackColor: "#10B981",
      level: "senior",
      title: "Multi-Region Active-Active Disaster Recovery & Terraform Architecture",
      scenario: "An AWS regional outage took down primary services for 4 hours. Design and implement an active-active multi-region infrastructure in us-east-1 and eu-west-1 with Route 53 latency routing and DynamoDB global tables.",
      tasks: [
        { id: 1, title: "Failover Architecture & State Synchronization", prompt: "Architect asynchronous database replication with conflict resolution and Route 53 health check automated DNS failover.", dimension: "Problem-Solving" },
        { id: 2, title: "Modular Terraform Infrastructure as Code", prompt: "Write reusable Terraform modules for VPC peering, secure IAM roles, and multi-region load balancing.", dimension: "Technical Correctness" },
        { id: 3, title: "Disaster Recovery SLA & Chaos Engineering Plan", prompt: "Present your RTO (<2 mins) and RPO (<5 secs) SLA guarantee with simulated Chaos Monkey testing protocols.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Regional Outage Root Cause Telemetry",
          description: "Post-mortem analysis of DNS routing failure during regional connectivity loss.",
          type: "docs",
          filename: "aws_outage_postmortem.md",
          content: `Incident: AWS us-east-1 Transit Gateway failure caused 100% packet loss to primary RDS cluster.`
        }
      ]
    }
  },

  CYBER: {
    fresher: {
      trackCode: "CYBER",
      trackName: "Cybersecurity Specialist",
      trackEmoji: "🛡️",
      trackColor: "#EF4444",
      level: "fresher",
      title: "Web Application Security Vulnerability Audit (OWASP Top 10)",
      scenario: "A security scanner flagged vulnerabilities in the employee portal. Audit the source code for SQL injection, Cross-Site Scripting (XSS), and insecure direct object references (IDOR), and implement sanitization patches.",
      tasks: [
        { id: 1, title: "Vulnerability Identification & Attack Vector Tracing", prompt: "Identify the vulnerable parameters in the controller code and craft the proof-of-concept injection payloads.", dimension: "Problem-Solving" },
        { id: 2, title: "Secure Parameterization & Input Sanitization", prompt: "Rewrite the database query using parameterized prepared statements and implement CSP header policies.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Security Remediation Report", prompt: "Provide a CVSS 3.1 severity rating for each finding and document remediation guidance for developers.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Vulnerable Controller Code",
          description: "Node.js express handler with raw string concatenation in SQL queries.",
          type: "code",
          filename: "UserController.js",
          content: `app.get('/api/users/search', (req, res) => {
  const query = "SELECT id, username, email FROM users WHERE username LIKE '%" + req.query.name + "%'";
  db.query(query, (err, rows) => res.json(rows));
});`
        }
      ]
    },
    junior: {
      trackCode: "CYBER",
      trackName: "Cybersecurity Specialist",
      trackEmoji: "🛡️",
      trackColor: "#EF4444",
      level: "junior",
      title: "Incident Response: Compromised AWS Access Key & Data Exfiltration",
      scenario: "SIEM alerts detected unauthorized API calls from an unknown IP address downloading customer S3 backups. An engineer inadvertently committed AWS access keys into a public git repository. Contain the incident and harden IAM credentials.",
      tasks: [
        { id: 1, title: "CloudTrail Forensic Log Analysis", prompt: "Analyze CloudTrail JSON events in Materials. Identify the exfiltrated S3 objects, the attacker IP, and timeline.", dimension: "Problem-Solving" },
        { id: 2, title: "Credential Revocation & IAM Lockdown", prompt: "Detail the immediate containment actions (deactivating access key, attaching explicit Deny policies, rotating secrets).", dimension: "Technical Correctness" },
        { id: 3, title: "Incident Response Postmortem & Regulatory Filing", prompt: "Draft the incident postmortem and determine GDPR/CCPA customer disclosure notice requirements.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "CloudTrail Security Event Log",
          description: "SIEM telemetry showing PutObject and GetObject calls from unauthorized foreign IP.",
          type: "logs",
          filename: "cloudtrail_alert.json",
          content: `{"eventTime": "2026-09-12T04:18:22Z", "eventName": "GetObject", "sourceIPAddress": "194.26.29.11", "requestParameters": {"bucketName": "enterprise-backups-prod", "key": "users_2026_q3.sql.gz"}}`
        }
      ]
    },
    senior: {
      trackCode: "CYBER",
      trackName: "Cybersecurity Specialist",
      trackEmoji: "🛡️",
      trackColor: "#EF4444",
      level: "senior",
      title: "Zero Trust Architecture & Enterprise IAM Hardening",
      scenario: "Engineering teams currently access production workloads via static VPN passwords. Design a Zero Trust network access (ZTNA) model featuring mutual TLS (mTLS), device posture checks, and role-based privilege access management (PAM).",
      tasks: [
        { id: 1, title: "ZTNA Network Topology & Micro-Segmentation", prompt: "Design micro-segmentation boundaries ensuring compromised developer laptops cannot reach production database clusters.", dimension: "Problem-Solving" },
        { id: 2, title: "mTLS & Ephemeral Certificate Authority Design", prompt: "Implement automated certificate issuance (e.g. SPIFFE/SPIRE or HashiCorp Vault) with 12-hour expiration.", dimension: "Technical Correctness" },
        { id: 3, title: "CISO Security Strategy Defense", prompt: "Present a comprehensive Zero Trust transition roadmap defending friction vs security trade-offs to the C-suite.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Current Network Topology",
          description: "Flat corporate network diagram vulnerable to lateral movement attacks.",
          type: "docs",
          filename: "network_audit.md",
          content: `Audit finding: Flat 10.0.0.0/16 subnet allows direct TCP connection from VPN pool to production RDS port 5432.`
        }
      ]
    }
  },

  AI: {
    fresher: {
      trackCode: "AI",
      trackName: "AI / ML Engineer",
      trackEmoji: "🤖",
      trackColor: "#8B5CF6",
      level: "fresher",
      title: "Sentiment Analysis & Data Pipeline Preprocessing",
      scenario: "Train a production text classification model to automatically categorize user feedback tickets into Positive, Neutral, or Urgent/Negative categories. Clean raw unstructured text, tokenize, and train a baseline classifier.",
      tasks: [
        { id: 1, title: "Text Preprocessing & Imbalanced Class Handling", prompt: "Process raw customer feedback text (stopword removal, lemmatization) and address 5:1 class imbalance.", dimension: "Problem-Solving" },
        { id: 2, title: "Model Training & Evaluation Metrics", prompt: "Train a scikit-learn/PyTorch classification pipeline. Report precision, recall, and Macro F1-score across all 3 classes.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Model Pipeline & Inference Script", prompt: "Provide your public code repository with an inference function accepting raw strings and returning classification probabilities.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Customer Feedback Dataset (10,000 records)",
          description: "Raw review texts with initial human quality ratings.",
          type: "dataset",
          filename: "feedback_dataset.csv",
          content: `review_id,text,label
r_01,"Platform crashed in middle of checkout, lost my items!",Urgent_Negative
r_02,"Smooth interface and fast responses, really enjoy using this.",Positive
r_03,"Button color looks a bit dark on mobile.",Neutral`
        }
      ]
    },
    junior: {
      trackCode: "AI",
      trackName: "AI / ML Engineer",
      trackEmoji: "🤖",
      trackColor: "#8B5CF6",
      level: "junior",
      title: "RAG Pipeline Optimization: Chunking & Vector Search Drift",
      scenario: "The internal AI support assistant is hallucinating answers due to poor vector chunk retrieval. Re-architect the Retrieval Augmented Generation (RAG) pipeline with semantic chunking, reciprocal rank fusion (RRF), and cross-encoder reranking.",
      tasks: [
        { id: 1, title: "Diagnose Retrieval Precision & Hallucination Roots", prompt: "Evaluate why standard 512-token fixed chunking severed table dependencies and caused hallucinated answers.", dimension: "Problem-Solving" },
        { id: 2, title: "Implement Semantic Chunking & Cross-Encoder Re-Ranking", prompt: "Code a hybrid search retriever combining BM25 keyword matching with vector cosine similarity and re-ranking.", dimension: "Technical Correctness" },
        { id: 3, title: "RAG Triad Benchmark & Evaluation Report", prompt: "Benchmark Context Relevance, Groundedness, and Answer Relevance scores before and after optimization.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Hallucination Benchmark Cases",
          description: "50 real enterprise queries with ground truth documentation references.",
          type: "docs",
          filename: "rag_eval_cases.json",
          content: `[{"query": "What is maximum refund limit for tier 2 enterprise?", "ground_truth": "$5,000", "hallucinated_answer": "Unlimited based on general SLA"}]`
        }
      ]
    },
    senior: {
      trackCode: "AI",
      trackName: "AI / ML Engineer",
      trackEmoji: "🤖",
      trackColor: "#8B5CF6",
      level: "senior",
      title: "LLM Fine-Tuning & Quantization for High-Throughput Inference",
      scenario: "Fine-tune a 7B parameter open-weight model on proprietary domain documentation using QLoRA. Quantize the model using 4-bit AWQ to run on cost-effective GPUs with Time-To-First-Token (TTFT) under 35ms.",
      tasks: [
        { id: 1, title: "Supervised Fine-Tuning (SFT) & LoRA Rank Selection", prompt: "Configure LoRA rank (r=16, alpha=32) and target modules (q_proj, v_proj). Explain loss convergence monitoring.", dimension: "Problem-Solving" },
        { id: 2, title: "4-bit AWQ Quantization & vLLM Serving", prompt: "Quantize the model weights with zero perplexity degradation and configure vLLM continuous batching parameters.", dimension: "Technical Correctness" },
        { id: 3, title: "Cost & Throughput Engineering Defense", prompt: "Present an infrastructure cost comparison between proprietary OpenAI API tokens vs self-hosted quantized model clusters.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "GPU Training Loss Curves & Telemetry",
          description: "Weights & Biases training metrics showing learning rate schedule and validation loss.",
          type: "logs",
          filename: "wandb_training.log",
          content: `Step 500: train_loss=1.24, val_loss=1.31, perplexity=3.71, vram_usage=14.2GB/24.0GB`
        }
      ]
    }
  },

  SALES: {
    fresher: {
      trackCode: "SALES",
      trackName: "Technical Sales & Solutions",
      trackEmoji: "💼",
      trackColor: "#14B8A6",
      level: "fresher",
      title: "Inbound Lead Qualification & BANT Discovery Call Script",
      scenario: "Evaluate 10 inbound enterprise prospect inquiries for an AI automated testing tool. Apply the BANT (Budget, Authority, Need, Timeline) framework and author tailored discovery scripts.",
      tasks: [
        { id: 1, title: "Inbound Inquiry BANT Qualification", prompt: "Analyze inbound leads in Materials. Classify which 3 leads meet high-priority ICP qualification and explain disqualifications.", dimension: "Problem-Solving" },
        { id: 2, title: "Discovery Call Agenda & Strategic Questions", prompt: "Write a high-converting 30-minute discovery call agenda with open-ended business impact questions.", dimension: "Technical Correctness" },
        { id: 3, title: "Submit Lead Qualification Memo", prompt: "Provide your CRM opportunity notes with next steps for the account executive.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Inbound Lead Inquiries",
          description: "Form submissions with company size, role, and stated challenges.",
          type: "dataset",
          filename: "inbound_leads.csv",
          content: `lead_id,company,employee_count,title,challenge_description,timeline
L_101,FinTech Global,1400,VP Engineering,"Manual QA taking 3 days per release, delaying compliance.",Immediate (<30 days)
L_102,College Student,1,Student,"Looking for free student tier.",None`
        }
      ]
    },
    junior: {
      trackCode: "SALES",
      trackName: "Technical Sales & Solutions",
      trackEmoji: "💼",
      trackColor: "#14B8A6",
      level: "junior",
      title: "Enterprise Solution Demo & Competitive Objection Handling",
      scenario: "During a commercial demo with a prospective customer's Head of Engineering, they push back stating: 'Your competitor offers a 30% lower price point and includes unlimited seats.' Defend your platform's unit economics and value proposition.",
      tasks: [
        { id: 1, title: "Total Cost of Ownership (TCO) Teardown", prompt: "Calculate real TCO comparing our managed infrastructure vs competitor's self-hosted maintenance overhead.", dimension: "Problem-Solving" },
        { id: 2, title: "Live Objection Handling & Value Scripting", prompt: "Write your exact verbal talk-track addressing the price pushback while pivoting to mission-critical ROI.", dimension: "Technical Correctness" },
        { id: 3, title: "Commercial Proposal & Contract Terms", prompt: "Draft a multi-year commercial proposal offering tiered volume discounts while protecting gross margins.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Competitor Analysis & Feature Matrix",
          description: "Side-by-side comparison of feature limitations, SLA guarantees, and hidden add-on costs.",
          type: "docs",
          filename: "competitor_battlecard.md",
          content: `Competitor X:
- Lower headline sticker price ($15/seat vs $25/seat)
- Hidden charges: Requires separate dedicated database server ($800/mo) and charges $0.05/API call beyond 10k calls.`
        }
      ]
    },
    senior: {
      trackCode: "SALES",
      trackName: "Technical Sales & Solutions",
      trackEmoji: "💼",
      trackColor: "#14B8A6",
      level: "senior",
      title: "Multi-Stakeholder 8-Figure Enterprise RFP & C-Suite Defense",
      scenario: "Lead the executive defense for a multi-million-dollar enterprise master services agreement (MSA). You must satisfy CISO security requirements, justify ROI to the CFO, and negotiate terms with Procurement.",
      tasks: [
        { id: 1, title: "Multi-Stakeholder Alignment Strategy", prompt: "Map champion, economic buyer, technical validator, and blocker personas. How will you preempt procurement pushback?", dimension: "Problem-Solving" },
        { id: 2, title: "ROI Financial Justification Model", prompt: "Construct an NPV (Net Present Value) model demonstrating $2.8M operational savings over 36 months.", dimension: "Technical Correctness" },
        { id: 3, title: "C-Suite Presentation & Final Close Strategy", prompt: "Deliver the closing executive pitch summarizing contractual warranties, SLAs, and partnership commitments.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Enterprise RFP Requirements Questionnaire",
          description: "120-item procurement questionnaire covering SOC2 Type II, 99.99% SLA penalties, and indemnity caps.",
          type: "docs",
          filename: "enterprise_rfp.pdf",
          content: `Section 4.2: Vendor must provide unlimited liability indemnity for data breaches.
Section 6.1: Service credits of 25% monthly billing for any downtime exceeding 4.3 minutes/month.`
        }
      ]
    }
  },

  DM: {
    fresher: {
      trackCode: "DM",
      trackName: "Digital Marketing",
      trackEmoji: "📢",
      trackColor: "#F59E0B",
      level: "fresher",
      title: "Meta Ads Audience Targeting & High-Converting Copy",
      scenario: "You are launching an omnichannel campaign for a new enterprise developer tool. Design 3 high-converting creative angles, define lookalike audience segments, and calculate expected return on ad spend (ROAS).",
      tasks: [
        { id: 1, title: "Audience Segmentation & Lookalike Modeling", prompt: "Define top-of-funnel (TOFU) interest clusters and 1% vs 3% lookalike custom audiences.", dimension: "Problem-Solving" },
        { id: 2, title: "Ad Creative Matrix & Value Proposition Copy", prompt: "Write 3 distinct value proposition ad angles (Fear of Missing Out, Productivity Gain, Cost Savings).", dimension: "Technical Correctness" },
        { id: 3, title: "ROAS & Attribution Modeling Strategy", prompt: "Construct an attribution model calculating target Customer Acquisition Cost (CAC) under $45.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Audience Demographics & Performance Data",
          description: "Past campaign CTRs, CPCs, and conversion metrics across developer segments.",
          type: "dataset",
          filename: "ad_performance_q3.csv",
          content: `campaign_id,audience_segment,ctr_pct,cpc_usd,cvr_pct
c_01,React_Node_Devs,2.84,1.42,3.10
c_02,Engineering_Managers,1.92,3.85,5.40
c_03,DevOps_Cloud_Engineers,3.15,2.10,4.25`
        }
      ]
    },
    junior: {
      trackCode: "DM",
      trackName: "Digital Marketing",
      trackEmoji: "📢",
      trackColor: "#F59E0B",
      level: "junior",
      title: "Search Intent Keyword Matrix & Technical SEO Audit",
      scenario: "Organic organic traffic for core high-intent landing pages dropped 28% following a major framework release. Conduct a technical SEO crawl audit, optimize Core Web Vitals, and build a keyword topic cluster.",
      tasks: [
        { id: 1, title: "Crawl Error & Indexation Audit", prompt: "Identify canonicalization loops, 404 broken redirects, and schema markup errors from the crawl log.", dimension: "Problem-Solving" },
        { id: 2, title: "Keyword Clustering & Search Intent Mapping", prompt: "Group 50 high-intent transactional search terms into pillar and cluster content architecture.", dimension: "Technical Correctness" },
        { id: 3, title: "Organic Recovery Roadmap & Core Web Vitals", prompt: "Formulate an engineering action plan to reduce Largest Contentful Paint (LCP) under 2.2s.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Screaming Frog SEO Crawl Extract",
          description: "URL indexability, response codes, meta tags, and canonical issues.",
          type: "logs",
          filename: "crawl_diagnostics.txt",
          content: `URL: /features/cloud-sandbox -> Status: 301 -> Target: /sandbox (Canonical: /features/cloud-sandbox [Loop Detected])
LCP: 3.8s (Failing threshold > 2.5s)
Missing: Structured Data JSON-LD SoftwareApplication schema`
        }
      ]
    },
    senior: {
      trackCode: "DM",
      trackName: "Digital Marketing",
      trackEmoji: "📢",
      trackColor: "#F59E0B",
      level: "senior",
      title: "Omnichannel Growth Playbook & ₹5M Budget Reallocation",
      scenario: "You are the VP of Growth managing a ₹5M monthly acquisition budget across Paid Search, Paid Social, Lifecycle Marketing, and DevRel Sponsorships. Reallocate capital to reduce Blended CAC by 35% without shrinking pipeline volume.",
      tasks: [
        { id: 1, title: "Multi-Touch Attribution & Channel Efficiency Analysis", prompt: "Compare first-touch, last-touch, and linear attribution weights across existing campaigns.", dimension: "Problem-Solving" },
        { id: 2, title: "Dynamic Budget Reallocation Strategy", prompt: "Reallocate budget from diminishing return channels to high-intent product-led growth loops.", dimension: "Technical Correctness" },
        { id: 3, title: "Board Executive Strategy Presentation", prompt: "Draft executive slides defending payback period reduction from 14 months to 8 months.", dimension: "Communication" }
      ],
      materials: [
        {
          title: "Channel Unit Economics Breakdown",
          description: "Customer acquisition costs, payback months, and lifetime value across 5 paid channels.",
          type: "dataset",
          filename: "marketing_pnl.csv",
          content: `channel,monthly_spend_inr,leads_generated,deals_closed,cac_inr,payback_months
Google_Search,2000000,1200,85,23529,9.2
LinkedIn_B2B,1500000,320,28,53571,18.4
YouTube_Tech_Sponsorships,800000,650,42,19047,7.5
Lifecycle_Email_Automation,700000,1800,110,6363,2.4`
        }
      ]
    }
  }
};

export function getSimulationConfig(trackCode: string, level: "fresher" | "junior" | "senior"): SimulationConfig {
  let normalizedTrack = (trackCode || "SD").toUpperCase().trim();
  const normalizedLevel = (level || "junior").toLowerCase() as "fresher" | "junior" | "senior";

  // Resolve track aliases
  if (normalizedTrack === "CS") normalizedTrack = "CYBER";
  if (normalizedTrack === "SA") normalizedTrack = "SALES";
  if (normalizedTrack === "DO") normalizedTrack = "DEVOPS";
  if (normalizedTrack === "SWE") normalizedTrack = "SD";
  if (normalizedTrack === "MARKETING") normalizedTrack = "DM";

  if (SIMULATIONS_DATA[normalizedTrack] && SIMULATIONS_DATA[normalizedTrack][normalizedLevel]) {
    return SIMULATIONS_DATA[normalizedTrack][normalizedLevel];
  }

  if (SIMULATIONS_DATA[normalizedTrack] && SIMULATIONS_DATA[normalizedTrack]["junior"]) {
    return SIMULATIONS_DATA[normalizedTrack]["junior"];
  }

  return SIMULATIONS_DATA.SD.junior;
}
