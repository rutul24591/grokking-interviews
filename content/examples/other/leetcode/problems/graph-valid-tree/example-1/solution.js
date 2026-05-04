function validTreeDFS(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Array(n).fill(false);

  function dfs(node, parent) {
    visited[node] = true;
    for (const nxt of adj[node]) {
      if (nxt === parent) continue;
      if (visited[nxt]) return false; // cycle
      if (!dfs(nxt, node)) return false;
    }
    return true;
  }

  if (n === 0) return true;
  if (!dfs(0, -1)) return false;
  for (const v of visited) if (!v) return false; // not connected
  return true;
}

if (require.main === module) {
  console.log(validTreeDFS(5, [[0, 1], [0, 2], [0, 3], [1, 4]]));
  console.log(validTreeDFS(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]));
}

module.exports = { validTreeDFS };
