export type BackgroundSyncSystemTaskState = "queued" | "running" | "completed" | "failed" | "cancelled" | "timed-out";

export interface BackgroundSyncSystemTask {
  id: string;
  scope: string;
  priority: number;
  deadlineMs: number;
  startedAtMs?: number;
  state: BackgroundSyncSystemTaskState;
  attempts: number;
}

export class BackgroundSyncSystemRuntimeQueue {
  private tasks: BackgroundSyncSystemTask[] = [];
  private cancelled = new Set<string>();

  enqueue(task: Omit<BackgroundSyncSystemTask, "state" | "attempts">): BackgroundSyncSystemTask {
    const queued: BackgroundSyncSystemTask = { ...task, state: "queued", attempts: 0 };
    this.tasks.push(queued);
    this.tasks.sort((a, b) => b.priority - a.priority || a.deadlineMs - b.deadlineMs);
    return queued;
  }

  cancel(id: string): boolean {
    this.cancelled.add(id);
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (!task) return false;
    task.state = "cancelled";
    return true;
  }

  drain(nowMs: number, budget: number): BackgroundSyncSystemTask[] {
    const completed: BackgroundSyncSystemTask[] = [];
    for (const task of this.tasks) {
      if (budget <= 0) break;
      if (this.cancelled.has(task.id)) {
        task.state = "cancelled";
        continue;
      }
      if (task.deadlineMs < nowMs) {
        task.state = "timed-out";
        continue;
      }
      task.state = "running";
      task.startedAtMs = nowMs;
      task.attempts += 1;
      task.state = "completed";
      completed.push(task);
      budget -= 1;
    }
    this.tasks = this.tasks.filter((task) => task.state === "queued" || task.state === "running");
    return completed;
  }

  snapshot() {
    return { queued: this.tasks.length, cancelled: this.cancelled.size, ids: this.tasks.map((task) => task.id) };
  }
}

export function runBackgroundSyncSystemQueueScenario() {
  const queue = new BackgroundSyncSystemRuntimeQueue();
  queue.enqueue({ id: "background-sync-system-primary", scope: "article", priority: 10, deadlineMs: Date.now() + 5_000 });
  queue.enqueue({ id: "background-sync-system-secondary", scope: "article", priority: 1, deadlineMs: Date.now() + 50 });
  return { completed: queue.drain(Date.now() + 100, 3), snapshot: queue.snapshot() };
}
