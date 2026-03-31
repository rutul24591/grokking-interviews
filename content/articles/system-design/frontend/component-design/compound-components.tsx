"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-design-compound-components",
  title: "Compound Components",
  description: "Staff-level guide to compound components pattern: implicit state sharing, flexible APIs, context-based composition, and building cohesive component libraries.",
  category: "frontend",
  subcategory: "component-design",
  slug: "compound-components",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "component-design", "compound-components", "react-patterns", "component-api", "context"],
  relatedTopics: ["component-composition", "render-props", "higher-order-components", "react-context"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Compound Components</strong> are a pattern where multiple components work together to provide a cohesive API. A parent component provides shared state and context. Child components consume that context and render specific parts. The components are designed to be used together, creating a flexible yet constrained API that guides developers toward correct usage.
        </p>
        <p>
          Compound components address a fundamental challenge: how do we create component APIs that are both flexible and intuitive? Without compound components, components either accept many configuration props (hard to discover and maintain) or are rigid with no flexibility. Compound components enable flexible composition while maintaining a clear, discoverable API.
        </p>
        <p>
          For staff/principal engineers, compound components are an essential pattern for design system and component library development. They enable building components that are easy to use correctly and hard to use incorrectly. The pattern provides the flexibility of render props with cleaner JSX syntax and better developer experience.
        </p>
        <p>
          Common compound component examples include Select with Option children, Accordion with Panel children, Tabs with TabList and TabPanel children, and Form with Field and Label children. In each case, the parent component manages shared state, and child components access that state through context.
        </p>
        <p>
          The business impact of compound components is significant. Well-designed compound component APIs reduce developer cognitive load, prevent misconfiguration, and accelerate development. Teams can build complex UIs by composing intuitive components rather than configuring many props. Component libraries become easier to adopt and maintain.
        </p>
        <p>
          In system design interviews, compound components demonstrate understanding of advanced component patterns, context usage, and API design. It shows you can design components that balance flexibility with guidance, and you understand React's composition model deeply.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/compound-components-pattern.svg"
          alt="Compound components pattern showing Select parent component providing context and Option children consuming context to access shared state"
          caption="Compound components — parent provides context, children consume it. Enables flexible APIs like Select/Option, Accordion/Panel, Tabs/TabList"
        />

        <h3>Compound Component Fundamentals</h3>
        <p>
          Compound components consist of a parent component and child components that work together. The parent creates and owns a context. The parent renders children within a context provider. Child components consume the context to access shared state. This enables children to communicate indirectly through the parent's context.
        </p>
        <p>
          The key insight is that compound components share state implicitly through context rather than explicitly through props. A Select component manages selected value state. Option components read that state to know if they're selected. The Select and Option components are coupled through context, not through direct prop passing.
        </p>

        <h3>Context as Communication Channel</h3>
        <p>
          React Context is the communication channel for compound components. The parent component creates context with createContext. The parent wraps children with the context provider, passing shared state as the value. Child components use useContext to access the shared state.
        </p>
        <p>
          Context enables children to access state without prop drilling. An Option nested deep within Select can access the selected value without every intermediate component passing props. This enables flexible composition where children can be nested at any depth.
        </p>

        <h3>Implicit vs Explicit State</h3>
        <p>
          Compound components use implicit state sharing. The state is shared through context, not through explicit props. This contrasts with explicit state where each component receives state through props. Implicit state reduces prop drilling and enables flexible composition.
        </p>
        <p>
          The trade-off is that implicit state is less visible. Reading the JSX doesn't show where state comes from. Good documentation and TypeScript help make implicit state discoverable. The developer experience benefit of cleaner JSX usually outweighs the visibility trade-off.
        </p>

        <h3>Controlled vs Uncontrolled Compound Components</h3>
        <p>
          Compound components can be controlled or uncontrolled. <strong>Controlled</strong> compound components receive state from props. The parent component manages state and passes it via context. This enables external state management and synchronization with other state. <strong>Uncontrolled</strong> compound components manage their own state internally. The parent creates state with useState and passes it via context.
        </p>
        <p>
          Supporting both patterns provides maximum flexibility. Accept an optional value prop. If provided, use it as controlled state. If not provided, use internal state. This pattern is common in form components and enables both simple uncontrolled usage and complex controlled usage.
        </p>

        <h3>Compound Component Variations</h3>
        <p>
          There are several compound component variations. <strong>Strict compound components</strong> enforce that children must be specific component types. This prevents misuse but reduces flexibility. <strong>Flexible compound components</strong> accept any children that consume the context. This enables custom children but requires more documentation.
        </p>
        <p>
          <strong>Single-level compound components</strong> work only with direct children. <strong>Deep compound components</strong> work with nested children at any depth. Deep compound components are more flexible but require context instead of direct parent-child communication. Most compound components should support deep nesting for maximum flexibility.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing compound components requires careful context design, state management, and API decisions.
        </p>

        <h3>Context Design</h3>
        <p>
          Design context for the compound component's needs. Include all state that children need to access. Include actions that children might need to trigger. Use TypeScript to define the context type clearly. Provide a default value that throws an error if used outside the parent, helping catch misuse early.
        </p>
        <p>
          Consider what state should be in context versus what should be props. State that multiple children need goes in context. State that's specific to one child stays as props. Keep context focused on shared concerns.
        </p>

        <h3>State Management</h3>
        <p>
          The parent component owns the shared state. For uncontrolled components, use useState in the parent. For controlled components, receive state from props. Pass state and actions through context to children.
        </p>
        <p>
          Children should not modify context state directly. Instead, context should include action functions that children can call. This keeps state management centralized and predictable. The parent can add validation, logging, or side effects when state changes.
        </p>

        <h3>Child Component Registration</h3>
        <p>
          Some compound components need to know about their children. A Select might need to know which options exist for keyboard navigation. Children can register with the parent using context actions. On mount, children call a register function. On unmount, children call an unregister function.
        </p>
        <p>
          Registration enables the parent to maintain a list of children. This enables features like keyboard navigation, validation, or collective behavior. Use refs and effects for registration to ensure proper cleanup.
        </p>

        <h3>Type Safety</h3>
        <p>
          TypeScript improves compound component APIs. Define context types explicitly. Type the parent component to accept specific child types if using strict compound components. Type the context value to include all state and actions.
        </p>
        <p>
          For flexible compound components, type children to require context consumption. This ensures children can only be used within the parent. Use TypeScript generics for compound components that work with different data types.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Compound components involve trade-offs between flexibility, explicitness, and complexity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/compound-vs-render-props.svg"
          alt="Comparison of compound components vs render props showing syntax differences and when to use each pattern"
          caption="Compound vs render props — compound provides cleaner syntax for cohesive APIs, render props offer more flexibility for arbitrary rendering"
        />

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Flexibility</th>
              <th className="p-3 text-left">DX</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Compound Components</td>
              <td className="p-3">High</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Cohesive APIs</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Configuration Props</td>
              <td className="p-3">Low</td>
              <td className="p-3">Fair</td>
              <td className="p-3">Low</td>
              <td className="p-3">Simple components</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Render Props</td>
              <td className="p-3">Highest</td>
              <td className="p-3">Good</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Flexible rendering</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Slots</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Low</td>
              <td className="p-3">Fixed layouts</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that compound components provide excellent developer experience for complex components with multiple related parts. The pattern guides developers toward correct usage while enabling flexibility. Use compound components for components like Select, Accordion, Tabs, and Form where multiple parts need to share state.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use context for shared state, not for everything. Keep child-specific state as props. Only put state in context that multiple children need to access. This keeps the context focused and reduces unnecessary re-renders.
        </p>
        <p>
          Support both controlled and uncontrolled usage when appropriate. Accept an optional value prop. If provided, use controlled mode. If not, use internal state. This enables both simple and complex use cases.
        </p>
        <p>
          Provide clear error messages when children are used incorrectly. If a child is used outside the parent, throw an error with a helpful message. This helps developers debug misuse quickly. Document which components are meant to be used together.
        </p>
        <p>
          Use TypeScript to enforce correct usage. Type the context to throw errors if used incorrectly. Type children to require context consumption. This catches errors at compile time rather than runtime.
        </p>
        <p>
          Keep compound components focused. A Select component should handle selection, not form validation. A Form component should handle form state, not API calls. Compose compound components together rather than making each one do everything.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Putting too much state in context causes unnecessary re-renders. When context value changes, all consumers re-render. If context includes state that only some children need, those children re-render unnecessarily. Split context by concern to minimize re-renders.
        </p>
        <p>
          Not supporting controlled mode limits flexibility. Some use cases require external state management. Always consider whether controlled mode would be useful. Supporting both modes adds complexity but enables more use cases.
        </p>
        <p>
          Enforcing strict child types reduces flexibility. Requiring children to be exact component types prevents custom children that consume context. Prefer flexible compound components that accept any children consuming context.
        </p>
        <p>
          Not handling children used outside parent. If a child component is used without the parent, context will be undefined. Provide a default context value that throws a helpful error. This makes debugging easier.
        </p>
        <p>
          Overusing compound components for simple cases. Not every component needs to be a compound component. For simple components with few configuration options, props are simpler. Use compound components when the component has multiple related parts that need shared state.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Design System: Select Component</h3>
        <p>
          A design system needed a Select component that could handle various scenarios. Some selects were single-select, some multi-select, some with search, some with custom option rendering. The solution was a compound component with Select, SelectTrigger, SelectValue, SelectContent, and SelectOption children sharing context.
        </p>
        <p>
          Results included a flexible API that handled all select variations, consistent behavior across all selects, and intuitive usage that was hard to get wrong. The Select component became one of the most used components in the system.
        </p>

        <h3>Dashboard: Accordion Component</h3>
        <p>
          A dashboard needed accordions for collapsible sections. Some accordions allowed multiple open panels, some only one. Some panels were controlled externally, some were internal. The solution was a compound Accordion with AccordionItem and AccordionPanel children.
        </p>
        <p>
          Results included support for both single and multiple open modes, controlled and uncontrolled usage, and flexible panel content. The accordion API was intuitive and required minimal configuration.
        </p>

        <h3>Form Library: Compound Form Components</h3>
        <p>
          A form library needed to provide cohesive APIs for form fields with labels, validation, and error messages. The solution was compound components with Form, Field, Label, and Error children sharing validation context.
        </p>
        <p>
          Results included automatic validation state sharing, flexible field arrangement, and no prop drilling of validation state. The form library became the standard across the organization.
        </p>

        <h3>Tabs Component: Complex Navigation</h3>
        <p>
          A tabs component needed to handle tab lists, tab panels, and keyboard navigation. Some tabs were dynamic, some static. Some tabs were disabled, some hidden. The solution was compound Tabs with TabList, Tab, and TabPanel children.
        </p>
        <p>
          Results included automatic tab registration for keyboard navigation, flexible tab content, and consistent behavior. The tabs component handled all navigation scenarios with a clean API.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are compound components and how do they work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Compound components are multiple components that work together to provide a cohesive API. The parent component creates and owns context. Child components consume context to access shared state. This enables children to communicate indirectly through the parent's context without prop drilling.
            </p>
            <p>
              Examples include Select with Option children, Accordion with Panel children, and Tabs with TabList and TabPanel children. The parent manages shared state, children access it through context.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement controlled and uncontrolled compound components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Accept an optional value prop. If provided, use it as controlled state from props. If not provided, use useState for internal uncontrolled state. Pass the state through context to children. Also pass change handlers so children can trigger state updates.
            </p>
            <p>
              This pattern enables both simple uncontrolled usage for basic cases and controlled usage for complex state management. Most compound components should support both.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do compound components compare to render props?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Compound components provide similar flexibility to render props but with cleaner JSX syntax. Render props use nested callbacks which can create callback hell. Compound components use context which enables flat JSX structure.
            </p>
            <p>
              Compound components are better for cohesive APIs where multiple parts share state. Render props are better when the component needs to pass data to arbitrary render logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle child registration in compound components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Children register with the parent using context actions. On mount, children call a register function passed through context. On unmount, children call an unregister function. The parent maintains a list of registered children.
            </p>
            <p>
              This enables features like keyboard navigation where the parent needs to know about all children. Use refs and effects for registration to ensure proper cleanup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are common mistakes with compound components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Putting too much state in context causes unnecessary re-renders. Not supporting controlled mode limits flexibility. Enforcing strict child types reduces flexibility. Not handling children used outside parent causes confusing errors. Overusing compound components for simple cases adds unnecessary complexity.
            </p>
            <p>
              Split context by concern to minimize re-renders. Support both controlled and uncontrolled. Accept any children consuming context. Provide helpful error messages for misuse.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: When should you use compound components versus configuration props?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use compound components when the component has multiple related parts that need shared state. Use configuration props for simple components with few options. Compound components scale better as complexity grows.
            </p>
            <p>
              Rule of thumb: if you find yourself adding many boolean props to control rendering, consider compound components. If the component has natural sub-parts like Select/Option or Accordion/Panel, compound components are likely appropriate.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/learn/passing-data-deeply-with-context" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Context
            </a> — Official React documentation on context.
          </li>
          <li>
            <a href="https://www.patterns.dev/react/compound-components/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Compound Components
            </a> — Comprehensive guide to compound component pattern.
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/compound-components-with-react-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds: Compound Components
            </a> — In-depth guide to compound components with hooks.
          </li>
          <li>
            <a href="https://www.radix-ui.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Radix UI
            </a> — Example of compound components in practice.
          </li>
          <li>
            <a href="https://www.chakra-ui.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chakra UI
            </a> — Component library using compound components.
          </li>
          <li>
            <a href="https://reactjs.org/docs/context.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Context API
            </a> — Context API documentation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
