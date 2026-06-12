export type CodeEditorComponentStage = "closed" | "loading-model" | "ready" | "applying-edit" | "analyzing" | "ready";

export type CodeEditorComponentTransition = {
  command: string;
  from: CodeEditorComponentStage;
  to: CodeEditorComponentStage;
  revision: number;
};

export type CodeEditorComponentState = {
  id: string;
  stage: CodeEditorComponentStage;
  revision: number;
  audit: string[];
};

// Apply diagnostics only when their document version matches the current model version.
export function applyCodeEditorComponentTransition(
  state: CodeEditorComponentState,
  transition: CodeEditorComponentTransition,
): CodeEditorComponentState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid editor document transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runCodeEditorComponentProtocolScenario() {
  const transitions: CodeEditorComponentTransition[] = [
  { command: "open-model", from: "closed", to: "loading-model", revision: 1 },
  { command: "hydrate-text", from: "loading-model", to: "ready", revision: 2 },
  { command: "apply-edit", from: "ready", to: "applying-edit", revision: 3 },
  { command: "request-analysis", from: "applying-edit", to: "analyzing", revision: 4 },
  { command: "publish-diagnostics", from: "analyzing", to: "ready", revision: 5 },
  ];
  return transitions.reduce(applyCodeEditorComponentTransition, {
    id: "code-editor-component-case-17",
    stage: "closed",
    revision: 0,
    audit: [],
  });
}

export const CodeEditorComponentInvariant =
  "Apply diagnostics only when their document version matches the current model version.";
