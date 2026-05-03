const { reverseList } = require("./pattern");

function build(values) {
  const nodes = values.map((v) => ({ v, next: null }));
  for (let i = 0; i < nodes.length - 1; i += 1) nodes[i].next = nodes[i + 1];
  return nodes[0] ?? null;
}
function toArray(head) {
  const out = [];
  let curr = head;
  while (curr) { out.push(curr.v); curr = curr.next; }
  return out;
}

const head = build([1,2,3,4]);
console.log(toArray(reverseList(head)));
