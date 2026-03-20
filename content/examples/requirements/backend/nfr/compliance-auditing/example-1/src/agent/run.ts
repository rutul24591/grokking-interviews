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

async function post(url: string, body: unknown, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(headers || {}) },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
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

  const created = await post(
    b + "/api/admin/users",
    { email: "alice@example.com", role: "viewer" },
    { "x-actor-id": "admin-1" }
  );
  assert(created.status === 200 && created.body.ok === true, "expected create ok");
  const userId = created.body.user?.id as string;
  assert(typeof userId === "string" && userId.length > 0, "expected userId");

  const changed = await post(
    b + "/api/admin/roles",
    { userId, email: "alice@example.com", role: "admin" },
    { "x-actor-id": "admin-1" }
  );
  assert(changed.status === 200 && changed.body.ok === true, "expected role change ok");

  const logs = await get(b + "/api/audit?limit=50");
  assert(logs.status === 200 && Array.isArray(logs.body.logs), "expected logs array");
  const text = JSON.stringify(logs.body.logs);
  assert(!text.includes("alice@example.com"), "expected raw email not stored");

  const verify = await get(b + "/api/audit/verify");
  assert(verify.status === 200 && verify.body.ok === true, "expected verify ok");

  console.log(JSON.stringify({ ok: true, auditCount: logs.body.logs.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

