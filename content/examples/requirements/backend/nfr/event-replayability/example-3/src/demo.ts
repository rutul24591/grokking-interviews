type Update = { key: string; value: string; offset: number };

function compact(updates: Update[]) {
  const latest = new Map<string, Update>();
  for (const u of updates) latest.set(u.key, u);
  return [...latest.values()].sort((a, b) => a.key.localeCompare(b.key));
}

const updates: Update[] = [
  { key: "a", value: "1", offset: 1 },
  { key: "b", value: "1", offset: 2 },
  { key: "a", value: "2", offset: 3 }
];

console.log(JSON.stringify({ compacted: compact(updates) }, null, 2));

