import { z } from "zod";

const ArgsSchema = z.object({ baseUrl: z.string().url() });

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    out[key] = value;
  }
  return ArgsSchema.parse(out);
}

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
}

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const o1 = await post(b + "/api/orders", { amountUsd: 10 });
  assert(o1.status === 200 && o1.body.ok === true, "expected o1 created");
  const id1 = o1.body.order.id as string;

  const snap = await post(b + "/api/dr/snapshot", {});
  assert(snap.status === 200 && snap.body.snapshot?.id, "expected snapshot");
  const snapshotId = snap.body.snapshot.id as string;

  const o2 = await post(b + "/api/orders", { amountUsd: 11 });
  assert(o2.status === 200 && o2.body.order?.id, "expected o2 created");
  const id2 = o2.body.order.id as string;

  await post(b + "/api/dr/outage", {});
  const writeDuringOutage = await post(b + "/api/orders", { amountUsd: 12 });
  assert(writeDuringOutage.status === 503, "expected writes blocked during outage");

  await post(b + "/api/dr/restore", { snapshotId });

  const r1 = await get(b + `/api/orders?id=${encodeURIComponent(id1)}`);
  assert(r1.status === 200, "expected o1 restored");

  const r2 = await get(b + `/api/orders?id=${encodeURIComponent(id2)}`);
  assert(r2.status === 404, "expected o2 lost after restore (RPO window)");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

