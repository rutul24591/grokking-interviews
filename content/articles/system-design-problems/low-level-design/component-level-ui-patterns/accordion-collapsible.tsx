"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-accordion-collapsible",
  title: "Design an Accordion / Collapsible Section",
  description:
    "Accordion system with exclusive vs independent expand, animated height transitions, accessibility, and nested accordions.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "accordion-collapsible",
  wordCount: 3200,
  readingTime: 16,
  lastUpdated: "2026-04-03",
  tags: ["lld", "accordion", "collapsible", "animation", "accessibility", "transitions"],
  relatedTopics: ["tree-view-folder-explorer", "tooltip-system", "modal-component"],
};

export default function AccordionCollapsibleArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">We need to design an accordion / collapsible section system — a UI pattern
          where users expand and collapse content sections.</HighlightBlock>
<HighlightBlock as="p" tier="important">The system supports two
          modes: exclusive (only one section open at a time, like FAQ pages) and
          independent (multiple sections can be open simultaneously). Height transitions
          are animated smoothly. The system is fully keyboard-accessible and screen
          reader compatible.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Assumptions:</strong> Accordion items have a header (always visible)
          and a content panel (visible when expanded). Nested accordions are supported.
          The component is used in a React 19+ SPA.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Expand/Collapse:</strong> Click header to toggle content visibility.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Exclusive Mode:</strong> Opening one item automatically closes the previously open item.</HighlightBlock>
          <li><strong>Independent Mode:</strong> Multiple items can be open simultaneously.</li>
          <li><strong>Animated Transitions:</strong> Smooth height animation using CSS transitions or FLIP technique.</li>
          <li><strong>Nested Accordions:</strong> Accordion items can contain child accordions.</li>
          <li><strong>Default State:</strong> Configurable initial open/closed state per item.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> ARIA accordion pattern: headers are buttons with aria-expanded, panels have aria-labelledby.</HighlightBlock>
          <li><strong>Performance:</strong> Height animation at 60fps. No layout thrashing during animation.</li>
          <li><strong>SSR Safety:</strong> Accordion renders collapsed on server, animates on client mount.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Content height changes during open (e.g., image loads) — animation must adapt.</li>
          <li>User rapidly clicks header multiple times — animation must not queue or glitch.</li>
          <li>Nested accordion: expanding inner accordion should not affect outer accordion state.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Each accordion item renders its header as a
          button and its content panel with animated height using the <code>grid</code>
          trick (transition on</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><code>grid-template-rows</code> from <code>0fr</code> to
          </Highlight><code>1fr</code>) for smooth CSS-only animation without JavaScript height
          measurement.</HighlightBlock>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Context</h4>
          <HighlightBlock as="p" tier="important"><code>AccordionMode</code> (exclusive | independent). <code>AccordionContext</code> provides open/close handlers, open item IDs, and mode to child items.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Accordion Root</h4>
          <HighlightBlock as="p" tier="important">Manages open state (single ID for exclusive, Set for independent). Provides context to items.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Accordion Item</h4>
          <HighlightBlock as="p" tier="crucial">Header button with aria-expanded, chevron icon rotation animation. Content panel with grid-row animation.</HighlightBlock>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/accordion-collapsible-architecture.svg"
          alt="Accordion collaps component architecture showing state context, animation, and accessibility flow"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Accordion renders with default closed state.</li>
          <li>User clicks header → context toggles item ID → item re-renders with aria-expanded=&quot;true&quot;.</li>
          <li>Content panel animates open via grid-template-rows transition (0fr → 1fr).</li>
          <li>In exclusive mode, context closes previous item → its panel animates closed.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <HighlightBlock as="p" tier="important">
          User click → context state update → item re-render → CSS transition triggers.
          In exclusive mode: close previous → open new (two transitions, batched).
        </HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial"><strong>Rapid clicks:</strong> The toggle handler checks current state before toggling. If the item is already in the target state, no-op. CSS transition is not queued — it cancels the previous animation.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Dynamic content height:</strong> The grid-template-rows technique automatically adapts to content height changes. No JavaScript height measurement needed.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Nested accordions:</strong> Each accordion has its own context. Inner accordion state is independent of outer accordion. Event propagation is stopped at the inner accordion root.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <HighlightBlock as="p" tier="crucial">The full production implementation is available in the <strong>Example tab</strong>.
          Key</HighlightBlock>
