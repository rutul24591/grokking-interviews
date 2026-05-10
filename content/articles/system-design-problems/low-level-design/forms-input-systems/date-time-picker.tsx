"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-date-time-picker",
  title: "Design a Date / Time Picker",
  description:
    "LLD for an accessible Date/Time Picker handling time zones, locale formats, keyboard navigation, ranges, and constraint-driven availability.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "date-time-picker",
  wordCount: 6100,
  readingTime: 32,
  lastUpdated: "2026-04-28",
  tags: ["lld", "date-picker", "time-zone", "i18n", "accessibility", "react"],
  relatedTopics: ["form-builder", "form-validation-engine"],
};

export default function DateTimePickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a Date/Time Picker — a control that lets
          users select a date, a time, a date+time, or a date range
          across locales and time zones, with full keyboard
          accessibility and configurable constraints. The picker is
          deceptively complex because date and time involve a tangle
          of locale, time zone, calendar system, DST, and
          accessibility constraints that any single shortcut
          eventually breaks. The goal is a control that feels
          native everywhere, stores canonical values that round-trip
          cleanly through APIs, and stays correct across the
          edge cases that real users actually hit.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: representing values canonically
          while displaying them in the user&rsquo;s locale and time
          zone; handling DST transitions correctly; making a
          two-dimensional calendar grid keyboard-accessible per
          WAI-ARIA; offering range selection without confusing
          single-date users; and choosing the right balance between
          a custom UI on desktop (where rich keyboard interaction
          shines) and the native input on mobile (where the OS
          picker is overwhelmingly better than anything we could
          build).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users select dates and times in booking flows,
          scheduling tools, filters, expirations, and bookkeeping.
          They are on every device, every locale, every time zone,
          and frequently make mistakes that the picker should
          either prevent or surface clearly. Internal stakeholders
          include i18n teams who care about locale correctness,
          accessibility specialists who require the WAI-ARIA
          datepicker pattern done correctly, and engineers who
          consume the control through the form runtime as a
          field type.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Underlying date library is Temporal where available
          (correct by construction for time zones and calendars),
          with a date-fns or Luxon fallback for environments
          without Temporal. Time zones are IANA-named; the
          form&rsquo;s default time zone is the user&rsquo;s,
          configurable per instance. Storage format is ISO 8601
          with offset for instants and date-only ISO strings for
          calendar dates. Modern browsers; we use
          <code> Intl.DateTimeFormat</code> for formatting.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not build a full agenda or calendar view —
          that&rsquo;s a separate scheduler component. We do not
          build a recurring rule editor (RRULE syntax is its own
          subsystem). We do not implement holiday data or
          business-hours availability — these are constraint
          inputs to the picker, not features it owns.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Modes: single date, single time, date+time, date
          range, date+time range. Min/max bounds. Disabled days
          and times via predicate function. Granularity for time
          (1, 5, 15, 30 minutes). Localized formats and weekday /
          month names; 12 vs 24 hour clock following locale.
          Time zone display and storage in canonical ISO-with-
          offset. Keyboard navigation: arrow keys to move focus,
          Page Up/Down for month, Shift+Page Up/Down for year,
          Home/End for week edges, Enter to select, Escape to
          close. Inline and popover variants. Mobile fallback to
          native input where appropriate.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Presets like &ldquo;Today&rdquo;, &ldquo;Yesterday&rdquo;,
          &ldquo;This week&rdquo;, &ldquo;Last 30 days&rdquo;.
          Smart parsing of free-text input (&ldquo;next Friday
          3pm&rdquo;) with a confirmation step. Two-month visible
          variant for range selection. Highlighted special days
          (weekends, holidays). Min nights / max nights for hotel-style
          range selection.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Long-form scheduling assistance (busy/free), availability
          feeds, recurring rules, and time-off block visualization
          are separate components.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Month grid renders in under 50 ms. Selection updates
          re-render only the affected cells, not the full grid.
          Cached <code>Intl.DateTimeFormat</code> instances per
          locale.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Time zone correctness across DST transitions — including
          spring-forward gaps where 2:30 AM does not exist on
          some days, and fall-back overlaps where 1:30 AM happens
          twice. Year boundaries (Dec 31 → Jan 1) and locale
          week-start differences (Sunday vs Monday vs Saturday)
          handled correctly.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Strict parser; reject ambiguous strings rather than
          guessing. Server is the authority on availability;
          client checks are advisory.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          WAI-ARIA grid pattern for the calendar; full keyboard
          navigation; live region announcements for month
          changes; proper labels.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Pluggable date library via a thin adapter so we can
          migrate from date-fns to Temporal as Temporal stabilizes.
          Formatting goes through Intl exclusively; no
          hand-rolled date arithmetic in calling code.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <HighlightBlock as="p" tier="important">
          The picker has two complementary surfaces: a
          <strong> field</strong> (text input + popover trigger)
          and a <strong>calendar</strong> (the popover content
          with grid and time controls). Both share a single
          headless core hook that owns canonical state. The
          headless core is what makes the picker theme-able,
          locale-aware, and reusable — visual variants
          (inline, popover, bottom-sheet on mobile) skin the
          same engine.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The most important architectural decision is{" "}
          <strong>canonical storage with locale-aware
          display</strong>. Internally, the picker stores a
          canonical value: a Temporal.ZonedDateTime (or an ISO
          string with offset for compatibility). Display
          formatting goes through
          <code> Intl.DateTimeFormat</code> with the active
          locale. User typing into the text input goes through a
          strict parser that knows the locale&rsquo;s expected
          format and rejects ambiguous inputs rather than
          guessing. This canonical-internal-display-external
          model is what keeps DST, time zone, and locale
          variations from contaminating each other.
        </HighlightBlock>
        <p>
          On <strong>mount</strong>, the picker resolves the
          active locale and time zone from props or context.
          Default value is set from
          <code> value</code> or <code>defaultValue</code>; if
          the latter is provided as a string, the parser
          converts it canonically. The calendar grid&rsquo;s
          view month is initialized to the active value&rsquo;s
          month (or today if no value). The headless core
          exposes
          <code> {`{ value, viewDate, focusDate, isOpen, mode, granularity, … }`}</code>
          plus mutator handlers. The field component subscribes
          to value and renders the formatted display string;
          the calendar subscribes to viewDate, focusDate, and
          value to render the grid.
        </p>
        <p>
          On <strong>typing into the field</strong>, the parser
          attempts to interpret the input. Partial inputs
          (&ldquo;3/15&rdquo;) get an interpretation with the
          current year; ambiguous inputs (&ldquo;05/06&rdquo; in a
          locale where both MM/DD and DD/MM exist) surface a
          parse error inline rather than guessing. Successful
          parses commit on blur or after a brief debounce. We do
          not commit on every keystroke because users typing
          partial values would experience flickering errors.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>opening the popover</strong>, the calendar
          mounts. The grid renders one month (or two for range
          selection) of weeks. The week starts on the locale&rsquo;s
          configured first day (Sunday in en-US, Monday in
          most of Europe, Saturday in some Arabic-speaking
          locales) — read from
          <code> Intl.Locale</code>&rsquo;s
          <code> weekInfo</code> or, where unavailable, from a
          locale data table. Cells render dates as buttons in a
          grid (<code>role=&quot;grid&quot;</code>), and the
          currently focused cell carries
          <code> tabIndex=&quot;0&quot;</code> while others are
          <code> tabIndex=&quot;-1&quot;</code>. This
          single-tabstop pattern is what lets keyboard users
          enter the calendar on the focused date and use arrows
          to navigate without tab-trampolining.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>arrow key navigation</strong>, focus moves
          one day at a time; if focus crosses a month boundary,
          the view month updates and a polite live region
          announces the new month. Page Up/Down moves a month;
          Shift+Page Up/Down moves a year; Home/End move to
          week edges. We move the focused date independently of
          the selected date — focus is just &ldquo;where the
          user is looking&rdquo;; selection happens on Enter.
          This separation is critical for accessibility: a
          screen reader user can explore dates without
          accidentally selecting them.
        </HighlightBlock>
        <p>
          On <strong>selection</strong>, the headless core
          updates its canonical value via the date adapter.
          For date+time, the time component preserves the
          previously selected time (or defaults to noon on a
          fresh selection). For ranges, the first selection
          sets the start; the second selection sets the end and
          closes the popover (with auto-flip if the user
          selected the end before the start). The field
          updates to the new formatted string; the form
          runtime receives the canonical value via
          <code> onChange</code>.
        </p>
        <p>
          <strong>DST handling</strong> deserves explicit
          attention. On spring-forward days, 2:30 AM may not
          exist in the active time zone; the picker rounds
          forward to the next valid minute, never silently to
          a different day. On fall-back days, the same wall
          time occurs twice; we use Temporal&rsquo;s disambiguation
          option (<code>compatible</code>, the spec default) and
          surface the offset in the display so users can tell
          which occurrence was selected when it matters
          (medication doses, broadcast scheduling). We never
          store wall time without an offset; canonical storage
          is always zoned.
        </p>
        <p>
          <strong>Time zone changes</strong> in the form
          (e.g. user picks a different time zone in a
          neighboring control) update the picker&rsquo;s display
          without changing the canonical value. The instant
          stays the same; the wall-time presentation
          shifts. This decoupling is the reason canonical
          storage is non-negotiable: if we stored wall time,
          changing the time zone would silently mean a different
          instant.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Range selection</strong> is implemented with
          a small state machine inside the headless core:
          <code> idle → selectingStart → selectingEnd → committed</code>.
          Clicking a date when in
          <code> selectingStart</code> moves to
          <code> selectingEnd</code>; clicking a date when in
          <code> selectingEnd</code> commits. Hovering a date
          while in <code>selectingEnd</code> renders a preview
          of the range. If the second click is before the
          first, we auto-flip and treat the earlier date as
          the start. Min-nights / max-nights constraints
          disable cells that would violate them.
        </HighlightBlock>
        <p>
          <strong>Mobile</strong> uses the native
          <code> {`<input type="date">`}</code> or
          <code> type="datetime-local"</code> by default
          because the OS picker is unequivocally better than
          any custom UI we could build. We detect mobile via
          pointer media queries and a User-Agent hint; on
          mobile, the field renders with a native input as
          the visible control, and the rich popover is not
          mounted. Desktop gets the rich popover. This
          hybrid is dramatically better UX than either
          extreme.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/date-time-picker-architecture.svg"
        alt="Date / Time Picker Architecture"
        caption="Headless core hook owning canonical ZonedDateTime; DateField + Calendar + TimePicker + RangeController skin the same engine. Canonical-internal, locale-aware-display, with an adapter abstracting Temporal/date-fns/Luxon."
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="important">
          <strong>DateField</strong> is the visible field —
          either a text input that opens a popover, or on
          mobile, a native input. It handles parse-on-blur,
          renders the formatted value, and triggers the
          calendar.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Calendar</strong> is the month grid. It
          renders cells as buttons in a grid layout, manages
          focus via the single-tabstop pattern, and handles
          keyboard navigation. It accepts a
          <code> highlightDay</code> callback for special
          days (weekends, holidays, busy days) so the host
          can decorate without forking the component.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>TimePicker</strong> is the time selection
          surface — hours and minutes columns, with optional
          seconds, AM/PM toggle for 12-hour locales, and
          step/granularity. On mobile, the native input
          handles this; on desktop, we render either a
          scrolling column UI or simple selects depending on
          density.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>RangeController</strong> orchestrates
          start and end selection with auto-flip and
          min/max-nights constraints. It holds the small
          state machine described above and emits both
          values to consumers.
        </HighlightBlock>
        <p>
          <strong>TimezoneSelect</strong> is an optional
          companion control for cases where the user
          chooses the time zone explicitly (event creation
          tools, travel booking).
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>DateAdapter</strong> abstracts the
          underlying date library. The picker calls a small
          set of operations (add days, get month start,
          format, parse, compare); the adapter implements
          them on Temporal, date-fns, or Luxon. This
          insulates the picker from library churn.
        </HighlightBlock>
        <p>
          The architectural patterns are <strong>compound
          components</strong> (
          <code>{`<DatePicker.Field>`}</code> +{" "}
          <code>{`<DatePicker.Calendar>`}</code>),
          <strong> headless core hook</strong>{" "}
          (<code>useDatePicker</code>) returning state and
          handlers, <strong>controlled or uncontrolled</strong>{" "}
          via <code>value</code> /
          <code> defaultValue</code>, and
          <strong> adapter</strong> for the date library.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important">Local state holds: canonical
          <code> value</code>, <code>viewDate</code> (which
          month is visible), <code>focusDate</code> (which
          cell has keyboard focus), <code>isOpen</code>,
          and range-mode machine state.</HighlightBlock>
