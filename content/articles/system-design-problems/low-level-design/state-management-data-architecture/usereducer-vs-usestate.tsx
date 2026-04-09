"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-usereducer-vs-usestate",
  title: "useReducer vs useState for Complex State",
  description:
    "Decision framework for useState vs useReducer — complex forms, state machines, multi-step workflows, testability, and when reducers are worth the boilerplate.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "usereducer-vs-usestate",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "usereducer", "usestate", "complex-forms", "state-machine", "react-hooks", "decision-framework"],
  relatedTopics: ["custom-state-manager-design", "undo-redo-ui-editing", "local-vs-global-state-strategy"],
};

export default function UseReducerVsUseStateArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need a decision framework for choosing between useState and useReducer
          in React components. useState is simple for single values but becomes
          unwieldy for complex state with multi-field updates, validation rules,
          and state transitions. useReducer provides structured state transitions
          but adds boilerplate (action types, reducer function, dispatch calls).
          The challenge is defining clear criteria for when useReducer&apos;s benefits
          outweigh its costs.
        </p>
        <p><strong>Assumptions:</strong> React 19+, components range from simple toggles to multi-step wizards with 20+ state fields.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Decision Criteria</h3>
        <ul className="space-y-2">
          <li><strong>State Complexity:</strong> 1-2 fields → useState. 3+ interdependent fields → evaluate useReducer.</li>
          <li><strong>Transition Logic:</strong> Simple set operations → useState. Multi-step transitions with validation → useReducer.</li>
          <li><strong>Testability:</strong> Need to test state transitions in isolation → useReducer (pure function, easy to unit test).</li>
          <li><strong>State History:</strong> Need undo/redo or time-travel → useReducer (action log enables replay).</li>
          <li><strong>Team Conventions:</strong> Consistent patterns across the codebase → documented decision matrix.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>useState with multiple fields becomes a tangled web of setters — useReducer simplifies by grouping related updates into named actions.</li>
          <li>useReducer for simple toggle adds unnecessary boilerplate — useState is clearer.</li>
          <li>Reducer becomes a god function (100+ lines, 20+ action types) — split into multiple reducers or use a state machine.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The decision follows a complexity threshold: useState for simple,
          independent state values; useReducer for state with transition logic,
          validation, or multi-field updates. useReducer&apos;s key advantage is
          colocation of state transition logic — instead of scattered setter
          calls with inline logic, all transitions live in one pure function
          (the reducer), making it testable, debuggable, and self-documenting.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Five modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Decision Hook (<code>hooks/use-state-decision.ts</code>)</h4>
          <p>Evaluates state complexity and recommends useState or useReducer based on field count, transition logic, and testability needs.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Reducer Factory (<code>lib/reducer-factory.ts</code>)</h4>
          <p>Typed reducer factory with action schema validation. Generates action types, reducer function, and dispatch helpers from a state schema.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. State Machine Adapter (<code>lib/state-machine-adapter.ts</code>)</h4>
          <p>Wraps useReducer with state machine semantics — defines valid state transitions, rejects invalid transitions, provides current state visualization.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Action Logger (<code>lib/action-logger.ts</code>)</h4>
          <p>Logs dispatched actions with before/after state. Enables undo/redo by maintaining action history. Development-only module.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Test Harness (<code>lib/test-harness.ts</code>)</h4>
          <p>Testing utilities for reducers: given state + action, assert next state. Generates test cases from action schemas.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/usereducer-vs-usestate-architecture.svg"
          alt="Decision tree for useState vs useReducer with complexity thresholds and trade-offs"
          caption="useState vs useReducer Decision Framework"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>useState: setState(newValue) → React merges → re-render. useReducer: dispatch(action) → reducer(prevState, action) → newState → re-render. useReducer adds a logic layer between intent (dispatch) and result (newState).</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Reducer complexity explosion:</strong> When reducer exceeds 50 lines or 10 action types, split into sub-reducers (combineReducers pattern) or use a state machine library (XState).</li>
          <li><strong>Async in reducers:</strong> Reducers must be pure — no async operations. Async work happens in event handlers or effects, then dispatch results as actions.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: form reducer with validation, state machine for multi-step workflow, test harness for reducer unit tests, and decision hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">useState</th><th className="p-2 text-left">useReducer</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Single field update</td><td className="p-2">O(1) — direct set</td><td className="p-2">O(1) — dispatch + reducer</td></tr>
              <tr><td className="p-2">Multi-field update</td><td className="p-2">O(n) — n setter calls</td><td className="p-2">O(1) — single dispatch</td></tr>
              <tr><td className="p-2">Testability</td><td className="p-2">Hard — logic in component</td><td className="p-2">Easy — pure function</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Reducers validate action payloads before applying changes — invalid actions return unchanged state (fail-safe). Test: reducer pure function tests (given state + action → assert next state), action validation rejects malformed actions, state machine rejects invalid transitions.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>useReducer for everything:</strong> Candidates over-engineer simple toggles with action types and reducers. Interviewers expect useState for simple cases.</li>
          <li><strong>Azync in reducers:</strong> Candidates put API calls inside reducers. Reducers must be pure — async work belongs in effects or event handlers.</li>
          <li><strong>No action validation:</strong> Reducers assume valid actions — malformed actions crash the reducer. Validate actions and return unchanged state for unknown/invalid actions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose a state machine (XState) over useReducer?</p>
            <p className="mt-2 text-sm">
              A: When state transitions have strict rules (only certain transitions
              are valid from each state), when you need visualization of the state
              graph, or when the state logic is complex enough that bugs from invalid
              transitions are costly. useReducer allows any action from any state —
              state machines enforce valid transitions. Use state machines for
              workflows with well-defined states (order processing, approval flows).
              Use useReducer for flexible state management without strict transition rules.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://react.dev/reference/react/useReducer" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">React Docs — useReducer</a></li>
          <li><a href="https://react.dev/learn/extracting-state-logic-into-a-reducer" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">React Docs — Extracting State Logic into a Reducer</a></li>
          <li><a href="https://xstate.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">XState — State Machines for JavaScript</a></li>
          <li><a href="https://kentcdodds.com/blog/should-i-usestate-or-usereducer" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Kent C. Dodds — useState vs useReducer</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
