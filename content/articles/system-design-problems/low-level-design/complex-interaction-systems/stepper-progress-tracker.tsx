"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function StepperProgressTrackerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
          The hard problems are: state shared
          across pages (so navigation doesn&rsquo;t
          lose progress); reflecting backend-driven
          state (a fulfillment step completes
          server-side; tracker updates); branching
          flows; deep-link to a specific step;
          accessibility for the visual tracker.
        </p>

        <h3>User Context</h3>
        <p>
          End users see their progress through a
          flow (checkout, onboarding, order
          tracking). Engineering teams plug in:
          define steps and their completion
          conditions; runtime renders.
        </p>

        <h3>Assumptions</h3>
        <p>
          State persists in URL or server.
          Steps may complete via user action or
          via async backend events. Modern
          browsers.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement form wizards on
          one page (separate Wizard subsystem).
          We do not implement detailed state
          machines for complex flows (that&rsquo;s
          the State Machine for Workflows
          subsystem).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Branching steps (different paths
          depending on condition). Sub-steps
          within a step. Expandable details per
          step (show what happened). Skip
          option for optional steps. Real-time
          tracker (e.g. order shipping status
          updates live). Estimated time
          remaining.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Form-wizard mechanics (separate). Step
          authoring tools.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Tracker renders quickly. State
          updates from backend events render
          smoothly.
        </p>

        <h3>Reliability</h3>
        <p>
          State persists across page refresh.
          Backend events apply
          deterministically. Click navigation
          to completed step works.
        </p>

        <h3>Security</h3>
        <p>
          Server enforces step access. Step
          content data sanitized.
        </p>

        <h3>Accessibility</h3>
        <p>
          Tracker as an ordered list. Each
          step labeled with state. Current
          step has
          <code> aria-current=&quot;step&quot;</code>.
          Click navigation has proper button
          semantics.
        </p>

        <h3>Maintainability</h3>
        <p>
          Step definitions declarative. State
          source pluggable (URL, server).
          Renderer skinnable.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/stepper-progress-tracker-architecture.svg"
        alt="Stepper / Progress Tracker Architecture"
        caption="Step definitions + State source (URL or server-backed) → Stepper renderer (horizontal or vertical) → Visual states (pending / current / complete / error). Backend events update states; click navigation to completed steps; deep-link via URL."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system has three parts:
          <strong> step model</strong> (declarative
          definition of steps), <strong>state
          source</strong> (where step state
          lives — URL, server, or both), and
          <strong> renderer</strong> (visual
          tracker).
        </p>
        <p>
          The <strong>step model</strong> is an
          ordered array. Each step has{" "}
          <code>{` { id, label, description?, completionRule } `}</code>.
          The completion rule may be a static
          flag, a derivation from app state,
          or a backend event listener.
        </p>
        <p>
          The <strong>state source</strong> can
          be URL-based (current step encoded in
          URL), server-backed (state in
          backend; client subscribes), or
          hybrid. For checkout, URL works:
          /checkout/payment, /checkout/review,
          /checkout/done. For order tracking,
          server-backed works: subscribe to
          order events.
        </p>
        <p>
          On <strong>render</strong>: each step
          shows its state. Pending: outline.
          Current: emphasized. Complete: filled
          with check. Error: red with icon.
          Connectors between steps show
          progression (filled or empty).
        </p>
        <p>
          On <strong>click a completed step</strong>:
          navigate back to that page (using the
          host router). The tracker updates
          to reflect that step as
          &ldquo;current&rdquo; again, with
          subsequent steps still marked
          complete (allowing forward
          navigation without redoing).
        </p>
        <p>
          On <strong>backend event</strong>:
          subscribe to relevant events (e.g.
          &ldquo;order.shipped&rdquo;,
          &ldquo;payment.confirmed&rdquo;).
          Mark the corresponding step complete
          when the event arrives. UI updates
          smoothly.
        </p>
        <p>
          <strong>Branching</strong>: a step&rsquo;s
          next step is computed from a
          resolver. The tracker shows the
          current path; alternate paths show
          dimmed or hidden.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>StepperProvider</strong>{" "}
          instantiates state source.
          <strong> Stepper</strong> renders the
          tracker. <strong>Step</strong>{" "}
          renders one step.
          <strong> Connector</strong> renders
          the line between steps.
          <strong> StateSource</strong>{" "}
          (URL-based, server-backed, or
          hybrid).
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Step states in external store
          (mirrored from URL or server).
          Subscribers (steps) read via
          selectors. Backend events update
          via dispatch.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Step definition:{" "}
          <code>{` { id, label, completionRule, navigateTo? } `}</code>.
          State shape:{" "}
          <code>{` { stepId: status } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Tracker renders quickly (small
          component). Backend events batched.
          Memoized step renders.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Clear visual hierarchy. Current step
          emphasized. Completed steps
          clickable. Errors highlighted.
          Mobile: collapses to compact &ldquo;Step
          2 of 5&rdquo; chip. Desktop: full
          stepper.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Use{" "}
          <code>{`<ol>`}</code> for steps with
          <code> aria-current=&quot;step&quot;</code>{" "}
          on the current. Each step is a
          link/button if navigable. State
          included in accessible name
          (&ldquo;Payment, complete&rdquo;).
          Live region announces state changes.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server enforces access. Click-back
          navigation respects authorization.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for state derivation.
          Integration: navigate forward,
          back; backend event updates step;
          deep-link. Accessibility tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User deep-links to a step they haven&rsquo;t
          reached: redirect to the earliest
          incomplete step with banner. Backend
          event arrives for an unknown step:
          ignore. Branching path changes
          mid-flow: re-render with new path.
          Error in a step: surface clearly
          with retry. Concurrent updates from
          multiple sources: last-write-wins
          by timestamp.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Pattern reuses for any sequential
          flow: checkout, onboarding, order
          tracking, application processing.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Step labels via i18n. State words
          (&ldquo;complete&rdquo;,
          &ldquo;current&rdquo;) translated.
          Counts via Intl. RTL flips
          horizontal layout.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>URL vs server-backed state</h3>
        <p>
          URL is simple, shareable, refresh-
          safe; works for client-driven flows.
          Server-backed handles async backend
          state. Hybrid covers both. Choose
          per use case.
        </p>

        <h3>Click-back navigation</h3>
        <p>
          Allowing click-back to completed
          steps is user-friendly but
          requires careful state handling
          (don&rsquo;t lose forward progress).
          Some flows disable it for
          irreversible steps (a paid
          checkout step shouldn&rsquo;t be
          editable).
        </p>

        <h3>Branching display</h3>
        <p>
          Show only the current path: clean
          but loses context. Show all paths
          dimmed: clearer but visually busy.
          Default to showing only current;
          alternate paths surface on hover.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          ETA per step. Visual celebration on
          completion. AI-suggested next steps.
          Real-time progress for long-running
          steps with progress bars.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does this differ from
          the Wizard?</strong> Wizard is
          single-page with all steps; this
          stepper is multi-page or async,
          showing progress across navigation
          or backend events.
        </p>

        <p>
          <strong>2. How is state
          persisted?</strong> URL for
          client-driven flows; server-backed
          for async/backend-driven; hybrid
          for both.
        </p>

        <p>
          <strong>3. How are backend events
          integrated?</strong> Subscribe to
          relevant events; update step
          state on arrival; UI re-renders.
        </p>

        <p>
          <strong>4. How does click-back
          navigation work?</strong> Click a
          completed step navigates via the
          host router. Tracker updates
          current to that step; subsequent
          stays complete to allow forward
          re-navigation.
        </p>

        <p>
          <strong>5. How is branching
          handled?</strong> Resolver computes
          next step from state. Tracker
          shows current path; alternates
          dimmed or hidden.
        </p>

        <p>
          <strong>6. How is this
          accessible?</strong> Ordered list
          with{" "}
          <code>aria-current=&quot;step&quot;</code>;
          state in accessible name; live
          region announces transitions.
        </p>

        <p>
          <strong>7. What happens on deep-link
          to an unreached step?</strong>{" "}
          Redirect to earliest incomplete
          step with a banner explaining.
          Server validates access.
        </p>

        <p>
          <strong>8. How does the mobile
          variant differ?</strong> Compact
          &ldquo;Step 2 of 5&rdquo; chip
          replacing the full visual tracker
          to save space; full tracker
          available via expand.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A stepper / progress tracker is{" "}
          <strong>step model + URL or
          server-backed state + visual
          tracker with state per step</strong>.
          Click-back navigation honors
          irreversibility. Backend events
          drive async progress. The pattern
          works for checkouts, onboarding,
          and order tracking alike.
        </p>
      </section>
    </ArticleLayout>
  );
}
