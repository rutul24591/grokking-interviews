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
  const r = await json<any>(`${baseUrl}/api/calc`, {
    method: "POST",
    body: JSON.stringify({
      composition: "serial",
      components: [
        { name: "api", availability: 0.999 },
        { name: "db", availability: 0.999 },
      ],
      slaTarget: 0.998,
    }),
  });
  console.log(JSON.stringify(r, null, 2));
  if (typeof r.effectiveAvailability !== "number") throw new Error("bad response");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

