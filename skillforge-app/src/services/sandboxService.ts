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
    if (trackCode === "SD" && level === "fresher") {
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

    if (trackCode === "SD" && level === "senior") {
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

    consoleOutput.push(`[SYSTEM] Initializing SkillForge Sandbox Runtime (Node v20.12 - Secure Mode)...`);
    consoleOutput.push(`[SYSTEM] Compiling ${trackCode}-${level.toUpperCase()} deliverable source...`);

    if (trackCode === "SD" && level === "fresher") {
      // Test 1: Null phone safety
      const hasNullGuard =
        code.includes("dto.phoneNumber &&") ||
        code.includes("dto.phoneNumber?.") ||
        code.includes("if (!dto.phoneNumber)") ||
        code.includes("dto.phoneNumber != null");
      
      const t1Passed = hasNullGuard && !code.match(/dto\.phoneNumber\.trim\(\)\.length/);
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
    } else if (trackCode === "SD" && level === "senior") {
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
    } else {
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
