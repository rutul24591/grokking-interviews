type Span = { service: string; traceId: string | null; parentId: string | null; durationMs: number };

function inspectSpan(span: Span) {
  const broken = !span.traceId || (span.service !== 'gateway' && !span.parentId);
  return {
    service: span.service,
    broken,
    fix: broken ? 'restore-propagation-and-sampling-config' : 'healthy',
  };
}

const results = [
  { service: 'gateway', traceId: 'abc', parentId: null, durationMs: 20 },
  { service: 'worker', traceId: 'abc', parentId: null, durationMs: 420 },
].map(inspectSpan);

console.table(results);
if (!results[1].broken) throw new Error('Worker span without parent should be flagged');
