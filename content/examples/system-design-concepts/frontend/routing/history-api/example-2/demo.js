function nextLength(length, action) {
  return action === "push" ? length + 1 : length;
}

console.log(nextLength(3, "replace"));
console.log(nextLength(3, "push"));
