"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-dynamic-conditional-form-engine",
  title: "Design a Dynamic Conditional Form Engine",
  description:
    "LLD for a reactive conditional engine driving field visibility, enablement, requiredness, and computed values from a safe predicate DSL.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "dynamic-conditional-form-engine",
  wordCount: 7100,
  readingTime: 38,
  lastUpdated: "2026-04-29",
  tags: ["lld", "forms", "conditional", "reactive", "dsl", "react"],
  relatedTopics: [
    "form-builder",
    "form-validation-engine",
    "wizard-multi-step-form",
  ],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Dynamic Conditional Form Engine</h1><h2>Definition &amp; Context</h2><p>Design a Dynamic Conditional Form Engine is an implementation-heavy low-level design problem covering schema parsing, expression evaluation, dependency tracking, reachable-field projection, hidden-value policy, validation, and cycle detection. A principal-level answer must explain state ownership, durable boundaries, lifecycle cleanup, failure recovery, privacy, cost, and observability.</p><p>Treat conditional visibility as a dependency graph over stable field ids. Derived visibility must not mutate field values accidentally. The core structures are field registry, condition AST, dependency graph, reverse edges, visible set, value map, hidden-value policy, dirty queue, validation map, and schema version.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/dynamic-conditional-form-engine-runtime.svg" alt="Design a Dynamic Conditional Form Engine runtime" caption="Topic-specific runtime from input intent through validated durable state." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing the engine that brings a static form to
          life. Real-world forms are not flat lists of fields; they
          show new questions in response to earlier answers,
          disable inputs when a parent toggle is off, mark fields
          required only for certain user roles or jurisdictions,
          replace option lists based on selections, and compute
          totals from line items. The engine takes a set of
          conditional rules expressed declaratively as data —
          never as code — wires them up against the form&rsquo;s
          value store, evaluates them reactively as values change,
          and emits deterministic effects (visibility, enablement,
          requiredness, computed values, dynamic option lists) that
          the form runtime applies to its rendered fields. This is
          the difference between a form that feels like a
          questionnaire and a form that feels like a tool.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems run deep. Keeping evaluation cost
          proportional to changed inputs rather than the total rule
          count, so a form with 500 conditional rules still updates
          smoothly per keystroke. Evaluating predicates safely when
          the rules may come from a CMS or a less-trusted authoring
          tool, where a JavaScript-as-DSL approach would create
          remote-code-execution vectors. Orchestrating cascading
          effects deterministically — rule A toggles field B,
          which triggers rule C, which depends on B&rsquo;s
          state — without infinite loops or fixpoint iterations.
          Handling the &ldquo;edit-the-graph-while-it-runs&rdquo;
          case where a user toggles a parent field rapidly and we
          must coalesce updates rather than thrash. Handling the
          accessibility implications of fields appearing and
          disappearing without breaking tab order. Done well, this
          engine becomes the backbone of any forms platform; done
          poorly, conditional logic becomes the most fragile part
          of every form, the place where bugs hide and product
          managers learn to dread schema changes.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Schema authors — usually PMs, ops staff, or designers —
          write conditional rules in JSON or via a visual builder.
          They want predicates that are expressive enough to
          capture real business logic (&ldquo;if user&rsquo;s state
          is California and age is over 65, show Medicare
          question&rdquo;) but predictable enough that they can
          reason about edge cases without reading source code.
          End users experience the engine as a form that feels
          alive — questions appear and disappear in response to
          their answers, totals update live — without surprising
          behavior or jarring layout shifts. Engineers consume
          the engine through the form runtime and never write
          conditional logic in code; if they need imperative
          control for some unusual case, they reach for the
          form&rsquo;s
          <code> setValue</code> /
          <code> setFieldState</code> escape hatches rather than
          working around the engine.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Predicates are expressed in a small expression DSL —
          something like jexl, jsonata, or a similar safe
          sublanguage — with comparison, boolean logic, membership,
          basic arithmetic, and a fixed set of host-provided
          built-ins. Rules declare a target field and an effect
          (visibility, enablement, requiredness, computed value,
          options source). Forms range from a handful of
          conditional rules to several hundred. Cycles are rare
          but possible authoring mistakes; we must catch them at
          compile time, not at runtime where they would either
          loop forever or be silently truncated. Async predicates
          exist (e.g. an eligibility check) but are the minority;
          the synchronous case is the hot path that determines
          per-keystroke responsiveness.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          Validation rules are a different engine; the conditional
          engine produces visibility/required/disabled flags that
          the validation engine consumes (a hidden field is
          skipped by validation; a required-by-rule field is
          treated as required). Permission-based field visibility
          (&ldquo;hide this field for non-admin users&rdquo;) is
          a separate access-control concern, though the
          conditional engine can consume role flags from the
          context bag if a product chooses to express it that way.
          We do not implement an authoring UI here — that&rsquo;s
          a separate tool that produces our schema as output.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          The DSL supports comparison operators (=, !=, &lt;,
          &lt;=, &gt;, &gt;=), logical operators (and, or, not),
          membership (<code>in</code>), simple arithmetic (+, -,
          *, /), string methods (length, includes, startsWith),
          date operations (today, before, after), and field
          references (resolved against the form&rsquo;s values
          via dotted paths). The engine supports five effect
          types: <code>visible</code> (boolean), <code>disabled</code>
          (boolean), <code>required</code> (boolean),
          <code> value</code> (computed assignment), and
          <code> options</code> (dynamic option list for
          selects). Rules evaluate reactively — only the rules
          that depend on a changed field re-run. Cycles are
          detected at compile time with a clear error message
          indicating the cycle path so authors can fix the
          schema rather than discovering a hung UI in production.
          Hidden fields are excluded from validation and from
          the submitted payload (so payloads do not leak stale
          answers from hidden branches).
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Async predicates (e.g. <code>asyncEligible(userId)</code>)
          for cases where eligibility depends on a server check
          that can&rsquo;t be expressed declaratively. Rule
          introspection — &ldquo;which rules affect this
          field?&rdquo; — for debugging tools, particularly
          valuable when a complex schema has unexpected
          behavior. Computed values that the user can override
          (<code>overridable: true</code>) versus those that
          lock the field (<code>locked: true</code>). A rule
          debugger that visualizes the dependency DAG and
          last-evaluation results, accelerating schema author
          productivity dramatically when complex schemas
          misbehave.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Permission-based gating, validation logic, field
          rendering, and authoring UI are not concerns of this
          engine. We also do not support arbitrary JavaScript
          predicates — that is a deliberate constraint, not a
          missing feature. Custom rules implemented in
          application code are available via an explicit escape
          hatch that&rsquo;s only callable from compiled code,
          never from runtime data.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Per-keystroke cost must be O(affected rules), not
          O(total rules). For a form with 500 conditional rules,
          evaluating rules on a single field change should take
          a few rule evaluations, not 500. Predicate AST
          evaluation is cheap (a few hundred microseconds for
          typical predicates), so the dominant cost is dispatch
          and the dependency lookup, which we optimize with a
          precomputed forward index. Cascading evaluation
          terminates in one topological pass, not a fixpoint
          loop, which keeps worst-case behavior bounded.
        </HighlightBlock>

        <h3>Scalability</h3>
        <HighlightBlock as="p" tier="important">
          500 rules across 200 fields evaluated under 5 ms
          typical per change. The architecture stays linear in
          the number of actually-affected rules. Rules are
          compiled once per schema identity; mounts and
          re-renders are free as long as schema reference
          identity is stable, which we document and enforce
          via lint rule.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          The engine is deterministic: same inputs produce the
          same effects. Idempotent: running evaluation twice
          yields identical results. No global side effects —
          the engine reads from the form store and writes to it
          through a single dispatcher. This determinism is
          essential because conditional logic is exactly the
          area where flaky behavior would be most costly to
          users and most expensive to debug.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          The DSL parser whitelists tokens; identifiers can only
          reference field names from the schema or built-ins; no
          host environment access (no <code>window</code>,
          <code> process</code>, <code>require</code>). String
          length, expression depth, and runtime caps prevent
          DoS via crafted predicates. Async predicates only
          call allowlisted endpoints from configuration. This
          security posture is what allows schemas to be served
          from a CMS without becoming a remote-code-execution
          vector — the most common class of security incident
          in form platforms.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Hidden fields are unmounted or marked with the
          <code> hidden</code> attribute (which removes them
          from tab order and the accessibility tree); CSS-only
          visibility tricks are insufficient because they leave
          focusable elements that screen readers can still
          discover. Disabled fields use
          <code> aria-disabled</code> with optional explanatory
          tooltips. Required state changes announce only at
          meaningful moments (e.g. on submit attempt) to avoid
          spamming the accessibility tree as the user types.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <p>
          The predicate AST is inspectable; serialized rules are
          diffable in code review; rule effects are logged with
          stable identifiers so debugging tools can attribute
          UI state to specific rules. Adding a new effect type
          is a one-file change in the EffectApplier registry.
          The engine&rsquo;s public surface is intentionally
          small.
        </p>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <p>
          The engine is built around the same insight as a
          spreadsheet recalc engine: build a directed acyclic
          graph (DAG) of dependencies once, then propagate
          changes along edges in topological order. The four
          lifecycle stages — <strong>parse</strong>,
          <strong> extract</strong>, <strong>compile</strong>,
          and <strong>evaluate</strong> — are the engine&rsquo;s
          backbone. Each stage has a narrow contract that makes
          the system reasonable to test, debug, and extend.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>parse</strong>, each rule&rsquo;s
          <code> when</code> string is parsed into an AST by
          the DSL parser. The parser whitelists tokens; any
          unknown identifier or disallowed operator is a parse
          error caught at schema load time, not at runtime. The
          parser also emits a source span for each AST node so
          the rule debugger can show predicate text with the
          relevant subexpression highlighted when an evaluation
          produces an unexpected result. Parsing happens once
          per schema and is cheap; we don&rsquo;t optimize it
          aggressively because it&rsquo;s amortized across the
          form&rsquo;s lifetime.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>extract</strong>, an AST visitor walks each
          predicate and collects the set of field references it
          contains. This produces, for each rule, a list of
          dependencies — the fields whose values determine the
          rule&rsquo;s outcome. The engine then inverts the map:
          for each field, the set of rules that depend on it.
          This forward index is the data structure that makes
          per-keystroke evaluation cheap. The visitor also
          extracts dependencies from computed-value expressions
          and from dynamic option-source declarations, so all
          five effect types participate in the same graph;
          there&rsquo;s no special-casing per effect type
          because it would create asymmetric performance
          characteristics that schema authors couldn&rsquo;t
          predict.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>compile</strong>, the engine assembles the
          DAG. Nodes are rules; edges go from a rule&rsquo;s
          target field to any rule that depends on that field
          (because the target field&rsquo;s state may change as
          a result of this rule&rsquo;s effect, transitively
          triggering downstream rules). The compiler
          topologically sorts the DAG using Tarjan&rsquo;s
          algorithm, which is O(rules + dependencies). If
          sorting fails — a strongly connected component
          exists — the compiler reports the cycle path with
          rule IDs and refuses to load the schema. This
          fail-fast behavior is critical: a cycle that survives
          to runtime would either run forever or be silently
          truncated, both of which produce mysterious bugs that
          take days to debug. Compilation is memoized by schema
          reference, so repeated mounts pay nothing — the cache
          lookup is a referential equality check.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>evaluate</strong>, the engine receives a
          set of changed field names. It looks up affected rules
          from the forward index in O(changed fields). It
          evaluates those rules in topological order; each
          rule&rsquo;s effect (a delta in
          visibility/required/disabled/value/options) is
          collected. If a rule&rsquo;s effect changes the target
          field&rsquo;s state, downstream rules that depend on
          that field are added to the working set, also in
          topological order. Topological order guarantees that
          the cascade stabilizes in one pass; we never need a
          fixpoint loop, which is what keeps evaluation bounded
          and fast. The accumulated effects are flushed to the
          form store as a single batch via the dispatcher, so
          subscribers see one coherent commit per change rather
          than a flicker through intermediate states.
        </HighlightBlock>
        <p>
          Computed values get special handling because they
          create a tension between &ldquo;the rule says the
          value should be X&rdquo; and &ldquo;the user typed
          Y&rdquo;. A rule with a <code>value</code> effect
          overwrites the field&rsquo;s value as long as the
          field is <em>not</em> in user-edited state. We track
          per-field <code>userOverridden</code> flags: when a
          user types into a field that has a computed rule
          attached, the override flag is set, and the rule is
          suppressed until the override is cleared (e.g. via
          reset or via an explicit &ldquo;use computed
          value&rdquo; control). The exception is rules marked
          <code> locked: true</code>, which always win
          regardless of user input — useful for fields that are
          derived from others (a total) and should never be
          hand-edited. This mode is opt-in because it&rsquo;s
          surprising and should be surfaced in the UI as a
          calculated/locked badge so users understand why the
          field doesn&rsquo;t accept their input.
        </p>
        <HighlightBlock as="p" tier="important">
          Cascade evaluation is idempotent because effects are
          functions of values. If the same change is dispatched
          twice, the engine produces the same effects. We
          exploit this for reliability: any time a doubt exists
          about consistency (e.g. on form mount, on rehydrate
          from draft, on locale switch when computed values
          include formatted strings), we run a full evaluation
          pass; the extra cost is negligible (a few ms even for
          large schemas) and the safety net is real. This is
          one of those cases where the cheap defensive operation
          is worth running even when you think you don&rsquo;t
          need it.
        </HighlightBlock>
        <p>
          Async predicates fit into the same model with one
          twist: while an async predicate is in flight, the
          engine keeps the prior visibility state (so the field
          doesn&rsquo;t flicker) and exposes a
          <code> pending</code> status to consumers. When the
          async response resolves, the engine dispatches the
          result through the same evaluator path. Tokens prevent
          races, the same way the validation engine handles
          them — if the user has changed a relevant field while
          the async predicate was running, the response is
          discarded silently and a fresh predicate is issued.
        </p>
        <p>
          Hidden values are cleared by default when a rule&rsquo;s
          visibility effect transitions a field from visible to
          hidden — the engine writes a value-clear effect at the
          same commit as the visibility effect. This keeps
          submitted payloads clean, because backend systems
          generally expect only relevant fields to be present.
          Authors can opt in to preserve mode per rule if they
          explicitly want to keep values across visibility
          toggles (typical for double-checking flows where a
          user might toggle a parent question back and forth
          and shouldn&rsquo;t lose their downstream input each
          time).
        </p>
        <p>
          <strong>Rapid value flapping</strong> — a user dragging
          a slider, repeatedly clicking a checkbox — would naively
          produce one cascade evaluation per change. We coalesce
          via <code>queueMicrotask</code>: changes within one
          tick produce one cascade pass at the end of the tick,
          which is what React expects anyway. This is invisible
          for normal interaction but matters when something
          legitimately changes a field many times in rapid
          succession.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>Parser</strong> takes a DSL string and produces
          an AST or a parse error. The grammar is small, fixed,
          and documented; the parser is hand-written or
          generated from a small PEG. Parse errors include a
          position and a human-friendly message so authors can
          debug their predicates without reading a stack trace.
          We handle the parser ourselves rather than depending
          on a library because the grammar is small enough to
          maintain and we want exact control over what tokens
          are allowed (security matters here).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>DependencyExtractor</strong> walks an AST and
          returns the set of field names referenced. It also
          handles literal references inside built-in calls
          (<code>length(items)</code> depends on
          <code> items</code>, not on <code>length</code>) and
          recognizes nested paths (<code>address.zip</code>) as
          a single dependency. The extractor is a simple visitor
          pattern; new built-ins register their dependency
          extraction via a small contract.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>RuleCompiler</strong> orchestrates parse →
          extract → DAG construction → topological sort → forward
          index build. It also runs validation passes: every
          referenced field must exist in the schema, every
          effect must apply to a real field, every rule has a
          unique ID. Failures are detailed and actionable, not
          generic exceptions.
        </HighlightBlock>
        <p>
          <strong>Evaluator</strong> is the runtime: given a set
          of changed field names, produce a list of effects. It
          is pure — no side effects, no store writes — which
          makes testing trivial and lets us run the same code on
          the server during isomorphic submission validation.
          The evaluator is the most-tested component because
          it&rsquo;s the heart of the engine.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>EffectApplier</strong> takes the
          evaluator&rsquo;s output and applies it to the form
          store via the dispatcher. This is where the pure /
          impure boundary sits; everything to the left of
          EffectApplier is pure. The applier batches all
          effects from one cascade into a single store update,
          which is what makes subscribers see a coherent commit
          rather than intermediate flickering.
        </HighlightBlock>
        <p>
          <strong>CycleDetector</strong> runs as part of
          compilation; it&rsquo;s a Tarjan-style SCC detection
          on the DAG. Any SCC larger than one node is a cycle
          and is reported. We also do a sanity check for
          self-reference (a rule whose target field appears in
          its predicate) which is a special case of cycle.
        </p>
        <p>
          <strong>UserOverrideTracker</strong> maintains the
          per-field flag that suppresses computed-value rules
          when the user has edited a field. It listens to the
          form store&rsquo;s change events with a marker
          indicating source (user vs engine). The marker is
          essential: when the engine itself sets a value via a
          computed-value rule, that&rsquo;s not a user edit and
          shouldn&rsquo;t set the override flag.
        </p>
        <HighlightBlock as="p" tier="important">
          The architectural patterns are <strong>reactive
          graph</strong> (push-based propagation, like a
          spreadsheet), <strong>AST visitor</strong>
          (introspection and dependency extraction),
          <strong> pure evaluator + side-effecting applier</strong>{" "}
          (testability and isomorphism), and
          <strong> memoized compilation</strong> (schema → plan
          happens once, plan reused across runs). Each pattern
          earns its place; none is decorative.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">
          The engine reads from the form store (values + per-field
          metadata) and writes effects through the dispatcher. It
          does not own the form&rsquo;s value state; that&rsquo;s
          the form runtime&rsquo;s job. The engine does maintain
          its own derived-state cache — per-field
          <code> visible</code>, <code>disabled</code>,
          <code> required</code> — which the UI subscribes to.
          The merged view (form values + engine-derived flags)
          is what fields actually render against. This cache is
          maintained as deltas; subscribers receive only the
          fields whose flags changed.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">User-entered values and computed values are kept
          distinct. The form store records the canonical value;
          the UserOverrideTracker records whether the user has
          edited it. This separation lets the engine decide
          when to apply a computed-value rule and when to
          suppress it, and it lets the UI surface a &ldquo;reset
          to calculated&rdquo; control when overrides exist.</HighlightBlock>
