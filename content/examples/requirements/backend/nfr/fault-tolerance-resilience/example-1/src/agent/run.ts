import { setTimeout as delay } from "node:timers/promises";
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

  await post(b + "/api/dependency/config", { mode: "fail_first_n", remaining: 10 });

  let sawOpen = false;
  for (let i = 0; i < 10; i++) {
    const r = await get(b + "/api/service");
    assert(r.status === 200 && r.body.ok === true, "expected service response");
    if (r.body.reason === "breaker_open") {
      sawOpen = true;
      break;
    }
  }
  assert(sawOpen, "expected breaker to open under repeated failures");

  // Recover: make dependency healthy and wait for cooldown.
  await post(b + "/api/dependency/config", { mode: "healthy" });
  await delay(2200);
  const recovered = await get(b + "/api/service");
  assert(recovered.status === 200 && recovered.body.degraded !== true, "expected recovered non-degraded response");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

