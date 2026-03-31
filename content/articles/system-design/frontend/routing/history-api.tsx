"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "history-api",
  title: "History API",
  description:
    "Comprehensive guide to the browser History API — pushState, replaceState, popstate events, and how modern routers leverage the session history stack for clean URL navigation.",
  category: "frontend",
  subcategory: "routing",
  slug: "history-api",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["History API", "pushState", "replaceState", "popstate", "navigation"],
  relatedTopics: ["client-side-routing", "hash-based-routing", "deep-linking"],
};

export default function HistoryApiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          The History API is a browser interface that allows JavaScript to manipulate the session
          history stack — adding entries, replacing the current entry, and reading state associated
          with entries — all without triggering a page reload. Introduced in HTML5, the key methods
          are <code>history.pushState()</code> and <code>history.replaceState()</code>, which
          update the URL in the address bar and the history stack without making a server request.
        </p>
        <p className="mb-4">
          Before the History API, client-side routing was limited to hash fragments. The History
          API solved this by enabling &quot;clean&quot; URLs — <code>/users/42</code> instead of{" "}
          <code>/#/users/42</code> — while maintaining full client-side control over navigation.
          Every modern client-side router (React Router&apos;s BrowserRouter, Vue Router in history
          mode, Angular Router) is built on top of this API.
        </p>
        <p>
          The History API also introduced the concept of associated state objects. Each history
          entry can carry arbitrary serializable data via the <code>state</code> parameter of{" "}
          <code>pushState</code>. This state persists across back/forward navigation and page
          reloads, making it useful for preserving scroll positions, form data, or UI state without
          encoding everything in the URL.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/history-api-diagram-1.svg"
        alt="History API session history stack showing pushState and replaceState operations"
        caption="Figure 1: Session history stack — pushState adds a new entry, replaceState modifies the current entry, and back/forward navigates between entries."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">pushState and replaceState</h3>
        <p className="mb-4">
          <code>history.pushState(state, title, url)</code> adds a new entry to the session history
          stack. The URL in the address bar changes immediately, but no HTTP request is made. The{" "}
          <code>state</code> object (up to ~640KB when serialized) is associated with the new entry
          and can be retrieved later via <code>history.state</code> or the <code>popstate</code>{" "}
          event. The <code>title</code> parameter is currently ignored by all browsers but should
          be passed as an empty string for forward compatibility.
        </p>
        <p className="mb-4">
          <code>history.replaceState(state, title, url)</code> modifies the current history entry
          instead of creating a new one. The URL changes but the history stack length stays the
          same. Use cases include: correcting a URL after a redirect, updating query parameters
          without creating a history entry (e.g., search-as-you-type), or storing updated state on
          the current entry (like scroll position before navigating away).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The popstate Event</h3>
        <p className="mb-4">
          The <code>popstate</code> event fires when the user navigates the session history via
          back/forward buttons or programmatic calls to <code>history.back()</code>,{" "}
          <code>history.forward()</code>, or <code>history.go()</code>. Critically,{" "}
          <code>popstate</code> does <strong>not</strong> fire when <code>pushState</code> or{" "}
          <code>replaceState</code> is called — only when traversing existing entries. This
          asymmetry is important: routers must handle both programmatic navigation (pushState) and
          user-initiated traversal (popstate) as separate code paths.
        </p>
        <p className="mb-4">
          The event object&apos;s <code>state</code> property contains the state object associated
          with the history entry being navigated to. If the entry was created by{" "}
          <code>pushState</code>, this is the state that was passed. If the entry was created by a
          regular page load (no pushState), <code>event.state</code> is <code>null</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Navigation API (Successor)</h3>
        <p>
          The newer Navigation API (<code>navigation.navigate()</code>) is designed to replace the
          History API for client-side routing. It provides a single event (<code>navigate</code>)
          that fires for all navigation types (link clicks, form submissions, back/forward,
          pushState), eliminating the fragmented event model. It also supports navigation
          interception, transition management, and abort signals natively. As of 2026, it&apos;s
          supported in Chromium browsers and under development in Firefox and Safari. Routers are
          beginning to adopt it as a progressive enhancement.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/history-api-diagram-2.svg"
        alt="Event flow comparison between pushState (no event) and back button (popstate fires)"
        caption="Figure 2: pushState does not fire popstate — routers must handle programmatic navigation and history traversal as separate code paths."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Constraints</h3>
        <p className="mb-4">
          <code>pushState</code> and <code>replaceState</code> can only change the URL to one with
          the same origin (protocol + host + port). Attempting to push a cross-origin URL throws a{" "}
          <code>SecurityError</code>. Within the same origin, you can change the path, query
          string, and fragment freely. This means client-side routing is limited to the current
          domain — you cannot use pushState to navigate to a different site.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server-Side Requirements</h3>
        <p className="mb-4">
          When a user navigates to <code>/users/42</code> via pushState, the URL bar shows this
          path but no request was made. However, if they reload the page or share the URL, the
          browser sends a GET request for <code>/users/42</code>. The server must return the SPA
          shell HTML for this path — otherwise, it returns a 404. This requires a catch-all server
          rule: return <code>index.html</code> for any path that doesn&apos;t match a static asset.
          Nginx uses <code>try_files $uri $uri/ /index.html</code>; Express uses a wildcard route;
          Vercel and Netlify support <code>rewrites</code> in their config files.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Serialization</h3>
        <p>
          The state object passed to <code>pushState</code> is serialized using the structured
          clone algorithm (same as <code>postMessage</code>). This supports objects, arrays, dates,
          RegExp, Map, Set, ArrayBuffer, and more — but not functions, DOM nodes, or class
          instances. The serialized size is limited (browsers impose limits around 2-16MB depending
          on the engine, but practically, keep state under 640KB). For large state, store it in{" "}
          <code>sessionStorage</code> keyed by a unique history entry ID and only put the ID in
          the pushState state object.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/history-api-diagram-3.svg"
        alt="Server catch-all configuration for History API routing"
        caption="Figure 3: Server configuration for History API routing — all non-asset paths return the same index.html, letting the client-side router handle the path."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-left font-semibold">History API</th>
                <th className="px-4 py-3 text-left font-semibold">Navigation API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Event model</td><td className="px-4 py-3">Fragmented (popstate only fires on traversal)</td><td className="px-4 py-3">Unified (navigate fires for all navigation types)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Interception</td><td className="px-4 py-3">Manual (listen for clicks, prevent default)</td><td className="px-4 py-3">Built-in (intercept() in navigate handler)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Abort support</td><td className="px-4 py-3">None</td><td className="px-4 py-3">AbortSignal for cancelled navigations</td></tr>
              <tr><td className="px-4 py-3 font-medium">Transition tracking</td><td className="px-4 py-3">Manual state management</td><td className="px-4 py-3">navigation.transition with finished promise</td></tr>
              <tr><td className="px-4 py-3 font-medium">Browser support</td><td className="px-4 py-3">Universal</td><td className="px-4 py-3">Chromium (2024+), partial elsewhere</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use <code>pushState</code> for navigation that should create a history entry (page transitions); use <code>replaceState</code> for state updates that shouldn&apos;t (filter changes, scroll position saves)</li>
          <li>Always configure the server with a catch-all fallback to index.html for all non-asset routes</li>
          <li>Keep pushState state objects small — store large data in sessionStorage keyed by a history entry ID</li>
          <li>Listen for <code>popstate</code> to handle back/forward navigation, and update your router state accordingly</li>
          <li>Update <code>document.title</code> after every pushState call — the History API does not do this automatically</li>
          <li>Use <code>replaceState</code> to save scroll position on the current entry before navigating away, then restore it on popstate</li>
          <li>Consider adopting the Navigation API as a progressive enhancement for modern browsers</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>404 on refresh:</strong> The most common issue — server doesn&apos;t have a catch-all rule, so direct access to <code>/users/42</code> returns a server 404</li>
          <li><strong>Expecting popstate on pushState:</strong> pushState does not fire popstate. Code that depends on popstate for all URL changes will miss programmatic navigations</li>
          <li><strong>Cross-origin pushState:</strong> Attempting to pushState to a different origin throws a SecurityError that can crash unguarded router code</li>
          <li><strong>State size limits:</strong> Pushing large objects (images, raw data) into pushState silently fails or throws in some browsers</li>
          <li><strong>Title parameter ignored:</strong> Passing a meaningful title to pushState has no effect — you must set <code>document.title</code> separately</li>
          <li><strong>Initial state is null:</strong> On the first page load, <code>history.state</code> is <code>null</code> even if the URL was created by pushState in a previous session (state doesn&apos;t persist across browser restarts in all browsers)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">React Router BrowserRouter</h3>
          <p>
            React Router&apos;s <code>BrowserRouter</code> wraps the History API in a React context.
            <code>{"<Link to=\"/users/42\">"}</code> calls <code>history.pushState()</code> and
            updates the router context, triggering a re-render of matched route components. The
            <code>useNavigate()</code> hook provides programmatic access. React Router v6+ adds
            data loaders that run before the pushState commit, enabling loading states during
            transition.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Next.js Soft Navigation</h3>
          <p>
            Next.js App Router uses <code>pushState</code> for soft navigations between routes.
            When a user clicks a <code>{"<Link>"}</code>, Next.js fetches the React Server Component
            payload for the target route, applies it to the component tree, and pushes the new URL.
            On back navigation, the popstate handler retrieves the cached RSC payload from an
            in-memory cache, enabling instant back/forward transitions without a server request.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between pushState and replaceState?</p>
            <p className="mt-2 text-sm">
              A: pushState adds a new entry to the history stack — the user can navigate back to the
              previous URL. replaceState modifies the current entry — the previous URL is gone from
              the stack. Use pushState for actual page navigations and replaceState for URL updates
              that shouldn&apos;t create a back-button step (query parameter updates, corrective
              redirects, state persistence).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does the page 404 when I refresh a client-side routed SPA?</p>
            <p className="mt-2 text-sm">
              A: On refresh, the browser sends a real HTTP request for the current URL path (e.g.,
              GET /users/42). If the server only serves static files and doesn&apos;t have a catch-all
              rule, it looks for a file at /users/42 and returns 404. Fix: configure the server to
              return index.html for all non-asset routes, letting the client-side router handle the
              path.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Does pushState fire the popstate event?</p>
            <p className="mt-2 text-sm">
              A: No. popstate only fires when the user (or code) traverses the history stack via
              back/forward buttons, history.back(), history.forward(), or history.go(). pushState
              and replaceState change the URL silently. This is why client-side routers maintain
              their own state management layer on top of the History API rather than relying solely
              on popstate.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What data can you store in the history state object?</p>
            <p className="mt-2 text-sm">
              A: The state object is serialized using the structured clone algorithm, so it supports
              plain objects, arrays, Date, RegExp, Map, Set, ArrayBuffer, and typed arrays. It does
              not support functions, DOM nodes, or class instances. There is a practical size limit
              of around 640KB (varies by browser). For large state, store data in sessionStorage
              keyed by a unique history entry ID and put only the ID in pushState. The state persists
              across back/forward navigation and is available via history.state or the popstate
              event&apos;s state property.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does the Navigation API improve on the History API?</p>
            <p className="mt-2 text-sm">
              A: The Navigation API provides a single <code>navigate</code> event that fires for all
              navigation types — link clicks, form submissions, back/forward, and programmatic
              navigation — eliminating the fragmented event model where pushState doesn&apos;t fire
              popstate. It supports navigation interception with <code>intercept()</code>, built-in
              abort signals for cancelled navigations, and transition tracking with{" "}
              <code>navigation.transition.finished</code>. This removes the need for routers to
              manually intercept clicks, manage abort controllers, and track navigation state.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent the user from leaving a page with unsaved changes using the History API?</p>
            <p className="mt-2 text-sm">
              A: For browser-level navigation (closing tab, typing a new URL), use the{" "}
              <code>beforeunload</code> event to show a browser confirmation dialog. For client-side
              navigation (link clicks, back button), intercept the navigation in the router — React
              Router provides <code>useBlocker()</code> or <code>unstable_usePrompt()</code> to
              conditionally block navigation and show a custom confirmation modal. The Navigation
              API supports this natively via <code>intercept()</code> in the navigate handler.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>MDN — History API (pushState, replaceState, popstate)</li>
          <li>HTML Living Standard — Session history and navigation</li>
          <li>Navigation API specification — successor to History API</li>
          <li>React Router — BrowserRouter internals</li>
          <li>Next.js — Client-side navigation and soft navigation</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
