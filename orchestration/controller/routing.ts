import * as path from "path";

import type {
  AgentId,
  AgentProfile,
  AgentRoutingPolicy,
  RunRequest,
  TaskRouting,
} from "./types";
import { AGENT_IDS } from "./types";
import { ORCHESTRATION_ROOT, readJson } from "./utils";

const ROUTING_POLICY_PATH = path.join(
  ORCHESTRATION_ROOT,
  "routing",
  "agent-routing.json"
);

export function loadRoutingPolicy() {
  return readJson<AgentRoutingPolicy>(ROUTING_POLICY_PATH);
}

export function loadAgentProfiles() {
  const profiles = {} as Record<AgentId, AgentProfile>;

  for (const agentId of AGENT_IDS) {
    profiles[agentId] = readJson<AgentProfile>(
      path.join(ORCHESTRATION_ROOT, "agents", `${agentId}.profile.json`)
    );
  }

  return profiles;
}

export function resolveTaskRouting(input: {
  runRequest: RunRequest;
  taskType: string;
  pipelinePreferredAgents: AgentId[];
}) {
  const policy = loadRoutingPolicy();
  const profiles = loadAgentProfiles();
  const rule = policy.taskTypes[input.taskType];
  const pipelinePreferredAgents = uniqueAgents(input.pipelinePreferredAgents);
  const primaryAgent = rule?.primaryAgent ?? pipelinePreferredAgents[0] ?? null;
  const fallbackAgents = uniqueAgents(rule?.fallbackAgents ?? pipelinePreferredAgents.slice(1));
  const eligibleAgents = uniqueAgents(
    rule?.eligibleAgents ?? [primaryAgent, ...fallbackAgents].filter(isAgentId)
  );
  const allowRunOverride = rule?.allowRunOverride ?? true;
  const requestedOverride = input.runRequest.agentOverrides?.[input.taskType] ?? null;
  const overrideAgent =
    allowRunOverride && isAgentId(requestedOverride) ? requestedOverride : null;
  const disabledPrimaryAgents = new Set(input.runRequest.disablePrimaryAgents ?? []);
  const resolvedAgent = pickResolvedAgent({
    taskType: input.taskType,
    profiles,
    primaryAgent,
    fallbackAgents,
    overrideAgent,
    disabledPrimaryAgents,
  });

  return {
    policyMode: policy.mode,
    pipelinePreferredAgents,
    primaryAgent,
    fallbackAgents: fallbackAgents.filter((agentId) =>
      supportsTaskType(profiles, agentId, input.taskType)
    ),
    eligibleAgents: eligibleAgents.filter((agentId) =>
      supportsTaskType(profiles, agentId, input.taskType)
    ),
    overrideAgent,
    resolvedAgent,
    allowRunOverride,
  } satisfies TaskRouting;
}

function pickResolvedAgent(input: {
  taskType: string;
  profiles: Record<AgentId, AgentProfile>;
  primaryAgent: AgentId | null;
  fallbackAgents: AgentId[];
  overrideAgent: AgentId | null;
  disabledPrimaryAgents: Set<AgentId>;
}) {
  if (
    input.overrideAgent &&
    supportsTaskType(input.profiles, input.overrideAgent, input.taskType)
  ) {
    return input.overrideAgent;
  }

  if (
    input.primaryAgent &&
    !input.disabledPrimaryAgents.has(input.primaryAgent) &&
    supportsTaskType(input.profiles, input.primaryAgent, input.taskType)
  ) {
    return input.primaryAgent;
  }

  return (
    input.fallbackAgents.find(
      (agentId) =>
        !input.disabledPrimaryAgents.has(agentId) &&
        supportsTaskType(input.profiles, agentId, input.taskType)
    ) ?? null
  );
}

function supportsTaskType(
  profiles: Record<AgentId, AgentProfile>,
  agentId: AgentId,
  taskType: string
) {
  return profiles[agentId].supportedTaskTypes.includes(taskType);
}

function uniqueAgents(agentIds: AgentId[]) {
  return Array.from(new Set(agentIds.filter(isAgentId)));
}

function isAgentId(value: unknown): value is AgentId {
  return typeof value === "string" && AGENT_IDS.includes(value as AgentId);
}

export default {
  loadRoutingPolicy,
  loadAgentProfiles,
  resolveTaskRouting,
};
