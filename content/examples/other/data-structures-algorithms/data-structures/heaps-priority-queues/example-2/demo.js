const { MinHeap } = require("../example-1/heap");

const heap = new MinHeap((a, b) => a - b);
const values = [10, 3, 25, 7, 18, 30];
const k = 3;

for (const value of values) {
  if (heap.items.length < k) heap.insert(value);
  else if (value > heap.items[0]) {
    heap.extractMin();
    heap.insert(value);
  }
}

console.log("Top 3 (unordered heap view):", heap.items);
