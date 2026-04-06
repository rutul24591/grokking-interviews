# Payment / Checkout UI — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + hooks + components** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Card Input    │────▶│  Zustand Store   │────▶│  Validation Errors  │
│   Expiry Input  │     │  (form state)    │     │  (per-field)        │
│   CVV Input     │     └────────┬─────────┘     └─────────────────────┘
│   Address Form  │              │
└─────────────────┘              │
                                 ▼
                    ┌──────────────────────────┐
                    │  useCardForm Hook        │
                    │  (format + validate)     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  usePaymentProcessing    │
                    │  (submit + 3DS + retry)  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  Payment API Layer       │
                    │  (gateway integration)   │
                    └──────────────────────────┘
```

### Design Decisions

1. **Zustand for state management** — Lightweight, selector-based subscriptions prevent unnecessary re-renders. Each input component subscribes only to its own field value and error.

2. **Custom hooks for business logic** — `useCardForm` encapsulates formatting and validation. `usePaymentProcessing` encapsulates the payment submission flow. Components are purely presentational.

3. **Pure validation functions** — All validation logic (Luhn, BIN detection, expiry, CVV) is implemented as pure functions with no side effects, making them trivially testable.

4. **Separation of formatted vs raw values** — The store stores raw values (digits only). Formatting is applied at render time via the hook. This keeps validation simple and avoids storing formatted strings with spaces/slashes.

## File Structure

```
example-1/
├── lib/
│   ├── payment-types.ts       # TypeScript interfaces for all data shapes
│   ├── card-validation.ts     # Luhn algorithm, BIN detection, expiry/CVV validation
│   ├── card-formatter.ts      # Input formatting (card spacing, expiry slash, CVV strip)
│   ├── payment-store.ts       # Zustand store + selectors
│   └── payment-api.ts         # Payment gateway integration (mock)
├── hooks/
│   ├── use-card-form.ts       # Form state management + real-time validation
│   └── use-payment-processing.ts  # Payment submission + 3DS + retry logic
├── components/
│   ├── checkout-page.tsx      # Root checkout component
│   ├── card-input.tsx         # Card number with formatting + type detection
│   ├── card-expiry-input.tsx  # MM/YY with auto-slash
│   ├── card-cvv-input.tsx     # CVV with masking + type-appropriate length
│   ├── address-form.tsx       # Billing/shipping with same-as-billing toggle
│   ├── order-summary.tsx      # Line items, tax, total display
│   └── payment-status.tsx     # Processing/success/error/abandoned states
└── EXPLANATION.md             # This file
```

## Key Implementation Details

### Card Validation (lib/card-validation.ts)

The most critical module. Key aspects:

- **Luhn algorithm**: Iterates from right to left, doubles every second digit, subtracts 9 if > 9, sums all digits, checks divisibility by 10. This is the standard checksum algorithm used by all major card networks.

- **BIN detection**: Uses regex patterns against the first 2-6 digits. Amex is detected first (starts with 34/37) because its 4-6-5 formatting is unique. Visa, Mastercard, and Discover follow. Returns `unknown` if the prefix does not match any known pattern.

- **Expiry validation**: Parses MM/YY, validates month range (01-12), year range (current to current+10), and checks that the date is in the future. Critically, the card is valid through the **end** of the expiry month — a card expiring 02/25 is valid through February 28, 2025.

- **CVV validation**: Returns expected length based on card type (4 for Amex, 3 for others). Validates that the input matches the expected length exactly.

### Card Formatter (lib/card-formatter.ts)

Formatting is applied at render time, not stored:

- **Card number**: Inserts spaces every 4 digits for Visa/MC/Discover. Amex uses 4-6-5 grouping (4 digits, space, 6 digits, space, 5 digits). The formatted length is 19 characters for standard cards (16 digits + 3 spaces) and 17 for Amex (15 digits + 2 spaces).

- **Expiry**: Inserts slash after the first 2 digits (MM). If the user types "1225", it becomes "12/25". The raw value stored is "1225".

- **CVV**: Strips all non-numeric characters. Never formatted with separators.

- **Cardholder name**: Trims whitespace and collapses multiple spaces into one.

### Zustand Store (lib/payment-store.ts)

The store manages all checkout state:

- **Card data**: number, expiry, cvv, name, detectedType — stored as raw values.
- **Addresses**: billing and shipping as separate Address objects.
- **sameAsBilling**: boolean flag. When true, shipping address is copied from billing and shipping fields are disabled.
- **Payment status**: Union type driving UI rendering (idle, validating, processing, three-ds-required, success, failed, abandoned).
- **Validation errors**: Map keyed by field name (e.g., "card.number", "card.expiry"). Allows per-field error display.
- **Payment intent ID**: Stored for retry logic — the same intent is reused on retry to prevent duplicate charges.
- **Retry count**: Tracks retry attempts. Maximum 3 retries before marking as non-retryable.

### Payment API (lib/payment-api.ts)

Service layer wrapping the payment gateway:

1. **createPaymentIntent**: Calls the backend to create an intent with the order total. Returns a client secret used for confirmation.

2. **tokenizeCard**: Uses the gateway SDK to tokenize card data client-side. Raw card data goes directly to the gateway — never to our servers. Returns a token.

3. **confirmPayment**: Submits the tokenized payment. Returns success, failure, or requires_action (3D Secure needed).

4. **handle3DSecure**: Opens the gateway-provided 3D Secure modal or redirect. Resolves when the bank verification completes, fails, or is abandoned.

5. **confirmAfter3DSecure**: Confirms the payment after 3D Secure completes successfully.

### useCardForm Hook

Manages card input state and validation:

- **Formatting on change**: Each update function (updateNumber, updateExpiry, etc.) formats the raw input before storing it.
- **Card type detection**: Runs after every number update. If the type changes, the store is updated and CVV maxlength adjusts accordingly.
- **Validation on blur**: Semantic validation (Luhn, expiry date, CVV length) runs on blur, not on change. This avoids premature errors while the user is still typing.
- **Error clearing**: When the user modifies a field, its error is cleared immediately. The error will reappear on blur if the value is still invalid.

### usePaymentProcessing Hook

Manages the payment submission flow:

1. **Validation**: Runs all field validations before submission.
2. **Create intent**: Calls the backend to create a payment intent.
3. **Tokenize**: Sends card data to the gateway SDK for tokenization.
4. **Confirm**: Submits the tokenized payment.
5. **3D Secure**: If the gateway returns requires_action, opens the 3DS modal/redirect and awaits the result.
6. **Final confirmation**: After 3DS completes, confirms the payment.
7. **Retry**: On retryable error, increments retry count and re-submits. Maximum 3 retries.

### Component Structure

- **CheckoutPage**: Root component composing all sub-components. Layout is responsive: stacked on mobile, side-by-side on desktop (order summary sticky on the right).
- **CardInput**: Card number with formatting, BIN detection, card icon display, and Luhn validation on blur.
- **CardExpiryInput**: MM/YY input with auto-slash and future-date validation.
- **CardCVVInput**: Password-masked input with type-appropriate maxlength.
- **AddressForm**: Reusable for both billing and shipping. Handles same-as-billing toggle logic.
- **OrderSummary**: Displays line items, subtotal, tax, shipping, discount, and total.
- **PaymentStatus**: Conditional rendering based on payment status — spinner, success confirmation, error with retry, or abandoned message.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Pasted card number with spaces/dashes | Stripped to digits before formatting and validation |
| Expiry at end of month | Valid through last day of the expiry month |
| 3D Secure modal closed by user | Status set to "abandoned" (not "failed"), no error shown |
| Network error during submission | Error marked retryable, user can retry with same intent |
| Double-submission prevention | Button disabled during processing, ref guard prevents concurrent calls |
| Autofill populates fields | Validation runs via onChange and onBlur events, works with autofill |
| Same-as-billing toggle on/off | Shipping address copied on toggle on, preserved on toggle off |

## Security Checklist

- Raw card data never sent to our servers (tokenized client-side)
- CVV input uses type="password" for masking
- CVV field has autocomplete="off"
- No console.log of card data
- HTTPS required for checkout page
- CSRF token included in payment request
- Idempotency key prevents duplicate charges on retry
- Maximum 3 retries before requiring user intervention

## Testing Strategy

1. **Unit tests**: Luhn algorithm with valid/invalid numbers, BIN detection for all card types, expiry validation (past, future, end-of-month), CVV length by type, formatters for all input types.

2. **Integration tests**: Full form submission with mock gateway, 3D Secure flow (modal open, complete, payment succeeds), error handling (card declined shows error, retry works), same-as-billing toggle copies data.

3. **Accessibility tests**: All inputs have labels, errors announced via aria-live, tab order matches visual order, screen reader announces card type detection.

4. **Edge case tests**: Paste formatted card number, enter digits one at a time (progressive BIN detection), toggle same-as-billing on/off, navigate away during processing.
