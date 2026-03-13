"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-ci-cd-pipelines-extensive",
  title: "CI/CD Pipelines",
  description: "In-depth guide to ci/cd pipelines architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "ci-cd-pipelines",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'cicd'],
  relatedTopics: ['feature-flags', 'blue-green-deployment', 'canary-deployment'],
};

export default function CicdpipelinesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>CI/CD automates building, testing, and deploying software with consistent, repeatable steps.</p>
        <p>It improves release quality by enforcing checks before code reaches production.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/ci-cd-pipelines-diagram-1.svg" alt="CI/CD Pipelines architecture" caption="CI/CD Pipelines system overview." />
        <p>Pipelines are composed of stages: build, test, security scan, package, and deploy.</p>
        <p>Artifacts are versioned and promoted between environments to ensure consistency.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/ci-cd-pipelines-diagram-2.svg" alt="CI/CD Pipelines mechanisms" caption="Key mechanisms and control points." />
        <p>Automated tests provide confidence while deployment gates prevent risky changes from shipping.</p>
        <p>Rollback and release tracking ensure incidents can be mitigated quickly.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/ci-cd-pipelines-diagram-3.svg" alt="CI/CD Pipelines failure modes" caption="Failure paths and mitigation strategies." />
        <p>Flaky tests and missing artifacts slow delivery and increase risk.</p>
        <p>Flaky tests create uncertainty and slow delivery; missing artifacts break promotions.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Define ownership for pipeline failures and keep build times short.</p>
        <p>Promote the same artifact through staging and production.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Strict gates improve safety but slow delivery; relaxed gates increase risk.</p>
        <p>Balancing speed and safety requires clear rollback readiness.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini pipeline with build, test, and deploy stages.</p>
        <p className="mt-4 font-semibold">pipeline.yml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">deploy.sh</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">package.json</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Test pipeline changes in a sandbox and verify rollback scripts.</p>
        <p>Monitor pipeline metrics to detect regressions in build or test time.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Keep pipelines fast.</li>
          <li>Use versioned artifacts.</li>
          <li>Add security scanning.</li>
          <li>Automate rollbacks.</li>
          <li>Audit pipeline credentials.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>CI/CD delivers reliable releases when artifacts are versioned and gates are enforced.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the goal of CI/CD?</p>
            <p className="mt-2 text-sm">A: Deliver changes quickly and safely with automation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce pipeline risk?</p>
            <p className="mt-2 text-sm">A: Use staged gates and automated tests.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a common bottleneck?</p>
            <p className="mt-2 text-sm">A: Slow tests or large artifacts.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
