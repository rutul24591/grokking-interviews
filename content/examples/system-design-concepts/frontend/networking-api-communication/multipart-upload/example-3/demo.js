const attempts = [
  { part: 1, ok: true },
  { part: 2, ok: false },
  { part: 2, ok: true },
  { part: 3, ok: true }
];

const uploaded = new Set();
for (const attempt of attempts) {
  if (!attempt.ok) {
    console.log(`retry queued for part ${attempt.part}`);
    continue;
  }
  uploaded.add(attempt.part);
  console.log(`part ${attempt.part} committed`);
}

console.log(`completed parts -> ${Array.from(uploaded).join(", ")}`);
