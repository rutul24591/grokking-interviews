const { hasCycle } = require("./pattern");

function node(value) { return { value, next: null }; }
const a = node("A"); const b = node("B"); const c = node("C");
a.next = b; b.next = c;
console.log("acyclic:", hasCycle(a));
c.next = b;
console.log("cyclic:", hasCycle(a));
