import { z } from "zod";

const messageSchema = z.object({
  id: z.string().min(1),
  ts: z.number().int(),
  topic: z.string().min(1),
  origin: z.string().min(1),
  payload: z.unknown()
});

export type PubSubMessage = z.infer<typeof messageSchema>;
export type Topic = string;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

export function createBroadcastPubSub(channelName: string) {
  const origin = createId();
  const channel = new BroadcastChannel(channelName);

  const subs = new Map<Topic, Set<(m: PubSubMessage) => void>>();
  const wildcard = new Set<(m: PubSubMessage) => void>();

  channel.onmessage = (e) => {
    const parsed = messageSchema.safeParse(e.data);
    if (!parsed.success) return;
    const msg = parsed.data;
    if (msg.origin === origin) return; // avoid local echo by default

    wildcard.forEach((fn) => fn(msg));
    subs.get(msg.topic)?.forEach((fn) => fn(msg));
  };

  function publish(topic: Topic, payload: unknown) {
    const msg: PubSubMessage = { id: createId(), ts: Date.now(), topic, origin, payload };
    channel.postMessage(msg);
    return msg;
  }

  function subscribe(topic: Topic, fn: (m: PubSubMessage) => void) {
    if (!subs.has(topic)) subs.set(topic, new Set());
    subs.get(topic)!.add(fn);
    return () => subs.get(topic)?.delete(fn);
  }

  function subscribeAll(fn: (m: PubSubMessage) => void) {
    wildcard.add(fn);
    return () => wildcard.delete(fn);
  }

  return { publish, subscribe, subscribeAll, close: () => channel.close(), origin };
}
