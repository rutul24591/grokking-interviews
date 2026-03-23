"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-singleton-pattern",
  title: "Singleton Pattern",
  description:
    "In-depth guide to the Singleton Pattern in frontend development covering lazy initialization, service registries, dependency injection alternatives, and state management implications.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "singleton-pattern",
  wordCount: 3500,
  readingTime: 14,
  lastUpdated: "2026-03-20",
  tags: [
    "frontend",
    "design-patterns",
    "singleton",
    "creational-patterns",
    "state-management",
  ],
  relatedTopics: ["module-pattern", "observer-pattern", "factory-pattern"],
};

export default function SingletonPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Singleton Pattern</strong> restricts the instantiation of
          a class or object to a single instance, providing a global point of
          access to that instance. In frontend development, singletons appear
          far more frequently than many engineers realize — every ES Module is
          effectively a singleton (evaluated once and cached), every React
          Context provider at the root is a singleton, and state management
          stores like Redux or Zustand are singletons by design.
        </p>
        <p>
          The pattern originated in the Gang of Four&apos;s 1994 &quot;Design
          Patterns&quot; book, where it was presented as a creational pattern
          for ensuring a class has only one instance. In classical
          object-oriented languages like Java or C++, implementing a singleton
          requires explicit mechanisms: private constructors, static instance
          fields, and thread-safe lazy initialization. In JavaScript, the module
          system itself provides singleton semantics — a module is loaded once
          and its exports are shared across all importers.
        </p>
        <p>
          Despite its simplicity, the Singleton Pattern is one of the most
          debated patterns in software engineering. Critics argue that
          singletons introduce hidden dependencies, make testing difficult, and
          create tight coupling. Proponents counter that singletons are
          appropriate for genuinely shared resources like configuration,
          logging, and connection pools. For staff-level engineers, the key
          skill is knowing when a singleton is the right tool versus when
          dependency injection or factory patterns would better serve the
          architecture.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Single Instance Guarantee:</strong> The core invariant — no
            matter how many times the singleton is accessed, the same instance
            is returned. In JavaScript, this is naturally achieved through
            module caching: when a module is imported, Node.js or the bundler
            caches the module&apos;s exports and returns the cached version on
            subsequent imports.
          </li>
          <li>
            <strong>Lazy Initialization:</strong> The instance is created on
            first access rather than at application startup. This defers
            resource allocation until the singleton is actually needed,
            improving startup performance. In frontend apps, lazy singletons are
            useful for services that may not be needed on all routes (analytics,
            feature flags, WebSocket connections).
          </li>
          <li>
            <strong>Global Access Point:</strong> The singleton provides a
            well-known entry point for consumers to access the shared instance.
            In frontend frameworks, this manifests as React Context (useContext
            hook), service locator patterns, or simply importing from a module.
          </li>
          <li>
            <strong>State Preservation:</strong> Because the instance persists
            for the application&apos;s lifetime, its internal state is preserved
            across all consumers. This is the foundation of centralized state
            management — a single store holds the application state, and all
            components read from and write to the same instance.
          </li>
          <li>
            <strong>Module-Level Singleton:</strong> In ES Modules, any object
            exported from a module is de facto a singleton. The module&apos;s
            top-level code runs once, and all importers share the same exports
            object. This makes the classic singleton class pattern largely
            unnecessary in modern JavaScript.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The Singleton Pattern&apos;s architecture revolves around controlling
          instance creation and providing access to the shared instance across
          the application.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/singleton-pattern-diagram-1.svg"
          alt="Singleton Lazy Initialization Access Flow"
          caption="Lazy initialization flow — first access creates the instance, subsequent accesses return the cached instance"
        />

        <p>
          The lazy initialization flow ensures that resource-heavy singletons
          (WebSocket connections, IndexedDB instances, analytics services) are
          only created when a component or service first requests them. This is
          particularly important in code-split applications where entire feature
          modules may never be loaded during a user session.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/singleton-pattern-diagram-2.svg"
          alt="Shared Service Registry"
          caption="Shared service registry — multiple consumers access centralized services (logger, config, cache) through a singleton registry"
        />

        <p>
          A service registry is a common application of the singleton pattern in
          large frontend applications. Rather than each component importing
          services directly, a central registry holds references to shared
          services. This enables runtime service replacement (for testing or
          feature flags) and provides a single point for initialization
          ordering.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/singleton-pattern-diagram-3.svg"
          alt="Global State Coupling vs Dependency Injection"
          caption="Comparison of singleton global access (tight coupling) vs dependency injection (loose coupling, testable)"
        />

        <p>
          The diagram above illustrates the fundamental trade-off between
          singleton access and dependency injection. With singletons, components
          reach out to the global instance, creating an implicit dependency that
          is invisible in the component&apos;s API. With dependency injection,
          the dependency is passed in explicitly (via props, context, or
          constructor), making it visible, replaceable, and testable.
        </p>
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
              <td className="p-3">
                <strong>Simplicity</strong>
              </td>
              <td className="p-3">
                • Easy to implement and understand
                <br />
                • No configuration needed for consumers
                <br />• Natural fit for module-level state in JS
              </td>
              <td className="p-3">
                • Hides dependency graph from consumers
                <br />
                • Difficult to understand initialization order
                <br />• Obscures what a component actually needs
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Testing</strong>
              </td>
              <td className="p-3">
                • Single source of truth simplifies integration tests
                <br />• Consistent behavior across test suite
              </td>
              <td className="p-3">
                • Shared state leaks between tests
                <br />
                • Mocking singletons requires module-level hacks
                <br />• Cannot run tests in parallel safely
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scalability</strong>
              </td>
              <td className="p-3">
                • Avoids duplicating expensive resources
                <br />
                • Centralized configuration management
                <br />• Reduced memory footprint
              </td>
              <td className="p-3">
                • Single point of failure
                <br />
                • Contention in concurrent environments
                <br />• Difficult to scope per-tenant in multi-tenant apps
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Micro-Frontends</strong>
              </td>
              <td className="p-3">
                • Shared singletons reduce duplicate instances
                <br />• Consistent state across micro-apps
              </td>
              <td className="p-3">
                • Module-level singletons break across MFE boundaries
                <br />
                • Version conflicts create multiple instances
                <br />• Coupling between independently deployed apps
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>
              Prefer Module-Level Singletons Over Class Singletons:
            </strong>{" "}
            In JavaScript, a module-level variable exported from a module is
            already a singleton. There is no need for the classic getInstance()
            pattern. Simply export a created instance or use a factory function
            that caches its result.
          </li>
          <li>
            <strong>Make Singletons Injectable:</strong> Even when using
            singletons, design them to accept dependencies through
            initialization rather than importing them directly. This allows
            tests to inject mocks without module-level patching.
          </li>
          <li>
            <strong>Provide Reset Mechanisms for Testing:</strong> Expose a
            reset or destroy method on singletons that clears internal state.
            Call this in test teardown (afterEach) to prevent state leakage
            between test cases. Guard this method with environment checks in
            production builds.
          </li>
          <li>
            <strong>Use React Context for Component-Scoped Singletons:</strong>{" "}
            When a singleton should be scoped to a component subtree rather than
            the entire application, use React Context with a Provider. This
            enables multiple instances in different parts of the tree (useful
            for testing, micro-frontends, or multi-tenant UIs).
          </li>
          <li>
            <strong>Document Singleton Lifecycle:</strong> Singletons that hold
            resources (connections, timers, subscriptions) should document when
            they are initialized, what triggers cleanup, and what happens during
            hot module replacement (HMR). Unexpected singleton re-creation
            during HMR is a common source of connection leaks in development.
          </li>
          <li>
            <strong>Limit Singleton Surface Area:</strong> A singleton should
            expose the minimum necessary API. If a singleton is growing to have
            dozens of methods, it likely needs to be decomposed into multiple
            focused services that are individually injectable.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Test Pollution:</strong> The most common singleton pitfall —
            state from one test leaks into subsequent tests because the
            singleton is not reset. This creates flaky tests that pass
            individually but fail when run together. Always reset singleton
            state in test teardown hooks.
          </li>
          <li>
            <strong>Hidden Dependencies:</strong> When components import
            singletons directly, the dependency is invisible from the
            component&apos;s interface. This makes refactoring dangerous — you
            cannot determine a component&apos;s dependencies by examining its
            props or constructor.
          </li>
          <li>
            <strong>Memory Leaks in SPAs:</strong> Singletons that accumulate
            state (event listeners, cached data, subscriptions) without cleanup
            grow unbounded in long-running single-page applications. Implement
            size limits, LRU eviction, and proper cleanup on relevant lifecycle
            events.
          </li>
          <li>
            <strong>Multiple Instances in Micro-Frontends:</strong> When
            different micro-frontends bundle the same library, each gets its own
            module scope and therefore its own &quot;singleton&quot; instance.
            This breaks the single-instance invariant. Solutions include shared
            scopes via Module Federation or external singleton registration on
            the window object.
          </li>
          <li>
            <strong>Premature Singletonification:</strong> Making something a
            singleton before confirming that only one instance is needed creates
            inflexibility. If requirements later demand multiple instances
            (multi-tenant, multi-window, testing), refactoring away from a
            singleton is expensive. Start with dependency injection and promote
            to singleton only when the single-instance constraint is genuinely
            required.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Redux/Zustand Stores:</strong> State management stores are
            singletons by design — one store holds the entire application state
            tree. Redux explicitly creates a single store via createStore(),
            while Zustand stores are module-level singletons that components
            subscribe to via hooks.
          </li>
          <li>
            <strong>Analytics Services:</strong> Services like Segment,
            Amplitude, or Mixpanel are initialized once with an API key and
            shared across the entire application. Multiple instances would
            duplicate events and waste bandwidth.
          </li>
          <li>
            <strong>Authentication Managers:</strong> Auth state (tokens, user
            info, session) is inherently global — there is one authenticated
            user per browser tab. Auth managers like Auth0&apos;s SDK or
            Firebase Auth operate as singletons.
          </li>
          <li>
            <strong>WebSocket Connection Pools:</strong> Applications that use
            real-time features (chat, notifications, live updates) maintain a
            single WebSocket connection managed by a singleton service. Multiple
            connections would waste server resources and create ordering issues.
          </li>
          <li>
            <strong>Feature Flag Clients:</strong> LaunchDarkly, Unleash, and
            similar services provide singleton clients that maintain a
            persistent connection for real-time flag updates. The client caches
            flag values and notifies subscribers on changes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why are ES Modules effectively singletons, and what are the
              implications?
            </p>
            <p className="mt-2 text-sm">
              A: When a module is first imported, its top-level code executes
              and the resulting exports are cached by the runtime (Node.js
              module cache or bundler module map). Subsequent imports return the
              cached exports without re-executing the module. This means any
              mutable state at module level is shared across all importers —
              which is the singleton guarantee. The implication is that you
              rarely need the classic getInstance() pattern in JavaScript;
              simply exporting an object or instance from a module gives you
              singleton behavior. However, this breaks down in micro-frontend
              scenarios where each app has its own module scope.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test code that depends on singletons?
            </p>
            <p className="mt-2 text-sm">
              A: Three strategies: (1) Design singletons with a reset() method
              that restores initial state, called in afterEach(). (2) Use
              dependency injection — pass the singleton as a parameter or React
              Context value so tests can provide mock implementations. (3) Use
              module mocking (jest.mock() or vi.mock()) to replace the singleton
              module entirely. Strategy 2 is preferred because it makes
              dependencies explicit and avoids the brittleness of module-level
              mocking. Zustand, for example, provides a way to create stores
              within test setup to avoid shared state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use a singleton vs dependency injection?
            </p>
            <p className="mt-2 text-sm">
              A: Use singletons for genuinely global, infrastructure-level
              concerns: logging, analytics, configuration, and connection pools.
              Use dependency injection for business logic services that may need
              different implementations (strategies), per-request scoping
              (server-side rendering), or multiple instances (multi-tenant
              applications). A good heuristic: if you can imagine needing two
              instances simultaneously (even for testing), use DI. If the very
              concept of two instances is nonsensical (two analytics pipelines
              sending duplicate events), a singleton is appropriate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do singletons behave in micro-frontend architectures?
            </p>
            <p className="mt-2 text-sm">
              A: Each micro-frontend typically has its own JavaScript bundle and
              module scope, which means module-level singletons are duplicated
              across micro-apps. This is problematic for shared services (auth,
              analytics, routing). Solutions include: (1) Module
              Federation&apos;s shared scope to ensure a single copy of a
              library, (2) registering singletons on the window object with a
              namespaced key, (3) using a shell application that provides shared
              services via a contract API. Each approach has trade-offs: Module
              Federation requires webpack, window globals lack type safety, and
              shell-provided services create coupling to the shell&apos;s API.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the Service Locator pattern, and how does it relate to
              Singleton?
            </p>
            <p className="mt-2 text-sm">
              A: A Service Locator is a singleton registry that other objects
              query to obtain dependencies. Instead of importing a service
              directly, a component asks the locator for a service by name or
              type. This decouples the component from the service&apos;s
              concrete implementation while still providing global access. In
              React, Context + useContext is essentially a component-tree-scoped
              service locator. The pattern is controversial because it hides
              dependencies (the component depends on the locator and whatever it
              resolves), making the dependency graph implicit rather than
              explicit in the component&apos;s API.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.patterns.dev/vanilla/singleton-pattern"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev — Singleton Pattern
            </a>
          </li>
          <li>
            <a
              href="https://refactoring.guru/design-patterns/singleton"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Refactoring Guru — Singleton Pattern
            </a>
          </li>
          <li>
            <a
              href="https://wiki.c2.com/?SingletonPattern"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              C2 Wiki — Singleton Pattern Discussion
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react/createContext"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation — createContext
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
