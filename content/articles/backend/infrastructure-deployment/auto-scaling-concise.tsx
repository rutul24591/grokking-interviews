"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-auto-scaling-extensive",
  title: "Auto-Scaling",
  description: "In-depth guide to auto-scaling architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "auto-scaling",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'scaling'],
  relatedTopics: ['container-orchestration', 'load-balancer-configuration', 'capacity-planning'],
};

export default function AutoscalingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Auto-scaling expands or contracts capacity based on real-time demand signals.</p>
        <p>It ensures performance targets while optimizing infrastructure cost.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/auto-scaling-diagram-1.svg" alt="Auto-Scaling architecture" caption="Auto-Scaling system overview." />
        <p>Scaling controllers observe metrics and adjust instance or pod counts.</p>
        <p>Load balancers distribute traffic to new instances as they become healthy.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/auto-scaling-diagram-2.svg" alt="Auto-Scaling mechanisms" caption="Key mechanisms and control points." />
        <p>Metrics can be resource-based or business-based such as queue depth or latency.</p>
        <p>Cooldown and stabilization windows prevent rapid oscillation.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/auto-scaling-diagram-3.svg" alt="Auto-Scaling failure modes" caption="Failure paths and mitigation strategies." />
        <p>Oscillation and delayed scaling are the most common failure modes.</p>
        <p>Incorrect metrics cause scaling that does not match user demand.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Define scaling metrics tied to user experience.</p>
        <p>Test scaling policies with load simulations and adjust thresholds.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Aggressive scaling improves responsiveness but increases cost.</p>
        <p>Conservative scaling saves cost but risks latency spikes.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app showing autoscaling policies for a web service.</p>
        <p className="mt-4 font-semibold">hpa.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">deployment.yaml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">load-generator.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Run synthetic load tests to verify scaling thresholds.</p>
        <p>Validate scale-in safety with cooldowns and min replicas.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Pick metrics tied to user experience.</li>
          <li>Set cooldown windows.</li>
          <li>Test scale-up/down paths.</li>
          <li>Watch startup time and warm-up.</li>
          <li>Ensure load balancer checks are correct.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Auto-scaling works best when metrics align with user impact and policies are tuned.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What triggers auto-scaling?</p>
            <p className="mt-2 text-sm">A: Metrics like CPU, latency, or queue depth.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main risk?</p>
            <p className="mt-2 text-sm">A: Oscillation from aggressive scaling policies.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent thrash?</p>
            <p className="mt-2 text-sm">A: Use cooldowns and conservative thresholds.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
