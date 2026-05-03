function middle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function build(values) {
  const nodes = values.map((v) => ({ v, next: null }));
  for (let i = 0; i < nodes.length - 1; i += 1) nodes[i].next = nodes[i + 1];
  return nodes[0] ?? null;
}

console.log("odd middle:", middle(build([1,2,3,4,5])).v);
console.log("even middle:", middle(build([1,2,3,4])).v);
