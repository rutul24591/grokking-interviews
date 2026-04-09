import * as fs from "fs";
import * as path from "path";

import { parseHierarchy } from "../../lib/parseHierarchy";
import {
  loadArtifact,
  loadRun,
  loadTasks,
  persistRun,
  persistTask,
  registerInlineArtifact,
} from "./artifact-store";
import { expireLeaseIfNeeded, releaseLease } from "./lease-manager";
import { resolveTaskRouting } from "./routing";
import type {
  ArtifactRecord,
  ContextPack,
  PipelineDefinition,
  PipelineMode,
  PipelineNodeDefinition,
  RunRecord,
  RunRequest,
  TaskRecord,
  TopicResolution,
  WorkItem,
} from "./types";
import {
  ORCHESTRATION_ROOT,
  REPO_ROOT,
  STATE_ROOT,
  ensureDir,
  fileExists,
  nowIso,
  randomId,
  readJson,
  readText,
  relativeToRepo,
  slugify,
  truncate,
  writeJson,
} from "./utils";

export const REQUIRED_SECTIONS = [
  "Definition & Context",
  "Core Concepts",
  "Architecture & Flow",
  "Trade offs & Comparison",
  "Best practices",
  "Common Pitfalls",
  "Real-world use cases",
  "Common interview question with detailed answer",
  "References",
];

const TASK_ACCEPTANCE: Record<string, string[]> = {
  "outline-draft": [
    "Return a structured outline that preserves the required section order.",
    "Cover production-scale trade-offs, not generic notes.",
    "Do not include code examples in article content.",
  ],
  "outline-review": [
    "Identify gaps against the locked section order and quality bar.",
    "Call out missing SVG opportunities, missing references, and shallow areas.",
  ],
  "svg-plan": [
    "Produce exactly 3-5 diagrams.",
    "Each SVG must map to architecture, scaling, failover, consistency, or performance trade-offs.",
    "Avoid CSS variables and malformed XML.",
  ],
  "article-draft": [
    "Write deep, interview-focused content for a staff/principal engineer audience.",
    "Keep interview Q&A second last and references last.",
    "Exclude code examples and preformatted code blocks.",
  ],
  "tsx-assembly": [
    "Produce a repo-ready TSX component named ArticlePage or the established article export shape.",
    "Use <section> blocks and <ArticleImage /> references.",
    "Keep paths and metadata aligned with repo conventions.",
  ],
  "audit-draft": [
    "Return rating, issues, and suggestions for the assigned article.",
    "Evaluate depth, repetition, references, SVGs, Q&A, placeholders, and structure order.",
  ],
  "audit-review": [
    "Tighten the audit into a repo-usable report without losing concrete findings.",
  ],
  "build-validation": [
    "Validate parse/build correctness and list only blocking errors.",
  ],
};

export function createRun(request: RunRequest) {
  const resolution = resolveTopicResolution(request);
  const workItems = buildWorkItems(request.mode, resolution);
  const pipeline = loadPipelineDefinition(request.mode);
  const runId = request.runId ?? randomId("run");
  const createdAt = nowIso();
  const runDir = path.join(STATE_ROOT, "runs", runId);

  ensureDir(runDir);
  ensureDir(path.join(runDir, "tasks"));
  ensureDir(path.join(runDir, "artifacts"));
  ensureDir(path.join(runDir, "context"));
  ensureDir(path.join(runDir, "prompts"));
  ensureDir(path.join(runDir, "leases"));
  ensureDir(path.join(runDir, "evaluations"));
  ensureDir(path.join(runDir, "logs"));

  const run: RunRecord = {
    id: runId,
    mode: request.mode,
    status: "planned",
    createdAt,
    updatedAt: createdAt,
    request: {
      priority: "normal",
      batchSize: 1,
      overwritePolicy: request.mode === "generate-article" ? "if-missing" : "never",
      approvalMode: "manual",
      ...request,
    },
    pipelineId: pipeline.id,
    target: resolution,
    workItems,
    taskIds: [],
    artifactIds: [],
    notes: [],
  };

  persistRun(run);
  writeJson(path.join(runDir, "context", "global-pack.json"), buildGlobalPack(run));

  const tasks = instantiatePipeline(run, pipeline);
  for (const task of tasks) {
    run.taskIds.push(task.id);
    persistTask(task);
  }
  persistRun(run);

  refreshRunState(run.id);
  return loadRun(run.id);
}

