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
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}

async function postNoBody(url: string) {
  const res = await fetch(url, { method: "POST" });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const t1 = await post(b + "/api/tokens/issue", { sub: "user-1" });
  assert(t1.status === 200 && t1.body.ok === true, "expected token issued");
  const token1 = t1.body.token as string;

  const v1 = await post(b + "/api/tokens/verify", { token: token1 });
  assert(v1.status === 200 && v1.body.sub === "user-1", "expected token1 verified");

  const rot = await postNoBody(b + "/api/secrets/rotate");
  assert(rot.status === 200 && rot.body.ok === true, "expected rotated");

  const t2 = await post(b + "/api/tokens/issue", { sub: "user-2" });
  const token2 = t2.body.token as string;
  const v2 = await post(b + "/api/tokens/verify", { token: token2 });
  assert(v2.status === 200 && v2.body.sub === "user-2", "expected token2 verified");

  // Old token still verifies during grace window.
  const v1b = await post(b + "/api/tokens/verify", { token: token1 });
  assert(v1b.status === 200, "expected old token still verifies after rotation");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

