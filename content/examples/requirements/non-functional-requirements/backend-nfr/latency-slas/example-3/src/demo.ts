type BudgetReport = { p95Ms: number; degradationRate: number; timeoutRate: number };

function classifySlaHealth(report: BudgetReport) {
  const unhealthy = report.p95Ms > 250 || report.timeoutRate > 0.02;
  return {
    ...report,
    unhealthy,
    action: unhealthy && report.degradationRate < 0.1 ? 'add-degradation-path' : unhealthy ? 'page-owner' : 'keep-current-budget',
  };
}

const reports = [
  { p95Ms: 190, degradationRate: 0.05, timeoutRate: 0.005 },
  { p95Ms: 320, degradationRate: 0.01, timeoutRate: 0.04 },
].map(classifySlaHealth);

console.table(reports);
if (reports[1].action !== 'add-degradation-path') throw new Error('High tail latency with low degradation should trigger fallback work');
