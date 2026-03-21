import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  runs: z.coerce.number().int().min(1).max(200).default(10),
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

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  for (let i = 0; i < args.runs; i++) {
    const r = await json<{ traceId: string }>(`${baseUrl}/api/request`, { method: "POST", body: "{}" });
    const s = await json<{ spans: Array<{ spanId: string; parentSpanId: string | null }> }>(
      `${baseUrl}/api/spans?traceId=${r.traceId}`,
    );

    assert(s.spans.length >= 3, `expected >=3 spans, got ${s.spans.length}`);
    const ids = new Set(s.spans.map((x) => x.spanId));
    for (const sp of s.spans) {
      if (sp.parentSpanId) assert(ids.has(sp.parentSpanId), "parent span missing from trace");
    }
  }

  console.log(JSON.stringify({ ok: true, runs: args.runs }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

