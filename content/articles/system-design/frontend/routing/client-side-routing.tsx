"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "client-side-routing",
  title: "Client-Side Routing",
  description:
    "Deep dive into client-side routing architecture, SPA navigation patterns, router implementations, and how modern frameworks handle route transitions without full page reloads.",
  category: "frontend",
  subcategory: "routing",
  slug: "client-side-routing",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["routing", "SPA", "navigation", "React Router", "client-side"],
  relatedTopics: ["hash-based-routing", "history-api", "route-based-code-splitting"],
};

export default function ClientSideRoutingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Client-side routing is the technique of handling navigation entirely within the browser,
          intercepting link clicks and URL changes to render different views without triggering a
          full page reload from the server. This is the foundational mechanism behind Single Page
          Applications (SPAs), where the initial HTML document is loaded once and subsequent
          navigation is handled by JavaScript that swaps content in the DOM.
        </p>
        <p className="mb-4">
          Traditional server-side routing sends a new HTTP request for every page transition. The
          server responds with a complete HTML document, the browser tears down the current page,
          parses the new HTML, re-downloads CSS and JavaScript, and re-executes everything. This
          results in a full white-screen flash between pages. Client-side routing eliminates this
          by keeping the shell of the application intact and only updating the portions of the DOM
          that correspond to the new route.
        </p>
        <p>
          Modern frameworks like React (with React Router or Next.js App Router), Vue Router, and
          Angular Router all implement client-side routing as a core primitive. Understanding how
          this works under the hood — from URL interception to component resolution to scroll
          management — is critical for building performant, accessible SPAs.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/client-side-routing-diagram-1.svg"
        alt="Client-side routing lifecycle showing URL change interception, route matching, and DOM update"
        caption="Figure 1: Client-side routing lifecycle — URL change is intercepted, matched against a route table, and the corresponding component tree is rendered without a server round-trip."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Route Table and Matching</h3>
        <p className="mb-4">
          At the heart of every client-side router is a route table — a declarative mapping of URL
          patterns to components. When the URL changes, the router iterates through this table,
          testing each pattern against the current pathname. The first match wins (in most
          implementations), and the associated component tree is rendered.
        </p>
        <p className="mb-4">
          Route patterns support static segments (<code>/about</code>), dynamic parameters
          (<code>/users/:id</code>), wildcards (<code>/files/*</code>), and optional segments.
          More sophisticated routers support ranked matching, where specificity determines priority
          rather than declaration order — <code>/users/settings</code> matches before{" "}
          <code>/users/:id</code> even if declared after it.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Navigation Interception</h3>
        <p className="mb-4">
          Client-side routers intercept navigation in two ways. First, they listen for{" "}
          <code>popstate</code> events fired when the user clicks the browser back/forward buttons
          or when <code>history.back()</code>/<code>history.forward()</code> is called
          programmatically. Second, they intercept anchor tag clicks — typically by attaching a
          global click handler on the document that checks if the target is an internal link, calls{" "}
          <code>event.preventDefault()</code>, and pushes the new URL onto the history stack via{" "}
          <code>history.pushState()</code>.
        </p>
        <p className="mb-4">
          React Router provides a <code>{"<Link>"}</code> component that handles this interception
          declaratively. Under the hood, it renders a standard <code>{"<a>"}</code> tag (for
          accessibility and SEO) but intercepts the click event to perform client-side navigation.
          This means the link is still crawlable by search engines and works with right-click
          &quot;open in new tab&quot;.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Component Resolution and Rendering</h3>
        <p className="mb-4">
          Once a route is matched, the router resolves the component tree. In simple routers,
          components are statically imported and immediately available. In production applications,
          route components are typically lazy-loaded — the router triggers a dynamic{" "}
          <code>import()</code> for the matched route&apos;s chunk, shows a loading indicator
          (often via React Suspense), and renders the component once the chunk arrives.
        </p>
        <p>
          The router also handles nested routes, where parent layouts remain mounted while child
          components swap. This is the <code>{"<Outlet>"}</code> pattern in React Router or the
          nested <code>layout.tsx</code> convention in Next.js App Router. Only the deepest changed
          segment re-renders, preserving parent state and avoiding unnecessary work.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/client-side-routing-diagram-2.svg"
        alt="Route matching algorithm showing pattern specificity ranking"
        caption="Figure 2: Route matching with specificity ranking — static segments score higher than dynamic parameters, ensuring the most specific route wins."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Router Architecture Layers</h3>
        <p className="mb-4">
          A production client-side router consists of several layers. The <strong>history
          layer</strong> manages the browser&apos;s history stack — it wraps the History API (or
          hash-based navigation) and provides a consistent interface for pushing, replacing, and
          listening to URL changes. The <strong>matching layer</strong> compiles route patterns into
          regular expressions or path-matching functions and determines which routes match the
          current URL. The <strong>rendering layer</strong> takes matched routes and renders the
          corresponding component tree, handling transitions, loading states, and error boundaries.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scroll Restoration</h3>
        <p className="mb-4">
          Browsers automatically restore scroll position on back/forward navigation for
          server-rendered pages. Client-side routing breaks this because the browser doesn&apos;t
          know that a &quot;page&quot; changed. Routers must manually implement scroll restoration:
          save the scroll position before navigating away (keyed by a unique history entry
          identifier), reset scroll to top on push navigation, and restore the saved position on
          pop navigation. React Router v6 provides <code>{"<ScrollRestoration>"}</code> for this.
          Next.js App Router handles it automatically.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Transition Management</h3>
        <p className="mb-4">
          Modern routers support transition-aware navigation. React Router&apos;s{" "}
          <code>useNavigation()</code> hook exposes the current navigation state (idle, loading,
          submitting) so the UI can show progress indicators. The View Transitions API integration
          (available in React Router v7 and Next.js) enables animated page transitions by
          coordinating the old and new DOM states through a browser-managed crossfade.
        </p>
        <p>
          Data routers (like React Router&apos;s <code>createBrowserRouter</code>) take this
          further by decoupling data loading from rendering. Each route defines a{" "}
          <code>loader</code> function that fetches data before the route component renders.
          Navigation triggers the loader in parallel with any lazy component loading, and the
          component receives pre-fetched data as props — eliminating the loading spinner waterfall
          common in client-side fetching patterns.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/client-side-routing-diagram-3.svg"
        alt="Data router architecture with parallel loader and component resolution"
        caption="Figure 3: Data router architecture — loaders execute in parallel with lazy component loading, eliminating the fetch-on-render waterfall."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>

        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left font-semibold">Client-Side Routing</th>
                <th className="px-4 py-3 text-left font-semibold">Server-Side Routing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Navigation Speed</td><td className="px-4 py-3">Near-instant (no server round-trip)</td><td className="px-4 py-3">Full page reload each time</td></tr>
              <tr><td className="px-4 py-3 font-medium">Initial Load</td><td className="px-4 py-3">Heavier (JS bundle must load first)</td><td className="px-4 py-3">Lighter (server sends ready HTML)</td></tr>
              <tr><td className="px-4 py-3 font-medium">SEO</td><td className="px-4 py-3">Requires SSR/SSG for crawlability</td><td className="px-4 py-3">Natively crawlable</td></tr>
              <tr><td className="px-4 py-3 font-medium">State Preservation</td><td className="px-4 py-3">Application state persists across navigations</td><td className="px-4 py-3">State lost on every page load</td></tr>
              <tr><td className="px-4 py-3 font-medium">Back/Forward</td><td className="px-4 py-3">Must manually manage scroll and focus</td><td className="px-4 py-3">Browser handles natively</td></tr>
              <tr><td className="px-4 py-3 font-medium">Accessibility</td><td className="px-4 py-3">Must announce route changes to screen readers</td><td className="px-4 py-3">Browser announces page load natively</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          Hybrid approaches (Next.js, Remix, Astro) combine both: server-render the initial page
          for fast first paint and SEO, then hydrate and switch to client-side routing for
          subsequent navigations. This gives the best of both worlds at the cost of framework
          complexity.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Always use semantic <code>{"<a>"}</code> tags (via <code>{"<Link>"}</code>) so links are crawlable, right-clickable, and accessible</li>
          <li>Implement scroll restoration — reset to top on push, restore position on pop</li>
          <li>Announce route changes to screen readers using an ARIA live region or focus management</li>
          <li>Lazy-load route components with Suspense boundaries showing meaningful loading UI</li>
          <li>Prefetch likely next routes on hover or viewport intersection for instant navigation</li>
          <li>Handle 404s gracefully with a catch-all route that shows a helpful not-found page</li>
          <li>Use data loaders (React Router loaders, Next.js Server Components) to parallelize data fetching with navigation</li>
          <li>Keep the route table flat and readable — avoid deeply nested configuration objects</li>
          <li>Test navigation flows including back/forward, deep linking, and direct URL access</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Broken back button:</strong> Using <code>history.replaceState</code> when <code>pushState</code> is appropriate, or not handling <code>popstate</code> events, breaks expected browser navigation</li>
          <li><strong>Memory leaks:</strong> Not cleaning up subscriptions, timers, or event listeners when routes unmount leads to memory growth during long sessions</li>
          <li><strong>Flash of wrong content:</strong> Not showing loading states during lazy route loading causes the previous route to linger or a blank screen to flash</li>
          <li><strong>Accessibility neglect:</strong> Screen reader users get no indication that the page changed unless you explicitly manage focus or use ARIA live regions</li>
          <li><strong>Stale closures:</strong> Route-level effects that capture old route params and don&apos;t re-run when params change cause subtle bugs</li>
          <li><strong>Scroll position bugs:</strong> Not saving/restoring scroll position per-route causes disorienting jumps on back navigation</li>
          <li><strong>Server mismatch:</strong> The server must return the same HTML shell for all routes (or use proper SSR), otherwise direct URL access returns 404</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Gmail / Google Workspace</h3>
          <p>
            Gmail pioneered the SPA approach with client-side routing. The inbox, compose window,
            settings, and individual emails are all different &quot;routes&quot; rendered by swapping DOM
            content. Navigation feels instant because only the mail list or message body changes —
            the header, sidebar, and search bar persist. Gmail uses hash-based routing for
            compatibility and implements extensive prefetching of likely-next-viewed emails.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Figma</h3>
          <p>
            Figma uses client-side routing to navigate between the file browser, individual design
            files, and settings pages. The heavy WebGL canvas is mounted once and persists across
            route changes within a file. Route changes between files trigger a controlled teardown
            and re-initialization of the canvas, but the application shell and toolbar state are
            preserved. Deep links to specific frames within a file use URL parameters resolved
            entirely on the client.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Spotify Web Player</h3>
          <p>
            The Spotify web player maintains continuous audio playback across route transitions.
            Navigating between playlists, albums, search, and artist pages happens via client-side
            routing while the audio player at the bottom persists. This is impossible with
            server-side routing — a full page reload would interrupt playback. The player component
            lives outside the routed content area and communicates via global state.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does client-side routing work without a server round-trip?</p>
            <p className="mt-2 text-sm">
              A: The router intercepts link clicks via event.preventDefault(), updates the URL using
              history.pushState() (which changes the URL bar without triggering a request), matches
              the new URL against a route table, and renders the corresponding component. For
              back/forward navigation, it listens to the popstate event. The server is configured to
              return the same HTML shell for all routes, so direct URL access also works.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What accessibility concerns exist with client-side routing?</p>
            <p className="mt-2 text-sm">
              A: When navigation happens without a full page load, screen readers receive no
              announcement that content changed. Solutions include: managing focus to the new
              content area, using an ARIA live region to announce the new page title, and ensuring
              the document title updates. The route change should also be reflected in the
              browser&apos;s history so assistive technology users can navigate back.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SEO with a client-side routed SPA?</p>
            <p className="mt-2 text-sm">
              A: Use server-side rendering (SSR) or static site generation (SSG) to serve fully
              rendered HTML for the initial request. Search engine crawlers receive complete content
              without executing JavaScript. After hydration, the app switches to client-side
              routing. Frameworks like Next.js and Remix handle this automatically. For purely
              client-side apps, pre-rendering services or dynamic rendering can serve crawler-specific
              HTML.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement scroll restoration in a client-side router?</p>
            <p className="mt-2 text-sm">
              A: Before navigating away, save the current scroll position keyed by a unique history
              entry identifier (using history.replaceState to store it on the current entry). On
              push navigation, reset scroll to top. On pop navigation (back/forward), retrieve the
              saved position from the history state and restore it after the new content renders.
              Use requestAnimationFrame or a MutationObserver to ensure the DOM has updated before
              restoring. React Router v6 provides ScrollRestoration; Next.js handles it automatically.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between a data router and a traditional client-side router?</p>
            <p className="mt-2 text-sm">
              A: A traditional router matches URLs to components and renders them — data fetching
              happens inside the component (useEffect or equivalent), creating a render-then-fetch
              waterfall. A data router decouples data loading from rendering by defining loader
              functions on each route. When navigation occurs, the router runs matched loaders in
              parallel with component loading before committing the navigation. The component
              receives pre-fetched data as props, eliminating loading spinners and enabling pending
              UI states during transition. React Router v6.4+ and Remix use this pattern.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle route transitions and loading states?</p>
            <p className="mt-2 text-sm">
              A: Use the router&apos;s navigation state (React Router&apos;s useNavigation hook
              exposes idle, loading, and submitting states) to show progress indicators during
              transitions. For lazy-loaded routes, wrap components in React Suspense with meaningful
              fallback UI (skeletons matching the target page layout). For data-dependent routes,
              show a global progress bar or keep the current page visible with a loading overlay
              until the next route&apos;s data is ready. The View Transitions API can animate between
              the old and new route DOM states for polished page transitions.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>React Router documentation — declarative routing for React</li>
          <li>MDN History API — pushState, replaceState, and popstate reference</li>
          <li>Next.js App Router — file-system based routing with React Server Components</li>
          <li>View Transitions API — browser-native page transition animations</li>
          <li>Remix documentation — data-driven routing with loaders and actions</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
