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

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const keys = Array.from({ length: 100 }, (_, i) => `user:${i + 1}`);

  await post(b + "/api/cluster/resize", { shards: 4 });
  const initial = await post(b + "/api/cluster/assign", { keys });
  assert(initial.status === 200 && initial.body.ok === true, "expected initial assign ok");

  await post(b + "/api/cluster/resize", { shards: 5 });
  const resized = await post(b + "/api/cluster/assign", { keys });
  assert(resized.status === 200, "expected resized assign ok");

  const moved = resized.body.result.moved as number;
  assert(typeof moved === "number" && moved < 60, `expected less than 60 keys moved when adding shard (got ${moved})`);

  console.log(JSON.stringify({ ok: true, moved }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