<HighlightBlock as="p" tier="important">Without this separation, computed-value rules would
          either always overwrite (frustrating to users who
          want to override) or never overwrite (defeating the
          point of computed values).</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">Inputs to the engine: <code>rules</code> (list of rule
          descriptors), <code>values</code> (current form
          values), <code>context</code> (locale, role flags,
          custom built-in state).</HighlightBlock>
<HighlightBlock as="p" tier="important">Output: a list of effects keyed
          by target field. Subscribers to the engine listen via
          <code> onEffect(fieldName, effects)</code> and apply
          them to their UI; alternatively they read derived
          state via selectors.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Rule shape:
          <code>{` { id, when, target, effect: { visible? | required? | disabled? | value? | options? }, options?: { preserveOnHide?, locked?, overridable? } } `}</code>.
          Rule IDs are stable identifiers used in error messages
          and telemetry; they&rsquo;re also what debugging tools
          use to attribute UI state back to specific rules. The
          engine emits <em>deltas</em> rather than full state,
          so consumers can apply patches efficiently and
          re-render only changed fields.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance Strategy</h3>
        <HighlightBlock as="p" tier="crucial">
          Compilation is paid once per schema reference. The
          forward index lets us go from a changed field to the
          affected rules in O(1) average time. Topological order
          ensures cascades terminate in one pass, no fixpoint
          loops. We memoize predicate results keyed by (rule ID,
          hash of referenced values) so flapping values that
          return to a previous state hit cache. Effect
          application is batched — all effects from one cascade
          flush in a single store dispatch — which keeps React
          renders to one per change.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">For very large forms with hundreds of cascading rules,
          we run cascade evaluation in a
          <code> queueMicrotask</code> off the synchronous
          keystroke path. Sync rule evaluation is still cheap
          enough to run on the keystroke for most cases; async
          predicate scheduling is debounced separately.</HighlightBlock>
