import * as path from "path";

import ts from "typescript";

import {
  loadArtifact,
  loadRun,
  loadTask,
  persistArtifact,
  persistEvaluation,
} from "./artifact-store";
import { REQUIRED_SECTIONS, refreshRunState, scanArticleContent } from "./planner";
import type { ArtifactRecord, EvaluationRecord } from "./types";
import { nowIso, randomId, readJson, readText } from "./utils";

export function evaluateTaskOutputs(runId: string, taskId: string) {
  const task = loadTask(runId, taskId);
  const evaluations = task.outputArtifactIds.map((artifactId) =>
    evaluateArtifact(runId, taskId, artifactId)
  );

  refreshRunState(runId);
  return evaluations;
}

export function evaluateArtifact(runId: string, taskId: string, artifactId: string) {
  const artifact = loadArtifact(runId, artifactId);
  const evaluation = buildEvaluation(runId, taskId, artifact);

  artifact.status = evaluation.pass ? "accepted" : "rejected";
  persistArtifact(artifact);
  persistEvaluation(evaluation);

  return evaluation;
}

function buildEvaluation(runId: string, taskId: string, artifact: ArtifactRecord): EvaluationRecord {
  switch (artifact.type) {
    case "article-outline":
      return createEvaluation(runId, taskId, artifact.id, evaluateOutlineArtifact(artifact));
    case "tsx-candidate":
      return createEvaluation(runId, taskId, artifact.id, evaluateTsxArtifact(artifact));
    case "svg-file":
      return createEvaluation(runId, taskId, artifact.id, evaluateSvgArtifact(artifact));
    case "audit-report":
      return createEvaluation(runId, taskId, artifact.id, evaluateAuditArtifact(artifact));
    case "gap-report":
    case "topic-resolution":
    case "context-pack":
    case "article-enumeration":
    case "svg-plan":
    case "article-content":
    case "run-summary":
    case "evaluation":
    case "text":
      return createEvaluation(runId, taskId, artifact.id, { pass: true, score: 100, reasons: ["Artifact accepted by default."], blockingIssues: [], suggestedRepairTask: null });
    default:
      return createEvaluation(runId, taskId, artifact.id, { pass: false, score: 0, reasons: [], blockingIssues: [`Unsupported artifact type: ${artifact.type}`], suggestedRepairTask: "manual-review" });
  }
}

function evaluateOutlineArtifact(artifact: ArtifactRecord) {
  const filePath = path.join(process.cwd(), artifact.path);
  const payload = readJson<unknown>(filePath);
  const payloadText = JSON.stringify(payload);
  const missingSections = REQUIRED_SECTIONS.filter((section) => !payloadText.includes(section));
  const blockingIssues =
    missingSections.length > 0 ? [`Outline missing required sections: ${missingSections.join(", ")}`] : [];

  return {
    pass: blockingIssues.length === 0,
    score: blockingIssues.length === 0 ? 100 : Math.max(30, 100 - missingSections.length * 10),
    reasons: blockingIssues.length === 0 ? ["Outline contains all required sections."] : [],
    blockingIssues,
    suggestedRepairTask: blockingIssues.length === 0 ? null : "outline-draft",
  };
}

function evaluateTsxArtifact(artifact: ArtifactRecord) {
  const filePath = path.join(process.cwd(), artifact.path);
  const content = readText(filePath);
  const transpileResult = ts.transpileModule(content, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    reportDiagnostics: true,
  });

  const diagnostics = transpileResult.diagnostics ?? [];
  const blockingIssues = diagnostics
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));

  const scan = scanArticleContent(content);

  if (scan.missingSections.length > 0) {
    blockingIssues.push(`Missing sections: ${scan.missingSections.join(", ")}`);
  }
  if (!scan.sectionOrderValid) {
    blockingIssues.push("Section order does not follow the required structure.");
  }
  if (scan.imageCount < 3 || scan.imageCount > 5) {
    blockingIssues.push(`Expected 3-5 <ArticleImage /> entries, found ${scan.imageCount}.`);
  }
  if (!scan.hasReferences) {
    blockingIssues.push("References section is missing.");
  }
  if (scan.hasCodeBlock) {
    blockingIssues.push("Article contains code blocks or implementation example content.");
  }

  const reasons = [];
  if (blockingIssues.length === 0) {
    reasons.push("TSX candidate transpiles cleanly.");
    reasons.push("Article structure satisfies required section ordering.");
  }

  return {
    pass: blockingIssues.length === 0,
    score: blockingIssues.length === 0 ? 100 : Math.max(20, 100 - blockingIssues.length * 10),
    reasons,
    blockingIssues,
    suggestedRepairTask: blockingIssues.length === 0 ? null : "tsx-assembly",
  };
}

function evaluateSvgArtifact(artifact: ArtifactRecord) {
  const filePath = path.join(process.cwd(), artifact.path);
  const content = readText(filePath);
  const blockingIssues: string[] = [];

  if (!content.includes("<svg")) {
    blockingIssues.push("Missing <svg> root element.");
  }
  if (!content.includes("</svg>")) {
    blockingIssues.push("Missing closing </svg> tag.");
  }
  if (content.includes("var(")) {
    blockingIssues.push("SVG contains CSS variables, which are disallowed.");
  }
  if (/[&](?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/.test(content)) {
    blockingIssues.push("SVG contains unescaped XML entities.");
  }

  return {
    pass: blockingIssues.length === 0,
    score: blockingIssues.length === 0 ? 100 : Math.max(40, 100 - blockingIssues.length * 20),
    reasons: blockingIssues.length === 0 ? ["SVG satisfies core validity checks."] : [],
    blockingIssues,
    suggestedRepairTask: blockingIssues.length === 0 ? null : "svg-generation",
  };
}

function evaluateAuditArtifact(artifact: ArtifactRecord) {
  const filePath = path.join(process.cwd(), artifact.path);
  const content = readText(filePath);
  const blockingIssues: string[] = [];

  if (!/Rating/i.test(content)) {
    blockingIssues.push("Audit report is missing a rating.");
  }
  if (!/Issues/i.test(content)) {
    blockingIssues.push("Audit report is missing an issues section.");
  }
  if (!/Suggestions/i.test(content)) {
    blockingIssues.push("Audit report is missing a suggestions section.");
  }

  return {
    pass: blockingIssues.length === 0,
    score: blockingIssues.length === 0 ? 100 : Math.max(50, 100 - blockingIssues.length * 20),
    reasons: blockingIssues.length === 0 ? ["Audit report contains the required headings."] : [],
    blockingIssues,
    suggestedRepairTask: blockingIssues.length === 0 ? null : "audit-draft",
  };
}

function createEvaluation(
  runId: string,
  taskId: string,
  artifactId: string,
  input: {
    pass: boolean;
    score: number;
    reasons: string[];
    blockingIssues: string[];
    suggestedRepairTask: string | null;
  }
): EvaluationRecord {
  loadRun(runId);

  return {
    id: randomId("evaluation"),
    runId,
    taskId,
    artifactId,
    createdAt: nowIso(),
    pass: input.pass,
    score: input.score,
    reasons: input.reasons,
    blockingIssues: input.blockingIssues,
    suggestedRepairTask: input.suggestedRepairTask,
  };
}

export default {
  evaluateTaskOutputs,
  evaluateArtifact,
};
