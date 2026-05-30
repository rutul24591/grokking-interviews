"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-form-validation-engine",
  title: "Design a Form Validation Engine",
  description:
    "LLD for a reusable validation engine supporting sync/async rules, schema-driven validation, cross-field dependencies, and i18n in React/Next.js.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "form-validation-engine",
  wordCount: 7200,
  readingTime: 38,
  lastUpdated: "2026-04-29",
  tags: ["lld", "validation", "forms", "schema", "async", "react"],
  relatedTopics: [
    "form-builder",
    "dynamic-conditional-form-engine",
    "wizard-multi-step-form",
  ],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Form Validation Engine</h1><h2>Definition &amp; Context</h2><p>Design a Form Validation Engine is an implementation-heavy low-level design problem covering rule composition, dependency tracking, synchronous checks, asynchronous providers, stale-response rejection, error projection, localization, and submit gating. A principal-level answer must explain state ownership, durable boundaries, lifecycle cleanup, failure recovery, privacy, cost, and observability.</p><p>Model validation as a dependency graph. Keep field values, touched state, sync errors, async generations, and submit status distinct. The core structures are field registry, rule graph, reverse dependencies, sync error map, async generation map, debounce timers, abort controllers, locale messages, and submit snapshot.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/form-validation-engine-runtime.svg" alt="Design a Form Validation Engine runtime" caption="Topic-specific runtime from input intent through validated durable state." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <p>
          We are designing a Form Validation Engine — a reusable
          runtime component that, given a set of values, a set of
          rules, and a context bag, decides whether the values are
          valid, what the errors are, and in what order to surface
          them. The engine is intentionally headless: it consumes
          values and rules, and produces structured results. It
          does not render anything; it does not own form state; it
          does not couple to React. This separation is what allows
          the same engine to power form components, mutation hooks
          consumed via React Query, server actions running in
          Next.js, and cross-environment shared validation between
          client and server. Once you accept that validation
          deserves its own subsystem, designing it to be reusable
          across these contexts becomes the central architectural
          choice.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are deceptively numerous. Determining
          rule priority and execution order so users see the most
          informative error first, not whichever rule happened to
          finish first. Handling async validators with race
          resilience so a slower earlier response can&rsquo;t
          overwrite a fresher result. Tracking cross-field
          dependencies without recomputing the entire form on
          every keystroke. Producing stable, i18n-friendly error
          keys that survive locale changes without re-running
          rules. Defining a clean contract for ingesting
          server-side errors that integrates seamlessly with
          client-side validators. Supporting multiple schema
          languages (Zod, Yup, Valibot) without forcing consumers
          to pick one. Each individually has a clean answer; the
          architecture exists to make them compose without
          ad-hoc hacks.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Direct consumers are form components and form runtimes;
          their consumers are end users who experience validation
          as inline errors, top-of-form summaries, and submission
          gates. Internal stakeholders include backend teams that
          mirror validation rules server-side and want a contract
          that lets them share a schema across the wire, and
          platform teams that need the engine to plug into
          telemetry to track error rates per validator (a high
          error rate on a particular validator often indicates a
          bad UX, not a bad rule). Async rules invoke server
          endpoints, so backend availability and rate-limiting
          concerns become engine concerns whether we like it or
          not.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most demanding consumer is the validation engine
          itself running on a Next.js Server Action: it must
          execute the same rules with identical results to its
          client-side counterpart, while having access to
          server-only resources like the database. This
          isomorphic posture is what lets the system trust the
          server&rsquo;s validation as authoritative — anything
          else creates a security boundary that the engine
          isn&rsquo;t equipped to enforce.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Rules are composable; the engine accepts a list of rules
          per field rather than one mega-validator that does
          everything. Async rules can be slow (hundreds of
          milliseconds to a second), occasionally fail, and must
          not block the UI. Locale resolution is the host&rsquo;s
          responsibility — the engine emits stable error keys
          with parameter bags and the host translates. The engine
          runs on both client (in the browser) and server (Next.js
          Server Actions, API routes); pure rule functions must be
          isomorphic, async rules use injected adapters so the
          server can swap network calls for direct database
          checks. We assume modern JavaScript runtimes:
          <code> AbortController</code>, <code>structuredClone</code>,
          and ES2022 features are available.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          The engine is not a UI component. It does not render
          error text, anchor focus, animate, or scroll to errors
          — those are consumer concerns. It does not own form
          state; values come from the host store. It does not
          implement conditional field visibility — that is the
          conditional engine&rsquo;s job, and the conditional
          engine consumes the validation engine&rsquo;s output
          rather than the other way around (a hidden field is
          skipped by validation; a conditionally-required field
          looks like any other required field to the engine). We
          deliberately do not re-implement schema languages — we
          consume Zod, Yup, Valibot, or our own internal schema
          via thin adapters, because there are too many opinions
          about schema authoring to enforce one.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="important">
          The engine supports synchronous primitives — required,
          length, range, regex, pattern, enum, custom predicate
          — and asynchronous primitives — uniqueness, server-side
          existence check, OFAC lookup, address verification. Rules
          compose into chains per field with declared priority
          order so the engine knows which error matters most when
          multiple rules fail. Cross-field rules express their
          dependencies explicitly so the engine can re-run only
          what changed when a single field updates. The engine
          accepts both schema input (a Zod-like object schema)
          and imperative input (a per-field rule list); both
          compile down to the same internal plan because consumer
          choice should be at the boundary, not propagated through
          the runtime. Validation modes —
          <code> onChange</code>, <code>onBlur</code>,
          <code> onSubmit</code>, <code>manual</code> — are
          configurable per form and overridable per field.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Errors carry stable keys (not strings), parameter bags
          (<code>{` { key: "min", params: { n: 8 } } `}</code>),
          and severity (<code>error</code> blocks submission;
          <code> warning</code> is advisory). Async runs are
          abortable via <code>AbortController</code> and
          deduplicated via per-field tokens — only the latest run
          for a given field can write its result back to the
          engine&rsquo;s state. The aggregate result includes
          per-field error arrays and a per-field status —
          <code> idle</code>, <code>pending</code>,
          <code> valid</code>, <code>invalid</code> — so
          consumers can render correct UI even while async work
          is in flight without falsely showing valid or invalid
          states.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Warnings (non-blocking advisory signals) are useful for
          things like password strength meters, currency-format
          notices, and accessibility-contrast hints. Server-error
          ingestion — the engine accepts a map of field errors
          from a server response and merges them into its
          internal error state with a marker indicating origin
          — fits cleanly here. Schema-derived TypeScript types
          via the adapter give consumers autocomplete on field
          names and value shapes. Pluggable message resolvers
          (ICU MessageFormat, i18next, hard-coded) let products
          choose their i18n stack without forcing one on
          everyone.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement field rendering, focus management,
          error UI placement, or scroll-to-error behavior. Those
          are consumer concerns and depend on UX decisions the
          engine should not make. We do not implement business
          logic — &ldquo;the user is too young to purchase this
          product&rdquo; is a rule the consumer declares and the
          engine enforces; the engine doesn&rsquo;t supply the
          rule. We do not implement field-level conditional
          visibility (the conditional engine).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Synchronous validation per keystroke must be
          sub-millisecond for a 50-field form on a mid-tier
          device, even when many rules involve cross-field
          dependencies. Achieving that requires that we never
          re-run the full rule set on a single field change — we
          maintain a forward dependency index and re-run only
          affected rules, which is typically one or two per
          keystroke. Validator compilation (turning a schema into
          an internal plan) happens once per schema identity, not
          per render; the plan is cached against the schema
          reference and re-rendering with the same schema instance
          is free.
        </HighlightBlock>

        <h3>Scalability</h3>
        <p>
          Linear in the number of dependent rules. A 200-field
          form with 500 rules should produce a re-validation cost
          on the order of one or two affected rules per keystroke,
          not 500. The engine is also evaluated server-side at
          submission, so its cost matters there too — pure rule
          functions must execute identically and efficiently on
          Node and in the browser, with no platform-specific
          shortcuts.
        </p>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Async race resilience is the most subtle reliability
          requirement: under fast typing, multiple async
          validations can be in flight simultaneously, and the
          slowest may resolve last. Only the most recently issued
          token may write its result, and earlier responses are
          discarded silently rather than interpreted out of
          order. Idempotent rule execution (no side effects) is
          enforced by convention; pure functions are the
          contract.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Rules are functions or declarative descriptors — never
          evaluated from string. Async validators only call
          allowlisted endpoints declared in configuration;
          arbitrary URLs from a runtime schema are not honored
          because schemas may come from a CMS or a less-trusted
          source. Async calls attach CSRF tokens (provided by
          the host) and are rate-limited per field to prevent
          abuse.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Error keys carry semantic meaning
          (<code> required</code>, <code>minLength</code>,
          <code> pattern</code>) so consumers can render messages
          that screen readers can announce intelligibly. The
          status field exposes <code>pending</code> so consumers
          can render <code>aria-busy</code> on the input during
          async runs and <code>aria-invalid</code> only when
          actually invalid. The engine never assumes a specific
          UI pattern — it provides the information; the consumer
          renders.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          New rule = pure function plus a registered key plus an
          optional async marker. The registry is the single
          extension point; the engine itself is small enough to
          be maintained by a single team. Schema adapters are
          also small — converting an external schema into the
          internal plan format is a one-file translator that any
          contributor can write.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The engine is structured as a four-stage pipeline:
          <strong> compile</strong>,
          <strong> extract dependencies</strong>,
          <strong> evaluate on change</strong>, and
          <strong> merge results</strong>. Each stage has a narrow
          contract, and that narrowness is what lets the engine
          remain small, deterministic, and reusable across
          environments. The pipeline runs end-to-end on every
          relevant change but most of its work is amortized
          through caches and the dependency index, so per-change
          cost is bounded by what actually changed rather than by
          the size of the form.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>compile</strong>, the engine takes a schema
          (Zod-like, Yup-like, or imperative rule list) and
          normalizes it through an adapter into an internal plan:
          a flat list of rule entries, each with
          <code> fieldName</code>, <code>ruleId</code>, the
          executor function, the rule&rsquo;s priority, and a
          list of fields the rule depends on (which may include
          the target field plus others for cross-field rules).
          The compiler also validates the schema itself (every
          referenced field exists, no field has duplicate rule
          IDs, async-flagged rules have async executors) and
          fails loudly on misconfiguration rather than at
          runtime. Compilation is memoized by schema reference,
          so re-rendering with the same schema instance is free
          — the cache lookup is a referential equality check.
          From the plan, the engine builds a forward index — a
          map from changed field name to the set of rules that
          need to re-run when that field changes — which is the
          data structure that makes per-keystroke re-validation
          O(affected rules) instead of O(all rules). Building
          the index is O(rules × avg dependencies), paid once.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On a <strong>field change</strong>, the engine receives
          <code> validate(name, allValues, ctx)</code>. It looks
          up the affected rule set from the forward index in
          O(1). Sync rules in that set run immediately, in
          priority order; the first error per field is recorded
          but execution continues so the consumer can choose to
          show all errors or first-only. Sync rules execute on
          the call stack — they&rsquo;re cheap, on the order of
          microseconds each — and their results are accumulated
          into a working result object. Async rules are issued
          through the AsyncQueue: each async rule has a
          per-field token (a monotonic counter) and an
          AbortController. Issuing a new token aborts the prior
          via <code>controller.abort()</code> and the new
          request is issued. The engine returns the synchronous
          result immediately and notifies subscribers; the async
          result resolves later and writes back through the same
          single-writer path, but only if the token is still the
          latest for that field. Stale responses — those whose
          token is no longer current — are discarded silently
          because the user has moved on.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>blur</strong> (or whatever submit-mode the
          form uses), the engine validates either the touched
          field or the whole form. Whole-form validation runs
          sync rules for all fields, awaits any pending async
          rules with a timeout (after which the engine returns
          inconclusive status — better than a false valid or
          invalid), and produces a complete result. Submit-time
          validation is the same code path as on-change, just
          with the entire field set as the input; the engine does
          not maintain a separate &ldquo;submit&rdquo; mode that
          could drift from the on-change behavior. Consistency
          here matters because it&rsquo;s exactly the kind of
          subtle inconsistency that produces production bugs:
          field passes on-change, fails on-submit, user is
          confused.
        </HighlightBlock>
        <p>
          <strong>Server-error ingestion</strong> uses an
          explicit API: <code>setServerErrors(map)</code> takes
          a map of field-name to issue arrays and merges them
          into the engine&rsquo;s state with a marker indicating
          the source. Subscribers see the same shape as
          client-side errors but can distinguish source via the
          <code> source</code> field on each issue, which lets
          UIs render server-origin errors with subtly different
          styling if useful (often a server error indicates a
          different remediation path than a client format error
          — the message itself usually conveys this, but the
          source marker lets us reinforce it visually). The
          engine also tracks per-field
          <code> dirtySinceServerError</code>; when the user
          edits a field that has a server error, the engine
          clears that server error so users do not fight stale
          messages. This is a small detail with disproportionate
          impact on perceived quality — users find &ldquo;why
          won&rsquo;t this error go away?&rdquo; deeply
          frustrating.
        </p>
        <p>
          The <strong>result merger</strong> combines client
          errors, server errors, and warnings into a single
          per-field array ordered by priority and severity.
          Errors come before warnings; within errors, the rule
          with the lowest priority number wins for the
          &ldquo;first error&rdquo; UX. The merger also computes
          the per-field status: if any rule is pending, status
          is <code>pending</code>; else if any is invalid,
          <code> invalid</code>; else if all rules ran and
          passed, <code>valid</code>; else <code>idle</code>.
          Subscribers (form components) receive deltas, not full
          state, so React updates stay surgical and only the
          specific fields whose results changed re-render. This
          delta-based notification is what makes the engine&rsquo;s
          performance scale alongside the form runtime&rsquo;s
          performance.
        </p>
        <p>
          <strong>Locale resolution</strong> happens at message
          time, not at rule definition time. A rule emits an
          issue with
          <code>{` { key: "min", params: { n: 8 } } `}</code>;
          the host translates it via its i18n function. Locale
          switches mid-form trigger a re-resolve of all messages
          without re-running any rules — this is pure
          presentation work, not recomputation. Decoupling
          message resolution from rule execution is what makes
          locale switches cheap and what makes server-side
          validation produce locale-agnostic results that the
          client can later render in the user&rsquo;s language.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-environment isomorphism</strong> deserves
          its own paragraph because it&rsquo;s the
          highest-leverage architectural property. Pure rule
          functions execute identically on Node and in the
          browser; that&rsquo;s straightforward. Async rule
          executors are the variable: in the browser they fetch;
          on the server they call the database directly. The
          engine accepts an executor injected at construction
          time, so the same schema can run client-side
          (HTTP-fetching async rules) or server-side
          (database-calling async rules). The same form schema
          file is imported on both sides; the same rule registry
          is the same object; the difference is one parameter at
          engine instantiation. This is the unlock that makes
          form validation truly shared between client and
          server, and it&rsquo;s the reason we built the engine
          this way rather than embedding it in the form runtime.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <strong>RuleRegistry</strong> holds named rules
          (<code> required</code>, <code>minLength</code>,
          <code> pattern</code>, <code>asyncUnique</code>) keyed
          by stable identifier. Built-in rules are registered at
          engine construction; consumers register custom rules
          at the same site. Each rule entry includes the
          executor function, a default priority, and an
          <code> isAsync</code> flag. Custom rules are a one-line
          registration plus a pure function plus an i18n key,
          which keeps the surface area for new rules
          intentionally small.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>SchemaAdapter</strong> converts an external
          schema (Zod, Yup, Valibot, internal) into the
          internal plan. Adapters are deliberately small — they
          walk the schema, map each constraint to a rule
          registry entry, and produce a normalized list. They
          are also responsible for extracting dependency
          declarations: Zod refinements that access multiple
          fields, for example, must declare their dependencies
          through a small annotation API or the engine will
          conservatively re-run them on every change. We make
          this declaration mandatory in the adapter contract
          rather than trying to infer dependencies from
          predicate code, which is fragile and slow.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>DependencyGraph</strong> builds a forward map
          from changed-field to affected-rules. For each rule it
          records the set of fields the rule reads. The graph is
          built once at compile and reused. Adding or removing a
          rule invalidates the graph for that schema only,
          re-triggering compilation. Cycle detection is
          unnecessary here — rules don&rsquo;t mutate values,
          only observe them, so there&rsquo;s no cycle to detect.
          Cycles in conditional logic are a separate concern
          handled by the conditional engine.
        </HighlightBlock>
        <p>
          <strong>SyncRunner</strong> executes synchronous rules
          in priority order against the latest values; it is a
          pure function from (rules, values, ctx) to issue
          arrays. It is stateless so it can be reused by
          server-side validation paths without modification.
          Stateless functions are also trivially testable, which
          matters because rule correctness is the single most
          regression-prone area of any form system.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>AsyncQueue</strong> is the most subtle piece.
          For each async rule, it maintains a token (a monotonic
          counter) and an AbortController. Issuing a new run
          aborts the prior via
          <code> controller.abort()</code>; the new request is
          issued, and on resolution the queue checks whether its
          token is still the latest before writing back. If the
          user has edited again before the response arrived, the
          response is discarded silently. The queue can also
          debounce: by default 300 ms after the last keystroke,
          configurable per rule. Per-field queueing means
          parallel async work across different fields runs
          concurrently rather than serializing through one big
          queue, which matters when a form has multiple async
          fields whose validators don&rsquo;t depend on each
          other.
        </HighlightBlock>
        <p>
          <strong>MessageResolver</strong> is host-supplied. The
          engine emits issues; the host translates. We provide a
          default ICU-format resolver for convenience, but
          production consumers usually wire it to their own i18n
          stack. Decoupling resolution lets the engine remain
          locale-agnostic while still producing meaningful
          information to consumers.
        </p>
        <p>
          <strong>ResultMerger</strong> combines sync, async, and
          server errors into the final per-field result, computes
          status, and emits delta notifications. The merger is
          the single writer for engine state; everything else
          either reads or proposes. This single-writer pattern is
          what keeps the engine&rsquo;s state coherent across
          concurrent async resolutions and synchronous sync
          updates — there&rsquo;s exactly one path that mutates
          state, and it serializes naturally on the JavaScript
          event loop.
        </p>
        <HighlightBlock as="p" tier="important">
          The patterns at play are <strong>pipeline</strong>
          (rules flow through compile → extract → evaluate →
          merge), <strong>strategy</strong> (sync vs async
          runners), <strong>adapter</strong> (external schemas
          normalized to internal plan), and
          <strong> single-writer state</strong> (only the merger
          writes results; everything else just reads or
          proposes). Each pattern is doing real work; none is
          decorative.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">
          The engine itself is stateless across forms: it&rsquo;s
          a pure compiled plan plus a runtime that takes values
          in and emits results. <em>Per-form instance</em>,
          however, the engine maintains a small piece of state:
          the current results map, the async tokens per field,
          and a run counter for telemetry. This state is not
          React state — it lives in the engine&rsquo;s own store
          and is exposed to React via subscribe. Keeping engine
          state out of React means we can run the engine
          server-side without React being involved, which is the
          whole point of the isomorphic design.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Errors are <strong>derived state</strong> from the
          latest run plus server errors merged in. We
          deliberately do not duplicate errors into the
          form&rsquo;s value store, because two sources of truth
          for &ldquo;is this field valid&rdquo; inevitably drift.
          The form store owns values; the engine owns errors.
          Form components subscribe to both via thin selector
          hooks. This split also makes it possible to run the
          validation engine in a worker thread (CPU-heavy
          validation off the main thread) without coupling the
          form store to worker boundaries — the engine reads
          values via a snapshot, runs on its own thread, and
          posts deltas back.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Subscribers (form runtime, hooks, telemetry) listen via
          <code> onResult(fieldName, result)</code> or via a
          <code> subscribe(selector)</code> primitive that
          returns only the slice they need. This selector pattern
          keeps re-renders narrow even when many fields update
          in one batch — a 50-field form-wide validation produces
          one notification per field whose result actually
          changed, not 50 notifications regardless.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          The public API is intentionally small.
          <code> compile(schemaOrRules)</code> returns a plan
          and a dependency graph. <code>validate(name?, values,
          ctx)</code> runs validation; if name is provided, only
          the affected rules run; otherwise the whole form runs.
          <code> setServerErrors(map)</code> ingests structured
          server errors. <code>subscribe(selector)</code>
          returns an unsubscribe function for change
          notifications. <code>abort(name?)</code> cancels
          in-flight async runs for a field or all fields. That&rsquo;s
          the entire surface; everything else is internal.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Rule contract:
          <code>{` (value, allValues, ctx) => Issue | undefined | Promise<Issue | undefined> `}</code>.
          Rules are pure with respect to inputs; the only side
          effect allowed is fetching from an allowlisted
          endpoint inside an async rule&rsquo;s executor. The
          <code> ctx</code> bag carries locale, user role,
          signal (an AbortSignal for async cancellation), and
          any host-supplied helpers (e.g. an authenticated
          fetch wrapper or a database client on the server).
          Rules return <code>undefined</code> for &ldquo;no
          issue&rdquo; — explicit nothings are easier to reason
          about than implicit silences — and an issue object
          otherwise.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Issue shape:
          <code>{` { key, params, severity, source } `}</code>{" "}
          where <code>source</code> is one of <code>client</code>{" "}
          or <code>server</code>; this lets consumers render
          server-origin errors with subtly different styling if
          desired. The shape is deliberately serializable so
          issues can travel from server to client (in API
          responses) and from worker to main thread without
          custom serialization logic.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance Strategy</h3>
        <HighlightBlock as="p" tier="crucial">
          Compile-time work is paid once: schema → plan →
          dependency graph. The plan is cached by schema
          reference. Runtime work per keystroke is bounded by
          the number of rules that depend on the changed field,
          which is typically one or two. Sync rules run
          synchronously in microtask order; async rules are
          debounced (default 300 ms), and the AsyncQueue
          cancels stale runs to avoid wasted bandwidth and avoid
          confusing UI flickers.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          We memoize predicate results when inputs are
          referentially equal — useful for expensive custom
          predicates that get called many times during
          cross-field cascades. We also batch result
          notifications: a single change that affects three
          rules emits one merged delta to subscribers, not
          three separate ones, so React can render once. On
          submit-time whole-form validation, the engine walks
          all rules but skips rules whose values haven&rsquo;t
          changed since the last successful run — a small but
          meaningful win for forms with hundreds of rules. We
          also short-circuit per-field rule execution at the
          first error if the configuration says
          &ldquo;first-error-wins&rdquo;, though we run all
          rules by default and let the consumer decide which to
          display.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          For very large forms with very expensive validators,
          we offer an optional Web Worker mode: the validation
          engine runs in a worker, the form runtime sends value
          snapshots via structured clone, and results come back
          as deltas. This is opt-in because the worker cost is
          worth it only when CPU is the bottleneck (rare for
          most forms; relevant for forms with regex-heavy or
          complex predicate-heavy validation). The same engine
          API works identically in both modes; the only
          difference is the runtime topology.
        </HighlightBlock>
      </section>

      <section>
        <h3>🎨 UI/UX Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          Rule order matters profoundly for UX. The natural
          priority is <code>required</code> &rarr;
          format/structure (<code>minLength</code>,
          <code> pattern</code>) &rarr; semantics
          (<code>asyncUnique</code>, <code>asyncEligible</code>).
          A user who hasn&rsquo;t entered a value yet should see
          &ldquo;Required&rdquo;, not &ldquo;Must be at least 8
          characters&rdquo;; an empty field has no chance of
          satisfying any other rule, so format errors are noise.
          The engine encodes this via priority numbers and lets
          consumers either show all errors or just the
          highest-priority one. The default priority order ships
          with the built-in rules; consumers can override per
          rule or per form.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Pending async state should render as a subtle spinner
          or checkmark-with-progress, never as an error UI.
          Showing &ldquo;Username already taken&rdquo; for half
          a second before the async response confirms it&rsquo;s
          actually available is worse than waiting. Pending
          status is what gives consumers the information to make
          this UX choice — a small detail that depends entirely
          on the engine surfacing the right primitives.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Errors should be stable across keystrokes when the
          value hasn&rsquo;t changed. The engine guarantees
          this by only emitting deltas when results actually
          differ. Without this, users would see error text
          flickering as React re-rendered — a perceived-quality
          bug that&rsquo;s easy to introduce and hard to debug.
        </HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">The engine never assumes a specific UI pattern; it provides the information; the</HighlightBlock>
