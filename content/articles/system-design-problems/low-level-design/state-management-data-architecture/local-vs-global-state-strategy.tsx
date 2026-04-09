"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-local-vs-global-state",
  title: "When to Use Local vs Global State",
  description:
    "Production-grade state boundary design for large SPAs — decision framework for local state, Context API, Zustand, Redux, and Jotai with real-world architecture patterns.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "local-vs-global-state-strategy",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "state-management",
    "local-state",
    "global-state",
    "context-api",
    "zustand",
    "redux",
    "architecture",
    "decision-framework",
  ],
  relatedTopics: [
    "scalable-global-state-architecture",
    "component-subscription-management",
    "monorepo-store-boundaries",
  ],
};

export default function LocalVsGlobalStateStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a state management strategy for a large-scale React
          application (50+ screens, 10+ engineering teams, 100+ components) where
          state is scattered across the application. The challenge is determining
          which state should live locally within components, which should be lifted
          to Context API, and which should live in a global store (Zustand, Redux,
          Jotai). Making the wrong decision leads to over-engineering (globalizing
          everything), prop drilling hell (keeping everything local), or re-render
          storms (improper Context usage).
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with concurrent features support.</li>
          <li>Application has multiple feature areas (dashboard, settings, analytics, user management).</li>
          <li>Team size: 10+ engineers working on the codebase simultaneously.</li>
          <li>Performance requirement: 60fps interactions, no unnecessary re-renders across unrelated components.</li>
          <li>State persistence requirements vary — some state is session-only, some persists across sessions.</li>
          <li>Application uses React Router for client-side routing.</li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Local State:</strong> Component-scoped state (form inputs, toggle states, loading indicators) managed via useState/useReducer within the component that owns it.</li>
          <li><strong>Context API:</strong> Mid-level state shared by a subtree of components (theme, locale, feature flags, user preferences) without prop drilling.</li>
          <li><strong>Global Store:</strong> Application-wide state accessed from anywhere (authenticated user, dashboard data, notifications, cross-feature data).</li>
          <li><strong>Decision Framework:</strong> Clear, documented criteria for engineers to decide where new state should live.</li>
          <li><strong>Cross-Boundary Communication:</strong> Mechanisms for local, Context, and global state to interact when boundaries overlap.</li>
          <li><strong>Type Safety:</strong> Full TypeScript across all state layers with no <code>any</code> types.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Components re-render only when their subscribed state changes. No re-render cascades to unrelated subtrees.</li>
          <li><strong>Scalability:</strong> Architecture supports 500+ components without state management becoming a bottleneck.</li>
          <li><strong>Developer Experience:</strong> Engineers can add new state without understanding the entire state graph. Clear conventions and linting rules.</li>
          <li><strong>Maintainability:</strong> State location is discoverable. Debugging tools (Redux DevTools, Zustand middleware) available for global state.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>A component starts with local state but later needs to be accessed by a distant sibling — migration path without rewriting.</li>
          <li>Context value changes frequently (e.g., mouse position) causing re-render storms in all consumers.</li>
          <li>Global store grows too large — monolithic store becomes a bottleneck for team autonomy.</li>
          <li>SSR hydration: server-rendered state must match client state, especially for theme/locale determined on the client.</li>
          <li>State from a lazy-loaded feature module needs to interact with eagerly-loaded core state.</li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>layered state architecture</strong> where state
          lives at the lowest level that satisfies its sharing requirements. We use
          a decision framework: if state is consumed by one component, it stays local.
          If consumed by a subtree, it uses Context. If consumed across unrelated
          branches or the entire app, it uses a global store. Each layer has distinct
          tools: useState/useReducer for local, React.createContext for mid-range,
          and Zustand for global.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Redux-only (monolithic store):</strong> Everything goes through Redux. Pros: single source of truth, excellent DevTools, predictable state transitions. Cons: boilerplate-heavy, forces global pattern on local concerns, every state change triggers React reconciliation unless carefully memoized. Interviewers flag this as over-engineering for component-scoped state.</li>
          <li><strong>Context-everything:</strong> Replace all state with Context providers. Pros: no external dependencies, built into React. Cons: Context triggers re-renders in all consumers on any value change — catastrophic for frequently-updating state. No selector support in React 18 (improved in React 19 with useContextSelector patterns, but still not atomic). Poor performance at scale.</li>
          <li><strong>Component state only (no global):</strong> Lift state up through props. Pros: explicit data flow, easy to trace. Cons: prop drilling through 5-7 levels of components, makes refactoring painful, couples unrelated components through intermediate prop pass-throughs.</li>
        </ul>
        <p>
          <strong>Why layered approach is optimal:</strong> It matches the natural
          topology of UI state — most state is truly local (form inputs, toggles,
          loading flags), some is subtree-scoped (theme, locale), and a small
          fraction is truly global (auth user, notifications). By placing state at
          the minimum scope that satisfies its consumers, we minimize re-render
          surface area, reduce cognitive load, and give teams autonomy over their
          feature state. Zustand is chosen for global state over Redux because of
          its selector-based subscription model (avoids unnecessary re-renders),
          minimal boilerplate, and built-in middleware support.
        </p>
      </section>

      {/* Section 4: System Design */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. State Decision Matrix (<code>lib/state-decisions.ts</code>)</h4>
          <p>Pure functions that classify state: <code>classifyState(consumers, frequency, persistence, scope)</code> returns {`'local' | 'context' | 'global'`}. Criteria: consumer count, update frequency, persistence needs, cross-route access patterns.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Local State Hooks (<code>hooks/use-local-state.ts</code>)</h4>
          <p>Custom hooks wrapping useState/useReducer for common local patterns: useToggle, useInput, useAsyncState (loading/data/error tuple). Enforces consistent local state shape across the application.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Context Providers (<code>contexts/</code>)</h4>
          <p>React Context modules: ThemeContext, LocaleContext, FeatureFlagContext. Each context splits read and write contexts to prevent unnecessary re-renders (consumers subscribe only to the slice they need).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Global Store Factory (<code>stores/</code>)</h4>
          <p>Zustand store factories per feature domain: useUserStore, useDashboardStore, useNotificationStore. Each store is independent (not a monolithic Redux slice), enabling team ownership and selective subscription.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. State Boundary Hooks (<code>hooks/use-state-boundary.ts</code>)</h4>
          <p>Orchestrator hook that bridges state layers. Example: a form component with local input state that submits to a global mutation store. Manages the handoff between local and global state.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Cross-Boundary Event Bus (<code>lib/state-events.ts</code>)</h4>
          <p>Lightweight event emitter for cross-layer communication. When local state needs to trigger global actions (e.g., local form submission → global API call → global notification), this bridges the gap without coupling.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Persistence Layer (<code>lib/persistence.ts</code>)</h4>
          <p>Middleware for Zustand stores and Context values that need persistence. Supports localStorage for small state, IndexedDB for large state. Handles version migration and stale data detection.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. DevTools Integration (<code>lib/devtools.ts</code>)</h4>
          <p>Redux DevTools middleware for Zustand, custom logging for Context changes, and a state location debugger (shows which components consume which state). Development-only module.</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management Architecture</h3>
        <p>
          The architecture follows a concentric circle model: the innermost circle
          is local component state (highest frequency, lowest scope), the middle
          circle is Context API state (medium frequency, subtree scope), and the
          outermost circle is the global store (lowest frequency, app-wide scope).
          State moves outward only when its consumer set expands beyond its current
          boundary. The decision matrix module codifies this as engineering
          guidelines — every PR that introduces new state must justify its placement.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/local-vs-global-state-strategy-architecture.svg"
          alt="State boundary architecture showing local state, Context API, and global store layers with decision flow"
          caption="State Boundary Decision Architecture"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Engineer identifies new state requirement: what data needs to be tracked and which components consume it.</li>
          <li>State Decision Matrix classifies: single consumer → local state (useState). Subtree consumers → Context API (createContext). Cross-route or app-wide consumers → Zustand store.</li>
          <li>Local state: engineer uses useToggle, useInput, or useState directly. State lifecycle is bound to component mount/unmount.</li>
          <li>Context state: engineer creates or extends a Context provider, wraps the consuming subtree, and uses useContext with split read/write contexts.</li>
          <li>Global state: engineer imports the relevant Zustand store hook (useUserStore, useDashboardStore) and uses selectors to subscribe only to needed slices.</li>
          <li>Cross-boundary: when local state triggers a global action (e.g., form submit), the component calls the store&apos;s action method directly, passing local state as payload.</li>
          <li>Re-render isolation: Zustand selectors use Object.is comparison, preventing re-renders when unrelated store slices change. Context consumers are split by concern to avoid blanket re-renders.</li>
        </ol>
      </section>

      {/* Section 5: Data Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow is unidirectional within each layer and flows outward when crossing
          boundaries. Local state updates trigger component re-renders only. Context
          value changes re-render all consumers of that specific context (mitigated by
          splitting read/write contexts). Global store updates trigger re-renders only
          in components whose selector return value changed (Object.is comparison).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Local state needs global access mid-development:</strong> The useStateBoundary hook provides a migration path. The component lifts state from local to global store by replacing useState with the store hook, preserving the component API. Existing consumers are unaffected because the hook returns the same shape.</li>
          <li><strong>Context changes too frequently:</strong> If a Context value updates on every keystroke or mouse move, consumers re-render excessively. Solution: throttle the Context value updates, or move high-frequency state to a Zustand store where selectors prevent unnecessary consumer re-renders.</li>
          <li><strong>Global store becomes monolithic:</strong> When one store accumulates 50+ fields, teams step on each other. Solution: split into domain-specific stores (user, dashboard, notifications, settings) with independent lifecycles. Cross-store communication uses the state event bus.</li>
          <li><strong>SSR hydration mismatch for client-determined state:</strong> Theme detection happens on the client (no server signal). Server renders with default theme, client detects and overrides. Solution: use suppressHydrationWarning on the root element, or defer theme application until after hydration via useEffect.</li>
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
            State decision matrix hook, layered Zustand stores,
            split read/write Contexts, cross-boundary event bus,
            persistence middleware, and DevTools integration.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: State Decision Matrix</h3>
        <p>
          Pure function <code>classifyState()</code> accepts four parameters: consumer
          count (1, subtree, app-wide), update frequency (low, medium, high),
          persistence requirement (none, session, permanent), and cross-route access
          (true/false). It returns a classification with reasoning. This is used as
          both a runtime helper and a code review checklist. The function weights each
          factor — high-frequency updates strongly push toward local state, while
          cross-route access pushes toward global.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Local State Hooks</h3>
        <p>
          Pre-built hooks for common patterns: useToggle returns boolean with toggle and set functions, useInput returns object with value/onChange/reset, useAsyncState returns object with data/loading/error/execute. These enforce consistent state shapes and reduce boilerplate. Engineers use these instead of raw useState for predictable patterns.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Context Providers</h3>
        <p>
          Each Context module exports two contexts: a read context (the value) and a
          write context (the setter). For example, ThemeContext exports useTheme() for
          reading the current theme and useThemeActions() for changing it. Components
          that only read subscribe to the read context and do not re-render when the
          theme changes through the write path. This split is critical for performance
          in Context-heavy applications.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Global Store Factory</h3>
        <p>
          Each feature domain has its own Zustand store created via create(). Stores
          expose typed selectors: useUserStore.select.id, useUserStore.select.name.
          The devtools middleware integrates with Redux DevTools for time-travel
          debugging. Stores are independent — no cross-store imports. Cross-store
          communication uses the event bus module.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: State Boundary Hooks</h3>
        <p>
          The useStateBoundary hook manages transitions between state layers. It
          accepts local state as input and can promote it to global state when
          configured. Internally, it maintains a reference to both the local state
          and the global store, syncing changes in the configured direction. This
          enables gradual migration — start local, promote to global when needed,
          without rewriting consuming components.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Cross-Boundary Event Bus</h3>
        <p>
          A typed event emitter using Mitt (or a lightweight custom implementation).
          Events are namespaced by domain: <code>user:updated</code>,
          <code>dashboard:refresh</code>, <code>notification:show</code>. Components
          emit events without knowing which store or Context handles them. Stores
          subscribe to relevant events and react. This decouples the emission site
          (often local state) from the handling site (often global store).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Persistence Layer</h3>
        <p>
          Zustand middleware that syncs specified store slices to localStorage or
          IndexedDB. On store creation, it rehydrates from storage. On store changes,
          it debounces writes (300ms default). Handles version migration — if the
          stored schema version differs from the current version, it runs a migration
          function before rehydration. Corrupted or stale data is discarded silently.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: DevTools Integration</h3>
        <p>
          Development-only module that wraps Zustand stores with Redux DevTools
          middleware, logs Context value changes with component trees, and provides
          a state location panel (shows which state lives where). In production,
          this module is tree-shaken to zero bytes.
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
                <td className="p-2">Local state update (useState)</td>
                <td className="p-2">O(1) — single component re-render</td>
                <td className="p-2">O(1) — component memory only</td>
              </tr>
              <tr>
                <td className="p-2">Context value change</td>
                <td className="p-2">O(n) — n consumers re-render</td>
                <td className="p-2">O(n) — n consumer subscriptions</td>
              </tr>
              <tr>
                <td className="p-2">Zustand store update with selector</td>
                <td className="p-2">O(k) — k matching selectors re-render</td>
                <td className="p-2">O(k) — k subscriptions tracked</td>
              </tr>
              <tr>
                <td className="p-2">State classification decision</td>
                <td className="p-2">O(1) — 4-factor evaluation</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Persistence write (debounced)</td>
                <td className="p-2">O(1) — JSON.stringify + localStorage</td>
                <td className="p-2">O(s) — s = serialized state size</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Context consumer re-render storms:</strong> When a Context value changes, all useContext consumers re-render regardless of whether they use the changed portion. In a subtree with 50+ consumers, a single value change triggers 50 re-renders. Mitigation: split Context into read/write pairs, or move high-frequency state to Zustand where selectors are atomic.</li>
          <li><strong>Monolithic global store:</strong> A single Zustand store with 100+ fields becomes a bottleneck. Every store change runs all selector functions. With 200+ component subscriptions, this is 200 Object.is comparisons per update. Mitigation: split into domain-specific stores, each with focused subscriptions (20-30 per store).</li>
          <li><strong>Persistence serialization blocking:</strong> JSON.stringify on large state objects (10KB+) blocks the main thread. Mitigation: debounce writes at 300ms, use structuredClone for deep copy (faster than JSON for complex objects), and move large state to IndexedDB with async transactions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Selector memoization:</strong> Zustand selectors should return stable references. If a selector returns a new object/array on every call, Object.is fails and triggers unnecessary re-renders. Use selector factories that return referentially stable values, or use shallow comparison utilities.</li>
          <li><strong>Context composition:</strong> Combine related Context values into a single object when they always change together (reduces provider nesting). Split them when they change independently (prevents cascading re-renders). This is a judgment call per Context.</li>
          <li><strong>Lazy store initialization:</strong> Zustand stores are created eagerly on module import. For stores only needed on specific routes, use lazy initialization (create the store factory, call it on first use). This reduces initial bundle parse time and memory footprint.</li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          All state boundaries enforce type contracts via TypeScript. External data
          entering the global store (API responses, localStorage rehydration) is
          validated with Zod schemas before being committed. This prevents malformed
          data from corrupting the application state. Context values are typed and
          cannot accept arbitrary shapes without TypeScript compilation errors.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Persistence Security</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Sensitive Data in localStorage</h4>
          <p>
            Never store authentication tokens, PII, or sensitive user data in
            localStorage — it is accessible to any JavaScript running on the page,
            including third-party scripts. Use httpOnly cookies for tokens and
            restrict localStorage to non-sensitive UI state (preferences, theme,
            layout settings). If sensitive data must persist client-side, use
            IndexedDB with encryption (Web Crypto API) and clear it on session
            end.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">State Tampering Prevention</h4>
          <p>
            Users can modify localStorage values via DevTools. The persistence layer
            validates rehydrated data against schemas and discards values that fail
            validation. This prevents a user from injecting malformed state that could
            crash the application or bypass UI restrictions (e.g., setting admin role
            in persisted preferences).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Event bus rate limiting:</strong> The cross-boundary event bus limits emission frequency per event type (max 10 emissions per second per event). This prevents a buggy component from flooding the bus with events and degrading performance.</li>
          <li><strong>Store access controls:</strong> Global stores expose read selectors and action methods separately. Read-only components import only selectors, preventing accidental state mutations. Write actions are typed to accept validated payloads only.</li>
          <li><strong>Context write restrictions:</strong> Write contexts are not exported from provider modules — only action hooks are exported. This prevents arbitrary value overwrites and enforces that state changes go through documented action paths.</li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>State Decision Matrix:</strong> Test classifyState with various consumer counts, frequencies, and scopes. Verify it returns correct classification for edge cases (1 consumer with cross-route access → global, 100 consumers in same subtree → context).</li>
          <li><strong>Local State Hooks:</strong> Test useToggle toggles correctly, useInput tracks value and onChange, useAsyncState transitions through loading → data → error states.</li>
          <li><strong>Zustand Store Selectors:</strong> Test that selectors return correct slices, Object.is comparison prevents unnecessary re-renders, and actions mutate state correctly.</li>
          <li><strong>Persistence Layer:</strong> Test rehydration from localStorage with valid data, invalid data, and version mismatches. Verify debounced writes fire after the configured delay.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Cross-Boundary Flow:</strong> Render a component with local state that triggers a global action. Verify the local state is passed to the global store, the store processes it, and the result propagates back to the component.</li>
          <li><strong>Context Split Behavior:</strong> Render a tree with split read/write Contexts. Update the write context and verify only consumers of the write context re-render, while read-only consumers remain stable.</li>
          <li><strong>Store Independence:</strong> Update store A and verify that components subscribed only to store B do not re-render. Test cross-store event bus communication (store A emits event, store B reacts).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>Context consumer re-render count: mount 100 consumers of a single Context, trigger a value change, and assert all 100 re-render (then verify the fix reduces this via split contexts).</li>
          <li>Concurrent store updates: fire 10 store actions simultaneously, verify final state is consistent and all subscribers receive the correct value.</li>
          <li>SSR hydration: server-render a component with default state, hydrate on client with different state, verify no hydration warning (or suppressed correctly).</li>
          <li>Performance regression test: measure re-render count before and after a state architecture change. Alert if re-render count increases by more than 20%.</li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Globalizing everything with Redux:</strong> Candidates put form input state, modal open/close, and loading flags into Redux. Interviewers expect candidates to recognize that these are component-scoped concerns. The correct answer: local state for component-scoped data, Context for subtree data, Redux/Zustand for app-wide data.</li>
          <li><strong>Using Context for high-frequency state:</strong> Putting mouse position, scroll position, or keystroke values into Context. Every change re-renders all consumers. Interviewers expect candidates to mention that Context is not designed for high-frequency updates and should be replaced with Zustand or refs.</li>
          <li><strong>Not considering re-render impact:</strong> Candidates describe the architecture but cannot explain which components re-render when state changes. Interviewers always ask: &quot;What happens when this value changes?&quot; — candidates must trace the re-render path through the component tree.</li>
          <li><strong>Ignoring migration paths:</strong> Candidates design the ideal architecture but cannot answer &quot;What if a component&apos;s local state needs to become global later?&quot; The correct answer: design a migration path (useStateBoundary hook) that allows lifting state without rewriting consumers.</li>
          <li><strong>No TypeScript integration:</strong> State management without types is unmaintainable at scale. Interviewers expect typed selectors, typed actions, and typed Context values. Candidates who mention Zod runtime validation for external data score bonus points.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Context API vs Zustand for Subtree State</h4>
          <p>
            Context API is built-in and requires no dependencies, but it lacks
            selector support — every consumer re-renders on any value change. Zustand
            adds a dependency but provides atomic selector subscriptions. For state
            that changes infrequently (theme, locale), Context is fine. For state
            that changes often (filter selections, pagination cursor), Zustand is
            significantly better. The trade-off: bundle size (~2KB for Zustand) vs
            re-render performance. At scale, Zustand wins.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Single Store vs Multi-Store Architecture</h4>
          <p>
            A single Redux/Zustand store gives a unified state tree with excellent
            DevTools (time-travel, action log). But it creates a bottleneck — every
            team modifies the same store, selector functions multiply, and the store
            file becomes a merge-conflict magnet. Multi-store (Zustand per domain)
            gives team autonomy, focused subscriptions, and independent lifecycles.
            The trade-off: cross-store communication requires an event bus (added
            complexity), and DevTools show stores separately. For 5+ teams,
            multi-store is strongly preferred.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide between Context API and a global store when the state is accessed by 3 components in different parts of the tree?</p>
            <p className="mt-2 text-sm">
              A: Three consumers in different parts of the tree is the borderline case.
              I evaluate: (1) how often does the state change? If frequently (more
              than once per user interaction), Context re-renders become expensive —
              use Zustand. (2) Will more components consume it in the future? If yes
              (e.g., user preferences that new features will need), use Zustand for
              forward compatibility. (3) Does it need persistence? If yes, Zustand
              has better middleware support. For 3 consumers with infrequent changes
              and no persistence, Context is acceptable. Otherwise, Zustand.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle a situation where a component uses local state but needs to trigger a side effect in a global store?</p>
            <p className="mt-2 text-sm">
              A: The component calls the global store&apos;s action method directly,
              passing its local state as the payload. For example, a local form
              component collects input values in local state, and on submit calls
              useUserStore.getState().updateProfile(formData). This avoids coupling
              the local state to the global store — the local state remains local,
              and the global action is a pure function of the local data. No need
              for the event bus here — direct store method calls are sufficient for
              request-response patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent unnecessary re-renders when using Context for theme?</p>
            <p className="mt-2 text-sm">
              A: Two strategies. (1) Split the theme Context into read and write
              contexts. Components that only read the theme subscribe to the read
              context and do not re-render when the write context updates. (2)
              Memoize the Context value — wrap it in useMemo so the reference only
              changes when the actual theme value changes, not on every parent
              re-render. Additionally, use React.memo on theme-consuming components
              to skip re-renders when props haven&apos;t changed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you enforce state placement conventions across a team of 20 engineers?</p>
            <p className="mt-2 text-sm">
              A: Three layers of enforcement. (1) ESLint rules: ban direct useState
              for specific patterns (e.g., ban useState for auth state, require store
              usage). (2) PR template: engineers must classify new state using the
              decision matrix and justify their placement. (3) Architecture docs:
              maintain a state placement guide with examples and anti-patterns.
              Additionally, periodic code reviews catch violations that slip through.
              For critical state (auth, permissions), use TypeScript branded types
              that can only be created through the authorized store actions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React 19&apos;s use() hook change this architecture?</p>
            <p className="mt-2 text-sm">
              A: React 19&apos;s use() hook enables reading Context and promises inside
              render with Suspense integration. It doesn&apos;t fundamentally change the
              state placement decision — Context still re-renders all consumers on
              value change. However, use() enables cleaner async state management
              (reading promises directly in render with Suspense boundaries). For
              global state, Zustand remains superior due to selector subscriptions.
              The main change: use() makes Context consumption more ergonomic, which
              might push borderline cases toward Context more often. But the
              re-render limitation still makes Zustand the choice for active state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design state for a multi-tenant application where each tenant has different state requirements?</p>
            <p className="mt-2 text-sm">
              A: Multi-tenant state needs namespacing. The global store includes a
              tenantId field, and all tenant-specific state is keyed by tenantId.
              When the user switches tenants, the store loads the new tenant&apos;s
              state (from server or cache) and swaps the active slice. Context
              provides the current tenantId. Local state remains component-scoped
              regardless of tenant. The challenge: preventing stale tenant data from
              leaking into the new tenant&apos;s view. Solution: clear the global store
              on tenant switch, load fresh data, and show a loading state during
              transition. Use a store action that atomically swaps tenant context.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/reference/react/useState" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — useState and useReducer
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/useContext" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — Context API and Performance Considerations
            </a>
          </li>
          <li>
            <a href="https://zustand.docs.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — State Management for React
            </a>
          </li>
          <li>
            <a href="https://redux.js.org/faq/organizing-state" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux FAQ — What State Should Go in Redux?
            </a>
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/application-state-management-with-react" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds — Application State Management with React
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/choosing-the-state-structure" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — Choosing the State Structure
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
