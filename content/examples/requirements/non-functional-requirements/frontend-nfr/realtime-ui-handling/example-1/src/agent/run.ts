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
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await json(baseUrl + "/api/realtime/reset", { method: "POST", body: "{}" });
  const pub = await json<any>(baseUrl + "/api/realtime/publish", {
    method: "POST",
    body: JSON.stringify({ text: "agent_message" })
  });
  assert(pub.status === 200 && pub.body.ok === true, "expected publish ok");
  const cursor = pub.body.message?.cursor;
  assert(typeof cursor === "number", "expected cursor number");

  const snap = await json<any>(baseUrl + `/api/realtime/snapshot?cursor=${cursor - 1}`);
  assert(snap.status === 200 && Array.isArray(snap.body.messages), "expected snapshot messages");
  assert(snap.body.messages.length >= 1, "expected at least one message after cursor-1");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

