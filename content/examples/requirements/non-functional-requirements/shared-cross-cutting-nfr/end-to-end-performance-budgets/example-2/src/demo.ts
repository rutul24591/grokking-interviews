type Route = { path: string; lcpMs: number; ttfbMs: number; jsKb: number };

function evaluateRoute(route: Route) {
  const failed = route.lcpMs > 2500 || route.ttfbMs > 500 || route.jsKb > 220;
  return {
    path: route.path,
    failed,
    action: failed ? 'optimize-before-release' : 'ship',
  };
}

const results = [
  { path: '/home', lcpMs: 1800, ttfbMs: 220, jsKb: 180 },
  { path: '/checkout', lcpMs: 2800, ttfbMs: 540, jsKb: 260 },
].map(evaluateRoute);

console.table(results);
if (results[1].action !== 'optimize-before-release') throw new Error('Checkout should fail budget gate');
