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

  await json(baseUrl + "/api/reset", { method: "POST", body: "{}" });

  const clientId = "agent";
  const opId = "op-1";
  const msg = "hello";

  const r1 = await json<{ duplicate: boolean }>(baseUrl + "/api/send", {
    method: "POST",
    body: JSON.stringify({ clientId, opId, message: msg }),
  });
  assert(r1.status === 200 && r1.body.duplicate === false, "first send should be accepted");

  const r2 = await json<{ duplicate: boolean }>(baseUrl + "/api/send", {
    method: "POST",
    body: JSON.stringify({ clientId, opId, message: msg }),
  });
  assert(r2.status === 200 && r2.body.duplicate === true, "second send should be duplicate");

  const list = await json<{ messages: unknown[] }>(baseUrl + "/api/messages");
  assert(list.status === 200, "list failed");
  assert(list.body.messages.length === 1, "expected exactly one stored message");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

