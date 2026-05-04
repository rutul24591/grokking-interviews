class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeTwo(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}

function mergeKListsPairwise(lists) {
  let merged = null;
  for (const head of lists) merged = mergeTwo(merged, head);
  return merged;
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
  const a = new ListNode(1, new ListNode(4, new ListNode(5)));
  const b = new ListNode(1, new ListNode(3, new ListNode(4)));
  const c = new ListNode(2, new ListNode(6));
  console.log(toArray(mergeKListsPairwise([a, b, c])));
}

module.exports = { ListNode, mergeKListsPairwise };
