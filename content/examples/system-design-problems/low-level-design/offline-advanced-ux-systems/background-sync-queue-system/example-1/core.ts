export type Job = { id: string; kind: string; payload: Record<string, unknown>; attempts: number; nextRunAt: number };

export type QueueState = { jobs: Job[] };

export function add(state: QueueState, job: Omit<Job, "attempts" | "nextRunAt">) {
  return { jobs: [...state.jobs, { ...job, attempts: 0, nextRunAt: Date.now() }] };
}

export function pickRunnable(state: QueueState, now = Date.now()) {
  const sorted = [...state.jobs].sort((a, b) => a.nextRunAt - b.nextRunAt);
  return sorted.find((j) => j.nextRunAt <= now) ?? null;
}
