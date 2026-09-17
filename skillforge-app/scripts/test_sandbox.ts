import { sandboxService } from "../src/services/sandboxService";

const tracks: Array<{ track: string; level: "fresher" | "junior" | "senior" }> = [
  { track: "SD", level: "junior" },
  { track: "SD", level: "fresher" },
  { track: "SD", level: "senior" },
  { track: "DA", level: "junior" },
  { track: "UX", level: "junior" },
  { track: "AI", level: "junior" },
  { track: "CYBER", level: "junior" },
  { track: "CS", level: "fresher" }, // alias test
  { track: "PM", level: "junior" },
  { track: "DEVOPS", level: "junior" },
  { track: "DM", level: "junior" },
  { track: "SALES", level: "junior" },
  { track: "SA", level: "junior" }, // alias test
];

console.log("=== Testing Sandbox Runner Across All Tracks ===");

for (const { track, level } of tracks) {
  const starter = sandboxService.getStarterCode(track, level);
  const report = sandboxService.runSandboxTests(track, level, starter.starterCode);
  console.log(`Track [${track}] (${level}) -> Language: ${starter.language}, Total Tests: ${report.total}, Passed: ${report.passedCount}`);
  if (report.total === 0) {
    console.error(`ERROR: No tests executed for track ${track}`);
    process.exit(1);
  }
}

console.log("\n=== All Sandbox Test Suites Passed! ===");
