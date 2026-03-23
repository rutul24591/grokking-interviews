"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-accessible-forms-extensive",
  title: "Accessible Forms",
  description:
    "Comprehensive guide to building accessible forms, covering label association, error handling, validation patterns, fieldset/legend grouping, ARIA form attributes, and production-grade implementation strategies for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "accessible-forms",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-21",
  tags: [
    "accessibility",
    "forms",
    "a11y",
    "validation",
    "labels",
    "error-handling",
    "fieldset",
    "aria-describedby",
  ],
  relatedTopics: ["aria-attributes", "keyboard-navigation", "screen-reader-support"],
};

export default function AccessibleFormsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─── Section 1: Definition & Context ─── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Accessible forms</strong> are web forms designed so that all users — including those
          using screen readers, keyboard navigation, voice control, or other assistive technologies —
          can understand, complete, and submit them successfully. Forms are the primary mechanism for
          user input on the web (registration, checkout, search, settings), making their accessibility
          critical for equal access.
        </p>
        <p>
          WCAG addresses form accessibility through multiple success criteria:
          <strong> 1.3.1 Info and Relationships</strong> (Level A) requires programmatic
          label-input association; <strong>3.3.1 Error Identification</strong> (Level A) requires
          that errors are identified and described in text; <strong>3.3.2 Labels or
          Instructions</strong> (Level A) requires labels or instructions for user input;
          <strong>3.3.3 Error Suggestion</strong> (Level AA) requires suggested corrections;
          <strong>4.1.2 Name, Role, Value</strong> (Level A) requires that all form controls have
          accessible names and communicate their state. WCAG 2.2 added <strong>3.3.7 Redundant
          Entry</strong> (Level A) requiring that previously entered information is auto-populated
          and <strong>3.3.8 Accessible Authentication</strong> (Level AA) preventing cognitive
          function tests as the sole authentication method.
        </p>
        <p>
          Form accessibility failures are consistently among the top issues found in accessibility
          audits. The WebAIM Million study finds that 45.9% of form inputs lack proper labels —
          the most fundamental form accessibility requirement. Beyond labels, error handling,
          validation timing, required field indication, and group labeling (fieldset/legend) all
          present challenges.
        </p>
        <p>
          <strong>Why accessible forms matter for staff/principal engineers:</strong> Form patterns
          are reused across entire applications. A form component library with poor accessibility
          propagates failures to every feature that uses it. Technical leaders must design form
          component APIs that make accessibility the default — where doing the right thing requires
          less effort than doing the wrong thing. This means label association, error announcement,
          and required field indication should be built into the component, not added as an
          afterthought by each consuming team.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Labels Are Not Optional — They Are the Foundation</h3>
          <p>
            Every form input must have a programmatically associated label. Placeholder text is not
            a label — it disappears when the user types, leaving no context. Visual proximity is not
            association — screen readers can&apos;t infer which text &quot;belongs to&quot; which
            input. The <code>&lt;label&gt;</code> element with a <code>for</code>/<code>htmlFor</code>
            attribute is the most robust association method. Without it, screen reader users hear
            &quot;edit text, blank&quot; instead of &quot;Email address, edit text.&quot;
          </p>
        </div>
      </section>

      {/* ─── Section 2: Core Concepts ─── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Label Association:</strong> The programmatic link between a label and its form
            control. Four methods exist: (1) Explicit: <code>&lt;label for=&quot;id&quot;&gt;</code>
            matching <code>&lt;input id=&quot;id&quot;&gt;</code>. (2) Implicit: wrapping the input
            inside the <code>&lt;label&gt;</code>. (3) <code>aria-label</code>: direct string label
            (no visible text). (4) <code>aria-labelledby</code>: references external element IDs.
            Explicit association is the most widely supported.
          </li>
          <li>
            <strong>Fieldset and Legend:</strong> Groups of related controls (radio buttons, checkboxes,
            address fields) should be wrapped in <code>&lt;fieldset&gt;</code> with a
            <code>&lt;legend&gt;</code> providing the group label. Screen readers announce the legend
            before each control in the group, providing context: &quot;Shipping address, Street,
            edit text&quot; instead of just &quot;Street, edit text.&quot;
          </li>
          <li>
            <strong>Error Identification and Description:</strong> Errors must be communicated through
            text (not just color) and programmatically associated with the failing input via
            <code>aria-describedby</code> or <code>aria-errormessage</code>. Error text should
            describe what went wrong and how to fix it: &quot;Email must include an @ symbol&quot;
            rather than &quot;Invalid email.&quot;
          </li>
          <li>
            <strong>Required Fields:</strong> Mark required fields with both visual indication
            (asterisk, &quot;required&quot; text) and programmatic indication
            (<code>required</code> attribute or <code>aria-required=&quot;true&quot;</code>). Provide
            instructions at the top of the form explaining the required field convention.
          </li>
          <li>
            <strong>Autocomplete Attribute:</strong> The <code>autocomplete</code> attribute enables
            browsers and assistive technology to auto-fill form fields, reducing user effort. WCAG
            1.3.5 (Level AA) requires <code>autocomplete</code> on inputs that collect personal
            information. Values include <code>name</code>, <code>email</code>,
            <code>tel</code>, <code>street-address</code>, <code>cc-number</code>, etc.
          </li>
          <li>
            <strong>Validation Timing:</strong> Forms can validate on submit, on blur (when leaving
            a field), or on input (as the user types). Each has accessibility implications: on-submit
            validation requires an error summary and focus management; on-blur provides immediate
            feedback but can be disorienting if too aggressive; on-input can create excessive
            screen reader announcements.
          </li>
          <li>
            <strong>Error Summary Pattern:</strong> After submission with errors, display a summary
            at the top of the form listing all errors with links to the failing fields. Move focus
            to the summary. This pattern (used by GOV.UK) ensures screen reader users are immediately
            aware of all errors without having to navigate the entire form.
          </li>
        </ul>
      </section>

      {/* ─── Section 3: Architecture & Flow ─── */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Label-Input Association Patterns</h3>
        <p>
          There are multiple ways to associate labels with form controls, each with different levels
          of browser and screen reader support. Understanding these patterns and their trade-offs is
          essential for building accessible form components.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/accessible-forms-diagram-1.svg"
          alt="Label-input association patterns showing explicit, implicit, aria-label, and aria-labelledby methods"
          caption="Four label association methods: explicit (for/id), implicit (wrapping), aria-label (string), and aria-labelledby (reference). Explicit association is the most widely supported."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessible FormField Component Pattern</h3>
        <p>
          Create a reusable FormField component using React's useId hook to generate unique IDs. The component accepts label, type, required, error, and helpText props. Generate unique IDs for the field, error message, and help text using template literals. Build aria-describedby by conditionally including error and help text IDs. The component renders a label with htmlFor pointing to the field ID, an asterisk for required fields with aria-hidden set to true, an input with id, type, required, aria-required, aria-invalid reflecting error state, and aria-describedby pointing to the description IDs. Conditionally render help text and error paragraphs with appropriate IDs and roles. Usage example shows a FormField for email address with type email, required, help text, error state, and autocomplete set to email.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Announcement Flow</h3>
        <p>
          When a form submission fails validation, the error handling flow must ensure that screen
          reader users are aware of all errors and can navigate to each one efficiently. The error
          summary pattern combined with inline error messages provides the best experience.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/accessible-forms-diagram-2.svg"
          alt="Error announcement flow showing form submission, validation failure, error summary display, and focus management"
          caption="Error handling flow: Submit → Validate → Show error summary at top → Move focus to summary → User clicks error links to jump to fields → Inline errors visible on each field."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">ErrorSummary Component Pattern</h3>
        <p>
          Create an ErrorSummary component using useRef and useEffect hooks. The component accepts an errors array. Use a ref to reference the summary div for focus management. In useEffect, when errors length is greater than zero, focus the summary element. Return null if no errors exist. Otherwise render a div with ref, role set to alert, aria-labelledby pointing to the title ID, tabIndex set to negative one for programmatic focus, and a CSS class for styling. Include an h2 heading that announces the error count (singular or plural), and an unordered list where each error is a list item containing a link that, when clicked, prevents default behavior and focuses the corresponding form field by ID.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Complete Accessible Form with Validation</h3>
        <p>
          Create a complete accessible form with validation using useState, useRef, and useCallback hooks. The form has errors state, submitted state, and an errorSummaryRef. The validate callback checks for required fields (name, email, password) and validates email format and password length. The handleSubmit handler prevents default, extracts form data, runs validation, and if errors exist, sets errors state and requests animation frame to focus the error summary. If no errors, clears errors and sets submitted to true. The handleBlur callback clears field-specific errors when the user corrects the field. When submitted is true, render a success message with role status and tabIndex negative one. Otherwise render the form with onSubmit handler and noValidate attribute. Conditionally render the ErrorSummary when errors exist. Wrap fields in a fieldset with legend. Use FormField components for each input with appropriate labels, types, required flags, error states, autocomplete values, and onBlur handlers.
        </p>
      </section>

      {/* ─── Section 4: Trade-offs & Comparisons ─── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-accent/30">
                <th className="p-3 text-left font-semibold">Aspect</th>
                <th className="p-3 text-left font-semibold">Advantages</th>
                <th className="p-3 text-left font-semibold">Disadvantages</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Explicit Label (for/id)</td>
                <td className="p-3">Most widely supported, clicking label focuses input, clear programmatic relationship</td>
                <td className="p-3">Requires generating unique IDs, slightly more markup, ID conflicts in component reuse</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">Implicit Label (wrapping)</td>
                <td className="p-3">No IDs needed, simpler markup, naturally groups label and input</td>
                <td className="p-3">Some older screen readers don&apos;t support it, harder to style label and input independently</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">On-Submit Validation</td>
                <td className="p-3">Fewer interruptions, user can review all fields first, complete error summary possible</td>
                <td className="p-3">User doesn&apos;t know about errors until submission, may need to scroll back to fix fields</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">On-Blur Validation</td>
                <td className="p-3">Immediate feedback, errors caught early, progressive disclosure of issues</td>
                <td className="p-3">Can be premature (user hasn&apos;t finished entering data), each error triggers screen reader announcement</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">On-Input Validation</td>
                <td className="p-3">Real-time feedback, instant correction guidance, good for complex format requirements</td>
                <td className="p-3">Excessive screen reader announcements, distracting, validates incomplete input, high CPU usage</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Section 5: Best Practices ─── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-2">
          <li>
            <strong>Every input must have a visible, programmatically associated label:</strong> Use
            <code>&lt;label htmlFor=&quot;id&quot;&gt;</code> as the default. Generate unique IDs
            with React&apos;s <code>useId()</code>. Placeholder text is never a substitute for a
            label.
          </li>
          <li>
            <strong>Group related controls with fieldset/legend:</strong> Radio button groups,
            checkbox groups, and address field groups should use <code>&lt;fieldset&gt;</code> and
            <code>&lt;legend&gt;</code>. This provides context that individual labels can&apos;t:
            &quot;Payment method: Credit card, radio button, 1 of 3.&quot;
          </li>
          <li>
            <strong>Associate error messages with aria-describedby:</strong> When a field has an
            error, set <code>aria-invalid=&quot;true&quot;</code> on the input and point
            <code>aria-describedby</code> to the error message element. The error is announced when
            the user focuses the field.
          </li>
          <li>
            <strong>Provide an error summary on submit:</strong> After failed submission, show a
            summary at the top of the form with links to each errored field. Move focus to the
            summary. This is the most efficient pattern for screen reader users to understand and
            fix all errors.
          </li>
          <li>
            <strong>Use autocomplete attributes:</strong> Add appropriate <code>autocomplete</code>
            values to personal information fields. This helps users with cognitive disabilities,
            motor impairments, and everyone else by reducing typing and preventing errors.
          </li>
          <li>
            <strong>Indicate required fields clearly:</strong> Use both visual (asterisk + legend)
            and programmatic (<code>required</code> attribute) indication. Explain the convention
            at the top: &quot;Fields marked with * are required.&quot;
          </li>
          <li>
            <strong>Write helpful error messages:</strong> Say what went wrong and how to fix it:
            &quot;Enter a date in DD/MM/YYYY format&quot; instead of &quot;Invalid date.&quot;
            Error messages should be specific, actionable, and associated with the failing field.
          </li>
        </ol>
      </section>

      {/* ─── Section 6: Common Pitfalls ─── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Using placeholder as the only label:</strong> Placeholders disappear when the
            user types, removing context. Screen readers may not announce placeholders consistently.
            Always provide a persistent visible label in addition to any placeholder.
          </li>
          <li>
            <strong>Error messages not associated with inputs:</strong> An error message displayed
            near a field visually but not linked via <code>aria-describedby</code> won&apos;t be
            announced when the screen reader user focuses the field. They must hunt for errors
            instead of being told directly.
          </li>
          <li>
            <strong>Missing aria-invalid on errored fields:</strong> Without
            <code>aria-invalid=&quot;true&quot;</code>, screen readers don&apos;t indicate that a
            field has an error. Users may not realize their input is rejected until they try to
            submit again.
          </li>
          <li>
            <strong>Custom select/dropdown without ARIA:</strong> Native <code>&lt;select&gt;</code>
            elements are accessible by default. Custom dropdown implementations often lack proper
            roles (<code>listbox</code>, <code>option</code>), keyboard navigation (arrow keys),
            and screen reader announcements.
          </li>
          <li>
            <strong>Overly aggressive inline validation:</strong> Validating while the user types
            can announce errors before the user has finished entering data (e.g., &quot;Email is
            invalid&quot; after typing &quot;j&quot;). Wait for blur or at least a pause in typing.
          </li>
          <li>
            <strong>Generic error messages:</strong> &quot;This field is invalid&quot; or
            &quot;Error&quot; doesn&apos;t tell the user what&apos;s wrong or how to fix it.
            Every error should describe the specific issue and the required format.
          </li>
          <li>
            <strong>Not using native form validation attributes:</strong> HTML5 attributes like
            <code>required</code>, <code>type=&quot;email&quot;</code>,
            <code>pattern</code>, <code>min</code>, <code>max</code>, and
            <code>minLength</code> provide built-in validation with accessible error messages.
            Only override with custom validation when native validation is insufficient.
          </li>
        </ul>
      </section>

      {/* ─── Section 7: Real-World Use Cases ─── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-2">
          <li>
            <strong>GOV.UK:</strong> The gold standard for accessible forms. Uses error summary
            pattern with links, inline errors with aria-describedby, clear fieldset/legend
            grouping, and highly specific error messages. Their form pattern is documented in the
            GOV.UK Design System and has been adopted by governments worldwide.
          </li>
          <li>
            <strong>Stripe Checkout:</strong> Accessible payment forms with proper label association,
            keyboard navigation between card number/expiry/CVC fields, and clear error handling.
            Demonstrates how complex form interactions (auto-advancing fields) can be made accessible.
          </li>
          <li>
            <strong>React Hook Form:</strong> Popular form library that supports accessible
            validation via <code>aria-invalid</code> and error association. The library&apos;s
            <code>register</code> function accepts validation rules and the <code>errors</code>
            object maps to accessible error display.
          </li>
          <li>
            <strong>Shopify Polaris:</strong> Their form components enforce accessibility by
            requiring label props, auto-generating IDs, and associating error/help text via
            aria-describedby — making the accessible path the easiest path.
          </li>
          <li>
            <strong>USDS (United States Digital Service):</strong> The U.S. Web Design System
            provides form components with built-in accessibility, including proper label association,
            error handling, and fieldset grouping, used across federal government websites.
          </li>
        </ul>
      </section>

      {/* ─── Section 8: Common Interview Questions ─── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What are the different ways to associate a label with a form input?</h3>
          <p>
            Four methods: (1) <strong>Explicit association</strong> — <code>&lt;label for=&quot;inputId&quot;&gt;</code>
            paired with <code>&lt;input id=&quot;inputId&quot;&gt;</code>. Most reliable. (2)
            <strong>Implicit association</strong> — wrapping the input inside the label element.
            (3) <code>aria-label</code> — a string attribute directly on the input, no visible
            label. Use only when a visible label isn&apos;t possible (icon-only search). (4)
            <code>aria-labelledby</code> — references the ID of an external element containing the
            label text. Useful when the label is complex or composed of multiple elements.
            Explicit association is preferred because it has the broadest browser and assistive
            technology support and allows clicking the label to focus the input.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How should form errors be announced to screen reader users?</h3>
          <p>
            Two complementary patterns: (1) <strong>Error summary:</strong> After submission, display
            a summary at the top with <code>role=&quot;alert&quot;</code>, listing all errors with
            links to the failing fields. Move focus to the summary via <code>focus()</code>. (2)
            <strong>Inline errors:</strong> Each field&apos;s error message linked via
            <code>aria-describedby</code>, with <code>aria-invalid=&quot;true&quot;</code> on the
            input. When the user focuses a field, they hear: &quot;Email, edit text, invalid,
            Enter an email address in the correct format.&quot; The error summary provides an
            overview; inline errors provide per-field context.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: Why shouldn&apos;t placeholder text be used as a label?</h3>
          <p>
            Five reasons: (1) Placeholders disappear when the user starts typing, removing context —
            users with cognitive disabilities may forget what the field is for. (2) Placeholder text
            typically has low contrast (gray on white), failing WCAG contrast requirements. (3)
            Screen readers inconsistently announce placeholder text — some read it, some don&apos;t.
            (4) Placeholders aren&apos;t exposed as the accessible name in all browser/screen reader
            combinations. (5) Users may mistake placeholder text for pre-filled data and skip the
            field. Always use a persistent visible <code>&lt;label&gt;</code>. Placeholders can
            supplement labels with examples (e.g., &quot;e.g., john@example.com&quot;) but never
            replace them.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: When should you use fieldset/legend vs. individual labels?</h3>
          <p>
            Use <code>&lt;fieldset&gt;</code>/<code>&lt;legend&gt;</code> when a group of controls
            shares context that individual labels can&apos;t convey. Key scenarios: (1) Radio button
            groups — the question is the legend, options are individual labels. (2) Checkbox groups —
            &quot;Select your preferences&quot; legend with individual checkboxes. (3) Related fields
            like address (street, city, zip sharing &quot;Shipping address&quot; context). Without
            fieldset/legend, a screen reader user hearing &quot;Street, edit text&quot; doesn&apos;t
            know if it&apos;s shipping or billing. With it, they hear &quot;Shipping address, Street,
            edit text.&quot; Don&apos;t overuse — wrapping every single field in a fieldset adds
            verbosity without value.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you design an accessible multi-step form (wizard)?</h3>
          <p>
            Key considerations: (1) <strong>Progress indication:</strong> Use
            <code>aria-current=&quot;step&quot;</code> on the active step indicator and provide
            &quot;Step 2 of 4&quot; text. (2) <strong>Focus management:</strong> On each step
            transition, move focus to the step heading or first form field. (3)
            <strong>Step validation:</strong> Validate the current step before allowing progression.
            Show errors inline with aria-describedby. (4) <strong>Back navigation:</strong> Preserve
            entered data when going back. (5) <strong>Review step:</strong> Allow users to review
            all entered data before final submission. (6) <strong>Keyboard navigation:</strong>
            Previous/Next buttons should be keyboard accessible. Don&apos;t auto-advance on the
            last field. (7) <strong>Live region:</strong> Announce step changes with aria-live for
            screen readers who might miss the visual transition.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the autocomplete attribute and why is it important for accessibility?</h3>
          <p>
            The <code>autocomplete</code> attribute tells browsers the semantic type of form data
            expected (e.g., <code>autocomplete=&quot;email&quot;</code>,
            <code>autocomplete=&quot;cc-number&quot;</code>). WCAG 1.3.5 (Level AA) requires it on
            fields collecting personal information. Accessibility benefits: (1) Users with motor
            disabilities avoid retyping information. (2) Users with cognitive disabilities benefit
            from auto-populated fields reducing memory burden. (3) Assistive technology can
            present personal data managers for quick form filling. (4) WCAG 2.2&apos;s 3.3.7
            (Redundant Entry) builds on this — previously entered data should be auto-populated
            or selectable, and autocomplete is the primary mechanism for achieving this.
          </p>
        </div>
      </section>

      {/* ─── Section 9: References & Further Reading ─── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/tutorials/forms/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              W3C WAI: Forms Tutorial
            </a>{" "}
            — Comprehensive guide to building accessible forms.
          </li>
          <li>
            <a href="https://design-system.service.gov.uk/patterns/validation/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              GOV.UK: Form Validation Pattern
            </a>{" "}
            — The error summary and inline error pattern used by GOV.UK.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 3.3.2: Labels or Instructions
            </a>{" "}
            — Requirements for form labeling.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: HTML autocomplete attribute
            </a>{" "}
            — Complete list of autocomplete values and usage.
          </li>
          <li>
            <a href="https://adrianroselli.com/2019/02/avoid-default-field-validation.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Adrian Roselli: Avoid Default Field Validation
            </a>{" "}
            — Why custom validation often provides a better accessible experience.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