<HighlightBlock as="p" tier="important">consumer renders. Status updates batch into single notifications so consumers</HighlightBlock>
<HighlightBlock as="p" tier="important">don&rsquo;t flood the accessibility tree with intermediate values during a cascade.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security Considerations</h3>
        <HighlightBlock as="p" tier="important">Async rules POST to allowlisted endpoints declared in
          configuration; the engine refuses arbitrary URLs from
          a schema (which might come from a CMS or a less-
          trusted source). Per-field rate limiting (max one in
          flight, one queued) prevents abuse.</HighlightBlock>
<HighlightBlock as="p" tier="important">Server messages
          from async rules are never rendered as HTML — they
          pass through the message resolver as data only. The
          engine also redacts known-sensitive parameter values
          (configured via a list of sensitive field names) from
          telemetry events so we don&rsquo;t accidentally log
          credit card numbers or social security numbers in
          error tracking.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Server-side validation in Server Actions is the
          security-authoritative path; client-side validation is
          UX-authoritative. The engine&rsquo;s isomorphic design
          makes it cheap to run the same rules on both, but the
          server is the boundary that enforces correctness.
          Consumers should treat client validation as a
          progressive enhancement, never a substitute for
          server-side enforcement.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing Strategy</h3>
        <HighlightBlock as="p" tier="important">Unit tests cover the building blocks: rule primitives
          against canonical good/bad inputs (including edge
          cases like empty strings, null, undefined,
          NaN, very long strings, Unicode boundaries), message
          interpolation for plurals and gendered languages,
          dependency graph construction for representative
          schemas.</HighlightBlock>
