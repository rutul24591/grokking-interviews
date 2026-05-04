function isValidParenthesesStack(s) {
  const stack = [];
  const openToClose = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ]);

  for (const ch of s) {
    if (openToClose.has(ch)) {
      stack.push(ch);
      continue;
    }
    const open = stack.pop();
    if (open == null) return false;
    if (openToClose.get(open) !== ch) return false;
  }

  return stack.length === 0;
}

if (require.main === module) {
  console.log(isValidParenthesesStack("()[]{}"));
  console.log(isValidParenthesesStack("(]"));
}

module.exports = { isValidParenthesesStack };
