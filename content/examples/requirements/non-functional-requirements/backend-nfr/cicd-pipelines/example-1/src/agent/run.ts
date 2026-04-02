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

  const health = await get(b + "/api/health");
  assert(health.status === 200 && health.body.ok === true, "expected health ok");

  const build = await get(b + "/api/build");
  assert(build.status === 200, "expected build 200");
  assert(typeof build.body.gitSha === "string" && build.body.gitSha.length > 0, "expected gitSha");
  assert(typeof build.body.buildId === "string" && build.body.buildId.length > 0, "expected buildId");

  const smoke = await post(b + "/api/smoke", { mustHaveEnv: "NEXT_PUBLIC_BUILD_ID" });
  assert(smoke.status === 200 && smoke.body.ok === true, "expected smoke ok");

  console.log(JSON.stringify({ ok: true, build: build.body }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

