"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-wizard-multi-step-form",
  title: "Design a Wizard / Multi-step Form",
  description:
    "LLD for a multi-step Wizard preserving state across steps, validating per step, supporting branching, deep links, and resumable flows in React/Next.js.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "wizard-multi-step-form",
  wordCount: 7000,
  readingTime: 37,
  lastUpdated: "2026-04-29",
  tags: ["lld", "wizard", "multi-step", "forms", "state-machine", "react"],
  relatedTopics: [
    "form-builder",
    "form-validation-engine",
    "draft-persistence-system",
    "stepper-progress-tracker",
  ],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Wizard Multi-Step Form System</h1><h2>Definition &amp; Context</h2><p>Design a Wizard Multi-Step Form System is an implementation-heavy low-level design problem covering step graph, per-step validation, async gates, autosave, resumability, conditional routing, URL recovery, and idempotent submission. A principal-level answer must explain state ownership, durable boundaries, lifecycle cleanup, failure recovery, privacy, cost, and observability.</p><p>Treat the wizard as a directed workflow. Field values, reachable steps, active step, validation generations, draft version, and final submit state are distinct. The core structures are step graph, field map, reachable route, active step id, validation map, async generations, draft version, autosave timer, idempotency key, and receipt.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/wizard-multi-step-form-runtime.svg" alt="Design a Wizard Multi-Step Form System runtime" caption="Topic-specific runtime from input intent through validated durable state." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a wizard runtime: a system that takes a long
          form and presents it as a sequence of focused, validated
          steps with persistent accumulated state, branching paths,
          deep-linkable URLs, and resumable sessions. The wizard
          backbone is an orchestrator — it sits on top of the
          form-runtime layer (Form Builder or hand-written form),
          providing the macro-flow that the form underneath
          doesn&rsquo;t need to know about. The contract is
          straightforward but the interactions are not: users go
          forward and back, edit prior steps, paste shared deep links,
          reload mid-task, switch devices, and occasionally close the
          tab. The wizard must keep all of those scenarios coherent.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Wizards are the right pattern for any data collection that
          would overwhelm users in a single page — onboarding,
          KYC/identity verification, multi-page applications, complex
          checkouts, configuration flows. The architectural test is
          whether the implementation survives the messy real-world
          interactions: a user who fills three steps, navigates back
          to edit step one in a way that changes branching, then
          navigates forward expecting to skip a step that&rsquo;s no
          longer relevant; a user who pastes
          <code> /onboard/step/3</code> directly into the address bar;
          a user who reloads the tab on step four and expects to
          land back exactly where they were. Done badly, wizards
          become memory leaks of partial state, frustrating
          back-button behavior, and unpredictable URL routing. Done
          well they are an accessibility win (smaller cognitive load
          per step) and a conversion win (resumability, progress
          visibility, lower drop-off).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          The end user is the primary persona, and they are the most
          demanding stakeholder. They use wizards on mobile and
          desktop, often interrupted by phone calls, notifications,
          or context switches; they expect to come back to where
          they left off, they expect the back button to do the
          right thing, and they expect deep links to work the way
          deep links work everywhere else on the web. Internal
          stakeholders include product managers and growth teams who
          care about step-level analytics, A/B testing of step
          ordering, and easily adding or removing steps without
          engineering rework. Engineers consume the wizard runtime
          through a small API surface and plug step content as
          ordinary React components; they don&rsquo;t want to think
          about state machines, URL reconciliation, or resumability
          in their per-step code.
        </HighlightBlock>
        <p>
          Data sources vary by product. Some wizards collect
          everything client-side and submit at the end with one
          large payload (a survey, a configuration form). Others
          persist progress server-side after each step because a
          step depends on a server-validated computation from the
          previous (a checkout that needs a server-validated
          shipping calculation before showing payment options). The
          runtime treats both as configuration, not as separate code
          paths — server-bound steps are described declaratively
          and the runtime handles the request/response lifecycle.
        </p>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Three to ten steps per wizard, with each step containing
          five to twenty fields. Branching exists: an answer at step
          two may change which steps remain. The URL is the source
          of truth for the current step (
          <code>/onboard/identity</code>, <code>/onboard/address</code>)
          so refresh, share, and browser back/forward all work the
          way users expect. A draft persistence layer (separate
          subsystem documented elsewhere) is available for local
          resumability, and an authenticated user has access to a
          server-side draft for cross-device continuation. Step
          content may include heavy components (rich text, file
          upload, address autocomplete) and we want to lazy-load
          them so the initial bundle stays small. The form runtime
          underneath the wizard already has fields, validators, and
          conditional logic; the wizard composes on top, never
          duplicates that machinery.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          Field-level rendering, per-field validation, and
          conditional field logic are delegated to the form runtime
          (Form Builder) the wizard sits on top of; we don&rsquo;t
          duplicate that machinery. Cross-device session
          continuation is out of scope at this layer — it is
          provided by the auth and draft systems and the wizard
          consumes their output via well-defined interfaces. We do
          not implement a visual flow editor; step graphs are
          authored as data either in code or in a separate authoring
          tool. Real-time collaboration on a single wizard
          instance (two users editing the same flow concurrently)
          is also out of scope; that&rsquo;s a different problem
          requiring CRDTs.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          The runtime must support sequential navigation — Next,
          Back, and Skip when configured — and enforce a per-step
          validation gate before advancing. Users go Back at any
          time without losing accumulated input; the backbone of
          the wizard is the invariant that no navigation, including
          Back across many steps, can lose work the user has already
          done. The runtime must support branching where the next
          step is computed from current values via a small resolver
          function on each step. Steps must be deep-linkable:
          pasting <code>/onboard/payment</code> into the address bar
          should land on that step if all prior steps are valid, and
          should redirect to the earliest invalid step otherwise.
          A progress indicator (Stepper) reflects completed,
          current, and disabled (unreachable) states with
          consistent semantics. The wizard resumes after reload by
          rehydrating from a draft. The final step is a review with
          submission, and submission is idempotent so retries on
          slow networks do not duplicate.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Step-level autosave on Next means a user who reloads
          mid-flow lands on the last completed step rather than the
          step before it. Animated step transitions give the wizard
          a polished feel without becoming jarring. A
          server-driven step graph — the schema arrives from a
          configuration service rather than living in code — unlocks
          experimentation: growth teams can A/B test step orderings
          or insert/remove conditional steps without a deploy.
          Per-step analytics events for funnel analysis are emitted
          from the wizard core so consumers don&rsquo;t have to wire
          them per step. A built-in &ldquo;jump back to a specific
          step&rdquo; affordance from the review step gives users
          confidence about going back to fix things without losing
          their place.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Visual schema/flow editor, dashboards, real-time
          collaboration on a wizard, and AI-assisted step
          completion are explicitly out of scope. Each is a
          significant subsystem in its own right; folding them into
          the wizard backbone would create a monolith that
          can&rsquo;t evolve.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Step transitions must feel instant — under approximately
          100 ms of script and layout work. Only the active step is
          mounted at any time, so total DOM stays small regardless
          of step count; this is what keeps wizards with twenty
          conditional steps performing the same as wizards with
          three. Step components lazy-load on demand via
          <code> React.lazy</code>, with the next likely step
          prefetched on idle so the user never sees a Suspense
          fallback during normal forward navigation. Initial
          paint of the first step happens as part of the page&rsquo;s
          regular SSR/SSG render in Next.js, so the first useful
          paint is well under 1.5 s on a mid-tier network.
        </HighlightBlock>

        <h3>Scalability</h3>
        <HighlightBlock as="p" tier="important">
          The architecture is independent of step count: memory and
          DOM cost are O(active step), not O(total steps). The
          branching graph is evaluated lazily at transition time, so
          wide branching factors don&rsquo;t affect mount time. Adding
          a new step to a 10-step wizard has the same cost as
          adding a new step to a 3-step wizard.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Reload preserves state via draft hydration. Submission is
          idempotent through a client-generated request id (UUID
          v7) so server-side retries dedupe. Navigation is robust
          to fast clicking — a user who Next-clicks twice in a row
          before the first transition resolves doesn&rsquo;t end up
          two steps ahead or in an inconsistent state, because the
          state machine treats the second event as an idempotent
          no-op when the first transition is already in flight.
          Browser Back and Forward keep the URL and the rendered
          step in lockstep; we never see the URL on step 4 with
          step 3 rendered.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Sensitive steps (payment, identity numbers, personal
          health information) are excluded from local draft
          persistence by configuration; their values live only in
          memory unless an explicit server-side encrypted draft
          endpoint is configured. Branch decisions are advisory
          on the client and re-validated server-side at submission
          — never trust a client to enforce business eligibility.
          Server-bound steps attach CSRF tokens at the fetch layer
          and use idempotency keys.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          The Stepper is a navigation landmark with
          <code> aria-current=&quot;step&quot;</code> on the active
          item. Step transitions move focus to the step heading
          (not to the first input — focusing an input on entry
          skips the heading and disorients screen reader users)
          and announce step number and title via a polite live
          region. Buttons are labeled with destinations rather
          than generic &ldquo;Next&rdquo; (e.g. &ldquo;Continue to
          Address&rdquo;) so screen reader users have context.
          Disabled future steps in the Stepper are not focusable;
          clickable only when reachable. Animations respect
          <code> prefers-reduced-motion</code> and degrade to a
          one-frame swap.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <p>
          Step definitions are colocated with their content,
          declarative, and easy to reorder or branch. Adding a new
          step is a one-file change. Branching predicates are pure
          functions of the form values; there are no hidden side
          effects. The state machine&rsquo;s transitions are
          unit-testable in isolation, which is the maintenance
          property that pays off as the flow grows.
        </p>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <p>
          The wizard is modeled as a finite state machine layered on
          top of a single shared form store. Three architectural
          choices reinforce each other across the design:
          <strong> a state machine for navigation</strong>,
          <strong> a shared form store for accumulated values</strong>,
          and <strong>the URL as the reconciliation source of
          truth</strong>. None of these is novel on its own; their
          interaction is what makes the wizard feel native to the
          web while staying tractable as the flow grows.
        </p>
        <HighlightBlock as="p" tier="important">
          The state machine&rsquo;s states are the step ids plus
          terminal states (<code>review</code>,
          <code> submitting</code>, <code>success</code>,
          <code> error</code>); its events are
          <code> NEXT</code>, <code>BACK</code>, <code>SKIP</code>,
          <code> JUMP_TO(step)</code>, <code>SUBMIT</code>,
          <code> ABORT</code>. Transitions are guarded by per-step
          validators that resolve to a boolean (or to a Promise
          for async-validated steps); branching is encoded as a
          <code> next(values)</code> resolver on each step that
          returns the id of the next state. The machine is the
          only authority for &ldquo;what step are we on?&rdquo; —
          components read it, never duplicate it. The form store,
          shared across all steps and held above the wizard, is
          what makes Back lossless and the review step trivial:
          values for previous steps remain in memory after their
          components unmount because the store outlives the
          component lifecycle. This is the smallest set of moving
          parts that handles branching, deep linking, and
          resumability cleanly.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>mount</strong>, the runtime initializes in a
          specific order so that hydration and reconciliation
          don&rsquo;t conflict. First, it asks the draft adapter for
          any saved state and merges it with provided
          <code> initialValues</code> into the form store before
          the children render — this means the first paint is
          consistent rather than flashing initial values then
          replacing them. Second, it reads the active step from
          the URL and asks the state machine
          <code> canEnter(stepId)</code>: the machine consults the
          per-step validators against the rehydrated values and
          decides whether the requested step is reachable. If it
          is, the machine enters that state. If not, the machine
          enters the earliest valid step and the runtime
          imperatively redirects via the Next.js router with a
          query parameter noting why
          (<code>?from=invalid_prior_step</code>) so the
          destination step can render an explanatory banner.
          Third, the runtime subscribes to the broadcast channel
          for cross-tab consistency. All of this happens before the
          first interactive frame, so users see the correct step
          on first paint without flicker.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>Next click</strong>, the runtime asks the
          underlying form layer to validate the fields belonging to
          the current step. The form layer already maintains errors
          per field; the wizard just queries them via
          <code> getStepValidity(stepId)</code>. If all fields are
          valid and no async validator is pending, the machine
          dispatches <code>NEXT</code>; the resolver chooses the
          next state by consulting the current values; the URL
          updates through the Next.js router (using
          <code> router.push</code> for forward navigation so the
          history stack reflects the wizard&rsquo;s sequence); the
          StepShell unmounts the active component (after capturing
          a scroll/focus checkpoint) and mounts the next one
          (restoring its checkpoint if it had one). If validation
          fails, the runtime focuses the first errored field and
          the navigation is aborted — no transition takes place,
          no URL change, the machine stays in its current state.
          This single path is what makes navigation predictable
          even under fast clicking: every Next is a guarded
          transition, and the guard is the source of truth for
          whether the user can proceed.
        </HighlightBlock>
        <p>
          On <strong>Back</strong>, the machine pops its history
          stack and dispatches a <code>BACK</code> event. The URL
          updates via <code>router.back()</code> when possible (so
          browser history stays coherent) or
          <code> router.push</code> for the rare case where we need
          to land on a step that&rsquo;s not in the history (e.g.
          jumping back from review to an arbitrary step). Form
          values for the prior step are already in the store —
          they were never removed — so the prior step component
          mounts and reads its existing values via the form
          runtime&rsquo;s selectors. We deliberately do not clear
          values when leaving a step forward, because that would
          make Back a destructive operation and users would lose
          work in the common case of going back to double-check.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>Edit-and-branch-divergence</strong> — the
          subtlest correctness concern — the user goes back and
          edits a prior step whose answer gates a branching
          decision. Downstream steps may now be unreachable, and
          the form store may already contain values for those
          steps that are no longer in the flow. The machine detects
          this on the next forward transition: when entering a
          step from the affected ancestor, it recomputes the
          future-step path from the resolver chain; if the path
          differs from the recorded path, it surfaces an explicit
          warning (&ldquo;You changed an answer that affects later
          steps; some answers may need to be re-entered&rdquo;)
          and clears values for orphaned steps from the store.
          Doing this implicitly without warning would silently
          lose user work; doing it not at all would silently
          submit stale answers from a dead branch. We surface the
          consequence so the user can confirm.
        </HighlightBlock>
        <p>
          On <strong>deep link</strong> from the address bar, the
          runtime treats the URL as a request rather than a
          command. It reads the requested step, asks the machine
          <code> canEnter(stepId)</code>, and either jumps there
          or redirects with the explanation parameter. Rehydration
          from local draft happens before this check because the
          rehydrated values are what determine reachability. If
          the user pastes a URL to step 4 but the local draft only
          has step 1 filled in, the machine refuses step 4 and
          lands them on step 2 (the earliest invalid step) with a
          banner explaining what happened.
        </p>
        <p>
          On <strong>reload</strong>, the runtime mounts as if from
          scratch — but the draft adapter loads the most recent
          saved state, including which step was last completed and
          the accumulated values. The runtime can either land on
          the last completed step (for a &ldquo;keep going&rdquo;
          UX) or on the user&rsquo;s last-active step if that data
          is in the snapshot. We default to the last-active because
          it matches user expectation, but we surface a banner
          (&ldquo;Restored from 12 minutes ago&rdquo;) so the user
          knows what happened and can choose Discard.
        </p>
        <p>
          On <strong>cross-tab</strong>, a
          <code> BroadcastChannel</code> named after the wizard&rsquo;s
          form id propagates significant events: when tab A
          advances to a new step, tab B receives the broadcast and
          reconciles; when tab A successfully submits, tab B
          locks itself into a read-only state with a link to the
          submission. This avoids the failure mode where a user
          submits in one tab and continues editing in another,
          producing a phantom second submission with stale values.
          The deviceId in each broadcast prevents loops where the
          originating tab also receives its own message.
        </p>
        <HighlightBlock as="p" tier="crucial">
          On <strong>submit</strong>, the runtime enters the
          <code> submitting</code> state. It validates the entire
          form one last time (because nothing prevents an
          intermediate state from being technically invalid even
          though we gated each step), strips values from steps
          hidden by branching, generates a UUID v7 idempotency
          key, and fires the network request. While submitting,
          the UI locks navigation (no Back, no Edit) so the user
          can&rsquo;t mutate state mid-submission. On success, the
          machine transitions to <code>success</code>, broadcasts
          a <code>submitted</code> event for cross-tab locking,
          and clears the local draft. On a structured server-error
          response, it merges field errors into the form store via
          the underlying validation engine and returns to the
          step containing the offending field, with a banner at
          the top explaining the rejection. On network failure,
          it returns to <code>review</code> with a retry banner.
          The idempotency key persists so retries dedupe at the
          server even across reloads.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <strong>WizardProvider</strong> instantiates the state
          machine and the shared form store and exposes them
          through stable refs in a React Context. The Context value
          is references, not state — consumers don&rsquo;t re-render
          on form changes; they subscribe via selector hooks. The
          Provider also owns the lifecycle pieces that span the
          whole wizard: mount-time URL reconciliation, draft
          rehydration, broadcast channel subscription, telemetry
          emission. Like a form provider it does not render anything
          except its children, and it cleans up on unmount so
          unmounting and remounting the whole wizard works
          predictably.
        </HighlightBlock>
        <p>
          <strong>StepRouter</strong> bridges the URL to the
          machine. It reads the active route segment via the
          Next.js <code>usePathname</code> hook, calls
          <code> machine.canEnter(stepId)</code> which consults
          the resolver chain and validators, and either allows the
          entry (firing the appropriate machine event) or
          imperatively redirects via the router with a query param
          noting why. The router also intercepts browser back/forward
          (via <code>popstate</code>) and translates URL changes
          into machine events so internal history stays coherent.
          This component is the only place that reads the URL or
          calls the router; everywhere else uses machine state.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Stepper</strong> is presentational. It reads the
          machine state and produces a navigation landmark with
          completed / current / disabled affordances. Items are
          clickable only when reachable; unreachable items are not
          focusable so keyboard users don&rsquo;t hit dead ends.
          The Stepper is a substitutable component — apps can ship
          their own visual variant (numbered, dotted, compact,
          stylized) and connect it to the machine through a small
          hook (<code>useWizardSteps</code>) that returns the list
          of steps with their states. This isolation is what lets
          us evolve the visual without touching the orchestration.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>StepShell</strong> is the mount/unmount boundary
          for step content. It uses <code>React.lazy</code> with
          <code> Suspense</code> for the active step component and a
          stable skeleton fallback so layout doesn&rsquo;t shift
          during a transition. Animations (slide, fade) are wrapped
          in a motion-respecting component that becomes a no-op
          under <code>prefers-reduced-motion</code>. StepShell also
          captures and restores scroll position and focus checkpoint
          per step on transition, because mount-only-active
          rendering would otherwise drop transient state and feel
          disorienting on Back.
        </HighlightBlock>
        <p>
          <strong>NavigationControls</strong> renders Back / Next /
          Skip; the labels come from the active step (so a step can
          override &ldquo;Next&rdquo; to &ldquo;Continue to
          Payment&rdquo;). It dispatches machine events; it never
          sets state directly. The Submit button only appears on
          the review step. While the machine is in
          <code> submitting</code>, controls are disabled and a
          spinner replaces the Next/Submit button.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>ReviewStep</strong> is a built-in terminal step
          showing all collected values grouped by their originating
          step, with edit affordances that jump back to the
          relevant step via <code>JUMP_TO</code>. Submitting from
          review enters <code>submitting</code>, locks all controls,
          and on completion transitions to <code>success</code>.
          ReviewStep is a default — products can replace it with a
          custom review screen by registering their own step under
          the <code>review</code> slot.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>WizardMachine</strong> is the small custom state
          machine. We don&rsquo;t take an XState dependency for
          this because the machine is small enough to maintain
          ourselves and we want exact control over the transition
          guards (which involve async validation). The machine is a
          pure reducer plus a guarded dispatcher; it&rsquo;s a few
          hundred lines of code and exhaustively unit-testable.
        </HighlightBlock>
        <p>
          The architecture leans on three patterns. First, finite
          state machines for transition correctness — branching,
          deep-link guards, and history all become tractable.
          Second, compound components for ergonomics:
          <code> {`<Wizard.Step id="address">`}</code> and
          <code> {`<Wizard.Stepper variant="dotted">`}</code> let
          consumers wire bespoke wizards in JSX without losing the
          orchestration. Third, headless core: the visual layer
          (Stepper, NavigationControls) is fully replaceable
          without forking the runtime, and a fully custom UI can
          consume the machine via hooks if needed.
        </p>
      </section>

      <section>
        <h3>🔄 State Management Strategy</h3>
        <HighlightBlock as="p" tier="important">
          State splits into four planes that coexist without
          overlapping. <strong>Machine state</strong> — current
          step, history stack, branch decisions, per-step
          checkpoints — lives in the wizard&rsquo;s own external
          store. <strong>Form state</strong> — accumulated values
          across all visited steps, plus per-field validation
          errors — lives in the underlying form store and is
          shared across all steps. <strong>Server state</strong> —
          draft fetch/save, async validations, server-driven
          option lists — lives in React Query or SWR keyed by
          query, never duplicated into the form or wizard stores.
          <strong> Local UI state</strong> — transition animation
          flags, ephemeral focus state, hover indicators — lives
          in the components that need it via
          <code> useState</code>.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Ownership is per-instance. A
          <code> WizardProvider</code> owns its own machine and
          form store; nested wizards (rare but possible — a
          modal-mounted KYC inside a checkout, for example) get
          their own scope and don&rsquo;t conflict with the outer.
          The URL holds the current step id; the machine
          reconciles to the URL on mount and after browser
          back/forward, and pushes to the URL on programmatic
          transitions. This lets the URL be the canonical
          observable for navigation while keeping the machine
          authoritative for transition correctness.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Why two stores rather than one? The wizard machine and
          the form store have different lifecycles, different
          authoring requirements (the machine is tightly coupled
          to navigation semantics; the form store is a generic
          values bag), and different integration points (the
          machine integrates with the URL; the form store
          integrates with the validation and conditional
          engines). Folding them into a single store would
          conflate concerns and make either store harder to
          test. Two small stores with a clean interface beat one
          large one.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The trade-off here that&rsquo;s worth being explicit
          about: state machine versus ad-hoc
          <code> currentStep</code> counter. The counter approach
          is fine for two- or three-step linear flows; it falls
          apart fast when branching appears, when deep links need
          guards, or when a step needs to know its predecessor
          (e.g. &ldquo;coming from review, highlight unsaved
          changes&rdquo;). The machine pays a small one-time cost
          in setup and earns a much cleaner mental model across
          the board. The other notable trade-off is URL as truth
          versus purely in-memory step tracking: URL-as-truth
          gives shareable links, browser Back/Forward, and
          reload-safety, at the cost of needing reconciliation
          logic on mount and on browser navigation. We accepted
          the cost because the alternative breaks fundamental
          web conventions.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          Inputs to the wizard are: an array of step descriptors
          (<code>{` { id, component, validate, next?, sensitive? } `}</code>),
          an <code>initialValues</code> bag, an
          <code> onSubmit</code> handler, and optional
          <code> onStepChange</code>, <code>onAbort</code>, and
          <code> onError</code> hooks. Each step descriptor binds
          a step id to its component (a React component that
          renders the step content) and its validator (a pure
          function over current values). The optional
          <code> next</code> resolver, when present, computes the
          next step id from current values for branching. Step
          descriptors are colocated with the step components by
          convention; we keep them serializable so the same
          descriptor format works for hard-coded and server-driven
          step graphs identically.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">Each step component receives a small props bag from the
          StepShell: <code>values</code> (the current full form
          values), <code>setValue(name, value)</code>,
          <code> errors</code>, and a <code>helpers</code>
          object. The helpers object exposes
          <code> jumpToStep(id)</code>,
          <code> setFormError(message)</code>, and
          <code> markStepValidated()</code>; these cover the
          escape hatches a step might need without exposing the
          machine directly.</HighlightBlock>
