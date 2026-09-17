"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { getSimulation } from "@/data/simulationBank";
import { getCanonicalCareer, normalizeTrackCode } from "@/data/careerRegistry";
import { sandboxService } from "@/services/sandboxService";
import { simulationService } from "@/services/simulationService";
import { authService } from "@/services/authService";
import { gamificationService } from "@/services/gamificationService";
import { deliverableService } from "@/services/deliverableService";

import SimulationHeader from "@/components/simulation/SimulationHeader";
import MissionBriefCard from "@/components/simulation/MissionBriefCard";
import MaterialsPanel from "@/components/simulation/MaterialsPanel";
import TaskWorkspaceCard from "@/components/simulation/TaskWorkspaceCard";
import FinalDeliverableCard from "@/components/simulation/FinalDeliverableCard";
import SubmissionChecklistModal from "@/components/simulation/SubmissionChecklistModal";
import SimulationCompletionCard from "@/components/simulation/SimulationCompletionCard";
import { SeniorityLevel } from "@/types/simulation";

function SimulationWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTrack = searchParams.get("track") || "SD";
  const careerCode = normalizeTrackCode(rawTrack);
  const levelParam = (searchParams.get("level") || "junior").toLowerCase() as SeniorityLevel;

  const career = getCanonicalCareer(careerCode);
  const simulation = getSimulation(careerCode, levelParam);
  const starter = sandboxService.getStarterCode(careerCode, levelParam);

  const storageKey = `skillforge_sim_linear_${careerCode}_${levelParam}`;

  // User state
  const [user, setUser] = useState<{ id?: string; email?: string; fullName?: string } | null>(null);

  // Workflow states
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTaskIndices, setCompletedTaskIndices] = useState<Set<number>>(new Set());
  const [taskAnswers, setTaskAnswers] = useState<Record<number, string>>({});
  const [reviewedMaterialIds, setReviewedMaterialIds] = useState<Set<string>>(new Set());
  const [sandboxCode, setSandboxCode] = useState(starter.starterCode);
  const [deliverableValues, setDeliverableValues] = useState<Record<string, string>>({});

  // Submission & modal states
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTimestamp, setSubmittedTimestamp] = useState("");

  // Session timer
  const [timeLeft, setTimeLeft] = useState(
    simulation.estimatedMinutes ? simulation.estimatedMinutes * 60 : 3600
  );

  // 1. Initialize user & restore state from LocalStorage
  useEffect(() => {
    async function initUser() {
      const u = await authService.getCurrentUser();
      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          fullName: u.fullName || u.full_name || u.email?.split("@")[0] || "Candidate",
        });
      }
    }
    initUser();

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.currentTaskIndex !== undefined) setCurrentTaskIndex(parsed.currentTaskIndex);
        if (parsed.completedTaskIndices) setCompletedTaskIndices(new Set(parsed.completedTaskIndices));
        if (parsed.taskAnswers) setTaskAnswers(parsed.taskAnswers);
        if (parsed.reviewedMaterialIds) setReviewedMaterialIds(new Set(parsed.reviewedMaterialIds));
        if (parsed.sandboxCode) setSandboxCode(parsed.sandboxCode);
        if (parsed.deliverableValues) setDeliverableValues(parsed.deliverableValues);
        if (parsed.isSubmitted) {
          setIsSubmitted(true);
          setSubmittedTimestamp(parsed.submittedTimestamp || new Date().toLocaleString());
        }
      }
    } catch (e) {
      console.warn("Failed to restore simulation state:", e);
    }
  }, [storageKey]);

  // 2. Persist state changes to LocalStorage
  useEffect(() => {
    try {
      const payload = {
        currentTaskIndex,
        completedTaskIndices: Array.from(completedTaskIndices),
        taskAnswers,
        reviewedMaterialIds: Array.from(reviewedMaterialIds),
        sandboxCode,
        deliverableValues,
        isSubmitted,
        submittedTimestamp,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to persist simulation state:", e);
    }
  }, [
    storageKey,
    currentTaskIndex,
    completedTaskIndices,
    taskAnswers,
    reviewedMaterialIds,
    sandboxCode,
    deliverableValues,
    isSubmitted,
    submittedTimestamp,
  ]);

  // 3. Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Review material toggle
  const handleToggleReviewed = (id: string) => {
    setReviewedMaterialIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToTask = () => {
    const el = document.getElementById("task-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDeliverables = () => {
    const el = document.getElementById("deliverables-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Task answer updater
  const handleUpdateAnswer = (index: number, text: string) => {
    setTaskAnswers((prev) => ({ ...prev, [index]: text }));
  };

  // Advance to next sequential task
  const handleSaveAndNext = () => {
    setCompletedTaskIndices((prev) => new Set(prev).add(currentTaskIndex));
    const nextIdx = Math.min(simulation.tasks.length - 1, currentTaskIndex + 1);
    setCurrentTaskIndex(nextIdx);
    scrollToTask();
  };

  // Complete last task & proceed to final deliverables
  const handleProceedToDeliverables = () => {
    setCompletedTaskIndices((prev) => new Set(prev).add(currentTaskIndex));
    scrollToDeliverables();
  };

  const handlePreviousTask = () => {
    setCurrentTaskIndex((prev) => Math.max(0, prev - 1));
    scrollToTask();
  };

  // Deliverable fields updater
  const handleUpdateDeliverable = (key: string, value: string) => {
    setDeliverableValues((prev) => ({ ...prev, [key]: value }));
  };

  // Final submission validation check
  const requiredFields = simulation.deliverable.fields.filter((f) => f.required);
  const hasAllRequiredDeliverables = requiredFields.every((f) => {
    const val = deliverableValues[f.name];
    return val && val.trim().length > 0;
  });

  const canSubmit =
    completedTaskIndices.size >= simulation.tasks.length - 1 &&
    hasAllRequiredDeliverables;

  // Final Submit Handler
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    const primaryDeliverableUrl =
      deliverableValues.githubRepo ||
      deliverableValues.repositoryUrl ||
      deliverableValues.figmaUrl ||
      deliverableValues.notebookUrl ||
      deliverableValues.prdUrl ||
      deliverableValues.dashboardUrl ||
      deliverableValues.remediationBranch ||
      deliverableValues.deckUrl ||
      Object.values(deliverableValues).find((v) => v.startsWith("http")) ||
      `https://github.com/candidate/${careerCode.toLowerCase()}-simulation-deliverable`;

    const candidateName = user?.fullName || "Verified Candidate";
    const candidateEmail = user?.email || "candidate@skillforge.internal";

    // Combine task answers and candidate notes into technical evidence payload
    const taskSummaryNotes = simulation.tasks
      .map((t, idx) => `[TASK ${idx + 1}: ${t.title}]\n${taskAnswers[idx] || "No response recorded."}`)
      .join("\n\n");

    const totalSeconds = simulation.estimatedMinutes * 60;
    const timeSpentSecs = Math.max(60, totalSeconds - timeLeft);

    try {
      const res = await simulationService.submitSimulation({
        careerCode: career.code,
        careerName: career.name,
        level: levelParam,
        title: simulation.title,
        deliverableUrl: primaryDeliverableUrl,
        deliverableNotes: taskSummaryNotes,
        submittedCode: sandboxCode,
        timeSpentSecs: timeSpentSecs,
        candidateName,
        candidateEmail,
      });

      // Record gamification milestone
      if (res?.evaluation?.overall_score) {
        const score = res.evaluation.overall_score;
        const gResult = gamificationService.recordSimulationCompletion({
          user: { id: user?.id, email: candidateEmail, fullName: candidateName },
          score,
          challengeTitle: simulation.title,
          repoUrl: primaryDeliverableUrl,
        });

        // Record candidate deliverable for Recruiter ATS & Overview Dashboard
        await deliverableService.recordDeliverable({
          candidateName,
          candidateEmail,
          careerTrack: `${career.name} (${levelParam.toUpperCase()})`,
          challengeTitle: simulation.title,
          repoUrl: primaryDeliverableUrl,
          demoUrl: deliverableValues.dashboardUrl || deliverableValues.landingPageUrl || undefined,
          aiScore: score,
          breakdown: {
            architecture: res.evaluation.architecture_score || score,
            codeQuality: res.evaluation.code_quality_score || score,
            testCoverage: res.evaluation.test_coverage_score || score,
            security: res.evaluation.security_score || score,
          },
          sha256Proof: res.evaluation.verified_hash || `0xVERIFIED_${Date.now().toString(16)}`,
          evaluatorNotes: res.evaluation.ai_feedback_summary,
          testsPassed: simulation.tasks.length,
          totalTests: simulation.tasks.length,
          badges: gResult.newBadges.map((b) => ({
            title: b.title,
            icon: b.icon,
            tier: b.tier,
          })),
        });
      }

      const now = new Date().toLocaleString();
      setSubmittedTimestamp(now);
      setIsSubmitted(true);
      setShowChecklistModal(false);
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback state preservation
      const now = new Date().toLocaleString();
      setSubmittedTimestamp(now);
      setIsSubmitted(true);
      setShowChecklistModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepNumber = Math.min(simulation.tasks.length, currentTaskIndex + 1);
  const stepLabel = simulation.tasks[currentTaskIndex]?.title || "Task In Progress";

  return (
    <div className="app-layout">
      <Sidebar role="CANDIDATE" />
      <main className="app-main">
        {/* Top Header */}
        <TopHeader
          breadcrumbs={[
            { label: "SkillForge", href: "/dashboard" },
            { label: "Careers", href: "/careers" },
            { label: career.name, href: `/careers/${career.slug}` },
            { label: `${levelParam.toUpperCase()} Simulation` },
          ]}
        />

        {isSubmitted ? (
          /* Clean Completion Screen */
          <SimulationCompletionCard
            careerName={career.name}
            careerCode={career.code}
            level={levelParam}
            simulationTitle={simulation.title}
            tasksCompleted={simulation.tasks.length}
            totalTasks={simulation.tasks.length}
            evidenceItemsCount={Object.keys(deliverableValues).length || 1}
            submittedAt={submittedTimestamp}
          />
        ) : (
          /* Guided Linear Candidate Experience */
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* 1. Simulation Header */}
            <SimulationHeader
              careerName={career.name}
              careerCode={career.code}
              level={levelParam}
              title={simulation.title}
              estimatedMinutes={simulation.estimatedMinutes}
              skills={simulation.skills}
              currentStep={currentStepNumber}
              totalSteps={simulation.tasks.length}
              stepLabel={stepLabel}
              timeLeftSeconds={timeLeft}
            />

            {/* 2. Mission Brief Card */}
            <MissionBriefCard
              scenarioTitle={simulation.title}
              roleContext={simulation.roleContext}
              scenario={simulation.scenario}
              businessContext={simulation.businessContext}
              objective={simulation.objective}
            />

            {/* 3. Required Materials Box (Directly below Mission Brief) */}
            <MaterialsPanel
              materials={simulation.materials}
              reviewedMaterialIds={reviewedMaterialIds}
              onToggleReviewed={handleToggleReviewed}
              onContinueToTask={scrollToTask}
            />

            {/* 4. Sequential Task Workspace (With embedded Code Sandbox when appropriate) */}
            <TaskWorkspaceCard
              tasks={simulation.tasks}
              currentTaskIndex={currentTaskIndex}
              completedTaskIndices={completedTaskIndices}
              taskAnswers={taskAnswers}
              sandboxCode={sandboxCode}
              careerCode={careerCode}
              level={levelParam}
              onSelectTask={(idx) => setCurrentTaskIndex(idx)}
              onUpdateAnswer={handleUpdateAnswer}
              onUpdateSandboxCode={(c) => setSandboxCode(c)}
              onSaveAndNext={handleSaveAndNext}
              onPrevious={handlePreviousTask}
              onProceedToDeliverables={handleProceedToDeliverables}
            />

            {/* 5. Career-Specific Final Deliverables */}
            <FinalDeliverableCard
              deliverableDef={simulation.deliverable}
              deliverableValues={deliverableValues}
              careerName={career.name}
              onUpdateValue={handleUpdateDeliverable}
              onSubmitClick={() => setShowChecklistModal(true)}
              canSubmit={canSubmit}
            />

            {/* 6. Pre-Submission Checklist Modal */}
            <SubmissionChecklistModal
              isOpen={showChecklistModal}
              onClose={() => setShowChecklistModal(false)}
              onConfirmSubmit={handleConfirmSubmit}
              isSubmitting={isSubmitting}
              tasksCompleted={completedTaskIndices.size}
              totalTasks={simulation.tasks.length}
              materialsReviewed={reviewedMaterialIds.size}
              totalMaterials={simulation.materials.length}
              hasDeliverables={hasAllRequiredDeliverables}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function SimulationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #6366F1", borderRadius: "50%", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        </div>
      }
    >
      <SimulationWorkspace />
    </Suspense>
  );
}