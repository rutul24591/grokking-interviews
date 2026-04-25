const { CountMinSketch } = require("../example-1/count-min-sketch");

const sketch = new CountMinSketch();
const events = ["/home", "/home", "/pricing", "/home", "/docs", "/docs"];
events.forEach((event) => sketch.increment(event));

const ranked = ["/home", "/pricing", "/docs"].map((key) => ({
  key,
  estimate: sketch.estimate(key),
}));

ranked.sort((a, b) => b.estimate - a.estimate);
console.table(ranked);
