export type FacetBucket = { value: string; count: number };

export type SearchRequest = {
  q: string;
  filters: Array<{ key: string; op: "eq" | "contains" | "gt" | "lt"; value: unknown }>;
  sort: Array<{ key: string; dir: "asc" | "desc" }>;
  page: { kind: "cursor"; after?: string | null; limit: number };
};

export type SearchResult<Row> = {
  rows: Row[];
  nextCursor: string | null;
  facets?: Record<string, FacetBucket[]>;
  tookMs?: number;
  snapshotId?: string;
};

export type SearchState<Row> = {
  req: SearchRequest;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  data: SearchResult<Row> | null;
  // cache by normalized request key
  cache: Map<string, { at: number; data: SearchResult<Row> }>;
  requestId: number;
};

export type SearchPolicy = {
  cacheTtlMs: number;
  debounceMs: number;
};

export type Fetcher<Row> = (req: SearchRequest, signal: AbortSignal) => Promise<SearchResult<Row>>;

export function normalizeReqKey(req: SearchRequest) {
  // Stable, deterministic key (important for caching/dedup)
  return JSON.stringify({
    q: req.q.trim(),
    filters: req.filters,
    sort: req.sort,
    after: req.page.kind === "cursor" ? req.page.after ?? null : null,
    limit: req.page.kind === "cursor" ? req.page.limit : null,
  });
}

export function createInitial<Row>(): SearchState<Row> {
  return {
    req: { q: "", filters: [], sort: [], page: { kind: "cursor", after: null, limit: 20 } },
    status: "idle",
    error: null,
    data: null,
    cache: new Map(),
    requestId: 0,
  };
}

export function createController<Row>(args: { policy: SearchPolicy; fetcher: Fetcher<Row> }) {
  const { policy, fetcher } = args;
  let state = createInitial<Row>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let abort: AbortController | null = null;

  const getState = () => state;
  const setState = (s: SearchState<Row>) => {
    state = s;
  };

  function getCached(key: string) {
    const hit = getState().cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.at > policy.cacheTtlMs) return null;
    return hit.data;
  }

  async function run(req: SearchRequest) {
    abort?.abort();
    abort = new AbortController();
    const key = normalizeReqKey(req);
    const cached = getCached(key);
    if (cached) {
      setState({ ...getState(), status: "ready", data: cached });
      return;
    }

    const rid = getState().requestId + 1;
    setState({ ...getState(), status: "loading", requestId: rid, error: null });
    try {
      const data = await fetcher(req, abort.signal);
      if (getState().requestId !== rid) return; // stale
      const cache = new Map(getState().cache);
      cache.set(key, { at: Date.now(), data });
      setState({ ...getState(), status: "ready", data, cache });
    } catch (e) {
      if (abort.signal.aborted) return;
      setState({ ...getState(), status: "error", error: e instanceof Error ? e.message : "search failed" });
    }
  }

  return {
    getState,
    setQuery(q: string) {
      const req = { ...getState().req, q, page: { kind: "cursor", after: null, limit: getState().req.page.limit } };
      setState({ ...getState(), req });
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void run(req), policy.debounceMs);
    },
    setFilter(filter: SearchRequest["filters"][number]) {
      const req = { ...getState().req, filters: [...getState().req.filters, filter], page: { kind: "cursor", after: null, limit: getState().req.page.limit } };
      setState({ ...getState(), req });
      void run(req);
    },
    clearFilters() {
      const req = { ...getState().req, filters: [], page: { kind: "cursor", after: null, limit: getState().req.page.limit } };
      setState({ ...getState(), req });
      void run(req);
    },
    loadMore() {
      const s = getState();
      const nextCursor = s.data?.nextCursor ?? null;
      if (!nextCursor) return;
      const req: SearchRequest = { ...s.req, page: { kind: "cursor", after: nextCursor, limit: s.req.page.limit } };
      void run(req);
    },
  };
}

