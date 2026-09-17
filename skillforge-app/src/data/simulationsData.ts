/**
 * SkillForge AI — Simulations Data Adapter
 * Bridges existing components to the canonical Master Simulation Bank.
 * Throws SIMULATION_NOT_CONFIGURED on missing tracks. Zero generic fallbacks.
 */

import { getSimulation, SIMULATION_BANK, getAllSimulations } from "./simulationBank";
import { getCanonicalCareer, normalizeTrackCode } from "./careerRegistry";
import { SimulationDefinition, CareerCode, SeniorityLevel } from "@/types/simulation";

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
  simulationDefinition?: SimulationDefinition;
}

/**
 * Converts a canonical SimulationDefinition into the UI-compatible SimulationConfig.
 */
export function formatSimulationConfig(sim: SimulationDefinition): SimulationConfig {
  const career = getCanonicalCareer(sim.careerCode);
  return {
    trackCode: sim.careerCode,
    trackName: career.name,
    trackEmoji: career.emoji,
    trackColor: career.color,
    level: sim.level,
    title: sim.title,
    scenario: sim.scenario,
    tasks: sim.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      prompt: t.prompt,
      dimension: t.dimension,
    })),
    materials: sim.materials.map((m) => ({
      title: m.title,
      description: m.description,
      type: (m.type === "config" || m.type === "metrics" || m.type === "transcript" ? "docs" : m.type) as any,
      filename: m.filename,
      content: m.content,
    })),
    simulationDefinition: sim,
  };
}

/**
 * Retrieves the simulation config for a given track and level.
 * Throws SIMULATION_NOT_CONFIGURED if not found.
 */
export function getSimulationConfig(trackCode: string, level: "fresher" | "junior" | "senior"): SimulationConfig {
  const sim = getSimulation(trackCode, level);
  return formatSimulationConfig(sim);
}

/**
 * Backwards-compatible map of all simulations.
 */
export const SIMULATIONS_DATA: Record<string, Record<string, SimulationConfig>> = {};

for (const [code, levels] of Object.entries(SIMULATION_BANK)) {
  SIMULATIONS_DATA[code] = {
    fresher: formatSimulationConfig(levels.fresher),
    junior: formatSimulationConfig(levels.junior),
    senior: formatSimulationConfig(levels.senior),
  };
}
