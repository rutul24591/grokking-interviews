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
    "LLD for a stepper/progress tracker that works across async multi-page flows: state model, persistence, deep linking, accessibility.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "stepper-progress-tracker",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-05-04",
  tags: ["lld", "stepper", "progress-tracker", "state-machine", "react"],
  relatedTopics: [
    "wizard-multi-step-form",
    "form-builder",
    "real-time-data-dashboard",
  ],
};

export default function StepperProgressTrackerArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Stepper Progress Tracker</h1><h2>Definition &amp; Context</h2><p>Design a Stepper Progress Tracker is an implementation-heavy interaction design covering step graph, transition gates, conditional branches, async validation, back policy, URL sync, persistence, and accessibility. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Treat steps as a directed graph. Keep current step, reachable path, completed set, and async validation generation separate. Core structures: step graph, current id, reachable ids, completed set, validation generation, draft version, URL projection, dirty state, and focus target.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/stepper-progress-tracker-runtime.svg" alt="Design a Stepper Progress Tracker runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a stepper / progress
          tracker — the visual representation of
          multi-step progress across a user&rsquo;s
          journey. Unlike the Wizard (which lives
          on one page with all steps), this
          stepper works across async multi-page
          flows: a checkout that visits three
          different pages, an onboarding that
          spans days, an order tracker showing
          live shipment status. The tracker must
          persist state across pages, reflect
          remote progress, and remain accessible.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: state shared
          across pages (so navigation doesn&rsquo;t
          lose progress); reflecting backend-driven
          state (a fulfillment step completes
          server-side; tracker updates); branching
          flows; deep-link to a specific step;
          accessibility for the visual tracker.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users see their progress through a
          flow (checkout, onboarding, order
          tracking). Engineering teams plug in:
          define steps and their completion
          conditions; runtime renders.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          State persists in URL or server.
          Steps may complete via user action or
          via async backend events. Modern
          browsers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement form wizards on
          one page (separate Wizard subsystem).
          We do not implement detailed state
          machines for complex flows (that&rsquo;s
          the State Machine for Workflows
          subsystem).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Render N steps as a horizontal or
          vertical visual tracker. Each step has
          a state: pending, current, complete,
          error. Visual progression: completed
          steps marked, current emphasized.
          Click a completed step to navigate
          back. State persists across pages
          (URL or server-backed). Backend events
          update step states (async completion).
          Accessibility: each step is identifiable
          by screen readers.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Branching steps (different paths
          depending on condition). Sub-steps
          within a step. Expandable details per
          step (show what happened). Skip
          option for optional steps. Real-time
          tracker (e.g. order shipping status
          updates live). Estimated time
          remaining.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Form-wizard mechanics (separate). Step
          authoring tools.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Tracker renders quickly. State
          updates from backend events render
          smoothly.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          State persists across page refresh.
          Backend events apply
          deterministically. Click navigation
          to completed step works.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Server enforces step access. Step
          content data sanitized.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Tracker as an ordered list. Each
          step labeled with state. Current
          step has
          <code> aria-current=&quot;step&quot;</code>.
          Click navigation has proper button
          semantics.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Step definitions declarative. State
          source pluggable (URL, server).
          Renderer skinnable.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The system has three parts:
          <strong> step model</strong> (declarative
          definition of steps), <strong>state
          source</strong> (where step state
          lives — URL, server, or both), and
          <strong> renderer</strong> (visual
          tracker).
        </HighlightBlock>
        <p>
          The <strong>step model</strong> is an
          ordered array. Each step has{" "}
          <code>{` { id, label, description?, completionRule } `}</code>.
          The completion rule may be a static
          flag, a derivation from app state,
          or a backend event listener.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The <strong>state source</strong> can
          be URL-based (current step encoded in
          URL), server-backed (state in
          backend; client subscribes), or
          hybrid. For checkout, URL works:
          /checkout/payment, /checkout/review,
          /checkout/done. For order tracking,
          server-backed works: subscribe to
          order events.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>render</strong>: each step
          shows its state. Pending: outline.
          Current: emphasized. Complete: filled
          with check. Error: red with icon.
          Connectors between steps show
          progression (filled or empty).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>click a completed step</strong>:
          navigate back to that page (using the
          host router). The tracker updates
          to reflect that step as
          &ldquo;current&rdquo; again, with
          subsequent steps still marked
          complete (allowing forward
          navigation without redoing).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>backend event</strong>:
          subscribe to relevant events (e.g.
          &ldquo;order.shipped&rdquo;,
          &ldquo;payment.confirmed&rdquo;).
          Mark the corresponding step complete
          when the event arrives. UI updates
          smoothly.
        </HighlightBlock>
        <p>
          <strong>Branching</strong>: a step&rsquo;s
          next step is computed from a
          resolver. The tracker shows the
          current path; alternate paths show
          dimmed or hidden.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial"><strong>StepperProvider</strong></Highlight>{" "}
          instantiates state source.
          <strong> Stepper</strong> renders the
          tracker. <strong>Step</strong>{" "}
          <Highlight tier="important">renders one step.
          <strong> Connector</strong> renders
          the</Highlight> line between steps.
          <strong> StateSource</strong>{" "}
          (URL-based, server-backed, or
          hybrid).
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Step states in external store
          (mirrored from <Highlight tier="important">URL or server).
          Subscribers (steps) read</Highlight> via
          selectors. Backend events update
          via dispatch.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Step definition:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, label, completionRule, navigateTo? } `}</code>
          </Highlight>
          . State shape: <code>{` { stepId: status } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Tracker renders <Highlight tier="important">quickly (small
          component). Backend events batched.</Highlight>
          Memoized step renders.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Clear visual hierarchy. Current step
          emphasized. Completed steps
          <Highlight tier="important">clickable. Errors highlighted.
          Mobile: collapses to</Highlight> compact &ldquo;Step
          2 of 5&rdquo; chip. Desktop: full
          stepper.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Use{" "}
          <code>{`<ol>`}</code> for steps with
          </Highlight><code> aria-current=&quot;step&quot;</code>{" "}
          on the current. Each step <Highlight tier="important">is a
          link/button if navigable. State</Highlight>
          included in accessible name
          (&ldquo;Payment, complete&rdquo;).
          Live region announces state changes.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces access. Click-back
          navigation respects{" "}
          <Highlight tier="important">authorization</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for state derivation.
          <Highlight tier="important">Integration: navigate forward,
          back; backend event</Highlight> updates step;
          deep-link. Accessibility tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Branching path changes
          mid-flow: re-render with new path.
          Error in a step: surface clearly</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">with retry. Concurrent updates from
          multiple sources: last-write-wins
          by timestamp.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses for <Highlight tier="important">any sequential
          flow: checkout, onboarding, order</Highlight>
          tracking, application processing.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Step labels via i18n. State <Highlight tier="important">words
          (&ldquo;complete&rdquo;,
          &ldquo;current&rdquo;) translated.
          Counts via</Highlight> Intl. RTL flips
          horizontal layout.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>URL vs server-backed state</h3>
        <HighlightBlock as="p" tier="important">
          URL is simple, shareable, refresh-
          safe; works for client-driven flows.
          Server-backed handles async backend
          state. Hybrid covers both. Choose
          per use case.
        </HighlightBlock>

        <h3>Click-back navigation</h3>
        <HighlightBlock as="p" tier="crucial">
          Allowing click-back to completed
          steps is user-friendly but
          requires careful state handling
          (don&rsquo;t lose forward progress).
          Some flows disable it for
          irreversible steps (a paid
          checkout step shouldn&rsquo;t be
          editable).
        </HighlightBlock>

        <h3>Branching display</h3>
        <HighlightBlock as="p" tier="important">
          Show only the current path: clean
          but loses context. Show all paths
          dimmed: clearer but visually busy.
          Default to showing only current;
          alternate paths surface on hover.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          ETA per step. Visual celebration on
          <Highlight tier="important">completion. AI-suggested next steps.
          Real-time progress</Highlight> for long-running
          steps with progress bars.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Treat steps as a directed graph. Keep current step, reachable path, completed set, and async validation generation separate.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/stepper-progress-tracker-recovery.svg" alt="Design a Stepper Progress Tracker recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Navigation is local but gated. Persisted draft version is authoritative for resume. Scale pressure comes from dynamic branches, stale URLs, validation races, resumed drafts, removed steps, and back navigation. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: branch graph and stale-validation rejection</h3><p>Model steps as a directed graph with a reachable path, current id, completed set, draft version, and validation generation. Conditional branches recompute reachability. Ignore stale async validation, redirect stale URLs, preserve drafts, and focus the first actionable error.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, discard stale validation, redirect stale URLs, recompute reachable paths, preserve drafts, and focus actionable errors.</p><h3>Graph evaluation and draft recovery</h3><p>Keep step definitions versioned and evaluate reachability from the current draft snapshot. A branch change may remove later steps; clear their completion projection only after deciding whether hidden answers remain valid for future branch reversal. Each async validation carries a generation and draft version. Ignore completions for older input and prevent a stale browser URL from bypassing prerequisites.</p><p>Persist drafts independently from navigation. Resume loads the draft version, recomputes the reachable path, chooses the nearest valid current step, and explains any migration caused by a changed flow definition. Use semantic nav markup, aria-current for the active step, actionable error focus, and a summary for users who navigate with assistive technology.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat steps as a directed graph. Keep current step, reachable path, completed set, and async validation generation separate.</p><h3>What breaks at scale?</h3><p>dynamic branches, stale URLs, validation races, resumed drafts, removed steps, and back navigation.</p><h3>What consistency applies?</h3><p>Navigation is local but gated. Persisted draft version is authoritative for resume.</p><h3>How do you recover?</h3><p>discard stale validation, redirect stale URLs, recompute reachable paths, preserve drafts, and focus actionable errors.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}