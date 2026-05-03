const { minCoins } = require("../example-1/pattern");
console.log("amount=0:", minCoins([1,2], 0));
console.log("no coins:", minCoins([], 3));
console.log("note: reject negative amounts upstream to avoid invalid dp sizing.");
