class LSMStore {
  constructor(flushThreshold = 3) {
    this.flushThreshold = flushThreshold;
    this.memtable = new Map();
    this.sstables = [];
  }

  put(key, value) {
    this.memtable.set(key, value);
    if (this.memtable.size >= this.flushThreshold) this.flush();
  }

  get(key) {
    if (this.memtable.has(key)) return this.memtable.get(key);
    for (const table of this.sstables) {
      if (table.has(key)) return table.get(key);
    }
    return null;
  }

  flush() {
    const sorted = new Map([...this.memtable.entries()].sort(([a], [b]) => a.localeCompare(b)));
    this.sstables.unshift(sorted);
    this.memtable.clear();
  }
}

module.exports = { LSMStore };
