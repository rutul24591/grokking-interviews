const { BloomFilter } = require("../example-1/bloom-filter");

const filter = new BloomFilter(16);
filter.add("account:1");
console.log("Before reset:", filter.mightContain("account:1"));
filter.bits.fill(0);
console.log("After reset:", filter.mightContain("account:1"));
console.log("Observation: plain Bloom filters cannot safely delete one item without affecting others.");
