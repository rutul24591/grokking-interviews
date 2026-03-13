// Simple connection pool implementation.

class ConnectionPool {
  constructor(size) {
    this.size = size;
    this.available = Array.from({ length: size }, (_, i) => ({ id: i + 1 }));
    this.inUse = new Set();
    this.queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (this.available.length > 0) {
        const conn = this.available.pop();
        this.inUse.add(conn);
        resolve(conn);
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release(conn) {
    this.inUse.delete(conn);
    const waiter = this.queue.shift();
    if (waiter) {
      this.inUse.add(conn);
      waiter(conn);
    } else {
      this.available.push(conn);
    }
  }
}

module.exports = { ConnectionPool };
