"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-micro-frontend-architecture",
  title: "Micro-Frontend Architecture",
  description:
    "Production-grade micro-frontend design covering Module Federation, composition strategies, cross-app communication, dependency management, CSS isolation, performance trade-offs, and when not to use micro-frontends.",
  category: "low-level-design",
  subcategory: "architecture-system-level-lld",
  slug: "micro-frontend-architecture",
  wordCount: 5400,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["micro-frontend", "module-federation", "webpack", "single-spa", "architecture", "lld"],
};

export default function MicroFrontendArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Micro-frontends extend the microservices philosophy to the browser: instead of a single monolithic frontend
        application deployed by one team, multiple independently developed, deployed, and owned frontend applications
        are composed into a cohesive user experience. At staff-level interviews, the question is rarely "what is a
        micro-frontend" — it's "how do you handle dependency conflicts, cross-app state, CSS isolation, and the
        performance cost of duplication at scale."
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/architecture-system-level-lld/micro-frontend-architecture.svg"
        alt="Micro-frontend architecture diagram"
        caption="Composition strategies, cross-app communication, dependency management, and design system integration"
      />

      <h2>When to Use Micro-Frontends</h2>
      <p>
        Micro-frontends solve an organizational and operational problem, not a technical one. They are the right choice
        when:
      </p>
      <ul>
        <li>
          <strong>5+ teams work on the same product:</strong> A monorepo works well for 2–3 teams but becomes a
          coordination bottleneck beyond that. Merge queues, conflicting dependencies, and "who broke the build" debates
          signal the need for stronger boundaries.
        </li>
        <li>
          <strong>Teams have distinct deploy cadences:</strong> The checkout team deploys 10× per day; the analytics
          dashboard team deploys weekly. A monolith forces the fastest team to slow down to the pace of the slowest.
        </li>
        <li>
          <strong>Distinct bounded domains:</strong> Search, checkout, account settings, and admin are genuinely
          separate domains with separate backends, separate data models, and different technology needs.
        </li>
        <li>
          <strong>Legacy migration:</strong> Incrementally replace a legacy application by strangling it — new features
          are built as micro-frontends while the legacy app handles remaining routes.
        </li>
      </ul>

      <HighlightBlock as="p" tier="crucial">
        Micro-frontends add real operational complexity: separate CI/CD pipelines, separate versioning, contract
        testing, cross-app debugging overhead. Never introduce them for a small team or a domain where teams share the
        same data model. The cost is high — the benefit only materializes at organizational scale.
      </HighlightBlock>

      <h2>Composition Strategies</h2>
      <p>
        There are four fundamental ways to compose micro-frontends. Each has different isolation characteristics,
        performance profiles, and operational complexity.
      </p>

      <h3>Build-Time Composition (npm Packages)</h3>
      <p>
        Each micro-frontend is published as an npm package and imported as a dependency by the shell application.
        The shell bundles everything together at build time.
      </p>
      <p>
        <strong>Pros:</strong> Simple — no runtime orchestration. All code is in one bundle, optimized together.
        Standard TypeScript support. No version negotiation at runtime.
      </p>
      <p>
        <strong>Cons:</strong> Defeats the purpose of independent deployment. Publishing a new version of a
        micro-frontend requires the shell to re-deploy. Teams are coupled at the build level. Fine for shared component
        libraries, wrong for independently deployed applications.
      </p>

      <h3>Server-Side Composition</h3>
      <p>
        The server assembles the page by fetching HTML fragments from each micro-frontend service and stitching them
        together before serving the response. Two approaches:
      </p>
      <ul>
        <li>
          <strong>Edge Side Includes (ESI):</strong> Nginx or Varnish resolves <code>&lt;esi:include&gt;</code> tags
          in HTML templates. Zero client-side JS overhead. Cache each fragment independently at the edge.
        </li>
        <li>
          <strong>Server-side rendering stitching:</strong> A Node.js "page server" makes parallel requests to each
          micro-frontend's SSR service and assembles the HTML. More flexible, supports React streaming, but adds a
          network hop.
        </li>
      </ul>
      <p>
        <strong>Best for:</strong> Content-heavy sites (news, e-commerce product pages) where SEO and TTFB matter and
        client interactivity is modest.
      </p>

      <h3>Client-Side Composition (Module Federation)</h3>
      <p>
        Webpack 5's Module Federation is the most widely used approach for SPA micro-frontends. Each micro-frontend
        exposes a JavaScript module at a URL. The shell application loads remote modules at runtime via
        <code>import()</code>.
      </p>

      <h3>Single-SPA Framework</h3>
      <p>
        Single-SPA provides a lifecycle API (bootstrap, mount, unmount) that the shell calls to manage micro-frontend
        lifecycles. Any framework (React, Vue, Angular) can wrap its root component in Single-SPA lifecycle hooks.
        The shell registers each micro-app with a route matcher; Single-SPA calls the correct lifecycle hooks as the
        URL changes.
      </p>

      <h2>Webpack Module Federation in Depth</h2>
      <p>
        Module Federation is the de-facto standard for runtime micro-frontend composition in React applications.
        Understanding the configuration is essential for staff-level interviews.
      </p>

      <h3>Host and Remote Configuration</h3>
      <p>
        A Module Federation setup has two roles: <strong>remote</strong> (exposes modules) and <strong>host</strong>
        (consumes remote modules). An application can be both.
      </p>
      <p>
        The remote declares an <code>exposes</code> map: the keys are the import paths clients use, and the values
        are the actual files. The build outputs a <code>remoteEntry.js</code> file — a manifest of what the remote
        exposes and its dependency requirements.
      </p>
      <p>
        The host declares a <code>remotes</code> map pointing to each remote's <code>remoteEntry.js</code> URL. At
        runtime, when the host encounters a dynamic import from a remote, webpack loads the <code>remoteEntry.js</code>
        first, resolves the module, downloads only the needed chunks, and executes the module.
      </p>

      <h3>Shared Dependencies</h3>
      <p>
        The most critical Module Federation concern is shared dependencies. Without sharing, every remote bundles its
        own copy of React — potentially 3–5 copies of React running simultaneously, each with their own virtual DOM
        instance. React hooks will throw ("hooks can only be called inside a function component") because the hook
        is registered in one React instance and the component is mounted in another.
      </p>
      <p>
        The <code>shared</code> config resolves this:
      </p>
      <ul>
        <li>
          <strong>singleton: true:</strong> Only one copy of this package loads across all remotes and the host. If
          multiple remotes require React, Module Federation picks one version.
        </li>
        <li>
          <strong>requiredVersion:</strong> Specifies the version range this app requires. If the negotiated singleton
          version falls outside this range, Module Federation falls back to loading a separate copy (and warns in the
          console).
        </li>
        <li>
          <strong>eager: false:</strong> The default. Shared packages are lazy-loaded. Setting <code>eager: true</code>
          on the host prevents async boundary issues with certain initialization patterns but increases initial bundle
          size.
        </li>
        <li>
          <strong>strictVersion: false:</strong> With <code>true</code>, any version mismatch is a runtime error
          rather than a warning. Use this for packages where version incompatibility causes bugs (React).
        </li>
      </ul>

      <HighlightBlock as="p" tier="crucial">
        Always configure React and ReactDOM as shared singletons with a required version range. Version mismatch in
        React between host and remote produces subtle, hard-to-debug hook errors. The fix is the shared config — not
        running both versions simultaneously.
      </HighlightBlock>

      <h3>Deployment Pattern</h3>
      <p>
        Each micro-frontend has its own CI/CD pipeline. On every deployment:
      </p>
      <ol>
        <li>Build the micro-frontend — outputs chunk files with content-hash names.</li>
        <li>Upload all chunk files to a CDN (S3 + CloudFront, Vercel, etc.).</li>
        <li>Upload <code>remoteEntry.js</code> — this file is small, not content-hashed (or hashed but the URL
        is known to the host).</li>
        <li>The host references the <code>remoteEntry.js</code> URL. Old chunk files remain on CDN for users
        who have the old bundle cached.</li>
      </ol>
      <p>
        The host does not redeploy when a remote updates. Existing users loading the host bundle will pick up the
        new remote on their next hard navigation (not during an active session, unless you implement a "new version
        available" banner).
      </p>

      <h2>Cross-App Communication</h2>
      <p>
        Micro-frontends must not share a common state store — that would couple them at the data level. Instead,
        communication happens through well-defined interfaces.
      </p>

      <h3>Custom Events</h3>
      <p>
        The browser's <code>CustomEvent</code> API provides a decoupled pub/sub mechanism:
      </p>
      <p>
        The emitter dispatches a namespaced event with a detail payload. Any micro-frontend that has registered a
        listener receives it. Neither party needs to know the other exists. The downside: the event schema is an
        implicit contract — type safety requires explicit documentation or a shared TypeScript types package.
      </p>

      <h3>Shared Context via Shell Props</h3>
      <p>
        The shell owns authentication, theme, feature flags, and user locale. It passes these to micro-frontends via
        props (if using Module Federation with React components) or via a global config object on <code>window</code>.
        Using <code>window.__APP_CONFIG__</code> is the simplest approach — the shell writes it before mounting any
        micro-frontend; remotes read it at initialization. Keep this object read-only; micro-frontends should never
        write to it.
      </p>

      <h3>BroadcastChannel for Cross-Tab Sync</h3>
      <p>
        When the user has the app open in multiple tabs and logs out in one, all tabs must end the session. The shell
        uses a BroadcastChannel — when it receives an auth change event (token revoked, logout), it posts a message
        to the channel. All other tabs receive the message and redirect to the login page. This requires no server
        round trip.
      </p>

      <h3>postMessage for iframes</h3>
      <p>
        If a micro-frontend is embedded in an iframe for complete isolation, communication uses
        <code>window.postMessage</code> with strict origin validation. The parent only accepts messages from known
        origins; the child only accepts messages from the parent frame. Never use <code>targetOrigin: "*"</code> for
        sensitive messages.
      </p>

      <HighlightBlock as="p" tier="important">
        The golden rule of cross-app communication: micro-frontends communicate through events and props, never
        through shared mutable state. If two micro-frontends need to share state tightly, they are probably not
        separate bounded domains and should be one application.
      </HighlightBlock>

      <h2>Routing Architecture</h2>
      <p>
        The shell owns the URL. Micro-frontends receive a path prefix and render content within that prefix. The
        shell's router maps URL prefixes to micro-frontend mount points:
      </p>
      <ul>
        <li><code>/search/*</code> → Search micro-frontend</li>
        <li><code>/checkout/*</code> → Checkout micro-frontend</li>
        <li><code>/account/*</code> → Account micro-frontend</li>
      </ul>
      <p>
        Each micro-frontend manages its own internal routing (React Router, Next.js App Router) within its prefix.
        It must not push routes outside its prefix. The shell intercepts navigation events that would leave the
        current micro-frontend's prefix and handles the unmount/mount transition.
      </p>
      <p>
        A key consideration: when navigating between micro-frontends (e.g., from <code>/search</code> to
        <code>/checkout</code>), the shell unmounts the search micro-frontend and mounts the checkout
        micro-frontend. This is a full component tree teardown and remount — scroll position, ephemeral UI state,
        and any in-memory data is lost. Design accordingly.
      </p>

      <h2>Performance Considerations</h2>
      <p>
        Micro-frontends introduce performance costs that must be actively managed.
      </p>

      <h3>Bundle Waterfall</h3>
      <p>
        The browser must load the shell bundle, execute the shell, load <code>remoteEntry.js</code> for the active
        micro-frontend, then download the micro-frontend's chunks. This is a 3-hop waterfall before the user sees
        content. Mitigation: use <code>link rel="modulepreload"</code> to hint the browser to prefetch the next
        micro-frontend's entry when the user hovers a navigation link.
      </p>

      <h3>Dependency Duplication Without Sharing</h3>
      <p>
        Without the shared config, a 5-micro-frontend app could ship 5 copies of React (each ~130 KB gzipped). With
        shared singletons, there's one copy. Always audit the shared config to verify singletons are actually shared
        (check the Network tab — React should appear in one chunk, not N).
      </p>

      <h3>Independent Loading</h3>
      <p>
        Never include the active micro-frontend's chunks in the shell bundle. The shell bundle should contain only:
        routing logic, the app shell (navigation, layout), shared config initialization, and the Module Federation
        container. All micro-frontend code loads asynchronously on demand.
      </p>

      <h2>CSS Isolation</h2>
      <p>
        Global CSS from one micro-frontend will leak into another unless isolation is enforced. Three effective strategies:
      </p>

      <h3>CSS Modules</h3>
      <p>
        Each micro-frontend uses CSS Modules — class names are scoped to the component file via hash suffixes
        (e.g., <code>.button_3xK9</code>). No global selectors, no leakage. This is the standard approach for React
        micro-frontends.
      </p>

      <h3>Shadow DOM</h3>
      <p>
        Web Components with Shadow DOM provide complete CSS isolation — styles inside the shadow root do not leak
        out, and host page styles do not leak in. Drawback: global styles (CSS custom properties from the shell's
        theme) penetrate Shadow DOM only if the micro-frontend explicitly reads them. Complex to set up but provides
        the strongest isolation.
      </p>

      <h3>BEM Namespacing</h3>
      <p>
        Each micro-frontend prefixes all its CSS class names with a team/domain identifier:
        <code>.search-btn</code>, <code>.checkout-modal</code>. Simple but relies on discipline — one unnamespaced
        global selector breaks isolation.
      </p>

      <h3>Shared Design Tokens</h3>
      <p>
        The shell injects CSS custom properties on <code>:root</code>: colors, spacing, typography. These cascade
        into all micro-frontends automatically, including those behind Shadow DOM (custom properties pierce shadow
        boundaries). Micro-frontends reference tokens by variable name — they never hardcode color hex values.
        This ensures visual consistency without coupling to a shared CSS file.
      </p>

      <h2>Accessibility in Micro-Frontends</h2>
      <p>
        Focus management and ARIA landmark structure require explicit coordination across boundaries.
      </p>
      <ul>
        <li>
          <strong>Focus on route change:</strong> When the shell switches micro-frontends, it must move focus to an
          appropriate element — typically a skip-navigation link or the main heading of the new micro-frontend. The
          new micro-frontend is responsible for setting <code>document.title</code> and announcing the route change
          to screen readers via an ARIA live region.
        </li>
        <li>
          <strong>Landmark structure:</strong> The shell wraps the main content area in a <code>&lt;main&gt;</code>
          landmark. Each micro-frontend renders within this main area. Micro-frontends should not add their own
          <code>&lt;main&gt;</code> elements — only one per page.
        </li>
        <li>
          <strong>Modal management:</strong> If a micro-frontend renders a modal, it must handle focus trapping
          within the modal and restore focus to the trigger element on close. Global portal targets (typically
          <code>#modal-root</code> in the shell) allow micro-frontends to render modals at the document root
          for correct stacking context.
        </li>
      </ul>

      <h2>Contract Testing</h2>
      <p>
        With multiple teams owning different micro-frontends, the interface between host and remote is a public
        contract. When the remote team renames an exported component, the host breaks. Contract testing with tools
        like Pact prevents this:
      </p>
      <ul>
        <li>The host team writes consumer contract tests specifying what they expect from the remote (exported
        component name, props shape, event payload shape).</li>
        <li>The remote team runs provider verification tests — Pact verifies the remote satisfies all known consumer
        contracts before merging a change.</li>
        <li>A breaking change in the remote fails the provider verification test before it reaches production.</li>
      </ul>

      <h2>Interview Q&A</h2>

      <h3>Q: How does Webpack Module Federation handle React version conflicts between micro-frontends?</h3>
      <p>
        Module Federation version negotiation: when the shell and two remotes each declare React in their shared
        config, MF builds a compatibility graph at runtime. It picks the highest version that satisfies all declared
        <code>requiredVersion</code> ranges. For example, if the shell requires <code>^18.0.0</code> and two remotes
        require <code>^18.2.0</code> and <code>^18.1.0</code> respectively, MF loads <code>18.2.x</code> as the
        singleton. If the shell requires <code>^17.0.0</code> and a remote requires <code>^18.0.0</code>, the ranges
        don't overlap — MF loads two separate React instances, which breaks hooks. The fix: align versions across all
        micro-frontends.
      </p>

      <h3>Q: A user completes checkout in one micro-frontend. How do the other micro-frontends (cart badge, header) know to update?</h3>
      <p>
        Three valid approaches, in order of preference:
      </p>
      <ol>
        <li>
          <strong>CustomEvent:</strong> Checkout fires a CustomEvent named <code>order:placed</code> with the orderId in the detail payload.
          The shell and header micro-frontend listen for this event and update the cart badge count to zero. Fully
          decoupled — neither party knows the other exists.
        </li>
        <li>
          <strong>Server-driven state:</strong> All cart state lives in the backend. After checkout completes, every
          micro-frontend that shows cart count refetches from the API (using stale-while-revalidate or a shared
          React Query cache). No cross-app event needed — truth is in the server.
        </li>
        <li>
          <strong>Shell-owned state:</strong> The shell subscribes to the order:placed event and updates a shared
          config property that other micro-frontends read via prop or window. Shell mediates the update.
        </li>
      </ol>

      <h3>Q: How do you debug an issue that spans multiple micro-frontends?</h3>
      <p>
        Micro-frontend debugging is harder than monolith debugging because each team's code is a separate bundle with
        its own source maps. The effective approach:
      </p>
      <ul>
        <li>
          <strong>Distributed tracing:</strong> Each API call carries a trace-id header. The micro-frontend that
          initiates the call sets the trace-id; downstream calls propagate it. When something goes wrong, search the
          trace-id in the logging system to see every service call in that user flow, regardless of which
          micro-frontend initiated it.
        </li>
        <li>
          <strong>Error attribution:</strong> Sentry releases are tagged per micro-frontend. When an error occurs, the
          Sentry UI shows which micro-frontend's bundle it came from, which team owns it, and the source-mapped stack
          trace.
        </li>
        <li>
          <strong>Session replay:</strong> Sentry or LogRocket session replay shows the exact user interaction
          sequence, including which micro-frontend was active at each step.
        </li>
        <li>
          <strong>Local development:</strong> Each team can run their micro-frontend locally against either the
          production remotes or local remotes. The remote URL in the host's Module Federation config is
          environment-variable driven — switch to <code>localhost:3001/remoteEntry.js</code> for local debugging.
        </li>
      </ul>

      <h3>Q: Design a micro-frontend system for a large e-commerce site with search, PDP, cart, and checkout domains.</h3>
      <p>
        Shell application: handles global navigation, auth state, cart badge count (read-only display), and routing.
        Deployed by a platform team. Defines the shared design token CSS custom properties.
      </p>
      <p>
        Search micro-frontend: <code>/search/*</code> prefix. Owned by the discovery team. Query params for search
        terms and filters are the external API. Fires <code>product:selected</code> custom events when a user clicks
        a product (the shell navigates to PDP). No cross-app state needed — search results are server-fetched.
      </p>
      <p>
        PDP (Product Detail Page) micro-frontend: <code>/products/:id/*</code>. Owned by the catalog team. Fires
        <code>cart:item-added</code> custom event. The shell listens and updates the cart badge.
      </p>
      <p>
        Cart micro-frontend: <code>/cart/*</code>. Owned by the commerce team. Reads cart state from the API on
        mount (no cross-app state sharing). Fires <code>checkout:initiated</code> on proceed-to-checkout.
      </p>
      <p>
        Checkout micro-frontend: <code>/checkout/*</code>. Owned by the payments team. Highest security sensitivity
        — runs in an iframe with strict CSP if the payments team requires full isolation. Fires
        <code>order:placed</code> on success; shell navigates to confirmation page.
      </p>
      <p>
        Shared: design system published as an npm package (not a federated module — stability over flexibility).
        Authentication handled by the shell; each micro-frontend receives the auth token via the shell's shared config.
      </p>

      <h3>Q: When would you recommend against micro-frontends?</h3>
      <p>
        Recommend against micro-frontends when:
      </p>
      <ul>
        <li>
          <strong>Small team (under 5 engineers):</strong> The operational overhead (separate CI/CD, contract testing,
          cross-app debugging) consumes more bandwidth than the coordination problems it solves.
        </li>
        <li>
          <strong>Shared data model:</strong> If all micro-frontends read and write the same database tables, they are
          not separate bounded contexts — they are one application that should be split by feature flags or code
          organization, not deployment boundary.
        </li>
        <li>
          <strong>High coherence requirement:</strong> If page transitions must be instant (sub-50 ms) and the UI is
          a tightly integrated canvas where every interaction affects every other part (design tools, IDEs), the
          mount/unmount overhead and bundle waterfall of micro-frontends is prohibitive.
        </li>
        <li>
          <strong>No team willing to own the shell:</strong> The shell is the most critical piece — it must never
          break, must be backward compatible with all remotes, and must have clear ownership. If no team will commit
          to this, micro-frontends will fail in practice.
        </li>
      </ul>
    </ArticleLayout>
  );
}
