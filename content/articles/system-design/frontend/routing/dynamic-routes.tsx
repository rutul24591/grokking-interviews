"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dynamic-routes",
  title: "Dynamic Routes",
  description:
    "Understanding dynamic route segments, parameterized paths, catch-all routes, and how frameworks resolve variable URL patterns to specific components and data.",
  category: "frontend",
  subcategory: "routing",
  slug: "dynamic-routes",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["dynamic routes", "URL parameters", "catch-all", "parameterized", "routing"],
  relatedTopics: ["nested-routes", "url-parameter-handling", "deep-linking"],
};

export default function DynamicRoutesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Dynamic routes are URL patterns that contain variable segments — placeholders that match
          any value in that position of the URL path. Instead of defining a static route for every
          possible user ID, product slug, or blog post, you define a pattern like{" "}
          <code>/users/:id</code> that matches <code>/users/42</code>, <code>/users/jane</code>,
          and any other value. The variable portion is extracted as a route parameter and passed to
          the component for data fetching and rendering.
        </p>
        <p className="mb-4">
          Dynamic routes are fundamental to data-driven applications. An e-commerce site with
          10,000 products doesn&apos;t define 10,000 static routes — it defines one dynamic route{" "}
          <code>/products/:slug</code> that resolves to a ProductDetail component, which reads the{" "}
          <code>slug</code> parameter and fetches the corresponding product data. This pattern
          maps cleanly to REST API conventions where URL paths identify resources.
        </p>
        <p>
          Different frameworks use different syntax: React Router uses <code>:param</code>
          notation, Next.js uses <code>[param]</code> directory names, and Angular uses{" "}
          <code>:param</code>. The semantics are identical — a variable URL segment extracted as a
          named parameter.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/dynamic-routes-diagram-1.svg"
        alt="Dynamic route pattern matching showing parameter extraction from URL"
        caption="Figure 1: Dynamic route matching — the :id segment matches any value and extracts it as a named parameter available to the component."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Single Dynamic Segments</h3>
        <p className="mb-4">
          The most common pattern. A single segment of the URL is variable:{" "}
          <code>/users/:userId</code> matches <code>/users/123</code> and extracts{" "}
          <code>{"{ userId: \"123\" }"}</code>. Multiple dynamic segments can appear in the same
          route: <code>/orgs/:orgId/repos/:repoId</code> extracts both <code>orgId</code> and{" "}
          <code>repoId</code>. Parameters are always strings — numeric IDs must be parsed by the
          consuming component.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Catch-All Routes</h3>
        <p className="mb-4">
          Catch-all (splat/wildcard) routes match any number of path segments. React Router uses{" "}
          <code>*</code> (e.g., <code>/files/*</code> matches <code>/files/a/b/c</code>). Next.js
          uses <code>[...slug]</code> (e.g., <code>/docs/[...slug]</code>). The matched segments
          are provided as an array or joined string. Use cases include file browsers, documentation
          sites with arbitrary depth, and CMS-driven pages where the URL structure is
          user-defined.
        </p>
        <p className="mb-4">
          Next.js also supports <strong>optional catch-all</strong> routes with{" "}
          <code>[[...slug]]</code>. Unlike regular catch-all, optional catch-all also matches the
          parent path without any additional segments. <code>/docs/[[...slug]]</code> matches both{" "}
          <code>/docs</code> (slug is undefined) and <code>/docs/a/b/c</code> (slug is{" "}
          <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;]</code>).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Route Priority and Specificity</h3>
        <p className="mb-4">
          When multiple routes could match a URL, specificity determines the winner. Static
          segments are more specific than dynamic segments, which are more specific than catch-all
          segments. For the URL <code>/users/settings</code>: a static route{" "}
          <code>/users/settings</code> wins over a dynamic route <code>/users/:id</code>, which
          wins over a catch-all <code>/users/*</code>. React Router ranks routes automatically;
          Next.js uses file-system specificity (files beat directories, named files beat dynamic
          directories).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Static Generation with Dynamic Routes</h3>
        <p>
          In Next.js, dynamic routes can be statically generated at build time using{" "}
          <code>generateStaticParams()</code>. This function returns a list of parameter values, and
          Next.js generates a static HTML page for each. A blog with 500 posts defines{" "}
          <code>/posts/[slug]</code> and <code>generateStaticParams</code> returns 500 slugs —
          the build produces 500 static HTML pages. This combines the flexibility of dynamic routes
          with the performance of static generation.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/dynamic-routes-diagram-2.svg"
        alt="Route specificity ranking: static > dynamic > catch-all"
        caption="Figure 2: Route specificity ranking — static segments always win over dynamic segments, which win over catch-all patterns."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Parameter Extraction Flow</h3>
        <p className="mb-4">
          When a URL is matched against a dynamic route pattern, the router extracts variable
          segments into a params object. In React Router, this is accessed via the{" "}
          <code>useParams()</code> hook. In Next.js App Router, params are passed as a prop to
          page and layout components. The params object contains string values keyed by the
          parameter names defined in the route pattern.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Fetching with Dynamic Params</h3>
        <p className="mb-4">
          The typical flow: (1) user navigates to <code>/products/wireless-headphones</code>,
          (2) router matches <code>/products/:slug</code> and extracts{" "}
          <code>{"{ slug: \"wireless-headphones\" }"}</code>, (3) the component receives the
          slug, (4) a data loader or useEffect fetches <code>/api/products/wireless-headphones</code>,
          (5) the component renders with the fetched data. Data routers (React Router, Remix)
          run step 4 in parallel with the route transition. Server Components (Next.js) run it
          on the server during SSR.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Validation and Error Handling</h3>
        <p>
          Dynamic route parameters are unvalidated strings. <code>/users/not-a-number</code>{" "}
          matches <code>/users/:id</code> and extracts <code>id = &quot;not-a-number&quot;</code>.
          The component must validate parameters before using them: parse numeric IDs, check UUID
          format, sanitize against injection. If validation fails, render a 404 or redirect.
          Validation at the route level (React Router&apos;s loader throwing a Response, Next.js&apos;s{" "}
          <code>notFound()</code>) prevents the component from rendering with invalid params.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/dynamic-routes-diagram-3.svg"
        alt="Data fetching flow with dynamic route params from URL to rendered component"
        caption="Figure 3: Dynamic route data flow — parameter extraction, validation, data fetching, and rendering form a pipeline from URL to UI."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Pattern</th>
                <th className="px-4 py-3 text-left font-semibold">Use Case</th>
                <th className="px-4 py-3 text-left font-semibold">Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Single param <code>:id</code></td><td className="px-4 py-3">Resource detail pages (user, product, post)</td><td className="px-4 py-3">Simple but requires validation</td></tr>
              <tr><td className="px-4 py-3 font-medium">Multiple params <code>:org/:repo</code></td><td className="px-4 py-3">Hierarchical resources (GitHub-style)</td><td className="px-4 py-3">Clean URLs but deeper nesting is harder to parse</td></tr>
              <tr><td className="px-4 py-3 font-medium">Catch-all <code>[...slug]</code></td><td className="px-4 py-3">CMS pages, file browsers, docs</td><td className="px-4 py-3">Maximum flexibility but no type safety on depth</td></tr>
              <tr><td className="px-4 py-3 font-medium">Optional catch-all <code>[[...slug]]</code></td><td className="px-4 py-3">Index + arbitrary depth on same route</td><td className="px-4 py-3">Convenient but parameter can be undefined</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Validate dynamic parameters early — in loaders or at the top of components before using them for data fetching</li>
          <li>Use human-readable slugs in URLs (<code>/products/wireless-headphones</code>) instead of opaque IDs (<code>/products/a1b2c3</code>) for SEO and usability</li>
          <li>Prefer static routes over dynamic when the set is known and finite — static routes are faster to match and can be pre-generated</li>
          <li>Use <code>generateStaticParams</code> (Next.js) or route pre-rendering to statically generate popular dynamic routes</li>
          <li>Handle not-found cases explicitly — return 404 when a dynamic param doesn&apos;t correspond to a real resource</li>
          <li>Sanitize parameters before using them in database queries or API calls to prevent injection</li>
          <li>Use TypeScript generics or runtime validators (Zod) for type-safe parameter parsing</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Stale data on param change:</strong> If you fetch data in useEffect based on a route param but don&apos;t include the param in the dependency array, the component shows stale data when navigating between dynamic routes</li>
          <li><strong>Same component, different params:</strong> React doesn&apos;t unmount a component when only the params change (same route, different data). If the component has local state, it persists incorrectly. Use the route param as a React key to force remount</li>
          <li><strong>Catch-all matching too much:</strong> A catch-all route can accidentally match URLs meant for other routes. Ensure more specific routes are defined first or use the router&apos;s ranking system</li>
          <li><strong>Missing encoding:</strong> URL parameters with special characters (/,?,#) must be encoded with <code>encodeURIComponent</code>. Failing to encode results in broken URLs</li>
          <li><strong>No 404 handling:</strong> A dynamic route that fetches data but never checks if the resource exists shows a blank page or crashes instead of a proper 404</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">GitHub Repository URLs</h3>
          <p>
            GitHub uses multi-level dynamic routes: <code>/:owner/:repo</code> matches any
            user/organization and repository combination. Further nesting gives{" "}
            <code>/:owner/:repo/tree/:branch/[...path]</code> for file browsing — a combination
            of named parameters and catch-all patterns. The catch-all handles arbitrary directory
            depth in the repository tree.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">E-commerce Product Pages</h3>
          <p>
            Platforms like Shopify generate thousands of product pages from a single{" "}
            <code>/products/:handle</code> dynamic route. At build time (for SSG) or request
            time (for SSR), the handle parameter drives a database lookup that populates the
            product detail component with title, images, pricing, and reviews. SEO-friendly slugs
            (human-readable handles) are used instead of numeric IDs.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle a dynamic route parameter that doesn&apos;t correspond to a real resource?</p>
            <p className="mt-2 text-sm">
              A: Validate the parameter in a data loader (React Router) or server component
              (Next.js). If the database lookup returns null, throw a 404 response (React Router)
              or call <code>notFound()</code> (Next.js). This prevents the component from rendering
              with missing data. On the client, show a user-friendly 404 page with navigation back
              to valid content.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between a dynamic route and a catch-all route?</p>
            <p className="mt-2 text-sm">
              A: A dynamic route (<code>/users/:id</code>) matches exactly one variable segment.
              A catch-all route (<code>/docs/[...slug]</code>) matches one or more segments of
              arbitrary depth. Dynamic routes extract a single string parameter; catch-all routes
              extract an array of path segments. Use dynamic routes for known-depth resources and
              catch-all for variable-depth content like file trees or CMS pages.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does route specificity ranking work when multiple patterns match?</p>
            <p className="mt-2 text-sm">
              A: Routers rank routes by segment specificity. Static segments score highest
              (<code>/users/settings</code>), dynamic parameters score lower (<code>/users/:id</code>),
              and catch-all/wildcard segments score lowest (<code>/users/*</code>). For the URL{" "}
              <code>/users/settings</code>, the static route wins over the dynamic route even if
              declared after it. React Router v6+ does this automatically with ranked matching.
              Next.js uses file-system specificity — a <code>settings/page.tsx</code> file beats
              a <code>[id]/page.tsx</code> directory.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does React not remount a component when only the route params change?</p>
            <p className="mt-2 text-sm">
              A: React reconciles based on component type and position in the tree. When navigating
              from <code>/users/42</code> to <code>/users/99</code>, the same route component is
              matched at the same tree position — React sees it as a prop change, not an unmount/
              remount. Local state (useState, useRef) persists incorrectly. Fix this by using the
              route param as a React key: <code>{"<UserPage key={userId} />"}</code> forces a full
              remount when the param changes. Alternatively, reset state in a useEffect that depends
              on the param.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does generateStaticParams work with dynamic routes in Next.js?</p>
            <p className="mt-2 text-sm">
              A: <code>generateStaticParams()</code> is an async function exported from a dynamic
              route&apos;s page or layout file. It returns an array of parameter objects representing
              all valid values for the dynamic segments. At build time, Next.js calls this function
              and generates a static HTML page for each returned parameter set. A blog with 500
              posts defines <code>/posts/[slug]</code> and returns 500 slug objects — the build
              produces 500 pre-rendered pages. This combines the flexibility of dynamic routes
              with the performance and SEO benefits of static generation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use IDs or human-readable slugs in dynamic route URLs?</p>
            <p className="mt-2 text-sm">
              A: Prefer human-readable slugs (<code>/products/wireless-headphones</code>) over
              opaque IDs (<code>/products/a1b2c3d4</code>) for SEO and usability. Slugs are
              descriptive, memorable, and improve click-through rates in search results. The
              trade-off: slugs must be unique and may need updating when the resource name changes
              (requiring redirects from old slugs). A common pattern is to include both:{" "}
              <code>/products/wireless-headphones-a1b2c3</code> — the slug is for humans, the
              trailing ID is the canonical identifier for database lookup.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>React Router — Dynamic segments and useParams</li>
          <li>Next.js — Dynamic routes with [param] and [...catchAll]</li>
          <li>Next.js — generateStaticParams for dynamic static generation</li>
          <li>Remix — Route params and data loading</li>
          <li>MDN — encodeURIComponent for URL parameter encoding</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
