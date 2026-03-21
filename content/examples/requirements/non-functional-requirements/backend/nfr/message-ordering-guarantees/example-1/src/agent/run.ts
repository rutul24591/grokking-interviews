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

  await post(b + "/api/stream/reset", {});

  await post(b + "/api/stream/publish", { streamId: "s1", seq: 1, payload: { v: "a" } });
  await post(b + "/api/stream/publish", { streamId: "s1", seq: 3, payload: { v: "c" } });

  const mid = await get(b + "/api/stream/state?streamId=s1");
  assert(mid.status === 200, "expected state 200");
  assert(JSON.stringify(mid.body.state.processedSeqs) === JSON.stringify([1]), "expected only seq 1 processed");
  assert(JSON.stringify(mid.body.state.bufferedSeqs) === JSON.stringify([3]), "expected seq 3 buffered");

  await post(b + "/api/stream/publish", { streamId: "s1", seq: 2, payload: { v: "b" } });
  const end = await get(b + "/api/stream/state?streamId=s1");
  assert(JSON.stringify(end.body.state.processedSeqs) === JSON.stringify([1, 2, 3]), "expected processed 1,2,3");

  // Duplicate publish is ignored.
  const dup = await post(b + "/api/stream/publish", { streamId: "s1", seq: 2, payload: { v: "b" } });
  assert(dup.status === 200 && dup.body.accepted === false, "expected duplicate ignored");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

