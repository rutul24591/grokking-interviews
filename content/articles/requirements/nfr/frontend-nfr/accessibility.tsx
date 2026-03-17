"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-accessibility",
  title: "Accessibility (a11y)",
  description: "Comprehensive guide to web accessibility covering WCAG guidelines, ARIA, keyboard navigation, screen readers, cognitive accessibility, and inclusive design patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "accessibility",
  version: "extensive",
  wordCount: 14500,
  readingTime: 58,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "accessibility", "a11y", "wcag", "aria", "inclusive", "cognitive"],
  relatedTopics: ["web-standards", "semantic-html", "keyboard-navigation"],
};

export default function AccessibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Web Accessibility (a11y)</strong> ensures websites are usable by people with disabilities
          including visual, auditory, motor, and cognitive impairments. It&apos;s not just ethical—it&apos;s
          often legally required (ADA, Section 508, EN 301 549).
        </p>
        <p>
          Accessibility benefits everyone:
        </p>
        <ul>
          <li><strong>Permanent disabilities:</strong> Blind, deaf, motor impairments</li>
          <li><strong>Temporary disabilities:</strong> Broken arm, lost glasses</li>
          <li><strong>Situational limitations:</strong> Bright sunlight, noisy environment</li>
          <li><strong>Aging population:</strong> Declining vision, hearing, motor control</li>
        </ul>
        <p>
          For staff engineers, accessibility is a quality attribute like performance or security.
          It requires intentional design, testing with assistive technologies, and team education.
        </p>
      </section>

      <section>
        <h2>WCAG Guidelines</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/wcag-principles.svg"
          alt="WCAG Principles"
          caption="WCAG 2.1 principles — Perceivable, Operable, Understandable, Robust (POUR)"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Four Principles (POUR)</h3>
        <ul>
          <li><strong>Perceivable:</strong> Users can perceive the content (see, hear, touch)</li>
          <li><strong>Operable:</strong> Users can operate the interface (keyboard, voice, switch)</li>
          <li><strong>Understandable:</strong> Users understand content and operation</li>
          <li><strong>Robust:</strong> Content works with current/future assistive technologies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conformance Levels</h3>
        <ul>
          <li><strong>Level A:</strong> Minimum accessibility (25 criteria)</li>
          <li><strong>Level AA:</strong> Standard target (13 additional criteria)</li>
          <li><strong>Level AAA:</strong> Highest level (23 additional criteria)</li>
        </ul>
        <p>
          Most organizations target WCAG 2.1 Level AA as the standard.
        </p>
      </section>

      <section>
        <h2>Cognitive Accessibility</h2>
        <p>
          Cognitive disabilities affect how users process information. This includes dyslexia, ADHD, autism,
          dementia, and learning disabilities. WCAG 2.2 (2023) added enhanced cognitive accessibility guidelines.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Cognitive Challenges</h3>
        <ul className="space-y-3">
          <li>
            <strong>Dyslexia:</strong> Difficulty reading text. Benefits: readable fonts, text spacing controls,
            text-to-speech support, high contrast without glare.
          </li>
          <li>
            <strong>ADHD:</strong> Difficulty focusing, easily distracted. Benefits: minimal distractions,
            clear visual hierarchy, progress indicators, break tasks into steps.
          </li>
          <li>
            <strong>Autism:</strong> Sensory sensitivities, prefer predictability. Benefits: consistent layouts,
            no auto-playing media, reduced motion options, clear literal language.
          </li>
          <li>
            <strong>Dementia/Memory impairment:</strong> Difficulty remembering. Benefits: clear navigation,
            breadcrumbs, session timeout warnings, help text visible when needed.
          </li>
          <li>
            <strong>Learning disabilities:</strong> Difficulty understanding complex content. Benefits:
            plain language, multiple content formats (text + images + audio), glossary for jargon.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WCAG 2.2 Cognitive Guidelines</h3>
        <ul className="space-y-3">
          <li>
            <strong>3.2.6 Consistent Help (Level A):</strong> Help mechanisms (contact info, FAQ, chat) appear
            in the same location across pages.
          </li>
          <li>
            <strong>3.2.7 Visible Controls (Level AA):</strong> Interactive controls are visible or made visible
            on focus/hover. Don&apos;t hide navigation behind gestures alone.
          </li>
          <li>
            <strong>3.3.7 Redundant Entry (Level A):</strong> Don&apos;t require users to re-enter information
            already provided (e.g., shipping = billing address checkbox).
          </li>
          <li>
            <strong>3.3.8 Accessible Authentication (Level AA):</strong> Don&apos;t require memorization or
            transcription (no password requirements without show/hide toggle, no CAPTCHA without accessible
            alternative).
          </li>
          <li>
            <strong>3.3.9 High Contrast (Level AA):</strong> Provide high contrast mode (4.5:1 for text).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation Guidelines</h3>
        <ul className="space-y-3">
          <li>
            <strong>Plain language:</strong> Write at 8th-grade reading level. Define jargon. Use active voice.
          </li>
          <li>
            <strong>Consistent navigation:</strong> Keep navigation in the same location. Use breadcrumbs.
          </li>
          <li>
            <strong>Clear focus states:</strong> Visible focus indicators help users track where they are.
          </li>
          <li>
            <strong>Reduce cognitive load:</strong> One task per screen. Progressive disclosure. Default values.
          </li>
          <li>
            <strong>Error prevention:</strong> Confirm destructive actions. Auto-save drafts. Undo functionality.
          </li>
          <li>
            <strong>Multiple formats:</strong> Supplement text with images, icons, diagrams, and video.
          </li>
          <li>
            <strong>Time flexibility:</strong> No time limits or extendable sessions. Warn before timeout.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            Cognitive accessibility is often overlooked in favor of visual/motor accessibility, but it affects
            a larger population (15-20% of adults have learning disabilities). In staff engineer interviews,
            demonstrating awareness of cognitive accessibility shows comprehensive thinking about inclusive design.
          </p>
        </div>
      </section>

      <section>
        <h2>Semantic HTML</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/semantic-html.svg"
          alt="Semantic HTML Elements"
          caption="Semantic HTML elements for accessibility — proper heading hierarchy, landmarks, and interactive elements"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Semantics Matter</h3>
        <p>
          Screen readers use HTML semantics to navigate and announce content:
        </p>
        <ul>
          <li><code>&lt;nav&gt;</code> → &quot;Navigation landmark&quot;</li>
          <li><code>&lt;button&gt;</code> → &quot;Button, clickable&quot;</li>
          <li><code>&lt;h1&gt;-&lt;h6&gt;</code> → Heading hierarchy for navigation</li>
          <li><code>&lt;label&gt;</code> → Associated with form inputs</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Mistakes</h3>
        <ul>
          <li>Using <code>&lt;div&gt;</code> for buttons (no keyboard support)</li>
          <li>Skipping heading levels (h1 → h4)</li>
          <li>Images without alt text</li>
          <li>Links with &quot;click here&quot; text</li>
        </ul>
      </section>

      <section>
        <h2>ARIA (Accessible Rich Internet Applications)</h2>
        <p>
          ARIA adds semantics when HTML isn&apos;t sufficient.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">ARIA Roles</h3>
        <pre className="my-4 overflow-x-auto rounded-lg bg-panel-soft p-4 text-sm">
          <code>{`<div role="alert">Error message</div>
<div role="dialog" aria-modal="true">Modal</div>
<nav aria-label="Main navigation">`}</code>
        </pre>

        <h3 className="mt-6 mb-3 text-lg font-semibold">ARIA States & Properties</h3>
        <pre className="my-4 overflow-x-auto rounded-lg bg-panel-soft p-4 text-sm">
          <code>{`<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<input aria-invalid="true" aria-describedby="error-msg">`}</code>
        </pre>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">First Rule of ARIA</h3>
          <p>
            Don&apos;t use ARIA if you can use native HTML. ARIA is a supplement, not a replacement.
            Native elements have built-in accessibility; ARIA requires manual implementation.
          </p>
        </div>
      </section>

      <section>
        <h2>Keyboard Navigation</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/keyboard-navigation.svg"
          alt="Keyboard Navigation Patterns"
          caption="Keyboard accessibility — focus management, tab order, and common keyboard shortcuts"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Focus Management</h3>
        <ul>
          <li>All interactive elements must be focusable</li>
          <li>Focus must be visible (outline)</li>
          <li>Focus order must be logical</li>
          <li>Modal traps focus until closed</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Keyboard Patterns</h3>
        <ul>
          <li><code>Tab</code>: Move to next interactive element</li>
          <li><code>Shift+Tab</code>: Move to previous</li>
          <li><code>Enter/Space</code>: Activate button/link</li>
          <li><code>Arrow keys</code>: Navigate within components</li>
          <li><code>Escape</code>: Close modal/dropdown</li>
        </ul>
      </section>

      <section>
        <h2>Testing Accessibility</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Tools</th>
              <th className="p-3 text-left">Catches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Automated</td>
              <td className="p-3">axe, Lighthouse, WAVE</td>
              <td className="p-3">~30% of issues</td>
            </tr>
            <tr>
              <td className="p-3">Keyboard</td>
              <td className="p-3">Manual testing</td>
              <td className="p-3">Focus, navigation</td>
            </tr>
            <tr>
              <td className="p-3">Screen Reader</td>
              <td className="p-3">NVDA, VoiceOver, JAWS</td>
              <td className="p-3">Announcements, flow</td>
            </tr>
            <tr>
              <td className="p-3">User Testing</td>
              <td className="p-3">Users with disabilities</td>
              <td className="p-3">Real-world barriers</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility Automation</h3>
        <p>
          Automated testing catches ~30% of accessibility issues but should be part of every CI/CD pipeline.
          Automation is best for regression prevention; manual testing is required for comprehensive coverage.
        </p>

        <h4 className="mt-6 mb-3 font-semibold">Linting (Development Time)</h4>
        <ul className="space-y-2">
          <li>
            <strong>eslint-plugin-jsx-a11y:</strong> Static analysis for React JSX. Catches: missing alt text,
            invalid ARIA, missing labels, click handlers on non-interactive elements. Configure with
            <code>plugin:jsx-a11y/recommended</code> preset.
          </li>
          <li>
            <strong>angular-eslint/template/accessibility:</strong> Angular template accessibility rules.
          </li>
          <li>
            <strong>vue-eslint-plugin/accessibility:</strong> Vue template accessibility rules.
          </li>
        </ul>

        <h4 className="mt-6 mb-3 font-semibold">Runtime Testing (CI/CD)</h4>
        <ul className="space-y-2">
          <li>
            <strong>axe-core:</strong> JavaScript engine for accessibility testing. Integrates with Jest,
            Cypress, Playwright, Puppeteer.
          </li>
          <li>
            <strong>@axe-core/react:</strong> Logs accessibility violations to console during development.
          </li>
          <li>
            <strong>jest-axe:</strong> Jest matchers for axe-core results. Use with testing-library for
            component testing.
          </li>
        </ul>

        <h4 className="mt-6 mb-3 font-semibold">E2E Testing (Cypress/Playwright)</h4>
        <p>
          Use <code>cypress-axe</code> plugin for Cypress or Playwright's accessibility plugins. Inject axe
          with <code>cy.injectAxe()</code> and run checks with <code>cy.checkA11y()</code>. Can test specific
          elements or entire pages.
        </p>

        <h4 className="mt-6 mb-3 font-semibold">What Automation Misses</h4>
        <p>
          Automated tools cannot verify:
        </p>
        <ul className="space-y-2">
          <li>Logical focus order (tools check focusable elements, not order)</li>
          <li>Meaningful alt text (tools check presence, not quality)</li>
          <li>Heading hierarchy logic (tools check structure, not semantic correctness)</li>
          <li>Color contrast in context (tools check ratios, not visual grouping)</li>
          <li>Screen reader announcement quality (requires manual testing)</li>
          <li>Cognitive accessibility (plain language, consistent navigation)</li>
        </ul>
        <p>
          <strong>Recommended approach:</strong> Automated tests in CI for regression prevention + manual
          keyboard/screen reader testing before major releases + user testing with disabled users periodically.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between accessibility and usability?</p>
            <p className="mt-2 text-sm">
              A: Accessibility ensures people with disabilities can use the product. Usability ensures
              everyone can use it effectively. Accessibility is a subset of usability—you can&apos;t have
              good usability without accessibility.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make a custom dropdown accessible?</p>
            <p className="mt-2 text-sm">
              A: Use <code>role=&quot;combobox&quot;</code> on trigger, <code>role=&quot;listbox&quot;</code>
              on dropdown. Manage <code>aria-expanded</code>, <code>aria-activedescendant</code>. Support
              arrow keys, Enter, Escape. Ensure focus management and screen reader announcements.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
