export class Pool {
  constructor(size) {
    this.size = size;
    this.active = 0;
    this.queue = [];
  }

  async run(task) {
    if (this.active >= this.size) {
      return new Promise((resolve, reject) => {
        this.queue.push({ task, resolve, reject });
      });
    }
    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
      const next = this.queue.shift();
      if (next) {
        this.run(next.task).then(next.resolve).catch(next.reject);
      }
    }
  }
}