<HighlightBlock as="p" tier="important">The
          scheduling decisions are tunable per form via
          configuration, because some forms benefit from
          aggressive sync evaluation (immediate visual feedback)
          and others from microtask batching (smoother
          interaction during rapid typing).</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UI/UX &amp; Interaction Design</h3>
        <HighlightBlock as="p" tier="important">Conditional fields appearing and disappearing must
          feel smooth. We animate the height transition with a
          short fade so insertions don&rsquo;t cause jarring
          layout shifts; the animation is bypassed under
          <code> prefers-reduced-motion</code>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Computed-value
          fields render a subtle &ldquo;calculated&rdquo; badge
          so users understand why the value changes when they
          edit a parent field. Locked computed fields prevent
          editing and surface an explanatory tooltip on click;
          this is friendlier than a non-responsive disabled
          control that just refuses input without explanation.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          When a user edits a field that has a computed rule, the
          UI shows a small &ldquo;Reset to calculated&rdquo;
          control next to the field. This is a small detail but
          prevents the awkward case where a user wants to
          recover the computed value after manual edit and has
          to either remember the formula or refresh the page to
          get back to the original derivation.
        </HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important">Hidden-by-rule fields are unmounted or use the HTML
          <code> hidden</code> attribute, which removes them
          from tab order and the accessibility tree. CSS-only
          <code> display:none</code> via class toggle works too,
          but only if applied to the actual element; nested
          focusable descendants must inherit.</HighlightBlock>
