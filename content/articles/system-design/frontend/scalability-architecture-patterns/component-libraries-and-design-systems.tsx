"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-libraries-and-design-systems",
  title: "Component Libraries & Design Systems",
  description:
    "Comprehensive guide to building and scaling Component Libraries and Design Systems covering architecture layers, design tokens, versioning strategies, and organizational adoption patterns.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "component-libraries-and-design-systems",
  wordCount: 3800,
  readingTime: 15,
  lastUpdated: "2026-03-20",
  tags: [
    "frontend",
    "design-systems",
    "component-library",
    "design-tokens",
    "architecture",
  ],
  relatedTopics: [
    "monorepo-vs-polyrepo",
    "module-federation",
    "plugin-architecture",
  ],
};

export default function ComponentLibrariesDesignSystemsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>Design System</strong> is the single source of truth for a
          product&apos;s visual language, interaction patterns, and component
          implementations. It encompasses design tokens (color, typography,
          spacing), primitive components (buttons, inputs, icons), composite
          patterns (forms, navigation, data tables), and the documentation,
          tooling, and governance processes that keep them consistent across
          teams. A <strong>Component Library</strong> is the code implementation
          layer of a design system — the React/Vue/Angular packages that teams
          import and use in their applications.
        </p>
        <p>
          The distinction matters: a component library without a design system
          is just a collection of reusable components with no governing
          principles. A design system without a component library is a Figma
          file that developers interpret differently. Mature organizations —
          Google (Material Design), Shopify (Polaris), Atlassian (Atlassian
          Design System), GitHub (Primer) — invest heavily in both, treating the
          design system as a product with its own team, roadmap, and versioning
          strategy.
        </p>
        <p>
          For staff-level engineers, design system architecture is a critical
          skill. Decisions about token taxonomy, component API design,
          versioning strategy, contribution models, and multi-brand theming have
          decade-long consequences. A poorly designed token hierarchy forces
          visual inconsistency; a rigid component API stifles adoption; a
          monolithic package structure prevents tree-shaking; an opaque
          contribution process creates bottlenecks.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Design Tokens:</strong> The atomic values that define the
            visual language — colors, spacing scales, typography (font family,
            size, weight, line height), border radii, shadows, breakpoints, and
            animation durations. Tokens are organized in a hierarchy: global
            tokens (color.blue.500), alias tokens (color.primary →
            color.blue.500), and component tokens (button.color.background →
            color.primary). This hierarchy enables theming by swapping alias
            mappings.
          </li>
          <li>
            <strong>Primitive Components:</strong> The lowest-level building
            blocks — Button, Input, Text, Icon, Badge, Avatar. These implement
            accessibility (ARIA attributes, keyboard navigation, focus
            management), accept design tokens for styling, and expose a
            controlled API surface. They are framework-specific (React
            components, Web Components, etc.).
          </li>
          <li>
            <strong>Composite Patterns:</strong> Higher-level compositions of
            primitives — Form (labels + inputs + validation), DataTable (headers
            + rows + pagination + sorting), Modal (overlay + content + actions),
            Navigation (links + menus + breadcrumbs). These encode interaction
            patterns and business logic patterns that should be consistent
            across products.
          </li>
          <li>
            <strong>Headless Components:</strong> Components that provide
            behavior (state management, keyboard interactions, ARIA) without
            rendering any UI. Libraries like Radix, React Aria, and Headless UI
            provide headless primitives that design systems wrap with their own
            visual styles. This separates behavior (hard to implement correctly)
            from appearance (varies by brand).
          </li>
          <li>
            <strong>Contribution Model:</strong> How consuming teams can add or
            modify components. Centralized models (a dedicated team owns all
            components) ensure consistency but create bottlenecks. Federated
            models (any team can contribute) scale better but risk
            inconsistency. Most mature systems use a hybrid: a core team
            maintains primitives and reviews contributions, while product teams
            build domain-specific patterns.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Design systems are layered architectures where each layer builds on
          the one below, creating a stack from raw values to complete UI
          patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/component-libraries-and-design-systems-diagram-1.svg"
          alt="Layered Design System Architecture"
          caption="Layered architecture — design tokens → primitive components → composite patterns → page templates, each layer building on the one below"
        />

        <p>
          The layered architecture ensures that changes propagate consistently.
          Updating a global color token automatically flows through alias tokens
          to component tokens to every component that references them. This
          propagation is the primary value proposition of a design system — a
          single change to the primary color updates every button, link, and
          icon across all products.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Compound vs Configuration Prop Patterns
          </h3>
          <p>
            Two dominant approaches to component API design present different
            trade-offs:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Compound Components:</strong> Composition-based API where
              child components are assembled declaratively. Example:{" "}
              {
                "<Select><Select.Trigger /><Select.Content><Select.Item /></Select.Content></Select>"
              }
              . Provides maximum flexibility, supports complex customization,
              but has a steeper learning curve and more verbose usage.
            </li>
            <li>
              <strong>Configuration Props:</strong> Single component with props
              controlling behavior. Example:{" "}
              {
                '<Select options={items} onChange={handler} placeholder="Choose..." />'
              }
              . Simple to use, easy to document, but limited customization and
              prop bloat for complex use cases.
            </li>
          </ul>
          <p className="mt-3">
            Best practice: provide both — compound components for full control
            and a preconfigured wrapper for the common case. Many mature design
            systems (Radix, Chakra) take this approach.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Design Token Build Pipeline
          </h3>
          <p>
            Tokens defined in a source format (JSON, YAML, Figma API) are
            processed through a build pipeline that outputs platform-specific
            formats:
          </p>
          <ol className="mt-3 space-y-2">
            <li>
              <strong>Source:</strong> Platform-agnostic token definitions
              (JSON/YAML with semantic naming)
            </li>
            <li>
              <strong>Transform:</strong> Style Dictionary or Theo processes
              tokens, resolving references and applying platform transforms
            </li>
            <li>
              <strong>Output:</strong> CSS custom properties, SCSS variables,
              JavaScript constants, iOS/Android values, Figma plugin sync
            </li>
          </ol>
          <p className="mt-3">
            This pipeline ensures tokens are the single source of truth across
            platforms — web, iOS, Android, and design tools all consume the same
            values in their native formats.
          </p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/component-libraries-and-design-systems-diagram-2.svg"
          alt="Design token hierarchy showing three tiers: global tokens (raw values), alias tokens (semantic meaning), and component tokens with multi-brand theming flow"
          caption="Design token hierarchy — three-tier system enabling multi-brand theming through alias layer swapping"
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
                <strong>Consistency</strong>
              </td>
              <td className="p-3">
                • Unified visual language across all products
                <br />
                • Accessibility built into shared components
                <br />• Reduced design-to-code discrepancies
              </td>
              <td className="p-3">
                • Constraints may limit product-specific needs
                <br />
                • Adoption requires cultural change
                <br />• Governance overhead for edge cases
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Velocity</strong>
              </td>
              <td className="p-3">
                • Faster development with pre-built components
                <br />
                • Reduced decision fatigue for developers
                <br />• Copy-paste reduction eliminates inconsistency bugs
              </td>
              <td className="p-3">
                • Initial investment is significant (6-12 months)
                <br />
                • Blocked on design system team for new components
                <br />• Migration cost for existing products
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Maintenance</strong>
              </td>
              <td className="p-3">
                • Single place to fix bugs (all consumers benefit)
                <br />
                • Token-based theming simplifies brand updates
                <br />• Shared testing reduces duplicate effort
              </td>
              <td className="p-3">
                • Breaking changes affect all consumers simultaneously
                <br />
                • Version fragmentation across consuming teams
                <br />• Documentation must be comprehensive and current
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scalability</strong>
              </td>
              <td className="p-3">
                • Enables multi-brand/white-label products
                <br />
                • Supports design system federation across orgs
                <br />• Headless base enables framework portability
              </td>
              <td className="p-3">
                • Token hierarchy complexity grows with brand count
                <br />
                • Performance cost of abstraction layers
                <br />• Coordination cost across teams and time zones
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Build on Headless Foundations:</strong> Use a headless
            component library (Radix, React Aria, Headless UI) as the behavioral
            foundation. These libraries handle accessibility, keyboard
            navigation, and state management correctly — things that are
            notoriously difficult to implement from scratch. Your design system
            wraps these with your visual styles and tokens.
          </li>
          <li>
            <strong>Design Tokens Before Components:</strong> Establish the
            token hierarchy before building components. Tokens are the API
            contract between design and engineering. If tokens are an
            afterthought, components will hard-code values, defeating the
            purpose of a design system.
          </li>
          <li>
            <strong>Ship with Storybook:</strong> Every component should have
            Storybook stories that demonstrate all variants, states (default,
            hover, focus, disabled, error), and responsive behavior. Storybook
            serves as interactive documentation, a visual regression testing
            target (Chromatic), and a development environment.
          </li>
          <li>
            <strong>Adopt Semantic Versioning Strictly:</strong> Breaking
            changes (prop removals, visual changes, behavior changes) must
            increment the major version. Consuming teams need confidence that
            minor and patch updates will not break their applications. Automate
            version enforcement with tools like changesets or semantic-release.
          </li>
          <li>
            <strong>Provide Codemods for Breaking Changes:</strong> When making
            breaking changes, provide automated codemods (jscodeshift scripts)
            that migrate consuming code. This dramatically reduces the cost of
            upgrades and increases adoption of new versions. Include codemods in
            the release notes.
          </li>
          <li>
            <strong>Measure Adoption:</strong> Track which components are used,
            how often, and by which teams. Low-adoption components may need
            better documentation, better APIs, or removal from the system.
            High-adoption components need extra stability guarantees and
            performance optimization.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Building Everything Custom:</strong> Implementing
            accessibility, keyboard navigation, and ARIA from scratch when
            headless libraries already solve these problems. Focus design system
            effort on visual design and brand expression, not interaction
            mechanics.
          </li>
          <li>
            <strong>Premature Abstraction:</strong> Adding components to the
            design system before they have been validated in multiple products.
            The &quot;rule of three&quot; applies — a pattern should appear in
            at least three products before being promoted to the design system.
            Otherwise, you are encoding one product&apos;s assumptions into the
            shared library.
          </li>
          <li>
            <strong>Monolithic Package:</strong> Shipping all components in a
            single package forces consumers to import (and potentially bundle)
            everything. Use a multi-package architecture where each component or
            component group is its own package with independent versioning.
          </li>
          <li>
            <strong>Ignoring Performance:</strong> Design system components that
            are used everywhere must be optimized for rendering performance.
            Avoid unnecessary re-renders, keep component trees shallow, memoize
            expensive computations, and measure bundle size impact of each
            component.
          </li>
          <li>
            <strong>Documentation Rot:</strong> Documentation that falls out of
            sync with the code is worse than no documentation — it creates false
            confidence. Use tools that generate documentation from code (TypeDoc
            for props, Storybook for visual examples) to keep docs automatically
            synchronized.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Shopify Polaris:</strong> Shopify&apos;s design system
            serves thousands of third-party app developers building Shopify
            admin extensions. Polaris provides React components, design tokens,
            icons, and extensive documentation. Its adoption challenge is unique
            — external developers must find the system intuitive without
            internal context.
          </li>
          <li>
            <strong>Google Material Design:</strong> Material Design is a
            cross-platform design system with implementations for Web (MUI),
            Android (Material Components), iOS, and Flutter. It demonstrates the
            token-based multi-platform approach, where design tokens defined
            centrally are consumed by platform-specific implementations.
          </li>
          <li>
            <strong>GitHub Primer:</strong> Primer is GitHub&apos;s design
            system with React components (Primer React), CSS framework (Primer
            CSS), and design tokens. It is open-source, enabling the community
            to contribute and the design system to serve as a recruiting
            showcase.
          </li>
          <li>
            <strong>Atlassian Design System:</strong> Atlassian&apos;s design
            system powers products from Jira to Confluence to Bitbucket. It
            demonstrates the challenge of maintaining consistency across
            products with very different use cases — project management,
            document editing, and code hosting.
          </li>
          <li>
            <strong>Uber Base Web:</strong> Base Web is Uber&apos;s design
            system with a focus on customization through an overrides API. Every
            component accepts an overrides prop that allows fine-grained control
            over sub-components, styles, and behavior — addressing the tension
            between consistency and flexibility.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Design systems and component libraries introduce unique security considerations because they are deployed across multiple applications and can become a single point of failure for security vulnerabilities.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Supply Chain Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Dependency Vulnerabilities:</strong> A vulnerability in the design system propagates to all consuming applications. Mitigation: implement automated dependency scanning (Snyk, Dependabot), pin exact versions, maintain a security patch SLA, communicate vulnerabilities to consuming teams immediately.
            </li>
            <li>
              <strong>Malicious Package Injection:</strong> Compromised build pipelines could inject malicious code. Mitigation: use private registries with strict access control, implement build pipeline security (OIDC authentication, signed commits), use package signing and verification.
            </li>
            <li>
              <strong>CDN Compromise:</strong> If components are served from CDN, a compromised CDN affects all applications. Mitigation: use Subresource Integrity (SRI) hashes, implement CDN failover, use multiple CDN providers, monitor for unexpected content changes.
            </li>
            <li>
              <strong>Third-Party Component Risk:</strong> Components wrapping third-party services (analytics, chat widgets) can leak data. Mitigation: audit all third-party integrations, implement data minimization, use sandboxed iframes for untrusted third-party code.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">XSS Prevention in Components</h3>
          <ul className="space-y-2">
            <li>
              <strong>Props Sanitization:</strong> Components accepting user-generated content (tooltips, modals, notifications) must sanitize props. Mitigation: use DOMPurify or similar libraries, avoid dangerouslySetInnerHTML, implement strict Content Security Policy.
            </li>
            <li>
              <strong>Event Handler Security:</strong> Components passing event handlers as props can be exploited. Mitigation: validate handler props, avoid passing untrusted callbacks, implement event handler allowlists.
            </li>
            <li>
              <strong>URL Validation:</strong> Components accepting URLs (links, images) must validate against allowlists. Mitigation: validate URL schemes (http/https only), prevent javascript: URLs, implement URL allowlists for user-provided links.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Accessibility as Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Focus Management:</strong> Poor focus management can lead to focus hijacking attacks. Mitigation: implement proper focus trapping in modals, restore focus correctly, avoid auto-focusing without user action.
            </li>
            <li>
              <strong>ARIA Security:</strong> Incorrect ARIA can be exploited for phishing. Mitigation: validate ARIA attributes, use ARIA only when native HTML is insufficient, test with screen readers.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategies</h2>
        <p>
          Design systems require comprehensive testing to ensure consistency, accessibility, and correctness across all consuming applications.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Testing Pyramid for Design Systems</h3>
          <ul className="space-y-2">
            <li>
              <strong>Unit Tests (Base):</strong> Test individual components in isolation. Test props, events, slots, and business logic. Aim for 90%+ coverage on core components. Use Jest, Vitest, or similar.
            </li>
            <li>
              <strong>Visual Regression Tests (Middle):</strong> Capture screenshots of all component states. Compare against baselines to detect visual regressions. Use Percy, Chromatic, or Loki. Run on every PR.
            </li>
            <li>
              <strong>Accessibility Tests (Middle):</strong> Automated a11y testing with axe-core, pa11y, or jest-axe. Test all interactive components. Aim for zero violations. Include in CI/CD pipeline.
            </li>
            <li>
              <strong>Integration Tests (Middle):</strong> Test component composition and interaction. Verify that components work correctly when nested or combined. Test with different themes and configurations.
            </li>
            <li>
              <strong>Consumer Integration Tests (Top):</strong> Test the design system in real consuming applications. Catch issues that only appear in production-like environments. Use canary releases for major versions.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cross-Browser Testing</h3>
          <p>
            Design systems must work consistently across all supported browsers:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Browser Matrix:</strong> Test on Chrome, Firefox, Safari, Edge (latest 2 versions each). Include mobile Safari and Chrome for mobile components.
            </li>
            <li>
              <strong>Automated Cross-Browser Tests:</strong> Use BrowserStack, Sauce Labs, or Playwright for automated cross-browser testing. Run visual regression tests across all browsers.
            </li>
            <li>
              <strong>Progressive Enhancement:</strong> Test that core functionality works in older browsers. Enhanced features can degrade gracefully.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Theme Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Token Validation:</strong> Test that all design tokens are defined and have valid values. Use schema validation for token files.
            </li>
            <li>
              <strong>Theme Switching:</strong> Test theme switching at runtime. Verify that all components update correctly. Test for CSS variable leaks between themes.
            </li>
            <li>
              <strong>Contrast Testing:</strong> Automated contrast ratio testing for all text/background combinations. Use tools like @axe-core/react or custom scripts.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Design system performance directly impacts all consuming applications. Understanding and optimizing performance characteristics is essential.
        </p>

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
                <td className="p-2">Bundle Size (Core)</td>
                <td className="p-2">&lt;50KB compressed</td>
                <td className="p-2">Webpack Bundle Analyzer</td>
              </tr>
              <tr>
                <td className="p-2">Bundle Size (Full)</td>
                <td className="p-2">&lt;200KB compressed</td>
                <td className="p-2">Bundle size CI checks</td>
              </tr>
              <tr>
                <td className="p-2">Component Render Time</td>
                <td className="p-2">&lt;5ms per component</td>
                <td className="p-2">React DevTools Profiler</td>
              </tr>
              <tr>
                <td className="p-2">Tree-Shaking Efficiency</td>
                <td className="p-2">&gt;80% unused code eliminated</td>
                <td className="p-2">Source map analysis</td>
              </tr>
              <tr>
                <td className="p-2">First Paint Impact</td>
                <td className="p-2">&lt;100ms delay</td>
                <td className="p-2">Lighthouse, WebPageTest</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Bundle Size Optimization</h3>
          <p>
            Design system bundle size is critical for consumer applications:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Tree-Shaking:</strong> Use ES modules with sideEffects: false in package.json. Avoid side effects in component files. Test tree-shaking effectiveness with webpack bundle analyzer.
            </li>
            <li>
              <strong>Code Splitting:</strong> Split large components (data tables, rich text editors) into separate chunks. Load on demand. Use dynamic imports for heavy components.
            </li>
            <li>
              <strong>Dependency Management:</strong> Keep peer dependencies minimal. Avoid bundling React, lodash, etc. Use tree-shakeable alternatives (lodash-es).
            </li>
            <li>
              <strong>CSS Optimization:</strong> Use CSS-in-JS with critical CSS extraction. Purge unused CSS. Minify and compress CSS output.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-World Performance Data</h3>
          <p>
            Based on published data from major design systems:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Material-UI (MUI):</strong> Core bundle: ~12KB gzipped. Full library: ~150KB gzipped. Tree-shaking efficiency: ~85%.
            </li>
            <li>
              <strong>Chakra UI:</strong> Core bundle: ~10KB gzipped. Uses emotion for CSS-in-JS. Tree-shaking via barrel exports.
            </li>
            <li>
              <strong>Radix UI:</strong> Headless primitives: ~5KB per component. Zero runtime CSS. Maximum tree-shaking efficiency.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Building and maintaining a design system requires significant investment. Understanding the total cost of ownership is essential for justifying the investment.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Initial Development:</strong> Building a comprehensive design system (50+ components, tokens, documentation) requires 3-5 engineers for 6-12 months. Estimate: $500K-1.5M (fully-loaded costs).
            </li>
            <li>
              <strong>Ongoing Maintenance:</strong> Dedicated team of 2-4 engineers for updates, bug fixes, new components. Estimate: $300K-600K/year.
            </li>
            <li>
              <strong>Documentation:</strong> Technical writer or dedicated documentation engineer. Estimate: $100K-150K/year.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Package Registry:</strong> Private npm registry (Verdaccio, npm org, GitHub Packages). Estimate: $0-500/month depending on usage.
            </li>
            <li>
              <strong>Documentation Hosting:</strong> Storybook hosting (Chromatic, Netlify, Vercel). Estimate: $100-500/month.
            </li>
            <li>
              <strong>CI/CD Infrastructure:</strong> Build pipelines, visual regression testing, accessibility testing. Estimate: $500-2,000/month.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">ROI Calculation</h3>
          <p>
            Design system ROI comes from developer productivity gains:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Development Velocity:</strong> Teams build features 30-50% faster with pre-built components. For a team of 20 engineers at $200K/year, 30% velocity gain = $1.2M/year savings.
            </li>
            <li>
              <strong>Consistency:</strong> Reduced design debt, fewer UX bugs, faster design reviews. Hard to quantify but significant.
            </li>
            <li>
              <strong>Accessibility Compliance:</strong> Built-in a11y reduces legal risk and remediation costs. Accessibility lawsuits average $50K-150K in legal fees alone.
            </li>
            <li>
              <strong>Net ROI:</strong> Typical design systems show positive ROI within 12-18 months for organizations with 5+ product teams.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Make vs Buy Decision Framework</h3>
          <p>
            Consider buying (MUI, Chakra, Ant Design) when: (1) you have &lt;5 product teams, (2) no unique branding requirements, (3) limited engineering resources. Consider building custom when: (1) you have 5+ teams, (2) strong brand differentiation needs, (3) unique interaction patterns, (4) dedicated platform team available.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between a component library and a design
              system?
            </p>
            <p className="mt-2 text-sm">
              A: A component library is code — React components, styles, and
              utilities that developers import. A design system is broader — it
              includes the component library plus design tokens, design
              principles, pattern guidelines, documentation, contribution
              processes, and governance. A design system is a product that
              serves the organization; a component library is its technical
              implementation. You can have a component library without a design
              system (just reusable code), but a design system without a
              component library is just documentation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you architect a design token system for multi-brand
              theming?
            </p>
            <p className="mt-2 text-sm">
              A: Use a three-tier token hierarchy: (1) Global tokens — raw
              values (blue-500: #3B82F6). (2) Alias tokens — semantic mappings
              (color-primary: blue-500, color-danger: red-500). (3) Component
              tokens — component-specific bindings (button-bg: color-primary).
              Multi-brand theming works by swapping the alias layer — Brand A
              maps color-primary to blue-500, Brand B maps it to green-600.
              Components reference alias tokens, not global tokens, so they
              automatically adapt to any brand. Use CSS custom properties for
              runtime theming or a build pipeline (Style Dictionary) for static
              theme generation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle breaking changes in a widely-used component
              library?
            </p>
            <p className="mt-2 text-sm">
              A: (1) Use semantic versioning strictly — breaking changes
              increment the major version. (2) Provide codemods (jscodeshift
              scripts) that automate migration. (3) Support the previous major
              version with security patches for 6-12 months. (4) Add deprecation
              warnings one minor version before removal. (5) Publish a migration
              guide with before/after examples. (6) Offer the new API alongside
              the old one (adapter pattern) before removing the old API. (7)
              Track migration progress across consuming teams with automated
              tooling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are headless components, and why would a design system use
              them?
            </p>
            <p className="mt-2 text-sm">
              A: Headless components provide behavior (state management,
              keyboard navigation, ARIA attributes, focus management) without
              rendering any visual UI. Libraries like Radix, React Aria, and
              Headless UI implement complex interaction patterns (combobox, date
              picker, dialog) correctly according to WAI-ARIA specifications.
              Design systems use them as foundations because: (1) accessibility
              is notoriously hard to implement correctly, (2) the headless
              library handles edge cases across browsers and assistive
              technologies, (3) the design system only needs to add visual
              styling, which is its core competency. This separation of behavior
              and appearance also enables multiple design systems to share the
              same behavioral base.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you measure the success of a design system?
            </p>
            <p className="mt-2 text-sm">
              A: Quantitative metrics: component adoption rate (percentage of UI
              built with system components), coverage (number of products using
              the system), version currency (how quickly teams adopt new
              versions), bug reduction (fewer accessibility and visual bugs),
              and development velocity (time to build new features with vs
              without the system). Qualitative metrics: developer satisfaction
              surveys, designer-developer handoff friction, and time-to- onboard
              for new engineers. Track both to build a complete picture. Avoid
              vanity metrics like component count — fewer, well-designed
              components are better than many rarely-used ones.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://bradfrost.com/blog/post/atomic-web-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brad Frost — Atomic Design Methodology
            </a>
          </li>
          <li>
            <a
              href="https://amzn.github.io/style-dictionary/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Style Dictionary — Design Token Build System
            </a>
          </li>
          <li>
            <a
              href="https://www.radix-ui.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI — Headless Component Primitives
            </a>
          </li>
          <li>
            <a
              href="https://storybook.js.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storybook — Component Development and Documentation
            </a>
          </li>
          <li>
            <a
              href="https://designsystemsrepo.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Design Systems Repo — Curated Collection of Design Systems
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
