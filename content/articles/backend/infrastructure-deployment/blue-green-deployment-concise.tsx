"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blue-green-deployment-extensive",
  title: "Blue-Green Deployment",
  description: "In-depth guide to blue-green deployment architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "blue-green-deployment",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'deployment'],
  relatedTopics: ['canary-deployment', 'rolling-deployment', 'feature-flags'],
};

export default function BluegreendeploymentConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Blue-green deployment maintains two identical environments and switches traffic after validation.</p>
        <p>It enables rapid rollback by routing traffic back to the previous environment.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/blue-green-deployment-diagram-1.svg" alt="Blue-Green Deployment architecture" caption="Blue-Green Deployment system overview." />
        <p>A routing layer directs traffic to either blue or green while both are provisioned.</p>
        <p>Database changes must be backward compatible to allow safe rollback.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/blue-green-deployment-diagram-2.svg" alt="Blue-Green Deployment mechanisms" caption="Key mechanisms and control points." />
        <p>Traffic switches can be load-balancer or DNS-based with health checks.</p>
        <p>Warm-up traffic reduces cold-start risk after cutover.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/blue-green-deployment-diagram-3.svg" alt="Blue-Green Deployment failure modes" caption="Failure paths and mitigation strategies." />
        <p>Schema incompatibility and missing warm-up traffic are common failure modes.</p>
        <p>Schema incompatibility can break rollback and cause data inconsistencies.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Ensure backward-compatible schema changes and run smoke tests before switching.</p>
        <p>Warm caches and monitor error rates closely during cutover.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Blue-green provides fast rollback but doubles infrastructure cost during deployment.</p>
        <p>Coordinating database changes is more complex with two live environments.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app with an Nginx switch between blue and green services.</p>
        <p className="mt-4 font-semibold">nginx.conf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">docker-compose.yml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">blue.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">green.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Run smoke tests against the green environment before switch.</p>
        <p>Measure cache warm-up time and error rate during cutover.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Ensure backward-compatible schema changes.</li>
          <li>Warm caches and run smoke tests.</li>
          <li>Plan fast rollback by keeping blue intact.</li>
          <li>Monitor key metrics during cutover.</li>
          <li>Document the switch procedure.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Blue-green deployments reduce downtime when traffic switching and schema compatibility are managed.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use blue-green?</p>
            <p className="mt-2 text-sm">A: It provides instant rollback by flipping traffic.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest risk?</p>
            <p className="mt-2 text-sm">A: Database incompatibility between versions.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate green?</p>
            <p className="mt-2 text-sm">A: Run smoke tests and shadow traffic before switch.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
