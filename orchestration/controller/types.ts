export const AGENT_IDS = ["claude", "codex", "qwen"] as const;
export type AgentId = (typeof AGENT_IDS)[number];

export const PIPELINE_MODES = [
  "generate-article",
  "enhance-article",
  "audit-articles",
  "generate-examples",
  "generate-svgs",
  "build-debug-fix",
] as const;
export type PipelineMode = (typeof PIPELINE_MODES)[number];

export const TASK_STATUSES = [
  "pending",
  "ready",
  "claimed",
  "completed",
  "failed",
  "blocked",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const RUN_STATUSES = [
  "planned",
  "active",
  "blocked",
  "ready_to_merge",
  "merged",
  "failed",
] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];

export const ARTIFACT_TYPES = [
  "topic-resolution",
  "context-pack",
  "article-enumeration",
  "article-outline",
  "article-content",
  "gap-report",
  "tsx-candidate",
  "svg-plan",
  "svg-file",
  "audit-report",
  "evaluation",
  "run-summary",
  "text",
] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export type TaskExecution = "system" | "agent";
export type TaskScope = "run" | "article";
export type ArtifactStatus = "candidate" | "accepted" | "rejected";

export type RunRequest = {
  mode: PipelineMode;
  domain: string;
  category: string;
  subcategory: string;
  topic?: string;
  priority?: "low" | "normal" | "high";
  batchSize?: number;
  overwritePolicy?: "never" | "if-missing" | "always";
  approvalMode?: "manual" | "auto";
  agentOverrides?: Partial<Record<string, AgentId>>;
  disablePrimaryAgents?: AgentId[];
  runId?: string;
};

export type TopicResolution = {
  domainName: string;
  domainSlug: string;
  categoryName: string;
  categorySlug: string;
  subcategoryName: string;
  subcategorySlug: string;
  topicName: string | null;
  topicSlug: string | null;
  scope: "topic" | "subcategory";
  articlePath: string | null;
  existingArticlePath: string | null;
  referenceArticlePath: string;
  diagramsDir: string | null;
};

export type WorkItem = {
  id: string;
  scope: TaskScope;
  label: string;
  topicName: string | null;
  topicSlug: string | null;
  articlePath: string | null;
  existingArticlePath: string | null;
  diagramsDir: string | null;
};

export type PipelineNodeDefinition = {
  id: string;
  title: string;
  taskType: string;
  execution: TaskExecution;
  preferredAgents?: AgentId[];
  dependsOn?: string[];
  outputSchema?: string;
  artifactType?: ArtifactType;
  fanOut?: TaskScope;
  writeIntent?: "article" | "diagram" | "report";
};

export type PipelineDefinition = {
  id: string;
  mode: PipelineMode;
  description: string;
  tasks: PipelineNodeDefinition[];
};

export type TaskRouting = {
  policyMode: "pipeline-only" | "hybrid-fallback";
  pipelinePreferredAgents: AgentId[];
  primaryAgent: AgentId | null;
  fallbackAgents: AgentId[];
  eligibleAgents: AgentId[];
  overrideAgent: AgentId | null;
  resolvedAgent: AgentId | null;
  allowRunOverride: boolean;
};

export type TaskRoutingRule = {
  primaryAgent?: AgentId;
  fallbackAgents?: AgentId[];
  eligibleAgents?: AgentId[];
  allowRunOverride?: boolean;
};

export type AgentRoutingPolicy = {
  version: number;
  mode: "pipeline-only" | "hybrid-fallback";
  taskTypes: Record<string, TaskRoutingRule>;
};

export type RunRecord = {
  id: string;
  mode: PipelineMode;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  request: RunRequest;
  pipelineId: string;
  target: TopicResolution;
  workItems: WorkItem[];
  taskIds: string[];
  artifactIds: string[];
  notes: string[];
};

export type TaskRecord = {
  id: string;
  runId: string;
  pipelineTaskId: string;
  title: string;
  taskType: string;
  mode: PipelineMode;
  execution: TaskExecution;
  scope: TaskScope;
  workItemId: string | null;
  status: TaskStatus;
  dependsOn: string[];
  preferredAgents: AgentId[];
  routing: TaskRouting | null;
  assignedAgent: AgentId | null;
  outputSchema: string | null;
  artifactType: ArtifactType | null;
  inputArtifactIds: string[];
  outputArtifactIds: string[];
  writeIntents: string[];
  contextPackPath: string;
  promptPacketPath: string | null;
  claimedAt: string | null;
  completedAt: string | null;
  failureReason: string | null;
};

export type ArtifactRecord = {
  id: string;
  runId: string;
  taskId: string;
  type: ArtifactType;
  schema: string | null;
  version: number;
  createdAt: string;
  producer: string;
  contentType: "json" | "markdown" | "tsx" | "svg" | "text";
  status: ArtifactStatus;
  path: string;
  proposedTargetPath: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

export type LeaseRecord = {
  taskId: string;
  agentId: AgentId;
  acquiredAt: string;
  expiresAt: string;
};

export type EvaluationRecord = {
  id: string;
  runId: string;
  taskId: string;
  artifactId: string;
  createdAt: string;
  pass: boolean;
  score: number;
  reasons: string[];
  blockingIssues: string[];
  suggestedRepairTask: string | null;
};

export type AgentProfile = {
  id: AgentId;
  displayName: string;
  strengths: string[];
  preferredTaskTypes: string[];
  supportedTaskTypes: string[];
  maxContextHints: {
    maxFiles: number;
    maxCharsPerArtifact: number;
  };
  forbiddenDecisions: string[];
  outputFormats: string[];
};

export type ContextPack = {
  runId: string;
  taskId: string;
  mode: PipelineMode;
  target: TopicResolution;
  workItem: WorkItem | null;
  constraints: {
    requiredSections: string[];
    svgRange: {
      min: number;
      max: number;
    };
    interviewQuestionRange: {
      min: number;
      max: number;
    };
    noCodeInArticle: boolean;
  };
  paths: {
    hierarchyDataPath: string;
    referenceArticlePath: string;
    articlePath: string | null;
    diagramsDir: string | null;
  };
  dependencyArtifacts: Array<{
    id: string;
    type: ArtifactType;
    path: string;
  }>;
  acceptanceCriteria: string[];
};
