function expectedQueueDelay(flushIntervalMs: number) {
  // Uniform arrival within interval => avg wait ~ interval/2.
  return flushIntervalMs / 2;
}

console.log(JSON.stringify({ flushIntervalMs: 50, avgAddedDelayMs: expectedQueueDelay(50) }, null, 2));

