/**
 * SkillForge AI — Master Simulation Bank
 * 8 Canonical Careers × 3 Seniority Levels = 24 Complete Practical Work Simulation Packages.
 * Single source of truth. Zero generic fallbacks.
 */

import { CareerCode, SeniorityLevel, SimulationDefinition } from "@/types/simulation";
import { normalizeTrackCode } from "./careerRegistry";

import {
  SD_FRESHER_SIMULATION,
  SD_JUNIOR_SIMULATION,
  SD_SENIOR_SIMULATION,
} from "./simulations/sdSimulations";

import {
  DA_FRESHER_SIMULATION,
  DA_JUNIOR_SIMULATION,
  DA_SENIOR_SIMULATION,
} from "./simulations/daSimulations";

import {
  UX_FRESHER_SIMULATION,
  UX_JUNIOR_SIMULATION,
  UX_SENIOR_SIMULATION,
} from "./simulations/uxSimulations";

import {
  AI_FRESHER_SIMULATION,
  AI_JUNIOR_SIMULATION,
  AI_SENIOR_SIMULATION,
} from "./simulations/aiSimulations";

import {
  CYBER_FRESHER_SIMULATION,
  CYBER_JUNIOR_SIMULATION,
  CYBER_SENIOR_SIMULATION,
} from "./simulations/cyberSimulations";

import {
  PM_FRESHER_SIMULATION,
  PM_JUNIOR_SIMULATION,
  PM_SENIOR_SIMULATION,
} from "./simulations/pmSimulations";

import {
  DM_FRESHER_SIMULATION,
  DM_JUNIOR_SIMULATION,
  DM_SENIOR_SIMULATION,
} from "./simulations/dmSimulations";

import {
  SALES_FRESHER_SIMULATION,
  SALES_JUNIOR_SIMULATION,
  SALES_SENIOR_SIMULATION,
} from "./simulations/salesSimulations";

export const SIMULATION_BANK: Record<CareerCode, Record<SeniorityLevel, SimulationDefinition>> = {
  SD: {
    fresher: SD_FRESHER_SIMULATION,
    junior: SD_JUNIOR_SIMULATION,
    senior: SD_SENIOR_SIMULATION,
  },
  DA: {
    fresher: DA_FRESHER_SIMULATION,
    junior: DA_JUNIOR_SIMULATION,
    senior: DA_SENIOR_SIMULATION,
  },
  UX: {
    fresher: UX_FRESHER_SIMULATION,
    junior: UX_JUNIOR_SIMULATION,
    senior: UX_SENIOR_SIMULATION,
  },
  AI: {
    fresher: AI_FRESHER_SIMULATION,
    junior: AI_JUNIOR_SIMULATION,
    senior: AI_SENIOR_SIMULATION,
  },
  CYBER: {
    fresher: CYBER_FRESHER_SIMULATION,
    junior: CYBER_JUNIOR_SIMULATION,
    senior: CYBER_SENIOR_SIMULATION,
  },
  PM: {
    fresher: PM_FRESHER_SIMULATION,
    junior: PM_JUNIOR_SIMULATION,
    senior: PM_SENIOR_SIMULATION,
  },
  DM: {
    fresher: DM_FRESHER_SIMULATION,
    junior: DM_JUNIOR_SIMULATION,
    senior: DM_SENIOR_SIMULATION,
  },
  SALES: {
    fresher: SALES_FRESHER_SIMULATION,
    junior: SALES_JUNIOR_SIMULATION,
    senior: SALES_SENIOR_SIMULATION,
  },
};

/**
 * Retrieves a simulation package from the canonical catalog.
 * Throws explicit error if missing. Never falls back to an unrelated track.
 */
export function getSimulation(careerCodeOrAlias: string, levelStr: string): SimulationDefinition {
  const code = normalizeTrackCode(careerCodeOrAlias);
  const level = (levelStr || "junior").toLowerCase() as SeniorityLevel;

  if (!["fresher", "junior", "senior"].includes(level)) {
    throw new Error(
      `SIMULATION_NOT_CONFIGURED: Invalid seniority level '${levelStr}'. Must be 'fresher', 'junior', or 'senior'.`
    );
  }

  const trackBank = SIMULATION_BANK[code];
  if (!trackBank) {
    throw new Error(
      `SIMULATION_NOT_CONFIGURED: No simulations configured for career track '${careerCodeOrAlias}'.`
    );
  }

  const simulation = trackBank[level];
  if (!simulation) {
    throw new Error(
      `SIMULATION_NOT_CONFIGURED: No simulation configured for career '${code}' at level '${level}'.`
    );
  }

  return simulation;
}

/**
 * Returns a flat list of all 24 simulations in the bank.
 */
export function getAllSimulations(): SimulationDefinition[] {
  const all: SimulationDefinition[] = [];
  for (const track of Object.values(SIMULATION_BANK)) {
    for (const sim of Object.values(track)) {
      all.push(sim);
    }
  }
  return all;
}

/**
 * Retrieves a simulation by its unique ID (e.g. "SIM-SD-JUN-001").
 */
export function getSimulationById(id: string): SimulationDefinition {
  for (const track of Object.values(SIMULATION_BANK)) {
    for (const sim of Object.values(track)) {
      if (sim.id === id) return sim;
    }
  }
  throw new Error(`SIMULATION_NOT_CONFIGURED: Simulation with ID '${id}' was not found in catalog.`);
}
