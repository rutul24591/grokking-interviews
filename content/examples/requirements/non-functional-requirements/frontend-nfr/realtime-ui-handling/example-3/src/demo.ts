type Msg = { cursor: number; id: string };

function merge(prev: Msg[], incoming: Msg[]) {
  const byCursor = new Map(prev.map((m) => [m.cursor, m]));
  for (const m of incoming) byCursor.set(m.cursor, m);
  return [...byCursor.values()].sort((a, b) => b.cursor - a.cursor);
}

const prev = [
  { cursor: 3, id: "m3" },
  { cursor: 2, id: "m2" }
];
const incoming = [
  { cursor: 4, id: "m4" },
  { cursor: 3, id: "m3_dup" } // duplicate cursor, should overwrite or be ignored deterministically
];

console.log(JSON.stringify({ prev, incoming, merged: merge(prev, incoming) }, null, 2));

