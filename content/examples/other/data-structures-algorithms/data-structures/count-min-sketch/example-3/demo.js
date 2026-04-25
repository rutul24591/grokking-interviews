const { CountMinSketch } = require("../example-1/count-min-sketch");

const sketch = new CountMinSketch(2, 4);
["A", "B", "C", "A"].forEach((value) => sketch.increment(value));

console.log("A exact=2 estimate=", sketch.estimate("A"));
console.log("B exact=1 estimate=", sketch.estimate("B"));
console.log("Observation: collisions can only push estimates upward.");
