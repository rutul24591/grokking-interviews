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

async function req(url: string, init?: RequestInit): Promise<{ status: number; body: any }> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await req(baseUrl + "/api/reset", { method: "POST", body: "{}" });
  const d0 = await req(baseUrl + "/api/doc");
  assert(d0.status === 200, "get doc failed");
  const baseVersion = d0.body.doc.version;

  const ok1 = await req(baseUrl + "/api/doc", {
    method: "PATCH",
    body: JSON.stringify({ baseVersion, content: "v1" }),
  });
  assert(ok1.status === 200, "expected update ok");

  const conflict = await req(baseUrl + "/api/doc", {
    method: "PATCH",
    body: JSON.stringify({ baseVersion, content: "stale" }),
  });
  assert(conflict.status === 409, "expected conflict");
  assert(conflict.body.error === "conflict", "expected conflict code");

  const force = await req(baseUrl + "/api/doc", {
    method: "PATCH",
    body: JSON.stringify({ baseVersion, content: "force", force: true }),
  });
  assert(force.status === 200, "expected force ok");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

