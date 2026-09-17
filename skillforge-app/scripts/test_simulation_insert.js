const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
  console.log("Testing insert into simulation_attempts...");
  const attemptData = {
    career_code: "SD",
    level: "junior",
    status: "graded",
    deliverable_url: "https://github.com/test/repo",
    deliverable_notes: "Test notes",
    time_spent_secs: 1800,
    candidate_name: "Test User",
    candidate_email: "test@example.com",
    submitted_at: new Date().toISOString(),
  };

  const { data: attemptRow, error: attErr } = await supabase
    .from("simulation_attempts")
    .insert([attemptData])
    .select()
    .single();

  if (attErr) {
    console.error("simulation_attempts insert ERROR:", attErr);
    return;
  }
  console.log("simulation_attempts insert SUCCESS! ID:", attemptRow.id);

  console.log("Testing insert into evaluations...");
  const evalData = {
    attempt_id: attemptRow.id,
    overall_score: 85,
    ai_confidence: "98% (High)",
    readiness_status: "Role-Ready",
    technical_accuracy_score: 85,
    problem_solving_score: 88,
    code_quality_score: 82,
    architecture_score: 84,
    communication_score: 86,
    strengths: ["Clean code", "Good test coverage"],
    growth_areas: ["Add structured logs"],
    ai_feedback_summary: "Strong performance on backpressure handling.",
    verified_hash: "0XTEST_HASH_12345",
  };

  const { data: evalRow, error: evalErr } = await supabase
    .from("evaluations")
    .insert([evalData])
    .select()
    .single();

  if (evalErr) {
    console.error("evaluations insert ERROR:", evalErr);
    return;
  }
  console.log("evaluations insert SUCCESS! ID:", evalRow.id);
}

testInsert();
