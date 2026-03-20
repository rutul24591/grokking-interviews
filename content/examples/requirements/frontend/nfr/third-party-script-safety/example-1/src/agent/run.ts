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

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const page = await fetch(baseUrl + "/");
  assert(page.status === 200, "expected main page 200");

  const widget = await fetch(baseUrl + "/tp/widget");
  assert(widget.status === 200, "expected widget 200");
  const html = await widget.text();
  assert(html.includes("Third-party widget"), "expected widget title");

  const ingest = await getJson(baseUrl + "/api/metrics/ingest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "metric", name: "agent_metric", value: 1 }),
  });
  assert(ingest.status === 200, "expected ingest 200");
  assert(ingest.json && ingest.json.ok === true, "expected ingest ok");

  const recent = await getJson(baseUrl + "/api/metrics/recent?limit=10");
  assert(recent.status === 200, "expected recent 200");
  assert(recent.json && Array.isArray(recent.json.items), "expected items array");
  assert(
    recent.json.items.some((m: any) => m && m.type === "metric" && m.name === "agent_metric"),
    "expected ingested metric present"
  );

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
