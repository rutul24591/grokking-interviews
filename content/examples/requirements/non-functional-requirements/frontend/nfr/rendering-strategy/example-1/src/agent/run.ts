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

async function must200(url: string) {
  const res = await fetch(url);
  assert(res.status === 200, `expected 200 for ${url} got ${res.status}`);
  return await res.text();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const index = await must200(baseUrl + "/");
  assert(index.includes("Rendering strategy"), "expected index title");

  const ssr = await must200(baseUrl + "/ssr");
  assert(ssr.includes("Mode: ssr"), "expected ssr mode");

  const csr = await must200(baseUrl + "/csr");
  assert(csr.includes("Mode: csr"), "expected csr mode");

  const now = await fetch(baseUrl + "/api/now");
  assert(now.status === 200, "expected /api/now 200");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

