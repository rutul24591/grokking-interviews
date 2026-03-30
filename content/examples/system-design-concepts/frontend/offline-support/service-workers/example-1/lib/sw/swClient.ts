export async function registerServiceWorker(swUrl: string): Promise<ServiceWorkerRegistration> {
  if (typeof window === "undefined") throw new Error("Must run in the browser");
  if (!("serviceWorker" in navigator)) throw new Error("Service workers are not supported");
  const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
  await navigator.serviceWorker.ready;
  return reg;
}

export async function requestCacheStats(): Promise<{ cacheNames: string[]; totalEntries: number } | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  const reg = await navigator.serviceWorker.ready;
  if (!reg.active) return null;

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 800);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data ?? null);
    };
    reg.active.postMessage({ type: "GET_CACHE_STATS" }, [channel.port2]);
  });
}

