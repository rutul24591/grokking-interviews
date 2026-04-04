"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-blue-green-deployment",
  title: "Blue-Green Deployment",
  description:
    "Comprehensive guide to blue-green deployment covering zero-downtime releases, traffic switching, rollback capability, infrastructure requirements, and production-scale implementation patterns.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "blue-green-deployment",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "blue-green deployment",
    "zero-downtime",
    "traffic switching",
    "rollback",
    "release strategy",
  ],
  relatedTopics: [
    "canary-deployment",
    "rolling-deployment",
    "ci-cd-pipelines",
  ],
};

export default function BlueGreenDeploymentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Blue-green deployment</strong> is a release strategy that maintains two identical production environments (blue and green), with only one environment serving live traffic at any time. When deploying a new version, the new version is deployed to the inactive environment, tested thoroughly, and then traffic is switched from the active environment to the newly deployed environment. If issues are detected after the switch, traffic can be immediately switched back to the previous environment, providing instant rollback capability. This strategy enables zero-downtime deployments with minimal risk.
        </p>
        <p>
          For staff-level engineers, blue-green deployment is a fundamental pattern for achieving deployment reliability and rollback capability. Unlike traditional deployments where the new version replaces the old version in-place (risking downtime if the new version fails), blue-green deployment keeps the old version running until the new version is verified healthy and traffic is switched. The switch is instantaneous (DNS change, load balancer configuration update, or CDN origin change), so users experience no downtime during the deployment.
        </p>
        <p>
          Blue-green deployment involves several technical considerations. Infrastructure requirements (maintaining two identical production environments — doubling infrastructure cost during deployment), traffic switching mechanism (DNS, load balancer, CDN origin — determining how traffic is routed between environments), database compatibility (new version must work with the existing database schema, and the old version must continue working during the transition), and session management (user sessions must survive the environment switch — using client-side sessions or shared session stores).
        </p>
        <p>
          The business case for blue-green deployment is deployment reliability and risk mitigation. Zero-downtime deployments ensure that users are not impacted during releases, maintaining user trust and satisfaction. Instant rollback capability (switch back to the previous environment) enables quick recovery from failed deployments, reducing mean time to recovery (MTTR) from hours to seconds. For customer-facing applications where downtime is costly (e-commerce, SaaS, financial services), blue-green deployment is essential for maintaining availability during releases.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Two Identical Environments:</strong> Blue and green environments are identical production environments with the same infrastructure, same configuration, and same CDN setup. One environment is active and serving live traffic while the other remains inactive and available for deployment. Environments are switched on each deployment — if blue is active now, green becomes active after deployment, and vice versa. This alternation ensures that every deployment has a known-good fallback environment ready for instant rollback.
        </p>
        <p>
          <strong>Traffic Switching:</strong> The mechanism for redirecting user traffic from the active environment to the newly deployed environment determines both the speed and reliability of the deployment. Common methods include DNS record updates where changing the DNS record points to the new environment with TTL considerations affecting propagation delay, load balancer configuration updates that modify the backend pool to point to the new environment providing instant switching, and CDN origin updates that change the CDN origin to the new environment. The switch should be as instantaneous as possible to minimize user impact and ensure zero-downtime deployment.
        </p>
        <p>
          <strong>Instant Rollback:</strong> If issues are detected after the traffic switch, traffic can be immediately switched back to the previous environment. Since the previous environment is still running and unchanged, the rollback is instantaneous requiring no rebuild and no redeploy — just a traffic switch. This is the key advantage of blue-green deployment over in-place deployments, where rollback requires redeploying the previous version which can take minutes or hours depending on the application size and complexity.
        </p>
        <p>
          <strong>Database Compatibility:</strong> The new version must be compatible with the existing database schema. If the new version requires database schema changes, those changes must be backward-compatible meaning the old version must continue working with the new schema during the transition period. This is typically achieved through the expand-contract pattern: expand the schema to support both old and new versions by adding new columns while keeping old columns, deploy the new version, then contract the schema by removing old columns after the old version is decommissioned. This pattern ensures rollback never fails due to database incompatibility.
        </p>
        <p>
          <strong>Health Checks:</strong> After deploying to the inactive environment and before switching traffic, comprehensive health checks must be executed to verify that the new version is healthy. These health checks include HTTP endpoint checks to ensure the application responds, functional tests to verify key features work correctly, performance tests to confirm response times are acceptable, and smoke tests to validate critical user flows. Only switch traffic if all health checks pass, as switching to a broken version would cause downtime and defeat the purpose of blue-green deployment.
        </p>
        <p>
          <strong>Session Compatibility:</strong> User sessions must survive the environment switch to prevent users from being logged out during deployment. If sessions are stored server-side in the active environment, switching environments will invalidate all sessions causing widespread user disruption. Solutions include storing sessions in a shared Redis cluster accessible by both environments, using client-side sessions with JWT tokens stored in browser cookies, or replicating sessions between environments. For blue-green deployments, client-side sessions are the simplest and most reliable solution since they require no additional infrastructure and survive any environment switch.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-architecture.svg"
          alt="Blue-Green Architecture showing two identical environments with traffic router switching between blue and green"
          caption="Blue-green architecture — two identical production environments, traffic router directs users to active environment, instant switch enables zero-downtime deployment"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Blue-green deployment architecture consists of two identical environments (blue and green), a traffic router (DNS, load balancer, or CDN) that directs traffic to the active environment, and a deployment pipeline that deploys to the inactive environment, runs health checks, and switches traffic. The flow begins with the active environment (e.g., blue) serving live traffic. The new version is deployed to the inactive environment (green), health checks are run against the green environment, and if health checks pass, traffic is switched from blue to green. The blue environment remains available for instant rollback.
        </p>
        <p>
          After the traffic switch, the green environment becomes the new active environment, and the blue environment becomes the new inactive environment (available for the next deployment). The previous version on the blue environment is retained until the next deployment overwrites it, providing a safety net for rollback. Over time, the blue and green environments alternate roles on each deployment.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-flow.svg"
          alt="Blue-Green Deployment Flow showing deployment to inactive environment, health checks, traffic switch, and rollback capability"
          caption="Blue-green flow — deploy to inactive environment, run health checks, switch traffic if healthy, instant rollback by switching back if issues detected"
          width={900}
          height={500}
        />

        <h3>Traffic Switching Methods</h3>
        <p>
          <strong>DNS Update:</strong> Change the DNS record (A record or CNAME) to point to the new environment. Advantages: simple, works with any hosting setup. Limitations: DNS propagation delay (TTL determines how long old records are cached, typically 5-60 seconds), users may be directed to the old environment during propagation. Best for: applications where brief DNS propagation delay is acceptable, static site hosting.
        </p>
        <p>
          <strong>Load Balancer Update:</strong> Update the load balancer backend pool to point to the new environment. Advantages: instant switch (no DNS propagation delay), precise control over traffic routing. Limitations: requires load balancer infrastructure, more complex configuration. Best for: applications requiring instant switch, API backends, microservices.
        </p>
        <p>
          <strong>CDN Origin Update:</strong> Change the CDN origin to point to the new environment. Advantages: instant switch (CDN origin updates are typically instant), CDN caches old content until TTL expires (graceful transition). Limitations: requires CDN infrastructure, CDN cache invalidation may be needed for immediate content update. Best for: frontend applications served from CDN (static sites, SPAs).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/blue-green-rollback.svg"
          alt="Blue-Green Rollback showing instant traffic switch back to previous environment when issues are detected"
          caption="Blue-green rollback — when issues detected on new environment, switch traffic back to previous environment instantly (no rebuild or redeploy needed)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Blue-green deployment involves trade-offs between deployment speed, infrastructure cost, rollback speed, and user impact. Understanding these trade-offs is essential for deciding when to use blue-green deployment versus other deployment strategies.
        </p>

        <h3>Blue-Green vs. Rolling Deployment</h3>
        <p>
          <strong>Blue-Green:</strong> Two full environments, instant traffic switch. Advantages: instant rollback (switch back instantly), simple deployment logic (all-or-nothing switch), zero-downtime guaranteed (traffic switch is instant). Limitations: double infrastructure cost, all users see the new version at once (no gradual exposure). Best for: applications requiring instant rollback, teams wanting simple deployment logic.
        </p>
        <p>
          <strong>Rolling:</strong> Gradual instance replacement, one at a time or in batches. Advantages: lower infrastructure cost (only need capacity for one additional batch), gradual exposure (issues affect only a subset of users). Limitations: slower rollback (must roll back instance by instance), potential for mixed-version requests (some requests hit old instances, some hit new). Best for: large-scale applications where double infrastructure cost is prohibitive.
        </p>

        <h3>Blue-Green vs. Canary</h3>
        <p>
          <strong>Blue-Green:</strong> All traffic switches at once. Advantages: simple (all-or-nothing switch), instant feedback (all users see the new version), instant rollback. Limitations: all users are impacted if the new version has issues (no gradual exposure). Best for: well-tested deployments where confidence in the new version is high.
        </p>
        <p>
          <strong>Canary:</strong> Small percentage of traffic routed to the new version first, gradually increased. Advantages: limited blast radius (issues affect only a small percentage of users), gradual validation (monitor canary metrics before full rollout). Limitations: complex traffic splitting logic, slower deployment (gradual increase takes time), complex rollback. Best for: high-risk deployments, applications where user impact must be minimized.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/deployment-strategies.svg"
          alt="Deployment Strategies comparison showing blue-green, rolling, and canary approaches with their trade-offs"
          caption="Deployment strategies — blue-green (all-at-once, instant rollback), rolling (gradual instance replacement), canary (gradual traffic split)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Automate the Entire Process:</strong> The deployment process spanning deployment to the inactive environment, running health checks, switching traffic, and verifying post-switch health should be fully automated through the CI/CD pipeline. Manual steps introduce risk through human error and inconsistent execution while also slowing down deployments. Automation ensures consistent, reliable deployments every time and eliminates the variability that comes from different team members executing different steps in slightly different ways. A fully automated pipeline also provides an audit trail of every deployment, which is critical for compliance and incident investigation.
        </p>
        <p>
          <strong>Run Comprehensive Health Checks Before Switching:</strong> Before switching traffic, run health checks against the newly deployed environment to validate that the application is functioning correctly. Health checks should include HTTP endpoint checks to ensure the application responds to requests, functional tests to verify that key features work as expected, performance tests to confirm that response times meet acceptable thresholds, and smoke tests to validate critical user flows such as login, checkout, or data submission. Only switch traffic if all health checks pass, as switching to a broken environment would cause downtime and require immediate rollback.
        </p>
        <p>
          <strong>Ensure Database Backward Compatibility:</strong> The new version must work with the existing database schema to prevent deployment failures during the transition. Use the expand-contract pattern where you first expand the schema to support both versions by adding new columns while keeping old columns, then deploy the new version which uses the new columns, and finally after the old version is decommissioned, contract the schema by removing old columns. This ensures that the old version continues working during the transition, preventing downtime due to database incompatibility and ensuring that rollback never fails because of schema changes.
        </p>
        <p>
          <strong>Use Client-Side Sessions:</strong> Store user sessions client-side using JWT tokens in cookies rather than server-side session stores in the active environment. Client-side sessions survive environment switches because the token is valid regardless of which environment serves the request, eliminating the need for session replication between environments. Server-side sessions require session replication between old and new versions which adds infrastructure complexity and introduces potential consistency issues. By using client-side sessions, you ensure seamless user experience during deployments without additional infrastructure overhead.
        </p>
        <p>
          <strong>Monitor After Switching:</strong> After switching traffic, continuously monitor the new environment for errors, performance degradation, and user impact using real-time observability tooling. Set up automated alerts for error rate spikes, response time increases, and business metric anomalies such as decreased checkout completion rates or increased support tickets. If issues are detected, switch traffic back immediately using the instant rollback capability. Monitoring ensures that issues are caught quickly and rolled back before significant user impact occurs, and it provides the data needed to make informed decisions about whether to proceed with or abort a deployment.
        </p>
        <p>
          <strong>Test the Rollback Process:</strong> Regularly test the rollback process by switching traffic back to the previous environment to ensure it works when needed during a real incident. A rollback process that has not been tested may fail when needed most because previous version artifacts are deleted, rollback scripts are broken, or database migrations are not reversible. Include rollback testing in your deployment pipeline by deploying the previous version after each successful deployment and verifying it works correctly. This game-day approach ensures that the instant rollback capability is not just theoretical but proven through regular practice.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          <strong>Database Schema Incompatibility:</strong> Deploying a new version with non-backward-compatible database schema changes causes the old version to fail during the transition period. The old version may fail when interacting with the new schema due to missing columns, changed constraints, or removed tables. This is one of the most common causes of failed rollbacks in blue-green deployments. Always use backward-compatible schema changes through the expand-contract pattern to ensure that rollback does not break due to database incompatibility. Schema changes should be additive — never remove or modify existing columns until the old version is fully decommissioned and no longer needs to read from them.
        </p>
        <p>
          <strong>Session Invalidation:</strong> Switching environments without ensuring session compatibility causes users to be logged out en masse, creating a poor user experience and potentially triggering a flood of support tickets. If sessions are stored server-side in the active environment, switching environments invalidates all user sessions immediately. Use client-side sessions with JWT tokens or shared session stores with a Redis cluster accessible by both environments to ensure sessions survive the environment switch. The client-side approach is simplest since it requires no additional infrastructure and tokens are inherently environment-agnostic.
        </p>
        <p>
          <strong>DNS Propagation Delay:</strong> Using DNS updates for traffic switching without considering TTL time to live causes inconsistent user experiences during deployment. DNS records are cached by resolvers based on TTL values, so some users may be directed to the old environment during the propagation period while others reach the new environment. This creates a split-brain scenario where different users see different versions simultaneously. Use low TTL such as 60 seconds before deployment to minimize propagation delay, or preferably use load balancer or CDN updates for truly instant switching that affects all users simultaneously.
        </p>
        <p>
          <strong>Infrastructure Cost:</strong> Maintaining two full production environments doubles infrastructure cost during the deployment window, which can be significant for large-scale applications with substantial resource requirements. For applications handling millions of requests per second, the cost of duplicating the entire infrastructure can be prohibitive. Optimize by using infrastructure as code tools like Terraform or CloudFormation to spin up the inactive environment on-demand and tear it down after the traffic switch, reducing the cost to only the deployment window rather than maintaining both environments permanently. Cloud auto-scaling groups can also dynamically manage environment capacity based on current needs.
        </p>
        <p>
          <strong>Skipping Health Checks:</strong> Switching traffic to the new environment without running comprehensive health checks is a critical error that leads to deploying broken versions to production. If the new environment has undetected issues such as compilation errors, misconfigured environment variables, or failing dependencies, switching traffic causes immediate downtime for all users. Always run health checks before switching traffic, and only switch if all checks pass including HTTP endpoint validation, functional feature tests, performance benchmarks, and smoke tests covering critical user flows. Health checks are the last line of defense before users are impacted by a bad deployment.
        </p>
        <p>
          <strong>Not Testing Rollback:</strong> Assuming rollback works without actually testing it creates a false sense of security that can be devastating during a real production incident. Rollback processes that have not been tested may fail because previous version artifacts are deleted from the registry, rollback scripts are broken due to dependency changes, or database migrations are not reversible. Regularly test rollback by deploying the previous version and verifying it works correctly in the production environment. Include rollback testing as a mandatory step in your deployment pipeline to ensure that the instant rollback capability is reliable when you need it most.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Platform Deployment</h3>
        <p>
          E-commerce platforms (Amazon, Shopify stores) use blue-green deployment for zero-downtime releases during peak shopping periods. The new version is deployed to the green environment, tested with automated smoke tests (product page loads, checkout flow works, payment processing succeeds), and traffic is switched from blue to green. If checkout errors are detected after the switch, traffic is immediately switched back to blue (instant rollback). This ensures that shopping experience is never disrupted during deployments, maintaining revenue and user trust.
        </p>

        <h3>SaaS Application Deployment</h3>
        <p>
          SaaS applications (Slack, Notion, Figma) use blue-green deployment for frequent releases (multiple times per day). The new version is deployed to the inactive environment, health checks verify functionality, and traffic is switched. Client-side sessions (JWT tokens) ensure that user sessions survive the environment switch. Monitoring alerts detect any post-deployment issues, triggering instant rollback if needed. This pattern enables SaaS teams to ship features rapidly while maintaining high availability.
        </p>

        <h3>Financial Services Application Deployment</h3>
        <p>
          Financial services applications (banking apps, trading platforms) use blue-green deployment for regulated releases where downtime is unacceptable. The new version undergoes extensive testing on the inactive environment (functional tests, security scans, compliance checks), health checks verify functionality, and traffic is switched. The instant rollback capability ensures that if regulatory issues are detected, the previous version is restored immediately. This pattern meets regulatory requirements for availability while enabling feature delivery.
        </p>

        <h3>Content Publishing Platform Deployment</h3>
        <p>
          Content publishing platforms use blue-green deployment for theme and template changes. The new version is deployed to the inactive environment, CDN origin is switched to the new version&apos;s assets, and CDN cache is purged for HTML pages (ensuring users receive latest HTML). If content rendering issues are detected, instant rollback restores the previous version. This pattern ensures that content is always available during deployments.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does blue-green deployment achieve zero-downtime?
            </p>
            <p className="mt-2 text-sm">
              A: Blue-green deployment maintains two identical production environments (blue and green), with one serving live traffic. The new version is deployed to the inactive environment, tested, and traffic is switched from the active to the newly deployed environment. The switch is instantaneous (DNS change, load balancer update, CDN origin update), so users experience no downtime. The previous environment remains running, enabling instant rollback if issues are detected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the instant rollback capability in blue-green deployment?
            </p>
            <p className="mt-2 text-sm">
              A: After switching traffic to the new environment, if issues are detected (errors, performance degradation, user impact), traffic can be immediately switched back to the previous environment. Since the previous environment is still running and unchanged, the rollback is instantaneous — no rebuild, no redeploy, just a traffic switch. This is the key advantage of blue-green deployment over in-place deployments, where rollback requires redeploying the previous version (taking minutes or hours).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle database schema changes in blue-green deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Use the expand-contract pattern. First, expand the schema to support both old and new versions (add new columns, keep old columns, make new columns nullable). Deploy the new version (which uses the new columns). After the new version is stable and the old version is decommissioned, contract the schema (remove old columns, make new columns required). This ensures that both old and new versions work with the schema during the transition, preventing rollback failure due to database incompatibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the infrastructure costs of blue-green deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Blue-green deployment doubles infrastructure cost during deployment (two full production environments). For large applications, this can be significant. Optimize by using infrastructure as code (Terraform, CloudFormation) to spin up the inactive environment on-demand and tear it down after the switch, reducing the cost to only the deployment window. For cloud-hosted applications, auto-scaling groups can be used to manage environment capacity dynamically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you ensure user sessions survive the environment switch?
            </p>
            <p className="mt-2 text-sm">
              A: Use client-side sessions (JWT tokens stored in browser cookies). Client-side sessions are self-contained — the token includes all session information and is validated by any environment. When traffic switches, the user&apos;s token is still valid, and the new environment can validate it without needing access to the old environment&apos;s session store. Alternative: use a shared session store (Redis cluster shared by both environments), but this adds infrastructure complexity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does blue-green deployment compare to canary releases?
            </p>
            <p className="mt-2 text-sm">
              A: Blue-green switches all traffic at once (all users see the new version simultaneously), while canary releases gradually increase traffic to the new version (10%, 25%, 50%, 100%). Blue-green is simpler (all-or-nothing switch) with instant rollback, while canary is more complex (traffic splitting logic) with limited blast radius (issues affect only a subset of users). Blue-green is best for well-tested deployments with high confidence, while canary is best for high-risk deployments where user impact must be minimized.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <p>
          <a
            href="https://martinfowler.com/bliki/BlueGreenDeployment.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Martin Fowler — Blue-Green Deployment
          </a>
          {' '}— Foundational article explaining the blue-green deployment pattern, its benefits, and implementation considerations.
        </p>
        <p>
          <a
            href="https://docs.aws.amazon.com/whitepapers/latest/automating-infrastructure-deployments-with-cloudformation/blue-green-deployments.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            AWS — Blue-Green Deployments with CloudFormation
          </a>
          {' '}— AWS whitepaper on automating blue-green deployments using CloudFormation, including infrastructure templates and best practices.
        </p>
        <p>
          <a
            href="https://cloud.google.com/architecture/blue-green-deployments"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Cloud — Blue-Green Deployment Architecture
          </a>
          {' '}— Google Cloud architecture guide covering blue-green deployment patterns on GCP, including traffic management and rollback strategies.
        </p>
        <p>
          <a
            href="https://sre.google/sre-book/table-of-contents/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google SRE Book — Release Engineering
          </a>
          {' '}— Google&apos;s Site Reliability Engineering book covering release engineering principles, deployment strategies, and techniques for minimizing production impact.
        </p>
        <p>
          <a
            href="https://www.etsy.com/codeascraft"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Etsy Code as Craft — Deployment Blog
          </a>
          {' '}— Etsy&apos;s engineering blog documenting real-world deployment practices, including their evolution toward zero-downtime deployments and lessons learned from production incidents.
        </p>
      </section>
    </ArticleLayout>
  );
}
