"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-blue-green-deployment",
  title: "Blue-Green Deployment",
  description:
    "Comprehensive guide to blue-green deployment strategy covering zero-downtime releases, traffic switching, rollback capability, infrastructure requirements, and production implementation patterns.",
  category: "frontend",
  subcategory: "build-deployment",
  slug: "blue-green-deployment",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "blue-green deployment",
    "zero-downtime",
    "traffic switching",
    "rollback",
    "release strategy",
  ],
  relatedTopics: [
    "canary-releases",
    "rollback-strategies",
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
          For staff-level engineers, blue-green deployment is a fundamental pattern for achieving deployment reliability and rollback capability. Unlike traditional deployments where the new version replaces the old version in-place (risking downtime if the new version fails), blue-green deployment keeps the old version running until the new version is verified and traffic is switched. The switch is instantaneous (DNS change, load balancer configuration update, or CDN origin change), so users experience no downtime during the deployment.
        </p>
        <p>
          Blue-green deployment involves several technical considerations. Infrastructure requirements include maintaining two identical production environments (doubling infrastructure cost during deployment), traffic switching mechanism (DNS, load balancer, CDN origin), database compatibility (new version must work with the existing database schema, and the old version must continue working during the transition), and session management (user sessions must survive the environment switch). The strategy is most effective for stateless applications (frontend static assets, API servers without local state) where environment switching is straightforward.
        </p>
        <p>
          The business case for blue-green deployment is deployment reliability and risk mitigation. Zero-downtime deployments ensure that users are not impacted during releases, maintaining user trust and satisfaction. Instant rollback capability (switch back to the previous environment) enables quick recovery from failed deployments, reducing mean time to recovery (MTTR) from hours to seconds. For customer-facing applications where downtime is costly (e-commerce, SaaS, financial services), blue-green deployment is essential for maintaining availability during releases.
        </p>
        <p>
          Frontend applications are particularly well-suited for blue-green deployment because frontend assets (HTML, CSS, JavaScript) are stateless and served from CDNs. Deploying a new frontend version to the green environment (new CDN origin or new S3 bucket), testing it, and switching traffic (updating CDN origin or DNS) is straightforward and instantaneous. The previous version remains available on the blue environment, enabling instant rollback if issues are detected.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Two Identical Environments:</strong> Blue and green environments are identical production environments (same infrastructure, same configuration, same CDN setup). One environment is active (serving live traffic), the other is inactive (available for deployment). Environments are switched on each deployment — if blue is active now, green becomes active after deployment, and vice versa.
          </li>
          <li>
            <strong>Traffic Switching:</strong> The mechanism for redirecting user traffic from the active environment to the newly deployed environment. Common methods include DNS record update (changing the DNS record to point to the new environment, with TTL considerations), load balancer configuration (updating the load balancer backend pool to point to the new environment), CDN origin update (changing the CDN origin to the new environment), or DNS-based routing (using DNS to route a percentage of traffic to each environment). The switch should be as instantaneous as possible to minimize user impact.
          </li>
          <li>
            <strong>Instant Rollback:</strong> If issues are detected after the traffic switch, traffic can be immediately switched back to the previous environment. Since the previous environment is still running and unchanged, the rollback is instantaneous — no rebuild, no redeploy, just a traffic switch. This is the key advantage of blue-green deployment over in-place deployments, where rollback requires redeploying the previous version.
          </li>
          <li>
            <strong>Database Compatibility:</strong> The new version must be compatible with the existing database schema. If the new version requires database schema changes, those changes must be backward-compatible (the old version must continue working with the new schema). This is typically achieved through expand-contract pattern: expand the schema to support both old and new versions, deploy the new version, then contract the schema (remove old columns) after the old version is decommissioned.
          </li>
          <li>
            <strong>Session Management:</strong> User sessions must survive the environment switch. If sessions are stored server-side (in the active environment), switching environments will invalidate sessions. Solutions include storing sessions in a shared store (Redis cluster shared by both environments), using client-side sessions (JWT tokens stored in browser cookies), or replicating sessions between environments. For frontend applications, client-side sessions (JWT tokens) are the simplest solution.
          </li>
          <li>
            <strong>Health Checks:</strong> After deploying to the inactive environment and before switching traffic, run comprehensive health checks (HTTP endpoint checks, functional tests, performance tests, smoke tests) to verify that the new version is healthy. Only switch traffic if health checks pass. Health checks prevent switching traffic to a broken version, reducing the risk of production incidents.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/blue-green-architecture.svg"
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
          src="/diagrams/system-design-concepts/frontend/build-deployment/blue-green-flow.svg"
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
          src="/diagrams/system-design-concepts/frontend/build-deployment/blue-green-rollback.svg"
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
          Blue-green deployment involves trade-offs between infrastructure cost, deployment safety, rollback speed, and complexity. Understanding these trade-offs is essential for deciding when to use blue-green deployment versus other deployment strategies.
        </p>

        <h3>Blue-Green vs. Rolling Deployment</h3>
        <p>
          <strong>Blue-Green:</strong> Maintains two full production environments, switches traffic all at once. Advantages: instant rollback (switch back to previous environment instantly), simple rollback (no incremental rollback logic), zero-downtime (traffic switch is instant). Limitations: double infrastructure cost (two full environments), all users see the new version at once (no gradual rollout). Best for: applications requiring instant rollback, teams wanting simple deployment logic.
        </p>
        <p>
          <strong>Rolling:</strong> Gradually replaces old instances with new instances (one at a time or in batches). Advantages: lower infrastructure cost (only need capacity for one additional batch), gradual rollout (issues affect only a subset of users). Limitations: slower rollback (must roll back instance by instance), complex rollback logic (determining which instances to roll back), potential for mixed-version requests (some requests hit old instances, some hit new). Best for: large-scale applications where double infrastructure cost is prohibitive.
        </p>

        <h3>Blue-Green vs. Canary</h3>
        <p>
          <strong>Blue-Green:</strong> All traffic switches at once. Advantages: simple (all-or-nothing switch), instant feedback (all users see the new version), instant rollback. Limitations: all users are impacted if the new version has issues (no gradual exposure). Best for: well-tested deployments where confidence in the new version is high.
        </p>
        <p>
          <strong>Canary:</strong> Small percentage of traffic routed to the new version first, gradually increased. Advantages: limited blast radius (issues affect only a small percentage of users), gradual validation (monitor canary metrics before full rollout). Limitations: complex traffic splitting logic, slower deployment (gradual increase takes time), complex rollback (must determine which users to roll back). Best for: high-risk deployments, applications where user impact must be minimized.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/deployment-strategies.svg"
          alt="Deployment Strategies comparison showing blue-green, rolling, and canary approaches with their trade-offs"
          caption="Deployment strategies — blue-green (all-at-once, instant rollback), rolling (gradual instance replacement), canary (gradual traffic split)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Automate the Entire Process:</strong> The deployment process (deploy to inactive environment, run health checks, switch traffic, verify health) should be fully automated through the CI/CD pipeline. Manual steps introduce risk (human error, inconsistent execution) and slow down deployments. Automation ensures consistent, reliable deployments every time.
          </li>
          <li>
            <strong>Run Comprehensive Health Checks Before Switching:</strong> Before switching traffic, run health checks against the newly deployed environment. Health checks should include HTTP endpoint checks (ensuring the application responds), functional tests (ensuring key features work), performance tests (ensuring response times are acceptable), and smoke tests (ensuring critical user flows work). Only switch traffic if all health checks pass.
          </li>
          <li>
            <strong>Ensure Database Backward Compatibility:</strong> The new version must work with the existing database schema. Use the expand-contract pattern: expand the schema to support both old and new versions (add new columns, keep old columns), deploy the new version, then contract the schema (remove old columns) after the old version is decommissioned. This ensures that the old version continues working during the transition.
          </li>
          <li>
            <strong>Use Client-Side Sessions:</strong> Store user sessions client-side (JWT tokens in cookies) rather than server-side (session store in the active environment). Client-side sessions survive environment switches (the token is valid regardless of which environment serves the request). Server-side sessions require session replication between environments, which adds complexity.
          </li>
          <li>
            <strong>Monitor After Switching:</strong> After switching traffic, monitor the new environment for errors, performance degradation, and user impact. Set up automated alerts for error rate spikes, response time increases, and business metric anomalies. If issues are detected, switch traffic back immediately (instant rollback). Monitoring ensures that issues are caught quickly and rolled back before significant user impact.
          </li>
          <li>
            <strong>Test the Rollback Process:</strong> Regularly test the rollback process (switch traffic back to the previous environment) to ensure it works when needed. A rollback process that has not been tested may fail when needed most (during a production incident). Include rollback testing in your deployment pipeline — after each deployment, test that rollback works by switching traffic back and forth.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Database Schema Incompatibility:</strong> Deploying a new version that requires database schema changes without ensuring backward compatibility. The old version may fail when the schema changes, causing production issues during the transition. Always use expand-contract pattern for schema changes, ensuring both old and new versions work with the schema during the transition.
          </li>
          <li>
            <strong>Session Invalidation:</strong> Switching environments without ensuring session compatibility. If sessions are stored server-side in the active environment, switching environments invalidates all user sessions (users are logged out). Use client-side sessions (JWT tokens) or shared session stores (Redis cluster) to ensure sessions survive the environment switch.
          </li>
          <li>
            <strong>Skipping Health Checks:</strong> Switching traffic to the new environment without running health checks. If the new environment is broken, switching traffic causes a production incident. Always run comprehensive health checks (HTTP, functional, performance, smoke tests) before switching traffic, and only switch if all checks pass.
          </li>
          <li>
            <strong>DNS Propagation Delay:</strong> Using DNS updates for traffic switching without considering TTL (time to live). DNS records are cached by resolvers based on TTL, so some users may be directed to the old environment during propagation. Use low TTL (e.g., 60 seconds) before deployment to minimize propagation delay, or use load balancer/CDN updates for instant switching.
          </li>
          <li>
            <strong>Infrastructure Cost:</strong> Maintaining two full production environments doubles infrastructure cost during deployment. For large applications, this can be significant. Optimize by using infrastructure as code (Terraform, CloudFormation) to spin up the inactive environment on-demand and tear it down after the switch, reducing the cost to only the deployment window.
          </li>
          <li>
            <strong>Not Testing Rollback:</strong> Assuming rollback works without testing it. Rollback processes that have not been tested may fail when needed most. Regularly test rollback (switch traffic back and forth) to ensure it works, and include rollback testing in your deployment pipeline.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Platform</h3>
        <p>
          E-commerce platforms (Amazon, Shopify stores) use blue-green deployment for zero-downtime releases during peak shopping periods. The new version is deployed to the green environment, tested with automated smoke tests (product page loads, checkout flow works, payment processing succeeds), and traffic is switched from blue to green. If checkout errors are detected after the switch, traffic is immediately switched back to blue (instant rollback). This ensures that shopping experience is never disrupted during deployments, maintaining revenue and user trust.
        </p>

        <h3>SaaS Application</h3>
        <p>
          SaaS applications (Slack, Notion, Figma) use blue-green deployment for frequent releases (multiple times per day). The new version is deployed to the inactive environment, health checks verify functionality, and traffic is switched. Client-side sessions (JWT tokens) ensure that user sessions survive the environment switch. Monitoring alerts detect any post-deployment issues, triggering instant rollback if needed. This pattern enables SaaS teams to ship features rapidly while maintaining high availability.
        </p>

        <h3>Financial Services Application</h3>
        <p>
          Financial services applications (banking apps, trading platforms) use blue-green deployment for regulated releases where downtime is unacceptable. The new version undergoes extensive testing on the inactive environment (functional tests, security scans, compliance checks) before traffic is switched. The instant rollback capability ensures that if regulatory issues are detected, the previous version is restored immediately. This pattern meets regulatory requirements for availability while enabling feature delivery.
        </p>

        <h3>Content Publishing Platform</h3>
        <p>
          Content publishing platforms (WordPress VIP, content management systems) use blue-green deployment for CMS updates and theme changes. The new version is deployed to the inactive environment, tested with content migration verification (ensuring all content renders correctly), and traffic is switched. CDN origin update ensures instant switch with no DNS propagation delay. If content rendering issues are detected, instant rollback restores the previous version. This pattern ensures that content is always available during deployments.
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
              A: Use the expand-contract pattern. First, expand the schema to support both old and new versions (add new columns, keep old columns, make new columns nullable). Deploy the new version (which uses the new columns). After the new version is active and the old version is decommissioned, contract the schema (remove old columns, make new columns required). This ensures that both old and new versions work with the schema during the transition, preventing production issues.
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
        <ul className="space-y-2">
          <li>
            <a
              href="https://martinfowler.com/bliki/BlueGreenDeployment.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Martin Fowler — Blue-Green Deployment
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/whitepapers/latest/automating-infrastructure-deployments-with-cloudformation/blue-green-deployments.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS — Blue-Green Deployments with CloudFormation
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/architecture/blue-green-deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud — Blue-Green Deployment Architecture
            </a>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/continuous-delivery/deployment/blue-green-deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Atlassian — Blue-Green Deployments Guide
            </a>
          </li>
          <li>
            <a
              href="https://codefresh.io/learn/blue-green-deployment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Codefresh — Blue-Green Deployment Explained
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
