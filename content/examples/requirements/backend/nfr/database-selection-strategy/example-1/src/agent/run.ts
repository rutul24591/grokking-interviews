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

  const search = await post(b + "/api/recommend", {
    readsPerSecond: 8000,
    writesPerSecond: 500,
    maxP95LatencyMs: 120,
    requiresStrongConsistency: false,
    needsFullTextSearch: true,
    needsGraphQueries: false,
    dataSizeGb: 200,
    multiRegion: false
  });
  assert(search.status === 200 && search.body.ok === true, "expected search workload ok");
  assert(search.body.recommendation.primary === "elasticsearch", "expected elasticsearch primary for search workload");

  const oltp = await post(b + "/api/recommend", {
    readsPerSecond: 2000,
    writesPerSecond: 600,
    maxP95LatencyMs: 50,
    requiresStrongConsistency: true,
    needsFullTextSearch: false,
    needsGraphQueries: false,
    dataSizeGb: 60,
    multiRegion: false
  });
  assert(oltp.status === 200 && oltp.body.ok === true, "expected oltp workload ok");
  assert(oltp.body.recommendation.primary === "postgres", "expected postgres primary for transactional workload");

  console.log(JSON.stringify({ ok: true }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

