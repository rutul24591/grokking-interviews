"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-finite-state-machines",
  title: "Design Finite State Machines",
  description:
    "Production-grade FSM implementation for complex workflows with state transitions, guards, actions, and XState for robust state modeling.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "finite-state-machines",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "state-machines",
    "fsm",
    "xstate",
    "workflows",
    "reliability",
  ],
  relatedTopics: [
    "state-management-patterns",
    "async-state-handling",
    "modal-dialog-state",
    "multi-step-forms",
  ],
};

export default function FiniteStateMachinesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Complex workflows (checkout, auth, video player) have states and
          transitions. Key challenges: representing valid state transitions
          (invalid transitions should be impossible), handling events in each
          state (different behavior per state), and reasoning about state
          transitions (prevent bugs). Naive approach: if-else on state (fragile,
          missed edge cases). Better: Finite State Machine (explicit state
          graph).
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Workflow has finite states (idle, loading, success, error).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Each state has valid transitions (idle → loading, not idle → error).</HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Events trigger transitions (click "buy" → idle to loading).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">Guards conditionally allow transitions (only if user logged in).</HighlightBlock>
          <li>Actions execute on transitions (save to DB, send email).</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>State Definition:</strong> Define states, transitions
            explicitly.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Transitions:</strong> On event, transition to next state (if
            guard passes).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Guards:</strong> Conditionally allow transitions (e.g., user
            logged in?).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Actions:</strong> Execute on enter/exit state or transition.
          </HighlightBlock>
          <li>
            <strong>Context:</strong> Store data alongside state (user, error).
          </li>
          <li>
            <strong>History:</strong> Track state transitions (for undo).
          </li>
          <li>
            <strong>Visualization:</strong> Visualize state graph (debug).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Correctness:</strong> Invalid transitions impossible.
          </li>
          <li>
            <strong>Predictability:</strong> Given state + event, outcome
            deterministic.
          </li>
          <li>
            <strong>Type Safety:</strong> TypeScript support (prevent typos in
            state names).
          </li>
          <li>
            <strong>Performance:</strong> Transition &lt;1ms (instant feel).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Event arrives in unexpected state (network race condition).</li>
          <li>Guard condition false (transition blocked).</li>
          <li>Recursive transitions (state → state).</li>
          <li>Parallel states (orthogonal regions, complex).</li>
          <HighlightBlock as="li" tier="crucial">Nested machines (parent/child state machines).</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Define state machine: states, transitions (on event, go to next
          state), guards (conditions), actions (side effects). Dispatch events
          to machine.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Machine looks up current state, checks guard, executes
          action, transitions to next state. Return new state. Visualization
          tools (Stately, XState visualizer) show state graph.</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/finite-state-machines.svg"
          alt="Finite state machines showing traffic light FSM, checkout workflow FSM with async states and retry, and FSM architecture with statecharts hierarchy"
          caption="Finite state machines showing traffic light FSM, checkout workflow FSM with async states and retry, and FSM architecture with statecharts hierarchy"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Machine Structure</h3>
        <p>Define FSM components.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>States:</strong> Finite set (idle, loading, success, error).
            Mutually exclusive.
          </HighlightBlock>
          <li>
            <strong>Events:</strong> Triggers (SUBMIT, RETRY, CANCEL).
          </li>
          <li>
            <strong>Transitions:</strong> (state, event) → next_state.
          </li>
          <li>
            <strong>Initial State:</strong> Starting state on creation.
          </li>
          <li>
            <strong>Final States:</strong> Terminal states (no more
            transitions).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Guards & Conditions</h3>
        <p>Conditionally allow transitions.</p>
        <ul className="space-y-2">
          <li>
            <strong>Guard:</strong> Function (context, event) → boolean.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Example:</strong> Transition to checkout only if user
            authenticated.
          </HighlightBlock>
          <li>
            <strong>False Guard:</strong> Event ignored, state unchanged.
          </li>
          <li>
            <strong>Multiple Guards:</strong> Transition only if all guards
            pass.
          </li>
          <li>
            <strong>Context Access:</strong> Guard can inspect context (user,
            cart).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Actions & Effects</h3>
        <p>Execute code on state changes.</p>
        <ul className="space-y-2">
          <li>
            <strong>Entry Action:</strong> Execute when entering state.
          </li>
          <li>
            <strong>Exit Action:</strong> Execute when leaving state.
          </li>
          <li>
            <strong>Transition Action:</strong> Execute on transition (state
            A → B).
          </li>
          <li>
            <strong>Side Effect:</strong> API call, log, analytics. Can be
            async.
          </li>
          <li>
            <strong>Send Event:</strong> Action can dispatch another event
            (cascade).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Context & Data</h3>
        <p>Store data alongside state.</p>
        <ul className="space-y-2">
          <li>
            <strong>Context:</strong> Object holding data (user, cart, error).
          </li>
          <li>
            <strong>Update Context:</strong> Action can update context (assign).
          </li>
          <li>
            <strong>Access in Guard:</strong> Guard can read context.
          </li>
          <li>
            <strong>Type Safe:</strong> Define context shape (TypeScript).
          </li>
          <li>
            <strong>Immutable:</strong> Context updates create new object
            (immutability).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hierarchical States (Nested)</h3>
        <p>States can contain substates.</p>
        <ul className="space-y-2">
          <li>
            <strong>Parent State:</strong> loading state with substates
            (fetching, processing).
          </li>
          <li>
            <strong>Inheritance:</strong> Event handled at parent level or
            substate.
          </li>
          <li>
            <strong>Use Case:</strong> Loading can have multiple phases.
          </li>
          <li>
            <strong>Complexity:</strong> Adds depth, harder to reason about.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">History & Undo</h3>
        <p>Track state history.</p>
        <ul className="space-y-2">
          <li>
            <strong>History:</strong> Store list of (state, context) tuples.
          </li>
          <li>
            <strong>Undo:</strong> Restore previous state (pop from history).
          </li>
          <li>
            <strong>Redo:</strong> Restore next state (forward history).
          </li>
          <li>
            <strong>Shallow vs Deep:</strong> Shallow history (only immediate
            history).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Async Events & Side Effects</h3>
        <p>Handle async operations.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Action:</strong> Dispatch event on completion (success or
            failure).
          </HighlightBlock>
          <li>
            <strong>Invoke:</strong> XState: invoke service, transition on
            promise result.
          </li>
          <li>
            <strong>Cancellation:</strong> If state changes, cancel ongoing
            async (e.g., unmount).
          </li>
          <li>
            <strong>Timeout:</strong> Transition if async takes too long.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Visualization & Testing</h3>
        <p>Debug and verify FSM.</p>
        <ul className="space-y-2">
          <li>
            <strong>State Graph:</strong> Visual representation of states +
            transitions.
          </li>
          <li>
            <strong>Tools:</strong> XState Visualizer, Stately, graphviz.
          </li>
          <li>
            <strong>Testing:</strong> Given state + event, verify transition +
            context + actions.
          </li>
          <li>
            <strong>Coverage:</strong> Test all states, all events, guards true
            + false.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track FSM health.</p>
        <ul className="space-y-2">
          <li>
            <strong>State Distribution:</strong> % time in each state (high
            error% = bug?).
          </li>
          <li>
            <strong>Event Rate:</strong> Events/sec per state.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Transition Latency:</strong> Time to compute transition
            (&lt;1ms).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Blocked Transitions:</strong> % of events with false guard
            (retry?).
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">XState Library</h3>
        <HighlightBlock as="p" tier="crucial">
          XState: powerful FSM library for JS/TS. Supports nested states,
          parallel regions, history, visualization. Industry standard.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Explosion</h3>
        <HighlightBlock as="p" tier="important">
          Large FSM (many states) becomes unmanageable. Solution: nest states
          (child machines), slice by feature (separate machines).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing FSMs</h3>
        <HighlightBlock as="p" tier="important">
          Generate all state transitions, test each. Use XState's built-in
          testing (sendTo, waitFor). Property-based testing (test random event
          sequences).
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Invoked Services</h3>
        <HighlightBlock as="p" tier="crucial">
          XState: invoke promises, callbacks, observables on state entry. On
          success/error, transition. Clean async handling.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Parallel Regions</h3>
        <HighlightBlock as="p" tier="important">
          Orthogonal states: two independent substates active simultaneously
          (video player: playing + networking). Complex but powerful.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Machine Composition</h3>
        <HighlightBlock as="p" tier="important">
          Parent machine spawns child machines. Each handles part of workflow.
          Modular, easier to reason about.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Queuing</h3>
        <HighlightBlock as="p" tier="important">
          Events arrive while machine busy. Queue and process. XState handles
          automatically (internal event queue).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="important">
          Large FSM: generate transition table, verify all reachable states.
          Chaos: send random events, verify no crashes.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <p>
          Common: guards too complex (should be pure functions). Solution: keep
          guards simple. Another: context mutations (should be immutable).
          Solution: use object spread.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <p>
          Stuck state: check event queue (blocked by guard?). Wrong transition:
          visualize machine, verify guard logic. Context corruption: check
          mutation code.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Simplicity vs Power</h3>
        <HighlightBlock as="p" tier="crucial">
          Simple workflow (loading state): if-else simple. Complex (checkout):
          FSM clearer. Use FSM when complexity justifies.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Explicitness vs Flexibility</h3>
        <HighlightBlock as="p" tier="important">
          FSM explicit (valid transitions obvious) but inflexible (adding
          transitions hard). Balance based on requirements stability.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Learning Curve</h3>
        <HighlightBlock as="p" tier="important">
          FSM concepts (states, transitions) new to many developers. XState
          powerful but complex. Invest in learning for large apps.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Type safety with TypeScript prevents state name typos. Testing must cover all states, events, guard conditions</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">(true/false). Monitoring state distribution and blocked transitions. Real-world systems use XState for complex workflows (checkout, auth, video player), nested machines for modularity. Integration with state management, UI components essential.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
