// Demonstrates partitioned reads.

const { write, readRange } = require("./store");

write("tenant-1", 1, { metric: 10 });
write("tenant-1", 2, { metric: 12 });
write("tenant-1", 3, { metric: 9 });
write("tenant-2", 1, { metric: 7 });

console.log(readRange("tenant-1", 1, 3));
console.log(readRange("tenant-2", 1, 2));
