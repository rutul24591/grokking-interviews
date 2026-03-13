"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-feature-flags-extensive",
  title: "Feature Flags",
  description: "In-depth guide to feature flags architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "feature-flags",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'release'],
  relatedTopics: ['ci-cd-pipelines', 'canary-deployment', 'gitops'],
};

export default function FeatureflagsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Feature flags allow runtime control over which users see which functionality.</p>
        <p>They enable gradual rollouts, experiments, and fast rollback via kill switches.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/feature-flags-diagram-1.svg" alt="Feature Flags architecture" caption="Feature Flags system overview." />
        <p>Flags are evaluated via a service or SDK that reads rules and targeting criteria.</p>
        <p>Evaluation must be fast and consistent across services.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/feature-flags-diagram-2.svg" alt="Feature Flags mechanisms" caption="Key mechanisms and control points." />
        <p>Targeting rules segment users by attributes or rollout percentage.</p>
        <p>Kill switches provide emergency disablement during incidents.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/feature-flags-diagram-3.svg" alt="Feature Flags failure modes" caption="Failure paths and mitigation strategies." />
        <p>Stale flags and inconsistent evaluation are common failure modes.</p>
        <p>Flag sprawl and inconsistent evaluation lead to confusing user experiences.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Assign owners and expiration dates to all flags.</p>
        <p>Use analytics to measure impact and remove unused flags.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Flags add runtime overhead but improve release safety.</p>
        <p>Overuse can create configuration complexity.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app with a flag evaluation service and client SDK.</p>
        <p className="mt-4 font-semibold">flags.json</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">flag-service.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">app.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Test flag evaluation for deterministic behavior across services.</p>
        <p>Validate that kill switches disable features immediately.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Assign an owner for every flag.</li>
          <li>Set an expiration date.</li>
          <li>Monitor rollout metrics.</li>
          <li>Keep evaluation latency low.</li>
          <li>Remove flags after rollout.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Feature flags decouple release from deployment when governance and cleanup are enforced.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use feature flags?</p>
            <p className="mt-2 text-sm">A: They allow safe rollout without redeploys.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a common risk?</p>
            <p className="mt-2 text-sm">A: Flag sprawl and forgotten flags.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you mitigate?</p>
            <p className="mt-2 text-sm">A: Set expiration dates and clean up flags.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