<HighlightBlock as="p" tier="important">The flow is one-way: machine state
          and form state project to rendered UI; user events
          dispatch actions to either the machine (navigation) or
          the form store (values). The underlying form runtime is
          responsible for emitting field errors; the wizard reads
          them at gate time and never duplicates the validation
          pipeline. This separation is what keeps the wizard
          backbone compatible with any form runtime that
          conforms to the small contract.</HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance Strategy</h3>
        <HighlightBlock as="p" tier="important">
          Only one step is mounted at a time. Step components are
          lazy-loaded via <code>React.lazy</code>; the wizard
          prefetches the likely-next step on idle (using
          <code> requestIdleCallback</code> or a setTimeout
          fallback) so the transition feels instant when the user
          clicks Next. The shell renders a stable skeleton during
          Suspense fallback so layout does not shift. Suspense
          fallbacks are sized to the expected step content rather
          than collapsed, which keeps the page from jumping during
          load.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Animations use CSS transitions or the View Transitions
          API where available. We avoid layout-thrashing
          animations by fixing the container height to the larger
          of the two steps during the transition itself — the
          height un-fixes after the new step has settled. Under
          <code> prefers-reduced-motion</code>, transitions are
          replaced with a one-frame swap. In Next.js, the page
          shell can be server-rendered with an interactive wizard
          island mounting on hydration; for an authenticated
          wizard, the server can pre-resolve the latest server
          draft and pass it as <code>initialValues</code> so the
          client mounts on the correct step in the first paint.
          This server-side rehydration eliminates the
          flash-of-step-1-then-jump-to-step-3 that pure
          client-side rehydration produces.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Step transitions are budgeted at ~100 ms total. On
          decent mid-tier devices this is comfortable; on slow
          devices the lazy-loaded chunk size becomes the dominant
          cost, which we mitigate by aggressive prefetching and by
          keeping per-step bundles small. A useful CI invariant
          is that no step component&rsquo;s bundle exceeds, say,
          50 KB gzipped — when one does, it&rsquo;s usually
          because a heavy library leaked into the per-step tree
          by accident.
        </HighlightBlock>
      </section>

      <section>
        <h3>🎨 UI/UX &amp; Interaction Design</h3>
        <HighlightBlock as="p" tier="crucial">
          A persistent Stepper sits at the top of the wizard on
          desktop, condensed to a &ldquo;Step 2 of 5&rdquo; chip
          on mobile because there isn&rsquo;t room for the full
          step list. Back never destroys data — it just returns
          to the previous state — and a Cancel/Abort affordance
          is the only way to discard. We show inline error
          summaries on Next failure with anchor links to the
          offending fields, and we scroll to the first error
          rather than just rendering an error somewhere on the
          page. Submit is only available on the review step;
          intermediate Next labels reflect the destination so
          users know what they&rsquo;re committing to before
          they click.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On long async transitions (e.g. a server-bound step
          that validates a shipping address before showing the
          next step), we render a determinate or indeterminate
          progress indicator with a Cancel option, and we disable
          the Next button to avoid double-submission. Optimistic
          transitions are fine for steps that don&rsquo;t depend
          on server state, but server-gated transitions must
          wait — racing the server tends to surface as a
          confusing flash of the wrong step that we then have to
          take back.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The review step deserves a small UX investment beyond
          &ldquo;list of values&rdquo;. We group values by
          originating step with collapsible sections, mark
          required fields that were skipped (rare but possible
          in optional flows), and put an Edit affordance next to
          each section that jumps the user back to that step
          while preserving review state. After submit success,
          we briefly show the submission confirmation in place
          before navigating away, rather than ripping the wizard
          out from under the user; the confirmation is a small
          but perceived-quality win.
        </HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          The Stepper is rendered as
          <code> {`<ol>`}</code> with each item as
          <code> {`<li>`}</code>; the active item carries
          <code> aria-current=&quot;step&quot;</code>. On every
          step change, the runtime moves focus to the step
          heading (<code>tabIndex={-1}</code>) and announces the
          new step via a polite live region; we do not focus the
          first input because that would skip past the heading
          and confuse screen reader users by depriving them of
          context. Disabled future steps in the Stepper are not
          focusable; clickable only when reachable. The submit
          confirmation modal traps focus while open and returns
          focus to the originating button on close.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">Keyboard support: every action that can be reached
          with the mouse — jumping to a previous step from the
          Stepper, editing from review, submitting, canceling —
          is reachable by Tab and operable by Enter or Space.</HighlightBlock>
