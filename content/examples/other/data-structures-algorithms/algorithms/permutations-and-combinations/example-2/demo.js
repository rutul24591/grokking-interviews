function combinations(values, k) {
  const out = [];
  function dfs(start, chosen) {
    if (chosen.length === k) {
      out.push([...chosen]);
      return;
    }
    for (let i = start; i < values.length; i += 1) {
      chosen.push(values[i]);
      dfs(i + 1, chosen);
      chosen.pop();
    }
  }
  dfs(0, []);
  return out;
}

console.log(combinations(["A","B","C","D"], 2));