<HighlightBlock as="p" tier="important">We avoid
          <code> visibility:hidden</code> because some screen
          readers still announce its content. Disabled fields
          carry <code>aria-disabled=&quot;true&quot;</code> and
          remain focusable so users can land on them and
          discover the disabled state with an accompanying
          tooltip explaining why.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          When a rule causes a field to appear, we do not
          automatically focus it — that would steal focus from
          the user&rsquo;s current task. Instead we announce
          appearance via a polite live region only if the
          appearing field is the next logical input; for fields
          appearing far down the form, we let the user discover
          them by scrolling. Required-state changes announce
          only on submit attempt, not as the rule recomputes,
          to avoid spamming the accessibility tree as the user
          types.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          The DSL is intentionally constrained. The parser
          whitelists tokens and operators; identifiers must
          resolve to schema field names or known built-ins;
          there is no function definition syntax, no property
          traversal beyond declared paths, no host access. The
          grammar forbids loops; predicate evaluation is bounded
          by AST size, not by runtime. We cap AST depth and
          string length to prevent DoS via deliberately crafted
          predicates. Async predicates can call only allowlisted
          endpoints declared in configuration; the engine
          refuses URLs from runtime schema.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">This security posture is what allows schemas to be
          served from a CMS without becoming a remote-code-
          execution vector. JavaScript-as-a-DSL via
          <code> Function</code> or <code>eval</code> is what
          turns nice forms into security incidents; the small
          DSL is the safer architecture by a wide margin.</HighlightBlock>
