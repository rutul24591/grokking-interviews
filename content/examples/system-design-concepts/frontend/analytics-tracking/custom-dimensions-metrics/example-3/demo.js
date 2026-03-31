function withinBudget(values, budget) {
  const distinct = new Set(values);
  return { accepted: distinct.size <= budget, distinct: distinct.size };
}

console.log(withinBudget(["desktop", "mobile", "tablet"], 4));
console.log(withinBudget(["u1", "u2", "u3", "u4", "u5"], 4));
