/**
 * SkillForge AI — Software Developer (SD) Simulation Packages
 * Tracks: Fresher, Junior (Flagship Demo), Senior
 */

import { SimulationDefinition } from "@/types/simulation";

export const SD_FRESHER_SIMULATION: SimulationDefinition = {
  id: "SIM-SD-FRE-001",
  version: "1.0.0",
  careerCode: "SD",
  level: "fresher",
  title: "API Payload Validation Bug & Unit Test Coverage",
  status: "active",
  roleContext: {
    roleTitle: "Associate Software Engineer",
    team: "Core Identity & Authentication Services",
    companyContext: "FinTech Scale-up handling 250,000 active daily user logins.",
    reportingTo: "Senior Staff Engineer (API Platform)",
  },
  scenario:
    "A newly deployed customer registration endpoint is returning HTTP 500 Internal Server Errors instead of HTTP 400 Bad Request when users submit invalid inputs. Production telemetry reports that optional phone numbers cause NullPointerExceptions, and users with valid enterprise emails containing uppercase letters or subdomains are being rejected. Leadership has blocked the mobile client launch until this is resolved.",
  businessContext:
    "Over 1,200 prospective enterprise users were blocked from onboarding during yesterday's campaign. Error rates spiked to 4.8% on auth endpoints. If unresolved within 4 hours, executive leadership will halt the Q3 marketing spend.",
  objective:
    "Diagnose the null pointer and regex flaws in the registration validator, implement defensive null-safety guards, add 6 comprehensive unit tests covering boundary conditions, and prepare an engineering pull request.",
  estimatedMinutes: 45,
  difficulty: "Beginner",
  prerequisites: ["TypeScript / JavaScript basics", "Unit testing fundamentals (Jest/Mocha)", "HTTP status codes"],
  learningOutcomes: [
    "Defensive programming and null-safety patterns",
    "Comprehensive boundary unit testing",
    "Clean code PR communication for peer review",
  ],
  skills: ["TypeScript", "Unit Testing", "Defensive Programming", "API Validation", "Git Workflow"],
  materials: [
    {
      id: "mat-sd-fre-1",
      title: "Production Error Stack Trace",
      type: "logs",
      description: "Server logs captured from the staging API cluster upon invalid payload submission.",
      filename: "server.error.log",
      relevance: "Used in Task 1 to diagnose the exact line throwing NullPointerException and regex failure.",
      content: `[ERROR] 10:14:22.411 [http-nio-8080-exec-4] ERROR c.s.api.UserController - Unhandled exception
java.lang.NullPointerException: Cannot invoke "String.trim()" because "dto.phoneNumber" is null
    at com.skillforge.api.validator.UserValidator.validate(UserValidator.java:38)
    at com.skillforge.api.controller.UserController.register(UserController.java:72)
[WARN] 10:14:22.412 [http-nio-8080-exec-4] WARN c.s.api.HttpLogger - POST /api/v1/auth/register -> 500 Internal Server Error (Duration: 28ms)
[DEBUG] Payload: {"email":"Arjun.Sharma@Enterprise.ACME.COM","displayName":"Arjun Sharma"} (phoneNumber omitted)`,
    },
    {
      id: "mat-sd-fre-2",
      title: "Vulnerable UserValidator Source Code",
      type: "code",
      description: "Current production validator implementation in src/validator/UserValidator.ts.",
      filename: "UserValidator.ts",
      relevance: "Used in Task 2 to refactor and implement the defensive patch.",
      content: `export interface UserRegistrationDTO {
  email: string;
  phoneNumber?: string | null;
  displayName: string;
}

export function validateUserProfile(dto: UserRegistrationDTO): boolean {
  // Bug 1: Throws NPE if phoneNumber is null or omitted
  if (dto.phoneNumber.trim().length < 10) {
    throw new Error("Invalid phone number");
  }

  // Bug 2: Case-sensitive regex fails valid uppercase addresses
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/;
  if (!emailRegex.test(dto.email)) {
    throw new Error("Invalid email address format");
  }

  if (!dto.displayName || dto.displayName.trim().length === 0) {
    throw new Error("Display name is required");
  }

  return true;
}`,
    },
    {
      id: "mat-sd-fre-3",
      title: "Unit Test Suite Contract",
      type: "docs",
      description: "Jest test contract specification defining required test cases.",
      filename: "UserValidator.test.ts",
      relevance: "Used in Task 2 and Task 3 to verify test assertions.",
      content: `describe('UserValidator Contract', () => {
  it('should accept valid registration with optional null phoneNumber', () => {});
  it('should accept valid email with uppercase letters and subdomains', () => {});
  it('should reject malformed email addresses', () => {});
  it('should reject phone numbers shorter than 10 digits when provided', () => {});
  it('should reject empty or whitespace-only display names', () => {});
  it('should return boolean true on completely valid payload', () => {});
});`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Trace the Null Pointer & Case-Sensitivity Flaws",
      type: "investigation",
      dimension: "Problem-Solving",
      objective: "Identify the exact root causes of the 500 error from production stack traces.",
      context: "Inspect the provided server error logs and UserValidator.ts code.",
      prompt:
        "Review server.error.log and UserValidator.ts in Materials. Explain:\n1. Why does calling .trim() on dto.phoneNumber crash the runtime when optional fields are omitted?\n2. Why does the current emailRegex reject 'Arjun.Sharma@Enterprise.ACME.COM'?\n3. What HTTP status code should the controller return when validation errors occur?",
      constraints: ["Do not propose removing the phone number check entirely; it must validate length when present."],
      expectedOutput: "A concise 3-point diagnostic analysis detailing the null check flaw and case flag omission.",
      acceptanceCriteria: [
        "Identifies that dto.phoneNumber is optional and undefined/null access triggers runtime exception",
        "Notes that regex lacks the case-insensitive '/i' flag and rejects valid uppercase domains",
        "Specifies HTTP 400 Bad Request as the correct contract for client validation failures",
      ],
      skills: ["Root Cause Analysis", "TypeScript", "HTTP Protocol"],
      evidenceRequired: ["Exact lines causing bugs in UserValidator.ts", "Explanation of regex case sensitivity"],
      validationRules: [
        {
          id: "sd-fre-t1-rule1",
          description: "Identify undefined/null access on phoneNumber",
          type: "code_static",
          expectedSnippet: "phoneNumber",
        },
        {
          id: "sd-fre-t1-rule2",
          description: "Note case sensitivity flag",
          type: "code_static",
          expectedSnippet: "case",
        },
      ],
      rubricWeight: 30,
      hints: ["Check if optional chaining '?.' or existence guard 'dto.phoneNumber &&' would prevent the crash."],
      timeEstimateMins: 12,
    },
    {
      id: 2,
      title: "Implement Defensive Validator Patch & Test Cases",
      type: "implementation",
      dimension: "Technical Correctness",
      objective: "Write the corrected validateUserProfile function with full boundary safety.",
      context: "Apply defensive coding practices in TypeScript.",
      prompt:
        "Provide your patched validateUserProfile implementation. Ensure:\n1. Optional or null phoneNumber does not trigger an error, but if provided, must be >= 10 chars.\n2. Email regex uses the case-insensitive flag '/i'.\n3. Empty or whitespace-only display names throw descriptive errors.\n4. Write out the 6 Jest test assertions you would execute.",
      constraints: ["Must remain backward-compatible with the UserRegistrationDTO interface."],
      expectedOutput: "Patched TypeScript code block accompanied by 6 unit test assertions.",
      acceptanceCriteria: [
        "Guards dto.phoneNumber with existence check before invoking .trim()",
        "Updates email regex to /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/i",
        "Includes tests for null phone, valid phone, uppercase email, invalid email, empty name, valid payload",
      ],
      skills: ["TypeScript", "Unit Testing", "Regex"],
      evidenceRequired: ["Patched validator source code", "Jest assertion list"],
      validationRules: [
        {
          id: "sd-fre-t2-rule1",
          description: "Safe phone check",
          type: "code_static",
          expectedSnippet: "phoneNumber",
        },
        {
          id: "sd-fre-t2-rule2",
          description: "Case-insensitive email regex",
          type: "code_static",
          expectedSnippet: "/i",
        },
      ],
      rubricWeight: 45,
      hints: ["Use `dto.phoneNumber && dto.phoneNumber.trim().length < 10` or optional chaining."],
      timeEstimateMins: 20,
    },
    {
      id: 3,
      title: "Pull Request Summary & Staging Verification",
      type: "communication",
      dimension: "Communication",
      objective: "Draft an engineering pull request description for peer review.",
      context: "Communicate technical changes clearly to team lead and QA.",
      prompt:
        "Write a clean Pull Request description including:\n1. Summary of Bug Fixes (NPE & case sensitivity).\n2. Testing Performed (unit tests passed, test coverage).\n3. Risk Assessment & Verification Plan for Staging.",
      constraints: ["Keep language concise, professional, and formatted in Markdown."],
      expectedOutput: "Markdown formatted PR description with summary, testing, and rollout notes.",
      acceptanceCriteria: [
        "Covers both bug fixes accurately",
        "Lists test coverage details",
        "Includes clear QA verification steps for staging deployment",
      ],
      skills: ["Technical Writing", "Git Workflow", "Code Review"],
      evidenceRequired: ["PR Markdown summary"],
      validationRules: [
        {
          id: "sd-fre-t3-rule1",
          description: "Structured PR headings",
          type: "document_structure",
          requiredSections: ["Summary", "Testing", "Risk"],
          minWordCount: 40,
        },
      ],
      rubricWeight: 25,
      hints: ["Structure the PR with headers: ## Summary of Changes, ## Testing, ## Rollout."],
      timeEstimateMins: 13,
    },
  ],
  deliverable: {
    type: "Public GitHub Repository URL + Architecture Write-up",
    description: "Provide the link to your repository containing the patched code and write-up.",
    fields: [
      { name: "repoUrl", label: "GitHub Repository URL", type: "url", placeholder: "https://github.com/username/user-validator-patch", required: true, helpText: "Repository must contain the patched UserValidator.ts and unit tests." },
      { name: "notes", label: "PR Description & Verification Notes", type: "text", placeholder: "Document your PR summary and test output...", required: true, helpText: "Describe the changes and testing performed." },
    ],
    validationRules: [
      { id: "deliv-sd-fre-1", description: "GitHub URL format", type: "code_static", expectedSnippet: "github.com" },
    ],
  },
  rubric: [
    { id: "technical_correctness", name: "Technical Correctness", weight: 35, description: "Accuracy of defensive null guards and regex syntax.", criteria: ["Zero unhandled exceptions on null/undefined input", "Case-insensitive email regex", "Exact HTTP status compliance"] },
    { id: "code_quality", name: "Code Quality & Testing", weight: 30, description: "Test coverage rigor and clean TypeScript syntax.", criteria: ["6 boundary tests implemented", "Clear naming conventions", "Clean error messages"] },
    { id: "problem_solving", name: "Problem-Solving", weight: 20, description: "Speed and depth of root cause diagnosis from stack traces.", criteria: ["Correct identification of NPE line", "Sound understanding of JavaScript falsy evaluation"] },
    { id: "communication", name: "Engineering Communication", weight: 15, description: "Clarity of PR description and technical documentation.", criteria: ["Structured Markdown PR", "Clear risk assessment"] },
  ],
  hints: [
    "Remember that in JavaScript, null is an object, so `typeof null === 'object'`. Checking `dto.phoneNumber && ...` is clean and idiomatic.",
  ],
  progression: {
    onSuccess: {
      recommendedTrack: "SD",
      recommendedLevel: "junior",
      rationale: "Candidate mastered basic API validation and unit testing. Advance to Junior: Production Incident & Streaming Memory Leaks.",
    },
    onRemediation: {
      recommendedTrack: "SD",
      recommendedLevel: "fresher",
      targetSkill: "Defensive Programming",
      rationale: "Reinforce boundary testing and null-safety patterns before progressing to concurrency.",
    },
  },
};

