function assertAcyclic(workflow) {
  const graph = new Map(workflow.agents.map((agent) => [agent, []]));
  for (const [from, to] of workflow.edges) graph.get(from).push(to);

  const visiting = new Set();
  const visited = new Set();

  function visit(agent) {
    if (visiting.has(agent)) return { ok: false, cycleAt: agent };
    if (visited.has(agent)) return { ok: true };

    visiting.add(agent);
    for (const next of graph.get(agent) ?? []) {
      const result = visit(next);
      if (!result.ok) return result;
    }
    visiting.delete(agent);
    visited.add(agent);
    return { ok: true };
  }

  for (const agent of workflow.agents) {
    const result = visit(agent);
    if (!result.ok) return result;
  }
  return { ok: true };
}

function buildDependencyState(workflow) {
  const waitingOn = new Map(workflow.agents.map((agent) => [agent, new Set()]));
  const completed = new Set();
  for (const [from, to] of workflow.edges) waitingOn.get(to).add(from);
  return { waitingOn, completed };
}

function readyAgents(state) {
  const ready = [];
  for (const [agent, dependencies] of state.waitingOn.entries()) {
    if (state.completed.has(agent)) continue;
    const isReady = [...dependencies].every((dependency) => state.completed.has(dependency));
    if (isReady) ready.push(agent);
  }
  return ready;
}

function markAgentCompleted(state, agent) {
  state.completed.add(agent);
  return readyAgents(state);
}

module.exports = {
  assertAcyclic,
  buildDependencyState,
  markAgentCompleted,
  readyAgents,
};
