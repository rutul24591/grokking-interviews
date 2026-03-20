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

  await json(baseUrl + "/api/comments", { method: "DELETE", body: "{}" });
  const post = await json<any>(baseUrl + "/api/comments", {
    method: "POST",
    body: JSON.stringify({ author: "agent", text: "<img src=x onerror=alert(1)> **bold** `code`" })
  });
  assert(post.status === 200 && post.body.ok === true, "expected post ok");

  const list = await json<any>(baseUrl + "/api/comments");
  assert(list.status === 200 && Array.isArray(list.body.comments), "expected comments array");
  assert(String(list.body.comments[0].text).includes("onerror"), "expected payload stored as text");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