<HighlightBlock as="p" tier="important">approach: CSS <code>grid-template-rows</code> transition for height animation
          (no JS</HighlightBlock>
<HighlightBlock as="p" tier="important">measurement), React Context for state management, compound component pattern
          for API ergonomics.</HighlightBlock>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <HighlightBlock as="p" tier="important">
          The performance lever is avoiding layout thrash: keep toggles O(1) and animate height without measuring
          scrollHeight on every frame.
        </HighlightBlock>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <HighlightBlock as="tr" tier="crucial">
                <td className="p-2">Toggle item</td>
                <td className="p-2">O(1) — Set add/delete or single ID swap</td>
                <td className="p-2">O(n) — n open items</td>
              </HighlightBlock>
              <HighlightBlock as="tr" tier="important">
                <td className="p-2">Height animation</td>
                <td className="p-2">O(1) — CSS transition, no JS</td>
                <td className="p-2">O(1)</td>
              </HighlightBlock>
            </tbody>
          </table>
        </div>
	      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Each header is a <code>&lt;button&gt;</code> element with
          <code>aria-expanded</code> and <code>aria-controls</code> linked to the panel
          ID.</HighlightBlock>
<HighlightBlock as="p" tier="important">The panel has <code>role=&quot;region&quot;</code> and
          <code>aria-labelledby</code> linked to the header.</HighlightBlock>
<HighlightBlock as="p" tier="important">Keyboard: Enter/Space
          toggles, ArrowDown/Up moves focus between headers, Home/End jump to first/last
          header. Content is sanitized if it contains user-generated text.</HighlightBlock>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Unit:</strong> Exclusive mode — opening one closes others. Independent mode — multiple open. Toggle same item twice — closes it.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Integration:</strong> Click header, verify aria-expanded changes, verify content visible after animation completes.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> axe-core on accordion, keyboard navigation between headers, screen reader announces expanded/collapsed state.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important"><strong>Using div instead of button for headers:</strong> Non-interactive elements cannot receive focus or keyboard events. Headers must be buttons.</HighlightBlock>
          <li><strong>Animating height with JS:</strong> Measuring scrollHeight and animating via requestAnimationFrame is error-prone. CSS grid-template-rows transition is cleaner and more performant.</li>
          <HighlightBlock as="li" tier="crucial"><strong>No aria-controls/aria-labelledby:</strong> Screen readers cannot associate headers with their panels. These attributes are required for the ARIA accordion pattern.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement lazy loading of accordion content?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Render a placeholder when collapsed. On expand, trigger data fetch.
              Show loading skeleton while fetching. Use React Suspense with a lazy-loaded
              content component. Cache fetched content so re-expanding is instant.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist open/closed state across sessions?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Store the Set of open item IDs in localStorage keyed by accordion ID.
              On mount, restore the Set. Validate that restored IDs still exist in the
              current accordion configuration (items may have been removed).
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you animate the chevron icon rotation smoothly?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Apply <code>transition: transform 0.2s ease</code> to the chevron SVG.
              Rotate from 0deg (collapsed) to 180deg (expanded) via CSS class or inline
              style based on the expanded state.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle accordion items with very tall content (e.g., 1000px)?</p>
            <p className="mt-2 text-sm">
              A: The grid-template-rows transition works for any height. However, for
              very tall content, consider adding a &quot;Show more&quot; truncation at
              300px with an expand-to-full option. This prevents the user from losing
              their place when expanding a very tall item.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Accordion Pattern
            </a>
          </li>
          <li>
            <a href="https://keithjgrant.com/posts/2023/04/transitioning-to-height-auto/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Transitioning to Height Auto with CSS Grid
            </a>
          </li>
          <li>
            <a href="https://www.radix-ui.com/primitives/docs/components/accordion" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Radix UI — Accordion Primitive
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
