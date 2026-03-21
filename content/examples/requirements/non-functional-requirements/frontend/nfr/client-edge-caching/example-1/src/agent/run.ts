import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
});

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

async function json<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await json(baseUrl + "/api/reset", { method: "POST", body: "{}" });

  const e1 = await fetch(baseUrl + "/api/edge/resource");
  assert(e1.ok, "edge request failed");
  assert(e1.headers.get("x-edge-cache") === "MISS", "first edge should be MISS");

  const e2 = await fetch(baseUrl + "/api/edge/resource");
  assert(e2.ok, "edge request failed");
  assert(e2.headers.get("x-edge-cache") === "HIT", "second edge should be HIT within TTL");

  const s = await json<{ stats: { originHits: number; edgeHits: number } }>(baseUrl + "/api/stats");
  assert(s.status === 200, "stats failed");
  assert(s.body.stats.originHits === 1, "origin should be hit once");
  assert(s.body.stats.edgeHits >= 1, "edgeHits should be >=1");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

