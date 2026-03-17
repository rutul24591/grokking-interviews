"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-state-management-strategy",
  title: "State Management Strategy",
  description: "Comprehensive guide to frontend state management: Redux, Zustand, Context, server state, and selection criteria for staff engineer architecture decisions.",
  category: "frontend",
  subcategory: "nfr",
  slug: "state-management-strategy",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "state-management", "redux", "zustand", "architecture", "server-state"],
  relatedTopics: ["local-component-state", "server-state-management", "client-persistence"],
};

export default function StateManagementStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>State Management Strategy</strong> encompasses how an application stores, updates,
          and shares data across components. This includes UI state (modals, form inputs), server
          cache (API responses), routing state (URL parameters), and persistent state (user preferences).
          The right strategy balances complexity, performance, and developer experience.
        </p>
        <p>
          For staff engineers, state management is an architecture decision with long-term implications.
          Over-engineering (global state for everything) adds unnecessary complexity. Under-engineering
          (prop drilling everywhere) creates maintenance nightmares. The goal is matching the solution
          to the problem&apos;s complexity.
        </p>
        <p>
          <strong>State categories:</strong>
        </p>
        <ul>
          <li><strong>Local component state:</strong> Specific to one component (form inputs, toggle state)</li>
          <li><strong>Shared UI state:</strong> Used by multiple components (theme, sidebar open/close)</li>
          <li><strong>Server state:</strong> Data from APIs (user profiles, products, messages)</li>
          <li><strong>URL state:</strong> Query parameters, route params (filters, pagination)</li>
          <li><strong>Persistent state:</strong> Survives refresh (user preferences, saved settings)</li>
        </ul>
        <p>
          This guide covers state management options, selection criteria, server state vs client state,
          and patterns for scalable applications.
        </p>
      </section>

      <section>
        <h2>State Management Options</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">React Context</h3>
        <p>
          Built-in React API for sharing state without prop drilling.
        </p>
        <ul className="space-y-2">
          <li><strong>Best for:</strong> Low-frequency updates (theme, auth user, locale)</li>
          <li><strong>Avoid for:</strong> High-frequency updates (typing, scrolling) — causes re-renders</li>
          <li><strong>Pros:</strong> Built-in, no dependencies, simple API</li>
          <li><strong>Cons:</strong> Performance issues with frequent updates, no devtools by default</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Redux (with Redux Toolkit)</h3>
        <p>
          Predictable state container with centralized store and immutability patterns.
        </p>
        <ul className="space-y-2">
          <li><strong>Best for:</strong> Complex state logic, time-travel debugging, large teams</li>
          <li><strong>Avoid for:</strong> Simple apps, when boilerplate outweighs benefits</li>
          <li><strong>Pros:</strong> Devtools, middleware ecosystem, predictable updates, large community</li>
          <li><strong>Cons:</strong> Boilerplate (reduced with Toolkit), learning curve, overkill for simple apps</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Zustand</h3>
        <p>
          Minimal state management with hooks-based API and no boilerplate.
        </p>
        <ul className="space-y-2">
          <li><strong>Best for:</strong> Most applications — balances simplicity and features</li>
          <li><strong>Avoid for:</strong> When you need Redux&apos;s specific features (time-travel, complex middleware)</li>
          <li><strong>Pros:</strong> Minimal boilerplate, TypeScript support, devtools, middleware support</li>
          <li><strong>Cons:</strong> Smaller ecosystem than Redux, less opinionated</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recoil / Jotai</h3>
        <p>
          Atomic state management with fine-grained reactivity.
        </p>
        <ul className="space-y-2">
          <li><strong>Best for:</strong> Highly dynamic state, derived state, complex dependencies</li>
          <li><strong>Avoid for:</strong> Simple apps, when atomic model adds unnecessary complexity</li>
          <li><strong>Pros:</strong> Fine-grained updates, derived state, concurrent mode support</li>
          <li><strong>Cons:</strong> Learning curve, smaller community, Recoil maintenance concerns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MobX</h3>
        <p>
          Observable-based state with automatic dependency tracking.
        </p>
        <ul className="space-y-2">
          <li><strong>Best for:</strong> Teams comfortable with OOP, complex reactive systems</li>
          <li><strong>Avoid for:</strong> Teams preferring functional patterns</li>
          <li><strong>Pros:</strong> Minimal boilerplate, automatic tracking, mutable syntax</li>
          <li><strong>Cons:</strong> &quot;Magic&quot; behavior, harder to debug, less popular in React community</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/state-management-comparison.svg"
          alt="State Management Comparison"
          caption="State management library comparison — Redux, Zustand, Context, Recoil, and MobX trade-offs"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Library Comparison</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Library</th>
              <th className="p-3 text-left">Boilerplate</th>
              <th className="p-3 text-left">Learning Curve</th>
              <th className="p-3 text-left">Devtools</th>
              <th className="p-3 text-left">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Context</td>
              <td className="p-3">Low</td>
              <td className="p-3">Low</td>
              <td className="p-3">Basic</td>
              <td className="p-3">Simple shared state</td>
            </tr>
            <tr>
              <td className="p-3">Redux Toolkit</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Complex apps, large teams</td>
            </tr>
            <tr>
              <td className="p-3">Zustand</td>
              <td className="p-3">Low</td>
              <td className="p-3">Low</td>
              <td className="p-3">Good</td>
              <td className="p-3">Most applications</td>
            </tr>
            <tr>
              <td className="p-3">Recoil/Jotai</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Medium-High</td>
              <td className="p-3">Good</td>
              <td className="p-3">Atomic state, derived state</td>
            </tr>
            <tr>
              <td className="p-3">MobX</td>
              <td className="p-3">Low</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Good</td>
              <td className="p-3">OOP teams, reactive systems</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Server State vs Client State</h2>
        <p>
          A critical distinction: server state (from APIs) has different concerns than client state
          (UI state). Treating them the same leads to over-engineering.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server State Characteristics</h3>
        <ul className="space-y-2">
          <li>Owned by server — client is a cache</li>
          <li>Can become stale — needs synchronization</li>
          <li>Shared across users — consistent view</li>
          <li>Requires network requests — loading/error states</li>
          <li>Needs caching, deduplication, invalidation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Client State Characteristics</h3>
        <ul className="space-y-2">
          <li>Owned by client — fully controlled</li>
          <li>Always in sync — no staleness</li>
          <li>Specific to user/session — not shared</li>
          <li>Instant access — no network</li>
          <li>Simple CRUD — set/get/update</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server State Libraries</h3>
        <p>
          React Query, SWR, and Apollo Client specialize in server state:
        </p>
        <ul className="space-y-2">
          <li><strong>Caching:</strong> Automatic caching with configurable TTL</li>
          <li><strong>Deduplication:</strong> Multiple components requesting same data = single request</li>
          <li><strong>Background refetch:</strong> Stale-while-revalidate pattern</li>
          <li><strong>Mutations:</strong> Optimistic updates, rollback on error</li>
          <li><strong>Pagination:</strong> Built-in infinite scroll, pagination helpers</li>
          <li><strong>Devtools:</strong> Query inspection, cache manipulation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recommended Architecture</h3>
        <ul className="space-y-2">
          <li><strong>Server state:</strong> React Query or SWR (don&apos;t put in Redux/Zustand)</li>
          <li><strong>Client state:</strong> Zustand or Context (simple), Redux (complex)</li>
          <li><strong>URL state:</strong> React Router, search params (don&apos;t duplicate in store)</li>
          <li><strong>Form state:</strong> React Hook Form or Formik (specialized for forms)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/server-vs-client-state.svg"
          alt="Server State vs Client State Architecture"
          caption="Separation of server state (React Query) and client state (Zustand/Context) — each handled by appropriate tools"
        />
      </section>

      <section>
        <h2>State Management Selection Criteria</h2>
        <p>
          Choose state management based on application characteristics, not trends.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Use Context</h3>
        <ul className="space-y-2">
          <li>Low-frequency updates (theme, locale, auth user)</li>
          <li>Simple state (no complex transformations)</li>
          <li>Small to medium apps</li>
          <li>Team familiar with React patterns</li>
          <li>Want to minimize dependencies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Use Zustand</h3>
        <ul className="space-y-2">
          <li>Medium complexity state</li>
          <li>Multiple components need same state</li>
          <li>Want minimal boilerplate</li>
          <li>TypeScript project (excellent types)</li>
          <li>Need devtools but not full Redux</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Use Redux</h3>
        <ul className="space-y-2">
          <li>Complex state logic (undo/redo, time-travel)</li>
          <li>Large team with multiple developers</li>
          <li>Need strict patterns and conventions</li>
          <li>Existing Redux ecosystem (middleware, devtools)</li>
          <li>Regulatory requirements (audit trails, state logging)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Use Atomic (Recoil/Jotai)</h3>
        <ul className="space-y-2">
          <li>Highly dynamic state structure</li>
          <li>Complex derived state dependencies</li>
          <li>Fine-grained reactivity needed</li>
          <li>Concurrent mode / Suspense usage</li>
          <li>Comfortable with newer patterns</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Decision Framework</h3>
        <ol className="space-y-3">
          <li>
            <strong>Is it server state?</strong> Use React Query/SWR, not global state.
          </li>
          <li>
            <strong>Is it local to one component?</strong> Use useState/useReducer.
          </li>
          <li>
            <strong>Is it URL state?</strong> Use router params/search, not store.
          </li>
          <li>
            <strong>Is it form state?</strong> Use React Hook Form, not global state.
          </li>
          <li>
            <strong>Is it shared UI state?</strong> Context (simple) or Zustand (complex).
          </li>
          <li>
            <strong>Is it complex application state?</strong> Redux or Zustand based on team preference.
          </li>
        </ol>
      </section>

      <section>
        <h2>State Management Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Colocation</h3>
        <p>
          Keep state as close to where it&apos;s used as possible.
        </p>
        <ul className="space-y-2">
          <li>Start with local state</li>
          <li>Only lift state when multiple components need it</li>
          <li>Avoid premature global state</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Slices</h3>
        <p>
          Split global state into domain-specific slices.
        </p>
        <ul className="space-y-2">
          <li>User slice (profile, preferences)</li>
          <li>UI slice (modals, sidebar, theme)</li>
          <li>Feature slices (cart, notifications, etc.)</li>
          <li>Each slice is independently manageable</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Selectors</h3>
        <p>
          Derive computed state instead of storing duplicates.
        </p>
        <ul className="space-y-2">
          <li>Use memoized selectors (Reselect, Zustand computed)</li>
          <li>Avoid storing derived values</li>
          <li>Keep state normalized</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Normalization</h3>
        <p>
          Store entities by ID, not nested arrays.
        </p>
        <ul className="space-y-2">
          <li>Prevents duplication</li>
          <li>Simplifies updates</li>
          <li>Matches database structure</li>
          <li>Use normalize library or createEntityAdapter</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimistic Updates</h3>
        <p>
          Update UI immediately, rollback on error.
        </p>
        <ul className="space-y-2">
          <li>Better UX (feels instant)</li>
          <li>Handle rollback gracefully</li>
          <li>React Query mutations handle this</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide between Context, Redux, and Zustand?</p>
            <p className="mt-2 text-sm">
              A: Start simple — Context for low-frequency shared state (theme, auth). Zustand for
              medium complexity with minimal boilerplate. Redux for complex apps needing time-travel,
              strict patterns, or large team coordination. Key question: is it server state? If yes,
              use React Query, not global state at all. Most apps: React Query for server data,
              Zustand for client state, Context for theme/locale.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between server state and client state?</p>
            <p className="mt-2 text-sm">
              A: Server state lives on the server — client is a cache. It can be stale, needs
              synchronization, and requires network requests. Client state lives in the browser —
              fully controlled, always in sync, instant access. They need different tools: React
              Query/SWR for server state (caching, deduplication, background refetch), Zustand/Redux
              for client state (UI state, preferences).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you NOT use a global state management library?</p>
            <p className="mt-2 text-sm">
              A: When state is local to one component (useState), when it&apos;s server state (React
              Query), when it&apos;s URL state (router params), or when it&apos;s form state (React
              Hook Form). Global state adds complexity — only use it when multiple components across
              the tree need the same state and simpler solutions don&apos;t work.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle state that needs to persist across refreshes?</p>
            <p className="mt-2 text-sm">
              A: Depends on the data. User preferences: localStorage with hydration on app load.
              Auth state: HttpOnly cookies (secure) or encrypted localStorage. Form drafts:
              localStorage with auto-save. Server data: React Query persistence or IndexedDB for
              offline. Critical data: server-side with session, not client storage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is state normalization and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: Normalization means storing entities by ID in a flat structure, not nested arrays.
              Instead of <code className="text-accent">{`{users: [{id: 1, name: 'John', posts: [...]}]}`}</code>, store
              <code className="text-accent">{`{users: {1: {id: 1, name: 'John'}}, posts: {...}}`}</code>. Benefits: no duplication,
              easier updates (update user once, not in multiple places), matches database structure,
              simpler selectors. Use normalize library or Redux&apos;s createEntityAdapter.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/query" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query) — Server State
            </a>
          </li>
          <li>
            <a href="https://zustand-demo.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — State Management
            </a>
          </li>
          <li>
            <a href="https://redux-toolkit.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Toolkit — Modern Redux
            </a>
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/application-state-vs-session-state" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds — Application State vs Session State
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
