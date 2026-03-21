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

  await json(`${baseUrl}/api/reset`, { method: "POST", body: "{}" });
  await json(`${baseUrl}/api/freeze`, {
    method: "POST",
    body: JSON.stringify({ enabled: true, reason: "release freeze", until: null, actor: "agent" }),
  });

  // Non-emergency change should be blocked during freeze.
  const c1 = await json<any>(`${baseUrl}/api/changes`, {
    method: "POST",
    body: JSON.stringify({ title: "normal change", risk: "low", emergency: false, actor: "agent" }),
  });
  const id1 = c1.change.id;
  await json(`${baseUrl}/api/changes/${id1}/submit`, { method: "POST", body: "{}" });
  await json(`${baseUrl}/api/changes/${id1}/approve`, { method: "POST", body: JSON.stringify({ actor: "r1", role: "eng" }) });
  const blocked = await fetch(`${baseUrl}/api/changes/${id1}/execute`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert(blocked.status === 409, "expected freeze block");

  // Emergency high-risk needs 2 approvals but can execute during freeze.
  const c2 = await json<any>(`${baseUrl}/api/changes`, {
    method: "POST",
    body: JSON.stringify({ title: "emergency fix", risk: "high", emergency: true, actor: "agent" }),
  });
  const id2 = c2.change.id;
  await json(`${baseUrl}/api/changes/${id2}/submit`, { method: "POST", body: "{}" });
  await json(`${baseUrl}/api/changes/${id2}/approve`, { method: "POST", body: JSON.stringify({ actor: "r1", role: "eng" }) });
  const blocked2 = await fetch(`${baseUrl}/api/changes/${id2}/execute`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert(blocked2.status === 409, "expected insufficient approvals");
  await json(`${baseUrl}/api/changes/${id2}/approve`, { method: "POST", body: JSON.stringify({ actor: "r2", role: "eng" }) });
  const ok = await json<any>(`${baseUrl}/api/changes/${id2}/execute`, { method: "POST", body: "{}" });
  assert(ok.change.status === "executed", "expected executed");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

