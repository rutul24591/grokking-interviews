"use client";

import { useSyncExternalStore } from "react";
import type { Observable } from "./batchedObservable";

export function useObservableValue<T>(obs: Observable<T>) {
  return useSyncExternalStore(obs.subscribe, obs.get, obs.get);
}

