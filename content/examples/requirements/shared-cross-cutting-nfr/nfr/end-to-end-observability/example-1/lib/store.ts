export type Span = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  service: string;
  startedAt: number;
  endedAt?: number;
  attributes?: Record<string, string | number | boolean>;
};

type Store = {
  spans: Span[];
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__TRACE_STORE__ as Store | undefined) ?? { spans: [] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__TRACE_STORE__ = store;

export function startSpan(span: Span) {
  store.spans.push(span);
}

export function endSpan(params: { traceId: string; spanId: string; endedAt: number }) {
  const s = store.spans.find((x) => x.traceId === params.traceId && x.spanId === params.spanId);
  if (s) s.endedAt = params.endedAt;
}

export function listSpans(traceId: string): Span[] {
  return store.spans
    .filter((s) => s.traceId === traceId)
    .slice()
    .sort((a, b) => a.startedAt - b.startedAt);
}

export function reset() {
  store.spans = [];
}

