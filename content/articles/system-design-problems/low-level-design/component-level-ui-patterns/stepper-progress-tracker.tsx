"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-stepper-progress-tracker",
  title: "Design a Stepper / Progress Tracker",
  description:
    "Stepper/progress tracker for async multi-page flows with step validation, skip logic, progress persistence, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "stepper-progress-tracker",
  wordCount: 3200,
  readingTime: 18,
  lastUpdated: "2026-04-03",
  tags: ["lld", "stepper", "progress", "multi-step", "validation", "accessibility"],
  relatedTopics: ["wizard-multi-step-form", "form-builder", "payment-checkout-ui"],
};

export default function StepperProgressTrackerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          We need to design a stepper / progress tracker — a visual component that shows
          the user&apos;s position in a multi-step process (e.g., checkout, onboarding,
          application form). Steps can be completed, in-progress, upcoming, or skipped.
          The stepper must support step validation (cannot advance until current step is
          valid), conditional skip logic, progress persistence across sessions, and full
          keyboard accessibility.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Assumptions:</strong>
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Steps are sequential but may allow jumping back to completed steps.</HighlightBlock>
          <li>Each step has a validation gate — cannot proceed until requirements are met.</li>
          <li>Some steps may be conditionally skipped based on previous answers.</li>
          <li>Progress is persisted so the user can resume later.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Step States:</strong> completed, current, upcoming, skipped, error.</li>
          <HighlightBlock as="li" tier="important"><strong>Navigation:</strong> Click completed steps to go back. Current step cannot be skipped until valid. Upcoming steps are disabled.</HighlightBlock>
          <li><strong>Validation Gate:</strong> Next button disabled until current step passes validation.</li>
          <li><strong>Skip Logic:</strong> Steps can be conditionally skipped based on previous step answers.</li>
          <HighlightBlock as="li" tier="important"><strong>Progress Persistence:</strong> Current step and completed steps saved to localStorage/server, restored on return.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Progress Bar:</strong> Visual progress indicator (percentage bar or step dots with connecting lines).</HighlightBlock>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> aria-current=&quot;step&quot; on active step, keyboard navigation between steps, screen reader announces progress.</HighlightBlock>
          <li><strong>Responsive:</strong> Horizontal stepper on desktop, vertical on mobile.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">User navigates back and changes an answer that affects skip logic — previously skipped steps must be re-evaluated.</HighlightBlock>
          <li>Step validation fails on submit — stepper highlights the first invalid step.</li>
          <li>User returns after 30 days — persisted progress may be stale, show &quot;Resume where you left off?&quot; prompt.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The core idea is a <strong>step machine</strong> (state machine) managing step
          transitions: only completed → current → next is allowed.</HighlightBlock>
<HighlightBlock as="p" tier="important">A <strong>Zustand
          store</strong> tracks step states, validation results, and persistence. The
          stepper UI renders step indicators with connecting lines, colored by state.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Why state machine + store is optimal:</strong> Step transitions have
          strict rules (cannot skip ahead, must validate before advancing). A state
          machine makes these rules explicit and prevents invalid transitions. The store
          handles persistence and cross-component state sharing.
        </HighlightBlock>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Store</h4>
          <HighlightBlock as="p" tier="important"><code>Step</code> (id, title, description, state, isValid, isSkippable). Store: steps array, currentStepId, validation results, persistence key.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Step Transition Machine</h4>
          <HighlightBlock as="p" tier="important">Validates transition rules: can go back to completed, can advance only if current is valid, skip logic evaluates predicates.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Stepper UI Components</h4>
          <HighlightBlock as="p" tier="important">Step indicator (circle with checkmark/number/error icon), connecting lines, progress bar, responsive horizontal/vertical layout.</HighlightBlock>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/stepper-progress-tracker-architecture.svg"
          alt="Stepper progress tracker architecture showing state machine, validation, and skip logic"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Stepper loads: store restores current step from persistence.</li>
          <HighlightBlock as="li" tier="important">Steps render: completed (checkmark), current (highlighted number), upcoming (grayed), skipped (dash).</HighlightBlock>
          <li>User completes current step → validation passes → Next enabled.</li>
          <HighlightBlock as="li" tier="crucial">User clicks Next → state machine transitions current → completed, next → current.</HighlightBlock>
          <li>Skip logic evaluates: if current step answer triggers skip, next applicable step becomes current.</li>
          <li>Progress saves to persistence.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Data flow: step completion → validation → state transition → store update →
          UI re-render → persistence save. Skip logic: answer change → re-evaluate
          predicates → update step states → re-render.
        </HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important"><strong>Skip logic re-evaluation:</strong> When user goes back and changes an answer, the stepper re-evaluates all downstream skip predicates. Steps that were skipped become upcoming, and vice versa.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Stale progress:</strong> On restore, check the persistence timestamp. If older than 30 days, show a prompt: &quot;Resume from step 3 or start over?&quot;</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <HighlightBlock as="p" tier="crucial">The full production implementation is available in the <strong>Example tab</strong>.
          Key modules: Zustand</HighlightBlock>