<HighlightBlock as="p" tier="important">We
          test keyboard-only end-to-end flows in CI to catch
          regressions early, because keyboard regressions are
          easy to introduce and hard to notice unless you
          deliberately test for them. Screen-reader smoke tests
          run on a representative wizard once per release; we
          can&rsquo;t catch every screen-reader bug with axe-core
          alone, so the manual pass matters.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security Considerations</h3>
        <HighlightBlock as="p" tier="important">Steps marked sensitive: true are excluded from local draft persistence; their values live only in memory and, if a server-side encrypted draft endpoint is</HighlightBlock>
<HighlightBlock as="p" tier="important">configured, are sent there directly. On logout, the wizard listens for a session-end event and clears all in-memory state plus any local draft entries it</HighlightBlock>
<HighlightBlock as="p" tier="important">owns. Submit endpoints attach CSRF tokens at the fetch layer (handled outside the wizard) and use the idempotency key generated by the wizard on submit entry.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Branch
          decisions are advisory: the server re-evaluates
          branching rules at submission time and rejects payloads
          that don&rsquo;t match a valid path, preventing a
          client-side branch tampering. Schema-driven step graphs
          go through the same DSL sandboxing as the form&rsquo;s
          conditional engine — predicates are data, not arbitrary
          code, so a CMS-served step graph cannot become a
          remote-code-execution vector.</HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing Strategy</h3>
        <HighlightBlock as="p" tier="important">Unit tests cover the machine: every transition, every
          guard, every branching resolver under representative
          value permutations. The machine is a pure reducer plus
          a dispatcher, which makes exhaustive transition
          coverage feasible.</HighlightBlock>
