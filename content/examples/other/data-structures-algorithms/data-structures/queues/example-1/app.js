const { CircularQueue } = require("./queue");

const queue = new CircularQueue(5);
queue.enqueue({ id: "job-1", type: "thumbnail" });
queue.enqueue({ id: "job-2", type: "email" });
queue.enqueue({ id: "job-3", type: "search-index" });

console.log("Dispatch:", queue.dequeue());
queue.enqueue({ id: "job-4", type: "billing-sync" });
queue.enqueue({ id: "job-5", type: "fraud-check" });

console.log("Dispatch:", queue.dequeue());
console.log("Dispatch:", queue.dequeue());
console.log("Remaining length:", queue.length, "head:", queue.head, "tail:", queue.tail);