<HighlightBlock as="p" tier="important">store with step state management, step transition machine
          with validation gates, stepper UI with responsive</HighlightBlock>
<HighlightBlock as="p" tier="important">layout, skip logic evaluator
          with predicate-based routing, and persistence with staleness detection.</HighlightBlock>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Complexity</h3>
        <HighlightBlock as="p" tier="important">
          The stepper itself should stay O(1) per transition; the only O(s) work should be explicit (re-evaluating
          downstream skip predicates) and must be debounced or memoized for long flows.
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
                <td className="p-2">Step transition</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(s) — s steps</td>
              </HighlightBlock>
              <HighlightBlock as="tr" tier="important">
                <td className="p-2">Skip logic re-evaluation</td>
                <td className="p-2">O(s) — evaluate all downstream predicates</td>
                <td className="p-2">O(1)</td>
              </HighlightBlock>
            </tbody>
          </table>
        </div>
	      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Progress persistence data is validated on restore — malformed state is rejected
          and defaults are used.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">For accessibility, each step has <code>aria-current</code>
          when active, <code>aria-label</code> with step number and title, and keyboard
          navigation via Tab/Enter. Screen reader announces &quot;Step 3 of 7: Payment
          Details&quot;.</HighlightBlock>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Unit:</strong> Step transition machine — test all valid/invalid transitions. Skip logic — test predicate evaluation.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Integration:</strong> Complete step → verify Next enables → click → verify transition → verify persistence save.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> axe-core on stepper, keyboard nav between steps, screen reader announcements.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important"><strong>No validation gate:</strong> Allowing users to advance without completing the current step leads to incomplete submissions.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Static step order:</strong> Hard-coded step sequence doesn&apos;t support conditional branching. Predicate-based skip logic is essential.</HighlightBlock>
          <li><strong>No persistence:</strong> Losing progress on page reload is a major UX issue for multi-page flows that take minutes to complete.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle parallel steps (two branches that can be completed in any order)?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Model the stepper as a directed acyclic graph (DAG) instead of a linear
              sequence. Each step has a list of prerequisites. A step becomes available
              when all prerequisites are completed. The UI renders branches visually
              with merge points.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement auto-save during each step?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: Each step&apos;s form data is debounced-saved to localStorage at 500ms
              intervals. On step navigation, the data is flushed to the server. If the
              user returns, the auto-saved data is pre-populated into the form fields.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you show estimated time remaining?</p>
            <p className="mt-2 text-sm">
              A: Track the time spent on each completed step. Calculate average time per
              remaining step. Display &quot;~5 minutes remaining&quot; in the stepper
              header. Update as steps are completed.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle stepper localization (RTL languages)?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Use CSS logical properties (<code>inline-start</code> instead of
              <code>left</code>). The stepper direction flips automatically in RTL mode.
              Step numbers remain left-to-right (1 → 2 → 3) but the visual flow
              reverses.
            </HighlightBlock>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/progress-indicators/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Progress Indicators
            </a>
          </li>
          <li>
            <a href="https://xstate.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              XState — State Machines for UI Flows
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/stepper/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Stepper Pattern (Emerging)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
