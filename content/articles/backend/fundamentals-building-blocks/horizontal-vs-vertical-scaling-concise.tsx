"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-horizontal-vertical-concise",
  title: "Horizontal vs Vertical Scaling",
  description: "Quick comparison of scaling up vs scaling out for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "horizontal-vs-vertical-scaling",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "scaling", "architecture"],
  relatedTopics: ["stateless-vs-stateful-services", "reliability-fault-tolerance", "caching-performance"],
};

export default function HorizontalVerticalScalingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Vertical scaling</strong> (scale up) increases the power of a single
          machine. <strong>Horizontal scaling</strong> (scale out) adds more machines
          and distributes traffic across them.
        </p>
        <p>
          Most real systems use both: scale up early for simplicity, then scale
          out when you hit single‑machine limits. The trade‑offs are cost,
          resilience, and operational complexity.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Scale up:</strong> Bigger CPU/RAM on one server.</li>
          <li><strong>Scale out:</strong> More servers behind a load balancer.</li>
          <li><strong>Cost curve:</strong> Vertical hits hardware limits; horizontal adds complexity.</li>
          <li><strong>Shared-nothing:</strong> Horizontal scaling works best with stateless services.</li>
          <li><strong>Data scaling:</strong> Read replicas, sharding, and partitioning.</li>
        </ul>
        <p className="mt-4">
          Horizontal scaling changes how you design data, sessions, and caches.
          Vertical scaling changes how you size machines and handle downtime.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Autoscaling trigger (pseudo)
if (cpu > 70% for 5m) addInstance();
if (cpu < 30% for 10m) removeInstance();`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Horizontal scaling requires stateless services.</li>
          <li>Vertical scaling is simpler but has hard limits.</li>
          <li>Use caching and read replicas to reduce load.</li>
          <li>Call out autoscaling triggers (CPU, latency, queue depth).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is horizontal scaling preferred for large systems?</p>
            <p className="mt-2 text-sm">A: It scales beyond single-machine limits and improves resilience.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you scale vertically?</p>
            <p className="mt-2 text-sm">A: Early stages or for workloads that cannot easily be distributed.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What’s the scaling strategy for databases?</p>
            <p className="mt-2 text-sm">
              A: Scale reads with replicas; scale writes with sharding or partitioning.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
