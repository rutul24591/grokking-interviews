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
  wordCount: 12000,
  readingTime: 48,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "micro-frontends", "module-federation", "architecture", "frontend"],
  relatedTopics: ["frontend-deployment-strategy", "build-optimization", "state-management-strategy"],
};

export default function MicroFrontendCompatibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Micro-Frontends</strong> extend the microservices architecture pattern to the frontend layer.
          Instead of building a monolithic frontend application, the UI is decomposed into smaller, independently
          developable and deployable units called micro-frontends. Each micro-frontend is owned by a cross-functional
          team and can be built, tested, and deployed independently.
        </p>
        <p>
          The micro-frontend architecture emerged around 2016-2017 as organizations struggled with the limitations
          of monolithic frontends: slow build times, difficult coordination across teams, technology lock-in, and
          the inability to incrementally upgrade or refactor large codebases.
        </p>
        <p>
          <strong>Key characteristics of micro-frontends:</strong>
        </p>
        <ul>
          <li>
            <strong>Technology agnostic:</strong> Different teams can use different frameworks (React, Vue, Angular)
            or even different versions of the same framework.
          </li>
          <li>
            <strong>Independent deployment:</strong> Teams can deploy their micro-frontend without coordinating
            with other teams or triggering full application rebuilds.
          </li>
          <li>
            <strong>Team autonomy:</strong> Each micro-frontend is owned by a single team responsible for its
            entire lifecycle (development, testing, deployment, monitoring).
          </li>
          <li>
            <strong>Isolated failure:</strong> A failure in one micro-frontend should not bring down the entire
            application.
          </li>
          <li>
            <strong>Incremental adoption:</strong> Organizations can gradually migrate from monolith to
            micro-frontends, reducing risk.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Conway&apos;s Law in Action</h3>
          <p>
            Micro-frontends align your frontend architecture with your organizational structure (Conway&apos;s Law).
            Instead of having a &quot;frontend team&quot; that works on a monolithic app, you have product-aligned
            teams that own vertical slices of functionality from database to UI.
          </p>
          <p className="mt-3">
            <strong>Trade-off:</strong> Micro-frontends introduce complexity in integration, shared state management,
            and user experience consistency. They are not suitable for all organizations — small teams or startups
            may find the overhead outweighs the benefits.
          </p>
        </div>

        <p>
          This article covers micro-frontend integration patterns, Module Federation, communication strategies,
          shared dependency management, and organizational considerations for successful adoption.
        </p>
      </section>

      <section>
        <h2>Integration Patterns</h2>
        <p>
          There are several patterns for integrating micro-frontends, each with different trade-offs in complexity,
          performance, and team autonomy.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Build-Time Integration (NPM Packages)</h3>
        <p>
          Micro-frontends are published as NPM packages and imported by a host application at build time.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Each team develops their micro-frontend as a separate repository.</li>
          <li>On release, the micro-frontend is published to a package registry (npm, private registry).</li>
          <li>The host application declares dependencies on micro-frontend packages.</li>
          <li>At build time, all micro-frontends are bundled together into a single application.</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Simple to implement — uses standard NPM workflow.</li>
          <li>Single bundle means no runtime integration overhead.</li>
          <li>Easy to share code and dependencies between micro-frontends.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Not truly independent — deploying one micro-frontend requires rebuilding the entire app.</li>
          <li>Version coordination needed — host must update package versions to get changes.</li>
          <li>Potential for dependency conflicts between micro-frontends.</li>
          <li>Large bundle size as all micro-frontends are included.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Teams transitioning from monolith, organizations with infrequent deployments,
          or when micro-frontends are tightly coupled.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Run-Time Integration (iframe)</h3>
        <p>
          Each micro-frontend runs in a separate iframe, completely isolated from the host and other micro-frontends.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Host application defines iframe containers in the layout.</li>
          <li>Each micro-frontend is a standalone application served from its own origin.</li>
          <li>Communication happens via <code>postMessage</code> API.</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Complete isolation — CSS, JavaScript, and global scope cannot conflict.</li>
          <li>True independent deployment — each micro-frontend can be updated without affecting others.</li>
          <li>Technology agnostic — any framework or library can be used.</li>
          <li>Security boundaries — micro-frontends cannot access each other&apos;s data.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Poor UX — iframes have inherent limitations (scrolling, responsive design, SEO).</li>
          <li>Communication overhead — <code>postMessage</code> is asynchronous and verbose.</li>
          <li>Performance — each iframe has its own JavaScript engine instance, increasing memory usage.</li>
          <li>Accessibility challenges — focus management across iframes is complex.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Third-party integrations, legacy application embedding, or when strict
          security isolation is required.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Run-Time Integration (Web Components)</h3>
        <p>
          Micro-frontends are packaged as Web Components (Custom Elements) and loaded dynamically by the host.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Each micro-frontend exports a Web Component (e.g., <code>{`<mf-product-list>`}</code>).</li>
          <li>Host application loads the micro-frontend&apos;s JavaScript bundle dynamically.</li>
          <li>Once loaded, the custom element is registered and can be used like any HTML element.</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>Framework agnostic — Web Components work with any framework or vanilla JS.</li>
          <li>Native browser support — no runtime framework required.</li>
          <li>Encapsulation — Shadow DOM provides CSS and DOM isolation.</li>
          <li>Standard API — uses familiar HTML element patterns (attributes, events, properties).</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Framework integration overhead — React, Vue, and Angular require adapters for Web Components.</li>
          <li>Shadow DOM limitations — global styles don&apos;t penetrate, event propagation differs.</li>
          <li>Browser compatibility — older browsers require polyfills.</li>
          <li>Complex state management — sharing state between Web Components requires careful design.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Organizations standardizing on Web Components, design system components,
          or when framework diversity is needed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Module Federation (Webpack 5+)</h3>
        <p>
          Module Federation enables true runtime code sharing between independently built applications.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Each micro-frontend is configured as a &quot;remote&quot; that exposes specific modules.</li>
          <li>The host application is configured as a &quot;consumer&quot; that declares dependencies on remotes.</li>
          <li>At runtime, the host dynamically fetches and executes remote modules.</li>
          <li>Shared dependencies (React, lodash) are deduplicated and loaded once.</li>
        </ol>
        <p>
          <strong>Advantages:</strong>
        </p>
        <ul>
          <li>True independent deployment — remotes can be updated without host changes.</li>
          <li>Shared dependencies — avoids loading React multiple times.</li>
          <li>Granular code sharing — expose specific components, not entire apps.</li>
          <li>Version flexibility — support multiple versions of shared dependencies.</li>
        </ul>
        <p>
          <strong>Disadvantages:</strong>
        </p>
        <ul>
          <li>Webpack 5+ required — not available in older bundlers.</li>
          <li>Configuration complexity — requires careful setup of shared dependencies.</li>
          <li>Runtime coupling — host depends on remote availability at runtime.</li>
          <li>Version conflicts — incompatible shared dependency versions can cause issues.</li>
        </ul>
        <p>
          <strong>Best for:</strong> Modern React/Vue/Angular applications, organizations with mature DevOps,
          or when true independent deployment is critical.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-integration-patterns.svg"
          alt="Micro-Frontend Integration Patterns"
          caption="Integration Patterns — comparing Build-Time (NPM), Run-Time (iframe, Web Components), and Module Federation approaches with trade-offs"
        />
      </section>

      <section>
        <h2>Module Federation Deep Dive</h2>
        <p>
          Module Federation is the most powerful and flexible micro-frontend integration pattern. Understanding
          its mechanics is essential for successful implementation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Architecture Overview</h3>
        <p>
          Module Federation introduces two roles:
        </p>
        <ul>
          <li>
            <strong>Host (Consumer):</strong> The application that consumes remote modules. Typically the
            shell/container application.
          </li>
          <li>
            <strong>Remote (Provider):</strong> The application that exposes modules for consumption. Typically
            a micro-frontend.
          </li>
        </ul>
        <p>
          An application can be both a host and a remote simultaneously, enabling complex dependency graphs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Configuration</h3>
        <p>
          Module Federation is configured in <code>webpack.config.js</code>:
        </p>
        <p>
          <strong>Remote Configuration (exposing modules):</strong>
        </p>
        <ul>
          <li>
            <code>name:</code> The unique identifier for this remote (used by hosts to reference it).
          </li>
          <li>
            <code>filename:</code> The output file for the remote entry (e.g., <code>remoteEntry.js</code>).
          </li>
          <li>
            <code>exposes:</code> Map of local paths to exposed module names.
          </li>
          <li>
            <code>shared:</code> Dependencies to share with hosts (React, etc.).
          </li>
        </ul>
        <p>
          <strong>Host Configuration (consuming remotes):</strong>
        </p>
        <ul>
          <li>
            <code>remotes:</code> Map of remote names to their entry URLs.
          </li>
          <li>
            <code>shared:</code> Dependencies to share with remotes.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shared Dependency Management</h3>
        <p>
          Properly configuring shared dependencies is critical to avoid loading multiple copies of React or
          other libraries.
        </p>
        <p>
          <strong>Sharing strategies:</strong>
        </p>
        <ul>
          <li>
            <strong>Singleton:</strong> Only one instance of the dependency is loaded. If the host has React 18,
            the remote uses the same instance.
          </li>
          <li>
            <strong>Version range:</strong> Specify acceptable version ranges (e.g., <code>^17.0.0 || ^18.0.0</code>).
            If versions are incompatible, both are loaded.
          </li>
          <li>
            <strong>Eager:</strong> Load the shared dependency immediately rather than lazily.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Share major framework dependencies (React, Vue, Angular) as singletons.</li>
          <li>Use version ranges for libraries where minor version differences matter.</li>
          <li>Avoid sharing too many dependencies — start with frameworks and common utilities.</li>
          <li>Monitor bundle size to ensure sharing is working correctly.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dynamic Remote Loading</h3>
        <p>
          Module Federation supports loading remotes dynamically at runtime:
        </p>
        <ul>
          <li>
            <strong>Static remotes:</strong> Configured at build time. The remote URL is fixed.
          </li>
          <li>
            <strong>Dynamic remotes:</strong> The remote URL is determined at runtime (e.g., from a config service
            or feature flag).
          </li>
        </ul>
        <p>
          <strong>Use case for dynamic remotes:</strong> A/B testing different versions of a micro-frontend,
          canary deployments, or multi-tenant applications where different tenants get different micro-frontend
          versions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/module-federation-architecture.svg"
          alt="Module Federation Architecture"
          caption="Module Federation — showing Host application consuming Remote micro-frontends, shared dependency deduplication, and dynamic remote loading"
        />
      </section>

      <section>
        <h2>Communication Strategies</h2>
        <p>
          Micro-frontends need to communicate with each other and the host application. Choosing the right
          communication pattern is critical for maintainability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Custom Events (DOM Events)</h3>
        <p>
          Micro-frontends dispatch and listen for custom DOM events.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Dispatch: <code>{`element.dispatchEvent(new CustomEvent('user-logged-in', { detail: user }))`}</code></li>
          <li>Listen: <code>{`element.addEventListener('user-logged-in', handler)`}</code></li>
        </ul>
        <p>
          <strong>Advantages:</strong> Simple, framework agnostic, loose coupling.</p>
        <p>
          <strong>Disadvantages:</strong> No type safety, events can be missed if listener not attached, debugging
          is difficult.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Shared State Store</h3>
        <p>
          A global state store (Redux, Zustand, RxJS) is shared between micro-frontends.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Host creates a shared store instance.</li>
          <li>Micro-frontends import and use the same store.</li>
          <li>State changes propagate to all subscribers.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> Centralized state, predictable data flow, easy to debug with dev tools.</p>
        <p>
          <strong>Disadvantages:</strong> Tight coupling, potential for naming conflicts, store becomes a
          coordination point.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. URL/Query Parameters</h3>
        <p>
          State is encoded in the URL and shared via query parameters or path segments.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Host updates URL based on application state.</li>
          <li>Micro-frontends read state from URL parameters.</li>
          <li>Micro-frontends navigate to update shared state.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> URL is source of truth, bookmarkable state, works with browser navigation.</p>
        <p>
          <strong>Disadvantages:</strong> Limited data capacity, URL pollution, not suitable for sensitive data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Window/Local Storage</h3>
        <p>
          Shared state is stored in <code>window</code> object or <code>localStorage</code>.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Host exposes API on <code>window</code> object.</li>
          <li>Micro-frontends call <code>window.sharedAPI.getState()</code>.</li>
          <li>Changes trigger <code>storage</code> events for cross-tab sync.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> Simple, persists across page reloads.</p>
        <p>
          <strong>Disadvantages:</strong> Global namespace pollution, no type safety, potential security issues.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Event Bus / Message Broker</h3>
        <p>
          A dedicated event bus library (e.g., EventEmitter, Mitt, RxJS Subject) facilitates communication.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul>
          <li>Host creates a shared event bus instance.</li>
          <li>Micro-frontends publish and subscribe to events.</li>
          <li>Event bus handles delivery to all subscribers.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> Decoupled, supports complex event patterns, can add middleware.</p>
        <p>
          <strong>Disadvantages:</strong> Additional dependency, potential memory leaks if subscriptions not cleaned up.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-communication-patterns.svg"
          alt="Micro-Frontend Communication Patterns"
          caption="Communication Patterns — comparing Custom Events, Shared State Store, URL Parameters, Window Storage, and Event Bus approaches"
        />
      </section>

      <section>
        <h2>Styling and Design System Consistency</h2>
        <p>
          Maintaining visual consistency across micro-frontends while preserving team autonomy is a key challenge.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shared Design System</h3>
        <p>
          Publish a shared component library as an NPM package or expose via Module Federation:
        </p>
        <ul>
          <li>
            <strong>NPM package:</strong> Teams install the design system package. Version updates require
            dependency bumps.
          </li>
          <li>
            <strong>Module Federation:</strong> Design system is exposed as a remote. All micro-frontends
            consume the same runtime version.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Version the design system semantically.</li>
          <li>Provide migration guides for breaking changes.</li>
          <li>Support multiple versions during transition periods.</li>
          <li>Include accessibility guidelines and testing.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSS Isolation Strategies</h3>
        <p>
          Prevent CSS conflicts between micro-frontends:
        </p>
        <ul>
          <li>
            <strong>CSS Modules:</strong> Scoped class names prevent collisions.
          </li>
          <li>
            <strong>CSS-in-JS:</strong> Styled-components, Emotion generate unique class names.
          </li>
          <li>
            <strong>Shadow DOM:</strong> True CSS encapsulation (but has limitations with theming).
          </li>
          <li>
            <strong>CSS custom properties:</strong> Define design tokens as CSS variables for consistent theming.
          </li>
          <li>
            <strong>BEM naming:</strong> Convention-based isolation (e.g., <code>mf-product-list__item</code>).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Theming Across Micro-Frontends</h3>
        <p>
          Support consistent theming (light/dark mode, brand customization):
        </p>
        <ul>
          <li>
            <strong>CSS custom properties:</strong> Define theme variables at the root level. All micro-frontends
            inherit.
          </li>
          <li>
            <strong>Theme provider:</strong> Host provides theme context. Micro-frontends consume via props or
            context API.
          </li>
          <li>
            <strong>Design tokens:</strong> Store tokens in JSON. Each micro-frontend loads and applies tokens
            at runtime.
          </li>
        </ul>
      </section>

      <section>
        <h2>Routing and Navigation</h2>
        <p>
          Coordinating routing across micro-frontends requires careful design to avoid conflicts and ensure
          smooth navigation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Host-Controlled Routing</h3>
        <p>
          The host application owns the router and delegates to micro-frontends based on route:
        </p>
        <ul>
          <li>Host defines route-to-micro-frontend mapping.</li>
          <li>When user navigates to <code>/products</code>, host loads the Product micro-frontend.</li>
          <li>Micro-frontend handles its own sub-routes internally.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> Centralized control, consistent navigation, easy to add auth guards.</p>
        <p>
          <strong>Disadvantages:</strong> Host becomes a coordination point, micro-frontends can&apos;t
          independently add routes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Distributed Routing</h3>
        <p>
          Each micro-frontend registers its routes with the host:
        </p>
        <ul>
          <li>Micro-frontends export route configuration.</li>
          <li>Host aggregates routes from all micro-frontends at runtime.</li>
          <li>Router is configured dynamically based on loaded micro-frontends.</li>
        </ul>
        <p>
          <strong>Advantages:</strong> Micro-frontend autonomy, no host changes needed to add routes.</p>
        <p>
          <strong>Disadvantages:</strong> Complex implementation, potential route conflicts, harder to debug.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Navigation Coordination</h3>
        <p>
          Ensure smooth navigation between micro-frontends:
        </p>
        <ul>
          <li>
            <strong>Preserve scroll position:</strong> Save and restore scroll when navigating between
            micro-frontends.
          </li>
          <li>
            <strong>Loading states:</strong> Show skeleton screens while micro-frontend loads.
          </li>
          <li>
            <strong>Error handling:</strong> Gracefully handle micro-frontend load failures.
          </li>
          <li>
            <strong>Transition animations:</strong> Coordinate animations between micro-frontend swaps.
          </li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategies</h2>
        <p>
          Testing micro-frontends requires a multi-layered approach covering isolated testing, integration
          testing, and end-to-end testing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Isolated Testing</h3>
        <p>
          Test each micro-frontend in isolation:
        </p>
        <ul>
          <li>
            <strong>Unit tests:</strong> Test components, utilities, and business logic within the micro-frontend.
          </li>
          <li>
            <strong>Component tests:</strong> Test UI components with mocked dependencies.
          </li>
          <li>
            <strong>Contract tests:</strong> Verify the micro-frontend adheres to its integration contract
            (exposed modules, events, API).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Testing</h3>
        <p>
          Test micro-frontend integration with the host:
        </p>
        <ul>
          <li>
            <strong>Module Federation tests:</strong> Verify remotes load correctly and shared dependencies
            are deduplicated.
          </li>
          <li>
            <strong>Communication tests:</strong> Verify events are dispatched and received correctly.
          </li>
          <li>
            <strong>Routing tests:</strong> Verify navigation between micro-frontends works as expected.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">End-to-End Testing</h3>
        <p>
          Test the complete application with all micro-frontends:
        </p>
        <ul>
          <li>
            <strong>Full E2E:</strong> Run Playwright/Cypress tests against the assembled application.
          </li>
          <li>
            <strong>Visual regression:</strong> Use Percy, Chromatic, or similar to catch visual inconsistencies.
          </li>
          <li>
            <strong>Performance testing:</strong> Measure load times, bundle sizes, and runtime performance.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Environments</h3>
        <p>
          Maintain multiple environments for testing:
        </p>
        <ul>
          <li>
            <strong>Local development:</strong> Run micro-frontend in isolation with mocked host.
          </li>
          <li>
            <strong>Integration environment:</strong> Deploy all micro-frontends together for integration testing.
          </li>
          <li>
            <strong>Staging:</strong> Production-like environment for final validation.
          </li>
          <li>
            <strong>Production:</strong> Canary deployments and feature flags for gradual rollout.
          </li>
        </ul>
      </section>

      <section>
        <h2>Organizational Considerations</h2>
        <p>
          Micro-frontends are as much an organizational pattern as a technical one. Success requires alignment
          between team structure, processes, and architecture.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Team Structure</h3>
        <p>
          Align teams with business domains (not technical layers):
        </p>
        <ul>
          <li>
            <strong>Product-aligned teams:</strong> Each team owns a vertical slice (e.g., Checkout team owns
            checkout micro-frontend end-to-end).
          </li>
          <li>
            <strong>Cross-functional:</strong> Teams include frontend, backend, QA, and product expertise.
          </li>
          <li>
            <strong>Full ownership:</strong> Teams are responsible for development, deployment, and operations
            of their micro-frontend.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Platform Team</h3>
        <p>
          A central platform team enables micro-frontend adoption:
        </p>
        <ul>
          <li>
            <strong>Infrastructure:</strong> Maintain CI/CD pipelines, hosting, and Module Federation configuration.
          </li>
          <li>
            <strong>Tooling:</strong> Provide scaffolding, templates, and development tools.
          </li>
          <li>
            <strong>Design system:</strong> Maintain shared component library and design tokens.
          </li>
          <li>
            <strong>Documentation:</strong> Document integration patterns, best practices, and troubleshooting.
          </li>
          <li>
            <strong>Support:</strong> Help teams onboard and resolve technical issues.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Governance</h3>
        <p>
          Balance autonomy with consistency:
        </p>
        <ul>
          <li>
            <strong>Technical standards:</strong> Define minimum standards (accessibility, security, performance).
          </li>
          <li>
            <strong>API contracts:</strong> Document integration points between micro-frontends.
          </li>
          <li>
            <strong>Version policies:</strong> Define how shared dependencies are versioned and updated.
          </li>
          <li>
            <strong>Review process:</strong> Lightweight architecture reviews for major changes.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/micro-frontend-organization-structure.svg"
          alt="Micro-Frontend Organization Structure"
          caption="Organization Structure — showing product-aligned teams, platform team responsibilities, and governance model"
        />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">1. Premature Optimization</h3>
          <p>
            Don&apos;t adopt micro-frontends unless you have a clear need. Start with a modular monolith and
            extract micro-frontends when team coordination becomes a bottleneck.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">2. Over-Sharing Dependencies</h3>
          <p>
            Sharing too many dependencies creates tight coupling. Share only major frameworks and critical
            utilities. Let teams choose their own libraries for non-critical functionality.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">3. Ignoring Performance</h3>
          <p>
            Micro-frontends can significantly impact performance if not implemented carefully. Monitor bundle
            sizes, load times, and runtime performance. Use code splitting and lazy loading aggressively.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">4. Inconsistent UX</h3>
          <p>
            Without a shared design system, micro-frontends can look and behave differently. Invest in a design
            system and enforce accessibility standards across all micro-frontends.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">5. Complex Debugging</h3>
          <p>
            Debugging issues across multiple micro-frontends is challenging. Implement centralized logging,
            distributed tracing, and clear error boundaries to isolate failures.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose micro-frontends over a monolithic frontend?</p>
            <p className="mt-2 text-sm">
              A: Choose micro-frontends when: (1) Multiple teams need to work independently on different parts
              of the application, (2) You need to incrementally migrate a legacy frontend, (3) Different parts
              of the app have different technology requirements, (4) Deployment coordination is a bottleneck.
              Avoid for small teams, startups, or when the app is relatively simple.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Module Federation work?</p>
            <p className="mt-2 text-sm">
              A: Module Federation allows applications to dynamically load code from other applications at runtime.
              Remotes expose modules via an entry file (remoteEntry.js). Hosts declare remotes and shared
              dependencies in webpack config. At runtime, hosts fetch remote modules and deduplicate shared
              dependencies. This enables true independent deployment of micro-frontends.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do micro-frontends communicate?</p>
            <p className="mt-2 text-sm">
              A: Communication patterns include: (1) Custom DOM events for loose coupling, (2) Shared state
              stores (Redux, Zustand) for centralized state, (3) URL parameters for bookmarkable state,
              (4) Event bus/message broker for complex event patterns, (5) Window/localStorage for simple
              shared data. Choose based on coupling requirements and data sensitivity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the challenges of micro-frontends?</p>
            <p className="mt-2 text-sm">
              A: Key challenges: (1) Performance — multiple bundles, potential duplicate dependencies, (2) UX
              consistency — different teams may implement differently, (3) Complexity — routing, state management,
              and debugging across boundaries, (4) Coordination — shared dependencies, design system updates,
              (5) Testing — isolated, integration, and E2E testing across micro-frontends.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure consistent styling across micro-frontends?</p>
            <p className="mt-2 text-sm">
              A: Strategies: (1) Shared design system published as NPM package or exposed via Module Federation,
              (2) CSS custom properties for theming, (3) CSS Modules or CSS-in-JS for isolation, (4) BEM naming
              conventions, (5) Platform team maintains design tokens and provides documentation. Enforce through
              code review and visual regression testing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle routing in micro-frontends?</p>
            <p className="mt-2 text-sm">
              A: Approaches: (1) Host-controlled routing — host owns router and delegates to micro-frontends
              based on route, (2) Distributed routing — micro-frontends register routes dynamically, (3)
              URL-based coordination — state encoded in URL parameters. Host-controlled is simpler; distributed
              provides more autonomy. Ensure smooth transitions, loading states, and error handling.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://micro-frontends.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              micro-frontends.org — The official micro-frontends guide
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
              Module Federation Documentation
            </a>
          </li>
          <li>
            <a href="https://www.amazon.com/Building-Enterprise-Applications-Micro-Frontends-Engineering/dp/1800563922" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Building Enterprise Applications with Micro-Frontends
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
