const { BloomFilter } = require("../example-1/bloom-filter");

const filter = new BloomFilter(12);
["A", "B", "C", "D", "E", "F"].forEach((value) => filter.add(value));

console.log("Known member A:", filter.mightContain("A"));
console.log("Potential false positive Z:", filter.mightContain("Z"));
console.log("Dense bitset:", filter.bits.join(""));
