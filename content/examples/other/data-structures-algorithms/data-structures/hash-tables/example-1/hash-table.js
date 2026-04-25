class HashTable {
  constructor(bucketCount = 8) {
    this.buckets = Array.from({ length: bucketCount }, () => []);
  }

  #hash(key) {
    let hash = 0;
    for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) % this.buckets.length;
    return hash;
  }

  set(key, value) {
    const bucket = this.buckets[this.#hash(key)];
    const pair = bucket.find((entry) => entry.key === key);
    if (pair) {
      pair.value = value;
      return;
    }
    bucket.push({ key, value });
  }

  get(key) {
    return this.buckets[this.#hash(key)].find((entry) => entry.key === key)?.value ?? null;
  }

  debugBuckets() {
    return this.buckets.map((bucket) => bucket.map((entry) => entry.key));
  }
}

module.exports = { HashTable };
