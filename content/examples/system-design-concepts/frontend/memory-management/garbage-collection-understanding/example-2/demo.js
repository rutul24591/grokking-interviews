function reachable(graph, roots) {
  const seen = new Set(roots);
  const stack = [...roots];
  while (stack.length) {
    const current = stack.pop();
    for (const next of graph[current] || []) {
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return [...seen].sort();
}

console.log(reachable({ root: ["page"], page: ["cache"], timer: ["closure"] }, ["root"]));
