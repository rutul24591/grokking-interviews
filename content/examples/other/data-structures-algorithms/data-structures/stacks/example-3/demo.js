class MinStack {
  constructor() {
    this.values = [];
    this.minimums = [];
  }

  push(value) {
    this.values.push(value);
    if (
      this.minimums.length === 0 ||
      value <= this.minimums[this.minimums.length - 1]
    ) {
      this.minimums.push(value);
    }
  }

  pop() {
    if (this.values.length === 0) throw new Error("stack underflow");
    const value = this.values.pop();
    if (value === this.minimums[this.minimums.length - 1]) {
      this.minimums.pop();
    }
    return value;
  }

  min() {
    return this.minimums[this.minimums.length - 1] ?? null;
  }
}

const stack = new MinStack();
stack.push(5);
stack.push(3);
stack.push(3);
stack.push(8);
console.log("Min before pops:", stack.min());
stack.pop();
stack.pop();
console.log("Min after duplicate pop:", stack.min());

try {
  const empty = new MinStack();
  empty.pop();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
