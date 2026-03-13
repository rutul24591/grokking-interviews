"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-deduplication-concise",
  title: "Request Deduplication",
  description: "Quick overview of request deduplication techniques for eliminating redundant network calls in frontend applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "request-deduplication",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "request-deduplication", "caching", "react-query", "swr", "fetch"],
  relatedTopics: ["caching-strategies", "data-fetching", "memoization-and-react-memo"],
};

export default function RequestDeduplicationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Request deduplication</strong> is a technique that ensures multiple components requesting the
          same data result in only one actual network call. When five components in your React tree all call
          <code>fetch('/api/user')</code> on mount, deduplication intercepts those calls and returns the same
          response (or the same in-flight promise) to all of them, eliminating four redundant requests.
        </p>
        <p>
          Without deduplication, a typical dashboard with a header showing the user name, a sidebar showing
          the user avatar, a settings panel reading user preferences, and a notification badge checking
          unread counts will fire four separate <code>GET /api/user</code> requests simultaneously. This
          wastes bandwidth, increases server load, and can even cause UI inconsistencies if responses arrive
          with slightly different data.
        </p>
      </section>

      <section>
        <h2>The Problem: Redundant Fetches in Component Trees</h2>
        <p>
          React encourages co-locating data fetching with the components that need it. This is a good
          architectural pattern — each component declares its own data dependencies instead of relying on a
          parent to prop-drill everything down. But it creates a problem: independent components don't know
          about each other's requests.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Five components, five identical requests
function Header() {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch('/api/user').then(r =&gt; r.json()).then(setUser);
  }, []);
  return <div>Welcome, {user?.name}</div>;
}

function Sidebar() {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch('/api/user').then(r =&gt; r.json()).then(setUser);
  }, []);
  return <img src={user?.avatar} />;
}

function Settings() {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch('/api/user').then(r =&gt; r.json()).then(setUser);
  }, []);
  return <form>{/* user preferences */}</form>;
}

// Result: 3 identical GET /api/user requests hit the server`}</code>
        </pre>
        <p>
          Multiply this across an entire application with dozens of endpoints, and you can easily see 50-100%
          more network requests than necessary. This is the core problem request deduplication solves.
        </p>
      </section>

      <section>
        <h2>SWR and React Query: Built-In Deduplication</h2>
        <p>
          The most practical solution for most React applications is to use a data-fetching library that
          handles deduplication automatically. Both <strong>SWR</strong> and <strong>React Query (TanStack Query)</strong>
          deduplicate requests out of the box.
        </p>

        <h3 className="mt-4 font-semibold">How They Work</h3>
        <p>
          Both libraries maintain a shared in-memory cache keyed by the request identifier. When a component
          calls the hook with a key that already has an in-flight request, the library returns the existing
          promise instead of firing a new one. All subscribers receive the same response.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// SWR — all three components share one request
import useSWR from 'swr';

const fetcher = (url: string) =&gt; fetch(url).then(r =&gt; r.json());

function Header() {
  const { data: user } = useSWR('/api/user', fetcher);
  return <div>Welcome, {user?.name}</div>;
}

function Sidebar() {
  // Same key '/api/user' — SWR deduplicates automatically
  const { data: user } = useSWR('/api/user', fetcher);
  return <img src={user?.avatar} />;
}

function Settings() {
  // Still the same key — no additional network request
  const { data: user } = useSWR('/api/user', fetcher);
  return <form>{/* user preferences */}</form>;
}
// Result: 1 GET /api/user request, shared across all 3 components`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">React Query Equivalent</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useQuery } from '@tanstack/react-query';

function Header() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () =&gt; fetch('/api/user').then(r =&gt; r.json()),
  });
  return <div>Welcome, {user?.name}</div>;
}

