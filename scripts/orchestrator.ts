#!/usr/bin/env node

import * as path from "path";

import artifactStore from "../orchestration/controller/artifact-store";
import dispatcher from "../orchestration/controller/dispatcher";
import evaluator from "../orchestration/controller/evaluator";
import mergeManager from "../orchestration/controller/merge-manager";
import planner from "../orchestration/controller/planner";
import recovery from "../orchestration/controller/recovery";
import { releaseLease } from "../orchestration/controller/lease-manager";
import { AGENT_IDS, PIPELINE_MODES, type AgentId, type ArtifactType, type RunRequest } from "../orchestration/controller/types";
import { nowIso, readJson } from "../orchestration/controller/utils";

type ArtifactManifest = {
  artifacts: Array<{
    path: string;
    type?: ArtifactType;
    contentType?: "json" | "markdown" | "tsx" | "svg" | "text";
    schema?: string | null;
    proposedTargetPath?: string | null;
  }>;
};

async function main() {
  const [command, ...rawArgs] = process.argv.slice(2);
  const args = parseArgs(rawArgs);

  switch (command) {
    case "plan":
      print(
        createRun({
          mode: parseMode(requireValue(args, "mode")),
          domain: requireValue(args, "domain"),
          category: requireValue(args, "category"),
          subcategory: requireValue(args, "subcategory"),
          topic: args.topic,
          priority: args.priority as RunRequest["priority"],
          batchSize: numberValue(args.batchSize),
          overwritePolicy: args.overwritePolicy as RunRequest["overwritePolicy"],
          approvalMode: args.approvalMode as RunRequest["approvalMode"],
          agentOverrides: parseAgentOverrides(args.agentOverrides),
          disablePrimaryAgents: parseAgentList(args.disablePrimaryAgents),
          runId: args.runId,
        })
      );
      return;
    case "status": {
      const runId = requireValue(args, "runId");
      const snapshot = planner.refreshRunState(runId);
      const tasks = snapshot.tasks;
      print({
        run: snapshot.run,
        summary: summarizeTasks(tasks),
        tasks,
      });
      return;
    }
    case "ready":
      print(dispatcher.listReadyTasks(requireValue(args, "runId"), args.agent as never));
      return;
    case "claim":
      print(dispatcher.claimNextTask(requireValue(args, "runId"), requireValue(args, "agent") as never));
      return;
    case "render-prompt":
      print(
        dispatcher.renderPromptPacket(
          requireValue(args, "runId"),
          requireValue(args, "taskId"),
          requireValue(args, "agent") as never
        )
      );
      return;
    case "complete":
      print(completeTask(args));
      return;
    case "evaluate":
      print(evaluator.evaluateTaskOutputs(requireValue(args, "runId"), requireValue(args, "taskId")));
      return;
    case "merge-plan":
      print(mergeManager.planMerge(requireValue(args, "runId")));
      return;
    case "merge":
      print(mergeManager.mergeAcceptedArtifacts(requireValue(args, "runId")));
      return;
    case "recover":
      print(recovery.recoverRun(requireValue(args, "runId"), args.forceReleaseClaims === "true"));
      return;
    case "fail":
      print(recovery.failTask(requireValue(args, "runId"), requireValue(args, "taskId"), requireValue(args, "reason")));
      return;
    case "help":
    case undefined:
      printHelp();
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

function createRun(request: RunRequest) {
  return planner.createRun(request);
}

function completeTask(args: Record<string, string>) {
  const runId = requireValue(args, "runId");
  const taskId = requireValue(args, "taskId");
  const producer = args.producer ?? "manual";
  const task = artifactStore.loadTask(runId, taskId);
  const run = artifactStore.loadRun(runId);

  const manifest = args.artifactManifest
    ? readJson<ArtifactManifest>(path.resolve(process.cwd(), args.artifactManifest))
    : {
        artifacts: [
          {
            path: requireValue(args, "artifact"),
            type: (args.artifactType as ArtifactType | undefined) ?? task.artifactType ?? undefined,
            contentType: (args.contentType as ArtifactManifest["artifacts"][number]["contentType"] | undefined) ?? inferContentType(requireValue(args, "artifact")),
            schema: args.schema ?? task.outputSchema,
            proposedTargetPath: args.targetPath ?? task.writeIntents[0] ?? null,
          },
        ],
      };

  const createdArtifacts = manifest.artifacts.map((entry) =>
    artifactStore.registerArtifact({
      run,
      task,
      type: entry.type ?? task.artifactType ?? "text",
      sourcePath: path.resolve(process.cwd(), entry.path),
      contentType: entry.contentType ?? inferContentType(entry.path),
      schema: entry.schema ?? task.outputSchema,
      producer,
      proposedTargetPath: entry.proposedTargetPath ?? null,
    })
  );

  const finalizedTask = artifactStore.loadTask(runId, taskId);
  releaseLease(runId, taskId);
  finalizedTask.outputArtifactIds = Array.from(
    new Set([...finalizedTask.outputArtifactIds, ...createdArtifacts.map((artifact) => artifact.id)])
  );
  finalizedTask.status = "completed";
  finalizedTask.assignedAgent = null;
  finalizedTask.claimedAt = null;
  finalizedTask.completedAt = nowIso();
  finalizedTask.failureReason = null;
  artifactStore.persistTask(finalizedTask);

  const refreshed = planner.refreshRunState(runId);

  return {
    createdArtifacts,
    run: refreshed.run,
    summary: summarizeTasks(refreshed.tasks),
  };
}

function summarizeTasks(tasks: ReturnType<typeof artifactStore.loadTasks>) {
  return tasks.reduce<Record<string, number>>((summary, task) => {
    summary[task.status] = (summary[task.status] ?? 0) + 1;
    return summary;
  }, {});
}

function parseArgs(rawArgs: string[]) {
  const args: Record<string, string> = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const token = rawArgs[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    const value = rawArgs[index + 1];

    if (!value || value.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function requireValue(args: Record<string, string>, key: string) {
  const value = args[key];
  if (!value) {
    throw new Error(`Missing required argument --${toKebabCase(key)}`);
  }

  return value;
}

function numberValue(value?: string) {
  if (!value) {
    return undefined;
  }
  return Number.parseInt(value, 10);
}

function inferContentType(filePath: string): "json" | "markdown" | "tsx" | "svg" | "text" {
  if (filePath.endsWith(".json")) {
    return "json";
  }
  if (filePath.endsWith(".md") || filePath.endsWith(".markdown")) {
    return "markdown";
  }
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    return "tsx";
  }
  if (filePath.endsWith(".svg")) {
    return "svg";
  }
  return "text";
}

function parseMode(value: string): RunRequest["mode"] {
  if (!PIPELINE_MODES.includes(value as RunRequest["mode"])) {
    throw new Error(`Unsupported mode: ${value}`);
  }

  return value as RunRequest["mode"];
}

function parseAgentOverrides(value?: string) {
  if (!value) {
    return undefined;
  }

  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (entries.length === 0) {
    return undefined;
  }

  const overrides: Partial<Record<string, AgentId>> = {};

  for (const entry of entries) {
    const [taskType, agentId] = entry.split("=", 2).map((part) => part.trim());

    if (!taskType || !agentId) {
      throw new Error(
        `Invalid agent override '${entry}'. Use task-type=agent-id,task-type=agent-id`
      );
    }

    if (!AGENT_IDS.includes(agentId as AgentId)) {
      throw new Error(`Unsupported agent in override '${entry}': ${agentId}`);
    }

    overrides[taskType] = agentId as AgentId;
  }

  return overrides;
}

function parseAgentList(value?: string) {
  if (!value) {
    return undefined;
  }

  const agents = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (agents.length === 0) {
    return undefined;
  }

  for (const agentId of agents) {
    if (!AGENT_IDS.includes(agentId as AgentId)) {
      throw new Error(`Unsupported agent in list: ${agentId}`);
    }
  }

  return agents as AgentId[];
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function print(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}

function printHelp() {
  console.log(`Usage:
  pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)"
  pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)" --agent-overrides outline-draft=qwen,article-draft=qwen
  pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)" --disable-primary-agents claude
  pnpm orchestrator:status -- --run-id <run-id>
  pnpm orchestrator:ready -- --run-id <run-id> [--agent claude]
  pnpm orchestrator:claim -- --run-id <run-id> --agent claude
  pnpm orchestrator:render-prompt -- --run-id <run-id> --task-id <task-id> --agent claude
  pnpm orchestrator:complete -- --run-id <run-id> --task-id <task-id> --artifact ./candidate.tsx --artifact-type tsx-candidate --target-path content/articles/...
  pnpm orchestrator:evaluate -- --run-id <run-id> --task-id <task-id>
  pnpm orchestrator:merge-plan -- --run-id <run-id>
  pnpm orchestrator:merge -- --run-id <run-id>
  pnpm orchestrator:recover -- --run-id <run-id> [--force-release-claims true]
  pnpm orchestrator:fail -- --run-id <run-id> --task-id <task-id> --reason "parse error"
`);
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.stack ?? error.message);
  } else {
    console.error(String(error));
  }
  process.exitCode = 1;
});
