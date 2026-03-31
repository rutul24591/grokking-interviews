const requests = [120, 80, 70, 140, 60, 90];

function simulateHttp1(durations, connections = 3) {
  const lanes = Array.from({ length: connections }, () => 0);
  for (const duration of durations) {
    const earliest = lanes.indexOf(Math.min(...lanes));
    lanes[earliest] += duration;
  }
  return Math.max(...lanes);
}

function simulateHttp2(durations) {
  return Math.max(...durations) + 20;
}

console.log(`HTTP/1.1 total -> ${simulateHttp1(requests)} ms`);
console.log(`HTTP/2 total -> ${simulateHttp2(requests)} ms`);
