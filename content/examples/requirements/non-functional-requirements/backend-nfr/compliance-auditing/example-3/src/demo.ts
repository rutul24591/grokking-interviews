type Event = { id: string; ts: number; payload: unknown };

class Exporter {
  private exported = new Set<string>();

  exportBatch(events: Event[], checkpoint: number): { checkpoint: number; exported: number } {
    let nextCheckpoint = checkpoint;
    let exportedCount = 0;

    for (const e of events) {
      if (e.ts < checkpoint) continue; // resume
      if (this.exported.has(e.id)) continue; // idempotency

      // "write" to sink
      this.exported.add(e.id);
      exportedCount++;
      nextCheckpoint = Math.max(nextCheckpoint, e.ts + 1);
    }

    return { checkpoint: nextCheckpoint, exported: exportedCount };
  }
}

const events: Event[] = [
  { id: "a", ts: 10, payload: { action: "user.created" } },
  { id: "b", ts: 20, payload: { action: "role.changed" } },
  { id: "c", ts: 20, payload: { action: "role.changed" } }
];

const exporter = new Exporter();
let checkpoint = 0;
({ checkpoint } = exporter.exportBatch(events, checkpoint));
// simulate retry / crash recovery
const retry = exporter.exportBatch(events, checkpoint - 5);

console.log(JSON.stringify({ checkpoint, retry }, null, 2));