<HighlightBlock as="p" tier="important">If a
          product genuinely needs JavaScript-level expressiveness
          for a particular rule, we provide an explicit
          unsafe-rule escape hatch that&rsquo;s only callable
          from compiled application code, never from runtime
          data. This gives us the safety of the DSL by default
          while leaving room for the rare case that needs more.</HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing Strategy</h3>
        <HighlightBlock as="p" tier="crucial">Integration tests mount realistic schemas and exercise: change in field A correctly propagates to dependents B, C; preserve- on-hide rules retain values; user</HighlightBlock>
<HighlightBlock as="p" tier="important">override suppresses computed rules; locked rules win over user input; cycles fail at compile time with the right error message. Accessibility tests verify that</HighlightBlock>
<HighlightBlock as="p" tier="important">hidden fields are properly removed from tab order and that disabled fields carry correct ARIA attributes — these are easy to regress and worth catching automatically.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases &amp; Failure Handling</h3>
        <HighlightBlock as="p" tier="crucial">
          A predicate references a field that doesn&rsquo;t exist
          in the schema: caught at compile time as a hard error.
          A predicate evaluates a field that is itself hidden:
          the engine treats the value as undefined; the predicate
          evaluates accordingly. A rule&rsquo;s effect creates a
          cycle (rule A toggles field X visible, rule B depends
          on X and toggles field Y, rule C depends on Y and
          toggles X visible): caught at compile time with the
          cycle path. An async predicate hangs: the engine
          surfaces <code>pending</code> indefinitely until
          aborted; consumers can configure a timeout that
          surfaces an inconclusive state instead.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">Rapid value flapping (a user dragging a slider): the
          engine batches cascade evaluation on
          <code> queueMicrotask</code> so multiple changes
          within one tick produce one cascade, not one per
          change. Conflicting effects (two rules both targeting
          the same field with different visibility): the rule
          later in topological order wins, with a warning
          logged so authors can fix the schema; we deliberately
          avoid merging because &ldquo;merge&rdquo; for booleans
          is ambiguous.</HighlightBlock>
