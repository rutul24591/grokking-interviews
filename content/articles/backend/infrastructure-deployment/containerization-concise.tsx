"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-containerization-extensive",
  title: "Containerization",
  description: "In-depth guide to containerization architecture, trade-offs, and operational practice.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "containerization",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-11",
  tags: ['backend', 'infra', 'containers'],
  relatedTopics: ['container-orchestration', 'ci-cd-pipelines', 'immutable-infrastructure'],
};

export default function ContainerizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Containerization packages an application with its runtime and dependencies into an immutable image.</p>
        <p>It improves portability and repeatability while keeping deployment units lightweight.</p>
      </section>
      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/containerization-diagram-1.svg" alt="Containerization architecture" caption="Containerization system overview." />
        <p>Images are built in CI, stored in registries, and pulled by runtime nodes.</p>
        <p>Build-time and run-time configuration are separated to minimize drift.</p>
      </section>
      <section>
        <h2>Operational Mechanisms</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/containerization-diagram-2.svg" alt="Containerization mechanisms" caption="Key mechanisms and control points." />
        <p>Namespaces and cgroups isolate processes and enforce resource limits.</p>
        <p>Layered filesystems enable fast distribution and caching.</p>
      </section>
      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage src="/diagrams/backend/infrastructure-deployment/containerization-diagram-3.svg" alt="Containerization failure modes" caption="Failure paths and mitigation strategies." />
        <p>Oversized images, privileged containers, or mismatched runtime config are the most common failure modes.</p>
        <p>Large images slow deployment and privileged containers increase risk exposure.</p>
      </section>
      <section>
        <h2>Operational Playbook</h2>
        <p>Use multi-stage builds, scan for vulnerabilities, and run as non-root.</p>
        <p>Keep base images consistent and enforce versioning in registries.</p>
      </section>
      <section>
        <h2>Trade-offs</h2>
        <p>Containers are faster than VMs but provide weaker isolation due to kernel sharing.</p>
        <p>Immutability improves reliability but requires registry hygiene and version control.</p>
      </section>
      <section>
        <h2>Implementation Example</h2>
        <p>Mini app with a multi-stage Docker build and compose-based stack.</p>
        <p className="mt-4 font-semibold">Dockerfile</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">docker-compose.yml</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p className="mt-4 font-semibold">dist/server.js</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>
      <section>
        <h2>Testing and Validation</h2>
        <p>Validate image size, startup time, and health checks in CI.</p>
        <p>Run vulnerability scans and ensure policies block privileged containers.</p>
      </section>
      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use minimal base images.</li>
          <li>Run as non-root.</li>
          <li>Scan images for CVEs.</li>
          <li>Separate build and runtime config.</li>
          <li>Version images consistently.</li>
        </ul>
      </section>
      <section>
        <h2>Summary</h2>
        <p>Containerization improves portability when images are small, secure, and consistently built.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use containers instead of VM images?</p>
            <p className="mt-2 text-sm">A: They start faster and are lighter because they share the host kernel.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce image size?</p>
            <p className="mt-2 text-sm">A: Use multi-stage builds and minimal base images.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common security mistake?</p>
            <p className="mt-2 text-sm">A: Running containers as root with excessive capabilities.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
