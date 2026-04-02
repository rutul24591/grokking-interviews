"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-currency-formatting",
  title: "Currency Formatting",
  description:
    "Comprehensive guide to Currency Formatting covering exchange rates, locale-specific formats, multi-currency display, and production-scale payment localization patterns.",
  category: "frontend",
  subcategory: "internationalization-i18n-localization-l10n",
  slug: "currency-formatting",
  wordCount: 5200,
  readingTime: 20,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "i18n",
    "currency",
    "formatting",
    "exchange rates",
    "payments",
  ],
  relatedTopics: [
    "date-time-number-formatting",
    "locale-detection",
    "multi-language-support",
  ],
};

export default function CurrencyFormattingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Currency formatting</strong> is the practice of displaying
          monetary values according to locale-specific conventions. This
          encompasses currency symbols ($, €, £, ¥), symbol positioning
          (before or after the amount), decimal separators, thousands
          separators, negative number representation, and currency code display
          (USD, EUR, GBP). For global e-commerce, SaaS, and financial
          applications, correct currency formatting is critical — incorrect
          formatting causes pricing confusion, checkout abandonment, and
          customer support tickets.
        </p>
        <p>
          For staff-level engineers, currency formatting involves architectural
          decisions about storage (always store in smallest unit — cents, not
          dollars), conversion (real-time exchange rates vs. cached rates), and
          display (customer&apos;s locale currency vs. merchant&apos;s base
          currency). The key insight: store in canonical format (integer cents,
          ISO currency code), format only for display with locale-aware
          formatting.
        </p>
        <p>
          Currency formatting involves several technical challenges.{" "}
          <strong>Symbol positioning</strong> — $100 (US), 100$ (Canada French),
          100 € (Germany). <strong>Decimal precision</strong> — most currencies
          use 2 decimals, but JPY uses 0, KWD uses 3.{" "}
          <strong>Exchange rates</strong> — real-time rates for accurate
          conversion, rate caching for performance, rate display disclaimers.{" "}
          <strong>Multiple currencies</strong> — displaying prices in both local
          and customer&apos;s currency for transparency.
        </p>
        <p>
          The business case for correct currency formatting is direct: pricing
          clarity drives conversions. Users abandon checkout when prices are
          unclear or displayed in unfamiliar format. For global e-commerce,
          displaying prices in customer&apos;s local currency increases
          conversion by 10-30%. For SaaS, multi-currency pricing is often a
          procurement requirement for enterprise customers.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Currency Code (ISO 4217):</strong> Three-letter codes like
            USD, EUR, GBP, JPY. Always store currency code with amount — never
            assume currency from locale. Same locale can use different
            currencies (en-US uses USD, en-GB uses GBP).
          </li>
          <li>
            <strong>Minor Units:</strong> Store amounts in smallest unit (cents,
            pence, satoshis) as integers. $10.99 → 1099 cents. Avoids floating
            point errors (0.1 + 0.2 ≠ 0.3). Convert to major units only for
            display.
          </li>
          <li>
            <strong>Currency Symbol vs. Code:</strong> Symbol ($, €, £) is
            locale-dependent and can be ambiguous ($ is USD, CAD, AUD, etc.).
            Code (USD, EUR) is unambiguous. Use symbol for consumer-facing
            display, code for B2B or when ambiguity matters.
          </li>
          <li>
            <strong>Exchange Rates:</strong> Real-time rates from APIs
            (OpenExchangeRates, CurrencyLayer, Fixer). Cache rates for
            performance (5-15 minute TTL). Display rate timestamp for
            transparency (&quot;Rates as of 2:30 PM UTC&quot;).
          </li>
          <li>
            <strong>Decimal Precision:</strong> Most currencies use 2 decimals
            (USD, EUR). Some use 0 (JPY, KRW). Some use 3 (KWD, BHD). Intl API
            handles this automatically based on currency code.
          </li>
          <li>
            <strong>Multi-Currency Display:</strong> Show both local and
            customer&apos;s currency (&quot;€100 ($108)&quot;). Useful for
            cross-border e-commerce. Always clarify which currency is primary.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/currency-formatting-locale-variations.svg"
          alt="Currency Formatting Locale Variations showing how same amount displays differently across locales"
          caption="Currency variations — same amount (1234.56 USD) displays with different symbols, positions, and separators based on locale"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Currency formatting architecture consists of a storage layer (integer
          cents + ISO currency code), a conversion layer (exchange rate APIs),
          and a display layer (Intl.NumberFormat with currency options). The
          architecture must handle rate caching, fallback rates, and
          multi-currency display.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/currency-conversion-flow.svg"
          alt="Currency Conversion Flow showing rate fetching, caching, and conversion pipeline"
          caption="Currency conversion flow — fetch rates from API, cache with TTL, convert amounts at display layer, show rate timestamp"
          width={900}
          height={500}
        />

        <h3>Storage Best Practices</h3>
        <p>
          <strong>Database:</strong> Store amount as integer (BIGINT for large
          amounts), currency as CHAR(3). Example: <code>amount_cents: 1099</code>,{" "}
          <code>currency: &apos;USD&apos;</code>. Never store as FLOAT/DOUBLE —
          floating point errors cause money discrepancies.
        </p>
        <p>
          <strong>API Response:</strong> Return amount and currency separately.
          Example: <code>{`{ amount: 1099, currency: "USD" }`}</code>. Don&apos;t
          return formatted strings — frontend formats based on user&apos;s
          locale.
        </p>
        <p>
          <strong>Exchange Rate Storage:</strong> Cache rates with timestamp.
          Example: <code>{`{ base: "USD", rates: { EUR: 0.92, GBP: 0.79 }, timestamp: "2026-04-02T14:30:00Z" }`}</code>.
          Use timestamp for rate staleness warnings.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/multi-currency-display.svg"
          alt="Multi-Currency Display showing primary and secondary currency display patterns"
          caption="Multi-currency display — show customer&apos;s local currency as primary, offer base currency reference for transparency"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Currency implementation involves trade-offs between accuracy,
          performance, and complexity.
        </p>

        <h3>Exchange Rate Strategies</h3>
        <p>
          <strong>Real-time API:</strong> Fetch rates on each page load.
          Advantages: always accurate. Limitations: API cost, latency, rate
          limits. Best for: high-value transactions where accuracy matters
          (B2B, enterprise).
        </p>
        <p>
          <strong>Cached Rates:</strong> Fetch rates every 5-15 minutes, cache
          globally. Advantages: fast, low API cost. Limitations: slight
          staleness. Best for: e-commerce, SaaS pricing. Add disclaimer for
          transparency.
        </p>
        <p>
          <strong>Fixed Rates:</strong> Manually set rates, update weekly/monthly.
          Advantages: predictable pricing, no API dependency. Limitations:
          rates drift from market. Best for: subscription pricing where
          stability matters more than perfect accuracy.
        </p>

        <h3>Display Strategies</h3>
        <p>
          <strong>Single Currency:</strong> Show only customer&apos;s local
          currency. Advantages: clean, simple. Limitations: no transparency for
          cross-border shoppers.
        </p>
        <p>
          <strong>Dual Currency:</strong> Show local + base currency
          (&quot;€100 ($108)&quot;). Advantages: transparent, helps
          international customers. Limitations: more UI space, potential
          confusion about which is charged.
        </p>
        <p>
          <strong>Customer Selects:</strong> Let customer choose currency from
          dropdown. Advantages: customer control, clear intent. Limitations:
          requires currency selector UI, rate updates on change.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Store in Smallest Unit:</strong> Always store as integer
            cents (1099, not 10.99). Use BIGINT for large amounts. Convert to
            major units only for display. This avoids all floating point money
            errors.
          </li>
          <li>
            <strong>Always Include Currency Code:</strong> Store and transmit
            currency code with every amount. Never assume currency from locale
            or user&apos;s location. Same locale can use different currencies
            (en-US → USD, en-GB → GBP).
          </li>
          <li>
            <strong>Use Intl.NumberFormat:</strong>{" "}
            <code>new Intl.NumberFormat(locale, {`{ style: 'currency', currency: 'USD' }`})</code>.
            Handles symbol, position, decimals, and separators automatically.
            Zero bundle size, always up-to-date.
          </li>
          <li>
            <strong>Show Rate Timestamp:</strong> When displaying converted
            prices, show when rates were fetched (&quot;Rates as of 2:30 PM
            UTC&quot;). This manages expectations and explains price changes.
          </li>
          <li>
            <strong>Handle Zero-Decimal Currencies:</strong> JPY, KRW, and
            others use 0 decimals. Intl API handles this automatically — don&apos;t
            force 2 decimals. ¥1,000 not ¥1,000.00.
          </li>
          <li>
            <strong>Test with Edge Cases:</strong> Very large amounts
            (millions), very small amounts (fractions of cents), zero-decimal
            currencies (JPY), three-decimal currencies (KWD). Ensure formatting
            works across all cases.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using FLOAT for Money:</strong> Floating point causes
            rounding errors (0.1 + 0.2 = 0.30000000000000004). Use integer cents
            or DECIMAL type in database. For calculations, use libraries like
            decimal.js or dinero.js.
          </li>
          <li>
            <strong>Assuming Symbol Position:</strong> $100 (US), 100$ (Canada
            French), 100 € (Germany). Don&apos;t hardcode symbol position — use
            Intl API which handles this correctly.
          </li>
          <li>
            <strong>Not Handling Currency Changes:</strong> User changes
            currency preference but prices don&apos;t update. Ensure currency
            change triggers re-fetch of converted prices, not just reformatting.
          </li>
          <li>
            <strong>Displaying Wrong Currency at Checkout:</strong> Browsing in
            EUR but checkout charges USD. Always clearly display which currency
            will be charged, especially if different from browsing currency.
          </li>
          <li>
            <strong>Ignoring Exchange Rate Fees:</strong> Converted prices
            don&apos;t include FX fees. For accurate pricing, include fee
            percentage in conversion or clearly state &quot;excluding FX
            fees&quot;.
          </li>
          <li>
            <strong>Not Testing RTL Currencies:</strong> Arabic locales display
            currency differently (symbol may be on opposite side). Test with
            ar-SA, ar-EG, fa-IR to ensure correct display.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Global E-Commerce</h3>
        <p>
          E-commerce sites (Amazon, Shopify stores) display prices in
          customer&apos;s local currency. Product pages show converted prices
          from base currency. Checkout clearly states which currency will be
          charged. Exchange rates cached for 15 minutes with timestamp display.
          Multi-currency pricing for enterprise customers.
        </p>

        <h3>SaaS Subscription Pricing</h3>
        <p>
          SaaS companies (Stripe, GitHub) offer pricing in multiple currencies.
          Customers select preferred currency at signup. Prices are fixed in
          each currency (not real-time conversion) for billing predictability.
          Currency change requires support ticket or account settings change.
          Invoices display in customer&apos;s currency.
        </p>

        <h3>Travel and Hospitality</h3>
        <p>
          Travel sites (Booking.com, Airbnb) show prices in both local currency
          and customer&apos;s home currency. Hotel rates displayed as
          &quot;€100/night (approximately $108)&quot;. Clear disclaimer that
          converted amount is estimate, actual charge in hotel&apos;s currency.
          Payment processed in hotel&apos;s currency, customer&apos;s bank does
          final conversion.
        </p>

        <h3>Cryptocurrency Exchanges</h3>
        <p>
          Crypto exchanges (Coinbase, Binance) display prices in both crypto
          (BTC, ETH) and fiat (USD, EUR). Real-time rates with millisecond
          updates. Display precision varies by currency (8 decimals for BTC, 2
          for USD). &quot;Buy with USD&quot; clearly distinguishes from
          &quot;Buy with EUR&quot;.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why should you store money as integer cents instead of decimal
              dollars?
            </p>
            <p className="mt-2 text-sm">
              A: Floating point arithmetic causes rounding errors: 0.1 + 0.2 =
              0.30000000000000004, not 0.3. Over many transactions, these errors
              accumulate. Integer arithmetic is exact: 10 + 20 = 30, always.
              Store $10.99 as 1099 cents. Convert to dollars only for display.
              For calculations requiring decimals (percentage discounts), use
              libraries like decimal.js that implement fixed-point arithmetic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle real-time currency conversion for e-commerce?
            </p>
            <p className="mt-2 text-sm">
              A: Fetch exchange rates from API (OpenExchangeRates, Fixer) every
              5-15 minutes, cache globally (Redis). On product page, convert
              base price using cached rate: <code>priceInCents * rate / 100</code>.
              Display rate timestamp (&quot;Rates as of 2:30 PM&quot;). At
              checkout, re-fetch rate if cache is stale (more than 15 min old). For
              high-value transactions, lock rate for 10-15 minutes during
              checkout flow.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you format currency for locales with different decimal
              conventions?
            </p>
            <p className="mt-2 text-sm">
              A: Use Intl.NumberFormat with currency option. Example:{" "}
              <code>new Intl.NumberFormat(&apos;de-DE&apos;, {`{ style: 'currency', currency: 'EUR' }`}).format(12.34)</code>{" "}
              returns &quot;12,34 €&quot; (comma decimal, space before symbol).
              For &apos;en-US&apos;: &quot;$12.34&quot; (period decimal, symbol
              before). Intl API handles symbol position, decimal separator, and
              thousands separator automatically based on locale + currency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle zero-decimal currencies like JPY?
            </p>
            <p className="mt-2 text-sm">
              A: Intl API handles this automatically.{" "}
              <code>new Intl.NumberFormat(&apos;ja-JP&apos;, {`{ style: 'currency', currency: 'JPY' }`}).format(1000)</code>{" "}
              returns &quot;￥1,000&quot; (no decimals). Don&apos;t force 2
              decimals — it looks wrong to Japanese users. Store JPY amounts as
              whole yen (1000, not 1000.00). Same for KRW, HUF, and other
              zero-decimal currencies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement multi-currency pricing for SaaS?
            </p>
            <p className="mt-2 text-sm">
              A: Store base price in one currency (USD). For each supported
              currency, either: (1) Use real-time conversion with cached rates
              — prices fluctuate with exchange rates. (2) Set fixed prices per
              currency — $10 USD, €9 EUR, £8 GBP — for stability. Option 2 is
              preferred for SaaS: customers expect stable subscription pricing.
              Update fixed prices quarterly based on average exchange rates.
              Display customer&apos;s selected currency throughout their
              session.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle currency display for RTL locales like Arabic?
            </p>
            <p className="mt-2 text-sm">
              A: Intl API handles RTL currency formatting correctly. For ar-SA:{" "}
              <code>new Intl.NumberFormat(&apos;ar-SA&apos;, {`{ style: 'currency', currency: 'SAR' }`})</code>{" "}
              returns Arabic numerals with correct symbol position. Test with
              multiple Arabic locales (ar-SA, ar-EG, ar-AE) — they may differ.
              Ensure your CSS supports RTL layout (logical properties) so
              currency displays correctly in RTL context.
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
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — NumberFormat with Currency Options
            </a>
          </li>
          <li>
            <a
              href="https://www.iso.org/iso-4217-currency-codes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ISO 4217 — Currency Code Standard
            </a>
          </li>
          <li>
            <a
              href="https://openexchangerates.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Exchange Rates — Currency API
            </a>
          </li>
          <li>
            <a
              href="https://dinerojs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Dinero.js — Immutable Money Library
            </a>
          </li>
          <li>
            <a
              href="https://github.com/MikeMcl/decimal.js/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              decimal.js — Arbitrary Precision Decimal Library
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/currencies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stripe — Supported Currencies and Zero-Decimal Currencies
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
