export type RichTextEditorStage = "empty" | "hydrating-schema" | "ready" | "applying-transaction" | "normalizing" | "ready";

export type RichTextEditorTransition = {
  command: string;
  from: RichTextEditorStage;
  to: RichTextEditorStage;
  revision: number;
};

export type RichTextEditorState = {
  id: string;
  stage: RichTextEditorStage;
  revision: number;
  audit: string[];
};

// Normalize document structure after every transaction without losing the logical selection bookmark.
export function applyRichTextEditorTransition(
  state: RichTextEditorState,
  transition: RichTextEditorTransition,
): RichTextEditorState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid rich-text transaction log transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runRichTextEditorProtocolScenario() {
  const transitions: RichTextEditorTransition[] = [
  { command: "hydrate-schema", from: "empty", to: "hydrating-schema", revision: 1 },
  { command: "parse-document", from: "hydrating-schema", to: "ready", revision: 2 },
  { command: "apply-transaction", from: "ready", to: "applying-transaction", revision: 3 },
  { command: "normalize-tree", from: "applying-transaction", to: "normalizing", revision: 4 },
  { command: "commit-selection", from: "normalizing", to: "ready", revision: 5 },
  ];
  return transitions.reduce(applyRichTextEditorTransition, {
    id: "rich-text-editor-case-17",
    stage: "empty",
    revision: 0,
    audit: [],
  });
}

export const RichTextEditorInvariant =
  "Normalize document structure after every transaction without losing the logical selection bookmark.";
