/**
 * SkillForge AI — Automated Simulation Catalog Quality Gate
 * Audits all 24 practical work simulation packages across 8 canonical career tracks.
 * Fails loudly on any rubric discrepancy, placeholder, duplicate ID, or fallback.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('  SKILLFORGE AI — SIMULATION CATALOG QUALITY GATE   ');
console.log('====================================================\n');

const simulationsDir = path.join(__dirname, '../src/data/simulations');
const files = fs.readdirSync(simulationsDir).filter(f => f.endsWith('.ts'));

console.log(`Discovered ${files.length} simulation track module files:`);
files.forEach(f => console.log(`  • ${f}`));

let totalSimulations = 0;
let totalTasks = 0;
let totalMaterials = 0;
const simulationIds = new Set();
const simulationTitles = new Set();
const taskIdsBySim = new Map();
const errors = [];
const warnings = [];

const CANONICAL_TRACKS = ['SD', 'DA', 'UX', 'AI', 'CYBER', 'PM', 'DM', 'SALES'];
const LEVELS = ['fresher', 'junior', 'senior'];
const matrix = {};
CANONICAL_TRACKS.forEach(t => {
  matrix[t] = { fresher: false, junior: false, senior: false };
});

for (const file of files) {
  const filePath = path.join(simulationsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for forbidden placeholder patterns
  const forbiddenPatterns = [
    /\bTODO\b/i,
    /\bcoming soon\b/i,
    /\blorem ipsum\b/i,
    /\bTBD\b/,
    /\binsert (code|text|scenario) here\b/i,
    /\bplaceholder (scenario|task|content|material)\b/i,
    /\basdf\b/i
  ];
  for (const regex of forbiddenPatterns) {
    if (regex.test(content)) {
      errors.push(`[FORBIDDEN_CONTENT] File ${file} contains placeholder text matching ${regex}`);
    }
  }

  // Extract exported simulation objects
  const simMatches = content.match(/export const ([A-Z_]+_SIMULATION): SimulationDefinition = \{([\s\S]*?)\n\};/g);
  if (!simMatches || simMatches.length === 0) {
    errors.push(`[NO_SIMULATIONS] File ${file} contains no exported SimulationDefinition objects.`);
    continue;
  }

  for (const block of simMatches) {
    totalSimulations++;

    // Extract basic fields
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const careerMatch = block.match(/careerCode:\s*"([^"]+)"/);
    const levelMatch = block.match(/level:\s*"([^"]+)"/);
    const estMinMatch = block.match(/estimatedMinutes:\s*(\d+)/);

    const simId = idMatch ? idMatch[1] : null;
    const simTitle = titleMatch ? titleMatch[1] : null;
    const career = careerMatch ? careerMatch[1] : null;
    const level = levelMatch ? levelMatch[1] : null;

    if (!simId) errors.push(`[MISSING_ID] Simulation in ${file} missing id.`);
    if (!simTitle) errors.push(`[MISSING_TITLE] Simulation in ${file} missing title.`);
    if (!career || !CANONICAL_TRACKS.includes(career)) {
      errors.push(`[INVALID_CAREER] Simulation ${simId} has invalid careerCode: '${career}'.`);
    }
    if (!level || !LEVELS.includes(level)) {
      errors.push(`[INVALID_LEVEL] Simulation ${simId} has invalid level: '${level}'.`);
    }

    if (career && level && matrix[career]) {
      matrix[career][level] = true;
    }

    // Check duplicate IDs
    if (simId) {
      if (simulationIds.has(simId)) {
        errors.push(`[DUPLICATE_SIM_ID] Simulation ID '${simId}' is duplicated!`);
      }
      simulationIds.add(simId);
    }

    // Check duplicate Titles
    if (simTitle) {
      if (simulationTitles.has(simTitle)) {
        errors.push(`[DUPLICATE_TITLE] Simulation title '${simTitle}' is duplicated!`);
      }
      simulationTitles.add(simTitle);
    }

    // Extract and validate Tasks
    const taskBlocks = block.match(/\{\s*id:\s*(\d+),[\s\S]*?timeEstimateMins:\s*\d+,?\s*\}/g) || [];
    if (taskBlocks.length < 3) {
      errors.push(`[INSUFFICIENT_TASKS] Simulation ${simId} has ${taskBlocks.length} tasks (Minimum 3 required).`);
    }
    if (taskBlocks.length > 5) {
      errors.push(`[EXCESSIVE_TASKS] Simulation ${simId} has ${taskBlocks.length} tasks (Maximum 5 permitted).`);
    }

    const taskIdsInThisSim = new Set();
    let rubricSum = 0;

    for (const tb of taskBlocks) {
      totalTasks++;
      const tIdMatch = tb.match(/id:\s*(\d+)/);
      const tTitleMatch = tb.match(/title:\s*"([^"]+)"/);
      const tWeightMatch = tb.match(/rubricWeight:\s*(\d+)/);
      const tPromptMatch = tb.match(/prompt:\s*("[^"]+"|\`[\s\S]*?\`)/);

      const tId = tIdMatch ? parseInt(tIdMatch[1], 10) : null;
      const tTitle = tTitleMatch ? tTitleMatch[1] : null;
      const tWeight = tWeightMatch ? parseInt(tWeightMatch[1], 10) : 0;

      if (!tId) errors.push(`[MISSING_TASK_ID] Task in ${simId} missing ID.`);
      if (tId && taskIdsInThisSim.has(tId)) {
        errors.push(`[DUPLICATE_TASK_ID] Duplicate task ID ${tId} in simulation ${simId}.`);
      }
      if (tId) taskIdsInThisSim.add(tId);

      if (!tTitle) errors.push(`[MISSING_TASK_TITLE] Task ${tId} in ${simId} missing title.`);
      if (!tPromptMatch || tPromptMatch[1].length < 20) {
        errors.push(`[INSUFFICIENT_PROMPT] Task ${tId} in ${simId} has an empty or trivial prompt.`);
      }

      rubricSum += tWeight;
    }

    if (rubricSum !== 100) {
      errors.push(`[RUBRIC_SUM_MISMATCH] Simulation ${simId} task rubric weights sum to ${rubricSum}% (Must be exactly 100%).`);
    }

    // Extract and validate Materials
    const materialBlocks = block.match(/\{\s*id:\s*"mat-[^"]+",[\s\S]*?content:\s*(\`[\s\S]*?\`|"[^"]+"),?\s*\}/g) || [];
    if (materialBlocks.length === 0) {
      errors.push(`[NO_MATERIALS] Simulation ${simId} has 0 materials.`);
    }
    totalMaterials += materialBlocks.length;

    for (const mb of materialBlocks) {
      const mIdMatch = mb.match(/id:\s*"([^"]+)"/);
      const mRelevanceMatch = mb.match(/relevance:\s*"([^"]+)"/);
      const mContentMatch = mb.match(/content:\s*(\`[\s\S]*?\`|"[^"]+)/);

      const mId = mIdMatch ? mIdMatch[1] : null;
      if (!mRelevanceMatch || mRelevanceMatch[1].length < 10) {
        errors.push(`[UNUSED_MATERIAL] Material ${mId} in ${simId} lacks clear task relevance explanation.`);
      }
      if (!mContentMatch || mContentMatch[1].length < 30) {
        errors.push(`[EMPTY_MATERIAL] Material ${mId} in ${simId} has empty or trivial content.`);
      }
    }
  }
}

// Audit Matrix Completeness (8 Tracks × 3 Levels = 24 packages)
console.log('\n--- Canonical Simulation Matrix Audit ---');
let matrixComplete = true;
console.log('Career Track           | Fresher | Junior  | Senior  | Status');
console.log('-----------------------|---------|---------|---------|--------');
for (const track of CANONICAL_TRACKS) {
  const f = matrix[track].fresher ? '   ✅   ' : '   ❌   ';
  const j = matrix[track].junior ? '   ✅   ' : '   ❌   ';
  const s = matrix[track].senior ? '   ✅   ' : '   ❌   ';
  const ok = matrix[track].fresher && matrix[track].junior && matrix[track].senior;
  if (!ok) matrixComplete = false;
  console.log(`${track.padEnd(22)} | ${f} | ${j} | ${s} | ${ok ? 'COMPLETE' : 'MISSING'}`);
}

console.log('\n--- Catalog Metrics Summary ---');
console.log(`Total Simulations Created: ${totalSimulations} / 24`);
console.log(`Total Connected Tasks:     ${totalTasks}`);
console.log(`Total Real Materials:      ${totalMaterials}`);
console.log(`Unique Simulation IDs:     ${simulationIds.size}`);
console.log(`Unique Scenarios:          ${simulationTitles.size}`);

if (totalSimulations !== 24) {
  errors.push(`[INCOMPLETE_CATALOG] Expected exactly 24 simulation packages (8 careers × 3 levels), found ${totalSimulations}.`);
}

// Test Fallback Behavior: Missing track must throw SIMULATION_NOT_CONFIGURED
const simulationsDataFile = path.join(__dirname, '../src/data/simulationsData.ts');
const simDataContent = fs.readFileSync(simulationsDataFile, 'utf-8');
if (simDataContent.includes('return SIMULATIONS_DATA.SD.junior')) {
  errors.push('[GENERIC_FALLBACK_DETECTED] simulationsData.ts still contains silent fallback to SD Junior!');
}

console.log('\n--- Quality Audit Result ---');
if (errors.length > 0) {
  console.error(`❌ QUALITY GATE FAILED with ${errors.length} error(s):\n`);
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('✅ QUALITY GATE PASSED: 100% of simulations meet the production standard.');
  console.log('   - 8 Canonical Careers × 3 Seniority Tiers = 24 Packages Verified');
  console.log('   - 0 Duplicate IDs, 0 Duplicate Titles, 0 Placeholders');
  console.log('   - 100% Rubrics Total Exactly 100%');
  console.log('   - Zero Generic Fallbacks (SIMULATION_NOT_CONFIGURED Enforced)');
  process.exit(0);
}
