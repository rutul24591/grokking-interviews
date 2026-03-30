export type UpdateState =
  | { status: "idle"; actions?: UpdateActions }
  | { status: "registering"; actions?: UpdateActions }
  | { status: "ready"; actions: UpdateActions }
  | { status: "waiting"; actions: UpdateActions }
  | { status: "reloading"; actions: UpdateActions }
  | { status: "error"; message: string; actions?: UpdateActions };

type UpdateActions = {
  checkForUpdate: () => Promise<void>;
  activateWaiting: () => Promise<void>;
};

async function requestSwVersion(worker: ServiceWorker): Promise<string | null> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 800);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(typeof event.data?.version === "string" ? event.data.version : null);
    };
    worker.postMessage({ type: "GET_VERSION" }, [channel.port2]);
  });
}

export async function registerForUpdates(params: {
  swUrl: string;
  onState: (state: UpdateState) => void;
  onVersions: (v: { active?: string | null; waiting?: string | null }) => void;
}): Promise<() => void> {
  if (typeof window === "undefined") throw new Error("Must run in the browser");
  if (!("serviceWorker" in navigator)) throw new Error("Service workers are not supported");

  let activeReg: ServiceWorkerRegistration | null = null;
  let unsubscribed = false;

  const actions: UpdateActions = {
    checkForUpdate: async () => {
      if (!activeReg) return;
      await activeReg.update();
    },
    activateWaiting: async () => {
      if (!activeReg?.waiting) return;
      activeReg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  params.onState({ status: "registering", actions });

  const reg = await navigator.serviceWorker.register(params.swUrl, { scope: "/" });
  activeReg = reg;

  const refreshVersions = async () => {
    const active = reg.active ? await requestSwVersion(reg.active) : null;
    const waiting = reg.waiting ? await requestSwVersion(reg.waiting) : null;
    if (!unsubscribed) params.onVersions({ active, waiting });
  };

  const onControllerChange = () => {
    if (unsubscribed) return;
    params.onState({ status: "reloading", actions });
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

  const onUpdateFound = () => {
    const installing = reg.installing;
    if (!installing) return;
    installing.addEventListener("statechange", async () => {
      if (unsubscribed) return;
      if (installing.state === "installed") {
        await refreshVersions();
        if (navigator.serviceWorker.controller) params.onState({ status: "waiting", actions });
        else params.onState({ status: "ready", actions });
      }
    });
  };

  reg.addEventListener("updatefound", onUpdateFound);

  await navigator.serviceWorker.ready;
  await refreshVersions();

  if (reg.waiting) params.onState({ status: "waiting", actions });
  else params.onState({ status: "ready", actions });

  return () => {
    unsubscribed = true;
    navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    reg.removeEventListener("updatefound", onUpdateFound);
  };
}

