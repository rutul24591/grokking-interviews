"use client";

let promise: Promise<typeof import(\"@/app/_components/HeavyWidget\")> | null = null;

export function loadHeavyWidget() {
  // Dedup: if multiple islands request the same chunk, share the promise.
  if (!promise) promise = import(\"@/app/_components/HeavyWidget\");
  return promise;
}

