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

  const u = "user_123";
  const a = await json<any>(baseUrl + "/api/release?userId=" + u);
  assert(a.status === 200, "release failed");

  const b = await json<any>(baseUrl + "/api/release?userId=" + u);
  assert(b.body.ring === a.body.ring, "ring assignment should be sticky for same user");

  await json(baseUrl + "/api/update", { method: "POST", body: JSON.stringify({ canaryPct: 0 }) });
  const c = await json<any>(baseUrl + "/api/release?userId=" + u);
  assert(c.body.ring === "stable", "0% canary should send to stable");

  await json(baseUrl + "/api/update", { method: "POST", body: JSON.stringify({ canaryPct: 100 }) });
  const d = await json<any>(baseUrl + "/api/release?userId=" + u);
  assert(d.body.ring === "canary", "100% canary should send to canary");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

