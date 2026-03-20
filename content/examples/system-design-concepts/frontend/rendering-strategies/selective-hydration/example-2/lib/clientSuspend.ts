"use client";

type Gate = { ready: boolean; promise: Promise<void> };
const gates = new Map<string, Gate>();

export function suspendOnClient(key: string, delayMs: number) {
  if (typeof window === "undefined") return;
  let gate = gates.get(key);
  if (!gate) {
    gate = { ready: false, promise: Promise.resolve() };
    gate.promise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        gate!.ready = true;
        resolve();
      }, delayMs);
    });
    gates.set(key, gate);
  }
  if (!gate.ready) throw gate.promise;
}

