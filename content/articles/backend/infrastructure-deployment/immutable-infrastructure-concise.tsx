"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-immutable-infrastructure-extensive",
  title: "Immutable Infrastructure",
  description: "In-depth guide to immutable infrastructure architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "immutable-infrastructure",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'immutable'],
  relatedTopics: ['configuration-management', 'infrastructure-as-code', 'ci-cd-pipelines'],
};

export default function ImmutableinfrastructureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Immutable infrastructure treats servers as disposable units that are replaced rather than modified.</p>
        <p>This removes configuration drift and enables consistent, repeatable deployments.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/immutable-infrastructure-diagram-1.svg" alt="Immutable Infrastructure architecture" caption="Immutable Infrastructure system overview." />
        <p>Images are built in CI and deployed through orchestration or VM scaling groups.</p>
        <p>Each release creates a new image, while old instances are terminated.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/immutable-infrastructure-diagram-2.svg" alt="Immutable Infrastructure mechanisms" caption="Key mechanisms and control points." />
        <p>Versioned images enable fast rollback to a known-good state.</p>
        <p>Infrastructure is defined in code to ensure repeatability.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/immutable-infrastructure-diagram-3.svg" alt="Immutable Infrastructure failure modes" caption="Failure paths and mitigation strategies." />
        <p>Slow image builds or missing rollback images are common problems.</p>
        <p>Slow build pipelines reduce responsiveness during incidents.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Maintain a pipeline for fast image builds and automated validation.</p>
        <p>Keep a catalog of recent images for rollback.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Immutable infra reduces drift but increases build and storage requirements.</p>
        <p>Long-lived mutable systems are easier to patch but harder to keep consistent.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app with a Packer image build and rollout script.</p>
        <p className="mt-4 font-semibold">packer.json</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">deploy.sh</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">app.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Bake images in CI and run smoke tests before deploy.</p>
        <p>Verify rollback by redeploying the previous image.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use golden images with versioning.</li>
          <li>Automate image builds and validation.</li>
          <li>Keep rollback images available.</li>
          <li>Avoid in-place changes.</li>
          <li>Track image provenance.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Immutable infrastructure improves reliability when image pipelines are fast and versioned.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why immutable infrastructure?</p>
            <p className="mt-2 text-sm">A: It avoids drift by replacing instances entirely.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a common downside?</p>
            <p className="mt-2 text-sm">A: Longer image build times.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rollback?</p>
            <p className="mt-2 text-sm">A: Deploy the previous known-good image.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
