class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class MinHeap {
  constructor() {
    this.arr = [];
  }
  size() {
    return this.arr.length;
  }
  push(item) {
    this.arr.push(item);
    this._siftUp(this.arr.length - 1);
  }
  pop() {
    if (this.arr.length === 0) return null;
    const top = this.arr[0];
    const last = this.arr.pop();
    if (this.arr.length > 0) {
      this.arr[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  _siftUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.arr[p].val <= this.arr[i].val) break;
      [this.arr[p], this.arr[i]] = [this.arr[i], this.arr[p]];
      i = p;
    }
  }
  _siftDown(i) {
    const n = this.arr.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.arr[l].val < this.arr[smallest].val) smallest = l;
      if (r < n && this.arr[r].val < this.arr[smallest].val) smallest = r;
      if (smallest === i) break;
      [this.arr[i], this.arr[smallest]] = [this.arr[smallest], this.arr[i]];
      i = smallest;
    }
  }
}

function mergeKListsHeap(lists) {
  const heap = new MinHeap();
  for (const head of lists) if (head) heap.push(head);

  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    const node = heap.pop();
    tail.next = node;
    tail = tail.next;
    if (node.next) heap.push(node.next);
  }
  tail.next = null;
  return dummy.next;
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
  console.log(toArray(mergeKListsHeap([a, b, c])));
}

module.exports = { ListNode, mergeKListsHeap };
