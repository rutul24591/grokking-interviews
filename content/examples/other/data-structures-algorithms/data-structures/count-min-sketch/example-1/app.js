const { CountMinSketch } = require("./count-min-sketch");

const sketch = new CountMinSketch();
["search", "view", "search", "click", "search", "view"].forEach((event) => {
  sketch.increment(event);
});

console.log("search estimate:", sketch.estimate("search"));
console.log("view estimate:", sketch.estimate("view"));
console.log("table:", sketch.table);
