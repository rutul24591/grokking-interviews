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

async function json<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T; headers: Headers }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) }
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body, headers: res.headers };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

function cookieFromSetCookie(h: Headers) {
  const v = h.get("set-cookie");
  if (!v) return null;
  return v.split(";")[0] || null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const login = await json<any>(baseUrl + "/api/auth/login-cookie", { method: "POST", body: "{}" });
  assert(login.status === 200, "expected login-cookie 200");
  const cookie = cookieFromSetCookie(login.headers);
  assert(cookie && cookie.startsWith("sid="), "expected sid cookie");

  const secret1 = await json<any>(baseUrl + "/api/auth/secret", { headers: { cookie } });
  assert(secret1.status === 200 && secret1.body.ok === true, "expected secret via cookie");

  const token = await json<any>(baseUrl + "/api/auth/login-token", { method: "POST", body: "{}" });
  assert(token.status === 200 && token.body.token, "expected token");

  const secret2 = await json<any>(baseUrl + "/api/auth/secret", {
    headers: { authorization: `Bearer ${token.body.token}` }
  });
  assert(secret2.status === 200 && secret2.body.ok === true, "expected secret via bearer");

  const ex = await json<any>(baseUrl + "/api/exfiltrate", {
    method: "POST",
    body: JSON.stringify({ token: token.body.token })
  });
  assert(ex.status === 200 && Array.isArray(ex.body.stolen), "expected exfiltrate log");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

