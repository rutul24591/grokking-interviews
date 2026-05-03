const { factorial } = require("../example-1/pattern");
console.log("0!:", factorial(0));
try { factorial(-1); } catch (e) { console.log("negative:", e.message); }
console.log("note: avoid deep recursion in JS for large n.");
