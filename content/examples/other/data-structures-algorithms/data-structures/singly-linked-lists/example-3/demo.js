const { SinglyLinkedList } = require("../example-1/list");

const list = new SinglyLinkedList();
list.append({ id: "only", value: 1 });

console.log("Before delete:", list.toArray(), "tail:", list.tail.value.id);
console.log("Removed:", list.removeById("only"));
console.log("After delete:", list.toArray(), "head:", list.head, "tail:", list.tail);
console.log("Missing delete:", list.removeById("missing"));
