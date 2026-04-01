function mergeRealtimeUpdate(windowValues, nextValue, maxHistory) {
  const merged = [...windowValues, nextValue.value].slice(-maxHistory);
  return {
    history: merged,
    current: merged.at(-1),
    lagMs: nextValue.lagMs,
    shouldAnnotateLag: nextValue.lagMs > 1000
  };
}

console.log(mergeRealtimeUpdate([82, 86, 91], { value: 94, lagMs: 1420 }, 4));
