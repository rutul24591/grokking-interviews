import { z } from "zod";

/**
 * “Contract test” idea:
 * - consumers validate responses against a schema
 * - producers validate that their changes remain backwards compatible
 *
 * This demo models a quote response and checks a few change scenarios.
 */

const QuoteV1 = z.object({
  ok: z.literal(true),
  quote: z.object({
    totalCents: z.number().int().nonnegative(),
    breakdown: z.object({
      subtotal: z.number().int(),
      discount: z.number().int(),
      tax: z.number().int(),
    }),
  }),
});

const QuoteV2_Additive = QuoteV1.extend({
  requestId: z.string().optional(),
});

const QuoteV2_Breaking = z.object({
  ok: z.literal(true),
  quote: z.object({
    totalCents: z.string(), // breaking: type changed
    breakdown: z.record(z.number()), // breaking: shape changed
  }),
});

const sampleProducerPayload = {
  ok: true,
  quote: { totalCents: 1234, breakdown: { subtotal: 1000, discount: 0, tax: 234 } },
};

function canConsumerParse(schema: z.ZodTypeAny, payload: unknown) {
  return schema.safeParse(payload).success;
}

console.log(
  JSON.stringify(
    {
      consumerUsingV1_canParse_producerV1: canConsumerParse(QuoteV1, sampleProducerPayload),
      consumerUsingV1_canParse_additiveV2: canConsumerParse(QuoteV1, { ...sampleProducerPayload, requestId: "req_1" }),
      consumerUsingV1_canParse_breakingV2: canConsumerParse(QuoteV1, { ok: true, quote: { totalCents: "1234", breakdown: {} } }),
      producerV2_additive_stillAccepts_oldPayload: canConsumerParse(QuoteV2_Additive, sampleProducerPayload),
      producerV2_breaking_accepts_oldPayload: canConsumerParse(QuoteV2_Breaking, sampleProducerPayload),
    },
    null,
    2,
  ),
);

