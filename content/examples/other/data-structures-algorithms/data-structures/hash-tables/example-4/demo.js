class LinearProbingTable {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.keys = new Array(capacity).fill(null);
    this.values = new Array(capacity).fill(null);
  }

  #hash(key) {
    let hash = 0;
    for (const char of key) hash = (hash * 33 + char.charCodeAt(0)) % this.capacity;
    return hash;
  }

  set(key, value) {
    let index = this.#hash(key);
    for (let probe = 0; probe < this.capacity; probe += 1) {
      const slot = (index + probe) % this.capacity;
      if (this.keys[slot] === null || this.keys[slot] === key) {
        this.keys[slot] = key;
        this.values[slot] = value;
        return slot;
      }
    }
    throw new Error("table full");
  }

  get(key) {
    let index = this.#hash(key);
    for (let probe = 0; probe < this.capacity; probe += 1) {
      const slot = (index + probe) % this.capacity;
      if (this.keys[slot] === null) return null;
      if (this.keys[slot] === key) return this.values[slot];
    }
    return null;
  }
}

const table = new LinearProbingTable(6);
["aa", "bb", "cc", "dd"].forEach((key, idx) => table.set(key, idx));
console.log("Keys array:", table.keys);
console.log("Lookup cc:", table.get("cc"));
