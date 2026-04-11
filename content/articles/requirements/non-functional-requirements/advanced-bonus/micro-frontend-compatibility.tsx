"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-micro-frontend-compatibility-extensive",
  title: "Micro-Frontend Compatibility",
  description: "Comprehensive guide to micro-frontend architecture, covering module federation, integration patterns, communication strategies, and organizational considerations for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "micro-frontend-compatibility",
  version: "extensive",
  wordCount: 5700,
  readingTime: 23,
  lastUpdated: "2026-04-11",
  tags: ["advanced", "nfr", "micro-frontends", "module-federation", "architecture", "frontend"],
  relatedTopics: ["frontend-deployment-strategy", "build-optimization", "state-management-strategy"],
};

export default function MicroFrontendCompatibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Micro-Frontends</strong> extend the microservices architecture pattern to the frontend
          layer. Instead of building a monolithic frontend application, the user interface is decomposed
          into smaller, independently developable and deployable units called micro-frontends. Each
          micro-frontend is owned by a cross-functional team and can be built, tested, and deployed
          independently without coordinating with other teams or triggering full application rebuilds.
        </p>
        <p>
          The micro-frontend architecture emerged around 2016 to 2017 as organizations struggled with the
          limitations of monolithic frontends. Slow build times that stretched to tens of minutes, difficult
          coordination across teams sharing a single codebase, technology lock-in that prevented incremental
          upgrades, and the inability to refactor large codebases without massive risk all drove the search
          for a more modular approach to frontend architecture.
        </p>
        <p>
          Micro-frontends align frontend architecture with organizational structure, reflecting Conway&apos;s
          Law in practice. Instead of having a single frontend team working on a monolithic application,
          product-aligned teams own vertical slices of functionality from database to user interface. Each
          team is responsible for the entire lifecycle of their micro-frontend including development,
          testing, deployment, and monitoring. This enables technology agnosticism where different teams
          can use different frameworks or versions, isolated failure where a problem in one micro-frontend
          does not bring down the entire application, and incremental adoption where organizations can
          gradually migrate from monolith to micro-frontends.
        </p>
        <p>
          The trade-off is significant. Micro-frontends introduce complexity in integration, shared state
          management, and user experience consistency. They are not suitable for all organizations. Small
          teams or startups may find the overhead of coordination, infrastructure, and testing outweighs
          the benefits. Micro-frontends become valuable when team coordination costs in a monolithic
          frontend become a bottleneck to delivery velocity, when different parts of the application have
          genuinely different technology requirements, or when incremental migration from a legacy
          frontend is necessary.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          There are several patterns for integrating micro-frontends, each with different trade-offs in
          complexity, performance, and team autonomy. <strong>Build-time integration</strong> treats
          micro-frontends as NPM packages that are imported by a host application at build time. Each team
          develops their micro-frontend as a separate repository, publishes it to a package registry on
          release, and the host application declares dependencies on these packages. At build time, all
          micro-frontends are bundled together into a single application. This approach is simple to
          implement using the standard NPM workflow and provides a single bundle with no runtime integration
          overhead. However, it is not truly independent since deploying one micro-frontend requires
          rebuilding the entire application, version coordination is needed for the host to update package
          versions, and bundle size grows as all micro-frontends are included regardless of whether the
          user needs them.
        </p>
        <p>
          <strong>Run-time integration using iframes</strong> runs each micro-frontend in a separate
          iframe, completely isolated from the host and other micro-frontends. The host application defines
          iframe containers in the layout, each micro-frontend is a standalone application served from its
          own origin, and communication happens via the postMessage API. This provides complete isolation
          where CSS, JavaScript, and global scope cannot conflict, true independent deployment where each
          micro-frontend can be updated without affecting others, and security boundaries where
          micro-frontends cannot access each other&apos;s data. The disadvantages are significant though:
          iframes have inherent limitations with scrolling, responsive design, and SEO, postMessage
          communication is asynchronous and verbose, each iframe has its own JavaScript engine instance
          increasing memory usage, and focus management across iframes creates accessibility challenges.
        </p>
        <p>
          <strong>Run-time integration using Web Components</strong> packages micro-frontends as Custom
          Elements that are loaded dynamically by the host. Each micro-frontend exports a Web Component
          like mf-product-list, the host loads the micro-frontend&apos;s JavaScript bundle dynamically,
          and the custom element is registered and used like any HTML element. This is framework agnostic
          and works with any framework or vanilla JavaScript, uses native browser support without a runtime
          framework, provides encapsulation through Shadow DOM for CSS and DOM isolation, and uses familiar
          HTML element patterns with attributes, events, and properties. The disadvantages include framework
          integration overhead since React, Vue, and Angular require adapters for Web Components, Shadow DOM
          limitations where global styles do not penetrate and event propagation differs, browser
          compatibility requiring polyfills for older browsers, and complex state management between
          Web Components.
        </p>
        <p>
          <strong>Module Federation</strong> from Webpack 5 and beyond enables true runtime code sharing
          between independently built applications. Each micro-frontend is configured as a remote that
          exposes specific modules, the host application is configured as a consumer that declares
          dependencies on remotes, and at runtime the host dynamically fetches and executes remote
          modules. Shared dependencies like React and lodash are deduplicated and loaded once. This
          provides true independent deployment where remotes can be updated without host changes, shared
          dependencies that avoid loading React multiple times, granular code sharing where specific
          components rather than entire apps are exposed, and version flexibility supporting multiple
          versions of shared dependencies. The requirements include Webpack 5 or later, careful
          configuration of shared dependencies, runtime coupling where the host depends on remote
          availability, and management of version conflicts between incompatible shared dependency
          versions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-integration-patterns.svg"
          alt="Micro-Frontend Integration Patterns"
          caption="Integration Patterns — comparing Build-Time (NPM), Run-Time (iframe, Web Components), and Module Federation approaches with trade-offs"
        />
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Module Federation introduces two primary roles in its architecture. The host, also called the
          consumer, is the application that consumes remote modules and typically serves as the shell or
          container application. The remote, also called the provider, is the application that exposes
          modules for consumption and typically represents a micro-frontend. An application can be both
          a host and a remote simultaneously, enabling complex dependency graphs where micro-frontends
          share components with each other.
        </p>
        <p>
          Configuration of Module Federation happens in the webpack configuration file. Remote
          configuration defines the unique identifier for the remote used by hosts to reference it, the
          output file for the remote entry such as remoteEntry.js, a map of local paths to exposed
          module names, and dependencies to share with hosts. Host configuration defines a map of remote
          names to their entry URLs and dependencies to share with remotes. Properly configuring shared
          dependencies is critical to avoid loading multiple copies of React or other libraries. Sharing
          strategies include singleton mode where only one instance of the dependency is loaded, version
          range mode where acceptable version ranges are specified and incompatible versions are loaded
          separately, and eager mode where the shared dependency is loaded immediately rather than
          lazily.
        </p>
        <p>
          Module Federation supports loading remotes dynamically at runtime. Static remotes are configured
          at build time with fixed remote URLs. Dynamic remotes determine the remote URL at runtime from
          a configuration service or feature flag. Dynamic remotes enable A/B testing different versions
          of a micro-frontend, canary deployments, and multi-tenant applications where different tenants
          receive different micro-frontend versions.
        </p>
        <p>
          Communication between micro-frontends follows several patterns. Custom DOM events provide loose
          coupling where micro-frontends dispatch and listen for custom events on DOM elements. This is
          simple and framework agnostic but lacks type safety and makes debugging difficult. A shared
          state store using Redux, Zustand, or RxJS provides centralized state with predictable data
          flow and easy debugging through dev tools, but creates tight coupling and makes the store a
          coordination point between teams. URL and query parameters encode state in the URL, making it
          the source of truth with bookmarkable state and browser navigation support, but are limited
          in data capacity and unsuitable for sensitive data.
        </p>
        <p>
          Window object and localStorage provide simple shared storage where the host exposes an API
          on the window object and micro-frontends call methods to get and set state. This persists
          across page reloads but causes global namespace pollution and lacks type safety. An event bus
          or message broker using a dedicated library like EventEmitter, Mitt, or RxJS Subject facilitates
          communication with decoupled architecture and support for complex event patterns, but adds an
          additional dependency and risks memory leaks if subscriptions are not cleaned up.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/module-federation-architecture.svg"
          alt="Module Federation Architecture"
          caption="Module Federation — showing Host application consuming Remote micro-frontends, shared dependency deduplication, and dynamic remote loading"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-communication-patterns.svg"
          alt="Micro-Frontend Communication Patterns"
          caption="Communication Patterns — comparing Custom Events, Shared State Store, URL Parameters, Window Storage, and Event Bus approaches"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          The decision to adopt micro-frontends involves weighing team autonomy against integration
          complexity. Build-time integration with NPM packages offers the simplest migration path from
          a monolith but sacrifices the independent deployment benefit that motivates micro-frontends in
          the first place. Module Federation provides true independent deployment but introduces runtime
          coupling where the host depends on remote availability, configuration complexity requiring
          careful shared dependency management, and the risk of version conflicts between incompatible
          shared dependency versions. iframe integration provides the strongest isolation and security
          boundaries but degrades user experience with scrolling limitations, responsive design
          challenges, and SEO problems.
        </p>
        <p>
          Communication pattern selection involves coupling trade-offs. Custom events provide the loosest
          coupling but the weakest type safety and debugging support. Shared state stores provide strong
          type safety and debugging but create tight coupling between micro-frontends through a shared
          dependency on the store schema. URL parameters provide the strongest source-of-truth guarantees
          with bookmarkable state but cannot carry complex or sensitive data. The right choice depends on
          the specific communication need: use custom events for cross-cutting concerns like user
          authentication state changes, shared state stores for tightly-coupled workflows within a domain,
          and URL parameters for navigation state that should be bookmarkable and shareable.
        </p>
        <p>
          Styling consistency across micro-frontends presents another trade-off space. Shared design
          systems published as NPM packages ensure visual consistency but create coupling through version
          dependencies that require coordinated updates. Module Federation-exposed design systems provide
          runtime consistency where all micro-frontends consume the same version, but create a runtime
          dependency where the design system must be available for micro-frontends to render correctly.
          CSS isolation through CSS Modules or CSS-in-JS prevents conflicts but makes it harder to
          maintain visual consistency. Shadow DOM provides true encapsulation but breaks theming through
          CSS custom properties.
        </p>
        <p>
          Routing coordination also involves trade-offs. Host-controlled routing provides centralized
          control with consistent navigation and easy authentication guards but makes the host a
          coordination point where micro-frontends cannot independently add routes. Distributed routing
          where micro-frontends register their routes with the host provides micro-frontend autonomy
          but adds implementation complexity, potential route conflicts, and harder debugging. The
          choice depends on organizational maturity and the degree of team autonomy required.
        </p>
        <p>
          Performance is perhaps the most significant trade-off. Micro-frontends can significantly impact
          performance if not implemented carefully. Multiple JavaScript bundles from different
          micro-frontends increase total download size. Duplicate shared dependencies across bundles
          waste bandwidth. Runtime loading of micro-frontends adds latency to navigation. Code splitting
          and lazy loading must be used aggressively to mitigate these impacts, and bundle size monitoring
          should be part of the CI/CD pipeline for each micro-frontend.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Maintaining visual consistency across micro-frontends while preserving team autonomy requires
          investment in a shared design system. The design system should be published as an NPM package
          with semantic versioning or exposed via Module Federation for runtime sharing. Migration guides
          for breaking changes and support for multiple versions during transition periods reduce the
          coordination burden. The design system should include accessibility guidelines and testing to
          ensure all micro-frontends meet minimum accessibility standards. CSS isolation should use CSS
          Modules or CSS-in-JS to prevent style collisions, with CSS custom properties defining design
          tokens for consistent theming across micro-frontends.
        </p>
        <p>
          Testing micro-frontends requires a multi-layered approach. Isolated testing covers unit tests
          for components, utilities, and business logic within the micro-frontend, component tests for
          UI components with mocked dependencies, and contract tests to verify the micro-frontend adheres
          to its integration contract including exposed modules, events, and API. Integration testing
          verifies that Module Federation remotes load correctly and shared dependencies are deduplicated,
          events are dispatched and received correctly between micro-frontends, and navigation between
          micro-frontends works as expected. End-to-end testing runs Playwright or Cypress tests against
          the assembled application, visual regression testing uses Percy or Chromatic to catch visual
          inconsistencies, and performance testing measures load times, bundle sizes, and runtime
          performance.
        </p>
        <p>
          Organizational structure is as important as technical architecture for micro-frontend success.
          Teams should be aligned with business domains rather than technical layers, with each team
          owning a vertical slice of functionality end-to-end. Teams should be cross-functional including
          frontend, backend, QA, and product expertise. A central platform team enables micro-frontend
          adoption by maintaining CI/CD pipelines, hosting, Module Federation configuration, providing
          scaffolding and templates, maintaining the shared design system, and documenting integration
          patterns and best practices.
        </p>
        <p>
          Governance should balance autonomy with consistency. Technical standards should define minimum
          requirements for accessibility, security, and performance. API contracts should document
          integration points between micro-frontends. Version policies should define how shared
          dependencies are versioned and updated. A lightweight architecture review process for major
          changes prevents drift without creating bottlenecks.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-organization-structure.svg"
          alt="Micro-Frontend Organization Structure"
          caption="Organization Structure — showing product-aligned teams, platform team responsibilities, and governance model"
        />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Premature optimization is the most common pitfall with micro-frontends. Organizations adopt
          micro-frontends because they are trendy without having a clear need that justifies the
          complexity. The recommended approach is to start with a modular monolith using clear internal
          boundaries and extract micro-frontends only when team coordination becomes a measurable
          bottleneck to delivery velocity. If a single team can develop and deploy the monolith
          efficiently, micro-frontends add overhead without benefit.
        </p>
        <p>
          Over-sharing dependencies creates tight coupling that undermines the autonomy benefits of
          micro-frontends. When teams share too many dependencies, they create implicit coordination
          requirements because updating a shared dependency requires all teams to test and validate
          compatibility. The guideline is to share only major frameworks like React or Vue and critical
          utilities, letting teams choose their own libraries for non-critical functionality. Even
          shared frameworks should be shared as singletons to avoid loading multiple copies, with
          version ranges used only when minor version differences matter.
        </p>
        <p>
          Ignoring performance during micro-frontend implementation leads to applications that are
          significantly slower than their monolithic counterparts. Each micro-frontend adds its own
          JavaScript bundle, and without aggressive code splitting and lazy loading, the total download
          size can exceed that of a well-optimized monolith. Runtime loading of micro-frontends adds
          latency to navigation, which must be mitigated with prefetching strategies and skeleton
          loading states. Bundle size monitoring should be part of the CI/CD pipeline for each
          micro-frontend with budgets that fail builds when thresholds are exceeded.
        </p>
        <p>
          Inconsistent user experience is a common outcome when micro-frontend teams operate without
          a shared design system. Different teams implement similar UI patterns differently, creating
          a fragmented user experience where buttons, forms, and navigation elements look and behave
          differently across the application. Investing in a shared design system and enforcing
          accessibility standards across all micro-frontends through code review and visual regression
          testing is essential.
        </p>
        <p>
          Debugging across micro-frontend boundaries is significantly more complex than debugging within
          a monolith. When an issue spans multiple micro-frontends, engineers must understand the
          communication patterns, trace events across boundaries, and coordinate debugging sessions
          across teams. Implementing centralized logging, distributed tracing, and clear error
          boundaries to isolate failures reduces the debugging burden. Each micro-frontend should
          include context information in its logs including its name, version, and the current route
          to aid in cross-frontend issue resolution.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          E-commerce platforms are one of the most common adopters of micro-frontends. A large retailer
          decomposed their frontend into micro-frontends for product catalog, search, shopping cart,
          checkout, and user account management. Each micro-frontend was owned by the corresponding
          business domain team. The product catalog team could deploy new product display features
          without coordinating with the checkout team, and the search team could experiment with
          different search result layouts independently. Module Federation was used for runtime
          integration with a shared design system exposed as a remote. The result was a significant
          reduction in deployment coordination overhead and the ability for teams to iterate at
          different velocities based on their domain&apos;s needs.
        </p>
        <p>
          Enterprise SaaS applications use micro-frontends to manage complex product surfaces with
          multiple feature areas owned by different teams. A project management platform decomposed
          their application into micro-frontends for dashboard, project views, task management, reporting,
          and administration. The reporting team used Angular for their micro-frontend while the rest
          of the application used React, demonstrating the technology agnosticism benefit. Communication
          between micro-frontends used custom events for cross-cutting concerns like user authentication
          and URL parameters for navigation state. The platform team maintained the Module Federation
          infrastructure and the shared design system.
        </p>
        <p>
          Legacy migration is another compelling use case. A financial services company needed to
          migrate their legacy monolithic frontend built with an outdated framework to a modern React
          application. Rather than a big-bang rewrite, they adopted micro-frontends with iframe
          integration for the legacy application. New features were built as React micro-frontends
          integrated via Module Federation, and the legacy application was gradually decomposed into
          smaller micro-frontends that were rewritten and replaced incrementally. This approach allowed
          continuous delivery of new features during the migration, which would have been impossible
          with a full rewrite.
        </p>
        <p>
          Content management systems and publishing platforms use micro-frontends to enable different
          teams to own different parts of the content creation and consumption experience. A media
          company implemented micro-frontends for the article editor, content management dashboard,
          analytics view, and public-facing article pages. The editorial team owned the article editor
          and could deploy new editing features independently, while the engineering team owned the
          public-facing pages and optimized them for performance and SEO separately from the internal
          tools. This separation allowed different teams to optimize for their specific user needs
          without creating dependencies on each other&apos;s release cycles.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose micro-frontends over a monolithic frontend, and when would you avoid them?</p>
            <p className="mt-2 text-sm">
              A: Choose micro-frontends when multiple teams need to work independently on different parts
              of the application and deployment coordination has become a bottleneck to delivery velocity.
              They are also appropriate when you need to incrementally migrate a legacy frontend, as they
              allow gradual replacement without a big-bang rewrite. Different parts of the application
              having genuinely different technology requirements is another valid use case. Avoid
              micro-frontends for small teams or startups where the overhead of integration, testing, and
              infrastructure outweighs the benefits. Avoid them when the application is relatively simple
              and a modular monolith with clear internal boundaries provides sufficient organization.
              Start with a modular monolith and extract micro-frontends only when team coordination costs
              become a measurable bottleneck.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Module Federation work, and what are the key configuration considerations?</p>
            <p className="mt-2 text-sm">
              A: Module Federation allows applications to dynamically load code from other applications
              at runtime. Remotes expose modules via an entry file called remoteEntry.js, specifying
              which local modules are available for consumption. Hosts declare remotes and their entry
              URLs in their webpack configuration, along with shared dependencies. At runtime, hosts
              fetch remote modules from the remoteEntry.js file and execute them. Shared dependencies
              like React are deduplicated so that only one instance is loaded across host and remotes.
              Key configuration considerations include marking React as a singleton to avoid multiple
              instances, using version ranges for libraries where minor version differences matter, and
              monitoring bundle size to ensure sharing is working correctly. Dynamic remote loading
              enables A/B testing and canary deployments by determining remote URLs at runtime rather
              than build time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do micro-frontends communicate with each other, and how do you choose the right pattern?</p>
            <p className="mt-2 text-sm">
              A: Communication patterns include custom DOM events for loose coupling where micro-frontends
              dispatch and listen for events, shared state stores like Redux or Zustand for centralized
              state with predictable data flow, URL parameters for bookmarkable state that serves as the
              source of truth, window object and localStorage for simple shared data that persists across
              reloads, and event buses or message brokers for complex event patterns with middleware
              support. The choice depends on coupling requirements and data sensitivity. Use custom
              events for cross-cutting concerns like authentication state changes, shared state stores
              for tightly-coupled workflows within a domain, URL parameters for navigation state, and
              avoid window storage for sensitive data due to security concerns. Always pair subscriptions
              with unsubscriptions in cleanup to prevent memory leaks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the key challenges of micro-frontends, and how do you address them?</p>
            <p className="mt-2 text-sm">
              A: The key challenges span performance, user experience consistency, complexity, coordination,
              and testing. Performance suffers from multiple bundles and potential duplicate dependencies,
              addressed through aggressive code splitting, lazy loading, shared dependency deduplication,
              and bundle size monitoring in CI/CD. UX consistency suffers when teams implement differently
              without a shared design system, addressed by investing in a design system with semantic
              versioning and visual regression testing. Complexity in routing, state management, and
              debugging across boundaries is addressed through clear architectural patterns, centralized
              logging, and distributed tracing. Coordination of shared dependencies and design system
              updates is addressed through a platform team and lightweight governance. Testing across
              isolated, integration, and E2E layers is addressed through contract testing and multiple
              test environments.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure consistent styling and theming across micro-frontends?</p>
            <p className="mt-2 text-sm">
              A: Consistent styling requires a combination of shared infrastructure and governance.
              Publish a shared design system as an NPM package with semantic versioning or expose it
              via Module Federation for runtime sharing. Use CSS custom properties to define design
              tokens for colors, spacing, and typography that all micro-frontends inherit from the
              root level. Implement CSS isolation using CSS Modules or CSS-in-JS to prevent style
              collisions between micro-frontends while still allowing theming through CSS custom
              properties that penetrate Shadow DOM boundaries. The platform team maintains design
              tokens and provides documentation, and visual regression testing with tools like Percy
              or Chromatic catches inconsistencies. Breaking changes in the design system should
              include migration guides and support for multiple versions during transition periods.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle routing and navigation in a micro-frontend architecture?</p>
            <p className="mt-2 text-sm">
              A: There are two primary approaches to routing. Host-controlled routing is where the host
              application owns the router and delegates to micro-frontends based on the current route.
              The host defines route-to-micro-frontend mappings, and when the user navigates to a path
              like products, the host loads the Product micro-frontend which handles its own sub-routes
              internally. This provides centralized control, consistent navigation, and easy
              authentication guard implementation, but makes the host a coordination point. Distributed
              routing is where each micro-frontend registers its routes with the host, which aggregates
              and configures routes dynamically. This provides micro-frontend autonomy but adds
              complexity and potential route conflicts. Regardless of the approach, ensure smooth
              transitions between micro-frontends with loading states, skeleton screens, error handling
              for load failures, and scroll position preservation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://micro-frontends.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              micro-frontends.org — The Official Micro-Frontends Guide
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/concepts/module-federation/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack Module Federation Documentation
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/micro-frontends.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Micro Frontends
            </a>
          </li>
          <li>
            <a href="https://module-federation.github.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Module Federation Official Documentation
            </a>
          </li>
          <li>
            <a href="https://www.amazon.com/Building-Enterprise-Applications-Micro-Frontends-Engineering/dp/1800563922" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Building Enterprise Applications with Micro-Frontends
            </a>
          </li>
          <li>
            <a href="https://single-spa.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              single-spa — JavaScript Framework for Micro-Frontends
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
