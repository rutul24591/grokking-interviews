function canFinishDFS(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) adj[prereq].push(course);

  // 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Array(numCourses).fill(0);

  function dfs(node) {
    if (state[node] === 1) return false; // cycle
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const nxt of adj[node]) {
      if (!dfs(nxt)) return false;
    }
    state[node] = 2;
    return true;
  }

  for (let i = 0; i < numCourses; i += 1) {
    if (!dfs(i)) return false;
  }
  return true;
}

if (require.main === module) {
  console.log(canFinishDFS(2, [[1, 0]]));
  console.log(canFinishDFS(2, [[1, 0], [0, 1]]));
}

module.exports = { canFinishDFS };
