const http = require("http");

const payload = JSON.stringify({
  type: "simulation",
  track: "SD",
  challengeTitle: "Production Bug: Chunked Stream Handler & OOM Fix",
  problemStatement: "Resolve memory saturation during large file uploads by implementing reactive streaming backpressure.",
  submittedCode: `
export function handleChunkedStream(stream, res) {
  let processedBytes = 0;
  stream.on("data", (chunk) => {
    processedBytes += chunk.length;
    if (!res.write(chunk)) {
      stream.pause();
      res.once("drain", () => stream.resume());
    }
  });
  stream.on("end", () => res.end());
}
  `,
  repoUrl: "https://github.com/candidate/production-stream-fix",
  candidateNotes: "Implemented reactive streaming backpressure with drain listener to prevent heap exhaustion under concurrent load."
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/ai/evaluate",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const json = JSON.parse(data);
      console.log("Evaluation Response:", JSON.stringify(json, null, 2));
      if (json.success && json.evaluation && json.evaluation.score) {
        console.log(`\nAI EVALUATION VERIFIED: Score ${json.evaluation.score}% - Hash: ${json.evaluation.verifiedHash}`);
      } else {
        console.error("Evaluation response missing expected fields");
      }
    } catch (e) {
      console.error("JSON parse error:", data);
    }
  });
});

req.on("error", (e) => console.error("Request error:", e));
req.write(payload);
req.end();
