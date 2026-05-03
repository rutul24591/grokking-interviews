const { hasCycle } = require("../example-1/pattern");
console.log("null:", hasCycle(null));
const one = { value: 1, next: null };
console.log("single:", hasCycle(one));
one.next = one;
console.log("self-cycle:", hasCycle(one));
