"use client";

import { useNetworkStatus } from "@/features/network-status/useNetworkStatus";
import { classNames } from "@/lib/classNames";
import { useHasMounted } from "@/lib/useHasMounted";

export function NetworkStatus() {
  const { online } = useNetworkStatus();
  const mounted = useHasMounted();

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-theme px-3 py-1.5 text-xs"
      aria-live="polite"
    >
      <span
        className={classNames(
          "h-2 w-2 rounded-full",
          !mounted ? "bg-panel-hover" : online ? "bg-online" : "bg-offline"
        )}
        aria-hidden
      />
      <span className="text-muted">
        {!mounted ? "Checking" : online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
