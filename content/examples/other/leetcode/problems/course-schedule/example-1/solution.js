function canFinishBFSKahn(numCourses, prerequisites) {
  const indegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    indegree[course] += 1;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i += 1) if (indegree[i] === 0) queue.push(i);

  let taken = 0;
  for (let qi = 0; qi < queue.length; qi += 1) {
    const cur = queue[qi];
    taken += 1;
    for (const next of adj[cur]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return taken === numCourses;
}

if (require.main === module) {
  console.log(canFinishBFSKahn(2, [[1, 0]]));
  console.log(canFinishBFSKahn(2, [[1, 0], [0, 1]]));
}

module.exports = { canFinishBFSKahn };
