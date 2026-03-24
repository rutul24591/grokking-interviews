"use client";

import { announcer } from "@/lib/announcerBus";

export function useAnnouncer() {
  return {
    status: (message: string) => announcer.publish({ type: "status", message }),
    alert: (message: string) => announcer.publish({ type: "alert", message })
  };
}

