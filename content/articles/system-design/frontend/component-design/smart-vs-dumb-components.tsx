"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-design-smart-vs-dumb-components",
  title: "Smart vs Dumb Components",
  description: "Staff-level guide to smart (container) and dumb (presentational) components: separation of concerns, data flow, testing strategies, and modern patterns with hooks.",
  category: "frontend",
  subcategory: "component-design",
  slug: "smart-vs-dumb-components",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "component-design", "smart-components", "dumb-components", "container-pattern", "separation-of-concerns"],
  relatedTopics: ["component-composition", "react-hooks", "state-management", "component-architecture"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Smart and Dumb Components</strong> (also called Container and Presentational components) represent a pattern for separating concerns in React applications. <strong>Smart components</strong> (containers) manage state, data fetching, and business logic. They know how data is loaded and manipulated. <strong>Dumb components</strong> (presentational) focus solely on rendering UI. They receive data via props and emit events via callbacks, but don't know where data comes from or how it changes.
        </p>
        <p>
          This pattern addresses a fundamental challenge: how do we organize components to maximize reusability, testability, and maintainability? Without separation, components become coupled to specific data sources, hard to test in isolation, and difficult to reuse in different contexts. The smart/dumb pattern creates a clear boundary between logic and presentation.
        </p>
        <p>
          For staff/principal engineers, the smart/dumb pattern is foundational for component architecture. It influences how teams organize code, how components are tested, and how logic is shared. While hooks have evolved the pattern, the underlying principle of separating concerns remains essential.
        </p>
        <p>
          Smart components connect to data sources like APIs, stores, or context. They transform data for presentation. They handle user actions by dispatching to stores or calling APIs. Dumb components are pure functions of their props. Given the same props, they render the same UI. They're highly reusable because they're not coupled to specific data sources.
        </p>
        <p>
          The business impact of this separation is significant. Dumb components are highly reusable across different parts of the application. Smart components are easier to test because logic is isolated. Teams can work on presentation and logic independently. Code becomes more maintainable as concerns are clearly separated.
        </p>
        <p>
          In system design interviews, smart versus dumb demonstrates understanding of separation of concerns, component architecture, and testing strategies. It shows you can design components that are maintainable and scalable.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/smart-vs-dumb.svg"
          alt="Smart vs dumb components showing Smart component managing state and logic passing props to Dumb component that only renders UI"
          caption="Smart vs dumb — smart manages state and data sources, dumb renders UI from props. Modern approach: hooks contain smart logic, components remain presentational"
        />

        <h3>Presentational (Dumb) Components</h3>
        <p>
          Presentational components focus solely on how things look. They receive data via props and emit events via callbacks. They don't have dependencies on the rest of the app like stores or APIs. They're often functional components without state, though they can have UI state like toggle states.
        </p>
        <p>
          Characteristics include being concerned with appearance rather than data source, receiving data and callbacks exclusively via props, having few or no dependencies on other parts of the app, and being highly reusable across different contexts. They're often styled components or UI library wrappers.
        </p>
        <p>
          Examples include Button, Card, Avatar, and List components. These components don't care where their data comes from. A List component can render users, products, or messages. It just renders what it's given.
        </p>

        <h3>Container (Smart) Components</h3>
        <p>
          Container components focus on how things work. They manage state, data fetching, and business logic. They connect to data sources like APIs, Redux stores, or context. They transform data for presentation and pass it to presentational components.
        </p>
        <p>
          Characteristics include being concerned with data fetching and state management, connecting to data sources like stores or APIs, transforming data for presentation, and being less reusable because they're tied to specific data. They often wrap presentational components.
        </p>
        <p>
          Examples include UserListContainer that fetches users and renders UserList, ProductDetailContainer that fetches product data and renders ProductDetail, and FormContainer that handles form submission and renders Form.
        </p>

        <h3>Benefits of Separation</h3>
        <p>
          Separating smart and dumb components provides several benefits. <strong>Reusability</strong> improves because presentational components aren't tied to specific data sources. A Button component can be used anywhere. <strong>Testability</strong> improves because presentational components are pure functions of props. Test with different props, verify rendering.
        </p>
        <p>
          <strong>Maintainability</strong> improves because logic and presentation are separate. Change the UI without touching logic. Change logic without touching UI. <strong>Team workflow</strong> improves because designers can work on presentational components while developers work on containers. Parallel work becomes possible.
        </p>

        <h3>Hooks and the Pattern</h3>
        <p>
          React hooks have evolved the smart/dumb pattern. Before hooks, class components made separation more important. Stateful logic required classes. Presentational components could be functions. Hooks enable extracting stateful logic into custom hooks, which can be used in any component.
        </p>
        <p>
          With hooks, the pattern becomes more about separating logic from presentation than separating component types. Custom hooks contain smart logic. Components that use custom hooks can be presentational or contain logic as needed. The boundary is more flexible.
        </p>
        <p>
          The core principle remains: separate concerns. Whether through container/presentational components or custom hooks/presentational components, keep logic and presentation separate for maintainability and testability.
        </p>

        <h3>When to Use the Pattern</h3>
        <p>
          Use the smart/dumb pattern for components that are used in multiple contexts with different data sources. Use it for complex components where logic and presentation are both complex. Use it when you want to test presentation logic separately from data logic.
        </p>
        <p>
          Don't over-apply the pattern. Simple components don't need separation. A component that fetches data and renders it might not need a separate presentational component. Premature abstraction adds complexity without benefit.
        </p>
        <p>
          The pattern is most valuable for design systems and component libraries. Presentational components become the reusable library. Container components are application-specific. This separation enables sharing the presentational library across multiple applications.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing the smart/dumb pattern requires clear boundaries and data flow decisions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/smart-dumb-data-flow.svg"
          alt="Smart vs dumb data flow showing unidirectional flow: data flows down via props from smart to dumb, events flow up via callbacks from dumb to smart"
          caption="Data flow — unidirectional: data down via props, events up via callbacks. Smart connects to data sources, dumb renders UI"
        />

        <h3>Data Flow</h3>
        <p>
          Data flows from smart to dumb components via props. Smart components fetch or receive data from stores. They transform it for presentation. They pass the transformed data to dumb components. Dumb components render the data without knowing its source.
        </p>
        <p>
          Events flow from dumb to smart components via callbacks. Dumb components emit events like onClick, onChange, onSubmit. Smart components provide callback props that handle these events. The callbacks dispatch to stores or call APIs.
        </p>
        <p>
          This unidirectional flow makes data flow predictable. Data down, events up. This pattern is consistent across the application, making it easier to understand and debug.
        </p>

        <h3>State Management</h3>
        <p>
          Smart components own application state. They connect to Redux, Zustand, Context, or other state management. They dispatch actions or call setters to update state. They select or subscribe to state changes.
        </p>
        <p>
          Dumb components can have UI state. Toggle states, form input states, and animation states are appropriate in dumb components. This is local UI state, not application state. The distinction is whether the state affects other parts of the app.
        </p>
        <p>
          With hooks, custom hooks can manage state. Components that use custom hooks get state without being smart components themselves. This enables more flexible state sharing.
        </p>

        <h3>Testing Strategy</h3>
        <p>
          Test dumb components by rendering with different props and verifying output. Use snapshot testing for presentation. Use accessibility testing to ensure proper ARIA attributes. Test edge cases like empty states, loading states, and error states.
        </p>
        <p>
          Test smart components by mocking data sources and verifying behavior. Mock API calls, verify they're called correctly. Mock store dispatch, verify actions are dispatched. Test error handling and loading states.
        </p>
        <p>
          The separation enables focused testing. Dumb component tests don't need to mock APIs. Smart component tests don't need to verify exact rendering. Each test suite focuses on its concern.
        </p>

        <h3>Composition Patterns</h3>
        <p>
          Smart components often compose multiple dumb components. A UserContainer might compose Avatar, UserName, and UserActions. The container manages user data, passes it to each child.
        </p>
        <p>
          Dumb components can compose other dumb components. A Card might compose CardHeader, CardBody, and CardFooter. This creates a hierarchy of presentational components.
        </p>
        <p>
          Smart components can compose other smart components, but this is less common. Usually, smart components are at the page or feature level. They compose dumb components for presentation.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          The smart/dumb pattern involves trade-offs between separation, complexity, and boilerplate.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Separation</th>
              <th className="p-3 text-left">Boilerplate</th>
              <th className="p-3 text-left">Reusability</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Smart/Dumb</td>
              <td className="p-3">High</td>
              <td className="p-3">Medium</td>
              <td className="p-3">High</td>
              <td className="p-3">Design systems</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Hooks/Presentational</td>
              <td className="p-3">High</td>
              <td className="p-3">Low</td>
              <td className="p-3">High</td>
              <td className="p-3">Modern React</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Mixed</td>
              <td className="p-3">Low</td>
              <td className="p-3">Lowest</td>
              <td className="p-3">Low</td>
              <td className="p-3">Simple apps</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that the pattern's value depends on application complexity. For design systems and large applications, the separation is essential. For simple applications, the boilerplate might not be worth it. Use hooks for modern implementations to reduce boilerplate.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Keep dumb components pure. They should render based solely on props. Don't fetch data in dumb components. Don't connect to stores in dumb components. This ensures reusability.
        </p>
        <p>
          Make smart components thin. They should fetch data, transform it, and pass to dumb components. Don't put presentation logic in smart components. Keep them focused on data flow.
        </p>
        <p>
          Use TypeScript to enforce the boundary. Dumb components should have clear prop types. Smart components should have clear data requirements. This makes the contract explicit.
        </p>
        <p>
          Use custom hooks for reusable logic. Instead of creating container components for every use case, create custom hooks that can be used in any component. This reduces boilerplate.
        </p>
        <p>
          Don't over-abstract. Not every component needs to be split into smart and dumb. Simple components can handle their own data. Split when there's a clear benefit.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Over-applying the pattern creates unnecessary boilerplate. Splitting every component into smart and dumb adds files without benefit. Apply the pattern where there's clear separation of concerns.
        </p>
        <p>
          Creating dumb components that are too specific defeats reusability. A UserList that only works with user data from one API isn't very reusable. Make dumb components generic.
        </p>
        <p>
          Putting business logic in dumb components violates separation. Dumb components should render, not decide. Business logic belongs in smart components or custom hooks.
        </p>
        <p>
          Not testing dumb components in isolation misses the benefit. Test dumb components with various props. Verify they render correctly. Don't only test through smart components.
        </p>
        <p>
          Ignoring hooks and sticking to strict container/presentational creates unnecessary classes. Use hooks for modern implementations. The pattern is about separation, not component types.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Design System: Reusable UI Library</h3>
        <p>
          A company needed a UI library used across multiple applications. The solution was dumb presentational components (Button, Card, Input) that were application-agnostic. Each application had its own smart containers that connected to specific data sources.
        </p>
        <p>
          Results included a single UI library used by 10+ applications, consistent UI across all products, and easy updates to the library without changing application logic. The separation enabled sharing presentation across contexts.
        </p>

        <h3>E-Commerce: Product Listing</h3>
        <p>
          An e-commerce site needed product listings in multiple places. The solution was a dumb ProductList component that accepted products as props. Smart components fetched products from different APIs (featured, category, search) and rendered ProductList.
        </p>
        <p>
          Results included a single ProductList component used everywhere, consistent product rendering, and easy addition of new product sources. The dumb component was truly reusable.
        </p>

        <h3>Dashboard: Widget Architecture</h3>
        <p>
          A dashboard needed widgets that displayed different data. The solution was dumb Widget components that accepted data and configuration. Smart WidgetContainer components fetched data from different sources and configured widgets.
        </p>
        <p>
          Results included flexible widget composition, easy addition of new widget types, and consistent widget behavior. The separation enabled mixing and matching widgets.
        </p>

        <h3>Migration: Classes to Hooks</h3>
        <p>
          A team had class-based container components and function-based presentational components. They migrated to hooks, extracting container logic into custom hooks. Presentational components stayed the same but now used hooks instead of being wrapped.
        </p>
        <p>
          Results included reduced boilerplate, same separation of concerns, and improved code organization. The pattern evolved with hooks while maintaining the core principle.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between smart and dumb components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Smart components (containers) manage state, data fetching, and business logic. They connect to data sources like APIs or stores. Dumb components (presentational) focus solely on rendering UI. They receive data via props and emit events via callbacks, but don't know where data comes from.
            </p>
            <p>
              The separation enables reusability, testability, and maintainability. Dumb components can be used with any data source. Smart components can change data sources without affecting presentation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do hooks affect the smart/dumb pattern?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Hooks enable extracting stateful logic into custom hooks. Instead of container components wrapping presentational components, components use custom hooks for logic. The separation is still there, but it's more flexible.
            </p>
            <p>
              Custom hooks contain smart logic. Components that use them can be presentational or contain additional logic. The boundary is more flexible than strict container/presentational.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When should you separate smart and dumb components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Separate when components are used in multiple contexts with different data sources. Separate when logic and presentation are both complex. Separate when you want to test presentation separately from data logic.
            </p>
            <p>
              Don't separate for simple components. A component that fetches and renders might not need separation. Apply the pattern where there's clear benefit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you test smart and dumb components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Test dumb components by rendering with different props and verifying output. Use snapshot testing for presentation. Test edge cases like empty and loading states. Test smart components by mocking data sources and verifying behavior. Mock API calls, verify they're called correctly. Mock store dispatch, verify actions are dispatched.
            </p>
            <p>
              The separation enables focused testing. Each test suite focuses on its concern without mocking the other.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are common mistakes with the smart/dumb pattern?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Over-applying the pattern creates unnecessary boilerplate. Creating dumb components that are too specific defeats reusability. Putting business logic in dumb components violates separation. Not testing dumb components in isolation misses the benefit. Ignoring hooks and sticking to strict container/presentational creates unnecessary classes.
            </p>
            <p>
              Apply the pattern judiciously. Make dumb components generic. Keep business logic in smart components or hooks. Test both types in isolation. Use hooks for modern implementations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does the pattern relate to design systems?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Design systems are primarily dumb presentational components. Buttons, cards, inputs don't know about application data. They're highly reusable because they're not coupled to specific data sources. Applications use smart components to connect design system components to data.
            </p>
            <p>
              This separation enables sharing design systems across multiple applications. Each application has its own smart components, but they all use the same dumb presentational library.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Dan Abramov: Smart and Dumb Components
            </a> — Original article on the pattern.
          </li>
          <li>
            <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Custom Hooks
            </a> — Modern approach to logic reuse.
          </li>
          <li>
            <a href="https://www.patterns.dev/react/presentational-container-components/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Presentational/Container
            </a> — Comprehensive guide to the pattern.
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/state-colocation-with-component-hooks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds: State Colocation
            </a> — When to keep state close to usage.
          </li>
          <li>
            <a href="https://redux.js.org/style-guide/#structure-files-as-feature-folders-with-single-file-exports" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Style Guide
            </a> — Component organization patterns.
          </li>
          <li>
            <a href="https://www.christianalfoni.com/articles/presentational-and-container-components-revisited/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Presentational and Container Components Revisited
            </a> — Modern take on the pattern.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
