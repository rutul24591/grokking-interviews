const { Stack } = require("./stack");

const undo = new Stack();
const redo = new Stack();
let document = "draft";

function apply(change) {
  undo.push(document);
  document = change(document);
  redo.items.length = 0;
}

apply(() => "draft v2");
apply(() => "draft v3");
document = undo.pop();
redo.push("draft v3");
document = undo.pop();

console.log("Current document:", document);
console.log("Redo candidate:", redo.peek());
console.log("Undo depth:", undo.size());
