"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-service-discovery-extensive",
  title: "Service Discovery",
  description: "In-depth guide to service discovery architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "service-discovery",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'discovery'],
  relatedTopics: ['service-registry', 'container-orchestration', 'load-balancer-configuration'],
};

export default function ServicediscoveryConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Service discovery provides a mechanism for services to find each other dynamically as instances scale up and down.</p>
        <p>It is critical in microservice environments where endpoints change frequently.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-discovery-diagram-1.svg" alt="Service Discovery architecture" caption="Service Discovery system overview." />
        <p>Services register with a discovery system or rely on DNS-based updates.</p>
        <p>Clients query the discovery layer to obtain healthy endpoints.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-discovery-diagram-2.svg" alt="Service Discovery mechanisms" caption="Key mechanisms and control points." />
        <p>Health checks ensure only healthy instances are discoverable.</p>
        <p>Caching improves lookup performance but must respect TTLs.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/service-discovery-diagram-3.svg" alt="Service Discovery failure modes" caption="Failure paths and mitigation strategies." />
        <p>Stale records and failed registrations are common failure modes.</p>
        <p>Stale cache entries cause traffic to unhealthy instances.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Keep TTLs short for dynamic services.</p>
        <p>Monitor registry health and registration failures.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Client-side discovery gives more control but increases complexity in clients.</p>
        <p>Server-side discovery centralizes routing but adds an extra hop.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app showing a registry-backed discovery client.</p>
        <p className="mt-4 font-semibold">registry.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">client.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">service.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Simulate service churn and validate lookup freshness.</p>
        <p>Test failure scenarios where registry is unavailable.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Set short TTLs for rapidly changing services.</li>
          <li>Use health checks for registration.</li>
          <li>Monitor lookup latency.</li>
          <li>Choose client vs server discovery intentionally.</li>
          <li>Plan for registry outage fallback.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Service discovery keeps dynamic systems stable when registrations and health checks are reliable.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why service discovery?</p>
            <p className="mt-2 text-sm">A: It removes hard-coded endpoints in dynamic systems.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Client vs server discovery?</p>
            <p className="mt-2 text-sm">A: Client-side resolves directly; server-side uses a load balancer.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Common risk?</p>
            <p className="mt-2 text-sm">A: Stale records causing failed connections.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
