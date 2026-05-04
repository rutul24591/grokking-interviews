export type Citation = { id: string; title: string; snippet?: string; score?: number };
export type AnswerChunk = { kind: "token" | "citation" | "done"; text?: string; citation?: Citation };

export type QnaState = { query: string; answer: string; citations: Citation[]; status: "idle" | "loading" | "done" | "error"; requestId: number };

export function create(): QnaState {
  return { query: "", answer: "", citations: [], status: "idle", requestId: 0 };
}
