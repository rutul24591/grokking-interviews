"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-canary-deployment-extensive",
  title: "Canary Deployment",
  description: "In-depth guide to canary deployment architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "canary-deployment",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'deployment'],
  relatedTopics: ['blue-green-deployment', 'rolling-deployment', 'feature-flags'],
};

export default function CanarydeploymentConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Canary deployment gradually exposes a new release to a small traffic subset and expands only if metrics stay healthy.</p>
        <p>It is ideal for catching regressions that are hard to detect in staging environments.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/canary-deployment-diagram-1.svg" alt="Canary Deployment architecture" caption="Canary Deployment system overview." />
        <p>Traffic is split between stable and canary versions using a load balancer or service mesh.</p>
        <p>Monitoring must capture both technical and user-impact metrics for the canary cohort.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/canary-deployment-diagram-2.svg" alt="Canary Deployment mechanisms" caption="Key mechanisms and control points." />
        <p>Automated gates compare canary metrics to baseline and trigger rollback on regression.</p>
        <p>Progressive rollout steps reduce risk by limiting exposure.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/canary-deployment-diagram-3.svg" alt="Canary Deployment failure modes" caption="Failure paths and mitigation strategies." />
        <p>Poor canary metrics, insufficient sampling, or biased traffic splits are common problems.</p>
        <p>Small canary samples may miss rare failures and biased routing can skew results.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Define canary success metrics and rollback thresholds before rollout.</p>
        <p>Increase traffic gradually, pausing to validate each step.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Canaries slow full rollout but reduce blast radius.</p>
        <p>They require strong observability to be effective.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app showing weighted routing between stable and canary.</p>
        <p className="mt-4 font-semibold">nginx.conf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">docker-compose.yml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">stable.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">canary.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Validate baseline metrics before starting the canary.</p>
        <p>Compare canary and stable metrics at each rollout stage.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Define success metrics and rollback thresholds.</li>
          <li>Use consistent traffic splitting.</li>
          <li>Automate rollback when metrics degrade.</li>
          <li>Monitor business KPIs, not just system metrics.</li>
          <li>Document rollout stages.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Canary deployments reduce risk when traffic splits and metrics gates are carefully designed.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use canary?</p>
            <p className="mt-2 text-sm">A: To detect issues early with limited user impact.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics matter?</p>
            <p className="mt-2 text-sm">A: Error rate, latency, and key business KPIs.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rollback?</p>
            <p className="mt-2 text-sm">A: Shift traffic back to the stable version.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