<HighlightBlock as="p" tier="important">Integration tests mount realistic schemas and
          exercise: schema compilation identity (same schema
          produces same plan), async race handling under fast
          typing (a Playwright test that types fast enough to
          trigger the race), server-error merge with subsequent
          edits clearing the error, locale switch re-resolving
          messages without re-running rules.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Property tests verify idempotency: running validate
          twice with the same inputs produces identical results.
          Server-side tests run pure rules in Node to verify
          they produce identical results to client-side, catching
          cases where a rule accidentally depends on a
          browser-only API (this happens more often than you
          might expect — someone uses
          <code> document</code> or <code>window</code> in a
          custom predicate and it works in the browser but
          throws on the server). Performance tests under a
          representative 200-field schema assert per-keystroke
          and submit-time budgets; CI fails on regressions.
        </HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases &amp; Failure Handling</h3>
        <HighlightBlock as="p" tier="crucial">
          The most subtle edge case is async race: two edits in
          flight, response 1 arriving after response 2. The
          token mechanism solves this — only the latest token
          writes its result. A related case: the user edits
          during an async run; we keep status
          <code> pending</code>, abort the prior request, restart
          the debounce timer, and only show the new result when
          it arrives. A cross-field rule that references a
          hidden or conditional field: if the target is hidden,
          the engine skips the rule entirely (the conditional
          engine reports visibility); the alternative would be
          running rules against fields the user can&rsquo;t even
          see, producing errors that feel arbitrary.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">A server returns an error for a field the user has
          just changed: the engine drops the server error rather
          than rendering it stale. A locale switch mid-form: the
          MessageResolver re-resolves; rules don&rsquo;t re-run.
          An async endpoint times out: the engine returns
          <code> inconclusive</code> status (which consumers can
          render as &ldquo;Could not verify, try again&rdquo;)
          rather than falsely passing or failing — letting
          users proceed when verification is impossible is a
          deliberate choice that respects user time without
          compromising the server-side authoritative check at
          submission.</HighlightBlock>
