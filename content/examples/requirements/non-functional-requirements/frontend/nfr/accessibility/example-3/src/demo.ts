type State = { idx: number; len: number };

function onKey(s: State, key: string): State {
  if (key === "ArrowDown") return { ...s, idx: (s.idx + 1) % s.len };
  if (key === "ArrowUp") return { ...s, idx: (s.idx - 1 + s.len) % s.len };
  if (key === "Home") return { ...s, idx: 0 };
  if (key === "End") return { ...s, idx: s.len - 1 };
  return s;
}

function tabIndexes(s: State) {
  return Array.from({ length: s.len }, (_, i) => (i === s.idx ? 0 : -1));
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

let s: State = { idx: 0, len: 5 };
assert(JSON.stringify(tabIndexes(s)) === JSON.stringify([0, -1, -1, -1, -1]), "initial");

s = onKey(s, "ArrowDown");
assert(s.idx === 1, "down");

s = onKey(s, "End");
assert(s.idx === 4, "end");

s = onKey(s, "ArrowDown");
assert(s.idx === 0, "wrap");

console.log(JSON.stringify({ ok: true, final: s, tabIndexes: tabIndexes(s) }, null, 2));

