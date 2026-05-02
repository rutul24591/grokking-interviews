class CountingBloom {
  constructor(size = 16) {
    this.size = size;
    this.counters = new Array(size).fill(0);
  }

  #hashes(value) {
    const codes = [...value].map((char) => char.charCodeAt(0));
    const sum = codes.reduce((total, code) => total + code, 0);
    const weighted = codes.reduce((total, code, index) => total + code * (index + 1), 0);
    return [sum % this.size, weighted % this.size, (sum * 3 + weighted) % this.size];
  }

  add(value) {
    for (const index of this.#hashes(value)) this.counters[index] += 1;
  }

  remove(value) {
    for (const index of this.#hashes(value)) {
      if (this.counters[index] === 0) throw new Error("counter underflow");
      this.counters[index] -= 1;
    }
  }

  mightContain(value) {
    return this.#hashes(value).every((index) => this.counters[index] > 0);
  }
}

const filter = new CountingBloom(12);
filter.add("A");
filter.add("B");
console.log("A before delete:", filter.mightContain("A"));
filter.remove("A");
console.log("A after delete:", filter.mightContain("A"));
console.log("B after A delete:", filter.mightContain("B"));
