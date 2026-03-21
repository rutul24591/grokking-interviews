function clamp(minPx: number, maxPx: number, minVw: number, maxVw: number) {
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const yIntercept = minPx - slope * minVw;
  return `clamp(${minPx}px, ${yIntercept.toFixed(2)}px + ${(slope * 100).toFixed(3)}vw, ${maxPx}px)`;
}

console.log(
  JSON.stringify(
    {
      h1: clamp(28, 44, 375, 1440),
      body: clamp(14, 18, 375, 1440),
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ ok: true }, null, 2));

