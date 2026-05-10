class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseListRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

function toArray(head) {
  const out = [];
  let cur = head;
  while (cur) {
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

if (require.main === module) {
  const a = new ListNode(1, new ListNode(2, new ListNode(3)));
  console.log(toArray(reverseListRecursive(a)));
}

module.exports = { ListNode, reverseListRecursive };
