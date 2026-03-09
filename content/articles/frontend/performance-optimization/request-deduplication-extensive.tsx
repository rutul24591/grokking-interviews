"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-deduplication-extensive",
  title: "Request Deduplication",
  description: "Comprehensive guide to request deduplication strategies, promise sharing, cache normalization, and framework-level dedup in modern frontend applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "request-deduplication",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "request-deduplication", "caching", "react-query", "swr", "fetch", "graphql"],
  relatedTopics: ["caching-strategies", "data-fetching", "memoization-and-react-memo"],
};

export default function RequestDeduplicationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Request deduplication</strong> is a technique that collapses multiple identical network requests
          into a single actual HTTP call, sharing the result across all callers. When five React components
          independently call <code>fetch('/api/user')</code> on mount, deduplication intercepts those calls and
          ensures only one request reaches the server. The remaining four callers receive the same response —
          either by sharing the in-flight promise or by reading from a short-lived cache.
        </p>
        <p>
          The need for request deduplication emerged from a fundamental tension in modern component architectures.
          React, and component-based frameworks in general, encourage <strong>co-location</strong> — each component
          declares its own data dependencies rather than relying on a parent to fetch everything and prop-drill it
          down. This produces cleaner, more maintainable code. A <code>UserAvatar</code> component that fetches its
          own user data is self-contained, reusable, and easy to reason about. But when you compose a page from
          dozens of such components, many of which need the same data, the result is a burst of redundant requests.
        </p>
        <p>
          This isn't a theoretical problem. In a typical dashboard application, the user object might be needed by
          the top navigation bar, the sidebar, the settings panel, the notification badge, and the profile section.
          Without deduplication, that's five identical <code>GET /api/user</code> requests firing on every page load.
          Across an entire application with 20-30 data endpoints, redundant requests can account for 40-60% of total
          network traffic. Request deduplication eliminates this waste at the infrastructure level, allowing developers
          to write clean co-located data fetching without worrying about request coordination.
        </p>
      </section>

      <section>
        <h2>The Problem in Detail</h2>
        <p>
          To fully understand why deduplication matters, let's trace what happens in a React application without it.
          Consider a dashboard page with several independent components:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Component 1: Header showing user name
function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return <header>Welcome, {user?.name}</header>;
}

// Component 2: Sidebar showing user avatar and role
function Sidebar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return (
    <aside>
      <img src={user?.avatar} />
      <span>{user?.role}</span>
    </aside>
  );
}

// Component 3: Settings panel with user preferences
function SettingsPanel() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return <form>{/* render user preferences */}</form>;
}

// Component 4: Notification badge checking unread count
function NotificationBadge() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return <span>{user?.unreadCount}</span>;
}

// Component 5: Profile card in the content area
function ProfileCard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return <div>{user?.bio}</div>;
}`}</code>
        </pre>
        <p>
          When this page renders, React runs all five <code>useEffect</code> callbacks in the same microtask.
          Five <code>fetch('/api/user')</code> calls fire almost simultaneously. The browser opens five TCP
          connections (or multiplexes five streams over HTTP/2) to the same endpoint. The server processes five
          identical database queries and returns five identical JSON payloads.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant H as Header
    participant S as Sidebar
    participant St as Settings
    participant N as NotificationBadge
    participant P as ProfileCard
    participant B as Browser
    participant API as /api/user

    Note over H,P: All components mount simultaneously
    H->>B: fetch('/api/user')
    S->>B: fetch('/api/user')
    St->>B: fetch('/api/user')
    N->>B: fetch('/api/user')
    P->>B: fetch('/api/user')
    B->>API: GET /api/user (request 1)
    B->>API: GET /api/user (request 2)
    B->>API: GET /api/user (request 3)
    B->>API: GET /api/user (request 4)
    B->>API: GET /api/user (request 5)
    API-->>B: Response 1 (same data)
    API-->>B: Response 2 (same data)
    API-->>B: Response 3 (same data)
    API-->>B: Response 4 (same data)
    API-->>B: Response 5 (same data)
    B-->>H: user data
    B-->>S: user data
    B-->>St: user data
    B-->>N: user data
    B-->>P: user data
    Note over H,API: 5 requests, 5 responses — 80% waste`}
          caption="Without deduplication — five identical requests hit the server for the same data"
        />

        <h3 className="mt-6 font-semibold">The Costs of Redundant Requests</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Impact Area</th>
              <th className="p-3 text-left">Without Dedup</th>
              <th className="p-3 text-left">With Dedup</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Network Requests</strong></td>
              <td className="p-3">5 requests per endpoint per page</td>
              <td className="p-3">1 request per endpoint per page</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Server Load</strong></td>
              <td className="p-3">5x database queries, 5x serialization</td>
              <td className="p-3">1x database query, 1x serialization</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bandwidth</strong></td>
              <td className="p-3">5x response payload size</td>
              <td className="p-3">1x response payload size</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Latency</strong></td>
              <td className="p-3">Connection contention, head-of-line blocking</td>
              <td className="p-3">Single fast request, shared result</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Consistency</strong></td>
              <td className="p-3">Responses may differ if data changes between requests</td>
              <td className="p-3">All components see the exact same snapshot</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Battery/CPU</strong></td>
              <td className="p-3">More radio activity on mobile, more parsing</td>
              <td className="p-3">Minimal resource usage</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Core Mechanism: Promise Sharing</h2>
        <p>
          The foundational technique behind request deduplication is <strong>promise sharing</strong>. Instead of
          creating a new <code>fetch()</code> call for every request, you maintain a map of in-flight promises
          keyed by the request identifier. When a second request comes in for the same key, you return the existing
          promise rather than creating a new one. All callers <code>await</code> the same promise and receive the
          same resolved value.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// The core promise-sharing pattern
