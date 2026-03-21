type Capability = "io" | "ro" | "intl";
type Profile = { name: string; supports: Record<Capability, boolean> };

function pickStrategy(p: Profile) {
  const needsPolyfill: Capability[] = [];
  const degrade: Capability[] = [];
  for (const cap of Object.keys(p.supports) as Capability[]) {
    if (p.supports[cap]) continue;
    if (cap === "intl") needsPolyfill.push(cap);
    else degrade.push(cap);
  }
  return { needsPolyfill, degrade };
}

const profiles: Profile[] = [
  { name: "modern", supports: { io: true, ro: true, intl: true } },
  { name: "legacy", supports: { io: false, ro: false, intl: false } },
];

console.log(JSON.stringify({ strategies: profiles.map((p) => ({ name: p.name, ...pickStrategy(p) })) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

