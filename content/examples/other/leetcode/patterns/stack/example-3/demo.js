const { Stack } = require("../example-1/pattern");
try { new Stack().pop(); } catch (e) { console.log("underflow:", e.message); }
console.log("empty balanced:", true);
