import http from 'http';

async function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function testPost(url, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, body: body.slice(0, 300) });
      });
    });
    req.on('error', (err) => resolve({ url, error: err.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('--- Testing GET Endpoints ---');
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/careers',
    'http://localhost:3000/simulation/1?track=SD&level=junior',
    'http://localhost:3000/simulation/1?track=DA&level=fresher',
    'http://localhost:3000/simulation/1?track=CYBER&level=senior',
    'http://localhost:3000/simulation/1?track=UX&level=junior',
    'http://localhost:3000/simulation/1?track=AI&level=senior',
    'http://localhost:3000/simulation/1?track=PM&level=fresher',
    'http://localhost:3000/simulation/1?track=DM&level=junior',
    'http://localhost:3000/simulation/1?track=SALES&level=senior',
    'http://localhost:3000/skill-gap',
    'http://localhost:3000/dashboard',
    'http://localhost:3000/hr/dashboard',
    'http://localhost:3000/hr/candidates/1'
  ];

  let failed = 0;
  for (const u of urls) {
    const res = await testUrl(u);
    if (res.status && res.status < 400) {
      console.log(`[PASS] ${res.status} ${u} (${res.length} bytes)`);
    } else {
      console.error(`[FAIL] ${res.status || 'ERR'} ${u} : ${res.error || ''}`);
      failed++;
    }
  }

  console.log('\n--- Testing AI Evaluation API with SD Junior Evidence ---');
  const evalPayload = {
    type: 'simulation',
    challengeTitle: 'Production Memory Leak & Stream Backpressure Incident',
    problemStatement: 'Production incident: memory leak due to buffering 50MB file uploads in memory.',
    track: 'SD',
    level: 'junior',
    deliverables: {
      githubUrl: 'https://github.com/skillforge-candidate/patch-stream-backpressure',
      prDescription: 'Fixed OOM by streaming to disk with 64KB highWaterMark and honoring backpressure drain events.',
      testSuiteSummary: 'Added integration test with 100MB chunked generator. Heap memory stayed flat at 48MB.'
    },
    tasks: [
      {
        id: 1,
        title: 'Analyze Heap Dumps and Diagnose Out-of-Memory Failure',
        dimension: 'root_cause_analysis',
        acceptanceCriteria: ['Identify memory leak in file upload endpoint'],
        candidateResponse: 'Root cause is fs.readFileSync buffering entire 50MB in JVM/V8 heap.',
        validationResult: {
          passed: true,
          score: 95,
          evidence: ['Identified heap exhaustion on 50MB payload buffering'],
          failures: [],
          validatorType: 'document_structure'
        }
      },
      {
        id: 2,
        title: 'Implement Memory-Safe Chunked Upload Handler with Backpressure',
        dimension: 'streaming_concurrency',
        acceptanceCriteria: ['Implement chunked streaming with backpressure'],
        candidateResponse: 'export async function handleStreamUpload(req, destPath) { ... fileStream.write(chunk) backpressure drain listener ... }',
        validationResult: {
          passed: true,
          score: 100,
          evidence: ['Contains highWaterMark stream pipeline and drain handler'],
          failures: [],
          validatorType: 'code_static'
        }
      }
    ],
    rubric: [
      { id: 'technical_correctness', name: 'Technical Correctness', weight: 30 },
      { id: 'architecture', name: 'Architecture & Streaming', weight: 25 },
      { id: 'testing', name: 'Testing Strategy', weight: 25 },
      { id: 'communication', name: 'Communication & Postmortem', weight: 20 }
    ],
    careerSkills: ['Node.js Streams', 'Memory Profiling', 'Incident Response', 'Backpressure Handling']
  };

  const evalRes = await testPost('http://localhost:3000/api/ai/evaluate', evalPayload);
  console.log(`Evaluation API Status: ${evalRes.status}`);
  console.log(`Evaluation API Response preview: ${evalRes.body}`);

  if (evalRes.status !== 200) {
    failed++;
  }

  if (failed === 0) {
    console.log('\n✅ ALL ENDPOINTS & EVALUATION API PASSED VERIFICATION!');
  } else {
    console.error(`\n❌ ${failed} checks failed.`);
    process.exit(1);
  }
}

main();
