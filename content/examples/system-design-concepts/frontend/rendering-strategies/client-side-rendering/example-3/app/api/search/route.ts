import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildResults(q: string) {
  const corpus = [
    "react rendering",
    "react reconciliation",
    "request deduplication",
    "retry with exponential backoff",
    "abortcontroller",
    "etag caching",
    "stale while revalidate",
    "virtualization windowing",
    "web vitals lcp inp cls",
    "client side routing",
  ];

  const needle = q.toLowerCase();
  return corpus
    .filter((s) => s.includes(needle))
    .slice(0, 6)
    .map((s) => ({ label: s, score: 0.5 + Math.random() * 0.5 }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const jitter = 60 + Math.floor(Math.random() * 700);

  // Simulate an occasionally flaky backend.
  const shouldFail = Math.random() < 0.12;

  await sleep(jitter);

  if (!q) {
    return NextResponse.json({ q, items: [], jitterMs: jitter });
  }

  if (shouldFail) {
    return NextResponse.json(
      { error: "Injected transient failure", jitterMs: jitter },
      { status: 503 },
    );
  }

  return NextResponse.json({ q, items: buildResults(q), jitterMs: jitter });
}

