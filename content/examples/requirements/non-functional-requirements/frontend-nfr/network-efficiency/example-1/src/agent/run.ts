import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
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
  const url = baseUrl + "/api/feed";

  const first = await fetch(url);
  assert(first.status === 200, "expected 200");
  const etag = first.headers.get("etag");
  assert(etag, "expected etag");

  const second = await fetch(url, { headers: { "if-none-match": etag } });
  assert(second.status === 304, "expected 304");

  console.log(JSON.stringify({ ok: true, etag }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