<HighlightBlock as="p" tier="important">Integration tests mount the runtime
          with a realistic step graph and exercise: forward
          navigation with valid and invalid steps, Back
          preservation of values, deep link to a valid step,
          deep link to an unreachable step with redirect,
          branching with downstream invalidation warnings, and
          rehydration from a draft. End-to-end tests in
          Playwright run real flows in a real browser including
          reload-and-resume and cross-tab broadcast lockout,
          because synthetic events in jsdom don&rsquo;t
          faithfully model browser history APIs.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Accessibility tests verify focus management on
          transition (focus lands on the step heading) and
          live-region announcements through a stubbed assistive-
          technology API. Performance tests assert that step
          transitions stay under a long-task budget on a
          representative mid-tier device profile (we use
          Lighthouse&rsquo;s mobile throttling as a baseline).
          Regression budgets fail the CI build, which is the
          only way to keep performance from drifting.
        </HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases &amp; Failure Handling</h3>
        <HighlightBlock as="p" tier="important">Editing a prior step changes branching: the machine
          detects the diverging future path on the next
          transition and surfaces an explicit warning, clearing
          values for orphaned steps. Reload mid-step: the
          runtime rehydrates from the latest draft snapshot
          and lands on the last completed step (not the step
          the user was actively editing, because edits since
          the last debounced save may not have been persisted)
          with a banner offering to restore the in-progress
          values that <em>were</em> persisted.</HighlightBlock>
