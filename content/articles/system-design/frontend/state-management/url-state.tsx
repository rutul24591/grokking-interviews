"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-url-state-concise",
  title: "URL State & Query Parameters",
  description: "Comprehensive guide to URL-driven state management covering query parameters, History API, search params, deep linking, and shareable application state.",
  category: "frontend",
  subcategory: "state-management",
  slug: "url-state",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "state management", "URL", "query parameters", "History API", "deep linking"],
  relatedTopics: ["local-component-state", "state-persistence", "state-synchronization"],
};

export default function UrlStateQueryParametersConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>URL state</strong> is the practice of encoding application state directly into the browser's address
          bar -- using the pathname, query parameters, and hash fragment as a persistent, shareable, and navigable
          state container. It is arguably the oldest state management mechanism on the web: every HTTP request has always
          carried a URL, and every URL has always been a serialized representation of what the user wants to see.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The modern foundation of URL state rests on the <strong>History API</strong>, introduced in HTML5. Before it,
          any change to the URL triggered a full page reload. The History API exposes two methods that allow JavaScript
          to modify the URL without navigation: <strong>pushState(stateObj, unused, url)</strong> adds a new entry to the
          browser's session history stack, while <strong>replaceState(stateObj, unused, url)</strong> modifies the current
          entry in place. The browser fires a <strong>popstate</strong> event whenever the user presses back or forward,
          giving the application a chance to react.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Why does URL state matter at a staff/principal engineer level? Four reasons dominate architectural decisions:
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Shareability:</strong> A URL containing filter and sort state can be copied and sent to a colleague.
            No other client-side state mechanism offers this for free.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Bookmarkability:</strong> Users can save complex views (e.g., a filtered dashboard with specific
            date range and grouping) as browser bookmarks and return to the exact same view later.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>SEO & Crawlability:</strong> Search engines index URLs. Encoding paginated, filtered, or sorted
            content as distinct URLs allows crawlers to discover and rank those pages independently.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Back/Forward Navigation:</strong> The browser's native navigation buttons work automatically when
            state changes push new history entries. Users expect the back button to undo the last meaningful state
            change, and URL state delivers this without any custom code for history management.
          </HighlightBlock>
        </ul>
        <HighlightBlock as="p" tier="crucial">
          At scale, URL state becomes a critical architectural concern because it sits at the intersection of frontend
          rendering, server-side rendering (where the URL is the only input), caching infrastructure (CDNs and reverse
          proxies key on URL), and analytics pipelines (every page view is a URL).
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          A thorough understanding of URL state requires familiarity with the URL itself, the APIs for reading and
          writing it, and the libraries that abstract the complexity.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">URL Anatomy for State</h3>
        <HighlightBlock as="p" tier="important">
          A URL has three regions commonly used for state. The <strong>pathname</strong> (e.g., /products/electronics)
          encodes hierarchical, route-level state -- the resource being viewed. The <strong>search string</strong>
          (e.g., ?sort=price&page=2) encodes flat key-value state -- filters, sorting, pagination. The{" "}
          <strong>hash fragment</strong> (e.g., #reviews) encodes client-only state -- scroll targets, active tabs, or
          section anchors. The hash is never sent to the server, making it invisible to SSR and analytics unless
          explicitly forwarded.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/url-anatomy.svg"
          alt="URL anatomy diagram showing pathname, search params, and hash fragment"
          caption="Anatomy of a URL -- Each segment serves a distinct state purpose: route state, filter/sort state, and client-only state"
          captionTier="important"
        />

        <h3 className="mt-4 font-semibold">URLSearchParams API</h3>
        <HighlightBlock as="p" tier="important">
          The browser-native <strong>URLSearchParams</strong> interface provides methods to read, write, iterate, and
          serialize query parameters. Key methods include <strong>get(key)</strong>, <strong>getAll(key)</strong> for
          multi-value params, <strong>set(key, value)</strong>, <strong>append(key, value)</strong>,{" "}
          <strong>delete(key)</strong>, and <strong>toString()</strong> for serialization. It handles encoding
          automatically -- spaces become +, special characters are percent-encoded. One subtlety: URLSearchParams
          always works with string values, so numbers and booleans must be parsed explicitly on read.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Encoding, Limits & Serialization</h3>
        <HighlightBlock as="p" tier="crucial">
          URLs have a practical length limit of approximately <strong>2,000 characters</strong> across browsers and
          servers (though the HTTP specification does not define a hard maximum). This constrains how much state
          can live in the URL. Common serialization strategies include: plain key-value pairs for simple primitives,
          comma-separated values for arrays (e.g., ?tags=react,next,ts), JSON serialized and base64-encoded for
          complex objects, and compressed JSON (using libraries like lz-string) for larger payloads. Each adds
          complexity and reduces human readability, so the general rule is to keep URL state minimal and flat.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Framework Integration</h3>
        <HighlightBlock as="p" tier="important">
          Modern frameworks provide hooks to work with URL state declaratively.{" "}
          <strong>Next.js</strong> exposes <strong>useSearchParams()</strong> (read-only, client component) and{" "}
          <strong>useRouter().push/replace</strong> for writes. <strong>React Router v6+</strong> provides{" "}
          <strong>useSearchParams()</strong> which returns a tuple of the current params and a setter function,
          similar to useState. The <strong>nuqs</strong> library (formerly next-usequerystate) offers type-safe,
          validated search params with parsers for numbers, booleans, arrays, and custom types -- it is the closest
          thing to useState for the URL and is gaining significant adoption in the Next.js ecosystem.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">history.state for Hidden State</h3>
        <HighlightBlock as="p" tier="important">
          The first argument to pushState/replaceState is a <strong>state object</strong> (up to ~640KB in most
          browsers) that is associated with the history entry but not visible in the URL. This is useful for passing
          transient data between navigations (e.g., scroll position, form drafts) without polluting the URL. However,
          it is lost when the user opens the URL in a new tab or shares it, so it should never be the sole source of
          truth for important state.
        </HighlightBlock>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="important">
          The central architectural challenge of URL state is <strong>bidirectional synchronization</strong> between
          the URL (which the user and browser control) and React state (which the application controls). State can
          change from two directions: the user interacts with the UI (e.g., clicks a filter), which should update
          both React state and the URL; or the user navigates (back button, bookmark, shared link), which should
          update React state from the URL.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/url-state-flow.svg"
          alt="URL state synchronization flow diagram"
          caption="Bidirectional sync between React state and the URL -- Changes can originate from user interaction or browser navigation"
          captionTier="important"
        />

        <h3 className="mt-4 font-semibold">Sync Pattern: URL as Source of Truth</h3>
        <HighlightBlock as="p" tier="crucial">
          The recommended architecture treats the URL as the <strong>single source of truth</strong>. React state is
          derived from the URL on every render, not the other way around. When the user interacts with the UI, the
          handler updates the URL (via pushState or router.push), and the component reads the new state from the URL
          on the next render cycle. This eliminates the desync problem entirely, at the cost of slightly more complex
          update logic.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">SSR Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          On the server, the URL is the <strong>only</strong> available input. There is no History API, no popstate,
          and no localStorage. Server components in Next.js receive search params as props via the page's searchParams
          parameter. This means URL state is the only client state mechanism that works identically on server and
          client without hydration mismatches -- a significant architectural advantage for SSR and streaming
          architectures.
        </HighlightBlock>

        <h3 className="mt-4 font-semibold">Shallow vs Deep Updates</h3>
        <HighlightBlock as="p" tier="important">
          A <strong>shallow</strong> URL update changes the search params without triggering a server-side data
          refetch. In Next.js App Router, this is achieved with router.replace with the scroll: false option, or
          by using window.history.replaceState directly. A <strong>deep</strong> update triggers a full navigation,
          re-running server components and data fetching. The choice depends on whether the state change requires
          new data from the server (deep) or is purely a client-side concern like UI toggle state (shallow).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <HighlightBlock as="p" tier="important">
          Understanding when to use URL state requires comparing it against other state management options:
        </HighlightBlock>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">URL State</th>
              <th className="p-3 text-left">localStorage</th>
              <th className="p-3 text-left">React State</th>
              <th className="p-3 text-left">Context / Store</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Shareability</strong></td>
              <td className="p-3">Native -- copy URL</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Persistence</strong></td>
              <td className="p-3">Per session (history), permanent via bookmark</td>
              <td className="p-3">Permanent until cleared</td>
              <td className="p-3">Lost on unmount</td>
              <td className="p-3">Lost on refresh</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Capacity</strong></td>
              <td className="p-3">~2,000 chars</td>
              <td className="p-3">~5-10 MB</td>
              <td className="p-3">Limited by memory</td>
              <td className="p-3">Limited by memory</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SEO Impact</strong></td>
              <td className="p-3">High -- crawlable</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Back Button</strong></td>
              <td className="p-3">Native support</td>
              <td className="p-3">No support</td>
              <td className="p-3">No support</td>
              <td className="p-3">No support</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SSR Compatible</strong></td>
              <td className="p-3">Yes -- URL is available on server</td>
              <td className="p-3">No -- client only</td>
              <td className="p-3">Requires hydration</td>
              <td className="p-3">Requires hydration</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">Medium -- serialization, encoding, syncing</td>
              <td className="p-3">Low -- simple get/set</td>
              <td className="p-3">Low -- useState</td>
              <td className="p-3">Medium -- provider setup</td>
            </tr>
          </tbody>
        </table>
        <HighlightBlock as="p" tier="crucial" className="mt-4">
          Heuristic: put navigational, shareable state in the URL (filters, pagination, view selection). Keep
          ephemeral UI state in React state. Persist user preferences in localStorage/cookies. If SSR needs the value,
          the URL or cookies should be the source of truth.
        </HighlightBlock>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="important">
          These practices are drawn from production experience at scale:
        </HighlightBlock>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Define Explicit Defaults:</strong> Every query parameter should have a well-defined default value.
            When a parameter is absent from the URL, the application should behave identically to when the default is
            explicitly present. This keeps URLs clean (no ?page=1&sort=default) while ensuring deterministic behavior.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Validate and Sanitize on Read:</strong> Treat URL parameters as untrusted user input -- because
            they are. Parse with schema validation (Zod, nuqs parsers) and fall back to defaults on invalid values.
            Never pass raw URL params directly into database queries, API calls, or rendered HTML.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Debounce URL Updates:</strong> For high-frequency state changes like search input or range sliders,
            debounce the URL write (typically 300-500ms) to avoid flooding the history stack with entries. Use
            replaceState during the debounce window and pushState only on the final value.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Use replaceState for Minor Changes:</strong> Not every state change deserves a history entry.
            Use pushState for meaningful navigation events (changing a filter category, navigating to a new page) and
            replaceState for refinements within the same logical view (typing in a search box, adjusting a slider).
          </HighlightBlock>
          <li>
            <strong>Keep URLs Human-Readable:</strong> Prefer ?category=electronics&sort=price over ?q=eyJjYXRlZ29yeS.
            Readable URLs improve debugging, analytics, SEO, and user trust. Reserve base64/compressed encoding for
            genuinely complex state that cannot be flattened.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Establish a URL Schema Contract:</strong> Document the expected query parameters, their types,
            allowed values, and defaults in a shared schema. This contract should be used by frontend (for
            serialization/deserialization), backend (for SSR and API routing), and analytics (for event tracking).
          </HighlightBlock>
          <li>
            <strong>Canonicalize Parameter Order:</strong> Sort query parameters alphabetically when serializing.
            This ensures that ?a=1&b=2 and ?b=2&a=1 resolve to the same canonical URL, which is critical for
            caching, deduplication in analytics, and SEO (avoiding duplicate content).
          </li>
          <li>
            <strong>Handle Multi-Value Parameters Consistently:</strong> Choose one encoding strategy for arrays and
            use it everywhere: repeated keys (?tag=a&tag=b), comma-separated (?tags=a,b), or bracket notation
            (?tags[]=a&tags[]=b). Mixing strategies within an application leads to subtle bugs.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="important">
          These issues frequently arise in production URL state implementations:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>URL/React State Desynchronization:</strong> The most common bug. If both URL and React state are
            treated as independent sources of truth, they will inevitably diverge. The fix is to treat the URL as the
            sole source of truth and derive React state from it. Never maintain a parallel useState that shadows URL
            state.
          </HighlightBlock>
          <li>
            <strong>Encoding and Decoding Errors:</strong> Manually constructing query strings with string
            concatenation instead of using URLSearchParams leads to double-encoding (%2520 instead of %20),
            missing encoding of special characters (+, &, =, #), and XSS vulnerabilities. Always use URLSearchParams
            or a validated library for serialization.
          </li>
          <li>
            <strong>Stuffing Too Much State into the URL:</strong> Serializing entire form state, complex objects,
            or large arrays into the URL. This hits length limits, degrades readability, and creates fragile URLs
            that break when the schema changes. Rule of thumb: if it takes more than 5 parameters to represent, it
            probably does not belong in the URL.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>History Stack Pollution:</strong> Pushing a new history entry on every keystroke or slider
            movement. The user presses back and has to click 47 times to get to the previous page. Use replaceState
            for incremental changes and pushState only for committed state transitions.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Ignoring SSR Hydration:</strong> Reading window.location or useSearchParams in a way that differs
            between server and client render, causing hydration mismatches. In Next.js, useSearchParams must be used
            inside a Suspense boundary in client components, and server components should read from the searchParams
            page prop.
          </HighlightBlock>
          <li>
            <strong>No Default Handling:</strong> URLs without explicit parameters (e.g., a user visiting /products
            for the first time) crash or show empty state because the code assumes parameters always exist. Always
            provide fallbacks and handle the "empty URL" case as a first-class scenario.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Breaking the Back Button Contract:</strong> Using replaceState everywhere to "keep the URL clean"
            means the back button skips over meaningful state changes. Users expect back to undo the last navigation
            action. Map your pushState/replaceState strategy to user intent, not implementation convenience.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="important">
          URL state is the right choice for state that is meaningful to share, bookmark, or crawl:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Search & Filter Pages:</strong> E-commerce product listings, job boards, and real estate search.
            Every combination of filters, sort order, and pagination offset maps to a unique URL. Example:
            /jobs?role=senior-engineer&location=remote&salary=150k-200k&sort=date&page=3.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Pagination:</strong> Classic use case. ?page=2 or /page/2 enables crawlers to index all pages,
            users to jump directly to a page, and analytics to track which pages are most viewed. Infinite scroll
            applications still benefit from URL-based pagination for "load more" anchor points.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Tab & View Selection:</strong> Dashboard tabs (?view=analytics), report type selection
            (?report=quarterly), or detail panels (?selected=item-42). Allows deep linking directly to a specific
            view, which is critical for support teams sharing links to specific states.
          </HighlightBlock>
          <li>
            <strong>Multi-Step Wizards:</strong> Encoding the current step in the URL (?step=3 or /onboarding/step-3)
            enables the back button to navigate between steps naturally, bookmarking to resume later, and analytics
            to identify where users drop off.
          </li>
          <li>
            <strong>Map Coordinates & Viewport:</strong> Applications like Google Maps encode lat, lng, and zoom in
            the URL (@37.7749,-122.4194,12z), enabling users to share exact map views. This is a prime example of
            URL state for complex, multi-dimensional data.
          </li>
          <li>
            <strong>Modal & Dialog State:</strong> Opening a modal via ?modal=settings or /settings/modal allows
            the back button to close the modal and direct links to open it. Particularly useful for mobile web where
            modals feel like pages.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use URL State</h3>
          <HighlightBlock as="p" tier="crucial">
            Avoid URL state for:
          </HighlightBlock>
          <ul className="mt-2 space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Ephemeral UI state:</strong> Hover states, animation progress, tooltip visibility, dropdown
              open/close -- these change too rapidly and have no sharing value.
            </HighlightBlock>
            <HighlightBlock as="li" tier="crucial">
              <strong>Sensitive data:</strong> Auth tokens, user PII, or session data should never appear in the URL.
              URLs are logged in server access logs, browser history, analytics, and referrer headers.
            </HighlightBlock>
            <li>
              <strong>Large or complex state:</strong> Full form state, rich text editor content, or drawing canvas
              state exceeds URL capacity and creates fragile, unreadable URLs. Use localStorage, IndexedDB, or
              server-side persistence instead.
            </li>
            <li>
              <strong>High-frequency updates:</strong> Real-time data like cursor position, typing indicators, or
              live counters. The History API is not designed for sub-second updates.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design a search page where filters, sort order, and pagination are all preserved in the URL?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: Treat the URL as the single source of truth. Define a schema for the expected parameters (e.g.,
              category: string, sort: enum, page: number) with defaults. On mount, parse the URL and derive initial
              state. When the user changes a filter, serialize the new state to query params and call
              router.push (for meaningful changes like category switch) or router.replace (for refinements like
              typing in search). Reset pagination to page 1 when filters change. Use URLSearchParams or nuqs for
              type-safe serialization. On the server, read searchParams props to fetch the correct data for SSR.
              Canonicalize parameter order to avoid duplicate URLs in caches and analytics.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the trade-offs of storing state in the URL vs localStorage vs React state?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: URL state is shareable, bookmarkable, SEO-friendly, and works with back/forward navigation, but is
              limited to ~2,000 characters and requires serialization overhead. localStorage persists across sessions
              and holds ~5-10MB, but is not shareable, not crawlable, and unavailable during SSR. React state (useState,
              useReducer) is the simplest and fastest to update, but is lost on refresh, not shareable, and creates
              hydration challenges with SSR. The right choice depends on the state's nature: use URL for navigational
              state (filters, pages, views), localStorage for user preferences (theme, collapsed panels), and React
              state for ephemeral UI state (hover, loading, animation).
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent the back button from breaking when using URL state?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: The key is the distinction between pushState and replaceState. Use pushState for discrete,
              meaningful state transitions that the user would consider "a step" -- changing a page, selecting a
              category, opening a detail view. Use replaceState for continuous or incremental changes -- typing in a
              search field (debounced), adjusting a slider, toggling a minor option. Listen for popstate events to
              update React state when the user navigates back/forward. Additionally, avoid pushing duplicate entries
              (check if the new URL differs from the current one before pushing). For forms and wizards, consider
              warning the user with beforeunload if they have unsaved changes that would be lost on back navigation.
            </HighlightBlock>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN - History API (pushState, replaceState, popstate)
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN - URLSearchParams API Reference
            </a>
          </li>
          <li>
            <a href="https://nuqs.47ng.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              nuqs - Type-safe search params state management for React
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/functions/use-search-params" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js - useSearchParams Hook Documentation
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/url-parts" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - URL Parts and Their Purposes
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
