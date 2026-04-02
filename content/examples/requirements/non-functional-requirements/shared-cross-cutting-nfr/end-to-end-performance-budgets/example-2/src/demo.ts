type RouteBudget = { route: string; businessCritical: boolean; renderMs: number; backendMs: number; bytesKb: number };

function assessBudget(route: RouteBudget) {
  const total = route.renderMs + route.backendMs;
  const withinBudget = total <= (route.businessCritical ? 700 : 1200) && route.bytesKb <= (route.businessCritical ? 200 : 320);
  return { route: route.route, total, withinBudget, action: withinBudget ? 'ship' : 'trim-or-defer' };
}

const results = [
  { route: '/pricing', businessCritical: false, renderMs: 380, backendMs: 420, bytesKb: 210 },
  { route: '/checkout', businessCritical: true, renderMs: 410, backendMs: 390, bytesKb: 240 },
].map(assessBudget);

console.table(results);
if (results[1].action !== 'trim-or-defer') throw new Error('Checkout budget should fail on oversized payload');
