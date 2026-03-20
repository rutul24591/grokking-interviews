function throughput(workers: number, avgServiceMs: number) {
  return workers / (avgServiceMs / 1000);
}

console.log(JSON.stringify({ workers: 8, avgServiceMs: 40, approxRps: throughput(8, 40) }, null, 2));