<HighlightBlock as="p" tier="important">A rule throws (a bug in a custom
          predicate): the engine catches, logs, and surfaces an
          internal error issue with a distinctive key so it
          doesn&rsquo;t look like a normal validation message —
          better to fail loudly than mis-validate. A schema is
          recompiled with different content but same reference
          (a developer mistake): we emit a development warning
          because the cache will hold the old plan; in
          production we use a content-hash check as a
          defense-in-depth measure that catches this drift in
          the rare case it slips through review.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability &amp; Extensibility</h3>
        <HighlightBlock as="p" tier="crucial">Pluggable async runners (e.g. one that batches multiple field validations into a single request) are possible</HighlightBlock>
<HighlightBlock as="p" tier="important">because the AsyncQueue speaks an abstract executor interface, not specific fetch logic. The engine plugs into any form</HighlightBlock>
<HighlightBlock as="p" tier="important">runtime that exposes a values store and accepts error subscriptions; we don&rsquo;t couple to our specific Form Builder.</HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Date and number parameter values are passed as primitives (numbers, ISO</HighlightBlock>
<HighlightBlock as="p" tier="important">date strings); the resolver formats them via Intl at message time, ensuring</HighlightBlock>
<HighlightBlock as="p" tier="important">locale-correct output for the full matrix of languages and numbering systems.</HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs &amp; Design Decisions</h3>

        <h3>Schema-first vs imperative rule list</h3>
        <HighlightBlock as="p" tier="important">
          We support both. Schema-first composes well with
          serialization and TypeScript-type derivation; imperative
          gives flexibility for one-off rules in bespoke forms.
          Adapters bridge them so the engine&rsquo;s internals
          stay one shape. The cost is two surface APIs to
          document, but they coexist cleanly because they share
          the rule registry and the runner. The alternative —
          forcing one or the other on consumers — would push them
          into awkward workarounds for the &ldquo;long
          tail&rdquo; cases that always exist.
        </HighlightBlock>

        <h3>First-error-wins vs all-errors</h3>
        <p>
          We collect all errors per field and let the consumer
          decide. First-error-wins reduces visual noise;
          all-errors is useful for top-of-form summaries and for
          power users who want a complete picture. The
          engine&rsquo;s job is to provide the data; the
          rendering choice is UX. Hard-coding either would
          reduce flexibility without saving meaningful complexity.
        </p>

        <h3>Per-field async vs global queue</h3>
        <HighlightBlock as="p" tier="important">
          Per-field async (one queue per field, parallel across
          fields) gives the best UX: each field validates
          independently, users see immediate progress per field,
          and abortion is surgical. Global async (one queue for
          the whole form) simplifies submit-time logic but feels
          slower because of head-of-line blocking, where one
          slow field stalls the others. We chose per-field and
          accept the implementation complexity of managing
          multiple queues with their own tokens.
        </HighlightBlock>

        <h3>Engine-owned errors vs form-store-owned</h3>
        <HighlightBlock as="p" tier="important">
          Errors are derived from the latest validation run and
          server errors merged. We chose to keep them in the
          engine&rsquo;s state (with subscribers reading via
          selectors) rather than copying them into the form
          store. Two sources of truth for the same data drift in
          subtle ways; one source plus subscribers is cleaner.
          The cost is an extra subscription per field, but the
          subscription cost is negligible at the scale we care
          about, and the simplicity win is real.
        </HighlightBlock>

        <h3>Compile cache by reference vs by content</h3>
        <HighlightBlock as="p" tier="crucial">
          We cache compiled plans by schema reference identity
          for performance. This means callers must not
          reconstruct the schema on every render — they should
          hoist it or memoize it. We document this loudly because
          the failure mode is subtle: validation will work but
          be slow, and developers will blame the engine without
          understanding why. The alternative (deep-equality
          caching) is more forgiving but adds nontrivial
          overhead on every call; we&rsquo;d rather make the
          contract explicit and catch violations with an
          ESLint rule that warns when a schema is constructed
          inline in a render function.
        </HighlightBlock>

        <h3>Custom AbortController orchestration vs library</h3>
        <p>
          We hand-rolled the AsyncQueue rather than depending on
          a library like p-queue. The reason is twofold: our
          per-field, per-token model with abort semantics is
          specific enough that a generic library wouldn&rsquo;t
          fit cleanly, and adding a dependency for what amounts
          to a couple hundred lines of code increases bundle
          size without commensurate benefit. The hand-rolled
          version is exhaustively tested and small enough to
          maintain.
        </p>

        <h3>Worker-mode opt-in vs default</h3>
        <HighlightBlock as="p" tier="important">
          Worker-mode validation is opt-in because for most
          forms the cost of structured-clone over the message
          channel exceeds the cost of just running validation
          on the main thread. For very large forms with very
          expensive validators, it&rsquo;s a meaningful win.
          Defaulting to it would penalize the common case;
          opt-in makes the trade-off explicit at the consumer
          level.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Isomorphic submission paths in Next.js Server Actions where the same schema plan runs on the server with direct database</HighlightBlock>
