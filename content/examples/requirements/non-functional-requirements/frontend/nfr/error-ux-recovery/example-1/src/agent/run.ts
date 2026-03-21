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

async function fetchOnce(url: string) {
  const res = await fetch(url);
  return { ok: res.ok, status: res.status };
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await fetch(baseUrl + "/api/reset", { method: "POST", body: "{}" });

  let ok = false;
  for (let i = 0; i < 5; i++) {
    const r = await fetchOnce(baseUrl + "/api/flaky?key=agent");
    if (r.ok) {
      ok = true;
      break;
    }
    await sleep(10);
  }
  if (!ok) throw new Error("expected flaky to succeed within retries");

  const r2 = await fetchOnce(baseUrl + "/api/flaky?key=agent");
  if (!r2.ok) throw new Error("expected subsequent call ok after success");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

