// Demonstrates time-bucketed writes and retention.

const store = require("./store");

const now = Date.now();
store.writeMetric("cpu", 0.4, now - 1000 * 60 * 10);
store.writeMetric("cpu", 0.6, now - 1000 * 60 * 5);
store.writeMetric("cpu", 0.9, now);

console.log("Range", store.queryRange(now - 1000 * 60 * 15, now));
store.enforceRetention(now + 1000 * 60 * 61);
console.log("After retention", store.queryRange(now - 1000 * 60 * 15, now));
