import express from "express";

const app = express();
app.use(express.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

type Snapshot = { id: string; label: string; retainedMb: number; buckets: { label: string; retainedMb: number }[] };

function initialSnapshots(): Snapshot[] {
  return [
    {
      id: "baseline",
      label: "Baseline",
      retainedMb: 42,
      buckets: [
        { label: "Feed cache", retainedMb: 16 },
        { label: "Image previews", retainedMb: 12 },
        { label: "Subscriptions", retainedMb: 8 },
        { label: "Detached nodes", retainedMb: 6 }
      ]
    },
    {
      id: "navigation",
      label: "After navigation",
      retainedMb: 49,
      buckets: [
        { label: "Feed cache", retainedMb: 20 },
        { label: "Image previews", retainedMb: 14 },
        { label: "Subscriptions", retainedMb: 9 },
        { label: "Detached nodes", retainedMb: 6 }
      ]
    }
  ];
}
let snapshots = initialSnapshots();

app.get("/state", (_, res) => {
  const latest = snapshots[snapshots.length - 1];
  res.json({
    snapshots,
    latestDiff: latest.buckets.map((bucket, index) => ({
      label: bucket.label,
      deltaMb: bucket.retainedMb - snapshots[0].buckets[index].retainedMb
    })),
    notes: [
      "Compare retained size before and after cleanup, not just total allocations.",
      "If the post-cleanup snapshot stays high, the leak source is still reachable.",
      "Snapshot diffs are most useful when taken at consistent lifecycle points."
    ]
  });
});
app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const last = snapshots[snapshots.length - 1];
  if (actionId === "capture-leaky") {
    snapshots = [
      ...snapshots,
      {
        id: `leaky-${snapshots.length}`,
        label: `Leaky ${snapshots.length}`,
        retainedMb: last.retainedMb + 8,
        buckets: [
          { label: "Feed cache", retainedMb: last.buckets[0].retainedMb + 3 },
          { label: "Image previews", retainedMb: last.buckets[1].retainedMb + 2 },
          { label: "Subscriptions", retainedMb: last.buckets[2].retainedMb + 1 },
          { label: "Detached nodes", retainedMb: last.buckets[3].retainedMb + 2 }
        ]
      }
    ];
  }
  if (actionId === "capture-clean") {
    snapshots = [
      ...snapshots,
      {
        id: `cleanup-${snapshots.length}`,
        label: `Cleanup ${snapshots.length}`,
        retainedMb: Math.max(38, last.retainedMb - 10),
        buckets: [
          { label: "Feed cache", retainedMb: Math.max(14, last.buckets[0].retainedMb - 5) },
          { label: "Image previews", retainedMb: Math.max(10, last.buckets[1].retainedMb - 3) },
          { label: "Subscriptions", retainedMb: Math.max(6, last.buckets[2].retainedMb - 1) },
          { label: "Detached nodes", retainedMb: Math.max(4, last.buckets[3].retainedMb - 1) }
        ]
      }
    ];
  }
  if (actionId === "reset") snapshots = initialSnapshots();
  res.json({ ok: true });
});

app.listen(4535, () => {
  console.log("Memory profiling API on http://localhost:4535");
});
