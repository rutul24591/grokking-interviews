"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-semantic-html-extensive",
  title: "Semantic HTML",
  description: "Comprehensive guide to semantic HTML for accessibility: landmark elements, document outlines, implicit ARIA roles, assistive technology interoperability, and production strategies for building inclusively at scale.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "semantic-html",
  version: "extensive",
  wordCount: 7200,
  readingTime: 29,
  lastUpdated: "2026-03-21",
  tags: ["accessibility", "semantic-html", "a11y", "html5", "landmarks"],
  relatedTopics: ["aria-attributes", "screen-reader-support", "wcag-guidelines"],
};

export default function SemanticHTMLArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: DEFINITION & CONTEXT
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Semantic HTML</strong> is the practice of using HTML elements that convey meaning about the
          structure, purpose, and relationships of content rather than relying on generic containers styled
          with CSS. Where a <code className="text-sm">&lt;div&gt;</code> or <code className="text-sm">&lt;span&gt;</code> communicates
          nothing about the nature of its contents, elements like <code className="text-sm">&lt;nav&gt;</code>,{" "}
          <code className="text-sm">&lt;article&gt;</code>, <code className="text-sm">&lt;main&gt;</code>, and{" "}
          <code className="text-sm">&lt;figure&gt;</code> carry intrinsic semantics that browsers, search engine
          crawlers, assistive technologies, and other automated consumers can parse without understanding CSS
          classes or JavaScript behavior.
        </p>
        <p>
          The idea of semantic markup predates HTML5. Early HTML (versions 1 through 4) had limited structural
          elements&mdash;headings (<code className="text-sm">&lt;h1&gt;</code>&ndash;<code className="text-sm">&lt;h6&gt;</code>),
          paragraphs, lists, and tables were the primary vehicles for conveying document structure. Developers
          relied heavily on <code className="text-sm">&lt;div&gt;</code> nesting for layout, leading to the
          &quot;div soup&quot; anti-pattern: deeply nested trees of meaningless containers that were opaque to
          any tool except the developer&apos;s own CSS. HTML5, released as a W3C Recommendation in 2014 and
          refined through the WHATWG Living Standard, introduced a rich set of structural elements&mdash;
          <code className="text-sm">&lt;header&gt;</code>, <code className="text-sm">&lt;footer&gt;</code>,{" "}
          <code className="text-sm">&lt;nav&gt;</code>, <code className="text-sm">&lt;main&gt;</code>,{" "}
          <code className="text-sm">&lt;section&gt;</code>, <code className="text-sm">&lt;article&gt;</code>,{" "}
          <code className="text-sm">&lt;aside&gt;</code>, <code className="text-sm">&lt;figure&gt;</code>,{" "}
          <code className="text-sm">&lt;figcaption&gt;</code>, <code className="text-sm">&lt;details&gt;</code>,{" "}
          <code className="text-sm">&lt;summary&gt;</code>, <code className="text-sm">&lt;time&gt;</code>,{" "}
          <code className="text-sm">&lt;mark&gt;</code>, and others&mdash;designed to close this gap.
        </p>
        <p>
          <strong>Why this matters for staff/principal engineers:</strong> Semantic HTML is the foundation of the
          accessibility stack. ARIA (Accessible Rich Internet Applications) exists to fill gaps where HTML semantics
          fall short, but the first rule of ARIA is &quot;don&apos;t use ARIA if a native HTML element provides the
          semantics you need.&quot; Getting semantics right at the HTML layer eliminates entire categories of
          accessibility defects, reduces the surface area for ARIA misuse (which is itself a leading cause of
          accessibility regressions), and produces markup that is more robust across browsers, more portable for
          content syndication, and more favorable for search engine indexing. At scale, the decision to enforce
          semantic HTML in a design system or component library has compounding effects: every component that ships
          with correct semantics reduces the cognitive burden on product engineers who would otherwise need to
          remember to add ARIA attributes manually.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: The First Rule of ARIA</h3>
          <p>
            The W3C WAI-ARIA authoring practices explicitly state: &quot;If you can use a native HTML element or
            attribute with the semantics and behavior you require already built in, instead of re-purposing an
            element and adding an ARIA role, state, or property to make it accessible, then do so.&quot; Every{" "}
            <code className="text-sm">&lt;div role=&quot;button&quot; tabindex=&quot;0&quot; onkeydown=&quot;...&quot;&gt;</code>{" "}
            that could have been a <code className="text-sm">&lt;button&gt;</code> is a maintenance liability,
            an accessibility risk, and a signal of technical debt. Semantic HTML is not a nice-to-have&mdash;it is
            the lowest-cost, highest-impact accessibility investment available.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: CORE CONCEPTS
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Semantic HTML elements can be grouped into several functional categories. Understanding these categories
          helps engineers select the right element for a given purpose and reason about the accessibility tree that
          the browser constructs from the DOM.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sectioning &amp; Landmark Elements</h3>
        <p>
          These elements define the high-level regions of a page. Assistive technologies expose them as
          &quot;landmarks&quot; that users can jump to directly, bypassing repetitive navigation.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>&lt;header&gt;</strong> &mdash; Introductory content for its nearest sectioning ancestor or for
            the page when used at the body level. Implicitly carries the <code className="text-sm">banner</code> role
            when it is a direct child of <code className="text-sm">&lt;body&gt;</code>.
          </li>
          <li>
            <strong>&lt;nav&gt;</strong> &mdash; A section containing navigation links. Maps to the{" "}
            <code className="text-sm">navigation</code> landmark role. When multiple <code className="text-sm">&lt;nav&gt;</code>{" "}
            elements exist on a page (primary nav, breadcrumbs, footer nav), each should receive a unique{" "}
            <code className="text-sm">aria-label</code> to distinguish them.
          </li>
          <li>
            <strong>&lt;main&gt;</strong> &mdash; The dominant content of the page. Must be unique (only one per page).
            Maps to the <code className="text-sm">main</code> landmark role and serves as the target for &quot;skip to
            content&quot; links.
          </li>
          <li>
            <strong>&lt;aside&gt;</strong> &mdash; Content tangentially related to the surrounding content. Maps to the{" "}
            <code className="text-sm">complementary</code> landmark role. Common uses: sidebars, pull quotes, advertising
            slots, related articles.
          </li>
          <li>
            <strong>&lt;footer&gt;</strong> &mdash; Footer for its nearest sectioning ancestor or for the page at the body
            level. Implicitly carries <code className="text-sm">contentinfo</code> when a direct child of{" "}
            <code className="text-sm">&lt;body&gt;</code>.
          </li>
          <li>
            <strong>&lt;section&gt;</strong> &mdash; A thematic grouping of content. Unlike <code className="text-sm">&lt;div&gt;</code>,
            it implies the content within it is related. Maps to the <code className="text-sm">region</code> role only when given
            an accessible name via <code className="text-sm">aria-label</code> or <code className="text-sm">aria-labelledby</code>.
            Without a label, it has no implicit landmark role.
          </li>
          <li>
            <strong>&lt;article&gt;</strong> &mdash; A self-contained composition that could be independently distributed or
            syndicated: a blog post, a forum comment, a product card. Maps to the <code className="text-sm">article</code> role.
            Articles can be nested (e.g., comments within a post).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Text-Level Semantic Elements</h3>
        <ul className="space-y-2">
          <li>
            <strong>&lt;h1&gt; through &lt;h6&gt;</strong> &mdash; Heading hierarchy that generates the document outline.
            Screen reader users navigate by headings more than any other method. Skipping heading levels (e.g.,{" "}
            <code className="text-sm">&lt;h1&gt;</code> followed by <code className="text-sm">&lt;h3&gt;</code>) breaks
            the outline and confuses navigation.
          </li>
          <li>
            <strong>&lt;p&gt;</strong> &mdash; Paragraph. Browsers and screen readers insert appropriate pauses and
            spacing. Using <code className="text-sm">&lt;br&gt;</code> tags inside a <code className="text-sm">&lt;div&gt;</code>{" "}
            instead of <code className="text-sm">&lt;p&gt;</code> tags is a common anti-pattern.
          </li>
          <li>
            <strong>&lt;em&gt; and &lt;strong&gt;</strong> &mdash; Stress emphasis and strong importance respectively. Some
            screen readers change voice inflection for <code className="text-sm">&lt;em&gt;</code>. Distinct from{" "}
            <code className="text-sm">&lt;i&gt;</code> and <code className="text-sm">&lt;b&gt;</code>, which are purely
            presentational.
          </li>
          <li>
            <strong>&lt;time&gt;</strong> &mdash; Machine-readable dates/times via the <code className="text-sm">datetime</code>{" "}
            attribute. Enables search engines to understand temporal context and enables browser-native date formatting.
          </li>
          <li>
            <strong>&lt;mark&gt;</strong> &mdash; Highlighted/marked text, typically search result highlights. Maps to no
            implicit ARIA role but some screen readers announce it.
          </li>
          <li>
            <strong>&lt;abbr&gt;</strong> &mdash; Abbreviations with a <code className="text-sm">title</code> attribute for
            the expansion. Screen readers can be configured to read the expansion.
          </li>
          <li>
            <strong>&lt;blockquote&gt; and &lt;cite&gt;</strong> &mdash; Extended quotations with attribution. The{" "}
            <code className="text-sm">cite</code> attribute or <code className="text-sm">&lt;cite&gt;</code> child provides
            the source.
          </li>
          <li>
            <strong>&lt;code&gt;, &lt;pre&gt;, &lt;kbd&gt;, &lt;samp&gt;</strong> &mdash; Code samples, preformatted text,
            keyboard input, and sample output. These communicate intent to both visual users (monospace font) and
            assistive technologies.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Grouping &amp; Interactive Elements</h3>
        <ul className="space-y-2">
          <li>
            <strong>&lt;figure&gt; and &lt;figcaption&gt;</strong> &mdash; Self-contained content (images, code blocks,
            diagrams) with a caption. The <code className="text-sm">&lt;figcaption&gt;</code> provides the accessible name
            for the figure, eliminating the need for separate <code className="text-sm">aria-label</code> attributes in
            many cases.
          </li>
          <li>
            <strong>&lt;details&gt; and &lt;summary&gt;</strong> &mdash; Native disclosure widget. The browser handles
            expand/collapse state, keyboard interaction (Enter/Space), and ARIA attributes automatically. No JavaScript
            required for basic functionality.
          </li>
          <li>
            <strong>&lt;dialog&gt;</strong> &mdash; Native modal/non-modal dialog. When opened with{" "}
            <code className="text-sm">.showModal()</code>, the browser handles focus trapping, inert background, and
            Escape key dismissal.
          </li>
          <li>
            <strong>&lt;fieldset&gt; and &lt;legend&gt;</strong> &mdash; Groups related form controls with a caption.
            Essential for radio button groups and checkbox sets where individual labels are insufficient to convey context.
          </li>
          <li>
            <strong>&lt;dl&gt;, &lt;dt&gt;, &lt;dd&gt;</strong> &mdash; Description lists for key-value pairs, glossaries,
            and metadata. Screen readers announce the association between term and definition.
          </li>
          <li>
            <strong>&lt;output&gt;</strong> &mdash; The result of a calculation or user action. Has an implicit{" "}
            <code className="text-sm">status</code> role, meaning updates are announced to screen readers via live
            region behavior.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Interactive Form Elements</h3>
        <ul className="space-y-2">
          <li>
            <strong>&lt;button&gt;</strong> &mdash; Native button with implicit <code className="text-sm">button</code> role,
            keyboard activation (Enter and Space), and focus management. Using{" "}
            <code className="text-sm">&lt;div onclick=&quot;...&quot;&gt;</code> instead of a button is the single most common
            semantic HTML violation in production applications.
          </li>
          <li>
            <strong>&lt;a href=&quot;...&quot;&gt;</strong> &mdash; Hyperlink with implicit <code className="text-sm">link</code>{" "}
            role. Must have an <code className="text-sm">href</code> attribute to be focusable and to appear in screen reader
            link lists.
          </li>
          <li>
            <strong>&lt;input&gt; variants</strong> &mdash; Each <code className="text-sm">type</code> attribute value maps to a
            specific role (textbox, checkbox, radio, slider, spinbutton) with built-in keyboard behavior and validation.
          </li>
          <li>
            <strong>&lt;select&gt; and &lt;option&gt;</strong> &mdash; Native dropdown with implicit{" "}
            <code className="text-sm">listbox</code> and <code className="text-sm">option</code> roles. Custom dropdowns built
            with <code className="text-sm">&lt;div&gt;</code> elements require extensive ARIA and keyboard handling to match
            native behavior.
          </li>
          <li>
            <strong>&lt;label&gt;</strong> &mdash; Associates a text label with a form control. Clicking the label focuses
            the associated input. This association is critical for screen reader users and also enlarges the click target
            for users with motor impairments.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: ARCHITECTURE & FLOW (SVG DIAGRAMS)
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding semantic HTML requires visualizing how semantic elements map to landmark regions, how they
          differ from generic containers, and how browsers translate them into implicit ARIA roles for the
          accessibility tree.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Semantic vs. Div Soup</h3>
        <p>
          The following diagram illustrates the fundamental difference between a document built with generic{" "}
          <code className="text-sm">&lt;div&gt;</code> containers and one using semantic elements. The semantic
          version produces an accessibility tree with navigable landmarks, a meaningful document outline, and
          implicit ARIA roles&mdash;all without a single line of JavaScript or explicit ARIA attribute.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/semantic-html-diagram-1.svg"
          alt="Side-by-side comparison of non-semantic div soup markup versus semantic HTML5 elements showing the difference in screen reader landmark exposure"
          caption="Figure 1: Semantic HTML provides landmark navigation, document outline, and implicit ARIA roles that div soup cannot."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Document Outline &amp; Landmark Regions</h3>
        <p>
          The landmark region model is the primary way screen reader users orient themselves on a page. Rather
          than reading top-to-bottom linearly, experienced screen reader users jump between landmarks (using the
          D key in NVDA/JAWS or the Rotor in VoiceOver) to quickly locate the content they need. The diagram
          below shows how semantic elements map to these landmark regions and how a typical page layout is
          perceived by assistive technologies.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/semantic-html-diagram-2.svg"
          alt="Page layout wireframe showing header, nav, main, article, section, aside, and footer elements mapped to their corresponding ARIA landmark roles"
          caption="Figure 2: Semantic elements create a landmark map that screen reader users navigate with keyboard shortcuts."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implicit ARIA Role Mapping</h3>
        <p>
          Every semantic HTML element carries an implicit ARIA role that the browser exposes to the accessibility
          tree. This mapping is defined in the{" "}
          <a href="https://www.w3.org/TR/html-aria/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
            ARIA in HTML specification
          </a>. Understanding these mappings is essential for knowing when ARIA is redundant (and therefore a
          maintenance burden) versus when it&apos;s genuinely needed.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/semantic-html-diagram-3.svg"
          alt="Table mapping HTML elements (header, nav, main, aside, footer, article, section, form, button, a) to their implicit ARIA roles and assistive technology behaviors"
          caption="Figure 3: HTML elements carry built-in ARIA roles, eliminating the need for redundant role attributes."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Accessibility Tree</h3>
        <p>
          Browsers construct the <strong>accessibility tree</strong> in parallel with the DOM tree. The
          accessibility tree is a simplified representation of the DOM that assistive technologies consume. It
          strips out presentational elements (e.g., <code className="text-sm">&lt;div&gt;</code>,{" "}
          <code className="text-sm">&lt;span&gt;</code> without roles) and includes only nodes with semantic
          significance: elements with roles, names, states, and properties. Semantic HTML directly controls the
          shape and quality of this tree.
        </p>
        <h3 className="mt-8 mb-4 text-xl font-semibold">DOM Tree vs Accessibility Tree</h3>
        <p>
          The DOM tree contains all elements including divs and spans, while the accessibility tree is a filtered subset that represents what assistive technologies see. A proper DOM with semantic elements like header, nav, main, article, heading levels, button, footer, and small produces an accessibility tree with document, banner, navigation, main, heading level 1, heading level 2, article, paragraph, button, and contentinfo roles. Notice how generic div wrappers would have been invisible in this tree. The semantic elements create the structure that screen readers announce and that users navigate.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: TRADE-OFFS & COMPARISONS
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <p>
          Choosing between semantic HTML and div-based approaches involves understanding the full cost model.
          The table below provides a systematic comparison across the dimensions that matter at scale.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="py-2">Dimension</th>
                <th className="py-2">Semantic HTML</th>
                <th className="py-2">Div-Based Layout + ARIA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Accessibility</td>
                <td className="py-2">Built-in landmark roles, heading outlines, native keyboard behavior. Zero-effort baseline compliance with WCAG 1.3.1 (Info and Relationships).</td>
                <td className="py-2">Requires manual role=, aria-label, tabindex, keydown handlers. Error-prone and must be maintained separately from visual behavior.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">SEO</td>
                <td className="py-2">Search engines use landmarks, headings, and article elements to understand content hierarchy and determine main content vs. boilerplate.</td>
                <td className="py-2">Crawlers see flat, undifferentiated content. No structural signals for featured snippets, article rich results, or passage ranking.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Maintainability</td>
                <td className="py-2">Self-documenting code. A developer reading &lt;nav&gt; or &lt;aside&gt; immediately understands the purpose without consulting CSS classes.</td>
                <td className="py-2">Relies on class naming conventions (BEM, utility classes) that vary across teams and can drift. &lt;div class=&quot;nav-wrapper&quot;&gt; requires context.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Bundle Size</td>
                <td className="py-2">Native elements handle keyboard interaction, focus management, and state without JavaScript. &lt;details&gt; replaces accordion libraries.</td>
                <td className="py-2">Custom implementations of disclosure widgets, dialogs, tabs often require 5-20 KB of JavaScript for behavior that native elements provide for free.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Cross-Browser</td>
                <td className="py-2">Semantic elements are supported in all modern browsers. Edge case: &lt;dialog&gt; lacked Safari support until 15.4 (2022); now universally available.</td>
                <td className="py-2">Custom ARIA widgets behave identically only if every ARIA state, property, and keyboard pattern is implemented correctly across browsers.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Testing</td>
                <td className="py-2">Semantic queries (getByRole, getByLabelText) in Testing Library directly validate accessibility. Tests break when accessibility regresses.</td>
                <td className="py-2">Tests typically query by class name or test ID, which cannot detect accessibility regressions. Separate a11y tests needed.</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 font-semibold">Styling Flexibility</td>
                <td className="py-2">Some elements have opinionated default styles (fieldset borders, details markers) that require CSS resets. Minor tradeoff.</td>
                <td className="py-2">Divs have no default styles, making them a blank canvas. This is the primary reason developers reach for divs over semantic elements.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When Divs Are Appropriate</h3>
        <p>
          Divs are not inherently wrong. They are the correct element when you need a generic container purely
          for layout or styling purposes and the container itself carries no semantic meaning. Common valid uses
          include CSS Grid/Flexbox wrappers, decorative containers for visual effects, and grouping elements for
          JavaScript event delegation. The anti-pattern is using divs <em>instead of</em> semantic elements, not
          using them <em>alongside</em> semantic elements for presentation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Div vs Semantic Elements</h3>
        <p>
          Using a div with a button class and onClick handler is wrong because it is not focusable, has no keyboard activation, has no button role, and is not announced as interactive by screen readers. The right approach is to use a semantic button element with the same class and onClick handler, which is focusable, supports Enter and Space key activation, and is announced as a button by screen readers. It is acceptable to use a div as a layout wrapper around semantic elements like article and aside for grid layouts, where the div adds layout structure and the semantic children carry the meaning.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: BEST PRACTICES
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          The following practices reflect production-tested patterns for enforcing semantic HTML at scale
          in organizations with dozens or hundreds of contributing engineers.
        </p>
        <ol className="space-y-2">
          <li>
            <strong>1. Enforce semantic element usage in the design system.</strong> Wrap semantic elements inside
            reusable components so product engineers cannot accidentally produce div soup. A{" "}
            <code className="text-sm">&lt;Card&gt;</code> component should render an <code className="text-sm">&lt;article&gt;</code>{" "}
            internally. A <code className="text-sm">&lt;PageLayout&gt;</code> should output <code className="text-sm">&lt;header&gt;</code>,{" "}
            <code className="text-sm">&lt;main&gt;</code>, and <code className="text-sm">&lt;footer&gt;</code>. Bake semantics in
            so they are the default, not an opt-in.
          </li>
          <li>
            <strong>2. Maintain a strict heading hierarchy.</strong> Every page should have exactly one{" "}
            <code className="text-sm">&lt;h1&gt;</code>. Subsequent headings should not skip levels. Use an eslint rule
            (e.g., <code className="text-sm">jsx-a11y/heading-has-content</code>) and automated audits (axe-core) to catch
            violations. In component-based architectures, consider a HeadingLevel context provider that automatically
            adjusts heading levels based on nesting depth.
          </li>
          <li>
            <strong>3. Label all landmark regions.</strong> When a page has multiple <code className="text-sm">&lt;nav&gt;</code>{" "}
            elements, each must have a unique <code className="text-sm">aria-label</code> (e.g., &quot;Primary navigation&quot;,
            &quot;Breadcrumb&quot;, &quot;Footer links&quot;). Screen readers list all landmarks in a rotor, and
            &quot;navigation, navigation, navigation&quot; is not useful.
          </li>
          <li>
            <strong>4. Use native interactive elements.</strong> Never use <code className="text-sm">&lt;div&gt;</code> or{" "}
            <code className="text-sm">&lt;span&gt;</code> for clickable actions. Use <code className="text-sm">&lt;button&gt;</code>{" "}
            for actions and <code className="text-sm">&lt;a&gt;</code> for navigation. This single rule eliminates the majority
            of keyboard accessibility issues and is enforceable via <code className="text-sm">eslint-plugin-jsx-a11y</code>.
          </li>
          <li>
            <strong>5. Pair every form control with a label.</strong> Every <code className="text-sm">&lt;input&gt;</code>,{" "}
            <code className="text-sm">&lt;select&gt;</code>, and <code className="text-sm">&lt;textarea&gt;</code> must have
            either an associated <code className="text-sm">&lt;label&gt;</code> (via <code className="text-sm">htmlFor</code> in
            React) or an <code className="text-sm">aria-label</code>/<code className="text-sm">aria-labelledby</code>. Placeholders
            are not labels&mdash;they disappear on input and are not consistently announced by screen readers.
          </li>
          <li>
            <strong>6. Use &lt;figure&gt; for captioned content.</strong> Any image, code block, chart, or embedded media
            that has an associated caption should use <code className="text-sm">&lt;figure&gt;</code> and{" "}
            <code className="text-sm">&lt;figcaption&gt;</code> rather than a div with adjacent text. This creates a
            programmatic association between the content and its caption.
          </li>
          <li>
            <strong>7. Prefer native &lt;details&gt;/&lt;summary&gt; for disclosure patterns.</strong> Accordion components,
            expandable sections, and FAQ lists can use native <code className="text-sm">&lt;details&gt;</code> with full
            keyboard and screen reader support out of the box. Custom CSS can fully style these elements, including
            replacing the default disclosure triangle.
          </li>
          <li>
            <strong>8. Integrate semantic validation into CI.</strong> Run axe-core or Lighthouse accessibility audits
            in your CI pipeline. Configure rules to flag missing landmarks, incorrect heading levels, interactive elements
            without accessible names, and images without alt text. Make these checks blocking for merges.
          </li>
          <li>
            <strong>9. Use Testing Library queries by role.</strong> React Testing Library&apos;s{" "}
            <code className="text-sm">getByRole</code>, <code className="text-sm">getByLabelText</code>, and{" "}
            <code className="text-sm">getByAltText</code> queries verify accessibility as a side effect of testing
            functionality. Avoid <code className="text-sm">getByTestId</code> as a first choice; prefer queries that
            validate the accessibility tree.
          </li>
          <li>
            <strong>10. Document element selection in ADRs.</strong> For complex UI patterns (tabs, comboboxes, data grids),
            create Architecture Decision Records documenting which HTML elements and ARIA patterns were chosen and why.
            This prevents future engineers from inadvertently replacing semantic implementations with div-based ones.
          </li>
        </ol>
      </section>

      {/* ============================================================
          SECTION 6: COMMON PITFALLS
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Using &lt;div&gt; for interactive elements.</strong> The single most common semantic HTML violation.{" "}
            <code className="text-sm">&lt;div onClick=&quot;...&quot;&gt;</code> elements are not focusable via Tab, do not
            respond to Enter/Space keys, are not announced as interactive by screen readers, and do not appear in the
            browser&apos;s accessibility tree as actionable elements. This violates WCAG 2.1.1 (Keyboard), 4.1.2 (Name,
            Role, Value), and often 2.5.5 (Target Size).
          </li>
          <li>
            <strong>Wrapping &lt;a&gt; tags around block-level content without purpose.</strong> Making entire cards
            clickable by wrapping large areas in an anchor tag can create verbose screen reader announcements. Instead,
            use a pseudo-element overlay technique on a <code className="text-sm">&lt;a&gt;</code> inside the card with
            the headline as link text.
          </li>
          <li>
            <strong>Skipping heading levels for visual sizing.</strong> Using <code className="text-sm">&lt;h4&gt;</code>{" "}
            instead of <code className="text-sm">&lt;h2&gt;</code> because the h4 default font size matches the design.
            Heading levels are structural, not visual. Use CSS to control size; use heading levels to maintain the
            document outline.
          </li>
          <li>
            <strong>Using &lt;section&gt; as a generic container.</strong> A <code className="text-sm">&lt;section&gt;</code>{" "}
            is not a styled <code className="text-sm">&lt;div&gt;</code>. The spec states it should be used when the content
            has a heading and represents a thematic grouping. Using it for layout wrapping pollutes the document outline
            and adds noise to the accessibility tree.
          </li>
          <li>
            <strong>Redundant ARIA roles on semantic elements.</strong> Writing{" "}
            <code className="text-sm">&lt;nav role=&quot;navigation&quot;&gt;</code> or{" "}
            <code className="text-sm">&lt;main role=&quot;main&quot;&gt;</code> is redundant. The implicit role is already
            the correct one. Redundant roles add maintenance burden and can mask underlying issues where the wrong
            element is used.
          </li>
          <li>
            <strong>Missing accessible names on landmarks.</strong> A page with two{" "}
            <code className="text-sm">&lt;nav&gt;</code> elements and no <code className="text-sm">aria-label</code>{" "}
            presents as &quot;navigation&quot; and &quot;navigation&quot; in the screen reader landmark list. Users cannot
            distinguish between them without visual context.
          </li>
          <li>
            <strong>Using &lt;table&gt; for layout.</strong> While less common in modern development, table-based
            layouts still appear in email templates and legacy codebases. Screen readers announce table structure
            (rows, columns, cells), making layout tables confusing. If a table must be used for layout (e.g., email),
            add <code className="text-sm">role=&quot;presentation&quot;</code> to suppress table semantics.
          </li>
          <li>
            <strong>Placeholder text as the only label.</strong> The{" "}
            <code className="text-sm">placeholder</code> attribute is not an accessible label. It disappears when the
            user types, has insufficient color contrast in most browsers, and is not consistently announced by screen
            readers. Always provide a visible <code className="text-sm">&lt;label&gt;</code> or at minimum an{" "}
            <code className="text-sm">aria-label</code>.
          </li>
          <li>
            <strong>Forgetting &lt;lang&gt; on &lt;html&gt;.</strong> The <code className="text-sm">lang</code>{" "}
            attribute on the root element tells screen readers which language synthesis engine to use. Without it,
            a Japanese screen reader might try to read English text phonetically, or vice versa. Also applies to
            inline language switches using <code className="text-sm">lang</code> on child elements.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: REAL-WORLD USE CASES
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub: Landmark Navigation at Scale</h3>
        <p>
          GitHub&apos;s web application uses semantic HTML extensively. Every page includes a{" "}
          <code className="text-sm">&lt;header&gt;</code> with the global navigation bar, a{" "}
          <code className="text-sm">&lt;main&gt;</code> containing the repository content, and multiple labeled{" "}
          <code className="text-sm">&lt;nav&gt;</code> elements for repository tabs, file browser breadcrumbs, and
          sidebar navigation. GitHub&apos;s Primer design system enforces semantic element usage at the component
          level, ensuring that all teams produce consistent accessibility output. Their switch to{" "}
          <code className="text-sm">&lt;dialog&gt;</code> for modals eliminated a significant portion of custom
          focus-trapping code.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GOV.UK: Government Accessibility Standard</h3>
        <p>
          The UK Government Digital Service (GDS) mandates WCAG 2.1 AA compliance for all government websites.
          Their design system is built on a strict semantic HTML foundation: every page template uses{" "}
          <code className="text-sm">&lt;header&gt;</code>, <code className="text-sm">&lt;main&gt;</code>, and{" "}
          <code className="text-sm">&lt;footer&gt;</code> landmarks. Form components always pair controls with visible
          labels. Error messages are associated with inputs via <code className="text-sm">aria-describedby</code>.
          The GDS team publishes detailed guidance on when to use each semantic element and has open-sourced their
          component library (govuk-frontend) as a reference implementation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Airbnb: Search Results as Articles</h3>
        <p>
          Airbnb&apos;s listing search results use <code className="text-sm">&lt;article&gt;</code> elements for each
          property card. This communicates to screen readers that each result is a self-contained unit of content.
          Headings within each article provide the listing title, and pricing/rating information is exposed via
          structured markup. The booking flow uses <code className="text-sm">&lt;fieldset&gt;</code> and{" "}
          <code className="text-sm">&lt;legend&gt;</code> to group date selection, guest count, and payment fields.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe: Documentation with Native Details</h3>
        <p>
          Stripe&apos;s API documentation uses <code className="text-sm">&lt;details&gt;</code> and{" "}
          <code className="text-sm">&lt;summary&gt;</code> elements for expandable parameter descriptions. This
          eliminates JavaScript-dependent accordion components, reduces bundle size, and ensures that the
          expand/collapse behavior works even when JavaScript fails to load or is blocked. Each expandable section
          is keyboard-accessible and screen reader-compatible without any custom ARIA.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">React Component Library: Semantic Wrapper Pattern</h3>
        <p>
          The following example demonstrates a production pattern for enforcing semantics through component
          architecture. By baking the semantic elements into reusable components, product engineers automatically
          produce accessible markup.
        </p>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Design System Component Examples</h3>
        <p>
          For PageLayout component, enforce landmark structure for every page by accepting children, optional sidebarContent, and pageTitle props. The component renders a skip-to-content link as the first focusable element, a header with primary navigation, a main element with the page title as aria-label and an ID for skip link targeting, an optional aside for sidebar content with aria-label, and a footer with footer navigation. For ArticleCard component, every card is semantically an article containing a heading level 3 with a link, a paragraph for summary, and a footer with author and time elements. For ExpandableSection component, use the native details and summary elements for a disclosure widget with custom styling, where the summary contains the title and a chevron icon that rotates when open. For HeadingContext, create a HeadingLevelContext starting at level 2, a HeadingLevelProvider that increments the level for nested content (capped at 6), and a Heading component that reads the current level from context and renders the appropriate h tag dynamically.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Semantic HTML with React Testing Library</h3>
        <p>
          Test semantic structure by rendering the PageLayout component and using React Testing Library queries to validate the accessibility tree. Test that all landmark regions render correctly by querying for banner role for header, navigation role with name Primary, main role with the page name, complementary role for sidebar, and contentinfo role for footer. Test that the skip-to-content link is the first focusable element by tabbing and checking focus and href attribute. Test that heading hierarchy is maintained by querying all heading roles and verifying their aria-level attributes and tag names follow the correct sequence from h1 to h2 to h3.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: REFERENCES & FURTHER READING
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://html.spec.whatwg.org/multipage/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              WHATWG HTML Living Standard
            </a> &mdash; The authoritative specification for HTML elements, their semantics, and content models.
          </li>
          <li>
            <a href="https://www.w3.org/TR/html-aria/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              ARIA in HTML (W3C)
            </a> &mdash; Defines the mapping between HTML elements and their implicit ARIA roles, states, and properties.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              WAI-ARIA Authoring Practices Guide
            </a> &mdash; Design patterns and examples for building accessible web components, including when to use native HTML vs. ARIA.
          </li>
          <li>
            <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Web Content Accessibility Guidelines (WCAG) 2.1
            </a> &mdash; The global standard for web accessibility. Semantic HTML directly supports Success Criteria 1.3.1, 2.4.1, 2.4.6, 4.1.2, and others.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              MDN Web Docs: HTML Elements Reference
            </a> &mdash; Comprehensive reference for every HTML element with usage examples and browser compatibility tables.
          </li>
          <li>
            <a href="https://www.scottohara.me/blog/2022/09/12/details-summary.html" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Scott O&apos;Hara: Details/Summary Accessibility
            </a> &mdash; In-depth analysis of the details/summary pattern&apos;s accessibility characteristics across browsers and screen readers.
          </li>
          <li>
            <a href="https://testing-library.com/docs/queries/byrole" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Testing Library: ByRole Queries
            </a> &mdash; Documentation for role-based queries that validate accessibility as a side effect of functional testing.
          </li>
          <li>
            <a href="https://www.deque.com/axe/" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Deque axe-core
            </a> &mdash; The industry-standard automated accessibility testing engine. Integrates with CI pipelines, browser extensions, and testing frameworks.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 9: COMMON INTERVIEW QUESTIONS
          ============================================================ */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the difference between &lt;section&gt; and &lt;div&gt;? When should you use each?</h3>
          <p>
            A <code className="text-sm">&lt;section&gt;</code> represents a thematic grouping of content that
            typically has a heading. It contributes to the document outline and, when labeled with{" "}
            <code className="text-sm">aria-label</code> or <code className="text-sm">aria-labelledby</code>, becomes
            a <code className="text-sm">region</code> landmark in the accessibility tree. A{" "}
            <code className="text-sm">&lt;div&gt;</code> is a generic container with no semantic meaning&mdash;it is
            invisible to the accessibility tree. Use <code className="text-sm">&lt;section&gt;</code> when the content
            forms a distinct thematic unit (e.g., &quot;Related Articles&quot;, &quot;User Reviews&quot;). Use{" "}
            <code className="text-sm">&lt;div&gt;</code> for layout wrappers, styling containers, and JavaScript hook
            points where no semantic meaning is intended. A useful litmus test: if you would put a heading inside it,
            it&apos;s probably a section; if you would not, it&apos;s probably a div.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: Why is using a &lt;button&gt; element important instead of a clickable &lt;div&gt;?</h3>
          <p>
            A native <code className="text-sm">&lt;button&gt;</code> provides: (1) automatic focus management&mdash;it
            is included in the Tab order without adding <code className="text-sm">tabindex</code>; (2) keyboard
            activation&mdash;it responds to both Enter and Space keys natively; (3) an implicit{" "}
            <code className="text-sm">button</code> ARIA role so screen readers announce it as an interactive element;
            (4) built-in <code className="text-sm">disabled</code> state management; (5) form submission behavior when
            inside a form. Replicating all of this with a <code className="text-sm">&lt;div&gt;</code> requires adding{" "}
            <code className="text-sm">role=&quot;button&quot;</code>, <code className="text-sm">tabindex=&quot;0&quot;</code>,{" "}
            <code className="text-sm">onKeyDown</code> handling for Enter and Space, <code className="text-sm">aria-disabled</code>{" "}
            for the disabled state, and preventing default behavior on Space (which normally scrolls the page). This is
            6+ lines of code to poorly replicate what a single <code className="text-sm">&lt;button&gt;</code> provides
            for free.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What are landmark roles and why do they matter for screen reader navigation?</h3>
          <p>
            Landmark roles (banner, navigation, main, complementary, contentinfo, form, region, search) are ARIA roles
            that define major regions of a page. Screen readers provide keyboard shortcuts to jump between landmarks
            (D key in NVDA/JAWS, Rotor in VoiceOver), enabling users to bypass repetitive content and navigate directly
            to the section they need. Semantic HTML elements map to landmarks automatically:{" "}
            <code className="text-sm">&lt;header&gt;</code> to banner, <code className="text-sm">&lt;nav&gt;</code> to
            navigation, <code className="text-sm">&lt;main&gt;</code> to main, <code className="text-sm">&lt;aside&gt;</code> to
            complementary, <code className="text-sm">&lt;footer&gt;</code> to contentinfo. A page without landmarks forces
            screen reader users to navigate linearly through every element&mdash;on a complex page with 500+ elements,
            this makes the page effectively unusable. Having well-structured landmarks with unique labels is the single
            highest-impact accessibility improvement for screen reader users.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How does semantic HTML affect SEO?</h3>
          <p>
            Search engines use HTML semantics to understand page structure. The <code className="text-sm">&lt;main&gt;</code>{" "}
            element signals the primary content (vs. boilerplate headers/footers/sidebars). Heading hierarchy (
            <code className="text-sm">&lt;h1&gt;</code>&ndash;<code className="text-sm">&lt;h6&gt;</code>) communicates topic
            hierarchy and enables featured snippets and passage ranking. The <code className="text-sm">&lt;article&gt;</code>{" "}
            element helps crawlers identify syndication-ready content. The <code className="text-sm">&lt;nav&gt;</code> element
            helps crawlers distinguish navigation links from content links, affecting crawl budget allocation. Structured
            data (JSON-LD) combined with semantic HTML creates a reinforcing signal: the semantic structure provides
            context that structured data annotations can reference. Google&apos;s quality raters explicitly evaluate whether
            main content is clearly distinguishable from supplementary content&mdash;semantic elements provide this
            distinction programmatically.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you enforce semantic HTML standards across a large engineering organization?</h3>
          <p>
            A multi-layered approach works best: (1) <strong>Design system enforcement</strong>&mdash;build semantic
            elements into reusable components so product engineers cannot produce div soup. A Card renders an article,
            a PageLayout renders header/main/footer. (2) <strong>Static analysis</strong>&mdash;configure{" "}
            <code className="text-sm">eslint-plugin-jsx-a11y</code> with strict rules for interactive elements, heading
            levels, label associations, and alt text. Run these as pre-commit hooks and CI checks. (3){" "}
            <strong>Automated auditing</strong>&mdash;integrate axe-core or Lighthouse accessibility audits into CI.
            Set a zero-tolerance threshold for landmark violations, missing labels, and interactive element issues. (4){" "}
            <strong>Testing patterns</strong>&mdash;mandate Testing Library role-based queries (
            <code className="text-sm">getByRole</code>, <code className="text-sm">getByLabelText</code>) in component tests.
            Tests that query by test ID when a role query would work should fail code review. (5){" "}
            <strong>Manual testing rotation</strong>&mdash;schedule regular screen reader testing sessions. Pair sighted
            engineers with screen reader users for usability testing. Automated tools catch roughly 30-40% of
            accessibility issues; manual testing catches the rest.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is the document outline algorithm and why was it abandoned?</h3>
          <p>
            The HTML5 specification originally proposed a &quot;document outline algorithm&quot; that would allow heading
            levels to reset within sectioning elements. Under this algorithm, an{" "}
            <code className="text-sm">&lt;h1&gt;</code> inside a <code className="text-sm">&lt;section&gt;</code> inside
            an <code className="text-sm">&lt;article&gt;</code> would be treated as an h3 in the overall document
            outline. This would have allowed component authors to always use <code className="text-sm">&lt;h1&gt;</code>{" "}
            internally and let the nesting context determine the effective level. However, no browser or assistive
            technology ever implemented this algorithm. After years of confusion and incorrect advice in tutorials, the
            WHATWG removed it from the specification. The practical implication is that heading levels are absolute, not
            relative: an <code className="text-sm">&lt;h3&gt;</code> is always an h3 regardless of its nesting context.
            This is why component libraries often need a HeadingLevel context provider to manage heading levels across
            composition boundaries.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
