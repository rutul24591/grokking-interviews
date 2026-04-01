function regressionDelta(before, after, threshold) {
  const delta = Number((after - before).toFixed(2));
  return {
    delta,
    regressed: delta > threshold,
    threshold
  };
}

console.log(regressionDelta(2.1, 2.6, 0.3));
