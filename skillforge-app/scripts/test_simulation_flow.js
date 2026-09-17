const http = require('http');

async function testEvaluation() {
  const payload = {
    type: "simulation",
    track: "SD",
    challengeTitle: "Software Developer Production Incident: Memory Leak & Streaming Fix",
    problemStatement: "Simulated production incident in Software Developer for junior engineering track.",
    repoUrl: "https://github.com/my-test-user/stream-fix",
    submittedCode: "function stream(req, res) { req.pause(); res.once('drain', () => req.resume()); }",
    candidateNotes: "Implemented reactive backpressure with drain listener.",
  };

  const data = JSON.stringify(payload);

  const req = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/ai/evaluate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        console.log("Evaluation endpoint HTTP status:", res.statusCode);
        try {
          const json = JSON.parse(body);
          console.log("Response success:", json.success);
          console.log("Evaluation score:", json.evaluation?.score);
          console.log("Verified hash:", json.evaluation?.verifiedHash);
        } catch (e) {
          console.error("Failed to parse JSON response:", body.substring(0, 300));
        }
      });
    }
  );

  req.on("error", (e) => console.error("HTTP error:", e.message));
  req.write(data);
  req.end();
}

testEvaluation();
