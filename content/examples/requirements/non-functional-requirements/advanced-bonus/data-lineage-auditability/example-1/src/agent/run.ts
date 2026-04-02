import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  job: z.string().min(1).default("daily-aggregate"),
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

  const run = await json(`${baseUrl}/api/job/run`, {
    method: "POST",
    body: JSON.stringify({ jobName: args.job }),
  });

  const verify = await json(`${baseUrl}/api/audit/verify`);
  const bundle = await json(`${baseUrl}/api/export`);

  console.log(JSON.stringify({ run, verify, bundle }, null, 2));

  if (!verify?.verification?.ok) {
    console.error("Ledger verification failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

