export type Suggestion = {
  id: string;
  label: string;
  score?: number;
  // optional metadata for rendering (category, typeahead group, etc.)
  meta?: Record<string, unknown>;
};

export type AutocompleteQuery = {
  text: string;
  cursor?: number; // caret position (useful for mention/autocomplete)
};

export type AutocompleteState = {
  query: AutocompleteQuery;
  open: boolean;
  activeIndex: number; // keyboard focus (roving index)
  suggestions: Suggestion[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  // request/race control
  requestId: number;
  // cache: queryKey -> suggestions
  cache: Map<string, { at: number; items: Suggestion[] }>;
};

export type AutocompletePolicy = {
  debounceMs: number;
  cacheTtlMs: number;
  minChars: number;
  maxSuggestions: number;
};

export type Fetcher = (q: AutocompleteQuery, signal: AbortSignal) => Promise<Suggestion[]>;

export function createInitialState(): AutocompleteState {
  return {
    query: { text: "" },
    open: false,
    activeIndex: -1,
    suggestions: [],
    status: "idle",
    error: null,
    requestId: 0,
    cache: new Map(),
  };
}

export function queryKey(q: AutocompleteQuery) {
  return q.text.trim().toLowerCase();
}

export function highlightMatch(label: string, query: string) {
  const q = query.trim();
  if (!q) return [{ text: label, match: false }] as const;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return [{ text: label, match: false }] as const;
  return [
    { text: label.slice(0, idx), match: false },
    { text: label.slice(idx, idx + q.length), match: true },
    { text: label.slice(idx + q.length), match: false },
  ] as const;
}

export function openIfEligible(state: AutocompleteState, policy: AutocompletePolicy) {
  const key = queryKey(state.query);
  const open = key.length >= policy.minChars;
  return { ...state, open };
}

export function moveActive(state: AutocompleteState, delta: number) {
  if (!state.open || state.suggestions.length === 0) return state;
  const next = (state.activeIndex + delta + state.suggestions.length) % state.suggestions.length;
  return { ...state, activeIndex: next };
}

export function setQuery(state: AutocompleteState, q: AutocompleteQuery, policy: AutocompletePolicy) {
  // Reset active index whenever query changes.
  const next = { ...state, query: q, activeIndex: -1, error: null };
  return openIfEligible(next, policy);
}

export function getCached(
  state: AutocompleteState,
  q: AutocompleteQuery,
  policy: AutocompletePolicy,
) {
  const key = queryKey(q);
  const hit = state.cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > policy.cacheTtlMs) return null;
  return hit.items;
}

export function putCached(state: AutocompleteState, q: AutocompleteQuery, items: Suggestion[]) {
  const key = queryKey(q);
  const next = new Map(state.cache);
  next.set(key, { at: Date.now(), items });
  return { ...state, cache: next };
}

export function createController(args: { policy: AutocompletePolicy; fetcher: Fetcher }) {
  const { policy, fetcher } = args;
  let state = createInitialState();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let abort: AbortController | null = null;

  const getState = () => state;
  const setState = (s: AutocompleteState) => {
    state = s;
  };

  async function runFetch(q: AutocompleteQuery) {
    abort?.abort();
    abort = new AbortController();

    const cached = getCached(state, q, policy);
    if (cached) {
      setState({ ...state, status: "ready", suggestions: cached.slice(0, policy.maxSuggestions) });
      return;
    }

    const rid = state.requestId + 1;
    setState({ ...state, status: "loading", requestId: rid });

    try {
      const items = await fetcher(q, abort.signal);
      // race check: only latest request updates state
      if (getState().requestId !== rid) return;
      const trimmed = items.slice(0, policy.maxSuggestions);
      setState(putCached({ ...getState(), status: "ready", suggestions: trimmed }, q, trimmed));
    } catch (e) {
      if (abort.signal.aborted) return;
      setState({ ...getState(), status: "error", error: e instanceof Error ? e.message : "fetch failed" });
    }
  }

  return {
    getState,
    setQuery(q: AutocompleteQuery) {
      setState(setQuery(getState(), q, policy));
      const key = queryKey(q);
      if (key.length < policy.minChars) {
        abort?.abort();
        if (timer) clearTimeout(timer);
        setState({ ...getState(), status: "idle", suggestions: [], open: false });
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void runFetch(q), policy.debounceMs);
    },
    keyDown(key: "ArrowDown" | "ArrowUp" | "Enter" | "Escape") {
      if (key === "Escape") setState({ ...getState(), open: false, activeIndex: -1 });
      else if (key === "ArrowDown") setState(moveActive(getState(), +1));
      else if (key === "ArrowUp") setState(moveActive(getState(), -1));
      else if (key === "Enter") {
        const s = getState();
        const item = s.suggestions[s.activeIndex];
        if (!item) return null;
        setState({ ...s, open: false, activeIndex: -1 });
        return item;
      }
      return null;
    },
  };
}

