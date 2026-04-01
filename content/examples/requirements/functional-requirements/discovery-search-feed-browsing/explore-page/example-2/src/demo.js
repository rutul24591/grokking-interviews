function planModuleOrder(context) {
  const order = [];
  if (context.prefersTrending) order.push("trending");
  if (context.hasHistory) order.push("recommended");
  order.push("recent");
  return Array.from(new Set(order));
}

console.log(planModuleOrder({ prefersTrending: true, hasHistory: true }));
console.log(planModuleOrder({ prefersTrending: false, hasHistory: false }));
