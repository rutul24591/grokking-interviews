import { setTimeout as delay } from "node:timers/promises";
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

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
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

  await post(b + "/api/reset");
  await post(b + "/api/ingest", { items: Array.from({ length: 50 }, (_, i) => `i${i}`) });

  await delay(300);
  const stats = await get(b + "/api/stats");
  assert(stats.status === 200 && stats.body.ok === true, "expected stats ok");
  const s = stats.body.stats as { processed: number; batches: number };
  assert(s.processed >= 50, `expected processed >= 50 (got ${s.processed})`);
  assert(s.batches < s.processed, "expected fewer batches than items (micro-batching)");

  console.log(JSON.stringify({ ok: true, stats: s }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

