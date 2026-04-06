import { useEffect } from "react";
import { usePaginationStore, setupPopstateListener } from "../lib/pagination-store";

export function useUrlPaginationState() {
  const initFromUrl = usePaginationStore((state) => state.initFromUrl);

  useEffect(() => {
    initFromUrl();
  }, [initFromUrl]);

  useEffect(() => {
    setupPopstateListener();
  }, []);
}
