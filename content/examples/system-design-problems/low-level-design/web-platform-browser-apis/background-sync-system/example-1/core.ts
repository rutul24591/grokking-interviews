export type SyncTask = { id: string; url: string; method: "POST" | "PUT" | "DELETE"; body?: unknown; createdAt: number };

export type SyncState = { tasks: SyncTask[] };

export function add(state: SyncState, t: SyncTask) {
  return { tasks: [...state.tasks, t] };
}

export function drain(state: SyncState, max: number) {
  return { batch: state.tasks.slice(0, max), next: { tasks: state.tasks.slice(max) } };
}
