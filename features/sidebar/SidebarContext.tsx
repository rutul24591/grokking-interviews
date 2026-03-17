"use client";

import { createContext, useContext } from "react";

type SidebarContextValue = {
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarProvider"
    );
  }
  return context;
}
