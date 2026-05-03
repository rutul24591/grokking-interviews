const { maxSlidingWindow } = require("../example-1/pattern");
console.log("k=1:", maxSlidingWindow([2,1,2], 1));
console.log("dupes:", maxSlidingWindow([2,2,2], 2));
try { console.log(maxSlidingWindow([], 3)); } catch (e) { console.log("empty:", e.message); }
