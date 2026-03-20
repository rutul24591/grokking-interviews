import { randomUUID } from "node:crypto";
import { RunEventSchema } from "./openlineage";

const runId = randomUUID();

const start = RunEventSchema.parse({
  eventType: "START",
  eventTime: new Date().toISOString(),
  job: { namespace: "demo", name: "daily_aggregate" },
  run: { runId },
  inputs: [{ namespace: "warehouse", name: "posts_raw" }],
  outputs: [{ namespace: "warehouse", name: "posts_agg" }],
  facets: {
    documentation: { description: "Daily aggregation of posts by author" },
    ownership: { owners: [{ name: "data-platform", type: "team" }] },
  },
});

const complete = RunEventSchema.parse({
  eventType: "COMPLETE",
  eventTime: new Date().toISOString(),
  job: { namespace: "demo", name: "daily_aggregate" },
  run: { runId },
  inputs: [{ namespace: "warehouse", name: "posts_sanitized" }],
  outputs: [{ namespace: "warehouse", name: "posts_agg" }],
  facets: {
    columnLineage: {
      mappings: [
        { outputColumn: "authorId", inputColumns: ["posts_sanitized.authorId"] },
        { outputColumn: "posts", inputColumns: ["posts_sanitized.id"] },
      ],
    },
  },
});

console.log(JSON.stringify({ start, complete }, null, 2));

