"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-container-orchestration",
  title: "Container Orchestration",
  description:
    "Comprehensive guide to container orchestration covering Kubernetes, pods, services, deployments, auto-scaling, self-healing, and production-scale implementation patterns.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "container-orchestration",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "container orchestration",
    "kubernetes",
    "pods",
    "services",
    "deployments",
    "auto-scaling",
  ],
  relatedTopics: [
    "containerization",
    "auto-scaling",
    "service-discovery",
  ],
};

export default function ContainerOrchestrationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Container orchestration</strong> is the practice of automating the deployment, scaling, networking, and management of containers across multiple hosts. While containerization packages applications into portable units, orchestration manages those units at scale — scheduling containers on hosts, load balancing traffic between containers, auto-scaling based on demand, self-healing failed containers, rolling out updates without downtime, and managing configuration and secrets. Without orchestration, managing containers across dozens or hundreds of hosts requires manual intervention, which is impractical for production systems.
        </p>
        <p>
          For staff-level engineers, container orchestration is the foundation of modern cloud-native infrastructure. Kubernetes (the dominant container orchestration platform, originally designed by Google and now maintained by the Cloud Native Computing Foundation) has become the industry standard, adopted by organizations of all sizes. Kubernetes provides a declarative API (you describe the desired state — how many replicas, what image, what ports, what resource limits — and Kubernetes makes it happen), a rich ecosystem of extensions (Helm charts, operators, service meshes), and a large talent pool (Kubernetes skills are widely available). Alternative orchestration platforms exist (Docker Swarm, Amazon ECS, Nomad) but have significantly smaller market share.
        </p>
        <p>
          Container orchestration involves several technical concepts. Pods (the smallest deployable unit in Kubernetes — one or more containers that share network, storage, and lifecycle — containers in a pod are scheduled together on the same host). Services (stable network endpoints that load balance traffic across pods — services provide a stable IP address and DNS name, even as pods are created, destroyed, and rescheduled). Deployments (declarative specifications for pod replicas — you specify the desired number of replicas, the container image, and the update strategy, and Kubernetes manages the rollout). Auto-scaling (automatically adjusting the number of pod replicas based on metrics — CPU usage, memory usage, custom metrics). Self-healing (automatically restarting failed pods, rescheduling pods from failed nodes, replacing unhealthy pods).
        </p>
        <p>
          The business case for container orchestration is operational efficiency and reliability. Orchestration automates tasks that would otherwise require manual intervention (deploying updates, scaling up and down, recovering from failures), reducing operational overhead and human error. Orchestration enables high availability (multiple replicas across multiple hosts, automatic failover), efficient resource utilization (packing containers onto hosts to maximize utilization), and rapid deployment (rolling out updates without downtime). For organizations running containerized applications in production, orchestration is essential for managing complexity at scale.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Pods</strong> are the smallest deployable unit in Kubernetes. A pod contains one or more containers that share network namespace (same IP address, same port space), storage volumes (shared file system), and lifecycle (containers in a pod are scheduled together on the same host, start together, and stop together). Most pods contain a single container (the application), but sidecar patterns use multiple containers in a pod (application container plus logging container, application container plus proxy container). Pods are ephemeral — they are created, destroyed, and recreated frequently during scaling, updates, and node failures.
        </p>
        <p>
          <strong>Services</strong> are stable network endpoints that load balance traffic across pods. Pods are ephemeral (they are created and destroyed frequently, with changing IP addresses), so services provide a stable IP address and DNS name that does not change. Services route traffic to healthy pods based on readiness probes, distribute traffic across pods using round-robin or least connections, and provide service discovery (other pods can reach the service by its DNS name, without knowing individual pod IPs). Service types include ClusterIP (internal only, reachable within the cluster), NodePort (exposed on each node&apos;s IP, reachable from outside the cluster), and LoadBalancer (provisioned cloud load balancer, reachable from the internet).
        </p>
        <p>
          <strong>Deployments</strong> are declarative specifications for pod replicas. You specify the desired number of replicas, the container image, resource requests and limits, and the update strategy (rolling update, recreate, blue-green). Kubernetes manages the deployment — creating pods, monitoring their health, replacing failed pods, and rolling out updates according to the strategy. Deployments are the primary way to run stateless applications in Kubernetes (web servers, APIs, microservices).
        </p>
        <p>
          <strong>ReplicaSets</strong> ensure that a specified number of pod replicas are running at all times. Deployments manage ReplicaSets (creating new ReplicaSets for updates, scaling old ReplicaSets down), and ReplicaSets manage pods (creating new pods, deleting excess pods). You rarely interact with ReplicaSets directly — you interact with Deployments, which manage ReplicaSets for you.
        </p>
        <p>
          <strong>ConfigMaps and Secrets</strong> handle configuration and secret management. ConfigMaps store non-sensitive configuration (environment variables, configuration files, command-line arguments) separately from pod specifications, enabling configuration changes without rebuilding images. Secrets store sensitive data (passwords, API keys, TLS certificates) encoded in base64 (not encrypted at rest by default — encryption at rest must be enabled separately). Both ConfigMaps and Secrets are mounted into pods as environment variables or files, injected at runtime.
        </p>
        <p>
          <strong>Probes</strong> are health checks that Kubernetes uses to manage pod lifecycle. Liveness probes check if the container is alive (if it fails, Kubernetes restarts the container). Readiness probes check if the container is ready to serve traffic (if it fails, Kubernetes removes the pod from service endpoints, so traffic is not routed to it). Startup probes check if the container has started (used for slow-starting containers — liveness and readiness probes are disabled until the startup probe succeeds). Probes are essential for self-healing (detecting and recovering from failures) and zero-downtime deployments (routing traffic only to ready pods).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/kubernetes-architecture.svg"
          alt="Kubernetes Architecture showing control plane, worker nodes, pods, services, and deployments"
          caption="Kubernetes architecture — control plane manages the cluster state, worker nodes run pods, services load balance traffic, deployments manage replicas"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Kubernetes architecture consists of the control plane (managing the cluster state — API server, etcd, scheduler, controller manager) and worker nodes (running workloads — kubelet, container runtime, kube-proxy). The flow begins with users submitting declarative specifications to the API server (desired state — deploy 3 replicas of this image, with these resource limits, behind this service). The scheduler assigns pods to worker nodes (based on resource availability, constraints, affinity rules). The kubelet on each worker node ensures that pods are running as specified (pulling images, starting containers, running probes). The controller manager monitors the cluster state and makes adjustments (scaling, self-healing, rolling updates).
        </p>
        <p>
          For application deployments, the flow involves creating a Deployment (specifying replicas, image, resource limits), a Service (exposing the deployment internally or externally), and optionally a HorizontalPodAutoscaler (auto-scaling based on metrics). Kubernetes manages the lifecycle — creating pods, monitoring their health, replacing failed pods, scaling up and down, and rolling out updates without downtime.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/pod-service-deployment.svg"
          alt="Pod, Service, and Deployment relationship showing how Deployments manage ReplicaSets which manage Pods, and Services load balance across Pods"
          caption="Pod-Service-Deployment relationship — Deployment creates ReplicaSet, ReplicaSet creates Pods, Service load balances traffic across Pods"
          width={900}
          height={500}
        />

        <h3>Deployment Strategies</h3>
        <p>
          <strong>Rolling Update:</strong> Gradually replacing old pods with new pods. Kubernetes creates new pods one at a time (or in batches), waits for them to become ready (readiness probe passes), then deletes old pods. This ensures zero-downtime deployments — traffic is always routed to healthy pods (old pods until new pods are ready, new pods after they are ready). Rolling updates are the default deployment strategy in Kubernetes.
        </p>
        <p>
          <strong>Recreate:</strong> Deleting all old pods, then creating all new pods. This causes downtime (no pods are running during the transition), but ensures that old and new versions do not run simultaneously (important for incompatible schema changes). Recreate is rarely used in production — rolling updates are preferred for zero-downtime deployments.
        </p>
        <p>
          <strong>Blue-Green:</strong> Running two identical environments (blue and green), with one serving live traffic. Deploying a new version involves deploying to the inactive environment, testing it, and switching traffic (updating the service to point to the new environment). Blue-green deployments enable instant rollback (switch traffic back to the old environment) but require double the resources (two full environments).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/kubernetes-self-healing.svg"
          alt="Kubernetes Self-Healing showing failed pod detection, automatic restart, and traffic rerouting to healthy pods"
          caption="Kubernetes self-healing — liveness probe detects failed pod, Kubernetes restarts it, readiness probe ensures only ready pods receive traffic"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Container orchestration involves trade-offs between complexity and capability, managed services and self-hosted, and Kubernetes and alternatives. Understanding these trade-offs is essential for choosing the right orchestration strategy.
        </p>

        <h3>Managed vs. Self-Hosted Kubernetes</h3>
        <p>
          <strong>Managed Kubernetes (GKE, EKS, AKS):</strong> Cloud providers manage the control plane (API server, etcd, scheduler, controller manager). Advantages: reduced operational overhead (cloud provider handles upgrades, backups, high availability), faster time to production (no need to set up and maintain the control plane), built-in integrations (cloud load balancers, storage, monitoring). Limitations: higher cost (cloud provider markup), less control (limited control plane configuration), vendor lock-in (managed services are cloud-specific). Best for: most organizations, teams without dedicated Kubernetes expertise.
        </p>
        <p>
          <strong>Self-Hosted Kubernetes (kubeadm, Kops):</strong> You manage the entire cluster (control plane and worker nodes). Advantages: lower cost (no cloud provider markup), full control (customize control plane configuration), no vendor lock-in (runs on any infrastructure). Limitations: high operational overhead (you handle upgrades, backups, high availability, troubleshooting), slower time to production (setup and maintenance take time), requires Kubernetes expertise. Best for: organizations with dedicated Kubernetes teams, on-premises deployments, multi-cloud strategies.
        </p>

        <h3>Kubernetes vs. Alternatives</h3>
        <p>
          <strong>Kubernetes:</strong> The industry standard. Advantages: comprehensive feature set (deployments, services, auto-scaling, self-healing, secrets, config maps, operators), large ecosystem (Helm charts, service meshes, monitoring tools), large talent pool (Kubernetes skills are widely available). Limitations: steep learning curve (complex API, many concepts), operational complexity (managing the control plane, networking, storage), resource overhead (control plane requires significant resources). Best for: large-scale production deployments, organizations needing comprehensive orchestration features.
        </p>
        <p>
          <strong>Docker Swarm:</strong> Simpler alternative. Advantages: easy setup (docker swarm init, done), simple API (compatible with Docker Compose files), low resource overhead. Limitations: limited feature set (no auto-scaling, limited self-healing, basic networking), small ecosystem (fewer tools, fewer third-party integrations), declining adoption (most new projects choose Kubernetes). Best for: small teams, simple deployments, development environments.
        </p>
        <p>
          <strong>Amazon ECS:</strong> AWS-native orchestration. Advantages: deep AWS integration (IAM, ALB, CloudWatch), simpler than Kubernetes (fewer concepts, easier to learn), managed by AWS (no control plane to manage). Limitations: AWS lock-in (only runs on AWS), smaller ecosystem than Kubernetes, limited multi-cloud support. Best for: AWS-centric organizations, teams wanting simpler orchestration without Kubernetes complexity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/orchestration-comparison.svg"
          alt="Orchestration Platform Comparison showing Kubernetes, Docker Swarm, and Amazon ECS feature comparison"
          caption="Orchestration comparison — Kubernetes (comprehensive, complex, large ecosystem), Docker Swarm (simple, limited), Amazon ECS (AWS-native, simpler)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Set Resource Requests and Limits.</strong> Always specify CPU and memory requests (guaranteed resources for the pod) and limits (maximum resources the pod can use). Requests ensure that pods are scheduled on nodes with sufficient resources, preventing oversubscription. Limits prevent runaway pods from consuming all node resources, which would cause node crashes. Without requests and limits, Kubernetes cannot schedule pods efficiently because it does not know how much resources each pod needs, and runaway pods can crash nodes.
        </p>
        <p>
          <strong>Use Liveness and Readiness Probes.</strong> Configure liveness probes to restart failed containers and readiness probes to remove unhealthy pods from service endpoints. Liveness probes enable self-healing by automatically restarting failed containers. Readiness probes enable zero-downtime deployments because traffic is routed only to ready pods — during deployment, new pods are not added to the service until they pass the readiness probe. Without probes, Kubernetes cannot detect or recover from application-level failures where the container is running but the application is not responding.
        </p>
        <p>
          <strong>Use Namespaces for Isolation.</strong> Organize resources into namespaces such as development, staging, production, team-a, and team-b. Namespaces provide logical isolation where resources in different namespaces do not conflict, enable resource quotas to limit resource usage per namespace, and support access control through RBAC policies per namespace. Namespaces are essential for multi-tenant clusters where multiple teams or environments share the same cluster.
        </p>
        <p>
          <strong>Use Declarative Configuration.</strong> Manage Kubernetes resources as YAML files in version control, not as imperative commands like kubectl run or kubectl expose. Declarative configuration enables version control to track changes and roll back to previous versions, code review to review changes before applying, and reproducibility to apply the same configuration to multiple environments. Use GitOps tools like ArgoCD or Flux to automate the synchronization of Git repositories with cluster state.
        </p>
        <p>
          <strong>Implement Horizontal Pod Auto-Scaling.</strong> Use HorizontalPodAutoscaler (HPA) to automatically adjust the number of pod replicas based on metrics such as CPU usage, memory usage, or custom metrics like requests per second. HPA ensures that applications scale up during high demand with more replicas to handle increased traffic and scale down during low demand with fewer replicas to reduce costs. Without HPA, you must manually scale applications, where over-provisioning wastes resources and under-provisioning causes performance issues.
        </p>
        <p>
          <strong>Use Pod Disruption Budgets.</strong> Configure PodDisruptionBudgets (PDBs) to ensure that a minimum number of pod replicas are available during voluntary disruptions such as node drains, cluster upgrades, and rolling updates. PDBs prevent Kubernetes from disrupting too many pods simultaneously, which would cause service outages. Without PDBs, Kubernetes may disrupt all pods during a node drain if all pods are on the same node, causing a service outage.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Not Setting Resource Limits.</strong> Running pods without CPU and memory limits is one of the most common causes of cluster instability. Without limits, a single pod can consume all node resources including CPU and memory, crashing other pods and the node itself. Always set resource requests and limits for all pods to prevent this.
        </p>
        <p>
          <strong>Ignoring Probe Configuration.</strong> Running pods without liveness and readiness probes means Kubernetes cannot detect application-level failures. The container may be running, but the application is not responding, and traffic is routed to unhealthy pods causing user-facing errors. Always configure liveness and readiness probes for all pods.
        </p>
        <p>
          <strong>Running Single Replicas.</strong> Running production workloads with a single replica provides no high availability. If the pod fails, the service is down until Kubernetes restarts it. Always run at least 2 replicas for production workloads, distributed across multiple nodes using pod anti-affinity.
        </p>
        <p>
          <strong>Not Using Namespaces.</strong> Running all workloads in the default namespace means there is no logical isolation. Resources conflict, there are no resource quotas, and no access control per team or environment. Always use namespaces to organize resources into development, staging, production, team-a, and team-b.
        </p>
        <p>
          <strong>Manual Configuration.</strong> Applying Kubernetes resources imperatively through kubectl run or kubectl expose instead of declaratively through YAML files in version control is not versioned, not reviewable, and not reproducible. Always use declarative configuration with YAML files and GitOps for automated synchronization.
        </p>
        <p>
          <strong>Oversizing Clusters.</strong> Provisioning more node capacity than needed wastes resources through over-provisioning. Without auto-scaling via Cluster Autoscaler, clusters are statically sized — over-provisioning means paying for unused capacity, while under-provisioning causes performance issues because there is not enough capacity for workloads. Use Cluster Autoscaler to automatically adjust node count based on pending pods, scaling up when pods cannot be scheduled and scaling down when nodes are underutilized.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Microservices Platform</h3>
        <p>
          Organizations running microservices architectures use Kubernetes to deploy and manage hundreds or thousands of services. Each service runs as a Deployment (with multiple replicas for high availability), exposed via a Service (internal ClusterIP for inter-service communication, external LoadBalancer for user-facing services). Kubernetes manages the lifecycle — auto-scaling based on demand, self-healing failed pods, rolling out updates without downtime. This pattern is used by companies like Spotify, Airbnb, and Pinterest to manage large-scale microservices deployments.
        </p>

        <h3>CI/CD Pipeline Environments</h3>
        <p>
          CI/CD pipelines use Kubernetes to provide ephemeral build environments. Each build runs in a pod (with isolated dependencies, clean state), and pods are discarded after the build (clean state for the next build). Kubernetes manages the lifecycle — creating pods for builds, scaling based on build demand, discarding pods after builds. This pattern is used by Jenkins (Kubernetes plugin), GitLab CI (Kubernetes executor), and GitHub Actions (self-hosted runners on Kubernetes).
        </p>

        <h3>Multi-Tenant Platform</h3>
        <p>
          Organizations running multi-tenant platforms (SaaS products, internal developer platforms) use Kubernetes namespaces to isolate tenants. Each tenant has its own namespace (with resource quotas, network policies, RBAC policies), ensuring that tenants cannot interfere with each other (resource exhaustion, network access, secret access). Kubernetes manages the lifecycle — enforcing resource quotas, isolating network traffic, controlling access. This pattern is used by SaaS providers to host multiple customers on the same cluster with strong isolation.
        </p>

        <h3>Edge Computing</h3>
        <p>
          Edge computing deployments use lightweight Kubernetes distributions (K3s, KubeEdge, MicroK8s) to manage containers at edge locations (CDN edge nodes, IoT gateways, 5G base stations). Edge clusters have limited resources (CPU, memory, network bandwidth), so lightweight distributions are essential. Kubernetes manages the lifecycle — deploying containers to edge locations, scaling based on edge demand, self-healing failed containers. This pattern is used by telecommunications companies, retail chains, and manufacturing companies to manage containers at thousands of edge locations.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between a Pod, a Deployment, and a Service in Kubernetes?
            </p>
            <p className="mt-2 text-sm">
              A: A Pod is the smallest deployable unit — one or more containers that share network, storage, and lifecycle. Pods are ephemeral (created, destroyed, recreated frequently). A Deployment manages pod replicas — you specify the desired number of replicas, the container image, and the update strategy, and Kubernetes creates and manages the pods. A Service is a stable network endpoint that load balances traffic across pods — pods are ephemeral (changing IPs), so services provide a stable IP and DNS name. Deployments manage pods, services expose pods. You create a Deployment (to run pods), and a Service (to expose the deployment).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does Kubernetes achieve zero-downtime deployments?
            </p>
            <p className="mt-2 text-sm">
              A: Kubernetes uses rolling updates by default. When you update a Deployment (change the image, configuration), Kubernetes creates new pods one at a time (or in batches), waits for them to become ready (readiness probe passes), then deletes old pods. During the update, traffic is routed to both old and new pods (old pods until they are deleted, new pods after they are ready). This ensures that there is always at least one healthy pod serving traffic — no downtime. The rollout strategy is configurable (maxSurge — how many new pods to create above the desired count, maxUnavailable — how many old pods can be unavailable during the update).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are liveness and readiness probes, and why are they important?
            </p>
            <p className="mt-2 text-sm">
              A: Liveness probes check if the container is alive (if it fails, Kubernetes restarts the container). Readiness probes check if the container is ready to serve traffic (if it fails, Kubernetes removes the pod from service endpoints, so traffic is not routed to it). Liveness probes enable self-healing (automatically restarting failed containers). Readiness probes enable zero-downtime deployments (traffic is routed only to ready pods — during deployment, new pods are not added to the service until they pass the readiness probe). Without probes, Kubernetes cannot detect application-level failures (the container is running, but the application is not responding).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does auto-scaling work in Kubernetes?
            </p>
            <p className="mt-2 text-sm">
              A: HorizontalPodAutoscaler (HPA) automatically adjusts the number of pod replicas based on metrics. HPA monitors metrics (CPU usage, memory usage, custom metrics like requests per second), compares them to target thresholds, and adjusts the replica count (scale up if metrics exceed the target, scale down if metrics are below the target). HPA operates within a specified range (minReplicas to maxReplicas), ensuring that there are always enough replicas for high availability, and not too many replicas to waste resources. Cluster Autoscaler (separate from HPA) adjusts the number of nodes in the cluster (scale up when pods cannot be scheduled due to insufficient resources, scale down when nodes are underutilized).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you manage configuration and secrets in Kubernetes?
            </p>
            <p className="mt-2 text-sm">
              A: ConfigMaps store non-sensitive configuration (environment variables, configuration files, command-line arguments). Secrets store sensitive data (passwords, API keys, TLS certificates). Both are created as Kubernetes resources (kubectl create configmap, kubectl create secret), and mounted into pods as environment variables or files. ConfigMaps and Secrets are injected at runtime (not baked into images), enabling configuration changes without rebuilding images. Secrets are encoded in base64 (not encrypted at rest by default — encryption at rest must be enabled separately). For production, use external secret management systems (HashiCorp Vault, AWS Secrets Manager) integrated with Kubernetes (via CSI drivers, operators).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use Kubernetes vs. simpler alternatives?
            </p>
            <p className="mt-2 text-sm">
              A: Use Kubernetes for large-scale production deployments (hundreds or thousands of containers across multiple hosts), when you need comprehensive orchestration features (auto-scaling, self-healing, rolling updates, service discovery, secrets management), and when you have the operational expertise to manage Kubernetes complexity. Use simpler alternatives (Docker Swarm, Docker Compose, Amazon ECS) for small-scale deployments (tens of containers), when you do not need comprehensive orchestration features, or when you lack Kubernetes expertise. Kubernetes is the industry standard, but it is not always the right choice — evaluate your requirements before committing to Kubernetes.
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
              href="https://kubernetes.io/docs/concepts/overview/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kubernetes Documentation — Overview
            </a>
          </p>
          <p>
            <a
              href="https://kubernetes.io/docs/concepts/workloads/pods/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kubernetes — Pods
            </a>
          </p>
          <p>
            <a
              href="https://kubernetes.io/docs/concepts/services-networking/service/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kubernetes — Services
            </a>
          </p>
          <p>
            <a
              href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kubernetes — Deployments
            </a>
          </p>
          <p>
            <a
              href="https://www.cncf.io/projects/kubernetes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CNCF — Kubernetes Project
            </a>
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
