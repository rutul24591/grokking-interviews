import * as fs from "fs";
import * as path from "path";

import type { ArtifactRecord, ArtifactType, EvaluationRecord, RunRecord, TaskRecord } from "./types";
import {
  STATE_ROOT,
  copyFile,
  ensureDir,
  nowIso,
  randomId,
  readJson,
  relativeToRepo,
  writeJson,
} from "./utils";

type RegisterArtifactInput = {
  run: RunRecord;
  task: TaskRecord;
  type: ArtifactType;
  sourcePath: string;
  contentType: ArtifactRecord["contentType"];
  schema?: string | null;
  producer: string;
  proposedTargetPath?: string | null;
  metadata?: ArtifactRecord["metadata"];
};

type RegisterInlineArtifactInput = {
  run: RunRecord;
  task: TaskRecord;
  type: ArtifactType;
  content: string;
  extension: string;
  contentType: ArtifactRecord["contentType"];
  schema?: string | null;
  producer: string;
  proposedTargetPath?: string | null;
  metadata?: ArtifactRecord["metadata"];
};

export function getRunDir(runId: string) {
  return path.join(STATE_ROOT, "runs", runId);
}

export function getArtifactsDir(runId: string) {
  return path.join(getRunDir(runId), "artifacts");
}

export function getArtifactRecordsDir(runId: string) {
  return path.join(getArtifactsDir(runId), "records");
}

export function getArtifactFilesDir(runId: string) {
  return path.join(getArtifactsDir(runId), "files");
}

export function getEvaluationsDir(runId: string) {
  return path.join(getRunDir(runId), "evaluations");
}

export function getArtifactPath(runId: string, artifactId: string, extension: string) {
  return path.join(getArtifactFilesDir(runId), `${artifactId}.${extension}`);
}

export function getArtifactRecordPath(runId: string, artifactId: string) {
  return path.join(getArtifactRecordsDir(runId), `${artifactId}.json`);
}

export function persistRun(run: RunRecord) {
  writeJson(path.join(getRunDir(run.id), "run.json"), run);
}

export function loadRun(runId: string) {
  return readJson<RunRecord>(path.join(getRunDir(runId), "run.json"));
}

export function persistTask(task: TaskRecord) {
  writeJson(path.join(getRunDir(task.runId), "tasks", `${task.id}.json`), task);
}

export function loadTask(runId: string, taskId: string) {
  return readJson<TaskRecord>(path.join(getRunDir(runId), "tasks", `${taskId}.json`));
}

export function loadTasks(runId: string) {
  const run = loadRun(runId);
  return run.taskIds.map((taskId) => loadTask(runId, taskId));
}

export function persistArtifact(artifact: ArtifactRecord) {
  writeJson(getArtifactRecordPath(artifact.runId, artifact.id), artifact);
}

export function loadArtifact(runId: string, artifactId: string) {
  return readJson<ArtifactRecord>(getArtifactRecordPath(runId, artifactId));
}

export function loadArtifacts(runId: string) {
  const run = loadRun(runId);
  return run.artifactIds.map((artifactId) => loadArtifact(runId, artifactId));
}

export function registerArtifact(input: RegisterArtifactInput) {
  const extension = path.extname(input.sourcePath).replace(/^\./, "") || inferExtension(input.contentType);
  const artifactId = randomId("artifact");
  const artifactOutputPath = getArtifactPath(input.run.id, artifactId, extension);

  ensureDir(getArtifactFilesDir(input.run.id));
  ensureDir(getArtifactRecordsDir(input.run.id));
  copyFile(input.sourcePath, artifactOutputPath);

  const artifact: ArtifactRecord = {
    id: artifactId,
    runId: input.run.id,
    taskId: input.task.id,
    type: input.type,
    schema: input.schema ?? null,
    version: 1,
    createdAt: nowIso(),
    producer: input.producer,
    contentType: input.contentType,
    status: "candidate",
    path: relativeToRepo(artifactOutputPath),
    proposedTargetPath: input.proposedTargetPath ?? null,
    metadata: input.metadata ?? {},
  };

  persistArtifact(artifact);

  input.run.artifactIds.push(artifact.id);
  input.task.outputArtifactIds.push(artifact.id);

  persistRun(input.run);
  persistTask(input.task);

  return artifact;
}

export function registerInlineArtifact(input: RegisterInlineArtifactInput) {
  const artifactId = randomId("artifact");
  const artifactOutputPath = getArtifactPath(input.run.id, artifactId, input.extension);

  ensureDir(getArtifactFilesDir(input.run.id));
  ensureDir(getArtifactRecordsDir(input.run.id));
  fs.writeFileSync(artifactOutputPath, input.content, "utf-8");

  const artifact: ArtifactRecord = {
    id: artifactId,
    runId: input.run.id,
    taskId: input.task.id,
    type: input.type,
    schema: input.schema ?? null,
    version: 1,
    createdAt: nowIso(),
    producer: input.producer,
    contentType: input.contentType,
    status: "candidate",
    path: relativeToRepo(artifactOutputPath),
    proposedTargetPath: input.proposedTargetPath ?? null,
    metadata: input.metadata ?? {},
  };

  persistArtifact(artifact);

  input.run.artifactIds.push(artifact.id);
  input.task.outputArtifactIds.push(artifact.id);

  persistRun(input.run);
  persistTask(input.task);

  return artifact;
}

export function persistEvaluation(evaluation: EvaluationRecord) {
  writeJson(path.join(getEvaluationsDir(evaluation.runId), `${evaluation.id}.json`), evaluation);
}

function inferExtension(contentType: ArtifactRecord["contentType"]) {
  switch (contentType) {
    case "json":
      return "json";
    case "markdown":
      return "md";
    case "tsx":
      return "tsx";
    case "svg":
      return "svg";
    default:
      return "txt";
  }
}

export default {
  getRunDir,
  getArtifactsDir,
  getArtifactRecordsDir,
  getArtifactFilesDir,
  getEvaluationsDir,
  getArtifactPath,
  getArtifactRecordPath,
  persistRun,
  loadRun,
  persistTask,
  loadTask,
  loadTasks,
  persistArtifact,
  loadArtifact,
  loadArtifacts,
  registerArtifact,
  registerInlineArtifact,
  persistEvaluation,
};
