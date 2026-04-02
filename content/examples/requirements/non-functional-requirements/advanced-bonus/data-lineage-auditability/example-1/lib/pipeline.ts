import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Ledger } from "./ledger";
import type { LineageGraph } from "./lineage";

const RawPostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

type RawPost = z.infer<typeof RawPostSchema>;

type SanitizedPost = RawPost & {
  body: string;
  piiRedacted: boolean;
};

type Aggregated = {
  byAuthor: Array<{ authorId: string; posts: number }>;
  totalPosts: number;
};

function sampleRaw(): RawPost[] {
  return [
    {
      id: "p1",
      authorId: "u1",
      title: "Hello",
      body: "Contact me at alice@example.com",
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
    {
      id: "p2",
      authorId: "u2",
      title: "Design notes",
      body: "Call 555-0100 for follow-ups",
      createdAt: new Date(Date.now() - 30_000).toISOString(),
    },
    {
      id: "p3",
      authorId: "u1",
      title: "More",
      body: "No PII here",
      createdAt: new Date().toISOString(),
    },
  ].map((p) => RawPostSchema.parse(p));
}

function redactPII(text: string): { text: string; redacted: boolean } {
  const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  const phoneRe = /\b\d{3}-\d{4}\b/g;
  const before = text;
  const after = before.replace(emailRe, "[REDACTED_EMAIL]").replace(phoneRe, "[REDACTED_PHONE]");
  return { text: after, redacted: after !== before };
}

function sanitize(raw: RawPost[]): SanitizedPost[] {
  return raw.map((p) => {
    const r = redactPII(p.body);
    return { ...p, body: r.text, piiRedacted: r.redacted };
  });
}

function aggregate(posts: SanitizedPost[]): Aggregated {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.authorId, (counts.get(p.authorId) ?? 0) + 1);
  return {
    byAuthor: [...counts.entries()]
      .map(([authorId, posts]) => ({ authorId, posts }))
      .sort((a, b) => b.posts - a.posts),
    totalPosts: posts.length,
  };
}

export type PipelineRunResult = {
  jobRunId: string;
  datasets: {
    raw: { name: string; version: string; rows: number };
    sanitized: { name: string; version: string; rows: number };
    aggregated: { name: string; version: string; rows: number };
  };
};

export function runPipeline(params: {
  jobName: string;
  ledger: Ledger;
  lineage: LineageGraph;
}): PipelineRunResult {
  const jobRunId = `${params.jobName}-${randomUUID()}`;
  params.ledger.append({ type: "job_started", jobRunId, payload: { jobName: params.jobName } });

  const rawV = new Date().toISOString().slice(0, 10);
  const sanitizedV = `${rawV}-san`;
  const aggV = `${rawV}-agg`;

  const raw = sampleRaw();
  const rawNode = params.lineage.upsertDataset({ name: "posts_raw", version: rawV });
  params.ledger.append({
    type: "dataset_written",
    jobRunId,
    payload: { dataset: rawNode.name, version: rawNode.version, rows: raw.length },
  });

  const sanitized = sanitize(raw);
  const sanNode = params.lineage.upsertDataset({ name: "posts_sanitized", version: sanitizedV });
  params.lineage.addDerivedFrom({ from: rawNode, to: sanNode, jobRunId });
  params.ledger.append({
    type: "lineage_edge",
    jobRunId,
    payload: { from: `${rawNode.name}@${rawNode.version}`, to: `${sanNode.name}@${sanNode.version}` },
  });
  params.ledger.append({
    type: "dataset_written",
    jobRunId,
    payload: {
      dataset: sanNode.name,
      version: sanNode.version,
      rows: sanitized.length,
      piiRedacted: sanitized.filter((p) => p.piiRedacted).length,
    },
  });

  const agg = aggregate(sanitized);
  const aggNode = params.lineage.upsertDataset({ name: "posts_agg", version: aggV });
  params.lineage.addDerivedFrom({ from: sanNode, to: aggNode, jobRunId });
  params.ledger.append({
    type: "lineage_edge",
    jobRunId,
    payload: { from: `${sanNode.name}@${sanNode.version}`, to: `${aggNode.name}@${aggNode.version}` },
  });
  params.ledger.append({
    type: "dataset_written",
    jobRunId,
    payload: { dataset: aggNode.name, version: aggNode.version, rows: agg.byAuthor.length },
  });

  params.ledger.append({ type: "job_completed", jobRunId, payload: { ok: true } });

  return {
    jobRunId,
    datasets: {
      raw: { name: rawNode.name, version: rawNode.version, rows: raw.length },
      sanitized: { name: sanNode.name, version: sanNode.version, rows: sanitized.length },
      aggregated: { name: aggNode.name, version: aggNode.version, rows: agg.byAuthor.length },
    },
  };
}

