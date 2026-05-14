"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-1m-concurrent-users",
  title: "Design Frontend for 1M+ Concurrent Users",
  description:
    "Architecture for a frontend system serving 1 million+ concurrent users: global CDN with edge caching, static asset immutable caching, SSR request coalescing, WebSocket connection fan-out via pub/sub, connection pooling, API gateway rate limiting, stale-while-revalidate cache headers, database read replica routing, client-side delta updates, and graceful load shedding.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "frontend-1m-concurrent-users",
  wordCount: 5000,
  readingTime: 31,
  lastUpdated: "2026-05-12",
  tags: ["hld", "scale", "cdn", "edge-caching", "websocket", "rate-limiting", "load-shedding", "coalescing"],
  relatedTopics: ["multi-region-frontend-architecture", "graceful-degradation-system"],
};

export default function Frontend1mConcurrentUsersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Designing a frontend for 1 million concurrent users is fundamentally a problem of avoiding hot paths. A single origin server handling 1 million simultaneous HTTP requests would need to accept 1 million TCP connections, process 1 million request headers, and generate 1 million responses per second — far beyond what any single machine can sustain. The solution is layered caching: the goal is to ensure that the vast majority of the 1 million requests never reach the origin server at all. A CDN edge node serving a static HTML shell from memory can handle hundreds of thousands of requests per second per node; a fleet of edge nodes in 50 global PoPs can easily absorb 1 million concurrent page loads without touching the origin.</HighlightBlock>
        <HighlightBlock as="p" tier="important">But a modern web application is not purely static. Users log in, post content, receive real-time notifications, and interact with personalized data. The scale challenge is how to layer personalization and real-time updates on top of a static-first architecture without sacrificing the scale properties that make CDN caching effective. The key insight: separate the static shell (HTML + CSS + JS bundle, fully cacheable) from the personalized data (fetched client-side after the shell loads). The CDN serves the shell at unlimited scale; the personalized API calls hit the origin at a fraction of the concurrency (only logged-in users, only after the shell has loaded).</HighlightBlock>
        <p><strong>Explicit scope:</strong> CDN architecture, SSR caching strategies, API gateway scale, WebSocket fan-out, and client-side delta updates. Not in scope: backend database scaling, microservice architecture, or infrastructure provisioning.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Page load:</strong> Homepage loads within 1.5 seconds globally (Core Web Vitals: LCP &lt;2.5s, FID &lt;100ms, CLS &lt;0.1). Cache hit ratio &gt;95% for all static assets. HTML shell served from CDN edge within 50ms of request.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Authentication:</strong> Login/session management scales to 1M concurrent sessions. Session tokens stored in Redis cluster (sharded, 3-replica per shard). API requests authenticated via JWT (stateless, verifiable at the edge without hitting Redis for every request).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Real-time updates:</strong> Push updates to 1M connected clients via WebSocket or SSE. Updates are fan-out events (e.g., global announcement, trending content) delivered to all connected clients. Per-user personalized pushes are delivered to the user's specific connection.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>API responses:</strong> All read APIs are cacheable with stale-while-revalidate. Write APIs (POST/PUT/DELETE) bypass cache. Read/write ratio is 95:5 for typical content platforms.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Availability:</strong> 99.99% uptime (52 minutes downtime/year). Achieved via multi-region deployment with automatic failover, not active-active everywhere.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Throughput:</strong> CDN tier handles 1M+ concurrent users. API gateway tier handles 50K–100K requests/second (5–10% of users making API calls at any given moment). WebSocket tier handles 1M persistent connections across a cluster of connection servers.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Load shedding:</strong> Under extreme load, non-critical API endpoints are shed first (recommendations, trending lists) while critical paths (login, read primary content) are preserved.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The architecture has four distinct tiers. The CDN Tier (Cloudflare, Fastly, or Akamai) serves all static assets and the HTML shell with immutable cache headers (Cache-Control: public, max-age=31536000, immutable for hashed JS/CSS bundles). The API Gateway Tier (Kong, AWS API Gateway, or a custom Nginx cluster) handles authenticated API requests, enforces rate limits (per-IP and per-user), and routes to backend services. The Application Tier consists of stateless Next.js SSR servers that generate personalized HTML when CDN cache is absent (cache miss path) and stateless API servers. The Real-Time Tier is a cluster of WebSocket servers (each handling 50K connections) behind a load balancer, connected to a Redis pub/sub cluster for message fan-out. The five tiers are designed to fail independently — CDN outage degrades to direct origin access; WebSocket server loss causes graceful degradation to polling.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/frontend-1m-concurrent-users.svg"
          alt="Frontend for 1M concurrent users: CDN tier (Cloudflare PoPs globally; static assets: Cache-Control immutable max-age=31536000 content-hash in filename; HTML shell: stale-while-revalidate=60s; cache hit ratio target &gt;95%; edge workers: JWT verification at edge, no origin request for auth check), API gateway tier (rate limit: 100 req/min per IP, 1000 req/min per user token; request coalescing: identical in-flight requests deduplicated — only 1 upstream call per cache key; read replicas: GET requests routed to read replicas; stale-while-revalidate on API responses TTL=30s), WebSocket fan-out (1M connections across cluster of 20 WebSocket servers × 50K connections each; Redis pub/sub: broadcast channel for global updates; per-user channel: publish to user:{userId} → only server holding that connection receives; heartbeat: ping every 30s to detect dead connections), SSR coalescing (Next.js SSR cache: same URL + same user segment → single render, result shared; ISR: static pages revalidated every 60s without blocking requests; streaming SSR: send HTML head first → above-fold renders at TTFB; personalized data: client-side fetch after shell loads), load shedding (priority queue: critical=login+read-primary+checkout; normal=search+recommendations; non-critical=trending+analytics; circuit breaker: if error rate &gt;5% last 10s → shed non-critical endpoints → 503 with Retry-After; client: exponential backoff 1s 2s 4s 8s max 30s)."
          caption="CDN tier (95%+ cache hit, immutable assets, edge JWT), API gateway (rate limiting, coalescing, read-replica routing), WebSocket fan-out (20 servers × 50K = 1M connections, Redis pub/sub per-user channels), SSR coalescing + ISR (shared renders per segment), and load shedding (priority queue, circuit breaker, client exponential backoff)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CDN Caching Strategy</h3>
        <HighlightBlock as="p" tier="important">The CDN is the primary scale lever. Every static asset (JS bundles, CSS, images, fonts) uses content-addressed filenames (e.g., main.a3f8d2c.js where the hash changes when the content changes) with Cache-Control: public, max-age=31536000, immutable. This means: (1) the browser caches the asset for 1 year and never re-validates; (2) the CDN caches it until explicitly purged; (3) when a new deployment happens, the hash changes, making the old cached file effectively invisible (it remains in cache but no URL points to it). This immutable pattern eliminates the cache invalidation problem for static assets entirely.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The HTML shell (index.html or the Next.js SSR output) uses a different caching strategy: Cache-Control: public, s-maxage=60, stale-while-revalidate=3600. This means: the CDN serves the cached HTML for up to 60 seconds without checking the origin (s-maxage=60); after 60 seconds, the CDN serves the stale HTML immediately but revalidates in the background for the next request (stale-while-revalidate=3600). This ensures users always get a fast response (from CDN, no origin latency) while the cache stays reasonably fresh. For truly personalized pages (different HTML per user), the response is not cached at the CDN level — instead, a generic shell is CDN-cached and personalization is loaded client-side.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Edge computing (Cloudflare Workers, Fastly Compute@Edge): JWT verification is moved to the edge. When an authenticated API request arrives at the CDN, an edge worker verifies the JWT signature (using the public key stored in the edge worker configuration, updated when the signing key rotates). Valid tokens proceed to the origin; invalid tokens are rejected at the edge with a 401 response. This eliminates the round-trip to the origin for authentication — at 1M concurrent users, even a 1% invalid-token rate would be 10,000 rejected requests per second that never touch the origin.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">API Gateway Rate Limiting and Coalescing</h3>
        <HighlightBlock as="p" tier="important">Rate limiting is applied at two levels: per-IP (100 requests/minute, enforced by IP to limit scraping bots and accidental DDoS) and per-user-token (1,000 requests/minute, enforced by JWT subject claim, to limit legitimate but misbehaving clients). Rate limit counters are stored in Redis with a sliding window algorithm: each request increments a counter with a TTL of 60 seconds. At 1M concurrent users, this generates significant Redis write load — mitigated by using a local token bucket at the gateway process (in-process, no Redis call) as the first check, only calling Redis for cases near the limit threshold.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Request coalescing collapses identical in-flight requests to the same upstream call. If 500 CDN nodes simultaneously request the same uncached URL from the origin (a "thundering herd" on cache expiry), coalescing at the API gateway ensures only one upstream request is made — all 500 CDN nodes wait for that single response and each receives the same result. This is implemented using a lock-based pattern: when the first request for a cache key arrives, a lock is set in Redis (SET key:lock NX EX 10) and an upstream call is made. Subsequent requests for the same key check the lock, see it held, and wait for a pub/sub notification when the response is ready. The response is written to cache and the lock is released, notifying all waiters simultaneously.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">WebSocket Fan-Out at 1M Connections</h3>
        <p>A single Node.js WebSocket server can handle approximately 50,000 concurrent connections at reasonable memory usage (each connection uses approximately 10KB of overhead = 500MB for 50K connections). For 1M connections, a cluster of 20 WebSocket servers is needed. The challenge: when a broadcast message (e.g., "new trending post") needs to go to all 1M connected clients, the message must reach all 20 servers.</p>
        <HighlightBlock as="p" tier="important">Redis pub/sub handles the fan-out: a single publisher posts the message to a Redis channel (PUBLISH global:updates "{`{eventId, type, payload}`}"). All 20 WebSocket servers subscribe to this channel (SUBSCRIBE global:updates). Each server receives the message from Redis and pushes it to all connected WebSocket clients — each server sending to its 50K clients in parallel. Total fan-out latency: Redis pub/sub delivery (1–2ms) + WebSocket write time. For per-user messages (a notification to a specific user), the publisher posts to a per-user Redis channel (PUBLISH user:{`{userId}`} message). The WebSocket server holding that user's connection is subscribed to user:{`{userId}`} (the server subscribes when the connection is established and unsubscribes on disconnect). This is O(1) — no broadcast needed for per-user events.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Load Shedding and Graceful Degradation</h3>
        <HighlightBlock as="p" tier="important">Under extreme load (traffic spike 3× above normal), the system must protect critical paths while gracefully degrading non-critical features. The API gateway implements a priority queue for incoming requests: Critical (P0): login, authentication refresh, read primary content, checkout. Normal (P1): search, user profile reads, feed API. Non-critical (P2): trending lists, recommendation API, analytics events. When the backend's error rate exceeds 5% in a 10-second window (measured by a circuit breaker), the gateway sheds non-critical (P2) requests by returning 503 Service Unavailable with a Retry-After header. If the error rate continues to rise, P1 requests are also shed. P0 paths are never shed — additional capacity is provisioned (auto-scaling) or the load balancer routes to other regions.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client-side handling: the browser retries shed requests with exponential backoff (1s, 2s, 4s, 8s, max 30s) using a jitter of ±20% to prevent thundering herd on retry. The UI shows degraded-mode placeholders for shed API responses: the recommendations sidebar shows "Recommendations unavailable" instead of an empty state or an infinite spinner. The critical content (the article or product the user navigated to) still loads because its P0 API is not shed.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">SSR vs. CSR at scale: Server-Side Rendering generates HTML at request time, which is slower than serving a pre-rendered static file. At 1M concurrent users, even 10ms of SSR render time per request = 10,000 server-seconds per second — requiring 10,000 server-cores if each render blocks a thread. The solution: ISR (Incremental Static Regeneration) pre-renders pages for the most common routes on a 60-second interval, serving static HTML from cache for the vast majority of requests. Only cache misses (the first request after cache expiry) trigger live SSR. Next.js ISR naturally implements this: a stale page is served immediately and revalidated in the background, ensuring users never wait for live rendering.</HighlightBlock>
        <HighlightBlock as="p" tier="important">WebSocket vs. SSE at scale: Server-Sent Events (SSE) is a simpler protocol (HTTP/1.1 persistent connection, server-to-client only) that works through HTTP/2 multiplexing and does not require the WebSocket upgrade handshake. At 1M connections, SSE reduces connection overhead (no persistent socket, reuses HTTP/2 streams). The trade-off: SSE is unidirectional (client cannot send messages back without a separate HTTP request). For use cases where the client only needs to receive push events (notifications, live count updates), SSE at 1M scale is more efficient than WebSocket. For bidirectional real-time communication (live chat, collaborative editing), WebSocket is necessary.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A frontend for 1M concurrent users is built on four scale layers: (1) CDN with immutable asset caching and stale-while-revalidate for HTML shells (&gt;95% cache hit target, edge JWT verification); (2) API gateway rate limiting (per-IP + per-user token bucket, Redis sliding window) with request coalescing (lock-based dedup for thundering herd on cache expiry); (3) WebSocket fan-out via Redis pub/sub (20 servers × 50K connections, broadcast via global channel, per-user via user:{`{userId}`} channel); and (4) load shedding (P0/P1/P2 priority queue, circuit breaker at 5% error rate in 10s window, client exponential backoff with jitter). ISR keeps SSR servers out of the critical path — most users receive pre-rendered static HTML. The defining constraint: at 1M concurrent users, any architecture that requires an origin server request for every user will fail — the CDN must absorb at least 90% of the load.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
