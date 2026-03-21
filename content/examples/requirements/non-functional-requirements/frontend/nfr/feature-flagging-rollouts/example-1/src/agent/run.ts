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

async function evalUser(baseUrl: string) {
  return await json<any>(baseUrl + "/api/eval?userId=user_123");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await json(baseUrl + "/api/reset", { method: "POST", body: "{}" });

  await json(baseUrl + "/api/update", {
    method: "POST",
    body: JSON.stringify({ rolloutPct: 0, killSwitch: false }),
  });
  const a = await evalUser(baseUrl);
  assert(a.status === 200 && a.body.variant === "control", "expected control at 0%");

  await json(baseUrl + "/api/update", {
    method: "POST",
    body: JSON.stringify({ rolloutPct: 100 }),
  });
  const b = await evalUser(baseUrl);
  assert(b.body.variant === "treatment", "expected treatment at 100%");

  await json(baseUrl + "/api/update", { method: "POST", body: JSON.stringify({ killSwitch: true }) });
  const c = await evalUser(baseUrl);
  assert(c.body.variant === "control", "kill switch should force control");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

