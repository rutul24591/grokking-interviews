"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-scalable-global-state",
  title: "Design a Scalable Global State Architecture",
  description:
    "Production-grade global state architecture for large SPAs across multiple teams — multi-store design, domain boundaries, cross-store communication, and team autonomy patterns.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "scalable-global-state-architecture",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "global-state",
    "zustand",
    "multi-store",
    "scalability",
    "team-autonomy",
    "domain-driven",
    "architecture",
  ],
  relatedTopics: [
    "local-vs-global-state-strategy",
    "monorepo-store-boundaries",
    "component-subscription-management",
  ],
};

export default function ScalableGlobalStateArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a global state architecture for a large-scale React
          application (100+ screens, 15+ engineering teams, 500+ components) where
          multiple teams need to manage their own feature state independently while
          occasionally sharing data across team boundaries. A monolithic store becomes
          a bottleneck — merge conflicts, unclear ownership, cascading re-renders,
          and slow CI/CD pipelines. We need a multi-store architecture that gives
          each team autonomy while enabling safe cross-store communication.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with concurrent rendering support.</li>
          <li>15+ engineering teams, each owning 2-4 feature areas.</li>
          <li>Application has distinct domains: user management, dashboard, analytics, billing, notifications, settings.</li>
          <li>Teams deploy independently — state architecture must not create cross-team deployment coupling.</li>
          <li>Performance requirement: no re-render cascades across unrelated feature areas.</li>
          <li>State must be observable in development (DevTools, action logging).</li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Domain-Scoped Stores:</strong> Each feature domain has its own Zustand store with clearly defined ownership. Team A owns UserStore, Team B owns DashboardStore, etc.</li>
          <li><strong>Cross-Store Communication:</strong> Stores can communicate through a typed event bus. Store A emits events, Store B reacts without importing Store A directly.</li>
          <li><strong>Selective Subscriptions:</strong> Components subscribe only to the specific store slices they need. A change in UserStore.name does not re-render components subscribed to UserStore.preferences.</li>
          <li><strong>Shared Kernel State:</strong> Common state (authenticated user, feature flags, locale) is accessible by all stores through a CoreStore that other stores can reference.</li>
          <li><strong>Store Composition:</strong> Stores can compose data from other stores at query time (not at storage time) to avoid data duplication and consistency issues.</li>
          <li><strong>Type Safety:</strong> Full TypeScript across all stores with typed event contracts between stores.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Team Autonomy:</strong> Each team can modify their store&apos;s schema, add actions, and change internal logic without coordinating with other teams (unless the event contract changes).</li>
          <li><strong>Performance:</strong> Store updates are isolated to the affected domain. Cross-store events are batched and debounced to prevent cascading update storms.</li>
          <li><strong>Developer Experience:</strong> Each store has its own DevTools panel, action logger, and test harness. New engineers can understand one store without understanding all stores.</li>
          <li><strong>Deployment Independence:</strong> Stores are in separate packages or modules with clear versioning. A store change in one domain does not require redeploying other domains.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>A store needs data from another store that hasn&apos;t loaded yet — handling async cross-store dependencies.</li>
          <li>Event bus flooding: a buggy store emits 1000 events per second, degrading performance across all stores.</li>
          <li>Store version mismatch: Team A updates their event payload schema but Team B still expects the old schema.</li>
          <li>Circular dependencies: Store A emits an event that Store B handles, which emits an event that Store A handles — infinite loop.</li>
          <li>SSR: stores must be created per-request on the server to avoid cross-request state leakage.</li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The architecture uses a <strong>multi-store, domain-driven design</strong>
          where each feature domain owns its Zustand store. Stores are independent
          modules with no direct imports between them. Cross-store communication
          happens through a typed event bus that defines contracts (event names,
          payload schemas) without coupling implementation details. A CoreStore
          holds shared kernel state (auth user, locale, feature flags) that all
          other stores can read via selectors. Store composition happens at query
          time — when a component needs data from multiple stores, it calls
          selectors from each store and merges the results in the component layer.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Monolithic Redux store with slices:</strong> Single store with Redux Toolkit slices per domain. Pros: unified DevTools, simple mental model, atomic transactions. Cons: all teams modify the same store — merge conflicts, unclear boundaries, every action runs through the same reducer pipeline, slice selectors multiply and become hard to track. At 15+ teams, the store file becomes a coordination nightmare.</li>
          <li><strong>Redux with multiple stores:</strong> Multiple Redux stores combined with combineReducers. Pros: separation of concerns, Redux ecosystem. Cons: combining multiple Redux stores adds significant boilerplate, cross-store communication requires middleware complexity, Redux Toolkit&apos;s opinionated structure fights against multi-store patterns. Zustand is purpose-built for independent stores.</li>
          <li><strong>Atom-based (Jotai/Recoil):</strong> Fine-grained atoms per state field. Pros: granular subscriptions, no store boundaries to design. Cons: at 500+ components, the atom graph becomes unmaintainable — no clear ownership, atoms proliferate without governance, debugging atom dependencies is difficult. Better for smaller apps, not for 15-team scale.</li>
        </ul>
        <p>
          <strong>Why multi-store Zustand is optimal:</strong> Zustand&apos;s create()
          factory produces independent stores with zero coupling between them.
          Each store is a self-contained module with its own state, actions, and
          selectors. The event bus provides loose coupling for cross-store needs.
          Teams own their store&apos;s schema and actions. The architecture scales
          linearly — adding a new team means adding a new store, not modifying
          existing ones. Selector-based subscriptions ensure updates are isolated
          to affected components.
        </p>
      </section>

      {/* Section 4: System Design */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of nine modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Core Store (<code>stores/core-store.ts</code>)</h4>
          <p>Holds shared kernel state: authenticated user, locale, feature flags, app version. All other stores can read from CoreStore via selectors but cannot mutate it. CoreStore is the only store that other stores import directly.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Domain Stores (<code>stores/{'{domain'}/</code>)</h4>
          <p>One Zustand store per feature domain: UserStore, DashboardStore, AnalyticsStore, BillingStore, NotificationStore, SettingsStore. Each store encapsulates its state shape, actions, and selectors. No domain store imports another domain store.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Event Bus (<code>lib/event-bus.ts</code>)</h4>
          <p>Typed event emitter using a custom implementation (or Mitt). Events are namespaced by domain (<code>user:updated</code>, <code>dashboard:refresh</code>). Each event has a Zod-validated payload schema. Stores emit events to notify other domains; stores subscribe to relevant events in their initialization.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Event Contract Registry (<code>lib/event-contracts.ts</code>)</h4>
          <p>Central registry defining event names, payload schemas (Zod), version, and emitting/consuming stores. Acts as the API contract between stores. When a store changes its event payload, the contract version increments and consumers must handle both old and new versions during the transition.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Store Composer Hook (<code>hooks/use-store-composer.ts</code>)</h4>
          <p>Hook that composes data from multiple stores at query time. Accepts an array of selector functions from different stores and returns a merged result. Uses useMemo to prevent recalculation unless any source store changes.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Event Rate Limiter (<code>lib/event-rate-limiter.ts</code>)</h4>
          <p>Middleware wrapping the event bus that limits event frequency per event type (max 50/second). Prevents a buggy store from flooding the bus. Throttled events are coalesced — only the latest event payload is delivered after the throttle window.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. SSR Store Factory (<code>lib/ssr-store-factory.ts</code>)</h4>
          <p>Creates fresh store instances per server-side request to prevent cross-request state leakage. On the client, stores are singletons. Factory detects environment and returns request-scoped stores on server, module-scoped singletons on client.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. Store DevTools Middleware (<code>lib/store-devtools.ts</code>)</h4>
          <p>Redux DevTools integration per store. Each store registers with a unique DevTools instance named after its domain. Provides action logging, time-travel debugging, and state inspection. Development-only module, tree-shaken in production.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">9. Store Health Monitor (<code>lib/store-health-monitor.ts</code>)</h4>
          <p>Development tool that tracks store update frequency, subscriber count, and cross-store event latency. Logs warnings when a store updates more than 100 times per second (potential infinite loop) or when an event handler takes more than 50ms (performance concern).</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management Architecture</h3>
        <p>
          The architecture follows domain-driven store boundaries. Each domain store
          is an independent Zustand store created with create(). Stores do not import
          each other — they communicate through the event bus. The CoreStore is the
          exception: it holds shared kernel state that all stores can read. Store
          composition happens at the component layer — a dashboard component that
          needs user data and analytics data calls useUserStore and
          useAnalyticsStore separately, merging results with useMemo. The event bus
          handles side effects: when UserStore updates a user profile, it emits
          &apos;user:updated&apos;, and DashboardStore reacts by refreshing cached
          user display data.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/scalable-global-state-architecture-architecture.svg"
          alt="Multi-store architecture showing domain stores, core store, event bus, and cross-store communication patterns"
          caption="Multi-Store Global State Architecture"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Application initializes: CoreStore loads auth state and feature flags. Each domain store initializes with its default state.</li>
          <li>Domain stores register event listeners for events they care about (e.g., DashboardStore listens to &apos;user:updated&apos;).</li>
          <li>User triggers an action in Domain A (e.g., updates profile in UserStore).</li>
          <li>UserStore processes the update, mutates its state, and emits &apos;user:updated&apos; event with the changed user data.</li>
          <li>Event bus delivers the event to all subscribers: DashboardStore receives it and refreshes its cached display name.</li>
          <li>Components subscribed to UserStore selectors re-render with the new data. Components subscribed to DashboardStore re-render if their selector result changed.</li>
          <li>Event rate limiter monitors event frequency. If &apos;user:updated&apos; exceeds 50/second, it coalesces events and delivers only the latest.</li>
          <li>Store health monitor logs metrics: update counts, subscriber counts, event latency. Development dashboard shows real-time store activity.</li>
        </ol>
      </section>

      {/* Section 5: Data Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow within each store is synchronous and unidirectional: action →
          state mutation → selector notifications → component re-renders. Cross-store
          flow is asynchronous via the event bus: store emits → event bus validates
          schema → rate limiter checks frequency → subscribers handle asynchronously.
          The CoreStore is read-only for domain stores — they use selectors but never
          dispatch mutations to it.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Cross-store async dependencies:</strong> Store A needs data from Store B that hasn&apos;t loaded yet. Solution: Store A&apos;s event handler checks if Store B&apos;s data is ready (via a ready-state selector). If not ready, it queues the handler to retry after Store B emits a ready event. This ensures eventual consistency without blocking.</li>
          <li><strong>Event bus flooding:</strong> A buggy store emits 1000 events/second. The rate limiter detects the spike, throttles to 50/second, and coalesces payloads (keeping only the latest). It also logs a warning to the dev console with the offending store name and event type. In production, the rate limiter silently drops excess events to prevent cascading degradation.</li>
          <li><strong>Event schema version mismatch:</strong> Team A updates their &apos;user:updated&apos; payload from v1 to v2. The event contract registry supports both versions. Consumers check the version field and handle accordingly. During a transition period (2 deployment cycles), the emitter sends both v1 and v2 payloads. After transition, v1 support is removed.</li>
          <li><strong>Circular event dependencies:</strong> Store A emits event → Store B handles and emits event → Store A handles and emits event → infinite loop. Prevention: the event bus tracks the call stack depth per event chain. If depth exceeds 10, it breaks the chain and logs a circular dependency error with the event chain trace. Engineers must redesign the interaction to use a single coordinated action.</li>
          <li><strong>SSR state leakage:</strong> On the server, stores are created per-request using the SSR factory. Each request gets isolated store instances. After the response is rendered, stores are garbage collected. On the client, stores are module-scoped singletons initialized once at app startup.</li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes:
            CoreStore with shared kernel state, 6 domain stores with
            typed selectors, event bus with rate limiting, event contract
            registry with Zod validation, SSR factory, and DevTools integration.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Core Store</h3>
        <p>
          The CoreStore holds state that every feature domain needs: the authenticated
          user object (id, name, role, permissions), locale, feature flags map, and
          app metadata. It exposes read selectors only — domain stores import
          useCoreStore and call selectors like useCoreStore.select.userId. Mutations
          to CoreStore happen through dedicated actions (login, logout, setLocale)
          that are only called from auth flows and user settings.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Domain Stores</h3>
        <p>
          Each domain store is a Zustand create() call with a typed state interface
          and action methods. Stores are organized in subdirectories:
          stores/user/, stores/dashboard/, stores/analytics/. Each store exports
          the store hook and individual selector hooks: useUserStore,
          useUserStore.select.displayName, useUserStore.select.email. Actions are
          typed to accept validated payloads. Stores do not import other domain
          stores — they emit events for cross-domain needs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Event Bus</h3>
        <p>
          A typed event emitter with namespace support. Events are strings with
          colon-separated domains: &apos;user:updated&apos;, &apos;dashboard:refresh&apos;,
          &apos;analytics:aggregate&apos;. The bus provides emit(eventName, payload),
          on(eventName, handler), and off(eventName, handler) methods. Handlers
          are called asynchronously (Promise.resolve().then) to prevent blocking
          the emitting store&apos;s update cycle.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Event Contract Registry</h3>
        <p>
          Central configuration object defining every cross-store event. Each entry
          includes: event name, Zod schema for the payload, current version,
          emitting store, and list of consuming stores. When an event is emitted,
          the bus validates the payload against the schema. Invalid payloads are
          rejected with a detailed error. Version mismatches trigger a warning and
          attempt graceful degradation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Store Composer Hook</h3>
        <p>
          The useStoreComposer hook accepts a function that receives selectors from
          multiple stores and returns a composed result. Internally, it calls each
          store&apos;s selector, memoizes the results with useMemo, and returns the
          merged object. This is the recommended pattern for components that need
          cross-store data — instead of stores duplicating data, components compose
          it at query time.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Event Rate Limiter</h3>
        <p>
          Wraps the event bus emit method with a token bucket algorithm. Each event
          type gets a bucket with 50 tokens, refilling at 50/second. When tokens
          are exhausted, events are coalesced — only the latest payload is kept and
          delivered when the bucket refills. The limiter maintains a debug log of
          throttled events with counts and timestamps.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: SSR Store Factory</h3>
        <p>
          Detects the environment via typeof window. On the server, createSSRStore()
          returns a factory function that creates a fresh store instance. Each request
          handler calls the factory to get request-scoped stores. On the client,
          the factory returns the singleton module-scoped store. This prevents
          cross-request state leakage on the server while maintaining singleton
          behavior on the client.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Store DevTools</h3>
        <p>
          Each store connects to Redux DevTools via zustand/middleware. The DevTools
          instance is named after the store domain (e.g., &quot;UserStore&quot;,
          &quot;DashboardStore&quot;). Actions are logged with timestamps and payload
          previews. Time-travel debugging works per-store. In production, the
          devtools import resolves to a no-op module.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Store Health Monitor</h3>
        <p>
          Development middleware that wraps each store&apos;s setState. It tracks:
          update frequency (updates per second), subscriber count, average handler
          duration, and cross-store event chain depth. Warnings fire when: update
          frequency exceeds 100/second, subscriber count exceeds 200, handler takes
          more than 50ms, or event chain depth exceeds 10. All metrics are available
          in a development dashboard panel.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Store state mutation</td>
                <td className="p-2">O(1) — direct mutation</td>
                <td className="p-2">O(s) — s = store state size</td>
              </tr>
              <tr>
                <td className="p-2">Selector notification check</td>
                <td className="p-2">O(k) — k subscribers with Object.is</td>
                <td className="p-2">O(k) — subscription list</td>
              </tr>
              <tr>
                <td className="p-2">Event bus emit + deliver</td>
                <td className="p-2">O(m) — m event handlers</td>
                <td className="p-2">O(m) — handler queue</td>
              </tr>
              <tr>
                <td className="p-2">Event payload validation (Zod)</td>
                <td className="p-2">O(p) — p = payload fields</td>
                <td className="p-2">O(p) — validation result</td>
              </tr>
              <tr>
                <td className="p-2">Store composer (n stores)</td>
                <td className="p-2">O(n) — n selector calls</td>
                <td className="p-2">O(n) — merged result object</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Cross-store event cascade:</strong> When Store A emits an event that triggers Store B to emit another event, cascading events can multiply. With 6 stores, a single user action can trigger 6-12 events. Mitigation: the event rate limiter coalesces events, and the health monitor breaks circular chains. Design stores to batch related changes into a single event rather than emitting per-field changes.</li>
          <li><strong>Store composer recalculation:</strong> A component using useStoreComposer with 5 stores recalculates when any of the 5 stores changes. If the component is rendered frequently, this adds up. Mitigation: split the composer into smaller compositions — one hook per logical data group rather than one mega-composer. Use React.memo on the component to skip re-renders when the composed result is unchanged.</li>
          <li><strong>Zod validation on hot path:</strong> Validating every event payload with Zod adds CPU overhead. At 1000 events/second across all stores, this is measurable. Mitigation: in production, skip validation for trusted internal events (same-store emissions). Only validate cross-store events where the payload source is untrusted. Use a faster validation library (like valibot) if Zod becomes a bottleneck.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Selector referential stability:</strong> Zustand selectors must return stable references. If a selector returns a new object wrapping state.user on every call, Object.is fails even when user hasn&apos;t changed. Solution: return the state slice directly (state.user) rather than wrapping it. For computed values, use useMemo in the component layer, not in the selector.</li>
          <li><strong>Event batching:</strong> When a store performs multiple mutations in one action, emit a single batched event at the end rather than one event per mutation. For example, &apos;user:profileUpdated&apos; instead of &apos;user:nameChanged&apos; + &apos;user:emailChanged&apos; + &apos;user:avatarChanged&apos;.</li>
          <li><strong>Lazy store initialization:</strong> Domain stores for rarely-visited pages (e.g., BillingStore for the billing settings page) should use lazy initialization — create the store only when the route is first visited. This reduces initial bundle parse time and memory footprint for users who never visit those pages.</li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          All store actions validate their input payloads with Zod schemas before
          committing state changes. This prevents malformed data from corrupting the
          store. Cross-store events are validated against the event contract registry
          — a store cannot send arbitrary payloads through the event bus. The CoreStore
          validates auth state changes to prevent unauthorized role or permission
          modifications.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Store Access Controls</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Read-Only Cross-Store Access</h4>
          <p>
            Domain stores can read from CoreStore via selectors but cannot mutate it.
            This is enforced by convention (code review) and by the CoreStore&apos;s
            API design — it only exports read selectors, not action methods. Teams
            cannot bypass this because the CoreStore actions module is in a separate
            package with restricted import access (enforced by ESLint import/no-restricted-paths).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Event Payload Sanitization</h4>
          <p>
            Event payloads are sanitized by Zod&apos;s transform feature — extraneous
            fields are stripped, strings are trimmed, and dangerous values (script
            tags in user-generated content) are escaped. This prevents XSS when event
            data is rendered in components that received it from the event bus.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Event bus rate limiting:</strong> The rate limiter prevents any single event type from exceeding 50 emissions per second. This protects against both buggy stores (infinite loops) and malicious stores (if a compromised store tries to flood the bus). Excess events are dropped silently in production, logged in development.</li>
          <li><strong>Store mutation auditing:</strong> In development, every store mutation is logged with the call stack trace. This makes it impossible for a store to mutate state without a traceable origin. In production, critical stores (CoreStore, BillingStore) have audit logging enabled for compliance.</li>
          <li><strong>Circular dependency detection:</strong> The event bus maintains a call stack per event chain. If the stack depth exceeds 10, the chain is broken and an error is thrown. This prevents infinite loops that could degrade performance or crash the application.</li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Individual store actions:</strong> Test each store&apos;s actions mutate state correctly, handle edge cases (empty inputs, boundary values), and emit the correct events. Test selectors return correct slices with Object.is stability.</li>
          <li><strong>Event bus:</strong> Test emit delivers to all subscribers, off removes listeners, rate limiter throttles correctly, and schema validation rejects invalid payloads with descriptive errors.</li>
          <li><strong>Event contract registry:</strong> Test all registered events have valid Zod schemas, version numbers are sequential, and the registry detects breaking schema changes (field removals without version bump).</li>
          <li><strong>SSR factory:</strong> Test that two calls to the factory return independent store instances. Mutating store A does not affect store B. Verify garbage collection after request completion.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Cross-store event flow:</strong> Trigger an action in UserStore, verify the &apos;user:updated&apos; event is emitted, verify DashboardStore receives and processes it, and verify components subscribed to both stores re-render with correct merged data.</li>
          <li><strong>Store composer:</strong> Render a component using useStoreComposer with 3 stores. Update each store independently and verify the component receives the correct composed result. Verify useMemo prevents recalculation when unrelated stores change.</li>
          <li><strong>Rate limiter under load:</strong> Emit 1000 events in 1 second, verify only 50 are delivered, verify coalescing keeps the latest payload, and verify the debug log captures the throttle event.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>Circular event dependency: create two stores that emit events triggering each other. Verify the event bus breaks the chain at depth 10 and logs the error with the full event chain trace.</li>
          <li>Event schema version mismatch: emit a v2 payload to a v1 consumer. Verify the consumer handles gracefully (logs warning, uses fallback values, does not crash).</li>
          <li>SSR state leakage: render two requests concurrently with different user states. Verify each response contains the correct user data without cross-contamination.</li>
          <li>Performance regression: measure component re-render count before and after adding a new store. Alert if re-render count increases by more than 15% for existing components.</li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Designing a monolithic store for multi-team apps:</strong> Candidates default to a single Redux/Zustand store with slices. Interviewers push back: &quot;What happens when 15 teams modify the same store?&quot; Candidates must recognize the coordination overhead, merge conflicts, and unclear ownership. The correct answer: domain-scoped stores with event-based communication.</li>
          <li><strong>Direct store imports between domains:</strong> Candidates have DashboardStore import UserStore to read user data. Interviewers flag this as tight coupling — DashboardStore now depends on UserStore&apos;s existence and schema. The correct answer: event bus for notifications, CoreStore selectors for shared data, component-layer composition for queries.</li>
          <li><strong>Not considering event-driven failure modes:</strong> Candidates describe the happy path but cannot answer &quot;What if an event handler throws?&quot; or &quot;What if the event bus is flooded?&quot; Interviewers expect error boundaries around event handlers, rate limiting, and circuit breakers for failing event consumers.</li>
          <li><strong>Ignoring SSR implications:</strong> For SSR applications, candidates design client-only singleton stores. Interviewers ask: &quot;What happens when two requests hit the server concurrently?&quot; The correct answer: per-request store factory on the server, singleton on the client, with environment detection.</li>
          <li><strong>No event contract versioning:</strong> Candidates design events but don&apos;t consider schema evolution. Interviewers ask: &quot;Team A changes the event payload — how does Team B know?&quot; The correct answer: event contract registry with Zod schemas, version numbers, and backward-compatible transitions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Event Bus vs Direct Store Imports</h4>
          <p>
            Direct imports (DashboardStore imports UserStore) are simpler — you get
            type safety, synchronous access, and no event overhead. But they create
            tight coupling: DashboardStore breaks if UserStore changes its API, and
            testing DashboardStore requires mocking UserStore. The event bus adds
            indirection — stores communicate through typed events without knowing
            about each other. The trade-off: looser coupling and team autonomy vs
            eventual consistency and harder-to-trace data flow. At 15+ teams, the
            event bus is the correct choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Store Composition: Query-Time vs Storage-Time</h4>
          <p>
            Storage-time composition: stores duplicate data from other stores
            (DashboardStore caches user.displayName). Pros: fast reads, no cross-store
            queries at render time. Cons: data duplication, consistency challenges
            (user changes name, DashboardStore must be notified). Query-time composition:
            components call selectors from multiple stores and merge results. Pros:
            single source of truth, no duplication, automatic consistency. Cons:
            slightly more work at render time (mitigated by useMemo). For 15+ teams,
            query-time composition is strongly preferred — the consistency cost of
            storage-time duplication is not worth the marginal render-time savings.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle a situation where Store A needs real-time data from Store B, but Store B updates frequently?</p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) Store A subscribes to Store B&apos;s selector
              directly (via CoreStore if it&apos;s shared data). This gives real-time
              access but couples Store A to Store B&apos;s update frequency. (2) Store
              B emits a debounced event (e.g., &apos;dashboard:stateChanged&apos; at
              max 1/second) and Store A reacts to that. Approach (1) is better for
              truly shared data (locale, auth user). Approach (2) is better for
              domain-specific data that other stores occasionally need. I default to
              (2) to maintain store isolation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you migrate from a monolithic Redux store to this multi-store architecture without breaking the application?</p>
            <p className="mt-2 text-sm">
              A: Strangler fig pattern. (1) Create the CoreStore and migrate shared
              state (auth user, locale) first. (2) For each domain, create a new
              Zustand store and build a bridge: the store reads from Redux on init,
              and writes to both Redux and Zustand during the transition. (3) Migrate
              components one domain at a time — they switch from Redux selectors to
              Zustand selectors. (4) Once all components in a domain use Zustand,
              remove the Redux slice for that domain. (5) Repeat for all domains.
              (6) Remove Redux entirely. The bridge ensures zero downtime during
              migration — both stores stay in sync.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test cross-store interactions without testing implementation details?</p>
            <p className="mt-2 text-sm">
              A: Test through the public API: events and selectors. Given Store A
              emits &apos;user:updated&apos; with payload X, verify Store B&apos;s
              state changes to Y. Do not test Store B&apos;s internal event handler
              — test the observable outcome. Use integration tests that render a
              component depending on both stores, trigger an action in Store A, and
              assert the component shows the correct data from Store B. Mock the
              event bus only when testing a single store in isolation — for
              cross-store tests, use the real event bus.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide what goes in CoreStore vs a domain store?</p>
            <p className="mt-2 text-sm">
              A: Decision criteria: (1) Is this data consumed by 3+ different
              domains? If yes → CoreStore. (2) Does this data affect routing or
              authorization decisions? If yes → CoreStore. (3) Is this data specific
              to one feature area? If yes → domain store. (4) Would removing this
              data break multiple unrelated features? If yes → CoreStore. Examples:
              auth user (CoreStore — consumed by routing, dashboard, settings,
              billing), locale (CoreStore — affects all rendering), dashboard widget
              layout (DashboardStore — only dashboard cares), notification preferences
              (SettingsStore — only settings page edits them, but other stores read
              them via CoreStore-sync).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle optimistic updates in a multi-store architecture?</p>
            <p className="mt-2 text-sm">
              A: The domain store performing the mutation handles the optimistic
              update locally. For example, UserStore.optimisticUpdateProfile(pendingData)
              immediately updates its state. If the API call succeeds, the optimistic
              state is confirmed (or replaced with server data). If it fails,
              UserStore rolls back to the previous state. Other stores are not
              involved in the optimistic path — they only react to the final
              &apos;user:updated&apos; event after the API confirms. This keeps the
              optimistic flow fast (no cross-store coordination) and correct
              (rollback is local).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle store initialization when stores depend on async data (e.g., fetching user profile on app load)?</p>
            <p className="mt-2 text-sm">
              A: CoreStore has an initialize() action that fetches auth user, feature
              flags, and locale from the server. Domain stores have a &apos;ready&apos;
              flag that starts as false. When CoreStore finishes initialization, it
              emits core:ready. Domain stores listen to this event and perform their own initialization (fetching domain-specific data). When a domain store finishes, it sets ready=true and emits a ready event with its domain name. Components show loading states until the stores they depend on are ready. This creates an initialization cascade: CoreStore → Domain Stores → UI, with parallel fetching within each phase.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://zustand.docs.pmnd.rs/guides/typescript" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — TypeScript Guide
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/bliki/DomainDrivenDesign.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Domain-Driven Design — Martin Fowler
            </a>
          </li>
          <li>
            <a href="https://www.event-driven.io/en/how_to_design_events_in_event_sourcing/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Event-Driven Architecture Design Principles
            </a>
          </li>
          <li>
            <a href="https://redux.js.org/usage/structuring-reducers/normalizing-state-shape" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux — Normalizing State Shape
            </a>
          </li>
          <li>
            <a href="https://www.strangefigure.com/posts/multi-store-state-management" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Multi-Store State Management Patterns
            </a>
          </li>
          <li>
            <a href="https://zod.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zod — TypeScript-First Schema Validation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
