"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-payment-checkout-ui",
  title: "Design a Payment / Checkout UI",
  description:
    "Complete LLD solution for a secure payment/checkout UI with card input formatting, validation (Luhn algorithm), PCI compliance, 3D Secure flow, address forms, order summary, and accessible error handling.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "payment-checkout-ui",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "payment",
    "checkout",
    "card-validation",
    "pci-compliance",
    "3d-secure",
    "form-validation",
    "accessibility",
  ],
  relatedTopics: [
    "form-validation-patterns",
    "modal-component",
    "state-management",
    "accessibility-patterns",
  ],
};

export default function PaymentCheckoutUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a production-grade payment/checkout UI for an e-commerce
          application. The checkout flow must collect payment details (card number,
          expiry, CVV, cardholder name), validate input in real time using the Luhn
          algorithm and format rules, detect card type from BIN prefixes, and submit
          payment securely through a PCI-compliant flow. The UI must support 3D Secure
          authentication (SCA/PSD2 compliance), collect billing and shipping addresses
          with a same-as-billing toggle, display an order summary with line items and
          tax calculation, and handle payment errors gracefully with retry logic. The
          entire flow must be accessible, mobile-optimized, and follow security best
          practices around PCI-DSS compliance.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with Zustand for state management.
          </li>
          <li>
            Payment processing is handled through a third-party gateway (e.g., Stripe,
            Adyen) — we never touch raw card data on our servers.
          </li>
          <li>
            The checkout is a single-page flow (not multi-step) for simplicity, but the
            design should support multi-step as an extension.
          </li>
          <li>
            The system must support both test and production gateway environments.
          </li>
          <li>
            Card types supported: Visa, Mastercard, American Express, Discover.
          </li>
          <li>
            3D Secure is mandatory for European transactions (PSD2/SCA regulation).
          </li>
          <li>
            The application runs in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Card Number Input:</strong> Accepts 13–19 digit card numbers, auto-
            formats with spaces (groups of 4), validates using the Luhn algorithm on
            blur, and detects card type from BIN prefixes in real time.
          </li>
          <li>
            <strong>Card Type Detection:</strong> Automatically identifies Visa (starts
            with 4), Mastercard (starts with 51–55 or 2221–2720), American Express
            (starts with 34 or 37), and Discover (starts with 6011, 622126–622925, or
            65) from the card number prefix and displays the corresponding card icon.
          </li>
          <li>
            <strong>Expiry Input:</strong> Accepts MM/YY format, auto-inserts slash
            after month, validates that the date is in the future and not more than 10
            years ahead.
          </li>
          <li>
            <strong>CVV Input:</strong> Accepts 3 digits for most cards, 4 digits for
            American Express. Masks input for security. Shows appropriate maxlength
            based on detected card type.
          </li>
          <li>
            <strong>Cardholder Name:</strong> Free-text input for the name as it appears
            on the card. Trimmed and validated for minimum length (2 characters).
          </li>
          <li>
            <strong>Address Collection:</strong> Billing address (required) and shipping
            address (optional) with a same-as-billing toggle that copies billing address
            to shipping fields.
          </li>
          <li>
            <strong>Order Summary:</strong> Displays line items with name, quantity,
            unit price, subtotal, tax calculation, shipping cost, discounts, and final
            total.
          </li>
          <li>
            <strong>Payment Submission:</strong> Submits payment details to the gateway,
            shows processing state, handles success/failure responses, and supports
            retry on transient network errors.
          </li>
          <li>
            <strong>3D Secure Flow:</strong> Redirects or opens a modal for bank
            verification when the gateway requires it. Handles the redirect back to
            the checkout and completes or fails the payment.
          </li>
          <li>
            <strong>Error Handling:</strong> Displays specific error messages for card
            declined, insufficient funds, expired card, invalid CVV, and network errors.
            Each error type has appropriate user guidance.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>PCI Compliance:</strong> Raw card data must never touch our servers.
            Use iframe-hosted fields (Stripe Elements) or a payment SDK that tokenizes
            card data client-side before submission.
          </li>
          <li>
            <strong>Performance:</strong> Form validation must be instantaneous (under
            50ms). Payment submission should show loading state within 100ms to prevent
            double-submission.
          </li>
          <li>
            <strong>Accessibility:</strong> All inputs must have associated labels,
            errors must be announced to screen readers via aria-live, and the form must
            be fully navigable via keyboard (Tab order matches visual order).
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Card number input triggers numeric
            keyboard. Expiry and CVV inputs use appropriate inputMode. Autofill
            attributes support browser auto-completion.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for all data shapes
            (CardData, PaymentStatus, OrderSummary, Address).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User pastes a card number with spaces or dashes — must be normalized before
            validation.
          </li>
          <li>
            User enters an expiry of <code>02/25</code> when the current date is
            March 2025 — the card expires at the end of February, so it is expired.
          </li>
          <li>
            3D Secure modal is closed by the user before completion — payment must be
            marked as abandoned, not failed.
          </li>
          <li>
            Network error during payment submission — user clicks retry, the same
            payment intent is reused (not a new charge).
          </li>
          <li>
            User navigates away from checkout during payment processing — must block
            navigation or warn about in-progress transaction.
          </li>
          <li>
            Autofill populates card fields on mount — validation must run after autofill
            (via onChange and onInput events).
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>card input formatting</strong>,{" "}
          <strong>validation logic</strong>, <strong>payment state</strong>, and{" "}
          <strong>gateway communication</strong> into distinct modules. A Zustand store
          holds the form state, validation errors, payment status, and order summary.
          Custom hooks encapsulate form state management and payment submission logic.
          Individual input components handle formatting and real-time validation,
          communicating with the store via actions.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>React Hook Form + Zod:</strong> Excellent for general form validation
            with schema-based rules. However, payment forms have unique needs (Luhn
            validation, BIN-based card detection, PCI-compliant tokenization) that
            require custom logic beyond what schemas provide. React Hook Form can still
            be used as the underlying form engine, with custom resolvers for payment-
            specific validation.
          </li>
          <li>
            <strong>Redux:</strong> Overkill for a single checkout form. Adds boilerplate
            (actions, reducers, middleware) and introduces global state that is
            unnecessary when the form is isolated to a single route.
          </li>
          <li>
            <strong>Component-local state:</strong> Simple but makes cross-component
            validation (e.g., card type detection affecting CVV maxlength) cumbersome.
            Requires prop drilling or context. Zustand provides cleaner cross-component
            reactivity.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + custom hooks is optimal:</strong> Zustand provides
          lightweight, selector-based state management with zero boilerplate. Custom
          hooks encapsulate the complex form logic (formatting, validation, submission)
          while keeping components focused on rendering. This pattern is used by
          production checkout flows at companies like Stripe and Shopify.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Payment Types (<code>payment-types.ts</code>)</h4>
          <p>
            Defines the core TypeScript interfaces: <code>CardData</code> (number, expiry,
            cvv, name, detectedType), <code>PaymentStatus</code> union (<code>idle |
            validating | processing | three-ds-required | success | failed |
            abandoned</code>), <code>OrderSummary</code> (line items, subtotal, tax,
            shipping, discount, total), <code>Address</code> (street, city, state, zip,
            country), <code>PaymentError</code> (code, message, retryable), and{" "}
            <code>CardType</code> union (<code>visa | mastercard | amex | discover |
            unknown</code>). See the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Card Validation (<code>card-validation.ts</code>)</h4>
          <p>
            Pure functions for validating card data. Includes the{" "}
            <strong>Luhn algorithm</strong> for card number checksum validation,{" "}
            <strong>BIN prefix detection</strong> for card type identification, CVV
            length validation by card type (3 for Visa/MC/Discover, 4 for Amex), and
            expiry date validation (must be a future date, month 01–12, reasonable year
            range). All functions are pure — they take input and return validation
            results without side effects.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Card Formatter (<code>card-formatter.ts</code>)</h4>
          <p>
            Pure functions for formatting card input as the user types. Card number
            formatting inserts spaces every 4 digits (Amex uses 4-6-5 grouping). Expiry
            formatting auto-inserts a slash after the month (MM/YY). CVV formatting
            strips non-numeric characters. All formatters accept raw input and return
            display-ready strings. The raw value is derived by stripping formatting
            characters before validation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Payment Store (<code>payment-store.ts</code>)</h4>
          <p>
            Zustand store managing the entire checkout state. State includes: card data,
            billing address, shipping address, same-as-billing flag, order summary,
            payment status, validation errors, and the active payment error. Actions
            include: update card field, update address field, toggle same-as-billing,
            set validation errors, set payment status, set order summary, clear errors,
            and reset form.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Payment API (<code>payment-api.ts</code>)</h4>
          <p>
            Service layer for communicating with the payment gateway. Includes functions
            for creating a payment intent, tokenizing card data (via the gateway SDK),
            confirming payment with 3D Secure handling, and handling webhooks for async
            payment confirmation. See the Example tab for the mock implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Custom Hooks</h4>
          <p>
            <code>useCardForm</code> — Manages card input state, runs real-time validation
            on each field change, detects card type from BIN, and exposes formatted
            values and per-field errors. <code>usePaymentProcessing</code> — Handles
            payment submission flow: validates all fields, creates payment intent,
            tokenizes card, confirms payment, handles 3D Secure redirect/modal, and
            manages retry logic on failure. See the Example tab for the complete hook
            implementations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth. Card data, addresses, and
          order summary are stored as normalized objects. Validation errors are stored
          as a map keyed by field name, allowing per-field error display. Payment status
          is a union type that drives UI rendering (showing processing spinner, success
          confirmation, or error with retry).
        </p>
        <p>
          The most critical design decision is <strong>when to validate</strong>. Each
          field validates on change for format errors (e.g., non-numeric characters in
          card number) and on blur for semantic errors (e.g., Luhn check, expiry in the
          past). This provides immediate feedback for typos while avoiding premature
          errors (e.g., showing &quot;invalid card&quot; while the user is still typing
          the number).
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/payment-checkout-ui-architecture.svg"
          alt="Payment checkout UI architecture showing input formatting, validation, and payment processing flow"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User types card number into CardInput component.
          </li>
          <li>
            <code>useCardForm</code> hook formats the input (inserts spaces every 4
            digits) and detects card type from BIN prefix.
          </li>
          <li>
            Store updates card number and detected type. Expiry and CVV components
            subscribe to detected type and adjust maxlength accordingly.
          </li>
          <li>
            On blur, Luhn validation runs. If invalid, error is stored and displayed.
          </li>
          <li>
            User fills expiry, CVV, name, and address fields. Each validates on change
            (format) and on blur (semantics).
          </li>
          <li>
            User clicks &quot;Pay&quot; button. <code>usePaymentProcessing</code> hook
            validates all fields, sets status to <code>validating</code>.
          </li>
          <li>
            If valid, status becomes <code>processing</code>. Hook calls payment API to
            create intent and tokenize card.
          </li>
          <li>
            If gateway requires 3D Secure, status becomes <code>three-ds-required</code>,
            modal/redirect opens. User completes bank verification.
          </li>
          <li>
            Payment confirms. Status becomes <code>success</code> or <code>failed</code>.
            On failure with retryable error, user can retry with the same intent.
          </li>
          <li>
            On success, order confirmation renders with transaction ID and receipt.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern: user input triggers
          formatting, formatting updates the store, the store triggers validation,
          validation updates error state, and the UI reflects both values and errors.
          Payment submission is a separate flow that reads from the store, calls the
          gateway API, and updates payment status.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Pasted card number with formatting:</strong> The CardInput component
            strips all non-digit characters from pasted content before formatting and
            validation. A pasted value of <code>4242 4242 4242 4242</code> becomes{" "}
            <code>4242424242424242</code> for validation, then is re-formatted for
            display.
          </li>
          <li>
            <strong>Expiry edge case (end of month):</strong> A card with expiry{" "}
            <code>02/25</code> is valid through the last day of February 2025. Validation
            compares against the last day of the expiry month, not the first.
          </li>
          <li>
            <strong>3D Secure abandonment:</strong> If the user closes the 3D Secure
            modal without completing verification, the status is set to{" "}
            <code>abandoned</code> (not <code>failed</code>), allowing the user to retry
            without an error message.
          </li>
          <li>
            <strong>Double-submission prevention:</strong> The Pay button is disabled
            when status is <code>processing</code> or <code>three-ds-required</code>.
            Additionally, the store tracks a <code>submitting</code> flag that prevents
            concurrent submissions.
          </li>
          <li>
            <strong>Navigation guard:</strong> If the user attempts to navigate away
            during payment processing, a beforeunload listener (on desktop) or a route
            guard (via Next.js router events) warns about the in-progress transaction.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 15 files:
            TypeScript interfaces, card validation (Luhn algorithm, BIN detection, CVV
            rules), input formatters, Zustand store, payment API integration, two custom
            hooks, six React components, and a full EXPLANATION.md walkthrough. Click
            the <strong>Example</strong> toggle at the top of the article to view all
            source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Payment Types (payment-types.ts)</h3>
        <p>
          Defines the core data shapes: <code>CardData</code> with number, expiry, cvv,
          name, and detectedType; <code>PaymentStatus</code> union covering the full
          payment lifecycle; <code>OrderSummary</code> with line items and cost
          breakdown; <code>Address</code> with standard address fields;{" "}
          <code>PaymentError</code> with error code, user-facing message, and retryable
          flag; and <code>CardType</code> union for card type detection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Card Validation (card-validation.ts)</h3>
        <p>
          Implements the <strong>Luhn algorithm</strong>: double every second digit from
          the right, subtract 9 if the result exceeds 9, sum all digits, and check if
          the total is divisible by 10. BIN prefix detection uses regex patterns for
          Visa (starts with 4), Mastercard (51–55 or 2221–2720), Amex (34 or 37), and
          Discover (6011, 622126–622925, 65). CVV length validation returns 4 for Amex,
          3 for all others. Expiry validation checks month range (01–12), year range
          (current to current+10), and that the date is in the future (comparing against
          the last day of the expiry month).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Card Formatter (card-formatter.ts)</h3>
        <p>
          Card number formatting uses regex to insert spaces every 4 digits for Visa/
          MC/Discover, and 4-6-5 grouping for Amex. Expiry formatting auto-inserts a
          slash after the first two digits (MM/YY) and pads single-digit months with a
          leading zero. CVV formatting strips all non-numeric characters. Each formatter
          returns a display string; the raw value is derived separately for validation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Payment Store (payment-store.ts)</h3>
        <p>
          Zustand store with selectors for card data, addresses, order summary, payment
          status, and validation errors. Actions update individual fields, batch-update
          addresses, toggle same-as-billing (copying billing to shipping), set
          validation errors per field, transition payment status, and reset the entire
          form. The store uses immer middleware for immutable updates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Payment API (payment-api.ts)</h3>
        <p>
          Service layer wrapping the payment gateway SDK. <code>createPaymentIntent</code>{" "}
          calls the backend to create an intent with the order total.{" "}
          <code>tokenizeCard</code> uses the gateway SDK to tokenize card data client-
          side (raw card data never leaves the browser). <code>confirmPayment</code>{" "}
          submits the tokenized payment and returns a result with status.{" "}
          <code>handle3DSecure</code> opens the gateway-provided modal or redirect URL
          and returns the verification result.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useCardForm Hook</h3>
        <p>
          Custom hook managing card input state. Subscribes to the store for card data
          and errors. Exposes <code>updateField(field, value)</code> which formats the
          value, updates the store, and runs format validation. On blur, runs semantic
          validation (Luhn, expiry date, CVV length). Detects card type from BIN after
          each number update. Returns formatted values, per-field errors, detected card
          type, and a <code>isValid</code> flag.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: usePaymentProcessing Hook</h3>
        <p>
          Custom hook handling the payment submission flow. <code>submitPayment()</code>{" "}
          validates all fields via the store, creates a payment intent, tokenizes card
          data, and confirms the payment. If the gateway returns a 3D Secure challenge,
          it opens the verification modal and awaits the result. On network error, it
          sets a retryable error and exposes <code>retryPayment()</code> which reuses
          the existing intent. Maximum 3 retries before marking as non-retryable.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Checkout Page (components/checkout-page.tsx)</h3>
        <p>
          Root component composing the order summary, payment form (card inputs, address
          form), and submit button. Uses <code>useCardForm</code> and{" "}
          <code>usePaymentProcessing</code> hooks. Renders <code>PaymentStatus</code>{" "}
          component for processing/success/error states. Layout is responsive: stacked
          on mobile, side-by-side on desktop (order summary on the right).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Card Input (components/card-input.tsx)</h3>
        <p>
          Card number input with real-time formatting, BIN-based card type detection,
          card icon display, Luhn validation on blur, and appropriate inputMode for
          mobile numeric keyboard. Autocomplete attribute set to <code>cc-number</code>{" "}
          for browser autofill support.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules 10–11: Expiry and CVV Inputs</h3>
        <p>
          <code>CardExpiryInput</code> handles MM/YY formatting with auto-slash insertion,
          month validation (01–12), and future-date validation. <code>CardCVVInput</code>{" "}
          masks input (type=&quot;password&quot;), adjusts maxlength based on detected
          card type (4 for Amex, 3 for others), and validates digit count.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 12: Address Form (components/address-form.tsx)</h3>
        <p>
          Renders billing address fields (street, city, state, zip, country) and optional
          shipping address with a same-as-billing toggle. When toggled on, shipping
          fields are disabled and the billing address is copied. Fields validate for
          required values and zip code format (country-specific regex).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 13: Order Summary (components/order-summary.tsx)</h3>
        <p>
          Displays line items with name, quantity, and unit price. Calculates subtotal,
          applies discount codes, computes tax (rate varies by shipping state/country),
          adds shipping cost, and shows the final total. Styled as a card-like panel
          on the right side of the checkout on desktop.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 14: Payment Status (components/payment-status.tsx)</h3>
        <p>
          Renders different UI based on payment status: a spinner with &quot;Processing
          payment...&quot; during <code>processing</code>, a success message with
          transaction ID and receipt link on <code>success</code>, an error message
          with specific guidance and a retry button on <code>failed</code>, and a
          neutral &quot;Payment was not completed&quot; message on{" "}
          <code>abandoned</code>.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Luhn validation</td>
                <td className="p-2">O(d) — d is digit count (typically 16)</td>
                <td className="p-2">O(1) — constant space</td>
              </tr>
              <tr>
                <td className="p-2">BIN detection</td>
                <td className="p-2">O(1) — regex on prefix (2–6 chars)</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Input formatting</td>
                <td className="p-2">O(n) — n is input length</td>
                <td className="p-2">O(n) — formatted string</td>
              </tr>
              <tr>
                <td className="p-2">Expiry validation</td>
                <td className="p-2">O(1) — date comparison</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Store update</td>
                <td className="p-2">O(1) — field-level update</td>
                <td className="p-2">O(1) — immutable copy</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          All validation operations are effectively O(1) given the bounded input sizes
          (card numbers are 13–19 digits, expiry is always 4 digits, CVV is 3–4 digits).
          The Luhn algorithm is the most computationally intensive operation, but with
          16 digits it completes in under 1 microsecond.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Re-render cascades:</strong> If the store subscriber selects the
            entire state object, every field change re-renders all checkout components.
            Mitigation: use Zustand selectors to subscribe to specific fields, so only
            the affected input component re-renders.
          </li>
          <li>
            <strong>Gateway API latency:</strong> Payment confirmation can take 2–10
            seconds depending on the gateway and network conditions. The UI must show
            a loading state and prevent double-submission during this window.
          </li>
          <li>
            <strong>3D Secure redirect:</strong> Opening a redirect-based 3D Secure flow
            unmounts the checkout page, losing form state. Mitigation: use the modal-
            based 3D Secure flow (iframe) when available, or persist form state to
            sessionStorage before redirect.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each input component subscribes
            only to its own field value and error. Typing in the card number does not
            re-render the expiry or CVV inputs (unless the detected card type changes,
            which affects CVV maxlength).
          </li>
          <li>
            <strong>Debounced validation:</strong> For Luhn validation, debounce by 300ms
            during typing to avoid running the algorithm on every keystroke. Run
            immediately on blur for final validation.
          </li>
          <li>
            <strong>State persistence:</strong> Persist the order summary and billing
            address to sessionStorage so that if the user accidentally navigates away
            and returns, their data is preserved (card number and CVV are never persisted
            for security reasons).
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">PCI-DSS Compliance</h3>
        <p>
          The Payment Card Industry Data Security Standard (PCI-DSS) is the most
          critical security requirement for any payment form. The key rule is:{" "}
          <strong>raw card data must never touch your servers</strong>. There are three
          approaches to achieving compliance:
        </p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Approach 1: iframe-Hosted Fields (Recommended)</h4>
          <p>
            The payment gateway (e.g., Stripe Elements, Braintree Hosted Fields) provides
            iframe-embedded input fields. The card number, expiry, and CVV inputs are
            hosted inside iframes served from the gateway&apos;s domain. This means the
            raw card data never enters your application&apos;s JavaScript context — it
            goes directly to the gateway. After the user submits, the gateway returns a
            token that your backend uses to charge the card. This is the safest approach
            and reduces your PCI scope to SAQ-A (the lowest level of compliance).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Approach 2: Client-Side Tokenization (Payment SDK)</h4>
          <p>
            The gateway SDK runs in your application and tokenizes card data before it
            leaves the browser. The SDK encrypts the card data with the gateway&apos;s
            public key and sends it directly to the gateway, returning a token. Your
            application never stores or transmits raw card data to your own servers.
            This approach requires a higher PCI compliance level (SAQ-A-EP) because the
            SDK loads into your page context.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Approach 3: Server-Side Processing (NOT Recommended)</h4>
          <p>
            Sending raw card data to your own backend for processing requires full
            PCI-DSS compliance (SAQ-D), which is expensive and complex. Your servers
            must be audited annually, card data must be encrypted at rest, and access
            must be strictly controlled. This approach is only used by payment processors
            themselves (Stripe, Adyen) and large enterprises with dedicated security
            teams.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Security</h3>
        <ul className="space-y-2">
          <li>
            <strong>Never log card data:</strong> Ensure that console.log statements,
            error reporting tools (Sentry, DataDog), and analytics never capture card
            numbers or CVVs. Strip sensitive fields from error payloads.
          </li>
          <li>
            <strong>CVV masking:</strong> The CVV input should use{" "}
            <code>type=&quot;password&quot;</code> to mask the value on screen. This
            prevents shoulder-surfing in public spaces.
          </li>
          <li>
            <strong>No autocomplete for CVV:</strong> Set <code>autocomplete=&quot;off&quot;</code>{" "}
            on the CVV field. Browsers should not store CVV values.
          </li>
          <li>
            <strong>HTTPS only:</strong> The checkout page must be served over HTTPS.
            Add an HSTS header to enforce HTTPS and prevent man-in-the-middle attacks.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">3D Secure and SCA</h3>
        <p>
          The Revised Payment Services Directive (PSD2) in the European Union requires
          Strong Customer Authentication (SCA) for most online payments. 3D Secure 2.0
          (3DS2) is the protocol used to implement SCA. It adds an additional
          authentication step where the cardholder verifies their identity with their
          bank (via OTP, biometrics, or a banking app challenge). The flow is:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Your application submits the payment to the gateway.
          </li>
          <li>
            The gateway determines if 3DS is required based on card type, transaction
            amount, and merchant risk profile.
          </li>
          <li>
            If required, the gateway returns a challenge URL or modal content.
          </li>
          <li>
            The user completes the bank verification.
          </li>
          <li>
            The gateway notifies your application of the result (success or failure).
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Label Associations</h4>
          <ul className="space-y-2">
            <li>
              Every input has an associated <code>&lt;label&gt;</code> element with a{" "}
              <code>htmlFor</code> attribute matching the input&apos;s <code>id</code>.
            </li>
            <li>
              Error messages are linked to their inputs via{" "}
              <code>aria-describedby</code>, pointing to the error element&apos;s ID.
            </li>
            <li>
              Invalid inputs have <code>aria-invalid=&quot;true&quot;</code> set when
              errors are present.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              Validation errors are announced via an{" "}
              <code>aria-live=&quot;assertive&quot;</code> region when the user submits
              with errors.
            </li>
            <li>
              Payment status changes are announced via an{" "}
              <code>aria-live=&quot;polite&quot;</code> region (e.g., &quot;Payment
              processing, please wait&quot;).
            </li>
            <li>
              Card type detection is announced as an informational message (e.g.,
              &quot;Visa card detected&quot;) via <code>aria-live=&quot;polite&quot;</code>.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <p>
            The form follows the natural tab order: card number, expiry, CVV, cardholder
            name, billing address fields, shipping address toggle, shipping address fields
            (if different), and finally the Pay button. No custom keyboard handlers are
            needed — native form elements handle Tab, Enter, and arrow keys correctly.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting:</strong> The backend should rate-limit payment attempts
            per user session to prevent card-testing attacks (automated attempts with
            stolen card numbers).
          </li>
          <li>
            <strong>Idempotency keys:</strong> Each payment submission includes a unique
            idempotency key (UUID). If the user retries due to a network error, the
            gateway recognizes the same key and returns the original result rather than
            creating a duplicate charge.
          </li>
          <li>
            <strong>CSRF protection:</strong> The payment form includes a CSRF token
            (either via a hidden input or a request header) to prevent cross-site request
            forgery attacks.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Luhn algorithm:</strong> Test with valid numbers (Visa test:{" "}
            <code>4242424242424242</code>, MC test: <code>5555555555554444</code>),
            invalid numbers (wrong checksum), edge cases (all zeros, single digit),
            and Amex test numbers (<code>378282246310005</code>).
          </li>
          <li>
            <strong>BIN detection:</strong> Test each card type with known prefixes.
            Test ambiguous prefixes (e.g., a number starting with 4 that is too short
            to confirm — should return <code>unknown</code> until enough digits are
            entered).
          </li>
          <li>
            <strong>Expiry validation:</strong> Test future dates (valid), past dates
            (invalid), current month (valid through end of month), month 00 and 13
            (invalid), year more than 10 years ahead (invalid).
          </li>
          <li>
            <strong>Formatter functions:</strong> Test card number formatting (spaces
            every 4 digits, Amex 4-6-5), expiry formatting (auto-slash, month padding),
            CVV formatting (strip non-numeric, maxlength enforcement).
          </li>
          <li>
            <strong>Store actions:</strong> Test field updates, same-as-billing toggle
            (billing copies to shipping), validation error setting, payment status
            transitions, and form reset.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full form submission:</strong> Fill all fields with valid test data,
            submit payment, mock the gateway API to return success, assert the
            PaymentStatus component shows the success message.
          </li>
          <li>
            <strong>3D Secure flow:</strong> Submit payment, mock the gateway to return
            a 3DS challenge, assert the modal opens, simulate user completing the
            challenge, assert payment completes.
          </li>
          <li>
            <strong>Error handling:</strong> Submit with invalid card number, assert
            Luhn error displays. Submit with expired date, assert expiry error displays.
            Mock gateway decline, assert error message with retry button appears.
          </li>
          <li>
            <strong>Retry logic:</strong> Mock a network error on first submission,
            click retry, mock success on second attempt, assert payment completes
            with the same idempotency key.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Paste a formatted card number with spaces and dashes — verify it is
            normalized and validated correctly.
          </li>
          <li>
            Enter card number slowly (one digit at a time) — verify BIN detection
            updates progressively as more digits are entered.
          </li>
          <li>
            Toggle same-as-billing on and off — verify shipping fields enable/disable
            correctly and data is preserved when toggling off.
          </li>
          <li>
            Accessibility: run axe-core on the checkout page, verify all inputs have
            labels, errors are announced, and tab order is correct.
          </li>
          <li>
            Mobile: test on iOS Safari and Android Chrome — verify numeric keyboards
            appear for card inputs, autofill populates fields correctly, and the layout
            is usable on small screens.
          </li>
          <li>
            Navigation guard: start payment submission, attempt to navigate away, verify
            the user is warned about the in-progress transaction.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Storing card data in state without considering PCI scope:</strong>{" "}
            Candidates often implement card input handling in plain React state without
            acknowledging that this creates PCI compliance obligations. Interviewers
            expect candidates to mention iframe-hosted fields or client-side tokenization
            as the primary approach to reducing PCI scope.
          </li>
          <li>
            <strong>Implementing Luhn incorrectly:</strong> Many candidates know the
            Luhn algorithm conceptually but implement it wrong — forgetting to subtract
            9 when the doubled digit exceeds 9, or processing digits from left to right
            instead of right to left. Practice the algorithm before the interview.
          </li>
          <li>
            <strong>Not handling 3D Secure:</strong> In markets subject to PSD2/SCA,
            3D Secure is mandatory. Candidates who skip this demonstrate a lack of
            production payment experience. Even mentioning that 3DS adds friction to
            the checkout flow (and the trade-off between compliance and conversion rate)
            shows depth.
          </li>
          <li>
            <strong>Validating on every keystroke:</strong> Running Luhn validation on
            every keystroke while the user is still typing the card number produces
            premature errors. Interviewers expect validation on blur (for semantic
            checks) and debounced validation during typing (for format checks).
          </li>
          <li>
            <strong>Ignoring idempotency:</strong> Without idempotency keys, a network
            retry creates a duplicate charge. This is a critical production issue.
            Candidates should mention idempotency as part of the payment submission
            flow.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">iframe-Hosted Fields vs Client-Side SDK</h4>
          <p>
            iframe-hosted fields (Stripe Elements) provide the strongest security
            guarantee — raw card data never enters your application context. The trade-
            off is reduced customization: the gateway controls the iframe styling, and
            you are limited to the CSS customization options the gateway exposes.
            Client-side SDKs (Stripe.js tokenization) allow full UI customization but
            load the SDK into your page context, increasing your PCI scope. For most
            applications, iframe-hosted fields are the right choice because security
            outweighs pixel-perfect UI control.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Single-Page vs Multi-Step Checkout</h4>
          <p>
            A single-page checkout (all fields on one page) reduces friction and
            abandonment rate — the user sees the total and the payment form
            simultaneously. However, for complex checkouts (guest checkout, account
            creation, shipping method selection, coupon codes), a multi-step flow is
            cleaner and easier to maintain. The trade-off is increased cognitive load —
            users cannot see the total while filling payment details. Most modern
            e-commerce platforms (Shopify, Stripe Checkout) use a single-page layout
            with collapsible sections for better UX.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Real-Time Validation vs On-Submit Validation</h4>
          <p>
            Real-time validation (on each keystroke) provides immediate feedback but
            can be noisy and annoying if errors appear before the user finishes typing.
            On-submit validation delays feedback until the user clicks Pay, which can
            be frustrating if multiple fields have errors. The best approach is hybrid:
            format validation on change (e.g., stripping non-numeric characters),
            semantic validation on blur (Luhn check, expiry date), and full validation
            on submit. This gives immediate feedback for obvious errors while avoiding
            premature error messages.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support alternative payment methods (Apple Pay, Google
              Pay, PayPal)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a payment method selector above the card form. For Apple Pay and
              Google Pay, use their respective Payment Request APIs which handle the
              entire flow (card selection, authentication, tokenization) through the
              browser or native wallet. For PayPal, redirect to PayPal&apos;s OAuth flow
              and receive a payment token on callback. The payment store should track
              the selected method and render the appropriate flow. Card fields should
              be hidden when a wallet method is selected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle saved payment methods (returning users)?
            </p>
            <p className="mt-2 text-sm">
              A: Store payment method tokens (not card numbers) in the user&apos;s
              profile via the payment gateway&apos;s customer object. On checkout,
              display saved payment methods (last 4 digits, card type, expiry) as
              selectable options. When a saved method is selected, skip the card input
              form entirely and use the stored token for payment. The user can still
              add a new card. CVV re-collection may be required by the gateway for
              security even for saved cards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement a guest checkout (no account required)?
            </p>
            <p className="mt-2 text-sm">
              A: Guest checkout skips account creation and authentication. The order
              is linked to the email address provided in the billing address. After
              payment, offer the option to create an account using the email and order
              details (with a pre-filled password field or a magic link sent to email).
              The checkout form is identical, but the backend creates an order without
              a user_id, using email as the lookup key for order status.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle currency conversion for international payments?
            </p>
            <p className="mt-2 text-sm">
              A: Display the order total in the user&apos;s local currency (detected
              from IP or user preference). Use the payment gateway&apos;s multi-currency
              support to charge in the local currency. Show the exchange rate and the
              amount in the merchant&apos;s base currency as a reference. The order
              summary should display both amounts. Be transparent about conversion fees
              — some gateways add a 1–2% markup on the exchange rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you optimize checkout for conversion rate?
            </p>
            <p className="mt-2 text-sm">
              A: Reduce form fields to the minimum required. Use autofill attributes
              so browsers populate fields automatically. Support digital wallets (Apple
              Pay, Google Pay) for one-tap checkout. Avoid account creation as a
              prerequisite (offer guest checkout). Show a progress indicator for multi-
              step flows. Display security badges (PCI compliance, SSL) near the Pay
              button to build trust. A/B test the layout to find the highest conversion.
              Every additional field reduces conversion by approximately 1–3%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle partial payments or split payments?
            </p>
            <p className="mt-2 text-sm">
              A: Add a payment split UI where the user can allocate amounts across
              multiple payment methods (e.g., gift card + credit card, or two credit
              cards). The order summary shows each payment method and its allocated
              amount. Payments are processed sequentially — the first payment method
              is charged, then the second, and so on. If any payment fails, previously
              processed payments are refunded and the entire transaction is rolled back.
              This requires the gateway to support multi-tender transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/payments"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Payments Documentation — Payment Integration Guide
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/elements"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Elements — iframe-Hosted Payment Fields
            </a>
          </li>
          <li>
            <a
              href="https://www.pcisecuritystandards.org/pci_security/standards/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI Security Standards Council — PCI-DSS Requirements
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Luhn_algorithm"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Luhn Algorithm — Wikipedia
            </a>
          </li>
          <li>
            <a
              href="https://www.ecb.europa.eu/paym/integration/retail/sepa/html/index.en.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              European Central Bank — PSD2 / Strong Customer Authentication (SCA)
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/payment-request/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C Payment Request API — Web Payments Standard
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