export function refreshRunState(runId: string) {
  const run = loadRun(runId);
  let tasks = loadTasks(runId);

  for (const task of tasks) {
    if (task.status === "claimed" && expireLeaseIfNeeded(task)) {
      task.status = "ready";
      task.assignedAgent = null;
      task.claimedAt = null;
      persistTask(task);
    }
  }

  tasks = loadTasks(runId);
  recomputeTaskStates(run, tasks);
  hydrateContextPacks(run, tasks);
  runAvailableSystemTasks(run.id);

  const refreshedRun = loadRun(runId);
  const refreshedTasks = loadTasks(runId);
  refreshedRun.status = deriveRunStatus(refreshedTasks);
  refreshedRun.updatedAt = nowIso();
  persistRun(refreshedRun);

  return {
    run: loadRun(runId),
    tasks: refreshedTasks,
  };
}

export function loadPipelineDefinition(mode: PipelineMode) {
  const pipelinePath = path.join(ORCHESTRATION_ROOT, "pipelines", `${mode}.pipeline.json`);
  return readJson<PipelineDefinition>(pipelinePath);
}

function instantiatePipeline(run: RunRecord, pipeline: PipelineDefinition) {
  const taskInstances: Array<{
    definition: PipelineNodeDefinition;
    task: TaskRecord;
  }> = [];
  const instanceMap = new Map<string, TaskRecord[]>();

  for (const definition of pipeline.tasks) {
    const scope = definition.fanOut ?? "run";
    const items = scope === "article" ? run.workItems : [null];

    for (const workItem of items) {
      const task: TaskRecord = {
        id: randomId(definition.id),
        runId: run.id,
        pipelineTaskId: definition.id,
        title: workItem ? `${definition.title} · ${workItem.label}` : definition.title,
        taskType: definition.taskType,
        mode: run.mode,
        execution: definition.execution,
        scope,
        workItemId: workItem?.id ?? null,
        status: "pending",
        dependsOn: [],
        preferredAgents: definition.preferredAgents ?? [],
        routing:
          definition.execution === "agent"
            ? resolveTaskRouting({
                runRequest: run.request,
                taskType: definition.taskType,
                pipelinePreferredAgents: definition.preferredAgents ?? [],
              })
            : null,
        assignedAgent: null,
        outputSchema: definition.outputSchema ?? null,
        artifactType: definition.artifactType ?? null,
        inputArtifactIds: [],
        outputArtifactIds: [],
        writeIntents: buildWriteIntents(run, definition, workItem),
        contextPackPath: "",
        promptPacketPath: null,
        claimedAt: null,
        completedAt: null,
        failureReason: null,
      };

      const key = getInstanceKey(definition.id, workItem?.id ?? "run");
      const entries = instanceMap.get(key) ?? [];
      entries.push(task);
      instanceMap.set(key, entries);
      taskInstances.push({ definition, task });
    }
  }

  for (const entry of taskInstances) {
    const dependencies = entry.definition.dependsOn ?? [];
    const resolvedDependencyIds: string[] = [];

    for (const dependencyId of dependencies) {
      const dependencyDefinition = pipeline.tasks.find((task) => task.id === dependencyId);

      if (!dependencyDefinition) {
        throw new Error(`Pipeline dependency not found: ${dependencyId}`);
      }

      const dependencyScope = dependencyDefinition.fanOut ?? "run";

      if (entry.task.scope === "article" && dependencyScope === "article") {
        const instance = instanceMap.get(getInstanceKey(dependencyId, entry.task.workItemId ?? "run"))?.[0];
        if (instance) {
          resolvedDependencyIds.push(instance.id);
        }
        continue;
      }

      if (entry.task.scope === "run" && dependencyScope === "article") {
        for (const workItem of run.workItems) {
          const instances = instanceMap.get(getInstanceKey(dependencyId, workItem.id)) ?? [];
          resolvedDependencyIds.push(...instances.map((task) => task.id));
        }
        continue;
      }

      const instance = instanceMap.get(getInstanceKey(dependencyId, "run"))?.[0];
      if (instance) {
        resolvedDependencyIds.push(instance.id);
      }
    }

    entry.task.dependsOn = resolvedDependencyIds;
  }

  return taskInstances.map((entry) => entry.task);
}

function getInstanceKey(definitionId: string, scopeKey: string) {
  return `${definitionId}:${scopeKey}`;
}

