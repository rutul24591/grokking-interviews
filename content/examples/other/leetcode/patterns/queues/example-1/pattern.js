class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() {
    if (this.head >= this.items.length) return null;
    const value = this.items[this.head++];
    if (this.head > 64 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return value;
  }
  size() { return this.items.length - this.head; }
}

module.exports = { Queue };
