"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-aria-attributes-extensive",
  title: "ARIA Attributes",
  description: "Comprehensive guide to WAI-ARIA attributes: roles, states, properties, live regions, and production patterns for building accessible web applications at scale.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "aria-attributes",
  version: "extensive",
  wordCount: 7200,
  readingTime: 29,
  lastUpdated: "2026-03-21",
  tags: ["accessibility", "aria", "a11y", "wai-aria", "screen-readers"],
  relatedTopics: ["semantic-html", "screen-reader-support", "focus-management"],
};

export default function AriaAttributesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─────────────────── 1. Definition & Context ─────────────────── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>WAI-ARIA</strong> (Web Accessibility Initiative &ndash; Accessible Rich Internet Applications) is a W3C
          specification that defines a set of HTML attributes you can add to elements to supplement native semantics.
          ARIA attributes bridge the gap between what a browser&apos;s accessibility tree exposes and what modern
          JavaScript-driven interfaces actually do. They let assistive technologies&mdash;primarily screen readers&mdash;understand
          custom widgets, dynamic content updates, and complex interaction patterns that go far beyond standard form controls.
        </p>
        <p>
          The specification was born from a practical problem: HTML4 had a limited vocabulary of interactive elements
          (&lt;input&gt;, &lt;select&gt;, &lt;a&gt;, &lt;button&gt;). As single-page applications, rich text editors, drag-and-drop
          builders, and real-time dashboards proliferated, developers built custom controls with &lt;div&gt; and &lt;span&gt;
          elements. These custom controls were visually functional but semantically empty&mdash;invisible to screen readers,
          keyboard-only users, and voice-control software. WAI-ARIA 1.0 reached W3C Recommendation status in 2014,
          with WAI-ARIA 1.1 following in 2017 and WAI-ARIA 1.2 in 2023, each expanding the role and property vocabulary.
        </p>
        <p>
          For staff and principal engineers, ARIA proficiency goes beyond knowing individual attributes. It means understanding
          the accessibility tree as a parallel DOM, knowing when ARIA is the correct tool versus when native HTML suffices,
          designing component APIs that enforce accessibility contracts, and establishing team-wide testing strategies that
          prevent ARIA misuse. ARIA is not a checkbox to pass an audit; it is an architectural concern that affects component
          design, state management, routing, focus management, and even build tooling.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">The First Rule of ARIA</h3>
          <p>
            &quot;If you can use a native HTML element or attribute with the semantics and behavior you require already
            built in, instead of re-purposing an element and adding an ARIA role, state, or property to make it accessible,
            then do so.&quot; &mdash; W3C WAI-ARIA Authoring Practices. Native elements carry implicit roles, keyboard handling,
            and focus management for free. ARIA should be used to augment, not replace, HTML semantics. Using ARIA on a
            &lt;div&gt; to mimic a &lt;button&gt; means you must also manually implement keyboard support (Enter and Space),
            focus management, and the pointer cursor&mdash;all of which &lt;button&gt; provides natively.
          </p>
        </div>

        <p>
          The five rules of ARIA use, as outlined by the W3C, are essential context for any ARIA discussion:
        </p>
        <ol className="space-y-2">
          <li><strong>Rule 1:</strong> Use native HTML when possible. If a native element provides the semantics, use it.</li>
          <li><strong>Rule 2:</strong> Do not change native semantics unless you really have to. Adding role=&quot;heading&quot; to a &lt;h2&gt; is redundant and can confuse assistive technologies.</li>
          <li><strong>Rule 3:</strong> All interactive ARIA controls must be usable with the keyboard. A role=&quot;button&quot; that is not focusable or does not respond to Enter/Space is worse than no role at all.</li>
          <li><strong>Rule 4:</strong> Do not use role=&quot;presentation&quot; or aria-hidden=&quot;true&quot; on a focusable element. This creates a keyboard trap&mdash;the user can tab to it but the screen reader announces nothing.</li>
          <li><strong>Rule 5:</strong> All interactive elements must have an accessible name. A button with no text content and no aria-label is invisible to screen reader users.</li>
        </ol>
      </section>

      {/* ─────────────────── 2. Core Concepts ─────────────────── */}
      <section>
        <h2>Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Roles</h3>
        <p>
          An ARIA role defines what an element <em>is</em> to assistive technology. Roles fall into four categories:
          <strong> widget roles</strong> (button, checkbox, slider, tab, dialog), <strong>document structure roles</strong>
          (heading, list, table, toolbar), <strong>landmark roles</strong> (banner, navigation, main, complementary,
          contentinfo), and <strong>live region roles</strong> (alert, status, log, timer). Once a role is set, it overrides
          the element&apos;s implicit role in the accessibility tree. A &lt;div role=&quot;button&quot;&gt; will be announced
          as &quot;button&quot; rather than as a generic container.
        </p>
        <p>
          Roles are <strong>not inherited</strong> by children (except for certain required owned elements) and they
          are <strong>immutable once set</strong>&mdash;you should not dynamically change a role via JavaScript during the
          element&apos;s lifecycle. Doing so can crash or confuse screen readers. If you need a different role, render a
          different element or component.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">States vs. Properties</h3>
        <p>
          ARIA distinguishes between <strong>states</strong> and <strong>properties</strong>. Both use the same
          aria-* attribute syntax, but they differ in volatility:
        </p>
        <ul className="space-y-2">
          <li><strong>States</strong> change frequently during interaction. Examples: aria-expanded (true/false as an accordion opens/closes), aria-checked (checkbox toggle), aria-selected (list item selection), aria-disabled (dynamic enabling/disabling), aria-pressed (toggle button). These must be updated in response to user actions.</li>
          <li><strong>Properties</strong> are set once (or rarely change). Examples: aria-label, aria-labelledby, aria-describedby, aria-haspopup, aria-controls, aria-owns, aria-required. These describe structural relationships or naming that typically remain constant.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-label and aria-labelledby</h3>
        <p>
          These are the two primary mechanisms for providing an <strong>accessible name</strong> to an element.
          Every interactive element must have one. The accessible name computation algorithm (defined in the Accessible
          Name and Description Computation specification) follows a priority order:
        </p>
        <ol className="space-y-2">
          <li><strong>aria-labelledby</strong> &mdash; References one or more element IDs whose text content becomes the accessible name. Takes highest priority. Can concatenate multiple labels. Useful when the label is already visible on screen.</li>
          <li><strong>aria-label</strong> &mdash; A string attribute directly on the element. Used when there is no visible label text. Overrides the element&apos;s text content for naming purposes.</li>
          <li><strong>Native label mechanisms</strong> &mdash; &lt;label for=&quot;...&quot;&gt;, alt text on images, text content of &lt;button&gt; elements.</li>
          <li><strong>title attribute</strong> &mdash; Lowest priority and not recommended as the sole accessible name because it is not consistently exposed by all assistive technology.</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-label and aria-labelledby Examples</h3>
        <p>
          For aria-labelledby referencing visible text, use a heading with an ID and reference it from a form. For aria-label when no visible label exists, use it on icon-only buttons like a close dialog button with an X icon. For multiple IDs, a progressbar can reference both a label span and a filename span, causing the screen reader to announce something like &quot;Uploading: report.pdf, progress bar, 65 percent&quot;.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-describedby</h3>
        <p>
          While aria-label and aria-labelledby define the <strong>name</strong> of an element, aria-describedby provides
          supplemental <strong>description</strong>. It references element IDs whose text content is announced after the
          accessible name, typically with a brief pause. This is ideal for help text, format hints, error messages, and
          constraint descriptions. For example, a password input can reference both a hint paragraph describing requirements and an error paragraph that appears conditionally when validation fails. The screen reader announces the password field, then the hint about minimum character requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-live Regions</h3>
        <p>
          The aria-live attribute creates a &quot;live region&quot;&mdash;a section of the page that, when its content changes,
          is automatically announced by screen readers without the user needing to navigate to it. This is critical
          for dynamic applications: chat messages arriving, form validation feedback, real-time data updates, toast
          notifications, and progress indicators.
        </p>
        <p>
          There are two politeness values:
        </p>
        <ul className="space-y-2">
          <li><strong>polite</strong> &mdash; The screen reader waits until the current speech is finished before announcing the change. Use this for non-urgent updates: search result counts, status messages, chat messages.</li>
          <li><strong>assertive</strong> &mdash; The screen reader interrupts whatever it is currently saying to announce the change immediately. Reserve for critical information: error alerts, session timeout warnings, connection loss.</li>
        </ul>
        <p>
          Two companion attributes refine live region behavior:
        </p>
        <ul className="space-y-2">
          <li><strong>aria-atomic</strong> &mdash; When true, the entire region is re-announced on any change (not just the changed node). Useful for a clock display or a score counter where partial reads are confusing.</li>
          <li><strong>aria-relevant</strong> &mdash; Specifies which types of mutations trigger announcements: &quot;additions&quot;, &quot;removals&quot;, &quot;text&quot;, or &quot;all&quot;. Default is &quot;additions text&quot;.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-live Regions Examples</h3>
        <p>
          For polite live regions, use them for search results that announce the count when results update. The container should have aria-live set to polite and aria-atomic set to true so the entire count is re-announced. For assertive live regions, use them for critical errors like session expiration warnings that need immediate user attention. A session warning component might show a countdown and an extend session button, with role set to alert and aria-live set to assertive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-hidden</h3>
        <p>
          Setting aria-hidden=&quot;true&quot; on an element removes it and all its descendants from the accessibility tree
          while keeping it visible on screen. This is the correct approach for decorative icons, duplicate content, and
          off-screen elements that should not confuse screen reader users. The critical rule: <strong>never apply
          aria-hidden=&quot;true&quot; to a focusable element</strong>. If a user can tab to something, it must be announced.
        </p>
        <p>
          For decorative icons, use aria-hidden set to true and focusable set to false on SVG elements inside buttons. For the modal pattern, hide background content by setting aria-hidden on the main app root when the modal is open, while the modal dialog has role set to dialog, aria-modal set to true, and aria-labelledby referencing the modal title.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-expanded, aria-controls, and aria-haspopup</h3>
        <p>
          These three attributes work together to describe disclosure and popup patterns. aria-expanded communicates whether
          a collapsible section is open or closed. aria-controls references the ID of the element that is being
          controlled. aria-haspopup indicates that activating the element reveals a popup (menu, listbox, tree, grid, or dialog).
        </p>
        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-expanded, aria-controls, and aria-haspopup Examples</h3>
        <p>
          For accordion patterns, use a button with aria-expanded reflecting the open state, aria-controls referencing the panel ID, and an onClick handler that toggles the state. The panel has an ID matching the aria-controls value, role set to region, and hidden attribute reflecting the closed state. For dropdown menus, use a button with aria-haspopup set to menu, aria-expanded reflecting menu open state, and aria-controls referencing the menu list ID. The menu is an unordered list with role set to menu, hidden when closed, containing list items with role set to menuitem.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">aria-current</h3>
        <p>
          The aria-current attribute indicates the current item within a set. It accepts values like &quot;page&quot; (current page
          in navigation), &quot;step&quot; (current step in a wizard), &quot;location&quot; (current location in a breadcrumb),
          &quot;date&quot; (current date in a calendar), and &quot;true&quot; (generic current item). This is often overlooked
          but is invaluable for navigation patterns. For navigation links, create a NavLink component that accepts href, children, and isActive props, then set aria-current to page when isActive is true, or undefined when inactive.
        </p>
      </section>

      {/* ─────────────────── 3. Architecture & Flow ─────────────────── */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding how ARIA attributes flow from your code through the browser to assistive technology is essential
          for debugging accessibility issues and designing robust component APIs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ARIA Role Taxonomy</h3>
        <p>
          The WAI-ARIA specification organizes roles into four distinct categories, each serving a different purpose
          in conveying semantic meaning to assistive technologies. Widget roles describe interactive controls, document
          structure roles organize content, landmark roles enable page-level navigation, and live region roles handle
          dynamic content announcements.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/aria-attributes-diagram-1.svg"
          alt="ARIA role taxonomy showing four categories: widget roles, document structure roles, landmark roles, and live region roles with examples under each"
          caption="Figure 1: The four categories of WAI-ARIA roles. Widget roles describe interactive controls; document structure roles organize content; landmark roles enable skip-navigation; live region roles handle dynamic announcements."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Live Region Update Flow</h3>
        <p>
          When JavaScript mutates the content of an element marked with aria-live, the browser detects the DOM change,
          translates it into a platform accessibility event, and forwards it to the screen reader. The politeness level
          determines whether the announcement interrupts (assertive) or queues (polite). Understanding this flow is
          critical because race conditions, rapid re-renders, and improper region setup are the most common causes
          of &quot;silent&quot; live regions.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/aria-attributes-diagram-2.svg"
          alt="aria-live region update flow showing how DOM mutations propagate through the browser accessibility tree, platform API, and screen reader with polite vs assertive comparison"
          caption="Figure 2: The four-step flow of an aria-live region update: DOM mutation, browser detection, platform API notification, and screen reader announcement. Polite queues after current speech; assertive interrupts immediately."
        />
        <p>
          A common React pitfall with live regions: the container must exist in the DOM <em>before</em> the content changes.
          If you conditionally render the container and the content simultaneously, screen readers may miss the announcement
          because they only observe mutations within regions that are already tracked. Always render the live region container
          in the initial render and update its content dynamically. The wrong approach is conditionally rendering the alert div only when there is an error. The correct approach is to always have the div with role alert and aria-live assertive present, updating only its text content. An alternative is to use a visually-hidden persistent region with class sr-only, role status, aria-live polite, and aria-atomic true for non-urgent status messages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ARIA Decision Tree</h3>
        <p>
          Before adding any ARIA attribute, walk through a decision tree: Can native HTML solve this? If not, does the
          element need a label? Does it have toggle state? Does its content update dynamically? Each answer points you
          toward the correct attribute.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/aria-attributes-diagram-3.svg"
          alt="ARIA states and properties decision tree flowchart showing decision points for native HTML, labeling, toggle states, and dynamic content"
          caption="Figure 3: Decision tree for selecting ARIA attributes. Always start with native HTML; only add ARIA when the semantic gap cannot be closed otherwise."
        />
      </section>

      {/* ─────────────────── 4. Trade-offs & Comparisons ─────────────────── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <p>
          A central tension in accessibility engineering is deciding when native HTML semantics are sufficient and when
          ARIA is necessary. Overusing ARIA is as problematic as underusing it&mdash;redundant ARIA can introduce
          conflicting semantics, increase maintenance burden, and actively harm users when attributes become stale.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="py-2">Aspect</th>
                <th className="py-2">Native HTML</th>
                <th className="py-2">ARIA Attributes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Keyboard support</td>
                <td className="py-2">Built-in (button, a, input all receive focus and respond to keyboard)</td>
                <td className="py-2">Must be manually implemented with tabindex, onKeyDown handlers</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Accessible name</td>
                <td className="py-2">Derived from text content, &lt;label&gt;, alt attribute</td>
                <td className="py-2">Requires explicit aria-label or aria-labelledby</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">State management</td>
                <td className="py-2">Automatic (checked, disabled, required map to accessibility tree)</td>
                <td className="py-2">Manual updates needed (aria-checked, aria-disabled must be synced with visual state)</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Browser support</td>
                <td className="py-2">Universal, decades of optimization</td>
                <td className="py-2">Varies by role/attribute; some combinations have screen reader bugs</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Maintenance burden</td>
                <td className="py-2">Low&mdash;semantics are inherent</td>
                <td className="py-2">High&mdash;attributes can drift from visual state during refactors</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Custom widget support</td>
                <td className="py-2">Limited to native elements&apos; built-in behavior</td>
                <td className="py-2">Full flexibility: combobox, tree, grid, tabbed interface patterns</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Live announcements</td>
                <td className="py-2">No native mechanism for dynamic content announcements</td>
                <td className="py-2">aria-live, role=&quot;alert&quot;, role=&quot;status&quot; provide announcement control</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Testing complexity</td>
                <td className="py-2">Standard testing tools handle natively</td>
                <td className="py-2">Requires axe-core, ARIA-specific assertions, screen reader testing</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          The practical guideline: use native HTML as the foundation, augment with ARIA only where gaps exist, and
          always test with actual screen readers (NVDA, JAWS, VoiceOver) rather than relying solely on automated tools.
          Automated testing catches roughly 30-40% of accessibility issues; the rest require manual and assistive
          technology testing.
        </p>
      </section>

      {/* ─────────────────── 5. Best Practices ─────────────────── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-2">
          <li>
            <strong>Start with native HTML.</strong> Use &lt;button&gt;, &lt;input&gt;, &lt;select&gt;, &lt;details&gt;, &lt;dialog&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;header&gt;, and &lt;footer&gt; before considering ARIA. These elements carry implicit roles, keyboard behavior, and state management.
          </li>
          <li>
            <strong>One accessible name per interactive element.</strong> Every button, link, input, and custom widget must have a programmatically determined name. Audit with the browser&apos;s Accessibility Inspector to verify the computed accessible name.
          </li>
          <li>
            <strong>Keep aria-live regions persistent.</strong> Mount the live region container on initial render. Only change its text content. Removing and re-adding the container causes screen readers to lose track of it.
          </li>
          <li>
            <strong>Sync ARIA states with visual states.</strong> If aria-expanded=&quot;true&quot;, the panel must be visible. If aria-disabled=&quot;true&quot;, the control must look and behave as disabled. Divergence between ARIA state and visual state is a critical accessibility defect.
          </li>
          <li>
            <strong>Prefer aria-labelledby over aria-label.</strong> aria-labelledby references visible text, which keeps the label in sync with what sighted users see. aria-label creates an invisible label that can easily become stale during refactors.
          </li>
          <li>
            <strong>Use aria-describedby for supplemental information.</strong> Error messages, help text, format hints, and character count displays are descriptions, not names. Wire them with aria-describedby so screen readers announce them in context.
          </li>
          <li>
            <strong>Test with at least two screen readers.</strong> NVDA + Chrome on Windows and VoiceOver + Safari on macOS cover the majority of screen reader users. JAWS + Chrome is also important for enterprise environments. Each screen reader interprets ARIA slightly differently.
          </li>
          <li>
            <strong>Encapsulate ARIA logic in reusable components.</strong> Build an AccordionPanel component that manages aria-expanded, aria-controls, and keyboard navigation internally. Application developers should get accessibility for free when they use the design system.
          </li>
          <li>
            <strong>Integrate automated ARIA testing in CI.</strong> Use axe-core, eslint-plugin-jsx-a11y, and jest-axe to catch regressions. Flag missing accessible names, invalid role/attribute combinations, and orphaned aria-controls references before code reaches production.
          </li>
          <li>
            <strong>Document ARIA contracts in component APIs.</strong> When a component requires the consumer to provide an accessible name (e.g., an icon button), make aria-label a required prop or throw a development-mode warning if it is missing.
          </li>
        </ol>
      </section>

      {/* ─────────────────── 6. Common Pitfalls ─────────────────── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Redundant ARIA on native elements.</strong> Adding role=&quot;button&quot; to a &lt;button&gt; or role=&quot;link&quot; to an &lt;a&gt; is unnecessary and adds noise. Worse, adding role=&quot;heading&quot; to a &lt;div&gt; that already has an &lt;h2&gt; inside it can produce double announcements.
          </li>
          <li>
            <strong>aria-label on non-interactive elements.</strong> Screen readers generally ignore aria-label on &lt;div&gt; and &lt;span&gt; unless the element also has a role. Adding aria-label to a generic container does nothing for most users and can give a false sense of accessibility.
          </li>
          <li>
            <strong>Stale aria-controls references.</strong> When the controlled element is conditionally rendered, the ID referenced by aria-controls may not exist in the DOM, creating a broken reference. Some screen readers handle this gracefully; others produce errors.
          </li>
          <li>
            <strong>Using aria-live=&quot;assertive&quot; for routine updates.</strong> Overusing assertive interrupts the user&apos;s reading flow. A search result count update should be polite; only validation errors, session timeouts, and critical alerts warrant assertive.
          </li>
          <li>
            <strong>Conditionally rendering the live region container.</strong> If the &lt;div role=&quot;alert&quot;&gt; is not in the DOM when the page loads, screen readers may not track it. Always keep the container mounted and change only its text content.
          </li>
          <li>
            <strong>Forgetting keyboard support when using roles.</strong> Adding role=&quot;tab&quot; to a &lt;div&gt; without implementing arrow key navigation, Home/End, and focus management violates the WAI-ARIA Authoring Practices and creates a broken experience for keyboard users.
          </li>
          <li>
            <strong>aria-hidden on focusable elements.</strong> If a user can tab to an element that has aria-hidden=&quot;true&quot;, the screen reader says nothing&mdash;the user is lost. Either remove aria-hidden or add tabindex=&quot;-1&quot; and remove it from the tab order.
          </li>
          <li>
            <strong>Conflicting roles and states.</strong> Setting role=&quot;checkbox&quot; without aria-checked, or aria-expanded without a disclosure trigger, leaves the accessibility tree in an inconsistent state. ARIA attributes must form a complete, valid contract.
          </li>
          <li>
            <strong>Not testing after React re-renders.</strong> React&apos;s virtual DOM reconciliation can cause ARIA state to temporarily desync with the visual UI. Test that after rapid state changes (debounced inputs, optimistic updates), the ARIA attributes reflect the final visual state.
          </li>
        </ul>
      </section>

      {/* ─────────────────── 7. Real-World Use Cases ─────────────────── */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GOV.UK Design System</h3>
        <p>
          The UK government&apos;s design system is one of the most thoroughly accessibility-tested component libraries in the
          world. Every component ships with exhaustive ARIA attributes tested across JAWS, NVDA, and VoiceOver. Their
          accordion component uses aria-expanded, aria-controls, and section role=&quot;region&quot; with aria-labelledby
          to create a fully accessible disclosure pattern. They document expected screen reader announcements for every
          interaction state, treating these as acceptance criteria.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Slack</h3>
        <p>
          Slack&apos;s web application uses extensive aria-live regions for real-time message delivery. New messages in the
          active channel are announced via polite live regions, while direct messages and mentions use assertive
          announcements. They implement a custom screen reader mode that serializes message content to avoid overwhelming
          users in high-traffic channels. Their combobox pattern for the channel switcher (Cmd+K) follows the ARIA combobox
          1.2 pattern with aria-activedescendant for virtual focus management.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adobe Spectrum</h3>
        <p>
          Adobe&apos;s React Spectrum library (react-aria) is an industry-leading example of ARIA done right at scale. They
          build headless hooks (useButton, useComboBox, useListBox, useDialog) that encapsulate all ARIA roles, states,
          and keyboard interactions. Consumers get accessibility without needing to understand ARIA internals. Their
          approach separates behavior (ARIA + keyboard) from presentation (CSS), enabling accessible components across
          any design system.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Airbnb</h3>
        <p>
          Airbnb&apos;s date picker uses aria-selected to indicate the chosen dates, aria-disabled for unavailable dates,
          and aria-live polite regions to announce the currently focused date and selected range. Their search
          autocomplete implements the combobox pattern with aria-activedescendant, allowing screen reader users to
          navigate suggestions with arrow keys while the input retains focus. They run axe-core in CI/CD and conduct
          quarterly manual screen reader audits.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe Dashboard</h3>
        <p>
          Stripe uses aria-describedby extensively in their payment forms to associate inline validation messages, help
          text, and formatting hints with inputs. Their data tables use role=&quot;grid&quot; with aria-sort, aria-colindex,
          and aria-rowcount to make large financial datasets navigable with screen readers. They provide keyboard
          shortcuts for common actions and announce them via aria-live when keyboard-shortcut help is activated.
        </p>
      </section>

      {/* ─────────────────── 8. References & Further Reading ─────────────────── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              WAI-ARIA 1.2 Specification (W3C Recommendation)
            </a>
            &mdash; The definitive specification for all ARIA roles, states, and properties.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              ARIA Authoring Practices Guide (APG)
            </a>
            &mdash; Pattern-by-pattern implementation guides for accordions, carousels, comboboxes, dialogs, grids, menus, tabs, and more.
          </li>
          <li>
            <a href="https://www.w3.org/TR/accname-1.2/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Accessible Name and Description Computation 1.2
            </a>
            &mdash; How browsers compute the accessible name from aria-label, aria-labelledby, native labels, and text content.
          </li>
          <li>
            <a href="https://react-spectrum.adobe.com/react-aria/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              React Aria by Adobe
            </a>
            &mdash; Production-grade React hooks that implement ARIA patterns with full keyboard and screen reader support.
          </li>
          <li>
            <a href="https://www.deque.com/axe/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              axe-core by Deque Systems
            </a>
            &mdash; The most widely used automated accessibility testing engine, supporting ARIA validation rules.
          </li>
          <li>
            <a href="https://a11ysupport.io/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Accessibility Support (a11ysupport.io)
            </a>
            &mdash; Community-driven database of screen reader support for ARIA roles and attributes across browser/AT combinations.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN ARIA Documentation
            </a>
            &mdash; Practical guides and reference documentation for every ARIA role and attribute.
          </li>
        </ul>
      </section>

      {/* ─────────────────── 9. Common Interview Questions ─────────────────── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the first rule of ARIA, and why does it matter?</h3>
          <p>
            The first rule states: &quot;If you can use a native HTML element or attribute with the semantics and behavior
            you require already built in, do so.&quot; This matters because native elements (&lt;button&gt;, &lt;input&gt;,
            &lt;select&gt;, &lt;nav&gt;) provide implicit roles, built-in keyboard handling, and automatic state
            management (checked, disabled, required). When you use ARIA to recreate what native HTML already provides,
            you take on full responsibility for keyboard support, state synchronization, and cross-screen-reader
            testing. ARIA supplements HTML; it should not replace it. The cost of getting ARIA wrong (broken keyboard
            access, silent elements, conflicting semantics) often outweighs the benefit of custom styling.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: Explain the difference between aria-label, aria-labelledby, and aria-describedby.</h3>
          <p>
            <strong>aria-label</strong> is a string attribute that directly provides the accessible name when no visible
            label exists (e.g., an icon-only close button). <strong>aria-labelledby</strong> references one or more
            element IDs whose text content becomes the accessible name, and it takes highest priority in the accessible
            name computation algorithm. It is preferred when a visible label exists because it stays in sync with what
            sighted users see. <strong>aria-describedby</strong> provides supplemental information announced after the
            accessible name (e.g., help text, error messages, format hints). In the screen reader output, the name comes
            first (&quot;Password, edit text&quot;), followed by a pause and the description (&quot;Must be at least 12
            characters&quot;). A common mistake is using aria-label when aria-labelledby would be more maintainable.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do aria-live regions work, and what are the pitfalls in React?</h3>
          <p>
            aria-live regions enable screen readers to announce dynamic content changes without requiring the user to
            navigate to the changed element. When content inside an aria-live region changes, the browser detects the
            DOM mutation, sends an accessibility event through the OS platform API, and the screen reader announces
            the new content. &quot;polite&quot; waits for the current speech to finish; &quot;assertive&quot; interrupts
            immediately. In React, the most common pitfall is conditionally rendering the live region container alongside
            its content. If both appear simultaneously, screen readers may not track the new region. The fix is to mount
            the container on initial render with empty content and then update the text content reactively. Another
            pitfall: rapid state changes can cause multiple announcements. Use debouncing or a queue to batch updates.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: When should you use aria-hidden=&quot;true&quot;, and what are the dangers?</h3>
          <p>
            Use aria-hidden=&quot;true&quot; to remove decorative or redundant content from the accessibility tree:
            decorative icons next to text labels, background images, duplicate content for visual layout, and off-screen
            content that should not be read. The critical danger is applying aria-hidden=&quot;true&quot; to a focusable
            element. If a user can tab to it, the screen reader says nothing&mdash;the user is effectively lost. The
            modal pattern is the canonical safe use: set aria-hidden=&quot;true&quot; on the main app root when a modal
            is open so screen readers only see the modal content. When the modal closes, remove aria-hidden. Also be
            cautious with aria-hidden on containers: it removes all descendants from the accessibility tree, including
            focusable children.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you design an accessible combobox (autocomplete) in React?</h3>
          <p>
            A combobox requires the following ARIA contract: the input has role=&quot;combobox&quot;, aria-expanded
            (true when suggestions are visible), aria-controls referencing the listbox ID, aria-autocomplete=&quot;list&quot;
            or &quot;both&quot;, and aria-activedescendant set to the ID of the currently highlighted option. The popup has
            role=&quot;listbox&quot; with role=&quot;option&quot; on each suggestion. Keyboard: arrow keys move
            aria-activedescendant (virtual focus stays on the input), Enter selects, Escape closes. A polite live region
            announces the number of matches. The critical architectural decision is using aria-activedescendant (virtual
            focus) rather than moving real DOM focus to each option, because the user must be able to continue typing in
            the input. Adobe&apos;s react-aria useComboBox hook is the gold standard implementation.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you test ARIA attributes effectively in a CI/CD pipeline?</h3>
          <p>
            A robust testing strategy has three layers. <strong>Static analysis:</strong> eslint-plugin-jsx-a11y catches
            missing alt text, invalid roles, missing accessible names, and aria-hidden on focusable elements during
            development. <strong>Automated runtime testing:</strong> axe-core (via jest-axe or @axe-core/playwright)
            runs after component rendering to detect invalid ARIA attribute values, orphaned references, color contrast
            violations, and required child role violations. <strong>Integration testing:</strong> Testing Library&apos;s
            getByRole queries verify that components expose the correct roles and accessible names. For live regions,
            assert that the DOM structure is correct rather than testing the actual screen reader output (which requires
            manual testing). In CI, fail the build on any axe violation. Complement with quarterly manual screen reader
            audits using NVDA + Chrome and VoiceOver + Safari to catch the 60-70% of issues that automated tools miss.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
