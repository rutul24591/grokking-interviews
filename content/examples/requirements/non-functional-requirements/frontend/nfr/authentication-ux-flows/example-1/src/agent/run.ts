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

type CookieJar = Map<string, string>;

function updateJarFromSetCookie(jar: CookieJar, setCookie: string) {
  const first = setCookie.split(";")[0] || "";
  const eq = first.indexOf("=");
  if (eq === -1) return;
  const name = first.slice(0, eq);
  const value = first.slice(eq + 1);
  if (!value) jar.delete(name);
  else jar.set(name, value);
}

function jarHeader(jar: CookieJar): string {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function fetchWithJar(baseUrl: string, jar: CookieJar, path: string, init?: RequestInit) {
  const res = await fetch(baseUrl + path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(jar.size ? { cookie: jarHeader(jar) } : {}),
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
  });

  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };
  const setCookies = typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : [];
  const legacy = res.headers.get("set-cookie");
  const combined = [...setCookies, ...(legacy ? [legacy] : [])];
  for (const sc of combined) updateJarFromSetCookie(jar, sc);

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  return { status: res.status, body };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");
  const jar: CookieJar = new Map();

  const login = await fetchWithJar(baseUrl, jar, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "staff@example.com", password: "password12345" }),
  });
  assert(login.status === 200, `login failed: ${login.status}`);
  assert(jar.has("session"), "expected session cookie");

  const secret1 = await fetchWithJar(baseUrl, jar, "/api/secret");
  assert(secret1.status === 403, `expected 403 step-up required, got ${secret1.status}`);

  const start = await fetchWithJar(baseUrl, jar, "/api/auth/stepup/start", { method: "POST", body: "{}" });
  assert(start.status === 200, `stepup start failed: ${start.status}`);
  const code = String(start.body?.code || "");
  const challengeId = String(start.body?.challengeId || "");
  assert(code.length === 6 && challengeId.length > 5, "missing challenge");

  const verify = await fetchWithJar(baseUrl, jar, "/api/auth/stepup/verify", {
    method: "POST",
    body: JSON.stringify({ challengeId, code }),
  });
  assert(verify.status === 200, `verify failed: ${verify.status}`);

  const secret2 = await fetchWithJar(baseUrl, jar, "/api/secret");
  assert(secret2.status === 200, `expected secret ok, got ${secret2.status}`);

  const logout = await fetchWithJar(baseUrl, jar, "/api/auth/logout", { method: "POST", body: "{}" });
  assert(logout.status === 200, `logout failed: ${logout.status}`);

  const secret3 = await fetchWithJar(baseUrl, jar, "/api/secret");
  assert(secret3.status === 401, `expected 401 after logout, got ${secret3.status}`);

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

