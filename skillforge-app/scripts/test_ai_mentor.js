const http = require("http");

const payload = JSON.stringify({
  type: "mentor_hint",
  track: "SD",
  challengeTitle: "API Validation & Unit Test Coverage",
  problemStatement: "Diagnose failing signup API endpoints, fix null-pointer edge cases on phoneNumber, and add passing unit tests.",
  submittedCode: `
export function validateSignup(dto) {
  if (!dto.email || !dto.email.includes("@")) return false;
  if (dto.phoneNumber.trim().length < 10) return false;
  return true;
}
  `
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
      console.log("Mentor Response:", JSON.stringify(json, null, 2));
      if (json.success && json.hint) {
        console.log(`\nAI MENTOR HINT VERIFIED: ${json.hint}`);
      }
    } catch (e) {
      console.error("JSON parse error:", data);
    }
  });
});

req.on("error", (e) => console.error("Request error:", e));
req.write(payload);
req.end();
