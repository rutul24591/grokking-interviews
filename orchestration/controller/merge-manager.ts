import * as fs from "fs";
import * as path from "path";

import { loadArtifacts, loadRun, persistRun } from "./artifact-store";
import type { ArtifactRecord } from "./types";
import { REPO_ROOT, assertWithinRepo, ensureDir, nowIso, relativeToRepo } from "./utils";

const MERGEABLE_TYPES = new Set(["tsx-candidate", "svg-file", "audit-report"]);

export function planMerge(runId: string) {
  const run = loadRun(runId);
  const artifacts = loadArtifacts(runId);

  return {
    runId,
    status: run.status,
    mergeCandidates: artifacts.filter(isMergeCandidate).map((artifact) => ({
      artifactId: artifact.id,
      type: artifact.type,
      sourcePath: artifact.path,
      targetPath: artifact.proposedTargetPath,
      status: artifact.status,
    })),
  };
}

export function mergeAcceptedArtifacts(runId: string) {
  const run = loadRun(runId);
  const artifacts = loadArtifacts(runId).filter(isMergeCandidate);
  const backupDir = path.join(REPO_ROOT, ".agent-state", "runs", runId, "backups");

  ensureDir(backupDir);

  const mergedPaths: string[] = [];

  for (const artifact of artifacts) {
    const targetPath = artifact.proposedTargetPath;

    if (!targetPath) {
      throw new Error(`Artifact ${artifact.id} is missing proposedTargetPath`);
    }

    const sourceFilePath = assertWithinRepo(path.join(REPO_ROOT, artifact.path));
    const resolvedTargetPath = assertWithinRepo(path.join(REPO_ROOT, targetPath));

    ensureDir(path.dirname(resolvedTargetPath));

    if (fs.existsSync(resolvedTargetPath)) {
      const backupPath = path.join(backupDir, `${artifact.id}-${path.basename(resolvedTargetPath)}`);
      fs.copyFileSync(resolvedTargetPath, backupPath);
    }

    fs.copyFileSync(sourceFilePath, resolvedTargetPath);
    mergedPaths.push(relativeToRepo(resolvedTargetPath));
  }

  run.status = "merged";
  run.updatedAt = nowIso();
  run.notes.push(`Merged ${mergedPaths.length} artifact(s) into the repo.`);
  persistRun(run);

  return {
    runId,
    mergedPaths,
  };
}

function isMergeCandidate(artifact: ArtifactRecord) {
  return MERGEABLE_TYPES.has(artifact.type) && artifact.status === "accepted" && Boolean(artifact.proposedTargetPath);
}

export default {
  planMerge,
  mergeAcceptedArtifacts,
};
