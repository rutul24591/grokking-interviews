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

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  const b = baseUrl.replace(/\/$/, "");

  const baseline = await post(b + "/api/cost/estimate", {
    monthlyRequests: 30_000_000,
    avgResponseKb: 40,
    cacheHitRate: 0.1,
    originComputeUsdPerMillion: 0.5,
    reservedDiscount: 0,
    cdnEgressUsdPerGb: 0.08,
    storageGb: 800,
    storageUsdPerGbMonth: 0.023,
    budgetUsd: 10_000
  });
  assert(baseline.status === 200 && baseline.body.ok === true, "expected baseline ok");

  const optimized = await post(b + "/api/cost/estimate", {
    monthlyRequests: 30_000_000,
    avgResponseKb: 18,
    cacheHitRate: 0.75,
    originComputeUsdPerMillion: 0.5,
    reservedDiscount: 0.25,
    cdnEgressUsdPerGb: 0.08,
    storageGb: 800,
    storageUsdPerGbMonth: 0.023,
    budgetUsd: 10_000
  });
  assert(optimized.status === 200 && optimized.body.ok === true, "expected optimized ok");

  const bTotal = baseline.body.breakdown.costs.totalUsd as number;
  const oTotal = optimized.body.breakdown.costs.totalUsd as number;
  assert(typeof bTotal === "number" && typeof oTotal === "number", "expected totals");
  assert(oTotal < bTotal, `expected optimized total < baseline (got ${oTotal} vs ${bTotal})`);

  console.log(JSON.stringify({ ok: true, baseline: bTotal, optimized: oTotal }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

