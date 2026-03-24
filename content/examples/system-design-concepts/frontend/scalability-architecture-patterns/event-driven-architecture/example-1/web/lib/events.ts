import { z } from "zod";

export const domainEventEnvelopeSchemaV1 = z.object({
  v: z.literal(1),
  ts: z.number().int(),
  type: z.string().min(1),
  data: z.unknown()
});

export type DomainEventEnvelopeV1 = z.infer<typeof domainEventEnvelopeSchemaV1>;

export function renderEventSummary(evt: DomainEventEnvelopeV1) {
  if (evt.type === "heartbeat") return "heartbeat";
  if (evt.type === "counter.incremented") return `counter +${(evt.data as any)?.by ?? 1}`;
  if (evt.type === "connection.opened") return "connection opened";
  return evt.type;
}

