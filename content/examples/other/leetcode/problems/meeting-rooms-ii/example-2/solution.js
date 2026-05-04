class MinHeap {
  constructor() {
    this.arr = [];
  }
  size() {
    return this.arr.length;
  }
  peek() {
    return this.arr.length ? this.arr[0] : null;
  }
  push(x) {
    this.arr.push(x);
    this._up(this.arr.length - 1);
  }
  pop() {
    if (!this.arr.length) return null;
    const top = this.arr[0];
    const last = this.arr.pop();
    if (this.arr.length) {
      this.arr[0] = last;
      this._down(0);
    }
    return top;
  }
  _up(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.arr[p] <= this.arr[i]) break;
      [this.arr[p], this.arr[i]] = [this.arr[i], this.arr[p]];
      i = p;
    }
  }
  _down(i) {
    const n = this.arr.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.arr[l] < this.arr[s]) s = l;
      if (r < n && this.arr[r] < this.arr[s]) s = r;
      if (s === i) break;
      [this.arr[i], this.arr[s]] = [this.arr[s], this.arr[i]];
      i = s;
    }
  }
}

function minMeetingRoomsHeap(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap(); // end times
  for (const [start, end] of intervals) {
    const earliest = heap.peek();
    if (earliest != null && start >= earliest) heap.pop();
    heap.push(end);
  }
  return heap.size();
}

if (require.main === module) {
  console.log(minMeetingRoomsHeap([[0, 30], [5, 10], [15, 20]]));
  console.log(minMeetingRoomsHeap([[7, 10], [2, 4]]));
}

module.exports = { minMeetingRoomsHeap };
