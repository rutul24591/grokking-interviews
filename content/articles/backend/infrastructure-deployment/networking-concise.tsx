"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-networking-extensive",
  title: "Networking",
  description: "In-depth guide to networking architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "networking",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'network'],
  relatedTopics: ['dns-management', 'load-balancer-configuration', 'cloud-services'],
};

export default function NetworkingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Networking in infrastructure design governs how services connect, how traffic is isolated, and how security is enforced.</p>
        <p>It is foundational for both performance and security.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/networking-diagram-1.svg" alt="Networking architecture" caption="Networking system overview." />
        <p>Workloads are segmented into subnets with routing tables that control traffic flows.</p>
        <p>Security groups and network ACLs enforce policy at different layers.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/networking-diagram-2.svg" alt="Networking mechanisms" caption="Key mechanisms and control points." />
        <p>NAT gateways allow private subnets to access the internet without exposing inbound ports.</p>
        <p>Peering and transit gateways connect VPCs or regions securely.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/networking-diagram-3.svg" alt="Networking failure modes" caption="Failure paths and mitigation strategies." />
        <p>Misconfigured routes and overly permissive rules are common failure modes.</p>
        <p>Misconfigured routes can black-hole traffic and overly permissive rules increase risk.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Use least-privilege security rules and document routing changes.</p>
        <p>Monitor network metrics for drops, latency, and saturation.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Highly segmented networks improve security but increase operational complexity.</p>
        <p>Simpler networks are easier to manage but can expose a larger blast radius.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini Terraform config that defines VPC, subnets, and security groups.</p>
        <p className="mt-4 font-semibold">network.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">routes.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">outputs.tf</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Run connectivity tests between subnets and validate security group rules.</p>
        <p>Monitor NAT gateway throughput and latency under load.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Segment workloads into subnets.</li>
          <li>Apply least-privilege rules.</li>
          <li>Document routing changes.</li>
          <li>Monitor latency and drops.</li>
          <li>Plan for NAT scaling.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>A disciplined networking design reduces risk and improves performance when segmentation is intentional.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use VPCs?</p>
            <p className="mt-2 text-sm">A: To isolate workloads and control routing and access.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is NAT used for?</p>
            <p className="mt-2 text-sm">A: Private subnets to reach the public internet safely.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Common mistake?</p>
            <p className="mt-2 text-sm">A: Overly permissive security groups.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
