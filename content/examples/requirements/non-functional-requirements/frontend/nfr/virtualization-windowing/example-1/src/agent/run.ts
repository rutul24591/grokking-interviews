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

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");
  const res = await fetch(baseUrl + "/");
  assert(res.status === 200, "expected page 200");
  const html = await res.text();
  assert(html.includes("Virtualization"), "expected title");

  const rows = await getJson(baseUrl + "/api/rows?offset=0&limit=3");
  assert(rows.status === 200, "expected rows 200");
  assert(rows.json && rows.json.ok === true, "expected ok");
  assert(rows.json.total === 10000, "expected total 10000");
  assert(Array.isArray(rows.json.rows) && rows.json.rows.length === 3, "expected 3 rows");
  assert(rows.json.rows[0].index === 0, "expected first index 0");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
