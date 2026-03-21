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

  const bad = await json<any>(baseUrl + "/api/validate", {
    method: "POST",
    body: JSON.stringify({ config: { env: "dev" } }),
  });
  assert(bad.status === 400, "expected 400 for invalid config");
  assert(bad.body.error === "config_invalid", "expected config_invalid");

  const good = await json<any>(baseUrl + "/api/validate", {
    method: "POST",
    body: JSON.stringify({
      config: { env: "dev", publicBaseUrl: "http://localhost:3000", apiKey: "super_secret_token_12345", rumSampleRate: 0.2 },
    }),
  });
  assert(good.status === 200, "expected 200 for valid config");
  assert(good.body.redacted.apiKey === "REDACTED", "expected apiKey redacted");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

