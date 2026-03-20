import { InMemoryStore } from "./store.js";
import { backfillBatch, dualWritePut, readWithRepair, type MigrationState, verifyAll } from "./migration.js";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function main() {
  const source = new InMemoryStore();
  const target = new InMemoryStore();

  // Initial state: only source has data.
  for (let i = 0; i < 25; i++) {
    await source.put(`seed/${String(i).padStart(2, "0")}.txt`, `seed-${i}`);
  }

  // During migration: dual-write new traffic.
  await dualWritePut(source, target, "new/a.txt", "new-a");
  await dualWritePut(source, target, "new/b.txt", "new-b");

  // Backfill in batches with a checkpoint (cursor). Simulate an interruption and resume.
  let state: MigrationState = { cursor: 0, copied: 0, verified: 0 };
  let done = false;

  for (let step = 0; step < 2; step++) {
    const r = await backfillBatch(source, target, state, 10);
    state = r.state;
    done = r.done;
    if (step === 1) break;
  }

  // Simulated crash/restart: we keep `state` and continue.
  while (!done) {
    const r = await backfillBatch(source, target, state, 10);
    state = r.state;
    done = r.done;
  }

  // Read-repair can smooth cutover: prefer target but repair misses from source.
  const rr = await readWithRepair(target, source, "seed/03.txt");
  assert(rr && rr.value === "seed-3", "read-repair should return correct value");

  // Verification step before cutover.
  const v = await verifyAll(source, target);
  assert(v.ok, `verification failed: mismatches=${v.mismatches}`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        copied: state.copied,
        verification: v,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

