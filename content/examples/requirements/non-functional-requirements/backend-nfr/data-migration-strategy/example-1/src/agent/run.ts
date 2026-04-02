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

  // legacy write
  await post(b + "/api/migration/state", { phase: "legacy" });
  const u1 = await post(b + "/api/users", { email: "a@example.com", fullName: "Alice Johnson" });
  assert(u1.status === 200 && u1.body.ok === true, "expected create u1");
  const id1 = u1.body.id as string;

  // read_new should fallback until backfilled
  await post(b + "/api/migration/state", { phase: "read_new" });
  const before = await get(b + `/api/users?id=${encodeURIComponent(id1)}`);
  assert(before.status === 200 && before.body.source === "legacy_fallback", "expected legacy fallback");

  // dual write for new users
  await post(b + "/api/migration/state", { phase: "dual_write" });
  const u2 = await post(b + "/api/users", { email: "b@example.com", fullName: "Bob Lee" });
  assert(u2.status === 200, "expected create u2");

  // backfill legacy
  const backfill = await post(b + "/api/migration/backfill", { batchSize: 50 });
  assert(backfill.status === 200 && backfill.body.migrated >= 1, "expected migrated >= 1");

  await post(b + "/api/migration/state", { phase: "read_new" });
  const after = await get(b + `/api/users?id=${encodeURIComponent(id1)}`);
  assert(after.status === 200 && after.body.source === "new", "expected new read after backfill");

  // cutover: new only
  await post(b + "/api/migration/state", { phase: "cutover" });
  const cutoverRead = await get(b + `/api/users?id=${encodeURIComponent(id1)}`);
  assert(cutoverRead.status === 200 && cutoverRead.body.source === "new", "expected cutover new read");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

