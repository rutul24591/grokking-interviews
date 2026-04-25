class CircularQueue {
  constructor(capacity) {
    this.buffer = new Array(capacity);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  }

  enqueue(value) {
    if (this.length === this.capacity) throw new Error("queue overflow");
    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this.length += 1;
  }

  dequeue() {
    if (this.length === 0) throw new Error("queue underflow");
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.length -= 1;
    return value;
  }
}

module.exports = { CircularQueue };
