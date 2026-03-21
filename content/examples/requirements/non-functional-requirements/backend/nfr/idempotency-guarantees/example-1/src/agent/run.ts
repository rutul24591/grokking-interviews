import { z } from "zod";

const ArgsSchema = z.object({ baseUrl: z.string().url() });

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

async function charge(baseUrl: string, key: string) {
  const res = await fetch(baseUrl + "/api/payments/charge", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify({ customerId: "c1", amountUsd: 12.5, currency: "USD" })
  });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const a = await charge(b, "idem-1");
  assert(a.status === 200 && a.body.ok === true && a.body.replayed === false, "expected first charge ok (not replay)");
  const chargeId1 = a.body.charge.chargeId as string;

  const b2 = await charge(b, "idem-1");
  assert(b2.status === 200 && b2.body.ok === true && b2.body.replayed === true, "expected replayed charge");
  assert(b2.body.charge.chargeId === chargeId1, "expected same chargeId on retry");

  const c = await charge(b, "idem-2");
  assert(c.status === 200 && c.body.charge.chargeId !== chargeId1, "expected different chargeId for different key");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