<HighlightBlock as="p" tier="important">Network failure
          on a server-gated Next: the wizard stays on the
          current step with an inline retryable error; values
          are not lost. Browser Back: we intercept the URL
          change and translate it through the machine so
          internal history stays coherent. Submission timeout:
          the idempotency key prevents double-submit on retry;
          the runtime surfaces a determinate timeout banner
          (&ldquo;Still submitting&hellip; we&rsquo;ll let you
          know shortly&rdquo;) rather than a hard failure.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          A user submits in tab A while tab B is editing: tab
          B receives a <code>form_submitted</code> broadcast
          and locks itself into a read-only review state with
          a link to view the submission. A schema or step graph
          version mismatch on rehydration triggers the upgrade
          chain or a clean-start prompt. Fast double-clicks on
          Next: the second click is an idempotent no-op because
          the machine is already mid-transition. Browser
          history with conditional steps that no longer exist
          (the user navigated through a path that&rsquo;s now
          unreachable due to edits): browser Back/Forward
          eventually targets a step that&rsquo;s no longer in
          the flow; the runtime detects this and redirects to
          the nearest valid step with an explanation. None of
          these are individually exotic; the wizard runtime
          earns its keep by handling the cumulative weight of
          all of them in one place rather than each step
          re-implementing the workarounds.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability &amp; Extensibility</h3>
        <HighlightBlock as="p" tier="crucial">Theming is design-token-driven; the Stepper component can be replaced wholesale via the registry. The wizard exposes</HighlightBlock>
