"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-factory-pattern",
  title: "Factory Pattern",
  description:
    "Deep dive into the Factory Pattern for frontend architecture covering Simple Factory, Factory Method, Abstract Factory, and their applications in component systems, theming, and plugin architectures.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "factory-pattern",
  wordCount: 3500,
  readingTime: 14,
  lastUpdated: "2026-03-20",
  tags: [
    "frontend",
    "design-patterns",
    "factory",
    "creational-patterns",
    "architecture",
  ],
  relatedTopics: ["singleton-pattern", "module-pattern", "plugin-architecture"],
};

export default function FactoryPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          The <strong>Factory Pattern</strong> is a creational design pattern
          that provides an interface for creating objects without specifying
          their concrete classes. Instead of using direct constructor calls, a
          factory method or factory function encapsulates the creation logic,
          returning the appropriate object based on input parameters,
          configuration, or runtime conditions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In frontend development, factories are ubiquitous but often
          unrecognized. React.createElement() is a factory.
          Document.createElement() is a factory. Every higher-order component
          that wraps a component based on configuration is using the factory
          pattern. The pattern becomes particularly powerful when building
          design systems, form builders, chart libraries, and plugin-based
          architectures where the concrete component to render is determined at
          runtime.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The Gang of Four distinguished three factory variants: Simple Factory
          (a function that creates objects), Factory Method (subclasses decide
          which class to instantiate), and Abstract Factory (families of related
          objects). While the class-heavy GoF implementations map poorly to
          JavaScript, the underlying principles — decoupling creation from
          usage, enabling runtime polymorphism, and centralizing instantiation
          logic — are deeply relevant to modern frontend architectures.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Simple Factory:</strong> A function that takes a type
            discriminator and returns the appropriate object. This is the most
            common variant in JavaScript — a switch/map-based function that
            returns different implementations based on input. In React, this
            manifests as a function that returns different JSX elements based on
            a type prop.
          </HighlightBlock>
          <li>
            <strong>Factory Method:</strong> A method in a base class that
            subclasses override to produce different products. In frontend
            terms, this translates to a base component that delegates rendering
            of specific parts to methods that derived components override — the
            template method pattern combined with factory method.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Abstract Factory:</strong> A factory that produces families
            of related objects without specifying their concrete classes. In
            frontend, this maps to theme providers that create consistently
            styled component families — a &quot;dark theme factory&quot;
            produces dark buttons, dark inputs, and dark cards that are visually
            coherent.
          </HighlightBlock>
          <li>
            <strong>Product Interface:</strong> The common interface that all
            products created by the factory must implement. In TypeScript, this
            is a shared type or interface. In React, it is the shared props
            contract that all renderable variants must accept.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Registration Pattern:</strong> Rather than hard-coding
            product types in a switch statement, a registration-based factory
            allows new product types to be added at runtime. Products register
            themselves with the factory, and the factory looks them up by key
            when creation is requested.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="important">
          The Factory Pattern decouples the consumer from the concrete product,
          allowing new product types to be added without modifying consumer
          code.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/factory-pattern-diagram-1.svg"
          alt="Creator-Product Hierarchy"
          caption="Creator-product hierarchy — an abstract factory creates families of related components (Button, Input, Card) for different themes"
        />

        <HighlightBlock as="p" tier="crucial">
          In a design system context, an abstract factory might produce themed
          component families. A &quot;Material&quot; factory creates
          Material-styled buttons, inputs, and cards, while an &quot;Ant
          Design&quot; factory creates Ant-styled versions. The consuming
          application code uses the factory interface without knowing which
          concrete components are rendered — enabling theme switching without
          code changes.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/factory-pattern-diagram-2.svg"
          alt="Theme-Aware Component Factory"
          caption="Theme-aware component factory — runtime theme configuration determines which concrete component implementations are instantiated"
        />

        <HighlightBlock as="p" tier="important">
          The theme-aware factory pattern is particularly powerful in
          applications that support white-labeling or multi-brand experiences.
          Each brand registers its own component implementations with the
          factory, and the factory selects the appropriate set based on the
          current brand context. This enables a single codebase to serve
          multiple visual identities.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/factory-pattern-diagram-3.svg"
          alt="Factory vs Constructor vs Builder Comparison"
          caption="Comparison of Factory, Constructor, and Builder patterns — each serves different creation complexity levels"
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
            <HighlightBlock as="tr" tier="crucial">
              <td className="p-3">
                <strong>Flexibility</strong>
              </td>
              <td className="p-3">
                • New product types added without modifying consumers
                <br />
                • Runtime polymorphism based on configuration
                <br />• Centralizes creation logic in one location
              </td>
              <td className="p-3">
                • Indirection makes code harder to trace
                <br />
                • Factory can become a god object if not scoped
                <br />• Type narrowing is harder with factory returns
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Testability</strong>
              </td>
              <td className="p-3">
                • Easy to substitute mock products via factory
                <br />
                • Centralized creation simplifies test setup
                <br />• Product types can be tested independently
              </td>
              <td className="p-3">
                • Factory logic itself needs thorough testing
                <br />
                • Registration-based factories can mask missing implementations
                <br />• Complex factory hierarchies are hard to mock
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>Maintainability</strong>
              </td>
              <td className="p-3">
                • Open/Closed Principle — extend without modifying
                <br />
                • Consistent creation logic prevents duplication
                <br />• Clear separation of creation and usage
              </td>
              <td className="p-3">
                • Additional abstraction layer to maintain
                <br />
                • Over-engineering risk for simple cases
                <br />• Registration-based factories can have stale entries
              </td>
            </HighlightBlock>
            <tr>
              <td className="p-3">
                <strong>Type Safety</strong>
              </td>
              <td className="p-3">
                • TypeScript discriminated unions work well with factories
                <br />
                • Product interfaces enforce consistent APIs
                <br />• Generic factories provide strong type inference
              </td>
              <td className="p-3">
                • Return types may need type assertions
                <br />
                • String-keyed registries lose type information
                <br />• Dynamic registration bypasses compile-time checks
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Use Discriminated Unions for Type-Safe Factories:</strong>{" "}
            In TypeScript, define product types as a discriminated union with a
            shared type field. The factory function uses the type discriminator
            to select the correct implementation, and TypeScript narrows the
            return type automatically.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Prefer Function Factories Over Class Factories:</strong> In
            JavaScript, a factory function that returns plain objects or JSX is
            simpler and more idiomatic than a class hierarchy with abstract
            methods. Reserve class-based factories for genuinely complex
            creation logic with shared state.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Use Registration for Extensible Factories:</strong> When the
            set of product types must be extensible (plugins, user-defined
            types), use a Map-based registry where products register themselves.
            This follows the Open/Closed Principle — the factory is open for
            extension but closed for modification.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Keep Factory Logic Pure:</strong> Factories should create
            and return objects without side effects. Avoid putting
            initialization logic (API calls, event subscriptions, DOM
            manipulation) inside the factory. Let the consumer handle lifecycle
            management of the created product.
          </HighlightBlock>
          <li>
            <strong>Combine with Strategy Pattern:</strong> Use factories to
            select strategy implementations at runtime. For example, a
            validation factory that returns the appropriate validation strategy
            (email, phone, credit card) based on the field type, with each
            strategy implementing a common validate() interface.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Provide Fallback Products:</strong> Registration-based
            factories should handle missing type keys gracefully — either by
            returning a default product, throwing a descriptive error, or
            rendering a fallback UI component. Silent failures in factories lead
            to hard-to-debug rendering issues.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Factory God Object:</strong> A single factory that creates
            dozens of unrelated product types becomes a maintenance bottleneck.
            Split factories along domain boundaries — a form field factory, a
            chart factory, a notification factory — each responsible for its own
            product family.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Losing Type Information:</strong> Returning a broad base
            type from the factory forces consumers to use type assertions or
            runtime checks. Use TypeScript generics or overloaded function
            signatures to preserve specific product types through the factory
            call.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Over-Engineering Simple Cases:</strong> Creating a factory
            for a component that only has two variants (and is unlikely to grow)
            adds unnecessary indirection. A simple conditional render in JSX is
            more readable and maintainable than a factory abstraction for
            trivial cases.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Coupling Factory to Framework:</strong> A factory that
            directly creates React components cannot be reused if the
            application migrates to another framework. Keep the factory&apos;s
            core logic framework-agnostic and use a thin adapter layer for
            framework-specific rendering.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Ignoring Initialization Order:</strong> Registration-based
            factories depend on all products being registered before the factory
            is used. In code-split applications, lazy-loaded modules may not
            register their products until after the factory has been queried,
            causing missing products. Use async factories or deferred
            registration patterns to handle this.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Form Builders (Formik, React Hook Form):</strong> Form
            libraries use factories to render the appropriate input component
            based on field configuration. A schema-driven form maps field types
            (text, select, date, file) to concrete input components through a
            field factory.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Chart Libraries (Recharts, Victory):</strong> Charting
            libraries use factories to create the appropriate chart type (bar,
            line, pie, scatter) from a data specification. The factory selects
            the rendering strategy, axis configuration, and legend layout based
            on the chart type.
          </HighlightBlock>
          <li>
            <strong>Notification Systems:</strong> Applications render different
            notification components (toast, banner, modal, inline) based on
            severity and context. A notification factory maps type and priority
            to the appropriate visual component and positioning strategy.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>CMS Block Editors (Notion, WordPress Gutenberg):</strong>{" "}
            Block editors use factories to render content blocks based on type —
            paragraphs, headings, images, embeds, tables. Each block type
            registers itself with the block factory, enabling plugin-based
            extensibility.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Design System Theme Switching:</strong> Applications
            supporting multiple themes or brands use abstract factories to
            produce consistently styled component families. Switching themes
            swaps the entire component factory, ensuring visual coherence across
            all UI elements.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="important">
          Factory Pattern introduces security considerations around object creation validation, injection attacks through factory parameters, and proper access control for factory methods.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Factory Security Patterns</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="crucial">
              <strong>Input Validation:</strong> Factory methods must validate type parameters and creation parameters. Mitigation: use TypeScript enums for type parameters, validate all input parameters, implement allowlists for valid types.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Access Control:</strong> Not all code should be able to create all object types. Mitigation: implement factory access control, use private constructors with factory friend patterns, validate caller permissions.
            </HighlightBlock>
            <HighlightBlock as="li" tier="important">
              <strong>Object Initialization Security:</strong> Created objects must be properly initialized. Mitigation: enforce required parameters, validate object state after creation, use builder pattern for complex objects.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Factory Testing Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Mock Security:</strong> Mocked factories can hide security vulnerabilities. Mitigation: test with real factory implementations in security tests, verify access control in integration tests.
            </li>
            <li>
              <strong>Injection Testing:</strong> Test factory resistance to injection attacks. Verify that invalid type parameters are rejected. Test boundary conditions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <HighlightBlock as="p" tier="important">
          Factory Pattern performance depends on creation complexity, registry lookup efficiency, and object initialization overhead.
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
                <td className="p-2">Factory Lookup Time</td>
                <td className="p-2">&lt;0.1ms</td>
                <td className="p-2">Performance.now()</td>
              </tr>
              <HighlightBlock as="tr" tier="crucial">
                <td className="p-2">Object Creation Time</td>
                <td className="p-2">&lt;1ms per object</td>
                <td className="p-2">Performance.now()</td>
              </HighlightBlock>
              <tr>
                <td className="p-2">Registry Size</td>
                <td className="p-2">&lt;100 types</td>
                <td className="p-2">Runtime monitoring</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Factory Implementation Comparison</h3>
          <p>
            Different factory implementations have different performance characteristics:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Switch-Based Factory:</strong> Lookup: ~0.01ms. Best for: &lt;10 types, simple creation logic. Limitation: not extensible without modification.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>Registry-Based Factory:</strong> Lookup: ~0.05ms. Best for: extensible systems, plugin architectures. Limitation: slightly higher overhead.
            </HighlightBlock>
            <li>
              <strong>Class-Based Factory:</strong> Lookup: ~0.1ms. Best for: complex creation logic, inheritance hierarchies. Limitation: more complex implementation.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <HighlightBlock as="p" tier="important">
          Factory Pattern has minimal direct costs but significant implications for code maintainability and extensibility.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Implementation Complexity:</strong> Simple factories: &lt;1 day. Registry-based: 1-2 days. Class-based with inheritance: 2-3 days.
            </li>
            <HighlightBlock as="li" tier="important">
              <strong>Maintenance:</strong> Switch-based factories require modification for new types (OCP violation). Registry-based factories allow extension without modification.
            </HighlightBlock>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">When to Use Factory Pattern</h3>
          <HighlightBlock as="p" tier="crucial">
            Use factories when: (1) you don't know all object types in advance (plugin systems), (2) creation logic is complex and should be encapsulated, (3) you need to centralize object creation for access control or logging. Avoid when: (1) you have only one object type (use direct construction), (2) creation logic is trivial (factory adds unnecessary indirection).
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            as="div"
            tier="crucial"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">
              Q: What is the difference between Simple Factory, Factory Method,
              and Abstract Factory?
            </p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Simple Factory is a function that creates objects based on a
              type parameter — it centralizes creation but is not extensible
              without modification. Factory Method is a method defined in a base
              class that subclasses override to produce different products — it
              uses inheritance for extensibility. Abstract Factory creates
              families of related objects (Button + Input + Card for a theme) —
              it ensures consistency across a product family. In frontend
              JavaScript, Simple Factory (a function with a switch/map) is most
              common due to the language&apos;s functional nature and lack of
              traditional class hierarchies.
            </HighlightBlock>
          </HighlightBlock>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design a component factory for a form builder?
            </p>
            <p className="mt-2 text-sm">
              A: Define a field schema type with a discriminator (type:
              &quot;text&quot; | &quot;select&quot; | &quot;date&quot; | ...)
              and common props (name, label, validation rules). Create a
              registry Map that maps type strings to component constructors. The
              factory function takes a field schema, looks up the component in
              the registry, and returns the rendered element with the
              appropriate props. Use TypeScript generics to preserve
              field-specific prop types through the factory. Allow registration
              of custom field types for extensibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does React.createElement relate to the Factory Pattern?
            </p>
            <p className="mt-2 text-sm">
              A: React.createElement is the foundational factory in React. JSX
              compiles to createElement calls that produce React element
              objects. It takes a type (string for DOM elements, function or
              class for components), props, and children, and returns a
              descriptor object that React&apos;s reconciler later uses to
              create actual DOM nodes or component instances. This is a Simple
              Factory — the type parameter determines what kind of element is
              created, and the returned object conforms to the React element
              interface regardless of the concrete type.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When is the Factory Pattern overkill?
            </p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: When the set of product types is small (2-3), unlikely to grow,
              and the creation logic is trivial. A conditional expression or
              ternary in JSX is more readable than a factory abstraction for
              simple cases. The Factory Pattern earns its complexity when:
              product types are extensible (plugins), creation involves complex
              initialization, the same creation logic is duplicated in multiple
              places, or you need to swap entire product families at runtime
              (theming).
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you maintain type safety with a registration-based
              factory?
            </p>
            <p className="mt-2 text-sm">
              A: Use a TypeScript Map with a discriminated union as the key type
              and a generic registration function that enforces the relationship
              between the key and the product type. The register() method should
              be generic, constraining the product&apos;s props to match the
              expected type for that key. For example: register&lt;K extends
              FieldType&gt;(key: K, component:
              React.ComponentType&lt;FieldPropsMap[K]&gt;). This ensures that
              registering a &quot;date&quot; field requires a component that
              accepts DateFieldProps.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://refactoring.guru/design-patterns/factory-method"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Refactoring Guru — Factory Method Pattern
            </a>
          </li>
          <li>
            <a
              href="https://refactoring.guru/design-patterns/abstract-factory"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Refactoring Guru — Abstract Factory Pattern
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/vanilla/factory-pattern"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev — Factory Pattern
            </a>
          </li>
          <li>
            <a
              href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TypeScript Handbook — Discriminated Unions
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
