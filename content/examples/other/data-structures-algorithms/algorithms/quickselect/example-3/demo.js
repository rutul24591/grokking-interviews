const { quickselect } = require("../example-1/algorithm");
console.log("Duplicates:", quickselect([2, 2, 2, 1], 1));
try { quickselect([], 0); } catch (e) { console.log("Empty rejected:", e.message); }
try { quickselect([1,2,3], 99); } catch (e) { console.log("Bad k rejected:", e.message); }
