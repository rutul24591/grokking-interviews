import { z } from "zod";
import { domainEventEnvelopeSchemaV1, type DomainEventEnvelopeV1 } from "./events";

const sseDataSchema = z.object({
  v: z.number().int(),
  ts: z.number().int(),
  type: z.string(),
  data: z.unknown()
});

export type SseStatus = "connecting" | "connected" | "disconnected";

export function openDomainEventStream(opts: {
  url: string;
  onStatus: (s: SseStatus) => void;
  onDomainEvent: (evt: DomainEventEnvelopeV1) => void;
  onError: (reason: string) => void;
}) {
  opts.onStatus("connecting");
  const es = new EventSource(opts.url);

  es.onopen = () => opts.onStatus("connected");
  es.onerror = () => {
    // EventSource auto-reconnects. Treat this as “currently disconnected”.
    opts.onStatus("disconnected");
  };

  es.addEventListener("domain", (raw) => {
    try {
      const json = JSON.parse((raw as MessageEvent).data);
      const envelope = sseDataSchema.parse(json);
      const parsed = domainEventEnvelopeSchemaV1.safeParse(envelope);
      if (!parsed.success) {
        opts.onError("Event failed schema validation (v1).");
        return;
      }
      opts.onDomainEvent(parsed.data);
    } catch {
      opts.onError("Failed to parse SSE event payload.");
    }
  });

  return () => es.close();
}

