import { describe, expect, it } from "vitest";
import { computeQuote } from "@/lib/quote";

describe("computeQuote", () => {
  it("applies promo discount before tax", () => {
    const q = computeQuote({ quantity: 2, region: "us", promoCode: "SAVE10" });
    expect(q.breakdown.subtotal).toBe(998);
    expect(q.breakdown.discount).toBe(100);
    expect(q.breakdown.tax).toBeGreaterThan(0);
    expect(q.totalCents).toBe(q.breakdown.subtotal - q.breakdown.discount + q.breakdown.tax);
  });

  it("ignores unknown promo codes", () => {
    const a = computeQuote({ quantity: 1, region: "eu", promoCode: "NOPE" });
    const b = computeQuote({ quantity: 1, region: "eu" });
    expect(a.totalCents).toBe(b.totalCents);
  });
});

