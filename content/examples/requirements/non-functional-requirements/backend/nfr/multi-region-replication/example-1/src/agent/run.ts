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

  const put = await post(b + "/api/kv/put", { region: "us-east", key: "k", value: "v1", sessionId: "s1" });
  assert(put.status === 200 && put.body.ok === true, "expected put ok");

  const stale = await get(b + "/api/kv/get?region=eu-west&key=k&consistency=session&sessionId=s1");
  assert(stale.status === 409 && stale.body.error === "stale_read", "expected stale read");

  for (let i = 0; i < 5; i++) await post(b + "/api/replication/tick", {});

  const ok = await get(b + "/api/kv/get?region=eu-west&key=k&consistency=session&sessionId=s1");
  assert(ok.status === 200 && ok.body.value === "v1", "expected value after replication");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

