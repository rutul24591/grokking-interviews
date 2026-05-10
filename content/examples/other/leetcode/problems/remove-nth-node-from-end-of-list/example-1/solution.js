class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function removeNthFromEndTwoPass(head, n) {
  let len = 0;
  for (let cur = head; cur; cur = cur.next) len += 1;
  const removeIndex = len - n;
  if (removeIndex === 0) return head.next;
  let cur = head;
  for (let i = 0; i < removeIndex - 1; i += 1) cur = cur.next;
  cur.next = cur.next ? cur.next.next : null;
  return head;
}

function toArray(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.val);
  return out;
}

if (require.main === module) {
  const a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
  console.log(toArray(removeNthFromEndTwoPass(a, 2)));
}

module.exports = { ListNode, removeNthFromEndTwoPass };