<HighlightBlock as="p" tier="important">lookups instead of HTTP calls — sharing rules between client and server is the most underrated win available here, and we&rsquo;d like</HighlightBlock>
<HighlightBlock as="p" tier="important">to make it easier to wire up. Telemetry on rule cost so platform teams can identify expensive rules and optimize the long tail.</HighlightBlock>
      </section>

      </section>
<section><h2>Architecture &amp; Flow</h2><p>Separate field input, typed state transitions, derived projections, persistence effects, and bounded telemetry. Draft, preview, validated, and submitted states must not collapse into one mutable object. Every debounce timer, request, storage write, worker, and subscription needs an explicit owner and cleanup path.</p><p>Model validation as a dependency graph. Keep field values, touched state, sync errors, async generations, and submit status distinct. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/forms-input-systems/form-validation-engine-recovery.svg" alt="Design a Form Validation Engine recovery" caption="Recovery flow: reject obsolete work, preserve recoverable drafts, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Per-field handlers work for small forms; a graph engine is justified when reusable cross-field, async, and localization policy must stay consistent.</p><p>Client validation is advisory. Server validation remains authoritative; async responses are accepted only for the current field value and generation. Scale pressure comes from cross-field rules, rapid typing, async uniqueness checks, hidden fields, locale changes, large forms, and server-client policy drift. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Authorization and final validation remain server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable field ids, typed events, explicit state unions, schema versions, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, screen-reader output, stale responses, offline recovery, retries, restoration, and constrained devices.</p><p>Measure field latency, blocked actions, stale drops, save conflicts, retries, storage pressure, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include mixing drafts and committed values, trusting client validation, leaking resources, accepting stale async completion, and hiding rollback from the user.</p><p>For this topic, cancel stale checks, debounce providers, recompute dependents deterministically, focus the first invalid field, preserve server errors, and reject graph cycles. Validate untrusted input, authorize durable mutations server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to high-value forms where users expect responsive input while browser, persistence, validation, and policy boundaries can fail independently. Reuse the controller structure while injecting product policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Model validation as a dependency graph. Keep field values, touched state, sync errors, async generations, and submit status distinct.</p><h3>What breaks at scale?</h3><p>cross-field rules, rapid typing, async uniqueness checks, hidden fields, locale changes, large forms, and server-client policy drift. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Client validation is advisory. Server validation remains authoritative; async responses are accepted only for the current field value and generation.</p><h3>How do you recover?</h3><p>I would cancel stale checks, debounce providers, recompute dependents deterministically, focus the first invalid field, preserve server errors, and reject graph cycles.</p><h3>Why this architecture?</h3><p>Per-field handlers work for small forms; a graph engine is justified when reusable cross-field, async, and localization policy must stay consistent.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noreferrer">MDN localStorage</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
