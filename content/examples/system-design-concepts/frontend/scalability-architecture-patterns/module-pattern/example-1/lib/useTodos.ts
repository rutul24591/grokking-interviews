"use client";

import { useSyncExternalStore } from "react";
import { todoModule } from "./todoModule";

export function useTodos() {
  return useSyncExternalStore(todoModule.subscribe, todoModule.getSnapshot, todoModule.getSnapshot);
}

