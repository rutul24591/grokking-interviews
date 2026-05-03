const { reverseList } = require("../example-1/pattern");
console.log(reverseList(null));
console.log(reverseList({ v: 1, next: null }));
console.log("note: validate m/n in reverseBetween; out-of-range should be rejected or handled explicitly.");
