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

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = args.baseUrl.replace(/\/$/, "");
  await json(`${base}/api/reset`, { method: "POST", body: "{}" });

  const analytics = await json<any>(`${base}/api/access`, { method: "POST", body: JSON.stringify({ actor: "agent", userId: "u1", purpose: "analytics" }) });
  assert(!("email" in analytics.data), "analytics must not receive email");

  await json(`${base}/api/dsar/delete`, { method: "POST", body: JSON.stringify({ actor: "agent", userId: "u1" }) });
  const support = await json<any>(`${base}/api/access`, { method: "POST", body: JSON.stringify({ actor: "agent", userId: "u1", purpose: "support" }) });
  assert(support.data.deleted === true, "deleted user should be tombstoned");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

