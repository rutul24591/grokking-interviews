const { DoublyLinkedList } = require("../example-1/list");

const list = new DoublyLinkedList();
const first = list.append("first");

list.remove(first);
console.log("After single removal:", { head: list.head, tail: list.tail });

const second = list.append("second");
const third = list.append("third");
list.remove(second);

console.log("After head removal:", list.valuesForward());
list.remove(third);
console.log("After tail removal:", { head: list.head, tail: list.tail && list.tail.value });
