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

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json(), serverTiming: res.headers.get("server-timing") };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const fast = await get(b + "/api/feed?mode=fast&slaMs=250");
  assert(fast.status === 200 && fast.body.ok === true, "expected fast ok");
  assert(fast.body.report.withinSla === true, "expected fast within SLA");

  const slow = await get(b + "/api/feed?mode=slow&slaMs=250");
  assert(slow.status === 200 && slow.body.ok === true, "expected slow ok");
  assert(slow.body.degraded === true, "expected degraded path for slow");
  assert(slow.body.report.withinSla === true, "expected degraded path stays within SLA");
  assert(typeof slow.serverTiming === "string" && slow.serverTiming.includes("db"), "expected server-timing header");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

