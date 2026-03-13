"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rolling-deployment-extensive",
  title: "Rolling Deployment",
  description: "In-depth guide to rolling deployment architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "rolling-deployment",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'deployment'],
  relatedTopics: ['canary-deployment', 'blue-green-deployment', 'auto-scaling'],
};

export default function RollingdeploymentConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Rolling deployment replaces instances in small batches to reduce downtime and risk.</p>
        <p>It is common in orchestrated environments where controllers manage rollout pacing.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/rolling-deployment-diagram-1.svg" alt="Rolling Deployment architecture" caption="Rolling Deployment system overview." />
        <p>The orchestrator drains traffic from old instances, deploys new instances, and waits for readiness.</p>
        <p>Surge and maxUnavailable settings control capacity during rollout.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/rolling-deployment-diagram-2.svg" alt="Rolling Deployment mechanisms" caption="Key mechanisms and control points." />
        <p>Health probes ensure new instances are ready before receiving traffic.</p>
        <p>Rollback triggers revert the rollout if error rates spike.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/rolling-deployment-diagram-3.svg" alt="Rolling Deployment failure modes" caption="Failure paths and mitigation strategies." />
        <p>Insufficient capacity and weak health probes are common failure modes.</p>
        <p>If maxUnavailable is too high, capacity drops and errors rise.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Set conservative rollout parameters and verify readiness probes in staging.</p>
        <p>Monitor metrics during rollout and pause if regression is detected.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Rolling deployments are efficient but slower than blue-green for rollback.</p>
        <p>They require careful tuning of capacity buffers.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app showing Kubernetes rolling update settings.</p>
        <p className="mt-4 font-semibold">deployment.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">app.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Simulate slow startups and confirm rollout pauses correctly.</p>
        <p>Verify rollback behavior when error rate increases.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Set maxUnavailable and maxSurge carefully.</li>
          <li>Use readiness probes.</li>
          <li>Monitor error rate during rollout.</li>
          <li>Have a rollback procedure ready.</li>
          <li>Test deployment in staging.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Rolling deployments balance availability and cost when rollout parameters are tuned.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use rolling deployments?</p>
            <p className="mt-2 text-sm">A: They reduce downtime without duplicating environments.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the key risk?</p>
            <p className="mt-2 text-sm">A: Dropping capacity below safe thresholds.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make it safe?</p>
            <p className="mt-2 text-sm">A: Use readiness checks and surge capacity.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
