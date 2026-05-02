function permutations(values) {
  const out = [];
  const used = new Array(values.length).fill(false);
  const current = [];
  function dfs() {
    if (current.length === values.length) {
      out.push([...current]);
      return;
    }
    for (let i = 0; i < values.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      current.push(values[i]);
      dfs();
      current.pop();
      used[i] = false;
    }
  }
  dfs();
  return out;
}

module.exports = { permutations };
