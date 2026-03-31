"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "url-parameter-handling",
  title: "URL Parameter Handling",
  description:
    "Managing URL query parameters and search params — reading, writing, syncing with state, URLSearchParams API, and patterns for using URLs as the source of truth for UI state.",
  category: "frontend",
  subcategory: "routing",
  slug: "url-parameter-handling",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["URL parameters", "query strings", "URLSearchParams", "search params", "state"],
  relatedTopics: ["client-side-routing", "dynamic-routes", "deep-linking"],
};

export default function UrlParameterHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          URL parameter handling is the practice of reading, writing, and synchronizing application
          state with the URL&apos;s query string (the portion after <code>?</code>). Query
          parameters like <code>?search=react&amp;page=3&amp;sort=newest</code> encode UI state
          directly in the URL, making that state shareable, bookmarkable, and restorable via
          browser back/forward navigation.
        </p>
        <p className="mb-4">
          Using URL parameters as a source of truth for UI state is one of the most underutilized
          patterns in frontend development. Search queries, filter selections, pagination state,
          sort order, active tabs, modal open state, and selected items can all live in the URL.
          This eliminates the need for local state management for these values and enables powerful
          features: sharing a filtered view via link, restoring exact state on page refresh, and
          analytics tracking that captures the full UI context.
        </p>
        <p>
          The <code>URLSearchParams</code> API provides a clean interface for parsing and
          manipulating query strings. React Router&apos;s <code>useSearchParams()</code> hook and
          Next.js&apos;s <code>useSearchParams()</code> integrate URL params with React state,
          enabling reactive updates when parameters change.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/url-parameter-handling-diagram-1.svg"
        alt="URL anatomy showing path parameters vs query parameters"
        caption="Figure 1: URL anatomy — path parameters identify resources, query parameters encode state and filters on that resource."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The URLSearchParams API</h3>
        <p className="mb-4">
          <code>URLSearchParams</code> is a browser API for parsing and manipulating query
          strings. Create one from a string: <code>new URLSearchParams(&quot;?a=1&amp;b=2&quot;)</code>.
          It provides methods like <code>get(key)</code>, <code>set(key, value)</code>,{" "}
          <code>append(key, value)</code>, <code>delete(key)</code>, <code>has(key)</code>, and{" "}
          <code>toString()</code>. It handles encoding/decoding automatically and supports
          iteration with <code>entries()</code>, <code>keys()</code>, and <code>values()</code>.
        </p>
        <p className="mb-4">
          Key behavior: <code>get()</code> returns the first value for a key (or null).{" "}
          <code>getAll()</code> returns all values (for multi-value params like{" "}
          <code>?color=red&amp;color=blue</code>). <code>set()</code> replaces all values for a
          key. <code>append()</code> adds a value without removing existing ones. This distinction
          matters for multi-select filters where a single key has multiple values.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Path Parameters vs Query Parameters</h3>
        <p className="mb-4">
          Path parameters (<code>/users/:id</code>) identify a specific resource — they define
          <em>what</em> you&apos;re looking at. Query parameters (<code>?tab=settings&amp;view=grid</code>)
          modify <em>how</em> you&apos;re looking at it. The distinction maps to REST conventions:
          path segments identify resources, query parameters filter or modify the representation.
          In practice: product IDs go in the path, search filters go in query params.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL as State — The Source of Truth Pattern</h3>
        <p>
          In this pattern, the URL is the single source of truth for shareable UI state.
          Components read their state from URL params (via <code>useSearchParams()</code>) instead
          of local state. User interactions update the URL (via router navigation), which triggers
          a re-render with the new params. This inverts the typical flow: instead of state driving
          the URL, the URL drives state. Benefits: every UI state is linkable, the browser
          history captures state changes, and page refresh restores exact state.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/url-parameter-handling-diagram-2.svg"
        alt="URL-as-state pattern showing bidirectional sync between URL and components"
        caption="Figure 2: URL-as-state pattern — user interactions update the URL, URL changes drive component state, creating a unidirectional flow through the URL."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reading Params in React</h3>
        <p className="mb-4">
          React Router provides <code>useSearchParams()</code> which returns a{" "}
          <code>URLSearchParams</code> instance and a setter function. Next.js App Router provides{" "}
          <code>useSearchParams()</code> that returns a read-only <code>URLSearchParams</code> —
          updates are done via <code>router.push()</code> or <code>router.replace()</code>. In
          both cases, when URL params change (via navigation or programmatic update), the hook
          triggers a re-render with the new values.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Writing Params Without Navigation Noise</h3>
        <p className="mb-4">
          Not every param change should create a history entry. Typing in a search box should
          update <code>?q=react</code> without pushing a new history entry for every keystroke.
          Use <code>router.replace()</code> (replaceState) for incremental updates and{" "}
          <code>router.push()</code> (pushState) for discrete navigation steps. A common pattern:
          replace on every keystroke, push on form submission. This keeps the history stack clean
          while preserving the search query in the URL.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Default Values and Param Omission</h3>
        <p className="mb-4">
          Clean URLs omit parameters when they hold default values. Instead of{" "}
          <code>?sort=newest&amp;page=1&amp;view=grid</code>, show just <code>?sort=newest</code>{" "}
          when page and view are at defaults. Components should fall back to defaults when a param
          is absent: <code>const page = Number(searchParams.get(&quot;page&quot;)) || 1</code>.
          This keeps URLs short for the common case while preserving full state when it differs
          from defaults.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Serialization of Complex State</h3>
        <p>
          For complex state (arrays, objects, date ranges), URL params need serialization
          conventions. Common approaches: comma-separated values for arrays (
          <code>?tags=react,hooks,state</code>), JSON encoding for objects (
          <code>?filters=%7B%22price%22%3A%5B10%2C50%5D%7D</code> — ugly but complete), or
          multiple params with the same key (<code>?tag=react&amp;tag=hooks</code>). Choose based
          on readability, shareability, and complexity needs. Avoid JSON in URLs when possible —
          it&apos;s hard to read and prone to encoding issues.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/url-parameter-handling-diagram-3.svg"
        alt="Search params sync flow showing debounced input to URL to data fetch"
        caption="Figure 3: Search-as-you-type with URL params — input is debounced, URL is updated via replaceState, and data fetching reacts to the URL change."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">State Location</th>
                <th className="px-4 py-3 text-left font-semibold">Shareable</th>
                <th className="px-4 py-3 text-left font-semibold">Survives Refresh</th>
                <th className="px-4 py-3 text-left font-semibold">Back/Forward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">URL params</td><td className="px-4 py-3">Yes (copy URL)</td><td className="px-4 py-3">Yes</td><td className="px-4 py-3">Yes</td></tr>
              <tr><td className="px-4 py-3 font-medium">React state (useState)</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No</td></tr>
              <tr><td className="px-4 py-3 font-medium">localStorage</td><td className="px-4 py-3">No</td><td className="px-4 py-3">Yes</td><td className="px-4 py-3">No</td></tr>
              <tr><td className="px-4 py-3 font-medium">History state</td><td className="px-4 py-3">No (not in URL)</td><td className="px-4 py-3">Partially</td><td className="px-4 py-3">Yes</td></tr>
              <tr><td className="px-4 py-3 font-medium">Global store (Redux, Zustand)</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No (without persistence)</td><td className="px-4 py-3">No</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          URL params are the best choice for state that should be shareable and restorable.
          Use component state for ephemeral UI state (hover, focus, animation). Use global stores
          for cross-component state that doesn&apos;t need to be in the URL (auth, theme).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Put shareable, bookmarkable state in URL params: search queries, filters, pagination, sort order, active tabs</li>
          <li>Omit params that hold default values to keep URLs clean</li>
          <li>Use <code>replaceState</code> for high-frequency updates (typing, slider changes) and <code>pushState</code> for discrete navigation actions</li>
          <li>Validate and sanitize URL params — they are user-modifiable input, like form fields</li>
          <li>Prefer simple serialization (comma-separated, repeated keys) over JSON-in-URLs</li>
          <li>Debounce URL updates from rapid input changes to avoid excessive history entries and re-renders</li>
          <li>Sync URL params with server-side data fetching — Next.js searchParams and React Router loaders both support this</li>
          <li>Document your URL parameter API — it&apos;s an interface that other teams, bookmarks, and shared links depend on</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>History stack pollution:</strong> Pushing a new history entry on every keystroke in a search box. Users must click back dozens of times to return. Use replaceState for incremental updates</li>
          <li><strong>Encoding issues:</strong> Not encoding special characters in param values. A search for &quot;cats &amp; dogs&quot; breaks the URL if not encoded as <code>cats+%26+dogs</code></li>
          <li><strong>Stale component state:</strong> Initializing React state from URL params in useState but not updating when the URL changes. Use the URL as the source of truth — read from useSearchParams on every render</li>
          <li><strong>SSR mismatch:</strong> In Next.js, useSearchParams() returns empty on the server during static rendering. This causes a hydration mismatch if the client renders different content based on params. Wrap param-dependent UI in a client component with Suspense</li>
          <li><strong>URL length limits:</strong> Browsers and servers have URL length limits (typically 2000-8000 characters). Complex filter states serialized as JSON can exceed this. Use POST for complex searches or store state server-side with a short key</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Amazon Product Search</h3>
          <p>
            Amazon encodes the entire search and filter state in URL params:{" "}
            <code>?k=headphones&amp;rh=n:172282,p_36:1000-5000&amp;s=review-rank&amp;page=2</code>.
            This makes every search result shareable and bookmarkable. The URL params drive
            server-side data fetching — Amazon renders search results on the server based on the
            exact URL params, enabling both SSR and caching of popular searches.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Google Maps</h3>
          <p>
            Google Maps encodes the map center, zoom level, layer type, and directions in URL
            params: <code>@37.7749,-122.4194,13z</code>. Sharing a Maps URL reproduces the exact
            view. This is a powerful deep linking pattern — the URL fully captures the application
            state, making it possible to embed map views, share locations, and restore sessions
            from bookmarks.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should UI state live in URL params vs component state?</p>
            <p className="mt-2 text-sm">
              A: URL params for state that should be shareable, bookmarkable, or survive a page
              refresh: search queries, filters, pagination, sort order, active tab. Component state
              for ephemeral UI state that&apos;s meaningless out of context: hover state, animation
              progress, dropdown open/closed, form field values before submission. A good heuristic:
              if a colleague should see the same thing when you send them the URL, put it in params.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you avoid polluting the browser history when updating URL params frequently?</p>
            <p className="mt-2 text-sm">
              A: Use <code>replaceState</code> (via <code>router.replace()</code>) for
              high-frequency updates like search-as-you-type. This modifies the current history
              entry instead of creating new ones. Use <code>pushState</code> only for discrete
              navigation steps (submitting a search, changing a page, applying filters). Debounce
              the URL updates — wait for user input to settle before writing to the URL.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-value parameters like multi-select filters?</p>
            <p className="mt-2 text-sm">
              A: Two approaches: (1) Repeated keys — <code>?color=red&amp;color=blue</code>. Use{" "}
              <code>searchParams.getAll(&quot;color&quot;)</code> to retrieve all values as an array.
              (2) Comma-separated — <code>?colors=red,blue</code>. Split the string manually. The
              repeated keys approach is more standards-compliant (URLSearchParams handles it
              natively), while comma-separated is more readable and compact. Avoid JSON-encoding
              arrays in URLs — it produces unreadable, heavily-encoded strings.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle default values for URL parameters?</p>
            <p className="mt-2 text-sm">
              A: Omit parameters that hold default values to keep URLs clean. In the component,
              fall back to defaults when a param is absent:{" "}
              <code>{"const page = Number(searchParams.get(\"page\")) || 1"}</code>. When the user
              changes a value to something other than the default, add it to the URL. When they
              reset to the default, remove it. This means <code>/products</code> and{" "}
              <code>/products?page=1&amp;sort=newest</code> render identically — the first is just
              cleaner.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the &quot;URL as state&quot; pattern and why is it powerful?</p>
            <p className="mt-2 text-sm">
              A: In this pattern, the URL is the single source of truth for shareable UI state.
              Components read from URL params (via useSearchParams) instead of local state. User
              interactions update the URL via router navigation, which triggers a re-render. This
              inverts the typical flow: instead of state driving the URL, the URL drives state.
              Benefits: every UI state is linkable, browser history captures state changes, page
              refresh restores exact state, and analytics automatically capture the full context.
              It eliminates an entire class of state synchronization bugs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSR hydration mismatches with URL parameters in Next.js?</p>
            <p className="mt-2 text-sm">
              A: In Next.js App Router, <code>useSearchParams()</code> returns empty during static
              rendering on the server because the server doesn&apos;t know what query params the
              client will have. If a component renders different content based on params, the
              server HTML won&apos;t match the client — causing a hydration mismatch. Fix: wrap
              param-dependent UI in a client component with a Suspense boundary. The Suspense
              fallback renders on the server; the actual param-dependent content renders on the
              client after hydration, avoiding the mismatch.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>MDN — URLSearchParams API reference</li>
          <li>React Router — useSearchParams hook</li>
          <li>Next.js — useSearchParams and searchParams in Server Components</li>
          <li>web.dev — URL state management patterns</li>
          <li>nuqs — Type-safe search params state manager for React</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
