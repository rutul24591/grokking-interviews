const { MinHeap } = require("./heap");

const queue = new MinHeap((a, b) => a.priority - b.priority);
queue.insert({ id: "inc-3", priority: 3 });
queue.insert({ id: "inc-1", priority: 1 });
queue.insert({ id: "inc-2", priority: 2 });

console.log("Dispatch 1:", queue.extractMin());
console.log("Dispatch 2:", queue.extractMin());
console.log("Remaining heap:", queue.items);
