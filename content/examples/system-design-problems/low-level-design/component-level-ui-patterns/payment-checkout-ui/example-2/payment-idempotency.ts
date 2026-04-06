/**
 * Payment Idempotency — Prevents duplicate charges on retry.
 *
 * Interview edge case: If the user clicks "Pay" twice or the network times out
 * after the charge was processed but before the response arrived, the second
 * request must not charge again. Solution: idempotency key derived from order ID.
 */

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  idempotencyKey: string;
}

/**
 * Generates a deterministic idempotency key from the order ID.
 * Same order ID always produces the same key, enabling deduplication.
 */
export function generateIdempotencyKey(orderId: string): string {
  return `pay_${orderId}`;
}

/**
 * Checks if a payment with the given idempotency key already exists.
 * If it does, returns the existing payment instead of creating a new one.
 */
export function checkIdempotency(
  existingPayments: PaymentIntent[],
  idempotencyKey: string,
): PaymentIntent | null {
  return existingPayments.find((p) => p.idempotencyKey === idempotencyKey) ?? null;
}

/**
 * Processes a payment with idempotency guard.
 * Returns existing payment if key already exists, otherwise processes new charge.
 */
export async function processPayment(
  orderId: string,
  amount: number,
  currency: string,
  existingPayments: PaymentIntent[],
  chargeFn: (intent: PaymentIntent) => Promise<PaymentIntent>,
): Promise<PaymentIntent> {
  const idempotencyKey = generateIdempotencyKey(orderId);

  // Check for existing payment (idempotency guard)
  const existing = checkIdempotency(existingPayments, idempotencyKey);
  if (existing) return existing;

  // Process new charge
  const intent: PaymentIntent = {
    id: `intent_${Date.now()}`,
    orderId,
    amount,
    currency,
    status: 'pending',
    idempotencyKey,
  };

  try {
    intent.status = 'processing';
    const result = await chargeFn(intent);
    return result;
  } catch (err) {
    intent.status = 'failed';
    throw err;
  }
}
