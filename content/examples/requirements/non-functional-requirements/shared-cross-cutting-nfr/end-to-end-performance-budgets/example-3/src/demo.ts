type BudgetReport = { route: string; p95Ms: number; lcpMs: number; jsKb: number };

function checkBudget(report: BudgetReport) {
  const violations = [report.p95Ms > 900 ? 'p95' : null, report.lcpMs > 2500 ? 'lcp' : null, report.jsKb > 230 ? 'js' : null].filter(Boolean);
  return {
    route: report.route,
    violations,
    severity: violations.length >= 2 ? 'block-release' : violations.length === 1 ? 'warn' : 'pass',
  };
}

const results = [
  { route: '/home', p95Ms: 620, lcpMs: 1800, jsKb: 180 },
  { route: '/checkout', p95Ms: 1040, lcpMs: 2900, jsKb: 260 },
].map(checkBudget);

console.table(results);
if (results[1].severity !== 'block-release') throw new Error('Checkout should block release on multiple budget failures');
