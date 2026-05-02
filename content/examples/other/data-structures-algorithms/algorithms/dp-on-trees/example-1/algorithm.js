function maxIndependentSet(tree, root) {
  function dfs(node) {
    let include = 1;
    let exclude = 0;
    for (const child of tree[node] ?? []) {
      const { include: ci, exclude: ce } = dfs(child);
      include += ce;
      exclude += Math.max(ci, ce);
    }
    return { include, exclude };
  }
  const res = dfs(root);
  return Math.max(res.include, res.exclude);
}

module.exports = { maxIndependentSet };
