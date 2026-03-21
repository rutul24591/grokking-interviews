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
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { status: res.status, retryAfter: res.headers.get("retry-after"), body: json };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  await post(b + "/api/work/reset");

  const results = await Promise.all(Array.from({ length: 45 }, () => post(b + "/api/work", { ms: 900 })));
  const ok = results.filter((r) => r.status === 200).length;
  const limited = results.filter((r) => r.status === 429).length;
  assert(ok > 0, "expected some accepted");
  assert(limited > 0, "expected some 429 backpressure");
  assert(results.some((r) => r.status === 429 && r.retryAfter), "expected Retry-After header on 429");

  console.log(JSON.stringify({ ok: true, accepted: ok, limited }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

