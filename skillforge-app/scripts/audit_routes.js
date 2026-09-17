const http = require("http");

const routes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/callback",
  "/dashboard",
  "/careers",
  "/simulation",
  "/simulation/1?track=SD&level=junior",
  "/score-report/1",
  "/skill-gap",
  "/jobs",
  "/badges",
  "/competitions",
  "/hr/dashboard",
  "/hr/jobs",
  "/hr/jobs/create",
  "/hr/candidates/1",
  "/admin",
  "/admin/users",
  "/admin/deliverables",
  "/admin/competitions",
  "/admin/subscriptions"
];

async function runAudit() {
  console.log("=== SkillForge Production HTTP Route Audit ===");
  let passed = 0;
  for (const r of routes) {
    await new Promise((resolve) => {
      http.get("http://localhost:3000" + r, (res) => {
        const isOk = res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308;
        console.log(`[${res.statusCode}] ${r} -> ${isOk ? "PASS" : "FAIL"}`);
        if (isOk) passed++;
        resolve();
      }).on("error", (err) => {
        console.error(`[FAIL] ${r} -> Error: ${err.message}`);
        resolve();
      });
    });
  }
  console.log(`=== Audit Completed: ${passed}/${routes.length} routes online and healthy ===`);
}

runAudit();
