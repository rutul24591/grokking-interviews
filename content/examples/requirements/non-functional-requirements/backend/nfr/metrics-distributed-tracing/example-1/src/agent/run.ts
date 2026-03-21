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

async function get(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { cache: "no-store", headers: headers || {} });
  return { status: res.status, body: await res.json(), headers: res.headers };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const demo = await get(b + "/api/demo", { traceparent: "00-11111111111111111111111111111111-2222222222222222-01" });
  assert(demo.status === 200 && demo.body.ok === true, "expected demo ok");
  assert(typeof demo.body.traceId === "string" && demo.body.traceId.length === 32, "expected traceId");

  const traces = await get(b + `/api/traces?traceId=${encodeURIComponent(demo.body.traceId)}`);
  assert(traces.status === 200 && traces.body.ok === true, "expected traces ok");
  assert(Array.isArray(traces.body.spans) && traces.body.spans.length >= 3, "expected spans recorded");

  const names = new Set((traces.body.spans as any[]).map((s) => s.name));
  assert(names.has("GET /api/demo") && names.has("cache.get") && names.has("db.query"), "expected expected span names");

  console.log(JSON.stringify({ ok: true, spanCount: traces.body.spans.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

