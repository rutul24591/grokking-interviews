class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function removeNthFromEndOnePass(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i += 1) fast = fast.next;
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next ? slow.next.next : null;
  return dummy.next;
}

function toArray(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.val);
  return out;
}

if (require.main === module) {
  const a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
  console.log(toArray(removeNthFromEndOnePass(a, 2)));
}

module.exports = { ListNode, removeNthFromEndOnePass };
