"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-design-controlled-vs-uncontrolled",
  title: "Controlled vs Uncontrolled Components",
  description: "Staff-level guide to controlled and uncontrolled components: state ownership, form handling, performance trade-offs, and when to use each pattern.",
  category: "frontend",
  subcategory: "component-design",
  slug: "controlled-vs-uncontrolled-components",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "component-design", "controlled", "uncontrolled", "forms", "state-management"],
  relatedTopics: ["component-composition", "compound-components", "form-handling", "react-state"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Controlled and Uncontrolled Components</strong> represent two approaches to managing component state, particularly for form inputs. <strong>Controlled components</strong> have their state managed by React state in a parent component. The input value is set via props, and changes are handled through callbacks. <strong>Uncontrolled components</strong> manage their own state internally. The input maintains its own value, and the parent reads the value when needed via refs.
        </p>
        <p>
          This distinction addresses a fundamental question in component design: who owns the state? Should the component manage its own state, or should a parent component manage it? The answer affects how data flows through the application, how validation works, and how the component integrates with the rest of the system.
        </p>
        <p>
          For staff/principal engineers, understanding controlled versus uncontrolled is essential for form architecture, component API design, and performance optimization. The choice affects validation strategies, integration with state management, and the ability to programmatically manipulate values.
        </p>
        <p>
          Controlled components provide a single source of truth. The React state is the source of truth, and the input value always reflects that state. This enables immediate validation, conditional UI changes based on values, and integration with global state. Uncontrolled components are simpler for basic cases, have better performance for large forms, and integrate better with non-React code.
        </p>
        <p>
          The business impact of choosing the right pattern is significant. Controlled components enable rich form experiences with real-time validation and conditional logic. Uncontrolled components provide better performance for large forms and simpler integration with external libraries. Choosing wrong leads to performance issues, complex workarounds, or limited functionality.
        </p>
        <p>
          In system design interviews, controlled versus uncontrolled demonstrates understanding of state management, data flow, and React's mental model. It shows you can evaluate trade-offs and choose the right pattern for the use case.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/controlled-vs-uncontrolled.svg"
          alt="Comparison of controlled components (state in parent, value via props, onChange callback) versus uncontrolled components (state in DOM, defaultValue, read via ref)"
          caption="Controlled vs uncontrolled — controlled for real-time validation and conditional UI, uncontrolled for large forms and non-React integration"
        />

        <h3>Controlled Components</h3>
        <p>
          Controlled components have their value set by React state. The component receives value as a prop and notifies the parent of changes through an onChange callback. The parent updates state, which flows back down as the new value. This creates a unidirectional data flow where React state is the single source of truth.
        </p>
        <p>
          Controlled components enable immediate access to the value in React state. This enables real-time validation, conditional rendering based on values, and integration with other state. The value is always available in state, not just when the form submits.
        </p>
        <p>
          The trade-off is that every keystroke triggers a state update and re-render. For simple forms, this is negligible. For large forms with many inputs, this can impact performance. Each input change causes the parent to re-render.
        </p>

        <h3>Uncontrolled Components</h3>
        <p>
          Uncontrolled components manage their own state internally. The component maintains its own value, and the parent reads the value when needed via refs. The parent doesn't control the value on every change, only reading it when necessary like on form submission.
        </p>
        <p>
          Uncontrolled components have better performance for large forms because changes don't trigger parent re-renders. Each input manages its own state independently. The parent only accesses values when needed, not on every change.
        </p>
        <p>
          The trade-off is that values aren't immediately available in React state. Real-time validation requires additional work. Conditional rendering based on values requires refs or state synchronization. Integration with global state is more complex.
        </p>

        <h3>Hybrid Approach</h3>
        <p>
          Components can support both controlled and uncontrolled modes. Accept an optional value prop. If provided, operate in controlled mode. If not provided, use internal state for uncontrolled mode. This pattern provides flexibility for different use cases.
        </p>
        <p>
          The hybrid approach requires careful implementation to avoid switching between modes. Once a component starts as controlled, it should remain controlled. Once uncontrolled, remain uncontrolled. Switching between modes can cause issues with state synchronization.
        </p>
        <p>
          Many React components support both modes. Input elements work both ways. Form libraries often support both. The choice depends on the specific requirements of the use case.
        </p>

        <h3>When to Use Controlled</h3>
        <p>
          Use controlled components when you need immediate validation on every change. When the input value affects other UI elements conditionally. When you need to programmatically set the value. When integrating with global state management. When you need to track the full history of changes.
        </p>
        <p>
          Controlled is the default choice for most form scenarios. The performance cost is usually negligible, and the benefits of having state in React are significant. Choose controlled unless you have a specific reason for uncontrolled.
        </p>

        <h3>When to Use Uncontrolled</h3>
        <p>
          Use uncontrolled components for large forms with many inputs where performance matters. When integrating with non-React libraries that expect to manage the DOM. When you only need the value on submission, not on every change. When building reusable input components that should work both ways.
        </p>
        <p>
          Uncontrolled is appropriate when the overhead of controlled components becomes noticeable. For forms with dozens of inputs, uncontrolled can provide better performance. For simple forms, the performance difference is negligible.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing controlled and uncontrolled patterns requires careful state management and ref handling.
        </p>

        <h3>Controlled Implementation</h3>
        <p>
          For controlled components, state lives in the parent. The parent passes value as a prop to the input. The parent provides an onChange handler that updates state. The input value always reflects the parent's state.
        </p>
        <p>
          This pattern ensures the input is always in sync with React state. Any change to state immediately updates the input. Any input change immediately updates state. This enables real-time validation and conditional UI.
        </p>
        <p>
          For performance, memoize the onChange handler to prevent unnecessary re-renders. Use useCallback for handlers that are passed to controlled inputs. This prevents the handler from being recreated on every render.
        </p>

        <h3>Uncontrolled Implementation</h3>
        <p>
          For uncontrolled components, use refs to access the DOM value. Create a ref with useRef. Pass the ref to the input. Read the value via ref.current.value when needed.
        </p>
        <p>
          This pattern lets the input manage its own state. The parent doesn't re-render on every change. The parent only accesses the value when needed, like on form submission.
        </p>
        <p>
          For default values, use defaultValue instead of value. This sets the initial value without controlling the input. The input then manages its own state from that starting point.
        </p>

        <h3>Hybrid Implementation</h3>
        <p>
          For hybrid components, check if value prop is provided. If yes, use controlled mode with state from props. If no, use uncontrolled mode with internal state or refs. Warn if switching between modes, as this can cause issues.
        </p>
        <p>
          Track whether the component is controlled or uncontrolled. Use a ref to remember the mode. If the mode changes, warn the developer. This helps catch accidental switching during development.
        </p>
        <p>
          Many component libraries implement this pattern. It provides flexibility for consumers while maintaining clear behavior. Document which mode is used when so developers understand the component's behavior.
        </p>

        <h3>Form Integration</h3>
        <p>
          Forms often mix controlled and uncontrolled inputs. Some fields need real-time validation (controlled). Some fields are simple and don't need validation (uncontrolled). This hybrid approach balances performance and functionality.
        </p>
        <p>
          Form libraries handle this complexity. React Hook Form uses uncontrolled inputs with refs for performance. Formik uses controlled inputs for integration with validation libraries. Choose based on your needs.
        </p>
        <p>
          For native form submission, uncontrolled works well. The browser handles form submission, and you read values via refs. For React-based submission with validation, controlled works better. State is available for validation before submission.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Controlled and uncontrolled components involve trade-offs between functionality, performance, and complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Validation</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Controlled</td>
              <td className="p-3">Fair (re-renders)</td>
              <td className="p-3">Excellent (real-time)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Most forms</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Uncontrolled</td>
              <td className="p-3">Best (no re-renders)</td>
              <td className="p-3">Fair (on submit)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Large forms</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Hybrid</td>
              <td className="p-3">Good</td>
              <td className="p-3">Good</td>
              <td className="p-3">High</td>
              <td className="p-3">Reusable components</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that controlled is the default choice for most scenarios. The performance cost is usually negligible, and the benefits of having state in React are significant. Choose uncontrolled when you have a specific performance need or integration requirement.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Default to controlled components for most form scenarios. The benefits of having state in React outweigh the performance cost for typical forms. Use uncontrolled when you have a specific reason like large forms or non-React integration.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/controlled-use-cases.svg"
          alt="Controlled vs uncontrolled use cases showing when to use each: controlled for validation, conditional UI, programmatic control; uncontrolled for large forms, non-React integration, simple forms"
          caption="Use cases — default to controlled for most cases. Use uncontrolled for large forms, non-React integration, or when value only needed on submit"
        />

        <p>
          For controlled components, memoize onChange handlers with useCallback. This prevents unnecessary re-renders from new function references. For uncontrolled components, use refs consistently. Don't mix refs and state for the same input.
        </p>
        <p>
          Support both modes for reusable input components. Accept an optional value prop for controlled mode. Use internal state or refs for uncontrolled mode. Warn if switching between modes. Document the behavior clearly.
        </p>
        <p>
          For validation, controlled enables real-time validation on every change. Uncontrolled requires validation on blur or submit. Choose based on UX requirements. Real-time validation provides better UX but costs more.
        </p>
        <p>
          Don't switch between controlled and uncontrolled for the same input. Once an input starts as controlled, keep it controlled. Switching causes issues with state synchronization and can lose user input.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Switching between controlled and uncontrolled causes issues. If an input starts with a value prop (controlled) and then the value becomes undefined, React warns about switching to uncontrolled. This can lose user input and cause bugs.
        </p>
        <p>
          Not memoizing controlled component handlers causes unnecessary re-renders. Every render creates a new onChange function, which can cause the input to re-render even when the value hasn't changed. Use useCallback for handlers.
        </p>
        <p>
          Using state and refs for the same input creates synchronization issues. Don't try to keep React state in sync with DOM value manually. Choose controlled (state) or uncontrolled (ref), not both.
        </p>
        <p>
          Not handling default values correctly. For controlled, use value with initial state. For uncontrolled, use defaultValue. Using value without onChange makes the input read-only.
        </p>
        <p>
          Over-using uncontrolled for simple forms. The performance benefit is negligible for small forms, but you lose the benefits of controlled. Default to controlled unless you have a specific reason for uncontrolled.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Enterprise Form: Real-Time Validation</h3>
        <p>
          An enterprise application needed forms with real-time validation. Fields validated on every change, showing errors immediately. Some fields affected other fields conditionally. The solution was controlled components with validation on every change.
        </p>
        <p>
          Results included immediate feedback for users, conditional field display based on values, and integration with global form state. The controlled pattern enabled all validation requirements.
        </p>

        <h3>Survey Platform: Large Form Performance</h3>
        <p>
          A survey platform had forms with 100+ inputs. Controlled components caused noticeable lag on every keystroke. The solution was uncontrolled components with validation on submit.
        </p>
        <p>
          Results included smooth input performance even with many fields, acceptable validation on submit, and better user experience for long surveys. The performance benefit of uncontrolled was significant.
        </p>

        <h3>Component Library: Hybrid Input Component</h3>
        <p>
          A component library needed input components that worked for all use cases. The solution was hybrid components supporting both controlled and uncontrolled modes. Accept optional value prop for controlled, use internal state for uncontrolled.
        </p>
        <p>
          Results included flexible components that worked for all consumers, clear documentation on mode selection, and warnings for mode switching. The hybrid pattern became standard for all form components.
        </p>

        <h3>Integration: Non-React Library</h3>
        <p>
          A project needed to integrate with a non-React date picker library. The library expected to manage the DOM directly. The solution was uncontrolled components with refs. The library updated the DOM, React read values via refs.
        </p>
        <p>
          Results included successful integration with the external library, no conflicts between React and library state management, and clean separation of concerns. Uncontrolled was necessary for this integration.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between controlled and uncontrolled components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Controlled components have their state managed by React state in a parent. The value is set via props, changes via onChange callback. Uncontrolled components manage their own state internally. The value is read via refs when needed.
            </p>
            <p>
              Controlled provides single source of truth, real-time validation, and integration with global state. Uncontrolled provides better performance for large forms and simpler non-React integration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: When should you use controlled versus uncontrolled?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use controlled for real-time validation, conditional UI based on values, programmatic value setting, and global state integration. Use uncontrolled for large forms where performance matters, non-React library integration, and when you only need values on submit.
            </p>
            <p>
              Default to controlled for most scenarios. The performance cost is usually negligible, and the benefits are significant.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you implement a component that supports both modes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Accept an optional value prop. If provided, use controlled mode with state from props. If not provided, use uncontrolled mode with internal state or refs. Track the mode with a ref. Warn if the mode switches during the component's lifetime.
            </p>
            <p>
              This pattern provides flexibility for consumers. Document which mode is used when so developers understand the behavior.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are performance considerations for controlled components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Every keystroke triggers a state update and re-render. For simple forms, this is negligible. For large forms with many inputs, this can impact performance. Memoize onChange handlers with useCallback to prevent unnecessary re-renders.
            </p>
            <p>
              For large forms, consider uncontrolled or hybrid approaches. Use controlled only for fields that need real-time validation. Use uncontrolled for simple fields.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What happens when you switch between controlled and uncontrolled?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              React warns about switching from controlled to uncontrolled or vice versa. This can cause issues with state synchronization and lose user input. An input that starts with a value prop should always have a value. An input that starts without should never receive a value.
            </p>
            <p>
              Avoid switching by ensuring value is always defined for controlled inputs. Use empty string instead of undefined. Track the mode and warn during development if it changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do form libraries handle controlled versus uncontrolled?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              React Hook Form uses uncontrolled inputs with refs for performance. It only re-renders when validation fails or on submit. Formik uses controlled inputs for integration with validation libraries. Every change updates Formik state.
            </p>
            <p>
              Choose based on needs. React Hook Form for performance with large forms. Formik for rich validation integration. Both support hybrid approaches.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Controlled and Uncontrolled Components
            </a> — Official React documentation.
          </li>
          <li>
            <a href="https://react.dev/reference/react-dom/components/input" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Input Component
            </a> — Input component documentation.
          </li>
          <li>
            <a href="https://goshakkk.no/controlled-vs-uncontrolled-components-react/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Controlled vs Uncontrolled Components
            </a> — Detailed comparison.
          </li>
          <li>
            <a href="https://react-hook-form.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Hook Form
            </a> — Form library using uncontrolled inputs.
          </li>
          <li>
            <a href="https://formik.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Formik
            </a> — Form library using controlled inputs.
          </li>
          <li>
            <a href="https://www.patterns.dev/react/forms/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Forms
            </a> — Form patterns including controlled/uncontrolled.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
