function monotonicGrowth(samples, threshold) {
  const monotonic = samples.every((value, index) => index === 0 || value >= samples[index - 1]);
  return { monotonic, exceedsThreshold: samples[samples.length - 1] - samples[0] >= threshold };
}

console.log(monotonicGrowth([40, 43, 45, 44], 6));
console.log(monotonicGrowth([40, 43, 45, 49], 6));
