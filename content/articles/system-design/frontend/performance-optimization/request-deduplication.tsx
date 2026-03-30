"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-deduplication",
  title: "Request Deduplication",
  description: "Comprehensive guide to request deduplication - eliminating redundant API calls, promise sharing, and request caching strategies.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "request-deduplication",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-24",
  tags: ["frontend", "performance", "request-deduplication", "api", "caching", "react-query"],
  relatedTopics: ["lazy-loading", "code-splitting", "web-vitals"],
};

export default function RequestDeduplicationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Request deduplication</strong> is the practice of eliminating redundant API calls when multiple
          components or users request the same data simultaneously. Without deduplication, a single user action
          can trigger multiple identical requests, wasting bandwidth, increasing server load, and causing race
          conditions where responses arrive out of order.
        </p>
        <p>
          Request deduplication happens at multiple layers: component level (React Query, SWR), application level
          (custom request cache), and infrastructure level (CDN caching, API gateway caching). Each layer provides
          different benefits and trade-offs.
        </p>
        <p>
          For staff and principal engineers, request deduplication is not just about adding a library - it is
          about understanding request patterns, designing cache invalidation strategies, and making architectural
          decisions about where deduplication should happen in your stack.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding request deduplication requires grasping three fundamental concepts: how duplicate requests
          occur, promise sharing mechanisms, and cache invalidation strategies.
        </p>

        <h3 className="mt-6 font-semibold text-lg">How Duplicate Requests Occur</h3>
        <p>
          Duplicate requests happen in several scenarios: (1) Multiple components mount simultaneously and each
          fetches the same data in useEffect. (2) User rapidly clicks a button that triggers API calls. (3)
          Multiple tabs or windows request the same data. (4) Race conditions where component re-renders trigger
          refetches before previous requests complete.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Promise Sharing</h3>
        <p>
          Promise sharing is the core mechanism of request deduplication. When a request is in-flight, subsequent
          requests for the same data return the same Promise instead of creating new requests. All callers receive
          the same result when the Promise resolves.
        </p>
        <p>
          <strong>Implementation pattern:</strong> Maintain a Map of in-flight requests keyed by request
          parameters. When a request starts, store its Promise in the Map. When a duplicate request is detected,
          return the stored Promise instead of creating a new request. When the Promise settles, remove it from
          the Map.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Cache Invalidation</h3>
        <p>
          Caching and deduplication work together. Deduplication prevents duplicate in-flight requests. Caching
          prevents unnecessary requests for data that is still fresh. Cache invalidation determines when cached
          data is stale and must be refetched.
        </p>
        <p>
          <strong>Time-based invalidation:</strong> Data expires after a fixed time-to-live (TTL). Simple to
          implement but may serve stale data or refetch unnecessarily.
        </p>
        <p>
          <strong>Event-based invalidation:</strong> Data is invalidated when specific events occur (mutations,
          WebSocket messages, user actions). More complex but provides fresher data.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/request-deduplication-concept.svg"
          alt="Request deduplication concept showing multiple components sharing a single in-flight request"
          caption="Request Deduplication - Multiple components share a single in-flight request"
        />
      </section>

      <section>
        <h2>Additional Important Concepts</h2>

        <h3 className="mt-6 font-semibold text-lg">Deduplication Libraries</h3>
        <p>
          Several libraries provide request deduplication out of the box:
        </p>
        <p>
          <strong>React Query:</strong> Provides automatic deduplication for identical queries. When multiple
          components use useQuery with the same key, only one request is made. Results are shared across all
          callers. Includes caching, invalidation, and background refetching.
        </p>
        <p>
          <strong>SWR:</strong> Similar to React Query but lighter weight. Provides deduplication via the
          dedupingInterval option (default 2 seconds). Requests within the interval are deduplicated.
        </p>
        <p>
          <strong>Apollo Client:</strong> GraphQL client with built-in deduplication. Identical GraphQL queries
          are deduplicated automatically. Includes normalized caching for fine-grained invalidation.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Request Caching Layers</h3>
        <p>
          Deduplication can happen at multiple layers, each with different characteristics:
        </p>
        <p>
          <strong>Component-level cache:</strong> Libraries like React Query cache at the component level.
          Fastest access, invalidated on mutations. Scope is limited to the application instance.
        </p>
        <p>
          <strong>Browser cache:</strong> HTTP caching via Cache-Control headers. Persists across page loads.
          Controlled by server headers. Does not help with simultaneous requests.
        </p>
        <p>
          <strong>CDN cache:</strong> Edge caching at CDN level. Reduces origin server load. Configurable TTL.
          Helps with cross-user deduplication for public data.
        </p>
        <p>
          <strong>API gateway cache:</strong> Server-side caching at API gateway. Reduces backend load. Can
          implement complex invalidation rules. Shared across all clients.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Stale-While-Revalidate</h3>
        <p>
          Stale-while-revalidate is a pattern that combines caching with deduplication. When data is requested:
          (1) Return cached data immediately if available (even if stale). (2) Trigger a background refetch to
          update the cache. (3) Notify components when fresh data arrives.
        </p>
        <p>
          <strong>Benefits:</strong> Instant response from cache, background freshness, no loading states for
          cached data. React Query and SWR implement this pattern by default.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/request-deduplication-layers.svg"
          alt="Request deduplication layers showing component, application, browser, CDN, and API gateway caching"
          caption="Deduplication Layers - Component, browser, CDN, and API gateway each provide different benefits"
        />
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          A production request deduplication implementation has multiple layers: client-side deduplication for
          in-flight requests, caching for repeated requests, and server-side caching for cross-user deduplication.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Client-Side Deduplication Flow</h3>
        <p>
          Client-side flow: (1) Component requests data, (2) Check if identical request is in-flight, (3) If
          yes, return existing Promise, (4) If no, start new request and store Promise, (5) When Promise
          settles, remove from in-flight Map, (6) All callers receive same result.
        </p>
        <p>
          <strong>Implementation:</strong> Maintain a Map keyed by request identifier (URL + parameters). Store
          Promises for in-flight requests. Check Map before creating new requests. Clean up settled Promises.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Cache Invalidation Flow</h3>
        <p>
          Cache invalidation flow: (1) Data is cached with timestamp, (2) Subsequent requests check cache
          freshness, (3) If data is fresh (within TTL), return cached data, (4) If data is stale, trigger
          background refetch, (5) Return stale data immediately, (6) Update cache when fresh data arrives.
        </p>
        <p>
          <strong>Mutation invalidation:</strong> When data is mutated, invalidate related cache entries.
          React Query uses query keys to identify related queries. Optimistic updates can provide instant
          feedback while mutation is in-flight.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/request-deduplication-flow.svg"
          alt="Request deduplication flow showing request check, in-flight Map, Promise sharing, and cache update"
          caption="Deduplication Flow - Check in-flight, share Promise, update cache, notify components"
        />
      </section>

      <section>
        <h2>Trade-offs and Comparisons</h2>
        <p>
          Request deduplication involves trade-offs between freshness, complexity, and performance.
        </p>

        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme bg-panel-soft">
                <th className="p-3 text-left">Strategy</th>
                <th className="p-3 text-left">Freshness</th>
                <th className="p-3 text-left">Complexity</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">React Query / SWR</td>
                <td className="p-3 text-green-600">High (configurable)</td>
                <td className="p-3 text-green-600">Low (library handles)</td>
                <td className="p-3">React applications</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Custom Promise Map</td>
                <td className="p-3 text-green-600">High</td>
                <td className="p-3 text-yellow-600">Medium</td>
                <td className="p-3">Non-React, specific needs</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">CDN Caching</td>
                <td className="p-3 text-yellow-600">Medium (TTL-based)</td>
                <td className="p-3 text-green-600">Low (headers)</td>
                <td className="p-3">Public, immutable data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Based on production experience, these practices consistently improve request deduplication effectiveness.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Library Selection</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use React Query for React apps:</strong> Provides deduplication, caching, invalidation,
            background refetching out of the box. Well-maintained, extensive documentation.
          </li>
          <li>
            <strong>Use SWR for simpler needs:</strong> Lighter weight than React Query. Good for simple
            fetch-and-display patterns. Less configuration overhead.
          </li>
          <li>
            <strong>Use Apollo for GraphQL:</strong> Built-in deduplication and normalized caching. Best
            choice for GraphQL applications.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold text-lg">Query Key Design</h3>
        <ul className="space-y-2">
          <li>
            <strong>Use structured keys:</strong> Use arrays or objects for query keys, not strings.
            React Query serializes arrays consistently.
          </li>
          <li>
            <strong>Include all parameters:</strong> Query key must include all parameters that affect the
            response. Missing parameters cause cache collisions or missed deduplication.
          </li>
          <li>
            <strong>Use query key factories:</strong> Create helper functions for generating query keys.
            Ensures consistency across the application.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold text-lg">Cache Configuration</h3>
        <ul className="space-y-2">
          <li>
            <strong>Set appropriate staleTime:</strong> For frequently changing data, set staleTime to 0
            or a few seconds. For static data, set staleTime to Infinity.
          </li>
          <li>
            <strong>Configure cacheTime:</strong> How long to keep unused data in cache. Default is 5
            minutes. Increase for data that is expensive to fetch but rarely changes.
          </li>
          <li>
            <strong>Use retries wisely:</strong> Enable retries for transient failures. Set appropriate
            retry count and delay. Do not retry on 4xx errors (client errors).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/request-deduplication-best-practices.svg"
          alt="Request deduplication best practices showing library selection, query key design, cache configuration, and invalidation"
          caption="Best Practices - Library selection, query key design, cache configuration, and invalidation strategies"
        />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes are common even among experienced teams. Avoiding them prevents cache inconsistencies
          and performance issues.
        </p>

        <ul className="space-y-3">
          <li>
            <strong>Inconsistent query keys:</strong> Using different key structures for the same data causes
            cache misses and duplicate requests. Use query key factories to ensure consistency.
          </li>
          <li>
            <strong>Not invalidating cache:</strong> Data becomes stale and never updates. Always invalidate
            cache on mutations. Use optimistic updates for better UX.
          </li>
          <li>
            <strong>Over-caching:</strong> Caching data that changes frequently causes stale data issues.
            Set appropriate staleTime based on data volatility.
          </li>
          <li>
            <strong>Memory leaks:</strong> Not cleaning up settled Promises from in-flight Map causes memory
            leaks. Always remove Promises when they settle.
          </li>
          <li>
            <strong>No timeout handling:</strong> In-flight requests that never settle cause memory leaks
            and stale locks. Implement timeouts for all requests.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          These case studies demonstrate the business impact of request deduplication across different industries.
        </p>

        <h3 className="mt-6 font-semibold text-lg">E-commerce: Product Listing</h3>
        <p>
          An e-commerce site reduced API calls by 70% by implementing React Query for product listing pages.
          Multiple components (product grid, filters, sort, pagination) all needed the same product data.
          Deduplication eliminated redundant requests.
        </p>
        <p>
          <strong>What they did:</strong> Used React Query with structured query keys. Multiple components
          called useQuery with the same key. React Query deduplicated automatically. Implemented cache
          invalidation on cart mutations.
        </p>

        <h3 className="mt-6 font-semibold text-lg">SaaS Dashboard: Cross-Component Data</h3>
        <p>
          A B2B SaaS dashboard had 15+ components fetching user data independently. Page load triggered 15
          identical API calls. After implementing request deduplication, page load API calls reduced from 15
          to 1.
        </p>
        <p>
          <strong>What they did:</strong> Implemented custom Promise Map for user data. All components called
          getUser(userId) which returned shared Promise. Reduced server load by 93%. Page load time decreased
          by 40%.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Social Media: Feed Loading</h3>
        <p>
          A social media app implemented stale-while-revalidate for feed loading. Users saw cached feed
          immediately while background refetch updated content. Perceived load time decreased by 80%.
        </p>
        <p>
          <strong>What they did:</strong> Used SWR with dedupingInterval of 2 seconds. Cached feed data with
          5-minute staleTime. Background refetch on focus and reconnect. Optimistic updates for new posts.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/request-deduplication-business-impact.svg"
          alt="Business impact of request deduplication showing before and after comparison of API calls and performance improvements"
          caption="Business Impact - Request deduplication reduces API calls 70-90%, improving performance"
        />
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is request deduplication and why is it important?</p>
            <p className="mt-2 text-sm">
              A: Request deduplication eliminates redundant API calls when multiple components or users request
              the same data simultaneously. It is important because duplicate requests waste bandwidth, increase
              server load, cause race conditions, and degrade user experience. Deduplication ensures only one
              request is made for identical data, with results shared across all callers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React Query implement request deduplication?</p>
            <p className="mt-2 text-sm">
              A: React Query maintains an internal Map of in-flight queries keyed by query key. When useQuery
              is called with a key that has an in-flight request, React Query returns the existing Promise
              instead of creating a new request. All callers receive the same result when the Promise resolves.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement custom request deduplication?</p>
            <p className="mt-2 text-sm">
              A: Maintain a Map keyed by request identifier (URL + parameters). Before making a request, check
              if identical request is in-flight. If yes, return existing Promise. If no, create new request,
              store Promise in Map, and return it. When Promise settles (resolve or reject), remove from Map.
              Handle timeouts to prevent memory leaks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between deduplication and caching?</p>
            <p className="mt-2 text-sm">
              A: Deduplication prevents duplicate in-flight requests - multiple callers share the same Promise.
              Caching prevents unnecessary requests for data that is still fresh - return cached response
              instead of making a request. They work together: deduplication handles simultaneous requests,
              caching handles repeated requests over time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cache invalidation?</p>
            <p className="mt-2 text-sm">
              A: Invalidate cache on mutations - when data changes, mark related cache entries as stale. Use
              query key prefixes for bulk invalidation. Use tag-based invalidation for complex scenarios.
              Implement optimistic updates for instant feedback. Consider time-based invalidation (TTL) for
              data that changes predictably.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cross-tab cache synchronization?</p>
            <p className="mt-2 text-sm">
              A: Use BroadcastChannel API to communicate across tabs. When one tab mutates data, broadcast
              invalidation message. Other tabs receive message and invalidate related cache. Alternative: use
              localStorage with storage event listeners. For React Query, use persistQueryClient with
              BroadcastChannel for automatic sync.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References and Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/query/latest/docs/react/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Query Documentation
            </a> - Comprehensive guide to React Query features including deduplication and caching.
          </li>
          <li>
            <a href="https://swr.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWR Documentation
            </a> - React Hooks library for data fetching with built-in deduplication.
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/data/queries/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apollo Client - Queries
            </a> - GraphQL client with built-in request deduplication.
          </li>
          <li>
            <a href="https://web.dev/http-cache/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - HTTP Cache
            </a> - Guide to browser HTTP caching and Cache-Control headers.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN - BroadcastChannel API
            </a> - API for cross-tab communication and cache synchronization.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
