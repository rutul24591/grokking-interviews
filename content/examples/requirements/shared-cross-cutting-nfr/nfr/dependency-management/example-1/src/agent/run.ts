import { z } from "zod";

const ArgsSchema = z.object({ baseUrl: z.string().url() });

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
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = args.baseUrl.replace(/\/$/, "");
  await json(`${base}/api/reset`, { method: "POST", body: "{}" });

  // Unsafe: crypto-lib has critical advisory; should reject.
  const bad = await json<any>(`${base}/api/proposals`, {
    method: "POST",
    body: JSON.stringify({ upgrades: [{ name: "crypto-lib", from: "2.0.0", to: "2.0.1" }] }),
  });
  assert(bad.proposal.status === "rejected", "expected rejected proposal");

  // Major upgrade requires approval (next 16->17) - created then needs approval to apply.
  const major = await json<any>(`${base}/api/proposals`, {
    method: "POST",
    body: JSON.stringify({ upgrades: [{ name: "next", from: "16.1.6", to: "17.0.0" }] }),
  });
  const id = major.proposal.id;
  const applied1 = await json<any>(`${base}/api/proposals/${id}/apply`, { method: "POST", body: "{}" });
  assert(applied1.proposal.status !== "applied", "should not apply without approval");
  const approved = await json<any>(`${base}/api/proposals/${id}/approve`, { method: "POST", body: "{}" });
  const applied2 = await json<any>(`${base}/api/proposals/${id}/apply`, { method: "POST", body: "{}" });
  assert(applied2.proposal.status === "applied", "expected applied after approval");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

