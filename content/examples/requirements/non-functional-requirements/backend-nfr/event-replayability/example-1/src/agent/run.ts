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

  await post(b + "/api/events/append", { type: "post.published", payload: { postId: "p1" } });
  await post(b + "/api/events/append", { type: "post.viewed", payload: { postId: "p1" } });
  await post(b + "/api/events/append", { type: "post.viewed", payload: { postId: "p1" } });

  const all = await get(b + "/api/events/read?from=0&limit=10");
  assert(all.status === 200 && all.body.events.length === 3, "expected 3 events");

  await post(b + "/api/consumer/commit", { consumerId: "c1", nextOffset: 2 });
  const ck = await get(b + "/api/consumer/state?consumerId=c1");
  assert(ck.status === 200 && ck.body.checkpoint === 2, "expected checkpoint 2");

  // Reset and replay
  await post(b + "/api/consumer/reset", { consumerId: "c1", toOffset: 0 });
  const ck2 = await get(b + "/api/consumer/state?consumerId=c1");
  assert(ck2.status === 200 && ck2.body.checkpoint === 0, "expected checkpoint reset");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