const inflightRequests = new Map<string, Promise<any>>();

async function dedupFetch(url: string, options?: RequestInit): Promise<any> {
  const cacheKey = url;

  // If there's already an in-flight request, return the same promise
  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey)!;
  }

  // Create the actual fetch and store its promise
  const promise = fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP error \${response.status}\`);
      }
      return response.json();
    })
    .finally(() => {
      // Critical: remove from map when settled (success OR error)
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, promise);
  return promise;
}`}</code>
        </pre>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant C1 as Component 1
    participant C2 as Component 2
    participant C3 as Component 3
    participant DD as dedupFetch
    participant API as /api/user

    C1->>DD: dedupFetch('/api/user')
    DD->>DD: No in-flight request found
    DD->>API: fetch('/api/user')
    DD->>DD: Store promise in Map

    C2->>DD: dedupFetch('/api/user')
    DD->>DD: In-flight request found!
    DD-->>C2: Return existing promise

    C3->>DD: dedupFetch('/api/user')
    DD->>DD: In-flight request found!
    DD-->>C3: Return existing promise

    API-->>DD: Response data
    DD->>DD: Remove from Map
    DD-->>C1: Resolved data
    Note over C2,C3: Same promise resolves for all
    Note over C1,API: 1 request, 3 consumers`}
          caption="Promise sharing — three components share a single in-flight promise"
        />

        <p>
          This pattern is elegant because it's <strong>transparent to callers</strong>. Components call
          <code>dedupFetch</code> exactly like they'd call <code>fetch</code> — they don't need to know whether
          they're the first caller or a subsequent one. The deduplication layer handles everything.
        </p>

        <h3 className="mt-6 font-semibold">Important: The finally Block</h3>
        <p>
          The <code>finally</code> block is critical. Without it, once a request completes, its promise stays
          in the map forever. Subsequent requests would receive the resolved (stale) promise instead of making
          a fresh request. The <code>finally</code> ensures cleanup happens for both successful responses and
          errors.
        </p>
      </section>

      <section>
        <h2>SWR: Automatic Deduplication</h2>
        <p>
          SWR (stale-while-revalidate) by Vercel provides deduplication as a built-in feature. When multiple
          components use <code>useSWR</code> with the same key, SWR deduplicates the requests automatically.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Component A
function Header() {
  const { data: user, isLoading } = useSWR('/api/user', fetcher);
  if (isLoading) return <Skeleton />;
  return <header>Welcome, {user.name}</header>;
}

// Component B — same key, same fetcher
function Sidebar() {
  const { data: user, isLoading } = useSWR('/api/user', fetcher);
  if (isLoading) return <Skeleton />;
  return <aside><img src={user.avatar} /></aside>;
}

// Component C — same key, same fetcher
function Settings() {
  const { data: user, isLoading } = useSWR('/api/user', fetcher);
  if (isLoading) return <Skeleton />;
  return <form defaultValue={user.email}>{/* ... */}</form>;
}

// All three components render on the same page.
// SWR fires exactly ONE fetch('/api/user') call.
// All three receive the same data object.`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">How SWR Dedup Works Internally</h3>
        <p>
          SWR maintains a global cache (via React Context) that stores both resolved data and in-flight promises.
          When <code>useSWR</code> is called:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Step 1:</strong> Check if cached data exists for the key. If so, return it immediately
            (the "stale" in stale-while-revalidate).
          </li>
          <li>
            <strong>Step 2:</strong> Check if a revalidation request is already in-flight for this key. If so,
            subscribe to the existing promise — do not fire another request.
          </li>
          <li>
            <strong>Step 3:</strong> If no in-flight request exists and the data is stale (or missing), fire
            the fetcher and store the promise so other hooks can share it.
          </li>
          <li>
            <strong>Step 4:</strong> When the promise resolves, update the cache and notify all subscribers.
          </li>
        </ol>

        <h3 className="mt-6 font-semibold">Configuring the Deduplication Window</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { SWRConfig } from 'swr';

function App({ children }) {
  return (
    <SWRConfig
      value={{
        // Dedup requests within 2s window (default)
        dedupingInterval: 2000,

        // Or set per-hook
        // useSWR('/api/user', fetcher, { dedupingInterval: 5000 })
      }}
    >
      {children}
    </SWRConfig>
  );
}

// dedupingInterval: 2000 means:
// If Component A fetches /api/user at t=0 and Component B mounts at t=1500ms,
// Component B gets the cached result without a new request.
// If Component C mounts at t=3000ms (beyond the window), it fires a fresh request.`}</code>
        </pre>
      </section>

      <section>
        <h2>React Query (TanStack Query): Deduplication & Stale Time</h2>
        <p>
          React Query takes a slightly different approach. It deduplicates all <strong>concurrent</strong> requests
          with the same query key, and provides <code>staleTime</code> to control how long data is considered fresh
          (avoiding refetches entirely during that window).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 30 seconds — no refetch during this window
      staleTime: 30 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

function Header() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(r => r.json()),
  });
  return <header>{user?.name}</header>;
}

function Sidebar() {
  // Same queryKey — automatically deduplicated
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(r => r.json()),
  });
  return <aside>{user?.role}</aside>;
}

