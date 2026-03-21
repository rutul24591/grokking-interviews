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

async function json<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) }
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const login = await json<any>(b + "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: "demo", password: "pw" })
  });
  assert(login.status === 200 && login.body.accessToken, "expected access token");
  const token = login.body.accessToken as string;

  const r1 = await json<any>(b + "/api/resource", { headers: { authorization: `Bearer ${token}` } });
  assert(r1.status === 200 && r1.body.ok === true, "expected resource ok");

  const stats1 = await json<any>(b + "/api/auth/stats");
  assert(stats1.status === 200, "expected stats");

  const revoke = await json<any>(b + "/api/auth/revoke", { method: "POST", body: JSON.stringify({ token }) });
  assert(revoke.status === 200 && revoke.body.ok === true, "expected revoke ok");

  const r2 = await json<any>(b + "/api/resource", { headers: { authorization: `Bearer ${token}` } });
  assert(r2.status === 401, "expected unauthorized after revoke");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

