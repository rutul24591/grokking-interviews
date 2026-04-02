import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  alerts: z.coerce.number().int().min(10).max(500).default(60),
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

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const fingerprints = ["api-500", "api-500", "api-500", "db-latency", "cache-miss"];
  for (let i = 0; i < args.alerts; i++) {
    const fp = fingerprints[i % fingerprints.length];
    await json(`${baseUrl}/api/alerts`, {
      method: "POST",
      body: JSON.stringify({
        fingerprint: fp,
        severity: fp === "api-500" && i % 10 === 0 ? "critical" : "high",
        summary: `agent alert ${i}`,
        source: "agent",
      }),
    });
  }

  const r = await json<{ incidents: Array<{ id: string }> }>(`${baseUrl}/api/incidents`);
  console.log(JSON.stringify({ alerts: args.alerts, incidents: r.incidents.length }, null, 2));

  if (r.incidents.length >= args.alerts) {
    throw new Error("dedup ineffective: incidents >= alerts");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

