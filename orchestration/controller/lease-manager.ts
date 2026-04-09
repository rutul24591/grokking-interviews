import * as fs from "fs";
import * as path from "path";

import type { AgentId, LeaseRecord, TaskRecord } from "./types";
import { STATE_ROOT, ensureDir, fileExists, nowIso, readJson, writeJson } from "./utils";

const DEFAULT_LEASE_MINUTES = 45;

function getLeasePath(runId: string, taskId: string) {
  return path.join(STATE_ROOT, "runs", runId, "leases", `${taskId}.json`);
}

export function readLease(runId: string, taskId: string) {
  const leasePath = getLeasePath(runId, taskId);
  if (!fileExists(leasePath)) {
    return null;
  }

  return readJson<LeaseRecord>(leasePath);
}

export function acquireLease(task: TaskRecord, agentId: AgentId, leaseMinutes = DEFAULT_LEASE_MINUTES) {
  const existingLease = readLease(task.runId, task.id);
  const currentTime = Date.now();

  if (existingLease && new Date(existingLease.expiresAt).getTime() > currentTime) {
    throw new Error(`Task ${task.id} is already leased by ${existingLease.agentId}`);
  }

  const lease: LeaseRecord = {
    taskId: task.id,
    agentId,
    acquiredAt: nowIso(),
    expiresAt: new Date(currentTime + leaseMinutes * 60_000).toISOString(),
  };

  const leasePath = getLeasePath(task.runId, task.id);
  ensureDir(path.dirname(leasePath));
  writeJson(leasePath, lease);

  return lease;
}

export function releaseLease(runId: string, taskId: string) {
  const leasePath = getLeasePath(runId, taskId);
  if (fileExists(leasePath)) {
    fs.unlinkSync(leasePath);
  }
}

export function isLeaseExpired(lease: LeaseRecord) {
  return new Date(lease.expiresAt).getTime() <= Date.now();
}

export function expireLeaseIfNeeded(task: TaskRecord) {
  const lease = readLease(task.runId, task.id);
  if (!lease) {
    return false;
  }

  if (!isLeaseExpired(lease)) {
    return false;
  }

  releaseLease(task.runId, task.id);
  return true;
}
