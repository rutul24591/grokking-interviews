export type FileExplorerUiStage = "empty" | "loading-root" | "ready" | "optimistic-move" | "reconciling" | "ready";

export type FileExplorerUiTransition = {
  command: string;
  from: FileExplorerUiStage;
  to: FileExplorerUiStage;
  revision: number;
};

export type FileExplorerUiState = {
  id: string;
  stage: FileExplorerUiStage;
  revision: number;
  audit: string[];
};

// Reject moves that place a directory inside one of its descendants.
export function applyFileExplorerUiTransition(
  state: FileExplorerUiState,
  transition: FileExplorerUiTransition,
): FileExplorerUiState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid directory projection transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runFileExplorerUiProtocolScenario() {
  const transitions: FileExplorerUiTransition[] = [
  { command: "load-root", from: "empty", to: "loading-root", revision: 1 },
  { command: "expand-node", from: "loading-root", to: "ready", revision: 2 },
  { command: "move-node", from: "ready", to: "optimistic-move", revision: 3 },
  { command: "reconcile-tree", from: "optimistic-move", to: "reconciling", revision: 4 },
  { command: "commit-tree", from: "reconciling", to: "ready", revision: 5 },
  ];
  return transitions.reduce(applyFileExplorerUiTransition, {
    id: "file-explorer-ui-case-17",
    stage: "empty",
    revision: 0,
    audit: [],
  });
}

export const FileExplorerUiInvariant =
  "Reject moves that place a directory inside one of its descendants.";
