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

function pickSetCookie(h: Headers) {
  const v = h.get("set-cookie");
  if (!v) return null;
  // single-cookie response in this example
  return v.split(";")[0] || null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const blocked = await json<any>(baseUrl + "/api/analytics", {
    method: "POST",
    body: JSON.stringify({ name: "agent_event" })
  });
  assert(blocked.status === 403, "expected analytics blocked without consent");

  const set = await json<any>(baseUrl + "/api/consent", {
    method: "POST",
    body: JSON.stringify({ analytics: true, marketing: false })
  });
  assert(set.status === 200, "expected consent set 200");
  const cookie = pickSetCookie(set.headers);
  assert(cookie && cookie.startsWith("consent="), "expected Set-Cookie consent");

  const ok = await json<any>(baseUrl + "/api/analytics", {
    method: "POST",
    headers: { cookie },
    body: JSON.stringify({ name: "agent_event", props: { ok: true } })
  });
  assert(ok.status === 200 && ok.body.ok === true, "expected analytics accepted with consent");

  const summary = await json<any>(baseUrl + "/api/analytics", { headers: { cookie } });
  assert(summary.status === 200 && typeof summary.body.count === "number", "expected summary");
  assert(summary.body.count >= 1, "expected count >= 1");

  console.log(JSON.stringify({ ok: true, count: summary.body.count }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

