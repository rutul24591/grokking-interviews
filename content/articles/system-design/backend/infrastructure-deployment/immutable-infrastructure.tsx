"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-immutable-infrastructure",
  title: "Immutable Infrastructure",
  description:
    "Comprehensive guide to immutable infrastructure covering no in-place updates, version control, replacement-based deployments, rollback strategies, and production-scale implementation patterns.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "immutable-infrastructure",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "immutable infrastructure",
    "version control",
    "replacement deployments",
    "rollback",
    "no in-place updates",
  ],
  relatedTopics: [
    "infrastructure-as-code",
    "container-orchestration",
    "ci-cd-pipelines",
  ],
};

export default function ImmutableInfrastructureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Immutable infrastructure</strong> is an operational model where servers and infrastructure components are never modified in-place after deployment. Instead of updating existing servers (installing new packages, changing configuration files, patching the OS), new servers are provisioned with the updated configuration, and old servers are terminated and replaced. This approach eliminates configuration drift (servers do not diverge from their desired state over time, because they are never modified), ensures reproducibility (every server is built from the same image/configuration, eliminating &quot;works on my server&quot; problems), and simplifies rollback (reverting to the previous server image/configuration, rather than undoing in-place changes).
        </p>
        <p>
          For staff-level engineers, immutable infrastructure represents a fundamental shift from mutable (changeable) to immutable (unchangeable) server management. Traditional mutable infrastructure involves SSHing into servers and making changes (installing packages, editing configuration files, applying patches) — which causes configuration drift (servers diverge from their desired state over time, different servers have different configurations, making debugging difficult). Immutable infrastructure eliminates this problem — servers are never modified, only replaced. If a server needs updating, a new server is provisioned with the updated configuration, and the old server is terminated. This ensures that all servers are identical (built from the same image/configuration), eliminating configuration drift and simplifying debugging.
        </p>
        <p>
          Immutable infrastructure involves several technical considerations. Image building (creating server images with all dependencies pre-installed — AMIs for AWS, machine images for GCP, container images for Kubernetes). Image versioning (each image has a unique version — semantic versioning, git SHA, build number — enabling reproducible deployments and rollback). Server replacement (deploying new servers, routing traffic to them, terminating old servers — zero-downtime replacement). Rollback (reverting to the previous server image — fast, reliable, no undo complexity). Configuration management (servers are configured at build time, not at runtime — no runtime configuration changes, no configuration drift).
        </p>
        <p>
          The business case for immutable infrastructure is reliability and reproducibility. Immutable infrastructure eliminates configuration drift (servers are never modified, so they do not diverge from their desired state), ensures reproducibility (every server is built from the same image/configuration, eliminating environment-specific bugs), and simplifies rollback (reverting to the previous image is fast and reliable — no undo complexity). For organizations managing large server fleets, immutable infrastructure is essential for maintaining consistency, reliability, and reproducibility at scale.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>No In-Place Updates:</strong> Servers are never modified after deployment. Instead of updating existing servers (installing new packages, changing configuration, applying patches), new servers are provisioned with the updated configuration, and old servers are terminated. This eliminates configuration drift (servers do not diverge from their desired state), ensures reproducibility (all servers are built from the same image), and simplifies debugging (if a server has an issue, it is replaced with a new server — no debugging in-place changes).
        </p>
        <p>
          <strong>Image Building:</strong> Creating server images with all dependencies pre-installed. Images are built through automated pipelines (Packer, Docker, cloud provider image builders — installing OS packages, application dependencies, application code, configuration). Images are versioned (each image has a unique version — semantic versioning, git SHA, build number), enabling reproducible deployments (same image version produces the same server) and rollback (revert to the previous image version).
        </p>
        <p>
          <strong>Server Replacement:</strong> Deploying new servers and terminating old servers. Server replacement is the core of immutable infrastructure — instead of updating existing servers, new servers are provisioned with the updated image, traffic is routed to the new servers (load balancer updates, DNS changes), and old servers are terminated. Server replacement can be done with zero-downtime (blue-green deployment, rolling deployment — traffic is always served by healthy servers).
        </p>
        <p>
          <strong>Version Control:</strong> Each server image has a unique version (semantic versioning, git SHA, build number). Version control enables reproducible deployments (same image version produces the same server), rollback (revert to the previous image version), and auditability (track which image version is deployed to which environment, when, and by whom). Image versions are stored in image registries (AWS AMI registry, Google Cloud Machine Images, Docker registry), enabling easy access to previous versions.
        </p>
        <p>
          <strong>Rollback:</strong> Reverting to the previous server image. Rollback in immutable infrastructure is simple and reliable — deploy the previous image version, route traffic to the new (old) servers, and terminate the current servers. Rollback is fast (no undo complexity — no need to undo in-place changes, just deploy the previous image), reliable (previous image is known to work — it was working before the current deployment), and auditable (rollback is tracked in image version history).
        </p>
        <p>
          <strong>Configuration at Build Time:</strong> Servers are configured at build time (image building), not at runtime (no runtime configuration changes). All dependencies, packages, and configuration are baked into the image during the build process. At runtime, servers are launched from the image (no configuration changes, no package installations, no runtime updates). This ensures that all servers are identical (built from the same image), eliminating configuration drift and simplifying debugging.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/mutable-vs-immutable.svg"
          alt="Mutable vs Immutable Infrastructure comparison showing in-place updates vs server replacement"
          caption="Mutable vs immutable infrastructure — mutable servers are updated in-place (causing drift), immutable servers are replaced with new images (no drift, reproducible)"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Immutable infrastructure architecture consists of the image building pipeline (creating server images with all dependencies pre-installed), the image registry (storing and versioning server images), the deployment pipeline (provisioning new servers from images, routing traffic to new servers, terminating old servers), and the monitoring system (tracking server health, image versions, deployment status). The flow begins with developers committing code changes to the repository. The image building pipeline builds a new server image (installing OS packages, application dependencies, application code, configuration), versions the image (unique version — semantic versioning, git SHA), and stores it in the image registry. The deployment pipeline provisions new servers from the new image, routes traffic to the new servers, and terminates the old servers.
        </p>
        <p>
          For production deployments, immutable infrastructure is integrated with blue-green or rolling deployment strategies (ensuring zero-downtime server replacement — traffic is always served by healthy servers). The deployment pipeline provisions new servers, runs health checks (verifying that new servers are healthy), routes traffic to new servers (load balancer updates, DNS changes), and terminates old servers (after traffic is fully shifted). If health checks fail, the deployment is rolled back (reverting to the previous image version).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/immutable-deployment-flow.svg"
          alt="Immutable Deployment Flow showing image build, server provision, traffic routing, and old server termination"
          caption="Immutable deployment flow — build new image, provision new servers, route traffic to new servers, terminate old servers — zero in-place updates"
          width={900}
          height={500}
        />

        <h3>Image Building Tools</h3>
        <p>
          <strong>Packer:</strong> An open-source tool by HashiCorp for creating identical machine images for multiple platforms (AWS AMIs, GCP machine images, Azure VM images, Docker images) from a single source configuration. Advantages: multi-platform (build images for multiple cloud providers from the same configuration), fast image building (parallel builds, caching), extensive documentation. Best for: organizations building images for multiple cloud providers, teams wanting a single tool for all image building.
        </p>
        <p>
          <strong>Docker:</strong> A container image building tool (building container images with application dependencies and configuration). Advantages: widely adopted (most popular container image building tool), large ecosystem (Docker Hub, container registries, CI/CD integrations), simple Dockerfile syntax. Best for: container-based immutable infrastructure, organizations using container orchestration (Kubernetes, ECS).
        </p>
        <p>
          <strong>Cloud Provider Image Builders:</strong> AWS EC2 Image Builder, Google Cloud Machine Images, Azure VM Image Builder. Advantages: native cloud provider integration (images are optimized for the cloud provider, built-in security scanning, automated image pipelines). Limitations: cloud-specific (only build images for the specific cloud provider). Best for: organizations using a single cloud provider, teams wanting native cloud provider tooling.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/immutable-rollback.svg"
          alt="Immutable Infrastructure Rollback showing reverting to previous server image version"
          caption="Immutable rollback — deploy previous image version, route traffic to previous servers, terminate current servers — fast, reliable, no undo complexity"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Immutable infrastructure involves trade-offs between mutable and immutable server management, image building and runtime configuration, and replacement speed and complexity. Understanding these trade-offs is essential for designing effective immutable infrastructure strategies.
        </p>

        <h3>Mutable vs. Immutable Infrastructure</h3>
        <p>
          <strong>Mutable Infrastructure:</strong> Servers are modified in-place (installing packages, changing configuration, applying patches). Advantages: simple (SSH into server, make changes), no image building pipeline needed (changes are applied directly to servers), fast for small changes (no need to build images, provision new servers, terminate old servers). Limitations: configuration drift (servers diverge from their desired state over time, different servers have different configurations), difficult debugging (if a server has an issue, debugging in-place changes is complex), difficult rollback (undoing in-place changes is complex and error-prone). Best for: small server fleets, simple applications, teams without image building expertise.
        </p>
        <p>
          <strong>Immutable Infrastructure:</strong> Servers are never modified — only replaced. Advantages: no configuration drift (servers are never modified, so they do not diverge from their desired state), easy debugging (if a server has an issue, replace it with a new server — no debugging in-place changes), easy rollback (revert to the previous image — fast, reliable, no undo complexity). Limitations: requires image building pipeline (build images with all dependencies, version images, store in registry), slower for small changes (must build images, provision new servers, terminate old servers — even for small changes). Best for: large server fleets, complex applications, teams wanting reliability and reproducibility.
        </p>

        <h3>Image Building vs. Runtime Configuration</h3>
        <p>
          <strong>Image Building (Baking):</strong> All dependencies and configuration are baked into the image at build time. Advantages: fast server startup (all dependencies are pre-installed — no runtime installation needed), reproducible (all servers are built from the same image), no runtime configuration drift (no runtime changes). Limitations: slow image building (building images takes time — installing packages, running tests), large image size (all dependencies are included in the image — large images take longer to provision). Best for: production servers where fast startup and reproducibility are critical.
        </p>
        <p>
          <strong>Runtime Configuration (Bootstrapping):</strong> Dependencies and configuration are installed at server startup (cloud-init, user data scripts, configuration management tools). Advantages: fast image building (images are minimal — no dependencies baked in, fast to build), flexible (configuration can be changed without rebuilding images). Limitations: slow server startup (dependencies are installed at startup — takes time), configuration drift (runtime configuration can diverge from desired state), less reproducible (runtime configuration may vary between servers). Best for: development servers, servers where configuration changes frequently.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/image-building-pipeline.svg"
          alt="Image Building Pipeline showing source code, dependencies, configuration, image build, versioning, and registry storage"
          caption="Image building pipeline — source code and dependencies are baked into image, image is versioned and stored in registry, servers are launched from images"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Automate Image Building:</strong> Build images through automated pipelines (Packer, Docker, cloud provider image builders — triggered by code commits, building images automatically, versioning images, storing in registry). Automated image building ensures that images are built consistently (same dependencies, same configuration, same build process), eliminating manual image building errors. Integrate image building into the CI/CD pipeline (code commit triggers image build, image is tested, image is stored in registry, deployment pipeline uses the new image).
        </p>
        <p>
          <strong>Version Images Clearly:</strong> Use clear, unique image versions (semantic versioning, git SHA, build number). Clear versioning enables reproducible deployments (same image version produces the same server), rollback (revert to the previous image version), and auditability (track which image version is deployed to which environment). Use automated versioning (git SHA for code-based versioning, build number for CI/CD-based versioning) to ensure that each image has a unique, traceable version.
        </p>
        <p>
          <strong>Test Images Before Deployment:</strong> Test images before deploying to production (run tests on servers launched from the new image, verify that the application works correctly, verify that performance is acceptable). Testing images before deployment prevents deploying broken images (images with missing dependencies, incorrect configuration, application bugs). Include image testing in the CI/CD pipeline (build image, launch test server from image, run tests, store image in registry if tests pass, discard image if tests fail).
        </p>
        <p>
          <strong>Implement Zero-Downtime Replacement:</strong> Replace servers with zero-downtime (blue-green deployment, rolling deployment — traffic is always served by healthy servers). Zero-downtime replacement ensures that users do not experience downtime during server replacement (new servers are healthy before traffic is routed to them, old servers are not terminated until traffic is fully shifted). Use load balancer health checks (new servers are added to the load balancer pool only after passing health checks), and graceful shutdown (old servers finish processing in-flight requests before termination).
        </p>
        <p>
          <strong>Store Images in Registries:</strong> Store server images in image registries (AWS AMI registry, Google Cloud Machine Images, Docker registry). Image registries provide versioning (track image versions), access control (restrict who can use which images), and lifecycle management (delete old images, retain recent images). Image registries are essential for immutable infrastructure — they store the images that servers are launched from, enabling reproducible deployments and rollback.
        </p>
        <p>
          <strong>Monitor Image Versions:</strong> Track which image version is deployed to which environment (development, staging, production). Image version monitoring provides visibility into deployment status (which image version is deployed, when, and by whom), enabling auditability (track deployment history) and rollback (revert to the previous image version if issues are detected). Set up alerts for image version changes (notify the team when image version changes, when deployment fails, when rollback occurs).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Manual Image Building:</strong> Building images manually (SSHing into a server, installing packages, creating an image from the server). Manual image building is error-prone (missing dependencies, incorrect configuration), non-reproducible (different images are built differently), and untrackable (no record of how the image was built). Always build images through automated pipelines (Packer, Docker, cloud provider image builders — triggered by code commits, building images automatically, versioning images).
        </p>
        <p>
          <strong>Not Testing Images:</strong> Deploying images without testing them on servers. Untested images may contain errors (missing dependencies, incorrect configuration, application bugs) that cause production failures. Always test images before deploying to production (launch test server from image, run tests, verify that the application works correctly, verify that performance is acceptable).
        </p>
        <p>
          <strong>Long Server Startup Times:</strong> Images that take a long time to start (installing dependencies at startup, running initialization scripts). Long startup times delay server replacement (new servers take a long time to become healthy, increasing deployment time). Bake all dependencies into the image (no runtime installation), optimize application startup time (reduce warmup delay), and use health checks (verify that servers are healthy before routing traffic to them).
        </p>
        <p>
          <strong>Not Terminating Old Servers:</strong> Provisioning new servers without terminating old servers (accumulating servers over time, increasing costs). Old servers that are not terminated continue to incur costs (paying for unused servers), and may serve outdated traffic (if the load balancer is not updated to remove old servers). Always terminate old servers after traffic is fully shifted to new servers, and monitor server count (ensure that old servers are terminated, not accumulating).
        </p>
        <p>
          <strong>Ignoring Configuration Drift in Images:</strong> Building images with inconsistent dependencies or configuration (different images have different dependencies, different configuration). This causes environment-specific bugs (application works in development but fails in production — different images, different dependencies). Ensure that images are built consistently (same dependencies, same configuration, same build process — automated image building pipelines ensure consistency).
        </p>
        <p>
          <strong>Not Versioning Images:</strong> Building images without unique versions (images are overwritten, no record of previous versions). Without versioning, rollback is impossible (cannot revert to the previous image version — it has been overwritten). Always version images clearly (semantic versioning, git SHA, build number — unique, traceable, auditable), and store all image versions in the registry (do not overwrite previous versions).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Container-Based Deployments</h3>
        <p>
          Container-based deployments (Kubernetes, Docker Swarm, ECS) use immutable infrastructure principles — container images are immutable (once built, they do not change), containers are launched from images (no in-place updates), and containers are replaced with new images for updates (not modified in-place). This pattern is used by organizations of all sizes to manage containerized applications — ensuring that containers are reproducible (same image produces the same container), reliable (no configuration drift), and easy to rollback (revert to the previous image).
        </p>

        <h3>Cloud AMI Deployments</h3>
        <p>
          Organizations deploying to AWS use AMIs (Amazon Machine Images) for immutable infrastructure — AMIs are built through automated pipelines (Packer — installing OS packages, application dependencies, application code, configuration), versioned (unique AMI ID), and deployed through server replacement (provisioning new EC2 instances from the new AMI, routing traffic to new instances, terminating old instances). This pattern is used by organizations like Netflix, Airbnb, and Pinterest to manage large-scale EC2 deployments — ensuring that instances are reproducible, reliable, and easy to rollback.
        </p>

        <h3>Golden Image Pipelines</h3>
        <p>
          Organizations managing large server fleets use golden image pipelines — building &quot;golden&quot; images (standardized server images with all dependencies, security patches, baseline configuration) through automated pipelines, and deploying servers from golden images (all servers are launched from the same golden image, ensuring consistency). Golden image pipelines ensure that all servers are identical (same image, same dependencies, same configuration), eliminating environment-specific bugs and simplifying debugging. This pattern is used by enterprises like Capital One, GE, and BMW to manage large-scale server fleets.
        </p>

        <h3>Compliant Infrastructure</h3>
        <p>
          Organizations in regulated industries (healthcare, finance, government) use immutable infrastructure for compliance — servers are built from approved images (images are tested, verified, and approved by compliance teams), deployed through automated pipelines (ensuring that only approved images are deployed), and monitored for drift (ensuring that servers are not modified after deployment). Immutable infrastructure simplifies compliance auditing (all servers are built from the same approved image, ensuring consistency, reproducibility, and auditability). This pattern is essential for regulated industries where compliance is mandatory.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is immutable infrastructure and why is it important?
            </p>
            <p className="mt-2 text-sm">
              A: Immutable infrastructure is an operational model where servers are never modified in-place after deployment. Instead of updating existing servers, new servers are provisioned with the updated configuration, and old servers are terminated. Immutable infrastructure eliminates configuration drift (servers do not diverge from their desired state), ensures reproducibility (all servers are built from the same image), simplifies debugging (replace servers instead of debugging in-place changes), and simplifies rollback (revert to the previous image). It is important for large server fleets where consistency, reliability, and reproducibility are critical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between mutable and immutable infrastructure?
            </p>
            <p className="mt-2 text-sm">
              A: Mutable infrastructure allows servers to be modified in-place (installing packages, changing configuration, applying patches). This causes configuration drift (servers diverge from their desired state), difficult debugging (debugging in-place changes is complex), and difficult rollback (undoing in-place changes is error-prone). Immutable infrastructure never modifies servers — only replaces them. This eliminates configuration drift (servers are never modified), simplifies debugging (replace servers instead of debugging), and simplifies rollback (revert to the previous image). Mutable is simpler for small fleets, immutable is essential for large fleets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you build server images for immutable infrastructure?
            </p>
            <p className="mt-2 text-sm">
              A: Use automated image building tools (Packer for VMs, Docker for containers, cloud provider image builders — AWS EC2 Image Builder, GCP Machine Images). Image building pipelines install OS packages, application dependencies, application code, and configuration into the image, version the image (unique version — semantic versioning, git SHA, build number), and store it in the image registry. Images are tested before deployment (launch test server from image, run tests, verify application works), and only tested images are deployed to production. Automated image building ensures consistency, reproducibility, and auditability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you rollback in immutable infrastructure?
            </p>
            <p className="mt-2 text-sm">
              A: Rollback in immutable infrastructure is simple and reliable — deploy the previous image version (revert to the previous image in the image registry), provision new servers from the previous image, route traffic to the new (old) servers (load balancer updates, DNS changes), and terminate the current servers. Rollback is fast (no undo complexity — no need to undo in-place changes, just deploy the previous image), reliable (previous image is known to work — it was working before the current deployment), and auditable (rollback is tracked in image version history).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you achieve zero-downtime server replacement in immutable infrastructure?
            </p>
            <p className="mt-2 text-sm">
              A: Use blue-green deployment (provision new servers from the new image, route traffic to new servers, terminate old servers — instant traffic switch) or rolling deployment (replace servers one at a time or in batches, routing traffic to healthy servers as they become available). Both strategies ensure that traffic is always served by healthy servers (new servers are healthy before traffic is routed to them, old servers are not terminated until traffic is fully shifted). Use load balancer health checks (new servers are added to the load balancer pool only after passing health checks), and graceful shutdown (old servers finish processing in-flight requests before termination).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the challenges of immutable infrastructure?
            </p>
            <p className="mt-2 text-sm">
              A: Challenges include: image building complexity (building images with all dependencies takes time and expertise — requires automated image building pipelines), slow image building (building images takes time — installing packages, running tests, creating images — can take 10-30 minutes), large image size (images include all dependencies — large images take longer to provision), and server replacement delay (provisioning new servers, routing traffic, terminating old servers takes time — 3-15 minutes for VMs, 30 seconds - 3 minutes for containers). These challenges are offset by the benefits of immutable infrastructure (no configuration drift, reproducibility, easy rollback).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <div className="space-y-3">
          <p>
            <a
              href="https://martinfowler.com/bliki/ImmutableServer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Martin Fowler — Immutable Server
            </a>
          </p>
          <p>
            <a
              href="https://www.packer.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Packer Documentation — HashiCorp
            </a>
          </p>
          <p>
            <a
              href="https://docs.docker.com/build/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Docker Image Building Documentation
            </a>
          </p>
          <p>
            <a
              href="https://sre.google/sre-book/table-of-contents/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Site Reliability Engineering — Release Engineering
            </a>
          </p>
          <p>
            <a
              href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS — Amazon Machine Images (AMI) Documentation
            </a>
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
