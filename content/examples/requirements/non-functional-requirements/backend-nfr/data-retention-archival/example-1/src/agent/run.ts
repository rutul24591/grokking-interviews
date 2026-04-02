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

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  // 10 days old => archive
  const a = await post(b + "/api/events/ingest", { userId: "u1", kind: "view", createdAt: daysAgoIso(10) });
  assert(a.status === 200, "expected ingest a");

  // 40 days old => delete
  const d = await post(b + "/api/events/ingest", { userId: "u2", kind: "view", createdAt: daysAgoIso(40) });
  assert(d.status === 200, "expected ingest d");

  // 40 days old but legal hold => keep active
  await post(b + "/api/retention/hold", { userId: "u3", enabled: true });
  const h = await post(b + "/api/events/ingest", { userId: "u3", kind: "view", createdAt: daysAgoIso(40) });
  assert(h.status === 200, "expected ingest h");

  const run = await post(b + "/api/retention/run", {});
  assert(run.status === 200 && run.body.ok === true, "expected retention run ok");
  assert(run.body.result.archived >= 1, "expected at least one archived");
  assert(run.body.result.deleted >= 1, "expected at least one deleted");

  const activeU3 = await get(b + "/api/events/query?store=active&userId=u3");
  assert(activeU3.status === 200 && activeU3.body.events.length === 1, "expected legal hold event kept");

  const archiveU1 = await get(b + "/api/events/query?store=archive&userId=u1");
  assert(archiveU1.status === 200 && archiveU1.body.events.length === 1, "expected archived event present");

  const activeU2 = await get(b + "/api/events/query?store=active&userId=u2");
  assert(activeU2.status === 200 && activeU2.body.events.length === 0, "expected deleted event removed");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

