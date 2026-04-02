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

async function json<T>(url: string): Promise<{ status: number; body: T }> {
  const res = await fetch(url, { headers: { "content-type": "application/json" } });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const m = await json<any>(baseUrl + "/api/policy?width=390&dpr=3&reducedMotion=false");
  assert(m.status === 200, "policy failed");
  assert(m.body.policy.variant === "mobile" && m.body.policy.columns === 1, "mobile policy");

  const d = await json<any>(baseUrl + "/api/policy?width=1440&dpr=1&reducedMotion=true");
  assert(d.body.policy.variant === "desktop" && d.body.policy.columns === 3, "desktop policy");
  assert(d.body.policy.reducedMotion === true, "reduced motion propagated");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

