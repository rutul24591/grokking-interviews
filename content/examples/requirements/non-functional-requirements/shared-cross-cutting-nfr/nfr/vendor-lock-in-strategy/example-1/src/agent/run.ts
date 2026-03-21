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

async function runSuite(baseUrl: string, provider: "local" | "s3mock") {
  const h = { "x-object-store": provider };
  await json(`${baseUrl}/api/reset`, { method: "POST", headers: h, body: "{}" });

  const key = "suite/alpha.txt";
  const value = `hello-${provider}-${Date.now()}`;

  const put = await json<{ ok: true }>(`${baseUrl}/api/objects`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ key, value }),
  });
  assert(put.status === 200, `put failed for ${provider}: ${put.status}`);

  const list = await json<{ objects: Array<{ key: string }> }>(`${baseUrl}/api/objects`, {
    method: "GET",
    headers: h,
  });
  assert(list.status === 200, `list failed for ${provider}: ${list.status}`);
  assert(list.body.objects.some((o) => o.key === key), `list missing key for ${provider}`);

  const get = await json<{ value: string }>(`${baseUrl}/api/objects/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: h,
  });
  assert(get.status === 200, `get failed for ${provider}: ${get.status}`);
  assert(get.body.value === value, `get mismatch for ${provider}`);

  const del = await json(`${baseUrl}/api/objects/${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: h,
  });
  assert(del.status === 200, `delete failed for ${provider}: ${del.status}`);

  const missing = await json(`${baseUrl}/api/objects/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: h,
  });
  assert(missing.status === 404, `expected 404 after delete for ${provider}, got ${missing.status}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await runSuite(baseUrl, "local");
  await runSuite(baseUrl, "s3mock");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

