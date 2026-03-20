import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

export const LedgerEventSchema = z.object({
  id: z.string(),
  ts: z.string(),
  type: z.enum(["job_started", "dataset_written", "lineage_edge", "job_completed"]),
  actor: z.string().default("pipeline"),
  jobRunId: z.string(),
  payload: z.record(z.unknown()),
  prevHash: z.string().nullable(),
  hash: z.string(),
});

export type LedgerEvent = z.infer<typeof LedgerEventSchema>;

function stableStringify(obj: unknown): string {
  // Good enough for demo. In prod: canonical JSON or protobuf with deterministic ordering.
  return JSON.stringify(obj, Object.keys(obj as any).sort());
}

function hashEvent(params: { prevHash: string | null; body: Omit<LedgerEvent, "hash"> }): string {
  const h = createHash("sha256");
  h.update(params.prevHash ?? "GENESIS");
  h.update("|");
  h.update(stableStringify(params.body));
  return h.digest("hex");
}

export class Ledger {
  private events: LedgerEvent[] = [];

  append(params: {
    type: LedgerEvent["type"];
    actor?: string;
    jobRunId: string;
    payload: Record<string, unknown>;
  }): LedgerEvent {
    const prevHash = this.events.length ? this.events[this.events.length - 1].hash : null;
    const body: Omit<LedgerEvent, "hash"> = {
      id: randomUUID(),
      ts: new Date().toISOString(),
      type: params.type,
      actor: params.actor ?? "pipeline",
      jobRunId: params.jobRunId,
      payload: params.payload,
      prevHash,
    };
    const hash = hashEvent({ prevHash, body });
    const event: LedgerEvent = { ...body, hash };
    this.events.push(event);
    return event;
  }

  list(limit = 200): LedgerEvent[] {
    return this.events.slice(-limit);
  }

  headHash(): string | null {
    return this.events.length ? this.events[this.events.length - 1].hash : null;
  }

  verify(): { ok: boolean; checked: number; badIndex?: number; expected?: string; actual?: string } {
    let prevHash: string | null = null;
    for (let i = 0; i < this.events.length; i++) {
      const e = this.events[i];
      const { hash, ...body } = e;
      const expected = hashEvent({ prevHash, body });
      if (expected !== hash) {
        return { ok: false, checked: i + 1, badIndex: i, expected, actual: hash };
      }
      prevHash = hash;
    }
    return { ok: true, checked: this.events.length };
  }
}

