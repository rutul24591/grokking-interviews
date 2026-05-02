const { karatsuba } = require("../example-1/algorithm");
console.log(karatsuba(0n, 999n));
console.log(karatsuba(7n, 9n));
console.log("Observation: handle signs explicitly if you extend to negative integers.");
