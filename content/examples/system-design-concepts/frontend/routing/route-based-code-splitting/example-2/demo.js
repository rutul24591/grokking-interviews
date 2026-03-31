function oversized(routes, budgetKb) {
  return routes.filter((route) => route.weightKb > budgetKb).map((route) => ({
    ...route,
    overByKb: route.weightKb - budgetKb
  }));
}

console.log(oversized([{ path: "/editor", weightKb: 96 }, { path: "/billing", weightKb: 58 }], 70));
