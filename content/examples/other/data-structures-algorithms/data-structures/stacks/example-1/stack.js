class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    if (this.items.length === 0) {
      throw new Error("stack underflow");
    }
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1] ?? null;
  }

  size() {
    return this.items.length;
  }
}

module.exports = { Stack };
