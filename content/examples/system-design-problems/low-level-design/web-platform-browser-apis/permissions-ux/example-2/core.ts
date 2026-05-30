export type PermissionsUxTaskState = "queued" | "running" | "completed" | "failed" | "cancelled" | "timed-out";

export interface PermissionsUxTask {
  id: string;
  scope: string;
  priority: number;
  deadlineMs: number;
  startedAtMs?: number;
  state: PermissionsUxTaskState;
  attempts: number;
}

export class PermissionsUxRuntimeQueue {
  private tasks: PermissionsUxTask[] = [];
  private cancelled = new Set<string>();

  enqueue(task: Omit<PermissionsUxTask, "state" | "attempts">): PermissionsUxTask {
    const queued: PermissionsUxTask = { ...task, state: "queued", attempts: 0 };
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

  drain(nowMs: number, budget: number): PermissionsUxTask[] {
    const completed: PermissionsUxTask[] = [];
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

export function runPermissionsUxQueueScenario() {
  const queue = new PermissionsUxRuntimeQueue();
  queue.enqueue({ id: "permissions-ux-primary", scope: "article", priority: 10, deadlineMs: Date.now() + 5_000 });
  queue.enqueue({ id: "permissions-ux-secondary", scope: "article", priority: 1, deadlineMs: Date.now() + 50 });
  return { completed: queue.drain(Date.now() + 100, 3), snapshot: queue.snapshot() };
}
