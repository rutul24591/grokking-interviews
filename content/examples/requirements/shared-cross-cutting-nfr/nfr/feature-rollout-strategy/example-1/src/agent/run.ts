import { z } from "zod";

const ArgsSchema = z.object({
  baseUrl: z.string().url(),
  steps: z.coerce.number().int().min(1).max(20).default(5),
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
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = args.baseUrl.replace(/\/$/, "");
  await json(`${base}/api/reset`, { method: "POST", body: "{}" });

  for (let step = 1; step <= args.steps; step++) {
    const rolloutPct = Math.floor((step / args.steps) * 50);
    await json(`${base}/api/flags`, {
      method: "POST",
      body: JSON.stringify({ enabled: true, rolloutPct, killSwitch: false, salt: "v1" }),
    });

    // simulate 200 users
    for (let i = 0; i < 200; i++) {
      const userId = `user-${i}`;
      const evalRes = await json<any>(`${base}/api/eval?userId=${userId}`);
      if (evalRes.eligible) {
        await json(`${base}/api/event`, { method: "POST", body: JSON.stringify({ type: "exposure" }) });
        // error rate increases with rollout to simulate rollout guardrails
        const errProb = rolloutPct >= 30 ? 0.08 : 0.02;
        if (Math.random() < errProb) await json(`${base}/api/event`, { method: "POST", body: JSON.stringify({ type: "error" }) });
      }
    }

    const metrics = await json<any>(`${base}/api/metrics`);
    if (metrics.errorRate > 0.05) {
      await json(`${base}/api/flags`, {
        method: "POST",
        body: JSON.stringify({ enabled: true, rolloutPct, killSwitch: true, salt: "v1" }),
      });
      const check = await json<any>(`${base}/api/eval?userId=user-1`);
      if (check.eligible) throw new Error("kill switch did not disable eligibility");
      console.log(JSON.stringify({ step, rolloutPct, guardrail: "tripped", errorRate: metrics.errorRate }, null, 2));
      return;
    }

    console.log(JSON.stringify({ step, rolloutPct, errorRate: metrics.errorRate }, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

