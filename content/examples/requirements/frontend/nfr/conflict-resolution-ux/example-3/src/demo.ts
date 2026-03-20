type Field<T> = { v: T; ts: number };
type Record = { title: Field<string>; body: Field<string> };

function merge(a: Record, b: Record): Record {
  return {
    title: a.title.ts >= b.title.ts ? a.title : b.title,
    body: a.body.ts >= b.body.ts ? a.body : b.body,
  };
}

const local: Record = { title: { v: "Local", ts: 200 }, body: { v: "L", ts: 50 } };
const remote: Record = { title: { v: "Remote", ts: 100 }, body: { v: "R", ts: 300 } };

console.log(JSON.stringify({ merged: merge(local, remote) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

