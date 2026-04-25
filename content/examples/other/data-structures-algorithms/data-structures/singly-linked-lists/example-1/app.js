const { SinglyLinkedList } = require("./list");

const stream = new SinglyLinkedList();
stream.append({ id: "evt-1", type: "page_view" });
stream.append({ id: "evt-2", type: "search" });
stream.append({ id: "evt-3", type: "click" });
stream.append({ id: "evt-4", type: "purchase" });

const dropped = stream.removeById("evt-2");

console.log("Dropped event:", dropped);
console.log("Tail item:", stream.tail.value);
console.table(stream.toArray());