function resolveTopicResolution(request: RunRequest): TopicResolution {
  const hierarchyPath = path.join(REPO_ROOT, "concepts", "hierarchy-data.txt");
  const hierarchy = parseHierarchy(readText(hierarchyPath));
  const domainSlug = slugify(request.domain);
  const categorySlug = slugify(request.category);
  const subcategorySlug = slugify(request.subcategory);
  const topicSlug = request.topic ? slugify(request.topic) : null;

  const domain = hierarchy.find(
    (item) => item.slug === domainSlug || slugify(item.name) === domainSlug
  );
  if (!domain) {
    throw new Error(`Domain not found in hierarchy-data.txt: ${request.domain}`);
  }

  const category = domain.categories.find(
    (item) => item.slug === categorySlug || slugify(item.name) === categorySlug
  );
  if (!category) {
    throw new Error(`Category not found under domain ${domain.name}: ${request.category}`);
  }

  const subcategory = category.subcategories.find(
    (item) => item.slug === subcategorySlug || slugify(item.name) === subcategorySlug
  );
  if (!subcategory) {
    throw new Error(`Sub-category not found under category ${category.name}: ${request.subcategory}`);
  }

  if ((request.mode === "generate-article" || request.mode === "enhance-article") && !topicSlug) {
    throw new Error(`Mode ${request.mode} requires a topic`);
  }

  const topic = topicSlug
    ? subcategory.topics.find((item) => item.slug === topicSlug || slugify(item.name) === topicSlug)
    : null;

  if (topicSlug && !topic) {
    throw new Error(`Topic not found under sub-category ${subcategory.name}: ${request.topic}`);
  }

  const articleDirectory = getArticlesSubcategoryDir(domain.slug, category.slug, subcategory.slug);
  const articlePath = topic ? path.join(articleDirectory, `${topic.slug}.tsx`) : null;
  const diagramsDir = topic
    ? path.join(REPO_ROOT, "public", "diagrams", domain.slug, mapCategoryDirectory(category.slug), subcategory.slug)
    : null;

  return {
    domainName: domain.name,
    domainSlug: domain.slug,
    categoryName: category.name,
    categorySlug: category.slug,
    subcategoryName: subcategory.name,
    subcategorySlug: subcategory.slug,
    topicName: topic?.name ?? null,
    topicSlug: topic?.slug ?? null,
    scope: topic ? "topic" : "subcategory",
    articlePath: articlePath ? relativeToRepo(articlePath) : null,
    existingArticlePath: articlePath && fileExists(articlePath) ? relativeToRepo(articlePath) : null,
    referenceArticlePath: relativeToRepo(
      path.join(
        REPO_ROOT,
        "content",
        "articles",
        "system-design",
        "frontend",
        "scalability-architecture-patterns",
        "component-libraries-and-design-systems.tsx"
      )
    ),
    diagramsDir: diagramsDir ? relativeToRepo(diagramsDir) : null,
  };
}

function buildWorkItems(mode: PipelineMode, resolution: TopicResolution): WorkItem[] {
  if (mode !== "audit-articles") {
    return [
      {
        id: resolution.topicSlug ?? "topic",
        scope: "article",
        label: resolution.topicName ?? resolution.subcategoryName,
        topicName: resolution.topicName,
        topicSlug: resolution.topicSlug,
        articlePath: resolution.articlePath,
        existingArticlePath: resolution.existingArticlePath,
        diagramsDir: resolution.diagramsDir,
      },
    ];
  }

  const articleDirectory = getArticlesSubcategoryDir(
    resolution.domainSlug,
    resolution.categorySlug,
    resolution.subcategorySlug
  );
  const articleFiles = fs.existsSync(articleDirectory)
    ? fs
        .readdirSync(articleDirectory)
        .filter((entry) => entry.endsWith(".tsx"))
        .sort()
    : [];

  if (articleFiles.length === 0) {
    throw new Error(`No article files found under ${relativeToRepo(articleDirectory)} for audit`);
  }

  return articleFiles.map((fileName) => {
    const topicSlug = fileName.replace(/\.tsx$/, "");
    return {
      id: topicSlug,
      scope: "article",
      label: deslugify(topicSlug),
      topicName: deslugify(topicSlug),
      topicSlug,
      articlePath: relativeToRepo(path.join(articleDirectory, fileName)),
      existingArticlePath: relativeToRepo(path.join(articleDirectory, fileName)),
      diagramsDir: relativeToRepo(
        path.join(REPO_ROOT, "public", "diagrams", resolution.domainSlug, mapCategoryDirectory(resolution.categorySlug), resolution.subcategorySlug)
      ),
    };
  });
}

