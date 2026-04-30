"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-ai-assisted-form-fill",
  title: "Design an AI-assisted Form Fill System",
  description:
    "LLD for AI-driven form auto-fill: suggestion lifecycle, accept/reject UX, latency handling, privacy, and integration with the form engine.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "ai-assisted-form-fill",
  wordCount: 6300,
  readingTime: 33,
  lastUpdated: "2026-04-28",
  tags: ["lld", "ai", "forms", "llm", "streaming", "react"],
  relatedTopics: [
    "form-builder",
    "form-validation-engine",
    "draft-persistence-system",
  ],
};

export default function AIAssistedFormFillArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a system that uses an LLM to suggest
          values for fields in a form, based on context the user
          provides — an uploaded document, prior submissions,
          profile data, or a voice transcript. Suggestions stream
          in field-by-field, are previewed alongside the user&rsquo;s
          inputs without overwriting them, and are explicitly
          accepted or rejected per field or in bulk. The system
          must be fast enough to feel useful, private enough to be
          trusted with sensitive forms, and unambiguous enough that
          users always know whether a value is theirs or the
          AI&rsquo;s.
        </p>
        <p>
          The hard problems are: streaming suggestions without UI
          thrash; reconciling AI suggestions with concurrent user
          input (the user is editing field 3 while a suggestion
          for field 3 arrives); redacting PII before sending
          source material to a server-side AI; making the
          accept/reject loop accessible by keyboard; and
          maintaining trust by never auto-applying suggestions
          and always making the AI origin visible. Done well, this
          turns a 20-minute form into a 3-minute one; done poorly,
          it leaks data, surprises users, and erodes trust faster
          than it speeds them up.
        </p>

        <h3>User Context</h3>
        <p>
          End users fill long, repetitive forms — insurance claims,
          intake at a clinic, expense reports, government
          applications. They have source data they&rsquo;d like to
          extract from rather than retype: a PDF upload, a recent
          prior submission, a voice memo. Internal stakeholders
          include privacy and compliance teams who care about
          where data flows, product teams who care about
          conversion lift, and accessibility specialists who
          insist that AI features remain operable by keyboard
          and screen reader.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend service exposes a streaming JSON endpoint that
          returns per-field suggestions with confidence scores
          and source attribution. The schema is known to the
          backend; suggestions conform to declared types. We trust
          the LLM to produce schema-conforming output most of the
          time but never to be authoritative — we validate every
          suggestion against the schema and against per-field
          validators. Users have an authenticated session; we can
          identify them and apply per-user policy. Forms can be
          marked as eligible for AI fill or excluded entirely
          (some forms are too sensitive or too compliance-heavy
          for AI assistance).
        </p>

        <h3>Non-Goals</h3>
        <p>
          The LLM stack itself — model choice, prompt engineering,
          retrieval-augmented generation — is treated as a
          service. We design the client-side surface, not the
          inference pipeline. Submitting the form on behalf of
          the user is explicitly not a feature; the AI suggests,
          the user submits. Cross-form learning from user
          corrections (an active learning loop) lives in the
          telemetry stack, not in the runtime.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Triggers: explicit &ldquo;Auto-fill&rdquo; button, or an
          implicit trigger on file upload (when the form schema
          enables it). Streaming suggestions with progressive UI
          updates per field as they arrive. Accept and Reject per
          field, plus bulk Accept all and Reject all actions.
          Confidence indicator (low / medium / high) per field.
          Source attribution showing which input or document
          snippet produced each suggestion. Inline edit before
          accept so users can adjust without rejecting outright.
          Per-field undo within the session. Cancel an in-flight
          run.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Re-prompt for a single field if the user wasn&rsquo;t
          satisfied. Voice-input form fill via streaming
          transcription. Multilingual sources translated as
          needed. A summary of all changes the AI proposed at
          the end of a session for audit purposes.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Cross-session learning from user corrections, model
          training, prompt customization by end users, and AI
          submission of the form.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          First suggestion visible within ~1 second of trigger;
          subsequent suggestions arrive progressively. The
          rendering pipeline must not block user typing — if the
          user is editing a field while suggestions arrive,
          their keystrokes win every time. Stream parsing happens
          in microtasks; UI updates use React 19 transitions for
          non-urgent rendering.
        </p>

        <h3>Reliability</h3>
        <p>
          Errors during streaming do not corrupt user-entered
          values; partial streams that fail mid-way leave the
          form in a coherent state. Schema-violating suggestions
          are silently rejected client-side rather than ever
          reaching the form value.
        </p>

        <h3>Security &amp; Privacy</h3>
        <p>
          PII never leaves the client without explicit, scoped
          consent. Client-side redaction strips obvious PII
          patterns before sending source material; server-side
          redaction provides defense in depth. Sensitive fields
          (passwords, payment, SSN) are excluded from AI fill
          entirely. Source documents are retained on the server
          only for the duration of the request, with audited
          access logs. Output is sanitized — AI cannot inject
          HTML or execute scripts; values render as text.
        </p>

        <h3>Accessibility</h3>
        <p>
          Suggestion appearances announce via polite live region.
          Per-field accept/reject reachable by keyboard, with
          well-defined shortcut bindings. Confidence and source
          have text equivalents for screen readers. AI-origin
          markers are perceivable without color alone.
        </p>

        <h3>Maintainability</h3>
        <p>
          Clear contract between AI service and form runtime;
          adapter pattern for swapping providers. The suggestion
          state lives in a separate plane from form values, so
          form runtime code doesn&rsquo;t need to know about AI.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The architecture rests on three core ideas:
          <strong> two parallel state planes</strong> (form values
          vs suggestions), <strong>streaming with an explicit
          per-field state machine</strong>, and
          <strong> never auto-applying anything</strong>. Together
          these produce a system that feels fast, never overwrites
          user work, and remains trustworthy under partial failure.
        </p>
        <p>
          <strong>Two parallel state planes</strong> means the form
          store still owns the canonical form values — the user&rsquo;s
          truth — and a separate suggestion store owns
          AI-proposed values. Field UIs render against both:
          they show the user&rsquo;s value as the primary, and
          when a suggestion exists, render the suggestion as a
          ghost value with accept/reject affordances. Accepting
          a suggestion writes it into the form store using the
          same code path as a user keypress, so accepted
          suggestions become user values and are subject to the
          same validation and persistence as anything else. The
          suggestion store remembers the proposal for undo
          purposes but no longer drives field rendering.
        </p>
        <p>
          On <strong>trigger</strong>, the SuggestionController
          collects sources (uploaded files, prior submissions
          referenced by the user, profile data the user has
          opted into sharing). Sources go through the
          RedactionLayer, which masks obvious PII (SSNs, card
          numbers, dates of birth in some contexts) before
          sending. The redaction step happens client-side because
          the principle is &ldquo;don&rsquo;t send what you
          don&rsquo;t need&rdquo;; server-side redaction also
          runs as defense in depth. The controller posts to the
          streaming endpoint with the redacted payload and the
          schema id; the server returns a stream of JSON-lines
          messages, each describing a suggestion for one field.
        </p>
        <p>
          <strong>Streaming parsing</strong> reads the response
          via <code>fetch</code>&rsquo;s
          <code> ReadableStream</code> body. We accumulate bytes,
          split on newlines, and parse each complete line as a
          JSON object. Each parsed object is dispatched to the
          SuggestionStore as a <code>PROPOSE(field, value,
          confidence, source)</code> action. The store transitions
          that field&rsquo;s state from <code>idle</code> to
          <code> proposed</code> and notifies subscribers.
          Field UIs subscribed to the suggestion store re-render
          to show the proposal. We wrap the store dispatch in
          React&rsquo;s <code>startTransition</code> so streaming
          updates never preempt user input — if the user is
          typing into field 5 and a suggestion for field 5
          arrives, the keystroke wins because it&rsquo;s an urgent
          update; the suggestion update is non-urgent and waits
          its turn.
        </p>
        <p>
          The <strong>per-field state machine</strong> tracks
          where each field is in the suggestion lifecycle:
          <code> idle → pending → proposed → accepted /
          rejected / edited / superseded</code>. <em>Pending</em>
          is set when the user triggers fill but the
          suggestion hasn&rsquo;t arrived yet; the field shows a
          subtle pending indicator. <em>Proposed</em> is when a
          suggestion has arrived and is rendered as a ghost.
          <em> Accepted</em> means the user committed it.
          <em> Rejected</em> means the user dismissed it.
          <em> Edited</em> means the user accepted but then
          modified the value — useful for telemetry showing
          which AI outputs are usually right vs need adjustment.
          <em> Superseded</em> means the user typed into the
          field while a suggestion was in flight, so the
          suggestion is no longer applicable and is silently
          discarded when it arrives.
        </p>
        <p>
          <strong>Concurrent user input handling</strong> is the
          subtle correctness concern. If the user is editing
          field 3 while a suggestion for field 3 arrives, what
          happens? Three rules: the user&rsquo;s value always
          stays in the form store (we never overwrite); the
          suggestion is marked <code>superseded</code> on
          arrival; the UI does not pop a ghost value into a
          field the user is actively editing because that&rsquo;s
          startling. Implementation: when we receive a
          PROPOSE action, we check the form store&rsquo;s
          per-field <code>userTouchedSinceTrigger</code> flag;
          if true, we mark the suggestion superseded
          immediately. This flag is set the first time the user
          types or edits the field after the AI fill was
          triggered and reset on the next trigger.
        </p>
        <p>
          <strong>Schema validation</strong> happens on every
          incoming suggestion. The form runtime exposes a
          <code> validateSuggestion(field, value)</code> helper;
          the suggestion controller calls it with the proposed
          value before transitioning to <code>proposed</code>.
          If the suggestion violates type or constraints (an
          enum that doesn&rsquo;t match, a number outside
          bounds, a malformed date), we silently reject it and
          log; the user never sees a broken suggestion. This
          protects users from LLM hallucinations and makes the
          system resilient to occasional model drift.
        </p>
        <p>
          On <strong>accept</strong> (per-field or bulk), the
          suggestion writes into the form store via the same
          <code> setValue</code> path as a user keypress. The
          field transitions to <code>accepted</code>. Validation
          re-runs (because the schema validator may surface
          additional issues, e.g. cross-field rules).
          Telemetry emits an
          <code> ai_suggestion_accepted</code> event with field
          name, confidence, and source. On <strong>reject</strong>,
          the form value is unchanged; the field transitions
          to <code>rejected</code>; telemetry emits
          <code> ai_suggestion_rejected</code>.
        </p>
        <p>
          <strong>Inline edit before accept</strong> uses a
          small flow: the suggestion ghost has an &ldquo;Edit&rdquo;
          affordance that promotes the value into an editable
          input prefilled with the suggestion. The user can
          modify and confirm; the field transitions to
          <code> edited</code>, which is treated as accepted with
          a marker for telemetry. This avoids the awkward
          accept-then-correct flow that&rsquo;s common in poorly
          designed AI assistants.
        </p>
        <p>
          <strong>Undo</strong> is implemented at the suggestion
          plane. After acceptance, the suggestion remains in
          the suggestion store with its prior form-value
          recorded; an undo bar (similar to email&rsquo;s &ldquo;Undo
          Send&rdquo;) lets the user revert per field or
          bulk. After a TTL (e.g. 30 seconds) or a navigation,
          the undo records expire.
        </p>
        <p>
          <strong>Cancellation</strong>: the trigger creates an
          <code> AbortController</code>; clicking Cancel calls
          <code> abort()</code>. In-flight suggestions are
          discarded; pending fields transition back to
          <code> idle</code>. Streamed-but-not-yet-accepted
          suggestions remain proposed until the user resolves
          them; we don&rsquo;t silently clear them on cancel
          because the user might still want to act on what
          arrived.
        </p>
        <p>
          <strong>Privacy boundary</strong>: the redaction layer
          runs client-side on a configurable rule set (regex for
          SSN, card numbers, etc., plus an optional ML-based
          PII detector for richer matches). Redacted source
          material has the matched ranges replaced with
          placeholders that the server-side prompt is
          instructed to ignore. Sensitive fields are excluded
          from suggestions entirely — they&rsquo;re marked in
          the schema, and the suggestion controller filters
          them from the request payload. On the server side,
          source documents are retained only for the request
          duration; audit logs record access. Consent prompts
          run on first use per form and per data type, with
          explicit opt-in for sources beyond the user&rsquo;s
          own current upload.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/ai-assisted-form-fill-architecture.svg"
        alt="AI-assisted Form Fill Architecture"
        caption="Two parallel state planes: form values (truth) and suggestions (advisory). Sources → client-side redaction → streaming suggestion controller → per-field state machine → field overlay UI with explicit accept/reject. User input always wins; suggestions are never auto-applied."
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SuggestionController</strong> orchestrates the
          request lifecycle: collect sources, run redaction,
          start streaming, parse, dispatch. Owns the
          AbortController.
        </p>
        <p>
          <strong>SuggestionStore</strong> holds per-field
          suggestion state (the parallel plane). Exposes
          selectors so field UIs can subscribe to one
          field&rsquo;s suggestion slice; updates are
          fine-grained the same way the form store is.
        </p>
        <p>
          <strong>FieldOverlay</strong> renders next to a field
          input when a suggestion exists, showing the proposed
          value as a ghost, a confidence chip, a source link,
          and accept / reject / edit affordances.
        </p>
        <p>
          <strong>BulkActionsBar</strong> appears when at least
          one suggestion exists, offering Accept all, Reject
          all, Cancel current run, and Regenerate.
        </p>
        <p>
          <strong>RedactionLayer</strong> client-side PII
          detection and masking. Pluggable rule set; defaults
          cover SSNs, credit card numbers, and obvious
          patterns. ML-based detector is opt-in.
        </p>
        <p>
          <strong>StreamParser</strong> splits the response
          stream on newlines and parses each line as JSON.
          Buffers partial lines across chunks. Handles parse
          errors by skipping the malformed line with a
          telemetry event.
        </p>
        <p>
          <strong>FormEngineAdapter</strong> bridges to the form
          runtime: validates suggestions against schema, writes
          accepted values via the standard
          <code> setValue</code> path, listens for user-touch
          events to mark superseded suggestions.
        </p>
        <p>
          <strong>UndoController</strong> tracks recently
          accepted suggestions with their prior values; offers
          revert per field and bulk; expires entries after
          TTL.
        </p>
        <p>
          The architectural patterns are{" "}
          <strong>parallel state planes</strong> (form vs
          suggestions),
          <strong> streaming via ReadableStream</strong>,
          <strong> per-field state machines</strong>,{" "}
          <strong>defense in depth</strong> for redaction
          (client + server), and <strong>provider adapter</strong>{" "}
          for swapping AI services without UI changes.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The form value plane is the form runtime&rsquo;s store,
          unchanged by the AI feature. The suggestion plane is
          the SuggestionStore, an external store keyed by
          field name. Each entry holds:{" "}
          <code>{`{ status, proposedValue, confidence, source, priorValue?, supersededAt? }`}</code>.
          Field UIs subscribe to both stores (form value via
          existing form runtime hooks, suggestion via
          <code> useSuggestion(name)</code>); they render the
          form value as primary and overlay suggestion if
          present.
        </p>
        <p>
          Subscriptions are fine-grained per field, the same
          way the form store works, so a streaming suggestion
          for field 47 doesn&rsquo;t re-render fields 1–46.
          Updates during streaming are wrapped in
          <code> startTransition</code> so React treats them
          as non-urgent and yields to user input.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Client → Server payload:
          <code>{` { schemaId, sources: [{ kind, content, redactionMap }], options }`}</code>.
          Server → Client stream: JSON-lines messages, each
          shape{" "}
          <code>{` { type: "suggestion", field, value, confidence, source }`}</code>{" "}
          plus terminal messages like <code>done</code> or
          <code> error</code>. Per-field actions:
          <code> accept</code>, <code>reject</code>,
          <code> edit</code>, <code>regenerate</code>, all
          dispatched to the SuggestionController which
          routes to the SuggestionStore and, on accept, to
          the form runtime via the FormEngineAdapter.
        </p>
      </section>

      <section>
        <h2>⚡ Performance &amp; Streaming</h2>
        <p>
          We use <code>fetch</code> with a
          <code> ReadableStream</code> body for streaming
          responses. The StreamParser buffers across chunks,
          finds newlines, parses complete JSON lines, and
          dispatches one action per parsed line. Updates wrap
          in <code>startTransition</code> so streaming never
          competes with input. The first suggestion typically
          arrives well under a second; subsequent ones flow
          progressively. We cancel via
          <code> AbortController</code> when the user clicks
          Cancel or navigates away.
        </p>
        <p>
          Parsing happens in microtasks via
          <code> queueMicrotask</code>; we don&rsquo;t process
          all chunks synchronously because a fast stream
          could starve the main thread. On slow networks,
          we surface a visible streaming indicator so users
          know the system is working; we never let the UI
          appear frozen.
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX Considerations</h2>
        <p>
          Suggestions render as ghost text in the field or a
          chip beside the field, distinctly styled from user
          input — never auto-committed. Confidence renders as
          a colored badge with text label (low / medium / high),
          never as a numeric percentage exposed to non-power
          users. Source attribution shows which input or
          document snippet produced the value, with a click-to-
          reveal link. Per-field accept/reject buttons sit
          adjacent to the field; Tab order goes input →
          accept → reject so keyboard users land on actions
          quickly. Bulk accept/reject is a top-of-form bar
          that appears when at least one suggestion exists.
          Undo bar after bulk accept gives users a safety net.
        </p>
        <p>
          AI origin is always perceivable: a sparkle icon, a
          distinct background tint, the word
          &ldquo;Suggested&rdquo; — all together, not relying
          on color alone. Screenshots taken from the form
          should make it obvious which values are AI-suggested
          and which are user-entered.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Suggestions announce via polite live region:
          &ldquo;Suggestion available for Address: 221B Baker
          Street, confidence high.&rdquo; We don&rsquo;t announce
          every suggestion individually if many arrive in a
          burst — we batch into &ldquo;5 new suggestions
          available&rdquo; with a separate landmark for
          screen reader users to navigate. Per-field accept and
          reject are keyboard-shortcut-bound (Alt+Enter to
          accept, Alt+Backspace to reject, configurable);
          keyboard users can act on suggestions without
          mouse movement. Confidence badges have text
          equivalents (the badge announces &ldquo;high
          confidence&rdquo; via aria-label, not just by
          color). Source attribution links are reachable via
          Tab and read out their target.
        </p>
      </section>

      <section>
        <h2>🔐 Security &amp; Privacy</h2>
        <p>
          Client-side redaction strips obvious PII before sending
          source material. The redaction rule set is
          configurable per form and per data type; defaults
          cover SSNs, credit card numbers, IBAN, dates of
          birth in narrow contexts. Server-side redaction runs
          again as defense in depth. Explicit consent prompts
          on first use describe what data is sent where, with
          opt-in granularity per source type. Sensitive fields
          marked in the schema are excluded from the request
          payload — passwords, security questions, and
          payment details never participate in AI fill.
        </p>
        <p>
          Source documents on the server: ephemeral retention
          (request duration only), audited access. Audit logs
          record who triggered an AI fill, what schema, what
          sources, and what suggestions were produced — so a
          privacy review can reconstruct the data flow if
          needed. The system never auto-submits the form;
          submission is always a user action with all the
          standard CSRF and idempotency protections of the
          form runtime.
        </p>
        <p>
          Output sanitization: AI-produced values render as
          text. Even if the model produced HTML, our renderer
          treats it as plain text. This protects against
          prompt injection attacks where source material
          contains instructions to the model to inject
          malicious output.
        </p>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <p>
          Unit tests cover the per-field state machine
          transitions, the stream parser against canonical
          JSON-lines fixtures and malformed inputs, the
          redaction rule set against representative PII
          patterns, and the schema validation of incoming
          suggestions. Integration tests interleave streaming
          with simulated user typing: a suggestion for field
          5 must be marked superseded if the user types into
          field 5 first; bulk Accept all must skip
          user-edited fields. Failure-mode tests inject
          server errors mid-stream and verify the form
          remains in a coherent editable state. End-to-end
          tests in real browsers exercise the keyboard
          accept/reject flow with a screen reader stub.
          Privacy tests verify that sensitive fields are
          excluded from the request payload and that
          redaction strips known PII from sources.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <p>
          User edits a field while its suggestion is in
          flight: mark the incoming suggestion as
          <code> superseded</code> and silently drop. Stream
          truncates mid-response: mark unprocessed fields as
          failed; offer Regenerate; user&rsquo;s already-
          received suggestions remain actionable. Server
          returns a malformed line: skip with telemetry; do
          not break the rest of the stream. Suggestion
          violates schema (bad enum, type mismatch): silently
          reject with telemetry; never surface an invalid
          suggestion. Cross-field consistency violations
          (suggested city doesn&rsquo;t match suggested zip):
          accept-all applies independently passing fields
          and surfaces the conflict for the rest. Sensitive
          field configured incorrectly (schema lacks the
          flag but should have it): the system has no way
          to know; we mitigate via reviewable schema
          checklists in the authoring tool. Bulk accept
          followed by user undo: revert each field to its
          recorded prior value via the UndoController.
          Cancel during streaming: abort the request, mark
          pending fields as <code>idle</code>, leave
          already-arrived suggestions actionable. Network
          offline mid-stream: suggestions stop arriving;
          surface an inline retry option; user&rsquo;s
          existing suggestions and form values remain
          intact.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <p>
          The provider adapter abstracts the AI service so
          consumers can swap providers (different LLM
          vendors, on-premises deployments) without
          touching UI. The redaction rule set is a registry;
          adding a custom PII pattern is a one-line addition.
          The state machine, store, and UI components are
          all separately consumable: a product can adopt
          just the streaming parser, just the suggestion
          UI, or the full stack. The form-engine integration
          is via a small adapter; the system works with any
          form runtime that supports a custom field
          extension.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Suggestions arrive in the user&rsquo;s configured
          language; the backend normalizes formatting (dates,
          numbers) per locale. UI strings (badges, labels,
          live region announcements) resolve through the
          host&rsquo;s i18n function. RTL layouts flip via
          CSS logical properties; the suggestion ghost
          alignment adapts naturally. For multilingual
          sources, the backend handles translation and
          marks the source-language metadata so the UI can
          surface it if needed.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Auto-apply vs explicit accept</h3>
        <p>
          Auto-apply is faster and feels magical but erodes
          trust the moment the AI is wrong, which it
          inevitably is. Explicit accept respects user
          agency, builds trust through repeated correct
          suggestions, and keeps the audit trail clean
          (you can always answer &ldquo;did the user
          actually want this value?&rdquo; with yes). We
          chose explicit accept; the cost is a few extra
          clicks per session and the win is durable
          trust.
        </p>

        <h3>Stream vs batch</h3>
        <p>
          Streaming makes perceived latency much better —
          users see something immediately instead of
          waiting for the whole response. The cost is more
          complex state management (per-field state
          machines, supersede logic). For long forms with
          dozens of fields, streaming is unequivocally
          better; for short forms with three fields, it
          doesn&rsquo;t matter much. We default to
          streaming because the architecture is forwards-
          compatible.
        </p>

        <h3>Client-side vs server-only redaction</h3>
        <p>
          Defense in depth: do both. Client-side prevents
          obvious PII from ever leaving the browser;
          server-side catches what the client missed and
          enforces policy uniformly across consumers. The
          cost is code duplication; the win is real
          privacy posture rather than a single point of
          failure.
        </p>

        <h3>Confidence threshold gating</h3>
        <p>
          Low-confidence suggestions can be more harmful
          than helpful — users may accept them out of
          inertia, then submit wrong values. We hide low-
          confidence suggestions by default with a toggle
          to show them; high-confidence appears
          automatically. The cost is some loss of recall
          for power users who want every signal; the win
          is fewer foot-gun suggestions for casual users.
        </p>

        <h3>Two state planes vs single merged state</h3>
        <p>
          Two planes (form values + suggestions) means
          slightly more code and explicit reconciliation,
          but it preserves the invariant that the form
          store is always the user&rsquo;s truth. A single
          merged state with a flag &ldquo;is this user or
          AI?&rdquo; is simpler to implement but harder to
          reason about and easier to break (one missed flag
          check and the form silently submits an AI value
          as if the user typed it). We chose two planes;
          the cost is small in absolute terms.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          On-device models for sensitive forms would
          eliminate the data-leaves-device concern; with
          modern WebGPU and efficient small models this is
          becoming feasible. Active learning from user
          corrections (with explicit consent) would
          improve the model on a per-organization basis
          over time. Voice-input form fill via streaming
          transcription extends the source kinds. A
          regenerate-this-field action that re-prompts the
          model with a refined context would help when the
          AI was close but not quite right. Cross-form
          context — &ldquo;you filled this same field in
          your last claim with X&rdquo; — could turn
          fill into a copilot for repeated workflows.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How do suggestions and user input coexist
          without trampling each other?</strong> Two parallel
          state planes: the form store owns user values
          and is never overwritten; the suggestion store
          owns AI proposals. UIs render the user value as
          primary and overlay suggestions as accept/reject
          affordances. If a user types while a suggestion
          is in flight, the incoming suggestion is marked
          superseded and discarded.
        </p>

        <p>
          <strong>2. How is streaming parsed and rendered without
          UI thrash?</strong>
          <code> fetch</code> with a
          <code> ReadableStream</code> body; buffer chunks,
          split on newlines, parse each complete JSON line,
          dispatch as actions wrapped in
          <code> startTransition</code>. Per-field
          subscriptions ensure only the affected field re-
          renders; React 19 transitions ensure streaming
          never preempts user input.
        </p>

        <p>
          <strong>3. What is your privacy posture for source
          documents and PII?</strong> Defense in depth:
          client-side redaction strips obvious PII before
          sending; server-side redaction runs again;
          sensitive fields excluded from suggestion
          payloads entirely; ephemeral server-side
          retention with audit logs; explicit consent on
          first use per data type. The system never auto-
          submits.
        </p>

        <p>
          <strong>4. Why are suggestions never auto-applied?</strong>{" "}
          Auto-apply erodes trust the moment AI is wrong,
          which it inevitably is. Explicit accept preserves
          user agency, builds trust through repeated
          correct suggestions, and keeps audit trails
          clean. The cost is a few clicks; the win is
          durable trust.
        </p>

        <p>
          <strong>5. How do you handle suggestions that violate
          schema?</strong> Validate every incoming suggestion
          against schema and per-field validators before
          transitioning to <code>proposed</code>. Violations
          are silently rejected with telemetry; users
          never see a malformed suggestion. This protects
          against LLM hallucinations and model drift.
        </p>

        <p>
          <strong>6. How do you avoid leaking suggestions across
          users in a shared cache?</strong> Suggestions are
          stored in user-scoped client state and never
          cached cross-user on the server. The server
          treats every request as user-bound; audit logs
          confirm that. Sensitive fields are excluded
          regardless. On logout, suggestion state clears
          alongside form draft state.
        </p>

        <p>
          <strong>7. How do you make accept/reject keyboard
          accessible?</strong> Per-field shortcut bindings (Alt
          +Enter accept, Alt+Backspace reject) in addition
          to Tab-reachable buttons. Tab order goes input →
          accept → reject so keyboard users land on action
          buttons quickly. Live region announces
          suggestions and accept/reject results.
        </p>

        <p>
          <strong>8. How would you add a regenerate-this-field
          action?</strong> The suggestion controller already
          supports field-scoped requests via the same
          stream protocol, but with a single-field request
          payload. The server runs a more focused prompt
          based on the user&rsquo;s context; the response
          replaces the prior suggestion. The state machine
          handles this naturally: the new proposal
          supersedes the old.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          AI-assisted form fill should be a{" "}
          <strong>parallel advisory plane</strong>, never a
          silent auto-writer. Stream per-field suggestions
          with explicit per-field state machines, give
          users keyboard-accessible accept and reject with
          clear confidence and source attribution, redact
          PII at the boundary, and never auto-apply. The
          system&rsquo;s job is to save users typing, not to
          take ownership of their values. Build for trust
          first; speed second. Get the trust right and
          users will ask for more AI features; get it
          wrong and they&rsquo;ll turn it off and never
          come back.
        </p>
      </section>
    </ArticleLayout>
  );
}
