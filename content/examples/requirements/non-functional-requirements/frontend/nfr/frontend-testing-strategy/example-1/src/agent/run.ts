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

async function json<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
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

  const res = await json<any>(baseUrl + "/api/quote", {
    method: "POST",
    body: JSON.stringify({ quantity: 2, region: "us", promoCode: "SAVE10", requestId: "req_agent_12345678" }),
  });

  assert(res.status === 200, "expected 200");
  assert(res.body.ok === true, "expected ok=true");
  assert(typeof res.body.quote?.totalCents === "number", "expected quote.totalCents number");

  console.log(JSON.stringify({ ok: true, totalCents: res.body.quote.totalCents }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