function recomputeTaskStates(run: RunRecord, tasks: TaskRecord[]) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));

  for (const task of tasks) {
    if (task.status === "completed" || task.status === "failed") {
      continue;
    }

    if (task.status === "claimed") {
      continue;
    }

    const dependenciesMet = task.dependsOn.every((dependencyId) => {
      const dependency = taskMap.get(dependencyId);
      return dependency?.status === "completed";
    });

    task.inputArtifactIds = task.dependsOn.flatMap((dependencyId) => taskMap.get(dependencyId)?.outputArtifactIds ?? []);
    if (dependenciesMet && task.execution === "agent" && task.routing?.resolvedAgent === null) {
      task.status = "blocked";
      task.failureReason = "No agent could be resolved from the routing policy for this task.";
      persistTask(task);
      continue;
    }

    task.status = dependenciesMet ? "ready" : "pending";
    task.failureReason = null;
    persistTask(task);
  }

  run.updatedAt = nowIso();
  persistRun(run);
}

function hydrateContextPacks(run: RunRecord, tasks: TaskRecord[]) {
  const artifacts = run.artifactIds.map((artifactId) => loadArtifact(run.id, artifactId));
  const artifactMap = new Map(artifacts.map((artifact) => [artifact.id, artifact]));
  const contextDir = path.join(STATE_ROOT, "runs", run.id, "context");

  for (const task of tasks) {
    const workItem = run.workItems.find((item) => item.id === task.workItemId) ?? null;
    const dependencyArtifacts = task.inputArtifactIds
      .map((artifactId) => artifactMap.get(artifactId))
      .filter((artifact): artifact is ArtifactRecord => Boolean(artifact))
      .map((artifact) => ({
        id: artifact.id,
        type: artifact.type,
        path: artifact.path,
      }));

    const contextPack: ContextPack = {
      runId: run.id,
      taskId: task.id,
      mode: run.mode,
      target: run.target,
      workItem,
      constraints: {
        requiredSections: REQUIRED_SECTIONS,
        svgRange: { min: 3, max: 5 },
        interviewQuestionRange: { min: 4, max: 6 },
        noCodeInArticle: true,
      },
      paths: {
        hierarchyDataPath: "concepts/hierarchy-data.txt",
        referenceArticlePath: run.target.referenceArticlePath,
        articlePath: workItem?.articlePath ?? run.target.articlePath,
        diagramsDir: workItem?.diagramsDir ?? run.target.diagramsDir,
      },
      dependencyArtifacts,
      acceptanceCriteria: buildAcceptanceCriteria(task),
    };

    const contextPackPath = path.join(contextDir, `${task.id}.json`);
    writeJson(contextPackPath, contextPack);
    task.contextPackPath = relativeToRepo(contextPackPath);
    persistTask(task);
  }
}

function buildAcceptanceCriteria(task: TaskRecord) {
  const baseCriteria = [
    "Use only serialized artifacts as context, not prior chat memory.",
    "Do not invent topics outside concepts/hierarchy-data.txt.",
  ];

  return [...baseCriteria, ...(TASK_ACCEPTANCE[task.taskType] ?? [])];
}

function runAvailableSystemTasks(runId: string) {
  let madeProgress = true;

  while (madeProgress) {
    madeProgress = false;

    const run = loadRun(runId);
    const tasks = loadTasks(runId);
    const readySystemTask = tasks.find((task) => task.execution === "system" && task.status === "ready");

    if (!readySystemTask) {
      continue;
    }

    executeSystemTask(run, readySystemTask);
    madeProgress = true;

    const refreshedRun = loadRun(runId);
    const refreshedTasks = loadTasks(runId);
    recomputeTaskStates(refreshedRun, refreshedTasks);
    hydrateContextPacks(refreshedRun, refreshedTasks);
  }
}

