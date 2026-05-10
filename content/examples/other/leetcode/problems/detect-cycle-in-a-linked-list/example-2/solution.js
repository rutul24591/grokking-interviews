class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function hasCycleFloyd(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
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
  console.log(hasCycleFloyd(a));
}

module.exports = { ListNode, hasCycleFloyd };
