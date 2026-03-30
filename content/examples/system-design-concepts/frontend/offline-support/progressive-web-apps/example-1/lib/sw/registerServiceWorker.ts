export async function registerServiceWorker(swUrl: string): Promise<ServiceWorkerRegistration> {
  if (typeof window === "undefined") throw new Error("registerServiceWorker must run in the browser");
  if (!("serviceWorker" in navigator)) throw new Error("Service workers are not supported in this browser");

  const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });

  // Wait for the SW to reach ready state (controls pages after a reload).
  await navigator.serviceWorker.ready;
  return reg;
}

