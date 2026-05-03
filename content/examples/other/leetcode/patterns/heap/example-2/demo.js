const { MinHeap } = require("../example-1/pattern");

function mergeKSorted(arrays) {
  const heap = new MinHeap((a, b) => a.value - b.value);
  for (let i = 0; i < arrays.length; i += 1) {
    if (arrays[i].length) heap.push({ value: arrays[i][0], i, j: 0 });
  }
  const out = [];
  while (heap.items.length) {
    const { value, i, j } = heap.pop();
    out.push(value);
    const nextJ = j + 1;
    if (nextJ < arrays[i].length) heap.push({ value: arrays[i][nextJ], i, j: nextJ });
  }
  return out;
}

console.log(mergeKSorted([[1,4,5],[1,3,4],[2,6]]));
