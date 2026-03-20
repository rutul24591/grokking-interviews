import { setTimeout as delay } from "node:timers/promises";

type Row = { id: number; v: string };

async function backfill(rows: Row[], batchSize: number, checkpoint: number) {
  const batch = rows.filter((r) => r.id >= checkpoint).slice(0, batchSize);
  for (const r of batch) {
    // write to new schema (simulated)
    await delay(5);
  }
  const nextCheckpoint = batch.length ? batch[batch.length - 1]!.id + 1 : checkpoint;
  return { migrated: batch.length, checkpoint: nextCheckpoint };
}

async function main() {
  const rows = Array.from({ length: 100 }, (_, i) => ({ id: i, v: `row-${i}` }));
  let checkpoint = 0;
  let total = 0;

  while (checkpoint < rows.length) {
    const res = await backfill(rows, 20, checkpoint);
    total += res.migrated;
    checkpoint = res.checkpoint;
    await delay(50); // rate limit
  }

  console.log(JSON.stringify({ ok: true, total }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

