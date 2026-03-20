function threshold(base: number, errorRate: number) {
  // tighten threshold as error rate increases
  return Math.max(1, Math.floor(base * (1 - Math.min(0.8, errorRate * 4))));
}

console.log(JSON.stringify({ base: 100, tLow: threshold(100, 0.01), tHigh: threshold(100, 0.2) }, null, 2));

