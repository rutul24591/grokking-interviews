"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-payment-ui",
  title: "Payment UI",
  description:
    "Comprehensive guide to implementing payment interfaces covering PCI-compliant card input, digital wallet integration, payment method selection, payment processing states, error handling, and mobile-optimized payment flows.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "payment-ui",
  version: "extensive",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "payment",
    "checkout",
    "frontend",
    "pci-compliance",
    "digital-wallets",
  ],
  relatedTopics: ["checkout-flow", "payment-processing", "security", "mobile-optimization"],
};

export default function PaymentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Payment UI enables secure payment collection with PCI-compliant input, multiple payment methods, and clear processing feedback. The payment form is the most critical part of checkout—poor UX causes abandonment, security concerns prevent trust, and complex flows frustrate users. For staff and principal engineers, payment UI implementation involves security requirements (PCI DSS compliance), accessibility (keyboard navigation, screen reader support), and conversion optimization (minimize friction, maximize trust).
        </p>
        <p>
          The complexity of payment UI extends beyond simple form fields. Card input requires real-time validation (Luhn algorithm, expiry date, CVV format), auto-formatting (spaces every 4 digits, MM/YY for expiry), and error handling (invalid card, declined payment). Digital wallets (Apple Pay, Google Pay, PayPal) require different integration patterns (SDK, redirect, modal). Payment processing states (processing, success, failure) require clear feedback (spinners, progress indicators, error messages). The UI must handle edge cases (network timeout, payment declined, session expired) gracefully without losing entered data.
        </p>
        <p>
          For staff and principal engineers, payment UI architecture involves security patterns. Hosted fields (Stripe Elements, Braintree Hosted Fields) ensure PCI compliance (card data never touches your server). Tokenization replaces card data with payment method token (safe to store, transmit). 3D Secure authentication requires redirect handling (bank verification page, callback). The UI must support multiple payment methods (cards, wallets, bank transfer, BNPL), each with different flows and requirements. Mobile optimization is critical (50-60% of payments on mobile)—touch-friendly input, appropriate keyboards, auto-fill support.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Card Input and Validation</h3>
        <p>
          Card number input requires specific formatting and validation. Input type: tel (numeric keypad on mobile). Auto-formatting: spaces every 4 digits (1234 5678 9012 3456), auto-advance (cursor jumps to next field). Validation: Luhn algorithm (checksum validation), BIN lookup (card type detection—Visa, Mastercard, Amex). Length varies by card type (15 digits for Amex, 16 for Visa/Mastercard). Error messaging: specific (&quot;Invalid card number&quot; vs. &quot;Card number must be 16 digits&quot;).
        </p>
        <p>
          Expiry date input requires format enforcement. Input format: MM/YY (01/25, 12/26). Auto-format: slash auto-inserted after month. Validation: month 01-12, year current or future, card not expired (expiry date &gt; current date). Input type: tel (numeric keypad). Auto-complete: expiry-picker dropdown (select month/year). Error messaging: specific (&quot;Card expired&quot; vs. &quot;Invalid expiry date&quot;).
        </p>
        <p>
          CVV/CVC input requires security handling. Input type: password (masked) or tel (visible, numeric keypad). Length: 3 digits (Visa, Mastercard), 4 digits (Amex). Validation: numeric only, correct length. Security: never log CVV, never store CVV (PCI requirement). Tooltip: &quot;3 digits on back of card&quot; (with diagram for Visa/Mastercard, &quot;4 digits on front&quot; for Amex). Error messaging: specific (&quot;CVV must be 3 digits&quot;).
        </p>

        <h3 className="mt-6">Payment Method Selection</h3>
        <p>
          Payment method display shows available options. Card payment: credit/debit cards (Visa, Mastercard, Amex, Discover). Digital wallets: Apple Pay, Google Pay, PayPal (one-click payment). Bank transfer: ACH (US), SEPA (EU), direct debit (UK). BNPL (Buy Now Pay Later): Affirm, Klarna, Afterpay (installment payments). Display: logos (trust signals), order by popularity (most used first), hide unavailable (grey out, tooltip why unavailable).
        </p>
        <p>
          Payment method selection flow varies by type. Card payment: expand card form (inline or modal). Digital wallet: redirect (PayPal), modal (Apple Pay/Google Pay), or SDK (in-page). Bank transfer: redirect to bank (open banking), or account/link micro-deposits (ACH). BNPL: redirect to provider (Affirm), or inline approval (Klarna). Each method has different UX—card (form fill), wallet (one-click), bank (redirect), BNPL (approval flow).
        </p>
        <p>
          Saved payment methods enable repeat purchases. Display: masked card number (•••• 1234), card type logo (Visa), expiry date (12/25), default indicator (star). Selection: radio button (select saved card), edit (update expiry), delete (remove saved card). Security: tokenized (no raw card data), PCI compliant (vault storage). Default: most recently used, or customer-set default.
        </p>

        <h3 className="mt-6">Payment Processing States</h3>
        <p>
          Processing state indicates payment in progress. Trigger: submit payment form. Visual: spinner/progress indicator, disabled form (prevent double-submit), processing message (&quot;Processing payment...&quot;). Duration: 2-5 seconds typical (gateway response). Timeout: 30 seconds max (network issue). User action: wait (don&apos;t refresh, don&apos;t navigate away). Accessibility: aria-live region (screen reader announcement), focus management (keep focus on processing indicator).
        </p>
        <p>
          Success state confirms payment completed. Trigger: payment gateway success response. Visual: checkmark icon, success message (&quot;Payment successful!&quot;), order confirmation (order number, receipt). User action: continue (to order confirmation, download, next step). Auto-redirect: 3-5 seconds (to confirmation page). Email: receipt sent (confirmation email). Accessibility: aria-live region (success announcement), focus management (move focus to confirmation).
        </p>
        <p>
          Failure state handles payment errors. Trigger: payment gateway failure response. Visual: error icon, error message (specific: &quot;Card declined—insufficient funds&quot;), retry option (try again, different card). User action: fix error (update card, try different payment), retry (same card), cancel (abandon checkout). Data preservation: keep entered data (don&apos;t clear form), highlight error field. Accessibility: aria-live region (error announcement), focus management (move focus to error field).
        </p>

        <h3 className="mt-6">PCI Compliance and Security</h3>
        <p>
          PCI DSS compliance requirements for payment forms. SAQ A (simplest): hosted fields (card data never touches your server). SAQ D (most complex): raw card data on your server (avoid if possible). Requirements: HTTPS (TLS 1.2+), no card data in logs, no card data in URLs, secure storage (tokenization). Compliance: annual SAQ (Self-Assessment Questionnaire), quarterly scans (ASV), penetration testing.
        </p>
        <p>
          Hosted fields ensure PCI compliance. Implementation: iframe served from payment provider (Stripe Elements, Braintree Hosted Fields). Card data entered in iframe (your page never sees raw card data). Token returned (safe to send to your server). Styling: CSS inheritance (iframe matches your design). Validation: real-time (via postMessage). Accessibility: tab order (iframe in tab sequence), labels (associated with iframe).
        </p>
        <p>
          Tokenization replaces card data with token. Flow: card data → payment gateway → token → your server. Token: random string (tok_1234567890), useless if stolen (single-use or customer-specific). Storage: safe to store token (not PCI scope). Usage: charge token (not card data), save for repeat purchases. Security: token limited to your account (can&apos;t use elsewhere), expires (configurable).
        </p>

        <h3 className="mt-6">Mobile Payment Optimization</h3>
        <p>
          Mobile input optimization for payment forms. Input type: tel (numeric keypad for card, expiry, CVV), email (email keyboard for email field), url (url keyboard for billing website). Auto-format: spaces in card number, slash in expiry, auto-advance (next field). Auto-fill: browser auto-fill (saved cards), password manager (1Password, LastPass). Touch targets: 44x44px minimum (finger-friendly), spacing between fields (prevent mis-tap).
        </p>
        <p>
          Digital wallet integration for mobile. Apple Pay (iOS): Safari payment sheet (native, biometric auth). Google Pay (Android): payment sheet (native, biometric auth). PayPal (both): redirect or modal (PayPal login). Benefits: one-click payment (no form fill), biometric auth (Touch ID, Face ID), higher conversion (less friction). Requirements: HTTPS, domain verification (Apple Pay), SDK integration.
        </p>
        <p>
          Mobile checkout flow optimization. Single column layout (no side-by-side fields). Progress indicator (step X of Y, time remaining). Guest checkout (no account required). Auto-detect card type (BIN lookup, show logo). Address autocomplete (Loqate, Google Places). Error handling: inline validation (real-time), specific errors (field-level). Performance: fast load (&lt;3 seconds), minimal JavaScript (reduce bundle size).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Payment UI architecture spans form components, payment gateway integration, state management, and security layers. Form components handle card input, validation, formatting. Payment gateway integration handles tokenization, 3D Secure, payment processing. State management handles processing states (idle, processing, success, failure). Security layers ensure PCI compliance (hosted fields, tokenization).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-ui/payment-ui-architecture.svg"
          alt="Payment UI Architecture"
          caption="Figure 1: Payment UI Architecture — Form components, gateway integration, state management, and security layers"
          width={1000}
          height={500}
        />

        <h3>Form Components</h3>
        <p>
          Card input component handles card number entry. Hosted field (iframe) for PCI compliance. Real-time validation (Luhn algorithm, length check). Auto-formatting (spaces every 4 digits). Card type detection (BIN lookup, show Visa/Mastercard/Amex logo). Error handling (invalid format, unsupported card). Accessibility (label, aria-describedby, keyboard navigation).
        </p>
        <p>
          Expiry and CVV components handle security fields. Expiry field: MM/YY format, auto-slash, validation (not expired). CVV field: numeric only, length validation (3-4 digits), tooltip (where to find CVV). Both fields: hosted fields (PCI compliance), auto-advance (tab to next field), error handling (invalid format).
        </p>
        <p>
          Payment method selector handles multiple payment types. Display: payment method logos (Visa, Mastercard, Apple Pay, PayPal). Selection: radio button or tab (select payment type). Conditional display (show card form for card payment, hide for wallet). Validation (payment method selected before submit). Accessibility (radio group, aria-selected).
        </p>

        <h3 className="mt-6">Payment Gateway Integration</h3>
        <p>
          Tokenization flow converts card data to token. User enters card data (hosted fields). Submit: card data → payment gateway (direct, not through your server). Gateway validates card (Luhn, BIN, fraud check). Gateway returns token (tok_1234567890). Token sent to your server (safe, not PCI scope). Your server charges token (not card data).
        </p>
        <p>
          3D Secure flow handles bank authentication. Trigger: card requires 3D Secure (SCA in Europe). Redirect: user to bank authentication page (or modal). Authentication: password, SMS code, biometric (bank&apos;s page). Callback: bank redirects back to your site (with auth result). Result: success (continue payment), failure (show error, retry). Handling: preserve form data (don&apos;t lose card info on redirect).
        </p>
        <p>
          Payment processing flow handles charge execution. Input: token, amount, customer info. Gateway processes charge (card network, issuing bank). Response: success (charge completed), failure (declined, error). Webhook: async confirmation (for delayed processing). Error handling: specific errors (insufficient funds, invalid card, fraud suspected). Retry: same token (if transient error), different card (if permanent error).
        </p>

        <h3 className="mt-6">State Management</h3>
        <p>
          Payment state machine manages UI states. States: idle (form ready), processing (payment in progress), success (payment completed), failure (payment failed). Transitions: idle → processing (on submit), processing → success/failure (on response), failure → idle (on retry). Guards: can&apos;t submit while processing, can&apos;t retry without fixing error. Actions: disable form (processing), show message (success/failure), preserve data (failure).
        </p>
        <p>
          Form state management handles entered data. State: card number (masked), expiry, CVV, billing address, payment method. Persistence: don&apos;t clear on error (preserve entered data), clear on success (security). Validation: real-time (on blur), on submit (all fields). Error state: field-level errors (highlight field, specific message), form-level errors (payment declined, try again).
        </p>
        <p>
          Loading state management handles processing feedback. Spinner: centered, visible, animated. Message: &quot;Processing payment...&quot; (reassuring). Disabled state: form disabled (prevent double-submit), button disabled (no click). Timeout: 30 seconds max (network issue), show error (&quot;Payment taking longer than expected&quot;). Recovery: retry option (try again), support contact (need help?).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-ui/payment-flow.svg"
          alt="Payment Flow"
          caption="Figure 2: Payment Flow — Card input, tokenization, 3D Secure, and payment processing"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Error Handling</h3>
        <p>
          Validation errors handle input issues. Field-level: invalid card number (highlight field, &quot;Card number is invalid&quot;), expired card (&quot;Card has expired&quot;), invalid CVV (&quot;CVV must be 3 digits&quot;). Form-level: missing fields (&quot;Please fill in all fields&quot;), invalid format (&quot;Expiry date must be MM/YY&quot;). Timing: real-time (on blur), on submit (all fields). Clearing: error clears on valid input (immediate feedback).
        </p>
        <p>
          Payment errors handle gateway failures. Card declined: insufficient funds (try different card), card expired (update card), suspected fraud (contact bank). Network error: timeout (retry), gateway down (try later, different payment). Session error: session expired (refresh, data preserved), invalid token (restart checkout). User messaging: specific (actionable), friendly (not technical), helpful (what to do next).
        </p>
        <p>
          Recovery options help users complete payment. Retry: same card (transient error), different card (permanent error). Different payment method: switch to wallet (Apple Pay, PayPal), bank transfer (ACH). Support: chat (immediate help), phone (complex issues), email (non-urgent). Data preservation: keep entered data (don&apos;t make user re-enter), save cart (don&apos;t lose items).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-ui/payment-states.svg"
          alt="Payment Processing States"
          caption="Figure 3: Payment Processing States — Idle, processing, success, and failure state transitions"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Payment UI design involves trade-offs between security, conversion, complexity, and user experience. Understanding these trade-offs enables informed decisions aligned with business requirements and customer expectations.
        </p>

        <h3>Hosted Fields vs. Custom Form</h3>
        <p>
          Hosted fields (Stripe Elements, Braintree). Pros: PCI compliant (SAQ A, simplest), no card data on your server, maintained by provider (security updates). Cons: Less customization (iframe styling limits), dependency on provider (downtime affects you), accessibility challenges (iframe tab order). Best for: Most e-commerce (security priority, compliance simplicity).
        </p>
        <p>
          Custom form (your own fields). Pros: Full customization (design control), no iframe (better accessibility), no provider dependency. Cons: PCI compliant (SAQ D, complex), card data on your server (security burden), annual audits (cost, effort). Best for: Large enterprises (existing PCI compliance, design requirements).
        </p>
        <p>
          Hybrid: custom form with tokenization SDK. Pros: Design control, tokenization (no raw card storage). Cons: Still PCI scope (SAQ C), SDK integration complexity. Best for: Companies with PCI infrastructure, specific design needs.
        </p>

        <h3>Single-Page vs. Multi-Step Checkout</h3>
        <p>
          Single-page payment (all fields on one page). Pros: Faster (no page loads), all visible (progress clear), less abandonment (fewer steps). Cons: Overwhelming (many fields), mobile scrolling (long page), validation complexity (all at once). Best for: Simple checkout (few fields), returning customers (saved info).
        </p>
        <p>
          Multi-step payment (shipping → payment → review). Pros: Focused (one section at a time), progress clear (step X of Y), validation per step (catch errors early). Cons: Slower (multiple pages), more abandonment (more steps), back navigation complexity. Best for: Complex checkout (many fields), new customers (guidance needed).
        </p>
        <p>
          Hybrid: accordion payment (expandable sections on one page). Pros: Single page (fast), focused (one section expanded), progress visible (all sections visible). Cons: JavaScript complexity (expand/collapse), mobile scrolling (still long). Best for: Most production systems—balance speed with focus.
        </p>

        <h3>Guest Checkout vs. Account Required</h3>
        <p>
          Guest checkout (no account required). Pros: Lower friction (faster checkout), higher conversion (25-30% improvement), respects privacy. Cons: No order history (harder to support), harder to re-engage (no account), limited features (no saved cards). Best for: First-time buyers, low-frequency purchases.
        </p>
        <p>
          Account required (registration before checkout). Pros: Order history (easier support), re-engagement (email, notifications), saved info (faster repeat purchases). Cons: Higher friction (lower conversion), privacy concerns, account management overhead. Best for: Subscription services, B2B (account required), high-frequency purchases.
        </p>
        <p>
          Hybrid: guest checkout with account creation option. Pros: Lower friction (guest), account benefits (post-purchase signup). Cons: Complexity (two flows), account conversion (guest → account). Best for: Most e-commerce—guest first, invite to create account after purchase (3-5x higher opt-in).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-ui/payment-methods.svg"
          alt="Payment Methods Comparison"
          caption="Figure 4: Payment Methods Comparison — Cards, digital wallets, bank transfer, and BNPL"
          width={1000}
          height={450}
        />

        <h3>Payment Method Display: All vs. Conditional</h3>
        <p>
          Show all payment methods always. Pros: Transparent (all options visible), no surprises (customer sees all options). Cons: Cluttered (many logos), decision paralysis (too many choices), some unavailable (greyed out, confusing). Best for: Simple payment (few methods), all methods available (no geo-restrictions).
        </p>
        <p>
          Conditional display (show available methods). Pros: Clean (only relevant options), no confusion (no greyed out), faster selection (fewer choices). Cons: Hidden options (customer may want unavailable method), complexity (detect availability). Best for: International (geo-restricted methods), complex payment (many methods).
        </p>
        <p>
          Hybrid: show popular always, expand for more. Pros: Clean default (popular methods), all available (expand for more), progressive disclosure (not overwhelming). Best for: Most production systems—Visa/Mastercard/Apple Pay visible, &quot;More payment methods&quot; expandable.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use hosted fields for PCI compliance:</strong> Stripe Elements, Braintree Hosted Fields. Card data never touches your server. SAQ A compliance (simplest). Style with CSS inheritance. Test accessibility (tab order, labels).
          </li>
          <li>
            <strong>Implement real-time validation:</strong> Luhn algorithm for card number. Expiry date validation (not expired). CVV length validation (3-4 digits). Inline errors (field-level, specific). Clear errors on valid input.
          </li>
          <li>
            <strong>Support digital wallets:</strong> Apple Pay (iOS), Google Pay (Android), PayPal (both). One-click payment (higher conversion). Biometric auth (Touch ID, Face ID). Display prominently (above card form).
          </li>
          <li>
            <strong>Optimize for mobile:</strong> Input type tel (numeric keypad). Auto-format (spaces, slashes). Auto-fill support (saved cards). Touch targets 44x44px. Single column layout. Fast load (&lt;3 seconds).
          </li>
          <li>
            <strong>Show clear processing states:</strong> Processing: spinner, message, disabled form. Success: checkmark, confirmation, auto-redirect. Failure: specific error, retry option, preserve data. Accessibility: aria-live regions.
          </li>
          <li>
            <strong>Preserve entered data:</strong> Don&apos;t clear form on error. Highlight error field. Specific error message. Retry option (same card, different card). Save cart (don&apos;t lose items on error).
          </li>
          <li>
            <strong>Display trust signals:</strong> Security badges (Norton, McAfee). Payment method logos (Visa, Mastercard). SSL indicator (padlock icon). Return policy (link near payment). Customer reviews (social proof).
          </li>
          <li>
            <strong>Handle 3D Secure gracefully:</strong> Redirect to bank (or modal). Preserve form data (don&apos;t lose on redirect). Handle callback (success/failure). Timeout handling (user closes bank page). Fallback (different payment method).
          </li>
          <li>
            <strong>Support saved payment methods:</strong> Tokenized storage (PCI compliant). Masked display (•••• 1234). Default selection (most recent). Edit/delete options. Security: re-authenticate for first use (CVV, 3DS).
          </li>
          <li>
            <strong>Test across devices/browsers:</strong> Desktop (Chrome, Firefox, Safari, Edge). Mobile (iOS Safari, Android Chrome). Tablet (iPad, Android tablet). Payment methods (each wallet, each card type). Accessibility (screen reader, keyboard only).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Raw card data on server:</strong> Massive PCI scope, security risk. Solution: Hosted fields, tokenization. Never log/store raw card data.
          </li>
          <li>
            <strong>No real-time validation:</strong> Errors on submit, user frustrated. Solution: Validate on blur, inline errors, clear on valid input.
          </li>
          <li>
            <strong>Clear form on error:</strong> User must re-enter everything. Solution: Preserve entered data, highlight error field, specific error message.
          </li>
          <li>
            <strong>No mobile optimization:</strong> Desktop form on mobile, tiny inputs. Solution: Input type tel, auto-format, touch-friendly targets, single column.
          </li>
          <li>
            <strong>Unclear processing state:</strong> User doesn&apos;t know if payment working. Solution: Spinner, message, disabled form, timeout handling.
          </li>
          <li>
            <strong>No digital wallet support:</strong> Miss one-click payment conversion. Solution: Apple Pay, Google Pay, PayPal prominently displayed.
          </li>
          <li>
            <strong>Poor 3D Secure handling:</strong> Lose form data on redirect. Solution: Preserve data, handle callback, timeout handling, fallback option.
          </li>
          <li>
            <strong>Generic error messages:</strong> &quot;Payment failed&quot; not actionable. Solution: Specific errors (&quot;Insufficient funds&quot;, &quot;Card expired&quot;), what to do next.
          </li>
          <li>
            <strong>No trust signals:</strong> Users hesitant to enter card. Solution: Security badges, SSL indicator, payment logos, return policy.
          </li>
          <li>
            <strong>No accessibility:</strong> Keyboard-only users can&apos;t pay. Solution: Tab order, labels, aria attributes, screen reader testing.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Elements Payment Form</h3>
        <p>
          Stripe Elements: pre-built, accessible, PCI-compliant components. Card Element (number, expiry, CVV in one). Postal Code Element (billing zip). IBAN Element (SEPA bank transfer). Styling: CSS variables (match your design). Validation: real-time (built-in). 3D Secure: Stripe handles redirect. Mobile: optimized (numeric keypad, auto-format).
        </p>

        <h3 className="mt-6">Apple Pay Integration</h3>
        <p>
          Apple Pay: native iOS payment sheet. Integration: Stripe, Braintree, or Apple Pay JS. Flow: tap Apple Pay button → native sheet (card selection, biometric auth) → token → charge. Benefits: one-click (no form fill), biometric (Touch ID/Face ID), higher conversion. Requirements: HTTPS, domain verification, Safari (iOS/macOS).
        </p>

        <h3 className="mt-6">PayPal Checkout</h3>
        <p>
          PayPal: redirect or modal checkout. Integration: PayPal SDK, buttons. Flow: click PayPal → redirect/modal (PayPal login) → approve → redirect back → charge. Benefits: trusted brand, PayPal balance/bank/card, buyer protection. Cons: redirect (context switch), PayPal account required. Display: PayPal button (above card form).
        </p>

        <h3 className="mt-6">Amazon Pay</h3>
        <p>
          Amazon Pay: use Amazon account for payment. Integration: Amazon Pay SDK. Flow: click Amazon Pay → Amazon login (if not logged in) → select card/address → approve → charge. Benefits: trusted, saved cards/addresses, one-click for Prime. Cons: Amazon account required, redirect. Display: Amazon Pay button (with Prime badge if applicable).
        </p>

        <h3 className="mt-6">Affirm BNPL Integration</h3>
        <p>
          Affirm: Buy Now Pay Later (installment payments). Integration: Affirm SDK, checkout redirect. Flow: select Affirm → Affirm checkout (approval, plan selection) → redirect back → charge. Benefits: higher AOV (customers buy more), no interest for customer (merchant pays fee). Cons: redirect, approval required (not guaranteed). Display: Affirm logo, &quot;Pay in 4 interest-free payments&quot;.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure PCI compliance for payment forms?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use hosted fields (Stripe Elements, Braintree Hosted Fields). Card data entered in iframe served from payment provider (your page never sees raw card data). Token returned (safe to store/transmit). SAQ A compliance (simplest, annual self-assessment). Never log card data, never store card data (even encrypted). HTTPS required (TLS 1.2+).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle 3D Secure authentication?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Gateway returns 3DS required response with redirect URL. Preserve form data (don&apos;t lose card info on redirect). Redirect user to bank authentication (or modal). Bank verifies (password, SMS, biometric). Bank redirects back with auth result. Handle success (continue payment), failure (show error, retry). Timeout handling (user closes bank page).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize payment forms for mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Input type tel (numeric keypad for card, expiry, CVV). Auto-format (spaces in card number, slash in expiry). Auto-fill support (browser saved cards, password managers). Touch targets 44x44px minimum. Single column layout (no side-by-side). Fast load (&lt;3 seconds, minimal JavaScript). Digital wallets (Apple Pay, Google Pay) for one-click.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment errors?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Specific error messages (&quot;Insufficient funds&quot; vs. &quot;Payment failed&quot;). Preserve entered data (don&apos;t clear form). Highlight error field. Retry option (same card for transient errors, different card for permanent). Alternative payment methods (switch to wallet, bank transfer). Support contact (chat, phone) for complex issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement saved payment methods?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Tokenized storage (gateway vault, not your server). Display: masked card (•••• 1234), card logo, expiry. Selection: radio button (select saved card). Security: re-authenticate for first use (CVV, 3DS). Default: most recently used or customer-set. Edit/delete: update expiry, remove saved card. PCI compliant (token only, no raw card data).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment processing states?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> State machine: idle → processing → success/failure. Processing: spinner, message, disabled form (prevent double-submit). Success: checkmark, confirmation, auto-redirect (3-5 seconds). Failure: specific error, retry option, preserve data. Accessibility: aria-live regions (screen reader announcements), focus management (move focus appropriately).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/payments/accept-a-payment"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Accept a Payment Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/apple-pay/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple — Apple Pay Integration Guide
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/pay/api"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google — Google Pay API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.pcisecuritystandards.org/pci_security/complete-guide-to-pci-dss/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI Security Standards Council — PCI DSS Complete Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.paypal.com/docs/checkout/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal — Checkout Integration Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/payment-request/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — Payment Request API Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
