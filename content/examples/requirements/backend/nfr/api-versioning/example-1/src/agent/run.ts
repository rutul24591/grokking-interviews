import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url()
});

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

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function get(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { headers, cache: "no-store" });
  return { status: res.status, body: await res.json(), headers: res.headers };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const v1 = await get(baseUrl + "/api/users", { "x-api-version": "1" });
  assert(v1.status === 200, "expected v1 200");
  assert(v1.body.version === 1, "expected version=1");
  assert(v1.headers.get("deprecation") === "true", "expected deprecation header for v1");

  const v2 = await get(baseUrl + "/api/users", { "x-api-version": "2" });
  assert(v2.status === 200, "expected v2 200");
  assert(v2.body.version === 2, "expected version=2");

  const acceptV2 = await get(baseUrl + "/api/users", { accept: "application/vnd.sdp.users.v2+json" });
  assert(acceptV2.body.version === 2, "expected accept-based v2");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

