type Draft = { title: string; body: string; updatedAt: number };

function merge(local: Draft, remote: Draft): Draft {
  // Simple policy: field-level last-write-wins by timestamp.
  return {
    title: local.updatedAt >= remote.updatedAt ? local.title : remote.title,
    body: local.updatedAt >= remote.updatedAt ? local.body : remote.body,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
}

const local: Draft = { title: "T1", body: "L", updatedAt: 200 };
const remote: Draft = { title: "T2", body: "R", updatedAt: 100 };

console.log(JSON.stringify({ merged: merge(local, remote) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

