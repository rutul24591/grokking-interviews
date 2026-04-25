const { BloomFilter } = require("./bloom-filter");

const filter = new BloomFilter(24);
["user:1", "user:2", "user:9"].forEach((value) => filter.add(value));

console.log("user:2 ->", filter.mightContain("user:2"));
console.log("user:5 ->", filter.mightContain("user:5"));
console.log("Bits:", filter.bits.join(""));
