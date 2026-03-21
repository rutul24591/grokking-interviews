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

  const bad = [
    { id: "bad-form", html: "<form><input id=\"email\" /><button>Continue</button></form>" },
    { id: "bad-dialog", html: "<div role=\"dialog\"><h2>Title</h2><p>Body</p></div>" },
  ];
  const good = [
    {
      id: "good-form",
      html: "<form><label for=\"email\">Email</label><input id=\"email\" /><button type=\"submit\">Continue</button></form>",
    },
    {
      id: "good-dialog",
      html: "<div role=\"dialog\" aria-labelledby=\"t\" aria-describedby=\"d\"><h2 id=\"t\">Title</h2><p id=\"d\">Body</p></div>",
    },
  ];

  const r1 = await json<{ report: unknown[] }>(baseUrl + "/api/audit", {
    method: "POST",
    body: JSON.stringify({ patterns: bad }),
  });
  assert(r1.status === 200, "expected 200 for bad audit");
  assert(r1.body.report.length >= 2, "expected findings for bad patterns");

  const r2 = await json<{ report: unknown[] }>(baseUrl + "/api/audit", {
    method: "POST",
    body: JSON.stringify({ patterns: good }),
  });
  assert(r2.status === 200, "expected 200 for good audit");
  assert(r2.body.report.length === 0, "expected no findings for good patterns");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

