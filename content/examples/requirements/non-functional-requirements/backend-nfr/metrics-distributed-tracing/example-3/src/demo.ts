type TraceSegment = { name: string; hasSpanId: boolean; durationMs: number; sampled: boolean };

function analyzeTrace(trace: TraceSegment[]) {
  return trace.map((segment) => ({
    segment: segment.name,
    issue: !segment.hasSpanId ? 'missing-span-id' : !segment.sampled && segment.durationMs > 400 ? 'unsampled-slow-hop' : 'none',
  }));
}

const analysis = analyzeTrace([
  { name: 'gateway', hasSpanId: true, durationMs: 40, sampled: true },
  { name: 'recommendations', hasSpanId: false, durationMs: 520, sampled: false },
]);
console.table(analysis);
if (!analysis.some((row) => row.issue === 'missing-span-id')) throw new Error('Expected missing span issue');
