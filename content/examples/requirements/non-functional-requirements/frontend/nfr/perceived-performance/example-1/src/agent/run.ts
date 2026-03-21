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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const res = await fetch(baseUrl + "/api/search?q=cache&delayMs=1");
  assert(res.status === 200, "expected search 200");
  const body = (await res.json()) as any;
  assert(body.ok === true && Array.isArray(body.results), "expected results array");

  const like = await fetch(baseUrl + "/api/like", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: "r1" })
  });
  assert([200, 503].includes(like.status), "expected 200 or simulated failure 503");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

