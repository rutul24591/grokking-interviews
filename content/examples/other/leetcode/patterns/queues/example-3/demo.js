const { Queue } = require("../example-1/pattern");
const q = new Queue();
console.log(q.dequeue());
for (let i = 0; i < 200; i += 1) q.enqueue(i);
for (let i = 0; i < 180; i += 1) q.dequeue();
console.log("size:", q.size());
