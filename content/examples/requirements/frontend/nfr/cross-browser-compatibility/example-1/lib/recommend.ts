export type Capabilities = {
  intersectionObserver: boolean;
  resizeObserver: boolean;
  intl: boolean;
  webCrypto: boolean;
  broadcastChannel: boolean;
};

export type Recommendation = { id: string; title: string; action: string; tradeoff: string };

export function recommend(c: Capabilities): Recommendation[] {
  const out: Recommendation[] = [];
  if (!c.intersectionObserver) {
    out.push({
      id: "io",
      title: "IntersectionObserver missing",
      action: "Fallback to scroll listeners + throttling, or ship a polyfill for supported browsers.",
      tradeoff: "Scroll-based detection uses more CPU and is easier to get wrong under zoom/iframes.",
    });
  }
  if (!c.resizeObserver) {
    out.push({
      id: "ro",
      title: "ResizeObserver missing",
      action: "Fallback to window resize + layout polling for specific components.",
      tradeoff: "Polling increases CPU usage and can miss intermediate layout states.",
    });
  }
  if (!c.intl) {
    out.push({
      id: "intl",
      title: "Intl missing",
      action: "Ship `Intl` polyfills or reduce formatting features for legacy browsers.",
      tradeoff: "Polyfills increase bundle size; reduced formatting impacts i18n quality.",
    });
  }
  if (!c.webCrypto) {
    out.push({
      id: "crypto",
      title: "WebCrypto missing",
      action: "Avoid client-side crypto features; move encryption to the server or disable feature.",
      tradeoff: "Server-side crypto changes threat model and may increase latency.",
    });
  }
  if (!c.broadcastChannel) {
    out.push({
      id: "bc",
      title: "BroadcastChannel missing",
      action: "Fallback to localStorage events, polling, or server-mediated sync.",
      tradeoff: "localStorage events are limited; polling increases latency/CPU.",
    });
  }
  return out;
}