<HighlightBlock as="p" tier="important">External controlled
          <code> value</code> supersedes internal when
          provided. <code>onChange</code> emits the
          canonical value with offset so consumers store
          ISO strings, not naive locals.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The separation of <code>focusDate</code> from{" "}
          <code>value</code> matters. Arrow keys move focus
          without committing; only Enter commits. Without
          this separation, users couldn&rsquo;t explore
          dates without accidentally selecting them, and
          screen reader users would have a particularly bad
          time.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Inputs:{" "}
          <code>value</code>, </Highlight><code>onChange</code>,
          <code> min</code>, <code>max</code>,
          <code> disabledDate</code>, <code>locale</code>,
          <code> timeZone</code>, <code>granularity</code>,
          <code> mode</code>,
          <code> firstDayOfWeek</code> (override),
          <code> presets</code>.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Output: ISO string with
          offset for instants, ISO date string for
          calendar dates, or two strings for ranges. The
          picker emits invalid or empty values as null
          rather than throwing; the caller decides how to
          handle.</HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance Strategy</h2>
        <HighlightBlock as="p" tier="important">The month grid memoizes by (year, month, locale, timezone, disabledDate ref);</HighlightBlock>
<HighlightBlock as="p" tier="important">recomputation only happens when those change. Intl.DateTimeFormat instances are cached per</HighlightBlock>
<HighlightBlock as="p" tier="important">(locale, options) tuple because constructing one is surprisingly expensive (sub-ms but adds up).</HighlightBlock>
<HighlightBlock as="p" tier="crucial">The Calendar component is
          lazy-loaded; the field renders standalone, and the
          calendar mounts when the popover opens. For
          inline variants, we ship Calendar in the initial
          bundle.</HighlightBlock>
      </section>

      <section>
        <h2>🎨 UI/UX Considerations</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Highlight today distinctly. Mark weekends and
          (when configured) holidays. For ranges, hover
          renders a preview of the range with a subtle
          background; auto-flip if the user clicks an earlier
          end date than the start.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Type-to-jump for month
          names accelerates navigation (typing &ldquo;m&rdquo;
          jumps to March). On mobile, fall back to the
          native input which handles all of this with the OS
          picker. Bottom-sheet variant for mobile-styled custom
          UIs avoids the popover positioning issues that
          plague mobile-style sheets.</HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">The field carries an aria-label describing the value (&ldquo;March 15, 2026&rdquo;). Live region announces month</HighlightBlock>
