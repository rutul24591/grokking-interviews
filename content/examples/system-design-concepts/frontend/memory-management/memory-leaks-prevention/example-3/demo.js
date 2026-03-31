function withinBudget(samples, maxGrowth) {
  const growth = samples[samples.length - 1] - samples[0];
  const offendingWindow = samples.findIndex((value, index) => index > 0 && value - samples[index - 1] > maxGrowth / 2);
  return { growth, withinBudget: growth <= maxGrowth, offendingWindow };
}

console.log(withinBudget([20, 22, 24, 25], 6));
console.log(withinBudget([20, 28, 31, 35], 6));
