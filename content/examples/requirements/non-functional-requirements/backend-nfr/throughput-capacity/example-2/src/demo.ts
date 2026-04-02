type CapacityCase = { name: string; workers: number; avgServiceMs: number; incomingRps: number };

function evaluateCapacity(input: CapacityCase) {
  const maxRps = Math.round((input.workers / input.avgServiceMs) * 1000);
  const headroom = maxRps - input.incomingRps;
  return {
    scenario: input.name,
    maxRps,
    headroom,
    action: headroom >= input.incomingRps * 0.15 ? 'healthy' : 'scale-before-release',
  };
}

const results = [
  { name: 'weekday-baseline', workers: 8, avgServiceMs: 40, incomingRps: 150 },
  { name: 'flash-sale', workers: 8, avgServiceMs: 40, incomingRps: 195 },
  { name: 'holiday-traffic', workers: 12, avgServiceMs: 35, incomingRps: 280 },
].map(evaluateCapacity);

console.table(results);
if (results[1].action !== 'scale-before-release') {
  throw new Error('Flash sale scenario should require scaling');
}