<HighlightBlock as="p" tier="important">changes (&ldquo;March 2026&rdquo;) on Page Up/Down. We do not rely on color alone for state — disabled cells have a distinct</HighlightBlock>
<HighlightBlock as="p" tier="important">text style; selected cells have both color and a visible border. Sufficient contrast (WCAG AA at minimum) on all states.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Strict parser rejects ambiguous strings rather
          than silently picking an interpretation that may
          be wrong. The picker never executes user-supplied
          strings; it only parses them.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Server is the
          authority on availability — the picker&rsquo;s
          <code> disabledDate</code> callback is a UX
          convenience, not an enforcement mechanism. Any
          server-side constraint must be re-checked when
          submission happens because availability can
          change between picker open and submit.</HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <HighlightBlock as="p" tier="crucial">Visual snapshot tests for boundary months (February of leap years, months that</HighlightBlock>
<HighlightBlock as="p" tier="important">span DST transitions). Cross-locale tests verify formatting and parsing in en-US,</HighlightBlock>
<HighlightBlock as="p" tier="important">en-GB, ar-SA, ja-JP, hi-IN. Cross-time-zone tests verify canonical-storage round-trips.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <HighlightBlock as="p" tier="crucial">Range with same start and end on a disabled day: treat as invalid; surface the reason. Two-month view when selection spans</HighlightBlock>
<HighlightBlock as="p" tier="important">months: keep both visible. Pasted invalid string: surface error inline; do not corrupt state. Calendar opened on a disabled-day-only</HighlightBlock>
<HighlightBlock as="p" tier="important">week: focus the next valid day, not a disabled one. A min date that&rsquo;s after max : treat as a misconfiguration; log and clamp.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <HighlightBlock as="p" tier="crucial">The DateAdapter is the primary extension point —
          consumers can swap libraries by implementing the
          small operation set. Theming uses design tokens;
          render-prop slots for cell content and field
          rendering let consumers customize without forking.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Pluggable presets and custom highlights add via
          configuration. The headless hook can power
          entirely custom UIs (calendar widgets,
          mini-pickers in tooltips) using the same canonical
          state.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">All formatting via
          <code> Intl.DateTimeFormat</code> with the active
          locale; no hard-coded month or day names. RTL
          flips the calendar grid via CSS logical
          properties; weekday header order honors locale
          conventions.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">Numbering systems (Arabic-Indic,
          Devanagari) via
          <code> Intl.NumberFormat</code>&rsquo;s
          <code> numberingSystem</code> option. Calendars
          beyond Gregorian (Islamic, Hebrew, Buddhist) are
          accessible through Temporal&rsquo;s calendar
          parameter; the picker respects the
          <code> calendar</code> from
          <code> Intl.Locale</code> when configured.</HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Custom desktop UI vs native input on mobile</h3>
        <HighlightBlock as="p" tier="crucial">
          The OS picker on mobile is dramatically better
          than anything we could build — it handles
          accessibility, scrolling, calendar systems,
          time zone, and platform conventions natively. On
          desktop, the OS picker is generic at best; a
          custom UI offers richer keyboard interaction and
          better integration with surrounding form UX. We
          ship a hybrid: native on mobile, custom on
          desktop, with a small detector at runtime. This
          is unequivocally better UX than picking either
          extreme.
        </HighlightBlock>

        <h3>Temporal vs date-fns / Luxon</h3>
        <HighlightBlock as="p" tier="important">
          Temporal is correct by construction for time
          zones, calendars, and DST; it&rsquo;s the future
          and worth adopting once browser support is
          ubiquitous. date-fns is mature, lightweight, and
          tree-shakable but treats time zones as an
          afterthought. Luxon handles time zones well but
          carries more weight. We use the adapter pattern
          to support all three; new code uses Temporal
          where available, falls back gracefully.
        </HighlightBlock>

        <h3>Local-time vs ISO-with-offset storage</h3>
        <HighlightBlock as="p" tier="important">
          Local time stripped of zone is ambiguous and
          breaks across time zone boundaries. ISO-with-
          offset is unambiguous and round-trips through
          APIs cleanly. We store ISO-with-offset always;
          display formatting is a presentation concern. The
          common mistake of storing local time and
          re-interpreting on the server creates bugs that
          are very hard to debug.
        </HighlightBlock>

        <h3>Range as one popover vs two fields</h3>
        <HighlightBlock as="p" tier="important">
          Two fields with a single popover that bridges them
          gives composability and keyboard accessibility.
          One field with two values inside it is more
          compact but harder to navigate. We provide both
          and let consumers choose; the headless hook
          supports both modes.
        </HighlightBlock>

        <h3>Validate via picker constraints vs validation engine</h3>
        <HighlightBlock as="p" tier="important">
          The picker enforces visual constraints (disabled
          dates) for UX, but final validation runs through
          the form validation engine. The picker emits
          values; the engine validates them. This split is
          correct because availability can change between
          picker open and submission, and the validation
          engine is the canonical place to enforce
          constraints.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important">NLP parsing of free-text dates (&ldquo;next Tuesday at 3pm&rdquo;) with a confirmation step would</HighlightBlock>
