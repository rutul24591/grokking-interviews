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

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store", headers: { "x-api-key": "demo" } });
  return { status: res.status, body: await res.json(), retryAfter: res.headers.get("retry-after") };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  let saw429 = false;
  let sawRetryAfter = false;
  for (let i = 0; i < 30; i++) {
    const r = await get(b + "/api/protected");
    if (r.status === 429) {
      saw429 = true;
      if (r.retryAfter) sawRetryAfter = true;
    }
  }

  assert(saw429, "expected at least one 429");
  assert(sawRetryAfter, "expected Retry-After header on 429");

  await delay(2200);
  const recovered = await get(b + "/api/protected");
  assert(recovered.status === 200 && recovered.body.ok === true, "expected recovery after penalty window");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

