export type Citation = {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  score?: number;
};

export type AnswerChunk =
  | { kind: "token"; text: string }
  | { kind: "citation"; citation: Citation }
  | { kind: "done" };

export type RagState = {
  query: string;
  status: "idle" | "retrieving" | "answering" | "done" | "error";
  answerText: string;
  citations: Citation[];
  error: string | null;
  requestId: number;
};

export type Retriever = (query: string, signal: AbortSignal) => Promise<Citation[]>;
export type Generator = (
  args: { query: string; citations: Citation[]; signal: AbortSignal },
) => AsyncGenerator<AnswerChunk, void, void>;

export function createInitial(): RagState {
  return { query: "", status: "idle", answerText: "", citations: [], error: null, requestId: 0 };
}

export function createController(args: { retrieve: Retriever; generate: Generator }) {
  const { retrieve, generate } = args;
  let state = createInitial();
  let abort: AbortController | null = null;

  const getState = () => state;
  const setState = (s: RagState) => {
    state = s;
  };

  async function run(query: string) {
    abort?.abort();
    abort = new AbortController();

    const rid = getState().requestId + 1;
    setState({ ...getState(), query, requestId: rid, status: "retrieving", answerText: "", citations: [], error: null });

    try {
      const citations = await retrieve(query, abort.signal);
      if (getState().requestId !== rid) return;
      setState({ ...getState(), citations, status: "answering" });

      for await (const chunk of generate({ query, citations, signal: abort.signal })) {
        if (getState().requestId !== rid) return;
        if (chunk.kind === "token") setState({ ...getState(), answerText: getState().answerText + chunk.text });
        else if (chunk.kind === "citation") setState({ ...getState(), citations: [...getState().citations, chunk.citation] });
        else setState({ ...getState(), status: "done" });
      }
    } catch (e) {
      if (abort.signal.aborted) return;
      setState({ ...getState(), status: "error", error: e instanceof Error ? e.message : "rag failed" });
    }
  }

  return { getState, run };
}

