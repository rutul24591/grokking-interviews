"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-service-registry-extensive",
  title: "Service Registry",
  description: "In-depth guide to service registry architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "service-registry",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'registry'],
  relatedTopics: ['service-discovery', 'load-balancer-configuration', 'container-orchestration'],
};

export default function ServiceregistryConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>A service registry tracks live service instances, health status, and metadata.</p>
        <p>It provides the data needed for service discovery and routing decisions.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-registry-diagram-1.svg" alt="Service Registry architecture" caption="Service Registry system overview." />
        <p>Instances register with the registry and renew their registration periodically.</p>
        <p>Clients or gateways query the registry to resolve endpoints.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-registry-diagram-2.svg" alt="Service Registry mechanisms" caption="Key mechanisms and control points." />
        <p>TTL-based expiry removes dead instances automatically.</p>
        <p>Replication ensures registry availability and consistency.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-registry-diagram-3.svg" alt="Service Registry failure modes" caption="Failure paths and mitigation strategies." />
        <p>Registry outages and stale registrations are common failure modes.</p>
        <p>Registry outages can block new deployments or discovery lookups.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Deploy registries as a highly available cluster.</p>
        <p>Monitor registration renewal and expiry rates.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Centralized registries simplify discovery but require strong HA guarantees.</p>
        <p>DNS-based discovery reduces dependency on a single system but limits metadata.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app with registration and TTL expiry.</p>
        <p className="mt-4 font-semibold">registry.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">client.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">register.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Test registry failure scenarios and confirm clients fall back gracefully.</p>
        <p>Validate TTL expiry by stopping instances and observing cleanup.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use TTL-based renewal.</li>
          <li>Replicate the registry.</li>
          <li>Monitor registry latency.</li>
          <li>Define fallback behavior.</li>
          <li>Keep metadata minimal.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>A service registry is reliable when it is highly available and uses TTLs to prevent stale endpoints.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a service registry?</p>
            <p className="mt-2 text-sm">A: A database of live service instances and metadata.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is TTL important?</p>
            <p className="mt-2 text-sm">A: It prevents stale instances from lingering.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you avoid single points of failure?</p>
            <p className="mt-2 text-sm">A: Use a replicated registry cluster.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
