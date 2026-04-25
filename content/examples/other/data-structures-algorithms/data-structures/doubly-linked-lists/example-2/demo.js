const { DoublyLinkedList } = require("../example-1/list");

const list = new DoublyLinkedList();
const a = list.append("A");
const b = list.append("B");
const c = list.append("C");

list.remove(b);
const moved = list.append(b.value);

console.log("Original B node detached:", b.prev, b.next);
console.log("New recency order:", list.valuesForward());
console.log("Newest tail entry:", moved.value);
