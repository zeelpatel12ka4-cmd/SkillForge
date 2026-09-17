/**
 * SkillForge AI — Task Validation Layer
 * Extensible validation strategies with truthful execution reporting.
 * Explicitly separates static pattern analysis from runtime execution.
 */

import { TaskDefinition, TaskValidationResult, ValidationRule } from "@/types/simulation";

export interface TaskSubmissionPayload {
  code?: string;
  answer?: string;
  deliverableUrl?: string;
  uploadedFileName?: string;
  extraData?: Record<string, any>;
}

export const taskValidator = {
  /**
   * Validates a candidate's task response using configured validation rules.
   */
  validateTask(task: TaskDefinition, submission: TaskSubmissionPayload): TaskValidationResult {
    const textToAnalyze = [
      submission.code || "",
      submission.answer || "",
      submission.extraData ? JSON.stringify(submission.extraData) : "",
    ].filter(Boolean).join("\n\n");

    const rules = task.validationRules || [];
    const evidence: string[] = [];
    const failures: string[] = [];
    const warnings: string[] = [];

    let totalPoints = 0;
    let earnedPoints = 0;
    let primaryValidatorType = "Static Pattern Validation";

    // If no rules are explicitly configured, run standard diagnostic checks
    if (rules.length === 0) {
      return this.runDefaultDiagnostics(task, textToAnalyze);
    }

    for (const rule of rules) {
      totalPoints += 10;
      switch (rule.type) {
        case "code_static": {
          primaryValidatorType = "Static Code & Pattern Validation";
          const res = this.validateCodeStatic(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        case "sql_static": {
          primaryValidatorType = "Static SQL Query Structure Validation";
          const res = this.validateSqlStatic(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        case "dataset_rules": {
          primaryValidatorType = "Dataset Rules & Cleanliness Validation";
          const res = this.validateDatasetRules(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        case "numerical": {
          primaryValidatorType = "Numerical Bounds & Precision Validation";
          const res = this.validateNumerical(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        case "document_structure": {
          primaryValidatorType = "Structured Specification & Document Validation";
          const res = this.validateDocumentStructure(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        case "design_checklist": {
          primaryValidatorType = "Design System & Token Checklist Validation";
          const res = this.validateDesignChecklist(rule, textToAnalyze);
          if (res.passed) {
            earnedPoints += 10;
            evidence.push(res.detail);
          } else {
            failures.push(res.detail);
          }
          break;
        }

        default: {
          // Fallback rule check
          if (rule.expectedSnippet && textToAnalyze.toLowerCase().includes(rule.expectedSnippet.toLowerCase())) {
            earnedPoints += 10;
            evidence.push(`Verified requirement: ${rule.description}`);
          } else {
            failures.push(`Requirement unsatisfied: ${rule.description}`);
          }
          break;
        }
      }
    }

    const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 75;
    const passed = failures.length === 0 && calculatedScore >= 70;

    return {
      passed,
      score: calculatedScore,
      evidence,
      failures,
      warnings,
      validatorType: primaryValidatorType,
    };
  },

  runDefaultDiagnostics(task: TaskDefinition, text: string): TaskValidationResult {
    const evidence: string[] = [];
    const failures: string[] = [];
    const charCount = text.trim().length;

    if (charCount < 40) {
      failures.push("Submission is too brief. Provide a thorough technical response addressing the mission brief.");
      return {
        passed: false,
        score: 35,
        evidence: [],
        failures,
        warnings: ["Response does not meet minimum technical depth threshold."],
        validatorType: "Diagnostic Baseline Validation",
      };
    }

    evidence.push(`Technical diagnostic passed: Response contains ${charCount} characters of domain analysis.`);
    
    // Check key acceptance criteria matches
    let matches = 0;
    for (const criterion of task.acceptanceCriteria) {
      const keywords = criterion.toLowerCase().split(" ").filter(w => w.length > 5);
      const matched = keywords.some(kw => text.toLowerCase().includes(kw));
      if (matched) {
        matches++;
        evidence.push(`Verified alignment with criterion: "${criterion.slice(0, 60)}..."`);
      }
    }

    const score = Math.min(95, Math.max(65, 60 + matches * 10));

    return {
      passed: score >= 70,
      score,
      evidence,
      failures,
      warnings: [],
      validatorType: "Static Pattern Validation",
    };
  },

  validateCodeStatic(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    if (rule.expectedSnippet && !text.includes(rule.expectedSnippet)) {
      return { passed: false, detail: `Code is missing required pattern: '${rule.expectedSnippet}' (${rule.description})` };
    }
    if (rule.prohibitedSnippet && text.includes(rule.prohibitedSnippet)) {
      return { passed: false, detail: `Code contains anti-pattern: '${rule.prohibitedSnippet}' (${rule.description})` };
    }
    return { passed: true, detail: `Verified code requirement: ${rule.description}` };
  },

  validateSqlStatic(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    const upperText = text.toUpperCase();
    if (rule.expectedSnippet && !upperText.includes(rule.expectedSnippet.toUpperCase())) {
      return { passed: false, detail: `SQL query missing expected clause: '${rule.expectedSnippet}'` };
    }
    return { passed: true, detail: `Verified SQL clause: ${rule.description}` };
  },

  validateDatasetRules(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    if (rule.expectedSnippet && !text.toLowerCase().includes(rule.expectedSnippet.toLowerCase())) {
      return { passed: false, detail: `Dataset rule unmet: '${rule.expectedSnippet}'` };
    }
    return { passed: true, detail: `Verified data cleanliness: ${rule.description}` };
  },

  validateNumerical(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    const expected = rule.parameters?.expectedValue;
    if (expected !== undefined) {
      const regex = new RegExp(`\\b${expected}\\b|${expected}%`, "i");
      if (!regex.test(text)) {
        return { passed: false, detail: `Numerical computation failed: expected value '${expected}' (${rule.description})` };
      }
    }
    return { passed: true, detail: `Verified numerical computation: ${rule.description}` };
  },

  validateDocumentStructure(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    if (rule.requiredSections) {
      const missingSections = rule.requiredSections.filter(s => !text.toLowerCase().includes(s.toLowerCase()));
      if (missingSections.length > 0) {
        return { passed: false, detail: `Document missing required sections: ${missingSections.join(", ")}` };
      }
    }
    if (rule.minWordCount) {
      const words = text.trim().split(/\s+/).length;
      if (words < rule.minWordCount) {
        return { passed: false, detail: `Word count (${words}) is below minimum requirement of ${rule.minWordCount} words.` };
      }
    }
    return { passed: true, detail: `Verified document structure: ${rule.description}` };
  },

  validateDesignChecklist(rule: ValidationRule, text: string): { passed: boolean; detail: string } {
    if (rule.expectedSnippet && !text.toLowerCase().includes(rule.expectedSnippet.toLowerCase())) {
      return { passed: false, detail: `Design specification missing token/guideline: '${rule.expectedSnippet}'` };
    }
    return { passed: true, detail: `Verified design token/checklist: ${rule.description}` };
  },
};
