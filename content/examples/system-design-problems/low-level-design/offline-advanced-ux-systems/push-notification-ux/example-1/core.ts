export type Channel = "marketing" | "product" | "security";

export type Prefs = {
  enabled: boolean;
  channels: Record<Channel, boolean>;
  quietHours?: { start: string; end: string };
};

export function defaultPrefs(): Prefs {
  return { enabled: false, channels: { marketing: false, product: true, security: true } };
}

export function canSend(prefs: Prefs, channel: Channel, now: Date) {
  if (!prefs.enabled) return false;
  if (!prefs.channels[channel]) return false;
  // quiet hours enforcement typically server-side too
  return true;
}
