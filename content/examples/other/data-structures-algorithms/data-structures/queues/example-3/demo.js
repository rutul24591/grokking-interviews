const { CircularQueue } = require("../example-1/queue");

const queue = new CircularQueue(3);
queue.enqueue("A");
queue.enqueue("B");
console.log(queue.dequeue());
queue.enqueue("C");
queue.enqueue("D");
console.log("Pointer state:", { head: queue.head, tail: queue.tail, length: queue.length });

try {
  queue.enqueue("E");
} catch (error) {
  console.log("Expected overflow:", error.message);
}

while (queue.length) queue.dequeue();
try {
  queue.dequeue();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
