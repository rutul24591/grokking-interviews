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

  await json(baseUrl + "/api/notifications/reset", { method: "POST", body: "{}" });
  const pub = await json<any>(baseUrl + "/api/notifications/publish", {
    method: "POST",
    body: JSON.stringify({ text: "agent_notification" }),
  });
  assert(pub.status === 200 && pub.body.ok === true, "expected publish ok");

  const snap = await json<any>(baseUrl + "/api/notifications");
  assert(snap.status === 200, "expected snapshot 200");
  assert(snap.body.notifications?.length === 1, "expected one notification");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

