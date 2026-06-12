export type StreamingMarkdownRendererStage = "empty" | "receiving" | "buffering-block" | "parsing-safe-prefix" | "rendering" | "complete";

export type StreamingMarkdownRendererTransition = {
  command: string;
  from: StreamingMarkdownRendererStage;
  to: StreamingMarkdownRendererStage;
  revision: number;
};

export type StreamingMarkdownRendererState = {
  id: string;
  stage: StreamingMarkdownRendererStage;
  revision: number;
  audit: string[];
};

// Never render an incomplete fenced block or unsanitized HTML fragment.
export function applyStreamingMarkdownRendererTransition(
  state: StreamingMarkdownRendererState,
  transition: StreamingMarkdownRendererTransition,
): StreamingMarkdownRendererState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid streaming markdown projection transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runStreamingMarkdownRendererProtocolScenario() {
  const transitions: StreamingMarkdownRendererTransition[] = [
  { command: "receive-chunk", from: "empty", to: "receiving", revision: 1 },
  { command: "buffer-incomplete-block", from: "receiving", to: "buffering-block", revision: 2 },
  { command: "parse-safe-prefix", from: "buffering-block", to: "parsing-safe-prefix", revision: 3 },
  { command: "sanitize-html", from: "parsing-safe-prefix", to: "rendering", revision: 4 },
  { command: "commit-fragment", from: "rendering", to: "complete", revision: 5 },
  ];
  return transitions.reduce(applyStreamingMarkdownRendererTransition, {
    id: "streaming-markdown-renderer-case-17",
    stage: "empty",
    revision: 0,
    audit: [],
  });
}

export const StreamingMarkdownRendererInvariant =
  "Never render an incomplete fenced block or unsanitized HTML fragment.";
