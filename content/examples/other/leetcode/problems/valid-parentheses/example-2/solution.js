function isValidParenthesesFast(s) {
  const stack = [];
  const closingToOpening = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"],
  ]);

  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (closingToOpening.has(ch)) {
      const open = stack.pop();
      if (open !== closingToOpening.get(ch)) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}

if (require.main === module) {
  console.log(isValidParenthesesFast("()[]{}"));
  console.log(isValidParenthesesFast("([)]"));
}

module.exports = { isValidParenthesesFast };
