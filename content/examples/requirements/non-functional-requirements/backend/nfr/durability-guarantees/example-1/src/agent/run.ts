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

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
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

  await post(b + "/api/log/append", { payload: "m1", mode: "memory" });
  await post(b + "/api/log/append", { payload: "m2", mode: "durable" });

  await post(b + "/api/log/crash", {});
  const afterCrash = await get(b + "/api/log/state");
  assert(afterCrash.status === 200, "expected state 200");
  assert(afterCrash.body.state.inMemory.length === 0, "expected memory cleared");

  await post(b + "/api/log/replay", {});
  const afterReplay = await get(b + "/api/log/state");
  const entries = afterReplay.body.state.inMemory as Array<{ payload: string }>;
  assert(entries.length >= 1, "expected entries after replay");
  const payloads = entries.map((e) => e.payload);
  assert(payloads.includes("m2"), "expected durable entry to survive");
  assert(!payloads.includes("m1"), "expected memory-only entry to be lost");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

