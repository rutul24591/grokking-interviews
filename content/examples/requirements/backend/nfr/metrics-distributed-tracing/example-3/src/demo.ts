function sample(traceIdHex: string, rate: number) {
  // Use the first 8 hex chars as a stable hash prefix.
  const v = parseInt(traceIdHex.slice(0, 8), 16);
  const threshold = Math.floor(rate * 0xffffffff);
  return v <= threshold;
}

const traceId = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
console.log(JSON.stringify({ traceId, rate: 0.1, sampled: sample(traceId, 0.1) }, null, 2));