<HighlightBlock as="p" tier="important">A field that becomes visible again
          after being hidden: if preserveOnHide is on, the
          prior value is restored; otherwise the field starts
          at its default value, not at whatever the user typed
          before. A rule&rsquo;s AST overflows the depth cap:
          the engine refuses to compile and surfaces the
          relevant rule ID. A schema migrates between versions
          and old rules use a removed effect type: the migrator
          either upgrades the rule or surfaces a clear error
          rather than silently dropping it.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability &amp; Extensibility</h3>
        <HighlightBlock as="p" tier="crucial">The engine is host-agnostic — it works the same in React, server-side, or in a worker thread.</HighlightBlock>
<HighlightBlock as="p" tier="important">Theming and visual presentation of effects (the calculated badge, the disabled tooltip) live in the form</HighlightBlock>
<HighlightBlock as="p" tier="important">runtime, not in the conditional engine, because they&rsquo;re rendering concerns, not logic concerns.</HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Built-ins like today() honor the form&rsquo;s configured time zone (passed via context) so a user in</HighlightBlock>
<HighlightBlock as="p" tier="important">a different time zone sees the right behavior on date-bounded rules. The rule debugger (when present)</HighlightBlock>
<HighlightBlock as="p" tier="important">localizes its UI labels but shows predicate text verbatim because that&rsquo;s the authored content.</HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs &amp; Design Decisions</h3>

        <h3>DSL vs JavaScript predicates</h3>
        <HighlightBlock as="p" tier="important">
          The DSL is more constrained — no function definition,
          no host access, no arbitrary recursion. The cost is
          some loss of expressiveness; the win is safety,
          predictability, and the ability to serve schemas from
          a CMS without security review on every change.
          Built-ins (length, today, includes, regex test) cover
          the gap for most real predicates. We provide an
          explicit escape hatch — unsafe-rule, which lets a
          developer attach an in-code predicate, but only from
          compiled application code, never from runtime data.
          This boundary lets the platform be safe by default
          while still expressive when needed.
        </HighlightBlock>

        <h3>Push (reactive) vs pull (compute on demand)</h3>
        <HighlightBlock as="p" tier="important">
          Push propagates changes through the DAG and updates
          derived state immediately; subscribers re-render
          correctly without explicit invalidation. Pull computes
          when a consumer asks, simpler in some ways but more
          fragile (consumers might forget to ask, leading to
          stale state). We chose push because it matches user
          expectation — UI updates as values change — and
          because it composes cleanly with React subscriptions.
          Pull would have required every consumer to plumb
          invalidation manually, which is exactly the kind of
          code that develops bugs over time.
        </HighlightBlock>

        <h3>Clear vs preserve hidden values</h3>
        <HighlightBlock as="p" tier="important">
          Clear by default keeps submitted payloads clean — no
          stale answers from dead branches reaching the
          backend. Preserve is opt-in per rule for cases where
          a user toggles a parent question back and forth and
          shouldn&rsquo;t lose their downstream input. The
          default favors the more common case (form is
          submitted to a backend that expects only relevant
          fields); the opt-in handles the rarer
          double-checking flow without complicating the
          default.
        </HighlightBlock>

        <h3>Compile cache by reference</h3>
        <HighlightBlock as="p" tier="crucial">
          We cache compilation by schema reference identity.
          This gives huge perf wins for stable schemas but
          requires callers to hoist or memoize. We document
          this; we also provide a development-mode warning that
          fires if the engine sees the same schema content with
          different references frequently, helping catch the
          bug. The alternative — deep-equality caching — adds
          nontrivial overhead on every call and isn&rsquo;t
          worth the forgiving behavior.
        </HighlightBlock>

        <h3>Topological order vs fixpoint loop</h3>
        <p>
          Topological order requires a DAG (no cycles), so we
          must detect and reject cycles at compile time. The
          win is bounded evaluation: one pass through affected
          rules and we&rsquo;re done. A fixpoint loop tolerates
          cycles by iterating until stable, but in practice
          cycles are bugs; accepting them silently makes them
          harder to find. We prefer the strictness; cycles fail
          loudly so they get fixed.
        </p>

        <h3>Single dispatcher vs direct store writes</h3>
        <p>
          We funnel all effect application through a single
          dispatcher, even though that&rsquo;s slightly more
          code than letting evaluators write directly. The
          single-writer pattern means subscribers see one
          coherent commit per cascade rather than intermediate
          states, and it means the EffectApplier is the only
          place that needs to understand the form store&rsquo;s
          internal structure. Decoupling pays off when we
          eventually need to change the store implementation.
        </p>

        <h3>Cycle detection at compile vs runtime</h3>
        <HighlightBlock as="p" tier="important">
          Compile-time cycle detection means the schema fails
          to load when cycles exist. The alternative — runtime
          detection — would catch the same cycles but only
          after the form has shipped, which is much more
          expensive to fix. The compile-time check is a small
          O(rules) algorithm that we run once; the runtime
          check would have to run continuously and would
          inevitably miss subtle cycles that only emerge under
          specific value combinations. Compile-time is the
          right defense.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important">A visual rule debugger that shows the DAG with last-evaluation results highlighted, and lets authors step through</HighlightBlock>
