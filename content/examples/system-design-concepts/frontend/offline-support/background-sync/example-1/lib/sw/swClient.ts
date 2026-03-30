export async function registerSw(swUrl: string): Promise<ServiceWorkerRegistration> {
  if (typeof window === "undefined") throw new Error("Must run in the browser");
  if (!("serviceWorker" in navigator)) throw new Error("Service workers are not supported");
  const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
  await navigator.serviceWorker.ready;
  return reg;
}

export async function supportsBackgroundSync(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  const reg = await navigator.serviceWorker.ready;
  const anyReg = reg as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } };
  return Boolean(anyReg.sync?.register);
}

export async function requestSwDrain(): Promise<{ ok: boolean; applied: string[]; failed: string[] }> {
  if (typeof window === "undefined") throw new Error("Must run in the browser");
  const reg = await navigator.serviceWorker.ready;
  if (!reg.active) throw new Error("No active service worker");

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error("timeout waiting for SW drain")), 3_000);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data as { ok: boolean; applied: string[]; failed: string[] });
    };
    reg.active.postMessage({ type: "DRAIN_OUTBOX" }, [channel.port2]);
  });
}

