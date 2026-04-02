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

async function json<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) }
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");
  const r = await json<any>(b + "/api/capacity", {
    method: "POST",
    body: JSON.stringify({
      rps: 1000,
      p95LatencyMs: 200,
      cpuMsPerReq: 10,
      coresPerInstance: 2,
      targetUtilization: 0.6,
      headroomPct: 25
    })
  });
  assert(r.status === 200 && r.body.ok === true, "expected ok");
  assert(typeof r.body.plan.instances === "number" && r.body.plan.instances > 0, "expected instances > 0");
  console.log(JSON.stringify({ ok: true, instances: r.body.plan.instances }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

