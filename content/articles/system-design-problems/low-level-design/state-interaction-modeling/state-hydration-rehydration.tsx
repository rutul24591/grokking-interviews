"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-state-hydration-rehydration",
  title: "State Hydration/Rehydration System",
  description:
    "Initializing application state from server, localStorage, and other sources with validation and migration handling.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "state-hydration-rehydration",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "hydration", "state-initialization", "persistence", "server-side-rendering"],
  relatedTopics: ["cross-tab-state-sync", "state-persistence", "server-rendering"],
};

export default function StateHydrationRehydrationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Server-side rendering (SSR) generates HTML on the server using the application's current state (user data, feature flags, initial page content). This HTML is sent to the browser, which displays it immediately — fast first paint, good Core Web Vitals. Then the browser loads JavaScript, initializes the React application, and "hydrates" — attaches event listeners and makes the static HTML interactive. For hydration to succeed without flickering or errors, the client-side state must match the state the server used to generate the HTML.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          This is the hydration problem: the server generated HTML with user A logged in; the browser must start with the same "user A logged in" state. If the browser initializes with an empty Redux store (the common default), React's reconciliation detects a mismatch between what the server rendered and what the client would render with empty state, and either re-renders (causing a visual flash) or throws a hydration error.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The problem has several dimensions. SSR hydration is about injecting server state into the client to prevent mismatches. Persistence rehydration is about restoring user preferences (theme, language, sidebar collapsed state) from localStorage across sessions — the opposite direction. Schema migration is about handling the case where a returning user's persisted state was saved by an older version of the application and may have a different structure. Each dimension has distinct failure modes and requires a different mechanism.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Application state is serializable to JSON (no functions, symbols, or circular references). The same application code runs on server and client (isomorphic). Server state is authoritative for authenticated data; localStorage state is authoritative for user preferences. State schemas may change across application versions.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>SSR State Injection:</strong> Server serializes application state to JSON and embeds it in the HTML response. Client deserializes and initializes its store from this state before first render.
          </li>
          <li>
            <strong>Persistence:</strong> Selected state slices are serialized to localStorage on change and restored on subsequent page loads, enabling preferences to persist across sessions.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Schema Validation:</strong> Persisted state is validated against the current schema before use. Invalid or missing fields fall back to defaults rather than crashing the application.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Migration:</strong> If the persisted state's schema version differs from the current version, a migration function transforms it to the current format before use.
          </HighlightBlock>
          <li>
            <strong>Priority Resolution:</strong> When multiple state sources are present (server state + localStorage), a defined priority and merge strategy determines the canonical initial state.
          </li>
          <li>
            <strong>Sensitive Data Exclusion:</strong> Auth tokens, PII, and session-scoped credentials must never be persisted to localStorage.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Hydration latency:</strong> State deserialization and store initialization must complete before React's first render, adding under 10ms to the critical path.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Bundle size:</strong> The hydration/migration infrastructure must not significantly inflate the initial JS bundle — migrations for old versions can be code-split and loaded lazily if needed.
          </HighlightBlock>
          <li>
            <strong>Correctness:</strong> Zero hydration mismatches in steady state (server and client produce identical HTML for identical state).
          </li>
          <li>
            <strong>Resilience:</strong> A corrupted or missing localStorage entry must not crash the application — fall through to server-injected state or application defaults.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Server renders with user logged in; token expires before JS loads; client hydrates with stale auth state before the token check fires.</li>
          <HighlightBlock as="li" tier="important">localStorage entry written by app version 1.0 contains a field that was renamed in version 2.0 — migration required but not present (schema gap).</HighlightBlock>
          <li>localStorage JSON is syntactically invalid (storage was truncated, corrupted by another extension). JSON.parse throws.</li>
          <li>Server injects a large state object (50KB+), inflating HTML transfer size and Time to First Byte.</li>
          <li>Multiple tabs: Tab A saves to localStorage; Tab B rehydrates from it; Tab A's user-specific state appears in Tab B (different user or session).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">SSR hydration: the server calls a getInitialState() function that returns a plain-object state snapshot, serializes it with a safe serializer (handling HTML-special characters to prevent XSS), and embeds it in the HTML as a script tag assigning a global variable (window.__INITIAL_STATE__).</HighlightBlock>
