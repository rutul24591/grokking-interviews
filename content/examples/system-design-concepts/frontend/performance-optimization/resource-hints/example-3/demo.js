const hints = [
  { rel: "preload", criticalNow: true, candidateCount: 1 },
  { rel: "preconnect", criticalNow: true, candidateCount: 2 },
  { rel: "prefetch", criticalNow: false, candidateCount: 6 },
];
for (const hint of hints) {
  const safe = hint.rel !== "prefetch" || hint.candidateCount <= 2;
  console.log(`${hint.rel} -> ${safe ? "reasonable" : "over-eager hinting risk"}`);
}
