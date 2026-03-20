import { randomUUID } from "node:crypto";

export type ChargeResult = {
  chargeId: string;
  amountUsd: number;
  currency: string;
  customerId: string;
  createdAt: string;
};

export async function createCharge(input: { customerId: string; amountUsd: number; currency: string }): Promise<ChargeResult> {
  // Simulate a non-idempotent downstream provider call.
  return {
    chargeId: "ch_" + randomUUID(),
    customerId: input.customerId,
    amountUsd: input.amountUsd,
    currency: input.currency,
    createdAt: new Date().toISOString()
  };
}

