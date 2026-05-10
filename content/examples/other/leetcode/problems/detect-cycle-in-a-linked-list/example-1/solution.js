class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function hasCycleHashSet(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}

if (require.main === module) {
  const a = new ListNode(1);
  const b = new ListNode(2);
  const c = new ListNode(3);
  a.next = b;
  b.next = c;
  c.next = b;
  console.log(hasCycleHashSet(a));
}

module.exports = { ListNode, hasCycleHashSet };
