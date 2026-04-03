type Signal = { service: string; hasLogs: boolean; hasMetrics: boolean; hasTraceLink: boolean };

function assessObservability(signal: Signal) {
  const triageable = signal.hasLogs && signal.hasMetrics && signal.hasTraceLink;
  return {
    service: signal.service,
    triageable,
    action: triageable ? 'ready-for-oncall' : 'instrument-missing-signal',
  };
}

const results = [
  { service: 'checkout', hasLogs: true, hasMetrics: true, hasTraceLink: true },
  { service: 'search', hasLogs: true, hasMetrics: false, hasTraceLink: false },
].map(assessObservability);

console.table(results);
if (results[1].action !== 'instrument-missing-signal') throw new Error('Search should add missing signals');
