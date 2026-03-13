"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-infrastructure-as-code-extensive",
  title: "Infrastructure as Code",
  description: "In-depth guide to infrastructure as code architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "infrastructure-as-code",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'iac'],
  relatedTopics: ['configuration-management', 'gitops', 'cloud-services'],
};

export default function InfrastructureascodeConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Infrastructure as Code treats infrastructure definitions like software with version control and review.</p>
        <p>It replaces manual provisioning with declarative configurations for consistency.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/infrastructure-as-code-diagram-1.svg" alt="Infrastructure as Code architecture" caption="Infrastructure as Code system overview." />
        <p>IaC tools store desired state in code and reconcile changes through plan and apply phases.</p>
        <p>Remote state backends with locking prevent conflicting updates.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/infrastructure-as-code-diagram-2.svg" alt="Infrastructure as Code mechanisms" caption="Key mechanisms and control points." />
        <p>Modules encapsulate reusable patterns and policy checks prevent unsafe changes.</p>
        <p>Drift detection ensures production matches the declared state.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/infrastructure-as-code-diagram-3.svg" alt="Infrastructure as Code failure modes" caption="Failure paths and mitigation strategies." />
        <p>Manual changes outside IaC create drift and unpredictable plans.</p>
        <p>State drift leads to unexpected diffs and risky apply behavior.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Review plans in CI and require approvals for production applies.</p>
        <p>Run drift detection regularly and treat drift as a bug.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>IaC requires discipline but eliminates snowflake environments.</p>
        <p>Complex modules can slow iteration if poorly documented.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini Terraform config that provisions a VPC and compute instance.</p>
        <p className="mt-4 font-semibold">main.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">variables.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">outputs.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Run terraform plan in CI to validate changes and block destructive updates.</p>
        <p>Use policy checks to prevent insecure defaults.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use remote state with locking.</li>
          <li>Review plans before apply.</li>
          <li>Run drift checks regularly.</li>
          <li>Use modules for reuse.</li>
          <li>Apply least-privilege IAM.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>IaC improves reliability when state is managed carefully and changes are reviewed.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use IaC?</p>
            <p className="mt-2 text-sm">A: It makes infra changes repeatable and reviewable.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest risk?</p>
            <p className="mt-2 text-sm">A: State drift from manual changes.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce drift?</p>
            <p className="mt-2 text-sm">A: Use policy checks and run regular plans.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