function ProfileCard() {
  // Same queryKey — still deduplicated
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(r => r.json()),
  });
  return <div>{user?.bio}</div>;
}`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">Query Key Design for Effective Deduplication</h3>
        <p>
          React Query uses the query key as the deduplication identifier. Keys are compared using deep equality,
          so property order doesn't matter. Designing good query keys is essential for correct deduplication.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Good: structured keys enable precise deduplication
useQuery({ queryKey: ['users', { sort: 'name', limit: 10 }], queryFn });
useQuery({ queryKey: ['users', { limit: 10, sort: 'name' }], queryFn });
// These are deduplicated — deep equality ignores property order

// Good: hierarchical keys for related data
useQuery({ queryKey: ['users', userId], queryFn });
useQuery({ queryKey: ['users', userId, 'posts'], queryFn });
// Different keys — fetched independently (correct behavior)

// Bad: stringified keys lose structure
useQuery({ queryKey: ['users?sort=name&limit=10'], queryFn });
useQuery({ queryKey: ['users?limit=10&sort=name'], queryFn });
// NOT deduplicated — different strings despite same logical request

// Good pattern: factory functions for consistent keys
const userKeys = {
  all:    () => ['users'] as const,
  lists:  () => [...userKeys.all(), 'list'] as const,
  list:   (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  detail: (id: string) => [...userKeys.all(), 'detail', id] as const,
};

// Usage ensures consistent keys across the app
useQuery({ queryKey: userKeys.detail('123'), queryFn });`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">SWR vs React Query Dedup Comparison</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">SWR</th>
              <th className="p-3 text-left">React Query</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Dedup mechanism</strong></td>
              <td className="p-3">Time-window based (dedupingInterval)</td>
              <td className="p-3">Concurrent request sharing + staleTime</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Default window</strong></td>
              <td className="p-3">2 seconds</td>
              <td className="p-3">0ms (only concurrent requests)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache key type</strong></td>
              <td className="p-3">String or () ={'>'} string</td>
              <td className="p-3">Array (deep equality comparison)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Freshness control</strong></td>
              <td className="p-3">revalidateOnFocus, revalidateOnMount</td>
              <td className="p-3">staleTime, refetchOnMount, refetchOnWindowFocus</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache persistence</strong></td>
              <td className="p-3">In-memory by default</td>
              <td className="p-3">In-memory, with optional persisters</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bundle size</strong></td>
              <td className="p-3">~4KB gzipped</td>
              <td className="p-3">~12KB gzipped</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Building a Production-Ready Dedup Fetch Wrapper</h2>
        <p>
          When you can't use SWR or React Query (e.g., in a library, a non-React context, or a vanilla JS
          application), you can build a robust dedup wrapper around <code>fetch()</code>. Here's a complete
          implementation with cache key normalization, time-window dedup, and TypeScript generics.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`interface DedupOptions {
  /** Time in ms to cache completed responses (default: 2000) */
  dedupWindow?: number;
  /** Custom cache key generator */
  keyFn?: (url: string, options?: RequestInit) => string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class RequestDeduplicator {
  private inflight = new Map<string, Promise<any>>();
  private cache = new Map<string, CacheEntry<any>>();
  private defaultWindow: number;

  constructor(defaultWindow = 2000) {
    this.defaultWindow = defaultWindow;
  }

  /**
   * Normalize URL by sorting query parameters
   */
  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url, window.location.origin);
      parsed.searchParams.sort();
      return parsed.pathname + parsed.search;
    } catch {
      return url; // fallback for non-standard URLs
    }
  }

  /**
   * Generate a cache key from URL and relevant request options
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const normalizedUrl = this.normalizeUrl(url);
    const method = options?.method?.toUpperCase() || 'GET';

    // Only dedup GET/HEAD requests
    if (method !== 'GET' && method !== 'HEAD') {
      // Return unique key so mutations are never deduplicated
      return \`\${method}:\${normalizedUrl}:\${Date.now()}:\${Math.random()}\`;
    }

    // Include Authorization header in key (different users = different data)
    const authHeader = options?.headers
      ? new Headers(options.headers).get('Authorization') || ''
      : '';

    return \`GET:\${normalizedUrl}:\${authHeader}\`;
  }

  /**
   * Fetch with deduplication
   */
  async fetch<T = any>(
    url: string,
    options?: RequestInit,
    dedupOptions?: DedupOptions
  ): Promise<T> {
    const key = dedupOptions?.keyFn
      ? dedupOptions.keyFn(url, options)
      : this.getCacheKey(url, options);

    const window = dedupOptions?.dedupWindow ?? this.defaultWindow;

    // 1. Check time-window cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < window) {
      return cached.data as T;
    }

    // 2. Check in-flight requests
    if (this.inflight.has(key)) {
      return this.inflight.get(key)! as Promise<T>;
    }

    // 3. Create new request
    const promise = fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        return response.json() as Promise<T>;
      })
      .then(data => {
        // Store in time-window cache
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
      })
      .finally(() => {
        this.inflight.delete(key);
      });

    this.inflight.set(key, promise);
    return promise;
  }

  /**
   * Invalidate cache for a specific key or pattern
   */
  invalidate(pattern?: string | RegExp): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get current stats for debugging
   */
  get stats() {
    return {
      inflightCount: this.inflight.size,
      cacheSize: this.cache.size,
    };
  }
}

// Singleton instance
export const dedup = new RequestDeduplicator();

// Usage
const user = await dedup.fetch('/api/user');
const posts = await dedup.fetch('/api/posts?sort=date&limit=10');`}</code>
        </pre>

        <MermaidDiagram
          chart={`flowchart TD
    A[dedup.fetch called] --> B{Custom keyFn?}
    B -->|Yes| C[Generate key with keyFn]
    B -->|No| D[Normalize URL + extract method + auth]
    C --> E{Method is GET/HEAD?}
    D --> E
    E -->|No| F[Return unique key — never dedup mutations]
    E -->|Yes| G{Key in time-window cache?}
    G -->|Yes, fresh| H[Return cached data immediately]
    G -->|No or stale| I{Key in inflight map?}
    I -->|Yes| J[Return existing promise]
    I -->|No| K[Create new fetch]
    K --> L[Store promise in inflight map]
    L --> M{Request succeeds?}
    M -->|Yes| N[Store in cache with timestamp]
    M -->|No| O[Throw error]
    N --> P[Remove from inflight map]
    O --> P
    P --> Q[Return result to all subscribers]`}
          caption="Decision flow for request deduplication — cache check, inflight check, then fetch"
        />
      </section>

      <section>
        <h2>Cache Key Normalization</h2>
        <p>
          Cache key normalization is one of the most underappreciated aspects of request deduplication. Without
          it, semantically identical requests produce different cache keys, defeating the entire purpose.
        </p>

        <h3 className="mt-4 font-semibold">Common Normalization Issues</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Request A</th>
              <th className="p-3 text-left">Request B</th>
              <th className="p-3 text-left">Same Data?</th>
              <th className="p-3 text-left">Same String?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>/api/users?sort=name&limit=10</code></td>
              <td className="p-3"><code>/api/users?limit=10&sort=name</code></td>
              <td className="p-3">Yes</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><code>/api/users?q=hello%20world</code></td>
              <td className="p-3"><code>/api/users?q=hello+world</code></td>
              <td className="p-3">Yes</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><code>/api/users/</code></td>
              <td className="p-3"><code>/api/users</code></td>
              <td className="p-3">Yes</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><code>https://api.example.com/users</code></td>
              <td className="p-3"><code>/users</code></td>
              <td className="p-3">Depends</td>
              <td className="p-3">No</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Robust Normalization Function</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function normalizeRequestKey(url: string, options?: RequestInit): string {
  // Parse URL relative to current origin
  const parsed = new URL(url, window.location.origin);

  // Remove trailing slash
  let pathname = parsed.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Sort query parameters alphabetically
  parsed.searchParams.sort();

  // Normalize to lowercase pathname
  const normalizedUrl = pathname.toLowerCase() + parsed.search;

  // Include method (default GET)
  const method = (options?.method || 'GET').toUpperCase();

  // For requests with bodies, include a hash of the body
  if (options?.body) {
    const bodyStr = typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body);
    // Simple hash for dedup purposes
    const hash = Array.from(bodyStr).reduce(
      (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0
    );
    return \`\${method}:\${normalizedUrl}:body(\${hash})\`;
  }

  return \`\${method}:\${normalizedUrl}\`;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Time-Window Deduplication</h2>
        <p>
          Pure in-flight deduplication only collapses requests that overlap in time. If Component A's request
          completes at <code>t=100ms</code> and Component B mounts at <code>t=150ms</code>, they won't be
          deduplicated — Component B fires a fresh request even though the data is only 50ms old.
        </p>
        <p>
          Time-window deduplication solves this by caching the response for a configurable period after
          completion. Any request arriving within the window receives the cached result instantly.
        </p>

        <MermaidDiagram
          chart={`gantt
    title Request Deduplication Timeline (2s window)
    dateFormat X
    axisFormat %Lms

    section Component A
    Fetch /api/user           :a1, 0, 100
    Uses response             :milestone, 100, 0

    section Component B
    Mounts at t=50ms          :b1, 50, 50
    Shares inflight promise   :milestone, 100, 0

    section Component C
    Mounts at t=500ms         :c1, 500, 0
    Gets cached result        :milestone, 500, 0

    section Component D
    Mounts at t=2500ms        :d1, 2500, 100
    New fetch (outside window):milestone, 2600, 0

    section Dedup Window
    Cache valid (0-2100ms)    :active, 100, 2100`}
          caption="Time-window dedup — Components B and C share the result, Component D makes a fresh request"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React hook with time-window deduplication
import { useState, useEffect, useRef } from 'react';

interface DedupCache {
  promise: Promise<any> | null;
  data: any;
  error: any;
  timestamp: number;
}

const globalCache = new Map<string, DedupCache>();

function useDedupFetch<T>(url: string, windowMs = 2000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function fetchData() {
      const key = url;
      const cached = globalCache.get(key);

      // Return cached data if within window
      if (cached?.data && Date.now() - cached.timestamp < windowMs) {
        if (mountedRef.current) {
          setData(cached.data);
          setIsLoading(false);
        }
        return;
      }

      // Share in-flight promise
      if (cached?.promise) {
        try {
          const result = await cached.promise;
          if (mountedRef.current) {
            setData(result);
            setIsLoading(false);
          }
        } catch (err) {
          if (mountedRef.current) {
            setError(err as Error);
            setIsLoading(false);
          }
        }
        return;
      }

      // New request
      const entry: DedupCache = {
        promise: null,
        data: null,
        error: null,
        timestamp: 0,
      };

      entry.promise = fetch(url)
        .then(r => {
          if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
          return r.json();
        })
        .then(result => {
          entry.data = result;
          entry.timestamp = Date.now();
          entry.promise = null;
          return result;
        })
        .catch(err => {
          entry.error = err;
          entry.promise = null;
          throw err;
        });

      globalCache.set(key, entry);

      try {
        const result = await entry.promise;
        if (mountedRef.current) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [url, windowMs]);

  return { data, error, isLoading };
}`}</code>
        </pre>
      </section>

      <section>
        <h2>AbortController for Canceling Duplicate Requests</h2>
        <p>
          In some scenarios, rather than sharing promises, you want to <strong>cancel</strong> the earlier
          request when a new one arrives. This is different from deduplication — it's <strong>dedup by
          cancellation</strong>. The most common use case is search-as-you-type: when the user types "rea",
          "reac", "react" in quick succession, you want to cancel the "rea" and "reac" requests and only
          keep "react".
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cancel-style deduplication for search/typeahead
const activeControllers = new Map<string, AbortController>();

async function cancelDedupFetch<T>(
  url: string,
  groupKey: string // group requests by logical operation
): Promise<T | undefined> {
  // Abort any existing request in this group
  const existing = activeControllers.get(groupKey);
  if (existing) {
    existing.abort();
  }

  const controller = new AbortController();
  activeControllers.set(groupKey, controller);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const data = await response.json();
    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Silently ignore — this request was superseded
      return undefined;
    }
    throw err; // Re-throw actual errors
  } finally {
    // Only clean up if this is still the active controller
    if (activeControllers.get(groupKey) === controller) {
      activeControllers.delete(groupKey);
    }
  }
}

