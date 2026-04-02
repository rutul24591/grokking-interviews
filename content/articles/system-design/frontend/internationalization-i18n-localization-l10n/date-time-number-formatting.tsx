"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-date-time-number-formatting",
  title: "Date/Time/Number Formatting",
  description:
    "Comprehensive guide to Date/Time/Number Formatting covering locale-aware formatting, timezone handling, calendar systems, and production-scale i18n patterns.",
  category: "frontend",
  subcategory: "internationalization-i18n-localization-l10n",
  slug: "date-time-number-formatting",
  wordCount: 5400,
  readingTime: 21,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "i18n",
    "date formatting",
    "time formatting",
    "number formatting",
    "timezone",
  ],
  relatedTopics: [
    "currency-formatting",
    "locale-detection",
    "multi-language-support",
  ],
};

export default function DateTimeNumberFormattingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Date/Time/Number formatting</strong> is the practice of
          displaying temporal and numeric data according to locale-specific
          conventions. This goes beyond simple translation — different cultures
          have fundamentally different ways of representing dates (MM/DD/YYYY vs
          DD/MM/YYYY vs YYYY-MM-DD), times (12-hour vs 24-hour), numbers
          (1,000.50 vs 1.000,50), and even numeral systems (Arabic-Indic vs
          Eastern Arabic numerals). For global applications, correct formatting
          is not optional — users expect to see data in their familiar format,
          and incorrect formatting causes confusion, errors, and lost trust.
        </p>
        <p>
          For staff-level engineers, date/time/number formatting involves
          architectural decisions about storage (always UTC for dates, always
          raw numbers), transformation (format at the display layer), and
          library selection (Intl API, date-fns, Day.js, Luxon). The key
          insight: store in canonical format, format only for display. Never
          store formatted strings — always store raw values and apply locale
          formatting at render time.
        </p>
        <p>
          Date/Time/Number formatting involves several technical challenges.{" "}
          <strong>Timezone handling</strong> — storing in UTC, displaying in
          user&apos;s local timezone, handling DST transitions.{" "}
          <strong>Locale variations</strong> — en-US uses MM/DD/YYYY, en-GB uses
          DD/MM/YYYY, both are &quot;English&quot; but incompatible formats.{" "}
          <strong>Calendar systems</strong> — Gregorian is standard, but some
          locales use alternative calendars (Japanese era names, Islamic
          calendar, Hebrew calendar). <strong>Number formatting</strong> —
          decimal separators, thousands separators, digit grouping, negative
          number representation vary by locale.
        </p>
        <p>
          The business case for correct formatting is clear: users trust
          applications that &quot;speak their language&quot; numerically.
          Incorrect date formatting causes real problems — flight bookings on
          wrong dates, payment deadlines missed, appointment confusion. For
          financial, healthcare, and travel applications, correct formatting is
          a safety requirement, not just UX polish.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Locale-Aware Formatting:</strong> Each locale has specific
            conventions for dates, times, and numbers. The Intl API (built into
            modern browsers) provides locale-aware formatting via{" "}
            <code>Intl.DateTimeFormat</code> and <code>Intl.NumberFormat</code>.
            Always pass the user&apos;s locale — never assume.
          </li>
          <li>
            <strong>UTC Storage, Local Display:</strong> Store all dates in UTC
            (ISO 8601 format: <code>2026-04-02T14:30:00Z</code>). Convert to
            user&apos;s local timezone only for display. This ensures
            consistency across timezones and avoids DST issues in storage.
          </li>
          <li>
            <strong>Timezone Awareness:</strong> Users may be in different
            timezones. Display times in user&apos;s local timezone (from browser
            or profile preference). For scheduling applications, show both local
            and event timezone (&quot;3 PM your time / 8 PM London&quot;).
          </li>
          <li>
            <strong>Relative Time Formatting:</strong> &quot;2 hours ago&quot;,
            &quot;in 3 days&quot;, &quot;yesterday&quot;. Use{" "}
            <code>Intl.RelativeTimeFormat</code> for locale-aware relative time.
            Relative time is more user-friendly than absolute timestamps for
            recent events.
          </li>
          <li>
            <strong>Number Formatting Options:</strong> Decimal digits,
            thousands separators, currency symbols, percentage display, unit
            display (kg, km). Each has locale-specific conventions. Use{" "}
            <code>Intl.NumberFormat</code> with appropriate options.
          </li>
          <li>
            <strong>Calendar Systems:</strong> Most locales use Gregorian
            calendar, but some use alternative calendars. Japanese locale
            supports era names (Reiwa 5), Arabic locales support Islamic
            calendar, Hebrew locale supports Hebrew calendar. Intl API supports
            calendar specification via <code>calendar</code> option.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/date-time-formatting-locale-variations.svg"
          alt="Date/Time Formatting Locale Variations showing how same date displays differently across locales"
          caption="Locale variations — same UTC timestamp displays as different formatted strings based on locale conventions (US, UK, Germany, Japan, Arabia)"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Date/Time/Number formatting architecture consists of a storage layer
          (canonical formats: UTC for dates, raw numbers), a transformation
          layer (Intl API or formatting libraries), and a display layer
          (formatted strings). The architecture must handle timezone conversion,
          locale detection, and caching of formatted values for performance.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/timezone-handling-architecture.svg"
          alt="Timezone Handling Architecture showing UTC storage, timezone conversion, and local display flow"
          caption="Timezone architecture — store in UTC, convert to user timezone at display, handle DST transitions automatically"
          width={900}
          height={500}
        />

        <h3>Storage Best Practices</h3>
        <p>
          <strong>Dates:</strong> Always store in UTC ISO 8601 format. Database
          column type: TIMESTAMP WITH TIME ZONE (PostgreSQL) or DATETIME
          (MySQL). API response: ISO string with Z suffix. Never store formatted
          date strings like &quot;04/02/2026&quot; — you lose timezone
          information and can&apos;t reformat for other locales.
        </p>
        <p>
          <strong>Numbers:</strong> Store as raw numbers (integer or decimal).
          Database: DECIMAL for money (never FLOAT for currency), INTEGER for
          counts. API response: numeric type, not string. Format only at display
          layer with locale-aware formatting.
        </p>
        <p>
          <strong>Durations:</strong> Store as milliseconds or ISO 8601 duration
          (<code>P1DT2H30M</code>). For human-readable display, use relative
          time formatting or duration formatting (&quot;1 day, 2 hours&quot;).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/number-formatting-options.svg"
          alt="Number Formatting Options showing decimal, currency, percentage, and unit formatting across locales"
          caption="Number formatting — decimal separators, currency symbols, percentage display, and units vary by locale (1,000.50 vs 1.000,50)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Date/Time/Number formatting implementation involves trade-offs between
          bundle size, browser support, and feature completeness.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/formatting-libraries-comparison.svg"
          alt="Formatting Libraries Comparison showing Intl API, date-fns, Day.js, Luxon, and Moment.js features"
          caption="Formatting libraries comparison — Intl API (native, small), date-fns (functional, modular), Day.js (lightweight Moment alternative), Luxon (modern, immutable)"
          width={900}
          height={550}
        />

        <h3>Library Selection</h3>
        <p>
          <strong>Intl API (Native):</strong> Built into all modern browsers.
          Advantages: zero bundle size, always up-to-date with locale data,
          standard API. Limitations: verbose syntax, limited manipulation
          capabilities, no polyfill for old browsers. Best for: formatting-only
          needs, bundle-conscious projects.
        </p>
        <p>
          <strong>date-fns:</strong> Functional, modular date library.
          Advantages: tree-shakeable, immutable, extensive locale support,
          active maintenance. Limitations: larger bundle than Day.js. Best for:
          projects needing date manipulation + formatting.
        </p>
        <p>
          <strong>Day.js:</strong> Lightweight Moment.js alternative.
          Advantages: small bundle (2KB), Moment-compatible API, plugin system.
          Limitations: mutable by default (can enable immutable). Best for:
          migrating from Moment.js, bundle-conscious projects.
        </p>
        <p>
          <strong>Luxon:</strong> Modern date library by Moment.js creator.
          Advantages: immutable, timezone support, Intl integration. Limitations:
          larger bundle. Best for: new projects, timezone-heavy applications.
        </p>
        <p>
          <strong>Moment.js:</strong> Legacy library (maintenance mode).
          Advantages: extensive ecosystem, familiar API. Limitations: large
          bundle, mutable, no longer recommended. Best for: legacy projects only
          — migrate to alternatives.
        </p>

        <h3>Timezone Strategies</h3>
        <p>
          <strong>Browser Timezone:</strong> Use browser&apos;s timezone
          (from <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>).
          Advantages: automatic, no user input needed. Limitations: changes if
          user travels, may not match user&apos;s preference.
        </p>
        <p>
          <strong>User Profile Timezone:</strong> Store timezone in user
          profile. Advantages: consistent across devices, user controls it.
          Limitations: requires user input, needs sync across devices.
        </p>
        <p>
          <strong>Event-Specific Timezone:</strong> For scheduling, store event
          timezone separately. Display in both event timezone and user&apos;s
          local timezone. Best for: conferences, webinars, international
          meetings.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Store UTC, Display Local:</strong> Always store dates in
            UTC. Convert to local timezone only at display layer. This ensures
            consistency and avoids DST issues in storage. Use libraries like
            Luxon or date-fns-tz for timezone conversion.
          </li>
          <li>
            <strong>Use Intl API for Formatting:</strong>{" "}
            <code>Intl.DateTimeFormat</code> and{" "}
            <code>Intl.NumberFormat</code> are built-in, well-tested, and
            always up-to-date with locale data. Wrap in utility functions for
            consistent usage across your codebase.
          </li>
          <li>
            <strong>Show Timezone for Future Events:</strong> For appointments,
            deadlines, or scheduled events, always show the timezone
            (&quot;3 PM EST&quot;). For past events, relative time
            (&quot;2 hours ago&quot;) is often more useful than absolute time.
          </li>
          <li>
            <strong>Handle Edge Cases:</strong> DST transitions (clocks spring
            forward/fall back), leap years, leap seconds (rarely needed),
            calendar boundaries (year/month transitions). Test formatting around
            these boundaries.
          </li>
          <li>
            <strong>Use Appropriate Precision:</strong> Don&apos;t show seconds
            for timestamps older than a day. Don&apos;t show timezone for
            &quot;today&quot; events. Match precision to user needs — more
            precision isn&apos;t always better.
          </li>
          <li>
            <strong>Format Numbers Appropriately:</strong> Use compact notation
            for large numbers (1.5M instead of 1,500,000). Use appropriate
            decimal places (2 for currency, 0 for counts, variable for
            measurements). Localize units (km vs miles, kg vs lbs) based on
            locale.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Storing Formatted Dates:</strong> Storing{" "}
            <code>&quot;04/02/2026&quot;</code> instead of ISO string loses
            timezone information and can&apos;t be reformatted. Always store raw
            UTC timestamps.
          </li>
          <li>
            <strong>Assuming Browser Timezone is Correct:</strong> User may be
            traveling or want a different timezone. Provide timezone override in
            user preferences for scheduling applications.
          </li>
          <li>
            <strong>Ignoring DST Transitions:</strong> &quot;2 PM tomorrow&quot;
            may not exist (spring forward) or may be ambiguous (fall back). Use
            libraries that handle DST correctly. Avoid scheduling at DST
            transition times.
          </li>
          <li>
            <strong>Using FLOAT for Currency:</strong> Floating point arithmetic
            causes rounding errors (0.1 + 0.2 ≠ 0.3). Use DECIMAL in database,
            integer cents in code, or libraries like decimal.js for precise
            currency math.
          </li>
          <li>
            <strong>Hardcoding Date Formats:</strong>{" "}
            <code>format(date, &apos;MM/DD/YYYY&apos;)</code> breaks for
            non-US locales. Use locale-aware formatting:{" "}
            <code>format(date, &apos;P&apos;)</code>.
          </li>
          <li>
            <strong>Not Testing with Real Locales:</strong> Testing only with
            en-US misses issues with RTL locales, non-Latin numerals, and
            alternative calendars. Test with ar-SA, ja-JP, zh-CN, he-IL.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Global E-Commerce</h3>
        <p>
          E-commerce sites display prices in local currency with correct
          formatting (€1.000,50 in Germany, $1,000.50 in US). Order dates shown
          in customer&apos;s local timezone. Delivery estimates use relative
          time (&quot;arrives in 3-5 days&quot;). Sale deadlines show countdown
          timers with timezone awareness.
        </p>

        <h3>Scheduling and Calendar Applications</h3>
        <p>
          Calendar apps (Google Calendar, Outlook) handle complex timezone
          scenarios: events in different timezones, recurring events across DST
          transitions, all-day events (date-only, no timezone). Display shows
          both event timezone and user&apos;s local timezone for clarity.
        </p>

        <h3>Financial Applications</h3>
        <p>
          Trading platforms display stock prices with appropriate decimal
          places, percentage changes with locale-aware formatting, and
          timestamps in user&apos;s preferred timezone. Transaction history uses
          locale-specific date formats. Currency conversion shows both source
          and target currency with correct symbols.
        </p>

        <h3>Analytics Dashboards</h3>
        <p>
          Analytics tools (Google Analytics, Mixpanel) display metrics with
          compact number formatting (1.5M views), date range selectors with
          locale-aware calendars, and time series data in user&apos;s timezone.
          Relative date ranges (&quot;last 30 days&quot;, &quot;this month&quot;)
          respect locale conventions for week start (Sunday vs Monday).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why should you store dates in UTC and convert at display time?
            </p>
            <p className="mt-2 text-sm">
              A: UTC is timezone-agnostic and unambiguous. Storing in local
              timezone causes problems: (1) DST transitions create ambiguous or
              non-existent times, (2) users in different timezones see wrong
              times, (3) changing user&apos;s timezone preference requires
              data migration. UTC + convert at display ensures consistency,
              enables timezone switching, and avoids DST issues in storage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle date formatting for locales with different
              calendar systems?
            </p>
            <p className="mt-2 text-sm">
              A: Intl API supports calendar specification via{" "}
              <code>calendar</code> option. Example:{" "}
              <code>new Intl.DateTimeFormat(&apos;ja-JP-u-ca-japanese&apos;)</code>{" "}
              for Japanese era names. For Islamic calendar:{" "}
              <code>ar-SA-u-ca-islamic</code>. Most applications use Gregorian
              calendar universally, but for locale-specific apps (Japanese
              government, Islamic finance), use appropriate calendar. Libraries
              like Luxon support calendar conversion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you format relative time (&quot;2 hours ago&quot;) in a
              locale-aware way?
            </p>
            <p className="mt-2 text-sm">
              A: Use <code>Intl.RelativeTimeFormat</code>. Example:{" "}
              <code>new Intl.RelativeTimeFormat(&apos;en&apos;).format(-2, &apos;hour&apos;)</code>{" "}
              returns &quot;2 hours ago&quot;. For &apos;es&apos;: &quot;hace 2
              horas&quot;. For &apos;ja&apos;: &quot;2 時間前&quot;. This handles
              locale-specific relative time conventions automatically. For
              broader browser support, use libraries like date-fns
              (formatDistance) or Day.js (relativeTime plugin).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle DST transitions when scheduling events?
            </p>
            <p className="mt-2 text-sm">
              A: Store event time in UTC with timezone identifier (not offset).
              Example: <code>2026-03-08T02:30:00Z</code> with timezone
              &quot;America/New_York&quot;. Libraries like Luxon or date-fns-tz
              handle DST conversion correctly. For scheduling UI: warn users
              about DST transitions (&quot;2 AM doesn&apos;t exist on this
              date&quot;), suggest alternative times, or auto-adjust to valid
              time. For recurring events, specify whether recurrence is by
              wall-clock time or UTC.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you format numbers for locales that use non-Latin
              numerals?
            </p>
            <p className="mt-2 text-sm">
              A: Intl.NumberFormat automatically uses locale-appropriate numerals.
              For Arabic-Indic numerals (ar-SA): ١٬٢٣٤.٥٠. For Eastern Arabic
              numerals (fa-IR): ۱٬۲۳۴.۵۰. To force Latin numerals regardless of
              locale, use <code>numberingSystem: &apos;latn&apos;</code> option.
              Test with ar-SA, fa-IR, hi-IN to ensure correct numeral display.
              Some locales (like ar-EG) use mixed numerals (Latin for prices,
              Arabic-Indic for dates).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement a timezone selector for user preferences?
            </p>
            <p className="mt-2 text-sm">
              A: Use IANA timezone database ( Olson database) for timezone
              options. Display format: &quot;America/New_York (EST)&quot;,
              &quot;Europe/London (GMT)&quot;. Group by region (Americas,
              Europe, Asia). Include UTC offset and DST status. Use libraries
              like date-fns-tz or Luxon for timezone data. Store selected
              timezone in user profile. On display, convert UTC timestamps to
              selected timezone. Provide &quot;Use browser timezone&quot; option
              for convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Intl API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — DateTimeFormat API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — NumberFormat API
            </a>
          </li>
          <li>
            <a
              href="https://date-fns.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              date-fns — Modern Date Utility Library
            </a>
          </li>
          <li>
            <a
              href="https://moment.github.io/luxon/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Luxon — Modern Date Library with Timezone Support
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/ISO_8601"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ISO 8601 — Date and Time Format Standard
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
