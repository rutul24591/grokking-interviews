function countingSort(values, maxValue) {
  const arr = [...values];
  const max = maxValue ?? Math.max(...arr, 0);
  const counts = new Array(max + 1).fill(0);
  for (const value of arr) counts[value] += 1;
  const out = [];
  for (let value = 0; value < counts.length; value += 1) {
    for (let c = 0; c < counts[value]; c += 1) out.push(value);
  }
  return out;
}

module.exports = { countingSort };