export const SD_JUNIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-SD-JUN-001",
  version: "1.0.0",
  careerCode: "SD",
  level: "junior",
  title: "Production Incident: Chunked Stream Handler & OOM Fix",
  status: "active",
  roleContext: {
    roleTitle: "Backend Software Engineer",
    team: "Core Storage & Ingestion Platform",
    companyContext: "Enterprise document SaaS processing 10TB of contracts and media daily.",
    reportingTo: "Engineering Manager (Platform Reliability)",
  },
  scenario:
    "The core document processing service is crashing in production with OutOfMemoryError (OOM) whenever enterprise clients upload files larger than 50MB. Telemetry indicates the current handler buffers entire files in heap memory as byte[] arrays before piping to cloud storage. An enterprise client demo is scheduled in 60 minutes, and the engineering director has demanded an immediate root cause triage, a reactive chunked streaming fix with backpressure, and a reasoned deployment recommendation.",
  businessContext:
    "Service SLA availability has degraded to 98.2% across three Kubernetes worker pods. If unresolved before the enterprise demo, a ₹45,000,000 ARR contract renewal will be compromised.",
  objective:
    "Diagnose the JVM heap exhaustion root cause from worker stderr logs, refactor the upload handler from in-memory buffering to reactive streaming backpressure, evaluate hotfix vs rollback deployment risks, and submit your code with an engineering post-mortem.",
  estimatedMinutes: 60,
  difficulty: "Intermediate",
  prerequisites: ["Node.js / TypeScript Streams", "Memory Profiling & Garbage Collection", "Asynchronous Error Handling"],
  learningOutcomes: [
    "Reactive streaming architecture and backpressure management",
    "JVM heap dump and garbage collection log analysis",
    "Production trade-off analysis under high-severity incident pressure",
    "Blameless engineering post-mortem authoring",
  ],
  skills: ["Node.js Streams", "Backpressure", "Memory Profiling", "System Reliability", "Production Triage"],
  materials: [
    {
      id: "mat-sd-jun-1",
      title: "ECS Worker JVM OutOfMemoryError Logs",
      type: "logs",
      description: "Stderr telemetry captured from worker node ecs-worker-18 during upload spike.",
      filename: "ecs-worker-18.stderr",
      relevance: "Used in Task 1 to diagnose heap saturation, GC pause durations, and thread pool exhaustion.",
      content: `[FATAL] 14:23:07.104 [pool-3-thread-18] FATAL c.s.storage.FileUploadHandler - OutOfMemoryError: Java heap space
  at FileUploadHandler.processBuffer(FileUploadHandler.java:142)
  at FileUploadHandler.handleUpload(FileUploadHandler.java:89)
Heap allocation: 2048MB / 2048MB (100.0% consumed)
Active GC pauses: 14.8s (Stop-The-World triggered)
Uncollected byte[] buffer instances: 42 (aggregate 1.94 GB allocated)
Pod healthcheck failed: GET /healthz timed out after 5000ms
Kubernetes Event: pod/storage-worker-7df94-xk29p terminated with exit code 137 (OOMKilled)`,
    },
    {
      id: "mat-sd-jun-2",
      title: "Vulnerable FileUploadHandler Source Code",
      type: "code",
      description: "The existing in-memory buffering implementation in src/handlers/FileUploadHandler.ts.",
      filename: "FileUploadHandler.ts",
      relevance: "Used in Task 2 to refactor to streaming chunk pipeline with backpressure.",
      content: `import { IncomingMessage, ServerResponse } from "http";

export class FileUploadHandler {
  // Vulnerability: Reads entire incoming payload into heap memory buffer
  async handleUpload(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk); // Unbounded heap growth: 50MB file * 40 concurrent users = 2GB OOM crash!
    });

    req.on("end", async () => {
      const fullBuffer = Buffer.concat(chunks);
      await this.saveToStorage(fullBuffer);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success", bytesReceived: fullBuffer.length }));
    });

    req.on("error", (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });
  }

  private async saveToStorage(buffer: Buffer): Promise<void> {
    // Simulated cloud storage write
  }
}`,
    },
    {
      id: "mat-sd-jun-3",
      title: "Storage Service API Specification",
      type: "docs",
      description: "Target cloud storage ingestion protocol contract.",
      filename: "StorageServiceSpec.md",
      relevance: "Used in Task 2 to construct the streaming pipeline complying with backpressure limits.",
      content: `## Ingestion API Spec
- Maximum allowed buffer size per chunk: 64 KB (65,536 bytes)
- Stream contract: Target writable stream must signal backpressure via drain event when highWaterMark is reached
- Error contract: Abort signal must destroy source stream to prevent lingering file descriptors
- Return contract: HTTP 200 with JSON { status: "acknowledged", bytesWritten: number }`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Analyze Heap Dump & Memory Logs",
      type: "investigation",
      dimension: "Problem-Solving",
      objective: "Pinpoint the root cause of the heap exhaustion from production logs.",
      context: "Investigate the memory metrics in ecs-worker-18.stderr.",
      prompt:
        "Inspect the stderr log in Materials. Answer:\n1. Why did the worker experience a 14.8-second Stop-The-World GC pause?\n2. Why does increasing the pod heap limit from 2GB to 4GB fail to permanently resolve this architectural flaw?\n3. Calculate the maximum number of concurrent 50MB uploads the existing 2GB worker could theoretically sustain before crashing.",
      constraints: ["Cite exact metrics from the log file (heap allocation, exit code 137, buffer instances)."],
      expectedOutput: "A structured diagnostic summary answering the 3 questions with specific mathematical reasoning.",
      acceptanceCriteria: [
        "Explains that full-heap buffer accumulation triggered catastrophic GC thrashing and exit code 137 (OOMKilled)",
        "Notes that linear memory scaling is unsustainable under concurrent traffic spikes",
        "Calculates that ~40 concurrent 50MB uploads consume 2000MB, leaving 0MB for runtime objects",
      ],
      skills: ["Memory Profiling", "Root Cause Analysis", "Garbage Collection"],
      evidenceRequired: ["Exact calculation of buffer saturation", "Reference to GC pause duration"],
      validationRules: [
        {
          id: "sd-jun-t1-rule1",
          description: "Identify OOM and heap saturation",
          type: "code_static",
          expectedSnippet: "heap",
        },
        {
          id: "sd-jun-t1-rule2",
          description: "Address concurrency limitations",
          type: "code_static",
          expectedSnippet: "concurrent",
        },
      ],
      rubricWeight: 25,
      hints: ["Look at the line: 'Uncollected byte[] buffer instances: 42 (aggregate 1.94 GB allocated)'."],
      timeEstimateMins: 15,
    },
    {
      id: 2,
      title: "Architect Chunked Stream Handler with Backpressure",
      type: "implementation",
      dimension: "Technical Correctness",
      objective: "Refactor FileUploadHandler into a reactive stream pipeline obeying 64KB chunk boundaries.",
      context: "Use Node.js stream piping or async iterator with backpressure handling.",
      prompt:
        "Refactor FileUploadHandler to eliminate the in-memory chunks array. Requirements:\n1. Use Node.js streaming (stream.pipeline, Transform stream, or write/drain backpressure loop).\n2. Enforce 64KB maximum in-flight chunk buffer.\n3. Handle network dropouts by calling req.destroy() on socket failure.\n4. Return HTTP 200 with { status: 'acknowledged', bytesWritten: number }.\n5. Run the live sandbox validator to verify your solution passes all checks.",
      constraints: ["Do NOT accumulate chunks in an array. Heap allocation must remain flat (< 10MB) regardless of file size."],
      expectedOutput: "Complete, production-ready TypeScript code for FileUploadHandler.",
      acceptanceCriteria: [
        "Eliminates Buffer.concat and chunks array completely",
        "Applies stream backpressure or stream.pipeline",
        "Includes error destruction and cleanup of partial streams",
        "Passes in-browser sandbox validation suite",
      ],
      skills: ["Node.js Streams", "Backpressure", "TypeScript", "Async Error Handling"],
      evidenceRequired: ["Refactored streaming code", "Verification of backpressure handling"],
      validationRules: [
        {
          id: "sd-jun-t2-rule1",
          description: "Stream piping or backpressure mechanism",
          type: "code_static",
          expectedSnippet: "pipe",
        },
        {
          id: "sd-jun-t2-rule2",
          description: "Prohibit unbounded chunks buffer array",
          type: "code_static",
          prohibitedSnippet: "chunks.push",
        },
        {
          id: "sd-jun-t2-rule3",
          description: "Return acknowledgment contract",
          type: "code_static",
          expectedSnippet: "acknowledged",
        },
      ],
      rubricWeight: 40,
      hints: ["Use `stream.pipeline` or `req.pipe(storageStream)` which natively handles backpressure."],
      timeEstimateMins: 25,
    },
    {
      id: 3,
      title: "Hotfix vs Rollback Deployment Decision",
      type: "decision",
      dimension: "Reasoning & Edge Cases",
      objective: "Evaluate the deployment trade-offs between an unverified hotfix and a service rollback.",
      context: "Executive leadership is pressing for a decision 20 minutes before the enterprise customer demo.",
      prompt:
        "You have 20 minutes before the enterprise demo. Weigh the options:\nOption A: Deploy your new streaming hotfix directly to production worker pods.\nOption B: Rollback to build v2.4.1, which rejects files > 20MB with a 413 Payload Too Large error.\nDeliver a reasoned recommendation detailing:\n1. Blast radius of each option.\n2. Rollout strategy (e.g. Canary 10% vs Immediate 100%).\n3. Rollback triggers (e.g. 5xx rate > 1%, p99 latency > 2s).",
      constraints: ["Must choose one clear path and defend it with risk-weighted engineering reasoning."],
      expectedOutput: "A structured 3-part engineering trade-off memo.",
      acceptanceCriteria: [
        "Compares blast radius and risk exposure between Hotfix vs Rollback",
        "Recommends an incremental rollout mechanism (Canary or Blue-Green)",
        "Defines objective numeric rollback triggers",
      ],
      skills: ["Release Engineering", "Canary Deployment", "Risk Management"],
      evidenceRequired: ["Trade-off analysis", "Rollback metric thresholds"],
      validationRules: [
        {
          id: "sd-jun-t3-rule1",
          description: "Structured trade-off sections",
          type: "document_structure",
          requiredSections: ["Blast radius", "Rollout", "Rollback"],
          minWordCount: 50,
        },
      ],
      rubricWeight: 20,
      hints: ["A Canary deployment (10% traffic to 1 pod with live telemetry) mitigates hotfix risk while preserving demo capability."],
      timeEstimateMins: 12,
    },
    {
      id: 4,
      title: "GitHub Repository Submission & Engineering Post-Mortem",
      type: "communication",
      dimension: "Communication",
      objective: "Package the solution into a versioned repository and draft a blameless post-mortem.",
      context: "Submit final deliverables for peer review and architectural documentation.",
      prompt:
        "Provide your public GitHub repository URL containing the streaming fix. In addition, write a 4-point blameless engineering post-mortem:\n1. Incident Timeline & Detection\n2. Contributing Architectural Factors\n3. Corrective Actions Implemented\n4. Preventative Guardrails (e.g. load testing thresholds, linter rules against in-memory buffering).",
      constraints: ["Maintain a blameless, systems-focused engineering perspective."],
      expectedOutput: "GitHub link and 4-point post-mortem documentation.",
      acceptanceCriteria: [
        "Valid GitHub repository link provided",
        "Four post-mortem sections clearly articulated",
        "Proposes concrete systemic prevention guardrails",
      ],
      skills: ["Incident Post-Mortem", "Technical Documentation", "Git"],
      evidenceRequired: ["GitHub URL", "Post-mortem text"],
      validationRules: [
        {
          id: "sd-jun-t4-rule1",
          description: "GitHub URL",
          type: "code_static",
          expectedSnippet: "github.com",
        },
        {
          id: "sd-jun-t4-rule2",
          description: "Post-mortem structure",
          type: "document_structure",
          requiredSections: ["Timeline", "Architectural", "Corrective", "Preventative"],
          minWordCount: 50,
        },
      ],
      rubricWeight: 15,
      hints: ["Preventative guardrails should include automated stress tests with 100MB files in the CI pipeline."],
      timeEstimateMins: 8,
    },
  ],
  deliverable: {
    type: "Public GitHub Repository URL + Architecture Write-up",
    description: "Submit your GitHub repository containing the streaming implementation and incident documentation.",
    fields: [
      { name: "repoUrl", label: "GitHub Repository URL", type: "url", placeholder: "https://github.com/candidate/production-stream-patch", required: true, helpText: "Must contain the refactored FileUploadHandler and test cases." },
      { name: "notes", label: "Incident Post-Mortem & Architecture Rationale", type: "text", placeholder: "Paste your 4-point post-mortem and deployment decision here...", required: true, helpText: "Include your blast-radius analysis and canary triggers." },
    ],
    validationRules: [
      { id: "deliv-sd-jun-1", description: "GitHub URL format", type: "code_static", expectedSnippet: "github.com" },
    ],
  },
  rubric: [
    { id: "technical_correctness", name: "Technical Correctness & Streaming", weight: 35, description: "Elimination of heap buffering and robust backpressure implementation.", criteria: ["Zero in-memory buffer accumulation", "Proper backpressure signaling", "Clean error handling on aborted requests"] },
    { id: "problem_solving", name: "Problem-Solving & Root Cause Analysis", weight: 25, description: "Depth of understanding regarding JVM heap dynamics and GC pause spikes.", criteria: ["Correct log interpretation", "Mathematical concurrency modeling"] },
    { id: "architecture", name: "Architecture & Scale Resiliency", weight: 20, description: "Canary rollout strategy and risk-weighted decision making under pressure.", criteria: ["Sound blast radius mitigation", "Clear numeric rollback thresholds"] },
    { id: "communication", name: "Engineering Post-Mortem & Communication", weight: 20, description: "Quality of blameless post-mortem and actionable preventative guardrails.", criteria: ["Blameless engineering tone", "Actionable CI/CD prevention mechanisms"] },
  ],
  hints: [
    "Check how `pipeline` from `stream/promises` handles cleanup automatically when errors occur.",
  ],
  progression: {
    onSuccess: {
      recommendedTrack: "SD",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated excellent stream architecture and incident decision-making. Advance to Senior: High-Throughput Distributed Concurrency & Idempotency.",
    },
    onRemediation: {
      recommendedTrack: "SD",
      recommendedLevel: "junior",
      targetSkill: "Node.js Streams & Memory Profiling",
      rationale: "Revisit stream backpressure mechanics and GC telemetry before attempting distributed system simulations.",
    },
  },
};

