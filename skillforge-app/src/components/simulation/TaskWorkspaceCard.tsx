"use client";
import React, { useState, useEffect } from "react";
import { TaskDefinition } from "@/types/simulation";
import { sandboxService, SandboxExecutionReport } from "@/services/sandboxService";

interface TaskWorkspaceCardProps {
  tasks: TaskDefinition[];
  currentTaskIndex: number;
  completedTaskIndices: Set<number>;
  taskAnswers: Record<number, string>;
  sandboxCode: string;
  careerCode: string;
  level: string;
  onSelectTask: (index: number) => void;
  onUpdateAnswer: (taskIndex: number, answer: string) => void;
  onUpdateSandboxCode: (code: string) => void;
  onSaveAndNext: () => void;
  onPrevious: () => void;
  onProceedToDeliverables: () => void;
}

export default function TaskWorkspaceCard({
  tasks,
  currentTaskIndex,
  completedTaskIndices,
  taskAnswers,
  sandboxCode,
  careerCode,
  level,
  onSelectTask,
  onUpdateAnswer,
  onUpdateSandboxCode,
  onSaveAndNext,
  onPrevious,
  onProceedToDeliverables,
}: TaskWorkspaceCardProps) {
  const currentTask = tasks[currentTaskIndex] || tasks[0];
  const responseText = taskAnswers[currentTaskIndex] || "";

  // Sandbox state
  const [runningTests, setRunningTests] = useState(false);
  const [sandboxReport, setSandboxReport] = useState<SandboxExecutionReport | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Determine whether current task involves code workspace
  const hasCodeWorkspace =
    currentTask.type === "implementation" ||
    (currentTask.validationRules &&
      currentTask.validationRules.some((r) => r.type === "code_static" || r.type === "sql_static"));

  const starter = sandboxService.getStarterCode(careerCode, level);

  const handleRunTests = () => {
    setRunningTests(true);
    setTimeout(() => {
      const report = sandboxService.runSandboxTests(careerCode, level, sandboxCode);
      setSandboxReport(report);
      setRunningTests(false);
    }, 300);
  };

  const handleResetCode = () => {
    onUpdateSandboxCode(starter.starterCode);
    setSandboxReport(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveStatus("saving");
    onUpdateAnswer(currentTaskIndex, e.target.value);
    setTimeout(() => setSaveStatus("saved"), 400);
  };

  const isLastTask = currentTaskIndex === tasks.length - 1;
  const canAdvance = responseText.trim().length >= 15 || (hasCodeWorkspace && sandboxReport && sandboxReport.passed);

  return (
    <div
      id="task-section"
      className="card"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        padding: "28px 32px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* 1. Linear Task Stepper */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 10 }}>
          TASK PROGRESSION (STEP {currentTaskIndex + 1} OF {tasks.length})
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {tasks.map((task, idx) => {
            const isCompleted = completedTaskIndices.has(idx);
            const isCurrent = idx === currentTaskIndex;
            const isAccessible = idx === 0 || completedTaskIndices.has(idx - 1) || isCompleted;

            return (
              <button
                key={task.id}
                disabled={!isAccessible}
                onClick={() => onSelectTask(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: isCurrent
                    ? "2px solid var(--color-primary)"
                    : isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid var(--border-subtle)",
                  background: isCurrent
                    ? "rgba(99, 102, 241, 0.08)"
                    : isCompleted
                    ? "rgba(16, 185, 129, 0.06)"
                    : "var(--bg-subtle)",
                  color: isCurrent
                    ? "var(--color-primary)"
                    : isCompleted
                    ? "var(--color-success)"
                    : "var(--text-tertiary)",
                  fontWeight: isCurrent ? 800 : 600,
                  fontSize: "0.82rem",
                  cursor: isAccessible ? "pointer" : "not-allowed",
                  opacity: isAccessible ? 1 : 0.55,
                  transition: "all 0.15s ease",
                }}
              >
                <span>
                  {isCompleted ? "✓" : isCurrent ? "●" : "○"} Task {idx + 1}
                </span>
                <span style={{ fontSize: "0.74rem", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Task Header & Prompt */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "var(--radius-lg)",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="badge badge-primary"
              style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase" }}
            >
              TASK {currentTaskIndex + 1}
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
              Weight: {currentTask.rubricWeight}%
            </span>
          </div>

          <div style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
            ⏱️ Est. <strong>~{currentTask.timeEstimateMins} mins</strong>
          </div>
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          {currentTask.title}
        </h3>

        <div style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
          {currentTask.context}
        </div>

        {/* Core Prompt */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-primary)", marginBottom: 4 }}>
            Manager Assignment:
          </div>
          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>
            {currentTask.prompt}
          </p>
        </div>

        {/* Acceptance Criteria */}
        <div>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 6 }}>
            Acceptance Criteria:
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {currentTask.acceptanceCriteria.map((crit, cIdx) => (
              <li key={cIdx}>{crit}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Contextual Code Workspace (Embedded when task requires code) */}
      {hasCodeWorkspace && (
        <div
          style={{
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: 24,
            background: "#0F172A",
          }}
        >
          {/* Editor Header Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              background: "#1E293B",
              borderBottom: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.85rem", color: "#38BDF8", fontWeight: 700, fontFamily: "monospace" }}>
                📄 {starter.filename}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase" }}>
                {starter.language}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={handleResetCode}
                style={{
                  background: "transparent",
                  border: "1px solid #475569",
                  color: "#94A3B8",
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                }}
              >
                Reset Code
              </button>

              <button
                onClick={handleRunTests}
                disabled={runningTests}
                className="btn btn-primary"
                style={{
                  fontSize: "0.82rem",
                  padding: "5px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{runningTests ? "Evaluating..." : "▶ Run Tests"}</span>
              </button>
            </div>
          </div>

          {/* Monospace Code Editor */}
          <textarea
            value={sandboxCode}
            onChange={(e) => onUpdateSandboxCode(e.target.value)}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: "260px",
              padding: "16px",
              background: "#0F172A",
              color: "#F8FAFC",
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: "0.88rem",
              lineHeight: 1.6,
              border: "none",
              outline: "none",
              resize: "vertical",
            }}
          />

          {/* Test Results Output */}
          {sandboxReport && (
            <div
              style={{
                padding: "14px 18px",
                borderTop: "1px solid #334155",
                background: sandboxReport.passed ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: sandboxReport.passed ? "#10B981" : "#F43F5E",
                  }}
                >
                  {sandboxReport.passed
                    ? `✓ Static validation completed: ${sandboxReport.passedCount}/${sandboxReport.total} checks passed`
                    : `✕ Validation failed: ${sandboxReport.passedCount}/${sandboxReport.total} checks passed`}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                  Duration: {sandboxReport.runtimeMs}ms
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {sandboxReport.results.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      fontSize: "0.8rem",
                      color: r.passed ? "#A7F3D0" : "#FECDD3",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{r.passed ? "✓" : "✕"}</span>
                    <span>{r.name}</span>
                    {r.error && <span style={{ color: "#FDA4AF" }}>({r.error})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Candidate Response Editor */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
            YOUR RESPONSE & TECHNICAL EVIDENCE
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
              {saveStatus === "saving" ? "Saving draft..." : "✓ Draft auto-saved"}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
              {responseText.length} characters
            </span>
          </div>
        </div>

        <textarea
          value={responseText}
          onChange={handleTextChange}
          placeholder="Explain your diagnosis, root cause, proposed solution, edge cases covered, and validation approach..."
          rows={7}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-default)",
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            fontSize: "0.92rem",
            lineHeight: 1.6,
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />

        <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: 6 }}>
          💡 Be rigorous: State what failed, provide rationale for your choices, and address all acceptance criteria.
        </div>
      </div>

      {/* 5. Navigation Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 16,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <button
          onClick={onPrevious}
          disabled={currentTaskIndex === 0}
          className="btn btn-secondary"
          style={{
            padding: "9px 18px",
            fontSize: "0.88rem",
            fontWeight: 600,
            opacity: currentTaskIndex === 0 ? 0.4 : 1,
            cursor: currentTaskIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Previous Task
        </button>

        {isLastTask ? (
          <button
            onClick={onProceedToDeliverables}
            disabled={!canAdvance}
            className="btn btn-primary"
            style={{
              padding: "10px 24px",
              fontSize: "0.92rem",
              fontWeight: 800,
              borderRadius: "var(--radius-md)",
              opacity: canAdvance ? 1 : 0.6,
              cursor: canAdvance ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Complete Task & Proceed to Deliverables</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={onSaveAndNext}
            disabled={!canAdvance}
            className="btn btn-primary"
            style={{
              padding: "10px 22px",
              fontSize: "0.9rem",
              fontWeight: 700,
              borderRadius: "var(--radius-md)",
              opacity: canAdvance ? 1 : 0.6,
              cursor: canAdvance ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Save & Next Task</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
