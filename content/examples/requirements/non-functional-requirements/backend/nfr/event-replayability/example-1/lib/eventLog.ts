import { randomUUID } from "node:crypto";

export type Event = { offset: number; id: string; type: string; payload: Record<string, unknown>; ts: string };

class EventLog {
  private nextOffset = 0;
  private events: Event[] = [];
  private checkpoints = new Map<string, number>(); // consumerId => next offset

  append(type: string, payload: Record<string, unknown>) {
    const e: Event = {
      offset: this.nextOffset++,
      id: randomUUID(),
      type,
      payload,
      ts: new Date().toISOString()
    };
    this.events.push(e);
    return e;
  }

  read(fromOffset: number, limit: number) {
    return this.events.filter((e) => e.offset >= fromOffset).slice(0, limit);
  }

  commit(consumerId: string, nextOffset: number) {
    this.checkpoints.set(consumerId, nextOffset);
  }

  reset(consumerId: string, toOffset: number) {
    this.checkpoints.set(consumerId, toOffset);
  }

  checkpoint(consumerId: string) {
    return this.checkpoints.get(consumerId) ?? 0;
  }
}

export const log = new EventLog();

