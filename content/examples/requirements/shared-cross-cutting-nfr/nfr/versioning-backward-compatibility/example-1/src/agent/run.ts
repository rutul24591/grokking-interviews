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

  await json(`${base}/api/v2/profile`, { method: "PATCH", body: JSON.stringify({ displayName: "Grace", locale: "en" }) });
  const v1 = await json<any>(`${base}/api/v1/profile`);
  assert(v1.name === "Grace", "v1 should reflect v2 write");

  await json(`${base}/api/v1/profile`, { method: "PATCH", body: JSON.stringify({ name: "Ada" }) });
  const v2 = await json<any>(`${base}/api/v2/profile`);
  assert(v2.displayName === "Ada", "v2 should reflect v1 write via shim");
  assert(v2.name === "Ada", "v2 should keep compat name field");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

