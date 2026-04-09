import * as path from "path";

import { loadArtifact, loadRun, loadTask, loadTasks, persistTask } from "./artifact-store";
import { acquireLease } from "./lease-manager";
import { refreshRunState } from "./planner";
import type { AgentId, AgentProfile, TaskRecord } from "./types";
import { ORCHESTRATION_ROOT, STATE_ROOT, readJson, readText, truncate, writeJson, writeText } from "./utils";

export function claimNextTask(runId: string, agentId: AgentId) {
  refreshRunState(runId);

  const run = loadRun(runId);
  const tasks = loadTasks(runId);
  const profile = loadAgentProfile(agentId);
  const activeWriteIntents = new Set(
    tasks
      .filter((task) => task.status === "claimed")
      .flatMap((task) => task.writeIntents)
  );

  const task = tasks.find((entry) => isClaimableByAgent(entry, profile, activeWriteIntents));

  if (!task) {
    return null;
  }

  acquireLease(task, agentId);
  task.status = "claimed";
  task.assignedAgent = agentId;
  task.claimedAt = new Date().toISOString();
  persistTask(task);

  const promptPacket = renderPromptPacket(runId, task.id, agentId);
  return {
    task: loadTask(runId, task.id),
    promptPacketPath: promptPacket.markdownPath,
    promptJsonPath: promptPacket.jsonPath,
  };
}

export function listReadyTasks(runId: string, agentId?: AgentId) {
  refreshRunState(runId);

  const tasks = loadTasks(runId).filter((task) => task.status === "ready" && task.execution === "agent");
  if (!agentId) {
    return tasks;
  }

  const profile = loadAgentProfile(agentId);
  return tasks.filter((task) => isTaskCompatible(task, profile));
}

export function renderPromptPacket(runId: string, taskId: string, agentId: AgentId) {
  const run = loadRun(runId);
  const task = loadTask(runId, taskId);
  const profile = loadAgentProfile(agentId);
  const contextPack = readJson<unknown>(path.join(process.cwd(), task.contextPackPath));
  const dependencyArtifacts = task.inputArtifactIds.map((artifactId) => loadArtifact(runId, artifactId));

  const systemPrompt = readText(path.join(ORCHESTRATION_ROOT, "prompts", "system-base.md"));
  const projectRulesPrompt = readText(path.join(ORCHESTRATION_ROOT, "prompts", "project-rules.md"));
  const taskPrompt = readText(
    path.join(ORCHESTRATION_ROOT, "prompts", `task-${run.mode}.md`)
  );

  const artifactSnippets = dependencyArtifacts
    .map((artifact) => {
      const artifactFilePath = path.join(process.cwd(), artifact.path);
      const content = readText(artifactFilePath);
      return [
        `## Artifact: ${artifact.id}`,
        `- Type: ${artifact.type}`,
        `- Path: ${artifact.path}`,
        "",
        "```text",
        truncate(content, profile.maxContextHints.maxCharsPerArtifact),
        "```",
      ].join("\n");
    })
    .join("\n\n");

  const markdown = [
    `# Dispatch Packet`,
    "",
    `- Run ID: ${run.id}`,
    `- Task ID: ${task.id}`,
    `- Agent: ${profile.displayName}`,
    `- Task Type: ${task.taskType}`,
    `- Mode: ${run.mode}`,
    "",
    systemPrompt.trim(),
    "",
    projectRulesPrompt.trim(),
    "",
    taskPrompt.trim(),
    "",
    "## Agent Capability Profile",
    "",
    "```json",
    JSON.stringify(profile, null, 2),
    "```",
    "",
    "## Task Envelope",
    "",
    "```json",
    JSON.stringify(task, null, 2),
    "```",
    "",
    "## Context Pack",
    "",
    "```json",
    JSON.stringify(contextPack, null, 2),
    "```",
    artifactSnippets ? `\n${artifactSnippets}` : "",
    "",
    "## Output Contract",
    "",
    `Write output that matches: ${task.outputSchema ?? "task-local expectations in the context pack"}`,
    "",
    "Return only the artifact requested by this task. Do not change unrelated files.",
  ].join("\n");

  const promptDir = path.join(STATE_ROOT, "runs", run.id, "prompts");
  const markdownPath = path.join(promptDir, `${task.id}-${agentId}.md`);
  const jsonPath = path.join(promptDir, `${task.id}-${agentId}.json`);

  writeText(markdownPath, `${markdown}\n`);
  writeJson(jsonPath, {
    runId: run.id,
    taskId: task.id,
    agentId,
    profile,
    task,
    contextPack,
    dependencyArtifacts,
  });

  task.promptPacketPath = path.relative(process.cwd(), markdownPath);
  persistTask(task);

  return {
    markdownPath: path.relative(process.cwd(), markdownPath),
    jsonPath: path.relative(process.cwd(), jsonPath),
  };
}

function loadAgentProfile(agentId: AgentId) {
  return readJson<AgentProfile>(path.join(ORCHESTRATION_ROOT, "agents", `${agentId}.profile.json`));
}

function isClaimableByAgent(task: TaskRecord, profile: AgentProfile, activeWriteIntents: Set<string>) {
  if (task.status !== "ready" || task.execution !== "agent") {
    return false;
  }

  if (!isTaskCompatible(task, profile)) {
    return false;
  }

  return !task.writeIntents.some((intent) => activeWriteIntents.has(intent));
}

function isTaskCompatible(task: TaskRecord, profile: AgentProfile) {
  if (task.routing?.resolvedAgent) {
    return (
      profile.id === task.routing.resolvedAgent &&
      profile.supportedTaskTypes.includes(task.taskType)
    );
  }

  if (task.preferredAgents.length > 0 && !task.preferredAgents.includes(profile.id)) {
    return false;
  }

  return profile.supportedTaskTypes.includes(task.taskType);
}

export default {
  claimNextTask,
  listReadyTasks,
  renderPromptPacket,
};
