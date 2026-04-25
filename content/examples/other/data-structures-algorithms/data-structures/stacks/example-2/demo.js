function isBalanced(expression) {
  const matches = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const char of expression) {
    if (Object.values(matches).includes(char)) stack.push(char);
    if (matches[char] && stack.pop() !== matches[char]) return false;
  }

  return stack.length === 0;
}

console.log("({[]}) ->", isBalanced("({[]})"));
console.log("([)] ->", isBalanced("([)]"));
