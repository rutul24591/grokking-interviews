import { randomBytes, randomUUID } from "node:crypto";

export type Span = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  attrs?: Record<string, string>;
};

type TraceContext = { traceId: string; parentSpanId: string | null; traceparent: string };

function hex(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("hex");
}

function newTraceId() {
  return hex(randomBytes(16));
}

function newSpanId() {
  return hex(randomBytes(8));
}

export function parseOrCreateTraceContext(traceparentHeader: string | null): TraceContext {
  if (traceparentHeader) {
    const m = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i.exec(traceparentHeader.trim());
    if (m) {
      const traceId = m[1]!.toLowerCase();
      const parentSpanId = m[2]!.toLowerCase();
      const flags = m[3]!.toLowerCase();
      const nextSpanId = newSpanId();
      return {
        traceId,
        parentSpanId,
        traceparent: `00-${traceId}-${nextSpanId}-${flags}`
      };
    }
  }

  const traceId = newTraceId();
  const spanId = newSpanId();
  return { traceId, parentSpanId: null, traceparent: `00-${traceId}-${spanId}-01` };
}

class TraceStore {
  private byTrace = new Map<string, Span[]>();
  private traceOrder: string[] = [];
  constructor(private readonly maxTraces: number) {}

  record(span: Span) {
    const existing = this.byTrace.get(span.traceId) ?? [];
    existing.push(span);
    this.byTrace.set(span.traceId, existing);
    if (!this.traceOrder.includes(span.traceId)) {
      this.traceOrder.push(span.traceId);
      while (this.traceOrder.length > this.maxTraces) {
        const evict = this.traceOrder.shift()!;
        this.byTrace.delete(evict);
      }
    }
  }

  get(traceId: string) {
    return (this.byTrace.get(traceId) ?? []).slice().sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  }
}

export const traceStore = new TraceStore(200);

export async function withSpan<T>(params: {
  traceId: string;
  parentSpanId: string | null;
  name: string;
  attrs?: Record<string, string>;
  fn: (spanId: string) => Promise<T>;
}): Promise<T> {
  const spanId = newSpanId();
  const startedAt = new Date().toISOString();
  const startMs = Date.now();
  try {
    return await params.fn(spanId);
  } finally {
    const endedAt = new Date().toISOString();
    const durationMs = Date.now() - startMs;
    traceStore.record({
      traceId: params.traceId,
      spanId,
      parentSpanId: params.parentSpanId,
      name: params.name,
      startedAt,
      endedAt,
      durationMs,
      attrs: { requestId: randomUUID(), ...(params.attrs || {}) }
    });
  }
}

