const latencies = [120, 115, 140, 118, 122];
const windowSize = 3;
const averages = [];

for (let start = 0; start <= latencies.length - windowSize; start += 1) {
  const window = latencies.slice(start, start + windowSize);
  const average =
    window.reduce((sum, value) => sum + value, 0) / window.length;
  averages.push({ window, average });
}

console.table(averages);
