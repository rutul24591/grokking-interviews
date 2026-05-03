const { Stack } = require("./pattern");
function isBalanced(s) {
  const match = { ")":"(", "]":"[", "}":"{" };
  const st = new Stack();
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") st.push(ch);
    else if (match[ch]) { if (st.pop() !== match[ch]) return false; }
  }
  return st.peek() === null;
}
console.log(isBalanced("({[]})"));
console.log(isBalanced("([)]"));
