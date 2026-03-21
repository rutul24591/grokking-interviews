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

  const critical = await fetch(baseUrl + "/api/critical");
  assert(critical.status === 200, "expected critical 200");

  const deferred = await fetch(baseUrl + "/api/deferred?delayMs=10");
  assert(deferred.status === 200, "expected deferred 200");

  const page = await fetch(baseUrl + "/");
  assert(page.status === 200, "expected page 200");
  const html = await page.text();
  assert(html.includes("Page-load performance"), "expected title present");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