// Any component using queryKey: ['user'] shares the same request
// React Query deduplicates within a configurable time window (default: 0ms)`}</code>
        </pre>
        <p>
          SWR has a default <code>dedupingInterval</code> of <strong>2 seconds</strong> — requests with the same
          key within 2 seconds of each other are deduplicated. React Query deduplicates all concurrent requests
          with the same query key and provides fine-grained control via <code>staleTime</code> and <code>gcTime</code>.
        </p>
      </section>

      <section>
        <h2>Building a Simple Dedup Cache</h2>
        <p>
          If you cannot use SWR or React Query, you can build a lightweight dedup layer around <code>fetch()</code>.
          The key insight is <strong>promise sharing</strong>: when a second request comes in for the same URL
          while the first is still in-flight, return the same promise.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Simple request deduplication wrapper
const inflightRequests = new Map<string, Promise<any>&gt;();

async function dedupFetch(url: string, options?: RequestInit): Promise<any> {
  const cacheKey = url;

  // If there's already an in-flight request for this URL, return it
  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey)!;
  }

  // Create the request and store its promise
  const promise = fetch(url, options)
    .then(response =&gt; {
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return response.json();
    })
    .finally(() =&gt; {
      // Remove from in-flight map when complete (success or error)
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, promise);
  return promise;
}

// Now all components can call dedupFetch('/api/user')
// and only one request is made`}</code>
        </pre>
        <p>
          This is the core mechanism that SWR and React Query use internally, wrapped with additional features
          like caching, revalidation, and garbage collection.
        </p>
      </section>

      <section>
        <h2>Cache Key Normalization</h2>
        <p>
          A subtle but important problem is that <code>/api/users?sort=name&limit=10</code> and
          <code>/api/users?limit=10&sort=name</code> are the same request but different strings. Without
          key normalization, they produce separate network calls.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function normalizeUrl(url: string): string {
  const parsed = new URL(url, window.location.origin);
  // Sort query parameters alphabetically
  parsed.searchParams.sort();
  return parsed.pathname + parsed.search;
}

// Both produce: /api/users?limit=10&sort=name
normalizeUrl('/api/users?sort=name&limit=10');
normalizeUrl('/api/users?limit=10&sort=name');`}</code>
        </pre>
        <p>
          For POST requests or requests with bodies, the cache key should incorporate a hash of the request
          body. React Query handles this elegantly by using arrays as query keys:
          <code>{'queryKey: [\'users\', { sort: \'name\', limit: 10 }]'}</code>, which are deeply compared
          regardless of property order.
        </p>
      </section>

      <section>
        <h2>Time-Window Deduplication</h2>
        <p>
          Pure in-flight deduplication only collapses requests that overlap in time. Time-window deduplication
          extends this by caching the response for a short period after completion, so requests arriving within
          that window get the cached result without a network call.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const cache = new Map<string, { data: any; timestamp: number }>();
const inflight = new Map<string, Promise<any>&gt;();
const DEDUP_WINDOW = 2000; // 2 seconds

async function timedDedupFetch(url: string): Promise<any> {
  const key = normalizeUrl(url);

  // Check time-window cache first
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp &lt; DEDUP_WINDOW) {
    return cached.data;
  }

  // Check in-flight requests
  if (inflight.has(key)) {
    return inflight.get(key)!;
  }

  const promise = fetch(url)
    .then(r =&gt; r.json())
    .then(data =&gt; {
      cache.set(key, { data, timestamp: Date.now() });
      return data;
    })
    .finally(() =&gt; inflight.delete(key));

  inflight.set(key, promise);
  return promise;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>AbortController and Duplicate Cancellation</h2>
        <p>
          In some scenarios, rather than sharing a promise, you want to <strong>cancel</strong> the earlier
          request when a new one comes in (e.g., search-as-you-type). <code>AbortController</code> enables this.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cancel previous request when a new one starts
const controllers = new Map<string, AbortController>();

async function cancelDedupFetch(url: string): Promise<any> {
  const key = normalizeUrl(url);

  // Abort any existing request for this key
  if (controllers.has(key)) {
    controllers.get(key)!.abort();
  }

  const controller = new AbortController();
  controllers.set(key, controller);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return; // Silently ignore aborted requests
    }
    throw err;
  } finally {
    controllers.delete(key);
  }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Server Components and Next.js Deduplication</h2>
        <p>
          React Server Components and Next.js introduce framework-level deduplication that works differently
          from client-side approaches.
        </p>

        <h3 className="mt-4 font-semibold">React cache()</h3>
        <p>
          React provides a <code>cache()</code> function that memoizes the result of an async function for
          the duration of a single server render. Multiple Server Components calling the same cached function
          within one request share the result.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { cache } from 'react';

// Memoized for the duration of one server render
const getUser = cache(async (userId: string) =&gt; {
  const res = await fetch(\`https://api.example.com/users/\${userId}\`);
  return res.json();
});

// In Server Component A
async function Header() {
  const user = await getUser('123'); // Fetches from API
  return <h1>{user.name}</h1>;
}

// In Server Component B (same render)
async function Sidebar() {
  const user = await getUser('123'); // Returns cached result
  return <nav>{user.role}</nav>;
}`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">Next.js Automatic fetch() Deduplication</h3>
        <p>
          Next.js automatically deduplicates <code>fetch()</code> calls in Server Components. If multiple
          components call <code>fetch()</code> with the same URL and options during a single render, Next.js
          makes only one request. This works out of the box with no configuration needed.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js App Router — automatic deduplication
