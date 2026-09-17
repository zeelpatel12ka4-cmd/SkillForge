const http = require('http');

// We'll test sandbox logic directly
const { sandboxService } = require('../src/services/sandboxService.ts');

async function testPostEvaluation(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai/evaluate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== Multi-Track Simulation & Sandbox Verification ===\n');

  const tracksToTest = [
    {
      code: 'SD',
      level: 'junior',
      title: 'Production Bug: Chunked Stream Handler & OOM Fix',
      deliverable: 'https://github.com/candidate/chunked-stream-patch',
      codeSnippet: `const { Transform } = require("stream");
class SafeChunkStream extends Transform {
  _transform(chunk, encoding, callback) {
    if (this.writableLength > 64 * 1024) {
      this.once('drain', () => { this.push(chunk); callback(); });
    } else {
      this.push(chunk);
      callback();
    }
  }
}`
    },
    {
      code: 'UX',
      level: 'junior',
      title: 'B2B SaaS Analytics Dashboard & Design System',
      deliverable: 'https://www.figma.com/file/candidate-design-tokens',
      codeSnippet: `export const enterpriseTokens = {
  colors: {
    primary: "#6366F1",
    primaryTextOnDark: "#FFFFFF",
    bgDark: "#0F172A",
    contrastRatio: 7.2,
    accessibleAA: true,
  },
  typography: {
    fontSizeBase: 16,
    lineHeightBody: 1.6,
  },
  touchTargetMin: 44,
};`
    },
    {
      code: 'CS', // tests alias normalization
      level: 'fresher',
      title: 'OWASP Top 10 Audit & SQLi Vulnerability Patch',
      deliverable: 'https://github.com/candidate/sqli-prepared-statement-patch',
      codeSnippet: `const { pool } = require('./db');
async function authenticateUser(email, passwordHash) {
  const query = 'SELECT id, email, role FROM users WHERE email = $1 AND password_hash = $2';
  const { rows } = await pool.query(query, [email, passwordHash]);
  return rows[0] || null;
}`
    },
    {
      code: 'DM',
      level: 'senior',
      title: 'Omnichannel Growth Playbook & CAC Optimization',
      deliverable: 'https://docs.google.com/presentation/d/growth-deck',
      codeSnippet: `export function allocateMarketingBudget(totalBudgetINR) {
  return {
    paidSearch: totalBudgetINR * 0.40,
    technicalSEO: totalBudgetINR * 0.20,
    lifecycleEmail: totalBudgetINR * 0.25,
    influencerContent: totalBudgetINR * 0.15,
    projectedCacReductionPercent: 32.5,
  };
}`
    }
  ];

  for (const track of tracksToTest) {
    console.log(`Testing Track: [${track.code}] (${track.level}) - ${track.title}`);

    // Test API evaluation
    const res = await testPostEvaluation({
      track: track.code,
      challengeTitle: track.title,
      problemStatement: `Simulated production incident in ${track.code} for ${track.level} track.`,
      repoUrl: track.deliverable,
      submittedCode: track.codeSnippet,
      candidateNotes: 'Fixed edge cases, added test coverage, validated with automated checks.'
    });

    console.log(`  -> API Status: ${res.status}`);
    const evalData = res.data?.evaluation || res.data;
    if (evalData && evalData.score) {
      console.log(`  -> AI Score: ${evalData.score}/100`);
      console.log(`  -> Hash: ${evalData.verifiedHash}`);
      console.log(`  -> Rubrics:`, evalData.rubrics);
      console.log(`  -> Strengths:`, evalData.strengths);
      console.log(`  -> Verdict: ${evalData.verdict?.slice(0, 100)}...`);
    } else {
      console.error(`  -> Failed:`, res);
      process.exit(1);
    }
    console.log('');
  }

  console.log('=== All Simulation Tracks Verified Successfully! ===');
}

run().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
