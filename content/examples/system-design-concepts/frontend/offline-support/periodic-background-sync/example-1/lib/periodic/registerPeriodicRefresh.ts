type PeriodicSyncManagerLike = {
  register: (tag: string, options: { minInterval: number }) => Promise<void>;
  getTags?: () => Promise<string[]>;
};

type RegistrationLike = ServiceWorkerRegistration & {
  periodicSync?: PeriodicSyncManagerLike;
};

export async function registerPeriodicRefresh(params: {
  swUrl: string;
  tag: string;
  minIntervalMs: number;
  onVisible: () => void;
}): Promise<{ mode: "periodic-sync" | "visibility-fallback"; detail: string }> {
  const reg = (await navigator.serviceWorker.register(params.swUrl, { scope: "/" })) as RegistrationLike;
  await navigator.serviceWorker.ready;

  if (reg.periodicSync?.register) {
    try {
      await reg.periodicSync.register(params.tag, { minInterval: params.minIntervalMs });
      return {
        mode: "periodic-sync",
        detail: `Registered ${params.tag} with minInterval=${params.minIntervalMs}ms. Browsers may still throttle or skip execution.`
      };
    } catch (e) {
      setupVisibilityFallback(params.onVisible);
      return {
        mode: "visibility-fallback",
        detail: `Periodic sync registration failed (${e instanceof Error ? e.message : String(e)}). Falling back to refresh-on-visible.`
      };
    }
  }

  setupVisibilityFallback(params.onVisible);
  return {
    mode: "visibility-fallback",
    detail: "Periodic sync API unavailable. Using refresh-on-visible fallback."
  };
}

function setupVisibilityFallback(onVisible: () => void) {
  if (typeof document === "undefined") return;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") onVisible();
  });
}

