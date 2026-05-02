const { CountMinSketch } = require("../example-1/count-min-sketch");

const windows = [new CountMinSketch(), new CountMinSketch(), new CountMinSketch()];
const windowSize = windows.length;
let active = 0;

function tick() {
  active = (active + 1) % windowSize;
  windows[active] = new CountMinSketch();
}

function increment(key) {
  windows[active].increment(key);
}

function estimateAcrossWindows(key) {
  return windows.reduce((sum, sketch) => sum + sketch.estimate(key), 0);
}

increment("search");
increment("search");
tick();
increment("search");
increment("view");
tick();
increment("view");

console.log("search last windows:", estimateAcrossWindows("search"));
console.log("view last windows:", estimateAcrossWindows("view"));