<HighlightBlock as="p" tier="important">hooks for analytics, telemetry, and AI assistance to subscribe without modifying internals — the onStepChange callback</HighlightBlock>
<HighlightBlock as="p" tier="important">fires with from , to , and reason so subscribers can build a complete funnel picture without instrumenting per-step code.</HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Date and currency fields inside steps follow the same rules as elsewhere in the form runtime: format via Intl, store</HighlightBlock>
<HighlightBlock as="p" tier="important">canonical, never rely on string concatenation. For server-bound steps (e.g. a step that validates an address against a postal</HighlightBlock>
<HighlightBlock as="p" tier="important">service), the server response carries locale-aware error messages that map to the same i18n key system as client validators.</HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs &amp; Design Decisions</h3>

        <h3>State machine vs imperative routing</h3>
        <HighlightBlock as="p" tier="important">
          We chose a small finite state machine because
          branching, guarded transitions, and deep-link
          reconciliation become unmanageable in imperative code
          beyond a couple of steps. The machine costs us a
          one-time setup of states and events and a
          mental-model adjustment for new contributors; it
          earns us a single authoritative source for step
          state, exhaustively testable transitions, and the
          ability to add new branches without touching
          navigation code. For a strictly linear two-step
          flow, the machine is overkill, and a simple counter
          is more honest. We document the threshold so teams
          don&rsquo;t reach for the wizard runtime when they
          really just need a two-page form.
        </HighlightBlock>

        <h3>URL-driven vs purely in-memory step</h3>
        <HighlightBlock as="p" tier="important">
          URL-driven gives us shareable links, browser
          Back/Forward, reload-safety, and analytics URL-mapping
          for free, at the cost of needing reconciliation
          logic on mount and on browser navigation. We accepted
          the cost because the alternative breaks fundamental
          web conventions and creates a wizard that feels like
          a desktop app, not a webpage. Users who paste URLs
          expect them to work; users who hit Back expect to go
          back. Violating those conventions is a worse trade
          than the reconciliation complexity.
        </HighlightBlock>

        <h3>Mount-only-active vs keep-mounted</h3>
        <HighlightBlock as="p" tier="important">
          Mount-only-active is dramatically cheaper: DOM stays
          O(active step) instead of O(total steps), and step
          components can be lazy-loaded. The cost is that
          transient component state (focus, scroll, ephemeral
          animations, hover) needs to be checkpointed and
          restored explicitly. We bake checkpointing into the
          StepShell so step authors don&rsquo;t have to think
          about it. Keep-mounted would simplify state continuity
          but fundamentally lose the lazy-load and memory-bound
          benefits, which matter at the high end of complexity
          where wizards are most useful.
        </HighlightBlock>

        <h3>Client draft vs server draft for resumability</h3>
        <HighlightBlock as="p" tier="important">
          Client drafts (IndexedDB) are fast, work offline, and
          require no server changes; server drafts are durable
          across devices and survive local storage clearing. We
          recommend a hybrid: client draft for instant resume on
          the same device, server draft for cross-device
          continuity. Sensitive steps go to the server only
          (encrypted at rest); non-sensitive steps go to both.
          The combination is the right default because each
          store covers the other&rsquo;s blind spots, and the
          implementation cost of supporting both is moderate
          once you have the adapter layer in place.
        </HighlightBlock>

        <h3>Validate-on-Next vs continuous validation</h3>
        <HighlightBlock as="p" tier="crucial">
          Continuous validation gives immediate feedback but
          creates noisy errors before the user has even
          finished typing. Validate-on-Next (with per-field
          validate-on-blur underneath) is the better default:
          errors appear at decision points, not during input.
          The cost is that a user could fill an entire step
          and only learn at Next-time that one field was
          wrong; we mitigate by enabling on-change live
          validation for any field that has previously errored,
          which is the same invariant the form runtime uses.
          The result feels both forgiving (no premature
          errors) and helpful (errors clear in real time once
          you&rsquo;re aware of them).
        </HighlightBlock>

        <h3>Custom small machine vs XState dependency</h3>
        <p>
          XState is excellent and we&rsquo;ve used it in larger
          systems. For the wizard backbone, we chose a custom
          ~300-line machine because the surface is small,
          we want exact control over async transition guards,
          and avoiding an XState dependency keeps the bundle
          smaller for the (many) consumer apps that don&rsquo;t
          otherwise need it. If the wizard backbone grows to
          need parallel states, history nodes, or activity
          tracking, we&rsquo;ll port to XState; we&rsquo;re not
          there yet, and the custom machine is honest about
          its scope.
        </p>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">A visual flow editor for product managers would democratize wizard authoring further. Cross-device cursor (showing where the user left</HighlightBlock>
