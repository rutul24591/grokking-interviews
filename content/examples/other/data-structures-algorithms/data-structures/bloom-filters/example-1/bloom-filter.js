class BloomFilter {
  constructor(size = 32) {
    this.size = size;
    this.bits = new Array(size).fill(0);
  }

  #hashes(value) {
    const codes = [...value].map((char) => char.charCodeAt(0));
    const sum = codes.reduce((total, code) => total + code, 0);
    const weighted = codes.reduce((total, code, index) => total + code * (index + 1), 0);
    return [sum % this.size, weighted % this.size, (sum * 7 + weighted) % this.size];
  }

  add(value) {
    for (const index of this.#hashes(value)) this.bits[index] = 1;
  }

  mightContain(value) {
    return this.#hashes(value).every((index) => this.bits[index] === 1);
  }
}

module.exports = { BloomFilter };