// Usage in a search component
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    cancelDedupFetch(\`/api/search?q=\${encodeURIComponent(query)}\`, 'search')
      .then(data => {
        if (data) setResults(data.results);
      })
      .catch(console.error);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">When to Use Which Strategy</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Mechanism</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Promise sharing</strong></td>
              <td className="p-3">Return same in-flight promise</td>
              <td className="p-3">Multiple components needing same data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Time-window cache</strong></td>
              <td className="p-3">Cache response for N ms after completion</td>
              <td className="p-3">Components mounting at slightly different times</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cancel previous</strong></td>
              <td className="p-3">Abort earlier request via AbortController</td>
              <td className="p-3">Search-as-you-type, autocomplete, filters</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Debounce + dedup</strong></td>
              <td className="p-3">Wait for input to settle, then dedup</td>
              <td className="p-3">Form field validation, live search</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>GraphQL Batching and Deduplication</h2>
        <p>
          GraphQL presents unique deduplication opportunities because multiple queries can be combined into a
          single HTTP request. Libraries like <strong>Apollo Client</strong> and <strong>urql</strong> support
          both query deduplication and query batching.
        </p>

        <h3 className="mt-4 font-semibold">Query Deduplication in Apollo Client</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    // Apollo deduplicates identical queries by default
    // Two components running the same query = one network request
  }),
  cache: new InMemoryCache(),
  // Explicit dedup control
  defaultOptions: {
    watchQuery: {
      // 'none' = always fetch, 'all' = dedup all, 'cancel' = cancel previous
      fetchPolicy: 'cache-first', // serves from cache, dedup on refetch
    },
  },
});

// Component A
function UserName() {
  const { data } = useQuery(GET_USER, { variables: { id: '123' } });
  return <span>{data?.user.name}</span>;
}

// Component B — identical query + variables = deduplicated
function UserAvatar() {
  const { data } = useQuery(GET_USER, { variables: { id: '123' } });
  return <img src={data?.user.avatar} />;
}

// Apollo sends ONE GraphQL request for both components`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Query Batching</h3>
        <p>
          Batching is a step beyond deduplication: even <strong>different</strong> queries fired in the same
          tick can be combined into a single HTTP request.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

const client = new ApolloClient({
  link: new BatchHttpLink({
    uri: '/graphql',
    batchMax: 10,        // Max 10 queries per batch
    batchInterval: 20,   // Wait 20ms to collect queries
  }),
  cache: new InMemoryCache(),
});

// Three different queries fired in the same render cycle:
// useQuery(GET_USER)        — query 1
// useQuery(GET_POSTS)       — query 2
// useQuery(GET_NOTIFICATIONS) — query 3
//
// BatchHttpLink collects all three and sends ONE HTTP request:
// POST /graphql
// Body: [
//   { query: "{ user { name } }" },
//   { query: "{ posts { title } }" },
//   { query: "{ notifications { count } }" }
// ]
//
// Server responds with array of results, Apollo distributes them`}</code>
        </pre>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant C1 as UserName
    participant C2 as PostList
    participant C3 as Notifications
    participant AL as Apollo BatchLink
    participant API as GraphQL Server

    Note over C1,C3: All components render in same cycle
    C1->>AL: useQuery(GET_USER)
    C2->>AL: useQuery(GET_POSTS)
    C3->>AL: useQuery(GET_NOTIFICATIONS)
    Note over AL: Collects for 20ms
    AL->>API: POST /graphql [3 queries batched]
    API-->>AL: [3 results]
    AL-->>C1: user data
    AL-->>C2: posts data
    AL-->>C3: notifications data
    Note over C1,API: 3 queries, 1 HTTP request`}
          caption="GraphQL batching — multiple different queries combined into a single HTTP request"
        />
      </section>

      <section>
        <h2>Server Components and Framework-Level Deduplication</h2>
        <p>
          React Server Components and frameworks like Next.js introduce deduplication at the framework level,
          operating during server-side rendering rather than in the browser.
        </p>

        <h3 className="mt-4 font-semibold">React cache()</h3>
        <p>
          React provides a <code>cache()</code> function that memoizes an async function for the duration of
          a single server render pass. Multiple Server Components calling the same cached function within one
          request receive the same result without duplicate execution.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { cache } from 'react';

// Memoized for a single server render pass
export const getUser = cache(async (userId: string) => {
  console.log('Fetching user:', userId); // Logs only once per render
  const res = await fetch(\`https://api.example.com/users/\${userId}\`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
});

// Server Component A
async function Header() {
  const user = await getUser('123'); // Calls API
  return <header>Welcome, {user.name}</header>;
}

// Server Component B (same render pass)
async function Sidebar() {
  const user = await getUser('123'); // Returns memoized result
  return <aside>{user.role}</aside>;
}

// Server Component C (same render pass)
async function ProfileCard() {
  const user = await getUser('123'); // Returns memoized result
  return <div>{user.bio}</div>;
}

// The API is called exactly once during this render.
// cache() automatically invalidates after the render completes,
// so the next request gets fresh data.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Next.js Automatic fetch() Deduplication</h3>
        <p>
          Next.js extends the global <code>fetch</code> function in Server Components to provide automatic
          request deduplication. When multiple Server Components call <code>fetch()</code> with the same URL
          and options during a single render, Next.js makes only one actual HTTP request.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js App Router — automatic deduplication
// No special imports or wrappers needed

// app/components/Header.tsx (Server Component)
async function Header() {
  // Next.js intercepts this fetch
  const res = await fetch('https://api.example.com/user');
  const user = await res.json();
  return <header>{user.name}</header>;
}

// app/components/Sidebar.tsx (Server Component)
async function Sidebar() {
  // Same URL + same options = automatically deduplicated
  const res = await fetch('https://api.example.com/user');
  const user = await res.json();
  return <aside>{user.role}</aside>;
}

// app/page.tsx
export default function Page() {
  return (
    <div>
      <Header />   {/* Both share one fetch */}
      <Sidebar />  {/* No duplicate request */}
    </div>
  );
}

// Important caveats:
// 1. Only GET requests are deduplicated
// 2. POST requests are NOT deduplicated (they're mutations)
// 3. Different options (headers, cache directives) = different requests
// 4. Dedup only works within a single server render pass
// 5. Works with fetch() only — not axios, got, or other HTTP clients`}</code>
        </pre>

        <MermaidDiagram
          chart={`flowchart LR
    subgraph Server Render Pass
        A[Header Component] -->|fetch /api/user| D[Next.js Fetch Layer]
        B[Sidebar Component] -->|fetch /api/user| D
        C[ProfileCard] -->|fetch /api/user| D
    end

    D -->|1 actual request| E[External API]
    E -->|1 response| D
    D -->|shared result| A
    D -->|shared result| B
    D -->|shared result| C`}
          caption="Next.js automatic fetch deduplication — one server-side request serves all components"
        />

        <h3 className="mt-6 font-semibold">Client vs Server Deduplication Comparison</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Client-Side (SWR/React Query)</th>
              <th className="p-3 text-left">Server-Side (cache()/Next.js)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Where it runs</strong></td>
              <td className="p-3">Browser</td>
              <td className="p-3">Server during render</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Scope</strong></td>
              <td className="p-3">Across page lifetime (persistent cache)</td>
              <td className="p-3">Single render pass only</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Revalidation</strong></td>
              <td className="p-3">Focus, interval, manual</td>
              <td className="p-3">Next request / ISR timer</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Mutation handling</strong></td>
              <td className="p-3">Cache invalidation + refetch</td>
              <td className="p-3">revalidatePath / revalidateTag</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Works with</strong></td>
              <td className="p-3">Any HTTP client</td>
              <td className="p-3">fetch() only (Next.js) or cache()-wrapped functions</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-4 font-semibold">Dedup with Request Coalescing</h3>
        <p>
          Request coalescing goes beyond simple dedup by collecting multiple related requests and combining
          them into one. For example, instead of making three separate requests for user IDs 1, 2, and 3,
          you coalesce them into a single batch request.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// DataLoader-style request coalescing
