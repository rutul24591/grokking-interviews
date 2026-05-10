class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reorderListWithArray(head) {
  const nodes = [];
  for (let cur = head; cur; cur = cur.next) nodes.push(cur);
  let left = 0;
  let right = nodes.length - 1;
  while (left < right) {
    nodes[left].next = nodes[right];
    left += 1;
    if (left === right) break;
    nodes[right].next = nodes[left];
    right -= 1;
  }
  if (nodes.length > 0) nodes[left].next = null;
  return head;
}

function toArray(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.val);
  return out;
}

if (require.main === module) {
  const a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
  reorderListWithArray(a);
  console.log(toArray(a));
}

module.exports = { ListNode, reorderListWithArray };
