"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-region-frontend-architecture",
  title: "Design a Multi-Region Frontend Architecture",
  description:
    "Architecture for a globally distributed frontend: GeoDNS routing users to the nearest region, anycast CDN edge nodes serving static assets, active-active multi-region API deployment with read replicas, data residency compliance (EU GDPR, India data localization), region failover with DNS TTL tuning, split-horizon DNS for internal vs external routing, session affinity via region-stamped JWT, and edge computing for latency-sensitive personalization.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "multi-region-frontend-architecture",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "multi-region", "geodns", "cdn", "active-active", "failover", "data-residency", "edge-computing"],
  relatedTopics: ["frontend-1m-concurrent-users", "graceful-degradation-system"],
};

export default function MultiRegionFrontendArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A multi-region frontend architecture serves users in multiple geographic regions with the lowest possible latency, while maintaining data residency compliance and surviving regional failures. The fundamental challenge is that a single-origin server in us-east-1 has an unavoidable physical latency of 150–250ms for users in Mumbai (speed-of-light distance) and 200–300ms for Tokyo, before any application processing. For every 100ms of latency, e-commerce conversion rates drop approximately 1%. Multi-region deployment addresses this by placing compute and data close to users.</HighlightBlock>
        <HighlightBlock as="p" tier="important">But multi-region introduces new challenges: data consistency across regions (which region's database is authoritative for a write?), data residency (EU GDPR requires that EU user data stays in EU infrastructure; India's data localization laws require certain categories of data to be stored in India), failover (how do users in eu-west-1 continue to be served when the EU region goes down?), and routing (how does a user's browser know which region to talk to?). These challenges require careful coordination between DNS, CDN, API gateways, and the backend data layer.</HighlightBlock>
        <p><strong>Explicit scope:</strong> DNS routing strategy, CDN configuration, multi-region API deployment, session affinity, data residency enforcement, and region failover. Not in scope: database replication implementation, microservice mesh configuration, or infrastructure provisioning specifics.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Geographic routing:</strong> Users are automatically routed to the nearest healthy region. Routing is transparent to the user — the same domain (api.example.com) resolves to different IP addresses depending on the user's location. Routing latency overhead is under 5ms (DNS TTL optimization).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Static assets:</strong> JS bundles, CSS, fonts, and images are served from CDN edge nodes globally (Cloudflare or Fastly anycast network with 300+ PoPs). Static asset latency is under 50ms for 95% of global users, regardless of origin region.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>API routing:</strong> Read API requests are served by the nearest region's read replica. Write API requests are routed to the primary region for the user's data residency zone (EU writes go to eu-west-1, US writes go to us-east-1, India writes go to ap-south-1). Session data follows the user's assigned region.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Failover:</strong> If a region becomes unhealthy (&gt;5% error rate for 30 seconds), GeoDNS automatically routes new connections to the next-nearest healthy region within 60 seconds (DNS TTL of 30 seconds + 30-second detection window).</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Latency targets:</strong> API p95 latency under 200ms for users within their assigned region. Static asset p95 latency under 50ms globally. DNS resolution under 10ms (GeoDNS with anycast).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Data residency:</strong> EU user PII (email, address, payment data) stored exclusively in eu-west-1 and eu-central-1. India user financial data stored exclusively in ap-south-1. Non-PII data (analytics, product catalog) is replicated globally for read performance. Data residency is enforced at the API gateway layer, not just policy — requests routing EU data to non-EU infrastructure are rejected with 451 Unavailable For Legal Reasons.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Availability:</strong> 99.99% global uptime. Single-region failure does not cause a global outage. Planned maintenance can be performed per-region with zero downtime using canary routing.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The architecture has five layers. The DNS Layer uses GeoDNS (AWS Route 53 with latency-based routing, or Cloudflare Load Balancing) to resolve api.example.com to the IP of the nearest healthy region. DNS TTL is 30 seconds to enable fast failover. The CDN Layer (Cloudflare anycast) serves all static assets globally with immutable caching — the CDN does not distinguish between regions for static content (a JS bundle is identical worldwide). The Edge Layer (Cloudflare Workers, deployed globally) handles JWT verification, geo-tagging of requests (adding X-User-Region header based on IP geolocation), and data-residency enforcement before any request reaches the origin. The Regional API Layer consists of three independent API clusters (us-east-1, eu-west-1, ap-south-1), each with its own stateless application servers, a read replica of the global product catalog, and a primary database for region-specific user data. The Global Data Layer consists of a globally replicated Aurora PostgreSQL cluster for non-PII data (async replication, eventual consistency) and region-isolated RDS instances for PII data (no cross-region replication).</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/multi-region-frontend-architecture.svg"
          alt="Multi-region frontend architecture: GeoDNS (Route 53 latency routing → nearest healthy region; TTL=30s for fast failover; health check: HTTP 200 on /health every 10s; failover: route to next region in 30s+TTL); CDN anycast (Cloudflare 300+ PoPs; static assets immutable cache max-age=31536000; same files globally — no region split for assets); edge workers (Cloudflare Worker at every PoP: verify JWT, extract region claim, add X-User-Region header, enforce data residency: if EU user + non-EU endpoint → 451); regional API (3 clusters: us-east-1, eu-west-1, ap-south-1; reads: local read replica; writes: route to user's home region; session-stamped JWT: region=eu claim routes all API calls to eu-west-1); data residency (EU PII: only eu-west-1 + eu-central-1; India financial: only ap-south-1; product catalog: global async replication; failover: reads promoted to cross-region replica; writes: queue for home region recovery)."
          caption="GeoDNS latency routing (30s TTL, 10s health checks, 60s failover), Cloudflare anycast CDN (300+ PoPs, immutable assets), edge workers (JWT verify, X-User-Region tagging, data-residency 451 enforcement), 3-region active-active API (reads local replica, writes home-region, session JWT region claim), isolated PII storage per compliance zone"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">GeoDNS and Failover</h3>
        <HighlightBlock as="p" tier="important">AWS Route 53 latency-based routing returns the DNS record for the region with the lowest measured RTT from the user's resolver IP. Route 53 measures latency between its PoPs and each regional endpoint continuously, maintaining a latency database that it uses to answer DNS queries. The DNS response includes an A record pointing to the regional API gateway's anycast IP, with a TTL of 30 seconds. This short TTL means that when a region fails, clients will re-resolve the domain within 30 seconds and receive the IP of the failover region.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Health checks are configured on Route 53: an HTTP health check to GET /health every 10 seconds from multiple Route 53 health checker locations. A region is marked unhealthy when 3 consecutive health checks fail. Route 53 then stops returning that region's DNS records and all new connections go to the next-nearest healthy region. DNS failover does not affect existing TCP connections — users in the middle of a WebSocket session or long-poll will be disconnected and must reconnect, at which point their new connection goes to the healthy region.</HighlightBlock>
        <HighlightBlock as="p" tier="important">DNS TTL of 30 seconds means some clients still have the old (failed) region's IP cached for up to 30 seconds after failover. During this window, connection attempts to the failed region will fail at the TCP level. The client browser retries with exponential backoff (built into the browser's fetch retry behavior for connection errors, not application-level 5xx). After the DNS TTL expires, the client re-resolves to the healthy region. This 30-60 second window of intermittent errors during a region failover is the accepted trade-off for fast failover — a longer TTL (5 minutes) would reduce DNS overhead but extend the failover window.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Session Affinity and Region-Stamped JWT</h3>
        <HighlightBlock as="p" tier="important">When a user logs in, the authentication service issues a JWT with a region claim: &#123;"sub": "user-uuid", "region": "eu", "exp": 1234567890&#125;. The region claim is determined by the user's registration data residency zone (EU users get region=eu, regardless of where they are physically located when logging in). Every subsequent API request carries this JWT, and the API gateway uses the region claim to route write requests to the correct home region. This allows an EU user traveling in the US to route their read requests to the US region (low latency) while still routing write requests to eu-west-1 (data residency compliance).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The edge worker (Cloudflare Worker) verifies the JWT and extracts the region claim before the request reaches the regional API cluster. It adds an X-User-Region: eu header to the forwarded request. The regional API cluster uses this header to determine whether the write should be handled locally (if the cluster is the user's home region) or proxied to the home region (if the cluster is a different region serving this user's read requests). Proxying writes across regions adds 50–150ms of additional latency (the inter-region RTT), which is acceptable for write operations but not for reads. Reads are always served locally.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Residency Enforcement</h3>
        <HighlightBlock as="p" tier="important">Data residency is enforced at two layers: the edge worker (first line of defense) and the regional API cluster (authoritative enforcement). The edge worker checks: if the JWT contains region=eu and the request is destined for a non-EU cluster (detected via the X-Serving-Region header set by the API gateway), return 451 Unavailable For Legal Reasons. This prevents data from being processed in a non-compliant region even if GeoDNS malfunctions and routes an EU user to a US cluster.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The regional API cluster's second layer of enforcement: before processing any write to the user's PII table, verify that the current cluster's region matches the user's home region from the JWT. If not (this can happen during failover when writes are temporarily accepted cross-region for availability), the data is processed but immediately replicated to the home region and deleted from the non-home region within 24 hours (the "data gravity" migration process). This short-term cross-region processing during failover is disclosed in the DPA (Data Processing Agreement) as a force majeure exception.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Canary Releases Across Regions</h3>
        <HighlightBlock as="p" tier="crucial">Deploying new API versions across multiple regions requires careful orchestration to prevent global outages. The deployment strategy: (1) Deploy to a canary pool in one region (5% of traffic, selected via weighted Route 53 routing within the region); (2) Monitor for 30 minutes — if error rate or p99 latency increases &gt;20%, roll back the canary deployment; (3) If the canary is healthy, promote to 100% in that region; (4) Repeat for the next region with a 24-hour bake time between regions. This "region-by-region" rollout ensures that a bad deployment affects at most one region's users before being caught. Frontend assets (JS bundles) are versioned independently of API versions — the API gateway uses content negotiation (Accept-Version header) to serve the correct API version to clients running older JS bundles during the transition period.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Active-active vs. active-passive multi-region: In an active-active setup, all regions accept reads and writes simultaneously. In an active-passive setup, only one region (the primary) accepts writes, and secondary regions handle reads. Active-active provides lower write latency for global users and higher availability (any region can take over writes), but requires distributed transaction coordination for strong consistency across regions (expensive — typically avoided by using eventual consistency). Active-passive simplifies write consistency (one authoritative source) but creates a write bottleneck and means users far from the primary region experience high write latency. For most content platforms, active-active with eventual consistency for most data and active-passive with synchronous replication for financial transactions is the pragmatic choice.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Read-your-own-writes consistency: After a user writes to their home region, they may read from a closer read replica that has not yet received the replication update. The user sees stale data after their own write — a confusing experience ("I just posted a comment, but I can't see it"). Solutions: (1) Route the user's reads to their home region for 60 seconds after a write (using a read-after-write sticky cookie); (2) Include the write's version vector in the response and pass it as a conditional GET header (read from replica if version &gt;= X, otherwise read from primary); (3) Serve reads optimistically from the client cache (the write is shown immediately in the UI from the local state, regardless of what the replica returns). Option 3 (client-side optimistic update) is the simplest and most common approach for content platforms.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A multi-region frontend architecture routes users to the nearest healthy region via GeoDNS (Route 53 latency routing, 30s TTL, 10s health checks, 60s failover), serves all static assets from CDN anycast (Cloudflare 300+ PoPs, immutable caching), enforces data residency and JWT verification at the edge (Cloudflare Workers, 451 for residency violations), and routes API requests using region-stamped JWTs (reads to nearest region, writes to home region). The three-region active-active cluster (us-east-1, eu-west-1, ap-south-1) provides regional read isolation and data residency compliance. Canary deployments proceed region-by-region with 24-hour bake times. The fundamental trade-off is that active-active multi-region requires accepting eventual consistency — the complexity of distributed strong consistency across regions is rarely justified for frontend-serving workloads.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
