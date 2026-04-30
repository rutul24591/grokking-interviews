"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function DynamicConditionalFormEngineArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
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
        </p>

        <h3>Assumptions</h3>
        <p>
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
        </p>

        <h3>Non-Goals</h3>
        <p>
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
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
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
        </p>

        <h3>Out of Scope</h3>
        <p>
          Permission-based gating, validation logic, field
          rendering, and authoring UI are not concerns of this
          engine. We also do not support arbitrary JavaScript
          predicates — that is a deliberate constraint, not a
          missing feature. Custom rules implemented in
          application code are available via an explicit escape
          hatch that&rsquo;s only callable from compiled code,
          never from runtime data.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
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
        </p>

        <h3>Scalability</h3>
        <p>
          500 rules across 200 fields evaluated under 5 ms
          typical per change. The architecture stays linear in
          the number of actually-affected rules. Rules are
          compiled once per schema identity; mounts and
          re-renders are free as long as schema reference
          identity is stable, which we document and enforce
          via lint rule.
        </p>

        <h3>Reliability</h3>
        <p>
          The engine is deterministic: same inputs produce the
          same effects. Idempotent: running evaluation twice
          yields identical results. No global side effects —
          the engine reads from the form store and writes to it
          through a single dispatcher. This determinism is
          essential because conditional logic is exactly the
          area where flaky behavior would be most costly to
          users and most expensive to debug.
        </p>

        <h3>Security</h3>
        <p>
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
        </p>

        <h3>Accessibility</h3>
        <p>
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
        </p>

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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/dynamic-conditional-form-engine-architecture.svg"
        alt="Dynamic Conditional Form Engine Architecture"
        caption="Rules + Form Values → Conditional Engine (Parser → AST → DependencyExtractor → DAG → CycleDetector → Evaluator → EffectApplier) → Field Effects (visible/disabled/required/value/options). The engine is a spreadsheet-style reactive graph with topological cascade evaluation."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <p>
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
        </p>
        <p>
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
        </p>
        <p>
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
        </p>
        <p>
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
        </p>
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
        <p>
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
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
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
        </p>
        <p>
          <strong>DependencyExtractor</strong> walks an AST and
          returns the set of field names referenced. It also
          handles literal references inside built-in calls
          (<code>length(items)</code> depends on
          <code> items</code>, not on <code>length</code>) and
          recognizes nested paths (<code>address.zip</code>) as
          a single dependency. The extractor is a simple visitor
          pattern; new built-ins register their dependency
          extraction via a small contract.
        </p>
        <p>
          <strong>RuleCompiler</strong> orchestrates parse →
          extract → DAG construction → topological sort → forward
          index build. It also runs validation passes: every
          referenced field must exist in the schema, every
          effect must apply to a real field, every rule has a
          unique ID. Failures are detailed and actionable, not
          generic exceptions.
        </p>
        <p>
          <strong>Evaluator</strong> is the runtime: given a set
          of changed field names, produce a list of effects. It
          is pure — no side effects, no store writes — which
          makes testing trivial and lets us run the same code on
          the server during isomorphic submission validation.
          The evaluator is the most-tested component because
          it&rsquo;s the heart of the engine.
        </p>
        <p>
          <strong>EffectApplier</strong> takes the
          evaluator&rsquo;s output and applies it to the form
          store via the dispatcher. This is where the pure /
          impure boundary sits; everything to the left of
          EffectApplier is pure. The applier batches all
          effects from one cascade into a single store update,
          which is what makes subscribers see a coherent commit
          rather than intermediate flickering.
        </p>
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
        <p>
          The architectural patterns are <strong>reactive
          graph</strong> (push-based propagation, like a
          spreadsheet), <strong>AST visitor</strong>
          (introspection and dependency extraction),
          <strong> pure evaluator + side-effecting applier</strong>{" "}
          (testability and isomorphism), and
          <strong> memoized compilation</strong> (schema → plan
          happens once, plan reused across runs). Each pattern
          earns its place; none is decorative.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
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
        </p>
        <p>
          User-entered values and computed values are kept
          distinct. The form store records the canonical value;
          the UserOverrideTracker records whether the user has
          edited it. This separation lets the engine decide
          when to apply a computed-value rule and when to
          suppress it, and it lets the UI surface a &ldquo;reset
          to calculated&rdquo; control when overrides exist.
          Without this separation, computed-value rules would
          either always overwrite (frustrating to users who
          want to override) or never overwrite (defeating the
          point of computed values).
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs to the engine: <code>rules</code> (list of rule
          descriptors), <code>values</code> (current form
          values), <code>context</code> (locale, role flags,
          custom built-in state). Output: a list of effects keyed
          by target field. Subscribers to the engine listen via
          <code> onEffect(fieldName, effects)</code> and apply
          them to their UI; alternatively they read derived
          state via selectors.
        </p>
        <p>
          Rule shape:
          <code>{` { id, when, target, effect: { visible? | required? | disabled? | value? | options? }, options?: { preserveOnHide?, locked?, overridable? } } `}</code>.
          Rule IDs are stable identifiers used in error messages
          and telemetry; they&rsquo;re also what debugging tools
          use to attribute UI state back to specific rules. The
          engine emits <em>deltas</em> rather than full state,
          so consumers can apply patches efficiently and
          re-render only changed fields.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance Strategy</h2>
        <p>
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
        </p>
        <p>
          For very large forms with hundreds of cascading rules,
          we run cascade evaluation in a
          <code> queueMicrotask</code> off the synchronous
          keystroke path. Sync rule evaluation is still cheap
          enough to run on the keystroke for most cases; async
          predicate scheduling is debounced separately. The
          scheduling decisions are tunable per form via
          configuration, because some forms benefit from
          aggressive sync evaluation (immediate visual feedback)
          and others from microtask batching (smoother
          interaction during rapid typing).
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX &amp; Interaction Design</h2>
        <p>
          Conditional fields appearing and disappearing must
          feel smooth. We animate the height transition with a
          short fade so insertions don&rsquo;t cause jarring
          layout shifts; the animation is bypassed under
          <code> prefers-reduced-motion</code>. Computed-value
          fields render a subtle &ldquo;calculated&rdquo; badge
          so users understand why the value changes when they
          edit a parent field. Locked computed fields prevent
          editing and surface an explanatory tooltip on click;
          this is friendlier than a non-responsive disabled
          control that just refuses input without explanation.
        </p>
        <p>
          When a user edits a field that has a computed rule, the
          UI shows a small &ldquo;Reset to calculated&rdquo;
          control next to the field. This is a small detail but
          prevents the awkward case where a user wants to
          recover the computed value after manual edit and has
          to either remember the formula or refresh the page to
          get back to the original derivation.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Hidden-by-rule fields are unmounted or use the HTML
          <code> hidden</code> attribute, which removes them
          from tab order and the accessibility tree. CSS-only
          <code> display:none</code> via class toggle works too,
          but only if applied to the actual element; nested
          focusable descendants must inherit. We avoid
          <code> visibility:hidden</code> because some screen
          readers still announce its content. Disabled fields
          carry <code>aria-disabled=&quot;true&quot;</code> and
          remain focusable so users can land on them and
          discover the disabled state with an accompanying
          tooltip explaining why.
        </p>
        <p>
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
        </p>
      </section>

      <section>
        <h2>🔐 Security Considerations</h2>
        <p>
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
        </p>
        <p>
          This security posture is what allows schemas to be
          served from a CMS without becoming a remote-code-
          execution vector. JavaScript-as-a-DSL via
          <code> Function</code> or <code>eval</code> is what
          turns nice forms into security incidents; the small
          DSL is the safer architecture by a wide margin. If a
          product genuinely needs JavaScript-level expressiveness
          for a particular rule, we provide an explicit
          unsafe-rule escape hatch that&rsquo;s only callable
          from compiled application code, never from runtime
          data. This gives us the safety of the DSL by default
          while leaving room for the rare case that needs more.
        </p>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <p>
          Unit tests cover parser correctness across operators
          and grammar productions, dependency extraction for
          representative ASTs, and cycle detection on contrived
          rule sets. Property tests verify idempotency: running
          the evaluator twice with the same inputs yields the
          same outputs (a property that should be invariant by
          construction but is worth checking). Integration tests
          mount realistic schemas and exercise: change in field
          A correctly propagates to dependents B, C; preserve-
          on-hide rules retain values; user override suppresses
          computed rules; locked rules win over user input;
          cycles fail at compile time with the right error
          message. Accessibility tests verify that hidden fields
          are properly removed from tab order and that disabled
          fields carry correct ARIA attributes — these are easy
          to regress and worth catching automatically.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <p>
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
        </p>
        <p>
          Rapid value flapping (a user dragging a slider): the
          engine batches cascade evaluation on
          <code> queueMicrotask</code> so multiple changes
          within one tick produce one cascade, not one per
          change. Conflicting effects (two rules both targeting
          the same field with different visibility): the rule
          later in topological order wins, with a warning
          logged so authors can fix the schema; we deliberately
          avoid merging because &ldquo;merge&rdquo; for booleans
          is ambiguous. A field that becomes visible again
          after being hidden: if preserveOnHide is on, the
          prior value is restored; otherwise the field starts
          at its default value, not at whatever the user typed
          before. A rule&rsquo;s AST overflows the depth cap:
          the engine refuses to compile and surfaces the
          relevant rule ID. A schema migrates between versions
          and old rules use a removed effect type: the migrator
          either upgrades the rule or surfaces a clear error
          rather than silently dropping it.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <p>
          The DSL parser is swappable; the engine accepts any
          parser conforming to the AST contract, so consumers
          who already have a jexl or jsonata parser can plug it
          in. The effect registry is extensible; adding a new
          effect type (e.g. a <code>highlight</code> effect for
          advisory styling, or a <code>tooltip</code> effect
          for context-sensitive help) is a one-file addition.
          The engine is host-agnostic — it works the same in
          React, server-side, or in a worker thread. Theming
          and visual presentation of effects (the calculated
          badge, the disabled tooltip) live in the form
          runtime, not in the conditional engine, because
          they&rsquo;re rendering concerns, not logic concerns.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Computed string values can resolve through the
          host&rsquo;s i18n function if marked translatable.
          Numeric and date predicates are locale-agnostic at
          the engine level — the DSL operates on canonical
          values; formatting happens at the rendering layer.
          Built-ins like <code>today()</code> honor the
          form&rsquo;s configured time zone (passed via
          context) so a user in a different time zone sees the
          right behavior on date-bounded rules. The rule debugger
          (when present) localizes its UI labels but shows
          predicate text verbatim because that&rsquo;s the
          authored content.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>DSL vs JavaScript predicates</h3>
        <p>
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
        </p>

        <h3>Push (reactive) vs pull (compute on demand)</h3>
        <p>
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
        </p>

        <h3>Clear vs preserve hidden values</h3>
        <p>
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
        </p>

        <h3>Compile cache by reference</h3>
        <p>
          We cache compilation by schema reference identity.
          This gives huge perf wins for stable schemas but
          requires callers to hoist or memoize. We document
          this; we also provide a development-mode warning that
          fires if the engine sees the same schema content with
          different references frequently, helping catch the
          bug. The alternative — deep-equality caching — adds
          nontrivial overhead on every call and isn&rsquo;t
          worth the forgiving behavior.
        </p>

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
        <p>
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
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          A visual rule debugger that shows the DAG with
          last-evaluation results highlighted, and lets authors
          step through a cascade to see why a particular field
          ended up hidden, would be enormously valuable for
          complex forms. Cross-form rules (a wizard step
          affecting another form mounted later) are a natural
          extension once a form-event bus exists. Rule A/B
          testing harness — same form, different rule sets per
          variant — fits the serializable-rule architecture
          well. Server-side evaluation in Server Actions for
          double-checking conditional logic at submission would
          close a consistency gap with client-side branching.
          Performance profiling per-rule would help authors
          identify expensive predicates and optimize them.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why use a DSL instead of JavaScript
          predicates?</strong> Safety, predictability,
          serializability. JavaScript predicates via
          <code> Function</code> or <code>eval</code> can read
          arbitrary host state, mutate values, or open code
          execution vectors when schemas come from a CMS. A DSL
          with a whitelisted grammar can&rsquo;t. The cost is
          some expressiveness; built-ins cover the gap, and an
          explicit unsafe-rule escape hatch handles edge cases
          from compiled code only.
        </p>

        <p>
          <strong>2. How is cycle detection done and why is it
          required at compile time?</strong> Tarjan-style SCC
          detection on the rule DAG. Any SCC larger than one
          node is a cycle; we report the cycle path with rule
          IDs and refuse to load. Compile-time enforcement is
          non-negotiable because a runtime cycle either loops
          forever (bad) or is silently truncated (worse,
          because the symptom — fields stuck in unexpected
          states — is hard to attribute back to the cycle).
        </p>

        <p>
          <strong>3. How do you prevent O(rules) evaluation on every
          keystroke?</strong> A precomputed forward index maps
          each field name to the set of rules that depend on it.
          On a field change, we evaluate only the rules in that
          set. Topological order ensures cascades stabilize in
          one pass without fixpoint iteration.
        </p>

        <p>
          <strong>4. What happens to a hidden field&rsquo;s value at
          submit time?</strong> Default: cleared at the moment
          the visibility transitions to hidden, so the
          submitted payload contains no stale answers.
          Per-rule preserveOnHide opts into keeping values
          across visibility toggles for double-checking flows.
          The submission payload is the form&rsquo;s
          <code> getSubmitValues()</code>, which excludes
          hidden fields by default.
        </p>

        <p>
          <strong>5. How do you handle async predicates without UI
          flicker?</strong> Keep the prior visibility state
          while the async run is pending; expose a
          <code> pending</code> status to the UI for
          indicators; dispatch the result through the same
          evaluator path when it resolves. Token-based race
          resolution prevents stale responses from writing
          wrong state.
        </p>

        <p>
          <strong>6. Two rules set conflicting effects — how is
          resolution deterministic?</strong> Topological order
          decides: the rule that comes later in the order wins.
          We log a warning so authors can fix the schema rather
          than relying on order, but at runtime the behavior is
          unambiguous. The alternative — merging conflicting
          booleans — has no good semantics.
        </p>

        <p>
          <strong>7. How does the engine integrate with the
          validation engine?</strong> The conditional engine
          emits visibility/required/disabled flags; the
          validation engine reads them via the form store.
          Hidden fields are skipped by validation. Required-by-
          conditional fields are treated identically to schema-
          required fields. Both engines are pure consumers of
          the same form values, so they coordinate without
          explicit coupling.
        </p>

        <p>
          <strong>8. How would you serialize and version rules for
          runtime updates?</strong> Rules are already
          serializable — they&rsquo;re JSON. We add a
          <code> schemaVersion</code> field so the engine knows
          which DSL version a rule set was authored against; an
          upgrade chain transforms old versions forward, or
          rejects with a clear error if the gap is too wide.
          CMS deliveries include a content hash; the engine
          caches compilation by hash so identical content
          reuses plans across deliveries.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A conditional form engine is essentially a
          <strong> spreadsheet-style reactive graph</strong>{" "}
          driven by a safe DSL. Compile rules once into a DAG,
          propagate changes through dependents in topological
          order, and apply deterministic effects to the form
          store via a single-writer dispatcher. The four
          invariants — declarative rules as data, a constrained
          predicate DSL, a forward dependency index, and
          topological cascade evaluation — combine to make
          complex form behavior tractable, fast, and safe at
          scale. The key insight is that conditional logic is
          a graph problem; treating it as one rather than as
          ad-hoc imperative code is what turns a bug-prone area
          of every form into a stable platform component that
          schema authors can rely on.
        </p>
      </section>
    </ArticleLayout>
  );
}
