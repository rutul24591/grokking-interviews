const layers = { Atom: 0, Molecule: 1, Organism: 2, Template: 3, Page: 4 };

function validateDependencies(edges) {
  return edges.map(({ from, to }) => ({
    from,
    to,
    valid: layers[to] <= layers[from],
    reason: layers[to] <= layers[from] ? "allowed" : `${from} should not depend on higher layer ${to}`
  }));
}

console.log(validateDependencies([
  { from: "Molecule", to: "Atom" },
  { from: "Template", to: "Organism" },
  { from: "Atom", to: "Organism" }
]));
