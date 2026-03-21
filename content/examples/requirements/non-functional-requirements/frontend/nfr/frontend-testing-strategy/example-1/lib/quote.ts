import { z } from "zod";

export const QuoteInputSchema = z.object({
  quantity: z.number().int().min(1).max(100),
  region: z.enum(["us", "eu", "in"]),
  promoCode: z.string().min(2).max(20).optional(),
});

export type QuoteInput = z.infer<typeof QuoteInputSchema>;

const BASE_UNIT_PRICE_CENTS = 499;

function regionTaxRate(region: QuoteInput["region"]) {
  switch (region) {
    case "us":
      return 0.07;
    case "eu":
      return 0.2;
    case "in":
      return 0.18;
  }
}

function discountPct(promoCode: string | undefined) {
  if (!promoCode) return 0;
  const c = promoCode.trim().toUpperCase();
  if (c === "SAVE10") return 0.1;
  if (c === "SAVE25") return 0.25;
  return 0;
}

export function computeQuote(input: QuoteInput) {
  const parsed = QuoteInputSchema.parse(input);
  const subtotal = parsed.quantity * BASE_UNIT_PRICE_CENTS;
  const discount = Math.round(subtotal * discountPct(parsed.promoCode));
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * regionTaxRate(parsed.region));
  const totalCents = taxable + tax;
  return {
    totalCents,
    breakdown: { subtotal, discount, tax },
  };
}

