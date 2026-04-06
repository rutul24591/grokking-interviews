import type {
  PaymentIntent,
  ThreeDSecureResult,
  PaymentConfirmationResult,
  PaymentError,
  CardData,
} from "./payment-types";

/**
 * Mock payment gateway API.
 * In production, this would wrap Stripe.js, Adyen Web SDK, or similar.
 */

const MOCK_3DS_REQUIRED = true; // Toggle to test 3DS flow
const MOCK_PROCESS_DELAY_MS = 1500;

/**
 * Create a payment intent on the backend.
 * Returns a client secret used for confirming the payment.
 */
export async function createPaymentIntent(
  amount: number,
  currency: string
): Promise<PaymentIntent> {
  // In production: POST /api/payments/intent with { amount, currency }
  await simulateNetworkDelay(800);

  const intentId = generateId("pi");
  const clientSecret = `pi_${intentId}_secret_${generateId("sec")}`;

  return {
    id: intentId,
    clientSecret,
    amount,
    currency,
    status: "requires_payment_method",
  };
}

/**
 * Tokenize card data using the payment gateway SDK.
 * The raw card data is sent directly to the gateway (never to our servers).
 * Returns a token that represents the card for future charges.
 */
export async function tokenizeCard(card: CardData): Promise<string> {
  // In production: stripe.createToken(cardElement) or similar
  // Raw card data goes directly to the gateway via their SDK
  await simulateNetworkDelay(500);

  if (!isValidTestCard(card.number)) {
    throw new Error("Card number is invalid");
  }

  return `tok_${generateId("tok")}`;
}

/**
 * Confirm the payment using the payment intent client secret.
 * This submits the tokenized payment for processing.
 */
export async function confirmPayment(
  clientSecret: string,
  token: string
): Promise<PaymentConfirmationResult> {
  // In production: stripe.confirmCardPayment(clientSecret, { payment_method: token })
  await simulateNetworkDelay(MOCK_PROCESS_DELAY_MS);

  // Simulate random failure for testing (10% chance)
  const shouldFail = Math.random() < 0.1;

  if (shouldFail) {
    return {
      status: "failed",
      error: {
        code: "card_declined",
        message: "Your card was declined. Please try a different card.",
        retryable: false,
      },
    };
  }

  // Simulate 3D Secure requirement
  if (MOCK_3DS_REQUIRED) {
    return {
      status: "failed",
      error: {
        code: "requires_action",
        message: "3D Secure authentication required",
        retryable: true,
      },
      transactionId: undefined,
    };
  }

  return {
    status: "success",
    transactionId: generateId("txn"),
  };
}

/**
 * Handle the 3D Secure challenge flow.
 * Opens a modal or redirect provided by the gateway.
 */
export async function handle3DSecure(
  clientSecret: string
): Promise<ThreeDSecureResult> {
  // In production: stripe.handleCardAction(clientSecret)
  // This opens the 3DS modal/iframe provided by the bank

  return new Promise((resolve) => {
    // Simulate the modal being shown
    // In production, this would resolve when the bank redirects back
    setTimeout(() => {
      // Simulate user completing the challenge successfully
      const userCompleted = true; // Toggle to test abandonment

      if (!userCompleted) {
        resolve({
          status: "abandoned",
          error: "Authentication was not completed",
        });
        return;
      }

      resolve({
        status: "completed",
      });
    }, 3000);
  });
}

/**
 * Confirm payment after 3D Secure is completed.
 */
export async function confirmAfter3DSecure(
  clientSecret: string
): Promise<PaymentConfirmationResult> {
  await simulateNetworkDelay(MOCK_PROCESS_DELAY_MS);

  return {
    status: "success",
    transactionId: generateId("txn"),
  };
}

/**
 * Map gateway error codes to user-friendly messages.
 */
export function mapPaymentError(code: string): PaymentError {
  const errorMap: Record<string, PaymentError> = {
    card_declined: {
      code: "card_declined",
      message:
        "Your card was declined. Please try a different card or contact your bank.",
      retryable: false,
    },
    insufficient_funds: {
      code: "insufficient_funds",
      message:
        "Your card has insufficient funds. Please try a different payment method.",
      retryable: false,
    },
    expired_card: {
      code: "expired_card",
      message: "Your card has expired. Please use a different card.",
      retryable: false,
    },
    invalid_cvv: {
      code: "invalid_cvv",
      message: "The CVV you entered is incorrect. Please check and try again.",
      retryable: true,
    },
    processing_error: {
      code: "processing_error",
      message:
        "There was a problem processing your payment. Please try again.",
      retryable: true,
    },
    network_error: {
      code: "network_error",
      message:
        "A network error occurred. Please check your connection and try again.",
      retryable: true,
    },
    requires_action: {
      code: "requires_action",
      message: "Additional verification is required.",
      retryable: true,
    },
  };

  return (
    errorMap[code] || {
      code: "unknown",
      message: "An unknown error occurred. Please try again.",
      retryable: true,
    }
  );
}

// --- Helpers ---

function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 12)}`;
}

function isValidTestCard(number: string): boolean {
  // Luhn check for basic validation
  const digits = number.replace(/\D/g, "");
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
