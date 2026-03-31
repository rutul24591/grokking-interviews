"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-design-component-composition",
  title: "Component Composition",
  description: "Staff-level guide to component composition patterns: children prop, slot composition, render props, HOCs, and compound components for building flexible, reusable component APIs.",
  category: "frontend",
  subcategory: "component-design",
  slug: "component-composition",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "component-design", "composition", "react-patterns", "component-api", "reusability"],
  relatedTopics: ["atomic-design-principles", "higher-order-components", "render-props", "compound-components"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Component Composition</strong> is the practice of building complex components by combining simpler components together. Instead of creating monolithic components that do everything, composition encourages creating small, focused components that can be combined in different ways to achieve various outcomes. This approach is fundamental to React and modern frontend frameworks.
        </p>
        <p>
          Composition addresses a core challenge in component design: how do we create components that are flexible enough to handle various use cases without becoming overly complex or configurable? Without composition, components become bloated with props for every possible variation, leading to hard-to-maintain code and limited flexibility.
        </p>
        <p>
          For staff/principal engineers, composition patterns are essential tools for designing component APIs. The right composition pattern makes components intuitive to use, easy to extend, and maintainable over time. The wrong pattern leads to prop drilling, tightly coupled components, and frustrated developers.
        </p>
        <p>
          React provides several composition mechanisms. The <strong>children prop</strong> allows components to receive nested content. <strong>Named slots</strong> enable multiple insertion points. <strong>Render props</strong> pass rendering logic as props. <strong>Higher-Order Components</strong> wrap components to add functionality. <strong>Compound components</strong> work together to provide a cohesive API.
        </p>
        <p>
          The business impact of good composition is significant. Well-composed components reduce code duplication, improve consistency, and accelerate development. Teams can build new features by combining existing components rather than creating new ones from scratch. Component libraries become more flexible and easier to adopt.
        </p>
        <p>
          In system design interviews, component composition demonstrates understanding of API design, reusability patterns, and the trade-offs between different composition approaches. It shows you think about component interfaces and developer experience, not just implementation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/composition-patterns.svg"
          alt="Component composition patterns comparison: children prop, named slots, render props, compound components, HOCs, and custom hooks"
          caption="Composition patterns — choose based on needs: children for simple wrapping, compound for cohesive APIs, hooks for modern logic reuse"
        />

        <h3>The Children Prop</h3>
        <p>
          The children prop is the simplest composition pattern. Components receive nested content via the children prop and render it where appropriate. This enables layout components, wrappers, and containers that add structure or behavior without knowing what they're wrapping.
        </p>
        <p>
          Common use cases include layout containers that apply consistent spacing or styling, wrappers that add behavior like error boundaries or suspense, and presentational components that structure content without dictating what the content is. The children prop is implicit in JSX and doesn't need to be explicitly passed.
        </p>

        <h3>Named Slots</h3>
        <p>
          Named slots enable multiple insertion points within a component. Instead of a single children prop, components accept multiple named children. This enables complex layouts where different content goes in different places.
        </p>
        <p>
          Common use cases include card components with header, body, and footer slots, modal components with title, content, and action slots, and page layouts with sidebar, main content, and header slots. Named slots provide more control than a single children prop while maintaining flexibility.
        </p>

        <h3>Render Props</h3>
        <p>
          Render props pass rendering logic as a prop. Instead of receiving pre-rendered content, the component receives a function that returns content. This function can receive arguments, enabling the component to share state or data with the rendered content.
        </p>
        <p>
          Common use cases include data-fetching components that fetch data and pass it to the render prop, behavior components that track state and expose it to the render prop, and abstraction components that provide context or utilities to the render prop. Render props provide maximum flexibility but can lead to callback hell.
        </p>

        <h3>Higher-Order Components</h3>
        <p>
          Higher-Order Components (HOCs) are functions that take a component and return a new component with added functionality. HOCs wrap the original component, injecting props or behavior. This pattern was popular before React hooks but is still useful for certain scenarios.
        </p>
        <p>
          Common use cases include cross-cutting concerns like logging or error handling, data injection from external sources, and conditional rendering logic. HOCs can compose multiple enhancements but can create wrapper hell and obscure prop sources.
        </p>

        <h3>Compound Components</h3>
        <p>
          Compound components are multiple components that work together to provide a cohesive API. Parent components provide shared state and context. Child components consume that context and render specific parts. This pattern enables flexible APIs where users can arrange child components as needed.
        </p>
        <p>
          Common use cases include select components with option children, accordion components with panel children, and form components with field and label children. Compound components provide the flexibility of render props with cleaner JSX syntax.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing composition patterns requires thoughtful API design and state management decisions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/component-directory-structure.svg"
          alt="Component directory structure organized by Atomic levels: atoms/, molecules/, organisms/, templates/, pages/ with dependency flow"
          caption="Directory structure — organize by Atomic level to make hierarchy explicit. Prevents circular dependencies and keeps architecture clean"
        />

        <h3>Choosing the Right Pattern</h3>
        <p>
          Select composition patterns based on the use case. Use children prop for simple wrapping where the component doesn't need to know about the content. Use named slots when you need multiple distinct insertion points. Use render props when the component needs to pass data to the rendered content. Use HOCs for cross-cutting concerns that apply to many components. Use compound components for cohesive APIs with multiple related parts.
        </p>
        <p>
          Consider the trade-offs. Children prop is simplest but least flexible. Render props are most flexible but can create nested callback structures. HOCs compose well but obscure prop sources. Compound components provide clean APIs but require more setup.
        </p>

        <h3>State Management in Composition</h3>
        <p>
          State management in composed components requires careful design. Parent components should own shared state and pass it down. Child components should receive state via props or context. Avoid having multiple components in a composition own the same state.
        </p>
        <p>
          For compound components, use React Context to share state between parent and children. The parent creates and owns the context. Children consume the context. This enables children to access shared state without prop drilling.
        </p>

        <h3>Type Safety in Composition</h3>
        <p>
          Type safety in composed components requires careful TypeScript design. Use generics for components that render arbitrary children. Use discriminated unions for compound component props. Use React.PropsWithChildren for components that accept children.
        </p>
        <p>
          For compound components, type the parent component to accept only specific child types. Use TypeScript to enforce that compound components are used correctly. This prevents runtime errors from incorrect composition.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Composition patterns involve trade-offs between flexibility, complexity, and developer experience.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Flexibility</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">DX</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Children Prop</td>
              <td className="p-3">Low</td>
              <td className="p-3">Lowest</td>
              <td className="p-3">Best</td>
              <td className="p-3">Simple wrapping</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Named Slots</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Multi-section layouts</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Render Props</td>
              <td className="p-3">Highest</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Good</td>
              <td className="p-3">Data sharing</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">HOCs</td>
              <td className="p-3">High</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Fair</td>
              <td className="p-3">Cross-cutting concerns</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Compound</td>
              <td className="p-3">High</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Cohesive APIs</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that simpler patterns are usually better. Start with children prop. Only reach for more complex patterns when necessary. Favor patterns that provide clean JSX syntax over patterns that require nested callbacks.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Favor composition over configuration. Instead of adding props for every variation, compose components to achieve different outcomes. This keeps components simple and flexible. Keep components focused on their specific responsibility. Let composition handle the complexity of combining multiple components.
        </p>
        <p>
          Use children prop by default. It's the simplest pattern and works for most cases. Only reach for more complex patterns when children prop is insufficient. Document composition patterns clearly. Show examples of how to compose components in different ways.
        </p>
        <p>
          Avoid deep nesting of render props or HOCs. If you find yourself nesting more than two levels, consider a different pattern. Compound components often provide cleaner alternatives. Test composed components in various combinations. Ensure composition doesn't break when components are rearranged.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Over-engineering composition patterns creates unnecessary complexity. Don't use render props when children prop would work. Don't use HOCs when a simple wrapper would suffice. Start simple and add complexity only when needed.
        </p>
        <p>
          Prop drilling through composed components defeats the purpose. If you're passing props through multiple layers of composition, consider Context or a different pattern. Breaking encapsulation by reaching into child components violates composition principles. Use the component's public API.
        </p>
        <p>
          Forgetting to forward refs breaks ref access through composed components. Use React.forwardRef when wrapping components. Not handling null or undefined children causes runtime errors. Always check for children before rendering.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Design System: Flexible Card Component</h3>
        <p>
          A design system needed a card component that could handle various layouts. Some cards had images, some had headers, some had actions. The solution was a compound component pattern with Card, CardHeader, CardBody, and CardFooter children.
        </p>
        <p>
          Results included a flexible API that handled all card variations, clean JSX syntax that was intuitive to use, and no need for configuration props. The card component became one of the most used components in the system.
        </p>

        <h3>Dashboard: Layout Composition</h3>
        <p>
          A dashboard application needed flexible layouts for different page types. Some pages had sidebars, some had multiple columns, some had full-width content. The solution was named slots with Sidebar, Main, and Header slots.
        </p>
        <p>
          Results included consistent layouts across all pages, easy customization for different page types, and reduced layout duplication. The layout component handled all the responsive behavior.
        </p>

        <h3>Form Library: Compound Form Components</h3>
        <p>
          A form library needed to provide a cohesive API for form fields with labels, validation, and error messages. The solution was compound components with Form, Field, Label, and Error children sharing context.
        </p>
        <p>
          Results included a clean API where all form parts shared validation state automatically, flexible arrangement of form parts, and no prop drilling of validation state. The form library became the standard across the organization.
        </p>

        <h3>Analytics: Data Fetching with Render Props</h3>
        <p>
          An analytics platform needed to fetch data and render charts with that data. Different charts needed different data transformations. The solution was render props where the data-fetching component passed data to a render function.
        </p>
        <p>
          Results included separation of data fetching from rendering, flexible data transformation in the render prop, and reusable data-fetching logic. The pattern was used consistently across all analytics views.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are the different composition patterns in React and when do you use each?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Children prop is for simple wrapping where the component doesn't need to know about the content. Named slots are for multiple distinct insertion points like card header, body, footer. Render props are for passing data to rendered content via functions. HOCs are for cross-cutting concerns that apply to many components. Compound components are for cohesive APIs with multiple related parts.
            </p>
            <p>
              Start with the simplest pattern that works. Children prop is usually sufficient. Only reach for more complex patterns when necessary.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between render props and compound components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Render props pass rendering logic as a function prop. The component calls the function with data. This provides maximum flexibility but can create nested callbacks. Compound components use multiple components that share context. The parent provides state, children consume it. This provides similar flexibility with cleaner JSX syntax.
            </p>
            <p>
              Choose compound components when you want a cleaner API. Choose render props when you need maximum flexibility or the pattern doesn't fit compound components.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When should you use HOCs versus React hooks?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HOCs were the primary pattern for sharing logic before hooks. Hooks are now preferred for most cases because they're simpler and don't create wrapper chains. HOCs are still useful for cross-cutting concerns that need to wrap components, like error boundaries or performance monitoring.
            </p>
            <p>
              Default to hooks. Use HOCs when you need to wrap components or the pattern specifically requires it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle state in compound components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use React Context to share state between parent and children. The parent creates and owns the context value. Children consume the context via useContext. This enables children to access shared state without prop drilling. The parent can also expose actions via context.
            </p>
            <p>
              This pattern enables flexible compound components where children can be arranged in any order while sharing state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are common mistakes in component composition?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Over-engineering with complex patterns when simple children prop would work. Prop drilling through composed components instead of using Context. Breaking encapsulation by reaching into child components. Not forwarding refs through wrapped components. Not handling null or undefined children.
            </p>
            <p>
              Start simple. Use the simplest pattern that works. Only add complexity when the use case requires it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you test composed components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Test individual components in isolation first. Then test common composition patterns. Use testing-library to render composed components and verify they work together. Test edge cases like missing children or invalid compositions. For compound components, test that context is shared correctly.
            </p>
            <p>
              Also test the developer experience. Ensure composition patterns are intuitive and errors are clear when used incorrectly.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/learn/passing-data-deeply-with-context" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Component Composition
            </a> — Official React documentation on composition.
          </li>
          <li>
            <a href="https://www.patterns.dev/react/render-props/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Render Props
            </a> — Comprehensive guide to render props pattern.
          </li>
          <li>
            <a href="https://www.patterns.dev/react/compound-components/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Compound Components
            </a> — Guide to compound component pattern.
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/compound-components-with-react-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds: Compound Components
            </a> — In-depth guide to compound components.
          </li>
          <li>
            <a href="https://maxrozen.com/rules-for-building-react-components" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Rules for Building React Components
            </a> — Best practices for component design.
          </li>
          <li>
            <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Custom Hooks
            </a> — Modern alternative to HOCs.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
