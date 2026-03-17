"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect when the component has mounted on the client.
 * Useful for avoiding hydration mismatches when accessing browser APIs.
 *
 * @returns true if the component has mounted, false otherwise
 *
 * @example
 * const mounted = useHasMounted();
 * if (!mounted) return null; // or show loading state
 * return <div>{window.innerWidth}</div>;
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
