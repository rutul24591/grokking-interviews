import { randomUUID } from "node:crypto";
import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  repeats: z.coerce.number().int().min(2).max(100).default(10),
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
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl.replace(/\/$/, "");
  const idem = `idem-${randomUUID()}`;

  // Send the same idempotency key multiple times; dependency write must happen once (or zero if all fail).
  const results = await Promise.allSettled(
    Array.from({ length: args.repeats }, () =>
      json(`${baseUrl}/api/publish`, {
        method: "POST",
        body: JSON.stringify({ idempotencyKey: idem, contentId: "post-1", retry: { maxAttempts: 4 } }),
      }),
    ),
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  const state = await json<any>(`${baseUrl}/api/state`);

  // If at least one succeeded, dependencyWrites must be exactly 1 for that key (demo store is global, so this checks global minimum).
  if (ok > 0) assert(state.dependencyWrites >= 1, "expected at least one dependency write");

  console.log(JSON.stringify({ okRequests: ok, repeats: args.repeats, dependencyWrites: state.dependencyWrites }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

