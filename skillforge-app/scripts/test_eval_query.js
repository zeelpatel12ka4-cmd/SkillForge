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

async function testQuery() {
  console.log("Testing evaluations query with foreign key relation...");
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, simulation_attempts(*)")
    .limit(1);

  if (error) {
    console.error("Query ERROR:", error);
  } else {
    console.log("Query SUCCESS! Found records:", data?.length);
    console.log("Sample:", JSON.stringify(data?.[0], null, 2));
  }
}

testQuery();
