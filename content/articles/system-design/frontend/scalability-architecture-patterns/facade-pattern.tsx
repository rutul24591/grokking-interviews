"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-facade-pattern",
  title: "Facade Pattern",
  description:
    "Comprehensive guide to the Facade Pattern in frontend architecture covering API abstraction layers, subsystem simplification, SDK design, and practical applications in modern web applications.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "facade-pattern",
  wordCount: 3400,
  readingTime: 14,
  lastUpdated: "2026-03-20",
  tags: ["frontend", "design-patterns", "facade", "structural-patterns", "API-design"],
  relatedTopics: ["module-pattern", "observer-pattern", "publish-subscribe-pattern"],
};

export default function FacadePatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Facade Pattern</strong> provides a simplified, unified interface to a complex subsystem
          of classes, functions, or APIs. Rather than exposing the full complexity of underlying systems to
          consumers, a facade presents a streamlined API that handles the common use cases, hiding
          orchestration logic, error handling, and configuration details behind a clean abstraction boundary.
        </p>
        <p>
          In frontend development, facades are everywhere — and recognizing them is key to designing
          maintainable architectures. React custom hooks are facades over complex state and effect logic.
          Axios is a facade over XMLHttpRequest and fetch. The Web Audio API is a facade over low-level
          audio processing. jQuery was arguably the most successful facade in web history, abstracting
          away cross-browser DOM inconsistencies behind a single $ function.
        </p>
        <p>
          The pattern becomes critical at scale when frontend applications interact with multiple backend
          services, browser APIs, third-party SDKs, and platform-specific features. Without facades, every
          component that needs to, say, upload a file must understand presigned URLs, multipart encoding,
          progress tracking, retry logic, and CDN invalidation. A facade encapsulates this complexity,
          exposing a simple uploadFile(file, options) interface.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Subsystem Abstraction:</strong> The facade sits between consumers and one or more
            subsystems, translating simple high-level calls into coordinated low-level operations. The
            subsystems continue to work independently — the facade does not replace them, it wraps them.
          </li>
          <li>
            <strong>Simplified API Surface:</strong> The facade exposes only the operations that consumers
            commonly need, with sensible defaults for configuration options. Advanced users can still access
            the underlying subsystems directly when the facade&apos;s simplified API is insufficient.
          </li>
          <li>
            <strong>Decoupling:</strong> By routing all subsystem access through the facade, consumer code
            is insulated from changes in the underlying implementation. Swapping a REST API for GraphQL,
            or replacing localStorage with IndexedDB, requires changing only the facade — not every component
            that uses storage.
          </li>
          <li>
            <strong>Orchestration:</strong> Facades often coordinate multiple subsystem calls in a specific
            order, handling error conditions and rollback at each step. This transaction-like orchestration
            is the facade&apos;s primary value — it encapsulates multi-step workflows that would otherwise
            be duplicated across consumers.
          </li>
          <li>
            <strong>Adapter vs Facade Distinction:</strong> An adapter converts one interface to another
            (making incompatible interfaces work together). A facade simplifies an interface (making a
            complex system easier to use). An adapter preserves complexity but changes the shape; a facade
            reduces complexity by hiding details.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The Facade Pattern creates a layer of indirection between consumers and subsystems, dramatically
          reducing the coupling surface area.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/facade-pattern-diagram-1.svg"
          alt="Client to Facade to Subsystems Flow"
          caption="Client→Facade→Subsystems flow — the facade orchestrates calls to DOM, Network, Storage, and Auth subsystems behind a unified API"
        />

        <p>
          In a typical frontend application, a single user action (like &quot;save document&quot;) might
          require validating input, serializing data, making an API call with authentication headers,
          updating local storage, invalidating caches, and showing a notification. Without a facade, the
          component orchestrating this is tightly coupled to five or six subsystems. The facade reduces
          this to a single function call.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/facade-pattern-diagram-2.svg"
          alt="API Facade for REST, GraphQL, and WebSocket"
          caption="API facade — a unified data layer abstracts REST, GraphQL, and WebSocket protocols behind a consistent query/mutation interface"
        />

        <p>
          An API facade is particularly valuable in applications that consume multiple backend protocols.
          The facade normalizes response formats, handles authentication token injection, provides automatic
          retries with exponential backoff, and converts between the consumer&apos;s preferred data model
          and the backend&apos;s wire format. Tools like Apollo Client and tRPC are sophisticated facades
          over network communication.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/facade-pattern-diagram-3.svg"
          alt="Before and After Complexity Reduction"
          caption="Before/after complexity reduction — without a facade, each consumer manages its own subsystem interactions; with a facade, complexity is centralized"
        />
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
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">
                • Dramatically reduces cognitive load for consumers<br />
                • Centralizes error handling and retry logic<br />
                • Common use cases become one-liners
              </td>
              <td className="p-3">
                • Facade itself can become complex over time<br />
                • Hides important details that consumers may need<br />
                • Additional abstraction layer to debug through
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Coupling</strong></td>
              <td className="p-3">
                • Consumers depend on facade, not subsystems<br />
                • Subsystem changes are localized to facade<br />
                • Easier to mock for testing
              </td>
              <td className="p-3">
                • Facade becomes a coupling bottleneck<br />
                • Tight coupling between facade and all subsystems<br />
                • Breaking facade API affects all consumers
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Performance</strong></td>
              <td className="p-3">
                • Facade can batch and optimize subsystem calls<br />
                • Caching can be added at the facade layer<br />
                • Request deduplication and coalescing
              </td>
              <td className="p-3">
                • Additional function call overhead<br />
                • May fetch more data than specific consumers need<br />
                • Caching strategies must fit all consumers
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Evolvability</strong></td>
              <td className="p-3">
                • Backend migrations isolated behind facade<br />
                • A/B testing different implementations transparently<br />
                • Gradual migration from legacy to modern APIs
              </td>
              <td className="p-3">
                • Facade API must be general enough for all use cases<br />
                • Lowest-common-denominator API may limit advanced usage<br />
                • Version management of facade API is critical
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Design for the 80% Use Case:</strong> A facade should make common operations simple
            while still allowing direct subsystem access for the 20% of use cases that need it. Do not try
            to wrap every subsystem capability — that creates a 1:1 mapping that adds indirection without
            reducing complexity.
          </li>
          <li>
            <strong>Use Custom Hooks as React Facades:</strong> In React applications, custom hooks are the
            idiomatic way to implement facades. A useFileUpload() hook that encapsulates presigned URL
            fetching, chunked upload, progress tracking, and error handling is a facade that any component
            can consume with a single hook call.
          </li>
          <li>
            <strong>Keep Facades Stateless When Possible:</strong> Facades that maintain internal state
            become singletons with all their attendant problems (testing, lifecycle, memory). Prefer
            stateless facades that delegate state management to the subsystems or to the consumer.
          </li>
          <li>
            <strong>Provide Escape Hatches:</strong> Allow consumers to access the underlying subsystems
            when the facade is insufficient. Expose the raw client, the underlying connection, or the
            original API alongside the simplified facade methods. This prevents the facade from becoming
            a bottleneck for advanced use cases.
          </li>
          <li>
            <strong>Version Facade APIs Carefully:</strong> Since many consumers depend on the facade,
            breaking changes have outsized impact. Use semantic versioning, deprecation warnings, and
            gradual migration paths when evolving the facade API.
          </li>
          <li>
            <strong>Layer Facades Judiciously:</strong> Multiple layers of facades (a facade wrapping a
            facade wrapping a facade) create deep abstraction stacks that are difficult to debug and
            reason about. Limit facade depth to two layers maximum — one for protocol abstraction and
            one for domain-level operations.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Facade Bloat:</strong> Over time, facades accumulate methods for every use case,
            becoming as complex as the subsystems they were meant to simplify. Guard against this by
            keeping facades focused and splitting them by domain (authFacade, storageFacade, analyticsFacade)
            rather than having one monolithic facade.
          </li>
          <li>
            <strong>Leaky Abstractions:</strong> A facade that exposes subsystem-specific error types,
            configuration formats, or data structures forces consumers to understand the underlying system
            anyway. Translate subsystem errors into facade-level errors and normalize data formats at the
            facade boundary.
          </li>
          <li>
            <strong>Over-Abstraction:</strong> Creating a facade for a subsystem that only has one consumer
            and is already simple to use adds unnecessary indirection. The facade pattern earns its
            complexity when multiple consumers would otherwise duplicate the same coordination logic.
          </li>
          <li>
            <strong>Ignoring Error Propagation:</strong> Facades that catch errors internally without
            exposing them to consumers create silent failures. Always propagate errors (translated to
            facade-appropriate types) so consumers can handle failures in their UI.
          </li>
          <li>
            <strong>Performance-Blind Facades:</strong> A facade that always fetches all data even when
            a consumer only needs a subset wastes bandwidth and processing time. Provide parameterized
            facades that accept options for selecting only the needed data (similar to GraphQL field
            selection).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>jQuery:</strong> The original frontend facade — jQuery abstracted away cross-browser
            DOM inconsistencies, AJAX request handling, animation APIs, and event delegation behind a
            single $ function. Its success demonstrated the power of well-designed facades.
          </li>
          <li>
            <strong>Axios:</strong> A facade over XMLHttpRequest (and Node.js http module) that provides
            a consistent API for HTTP requests with interceptors, automatic JSON parsing, request/response
            transformation, and cancellation support.
          </li>
          <li>
            <strong>Apollo Client:</strong> A sophisticated facade over GraphQL network requests, caching,
            optimistic updates, and real-time subscriptions. Components interact with a simple useQuery/
            useMutation API while Apollo handles cache normalization, request deduplication, and garbage
            collection internally.
          </li>
          <li>
            <strong>Firebase SDK:</strong> Firebase provides facades for authentication, database operations,
            storage, and messaging. Each service has a simplified API that hides the complexity of WebSocket
            connections, token management, offline persistence, and retry logic.
          </li>
          <li>
            <strong>Next.js Data Fetching:</strong> Next.js&apos;s getServerSideProps, getStaticProps, and
            the App Router&apos;s server components act as facades over server-side data fetching, caching,
            revalidation, and serialization. Developers describe what data they need, and the framework
            handles the how.
          </li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://refactoring.guru/design-patterns/facade" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Refactoring Guru — Facade Pattern
            </a>
          </li>
          <li>
            <a href="https://www.patterns.dev/vanilla/facade-pattern" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              patterns.dev — Facade Pattern
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — Custom Hooks
            </a>
          </li>
          <li>
            <a href="https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Joel Spolsky — The Law of Leaky Abstractions
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How are React custom hooks related to the Facade Pattern?</p>
            <p className="mt-2 text-sm">
              A: Custom hooks are the React-idiomatic implementation of the Facade Pattern. A hook like
              useAuth() encapsulates token management, refresh logic, API calls, and state updates behind
              a simple interface that returns user, isAuthenticated, login(), and logout(). Components
              consume the hook without knowing anything about the underlying auth service, token storage
              mechanism, or refresh strategy. This is exactly what a facade does — simplify a complex
              subsystem behind a clean API.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between a Facade, an Adapter, and a Proxy?</p>
            <p className="mt-2 text-sm">
              A: A Facade simplifies — it provides a simpler interface to a complex subsystem. An Adapter
              converts — it makes an incompatible interface work where a specific interface is expected (same
              complexity, different shape). A Proxy controls access — it provides the same interface as the
              original but adds access control, caching, logging, or lazy initialization. Example: a
              simplified API client is a Facade; a wrapper that makes a REST API look like GraphQL is an
              Adapter; a caching layer that intercepts requests and returns cached results is a Proxy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design an API facade for an app consuming REST, GraphQL, and WebSocket?</p>
            <p className="mt-2 text-sm">
              A: Define a protocol-agnostic interface with query(), mutate(), and subscribe() methods. Each
              method accepts a resource identifier and parameters. Internally, route queries to REST GET or
              GraphQL queries based on the resource, mutations to REST POST/PUT or GraphQL mutations, and
              subscriptions to WebSocket channels. Normalize responses to a consistent format. Add
              interceptors for auth token injection, error normalization, and request logging. Provide
              type-safe return types using TypeScript generics keyed to the resource identifier.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the Law of Leaky Abstractions, and how does it apply to facades?</p>
            <p className="mt-2 text-sm">
              A: Joel Spolsky&apos;s law states that all non-trivial abstractions leak — the underlying
              complexity eventually surfaces through the abstraction. For facades, this means consumers
              will eventually encounter subsystem-specific errors, performance characteristics, or edge
              cases that the facade cannot hide. Good facades handle common leaks (retry on network errors,
              normalize data formats) and provide escape hatches for cases where consumers must deal with
              the underlying complexity directly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent a facade from becoming a god object?</p>
            <p className="mt-2 text-sm">
              A: Split facades by domain — authFacade, dataFacade, notificationFacade — rather than having
              one ApplicationFacade. Each facade should correspond to a bounded context. Apply the Interface
              Segregation Principle: consumers should depend only on the facade methods they use, not a
              monolithic interface. Use composition — a higher-level facade can compose lower-level facades
              for operations that span domains, without consolidating all methods into one object.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
