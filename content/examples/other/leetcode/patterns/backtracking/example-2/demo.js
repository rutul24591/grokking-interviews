const assert = require("node:assert/strict");

function buildGraph(edges) {
  const g = new Map();
  for (const [a, b] of edges) {
    if (!g.has(a)) g.set(a, new Set());
    if (!g.has(b)) g.set(b, new Set());
    g.get(a).add(b);
    g.get(b).add(a);
  }
  return g;
}

function isConsistent(graph, assignment, varName, value) {
  for (const neighbor of graph.get(varName) ?? []) {
    const assigned = assignment.get(neighbor);
    if (assigned !== undefined && assigned === value) return false;
  }
  return true;
}

function chooseNextVariableNaive(variables, assignment) {
  for (const v of variables) if (!assignment.has(v)) return v;
  return null;
}

function chooseNextVariableMRV(graph, variables, domains, assignment) {
  let best = null;
  let bestSize = Infinity;
  for (const v of variables) {
    if (assignment.has(v)) continue;
    const size = domains.get(v).size;
    if (size < bestSize) {
      best = v;
      bestSize = size;
    }
  }
  return best;
}

function forwardCheck(graph, domains, varName, value) {
  const pruned = [];
  for (const neighbor of graph.get(varName) ?? []) {
    const d = domains.get(neighbor);
    if (!d || !d.has(value)) continue;
    d.delete(value);
    pruned.push([neighbor, value]);
  }
  return pruned;
}

function restore(domains, pruned) {
  for (const [v, value] of pruned) domains.get(v).add(value);
}

function backtrackColoring({
  graph,
  variables,
  colors,
  initialDomains,
  strategy, // "naive" | "mrv+fc"
  maxSteps = 50_000,
}) {
  const assignment = new Map();
  const domains = new Map(
    variables.map((v) => [v, new Set(initialDomains?.get(v) ?? colors)]),
  );
  let steps = 0;

  function solve() {
    steps += 1;
    if (steps > maxSteps) throw new Error(`step limit exceeded (${maxSteps})`);
    const next =
      strategy === "naive"
        ? chooseNextVariableNaive(variables, assignment)
        : chooseNextVariableMRV(graph, variables, domains, assignment);
    if (next === null) return true;

    const values = [...domains.get(next)];
    for (const color of values) {
      if (!isConsistent(graph, assignment, next, color)) continue;
      assignment.set(next, color);
      const pruned = strategy === "mrv+fc" ? forwardCheck(graph, domains, next, color) : [];
      // Early fail if any unassigned variable ran out of candidates.
      if (strategy === "mrv+fc") {
        let dead = false;
        for (const v of variables) {
          if (assignment.has(v)) continue;
          if (domains.get(v).size === 0) {
            dead = true;
            break;
          }
        }
        if (!dead && solve()) return true;
      } else if (solve()) {
        return true;
      }
      restore(domains, pruned);
      assignment.delete(next);
    }
    return false;
  }

  const ok = solve();
  return { ok, assignment, steps };
}

// A small CSP: graph coloring (3 colors). This is a common way to explain MRV + forward-checking.
const edges = [
  ["A", "B"],
  ["A", "C"],
  ["B", "C"],
  ["B", "D"],
  ["C", "D"],
  ["C", "E"],
  ["D", "E"],
  ["D", "F"],
  ["E", "F"],
];
const graph = buildGraph(edges);
const variables = ["A", "B", "C", "D", "E", "F"];
const colors = ["R", "G", "B"];

// A production-style follow-up: domains are often *not* uniform due to pre-filled constraints.
// Here we constrain `D` to a single color, which makes variable ordering matter.
const initialDomains = new Map([["B", ["R"]]]);

const naive = backtrackColoring({ graph, variables, colors, initialDomains, strategy: "naive" });
const mrv = backtrackColoring({ graph, variables, colors, initialDomains, strategy: "mrv+fc" });

console.log("naive steps:", naive.steps, "assignment:", Object.fromEntries(naive.assignment));
console.log("mrv+fc steps:", mrv.steps, "assignment:", Object.fromEntries(mrv.assignment));

assert.equal(naive.ok, true);
assert.equal(mrv.ok, true);
assert.ok(mrv.steps < naive.steps);

console.log("OK: MRV + forward-checking reduces branching on this instance.");
