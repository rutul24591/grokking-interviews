type NodeId = string;

function choose<T>(arr: T[], k: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < k && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]!);
  }
  return out;
}

function intersects(a: Set<NodeId>, b: Set<NodeId>) {
  for (const x of a) if (b.has(x)) return true;
  return false;
}

function simulateOnce(N: number, R: number, W: number) {
  const nodes = Array.from({ length: N }, (_, i) => `n${i + 1}`);
  const writeAcks = new Set(choose(nodes, W));
  const readAcks = new Set(choose(nodes, R));
  return { N, R, W, intersects: intersects(writeAcks, readAcks), writeAcks: [...writeAcks], readAcks: [...readAcks] };
}

const cases = [
  { N: 3, R: 1, W: 1 },
  { N: 3, R: 2, W: 2 },
  { N: 5, R: 2, W: 3 }
];

const results = cases.map((c) => simulateOnce(c.N, c.R, c.W));
console.log(JSON.stringify({ note: "randomized single-run illustration", results }, null, 2));