class RequestCoalescer<K, V> {
  private batch: Map<K, {
    resolve: (value: V) => void;
    reject: (error: Error) => void;
  }[]> = new Map();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private batchFn: (keys: K[]) => Promise<Map<K, V>>;
  private windowMs: number;

  constructor(
    batchFn: (keys: K[]) => Promise<Map<K, V>>,
    windowMs = 16 // one animation frame
  ) {
    this.batchFn = batchFn;
    this.windowMs = windowMs;
  }

  async load(key: K): Promise<V> {
    return new Promise((resolve, reject) => {
      if (!this.batch.has(key)) {
        this.batch.set(key, []);
      }
      this.batch.get(key)!.push({ resolve, reject });

      // Schedule batch execution
      if (!this.timer) {
        this.timer = setTimeout(() => this.executeBatch(), this.windowMs);
      }
    });
  }

  private async executeBatch() {
    const currentBatch = new Map(this.batch);
    this.batch.clear();
    this.timer = null;

    try {
      const keys = Array.from(currentBatch.keys());
      const results = await this.batchFn(keys);

      for (const [key, subscribers] of currentBatch) {
        const value = results.get(key);
        if (value !== undefined) {
          subscribers.forEach(s => s.resolve(value));
        } else {
          subscribers.forEach(s =>
            s.reject(new Error(\`No result for key: \${key}\`))
          );
        }
      }
    } catch (err) {
      for (const subscribers of currentBatch.values()) {
        subscribers.forEach(s => s.reject(err as Error));
      }
    }
  }
}

// Usage
const userLoader = new RequestCoalescer(async (ids: string[]) => {
  // Single batch request instead of N individual requests
  const res = await fetch('/api/users/batch', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  const users = await res.json();
  return new Map(users.map((u: any) => [u.id, u]));
});

// Three components call load() in the same frame:
const user1 = await userLoader.load('abc'); // }
const user2 = await userLoader.load('def'); // } → ONE POST /api/users/batch
const user3 = await userLoader.load('abc'); // }   with ids: ['abc', 'def']
// user1 and user3 get the same object (also deduplicated)`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Dedup-Aware Prefetching</h3>
        <p>
          Prefetching and deduplication work together naturally. When you prefetch data on hover or route
          transition, the dedup layer ensures that if the actual component mounts before the prefetch completes,
          it shares the in-flight promise instead of starting a new request.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useQueryClient } from '@tanstack/react-query';

function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch on hover — React Query deduplicates automatically
    queryClient.prefetchQuery({
      queryKey: ['page', href],
      queryFn: () => fetch(\`/api/page\${href}\`).then(r => r.json()),
      staleTime: 30000, // Consider fresh for 30s
    });
  };

  return (
    <a href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  );
}

// When user clicks and the page component calls useQuery with the same key,
// it gets the prefetched data instantly (or shares the in-flight promise).`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Service Worker Deduplication</h3>
        <p>
          For applications with service workers, deduplication can happen at the network interception layer,
          catching duplicate requests even before they leave the browser.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// service-worker.js — dedup at the network layer
const inflightRequests = new Map();

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only dedup GET requests to our API
  if (request.method !== 'GET' || !request.url.includes('/api/')) {
    return;
  }

  const key = request.url;

  if (inflightRequests.has(key)) {
    // Return a clone of the in-flight response
    event.respondWith(
      inflightRequests.get(key).then(response => response.clone())
    );
    return;
  }

  const responsePromise = fetch(request).then(response => {
    // Cache the response for a short window
    const cache = caches.open('dedup-cache');
    cache.then(c => c.put(request, response.clone()));

    inflightRequests.delete(key);
    return response;
  });

  inflightRequests.set(key, responsePromise);
  event.respondWith(responsePromise.then(r => r.clone()));
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Deduplicating mutations (POST/PUT/DELETE):</strong> This is the most dangerous mistake.
            Each mutation is intentional and may have side effects — deduplicating them can cause data loss
            or incomplete operations. Always ensure your dedup layer only applies to read operations.
          </li>
          <li>
            <strong>Stale data propagation:</strong> When all components share a cached response, one stale
            result propagates everywhere. A user updates their name, but the cached response still shows the
            old name in all five components. Implement proper cache invalidation after mutations.
          </li>
          <li>
            <strong>Memory leaks in the request map:</strong> If the <code>finally</code> block is missing or
            a promise never settles (e.g., network timeout without AbortController), entries accumulate in the
            inflight map forever. Always clean up and consider adding a maximum cache size with LRU eviction.
          </li>
          <li>
            <strong>Different auth tokens sharing cache:</strong> Two requests to <code>/api/user</code> with
            different Authorization headers return different data (different users). If your cache key doesn't
            include the auth token, User A might see User B's data. Always include relevant headers in keys.
          </li>
          <li>
            <strong>Error broadcasting:</strong> When a shared promise rejects, all subscribers receive the
            same error. This is usually correct, but consider whether retry logic should be per-subscriber
            (each component retries independently) or shared (one retry, everyone waits).
          </li>
          <li>
            <strong>Query parameter ordering:</strong> <code>/api?a=1&b=2</code> and <code>/api?b=2&a=1</code>
            hit the same endpoint but are different strings. Without URL normalization, they bypass dedup
            entirely. Always sort query parameters in your cache key function.
          </li>
          <li>
            <strong>Over-caching with long dedup windows:</strong> A 30-second dedup window means users won't
            see data updates for 30 seconds after a mutation. Balance dedup effectiveness against data freshness
            requirements. For frequently changing data, use shorter windows (1-2 seconds).
          </li>
          <li>
            <strong>Ignoring response headers:</strong> Some APIs return <code>Cache-Control: no-store</code>
            or <code>Vary</code> headers that indicate responses should not be shared. A well-behaved dedup
            layer should respect these directives.
          </li>
          <li>
            <strong>Next.js dedup only works with fetch():</strong> If you use <code>axios</code>,
            <code>got</code>, or any other HTTP client in Server Components, Next.js cannot deduplicate those
            requests. You must use the native <code>fetch()</code> API or wrap your client with
            React <code>cache()</code>.
          </li>
          <li>
            <strong>Mixing client and server dedup strategies:</strong> In a Next.js app with both Server
            Components and Client Components, you need dedup in both layers. Server-side uses
            <code>cache()</code>/automatic fetch dedup. Client-side uses SWR/React Query. They operate
            independently and don't share state, which is the correct behavior.
          </li>
        </ul>
      </section>

      <section>
        <h2>Testing Deduplication</h2>
        <p>
          Verifying that deduplication works correctly requires specific testing strategies. You need to
          confirm that duplicate requests are collapsed, non-duplicate requests are not incorrectly shared,
          and edge cases (errors, timeouts, cache invalidation) behave correctly.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Testing dedup with a mock fetch counter
describe('RequestDeduplicator', () => {
  let fetchCount: number;
  let dedup: RequestDeduplicator;

  beforeEach(() => {
    fetchCount = 0;
    dedup = new RequestDeduplicator(2000);

    global.fetch = jest.fn(() => {
      fetchCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'Test User' }),
      } as Response);
    });
  });

  test('deduplicates concurrent identical requests', async () => {
    // Fire three concurrent requests
    const [r1, r2, r3] = await Promise.all([
      dedup.fetch('/api/user'),
      dedup.fetch('/api/user'),
      dedup.fetch('/api/user'),
    ]);

    expect(fetchCount).toBe(1);        // Only one actual fetch
    expect(r1).toEqual(r2);             // Same data
    expect(r2).toEqual(r3);             // Same data
  });

  test('does not dedup requests with different URLs', async () => {
    await Promise.all([
      dedup.fetch('/api/user'),
      dedup.fetch('/api/posts'),
    ]);

    expect(fetchCount).toBe(2);         // Two different requests
  });

  test('serves from time-window cache', async () => {
    await dedup.fetch('/api/user');      // First request
    expect(fetchCount).toBe(1);

    await dedup.fetch('/api/user');      // Within 2s window
    expect(fetchCount).toBe(1);         // No additional fetch
  });

  test('refetches after window expires', async () => {
    await dedup.fetch('/api/user');
    expect(fetchCount).toBe(1);

    // Advance time past dedup window
    jest.advanceTimersByTime(3000);

    await dedup.fetch('/api/user');
    expect(fetchCount).toBe(2);         // Fresh request after window
  });

  test('broadcasts errors to all subscribers', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('500'));

    const results = await Promise.allSettled([
      dedup.fetch('/api/user'),
      dedup.fetch('/api/user'),
    ]);

    expect(fetchCount).toBe(1);
    expect(results[0].status).toBe('rejected');
    expect(results[1].status).toBe('rejected');
  });

  test('never deduplicates POST requests', async () => {
    await Promise.all([
      dedup.fetch('/api/user', { method: 'POST', body: '{}' }),
      dedup.fetch('/api/user', { method: 'POST', body: '{}' }),
    ]);

    expect(fetchCount).toBe(2);         // Both POSTs execute
  });
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Impact</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Without Dedup</th>
              <th className="p-3 text-left">With Dedup</th>
              <th className="p-3 text-left">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Network requests (dashboard page)</strong></td>
              <td className="p-3">23 requests</td>
              <td className="p-3">8 unique requests</td>
              <td className="p-3">65% fewer requests</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Data transferred</strong></td>
              <td className="p-3">145 KB</td>
              <td className="p-3">52 KB</td>
              <td className="p-3">64% less bandwidth</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Server API calls</strong></td>
              <td className="p-3">23 handler executions</td>
              <td className="p-3">8 handler executions</td>
              <td className="p-3">65% less server load</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Time to data ready</strong></td>
              <td className="p-3">~800ms (connection contention)</td>
              <td className="p-3">~300ms (fewer parallel requests)</td>
              <td className="p-3">62% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>UI consistency</strong></td>
              <td className="p-3">Possible flickering (different response times)</td>
              <td className="p-3">All components update simultaneously</td>
              <td className="p-3">No visual inconsistency</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use SWR or React Query for most React apps:</strong> They provide production-tested
            deduplication along with caching, revalidation, error handling, and DevTools. Don't reinvent
            the wheel unless you have specific constraints.
          </li>
          <li>
            <strong>Only deduplicate reads (GET/HEAD):</strong> Mutations must always execute. Build your
            dedup layer with an explicit method check that rejects non-GET requests.
          </li>
          <li>
            <strong>Normalize cache keys:</strong> Sort query parameters, normalize URL encoding, handle
            trailing slashes, and include relevant headers (Authorization) in the cache key.
          </li>
          <li>
            <strong>Set appropriate time windows:</strong> 2 seconds is a sensible default for most data.
            Reduce for rapidly changing data; increase for truly static content.
          </li>
          <li>
            <strong>Always clean up in finally:</strong> Whether the request succeeds or fails, remove it
            from the inflight map to prevent memory leaks and stale entries.
          </li>
          <li>
            <strong>Use React cache() for Server Components:</strong> Wrap data-fetching functions with
            <code>cache()</code> to deduplicate across components in a single server render.
          </li>
          <li>
            <strong>Invalidate after mutations:</strong> When a user updates data, immediately invalidate
            the relevant cache entries so subsequent reads fetch fresh data.
          </li>
          <li>
            <strong>Test dedup explicitly:</strong> Write tests that verify request counts, error broadcasting,
            cache expiration, and mutation bypass.
          </li>
          <li>
            <strong>Consider request coalescing:</strong> For list-of-IDs patterns (e.g., user avatars in a
            feed), use DataLoader-style batching to combine individual requests into batch calls.
          </li>
          <li>
            <strong>Prefer fetch() in Next.js Server Components:</strong> Next.js only deduplicates native
            <code>fetch()</code> calls, not third-party HTTP clients. Stick with <code>fetch()</code> or
            wrap your client in <code>cache()</code>.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Request deduplication ensures multiple components requesting the same data produce a single network
            call. The core mechanism is <strong>promise sharing</strong> — all callers receive the same in-flight
            promise and the same resolved value.
          </li>
          <li>
            SWR and React Query provide automatic deduplication via shared caches. SWR uses a time-window approach
            (default 2-second <code>dedupingInterval</code>), while React Query deduplicates concurrent requests
            and uses <code>staleTime</code> to control refetch behavior.
          </li>
          <li>
            Cache key normalization is critical — sort query parameters, handle URL encoding, include auth headers,
            and normalize paths. Without normalization, semantically identical requests bypass dedup.
          </li>
          <li>
            GraphQL enables <strong>query batching</strong> (combining different queries into one HTTP request)
            in addition to deduplication (collapsing identical queries). Apollo Client's BatchHttpLink handles
            both automatically.
          </li>
          <li>
            React Server Components use <code>cache()</code> for per-render memoization, and Next.js automatically
            deduplicates <code>fetch()</code> calls in Server Components. This works server-side only and
            scopes to a single render pass.
          </li>
          <li>
            Never deduplicate mutations (POST/PUT/DELETE) — each mutation is intentional. Always clean up in-flight
            maps in <code>finally</code> blocks. Handle error broadcasting to all subscribers correctly.
          </li>
          <li>
            For advanced use cases, <strong>request coalescing</strong> (DataLoader pattern) combines multiple
            related requests into a single batch call, going beyond simple dedup to truly minimize network
            round-trips.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://swr.vercel.app/docs/advanced/performance#deduplication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWR Documentation — Deduplication
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/query/latest/docs/react/guides/caching" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query — Caching and Deduplication
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/caching#request-memoization" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Request Memoization
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/cache" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — cache()
            </a>
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/api/link/apollo-link-batch-http/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apollo Client — BatchHttpLink
            </a>
          </li>
          <li>
            <a href="https://github.com/graphql/dataloader" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DataLoader — Batching and Caching for GraphQL
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — AbortController
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
