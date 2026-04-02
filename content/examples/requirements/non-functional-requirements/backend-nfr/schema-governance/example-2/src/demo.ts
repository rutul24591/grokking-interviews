type Field = { name: string; required: boolean };

function backwardCompatible(prev: Field[], next: Field[]) {
  const p = new Map(prev.map((f) => [f.name, f]));
  const n = new Map(next.map((f) => [f.name, f]));
  for (const name of p.keys()) if (!n.has(name)) return { ok: false, reason: `removed ${name}` };
  for (const [name, pf] of p.entries()) {
    const nf = n.get(name)!;
    if (!pf.required && nf.required) return { ok: false, reason: `optional->required ${name}` };
  }
  for (const [name, nf] of n.entries()) if (!p.has(name) && nf.required) return { ok: false, reason: `added required ${name}` };
  return { ok: true };
}

console.log(backwardCompatible([{ name: "id", required: true }], [{ name: "id", required: true }, { name: "x", required: false }]));

