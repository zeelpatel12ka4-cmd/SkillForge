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

async function checkTables() {
  console.log("Testing Supabase simulation tables...");
  const { data: attempts, error: attErr } = await supabase
    .from("simulation_attempts")
    .select("*")
    .limit(1);

  console.log("simulation_attempts query:", attErr ? "ERROR: " + attErr.message : "OK, count=" + attempts?.length);

  const { data: evals, error: evalErr } = await supabase
    .from("evaluations")
    .select("*")
    .limit(1);

  console.log("evaluations query:", evalErr ? "ERROR: " + evalErr.message : "OK, count=" + evals?.length);
}

checkTables();