export const SD_SENIOR_SIMULATION: SimulationDefinition = {
  id: "SIM-SD-SEN-001",
  version: "1.0.0",
  careerCode: "SD",
  level: "senior",
  title: "Flash Sale Race Condition: Distributed Locking & Idempotency",
  status: "active",
  roleContext: {
    roleTitle: "Staff Software Architect",
    team: "Distributed Core Banking & Orders",
    companyContext: "Global e-commerce platform orchestrating 25,000 checkout requests per second during flash sales.",
    reportingTo: "VP of Engineering",
  },
  scenario:
    "During the annual Black Friday flash sale, high-frequency checkout concurrency caused inventory overselling on 14 flagship SKUs. Telemetry reveals multiple application nodes read inventory simultaneously (e.g. stock=1), validated availability in parallel, and decremented stock across concurrent database transactions, resulting in negative inventory (-84 units) and ₹12,000,000 in unfulfillable customer commitments. The database primary CPU reached 100% due to aggressive row-lock contention. You must architect an atomic distributed locking and idempotency strategy using Redis Redlock and Lua scripts, design a write-behind reconciliation pipeline, and defend your trade-offs to the architecture board.",
  businessContext:
    "Unfulfillable orders led to an emergency checkout shutdown for 22 minutes, causing ₹80,000,000 in lost Gross Merchandise Value. Regulatory authorities have demanded an architectural audit report within 48 hours.",
  objective:
    "Design and implement an atomic distributed stock allocation engine with idempotency keys, eliminate row-level DB lock contention via Redis Lua scripts, formulate an eventual consistency fallback model, and write an executive architecture decision record (ADR).",
  estimatedMinutes: 90,
  difficulty: "Advanced",
  prerequisites: ["Distributed Systems Concepts (CAP, Eventual Consistency)", "Redis & Lua Scripting", "Database Transaction Isolation Levels", "System Architecture & ADRs"],
  learningOutcomes: [
    "Distributed concurrency control and atomic operations with Redis Lua",
    "Idempotency token design for high-throughput APIs",
    "Database write-behind buffering and asynchronous reconciliation",
    "Architectural Decision Record (ADR) authoring",
  ],
  skills: ["Distributed Systems", "Redis / Lua", "Idempotency", "Database Contention", "Architecture Decision Records"],
  materials: [
    {
      id: "mat-sd-sen-1",
      title: "PostgreSQL Row Lock Contention Telemetry",
      type: "logs",
      description: "Database transaction telemetry and deadlock logs captured during peak 25k req/s traffic.",
      filename: "postgres-contention.log",
      relevance: "Used in Task 1 to analyze transaction isolation anomalies and row lock wait times.",
      content: `[ALERT] 00:01:14.209 [db-primary] LOG: process 18492 still waiting for ExclusiveLock on tuple (48, 12) of relation "inventory" after 1000.123 ms
[ERROR] 00:01:15.890 [db-primary] ERROR: deadlock detected
Detail: Process 18492 waits for ShareLock on transaction 849201; blocked by process 19284.
Process 19284 waits for ExclusiveLock on tuple (48, 12) of relation "inventory"; blocked by process 18492.
[METRIC] Active connections: 980 / 1000 (98% saturation)
[METRIC] Transactions per second: 1,420 (Dropped from 18,500 due to lock queue backup)
[AUDIT] SKU #IPHONE-15-PRO: Physical Stock = 50, Recorded Orders = 134, Variance = -84 (Oversold!)`,
    },
    {
      id: "mat-sd-sen-2",
      title: "Existing Vulnerable Allocation Code",
      type: "code",
      description: "Current non-atomic read-then-write implementation in src/services/InventoryService.ts.",
      filename: "InventoryService.ts",
      relevance: "Used in Task 2 to replace with atomic Redis Lua script and idempotency verification.",
      content: `export class InventoryService {
  // Vulnerability: Classic Time-of-Check to Time-of-Use (TOCTOU) race condition!
  async allocateStock(sku: string, qty: number, orderId: string): Promise<boolean> {
    const currentStock = await db.query("SELECT available_stock FROM inventory WHERE sku = $1", [sku]);
    
    if (currentStock >= qty) {
      // High concurrency window: another worker decrements stock here!
      await db.query("UPDATE inventory SET available_stock = available_stock - $1 WHERE sku = $2", [qty, sku]);
      await db.query("INSERT INTO orders (id, sku, qty) VALUES ($1, $2, $3)", [orderId, sku, qty]);
      return true;
    }
    return false;
  }
}`,
    },
    {
      id: "mat-sd-sen-3",
      title: "Distributed Lock Architecture Specification",
      type: "docs",
      description: "Enterprise engineering standard for distributed locking and idempotency.",
      filename: "DistributedLockSpec.md",
      relevance: "Used in Task 2 and Task 3 to formulate Lua atomicity and Redis TTL guarantees.",
      content: `## Distributed Locking & Idempotency Rules
1. Atomic Check-and-Decrement: Stock check and reduction MUST execute atomically in a single round-trip (e.g. Redis Lua script EVALSHA)
2. Idempotency Token: Every order must include a client-generated UUID idempotency key cached with TTL = 86400s (24 hours)
3. Failure Mode: If Redis cluster loses quorum, fail closed or route to rate-limited pessimistic database fallback
4. Persistence Reconciliation: Redis serves as the authoritative real-time inventory ledger during flash sale; database is reconciled asynchronously via Kafka event stream`,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Diagnose Lock Contention & TOCTOU Race Condition",
      type: "investigation",
      dimension: "Problem-Solving & Root Cause Analysis",
      objective: "Analyze why database row-level locking failed under 25,000 req/s.",
      context: "Examine postgres-contention.log and InventoryService.ts.",
      prompt:
        "Review the materials provided. Answer:\n1. Detail the exact Time-of-Check to Time-of-Use (TOCTOU) sequence that permitted SKU overselling.\n2. Why did adding 'SELECT ... FOR UPDATE' in PostgreSQL fail at 25,000 req/s, causing connection pool exhaustion and deadlocks?\n3. Explain why application-level in-memory mutexes (e.g., node-mutex) do not work across a clustered Kubernetes deployment.",
      constraints: ["Cite database metrics (980 connections, deadlock details, transaction drop) in your answer."],
      expectedOutput: "A thorough architectural analysis detailing the distributed race condition.",
      acceptanceCriteria: [
        "Articulates the TOCTOU concurrency window between SELECT and UPDATE",
        "Explains that SELECT FOR UPDATE serializes row access, creating extreme queue contention and connection pool starvation",
        "Identifies that in-memory mutexes are node-local and blind to sibling worker pods in a cluster",
      ],
      skills: ["Distributed Concurrency", "Database Locking", "Transaction Isolation"],
      evidenceRequired: ["Detailed TOCTOU explanation", "Postgres lock contention analysis"],
      validationRules: [
        {
          id: "sd-sen-t1-rule1",
          description: "TOCTOU or race condition identification",
          type: "code_static",
          expectedSnippet: "race",
        },
        {
          id: "sd-sen-t1-rule2",
          description: "Clustered worker node explanation",
          type: "code_static",
          expectedSnippet: "cluster",
        },
      ],
      rubricWeight: 20,
      hints: ["When 500 pods execute `SELECT ... FOR UPDATE` on the same row, 499 threads are blocked waiting for the row lock."],
      timeEstimateMins: 20,
    },
    {
      id: 2,
      title: "Implement Atomic Redis Lua Script & Idempotency Manager",
      type: "implementation",
      dimension: "Technical Correctness",
      objective: "Write the atomic Redis Lua decrement script and TypeScript idempotency wrapper.",
      context: "Implement single-round-trip atomic allocation with idempotency token verification.",
      prompt:
        "Write the production DistributedLockManager in TypeScript. Requirements:\n1. Execute an atomic Redis Lua script that checks idempotencyKey, verifies currentStock >= requestedQty, decrements stock, and stores the idempotency record in Redis in one atomic operation.\n2. Return { success: boolean; remainingStock: number; isDuplicate: boolean }.\n3. Include a 24-hour TTL on the idempotency key.\n4. Handle Redis connection timeout by gracefully throwing a retryable ServiceUnavailable exception.",
      constraints: ["Must use atomic Lua execution logic (or simulated single-pass atomic block) to guarantee zero overselling."],
      expectedOutput: "Production-ready TypeScript DistributedLockManager with Lua script.",
      acceptanceCriteria: [
        "Atomic Lua script checks idempotency before decrementing",
        "Guarantees stock cannot drop below zero",
        "Sets 24h expiration on idempotency tokens",
        "Passes in-browser sandbox validation suite",
      ],
      skills: ["Redis", "Lua Scripting", "Idempotency", "TypeScript"],
      evidenceRequired: ["Lua atomic script", "TypeScript DistributedLockManager implementation"],
      validationRules: [
        {
          id: "sd-sen-t2-rule1",
          description: "Idempotency handling",
          type: "code_static",
          expectedSnippet: "idempotencyKey",
        },
        {
          id: "sd-sen-t2-rule2",
          description: "Atomic decrement logic",
          type: "code_static",
          expectedSnippet: "quantity",
        },
      ],
      rubricWeight: 35,
      hints: ["A Redis Lua script executes atomically on the Redis single-threaded event loop, preventing all concurrent interleaving."],
      timeEstimateMins: 35,
    },
    {
      id: 3,
      title: "Architect Asynchronous DB Reconciliation Pipeline",
      type: "architecture",
      dimension: "Architecture & Scale Resiliency",
      objective: "Design an eventual consistency write-behind queue to sync Redis allocations to PostgreSQL.",
      context: "Prevent overwhelming PostgreSQL while guaranteeing eventual consistency and durability.",
      prompt:
        "Design the write-behind persistence architecture:\n1. How will stock decrements in Redis be safely persisted into PostgreSQL without re-introducing row locks?\n2. What message broker and partitioning strategy (e.g. Kafka partition by SKU) will you use to preserve order?\n3. How will your architecture handle Redis node crash recovery (AOF vs replication vs DB rebuild)?",
      constraints: ["Must prevent database saturation while guaranteeing zero lost transactions."],
      expectedOutput: "A comprehensive architectural design addressing streaming persistence and disaster recovery.",
      acceptanceCriteria: [
        "Proposes Kafka/RabbitMQ write-behind pipeline with batching",
        "Partitions queue by SKU to serialize DB updates on a per-product basis",
        "Details Redis persistence strategy (AOF everysec) and periodic DB reconciliation",
      ],
      skills: ["Event-Driven Architecture", "Kafka", "Data Durability", "Disaster Recovery"],
      evidenceRequired: ["Queue partitioning design", "Crash recovery strategy"],
      validationRules: [
        {
          id: "sd-sen-t3-rule1",
          description: "Queue or Kafka partitioning",
          type: "code_static",
          expectedSnippet: "partition",
        },
        {
          id: "sd-sen-t3-rule2",
          description: "Persistence or AOF",
          type: "code_static",
          expectedSnippet: "reconciliation",
        },
      ],
      rubricWeight: 25,
      hints: ["Partitioning the message stream by SKU guarantees all decrements for that SKU are processed sequentially by a single consumer worker."],
      timeEstimateMins: 20,
    },
    {
      id: 4,
      title: "Architecture Decision Record (ADR-089) for Executive Board",
      type: "communication",
      dimension: "Engineering Communication",
      objective: "Author an executive Architecture Decision Record justifying the distributed locking strategy.",
      context: "Present to VP of Engineering and Architecture Governance Council.",
      prompt:
        "Write Architecture Decision Record ADR-089 following the standard format:\n- Status: Accepted\n- Context: Flash sale race conditions & DB deadlock crisis\n- Decision: Redis Lua atomic decrement + Kafka write-behind\n- Consequences & Trade-offs: Latency benefits vs Operational complexity vs CAP theorem trade-offs (CP vs AP).",
      constraints: ["Must explicitly address the CAP theorem trade-offs."],
      expectedOutput: "Markdown ADR document with all required sections.",
      acceptanceCriteria: [
        "Follows standard ADR format (Status, Context, Decision, Consequences)",
        "Explicitly discusses CAP theorem implications (favoring consistency over partition tolerance for inventory)",
        "Outlines operational monitoring requirements (Redis latency, queue lag)",
      ],
      skills: ["Architecture Decision Records", "CAP Theorem", "Executive Technical Communication"],
      evidenceRequired: ["ADR-089 Markdown document"],
      validationRules: [
        {
          id: "sd-sen-t4-rule1",
          description: "Standard ADR structure",
          type: "document_structure",
          requiredSections: ["Status", "Context", "Decision", "Consequences"],
          minWordCount: 60,
        },
      ],
      rubricWeight: 20,
      hints: ["Highlight that Redis Redlock trades pure durability for microsecond latency and atomic concurrency guarantees."],
      timeEstimateMins: 15,
    },
  ],
  deliverable: {
    type: "Public GitHub Repository URL + Architecture Write-up",
    description: "Submit repository containing the Redis Lua lock manager, tests, and ADR-089.",
    fields: [
      { name: "repoUrl", label: "GitHub Repository URL", type: "url", placeholder: "https://github.com/candidate/distributed-inventory-lock", required: true, helpText: "Must contain DistributedLockManager.ts and unit/integration tests." },
      { name: "notes", label: "Architecture Decision Record (ADR-089)", type: "text", placeholder: "Paste your ADR-089 and reconciliation architecture write-up...", required: true, helpText: "Include trade-off justifications and CAP theorem analysis." },
    ],
    validationRules: [
      { id: "deliv-sd-sen-1", description: "GitHub URL format", type: "code_static", expectedSnippet: "github.com" },
    ],
  },
  rubric: [
    { id: "technical_correctness", name: "Technical Correctness & Atomicity", weight: 35, description: "Correctness of atomic Lua decrement and idempotency verification.", criteria: ["Zero race conditions under concurrent calls", "Atomic idempotency evaluation", "Safe Redis timeout handling"] },
    { id: "architecture", name: "Architecture & Distributed Systems", weight: 30, description: "Elegance and durability of Kafka write-behind reconciliation pipeline.", criteria: ["Proper SKU partitioning", "Disaster recovery resilience", "CAP theorem trade-off defense"] },
    { id: "problem_solving", name: "Problem-Solving & Contention Analysis", weight: 20, description: "Insight into database lock queuing and connection pool starvation.", criteria: ["Rigorous TOCTOU analysis", "Deadlock root cause breakdown"] },
    { id: "communication", name: "Architecture Decision Record (ADR)", weight: 15, description: "Professionalism and rigor of ADR-089 documentation.", criteria: ["Clean ADR formatting", "Thorough consequence analysis"] },
  ],
  hints: [
    "Ensure your Lua script returns the updated stock level directly, eliminating an extra round-trip.",
  ],
  progression: {
    onSuccess: {
      recommendedTrack: "CYBER",
      recommendedLevel: "senior",
      rationale: "Candidate demonstrated elite distributed systems mastery. Recommend cross-track advance: Senior Cyber Security Zero-Trust Architecture.",
    },
    onRemediation: {
      recommendedTrack: "SD",
      recommendedLevel: "senior",
      targetSkill: "Distributed Locks & Idempotency",
      rationale: "Deepen understanding of atomic Redis primitives before designing mission-critical settlement pipelines.",
    },
  },
};
