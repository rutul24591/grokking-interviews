"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-high-latency-network-optimized-ui",
  title: "Design a High-Latency Network Optimized UI",
  description:
    "Architecture for a UI optimized for high-latency networks (300–600ms RTT): optimistic UI for all user mutations, request coalescing to batch multiple calls into one, prefetching next-likely resources on idle, delta updates over full response payloads, connection keep-alive and HTTP/2 multiplexing, adaptive polling intervals via exponential backoff, speculative rendering of likely next pages, and perceived performance techniques (skeleton screens, progress indicators, instant local state updates).",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "high-latency-network-optimized-ui",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "high-latency", "optimistic-ui", "prefetch", "request-coalescing", "delta-updates", "http2", "perceived-performance"],
  relatedTopics: ["low-end-device-frontend", "offline-first-poor-network"],
};

export default function HighLatencyNetworkOptimizedUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>High-latency network optimization targets the scenario where the network connection is stable and has adequate bandwidth, but the round-trip time (RTT) is high — 300–600ms, typical of satellite internet, 2G mobile with good signal, or corporate VPN tunnels through geographically distant proxies. At 400ms RTT, a sequential chain of 5 API requests (common in an unoptimized SPA: fetch user, fetch settings, fetch feed, fetch notifications, fetch ads) takes 400ms × 5 = 2 seconds of pure network wait time, before any processing. The solution is not to make the network faster — that is beyond the frontend's control — but to reduce the number of sequential round trips, make each round trip smaller, and hide latency behind perceived performance techniques that make the UI feel fast even when the network is slow.</p>
        <p>The key insight for high-latency optimization: parallelism and prediction are more valuable than compression. Making a 100KB response 50KB (saving 50KB at 1Mbps = 400ms savings) has the same impact as eliminating one round trip (saving one RTT of 400ms). Eliminating round trips via batching, prefetching, and coalescing is often achievable through architectural changes alone, without changing network infrastructure.</p>
        <p><strong>Explicit scope:</strong> Optimistic UI for mutations, request batching and coalescing, resource prefetching, delta update protocols, HTTP/2 multiplexing, and perceived performance techniques. Not in scope: network protocol design (QUIC/HTTP3), CDN topology, or backend caching strategies.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Optimistic mutations:</strong> All user-initiated mutations (create, update, delete) must update the UI immediately without waiting for the server response. The local state update is applied synchronously; the server confirmation arrives asynchronously. If the server rejects the mutation, the optimistic update is rolled back with a user-visible notification.</li>
          <li><strong>Request batching:</strong> Multiple independent API requests that fire within a short time window (10–50ms) are batched into a single HTTP request (GraphQL or a custom batch endpoint). The batch is sent after the window expires or when the window reaches N requests. The server processes each sub-request independently and returns combined results.</li>
          <li><strong>Prefetching:</strong> Resources for likely-next user actions are fetched during idle time (requestIdleCallback or IntersectionObserver for below-fold content). When the user actually navigates to the prefetched resource, the data is already in the React Query cache — the transition appears instant despite the high-latency network.</li>
          <li><strong>Delta updates:</strong> For polling-based data (feeds, notification counts, live prices), instead of fetching the full payload each poll, the client sends the last-seen sequence number or ETag. The server returns only the changes since that sequence — typically 1–5% of the full payload, dramatically reducing the per-poll bandwidth and the meaningful data size (smaller responses complete faster on high-latency connections despite fixed RTT cost).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Perceived latency:</strong> User interactions must feel instantaneous (under 100ms response) even when the network RTT is 400ms. Achieved entirely through local state updates (optimistic UI) — the network confirmation is a background process.</li>
          <li><strong>Round trips:</strong> The initial page load must complete all critical data fetching in 2 round trips maximum: (1) HTML + critical CSS inline; (2) JS bundle + initial API data (prefetched in the same request via server-side data injection or a single batched API call). Sequential chains of API requests are eliminated through batching and server-side composition (BFF pattern — Backend For Frontend).</li>
          <li><strong>Polling efficiency:</strong> Polling intervals adapt to network RTT. On low-latency networks (&lt;50ms), polling every 5 seconds is acceptable. On high-latency networks (400ms+), polling every 30–60 seconds reduces the amortized network overhead while delta updates keep the per-poll payload small.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture addresses high latency at three levels. The Request Level eliminates sequential round trips: a Backend For Frontend (BFF) server composes multiple microservice calls server-side and returns a single aggregated response to the client. The client makes one API call on page load (GET /api/page-data) instead of five sequential calls for user + settings + feed + notifications + ads. Request batching (for subsequent client-triggered fetches) merges parallel requests within a 20ms window into a single batch request. The Update Level minimizes per-request payload: delta updates (If-None-Match / ETag-based conditional GETs) return empty 304 responses when nothing has changed, and sparse JSON patches when only part of the data changed. The Perception Level makes latency invisible: optimistic UI for mutations, skeleton screens for initial loads, speculative prefetching for next-page navigation, and infinite scroll with a 1-page look-ahead.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/high-latency-network-optimized-ui.svg"
          alt="High-latency network optimized UI: BFF aggregation (client makes 1 call GET /api/page-data; BFF fans out to user-svc + feed-svc + notif-svc in parallel; merges into 1 JSON response; eliminates 5 serial RTTs → 1 parallel RTT = 400ms saved at 400ms RTT); request batching (BatchLink collects requests fired within 20ms window; POST /api/batch [{query1},{query2}]; server processes in parallel; response [{data1},{data2}]; window size config 20ms or N=10); optimistic UI (user clicks Like; local state updated synchronously in 0ms; POST /api/like sent async; 400ms later: success → confirm; failure → rollback + toast notification); delta polling (client sends GET /api/feed?since=seq-1234&etag=abc; unchanged → 304 Not Modified 0 bytes; changed → 206 partial: only new items delta; polling interval adapts: RTT &lt;50ms → 5s; RTT &gt;300ms → 30s); prefetching (IntersectionObserver on article list items: last visible item → prefetch next page; hover on nav link → prefetch route chunk + data; requestIdleCallback: prefetch likely-next during idle; result: instant navigation despite 400ms RTT)."
          caption="BFF aggregation (1 client call → parallel microservice fan-out, eliminates 5 serial RTTs), request batching (20ms window, POST /api/batch), optimistic UI (0ms local update, async confirm/rollback), delta polling (If-None-Match ETag, 304 on unchanged, adaptive interval 5s→30s by RTT), prefetching (IntersectionObserver last-item, hover route prefetch, requestIdleCallback idle prefetch)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">BFF Pattern and Request Parallelism</h3>
        <p>The Backend For Frontend (BFF) is a thin aggregation server (Node.js) that sits between the client and the microservices. On page load, the client makes one request to the BFF: GET /api/page-data?page=home&amp;userId=123. The BFF fans out to multiple microservices in parallel (using Promise.all): user-service, feed-service, notification-service, ad-service. The BFF waits for all responses (with a per-service timeout — if ad-service takes &gt;300ms, it is dropped and the response is returned without ads) and merges them into a single JSON response. This converts a sequential 5-request chain (5 × 400ms RTT = 2000ms) into a single parallel fan-out (max(service latency) + 400ms RTT ≈ 600ms).</p>
        <p>For subsequent fetches (triggered by user interactions), Apollo Client's BatchHttpLink or a custom batching middleware collects multiple GraphQL queries or REST requests fired within a 20ms debounce window and sends them as a single POST /api/batch. The batch request body is an array of sub-requests: [&#123;"id": "1", "method": "GET", "url": "/api/user/123"&#125;, &#123;"id": "2", "method": "GET", "url": "/api/feed"&#125;]. The server processes each sub-request independently (in parallel) and returns a combined response array. From the client's perspective, each sub-request is resolved individually — the batching is transparent to the calling code.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimistic UI for High Latency</h3>
        <p>On a 400ms RTT network, a non-optimistic UI creates a painful interaction loop: user clicks Like → spinner appears → 400ms wait → Like count updates. At this latency, even a single interaction feels sluggish. Optimistic UI converts this to: user clicks Like → Like count immediately increments (no spinner) → 400ms later server confirms → nothing visible changes. The user experience is instantaneous.</p>
        <p>React Query's useMutation with onMutate / onError / onSettled callbacks implements optimistic updates cleanly: (1) onMutate: immediately update the React Query cache with the expected post-mutation state, save the previous state for rollback; (2) onError: restore the previous state from the snapshot taken in onMutate, show a toast explaining the failure; (3) onSettled: invalidate the query to trigger a background refetch of the authoritative server state. The triple-step ensures that the optimistic update is eventually replaced by the real server state, even if the mutation succeeds — preventing drift between local optimistic state and server truth.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Delta Updates and ETag-Based Polling</h3>
        <p>For polling-based features (live price feeds, notification counts, activity feeds), the standard pattern of GET /api/feed every N seconds returns the full payload each time — wasteful when most of the feed has not changed. Delta updates reduce this to: on the first request, the server returns the full payload and an ETag (a hash of the current state, e.g., ETag: "abc123"). On subsequent requests, the client sends If-None-Match: "abc123". If nothing has changed, the server returns 304 Not Modified with no body — zero bandwidth usage despite an RTT. If the feed has new items, the server returns only the new items (a JSON array of additions) and a new ETag. The client merges the delta into its local feed cache.</p>
        <p>Polling interval adaptation: the client measures the RTT of each poll request (time from request send to response received). If RTT &gt; 300ms (high latency detected), the polling interval is increased to reduce the proportion of time spent on network overhead. For a 5-second poll interval with 400ms RTT, the network overhead is 400/5000 = 8% — already reasonable. For a 1-second poll with 400ms RTT, the overhead is 40% — the server is barely responding before the next poll arrives. Adaptive polling uses exponential smoothing of recent RTT measurements to set the interval: interval = max(baseInterval, measuredRTT × multiplier).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Speculative Prefetching</h3>
        <p>Prefetching predicts what the user will navigate to next and fetches that data during idle time, so the navigation appears instant. Three prefetch triggers: (1) IntersectionObserver on paginated list items — when the last visible item enters the viewport, prefetch the next page of data (infinite scroll look-ahead). The user never sees a loading state when scrolling because the next page is already in cache. (2) Pointer hover on navigation links — on pointerenter (50–100ms before a click is committed), prefetch the route's JavaScript chunk and data. This turns a 400ms navigation into a &lt;100ms rendered transition. (3) requestIdleCallback during initial page idle — after the critical render is complete and the browser is idle, prefetch the 3 most likely next-page resources (determined by analytics data on user navigation patterns). Each prefetch adds a link rel="prefetch" tag or a background React Query prefetchQuery call. Prefetched data is stored in React Query's cache with a long stale time (5 minutes) so it is available immediately on navigation.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Optimistic updates and data consistency: optimistic updates assume the mutation will succeed. If the server rejects the mutation (validation error, permission denied, concurrent edit conflict), the rollback is jarring — the user sees a count go up then come back down, or a message appear then disappear. This can be mitigated by client-side pre-validation (validate the mutation locally before sending it, and only apply the optimistic update if local validation passes) and by designing server APIs to accept optimistic mutations gracefully (e.g., return a soft error that allows the UI to show a warning without a full rollback). For financial transactions, optimistic updates are inappropriate — the user must wait for server confirmation before seeing a balance change.</p>
        <p>Prefetching cost on metered connections: prefetching wastes bandwidth for users who do not navigate to the prefetched resource. On high-latency networks with metered data (mobile data in emerging markets), prefetching should be conditional: only prefetch when navigator.connection.saveData is false and navigator.connection.effectiveType is "4g" or better. On 2G/3G or when Save-Data is enabled, prefetching is disabled entirely, and the user accepts slower navigation in exchange for lower data usage. This ties directly into the adaptive serving strategy of the low-end device frontend architecture.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A UI optimized for high-latency networks (300–600ms RTT) eliminates round trips and hides unavoidable latency through five strategies: (1) BFF aggregation (one client request → parallel microservice fan-out, eliminating 5-RTT sequential chains into 1 parallel RTT); (2) request batching (BatchLink collects parallel requests in a 20ms window into a single POST /api/batch); (3) optimistic UI (React Query useMutation with onMutate snapshot + onError rollback, making mutations feel instantaneous); (4) delta polling (ETag + If-None-Match → 304 Not Modified on no change, sparse delta on change, adaptive interval by measured RTT); and (5) speculative prefetching (IntersectionObserver last-item look-ahead, hover-to-prefetch route + data, requestIdleCallback idle prefetch). The core principle: on high-latency networks, every round trip is expensive — the architecture must treat each RTT as a scarce resource to be spent deliberately, not consumed accidentally through sequential API chains.</p>
      </section>
    </ArticleLayout>
  );
}
