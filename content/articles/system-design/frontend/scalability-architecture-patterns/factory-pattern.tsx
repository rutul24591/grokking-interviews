"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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
  tags: ["frontend", "design-patterns", "factory", "creational-patterns", "architecture"],
  relatedTopics: ["singleton-pattern", "module-pattern", "plugin-architecture"],
};

export default function FactoryPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Factory Pattern</strong> is a creational design pattern that provides an interface for
          creating objects without specifying their concrete classes. Instead of using direct constructor
          calls, a factory method or factory function encapsulates the creation logic, returning the
          appropriate object based on input parameters, configuration, or runtime conditions.
        </p>
        <p>
          In frontend development, factories are ubiquitous but often unrecognized. React.createElement() is
          a factory. Document.createElement() is a factory. Every higher-order component that wraps a
          component based on configuration is using the factory pattern. The pattern becomes particularly
          powerful when building design systems, form builders, chart libraries, and plugin-based
          architectures where the concrete component to render is determined at runtime.
        </p>
        <p>
          The Gang of Four distinguished three factory variants: Simple Factory (a function that creates
          objects), Factory Method (subclasses decide which class to instantiate), and Abstract Factory
          (families of related objects). While the class-heavy GoF implementations map poorly to JavaScript,
          the underlying principles — decoupling creation from usage, enabling runtime polymorphism, and
          centralizing instantiation logic — are deeply relevant to modern frontend architectures.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Simple Factory:</strong> A function that takes a type discriminator and returns the
            appropriate object. This is the most common variant in JavaScript — a switch/map-based function
            that returns different implementations based on input. In React, this manifests as a function
            that returns different JSX elements based on a type prop.
          </li>
          <li>
            <strong>Factory Method:</strong> A method in a base class that subclasses override to produce
            different products. In frontend terms, this translates to a base component that delegates
            rendering of specific parts to methods that derived components override — the template method
            pattern combined with factory method.
          </li>
          <li>
            <strong>Abstract Factory:</strong> A factory that produces families of related objects without
            specifying their concrete classes. In frontend, this maps to theme providers that create
            consistently styled component families — a &quot;dark theme factory&quot; produces dark buttons,
            dark inputs, and dark cards that are visually coherent.
          </li>
          <li>
            <strong>Product Interface:</strong> The common interface that all products created by the factory
            must implement. In TypeScript, this is a shared type or interface. In React, it is the shared
            props contract that all renderable variants must accept.
          </li>
          <li>
            <strong>Registration Pattern:</strong> Rather than hard-coding product types in a switch
            statement, a registration-based factory allows new product types to be added at runtime. Products
            register themselves with the factory, and the factory looks them up by key when creation is
            requested.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The Factory Pattern decouples the consumer from the concrete product, allowing new product types
          to be added without modifying consumer code.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/factory-pattern-diagram-1.svg"
          alt="Creator-Product Hierarchy"
          caption="Creator-product hierarchy — an abstract factory creates families of related components (Button, Input, Card) for different themes"
        />

        <p>
          In a design system context, an abstract factory might produce themed component families. A
          &quot;Material&quot; factory creates Material-styled buttons, inputs, and cards, while an
          &quot;Ant Design&quot; factory creates Ant-styled versions. The consuming application code uses
          the factory interface without knowing which concrete components are rendered — enabling theme
          switching without code changes.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/factory-pattern-diagram-2.svg"
          alt="Theme-Aware Component Factory"
          caption="Theme-aware component factory — runtime theme configuration determines which concrete component implementations are instantiated"
        />

        <p>
          The theme-aware factory pattern is particularly powerful in applications that support white-labeling
          or multi-brand experiences. Each brand registers its own component implementations with the factory,
          and the factory selects the appropriate set based on the current brand context. This enables a
          single codebase to serve multiple visual identities.
        </p>

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
            <tr>
              <td className="p-3"><strong>Flexibility</strong></td>
              <td className="p-3">
                • New product types added without modifying consumers<br />
                • Runtime polymorphism based on configuration<br />
                • Centralizes creation logic in one location
              </td>
              <td className="p-3">
                • Indirection makes code harder to trace<br />
                • Factory can become a god object if not scoped<br />
                • Type narrowing is harder with factory returns
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Testability</strong></td>
              <td className="p-3">
                • Easy to substitute mock products via factory<br />
                • Centralized creation simplifies test setup<br />
                • Product types can be tested independently
              </td>
              <td className="p-3">
                • Factory logic itself needs thorough testing<br />
                • Registration-based factories can mask missing implementations<br />
                • Complex factory hierarchies are hard to mock
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Maintainability</strong></td>
              <td className="p-3">
                • Open/Closed Principle — extend without modifying<br />
                • Consistent creation logic prevents duplication<br />
                • Clear separation of creation and usage
              </td>
              <td className="p-3">
                • Additional abstraction layer to maintain<br />
                • Over-engineering risk for simple cases<br />
                • Registration-based factories can have stale entries
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Type Safety</strong></td>
              <td className="p-3">
                • TypeScript discriminated unions work well with factories<br />
                • Product interfaces enforce consistent APIs<br />
                • Generic factories provide strong type inference
              </td>
              <td className="p-3">
                • Return types may need type assertions<br />
                • String-keyed registries lose type information<br />
                • Dynamic registration bypasses compile-time checks
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use Discriminated Unions for Type-Safe Factories:</strong> In TypeScript, define product
            types as a discriminated union with a shared type field. The factory function uses the type
            discriminator to select the correct implementation, and TypeScript narrows the return type
            automatically.
          </li>
          <li>
            <strong>Prefer Function Factories Over Class Factories:</strong> In JavaScript, a factory
            function that returns plain objects or JSX is simpler and more idiomatic than a class hierarchy
            with abstract methods. Reserve class-based factories for genuinely complex creation logic with
            shared state.
          </li>
          <li>
            <strong>Use Registration for Extensible Factories:</strong> When the set of product types must
            be extensible (plugins, user-defined types), use a Map-based registry where products register
            themselves. This follows the Open/Closed Principle — the factory is open for extension but
            closed for modification.
          </li>
          <li>
            <strong>Keep Factory Logic Pure:</strong> Factories should create and return objects without
            side effects. Avoid putting initialization logic (API calls, event subscriptions, DOM
            manipulation) inside the factory. Let the consumer handle lifecycle management of the created
            product.
          </li>
          <li>
            <strong>Combine with Strategy Pattern:</strong> Use factories to select strategy implementations
            at runtime. For example, a validation factory that returns the appropriate validation strategy
            (email, phone, credit card) based on the field type, with each strategy implementing a common
            validate() interface.
          </li>
          <li>
            <strong>Provide Fallback Products:</strong> Registration-based factories should handle missing
            type keys gracefully — either by returning a default product, throwing a descriptive error, or
            rendering a fallback UI component. Silent failures in factories lead to hard-to-debug rendering
            issues.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Factory God Object:</strong> A single factory that creates dozens of unrelated product
            types becomes a maintenance bottleneck. Split factories along domain boundaries — a form field
            factory, a chart factory, a notification factory — each responsible for its own product family.
          </li>
          <li>
            <strong>Losing Type Information:</strong> Returning a broad base type from the factory forces
            consumers to use type assertions or runtime checks. Use TypeScript generics or overloaded
            function signatures to preserve specific product types through the factory call.
          </li>
          <li>
            <strong>Over-Engineering Simple Cases:</strong> Creating a factory for a component that only has
            two variants (and is unlikely to grow) adds unnecessary indirection. A simple conditional render
            in JSX is more readable and maintainable than a factory abstraction for trivial cases.
          </li>
          <li>
            <strong>Coupling Factory to Framework:</strong> A factory that directly creates React components
            cannot be reused if the application migrates to another framework. Keep the factory&apos;s core
            logic framework-agnostic and use a thin adapter layer for framework-specific rendering.
          </li>
          <li>
            <strong>Ignoring Initialization Order:</strong> Registration-based factories depend on all
            products being registered before the factory is used. In code-split applications, lazy-loaded
            modules may not register their products until after the factory has been queried, causing missing
            products. Use async factories or deferred registration patterns to handle this.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Form Builders (Formik, React Hook Form):</strong> Form libraries use factories to
            render the appropriate input component based on field configuration. A schema-driven form
            maps field types (text, select, date, file) to concrete input components through a field
            factory.
          </li>
          <li>
            <strong>Chart Libraries (Recharts, Victory):</strong> Charting libraries use factories to
            create the appropriate chart type (bar, line, pie, scatter) from a data specification. The
            factory selects the rendering strategy, axis configuration, and legend layout based on the
            chart type.
          </li>
          <li>
            <strong>Notification Systems:</strong> Applications render different notification components
            (toast, banner, modal, inline) based on severity and context. A notification factory maps
            type and priority to the appropriate visual component and positioning strategy.
          </li>
          <li>
            <strong>CMS Block Editors (Notion, WordPress Gutenberg):</strong> Block editors use factories
            to render content blocks based on type — paragraphs, headings, images, embeds, tables. Each
            block type registers itself with the block factory, enabling plugin-based extensibility.
          </li>
          <li>
            <strong>Design System Theme Switching:</strong> Applications supporting multiple themes or
            brands use abstract factories to produce consistently styled component families. Switching themes
            swaps the entire component factory, ensuring visual coherence across all UI elements.
          </li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://refactoring.guru/design-patterns/factory-method" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Refactoring Guru — Factory Method Pattern
            </a>
          </li>
          <li>
            <a href="https://refactoring.guru/design-patterns/abstract-factory" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Refactoring Guru — Abstract Factory Pattern
            </a>
          </li>
          <li>
            <a href="https://www.patterns.dev/vanilla/factory-pattern" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              patterns.dev — Factory Pattern
            </a>
          </li>
          <li>
            <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TypeScript Handbook — Discriminated Unions
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between Simple Factory, Factory Method, and Abstract Factory?</p>
            <p className="mt-2 text-sm">
              A: Simple Factory is a function that creates objects based on a type parameter — it centralizes
              creation but is not extensible without modification. Factory Method is a method defined in a
              base class that subclasses override to produce different products — it uses inheritance for
              extensibility. Abstract Factory creates families of related objects (Button + Input + Card for
              a theme) — it ensures consistency across a product family. In frontend JavaScript, Simple
              Factory (a function with a switch/map) is most common due to the language&apos;s functional
              nature and lack of traditional class hierarchies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design a component factory for a form builder?</p>
            <p className="mt-2 text-sm">
              A: Define a field schema type with a discriminator (type: &quot;text&quot; | &quot;select&quot;
              | &quot;date&quot; | ...) and common props (name, label, validation rules). Create a registry
              Map that maps type strings to component constructors. The factory function takes a field schema,
              looks up the component in the registry, and returns the rendered element with the appropriate
              props. Use TypeScript generics to preserve field-specific prop types through the factory.
              Allow registration of custom field types for extensibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React.createElement relate to the Factory Pattern?</p>
            <p className="mt-2 text-sm">
              A: React.createElement is the foundational factory in React. JSX compiles to createElement
              calls that produce React element objects. It takes a type (string for DOM elements, function
              or class for components), props, and children, and returns a descriptor object that React&apos;s
              reconciler later uses to create actual DOM nodes or component instances. This is a Simple
              Factory — the type parameter determines what kind of element is created, and the returned
              object conforms to the React element interface regardless of the concrete type.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When is the Factory Pattern overkill?</p>
            <p className="mt-2 text-sm">
              A: When the set of product types is small (2-3), unlikely to grow, and the creation logic is
              trivial. A conditional expression or ternary in JSX is more readable than a factory abstraction
              for simple cases. The Factory Pattern earns its complexity when: product types are extensible
              (plugins), creation involves complex initialization, the same creation logic is duplicated in
              multiple places, or you need to swap entire product families at runtime (theming).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you maintain type safety with a registration-based factory?</p>
            <p className="mt-2 text-sm">
              A: Use a TypeScript Map with a discriminated union as the key type and a generic registration
              function that enforces the relationship between the key and the product type. The register()
              method should be generic, constraining the product&apos;s props to match the expected type for
              that key. For example: register&lt;K extends FieldType&gt;(key: K, component:
              React.ComponentType&lt;FieldPropsMap[K]&gt;). This ensures that registering a &quot;date&quot;
              field requires a component that accepts DateFieldProps.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
