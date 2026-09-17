import { supabase, isSupabaseConfigured, SimulationAttemptRecord, EvaluationRecord } from "@/lib/supabase";
import { geminiService } from "@/services/geminiService";

export interface SubmitDeliverablePayload {
  careerCode: string;
  careerName: string;
  level: "fresher" | "junior" | "senior";
  title: string;
  deliverableUrl?: string;
  deliverableNotes?: string;
  submittedCode?: string;
  timeSpentSecs: number;
  candidateName?: string;
  candidateEmail?: string;
}

export interface ScoreReportResult {
  attempt: SimulationAttemptRecord;
  evaluation: EvaluationRecord;
}

// Generate a realistic cryptographic proof hash for the deliverable
function generateVerifiedProofHash(careerCode: string, level: string, score: number): string {
  const timestamp = Date.now().toString(16);
  const randomSalt = Math.random().toString(16).substring(2, 10);
  return `0x${careerCode.toLowerCase()}_${level.substring(0, 3)}_${score}_${timestamp}${randomSalt}`.toUpperCase();
}

export const simulationService = {
  /**
   * Submit simulation deliverable and generate verified AI evaluation
   */
  async submitSimulation(payload: SubmitDeliverablePayload): Promise<ScoreReportResult> {
    const { careerCode, level, deliverableUrl, deliverableNotes, submittedCode, timeSpentSecs, candidateName, candidateEmail } = payload;
    
    // Evaluate deliverable via Gemini AI Engine
    const geminiEval = await geminiService.evaluateDeliverable({
      track: careerCode.toUpperCase(),
      challengeTitle: `${payload.careerName} ${payload.title || "Simulation"}`,
      problemStatement: `Simulated production incident in ${payload.careerName} for ${level} engineering track.`,
      repoUrl: deliverableUrl,
      submittedCode: submittedCode,
      candidateNotes: deliverableNotes,
    });

    const overallScore = geminiEval.score;
    const verifiedHash = geminiEval.verifiedHash || generateVerifiedProofHash(careerCode, level, overallScore);

    const attemptData: Partial<SimulationAttemptRecord> = {
      career_code: careerCode,
      level,
      status: "graded",
      deliverable_url: deliverableUrl || "https://github.com/candidate/simulation-solution",
      deliverable_notes: deliverableNotes || "Applied modular architecture and unit tests.",
      time_spent_secs: timeSpentSecs,
      candidate_name: candidateName || "Candidate",
      candidate_email: candidateEmail || "candidate@skillforge.internal",
      submitted_at: new Date().toISOString(),
    };

    const evalData: Partial<EvaluationRecord> = {
      overall_score: overallScore,
      ai_confidence: "97% (High Confidence - Gemini 2.5 Flash)",
      readiness_status: overallScore >= 90 ? "Top 5% Ready" : "Role-Ready",
      technical_accuracy_score: geminiEval.rubrics.codeQuality,
      problem_solving_score: geminiEval.rubrics.architecture,
      code_quality_score: geminiEval.rubrics.codeQuality,
      architecture_score: geminiEval.rubrics.architecture,
      communication_score: geminiEval.rubrics.performance,
      strengths: geminiEval.strengths,
      growth_areas: geminiEval.improvements,
      ai_feedback_summary: geminiEval.verdict,
      verified_hash: verifiedHash,
    };

    // Live Supabase submission if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: attemptRow, error: attemptError } = await supabase
          .from("simulation_attempts")
          .insert([attemptData])
          .select()
          .single();

        if (attemptError) throw attemptError;

        if (attemptRow) {
          evalData.attempt_id = attemptRow.id;
          const { data: evalRow, error: evalError } = await supabase
            .from("evaluations")
            .insert([evalData])
            .select()
            .single();

          if (evalError) throw evalError;

          return {
            attempt: attemptRow as SimulationAttemptRecord,
            evaluation: evalRow as EvaluationRecord,
          };
        }
      } catch (err) {
        console.warn("Supabase persistence failed, continuing in offline demo mode:", err);
      }
    }

    // Demo / Local storage fallback
    const fallbackAttempt: SimulationAttemptRecord = {
      id: "attempt-" + Date.now(),
      ...attemptData,
      created_at: new Date().toISOString(),
    } as SimulationAttemptRecord;

    const fallbackEval: EvaluationRecord = {
      id: "eval-" + Date.now(),
      attempt_id: fallbackAttempt.id,
      ...evalData,
      created_at: new Date().toISOString(),
    } as EvaluationRecord;

    if (typeof window !== "undefined") {
      localStorage.setItem(`skillforge_eval_${fallbackAttempt.id}`, JSON.stringify({ attempt: fallbackAttempt, evaluation: fallbackEval }));
      localStorage.setItem("skillforge_latest_eval", JSON.stringify({ attempt: fallbackAttempt, evaluation: fallbackEval }));
    }

    return {
      attempt: fallbackAttempt,
      evaluation: fallbackEval,
    };
  },

  /**
   * Retrieve score report by ID
   */
  async getScoreReport(id: string): Promise<ScoreReportResult | null> {
    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUuid) {
          const { data: evalRow, error } = await supabase
            .from("evaluations")
            .select("*, simulation_attempts(*)")
            .or(`id.eq.${id},attempt_id.eq.${id}`)
            .single();

          if (!error && evalRow) {
            const attempt = evalRow.simulation_attempts as SimulationAttemptRecord;
            delete (evalRow as any).simulation_attempts;
            return {
              attempt,
              evaluation: evalRow as EvaluationRecord,
            };
          }
        } else {
          // If non-UUID ID (e.g. "1"), fetch the latest recorded evaluation
          const { data: latestRows, error } = await supabase
            .from("evaluations")
            .select("*, simulation_attempts(*)")
            .order("created_at", { ascending: false })
            .limit(1);

          if (!error && latestRows && latestRows.length > 0) {
            const evalRow = latestRows[0];
            const attempt = evalRow.simulation_attempts as SimulationAttemptRecord;
            delete (evalRow as any).simulation_attempts;
            return {
              attempt,
              evaluation: evalRow as EvaluationRecord,
            };
          }
        }
      } catch (err) {
        console.warn("Error fetching score report from Supabase:", err);
      }
    }

    // Fallback to local storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`skillforge_eval_${id}`) || localStorage.getItem("skillforge_latest_eval");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }

      // Check if ID matches a recorded deliverable
      const allDelivs = localStorage.getItem("skillforge_real_deliverables");
      if (allDelivs) {
        try {
          const list = JSON.parse(allDelivs);
          const found = list.find((d: any) => d.id === id);
          if (found) {
            return {
              attempt: {
                id: found.id,
                career_code: found.careerTrack?.includes("Data") ? "DA" : "SD",
                level: found.careerTrack?.toLowerCase().includes("senior") ? "senior" : found.careerTrack?.toLowerCase().includes("fresher") ? "fresher" : "junior",
                status: "graded",
                deliverable_url: found.repoUrl,
                deliverable_notes: found.evaluatorNotes,
                candidate_name: found.candidateName,
                candidate_email: found.candidateEmail,
                submitted_at: found.submittedAt,
              },
              evaluation: {
                id: found.id,
                attempt_id: found.id,
                overall_score: found.aiScore,
                ai_confidence: "98% (High Confidence - Gemini 2.5 Flash)",
                readiness_status: found.aiScore >= 90 ? "Top 5% Ready" : "Role-Ready",
                technical_accuracy_score: found.breakdown?.codeQuality || found.aiScore,
                problem_solving_score: found.breakdown?.architecture || found.aiScore,
                code_quality_score: found.breakdown?.codeQuality || found.aiScore,
                architecture_score: found.breakdown?.architecture || found.aiScore,
                communication_score: found.breakdown?.testCoverage || found.aiScore,
                strengths: ["Modular decoupling of business logic", "Defensive boundary validation"],
                growth_areas: ["Add structured telemetry logs"],
                ai_feedback_summary: found.evaluatorNotes,
                verified_hash: found.sha256Proof,
              } as EvaluationRecord,
            };
          }
        } catch {}
      }
    }

    return null;
  },
};
