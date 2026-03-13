"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-gitops-extensive",
  title: "GitOps",
  description: "In-depth guide to gitops architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "gitops",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'gitops'],
  relatedTopics: ['infrastructure-as-code', 'ci-cd-pipelines', 'immutable-infrastructure'],
};

export default function GitopsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>GitOps uses Git repositories as the authoritative source of configuration and desired state.</p>
        <p>A reconciliation agent continuously aligns runtime state to Git.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/gitops-diagram-1.svg" alt="GitOps architecture" caption="GitOps system overview." />
        <p>A GitOps controller watches repositories for changes and applies manifests to the cluster.</p>
        <p>Policies enforce approvals and prevent unsafe changes from syncing.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/gitops-diagram-2.svg" alt="GitOps mechanisms" caption="Key mechanisms and control points." />
        <p>Pull-based sync avoids exposing cluster credentials to CI pipelines.</p>
        <p>Automated drift correction keeps production aligned with Git.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/gitops-diagram-3.svg" alt="GitOps failure modes" caption="Failure paths and mitigation strategies." />
        <p>Misconfigured sync policies and bad commits can cause outages.</p>
        <p>Incorrect manifests can propagate quickly if guardrails are missing.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Use pull requests for every change and enforce policy checks.</p>
        <p>Monitor sync status and remediate drift quickly.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>GitOps improves auditability but requires strong review discipline.</p>
        <p>Emergency fixes can be slower if bypasses are too strict.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini GitOps setup with an Argo CD application manifest.</p>
        <p className="mt-4 font-semibold">app.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">k8s/deployment.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">k8s/service.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Validate manifests in staging before merging to main.</p>
        <p>Test rollback by reverting Git commits.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use PR reviews for changes.</li>
          <li>Enable automated sync with checks.</li>
          <li>Monitor drift and sync failures.</li>
          <li>Keep manifests minimal and versioned.</li>
          <li>Document rollback steps.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>GitOps is reliable when Git is the single source of truth and automation is guarded by review.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why GitOps?</p>
            <p className="mt-2 text-sm">A: It provides auditability and consistent deployments via Git.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main risk?</p>
            <p className="mt-2 text-sm">A: Bad manifests can be synced automatically.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect?</p>
            <p className="mt-2 text-sm">A: Use approvals and staging environments before prod sync.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
