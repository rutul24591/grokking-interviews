class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  push(value) {
    this.items.push(value);
    this.#siftUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length === 0) throw new Error("heap underflow");
    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      this.items[0] = last;
      this.#siftDown(0);
    }
    return min;
  }

  peek() {
    return this.items[0] ?? null;
  }

  #siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(this.items[idx], this.items[parent]) >= 0) break;
      [this.items[idx], this.items[parent]] = [this.items[parent], this.items[idx]];
      idx = parent;
    }
  }

  #siftDown(idx) {
    while (true) {
      let best = idx;
      const left = idx * 2 + 1;
      const right = idx * 2 + 2;
      if (left < this.items.length && this.compare(this.items[left], this.items[best]) < 0) best = left;
      if (right < this.items.length && this.compare(this.items[right], this.items[best]) < 0) best = right;
      if (best === idx) return;
      [this.items[idx], this.items[best]] = [this.items[best], this.items[idx]];
      idx = best;
    }
  }
}

function kthLargest(nums, k) {
  const heap = new MinHeap((a, b) => a - b);
  for (const n of nums) {
    heap.push(n);
    if (heap.items.length > k) heap.pop();
  }
  return heap.peek();
}

module.exports = { MinHeap, kthLargest };
