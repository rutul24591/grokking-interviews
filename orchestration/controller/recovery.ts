import { loadRun, loadTasks, persistTask } from "./artifact-store";
import { releaseLease } from "./lease-manager";
import type { TaskRecord } from "./types";
import { nowIso } from "./utils";
import { refreshRunState } from "./planner";

export function recoverRun(runId: string, forceReleaseClaims = false) {
  const run = loadRun(runId);
  const tasks = loadTasks(runId);

  if (forceReleaseClaims) {
    for (const task of tasks) {
      if (task.status === "claimed") {
        releaseLease(runId, task.id);
        resetClaimedTask(task);
      }
    }
  }

  return refreshRunState(run.id);
}

function resetClaimedTask(task: TaskRecord) {
  task.status = "ready";
  task.assignedAgent = null;
  task.claimedAt = null;
  task.failureReason = null;
  task.completedAt = null;
  persistTask(task);
}

export function failTask(runId: string, taskId: string, reason: string) {
  const task = loadTasks(runId).find((entry) => entry.id === taskId);

  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  releaseLease(runId, taskId);
  task.status = "failed";
  task.failureReason = `${nowIso()} ${reason}`;
  task.assignedAgent = null;
  task.claimedAt = null;
  persistTask(task);

  return refreshRunState(runId);
}

export default {
  recoverRun,
  failTask,
};
