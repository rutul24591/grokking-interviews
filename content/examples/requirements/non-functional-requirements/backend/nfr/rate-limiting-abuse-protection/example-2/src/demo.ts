class FixedWindow {
  private windowStartMs = Date.now();
  private count = 0;
  constructor(private readonly limit: number, private readonly windowMs: number) {}

  allow() {
    const now = Date.now();
    if (now - this.windowStartMs >= this.windowMs) {
      this.windowStartMs = now;
      this.count = 0;
    }
    this.count++;
    return { allowed: this.count <= this.limit, count: this.count };
  }
}

const w = new FixedWindow(3, 1000);
console.log([w.allow(), w.allow(), w.allow(), w.allow()]);

