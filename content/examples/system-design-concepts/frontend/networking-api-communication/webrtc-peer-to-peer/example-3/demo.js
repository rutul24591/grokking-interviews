const attempts = [
  { stage: "host candidates", success: false },
  { stage: "srflx candidates", success: false },
  { stage: "TURN relay", success: true }
];

for (const attempt of attempts) {
  console.log(`${attempt.stage} -> ${attempt.success ? "session established" : "continue fallback ladder"}`);
  if (attempt.success) break;
}
