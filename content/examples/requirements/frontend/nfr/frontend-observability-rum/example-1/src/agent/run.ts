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

  await json(baseUrl + "/api/rum/reset", { method: "POST", body: "{}" });

  const ingest = await json<any>(baseUrl + "/api/rum/ingest", {
    method: "POST",
    body: JSON.stringify({
      app: "rum-demo",
      version: "1.0.0",
      events: [
        {
          id: "e_agent_1",
          ts: Date.now(),
          sessionId: "s_agent_12345678",
          page: "/",
          type: "web_vital",
          name: "lcp",
          value: 1200,
          unit: "ms",
        },
        {
          id: "e_agent_2",
          ts: Date.now(),
          sessionId: "s_agent_12345678",
          page: "/",
          type: "error",
          name: "demo_frontend_error",
          value: 1,
          unit: "count",
          tags: { message: "synthetic" },
        },
      ],
    }),
  });
  assert(ingest.status === 200 && ingest.body.accepted === 2, "expected ingest accepted=2");

  const summary = await json<any>(baseUrl + "/api/rum/summary");
  assert(summary.status === 200, "expected summary 200");
  assert(summary.body.total >= 2, "expected >= 2 total events");
  assert(summary.body.byType.error >= 1, "expected error count");

  console.log(JSON.stringify({ ok: true, summary: summary.body }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

