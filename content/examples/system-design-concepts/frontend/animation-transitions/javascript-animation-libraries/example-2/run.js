const scores = [
  ["Framer Motion", 8, "Best for React state-driven motion"],
  ["GSAP", 9, "Best for timeline orchestration"],
  ["Motion One", 7, "Best for smaller WAAPI-friendly bundles"],
];

console.log("Library scoring\n");
for (const [name, score, note] of scores) {
  console.log(`${name.padEnd(14)} score=${score} · ${note}`);
}
