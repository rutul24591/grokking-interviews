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

  const w1 = await post(b + "/api/write", { key: "k", value: "v1" });
  assert(w1.status === 200 && w1.body.ok === true, "expected write ok");

  // Fail current leader A.
  await post(b + "/api/cluster/fail", { node: "A" });
  const wFail = await post(b + "/api/write", { key: "k2", value: "v2" });
  assert(wFail.status === 503, "expected write blocked while leader down");

  const elect = await post(b + "/api/cluster/elect", {});
  assert(elect.status === 200 && elect.body.leader === "B", "expected leader B");

  const r = await get(b + "/api/read?key=k");
  assert(r.status === 200 && r.body.value === "v1", "expected replicated read after failover");

  const w2 = await post(b + "/api/write", { key: "k2", value: "v2" });
  assert(w2.status === 200 && w2.body.ok === true, "expected write ok after election");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

