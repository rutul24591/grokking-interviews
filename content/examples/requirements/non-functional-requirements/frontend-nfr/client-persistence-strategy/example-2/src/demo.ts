type V1 = { v: 1; text: string };
type V2 = { v: 2; body: string; updatedAt: number };

function migrate(v: V1 | V2): V2 {
  if (v.v === 2) return v;
  return { v: 2, body: v.text, updatedAt: Date.now() };
}

const old: V1 = { v: 1, text: "hello" };
const migrated = migrate(old);
console.log(JSON.stringify({ migrated }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

