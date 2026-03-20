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

  const a = await fetch(baseUrl + "/api/articles");
  assert(a.status === 200, "expected articles 200");
  const body = (await a.json()) as any;
  assert(body.ok === true && Array.isArray(body.items), "expected items array");

  const b = await fetch(baseUrl + "/api/articles?tag=frontend");
  assert(b.status === 200, "expected filtered 200");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

