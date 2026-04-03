"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-zero-downtime-deployment",
  title: "Zero-Downtime Deployment",
  description:
    "Comprehensive guide to zero-downtime deployment covering rolling updates, health checks, database compatibility, graceful degradation, and production implementation patterns.",
  category: "frontend",
  subcategory: "build-deployment",
  slug: "zero-downtime-deployment",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "zero-downtime",
    "rolling updates",
    "health checks",
    "graceful degradation",
    "deployment reliability",
  ],
  relatedTopics: [
    "blue-green-deployment",
    "canary-releases",
    "rollback-strategies",
  ],
};

export default function ZeroDowntimeDeploymentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Zero-downtime deployment</strong> is a deployment strategy that ensures the application remains available and functional throughout the entire deployment process — users experience no interruption, no errors, and no degraded performance during the deployment. Unlike traditional deployments where the application is taken offline during the update (downtime), zero-downtime deployment keeps the application running by deploying the new version alongside the old version, switching traffic only after the new version is verified healthy, and maintaining backward compatibility throughout the transition.
        </p>
        <p>
          For staff-level engineers, zero-downtime deployment is a fundamental requirement for production applications where downtime is costly (e-commerce, SaaS, financial services, healthcare). Even a few minutes of downtime can result in significant revenue loss, user trust erosion, and regulatory compliance violations. Zero-downtime deployment ensures that deployments can happen at any time (not just during maintenance windows) without impacting users, enabling continuous deployment and rapid feature delivery.
        </p>
        <p>
          Zero-downtime deployment involves several technical considerations. Deployment strategy (blue-green, canary, rolling updates — each enables zero-downtime through different mechanisms), health checks (verifying the new version is healthy before switching traffic), database compatibility (ensuring both old and new versions work with the database schema during the transition), graceful degradation (ensuring partial functionality if some components are unavailable during deployment), and CDN cache management (ensuring users receive the correct version from CDN caches during and after deployment).
        </p>
        <p>
          The business case for zero-downtime deployment is availability and user trust. Applications that are always available maintain user trust (users know they can rely on the application), support 24/7 operations (global users in different time zones), and enable continuous deployment (deployments are not restricted to maintenance windows). For competitive organizations, zero-downtime deployment is not optional — it is essential for maintaining market position and user satisfaction.
        </p>
        <p>
          Frontend applications achieve zero-downtime deployment through CDN-based asset serving (new version assets are deployed to CDN alongside old version assets, traffic is switched by updating CDN origin or HTML references). The key challenge is ensuring that users who loaded the old HTML page do not request new version assets (which may not be compatible with the old HTML), and that users who load the new HTML page receive all new version assets (not cached old assets). This is achieved through versioned asset URLs (unique URLs for each version&apos;s assets) and proper cache control headers.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Deployment Strategy:</strong> The mechanism for deploying the new version while keeping the old version running. Blue-green deployment maintains two identical environments, switches traffic all at once. Canary releases gradually increase traffic to the new version. Rolling updates replace old instances with new instances one at a time (or in batches). All three strategies enable zero-downtime deployment through different mechanisms — the choice depends on infrastructure, risk tolerance, and deployment frequency.
          </li>
          <li>
            <strong>Health Checks:</strong> Verification that the new version is healthy before switching traffic. Health checks include HTTP endpoint checks (ensuring the application responds), functional tests (ensuring key features work), performance tests (ensuring response times are acceptable), and smoke tests (ensuring critical user flows work). Only switch traffic if all health checks pass. Health checks prevent switching traffic to a broken version, which would cause downtime.
          </li>
          <li>
            <strong>Database Compatibility:</strong> Ensuring that both old and new versions work with the database schema during the transition. Use the expand-contract pattern: expand the schema to support both versions (add new columns, keep old columns), deploy the new version, then contract the schema (remove old columns) after the old version is decommissioned. This ensures that the old version continues working during the transition, preventing downtime due to database incompatibility.
          </li>
          <li>
            <strong>Graceful Degradation:</strong> Ensuring partial functionality if some components are unavailable during deployment. For example, if a new API endpoint is not yet available, the frontend should display a fallback message instead of crashing. Graceful degradation ensures that users can still use core functionality even if some features are temporarily unavailable during deployment.
          </li>
          <li>
            <strong>CDN Cache Management:</strong> Ensuring that users receive the correct version from CDN caches during and after deployment. Use versioned asset URLs (unique URLs for each version&apos;s assets, e.g., /v1/app.js, /v2/app.js) so that old HTML pages request old assets and new HTML pages request new assets. Use cache-control headers to control CDN cache behavior (long-term caching for versioned assets, short-term caching for HTML pages). Purge CDN cache after deployment if versioned URLs are not used.
          </li>
          <li>
            <strong>Session Compatibility:</strong> Ensuring user sessions survive the deployment. Use client-side sessions (JWT tokens stored in cookies) that are valid across both old and new versions. Server-side sessions require session replication between old and new versions, which adds complexity. Client-side sessions are the simplest solution for zero-downtime deployment.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/zero-downtime-architecture.svg"
          alt="Zero-Downtime Architecture showing old and new versions running simultaneously with traffic routing and health checks"
          caption="Zero-downtime architecture — old and new versions run simultaneously, health checks verify new version health, traffic switches only after verification"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Zero-downtime deployment architecture consists of the old version serving live traffic, the new version being deployed alongside the old version, health checks verifying the new version&apos;s health, traffic switching from the old to the new version, and the old version being decommissioned after the new version is stable. The flow ensures that at every point during the deployment, at least one healthy version is serving traffic — users never experience downtime.
        </p>
        <p>
          For frontend applications, the architecture involves deploying new version assets (HTML, CSS, JavaScript) to the CDN alongside old version assets, updating the HTML reference to point to new version assets (versioned URLs), and ensuring that CDN caches serve the correct version. Users who loaded the old HTML page continue using old assets (compatible with old HTML), while users who load the new HTML page receive new assets (compatible with new HTML). This ensures that all users have a consistent experience, regardless of when they load the page.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/zero-downtime-flow.svg"
          alt="Zero-Downtime Deployment Flow showing sequential stages from deployment preparation through verification and old version decommissioning"
          caption="Zero-downtime flow — deploy new version alongside old, run health checks, switch traffic, verify post-deployment health, decommission old version"
          width={900}
          height={500}
        />

        <h3>Frontend-Specific Considerations</h3>
        <p>
          <strong>Versioned Asset URLs:</strong> Each version&apos;s assets have unique URLs (e.g., /v1/app.js, /v2/app.js). This ensures that old HTML pages request old assets and new HTML pages request new assets. Without versioned URLs, old HTML pages may request new assets (which may be incompatible with old HTML), causing errors. Versioned URLs are the cleanest solution for frontend zero-downtime deployment.
        </p>
        <p>
          <strong>HTML Cache Control:</strong> HTML pages should have short cache TTL (e.g., 5 minutes) or no cache, so that users receive the latest HTML page (referencing the latest assets). Long HTML cache TTL causes users to receive stale HTML pages (referencing old assets), which may be incompatible with new backend APIs. Use cache-control: no-cache for HTML pages, cache-control: max-age=31536000 for versioned assets.
        </p>
        <p>
          <strong>Lazy Loading Compatibility:</strong> If the new version uses lazy-loaded chunks (code splitting), ensure that lazy-loaded chunks are available on the CDN before switching traffic. If users request lazy-loaded chunks that are not yet deployed, they will receive 404 errors. Deploy all chunks (main bundle and lazy-loaded chunks) before switching traffic, or use fallback handling (redirect to main bundle if chunk is not found).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/zero-downtime-cdn.svg"
          alt="Zero-Downtime CDN Cache Management showing versioned asset URLs and cache control strategies"
          caption="CDN cache management — versioned asset URLs ensure old HTML gets old assets and new HTML gets new assets, cache-control headers control caching behavior"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Zero-downtime deployment involves trade-offs between deployment complexity, infrastructure cost, rollback speed, and user experience. Understanding these trade-offs is essential for designing effective zero-downtime deployment strategies.
        </p>

        <h3>Blue-Green vs. Rolling Updates</h3>
        <p>
          <strong>Blue-Green:</strong> Two full environments, instant traffic switch. Advantages: instant rollback (switch back instantly), simple deployment logic (all-or-nothing switch), zero-downtime guaranteed (traffic switch is instant). Limitations: double infrastructure cost, all users see the new version at once (no gradual exposure). Best for: applications requiring instant rollback, teams wanting simple deployment logic.
        </p>
        <p>
          <strong>Rolling Updates:</strong> Gradual instance replacement, one at a time or in batches. Advantages: lower infrastructure cost (only need capacity for one additional batch), gradual exposure (issues affect only a subset of users). Limitations: slower rollback (must roll back instance by instance), potential for mixed-version requests (some requests hit old instances, some hit new). Best for: large-scale applications where double infrastructure cost is prohibitive.
        </p>

        <h3>Versioned URLs vs. Cache Purge</h3>
        <p>
          <strong>Versioned URLs:</strong> Each version&apos;s assets have unique URLs. Advantages: no cache purge needed (old and new assets coexist), old HTML pages continue working (they request old assets), new HTML pages receive new assets. Limitations: requires build tool configuration (generate versioned URLs), CDN stores multiple versions (storage cost). Best for: frontend applications with code splitting, frequent deployments.
        </p>
        <p>
          <strong>Cache Purge:</strong> Purge CDN cache after deployment to ensure new assets are served. Advantages: simple (no versioned URLs needed), CDN stores only one version (lower storage cost). Limitations: cache purge takes time (CDN may take minutes to purge all edges), old HTML pages may request new assets (incompatible), cache purge storm (CDN re-fetches all assets from origin, causing origin load spike). Best for: infrequent deployments, simple applications without code splitting.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/zero-downtime-strategies.svg"
          alt="Zero-Downtime Strategies comparison showing blue-green, canary, and rolling update approaches"
          caption="Zero-downtime strategies — blue-green (instant switch, double cost), canary (gradual, limited blast radius), rolling updates (gradual instance replacement, lower cost)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Versioned Asset URLs:</strong> Generate unique URLs for each version&apos;s assets (e.g., /v1/app.abc123.js, /v2/app.def456.js). This ensures that old HTML pages request old assets and new HTML pages request new assets. Configure the build tool to generate versioned URLs automatically (Webpack content hash, Vite content hash, Rollup content hash). Versioned URLs are the foundation of frontend zero-downtime deployment.
          </li>
          <li>
            <strong>Set Proper Cache-Control Headers:</strong> Use cache-control: max-age=31536000 (long-term caching) for versioned assets (they never change — URL changes when content changes). Use cache-control: no-cache for HTML pages (always check for updates). This combination ensures that assets are cached aggressively (fast loading) while HTML pages are always fresh (latest asset references).
          </li>
          <li>
            <strong>Run Health Checks Before Switching Traffic:</strong> Verify the new version is healthy before switching traffic. Health checks should include HTTP endpoint checks, functional tests, performance tests, and smoke tests. Only switch traffic if all health checks pass. This prevents switching traffic to a broken version, which would cause downtime.
          </li>
          <li>
            <strong>Deploy All Assets Before Switching Traffic:</strong> Ensure all assets (main bundle, lazy-loaded chunks, CSS, images, fonts) are deployed to the CDN before switching traffic. If users request assets that are not yet deployed, they will receive 404 errors. Deploy all assets first, then switch traffic. For code-split applications, this means deploying the main bundle and all lazy-loaded chunks.
          </li>
          <li>
            <strong>Monitor Post-Deployment Health:</strong> After switching traffic, monitor the new version for errors, performance degradation, and user impact. Set up automated alerts for error rate spikes, response time increases, and business metric anomalies. If issues are detected, rollback immediately. Monitoring ensures that issues are caught quickly and rolled back before significant user impact.
          </li>
          <li>
            <strong>Test Zero-Downtime Deployment Regularly:</strong> Regularly test the zero-downtime deployment process to ensure it works when needed. Include deployment testing in your CI/CD pipeline — deploy to staging, verify zero-downtime (no errors during deployment), verify rollback works. Regular testing ensures that zero-downtime deployment is reliable when needed most (production deployments).
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incompatible Asset Requests:</strong> Old HTML pages requesting new version assets (or vice versa), causing errors. This happens when asset URLs are not versioned — old HTML requests /app.js, which now points to the new version&apos;s app.js (incompatible with old HTML). Solution: use versioned asset URLs (unique URLs for each version&apos;s assets) so that old HTML requests old assets and new HTML requests new assets.
          </li>
          <li>
            <strong>Missing Lazy-Loaded Chunks:</strong> Deploying the main bundle but not lazy-loaded chunks, causing 404 errors when users navigate to lazy-loaded routes. Ensure all chunks (main bundle and lazy-loaded chunks) are deployed before switching traffic. Configure the build tool to deploy all chunks together, not separately.
          </li>
          <li>
            <strong>Long HTML Cache TTL:</strong> Caching HTML pages for too long (e.g., 24 hours), causing users to receive stale HTML pages referencing old assets. Use cache-control: no-cache for HTML pages (always check for updates) or short cache TTL (e.g., 5 minutes). This ensures that users receive the latest HTML page with the latest asset references.
          </li>
          <li>
            <strong>Database Incompatibility:</strong> Deploying the new version with non-backward-compatible database schema changes, causing the old version to fail during the transition. Use the expand-contract pattern for schema changes, ensuring both old and new versions work with the schema during the transition.
          </li>
          <li>
            <strong>Session Invalidation:</strong> Switching versions without ensuring session compatibility, causing users to be logged out. Use client-side sessions (JWT tokens) that are valid across both old and new versions, or replicate sessions between old and new versions.
          </li>
          <li>
            <strong>Skipping Health Checks:</strong> Switching traffic to the new version without running health checks. If the new version is broken, switching traffic causes downtime. Always run health checks before switching traffic, and only switch if all checks pass.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Platform Deployment</h3>
        <p>
          E-commerce platforms deploy multiple times per day with zero downtime. New version assets are deployed to the CDN alongside old version assets, HTML reference is updated to point to new version assets, health checks verify the new version, and traffic is switched. Versioned asset URLs ensure that old HTML pages continue working (they request old assets), while new HTML pages receive new assets. Users experience no interruption during deployment — shopping continues seamlessly.
        </p>

        <h3>SaaS Application Deployment</h3>
        <p>
          SaaS applications deploy with zero downtime using blue-green deployment. The new version is deployed to the green environment, health checks verify functionality, and traffic is switched from blue to green. Client-side sessions (JWT tokens) ensure that user sessions survive the environment switch. Monitoring alerts detect any post-deployment issues, triggering instant rollback if needed. This pattern enables SaaS teams to ship features rapidly while maintaining high availability.
        </p>

        <h3>Content Publishing Platform Deployment</h3>
        <p>
          Content publishing platforms deploy theme and template changes with zero downtime. New version assets are deployed to the CDN, HTML reference is updated, CDN cache is purged for HTML pages (ensuring users receive latest HTML), and versioned asset URLs ensure correct asset delivery. If content rendering issues are detected, instant rollback restores the previous version. This pattern ensures that content is always available during deployments.
        </p>

        <h3>Financial Services Application Deployment</h3>
        <p>
          Financial services applications deploy with zero downtime for regulatory compliance. The new version undergoes extensive testing on the inactive environment (functional tests, security scans, compliance checks), health checks verify functionality, and traffic is switched. The instant rollback capability ensures that if regulatory issues are detected, the previous version is restored immediately. This pattern meets regulatory requirements for availability while enabling feature delivery.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you achieve zero-downtime deployment for frontend applications?
            </p>
            <p className="mt-2 text-sm">
              A: Deploy new version assets (HTML, CSS, JavaScript) to the CDN alongside old version assets. Use versioned asset URLs (unique URLs for each version&apos;s assets) so that old HTML pages request old assets and new HTML pages request new assets. Set proper cache-control headers (long-term caching for versioned assets, no-cache for HTML pages). Run health checks on the new version before switching traffic. Switch traffic by updating the HTML reference (serving new HTML pages that reference new assets). Monitor post-deployment health and rollback if issues are detected. This ensures that at every point during deployment, users receive a consistent, working version of the application.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are versioned asset URLs and why are they important?
            </p>
            <p className="mt-2 text-sm">
              A: Versioned asset URLs are unique URLs for each version&apos;s assets (e.g., /v1/app.abc123.js, /v2/app.def456.js). They are generated by the build tool using content hashes (the hash changes when content changes). Versioned URLs are important because they ensure that old HTML pages request old assets (compatible with old HTML) and new HTML pages request new assets (compatible with new HTML). Without versioned URLs, old HTML pages may request new assets (incompatible with old HTML), causing errors. Versioned URLs are the foundation of frontend zero-downtime deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle lazy-loaded chunks during zero-downtime deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Deploy all chunks (main bundle and lazy-loaded chunks) before switching traffic. If users request lazy-loaded chunks that are not yet deployed, they will receive 404 errors. Configure the build tool to deploy all chunks together, not separately. Use fallback handling (redirect to main bundle if chunk is not found) as a safety net. Monitor chunk loading errors after deployment to catch any missing chunks. This ensures that all routes work correctly after deployment, not just the initial page load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What cache-control headers should you use for zero-downtime deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Use cache-control: max-age=31536000 (long-term caching) for versioned assets (they never change — URL changes when content changes). Use cache-control: no-cache for HTML pages (always check for updates — users need latest HTML with latest asset references). Use cache-control: max-age=86400 (24 hours) for non-versioned assets (images, fonts) that do not change frequently. This combination ensures that assets are cached aggressively (fast loading) while HTML pages are always fresh (latest asset references).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you ensure database compatibility during zero-downtime deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Use the expand-contract pattern for database schema changes. Expand the schema to support both old and new versions (add new columns, keep old columns, make new columns nullable). Deploy the new version (which uses the new columns). After the new version is stable and the old version is decommissioned, contract the schema (remove old columns, make new columns required). This ensures that both old and new versions work with the schema during the transition, preventing downtime due to database incompatibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test zero-downtime deployment?
            </p>
            <p className="mt-2 text-sm">
              A: Deploy to staging environment, verify zero-downtime (no errors during deployment, users can continue using the application), verify rollback works (switch back to previous version, verify it works). Include deployment testing in your CI/CD pipeline — automate the deployment, health checks, traffic switch, and rollback. Monitor deployment metrics (error rate during deployment, response time, user impact) to ensure zero-downtime is achieved. Regular testing ensures that zero-downtime deployment is reliable when needed most (production deployments).
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
              href="https://martinfowler.com/bliki/ZeroDowntimeDeploy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Martin Fowler — Zero Downtime Deploy
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/whitepapers/latest/automating-infrastructure-deployments-with-cloudformation/zero-downtime-deployments.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AWS — Zero-Downtime Deployments
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/architecture/zero-downtime-deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud — Zero-Downtime Deployment Architecture
            </a>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/continuous-delivery/deployment/blue-green-deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Atlassian — Zero-Downtime Deployment Strategies
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/http-cache/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — HTTP Caching for Deployment
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
