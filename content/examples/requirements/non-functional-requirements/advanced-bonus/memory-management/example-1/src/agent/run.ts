import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  mode: z.enum(["none", "leaky", "lru"]).default("leaky"),
  requests: z.coerce.number().int().min(1).max(5000).default(200),
  kb: z.coerce.number().int().min(1).max(512).default(64),
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

function mb(n: number) {
  return Math.round((n / (1024 * 1024)) * 10) / 10;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");

  await json(`${baseUrl}/api/config`, {
    method: "POST",
    body: JSON.stringify({ mode: args.mode }),
  });

  let startHeap = 0;
  for (let i = 0; i < args.requests; i++) {
    await json(`${baseUrl}/api/work?key=hot-key&kb=${args.kb}`, { method: "POST" });
    if (i % 25 === 0 || i === args.requests - 1) {
      const mem = await json<any>(`${baseUrl}/api/memory`);
      if (i === 0) startHeap = mem.memory.heapUsed;
      console.log(
        JSON.stringify(
          {
            i,
            mode: mem.store.mode,
            rssMB: mb(mem.memory.rss),
            heapUsedMB: mb(mem.memory.heapUsed),
            externalMB: mb(mem.memory.external),
            leakEntries: mem.store.leakEntries,
            lruBytesMB: mb(mem.store.lruBytes),
          },
          null,
          2,
        ),
      );

      // Guardrail for the demo: if heap grows too much, stop.
      if (mem.memory.heapUsed - startHeap > 128 * 1024 * 1024) {
        console.error("Heap growth guardrail exceeded; stopping run.");
        process.exit(1);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

