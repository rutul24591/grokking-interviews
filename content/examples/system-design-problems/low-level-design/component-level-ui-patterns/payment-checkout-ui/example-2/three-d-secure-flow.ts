/**
 * 3D Secure Flow — Handles bank verification during checkout.
 *
 * Interview edge case: After card submission, the bank may require additional
 * verification (3D Secure). This triggers a redirect or modal. The payment
 * must pause, wait for verification, then resume or cancel based on the result.
 */

export interface ThreeDSecureResult {
  authenticated: boolean;
  liabilityShifted: boolean;
  transactionId: string;
}

/**
 * Simulates the 3D Secure authentication flow.
 * In production, this would redirect to the bank's 3DS challenge page or
 * render an iframe with the challenge.
 */
export async function handleThreeDSecure(
  paymentIntentId: string,
  challengeUrl: string,
  returnUrl: string,
): Promise<ThreeDSecureResult> {
  // In production: redirect or render challenge iframe
  // For demo: simulate the flow
  return new Promise((resolve) => {
    // Simulate challenge completion
    setTimeout(() => {
      resolve({
        authenticated: true,
        liabilityShifted: true,
        transactionId: `3ds_${paymentIntentId}_${Date.now()}`,
      });
    }, 2000);
  });
}

/**
 * Payment processor that handles 3D Secure redirects.
 */
export async function processPaymentWith3DS(
  cardToken: string,
  amount: number,
  requires3DS: boolean,
  challengeUrl: string,
  returnUrl: string,
): Promise<{ status: 'succeeded' | 'requires_action' | 'failed'; intentId?: string }> {
  // Step 1: Create payment intent
  const intentId = `pi_${Date.now()}`;

  if (!requires3DS) {
    // No 3DS required — direct charge
    return { status: 'succeeded', intentId };
  }

  // Step 2: 3DS required — redirect to challenge
  return { status: 'requires_action', intentId };
  // After redirect back, call handleThreeDSecure and then confirm payment
}
