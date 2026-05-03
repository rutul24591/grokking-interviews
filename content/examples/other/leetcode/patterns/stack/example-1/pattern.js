class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }
  pop() { if (!this.items.length) throw new Error("underflow"); return this.items.pop(); }
  peek() { return this.items[this.items.length - 1] ?? null; }
}

module.exports = { Stack };
