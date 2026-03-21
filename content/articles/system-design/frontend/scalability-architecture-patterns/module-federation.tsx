"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-module-federation",
  title: "Module Federation",
  description:
    "Comprehensive guide to Module Federation covering runtime module sharing, shared dependency management, deployment strategies, and building distributed frontend architectures with webpack 5 and beyond.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "module-federation",
  wordCount: 3800,
  readingTime: 15,
  lastUpdated: "2026-03-20",
  tags: ["frontend", "module-federation", "webpack", "micro-frontends", "architecture"],
  relatedTopics: ["micro-frontends", "monorepo-vs-polyrepo", "plugin-architecture"],
};

export default function ModuleFederationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Module Federation</strong> is a webpack 5 architecture that allows JavaScript applications
          to dynamically load code from other independently built and deployed applications at runtime.
          Unlike traditional bundling where all code is compiled together at build time, Module Federation
          enables multiple builds to form a single application, sharing dependencies and code without the
          overhead of npm publishing, version coordination, or monorepo infrastructure.
        </p>
        <p>
          Invented by Zack Jackson and introduced in webpack 5 (2020), Module Federation solved a
          fundamental problem in micro-frontend architectures: how to share code between independently
          deployed applications without duplicating dependencies. Before Module Federation, micro-frontends
          either loaded separate bundles (duplicating React, lodash, etc.) or used complex external
          dependency management (SystemJS, import maps). Module Federation provided a built-in, bundle-level
          solution for runtime code sharing.
        </p>
        <p>
          The technology has evolved beyond webpack — Rspack supports Module Federation natively, Vite has
          community plugins (vite-plugin-federation), and Module Federation 2.0 introduces runtime plugins,
          type safety across remote boundaries, and enhanced DevTools. For staff engineers, understanding
          Module Federation is essential for designing distributed frontend architectures that balance team
          autonomy with shared infrastructure efficiency.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Host (Consumer):</strong> The application that loads remote modules at runtime. The host
            defines which remotes it wants to consume and what modules it expects from each remote. A host
            initializes the shared scope and coordinates dependency version negotiation.
          </li>
          <li>
            <strong>Remote (Provider):</strong> The application that exposes modules for consumption by
            hosts. A remote defines which of its modules are available for remote consumption and which
            dependencies it is willing to share. Each remote is independently built and deployed.
          </li>
          <li>
            <strong>Shared Scope:</strong> A runtime container where shared dependencies (React, React DOM,
            lodash) are negotiated between host and remotes. When multiple applications declare React as
            shared, the shared scope ensures only one copy is loaded. Version negotiation determines which
            version wins (highest compatible version, or singleton enforcement).
          </li>
          <li>
            <strong>Container:</strong> Each federated application produces a container entry point
            (remoteEntry.js) that exposes a get() and init() API. The container is loaded at runtime, its
            init() method receives the shared scope, and get() returns requested modules. Containers are
            the runtime manifestation of federated builds.
          </li>
          <li>
            <strong>Singleton Enforcement:</strong> For libraries that must have exactly one instance (React,
            React DOM — because multiple instances cause hooks to break), the shared configuration can
            enforce singleton: true. If a remote provides an incompatible version, a warning is logged and
            the host&apos;s version is used.
          </li>
          <li>
            <strong>Bidirectional Federation:</strong> An application can be both a host and a remote
            simultaneously. App A consumes modules from App B while also exposing modules for App B to
            consume. This creates a peer-to-peer module sharing topology rather than a hierarchical one.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Module Federation&apos;s architecture operates at two levels: build-time configuration that
          defines the federation topology, and runtime execution that loads and negotiates modules.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Runtime Architecture</h3>
          <p>The Module Federation runtime flow when a host loads a remote module:</p>
          <ol className="mt-3 space-y-2">
            <li><strong>1. Host Bootstrap:</strong> Host application loads and initializes its shared scope with locally available dependencies.</li>
            <li><strong>2. Remote Discovery:</strong> Host fetches remoteEntry.js from configured remote URLs (CDN, separate deployment).</li>
            <li><strong>3. Shared Scope Negotiation:</strong> Remote&apos;s init() receives the host&apos;s shared scope. Version negotiation determines which copy of each shared dependency to use.</li>
            <li><strong>4. Module Resolution:</strong> Host calls remote.get(&quot;./Component&quot;) to request a specific module from the remote container.</li>
            <li><strong>5. Chunk Loading:</strong> The remote loads any additional chunks needed for the requested module (code splitting still works within remotes).</li>
            <li><strong>6. Module Execution:</strong> The resolved module factory is executed, producing the component/function that the host can use as if it were local code.</li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Build-Time vs Runtime Dependencies</h3>
          <ul className="space-y-2">
            <li>
              <strong>Traditional Bundling:</strong> All dependencies resolved at build time. A single
              bundle contains everything. Changes to a shared library require rebuilding and redeploying
              all consumers.
            </li>
            <li>
              <strong>Module Federation:</strong> Shared dependencies resolved at runtime. Each application
              builds independently. The shared scope negotiates at load time which version to use. Changes
              to a remote require only redeploying the remote — hosts automatically pick up changes.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Version Negotiation Example</h3>
          <p>When Host uses React 18.2.0 and Remote uses React 18.3.0:</p>
          <ul className="mt-3 space-y-2">
            <li>If both declare React as shared with requiredVersion: &quot;^18.0.0&quot;, the highest compatible version (18.3.0) is used by both.</li>
            <li>If singleton: true is set, only one copy loads. If versions are incompatible, a runtime warning is logged.</li>
            <li>If strictVersion: true is set, an incompatible version throws an error instead of a warning.</li>
            <li>If eager: true is set, the dependency is loaded immediately (not async), useful for libraries that must be available before the first render.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Independence</strong></td>
              <td className="p-3">
                • Independent build and deploy per application<br />
                • Teams choose their own build tools and configs<br />
                • No coordination needed for most changes
              </td>
              <td className="p-3">
                • Shared dependency version conflicts at runtime<br />
                • Remote failures require error boundary handling<br />
                • Debugging crosses application boundaries
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Performance</strong></td>
              <td className="p-3">
                • Shared dependencies loaded once across all remotes<br />
                • Remote modules loaded on demand (lazy)<br />
                • CDN caching per remote entry point
              </td>
              <td className="p-3">
                • Waterfall loading (host → remoteEntry → chunks)<br />
                • Cold start latency for first remote load<br />
                • No tree-shaking across federation boundaries
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Developer Experience</strong></td>
              <td className="p-3">
                • Use remote modules as if they were local imports<br />
                • TypeScript types can be generated/shared<br />
                • Works with existing webpack ecosystem
              </td>
              <td className="p-3">
                • Complex webpack configuration<br />
                • Difficult to debug version negotiation issues<br />
                • Limited IDE support for remote module types
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Reliability</strong></td>
              <td className="p-3">
                • Independent deployments reduce blast radius<br />
                • Rollback a remote without affecting host<br />
                • A/B testing different remote versions easily
              </td>
              <td className="p-3">
                • Remote CDN outages break host features<br />
                • Version mismatches cause runtime errors<br />
                • No build-time validation of remote compatibility
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use Error Boundaries Around Remote Components:</strong> Remote modules can fail to
            load (CDN down, version incompatible, network error). Wrap every remote component in a React
            Error Boundary with a fallback UI. This prevents a single remote failure from crashing the
            entire host application.
          </li>
          <li>
            <strong>Enforce Singleton for Framework Libraries:</strong> React and React DOM must be
            singletons — multiple copies cause hooks to break with &quot;Invalid hook call&quot; errors.
            Always set singleton: true for React, React DOM, and router libraries in the shared
            configuration.
          </li>
          <li>
            <strong>Version-Lock Critical Shared Dependencies:</strong> Use requiredVersion with a tight
            range for shared dependencies that have breaking changes between minor versions. For less
            critical shared dependencies, use loose ranges to maximize sharing opportunities.
          </li>
          <li>
            <strong>Implement Health Checks for Remotes:</strong> Before loading a remote&apos;s entry
            point, check if the remote&apos;s CDN is reachable. If not, skip the remote and render
            fallback UI. This prevents the host from hanging on unresolvable remote requests.
          </li>
          <li>
            <strong>Use Dynamic Remotes for Flexibility:</strong> Instead of hardcoding remote URLs in
            webpack config, load remote configuration from a service at runtime. This enables A/B testing
            different remote versions, environment-specific remote URLs, and gradual rollouts without
            rebuilding the host.
          </li>
          <li>
            <strong>Share TypeScript Types Across Boundaries:</strong> Use a shared types package or
            Module Federation 2.0&apos;s type generation to ensure type safety across host-remote
            boundaries. Without shared types, remote modules are typed as any, losing all type safety.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Multiple React Instances:</strong> The most common Module Federation bug. If React is
            not configured as a singleton shared dependency, the host and remotes may each load their own
            copy. This causes &quot;Invalid hook call&quot; errors because hooks rely on React&apos;s
            internal state, which is per-instance. Always configure React and ReactDOM as singleton: true.
          </li>
          <li>
            <strong>Waterfall Loading:</strong> Loading a remote follows a waterfall: host bundle → remote
            entry → remote chunks. Each step is a network request. For deeply nested remote dependencies,
            this waterfall can add seconds to initial load. Mitigate with preloading (link rel=&quot;preload&quot;
            for remote entries) and prefetching.
          </li>
          <li>
            <strong>No Build-Time Validation:</strong> Module Federation resolves modules at runtime, so
            there is no build-time check that a remote exposes the expected modules or that shared
            dependency versions are compatible. Issues manifest as runtime errors in production. Use
            contract testing and type generation to catch issues before deployment.
          </li>
          <li>
            <strong>CSS Conflicts:</strong> Remote modules may bring their own CSS that conflicts with the
            host&apos;s styles. Global styles, class name collisions (especially with CSS Modules hash
            collisions), and specificity wars are common. Use CSS-in-JS with unique class names or CSS
            Modules with project-specific prefixes.
          </li>
          <li>
            <strong>Shared State Without Coordination:</strong> Two federated applications sharing a global
            store (Redux, Zustand) without agreement on the state shape create coupling that defeats the
            purpose of independent deployment. Use event-based communication or well-defined shared
            state contracts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>E-Commerce Platforms:</strong> Large e-commerce sites use Module Federation to
            independently deploy the product catalog, shopping cart, checkout, and account management
            as separate federated applications. Teams own their domains end-to-end with shared UI
            components loaded from a design system remote.
          </li>
          <li>
            <strong>Enterprise Dashboards:</strong> Business intelligence dashboards compose widgets from
            different teams — each widget is a federated remote that can be updated independently. The
            dashboard host loads widget remotes based on user configuration.
          </li>
          <li>
            <strong>Multi-Team SaaS Products:</strong> SaaS products like Salesforce or HubSpot where
            different teams own different application areas (CRM, marketing, support) use federation to
            compose these areas into a unified application while maintaining deployment independence.
          </li>
          <li>
            <strong>Gradual Framework Migrations:</strong> Organizations migrating from Angular to React
            use Module Federation to run both frameworks simultaneously — the Angular host loads React
            remotes (or vice versa), enabling incremental migration without big-bang rewrites.
          </li>
          <li>
            <strong>Plugin Marketplaces:</strong> Applications with user-installable plugins use Module
            Federation to load plugin code at runtime from a CDN. The host exposes shared dependencies
            (React, the application&apos;s component library) and plugins consume them through the shared
            scope.
          </li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://webpack.js.org/concepts/module-federation/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              webpack — Module Federation Documentation
            </a>
          </li>
          <li>
            <a href="https://module-federation.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Module Federation Official Site — Module Federation 2.0
            </a>
          </li>
          <li>
            <a href="https://www.rspack.dev/guide/features/module-federation" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Rspack — Module Federation Support
            </a>
          </li>
          <li>
            <a href="https://github.com/module-federation/module-federation-examples" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Module Federation Examples Repository
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Module Federation differ from npm packages for code sharing?</p>
            <p className="mt-2 text-sm">
              A: npm packages are resolved at build time — consumers install a specific version, and the
              package is bundled into the consumer&apos;s build. Changes require publishing a new version
              and updating all consumers. Module Federation resolves at runtime — the host loads the
              remote&apos;s latest deployed code at runtime. Changes to a remote are immediately available
              to all hosts without rebuilding. Trade-off: npm provides build-time type checking and
              guaranteed compatibility; Module Federation provides deployment independence but defers
              compatibility checking to runtime.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does shared dependency version negotiation work?</p>
            <p className="mt-2 text-sm">
              A: Each federated application declares shared dependencies with version ranges in its webpack
              config. At runtime, the shared scope collects all available versions. For each dependency:
              (1) if singleton is true, only the highest compatible version is loaded; (2) if multiple
              compatible versions exist, each consumer uses the highest version that satisfies its range;
              (3) if no compatible version exists, each consumer falls back to its own bundled copy. The
              negotiation happens during the init() phase when remotes join the shared scope.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when a remote fails to load?</p>
            <p className="mt-2 text-sm">
              A: If the remoteEntry.js fails to load (CDN down, 404, network error), the dynamic import
              that loads the remote module rejects with a ChunkLoadError. Without error handling, this
              crashes the host application. The solution is: (1) wrap remote imports in React Error
              Boundaries with fallback UI, (2) use React.lazy() with a Suspense fallback for loading
              states, (3) implement a pre-check that verifies remote availability before attempting to
              load, (4) configure retry logic with exponential backoff for transient failures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure type safety across Module Federation boundaries?</p>
            <p className="mt-2 text-sm">
              A: Three approaches: (1) Shared types package — publish TypeScript types for exposed modules
              as an npm package that both host and remote depend on. Types are build-time dependencies
              even when code is loaded at runtime. (2) Module Federation 2.0 type generation —
              automatically generates TypeScript declaration files from remote modules and makes them
              available to hosts. (3) Contract testing — write tests that verify the remote&apos;s exposed
              modules match the expected interface, run in CI for both host and remote repos.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose Module Federation over other micro-frontend approaches?</p>
            <p className="mt-2 text-sm">
              A: Choose Module Federation when: (1) you need runtime code sharing with deduplication of
              large dependencies like React, (2) you want deployment independence without duplicating
              framework code, (3) the teams already use webpack and want a built-in solution, (4) you
              need bidirectional sharing (app A uses app B&apos;s components and vice versa). Choose
              alternatives when: you need framework agnosticism (iframes, Web Components), you want
              simpler setup (import maps), you need guaranteed isolation (iframes), or you are not
              using webpack (though Rspack and Vite plugins now support it).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
