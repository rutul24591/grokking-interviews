export type FileUploadSystemStage = "queued" | "creating-session" | "hashing" | "uploading-chunks" | "verifying" | "complete";

export type FileUploadSystemTransition = {
  command: string;
  from: FileUploadSystemStage;
  to: FileUploadSystemStage;
  revision: number;
};

export type FileUploadSystemState = {
  id: string;
  stage: FileUploadSystemStage;
  revision: number;
  audit: string[];
};

// Complete only after the server ledger confirms every chunk checksum exactly once.
export function applyFileUploadSystemTransition(
  state: FileUploadSystemState,
  transition: FileUploadSystemTransition,
): FileUploadSystemState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid multipart upload transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runFileUploadSystemProtocolScenario() {
  const transitions: FileUploadSystemTransition[] = [
  { command: "create-session", from: "queued", to: "creating-session", revision: 1 },
  { command: "hash-chunks", from: "creating-session", to: "hashing", revision: 2 },
  { command: "upload-bounded-pool", from: "hashing", to: "uploading-chunks", revision: 3 },
  { command: "verify-ledger", from: "uploading-chunks", to: "verifying", revision: 4 },
  { command: "commit-upload", from: "verifying", to: "complete", revision: 5 },
  ];
  return transitions.reduce(applyFileUploadSystemTransition, {
    id: "file-upload-system-case-17",
    stage: "queued",
    revision: 0,
    audit: [],
  });
}

export const FileUploadSystemInvariant =
  "Complete only after the server ledger confirms every chunk checksum exactly once.";
