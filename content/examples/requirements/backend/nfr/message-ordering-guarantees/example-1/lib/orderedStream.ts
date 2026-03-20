export type StreamEvent = { streamId: string; seq: number; payload: Record<string, unknown>; ts: string };

type StreamState = {
  nextExpected: number;
  processed: StreamEvent[];
  buffer: Map<number, StreamEvent>;
};

class OrderedStreams {
  private streams = new Map<string, StreamState>();

  private state(streamId: string): StreamState {
    const existing = this.streams.get(streamId);
    if (existing) return existing;
    const s: StreamState = { nextExpected: 1, processed: [], buffer: new Map() };
    this.streams.set(streamId, s);
    return s;
  }

  reset() {
    this.streams.clear();
  }

  publish(e: Omit<StreamEvent, "ts">) {
    const s = this.state(e.streamId);
    const ev: StreamEvent = { ...e, ts: new Date().toISOString() };

    // De-dupe: ignore events already processed or buffered.
    if (ev.seq < s.nextExpected) return { accepted: false, reason: "duplicate_or_old" as const };
    if (s.buffer.has(ev.seq)) return { accepted: false, reason: "duplicate_buffered" as const };

    s.buffer.set(ev.seq, ev);
    this.drain(s);
    return { accepted: true as const };
  }

  private drain(s: StreamState) {
    while (true) {
      const next = s.buffer.get(s.nextExpected);
      if (!next) break;
      s.buffer.delete(s.nextExpected);
      s.processed.push(next);
      s.nextExpected++;
    }
  }

  snapshot(streamId: string) {
    const s = this.state(streamId);
    return {
      streamId,
      nextExpected: s.nextExpected,
      processedSeqs: s.processed.map((e) => e.seq),
      bufferedSeqs: [...s.buffer.keys()].sort((a, b) => a - b)
    };
  }
}

export const streams = new OrderedStreams();

