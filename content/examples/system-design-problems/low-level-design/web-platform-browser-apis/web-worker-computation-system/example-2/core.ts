export type WebWorkerComputationSystemTaskState = "queued" | "running" | "completed" | "failed" | "cancelled" | "timed-out";

export interface WebWorkerComputationSystemTask {
  id: string;
  scope: string;
  priority: number;
  deadlineMs: number;
  startedAtMs?: number;
  state: WebWorkerComputationSystemTaskState;
  attempts: number;
}

export class WebWorkerComputationSystemRuntimeQueue {
  private tasks: WebWorkerComputationSystemTask[] = [];
  private cancelled = new Set<string>();

  enqueue(task: Omit<WebWorkerComputationSystemTask, "state" | "attempts">): WebWorkerComputationSystemTask {
    const queued: WebWorkerComputationSystemTask = { ...task, state: "queued", attempts: 0 };
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

  drain(nowMs: number, budget: number): WebWorkerComputationSystemTask[] {
    const completed: WebWorkerComputationSystemTask[] = [];
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

export function runWebWorkerComputationSystemQueueScenario() {
  const queue = new WebWorkerComputationSystemRuntimeQueue();
  queue.enqueue({ id: "web-worker-computation-system-primary", scope: "article", priority: 10, deadlineMs: Date.now() + 5_000 });
  queue.enqueue({ id: "web-worker-computation-system-secondary", scope: "article", priority: 1, deadlineMs: Date.now() + 50 });
  return { completed: queue.drain(Date.now() + 100, 3), snapshot: queue.snapshot() };
}
