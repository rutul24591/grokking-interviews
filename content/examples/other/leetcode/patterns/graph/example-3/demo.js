const { shortestPath } = require("../example-1/pattern");
console.log(shortestPath({ A: ["A"], B: [] }, "A", "B"));
console.log(shortestPath({ A: ["A"] }, "A", "A"));