<HighlightBlock as="p" tier="important">accelerate input for power users. Server-driven availability calendars (busy/free streamed in) would</HighlightBlock>
<HighlightBlock as="p" tier="important">close the gap with native scheduling apps. Calendar integration (Google, Outlook) for recurring events.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">Wider Temporal adoption as
          browser support stabilizes will let us drop the
          adapter for the common case. Better mobile
          variants (iOS-style wheel, Android-style spinner)
          for cases where the platform input is
          insufficient (e.g. very granular time selection).</HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How do you keep DST-correct values when storing
          and displaying?</strong> Store ISO-with-offset (a
          zoned instant). Display through
          <code> Intl.DateTimeFormat</code> with the active
          time zone. On spring-forward, round nonexistent
          wall times forward; on fall-back, use the
          Temporal-style disambiguation default and surface
          the offset where it matters. Never store wall
          time without offset.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>2. Why use <code>role=&quot;grid&quot;</code> for the
          calendar?</strong> The grid pattern gives screen
          reader users a 2D navigation model that matches
          the visual layout. With a single tabstop and arrow-
          key navigation, users can explore dates without
          tab-trampolining. Buttons in a row would lose the
          2D semantic. WAI-ARIA Authoring Practices
          documents this pattern explicitly.
        </HighlightBlock>

        <p>
          <strong>3. How do you handle locale week-start
          differences?</strong>
          <code> Intl.Locale.weekInfo</code> exposes the
          first day of the week per locale (where
          supported); fall back to a small data table for
          older browsers. The first column header and the
          grid alignment update accordingly.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. Why store ISO-with-offset vs raw local
          time?</strong> Local time without offset is
          ambiguous — &ldquo;3pm&rdquo; is a different
          instant in PST vs EST. Storing ISO-with-offset
          carries the time zone information; the value
          round-trips through APIs cleanly. The common bug
          of &ldquo;the meeting moved an hour&rdquo; is
          exactly this: storing local and reinterpreting
          server-side.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>5. How do you keep the picker accessible on
          mobile?</strong> Use the native
          <code> {`<input type="date">`}</code> or
          <code> type="datetime-local"</code>. The OS picker
          is fully accessible by definition (built into the
          platform&rsquo;s assistive tech) and handles
          calendar systems we&rsquo;d otherwise need to
          support manually.
        </HighlightBlock>

        <p>
          <strong>6. How do you avoid bundling all locales?</strong>
          Use <code>Intl</code> (built into the browser) for
          formatting; we bundle no locale data ourselves. For
          libraries like date-fns that ship locale data
          separately, dynamically import the locale module
          based on the active locale, never statically.
        </p>

        <p>
          <strong>7. What happens if a user pastes an invalid
          string?</strong> The strict parser rejects rather
          than guessing; an inline error appears, and the
          stored value is unchanged. Guessing would lead to
          submitted values that don&rsquo;t match the user&rsquo;s
          intent — much worse than asking them to retype.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>8. How would you support recurring date
          selection?</strong> RRULE is its own subsystem;
          the picker exposes a single value or a range. A
          recurring rule editor builds on top of the picker
          (using it to select the start date and pattern
          parameters) but is not part of this control. The
          recurring editor emits an RRULE string; the
          picker emits dates. Composition keeps both
          coherent.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important">A solid Date/Time Picker is a headless, locale- and zone-aware control wrapped in an accessible</HighlightBlock>
<HighlightBlock as="p" tier="important">WAI-ARIA grid. Store canonical ISO-with-offset values, format with Intl , pick the right adapter</HighlightBlock>
<HighlightBlock as="p" tier="important">(Temporal where available), and use the native input on mobile while offering a rich custom UI on desktop.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">The non-negotiable invariants are
          canonical storage, separated focus and selection,
          DST-correct math, and full keyboard accessibility.
          Get those right and the rest is presentation
          polish.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
