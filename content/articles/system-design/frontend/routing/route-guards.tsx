"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "route-guards",
  title: "Route Guards / Protection",
  description:
    "Implementing route protection patterns including authentication guards, role-based access control, redirect flows, and server-side vs client-side authorization strategies.",
  category: "frontend",
  subcategory: "routing",
  slug: "route-guards",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["route guards", "authentication", "authorization", "protected routes", "RBAC"],
  relatedTopics: ["client-side-routing", "nested-routes", "deep-linking"],
};

export default function RouteGuardsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Route guards (also called route protection or route authorization) are mechanisms that
          control access to routes based on conditions — typically authentication status and user
          permissions. When a user attempts to navigate to a protected route, the guard evaluates
          whether the user meets the requirements. If they do, the route renders normally. If not,
          the user is redirected (usually to a login page) or shown an unauthorized message.
        </p>
        <p className="mb-4">
          Route guards operate at two levels. <strong>Client-side guards</strong> prevent the UI
          from rendering protected content and redirect unauthorized users. They improve UX but are
          not a security boundary — any determined user can bypass client-side JavaScript.{" "}
          <strong>Server-side guards</strong> (middleware, API authorization) are the actual security
          layer that prevents unauthorized data access. Production applications need both: client-side
          for UX, server-side for security.
        </p>
        <p>
          Every modern framework provides patterns for route protection. React Router uses loader
          functions that check auth state and throw redirects. Next.js uses middleware that runs
          on the server before the route renders. Angular has built-in <code>canActivate</code>{" "}
          guards. The implementation varies but the concept is universal.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-guards-diagram-1.svg"
        alt="Route guard decision flow: check auth, check permissions, render or redirect"
        caption="Figure 1: Route guard decision flow — authentication check, then permission check, then render or redirect."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authentication Guards</h3>
        <p className="mb-4">
          The most common guard type. Checks whether the user is authenticated (has a valid
          session/token) before allowing access to a route. If not authenticated, the user is
          redirected to the login page. The original URL is typically preserved (via a{" "}
          <code>returnTo</code> query parameter or in session storage) so the user can be sent
          back after successful authentication.
        </p>
        <p className="mb-4">
          Implementation in React typically involves a wrapper component:{" "}
          <code>{"<ProtectedRoute>"}</code> checks auth state from context or a store. If
          authenticated, it renders children. If not, it renders a{" "}
          <code>{"<Navigate to=\"/login\" />"}</code>. With React Router&apos;s data API, the
          guard is a <code>loader</code> that checks auth and throws{" "}
          <code>redirect(&quot;/login&quot;)</code> if unauthorized — this runs before the component
          renders, preventing any flash of protected content.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authorization Guards (RBAC)</h3>
        <p className="mb-4">
          Beyond authentication, authorization guards check whether the authenticated user has
          permission to access a specific route. Role-Based Access Control (RBAC) maps roles
          (admin, editor, viewer) to route access. More granular permission-based systems check
          specific capabilities (can_edit_users, can_view_analytics). The route configuration
          declares required roles/permissions, and the guard compares them against the user&apos;s
          actual roles.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Guard Composition</h3>
        <p>
          Guards often compose: an outer guard checks authentication, an inner guard checks
          authorization. In nested route architectures, the auth guard lives on the outermost
          layout route (protecting all children), while role-based guards live on specific child
          routes. React Router supports this naturally — a parent route&apos;s loader runs before
          child loaders. If the parent loader redirects, children never execute.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-guards-diagram-2.svg"
        alt="Guard composition in nested routes showing layered auth and RBAC checks"
        caption="Figure 2: Guard composition — authentication guard on the layout route, role-based guards on specific child routes."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server-Side Route Protection</h3>
        <p className="mb-4">
          Next.js middleware runs on the server (at the edge) before any route renders. It can
          read cookies, verify JWTs, check session tokens, and redirect or rewrite the request.
          This is the most secure guard: the protected page&apos;s HTML, JavaScript, and data are
          never sent to unauthorized users. The middleware function receives the request and can
          return <code>NextResponse.redirect()</code> or <code>NextResponse.next()</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Client-Side Guard Patterns</h3>
        <p className="mb-4">
          Three common client-side patterns: (1) <strong>Wrapper component</strong> — a{" "}
          <code>{"<RequireAuth>"}</code> component that checks auth state and redirects or renders
          children. Simple but can flash protected content before the redirect fires.
          (2) <strong>Loader guard</strong> — React Router&apos;s <code>loader</code> function
          checks auth before the component mounts. No flash of content, but requires the data
          router API. (3) <strong>Higher-order route config</strong> — a function that wraps route
          definitions with auth metadata, processed by a custom router component.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Refresh During Navigation</h3>
        <p>
          Route guards must handle expired tokens gracefully. If a guard checks a JWT and finds
          it expired, it should attempt a silent token refresh (using a refresh token) before
          redirecting to login. Only if the refresh fails should the user be logged out. This
          prevents unnecessary logouts during long sessions. React Router loaders are ideal for
          this — the loader can await the token refresh, and the UI shows a loading state during
          the refresh attempt.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-guards-diagram-3.svg"
        alt="Server-side vs client-side guard comparison showing security boundaries"
        caption="Figure 3: Server-side guards prevent data exposure; client-side guards improve UX. Both are needed for a complete solution."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Approach</th>
                <th className="px-4 py-3 text-left font-semibold">Security</th>
                <th className="px-4 py-3 text-left font-semibold">UX</th>
                <th className="px-4 py-3 text-left font-semibold">Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Client-side wrapper</td><td className="px-4 py-3">Low (bypassable)</td><td className="px-4 py-3">May flash content</td><td className="px-4 py-3">Low</td></tr>
              <tr><td className="px-4 py-3 font-medium">Loader guard</td><td className="px-4 py-3">Low (bypassable)</td><td className="px-4 py-3">No flash, loading state</td><td className="px-4 py-3">Medium</td></tr>
              <tr><td className="px-4 py-3 font-medium">Server middleware</td><td className="px-4 py-3">High (server enforced)</td><td className="px-4 py-3">Clean redirect</td><td className="px-4 py-3">Medium</td></tr>
              <tr><td className="px-4 py-3 font-medium">API-level auth</td><td className="px-4 py-3">Highest (data-level)</td><td className="px-4 py-3">Requires client handling</td><td className="px-4 py-3">Medium</td></tr>
              <tr><td className="px-4 py-3 font-medium">Combined (recommended)</td><td className="px-4 py-3">Highest</td><td className="px-4 py-3">Best</td><td className="px-4 py-3">Higher</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Always enforce authorization on the server (middleware or API) — client-side guards are UX, not security</li>
          <li>Preserve the intended destination URL so users return to it after authentication</li>
          <li>Use route loaders or middleware to check auth before rendering — avoid flashing protected content</li>
          <li>Handle token expiration gracefully — attempt silent refresh before redirecting to login</li>
          <li>Compose guards through nested routes — auth guard on layout, role guards on specific pages</li>
          <li>Show appropriate feedback for unauthorized access — distinguish between &quot;not logged in&quot; (redirect to login) and &quot;insufficient permissions&quot; (show 403 page)</li>
          <li>Don&apos;t include protected route chunks in the public bundle if possible — use server-side rendering or middleware to prevent even the JS from being sent</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Client-only protection:</strong> Relying solely on client-side guards. Users can disable JavaScript, modify state, or access API endpoints directly. Always guard on the server</li>
          <li><strong>Flash of protected content:</strong> Rendering the protected component before the auth check completes. Use loader guards or server middleware to prevent this</li>
          <li><strong>Lost redirect URL:</strong> Not saving the original URL before redirecting to login. Users must manually navigate back after authentication</li>
          <li><strong>Infinite redirect loop:</strong> A guard that redirects to login, but the login page is also guarded, or the auth check fails repeatedly. Always ensure the redirect target is accessible</li>
          <li><strong>Stale auth state:</strong> Checking a cached auth state that&apos;s expired. Verify tokens server-side or check expiration times before trusting cached auth</li>
          <li><strong>Route chunk exposure:</strong> Even if the component doesn&apos;t render, the JavaScript chunk may be downloaded and inspected. Sensitive business logic should never be in client-side code</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SaaS Admin Panels</h3>
          <p>
            Multi-tenant SaaS applications use layered route guards. The outermost guard checks
            authentication. The next layer checks organization membership (is this user part of
            this org?). The innermost layer checks role-based permissions (is this user an admin
            of this org?). Each layer corresponds to a nested route boundary: app layout → org
            layout → admin layout → page.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Next.js Middleware</h3>
          <p>
            Next.js middleware runs at the edge before any route renders. A common pattern: check
            for an auth cookie, verify the JWT, and redirect to <code>/login</code> if invalid.
            The middleware matcher config specifies which routes are protected:{" "}
            <code>{"matcher: [\"/dashboard/:path*\", \"/settings/:path*\"]"}</code>. This ensures
            the protected page&apos;s HTML and RSC payload are never generated for unauthorized users.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are client-side route guards not sufficient for security?</p>
            <p className="mt-2 text-sm">
              A: Client-side JavaScript can be disabled, modified, or bypassed entirely. A user
              can use browser dev tools to modify auth state, directly call API endpoints, or
              disable the guard logic. Client-side guards only control the UI — they prevent rendering
              protected components but cannot prevent data access. Server-side authorization
              (middleware, API guards) is the actual security boundary that prevents unauthorized
              data from being returned.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent the flash of protected content in a React SPA?</p>
            <p className="mt-2 text-sm">
              A: Use React Router&apos;s loader functions to check auth before the route component
              mounts. If the loader throws a redirect response, the component never renders. For
              wrapper-based guards, show a loading spinner while the auth check is in progress
              instead of rendering children. For Next.js, use server middleware to redirect before
              the page HTML is generated.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement role-based access control (RBAC) in route guards?</p>
            <p className="mt-2 text-sm">
              A: Define required roles or permissions in the route configuration (e.g., a{" "}
              <code>meta</code> object or route handle with <code>{"{ requiredRole: \"admin\" }"}</code>).
              The guard checks the authenticated user&apos;s roles against the route&apos;s
              requirements. In nested routes, compose guards: the outer layout guard checks
              authentication, inner page guards check specific roles. If the user is authenticated
              but lacks permission, show a 403 &quot;Forbidden&quot; page instead of redirecting to
              login. Always enforce the same roles server-side on the data layer.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How should route guards handle token expiration during navigation?</p>
            <p className="mt-2 text-sm">
              A: When a guard detects an expired access token, it should first attempt a silent
              refresh using the refresh token before redirecting to login. The flow: check token
              expiration → if expired, call the refresh endpoint → if refresh succeeds, proceed
              with navigation using the new token → if refresh fails (refresh token also expired),
              redirect to login with the original URL saved as a returnTo parameter. This prevents
              unnecessary logouts during long sessions. React Router loaders are ideal for this
              since they can await the async refresh and show a loading state.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you preserve the user&apos;s intended destination through a login redirect?</p>
            <p className="mt-2 text-sm">
              A: When redirecting to login, encode the original URL as a query parameter:{" "}
              <code>/login?returnTo=%2Fdashboard%2Fsettings</code>. After successful authentication,
              read the returnTo parameter and redirect there instead of the default landing page.
              Validate the returnTo URL to prevent open redirect attacks — ensure it&apos;s a
              relative path on your domain, not an external URL. Alternatively, store the intended
              destination in sessionStorage before redirecting, which avoids URL length limits
              for complex return URLs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Next.js middleware differ from client-side route guards?</p>
            <p className="mt-2 text-sm">
              A: Next.js middleware runs on the server (at the edge) before any route rendering
              occurs. It can read cookies, verify JWTs, and redirect the request — the protected
              page&apos;s HTML, JavaScript, and React Server Component payload are never generated
              or sent to unauthorized users. Client-side guards run after the page loads, meaning
              the HTML and JS chunks are already downloaded. Middleware provides true security;
              client-side guards are a UX convenience. Use both: middleware for security, client-side
              for instant feedback (loading states, redirects without full page load).
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>React Router — Protected routes with loaders and redirects</li>
          <li>Next.js — Middleware for route protection</li>
          <li>OWASP — Broken Access Control prevention</li>
          <li>Auth0 — Route protection patterns in React applications</li>
          <li>Angular — Route guards (canActivate, canLoad)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
