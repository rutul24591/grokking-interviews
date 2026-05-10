class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reorderList(head) {
  if (!head || !head.next) return head;
  // 1) find middle
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // 2) reverse second half starting at slow
  let prev = null;
  let cur = slow;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  // 3) merge first half and reversed second half
  let first = head;
  let second = prev;
  while (second && first) {
    const t1 = first.next;
    const t2 = second.next;
    first.next = second;
    if (!t1) break;
    second.next = t1;
    first = t1;
    second = t2;
  }
  // ensure tail termination (for even lengths)
  if (first) first.next = null;
  return head;
}

function toArray(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.val);
  return out;
}

if (require.main === module) {
  const a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
  reorderList(a);
  console.log(toArray(a));
}

module.exports = { ListNode, reorderList };
