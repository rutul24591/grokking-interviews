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

async function fetchWithJar(
  baseUrl: string,
  jar: CookieJar,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
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

  return res;
}

async function json<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");
  const jar: CookieJar = new Map();

  const home = await fetchWithJar(baseUrl, jar, "/");
  assert(home.ok, `GET / failed: ${home.status}`);
  const csp = home.headers.get("content-security-policy") || "";
  assert(csp.includes("frame-ancestors 'none'"), "missing or weak CSP frame-ancestors");
  assert(home.headers.get("x-frame-options") === "DENY", "missing X-Frame-Options: DENY");
  assert(home.headers.get("x-content-type-options") === "nosniff", "missing X-Content-Type-Options");

  const notesUnauthed = await fetchWithJar(baseUrl, jar, "/api/notes");
  assert(notesUnauthed.status === 401, "expected 401 for /api/notes without session");

  const login = await fetchWithJar(baseUrl, jar, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "staff@example.com", password: "password12345" }),
  });
  assert(login.ok, `login failed: ${login.status}`);
  const loginBody = await json<{ csrfToken: string }>(login);
  assert(typeof loginBody.csrfToken === "string" && loginBody.csrfToken.length > 10, "missing csrfToken");
  assert(jar.has("session"), "expected session cookie to be set");

  const missingCsrf = await fetchWithJar(baseUrl, jar, "/api/notes", {
    method: "POST",
    body: JSON.stringify({ title: "hi", body: "no csrf" }),
  });
  assert(missingCsrf.status === 403, "expected 403 when CSRF header missing");

  const okCreate = await fetchWithJar(baseUrl, jar, "/api/notes", {
    method: "POST",
    headers: { "x-csrf-token": loginBody.csrfToken },
    body: JSON.stringify({ title: "ok", body: "with csrf" }),
  });
  assert(okCreate.ok, `expected note create ok, got ${okCreate.status}`);

  const logout = await fetchWithJar(baseUrl, jar, "/api/auth/logout", { method: "POST", body: "{}" });
  assert(logout.ok, `logout failed: ${logout.status}`);

  const after = await fetchWithJar(baseUrl, jar, "/api/notes");
  assert(after.status === 401, "expected 401 after logout");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

