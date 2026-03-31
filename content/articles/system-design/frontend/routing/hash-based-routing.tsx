"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "hash-based-routing",
  title: "Hash-Based Routing",
  description:
    "Understanding hash-based routing using the URL fragment identifier, hashchange events, and why it was the original SPA routing mechanism before the History API.",
  category: "frontend",
  subcategory: "routing",
  slug: "hash-based-routing",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["routing", "hash", "fragment", "SPA", "hashchange"],
  relatedTopics: ["client-side-routing", "history-api", "deep-linking"],
};

export default function HashBasedRoutingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Hash-based routing uses the URL fragment identifier (the portion after the <code>#</code>{" "}
          symbol) to represent application state and navigation. When the hash portion of a URL
          changes, the browser fires a <code>hashchange</code> event but does not send a new HTTP
          request to the server. This property made hash URLs the original mechanism for building
          Single Page Applications before the History API became widely available.
        </p>
        <p className="mb-4">
          A hash-routed URL looks like <code>https://app.com/#/users/42/settings</code>. The
          server only sees <code>https://app.com/</code> — everything after <code>#</code> is
          purely client-side. The JavaScript router reads <code>window.location.hash</code>,
          strips the <code>#</code> prefix, and matches the remaining path against a route table
          exactly like a History API router would match <code>window.location.pathname</code>.
        </p>
        <p>
          While modern applications prefer the History API for cleaner URLs, hash-based routing
          remains relevant in specific contexts: static file hosting where server configuration
          isn&apos;t possible, embedded widgets that can&apos;t control the host page&apos;s routing,
          Electron apps, and legacy browser support. Gmail still uses hash-based routing to this
          day.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/hash-based-routing-diagram-1.svg"
        alt="Hash-based routing URL anatomy showing server-visible and client-only portions"
        caption="Figure 1: Hash URL anatomy — the server only receives the portion before #, making hash changes invisible to the network layer."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Fragment Identifier</h3>
        <p className="mb-4">
          The URL fragment (hash) was originally designed for in-page anchor navigation — scrolling
          to an element whose <code>id</code> matches the fragment. SPA routers repurpose this
          mechanism: instead of scrolling, the JavaScript application interprets the hash as a
          virtual path and renders the corresponding view. This &quot;hijacking&quot; of the fragment
          is both the key insight and the primary limitation of hash-based routing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The hashchange Event</h3>
        <p className="mb-4">
          The <code>hashchange</code> event fires on the <code>window</code> object whenever{" "}
          <code>location.hash</code> changes. The event object provides <code>oldURL</code> and{" "}
          <code>newURL</code> properties containing the full URLs before and after the change.
          A minimal hash router listens for this event, extracts the path from the new hash,
          matches it against route definitions, and renders the matched component.
        </p>
        <p className="mb-4">
          Hash changes also integrate with the browser history stack. Clicking a link to{" "}
          <code>#/page-b</code> pushes a new entry onto the history stack. The back button pops
          this entry and fires <code>hashchange</code> with the previous hash. This gives hash
          routing the same back/forward navigation semantics as full page navigation — for free,
          without any calls to the History API.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hash Routing Patterns</h3>
        <p className="mb-4">
          Two conventions exist. The <strong>hashbang</strong> pattern (<code>#!</code>) was
          popularized by Google&apos;s AJAX crawling scheme (now deprecated): URLs like{" "}
          <code>app.com/#!/users/42</code> signaled to Googlebot that an AJAX snapshot was
          available at <code>app.com/?_escaped_fragment_=/users/42</code>. The{" "}
          <strong>hash-slash</strong> pattern (<code>#/</code>) is more common today:{" "}
          <code>app.com/#/users/42</code>. Both are conventions, not standards — the router simply
          strips the prefix and interprets the remainder as a path.
        </p>
        <p>
          Some routers support hash-based query parameters using custom delimiters:{" "}
          <code>#/search?q=hello&amp;page=2</code>. Since everything after <code>#</code> is
          opaque to the browser (it doesn&apos;t parse query parameters within fragments), the
          router must implement its own parsing — splitting on <code>?</code>, then parsing
          key-value pairs from the resulting string.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/hash-based-routing-diagram-2.svg"
        alt="Hash-based routing event flow from link click to component render"
        caption="Figure 2: Hash routing event flow — the browser handles history stack management natively; the router only needs to listen for hashchange and render."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Minimal Hash Router Implementation</h3>
        <p className="mb-4">
          A hash router requires surprisingly little code. The core loop is: (1) on{" "}
          <code>hashchange</code>, read <code>location.hash</code>; (2) strip the <code>#/</code>{" "}
          prefix; (3) match the path against registered routes; (4) call the matched route&apos;s
          handler with extracted parameters; (5) render the returned component into a container
          element. Programmatic navigation is as simple as setting{" "}
          <code>location.hash = &quot;#/new-path&quot;</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server Configuration</h3>
        <p className="mb-4">
          The primary advantage of hash routing is zero server configuration. Since the server
          never sees the hash, every URL resolves to the same document. A static{" "}
          <code>index.html</code> on any file host (S3, GitHub Pages, a CDN) works out of the box.
          With History API routing, the server must be configured to return <code>index.html</code>{" "}
          for all paths (a &quot;catch-all&quot; or &quot;fallback&quot; rule). This configuration
          isn&apos;t always possible — some hosting environments (GitHub Pages, shared hosting,
          embedded iframes) don&apos;t support server-side rewrites.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Migration from Hash to History Routing</h3>
        <p>
          When migrating from hash to History API routing, the key challenge is redirecting old
          hash URLs to their clean equivalents. A common pattern: on application boot, check if{" "}
          <code>location.hash</code> contains a route path. If it does, use{" "}
          <code>history.replaceState</code> to rewrite the URL to the clean pathname equivalent
          and proceed with History API routing. This handles bookmarked hash URLs and shared links
          gracefully. Some routers (React Router) support this transition by providing both{" "}
          <code>BrowserRouter</code> (History API) and <code>HashRouter</code> implementations
          with identical routing APIs.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/hash-based-routing-diagram-3.svg"
        alt="Comparison of hash-based vs History API routing across dimensions"
        caption="Figure 3: Hash routing vs History API routing — trade-offs across URL aesthetics, server requirements, SEO, and in-page anchor support."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>

        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left font-semibold">Hash-Based Routing</th>
                <th className="px-4 py-3 text-left font-semibold">History API Routing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">URL format</td><td className="px-4 py-3">app.com/#/path</td><td className="px-4 py-3">app.com/path</td></tr>
              <tr><td className="px-4 py-3 font-medium">Server config</td><td className="px-4 py-3">None required</td><td className="px-4 py-3">Catch-all fallback required</td></tr>
              <tr><td className="px-4 py-3 font-medium">SEO</td><td className="px-4 py-3">Poor — crawlers ignore fragments</td><td className="px-4 py-3">Good — crawlable with SSR</td></tr>
              <tr><td className="px-4 py-3 font-medium">Anchor links</td><td className="px-4 py-3">Broken — hash is used for routing</td><td className="px-4 py-3">Work natively</td></tr>
              <tr><td className="px-4 py-3 font-medium">SSR support</td><td className="px-4 py-3">Not possible (server can&apos;t read hash)</td><td className="px-4 py-3">Full support</td></tr>
              <tr><td className="px-4 py-3 font-medium">Browser support</td><td className="px-4 py-3">All browsers including IE8+</td><td className="px-4 py-3">IE10+ (modern browsers)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Analytics</td><td className="px-4 py-3">Requires manual tracking (hash not sent to server)</td><td className="px-4 py-3">Standard page view tracking works</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use hash routing only when server-side URL rewriting isn&apos;t available (static hosting, embedded widgets, Electron apps)</li>
          <li>Adopt a consistent convention — <code>#/path</code> is cleaner and more standard than <code>#!/path</code></li>
          <li>Implement your own query parameter parsing within the hash since the browser won&apos;t do it</li>
          <li>Track hash changes in analytics manually — hash fragments are not included in HTTP requests or standard page view events</li>
          <li>Plan a migration path to History API routing if SEO or SSR becomes important later</li>
          <li>Handle the initial hash on page load — not just hashchange events — to support direct URL access and bookmarks</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Broken in-page anchors:</strong> Since the hash is used for routing, <code>{"<a href=\"#section\">"}</code> triggers a route change instead of scrolling. Workaround: use <code>scrollIntoView()</code> programmatically</li>
          <li><strong>Social sharing issues:</strong> Many social platforms strip or ignore hash fragments when scraping metadata, making shared links lose their route context</li>
          <li><strong>Server-side rendering impossible:</strong> The server cannot read the hash, so it can&apos;t pre-render the correct content — every request returns the same shell HTML</li>
          <li><strong>Double hash confusion:</strong> URLs like <code>#/page#section</code> are technically one fragment. Trying to combine routing hashes with anchor hashes requires custom parsing</li>
          <li><strong>Missing initial route:</strong> Forgetting to handle the hash present at page load (not just changes) means direct URL access renders the default route instead of the linked one</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Gmail</h3>
          <p>
            Gmail has used hash-based routing since its launch in 2004. URLs like{" "}
            <code>mail.google.com/mail/#inbox</code> and <code>#sent</code> route between views.
            This was chosen for maximum compatibility across browsers and because Gmail&apos;s
            architecture predates the History API. The approach works because Gmail doesn&apos;t
            need SEO (it&apos;s behind authentication) and already controls the server configuration.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">GitHub Pages SPAs</h3>
          <p>
            Developers hosting SPAs on GitHub Pages commonly use hash routing because GitHub Pages
            doesn&apos;t support server-side URL rewrites. Frameworks like Create React App
            recommend <code>HashRouter</code> for GitHub Pages deployments. Some projects use the
            404.html redirect hack (redirecting all 404s to index.html with a script that converts
            the path to a hash), but hash routing is the more reliable approach.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why doesn&apos;t changing the hash trigger a page reload?</p>
            <p className="mt-2 text-sm">
              A: The URL fragment was designed for in-page navigation (scrolling to anchors). By
              specification, changing the fragment doesn&apos;t constitute a new resource request —
              the browser treats it as navigation within the same document. It fires the hashchange
              event instead of making an HTTP request. This behavior is what makes hash-based
              routing possible.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose hash routing over History API routing?</p>
            <p className="mt-2 text-sm">
              A: Choose hash routing when you can&apos;t configure the server (static hosting like
              GitHub Pages, S3 without CloudFront rewrites), when building embedded widgets that
              can&apos;t interfere with the host page&apos;s routing, in Electron apps where there&apos;s
              no server, or when targeting very old browsers. In all other cases, prefer the History
              API for cleaner URLs and SSR/SEO support.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you implement SSR with hash-based routing?</p>
            <p className="mt-2 text-sm">
              A: No. The hash fragment is never sent to the server in the HTTP request. The server
              sees only the base URL and cannot determine which route the client intended. Server-side
              rendering requires the route to be part of the pathname (History API routing) so the
              server can match it and render the correct content.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle in-page anchor links when the hash is used for routing?</p>
            <p className="mt-2 text-sm">
              A: Since the hash is consumed by the router, standard anchor links like{" "}
              <code>{"<a href=\"#section\">"}</code> trigger route changes instead of scrolling. The
              workaround is to intercept these clicks and call <code>element.scrollIntoView()</code>{" "}
              programmatically. Some routers support a secondary hash syntax (e.g.,{" "}
              <code>#/page#section</code>) where the router strips its portion and scrolls to the
              remainder, but this requires custom parsing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track analytics with hash-based routing?</p>
            <p className="mt-2 text-sm">
              A: Hash fragments are not sent to the server in HTTP requests, so server-side analytics
              (access logs, Google Analytics default page views) don&apos;t capture route changes.
              You must manually fire analytics events on each hashchange. Listen for the hashchange
              event and call your analytics provider&apos;s page view function with the new hash path.
              Google Analytics supports this via <code>gtag(&apos;config&apos;, id, {"{ page_path: location.hash }"})</code>.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you migrate from hash routing to History API routing without breaking existing links?</p>
            <p className="mt-2 text-sm">
              A: On application boot, check if <code>location.hash</code> contains a route path
              (e.g., <code>#/users/42</code>). If it does, extract the path, use{" "}
              <code>history.replaceState</code> to rewrite the URL to the clean pathname equivalent
              (<code>/users/42</code>), and proceed with History API routing. This handles bookmarked
              hash URLs and shared links. Run this migration check before the router initializes so
              it sees the clean URL. For external links you can&apos;t control, set up server-side
              redirects from hash patterns to clean URLs.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>MDN — Window: hashchange event</li>
          <li>MDN — Location.hash reference</li>
          <li>React Router — HashRouter documentation</li>
          <li>RFC 3986 — URI fragment identifier specification</li>
          <li>Google AJAX Crawling (deprecated) — history of hashbang URLs</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
