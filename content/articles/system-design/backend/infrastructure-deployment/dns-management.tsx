"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-dns-management-extensive",
  title: "DNS Management",
  description:
    "Operate DNS as critical infrastructure: manage records, TTLs, routing policies, and security controls so traffic steering and failover are predictable.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "dns-management",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "dns"],
  relatedTopics: ["load-balancer-configuration", "cloud-services", "networking"],
};

export default function DnsManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Why DNS Is Production Infrastructure</h2>
        <p>
          <strong>DNS management</strong> controls how names map to endpoints and how quickly changes propagate through
          caches and resolvers. DNS is part of the request path for most systems. When DNS is misconfigured or unstable,
          it can create widespread outages that look like random connectivity failures.
        </p>
        <p>
          DNS also influences reliability strategy. It can steer traffic across regions, perform failover, and support
          migrations between providers. But DNS behavior is probabilistic because of caching. That means DNS-based
          strategies must account for the fact that not all clients observe changes at the same time.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/dns-management-diagram-1.svg"
          alt="DNS management overview: records, resolvers, caches, and routing policies"
          caption="DNS sits between clients and infrastructure. TTLs and caching determine how quickly changes take effect in the real world."
        />
      </section>

      <section>
        <h2>Records, TTL, and Caching: The Mechanics That Drive Outages</h2>
        <p>
          DNS records map names to targets. Different record types serve different purposes: addresses, aliases, mail
          routing, verification, and service metadata. Record choice matters because it affects how clients resolve and
          what can be cached.
        </p>
        <p>
          TTL controls how long resolvers cache responses. Low TTL values increase responsiveness to changes but create
          more queries and can increase dependency on DNS provider availability. High TTL values reduce query volume but
          slow down failover and migrations.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">A Practical TTL View</h3>
          <ul className="space-y-2">
            <li>
              <strong>Normal mode:</strong> TTLs can be higher for stability and cost, especially for static targets.
            </li>
            <li>
              <strong>Migration mode:</strong> lower TTLs ahead of a planned cutover so clients refresh more frequently.
            </li>
            <li>
              <strong>Failover mode:</strong> TTL must reflect recovery requirements. If you need fast failover, high TTL is incompatible with that goal.
            </li>
          </ul>
        </div>
        <p>
          Also remember negative caching: resolvers can cache not-found results. This matters when you are creating new
          records or delegations. A record that did not exist five minutes ago may still appear absent to some clients.
        </p>
      </section>

      <section>
        <h2>Traffic Steering: Policies and Their Trade-offs</h2>
        <p>
          DNS can be used to steer traffic based on weights, latency, geography, or health checks. This can improve
          performance and resilience, but it makes debugging harder because different clients can see different answers.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/dns-management-diagram-2.svg"
          alt="DNS control points: TTL strategy, health checks, failover records, and geo or weighted routing"
          caption="DNS routing policies are powerful, but caching means changes are not instantly consistent across all clients."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Weighted routing:</strong> useful for gradual migrations, but caches mean weights are applied imperfectly.
          </li>
          <li>
            <strong>Latency and geo routing:</strong> can improve user experience, but can surprise on-call engineers during incidents.
          </li>
          <li>
            <strong>Health-based failover:</strong> can redirect traffic when endpoints fail, but health checks can flap and can be slower than load balancer failover.
          </li>
        </ul>
        <p className="mt-4">
          DNS is usually best for coarse-grained steering (region selection, provider migration). For fast, precise
          traffic management, load balancers and service meshes are usually more predictable because they operate per request.
        </p>
      </section>

      <section>
        <h2>Security and Ownership: Preventing the Worst-Class Incident</h2>
        <p>
          DNS changes can be catastrophic when attackers or mistakes gain control of domain records. Domain takeover,
          malicious redirection, and certificate issuance fraud are severe incidents. DNS operations should be secured
          accordingly.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Registrar security:</strong> strong authentication, locks where available, and limited access.
          </li>
          <li>
            <strong>Change control:</strong> require review for production zones and keep a clear audit trail.
          </li>
          <li>
            <strong>Separation:</strong> separate accounts or roles for zone editing vs day-to-day operations to reduce accidental changes.
          </li>
          <li>
            <strong>DNSSEC where appropriate:</strong> protect against certain tampering attacks, while understanding operational complexity.
          </li>
        </ul>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          DNS failures are often about propagation and caching: everything is &quot;correct&quot; in the zone but clients
          still see old answers. Other failures are plain misconfiguration: wrong targets, loops, or broken delegation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/dns-management-diagram-3.svg"
          alt="DNS failure modes: long TTL delaying cutover, misconfigured records, failover flapping, and delegation issues"
          caption="DNS incidents are often time-based: caching and TTL make changes appear inconsistent across clients. Plan for this explicitly."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Slow recovery due to TTL</h3>
            <p className="mt-2 text-sm text-muted">
              A failover target is configured correctly, but clients keep using the old target because their resolvers have cached it.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> choose TTLs based on recovery requirements and lower TTLs ahead of planned migrations.
              </li>
              <li>
                <strong>Signal:</strong> partial recovery where some clients succeed while others continue failing for a predictable window.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Wrong record targets</h3>
            <p className="mt-2 text-sm text-muted">
              Records point to the wrong endpoint or an internal address, causing widespread connection failures.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> automated validation, multi-region resolution checks, and staged rollouts for high-risk changes.
              </li>
              <li>
                <strong>Signal:</strong> failures begin immediately after a DNS change and affect a broad set of clients.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Failover flapping</h3>
            <p className="mt-2 text-sm text-muted">
              Health checks oscillate, producing repeated changes in DNS answers and unstable client behavior.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> stable health criteria, appropriate check intervals, and avoiding DNS-based failover for fast-changing health.
              </li>
              <li>
                <strong>Signal:</strong> intermittent failures and inconsistent resolution results across vantage points.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Delegation mistakes</h3>
            <p className="mt-2 text-sm text-muted">
              Subdomain delegation breaks, affecting entire product surfaces, often during migrations between DNS providers.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> staged delegation changes, validation from external resolvers, and overlapping operation during migration.
              </li>
              <li>
                <strong>Signal:</strong> consistent NXDOMAIN responses or resolution failures for delegated zones.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Migrating Traffic to a New CDN Provider</h2>
        <p>
          A team needs to migrate from one CDN provider to another. They lower TTLs ahead of time, validate the new
          provider endpoint in parallel, then switch DNS to the new target. During the cutover window, some clients still
          hit the old provider due to caching. The migration plan includes monitoring both providers and keeping the old
          path alive until the high-TTL caches expire.
        </p>
        <p>
          The outcome is predictable because caching behavior was treated as a feature, not a surprise. The team expected
          partial cutover and planned capacity and monitoring accordingly.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Lower TTL before planned changes:</strong> do it far enough in advance to matter, and remember negative caching.
          </li>
          <li>
            <strong>Validate from multiple regions:</strong> DNS answers can vary; test from different networks and resolvers.
          </li>
          <li>
            <strong>Use staged changes:</strong> avoid simultaneous changes to multiple records and delegations during migrations.
          </li>
          <li>
            <strong>Secure access:</strong> treat registrar and zone access as high privilege with strong audit and limited roles.
          </li>
          <li>
            <strong>Document ownership:</strong> DNS has long-lived consequences; changes should have clear owners and review.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are TTL values aligned with recovery requirements and migration plans?
          </li>
          <li>
            Are routing policies and health checks appropriate for the desired steering behavior?
          </li>
          <li>
            Is there a safe cutover plan that accounts for caching and partial propagation?
          </li>
          <li>
            Are DNS and registrar access controls strong and auditable?
          </li>
          <li>
            Do you validate DNS changes from multiple resolvers and regions before relying on them?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why can DNS failover be slow?</p>
            <p className="mt-2 text-sm">
              Because resolvers cache answers according to TTL. Even after you update records, many clients keep using cached results until they expire.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When is DNS the wrong tool for traffic management?</p>
            <p className="mt-2 text-sm">
              When you need fast, per-request steering. DNS is coarse-grained and cache-dependent; load balancers and meshes are more precise.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes DNS changes risky?</p>
            <p className="mt-2 text-sm">
              A single misconfiguration can affect all clients, and caching can make recovery partial and time-dependent. Security and change control are essential.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

