const { MinHeap } = require("../example-1/heap");

const heap = new MinHeap((a, b) => a.priority - b.priority);
heap.insert({ id: "a", priority: 2 });
heap.insert({ id: "b", priority: 2 });
heap.insert({ id: "c", priority: 1 });

console.log("First item:", heap.extractMin());
console.log("Next tie candidates:", heap.items);

try {
  const empty = new MinHeap((a, b) => a - b);
  empty.extractMin();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
