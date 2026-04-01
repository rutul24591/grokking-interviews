function samplingStrategy(totalPoints, viewportWidth) {
  const drawablePoints = viewportWidth * 2;
  if (totalPoints <= drawablePoints) return { strategy: "raw", bucketSize: 1, preserveExtrema: true };
  if (totalPoints <= drawablePoints * 10) {
    return {
      strategy: "aggregated",
      bucketSize: Math.ceil(totalPoints / drawablePoints),
      preserveExtrema: true
    };
  }
  return {
    strategy: "downsampled",
    bucketSize: Math.ceil(totalPoints / drawablePoints),
    preserveExtrema: false
  };
}

console.log(samplingStrategy(125000, 980));
