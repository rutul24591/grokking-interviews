"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-monorepo-store-boundaries",
  title: "Design Store Boundaries in Monorepos",
  description:
    "Production-grade store boundaries for monorepos — per-package stores, cross-package state sharing, package-level contracts, and micro-frontend state isolation.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "monorepo-store-boundaries",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "monorepo", "store-boundaries", "micro-frontends", "package-contracts", "state-isolation"],
  relatedTopics: ["scalable-global-state-architecture", "api-versioning-frontend"],
};

export default function MonorepoStoreBoundariesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          In a monorepo with multiple packages (UI library, auth package, dashboard
          package, settings package), each package needs its own state but also
          needs to share some state across packages. Without clear boundaries,
          packages import each other&apos;s stores directly, creating circular
          dependencies, tight coupling, and preventing independent deployment.
          We need a store boundary design that gives each package autonomy while
          enabling safe cross-package state sharing through well-defined contracts.
        </p>
        <p><strong>Assumptions:</strong> React 19+, monorepo with 10+ packages, micro-frontend architecture.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Per-Package Stores:</strong> Each package owns its Zustand store. Other packages cannot import it directly.</li>
          <li><strong>Cross-Package State Sharing:</strong> Shared state via a contracts package — interfaces only, no implementation. Packages implement contracts, consumers read via contract interfaces.</li>
          <li><strong>Event-Based Communication:</strong> Cross-package state changes communicated via typed event bus, not direct store access.</li>
          <li><strong>Micro-Frontend Isolation:</strong> Each micro-frontend has its own store instances — no shared state between micro-frontends unless explicitly bridged.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Package A needs data from Package B&apos;s store — can&apos;t import directly. Solution: Package B exposes data via contract interface + event bus.</li>
          <li>Two micro-frontends need shared state (auth user). Solution: shared bridge package that both micro-frontends connect to.</li>
          <li>Package version mismatch — Package A expects v1 contract, Package B provides v2. Solution: contract versioning with backward compatibility layer.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Each package has its own Zustand store, private to the package. Cross-package
          state sharing uses a contracts package: TypeScript interfaces defining what
          data each package exposes and consumes. Packages expose their state via
          adapters that implement contract interfaces. Communication between packages
          uses a shared event bus package. Micro-frontends connect via a bridge
          package that manages cross-frontend state synchronization.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Package Store (<code>packages/{'{name}'}/lib/store.ts</code>)</h4>
          <p>Private Zustand store per package. Not exported from package&apos;s public API. Only the package&apos;s own components use it.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Contracts Package (<code>packages/contracts/</code>)</h4>
          <p>TypeScript interfaces defining cross-package state contracts. IAuthProvider, IDashboardDataProvider. No implementation — only types.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Adapter Layer (<code>packages/{'{name}'}/lib/adapter.ts</code>)</h4>
          <p>Implements contract interfaces by wrapping the package&apos;s private store. Exposes contract-compliant API to other packages.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Event Bus Package (<code>packages/event-bus/</code>)</h4>
          <p>Shared typed event bus for cross-package communication. Packages emit events, others subscribe. No direct store imports.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Bridge Package (<code>packages/bridge/</code>)</h4>
          <p>Connects micro-frontends. Manages shared state (auth, theme) across frontend boundaries. Each micro-frontend registers with the bridge.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Import Linter (<code>tools/eslint-plugin-monorepo-boundaries/</code>)</h4>
          <p>ESLint plugin enforcing package boundaries. Blocks cross-package store imports. Allows only contract and event-bus imports between packages.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/monorepo-store-boundaries-architecture.svg"
          alt="Monorepo store boundaries showing per-package stores, contracts package, event bus, and bridge"
          caption="Monorepo Store Boundary Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>Package A stores data → exposes via adapter implementing contract → Package B reads via contract interface. Package A changes data → emits event → Package B handles event, updates its own store. No direct store imports between packages.</p>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: per-package stores, contract interfaces, adapters, event bus, bridge package, and ESLint boundary plugin.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Contract method call</td><td className="p-2">O(1) — direct adapter call</td></tr>
              <tr><td className="p-2">Cross-package event</td><td className="p-2">O(k) — k subscribers</td></tr>
              <tr><td className="p-2">Bridge sync</td><td className="p-2">O(n) — n micro-frontends</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>ESLint plugin prevents boundary violations in CI. Contract interfaces versioned — breaking changes require major version bump. Test: each package&apos;s store in isolation, contract adapter correctness, event-based cross-package flows, boundary violations caught by lint rules.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Direct cross-package store imports:</strong> Creates tight coupling, prevents independent deployment. Fix: contract interfaces + event bus.</li>
          <li><strong>God contract:</strong> One interface with 50+ methods. Fix: granular contracts — one interface per capability (IUserReader, IUserWriter).</li>
          <li><strong>No boundary enforcement:</strong> Boundaries are documented but not enforced. Fix: ESLint plugin in CI, blocks PRs with boundary violations.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle shared state (auth user) across independently deployed micro-frontends?</p>
            <p className="mt-2 post-sm">
              A: Use a bridge pattern: a shared &quot;shell&quot; application that loads
              micro-frontends and provides a shared state bridge. Each
              micro-frontend registers with the bridge, receives a scoped API for
              reading shared state and emitting events. The bridge manages the
              shared store (auth user, theme, locale) and broadcasts changes to
              all registered micro-frontends. Micro-frontends cannot access each
              other&apos;s state directly — only through the bridge.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://nx.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Nx — Monorepo Build System</a></li>
          <li><a href="https://micro-frontends.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Micro-Frontends — Architecture Guide</a></li>
          <li><a href="https://module-federation.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Module Federation — Runtime Code Sharing</a></li>
          <li><a href="https://backstage.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Backstage — Plugin Architecture</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
