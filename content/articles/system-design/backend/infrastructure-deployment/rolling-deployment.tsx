"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rolling-deployment",
  title: "Rolling Deployment",
  description:
    "Comprehensive guide to rolling deployment covering sequential updates, health checks, rollback strategies, zero-downtime deployment, and production-scale implementation patterns.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "rolling-deployment",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "rolling deployment",
    "sequential updates",
    "health checks",
    "rollback",
    "zero-downtime",
  ],
  relatedTopics: [
    "blue-green-deployment",
    "canary-deployment",
    "container-orchestration",
  ],
};

export default function RollingDeploymentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Rolling deployment</strong> is a release strategy where instances are updated sequentially (one at a time or in batches), replacing old instances with new instances until all instances are running the new version. During the rollout, a mix of old and new instances serve traffic simultaneously, ensuring that the application remains available throughout the deployment. If issues are detected at any stage, the rollout is halted and rolled back (replacing new instances with old instances until all instances are running the previous version).
        </p>
        <p>
          For staff-level engineers, rolling deployment represents the balance between deployment speed and infrastructure cost. Unlike blue-green deployment (which requires double the infrastructure — two full environments), rolling deployment updates instances in-place, requiring only enough capacity for one additional batch of instances (or even zero additional capacity if instances are replaced one at a time). Unlike canary deployment (which routes traffic based on percentage), rolling deployment routes traffic based on instance count (old instances serve most traffic initially, new instances serve increasing traffic as the rollout progresses). This makes rolling deployment ideal for large-scale applications where infrastructure cost is a concern.
        </p>
        <p>
          Rolling deployment involves several technical considerations. Batch size (how many instances are updated simultaneously — one at a time for minimal risk, in batches for faster rollout), health checks (verifying that new instances are healthy before proceeding to the next batch), rollback strategy (replacing new instances with old instances if issues are detected), and traffic routing (load balancer routes traffic to healthy instances — old instances are removed from the pool as they are updated, new instances are added to the pool as they become healthy).
        </p>
        <p>
          The business case for rolling deployment is cost-effective zero-downtime deployment. Rolling deployment updates instances in-place, avoiding the double infrastructure cost of blue-green deployment. It ensures that the application remains available throughout the deployment (at least some instances are always running the old or new version), enabling zero-downtime deployments. For large-scale applications (hundreds or thousands of instances), rolling deployment is the most cost-effective zero-downtime deployment strategy.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Sequential Updates</strong> form the foundation of rolling deployment. Instances are updated one at a time or in batches, with the batch size representing a critical trade-off between speed and risk. One-at-a-time updates minimize risk because only a single instance is updated at any given moment — if that instance fails, the blast radius is limited to that one instance. However, this approach is slow when dealing with hundreds or thousands of instances. Batch updates (for example, updating 25% of instances simultaneously) accelerate the rollout but increase risk, since a failed batch affects a larger portion of the infrastructure. Staff engineers must calibrate batch size based on the criticality of the service, the reliability of the new version, and the acceptable window for deployment.
        </p>
        <p>
          <strong>Health Checks</strong> are the gatekeepers that prevent broken instances from entering the traffic pool. After updating each instance or batch, health checks verify that the new instance is operating correctly — HTTP endpoints respond with expected status codes, error rates remain within normal thresholds, and performance metrics stay within acceptable bounds. Only when health checks pass does the rollout proceed to the next instance or batch. Health checks serve multiple purposes: they catch deployment failures early (a misconfigured environment variable, a missing dependency, a broken migration), they prevent user-facing errors (unhealthy instances are never added to the traffic pool), and they provide a natural pause point for operators to review deployment metrics before proceeding.
        </p>
        <p>
          <strong>Traffic Routing</strong> during a rolling deployment is managed by the load balancer, which dynamically adjusts its backend pool as instances are updated. Old instances are gracefully drained (existing connections are allowed to complete) and removed from the pool as they are taken down for update. New instances are added to the pool only after passing health checks, at which point they begin receiving traffic. During the rollout, traffic is served by a heterogeneous mix of old and new versions — old instances handle the majority of traffic early in the rollout, while new instances handle an increasing proportion as the rollout progresses. This gradual traffic shift is both a feature and a risk: it limits the blast radius of a bad deployment, but it also means that mixed-version behavior must be carefully considered.
        </p>
        <p>
          <strong>Rollback Strategy</strong> is the safety net that ensures production can be restored to a working state when issues are detected. If health checks fail, error rates spike, or performance degrades during the rollout, the process is halted and reversed. Rollback involves replacing new instances with old instances — the reverse of the forward rollout. New instances are removed from the traffic pool, and old instances (which should still be available or quickly reprovisionable) are added back. Rollback should be fully automated, triggered by the same health checks that gate forward progress, because manual rollback decisions introduce delay during an incident when every second of user impact matters.
        </p>
        <p>
          <strong>Database Compatibility</strong> is a constraint that frequently derails rolling deployments. The new application version must be compatible with the existing database schema throughout the entire rollout, since both old and new versions run simultaneously. Schema changes must follow the expand-contract pattern: first expand the schema to support both versions (add new columns while keeping old ones, make new columns nullable), then deploy the new version using rolling deployment, and finally contract the schema (remove old columns, enforce non-null constraints) after the rollout is verified. Attempting to make non-backward-compatible schema changes during a rolling deployment will cause the old version to fail when it encounters unexpected schema modifications.
        </p>
        <p>
          <strong>Surge Capacity</strong> refers to the temporary additional infrastructure created during the rollout to maintain full service capacity. Some rolling deployment strategies create new instances before removing old ones, temporarily running more instances than the steady-state target. This surge capacity ensures that the application maintains full processing power throughout the rollout — old instances are not removed until new instances are healthy and serving traffic. Without surge capacity, the rollout replaces instances in-place, temporarily reducing capacity (old instances are taken down before new instances are fully operational), which can cause performance degradation under load. The decision to use surge capacity is a trade-off between maintaining full capacity during deployment and the cost of temporarily provisioning extra infrastructure.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-deployment-flow.svg"
          alt="Rolling Deployment Flow showing sequential instance updates with health checks and traffic routing"
          caption="Rolling deployment flow — update instances one at a time or in batches, run health checks, route traffic to healthy instances, proceed to next batch"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Rolling deployment architecture consists of the instance pool (running instances — old and new versions), the deployment controller (orchestrating the rollout — updating instances one at a time or in batches, running health checks, managing traffic routing), and the load balancer (routing traffic to healthy instances — old instances are removed from the pool as they are updated, new instances are added to the pool as they become healthy). The flow begins with all instances running the old version. The deployment controller updates the first instance (or batch), runs health checks, and if health checks pass, adds the new instance to the traffic pool. The process repeats until all instances are running the new version.
        </p>
        <p>
          For production deployments, the rolling deployment is integrated into the CI/CD pipeline — the pipeline builds the new version, deploys it to instances one at a time (or in batches), runs health checks after each update, and proceeds to the next instance (or batch) if health checks pass. If health checks fail, the pipeline halts the rollout and rolls back (replacing new instances with old instances).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-health-checks.svg"
          alt="Rolling Health Checks showing health check execution after each instance update and traffic routing decisions"
          caption="Rolling health checks — after each instance update, health checks verify instance health, traffic is routed to healthy instances, unhealthy instances are removed from pool"
          width={900}
          height={500}
        />

        <h3>Rolling Deployment Strategies</h3>
        <p>
          <strong>One-at-a-Time:</strong> Update one instance at a time. Advantages: minimal risk (only one instance is updated at a time, if it fails, only one instance is affected), easy rollback (replace the failed instance with the old version). Limitations: slow (updating hundreds of instances one at a time takes a long time). Best for: critical applications where risk must be minimized, small instance pools (tens of instances).
        </p>
        <p>
          <strong>Batch Updates:</strong> Update instances in batches (e.g., 25% of instances at a time). Advantages: faster than one-at-a-time (multiple instances are updated simultaneously), still relatively safe (if a batch fails, only that batch is affected). Limitations: higher risk than one-at-a-time (if a batch fails, 25% of instances are affected). Best for: large instance pools (hundreds or thousands of instances), applications where speed is important.
        </p>
        <p>
          <strong>Blue-Green Rolling:</strong> Combine rolling deployment with blue-green deployment — create new instances (green), gradually shift traffic from old instances (blue) to new instances, and remove old instances after traffic is fully shifted. Advantages: zero-downtime (traffic is always served by healthy instances), easy rollback (shift traffic back to old instances). Limitations: requires surge capacity (temporarily running more instances than normal). Best for: applications requiring zero-downtime with easy rollback.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-vs-bluegreen.svg"
          alt="Rolling vs Blue-Green comparison showing instance update patterns and infrastructure cost differences"
          caption="Rolling vs blue-green — rolling updates instances in-place (lower cost, slower), blue-green switches between environments (higher cost, instant rollback)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Rolling deployment involves trade-offs between deployment speed, infrastructure cost, rollback speed, and risk. Understanding these trade-offs is essential for deciding when to use rolling deployment versus other deployment strategies.
        </p>

        <h3>Rolling vs. Blue-Green</h3>
        <p>
          <strong>Rolling:</strong> Update instances in-place, one at a time or in batches. Advantages: lower infrastructure cost (only need capacity for one additional batch), gradual exposure (issues affect only a subset of instances). Limitations: slower rollback (must roll back instance by instance), potential for mixed-version requests (some requests hit old instances, some hit new). Best for: large-scale applications where double infrastructure cost is prohibitive.
        </p>
        <p>
          <strong>Blue-Green:</strong> Two full environments, instant traffic switch. Advantages: instant rollback (switch back instantly), simple deployment logic (all-or-nothing switch), no mixed-version requests (all instances run the same version). Limitations: double infrastructure cost. Best for: applications requiring instant rollback, teams wanting simple deployment logic.
        </p>

        <h3>Rolling vs. Canary</h3>
        <p>
          <strong>Rolling:</strong> Update instances based on instance count (old instances are replaced by new instances). Advantages: simpler traffic routing (load balancer routes to healthy instances, no percentage-based routing needed), lower infrastructure cost (no need for separate canary environment). Limitations: less precise traffic control (traffic is routed based on instance health, not user percentage). Best for: applications where instance-based rollout is sufficient.
        </p>
        <p>
          <strong>Canary:</strong> Route traffic based on percentage (e.g., 1% to new version, 99% to old version). Advantages: precise traffic control (exact percentage of users see the new version), limited blast radius (issues affect only a small percentage of users). Limitations: complex traffic splitting logic (requires load balancer, service mesh, or CDN-based routing), higher infrastructure cost (need separate canary environment). Best for: high-risk deployments where precise traffic control is needed.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/rolling-rollback.svg"
          alt="Rolling Rollback showing instance-by-instance replacement of new version with old version when issues are detected"
          caption="Rolling rollback — when issues detected, replace new instances with old instances one at a time, traffic is routed to healthy old instances"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Health checks must be comprehensive and blocking.</strong> Run health checks after updating each instance or batch, covering HTTP endpoint availability (the instance responds to requests), functional correctness (key features operate as expected), and performance characteristics (response times and resource utilization remain within acceptable bounds). Only proceed to the next instance or batch when all health checks pass. Health checks are the primary mechanism that prevents broken instances from entering the traffic pool and causing user-facing errors. A well-designed health check suite includes both shallow checks (is the process running, is the port open) and deep checks (can the instance connect to its dependencies, can it serve a representative request end-to-end).
        </p>
        <p>
          <strong>Automate rollback to minimize incident duration.</strong> Configure the deployment pipeline to automatically trigger rollback when health checks fail — replacing new instances with old instances without requiring manual intervention. Automated rollback ensures that production remains in a working state at all times. If an instance update introduces a bug, the pipeline detects the failure through health checks, halts forward progress, and reverts to the previous version. This automated approach is both faster and more reliable than manual rollback, which depends on on-call engineers correctly diagnosing the issue and executing the rollback procedure under pressure. The rollback trigger should be sensitive enough to catch real failures but not so sensitive that transient issues (a brief network hiccup, a slow-starting process) cause unnecessary rollbacks.
        </p>
        <p>
          <strong>Use surge capacity to maintain full service levels during rollout.</strong> Create new instances before removing old ones, temporarily running more instances than the steady-state target. This surge capacity ensures that the application maintains full processing power throughout the deployment — old instances continue serving traffic until new instances are verified healthy and actively receiving requests. Without surge capacity, the rollout temporarily reduces capacity (old instances are terminated before new instances are fully operational), which can cause performance degradation, increased response times, and in extreme cases, service outages under heavy load. The cost of surge capacity is typically modest compared to the cost of a degraded user experience during deployment.
        </p>
        <p>
          <strong>Monitor continuously during the entire rollout window.</strong> Track error rates, response times, resource utilization, and business metrics throughout the deployment. If any metric degrades beyond predefined thresholds, halt the rollout and investigate before proceeding. Continuous monitoring catches issues that health checks alone might miss — for example, a subtle performance regression that doesn't fail health checks but significantly increases p99 latency, or a business metric anomaly (reduced conversion rate) that indicates a functional issue not detected by technical health checks. Monitoring dashboards should be configured before the rollout begins, with alerting rules that page the on-call engineer if thresholds are breached.
        </p>
        <p>
          <strong>Ensure database backward compatibility through the expand-contract pattern.</strong> The new application version must work with the existing database schema throughout the rollout, since both old and new versions run simultaneously and share the same database. Schema changes follow a three-phase approach: expand the schema to support both versions (add new columns, keep old columns, make new columns nullable), deploy the new version using rolling deployment, then contract the schema (remove old columns, enforce constraints) only after the rollout is verified and all old instances are decommissioned. This pattern ensures that rollback remains possible at any point during the rollout — if the new version must be removed, the old version continues functioning correctly against the expanded schema.
        </p>
        <p>
          <strong>Test the rollback process regularly to ensure it works when needed.</strong> A rollback procedure that has not been tested is a rollback procedure that may fail during a real incident. Include rollback testing as a mandatory step in your deployment pipeline — after each successful deployment, verify that rollback works by replacing new instances with old instances and confirming that the application returns to its pre-deployment state. Periodically conduct chaos engineering exercises where you intentionally trigger a rollback during production deployments to validate that the automated rollback mechanism functions correctly under real-world conditions. This practice builds confidence that rollback will work when it matters most.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Skipping health checks entirely</strong> is the most dangerous pitfall in rolling deployment. Updating instances without running health checks means that broken instances are silently added to the traffic pool, causing user-facing errors that may go undetected until users begin reporting them. Every rolling deployment must include health checks after each instance or batch update, and the deployment must not proceed to the next instance until those checks pass. Health checks should be treated as a non-negotiable gate — they are the difference between a controlled deployment failure (one bad instance is caught and replaced before receiving traffic) and a user-impacting incident (multiple bad instances serve errors to users).
        </p>
        <p>
          <strong>Slow or manual rollback processes</strong> extend the duration of user impact when a deployment goes wrong. A rollback that requires manual intervention (an on-call engineer diagnosing the issue, logging into the deployment tool, and manually triggering the rollback) introduces minutes or hours of delay during which users continue to experience errors. Slow automated rollbacks that replace instances one at a time (mirroring the forward rollout speed) also extend impact duration unnecessarily. Rollback should be automated and, where possible, accelerated — replacing multiple instances in parallel rather than sequentially — to minimize the window during which users are affected.
        </p>
        <p>
          <strong>Reduced capacity during rollout</strong> occurs when old instances are removed before new instances are healthy and serving traffic. This temporary capacity reduction means fewer instances are available to handle the same traffic load, resulting in increased response times, request queuing, and in severe cases, cascading failures as overloaded instances begin to fail. The solution is surge capacity — provisioning new instances before decommissioning old ones, ensuring that the total instance count never drops below the steady-state target during the rollout. While surge capacity incurs a modest additional cost (temporarily running extra instances), it is far cheaper than the cost of a degraded or unavailable service.
        </p>
        <p>
          <strong>Database incompatibility during rollout</strong> is a pitfall that frequently causes complete deployment failures. When a new application version is deployed alongside non-backward-compatible database schema changes, the old version (which still runs on instances that have not yet been updated) may fail when it encounters the modified schema — missing columns it expects to query, changed constraints that reject its writes, or removed tables that it depends on. This incompatibility not only causes user-facing errors but also blocks rollback, since rolling back to the old version requires reverting the database schema (which is often slower and riskier than rolling back application instances). The expand-contract pattern prevents this pitfall by ensuring that the database schema remains compatible with both old and new versions throughout the rollout.
        </p>
        <p>
          <strong>Mixed-version request behavior</strong> emerges when old and new instances have incompatible APIs, different response formats, or divergent business logic. During a rolling deployment, individual user sessions may span multiple requests, some of which hit old instances and some of which hit new instances. If the two versions behave differently, users experience inconsistent behavior — a feature that works on one request may fail on the next, UI elements may render differently depending on which instance serves the request, and error messages may vary between versions. This pitfall is particularly insidious because it is difficult to detect through automated health checks (both old and new instances may be individually healthy) and requires careful version compatibility testing before the rollout begins.
        </p>
        <p>
          <strong>Insufficient monitoring during rollout</strong> means that deployment failures are detected late, often through user reports rather than automated alerts. Without monitoring error rates, response times, resource utilization, and business metrics during the rollout, a bad deployment may progress through multiple batches before anyone notices that something is wrong. By that point, a significant fraction of instances are running the broken version, and the user impact is already substantial. Monitoring should be continuous and automated, with dashboards that display real-time deployment metrics and alerting rules that page the on-call engineer if any metric exceeds predefined thresholds. Monitoring is complementary to health checks — health checks gate individual instance updates, while monitoring provides a holistic view of the deployment's impact on the overall system.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Large-Scale Microservices Deployment</h3>
        <p>
          Organizations running large-scale microservices architectures (hundreds or thousands of instances) use rolling deployment to update instances in-place, avoiding the double infrastructure cost of blue-green deployment. Instances are updated in batches (e.g., 25% at a time), with health checks after each batch. This pattern is used by companies like Netflix, Airbnb, and Pinterest to manage large-scale microservices deployments while minimizing infrastructure cost.
        </p>

        <h3>Kubernetes Deployment Updates</h3>
        <p>
          Kubernetes uses rolling deployment by default (RollingUpdate strategy). When a Deployment is updated, Kubernetes creates new pods one at a time (or in batches), waits for them to become ready (readiness probe passes), then deletes old pods. This ensures zero-downtime deployments — traffic is always routed to healthy pods (old pods until new pods are ready, new pods after they are ready). Kubernetes rolling deployment is the standard approach for stateless application updates in Kubernetes.
        </p>

        <h3>Cloud Auto-Scaling Group Updates</h3>
        <p>
          Cloud auto-scaling groups (AWS Auto Scaling, GCP Instance Groups, Azure Virtual Machine Scale Sets) use rolling deployment to update instances. New instances are launched with the updated configuration, health checks verify that they are healthy, and old instances are terminated. This pattern ensures that the auto-scaling group maintains capacity during the rollout (new instances are launched before old instances are terminated), enabling zero-downtime instance updates.
        </p>

        <h3>Database-Compatible Application Updates</h3>
        <p>
          Organizations updating applications with database schema changes use rolling deployment with backward-compatible schema changes. The schema is expanded to support both old and new versions (add new columns, keep old columns), the new version is deployed using rolling deployment, and after the rollout is complete, the schema is contracted (remove old columns). This pattern ensures that the old version continues working during the rollout, preventing downtime due to database incompatibility.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does rolling deployment work?
            </p>
            <p className="mt-2 text-sm">
              A: Rolling deployment updates instances sequentially (one at a time or in batches), replacing old instances with new instances until all instances are running the new version. During the rollout, a mix of old and new instances serve traffic simultaneously, ensuring that the application remains available. After updating each instance (or batch), health checks verify that the new instance is healthy. Only after health checks pass does the rollout proceed to the next instance (or batch). If issues are detected, the rollout is halted and rolled back (replacing new instances with old instances).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the trade-offs between rolling deployment and blue-green deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Rolling deployment has lower infrastructure cost (only need capacity for one additional batch) but slower rollback (must roll back instance by instance). Blue-green deployment has higher infrastructure cost (two full environments) but instant rollback (switch back instantly). Rolling deployment is best for large-scale applications where infrastructure cost is a concern. Blue-green deployment is best for applications requiring instant rollback and simple deployment logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle health checks in rolling deployment?
            </p>
            <p className="mt-2 text-sm">
              A: After updating each instance (or batch), run health checks to verify that the new instance is healthy. Health checks should include HTTP endpoint checks (ensuring the instance responds), functional checks (ensuring key features work), and performance checks (ensuring response times are acceptable). Only proceed to the next instance (or batch) if health checks pass. If health checks fail, halt the rollout and roll back (replace the new instance with the old instance). Health checks prevent propagating broken instances to the traffic pool.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle database schema changes during rolling deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Use the expand-contract pattern. First, expand the schema to support both old and new versions (add new columns, keep old columns, make new columns nullable). Deploy the new version using rolling deployment (old and new instances run simultaneously, both work with the expanded schema). After the rollout is complete (all instances running the new version), contract the schema (remove old columns, make new columns required). This ensures that the old version continues working during the rollout, preventing downtime due to database incompatibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you automate rollback in rolling deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Configure the deployment pipeline to automatically rollback if health checks fail (replace new instances with old instances). Automated rollback involves: detecting the failure (health checks fail, error rates spike), halting the rollout (stop updating remaining instances), and replacing new instances with old instances (the reverse of the rollout — new instances are removed from the pool, old instances are added back). Automated rollback ensures that production is always in a working state — if an instance update introduces a bug, the pipeline automatically reverts to the previous version, minimizing user impact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use rolling deployment vs. canary deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Use rolling deployment when instance-based rollout is sufficient (traffic is routed based on instance health, not user percentage), infrastructure cost is a concern (rolling deployment has lower infrastructure cost than canary deployment), and precise traffic control is not needed. Use canary deployment when precise traffic control is needed (exact percentage of users see the new version), limited blast radius is critical (issues affect only a small percentage of users), and you are willing to pay for separate canary infrastructure. Rolling deployment is simpler and cheaper; canary deployment provides more precise control.
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
              href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kubernetes Documentation — RollingUpdate Deployment Strategy
            </a>
            {" "}— Official Kubernetes documentation covering the RollingUpdate strategy, including <code className="text-sm bg-panel-soft px-1 py-0.5 rounded">maxSurge</code> and <code className="text-sm bg-panel-soft px-1 py-0.5 rounded">maxUnavailable</code> parameters, readiness and liveness probes, and deployment lifecycle management.
          </p>
          <p>
            <a
              href="https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS CodeDeploy Documentation — Deployment Configuration
            </a>
            {" "}— AWS CodeDeploy documentation covering in-place deployment strategies, including rolling updates with configurable batch sizes, lifecycle hooks for validation, and automatic rollback on failure.
          </p>
          <p>
            <a
              href="https://martinfowler.com/bliki/BlueGreenDeployment.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Martin Fowler — BlueGreenDeployment
            </a>
            {" "}— Martin Fowler&apos;s comprehensive overview of deployment strategies including blue-green, rolling, and canary deployments, with discussion of zero-downtime deployment patterns and the trade-offs between different approaches.
          </p>
          <p>
            <a
              href="https://sre.google/sre-book/release-engineering/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Site Reliability Engineering — Release Engineering
            </a>
            {" "}— Google SRE book chapter on release engineering, covering progressive delivery, staged rollouts, health checking, automated rollback, and the principles of safe production deployments at scale.
          </p>
          <p>
            <a
              href="https://netflixtechblog.com/deploying-the-netflix-api-7279618b5c1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Netflix Tech Blog — Deploying the Netflix API
            </a>
            {" "}— Netflix engineering blog discussing their deployment pipeline, including rolling deployment patterns, automated canary analysis, and the infrastructure decisions that enable thousands of production deployments per day.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
