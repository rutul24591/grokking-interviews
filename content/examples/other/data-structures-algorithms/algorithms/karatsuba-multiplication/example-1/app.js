const { karatsuba } = require("./algorithm");
const a = 12345678901234567890n;
const b = 98765432109876543210n;
console.log("Karatsuba:", karatsuba(a, b));
console.log("BigInt * :", a * b);