<HighlightBlock as="p" tier="important">a cascade to see why a particular field ended up hidden, would be enormously valuable for complex forms.</HighlightBlock>
<HighlightBlock as="p" tier="important">Cross-form rules (a wizard step affecting another form mounted later) are a natural extension once a form-event bus exists.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Rule A/B
          testing harness — same form, different rule sets per
          variant — fits the serializable-rule architecture
          well. Server-side evaluation in Server Actions for
          double-checking conditional logic at submission would
          close a consistency gap with client-side branching.
          Performance profiling per-rule would help authors
          identify expensive predicates and optimize them.</HighlightBlock>
      </section>

      </section>
<section><h2>Architecture &amp; Flow</h2><p>Separate field input, typed state transitions, derived projections, persistence effects, and bounded telemetry. Draft, preview, validated, and submitted states must not collapse into one mutable object. Every debounce timer, request, storage write, worker, and subscription needs an explicit owner and cleanup path.</p><p>Treat conditional visibility as a dependency graph over stable field ids. Derived visibility must not mutate field values accidentally. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/dynamic-conditional-form-engine-recovery.svg" alt="Design a Dynamic Conditional Form Engine recovery" caption="Recovery flow: reject obsolete work, preserve recoverable drafts, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Hand-coded conditionals are simple for small forms; a graph engine is justified when many products need configurable rules, testability, and consistent policy.</p><p>The schema version is authoritative. Visibility is a local deterministic projection; submission applies the same rules server-side before accepting values. Scale pressure comes from large schemas, cyclic dependencies, deep fan-out, hidden required fields, schema upgrades, and server-client rule drift. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Authorization and final validation remain server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable field ids, typed events, explicit state unions, schema versions, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, screen-reader output, stale responses, offline recovery, retries, restoration, and constrained devices.</p><p>Measure field latency, blocked actions, stale drops, save conflicts, retries, storage pressure, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: validation authority, privacy, and abuse limits</h3><p>Keep raw input, parsed value, validation result, draft persistence, and submitted server record separate. Client validation improves feedback but server validation is authoritative. Async validators carry field generation and form version so stale responses cannot overwrite newer edits. Conditional fields must define whether hidden values are retained, redacted, or deleted. Rollback restores the committed draft or submit snapshot with an explicit conflict state.</p><p>Apply abuse and privacy controls before expensive validation, upload, AI suggestion, or rule-graph evaluation. Bound field count, dependency depth, payload size, suggestion requests, persisted draft size, and retry frequency. Encrypt or avoid persisting sensitive drafts, redact telemetry, and clear derived state when tenant or identity changes. Observe validator latency, stale-result drops, rule cycles, submit conflicts, and restore failures.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing drafts and committed values, trusting client validation, leaking resources, accepting stale async completion, and hiding rollback from the user.</p><p>For this topic, detect cycles at schema load, recalculate only affected dependents, define hidden-value retention explicitly, reject unknown operators, and revalidate on submit. Validate untrusted input, authorize durable mutations server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to high-value forms where users expect responsive input while browser, persistence, validation, and policy boundaries can fail independently. Reuse the controller structure while injecting product policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat conditional visibility as a dependency graph over stable field ids. Derived visibility must not mutate field values accidentally.</p><h3>What breaks at scale?</h3><p>large schemas, cyclic dependencies, deep fan-out, hidden required fields, schema upgrades, and server-client rule drift. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>The schema version is authoritative. Visibility is a local deterministic projection; submission applies the same rules server-side before accepting values.</p><h3>How do you recover?</h3><p>I would detect cycles at schema load, recalculate only affected dependents, define hidden-value retention explicitly, reject unknown operators, and revalidate on submit.</p><h3>Why this architecture?</h3><p>Hand-coded conditionals are simple for small forms; a graph engine is justified when many products need configurable rules, testability, and consistent policy.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noreferrer">MDN localStorage</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
