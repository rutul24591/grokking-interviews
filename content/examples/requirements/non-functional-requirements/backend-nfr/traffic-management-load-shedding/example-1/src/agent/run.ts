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
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  // Occupy 3 slots with low priority long work.
  const long = Array.from({ length: 3 }, () => get(b + "/api/work?priority=low&durationMs=600"));
  // Give the above a moment to start occupying concurrency; best-effort without sleeps.
  const shed = await get(b + "/api/work?priority=low&durationMs=50");
  assert(shed.status === 503 && shed.body.error === "load_shed", "expected low priority shed when saturated");

  const high = await get(b + "/api/work?priority=high&durationMs=50");
  assert(high.status === 200 && high.body.priority === "high", "expected high priority eventually completes");

  await Promise.all(long);

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

