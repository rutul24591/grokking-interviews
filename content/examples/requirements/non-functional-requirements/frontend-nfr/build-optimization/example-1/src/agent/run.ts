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

async function json<T>(url: string): Promise<{ status: number; body: T }> {
  const res = await fetch(url, { headers: { "content-type": "application/json" } });
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

  const s0 = await json<{ heavyLoadCount: number }>(baseUrl + "/api/stats");
  assert(s0.status === 200, "stats failed");
  assert(s0.body.heavyLoadCount === 0, "expected heavy not loaded yet");

  const l = await json<{ heavyLoadCount: number }>(baseUrl + "/api/compute?mode=light&n=2");
  assert(l.status === 200, "light compute failed");
  assert(l.body.heavyLoadCount === 0, "heavy should still be unloaded after light");

  const h1 = await json<{ heavyLoadCount: number }>(baseUrl + "/api/compute?mode=heavy&n=2");
  assert(h1.status === 200, "heavy compute failed");
  assert(h1.body.heavyLoadCount === 1, "heavy should load exactly once");

  const h2 = await json<{ heavyLoadCount: number }>(baseUrl + "/api/compute?mode=heavy&n=2");
  assert(h2.status === 200, "heavy compute failed 2");
  assert(h2.body.heavyLoadCount === 1, "heavy should remain loaded once");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

