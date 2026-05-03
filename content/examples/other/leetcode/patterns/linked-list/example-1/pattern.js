function removeNthFromEnd(head, n) {
  if (!head) return null;
  const dummy = { next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i += 1) {
    if (!fast.next) return head;
    fast = fast.next;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}

module.exports = { removeNthFromEnd };
