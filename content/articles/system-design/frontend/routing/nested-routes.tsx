"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "nested-routes",
  title: "Nested Routes",
  description:
    "Understanding nested routing patterns where parent layouts persist while child routes swap, including outlet patterns, layout composition, and parallel route segments.",
  category: "frontend",
  subcategory: "routing",
  slug: "nested-routes",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["nested routes", "layouts", "outlet", "route hierarchy", "composition"],
  relatedTopics: ["client-side-routing", "route-based-code-splitting", "dynamic-routes"],
};

export default function NestedRoutesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Nested routes are a routing pattern where routes are organized hierarchically, with
          parent routes rendering shared layout UI and child routes rendering content into a
          designated outlet within that layout. When navigating between sibling child routes, only
          the child content swaps — the parent layout (header, sidebar, navigation) remains mounted
          and preserves its state.
        </p>
        <p className="mb-4">
          This pattern mirrors the visual hierarchy of most applications. A dashboard has a
          persistent sidebar and header (parent layout) with different content panels (child
          routes) for analytics, settings, and users. An e-commerce site has a persistent product
          category navigation (parent) with different product listings or detail pages (children).
          Without nested routes, each page transition would remount the entire UI tree, losing
          scroll positions, animation states, and any in-progress user interactions in the layout.
        </p>
        <p>
          React Router introduced the <code>{"<Outlet>"}</code> component for rendering child
          routes within a parent. Next.js App Router uses file-system conventions with{" "}
          <code>layout.tsx</code> files that automatically wrap child segments. Both approaches
          achieve the same result: composable, hierarchical UI that maps directly to URL structure.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/nested-routes-diagram-1.svg"
        alt="Nested route hierarchy showing parent layout with outlet rendering child routes"
        caption="Figure 1: Nested route hierarchy — the parent layout persists while child routes render into the Outlet area based on the URL."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Outlet Pattern</h3>
        <p className="mb-4">
          The outlet is the designated location within a parent route&apos;s component where child
          route content renders. In React Router, this is the <code>{"<Outlet />"}</code>{" "}
          component. When the URL matches a child route, React Router renders the child component
          at the Outlet position. If no child matches, the Outlet renders nothing (or a default
          index route if defined).
        </p>
        <p className="mb-4">
          Outlets can pass context data to child routes via the <code>context</code> prop on{" "}
          <code>{"<Outlet context={value} />"}</code>, accessible in children via{" "}
          <code>useOutletContext()</code>. This avoids prop drilling through the route hierarchy
          and lets parent layouts share data (user info, theme, permissions) with arbitrary
          child routes without global state.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layout Routes</h3>
        <p className="mb-4">
          A layout route is a parent route that renders UI but doesn&apos;t add a segment to the
          URL. In React Router, this is a route with an <code>element</code> but no{" "}
          <code>path</code> (or a pathless wrapper route). In Next.js, every directory with a{" "}
          <code>layout.tsx</code> creates a layout route. Layout routes are essential for sharing
          UI chrome (headers, sidebars, footers) across groups of pages without affecting the URL
          structure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Index Routes</h3>
        <p className="mb-4">
          An index route is the default child that renders when the parent URL is matched exactly.
          For a parent route at <code>/dashboard</code>, the index route renders at{" "}
          <code>/dashboard</code> (not <code>/dashboard/something</code>). In React Router, this
          is defined with the <code>index</code> property. In Next.js, it&apos;s the{" "}
          <code>page.tsx</code> at the layout&apos;s directory level. Without an index route, the
          Outlet renders nothing when the parent URL is matched exactly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Parallel Routes (Next.js)</h3>
        <p>
          Next.js App Router extends nested routing with parallel routes — multiple child segments
          that render simultaneously in the same layout. Defined with the <code>@slot</code>{" "}
          convention (e.g., <code>@analytics</code> and <code>@notifications</code> directories),
          parallel routes enable dashboards where multiple panels load independently, have their
          own loading states, and can even have their own error boundaries. Each slot can be
          independently navigated, enabling complex UIs like modals that preserve the background
          route.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/nested-routes-diagram-2.svg"
        alt="Layout composition showing multiple nesting levels with persistent state"
        caption="Figure 2: Multi-level nesting — each layout persists its state while only the deepest matching child re-renders on navigation."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Route Matching with Nesting</h3>
        <p className="mb-4">
          When matching a nested route, the router resolves the entire ancestor chain. For a URL
          like <code>/dashboard/settings/profile</code>, it matches: (1) the root layout, (2) the{" "}
          <code>/dashboard</code> layout, (3) the <code>/dashboard/settings</code> layout, and
          (4) the <code>/dashboard/settings/profile</code> page. Each level renders its layout
          component with an Outlet for the next level. The router builds this component tree
          bottom-up and renders it as a nested composition.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Loading per Segment</h3>
        <p className="mb-4">
          Each route in the hierarchy can define its own data loader. React Router runs all matched
          route loaders in parallel when navigating. Next.js App Router runs Server Component data
          fetching for each layout and page segment in parallel. This means the dashboard layout
          can fetch user data while the settings page fetches preferences simultaneously — no
          waterfall. Only the loaders for changed segments re-execute on navigation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Boundaries per Segment</h3>
        <p>
          Nested routes enable granular error isolation. Each layout level can have its own error
          boundary (React Router&apos;s <code>errorElement</code> or Next.js&apos;s{" "}
          <code>error.tsx</code>). If the settings page throws, only the settings content area
          shows an error — the dashboard layout, sidebar, and header remain functional. The user
          can navigate away without losing the outer layout context. Without nesting, an error in
          any component could crash the entire page.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/nested-routes-diagram-3.svg"
        alt="Error boundary isolation in nested routes showing contained failure"
        caption="Figure 3: Error isolation — a failing child route only affects its segment; parent layouts and sibling routes remain interactive."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left font-semibold">Nested Routes</th>
                <th className="px-4 py-3 text-left font-semibold">Flat Routes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Layout persistence</td><td className="px-4 py-3">Parent layouts persist across child navigations</td><td className="px-4 py-3">Entire page remounts on every route change</td></tr>
              <tr><td className="px-4 py-3 font-medium">State preservation</td><td className="px-4 py-3">Sidebar scroll, form inputs, animation state preserved</td><td className="px-4 py-3">All UI state lost on navigation</td></tr>
              <tr><td className="px-4 py-3 font-medium">Data loading</td><td className="px-4 py-3">Parallel loaders per segment</td><td className="px-4 py-3">Single loader, must fetch all data</td></tr>
              <tr><td className="px-4 py-3 font-medium">Error isolation</td><td className="px-4 py-3">Per-segment error boundaries</td><td className="px-4 py-3">Page-level only</td></tr>
              <tr><td className="px-4 py-3 font-medium">Complexity</td><td className="px-4 py-3">Higher — more files, more routing concepts</td><td className="px-4 py-3">Simpler — one component per route</td></tr>
              <tr><td className="px-4 py-3 font-medium">Performance</td><td className="px-4 py-3">Better — less DOM thrashing, smaller re-renders</td><td className="px-4 py-3">Worse — full tree unmount/remount</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Mirror the visual hierarchy in your route structure — if UI nests, routes should nest</li>
          <li>Use layout routes for shared chrome (headers, sidebars) that should persist across child navigations</li>
          <li>Define index routes for every parent route to handle the default/empty child state</li>
          <li>Place Suspense and error boundaries at each layout level for granular loading/error states</li>
          <li>Keep layouts lean — they persist across navigations, so heavyweight layouts slow everything</li>
          <li>Use outlet context for parent-to-child data sharing instead of global state when the data is layout-scoped</li>
          <li>Avoid deep nesting beyond 3-4 levels — the complexity becomes hard to reason about</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Missing Outlet:</strong> Defining child routes but forgetting to render <code>{"<Outlet />"}</code> in the parent — children simply don&apos;t appear</li>
          <li><strong>Key-based remount:</strong> Using the route path as a React key on the outlet forces child components to unmount/remount on every navigation, defeating the purpose of nesting</li>
          <li><strong>Stale parent data:</strong> Parent loaders may cache data that becomes stale as children modify it. Use revalidation or shared state to keep parent data fresh</li>
          <li><strong>Over-nesting:</strong> Creating layout routes for every URL segment when the UI doesn&apos;t actually nest leads to unnecessary component wrappers and complexity</li>
          <li><strong>Conflicting layouts:</strong> Two sibling routes needing different parent layouts requires restructuring the route hierarchy or using pathless layout routes</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Dashboard Applications</h3>
          <p>
            Every SaaS dashboard uses nested routes. The top-level layout provides the sidebar
            navigation and top bar. A second level provides section-specific sub-navigation (e.g.,
            Settings → General, Security, Billing). The deepest level renders the actual content.
            Navigating between General and Security settings only swaps the content area — the
            sidebar, header, and settings sub-navigation persist.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Next.js App Router</h3>
          <p>
            Next.js uses file-system based nested routing. A <code>layout.tsx</code> at{" "}
            <code>app/dashboard/layout.tsx</code> wraps all pages under <code>/dashboard/*</code>.
            This layout persists across navigations to <code>/dashboard/analytics</code>,{" "}
            <code>/dashboard/users</code>, etc. Parallel routes (<code>@modal</code>,{" "}
            <code>@sidebar</code>) enable intercepting routes where a modal overlays the current
            page while the background route is preserved in the URL.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use nested routes instead of rendering layouts manually in each page?</p>
            <p className="mt-2 text-sm">
              A: Nested routes preserve parent layout state across child navigations. Manually
              rendering a layout in each page component means the layout unmounts and remounts on
              every route change, losing scroll position, animation state, and any in-progress user
              interactions. Nested routes also enable per-segment data loading, error boundaries,
              and loading states — each level of the hierarchy is independently manageable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do parallel routes differ from nested routes?</p>
            <p className="mt-2 text-sm">
              A: Nested routes render sequentially — parent wraps child wraps grandchild. Parallel
              routes render simultaneously — multiple child slots render side-by-side in the same
              parent layout, each with independent loading/error states. Parallel routes are useful
              for dashboard panels, modal overlays, and split-pane UIs where multiple independent
              content areas coexist.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is an index route and when do you need one?</p>
            <p className="mt-2 text-sm">
              A: An index route is the default child that renders when the parent URL is matched
              exactly, with no additional child segment. For a parent at <code>/dashboard</code>,
              the index route renders at <code>/dashboard</code> itself. Without it, the Outlet
              renders nothing at the parent URL — users see an empty content area. Always define
              index routes for parent routes that users can navigate to directly, showing a
              meaningful default view (overview, summary, or welcome content).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do nested routes improve error handling?</p>
            <p className="mt-2 text-sm">
              A: Each nesting level can define its own error boundary. If a child route throws an
              error, only that segment shows the error UI — the parent layout, sidebar, and
              navigation remain functional. The user can navigate away without losing the outer
              layout context. Without nesting, an error in any route component crashes the entire
              page. In React Router, each route can have its own <code>errorElement</code>. In
              Next.js, each directory can have an <code>error.tsx</code> file.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does data loading work with nested routes?</p>
            <p className="mt-2 text-sm">
              A: Each route in the hierarchy can define its own data loader. When navigating, the
              router runs all matched loaders in parallel — the dashboard layout fetches user data
              while the settings page fetches preferences simultaneously, avoiding a waterfall.
              On subsequent navigations between sibling routes, only the loaders for changed segments
              re-execute; parent loaders are skipped since their data is already loaded. This makes
              nested routes more efficient than flat routes where a single loader must fetch all data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you share data from a parent layout to child routes without global state?</p>
            <p className="mt-2 text-sm">
              A: React Router&apos;s Outlet component accepts a <code>context</code> prop:{" "}
              <code>{"<Outlet context={userData} />"}</code>. Child routes access this via the{" "}
              <code>useOutletContext()</code> hook. This avoids prop drilling and global state for
              data scoped to a layout boundary — the user object fetched in the dashboard layout
              is available to all dashboard child routes without Redux or Context API. In Next.js,
              Server Components can pass data as props through the layout/page hierarchy.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>React Router — Nested routes and Outlet documentation</li>
          <li>Next.js — Layouts and nested routing in App Router</li>
          <li>Next.js — Parallel routes and intercepting routes</li>
          <li>Remix — Route module boundaries and nested data loading</li>
          <li>Ryan Florence — &quot;Remixing React Router&quot; (nested routing philosophy)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
