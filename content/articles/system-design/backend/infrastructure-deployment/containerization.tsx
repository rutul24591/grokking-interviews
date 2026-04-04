"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-containerization",
  title: "Containerization",
  description:
    "Comprehensive guide to containerization covering Docker, container images, isolation, multi-stage builds, security considerations, and production-scale implementation patterns.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "containerization",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "containerization",
    "docker",
    "container images",
    "isolation",
    "security",
  ],
  relatedTopics: [
    "container-orchestration",
    "infrastructure-as-code",
    "ci-cd-pipelines",
  ],
};

export default function ContainerizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Containerization</strong> is the practice of packaging applications and their dependencies into lightweight, portable, isolated units called containers. Unlike virtual machines that virtualize the entire operating system (including kernel, system libraries, and user space), containers virtualize only the user space — they share the host OS kernel while maintaining isolated file systems, network interfaces, process trees, and resource limits. This makes containers significantly lighter than VMs (megabytes instead of gigabytes), faster to start (seconds instead of minutes), and more resource-efficient (higher density per host).
        </p>
        <p>
          For staff-level engineers, containerization represents a fundamental shift from infrastructure-centric to application-centric deployment. Before containers, deployments required provisioning VMs, installing dependencies, configuring environments, and managing drift between environments (development, staging, production). Containers solve this by packaging the application and its dependencies into a single, immutable artifact (the container image) that runs identically across all environments. This eliminates &quot;works on my machine&quot; problems, enables reproducible builds, and simplifies deployment pipelines.
        </p>
        <p>
          Containerization involves several technical considerations. Container images (layered file system snapshots that define the container&apos;s contents, built from Dockerfiles using a layered build process). Container isolation (namespaces for process, network, file system isolation; cgroups for resource limits — CPU, memory, disk I/O). Container registries (centralized storage for container images — Docker Hub, Amazon ECR, Google Container Registry, GitHub Container Registry). Multi-stage builds (building images in multiple stages to minimize final image size — compile in one stage, copy artifacts to a minimal runtime stage). Security (container escape vulnerabilities, image vulnerability scanning, least-privilege containers, non-root users, read-only file systems).
        </p>
        <p>
          The business case for containerization is deployment reliability and developer velocity. Containers ensure that applications run identically across all environments (development, staging, production), eliminating environment-specific bugs. Containers enable rapid scaling (start new container instances in seconds, not minutes). Containers simplify deployment pipelines (build once, run anywhere — the same container image is promoted through environments, not rebuilt for each). For organizations practicing continuous deployment, containerization is essential for maintaining deployment velocity while managing environment consistency.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Container Images</strong> are layered file system snapshots that define the container&apos;s contents. They are built from Dockerfiles, which are text files containing build instructions such as base image, dependencies, application code, configuration, and startup command. Each Dockerfile instruction creates a layer (file system diff), and layers are cached for efficient rebuilds where unchanged layers are reused from cache. Images are immutable — once built, they do not change. Running a container creates a writable layer on top of the image, but the image itself remains unchanged.
        </p>
        <p>
          <strong>Container Runtime</strong> is the software that runs containers on a host. Docker is the most popular container runtime, providing CLI, daemon, and image building, and is the dominant choice. Alternatives exist including containerd (the industry-standard container runtime used by Kubernetes), CRI-O (a lightweight container runtime designed specifically for Kubernetes), and Podman (a daemonless container runtime compatible with Docker CLI). The container runtime is responsible for pulling images, creating containers, managing isolation through namespaces and cgroups, and executing the container&apos;s startup command.
        </p>
        <p>
          <strong>Namespaces</strong> are a Linux kernel feature that provides isolation for containers. Each container runs in its own set of namespaces — process namespace where containers see only their own processes not host processes, network namespace where containers have their own network interfaces, IP addresses, and routing tables, file system namespace where containers have their own root file system isolated from the host, user namespace where containers map container users to different host users preventing privilege escalation, and IPC namespace where containers have their own inter-process communication resources. Namespaces ensure that containers cannot see or interfere with each other or the host.
        </p>
        <p>
          <strong>Cgroups (Control Groups)</strong> are a Linux kernel feature that provides resource limits for containers. Cgroups limit CPU usage including percentage of CPU cores and CPU shares, memory usage including maximum memory and swap limits, disk I/O including read/write bandwidth and IOPS, and network bandwidth. Cgroups prevent containers from consuming all host resources — a single runaway container cannot crash the host by consuming all CPU or memory. Cgroups are essential for multi-tenant container hosts running multiple containers on the same host, each with guaranteed resource limits.
        </p>
        <p>
          <strong>Multi-Stage Builds</strong> build container images in multiple stages to minimize final image size. The first stage compiles the application by installing build tools, compiling source code, and running tests. The second stage copies only the compiled artifacts to a minimal runtime image such as distroless, Alpine, or scratch. Multi-stage builds reduce image size significantly from hundreds of MB to tens of MB, which speeds up image pulls, reduces storage costs, and minimizes the attack surface because fewer packages mean fewer vulnerabilities.
        </p>
        <p>
          <strong>Container Registries</strong> are centralized storage for container images. Developers push built images to registries, and deployment systems pull images from registries. Registries provide versioning through image tags such as latest, semantic versions, or git SHA, access control for private images and team-level permissions, vulnerability scanning for automatic scanning of images for known vulnerabilities, and image promotion for moving images between environments such as dev registry, staging registry, and production registry. Popular registries include Docker Hub, Amazon ECR, Google Container Registry, GitHub Container Registry, and self-hosted registries like Harbor and Nexus.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/container-image-layers.svg"
          alt="Container Image Layers showing base image, dependency layers, application layer, and the final immutable image"
          caption="Container image layers — each Dockerfile instruction creates a layer, layers are cached for efficient rebuilds, final image is immutable"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Containerization architecture consists of the build pipeline (creating container images from source code), the registry (storing and distributing images), the runtime (executing containers on hosts), and the orchestration layer (managing multiple containers across multiple hosts — covered in the Container Orchestration article). The flow begins with developers writing a Dockerfile (defining the base image, dependencies, application code, configuration, and startup command). The build pipeline builds the image (executing Dockerfile instructions, creating layers, caching unchanged layers), pushes the image to the registry, and the deployment system pulls the image from the registry and runs it on container hosts.
        </p>
        <p>
          For production deployments, the container image is built once (with a unique tag — git SHA, semantic version, or build number) and promoted through environments (development, staging, production). The same image runs in all environments, ensuring consistency. Environment-specific configuration (API endpoints, feature flags, database URLs) is injected at runtime (environment variables, mounted configuration files, secret management systems), not baked into the image. This ensures that the image is immutable (same code, same dependencies) across all environments, with only configuration varying.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/container-build-pipeline.svg"
          alt="Container Build Pipeline showing source code, Dockerfile, image build, registry push, and deployment pull"
          caption="Container build pipeline — source code and Dockerfile produce image, image pushed to registry, deployment pulls image and runs container with runtime configuration"
          width={900}
          height={500}
        />

        <h3>Container vs. Virtual Machine</h3>
        <p>
          <strong>Virtual Machines:</strong> Virtualize the entire operating system (kernel, system libraries, user space). Each VM runs its own OS kernel, has its own system libraries, and requires a hypervisor (software layer between hardware and VMs). Advantages: strong isolation (each VM has its own kernel, kernel-level attacks cannot cross VM boundaries), OS flexibility (different VMs can run different OS kernels — Linux, Windows). Limitations: heavy resource usage (gigabytes per VM), slow startup (minutes), lower density (fewer VMs per host). Best for: running different OS kernels on the same host, strong isolation requirements (multi-tenant hosting, untrusted code execution).
        </p>
        <p>
          <strong>Containers:</strong> Virtualize only the user space, sharing the host OS kernel. Each container has its own file system, network interface, process tree, and resource limits, but shares the host kernel. Advantages: lightweight resource usage (megabytes per container), fast startup (seconds), higher density (more containers per host). Limitations: weaker isolation (containers share the host kernel, kernel-level attacks can affect all containers), OS constraint (all containers must use the same OS kernel as the host — Linux containers on Linux hosts). Best for: application deployment, microservices, CI/CD pipelines, development environments.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/container-vs-vm.svg"
          alt="Container vs Virtual Machine comparison showing architecture differences in isolation, resource usage, and startup time"
          caption="Container vs VM — containers share host kernel (lightweight, fast), VMs virtualize entire OS (heavier, slower, stronger isolation)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Containerization involves trade-offs between image size and build time, isolation and performance, and convenience and security. Understanding these trade-offs is essential for designing effective containerization strategies.
        </p>

        <h3>Base Image Selection</h3>
        <p>
          <strong>Full OS Images (Ubuntu, Debian, CentOS):</strong> Include complete OS user space (package managers, system libraries, utilities). Advantages: convenient (familiar OS environment, easy debugging with standard tools). Limitations: large image size (hundreds of MB), large attack surface (many packages = many vulnerabilities). Best for: development images (where debugging convenience is prioritized), applications requiring specific OS packages.
        </p>
        <p>
          <strong>Minimal Images (Alpine):</strong> Include minimal OS user space (musl libc, busybox utilities). Advantages: small image size (5-10 MB), small attack surface (fewer packages = fewer vulnerabilities). Limitations: compatibility issues (musl libc is not fully compatible with glibc, some applications do not work on Alpine), debugging challenges (limited tools available in the image). Best for: production images where size and security are prioritized.
        </p>
        <p>
          <strong>Distroless Images:</strong> Include only the application and its runtime dependencies (no package manager, no shell, no utilities). Advantages: smallest image size (tens of MB), smallest attack surface (no unnecessary packages), no shell access (prevents container escape via shell exploits). Limitations: difficult to debug (no shell, no debugging tools — must run debug sidecar containers). Best for: production images where security is critical (public-facing services, multi-tenant hosting).
        </p>

        <h3>Multi-Stage vs. Single-Stage Builds</h3>
        <p>
          <strong>Single-Stage Builds:</strong> Build and run in the same image. Advantages: simple Dockerfile (single stage, easy to understand). Limitations: large image size (build tools, source code, and dependencies are all in the final image), large attack surface (build tools in production image). Best for: simple applications, development images.
        </p>
        <p>
          <strong>Multi-Stage Builds:</strong> Build in one stage, run in another. Advantages: small final image (only runtime artifacts are copied to the final stage, build tools and source code are discarded), small attack surface (no build tools in production image). Limitations: more complex Dockerfile (multiple stages, copy instructions between stages). Best for: production images where size and security are prioritized.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/multi-stage-build.svg"
          alt="Multi-Stage Build showing build stage with tools and source, then runtime stage with only compiled artifacts"
          caption="Multi-stage build — build stage installs tools and compiles, runtime stage copies only artifacts to minimal base image, reducing final image size by 80-90%"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Use Multi-Stage Builds.</strong> Build in one stage, run in another. Install build tools and compile source code in the build stage, then copy only the compiled artifacts to a minimal runtime stage such as Alpine or distroless. This reduces final image size by 80-90 percent, speeds up image pulls, reduces storage costs, and minimizes the attack surface. Multi-stage builds are the single most impactful optimization for container images.
        </p>
        <p>
          <strong>Run as Non-Root User.</strong> By default, containers run as the root user (UID 0). If an attacker escapes the container via a container escape vulnerability, they gain root access to the host. Running containers as a non-root user limits the damage of a container escape because the attacker gains only non-root access to the host. Use the USER instruction in Dockerfiles to set a non-root user, and ensure that the application does not require root privileges.
        </p>
        <p>
          <strong>Use Read-Only File Systems.</strong> Mount the container&apos;s root file system as read-only using the docker run --read-only flag or Kubernetes securityContext.readOnlyRootFilesystem. This prevents attackers from writing malicious files to the container&apos;s file system, even if they escape the container. Applications that need to write data should use mounted volumes such as tmpfs, host paths, or persistent volumes instead of the root file system.
        </p>
        <p>
          <strong>Pin Base Image Versions.</strong> Use specific base image versions such as node:20.11-alpine instead of node:latest. Pinning versions ensures reproducible builds where the same Dockerfile always produces the same image, not a different image when the latest tag changes. It also prevents unexpected breakage because a new latest version may have breaking changes. Use semantic versions or SHA digests for maximum reproducibility.
        </p>
        <p>
          <strong>Scan Images for Vulnerabilities.</strong> Use vulnerability scanning tools such as Trivy, Snyk, Docker Scout, or AWS ECR scanning to scan container images for known CVEs. Scan images before pushing to the registry to catch vulnerabilities early, and scan images in the registry to catch new vulnerabilities as they are discovered. Block deployments of images with critical vulnerabilities, and set up automated alerts for new vulnerabilities in deployed images.
        </p>
        <p>
          <strong>Minimize Layers.</strong> Each Dockerfile instruction creates a layer. Excessive layers increase image size because each layer has metadata overhead and slow down image pulls because more layers must be downloaded. Combine related instructions such as RUN apt-get update and apt-get install in a single RUN instruction, not separate instructions, to minimize layers. Use multi-stage builds to discard unnecessary layers like build tools and source code from the final image.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Running as Root.</strong> Containers running as the root user (UID 0) by default is one of the most common and critical container security mistakes. If an attacker escapes the container, they gain root access to the host. Always run containers as non-root users using the USER instruction in Dockerfiles, and ensure that the application does not require root privileges.
        </p>
        <p>
          <strong>Using Latest Tag.</strong> Using the latest tag for base images such as node:latest or python:latest instead of pinned versions causes non-reproducible builds because the latest tag changes over time, meaning the same Dockerfile produces different images on different days. It also prevents debugging because you do not know which version was used to build the image. Always pin base image versions such as node:20.11-alpine or python:3.12-slim.
        </p>
        <p>
          <strong>Large Images.</strong> Building images that include build tools, source code, and development dependencies results in images hundreds of MB in size. Large images are slow to pull which slows deployments, expensive to store, and have large attack surfaces because more packages mean more vulnerabilities. Use multi-stage builds to minimize final image size — build in one stage, run in another, copying only compiled artifacts.
        </p>
        <p>
          <strong>Not Scanning for Vulnerabilities.</strong> Deploying container images without scanning for known vulnerabilities is dangerous because images may contain packages with known CVEs which attackers can exploit. Always scan images before deployment using tools like Trivy, Snyk, or Docker Scout, block deployments with critical vulnerabilities, and set up automated alerts for new vulnerabilities in deployed images.
        </p>
        <p>
          <strong>Storing Secrets in Images.</strong> Baking secrets such as API keys, database passwords, and TLS certificates into container images is a critical security risk. Images are stored in registries potentially accessible to many users, and images are versioned so secrets persist in old image versions. Secrets should be injected at runtime via environment variables from secret management systems or mounted secret files using tools like Kubernetes Secrets, HashiCorp Vault, or AWS Secrets Manager, not baked into images.
        </p>
        <p>
          <strong>Ignoring Resource Limits.</strong> Running containers without resource limits such as CPU or memory limits allows a single container to consume all host resources including CPU, memory, and disk I/O, crashing other containers and the host itself. Always set resource limits using Docker --cpus and --memory flags or Kubernetes resource requests and limits to prevent runaway containers from affecting the host and other containers.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Microservices Deployment</h3>
        <p>
          Microservices architectures use containerization to deploy each service as an independent container. Each service has its own Dockerfile, is built into its own image, and runs in its own container with isolated dependencies. Containers enable independent scaling (scale individual services based on demand), independent deployment (deploy one service without affecting others), and technology diversity (different services use different languages, frameworks, dependencies — all isolated in their own containers). This is the dominant use case for containerization in modern application architectures.
        </p>

        <h3>CI/CD Pipeline Environments</h3>
        <p>
          CI/CD pipelines use containerization to provide consistent build environments. Each build runs in a fresh container with known dependencies, eliminating environment-specific build failures (&quot;works on my machine&quot;). Build containers are discarded after each build (clean state for the next build), ensuring that builds are reproducible (same dependencies, same tools, same configuration). This pattern is used by GitHub Actions, GitLab CI, CircleCI, and Jenkins (Docker agents).
        </p>

        <h3>Development Environments</h3>
        <p>
          Development teams use containerization to provide consistent development environments. Instead of each developer installing dependencies locally (different versions, different configurations, different OS), developers run the application in containers (same dependencies, same configuration, same OS — regardless of host OS). Docker Compose defines multi-service development environments (application, database, cache, message queue — all in containers), enabling developers to start the entire environment with a single command (docker compose up).
        </p>

        <h3>Edge Computing</h3>
        <p>
          Edge computing deployments use containerization to deploy applications to edge locations (CDN edge nodes, IoT gateways, 5G base stations). Containers are lightweight (fit on resource-constrained edge devices), portable (same image runs on x86, ARM, and other architectures), and isolated (edge applications do not interfere with each other). Container orchestration at the edge (K3s, KubeEdge, OpenYurt) manages container deployment, scaling, and updates across thousands of edge locations.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between containers and virtual machines?
            </p>
            <p className="mt-2 text-sm">
              A: Virtual machines virtualize the entire operating system — each VM runs its own OS kernel, has its own system libraries, and requires a hypervisor. Containers virtualize only the user space — they share the host OS kernel while maintaining isolated file systems, network interfaces, process trees, and resource limits. VMs are heavier (gigabytes per VM), slower to start (minutes), and provide stronger isolation (each VM has its own kernel). Containers are lighter (megabytes per container), faster to start (seconds), and provide weaker isolation (containers share the host kernel). VMs are best for running different OS kernels on the same host or strong isolation requirements. Containers are best for application deployment, microservices, and CI/CD pipelines.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are multi-stage builds and why should you use them?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-stage builds build container images in multiple stages — the first stage installs build tools and compiles source code, the second stage copies only the compiled artifacts to a minimal runtime image (Alpine, distroless). Multi-stage builds reduce final image size by 80-90 percent (build tools, source code, and development dependencies are discarded), speed up image pulls (smaller images download faster), reduce storage costs (less registry storage), and minimize the attack surface (fewer packages = fewer vulnerabilities, no build tools in production image). Multi-stage builds are the single most impactful optimization for container images.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you secure container images?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: run as non-root user (USER instruction in Dockerfiles — prevents root access if container is escaped), use read-only file systems (docker run --read-only — prevents writing malicious files), pin base image versions (node:20.11-alpine, not node:latest — ensures reproducible builds), scan for vulnerabilities (Trivy, Snyk, Docker Scout — catch known CVEs before deployment), do not store secrets in images (inject at runtime via secret management systems), use minimal base images (distroless, Alpine — smaller attack surface), and set resource limits (--cpus, --memory — prevent runaway containers from crashing the host). These practices collectively minimize the risk of container-based attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are namespaces and cgroups, and how do they enable container isolation?
            </p>
            <p className="mt-2 text-sm">
              A: Namespaces are a Linux kernel feature that provides isolation — each container runs in its own set of namespaces (process namespace sees only its own processes, network namespace has its own network interfaces and IP addresses, file system namespace has its own root file system, user namespace maps container users to different host users). Cgroups (control groups) are a Linux kernel feature that provides resource limits — each container is assigned CPU limits (percentage of CPU cores), memory limits (maximum memory, swap limits), disk I/O limits (bandwidth, IOPS), and network bandwidth limits. Namespaces ensure that containers cannot see or interfere with each other or the host. Cgroups ensure that containers cannot consume all host resources (a single runaway container cannot crash the host).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle secrets in containerized applications?
            </p>
            <p className="mt-2 text-sm">
              A: Never bake secrets into container images (API keys, database passwords, TLS certificates). Secrets should be injected at runtime via secret management systems. Options include: environment variables from secret management systems (Kubernetes Secrets, HashiCorp Vault, AWS Secrets Manager — secrets are stored securely, injected into containers at runtime), mounted secret files (secrets are stored as files in a secure location, mounted into containers as volumes — applications read secrets from files, not environment variables), and secret rotation (secrets are rotated automatically, containers reload secrets without restart — HashiCorp Vault Agent, AWS Secrets Manager rotation). Never store secrets in Dockerfiles, image layers, or environment variables in plain text.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize container image size?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: use multi-stage builds (build in one stage, run in another — discard build tools and source code), use minimal base images (Alpine, distroless — not full OS images), combine RUN instructions (each instruction creates a layer — combine related instructions to minimize layers), remove unnecessary files (clean package manager caches, remove build artifacts, delete documentation files in the same RUN instruction that installs packages), use .dockerignore (exclude unnecessary files from the build context — node_modules, .git, test files), and use slim runtime images (node:20-slim instead of node:20, python:3.12-slim instead of python:3.12). These strategies can reduce image size from hundreds of MB to tens of MB.
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
              href="https://docs.docker.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Docker Documentation
            </a>
          </p>
          <p>
            <a
              href="https://github.com/opencontainers/image-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Container Initiative (OCI) Image Specification
            </a>
          </p>
          <p>
            <a
              href="https://www.usenix.org/legacy/event/hotos09/tech/full_papers/merkel.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Merkel, D. — &quot;Docker: Lightweight Linux Containers for Consistent Development and Deployment&quot; (USENIX)
            </a>
          </p>
          <p>
            <a
              href="https://sre.google/sre-book/table-of-contents/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Site Reliability Engineering — Release, Deployment, and Production Systems
            </a>
          </p>
          <p>
            <a
              href="https://dataintensive.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kleppmann, M. — &quot;Designing Data-Intensive Applications&quot; (Containerization in Distributed Systems Context)
            </a>
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