function executeSystemTask(run: RunRecord, task: TaskRecord) {
  switch (task.taskType) {
    case "topic-normalize":
      registerInlineArtifact({
        run,
        task,
        type: "topic-resolution",
        content: `${JSON.stringify(run.target, null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "job.schema.json",
        producer: "controller",
      });
      break;
    case "context-pack":
      registerInlineArtifact({
        run,
        task,
        type: "context-pack",
        content: `${JSON.stringify(buildGlobalPack(run), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "task.schema.json",
        producer: "controller",
      });
      break;
    case "existing-article-parse":
      registerInlineArtifact({
        run,
        task,
        type: "gap-report",
        content: `${JSON.stringify(parseExistingArticle(run, task), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "evaluation.schema.json",
        producer: "controller",
      });
      break;
    case "gap-analysis":
      registerInlineArtifact({
        run,
        task,
        type: "gap-report",
        content: `${JSON.stringify(buildGapReport(run, task), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "evaluation.schema.json",
        producer: "controller",
      });
      break;
    case "article-enumeration":
      registerInlineArtifact({
        run,
        task,
        type: "article-enumeration",
        content: `${JSON.stringify(run.workItems, null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "task.schema.json",
        producer: "controller",
      });
      break;
    case "article-structure-scan":
      registerInlineArtifact({
        run,
        task,
        type: "gap-report",
        content: `${JSON.stringify(scanArticleForAudit(run, task), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        schema: "evaluation.schema.json",
        producer: "controller",
      });
      break;
    case "final-audit-report":
      registerInlineArtifact({
        run,
        task,
        type: "run-summary",
        content: `${JSON.stringify(buildAuditSummary(run), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        producer: "controller",
      });
      break;
    case "merge-decision":
      registerInlineArtifact({
        run,
        task,
        type: "run-summary",
        content: `${JSON.stringify(buildMergeSummary(run), null, 2)}\n`,
        extension: "json",
        contentType: "json",
        producer: "controller",
      });
      break;
    default:
      throw new Error(`Unsupported system task type: ${task.taskType}`);
  }

  task.status = "completed";
  task.completedAt = nowIso();
  task.assignedAgent = null;
  persistTask(task);
  releaseLease(task.runId, task.id);
}

function buildGlobalPack(run: RunRecord) {
  return {
    project: "system-design-prep",
    referenceArticlePath: run.target.referenceArticlePath,
    hierarchyDataPath: "concepts/hierarchy-data.txt",
    requiredSections: REQUIRED_SECTIONS,
    svgRules: {
      min: 3,
      max: 5,
      categories: [
        "Architecture",
        "Scaling strategies",
        "Failover / availability architecture",
        "Consistency models",
        "Performance trade-offs",
      ],
      constraints: [
        "Support both dark mode and light mode.",
        "Avoid CSS variables inside SVG markup.",
        "Escape XML entities.",
      ],
    },
    articleRules: {
      minInterviewQuestions: 4,
      maxInterviewQuestions: 6,
      noCodeExamples: true,
      targetWordCount: "6000 +/- 500",
    },
  };
}

function parseExistingArticle(run: RunRecord, task: TaskRecord) {
  const articlePath = resolveTaskArticlePath(run, task);

  if (!articlePath || !fileExists(articlePath)) {
    return {
      exists: false,
      articlePath: articlePath ? relativeToRepo(articlePath) : null,
      notes: ["No existing article found to parse."],
    };
  }

  return {
    exists: true,
    articlePath: relativeToRepo(articlePath),
    ...scanArticleContent(readText(articlePath)),
  };
}

function buildGapReport(run: RunRecord, task: TaskRecord) {
  const articlePath = resolveTaskArticlePath(run, task);

  if (!articlePath || !fileExists(articlePath)) {
    return {
      articlePath: articlePath ? relativeToRepo(articlePath) : null,
      gaps: ["Article file does not exist. Full generation required."],
    };
  }

  const scan = scanArticleContent(readText(articlePath));
  const gaps: string[] = [];

  if (scan.missingSections.length > 0) {
    gaps.push(`Missing required sections: ${scan.missingSections.join(", ")}`);
  }
  if (!scan.sectionOrderValid) {
    gaps.push("Section order does not match the required structure.");
  }
  if (scan.imageCount < 3) {
    gaps.push(`Only ${scan.imageCount} <ArticleImage /> entries detected.`);
  }
  if (!scan.hasReferences) {
    gaps.push("References section is missing or empty.");
  }
  if (scan.hasCodeBlock) {
    gaps.push("Article contains code or implementation-example content that should be removed.");
  }
  if (scan.estimatedWordCount < 5500) {
    gaps.push(`Estimated word count ${scan.estimatedWordCount} is below the target range.`);
  }

  return {
    articlePath: relativeToRepo(articlePath),
    scan,
    gaps,
  };
}

function scanArticleForAudit(run: RunRecord, task: TaskRecord) {
  const articlePath = resolveTaskArticlePath(run, task);

  if (!articlePath || !fileExists(articlePath)) {
    return {
      articlePath: articlePath ? relativeToRepo(articlePath) : null,
      auditReady: false,
      issues: ["Article file is missing."],
    };
  }

  const scan = scanArticleContent(readText(articlePath));
  return {
    articlePath: relativeToRepo(articlePath),
    auditReady: true,
    ...scan,
  };
}

function buildAuditSummary(run: RunRecord) {
  const tasks = loadTasks(run.id).filter((task) => task.pipelineTaskId === "audit-review");
  return {
    runId: run.id,
    reviewedArticles: tasks.length,
    completedReviews: tasks.filter((task) => task.status === "completed").length,
    reviewArtifacts: tasks.flatMap((task) => task.outputArtifactIds),
  };
}

function buildMergeSummary(run: RunRecord) {
  const tasks = loadTasks(run.id);
  return {
    runId: run.id,
    readyForMerge: tasks.every((task) => task.status === "completed" || task.pipelineTaskId === "merge-decision"),
    completedTasks: tasks.filter((task) => task.status === "completed").length,
    totalTasks: tasks.length,
  };
}

export function scanArticleContent(content: string) {
  const headingIndexes = REQUIRED_SECTIONS.map((section) => content.indexOf(section));
  const missingSections = REQUIRED_SECTIONS.filter((_, index) => headingIndexes[index] === -1);
  const presentIndexes = headingIndexes.filter((index) => index >= 0);
  const sectionOrderValid = presentIndexes.every((index, currentIndex) => {
    const previous = presentIndexes[currentIndex - 1];
    return previous === undefined || previous <= index;
  });
  const imageCount = (content.match(/<ArticleImage\b/g) ?? []).length;
  const hasReferences = content.includes("References");
  const hasCodeBlock =
    content.includes("<pre") ||
    /Implementation Example/i.test(content) ||
    /Example code/i.test(content);
  const interviewQuestionCount = (content.match(/Question\s+\d+|<h3>/g) ?? []).length;
  const textOnly = content
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}()[\];,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const estimatedWordCount = textOnly ? textOnly.split(" ").length : 0;

  return {
    missingSections,
    sectionOrderValid,
    imageCount,
    hasReferences,
    hasCodeBlock,
    interviewQuestionCount,
    estimatedWordCount,
    preview: truncate(textOnly, 600),
  };
}

function resolveTaskArticlePath(run: RunRecord, task: TaskRecord) {
  const workItem = run.workItems.find((item) => item.id === task.workItemId) ?? run.workItems[0];
  const relativeArticlePath = workItem?.existingArticlePath ?? workItem?.articlePath ?? run.target.existingArticlePath ?? run.target.articlePath;

  return relativeArticlePath ? path.join(REPO_ROOT, relativeArticlePath) : null;
}

function deriveRunStatus(tasks: TaskRecord[]) {
  if (tasks.some((task) => task.status === "failed")) {
    return "failed";
  }

  if (tasks.every((task) => task.status === "completed")) {
    return "ready_to_merge";
  }

  if (tasks.some((task) => task.status === "ready" || task.status === "claimed")) {
    return "active";
  }

  if (tasks.some((task) => task.status === "blocked")) {
    return "blocked";
  }

  return "planned";
}

function buildWriteIntents(run: RunRecord, definition: PipelineNodeDefinition, workItem: WorkItem | null) {
  if (definition.writeIntent === "article") {
    const articlePath = workItem?.articlePath ?? run.target.articlePath;
    return articlePath ? [articlePath] : [];
  }

  if (definition.writeIntent === "diagram") {
    const diagramsDir = workItem?.diagramsDir ?? run.target.diagramsDir;
    return diagramsDir ? [diagramsDir] : [];
  }

  if (definition.writeIntent === "report") {
    return [path.join(".agent-state", "runs", run.id, "artifacts")];
  }

  return [];
}

function getArticlesSubcategoryDir(domainSlug: string, categorySlug: string, subcategorySlug: string) {
  return path.join(
    REPO_ROOT,
    "content",
    "articles",
    mapDomainDirectory(domainSlug),
    mapCategoryDirectory(categorySlug),
    subcategorySlug
  );
}

function mapDomainDirectory(domainSlug: string) {
  if (domainSlug === "system-design-concepts") {
    return "system-design";
  }

  return domainSlug;
}

function mapCategoryDirectory(categorySlug: string) {
  const categoryMap: Record<string, string> = {
    "frontend-concepts": "frontend",
    "backend-concepts": "backend",
  };

  return categoryMap[categorySlug] ?? categorySlug;
}

function deslugify(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default {
  REQUIRED_SECTIONS,
  createRun,
  refreshRunState,
  loadPipelineDefinition,
  scanArticleContent,
};
