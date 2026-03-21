import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  samples: z.coerce.number().int().min(10).max(2000).default(200),
  mode: z.enum(["good", "bad"]).default("good"),
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

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await json(`${baseUrl}/api/reset`, { method: "POST", body: "{}" });

  for (let i = 0; i < args.samples; i++) {
    const ttfbMs = args.mode === "good" ? rnd(60, 220) : rnd(150, 700);
    const longTaskMs = args.mode === "good" ? rnd(0, 60) : rnd(40, 180);
    const bytes = args.mode === "good" ? Math.floor(rnd(12_000, 36_000)) : Math.floor(rnd(25_000, 120_000));
    await json(`${baseUrl}/api/sample`, {
      method: "POST",
      body: JSON.stringify({ route: "/", ttfbMs, longTaskMs, bytes }),
    });
  }

  const report = await json<any>(`${baseUrl}/api/report`);
  console.log(JSON.stringify({ samples: report.samples, p95: report.p95, budgets: report.budgets, gate: report.gate }, null, 2));

  if (!report.gate.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

