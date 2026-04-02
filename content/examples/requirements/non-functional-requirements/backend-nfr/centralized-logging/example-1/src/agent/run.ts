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

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const requestId = res.headers.get("x-request-id");
  const json = await res.json();
  return { status: res.status, body: json, requestId };
}

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const order = await post(b + "/api/order", {
    email: "alice@example.com",
    sku: "SKU-123",
    quantity: 1,
    token: "Bearer secret_token"
  });
  assert(order.status === 200 && order.requestId, "expected order 200 + request id");

  const logs = await get(b + `/api/logs?requestId=${encodeURIComponent(order.requestId)}`);
  assert(logs.status === 200 && Array.isArray(logs.body.logs), "expected logs array");
  const text = JSON.stringify(logs.body.logs);
  assert(!text.includes("alice@example.com"), "expected email redacted");
  assert(!text.includes("secret_token"), "expected token redacted");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