<HighlightBlock as="p" tier="important">On the client, the store initialization reads window.__INITIAL_STATE__ and passes it as the preloaded state to the store constructor. React renders from this state, producing HTML identical to the server's, so hydration succeeds without mismatch.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Persistence rehydration: a Zustand persist middleware (or Redux persist) subscribes to store changes and serializes selected slices to localStorage after each update. On initialization, the middleware reads localStorage, validates the data against the current schema, runs any necessary migrations, and merges the result with the server-injected state (server wins for auth, localStorage wins for preferences).
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/state-hydration-rehydration.svg"
          alt="State hydration and rehydration showing SSR hydration flow, localStorage persistence rehydration, schema migration strategy, and rehydration order"
          caption="State hydration and rehydration showing SSR hydration flow, localStorage persistence rehydration, schema migration strategy, and rehydration order"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server-Side State Serialization</h3>
        <HighlightBlock as="p" tier="important">
          The server's state collection function assembles the initial state: user identity from the auth session, feature flags from the flags service, and any server-fetched data needed for the first render. This state is serialized to JSON using a safe serializer that replaces HTML-special characters with Unicode escape sequences to prevent XSS via state injection attacks. The serialized payload is embedded into the HTML in a script tag and exposed to the client through a well-known global value so the client can bootstrap with the same initial state.
        </HighlightBlock>
        <p>
          Size management is critical. The embedded JSON inflates HTML size, increasing Time to First Byte and delaying parsing. Best practice: serialize only the minimum state needed for the first render. Paginated list data should not be embedded (the page renders with a loading skeleton and fetches data client-side). Only server-authoritative data that prevents hydration mismatch needs injection — auth state, feature flags, and the first page of the primary data collection.
        </p>
        <p>
          For Next.js applications, this mechanism is built into the getServerSideProps / getStaticProps pattern: returned props are automatically serialized and injected. The store is initialized in a custom _app.tsx using the injected props. Redux Toolkit's setupListeners and getRunningQueriesThunk patterns in RTK Query handle this for API-cached data.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side Deserialization and Store Initialization</h3>
        <p>
          On the client, the store initialization function runs synchronously during module evaluation (before the first React render). It reads window.__INITIAL_STATE__, parses the JSON, and passes it as the preloaded state argument to the Redux store constructor (or Zustand's store initial state). The store's reducers receive this preloaded state as their initial state, bypassing the default empty-state initialization.
        </p>
        <p>
          Timing is critical: the store must be initialized before React.createRoot() and before any ReactDOM.hydrateRoot() call. If the store initializes after React starts hydrating, the first render uses default empty state, mismatching the server HTML, and hydration errors occur. In Next.js, this is handled correctly by the framework; in custom SSR setups, explicit ordering of store initialization and hydration is required.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hydration Mismatch Prevention</h3>
        <p>
          Hydration mismatches occur when the server-rendered HTML and the client's first render differ. Common causes: date/time rendering (server is in UTC, client is in local timezone), random IDs generated with Math.random() in render (different values each call), browser-only APIs accessed during SSR (window.innerWidth, localStorage), and server state becoming stale before the client JS loads.
        </p>
        <HighlightBlock as="p" tier="important">
          Mitigation strategies: use a stable ID generator seeded by server-provided values; ensure date rendering is timezone-aware and consistent; use useEffect for browser-only data to prevent SSR access; keep the server-to-client state window short (hydration should happen within 1–2 seconds of HTML delivery). For volatile data (user's unread notification count that may change while the page loads), render a placeholder server-side and fetch the actual value client-side, accepting a brief visible update rather than risking a stale mismatch.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">localStorage Persistence Layer</h3>
        <HighlightBlock as="p" tier="important">
          The persistence layer serializes and restores selected state slices. The configuration defines which slices persist (e.g., theme, language, sidebarCollapsed) and which are excluded (auth, serverData, loadingStates). On every qualifying state change, the persistence layer serializes the configured slices to a versioned localStorage key (app-state-v3, where v3 is the current schema version).
        </HighlightBlock>
        <p>
          Zustand-persist and redux-persist both implement this pattern. They abstract the subscribe-then-serialize flow, handle debouncing (to avoid writing to localStorage on every keystroke), and provide a migration mechanism. Custom implementations should replicate these features rather than writing directly to localStorage in reducer logic, which creates tight coupling between business logic and persistence concerns.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Schema Validation</h3>
        <p>
          Before using persisted state, validate it against the current schema. Use a schema validator (Zod, Yup, or a custom type guard) to check that all required fields are present and have the correct types. Unknown extra fields from newer-than-expected persisted state should be stripped (forward compatibility — an older JS bundle receiving state from a newer-written localStorage entry). Missing fields should be filled with default values (backward compatibility — an older localStorage entry missing a field introduced in the current version).
        </p>
        <p>
          Validation failure handling: if the root structure is completely invalid (JSON parsed as an array, or a required top-level key is missing), discard the persisted state entirely and initialize from defaults. Do not throw or crash — a corrupt localStorage entry should result in a fresh-start experience, not an application failure.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Schema Migration System</h3>
        <p>
          Every schema change that modifies the structure of persisted state requires a migration function. Migrations are pure functions from old-version state to new-version state. The migration registry maps from version number to migration function: migrations[2] transforms v2 state to v3 state. On load, the persisted state's version is read; migrations are applied sequentially from stored version to current version.
        </p>
        <p>
          Example migration chain: the app is on schema v5; the persisted state is v3. The migration engine applies migrations[3] (v3→v4), then migrations[4] (v4→v5), yielding a v5-compatible state. Each migration function is deterministic and tested independently. The chain property (applying v3→v4→v5 produces the same result as a direct v3→v5 migration) is verified by unit tests.
        </p>
        <p>
          Migration functions should be maintained indefinitely (or until the oldest supported state version is determined to be outside the realistic user population). Version cleanup: after a major release cycle, migrations older than 2–3 versions can be dropped with an announcement, forcing users on very old state to start fresh.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Source Priority and Merge Strategy</h3>
        <p>
          When multiple state sources are available, a merge strategy determines the canonical initial state. The recommended layering: application defaults (lowest priority) → server-injected state → localStorage persisted state (highest for preference data) → runtime overrides (URL query params, feature flag overrides).
        </p>
        <p>
          The merge is not a simple Object.assign — it's slice-aware. Auth state: server wins entirely (localStorage auth data is never trusted; it may be stale or tampered with). Theme/language: localStorage wins (user's explicit preference over server default). The first page of list data: server wins (fresh). Cart data: if server returns a cart, server wins; if the server returns an empty cart and localStorage has items (offline session), localStorage wins. These per-slice policies are configured explicitly, not derived from a generic merge algorithm.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security Considerations</h3>
        <p>
          The window.__INITIAL_STATE__ injection is an XSS vector if the serialization is not safe. JSON.stringify does not escape HTML-special characters, allowing the value &lt;/script&gt; to appear in the embedded JSON and terminate the script tag prematurely, followed by arbitrary injected HTML. Always use a safe serializer that replaces &lt;, &gt;, and &amp; with their Unicode equivalents in the output JSON string.
        </p>
        <HighlightBlock as="p" tier="crucial">
          localStorage is accessible to any JavaScript running on the same origin, including XSS-injected scripts. Never store auth tokens, refresh tokens, JWTs, or any credential in localStorage. Session tokens belong in httpOnly cookies (inaccessible to JavaScript). If the token must be accessible to JavaScript (for Authorization header use), store it in memory (module-level variable) and re-authenticate on page reload via a server-side cookie.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Error Tracking</h3>
        <HighlightBlock as="p" tier="important">
          Instrument the hydration and rehydration pipeline: log schema validation failures (indicates users with stale state formats in production), log migration execution (how many users are running old state versions), and track hydration mismatch errors (React's onRecoverableError callback in React 18). A spike in hydration mismatch errors following a deployment indicates a server/client state schema divergence introduced in the deployment.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Size vs First Paint Performance</h3>
        <HighlightBlock as="p" tier="important">
          Embedding more server state in the HTML prevents more client-side fetches (better UX) but increases HTML transfer size (worse Time to First Byte). The right balance: embed only the state needed for the above-the-fold render. Use deferred fetches (React Suspense) for below-the-fold data, accepting loading states rather than inflating the HTML payload.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Migration Maintenance Burden</h3>
        <HighlightBlock as="p" tier="crucial">
          Every schema change generates a migration function. Over 3 years and 50 schema changes, the migration chain is 50 functions deep. The last migration runs 49 predecessor migrations for the very few users on extremely old state. Periodic migration pruning (dropping support for state older than N months) reduces this burden but requires a strategy for gracefully resetting stale state (show a "your session has expired, please log in" message rather than crashing).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SSR vs CSR State Management</h3>
        <HighlightBlock as="p" tier="important">
          Applications that don't use SSR (client-rendered SPAs) face only the rehydration problem (from localStorage/cookies), not the hydration mismatch problem. Adding SSR later requires retrofitting the hydration injection mechanism. Design the store initialization to accept an optional preloaded state from the start — this makes adding SSR later straightforward rather than requiring a refactor of every store initialization path.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Multi-source merging is slice-aware, not a generic deep merge. For staff-level engineers, the architectural decisions that matter most are: use safe HTML</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">serialization for server-injected state; design the store initialization API to accept preloaded state from day one; implement versioned schema migrations early (they become expensive to retrofit); monitor hydration mismatch errors as a deployment quality metric; and treat localStorage as a user preference store, not a session store.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
