import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  maxNewViolations: z.coerce.number().int().min(0).default(0),
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

type Variant = { id: string; name: string };
type AuditPayload = {
  variant: Variant;
  summary: { totalViolations: number };
  baseline: { summary: { totalViolations: number } } | null;
  delta: { newViolations: number } | null;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  const variants: Variant[] = [
    { id: "good-form", name: "Good: labeled form controls" },
    { id: "missing-label", name: "Bug: input missing label" },
    { id: "icon-button", name: "Bug: icon-only button without name" },
    { id: "color-contrast", name: "Bug: low contrast text" },
  ];

  // Capture baseline once (typical in repos: committed baseline JSON instead).
  for (const v of variants) {
    await postJson(`${baseUrl}/api/baseline`, { variantId: v.id });
  }

  let totalNew = 0;
  const reports: Array<{ id: string; total: number; baseline: number; new: number }> = [];

  for (const v of variants) {
    const payload = await getJson<AuditPayload>(`${baseUrl}/api/audit?variantId=${v.id}`);
    const total = payload.summary.totalViolations;
    const baseline = payload.baseline?.summary.totalViolations ?? total;
    const newly = payload.delta?.newViolations ?? 0;
    totalNew += newly;
    reports.push({ id: v.id, total, baseline, new: newly });
  }

  console.log(JSON.stringify({ baseUrl, totalNew, reports }, null, 2));

  if (totalNew > args.maxNewViolations) {
    console.error(
      `A11y budget exceeded: totalNew=${totalNew} > maxNewViolations=${args.maxNewViolations}`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

