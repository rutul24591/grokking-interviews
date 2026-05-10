class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeTwoListsRecursive(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  }
  l2.next = mergeTwoListsRecursive(l1, l2.next);
  return l2;
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
  const a = new ListNode(1, new ListNode(2, new ListNode(4)));
  const b = new ListNode(1, new ListNode(3, new ListNode(4)));
  console.log(toArray(mergeTwoListsRecursive(a, b)));
}

module.exports = { ListNode, mergeTwoListsRecursive };