<HighlightBlock as="p" tier="important">off when they open the wizard on a different device) is a modest extension on top of server drafts. CRDT-based merge of concurrent edits</HighlightBlock>
<HighlightBlock as="p" tier="important">across devices is interesting but probably overkill for most wizard use cases — wizards aren&rsquo;t typically a multi-user experience.</HighlightBlock>
      </section>

      </section>
<section><h2>Architecture &amp; Flow</h2><p>Separate field input, typed state transitions, derived projections, persistence effects, and bounded telemetry. Draft, preview, validated, and submitted states must not collapse into one mutable object. Every debounce timer, request, storage write, worker, and subscription needs an explicit owner and cleanup path.</p><p>Treat the wizard as a directed workflow. Field values, reachable steps, active step, validation generations, draft version, and final submit state are distinct. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/wizard-multi-step-form-recovery.svg" alt="Design a Wizard Multi-Step Form System recovery" caption="Recovery flow: reject obsolete work, preserve recoverable drafts, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Independent forms are simpler for loosely related tasks; a wizard runtime is justified when sequencing, draft recovery, and final atomic submission matter.</p><p>Draft persistence is versioned and eventually synchronized. Navigation is local but gated; final submission is server-authoritative and idempotent. Scale pressure comes from long workflows, dynamic paths, autosave races, abandoned sessions, stale URLs, async checks, hidden values, and duplicate submit. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Authorization and final validation remain server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable field ids, typed events, explicit state unions, schema versions, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, screen-reader output, stale responses, offline recovery, retries, restoration, and constrained devices.</p><p>Measure field latency, blocked actions, stale drops, save conflicts, retries, storage pressure, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: validation authority, privacy, and abuse limits</h3><p>Keep raw input, parsed value, validation result, draft persistence, and submitted server record separate. Client validation improves feedback but server validation is authoritative. Async validators carry field generation and form version so stale responses cannot overwrite newer edits. Conditional fields must define whether hidden values are retained, redacted, or deleted. Rollback restores the committed draft or submit snapshot with an explicit conflict state.</p><p>Apply abuse and privacy controls before expensive validation, upload, AI suggestion, or rule-graph evaluation. Bound field count, dependency depth, payload size, suggestion requests, persisted draft size, and retry frequency. Encrypt or avoid persisting sensitive drafts, redact telemetry, and clear derived state when tenant or identity changes. Observe validator latency, stale-result drops, rule cycles, submit conflicts, and restore failures.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing drafts and committed values, trusting client validation, leaking resources, accepting stale async completion, and hiding rollback from the user.</p><p>For this topic, recompute reachable paths, redirect stale URLs, abort stale validation, preserve values after save conflicts, resume the latest valid step, and dedupe submission. Validate untrusted input, authorize durable mutations server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to high-value forms where users expect responsive input while browser, persistence, validation, and policy boundaries can fail independently. Reuse the controller structure while injecting product policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat the wizard as a directed workflow. Field values, reachable steps, active step, validation generations, draft version, and final submit state are distinct.</p><h3>What breaks at scale?</h3><p>long workflows, dynamic paths, autosave races, abandoned sessions, stale URLs, async checks, hidden values, and duplicate submit. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Draft persistence is versioned and eventually synchronized. Navigation is local but gated; final submission is server-authoritative and idempotent.</p><h3>How do you recover?</h3><p>I would recompute reachable paths, redirect stale URLs, abort stale validation, preserve values after save conflicts, resume the latest valid step, and dedupe submission.</p><h3>Why this architecture?</h3><p>Independent forms are simpler for loosely related tasks; a wizard runtime is justified when sequencing, draft recovery, and final atomic submission matter.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noreferrer">MDN localStorage</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
