function detectCtrRegression(history, dropThreshold) {
  const latest = history.at(-1);
  const previous = history.at(-2);
  if (!latest || !previous) return false;
  return previous.ctr - latest.ctr >= dropThreshold;
}
console.log(detectCtrRegression([{ ctr: 0.46 }, { ctr: 0.28 }], 0.1));
