"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-plugin-architecture",
  title: "Plugin Architecture",
  description:
    "Deep dive into Plugin Architecture for frontend applications covering extension points, lifecycle management, sandboxing strategies, and real-world plugin systems like VS Code and webpack.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "plugin-architecture",
  wordCount: 3700,
  readingTime: 15,
  lastUpdated: "2026-03-20",
  tags: [
    "frontend",
    "plugin-architecture",
    "extensibility",
    "architecture",
    "design-patterns",
  ],
  relatedTopics: ["module-federation", "micro-frontends", "factory-pattern"],
};

export default function PluginArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Plugin Architecture</strong> is a software design approach
          where a host application defines extension points that third-party or
          first-party plugins can hook into to extend functionality without
          modifying the host&apos;s core code. The host provides a stable API
          surface (the plugin contract), and plugins implement that contract to
          add features, modify behavior, or integrate with external systems.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Plugin architecture is foundational to some of the most successful
          software products in history. VS Code owes its dominance to its
          extension marketplace. Webpack&apos;s entire compilation pipeline is a
          plugin system (Tapable). Figma&apos;s plugin ecosystem turns it from a
          design tool into a design platform. WordPress powers 40% of the web
          through its plugin architecture. Chrome&apos;s extension system
          transforms a browser into a customizable productivity tool.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          For staff-level engineers, plugin architecture is relevant in two
          contexts: designing extensible systems (building the host) and
          understanding the constraints of building within them (writing
          plugins). The key challenges are designing stable APIs that do not
          break plugins across versions, providing sufficient extension points
          without exposing internals, sandboxing untrusted plugins for security,
          and managing the lifecycle of dynamically loaded code.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Extension Points (Hooks):</strong> Predefined locations in
            the host application where plugins can inject behavior. These can be
            lifecycle hooks (onInit, onActivate, onDeactivate), content slots
            (toolbar items, sidebar panels, menu entries), pipeline stages
            (pre-process, transform, post-process), or event subscriptions
            (onFileOpen, onSave, onChange). The set of extension points defines
            the plugin system&apos;s capability surface.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Plugin API / Contract:</strong> The stable interface that
            the host exposes to plugins. This includes: available methods (read
            data, modify state, render UI), event subscriptions, contribution
            types (commands, views, configuration), and capability constraints.
            The API must be versioned and backward-compatible — breaking the API
            breaks the ecosystem.
          </HighlightBlock>
          <li>
            <strong>Plugin Manifest:</strong> A declarative description of what
            a plugin provides and requires. Typically a JSON file (package.json
            in VS Code, plugin.json in webpack) that declares: activation
            events, contributed commands/views/configuration, required host API
            version, permissions, and dependencies on other plugins.
          </li>
          <li>
            <strong>Plugin Lifecycle:</strong> The stages a plugin goes through:
            discovery (finding available plugins), loading (fetching plugin
            code), validation (checking manifest, permissions, API version
            compatibility), activation (running plugin initialization),
            execution (plugin responding to hooks), deactivation (cleanup), and
            uninstallation (removing plugin artifacts).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Sandboxing:</strong> Isolating plugins from the host and
            from each other to prevent security vulnerabilities and stability
            issues. Sandboxing mechanisms include: iframes (DOM isolation), Web
            Workers (thread isolation), ShadowRealm proposal (scope isolation),
            and capability-based security (limiting what APIs a plugin can
            access).
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Plugin architecture involves a host application, a plugin API layer,
          and one or more plugins that extend the host through defined extension
          points.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Host Application / Plugin API / Lifecycle Hooks
          </h3>
          <p>The host application exposes a plugin API with lifecycle hooks:</p>
          <ol className="mt-3 space-y-2">
            <li>
              <strong>Host Core:</strong> The application&apos;s core
              functionality that works without any plugins.
            </li>
            <li>
              <strong>Plugin API:</strong> A versioned interface exposing
              read/write operations, event subscriptions, and UI contribution
              points.
            </li>
            <li>
              <strong>Plugin Manager:</strong> Discovers, loads, validates, and
              manages the lifecycle of all plugins.
            </li>
            <li>
              <strong>Lifecycle Hooks:</strong> activate() called when the
              plugin is enabled; deactivate() called when disabled; dispose()
              for cleanup.
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/plugin-architecture-diagram-1.svg"
          alt="Plugin architecture showing Host Application with Core, Extension Points, Plugin Registry, and Plugin Sandbox communicating with external plugins"
          caption="Plugin architecture model — host application exposes extension points while maintaining isolation through sandboxed plugin execution"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Plugin Registration Sequence
          </h3>
          <ol className="space-y-2">
            <li>
              <strong>1. Discovery:</strong> Plugin manager scans for available
              plugins (registry, filesystem, CDN)
            </li>
            <li>
              <strong>2. Loading:</strong> Plugin code and manifest are fetched
              (dynamic import, script tag injection)
            </li>
            <li>
              <strong>3. Validation:</strong> Manifest is checked — API version
              compatibility, required permissions, dependency resolution
            </li>
            <li>
              <strong>4. Registration:</strong> Plugin&apos;s contribution
              points are registered with the host (commands, views, menus)
            </li>
            <li>
              <strong>5. Activation:</strong> Plugin&apos;s activate() function
              is called — may be immediate or deferred until a trigger event
            </li>
            <li>
              <strong>6. Execution:</strong> Plugin responds to events and API
              calls from the host
            </li>
            <li>
              <strong>7. Deactivation:</strong> Plugin&apos;s deactivate()
              function is called — cleanup subscriptions, release resources
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/plugin-architecture-diagram-2.svg"
          alt="Plugin lifecycle flow showing 5 phases: Discovery, Loading, Activation, Execution, and Deactivation with manifest example and capability model"
          caption="Plugin lifecycle — from discovery through deactivation with manifest-based capability declarations"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sandboxing Strategies</h3>
          <ul className="space-y-2">
            <li>
              <strong>Iframe Sandbox:</strong> Plugin runs in a sandboxed iframe
              with communication via postMessage. Provides full DOM and
              JavaScript isolation. Used by Figma plugins. Limitation:
              serialization overhead for all communication.
            </li>
            <li>
              <strong>Web Worker Sandbox:</strong> Plugin runs in a Web Worker
              with no DOM access. Communication via structured cloning. Used for
              compute-heavy plugins. Limitation: cannot render UI directly.
            </li>
            <li>
              <strong>Process Sandbox:</strong> Plugin runs in a separate
              process (VS Code extension host). Maximum isolation with IPC
              communication. Limitation: highest overhead, process management
              complexity.
            </li>
            <li>
              <strong>Capability-Based Access:</strong> Plugin declares required
              capabilities in its manifest. Host grants only requested
              capabilities. Plugin cannot access undeclared APIs. Limitation:
              trust model — plugins may request more capabilities than needed.
            </li>
          </ul>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/plugin-architecture-diagram-3.svg"
          alt="Plugin sandboxing strategies comparison showing Iframe, Web Worker, and Same-Context approaches with their isolation levels and performance characteristics"
          caption="Sandboxing strategies — trade-offs between isolation (iframe), non-blocking execution (worker), and performance (same-context)"
          captionTier="important"
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
              <td className="p-3">
                <strong>Extensibility</strong>
              </td>
              <td className="p-3">
                • Third parties extend functionality without source access
                <br />
                • New features without host releases
                <br />• Ecosystem creates network effects
              </td>
              <td className="p-3">
                <HighlightBlock tier="crucial">
                  • Extension points limit what plugins can do
                  <br />
                  • Plugin API design is irreversible at scale
                  <br />• Plugins may circumvent intended limitations
                </HighlightBlock>
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Stability</strong>
              </td>
              <td className="p-3">
                • Core functionality works without any plugins
                <br />
                • Plugins can be disabled individually
                <br />• Sandboxing prevents plugin crashes from affecting host
              </td>
              <td className="p-3">
                <HighlightBlock tier="important">
                  • Plugin bugs appear as host bugs to users
                  <br />
                  • Plugin interactions create emergent issues
                  <br />• Performance degradation from many plugins
                </HighlightBlock>
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Development</strong>
              </td>
              <td className="p-3">
                • Plugin development is simpler (limited API surface)
                <br />
                • Decoupled release cycles
                <br />• Community contributions scale development
              </td>
              <td className="p-3">
                • Plugin API documentation must be excellent
                <br />
                • Debugging requires understanding host internals
                <br />• Plugin developer experience is a product itself
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Security</strong>
              </td>
              <td className="p-3">
                • Sandboxing limits blast radius of malicious plugins
                <br />
                • Capability model restricts API access
                <br />• Review process for marketplace plugins
              </td>
              <td className="p-3">
                • Sandboxing adds performance overhead
                <br />
                • Supply chain attacks via plugin dependencies
                <br />• Permission prompts cause user fatigue
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Design the API Before the Implementation:</strong> Define
            the plugin API contract through use case analysis and developer
            feedback before building the plugin system. The API is the product —
            its design determines what plugins can do and how pleasant they are
            to build. Prototype with 3-5 real plugins to validate the API before
            publishing it.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use Lazy Activation:</strong> Do not activate all plugins at
            application startup. Define activation events (VS Code model) that
            trigger plugin activation only when needed — opening a specific file
            type, running a command, or navigating to a specific view. This
            keeps startup fast regardless of installed plugin count.
          </HighlightBlock>
          <li>
            <strong>Version the Plugin API:</strong> Use semantic versioning for
            the plugin API. Plugins declare the minimum API version they
            require. The host can run plugins targeting older API versions
            through compatibility shims. Breaking changes require a major
            version bump and a migration guide.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Provide a Plugin Development Kit (PDK):</strong> Give plugin
            developers a CLI for scaffolding, a local development server with
            hot reload, TypeScript types for the API, a testing framework for
            plugin logic, and a publishing pipeline. The quality of the PDK
            determines the health of the plugin ecosystem.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Implement Graceful Degradation:</strong> When a plugin
            throws an error, catch it at the extension point boundary, log the
            error, disable the failing plugin, and show a user-friendly
            notification. Never let a plugin crash bring down the host
            application.
          </HighlightBlock>
          <li>
            <strong>Monitor Plugin Performance:</strong> Track each
            plugin&apos;s activation time, memory usage, and API call frequency.
            Surface slow or resource-heavy plugins to users so they can make
            informed decisions about which plugins to keep. VS Code&apos;s
            &quot;Extension Bisect&quot; feature helps identify problematic
            extensions.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Insufficient Extension Points:</strong> Launching with too
            few hooks forces plugin developers to use workarounds
            (monkey-patching, accessing internals) that break on host updates.
            Analyze the most common plugin use cases and provide extension
            points for each. Better to have unused hooks than to force hacks.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Leaking Host Internals:</strong> Exposing internal data
            structures or implementation details through the plugin API creates
            implicit contracts. When internals change, plugins break. Maintain a
            clear boundary between the public API and internal implementation.
            Use interface objects that copy or proxy internal state rather than
            exposing it directly.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>No Plugin Isolation:</strong> Running plugins in the same
            JavaScript context as the host means a plugin can access and modify
            any global state, monkey-patch host functions, or cause memory leaks
            that affect the host. Implement at least basic sandboxing for
            untrusted plugins.
          </HighlightBlock>
          <li>
            <strong>Plugin Ordering Issues:</strong> When multiple plugins hook
            into the same extension point, their execution order may matter.
            Without explicit ordering controls (priority values, before/after
            declarations), the order is non-deterministic and plugins may
            conflict.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Marketplace Without Curation:</strong> An unreviewed
            marketplace quickly fills with low-quality, abandoned, or malicious
            plugins. Implement automated security scanning, quality checks
            (documentation, test coverage), and community review processes.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>VS Code Extensions:</strong> VS Code&apos;s extension system
            is the gold standard for plugin architecture. Extensions run in a
            separate process (Extension Host), communicate via IPC, declare
            activation events and contributions in package.json, and access a
            rich API for editor manipulation, language services, debugging, and
            UI customization.
          </HighlightBlock>
          <li>
            <strong>Webpack Plugin System (Tapable):</strong> Webpack&apos;s
            entire compilation pipeline is built on Tapable hooks. Plugins tap
            into hooks at every compilation stage — entry resolution, module
            building, chunk optimization, asset emission. This is a synchronous
            hook-based plugin system where plugins are first-party or
            community-maintained.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Figma Plugins:</strong> Figma plugins run in a sandboxed
            iframe with access to the Figma Plugin API. They can read and modify
            the design document, create custom UI in the plugin window, and
            integrate with external services. The iframe sandbox provides
            security while the API provides controlled access to document state.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Chrome Extensions:</strong> Chrome extensions use a
            manifest-driven architecture with content scripts (injected into web
            pages), background scripts (service workers), and popup/options UIs.
            The extension API provides controlled access to tabs, storage,
            network requests, and browser chrome. Manifest V3 introduced
            stricter sandboxing and capability restrictions.
          </HighlightBlock>
          <li>
            <strong>Storybook Addons:</strong> Storybook&apos;s addon system
            allows extending the component development environment with panels
            (accessibility checker, design tokens), decorators (theme wrapper,
            viewport simulator), and presets (configuration bundles). Addons
            register via a channel-based communication model between the manager
            UI and preview iframe.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="crucial">
          Plugin Architecture introduces significant security considerations around code execution, sandboxing, and privilege escalation. Third-party plugins can introduce vulnerabilities if not properly isolated.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Plugin Security Patterns</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Sandboxing:</strong> Untrusted plugins must run in isolated environments. Mitigation: use iframes for UI plugins, Web Workers for computation, separate processes for Node.js plugins, implement strict CSP policies.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Capability-Based Security:</strong> Plugins should only have access to explicitly granted capabilities. Mitigation: implement capability manifest, validate plugin permissions, use principle of least privilege.
            </HighlightBlock>
            <li>
              <strong>Code Signing:</strong> Verify plugin integrity before loading. Mitigation: sign plugins with cryptographic signatures, verify signatures before loading, use trusted plugin registries.
            </li>
            <li>
              <strong>API Surface Minimization:</strong> Expose only necessary host APIs to plugins. Mitigation: document plugin API clearly, version plugin APIs, avoid exposing sensitive host functionality.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Plugin Testing Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Sandbox Escape Testing:</strong> Test that plugins cannot escape their sandbox. Verify that plugins cannot access host internals. Test iframe/Worker isolation.
            </li>
            <li>
              <strong>Capability Testing:</strong> Test that plugins only have access to granted capabilities. Verify that privilege escalation attempts are rejected.
            </li>
            <li>
              <strong>Input Validation Testing:</strong> Test plugin input validation. Verify that malformed plugin data is handled gracefully. Test boundary conditions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <HighlightBlock as="p" tier="crucial">
          Plugin Architecture performance depends on sandboxing overhead, plugin loading time, and inter-process communication costs.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Metrics to Track</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Measurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Plugin Load Time</td>
                <td className="p-2">&lt;100ms per plugin</td>
                <td className="p-2">Performance.now()</td>
              </tr>
              <tr>
                <td className="p-2">Sandbox Overhead</td>
                <td className="p-2">&lt;10% performance impact</td>
                <td className="p-2">Benchmark comparison</td>
              </tr>
              <tr>
                <td className="p-2">IPC Latency</td>
                <td className="p-2">&lt;1ms per message</td>
                <td className="p-2">Performance.now()</td>
              </tr>
              <tr>
                <td className="p-2">Plugin Count</td>
                <td className="p-2">&lt;100 active plugins</td>
                <td className="p-2">Runtime monitoring</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sandboxing Strategy Comparison</h3>
          <HighlightBlock as="p" tier="important">
            Different sandboxing strategies have different performance characteristics:
          </HighlightBlock>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Iframe Sandboxing:</strong> Overhead: ~10-50ms load time. Best for: UI plugins, untrusted code. Limitation: cross-origin communication overhead.
            </li>
            <li>
              <strong>Web Worker Sandboxing:</strong> Overhead: ~5-20ms load time. Best for: computation plugins. Limitation: no DOM access.
            </li>
            <li>
              <strong>Same-Context Sandboxing:</strong> Overhead: ~0.1ms. Best for: trusted plugins, first-party extensions. Limitation: no isolation from host.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Plugin Architecture has significant infrastructure and operational costs but enables ecosystem growth and third-party extensibility.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Plugin Registry:</strong> Hosting plugin marketplace, version management, download serving. Estimate: $500-2,000/month for moderate traffic.
            </li>
            <li>
              <strong>Security Infrastructure:</strong> Code signing, vulnerability scanning, sandboxing infrastructure. Estimate: $1,000-5,000/month.
            </li>
            <li>
              <strong>Developer Relations:</strong> Plugin SDK documentation, developer support, community management. Estimate: 1-2 FTE for active ecosystems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Plugin SDK:</strong> Building comprehensive plugin SDK: 2-4 weeks for basic SDK, 2-3 months for mature SDK with documentation.
            </li>
            <li>
              <strong>Plugin Review:</strong> Reviewing third-party plugins for security and quality. Estimate: 0.25-0.5 FTE for active marketplaces.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">When to Use Plugin Architecture</h3>
          <p>
            Use plugins when: (1) you need third-party extensibility, (2) you want to enable ecosystem growth, (3) you need to support custom integrations. Avoid when: (1) you have no third-party developers, (2) security requirements are too strict for third-party code, (3) the complexity outweighs the benefits.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="crucial"
          >
            <p className="font-semibold">
              Q: How would you design a plugin system for a web application?
            </p>
            <p className="mt-2 text-sm">
              A: (1) Define extension points based on use case analysis — where
              do users/developers need to customize behavior? (2) Design a
              versioned plugin API that exposes read/write methods, event
              subscriptions, and UI contribution points. (3) Create a plugin
              manifest format that declares capabilities, permissions,
              activation events, and API version requirements. (4) Implement a
              plugin manager that handles discovery, loading (dynamic import),
              validation, lifecycle management, and error isolation. (5) Choose
              a sandboxing strategy based on trust model — iframe for untrusted
              plugins, same-context for first-party. (6) Build a PDK with
              scaffolding, types, testing tools, and documentation.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">
              Q: How does VS Code&apos;s extension architecture work?
            </p>
            <p className="mt-2 text-sm">
              A: VS Code runs extensions in a separate Node.js process called
              the Extension Host, communicating with the main process via IPC.
              Extensions declare activation events in package.json
              (onLanguage:typescript, onCommand:myCommand) and are lazily loaded
              when triggered. The extension API provides access to the editor
              (text manipulation, decorations), language services (diagnostics,
              completions), workspace (files, settings), and UI (webview panels,
              tree views). This architecture ensures that slow or crashing
              extensions do not affect editor responsiveness.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">
              Q: What sandboxing strategies exist for frontend plugins?
            </p>
            <p className="mt-2 text-sm">
              A: (1) Iframe sandbox — plugin runs in a sandboxed iframe,
              communication via postMessage. Full DOM and JS isolation. Used by
              Figma. Cost: serialization overhead. (2) Web Worker — plugin runs
              in a worker thread. No DOM access. Used for compute-heavy plugins.
              Cost: cannot render UI. (3) ShadowRealm (TC39 proposal) — new
              JavaScript realm with separate global object. Lighter than iframe,
              shares memory. Cost: not yet standardized. (4) Capability-based —
              plugin runs in same context but API is restricted by declared
              permissions. Used by Chrome extensions (Manifest V3). Cost: relies
              on permission correctness, less isolated.
            </p>
          </HighlightBlock>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle backward compatibility in a plugin API?
            </p>
            <p className="mt-2 text-sm">
              A: (1) Use semantic versioning — plugins declare the minimum API
              version they require. (2) Add new features as new API methods
              without removing existing ones. (3) When breaking changes are
              necessary, provide compatibility shims that translate old API
              calls to new implementations. (4) Deprecate before removing — mark
              APIs as deprecated for at least one major version cycle before
              removal. (5) Provide codemods for automated migration. (6) Test
              against popular plugins before releasing API changes to catch
              regressions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between a plugin architecture and
              micro-frontends?
            </p>
            <p className="mt-2 text-sm">
              A: Plugin architecture has a clear host/plugin relationship — the
              host owns the application shell, defines extension points, and
              plugins extend specific capabilities. Plugins conform to the
              host&apos;s API contract. Micro-frontends are peer-level
              independently deployed applications composed into a single user
              experience — there is no inherent host/extension relationship
              (though an app shell may orchestrate composition). Plugins extend
              a product; micro-frontends decompose a product. They can coexist:
              a micro-frontend architecture where each micro-app has its own
              plugin system.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://code.visualstudio.com/api"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              VS Code — Extension API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://webpack.js.org/api/plugins/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Webpack — Plugin API
            </a>
          </li>
          <li>
            <a
              href="https://www.figma.com/plugin-docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma — Plugin Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/extensions/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome — Extension Development Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