// Both components fetch the same URL — Next.js makes ONE request

async function Header() {
  const res = await fetch('https://api.example.com/user');
  const user = await res.json();
  return <h1>{user.name}</h1>;
}

async function Sidebar() {
  // Same URL and same options — automatically deduplicated
  const res = await fetch('https://api.example.com/user');
  const user = await res.json();
  return <nav>{user.role}</nav>;
}

// Important: dedup only works for GET requests with same URL + options
// POST requests are NOT deduplicated`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Deduplicating mutations:</strong> Never deduplicate POST, PUT, or DELETE requests. Each
            mutation is intentional and may have side effects. Only deduplicate read operations (GET).
          </li>
          <li>
            <strong>Stale shared data:</strong> If all components share a cached response, one stale result
            propagates everywhere. Set appropriate TTLs and implement revalidation strategies.
          </li>
          <li>
            <strong>Memory leaks:</strong> In-flight maps and caches that never get cleaned up will grow
            indefinitely. Always clean up in the <code>finally</code> block and implement cache eviction.
          </li>
          <li>
            <strong>Different request options:</strong> Two requests to the same URL but with different headers
            (e.g., different auth tokens) should NOT be deduplicated. Include relevant headers in the cache key.
          </li>
          <li>
            <strong>Ignoring error propagation:</strong> When a shared promise rejects, all subscribers receive
            the error. Make sure your error handling works correctly when errors are broadcast to multiple components.
          </li>
          <li>
            <strong>Query parameter ordering:</strong> <code>/api?a=1&b=2</code> and <code>/api?b=2&a=1</code>
            are the same request but different strings. Normalize URLs before keying.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Request deduplication ensures multiple components requesting the same data result in a single network
            call — the core technique is sharing the same in-flight promise across all callers.
          </li>
          <li>
            SWR and React Query provide automatic deduplication via shared caches keyed by request identifiers,
            with configurable deduplication windows (SWR defaults to 2 seconds).
          </li>
          <li>
            Building a custom dedup layer requires an in-flight request map, proper cache key normalization
            (sorting query params), and cleanup in <code>finally</code> blocks to prevent memory leaks.
          </li>
          <li>
            Time-window deduplication extends in-flight dedup by caching responses briefly after completion,
            collapsing requests that arrive within a short window.
          </li>
          <li>
            Next.js and React Server Components provide framework-level dedup — Next.js deduplicates identical
            <code>fetch()</code> calls automatically, and React <code>cache()</code> memoizes per-render.
          </li>
          <li>
            Never deduplicate mutations (POST/PUT/DELETE), always normalize cache keys, and handle error
            propagation carefully since shared promises broadcast failures to all subscribers.
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
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — AbortController
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
