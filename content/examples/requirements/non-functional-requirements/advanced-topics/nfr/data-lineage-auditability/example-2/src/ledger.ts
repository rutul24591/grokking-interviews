import { createHash, randomUUID } from "node:crypto";

export type EventBody = {
  id: string;
  ts: string;
  type: string;
  payload: Record<string, unknown>;
  prevHash: string | null;
};

export type Event = EventBody & { hash: string };

function hash(prevHash: string | null, body: EventBody): string {
  const h = createHash("sha256");
  h.update(prevHash ?? "GENESIS");
  h.update("|");
  h.update(JSON.stringify(body));
  return h.digest("hex");
}

export class HashLedger {
  private events: Event[] = [];

  append(type: string, payload: Record<string, unknown>) {
    const prevHash = this.events.length ? this.events[this.events.length - 1].hash : null;
    const body: EventBody = {
      id: randomUUID(),
      ts: new Date().toISOString(),
      type,
      payload,
      prevHash,
    };
    const event: Event = { ...body, hash: hash(prevHash, body) };
    this.events.push(event);
    return event;
  }

  list() {
    return [...this.events];
  }

  verify() {
    let prevHash: string | null = null;
    for (let i = 0; i < this.events.length; i++) {
      const { hash: actual, ...body } = this.events[i];
      const expected = hash(prevHash, body);
      if (expected !== actual) return { ok: false, badIndex: i, expected, actual };
      prevHash = actual;
    }
    return { ok: true };
  }
}

