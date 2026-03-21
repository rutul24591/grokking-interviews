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

async function post(url: string) {
  const res = await fetch(url, { method: "POST" });
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

  await post(b + "/api/cache/flush");

  const a = await get(b + "/api/profile?userId=u1");
  assert(a.status === 200 && a.body.cache.hit === false, "expected first fetch miss");

  const b2 = await get(b + "/api/profile?userId=u1");
  assert(b2.status === 200 && b2.body.cache.hit === true, "expected second fetch hit");

  await post(b + "/api/cache/flush");
  const concurrency = 20;
  const results = await Promise.all(
    Array.from({ length: concurrency }, () => get(b + "/api/profile?userId=u2"))
  );
  assert(results.every((r) => r.status === 200), "expected all concurrent fetches ok");

  const last = results[results.length - 1]!;
  assert(last.body.computeCount === 1, `expected computeCount=1 with singleflight (got ${last.body.computeCount})`);

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

