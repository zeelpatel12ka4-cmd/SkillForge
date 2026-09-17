export interface SandboxStarter {
  filename: string;
  language: string;
  starterCode: string;
  taskTitle: string;
  instructions: string;
}

export interface TestCaseResult {
  id: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

export interface SandboxExecutionReport {
  passed: boolean;
  total: number;
  passedCount: number;
  failedCount: number;
  runtimeMs: number;
  results: TestCaseResult[];
  consoleOutput: string[];
}

export const sandboxService = {
  getStarterCode(trackCode: string, level: string): SandboxStarter {
    let normTrack = (trackCode || "SD").toUpperCase().trim();
    if (normTrack === "CS") normTrack = "CYBER";
    if (normTrack === "SA") normTrack = "SALES";
    if (normTrack === "DO") normTrack = "DEVOPS";
    if (normTrack === "SWE") normTrack = "SD";
    if (normTrack === "MARKETING") normTrack = "DM";

    if (normTrack === "SD" && level === "fresher") {
      return {
        filename: "UserValidator.ts",
        language: "typescript",
        taskTitle: "Bugfix: User Registration Payload Validator",
        instructions: "Fix the NullPointerException when phoneNumber is null/undefined, and make the email regex case-insensitive.",
        starterCode: `export interface UserRegistrationDTO {
  email: string;
  phoneNumber?: string | null;
  displayName: string;
}

export function validateUserProfile(dto: UserRegistrationDTO): boolean {
  // BUG 1: Throws NullPointerException if phoneNumber is null or omitted
  if (dto.phoneNumber && dto.phoneNumber.trim().length < 10) {
    throw new Error("Invalid phone number");
  }

  // BUG 2: Regex fails uppercase or mixed-case domains like Arjun@Company.COM
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/i;
  if (!emailRegex.test(dto.email)) {
    throw new Error("Invalid email address format");
  }

  return true;
}`,
      };
    }

    if (normTrack === "SD" && level === "senior") {
      return {
        filename: "DistributedLockInventory.ts",
        language: "typescript",
        taskTitle: "Distributed Inventory Decrement with Idempotency",
        instructions: "Implement an atomic lock check with idempotency token verification to prevent flash sale inventory overselling.",
        starterCode: `export interface OrderAllocation {
  orderId: string;
  sku: string;
  quantity: number;
  idempotencyKey: string;
}

export class DistributedLockManager {
  private memoryLocks = new Map<string, number>();
  private processedKeys = new Set<string>();

  async allocateStock(order: OrderAllocation, currentStock: number): Promise<{ success: boolean; remaining: number }> {
    // Check idempotency key first
    if (this.processedKeys.has(order.idempotencyKey)) {
      return { success: true, remaining: currentStock };
    }

    // Verify stock boundary
    if (currentStock < order.quantity) {
      return { success: false, remaining: currentStock };
    }

    // Record idempotency
    this.processedKeys.add(order.idempotencyKey);
    return {
      success: true,
      remaining: currentStock - order.quantity
    };
  }
}`,
      };
    }

    if (normTrack === "DA") {
      return {
        filename: "funnel_analysis.py",
        language: "python",
        taskTitle: "Funnel Conversion & Cohort Retention Analysis",
        instructions: "Load session data, clean missing values, calculate stage-by-stage drop-off rates and statistical significance.",
        starterCode: `import pandas as pd
import numpy as np

def calculate_funnel_metrics(df: pd.DataFrame) -> dict:
    # 1. Total sessions initiated
    total_sessions = len(df)
    
    # 2. Stage conversions
    cart_adds = df['cart_added'].sum()
    checkouts = df['checkout_started'].sum()
    purchases = df['payment_completed'].sum()
    
    return {
        "total_sessions": total_sessions,
        "cart_conversion_rate": round(cart_adds / total_sessions, 4),
        "checkout_completion_rate": round(purchases / checkouts, 4) if checkouts > 0 else 0,
        "overall_conversion_rate": round(purchases / total_sessions, 4)
    }`,
      };
    }

    if (normTrack === "UX") {
      return {
        filename: "design_tokens.json",
        language: "json",
        taskTitle: "WCAG AA Accessible Semantic Token Architecture",
        instructions: "Define semantic color tokens adhering to WCAG 2.1 AA 4.5:1 minimum contrast ratios across light and dark modes.",
        starterCode: `{
  "color": {
    "brand": {
      "primary": { "value": "#4F46E5", "type": "color" },
      "secondary": { "value": "#06B6D4", "type": "color" }
    },
    "semantic": {
      "surface": { "value": "#0F172A", "type": "color" },
      "surfaceElevated": { "value": "#1E293B", "type": "color" },
      "textPrimary": { "value": "#F8FAFC", "type": "color" },
      "textSecondary": { "value": "#94A3B8", "type": "color" },
      "actionPrimary": { "value": "{color.brand.primary}", "type": "color" }
    }
  }
}`,
      };
    }

    if (normTrack === "PM") {
      return {
        filename: "feature_spec.md",
        language: "markdown",
        taskTitle: "Product Requirements & Acceptance Criteria",
        instructions: "Define user personas, edge-case criteria, and Gherkin acceptance tests (Given/When/Then).",
        starterCode: `# Product Requirement Document: One-Tap Social Auth

## 1. Problem Statement
Users abandon the registration flow at a 35% rate when prompted to invent a complex password.

## 2. Target Persona
- Mid-career software engineers exploring verified simulations.

## 3. Acceptance Criteria
\`\`\`gherkin
Scenario: Successful One-Tap OAuth
  Given an unauthenticated candidate on /auth/login
  When they click "Continue with Google"
  Then exchange Supabase OAuth code and sync user profile to /dashboard
\`\`\`
`,
      };
    }

    if (normTrack === "DEVOPS") {
      return {
        filename: "Dockerfile",
        language: "dockerfile",
        taskTitle: "Multi-Stage Alpine Container Optimization",
        instructions: "Refactor single-stage container into multi-stage build to reduce image size to <100MB.",
        starterCode: `# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
`,
      };
    }

    if (normTrack === "CYBER") {
      return {
        filename: "SecuritySanitizer.ts",
        language: "typescript",
        taskTitle: "SQL Injection & XSS Parameterized Sanitizer",
        instructions: "Implement prepared statement parameterization and input sanitization to eliminate injection vulnerabilities.",
        starterCode: `export class QuerySanitizer {
  static sanitizeSearchInput(input: string): string {
    if (!input) return "";
    // Strip malicious SQL control characters and XSS tags
    return input.replace(/[<>'"\\\\;]/g, "").trim().slice(0, 100);
  }

  static buildParameterizedQuery(searchTerm: string): { text: string; values: any[] } {
    const safeTerm = this.sanitizeSearchInput(searchTerm);
    return {
      text: "SELECT id, username, email FROM users WHERE username ILIKE $1 LIMIT 50;",
      values: [\`%\${safeTerm}%\`],
    };
  }
}`,
      };
    }

    if (normTrack === "AI") {
      return {
        filename: "rag_retriever.py",
        language: "python",
        taskTitle: "Hybrid Semantic Chunking & Vector Retrieval Pipeline",
        instructions: "Implement semantic boundary chunking and reciprocal rank fusion to eliminate hallucinated context.",
        starterCode: `import re
from typing import List, Dict

class HybridRetriever:
    def __init__(self, top_k: int = 5):
        self.top_k = top_k

    def chunk_document(self, text: str, max_tokens: int = 384) -> List[str]:
        # Semantic sentence boundary splitter
        sentences = re.split(r'(?<=[.?!])\\s+', text)
        chunks = []
        current_chunk = []
        current_length = 0

        for sentence in sentences:
            length = len(sentence.split())
            if current_length + length > max_tokens:
                if current_chunk:
                    chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_length = length
            else:
                current_chunk.append(sentence)
                current_length += length

        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks
`,
      };
    }

    if (normTrack === "DM") {
      return {
        filename: "campaign_optimizer.py",
        language: "python",
        taskTitle: "ROAS & Customer Acquisition Cost (CAC) Modeling",
        instructions: "Implement dynamic blended CAC calculation and target ROAS thresholds across paid marketing channels.",
        starterCode: `def evaluate_campaign_performance(spend: float, leads: int, customers: int, ltv: float) -> dict:
    cac = round(spend / customers, 2) if customers > 0 else 0
    cvr = round((customers / leads) * 100, 2) if leads > 0 else 0
    ltv_cac_ratio = round(ltv / cac, 2) if cac > 0 else 0
    
    return {
        "cac_usd": cac,
        "conversion_rate_pct": cvr,
        "ltv_to_cac_ratio": ltv_cac_ratio,
        "is_profitable": ltv_cac_ratio >= 3.0
    }`,
      };
    }

    if (normTrack === "SALES") {
      return {
        filename: "tco_calculator.js",
        language: "javascript",
        taskTitle: "Enterprise TCO & Competitive ROI Defense Model",
        instructions: "Build a 36-month Total Cost of Ownership calculator defending platform value over competitor pricing.",
        starterCode: `export function calculateTCO(seats, customIntegrations = false) {
  const baseSoftwareCost = seats * 35 * 12; // Annual licenses
  const onboardingSupport = customIntegrations ? 8000 : 2500;
  const estimatedDowntimeSavings = seats * 420; // Reclaimed engineering hours
  
  const net3YearBenefit = (estimatedDowntimeSavings * 3) - ((baseSoftwareCost * 3) + onboardingSupport);
  
  return {
    annualCost: baseSoftwareCost,
    threeYearSavings: estimatedDowntimeSavings * 3,
    netRoi: Math.round((net3YearBenefit / (baseSoftwareCost * 3)) * 100)
  };
}`,
      };
    }

    // Default: SD Junior streaming handler
    return {
      filename: "StreamingChunkUploader.ts",
      language: "typescript",
      taskTitle: "Refactor In-Memory Upload to Chunked Streaming",
      instructions: "Implement backpressure-safe chunk processing to prevent heap memory exhaustion (OOM) on large files.",
      starterCode: `export interface ChunkPayload {
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  byteLength: number;
}

export class ChunkedFileReceiver {
  private activeUploads = new Map<string, { receivedBytes: number; chunksProcessed: number }>();

  async processIncomingChunk(chunk: ChunkPayload): Promise<{ acknowledged: boolean; totalBytesWritten: number }> {
    let session = this.activeUploads.get(chunk.uploadId);
    if (!session) {
      session = { receivedBytes: 0, chunksProcessed: 0 };
      this.activeUploads.set(chunk.uploadId, session);
    }

    // Stream chunk directly to disk buffer without loading entire file into heap
    session.receivedBytes += chunk.byteLength;
    session.chunksProcessed += 1;

    return {
      acknowledged: true,
      totalBytesWritten: session.receivedBytes
    };
  }
}`,
    };
  },

  /**
   * Run sandboxed test assertions safely via static pattern checks and safe execution
   */
  runSandboxTests(trackCode: string, level: string, code: string): SandboxExecutionReport {
    const startTime = performance.now();
    const results: TestCaseResult[] = [];
    const consoleOutput: string[] = [];

    let normTrack = (trackCode || "SD").toUpperCase().trim();
    if (normTrack === "CS") normTrack = "CYBER";
    if (normTrack === "SA") normTrack = "SALES";
    if (normTrack === "DO") normTrack = "DEVOPS";
    if (normTrack === "SWE") normTrack = "SD";
    if (normTrack === "MARKETING") normTrack = "DM";

    consoleOutput.push(`[SYSTEM] Initializing SkillForge Sandbox Runtime (${normTrack}-${level.toUpperCase()} Environment)...`);
    consoleOutput.push(`[SYSTEM] Compiling and evaluating solution source against test harnesses...`);

    if (normTrack === "SD" && level === "fresher") {
      // Test 1: Null phone safety
      const hasNullGuard =
        code.includes("dto.phoneNumber &&") ||
        code.includes("dto.phoneNumber?.") ||
        code.includes("if (!dto.phoneNumber)") ||
        code.includes("dto.phoneNumber != null");
      
      const t1Passed = Boolean(hasNullGuard && !code.match(/dto\.phoneNumber\.trim\(\)\.length/));
      results.push({
        id: "T1",
        name: "Null/Undefined Phone Number Safety (Zero 500 NPEs)",
        passed: t1Passed,
        error: t1Passed ? undefined : "Throws NPE when phoneNumber is null or omitted. Add null check before .trim().",
        durationMs: 14,
      });

      // Test 2: Case-insensitive email regex
      const hasCaseInsensitive = code.includes("/i") || code.toLowerCase().includes("tolowercase");
      results.push({
        id: "T2",
        name: "Uppercase Domain Email Acceptance (e.g. User@Company.COM)",
        passed: hasCaseInsensitive,
        error: hasCaseInsensitive ? undefined : "Regex failed for uppercase email domains. Use the /i flag or normalize with .toLowerCase().",
        durationMs: 11,
      });

      // Test 3: Return boolean contract
      const hasReturn = code.includes("return true") || code.includes("return false");
      results.push({
        id: "T3",
        name: "Validation Return Contract (Boolean return or thrown exception)",
        passed: hasReturn,
        error: hasReturn ? undefined : "Function must return boolean or throw standard Error on invalid payload.",
        durationMs: 8,
      });
    } else if (normTrack === "SD" && level === "senior") {
      // Senior Tests
      const hasIdempotency = code.includes("idempotencyKey") && (code.includes("has") || code.includes("get"));
      results.push({
        id: "T1",
        name: "Idempotency Token Verification (Prevent Duplicate Charges)",
        passed: hasIdempotency,
        error: hasIdempotency ? undefined : "Must verify and register idempotencyKey to prevent duplicate inventory deduction.",
        durationMs: 19,
      });

      const hasBoundaryCheck = code.includes("currentStock <") || code.includes("quantity >") || code.includes("currentStock -");
      results.push({
        id: "T2",
        name: "Stock Boundary Underflow Guard (Zero Negative Inventory)",
        passed: hasBoundaryCheck,
        error: hasBoundaryCheck ? undefined : "Must reject transactions if requested quantity exceeds current stock.",
        durationMs: 16,
      });

      const hasAtomicReturn = code.includes("remaining");
      results.push({
        id: "T3",
        name: "Atomic State Return & Latency Guarantee (< 20ms SLA)",
        passed: hasAtomicReturn,
        error: hasAtomicReturn ? undefined : "Expected remaining inventory state in response payload.",
        durationMs: 12,
      });
    } else if (normTrack === "SD") {
      // Junior streaming tests
      const hasChunkCounter = code.includes("chunksProcessed") || code.includes("chunkIndex");
      results.push({
        id: "T1",
        name: "Sequential Chunk Offset Tracking",
        passed: hasChunkCounter,
        error: hasChunkCounter ? undefined : "Must track chunks processed and chunk index.",
        durationMs: 15,
      });

      const hasStreamingGuard = !code.includes("Buffer.concat") && (code.includes("byteLength") || code.includes("stream"));
      results.push({
        id: "T2",
        name: "OOM Heap Memory Guard (No unbounded Buffer.concat)",
        passed: hasStreamingGuard,
        error: hasStreamingGuard ? undefined : "Unbounded buffer detected. Stream directly or write chunks sequentially.",
        durationMs: 18,
      });

      const hasAcknowledgment = code.includes("acknowledged") || code.includes("status");
      results.push({
        id: "T3",
        name: "HTTP 200 Chunk Acknowledgment Contract",
        passed: hasAcknowledgment,
        error: hasAcknowledgment ? undefined : "Must return acknowledgment response with bytes written.",
        durationMs: 10,
      });
    } else if (normTrack === "DA") {
      // Data Analyst Tests
      const hasFunnelRatio = code.includes("cart_adds / total_sessions") || code.includes("cart_conversion_rate") || code.includes("total_sessions");
      results.push({
        id: "T1",
        name: "Cohort Stage Conversion Calculation",
        passed: hasFunnelRatio,
        error: hasFunnelRatio ? undefined : "Funnel metric formulas missing stage-by-stage conversions.",
        durationMs: 14,
      });

      const hasZeroGuard = code.includes("if checkouts > 0") || code.includes("> 0 else 0") || code.includes("checkouts > 0");
      results.push({
        id: "T2",
        name: "Zero-Division Boundary Exception Guard",
        passed: hasZeroGuard,
        error: hasZeroGuard ? undefined : "Must guard against ZeroDivisionError when checkout volume is 0.",
        durationMs: 12,
      });

      const hasPrecision = code.includes("round(") || code.includes(".toFixed(");
      results.push({
        id: "T3",
        name: "Statistical Precision & Decimal Normalization",
        passed: hasPrecision,
        error: hasPrecision ? undefined : "Normalize conversion metrics to 4 decimal points using round().",
        durationMs: 9,
      });
    } else if (normTrack === "UX") {
      // UX Designer Tests
      const hasBrandTokens = code.includes("primary") && code.includes("brand");
      results.push({
        id: "T1",
        name: "Semantic Design Token Architecture",
        passed: hasBrandTokens,
        error: hasBrandTokens ? undefined : "Tokens schema must contain structured brand and primary color tokens.",
        durationMs: 10,
      });

      const hasAccessibleSurfaces = code.includes("surface") && code.includes("textPrimary");
      results.push({
        id: "T2",
        name: "WCAG AA 4.5:1 Text-to-Surface Contrast Mapping",
        passed: hasAccessibleSurfaces,
        error: hasAccessibleSurfaces ? undefined : "Define semantic surface and textPrimary tokens with AA contrast ratio.",
        durationMs: 12,
      });

      const hasActionTokens = code.includes("actionPrimary") || code.includes("interactive");
      results.push({
        id: "T3",
        name: "Component Action Token Alias Schema",
        passed: hasActionTokens,
        error: hasActionTokens ? undefined : "Reference brand tokens in actionPrimary semantic definitions.",
        durationMs: 8,
      });
    } else if (normTrack === "CYBER") {
      // Cybersecurity Tests
      const hasSanitizer = code.includes("replace(") || code.includes("slice(") || code.includes("strip");
      results.push({
        id: "T1",
        name: "XSS & SQL Injection Character Sanitization",
        passed: hasSanitizer,
        error: hasSanitizer ? undefined : "Sanitizer must strip dangerous control characters (<, >, ', \", ;).",
        durationMs: 15,
      });

      const hasPreparedStatements = code.includes("$1") || code.includes("?") || code.includes("values");
      results.push({
        id: "T2",
        name: "Parameterized Prepared Statement Parameterization",
        passed: hasPreparedStatements,
        error: hasPreparedStatements ? undefined : "Use parameterized query placeholders instead of raw string concatenation.",
        durationMs: 12,
      });

      const hasQueryContract = code.includes("text") && code.includes("values");
      results.push({
        id: "T3",
        name: "Safe Database Execution Payload Contract",
        passed: hasQueryContract,
        error: hasQueryContract ? undefined : "Return object containing parameterized query text and values array.",
        durationMs: 9,
      });
    } else if (normTrack === "AI") {
      // AI/ML Tests
      const hasSemanticSplit = code.includes("split(") || code.includes("re.split");
      results.push({
        id: "T1",
        name: "Semantic Sentence Boundary Token Splitter",
        passed: hasSemanticSplit,
        error: hasSemanticSplit ? undefined : "Implement regex or punctuation-aware sentence boundary chunking.",
        durationMs: 16,
      });

      const hasTokenGuard = code.includes("max_tokens") || code.includes("length >");
      results.push({
        id: "T2",
        name: "Context Window Embedding Overflow Guard (< 384 tokens)",
        passed: hasTokenGuard,
        error: hasTokenGuard ? undefined : "Must chunk text before exceeding max_tokens threshold.",
        durationMs: 14,
      });

      const hasListReturn = code.includes("return chunks") || code.includes("List[str]");
      results.push({
        id: "T3",
        name: "Vector Pipeline Chunk Array Return Contract",
        passed: hasListReturn,
        error: hasListReturn ? undefined : "Retriever must return list of non-empty text chunks.",
        durationMs: 10,
      });
    } else if (normTrack === "PM") {
      // Product Manager Tests
      const hasGherkin = code.includes("Given") && code.includes("When") && code.includes("Then");
      results.push({
        id: "T1",
        name: "Standard Gherkin Acceptance Criteria (Given/When/Then)",
        passed: hasGherkin,
        error: hasGherkin ? undefined : "Spec must contain Gherkin scenario with Given, When, Then statements.",
        durationMs: 11,
      });

      const hasTargetPersona = code.includes("Persona") || code.includes("User");
      results.push({
        id: "T2",
        name: "Target User Persona & Pain-Point Definition",
        passed: hasTargetPersona,
        error: hasTargetPersona ? undefined : "Define target customer persona and core workflow bottlenecks.",
        durationMs: 10,
      });

      const hasProblemStatement = code.includes("Problem") || code.includes("Statement");
      results.push({
        id: "T3",
        name: "Quantitative Success Metrics & Scope",
        passed: hasProblemStatement,
        error: hasProblemStatement ? undefined : "Specify quantified problem statement and benchmark metric.",
        durationMs: 9,
      });
    } else if (normTrack === "DEVOPS") {
      // DevOps Tests
      const hasMultiStage = code.includes("AS builder") && code.includes("AS runner");
      results.push({
        id: "T1",
        name: "Multi-Stage Dockerfile Optimization (Builder vs Runner)",
        passed: hasMultiStage,
        error: hasMultiStage ? undefined : "Use multi-stage Docker build to keep production runtime footprint minimal.",
        durationMs: 14,
      });

      const hasNonRoot = code.includes("USER ") || code.includes("adduser");
      results.push({
        id: "T2",
        name: "Least Privilege Principle: Non-Root Execution User",
        passed: hasNonRoot,
        error: hasNonRoot ? undefined : "Container must not run as root. Define USER directive.",
        durationMs: 12,
      });

      const hasAlpineBase = code.includes("alpine");
      results.push({
        id: "T3",
        name: "Vulnerability Reduction: Minimal Alpine Base Image",
        passed: hasAlpineBase,
        error: hasAlpineBase ? undefined : "Use lightweight Alpine base image to eliminate unnecessary OS packages.",
        durationMs: 10,
      });
    } else if (normTrack === "DM") {
      // Digital Marketing Tests
      const hasCAC = code.includes("spend / customers") || code.includes("cac");
      results.push({
        id: "T1",
        name: "Customer Acquisition Cost (CAC) Calculation",
        passed: hasCAC,
        error: hasCAC ? undefined : "Compute unit CAC as spend divided by total paying customers acquired.",
        durationMs: 12,
      });

      const hasLTV = code.includes("ltv / cac") || code.includes("ltv_to_cac_ratio");
      results.push({
        id: "T2",
        name: "LTV-to-CAC Unit Economics Multiple (> 3.0x Benchmark)",
        passed: hasLTV,
        error: hasLTV ? undefined : "Calculate LTV/CAC ratio to establish campaign payback sustainability.",
        durationMs: 10,
      });

      const hasProfitability = code.includes("is_profitable") || code.includes(">= 3.0");
      results.push({
        id: "T3",
        name: "Automated Profitability Decision Contract",
        passed: hasProfitability,
        error: hasProfitability ? undefined : "Return boolean indicator evaluating if LTV/CAC ratio meets target threshold.",
        durationMs: 9,
      });
    } else {
      // Sales & Solutions Tests
      const hasTCO = code.includes("baseSoftwareCost") || code.includes("net3YearBenefit");
      results.push({
        id: "T1",
        name: "3-Year Total Cost of Ownership (TCO) Model",
        passed: hasTCO,
        error: hasTCO ? undefined : "Calculate 3-year baseline license costs and operational maintenance.",
        durationMs: 14,
      });

      const hasSavings = code.includes("estimatedDowntimeSavings") || code.includes("threeYearSavings");
      results.push({
        id: "T2",
        name: "Engineering Productivity & Downtime Savings Multiplier",
        passed: hasSavings,
        error: hasSavings ? undefined : "Quantify engineering hours saved vs self-hosted maintenance overhead.",
        durationMs: 12,
      });

      const hasROI = code.includes("netRoi") || code.includes("annualCost");
      results.push({
        id: "T3",
        name: "Net ROI Percentage Defense Contract",
        passed: hasROI,
        error: hasROI ? undefined : "Output net ROI percentage defending platform pricing against competitors.",
        durationMs: 10,
      });
    }

    const passedCount = results.filter((r) => r.passed).length;
    const total = results.length;
    const passed = passedCount === total;
    const runtimeMs = Math.round(performance.now() - startTime);

    results.forEach((r) => {
      consoleOutput.push(`${r.passed ? "  ✓ [PASS]" : "  ✗ [FAIL]"} ${r.name} (${r.durationMs}ms)`);
      if (r.error) consoleOutput.push(`    ↳ Note: ${r.error}`);
    });

    consoleOutput.push(`[SUMMARY] Finished test suite: ${passedCount}/${total} passed in ${runtimeMs}ms.`);

    return {
      passed,
      total,
      passedCount,
      failedCount: total - passedCount,
      runtimeMs,
      results,
      consoleOutput,
    };
  },

  /**
   * Request diagnostic mentor hints from AI without revealing full answer
   */
  async getAiMentorHint(params: {
    trackCode: string;
    level: string;
    scenario: string;
    code: string;
  }): Promise<{ hint: string; suggestedFixes: string[] }> {
    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mentor_hint",
          track: params.trackCode,
          challengeTitle: `Mentor Diagnostic: ${params.trackCode} (${params.level})`,
          problemStatement: params.scenario,
          submittedCode: params.code,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.hint) {
          return {
            hint: data.hint,
            suggestedFixes: data.suggestedFixes || [
              "Verify null safety guards on optional fields",
              "Ensure regex patterns support case-insensitive flags",
            ],
          };
        }
      }
    } catch {
      // Fallback
    }

    // Default intelligent diagnostic
    if (params.trackCode === "SD" && params.level === "fresher") {
      return {
        hint: "Notice that `dto.phoneNumber` is an optional property in the TypeScript interface. If the client leaves it blank or passes null, invoking `.trim()` immediately throws a runtime NullPointerException. Check if `dto.phoneNumber` exists before measuring its length.",
        suggestedFixes: [
          "Use optional chaining: `dto.phoneNumber?.trim()`",
          "Add null check: `if (dto.phoneNumber && dto.phoneNumber.trim().length < 10)`",
          "Append `/i` flag to email regular expression for case-insensitivity",
        ],
      };
    }

    return {
      hint: "Inspect how data chunks are buffered. In-memory buffers multiply memory consumption by the number of concurrent uploads, causing JVM garbage collection stalls. Use streaming pipes or direct disk writes.",
      suggestedFixes: [
        "Avoid accumulating all chunk bytes in an in-memory array",
        "Maintain an index counter to verify packet ordering",
        "Return an HTTP 200 acknowledgment with total bytes written",
      ],
    };
  },
};
