import type { Notification } from "@/lib/notifications";

export type Message =
  | { type: "heartbeat"; tabId: string; version: number }
  | { type: "update"; tabId: string; version: number; notifications: Notification[] };

export function openChannel(name: string, onMessage: (m: Message) => void) {
  const bc = new BroadcastChannel(name);
  bc.onmessage = (ev) => onMessage(ev.data as Message);
  return {
    send: (m: Message) => bc.postMessage(m),
    close: () => bc.close(),
  };
}

