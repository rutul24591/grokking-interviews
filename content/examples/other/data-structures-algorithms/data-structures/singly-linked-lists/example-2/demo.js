const { Node } = require("../example-1/list");

function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}

const first = new Node("A");
const second = new Node("B");
const third = new Node("C");
first.next = second;
second.next = third;

console.log("Acyclic list:", hasCycle(first));

third.next = second;
console.log("Cyclic list:", hasCycle(first));
