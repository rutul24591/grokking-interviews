import { create } from "zustand";
import type { PaginationState } from "./pagination-types";

interface PaginationStore extends PaginationState {
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  changePageSize: (size: number) => void;
  setTotalItems: (count: number) => void;
  initFromUrl: () => void;
}

function parseUrlParams(): { page: number; pageSize: number } {
  if (typeof window === "undefined") {
    return { page: 1, pageSize: 25 };
  }

  const params = new URLSearchParams(window.location.search);
  const rawPage = params.get("page");
  const rawPageSize = params.get("pageSize");

  const page = rawPage ? parseInt(rawPage, 10) : 1;
  const pageSize = rawPageSize ? parseInt(rawPageSize, 10) : 25;

  return {
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    pageSize: Number.isNaN(pageSize) || pageSize < 1 ? 25 : pageSize,
  };
}

function syncToUrl(
  page: number,
  pageSize: number,
  method: "pushState" | "replaceState" = "replaceState"
): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const newUrl = `${window.location.pathname}?${params.toString()}`;

  if (method === "pushState") {
    window.history.pushState({ page, pageSize }, "", newUrl);
  } else {
    window.history.replaceState({ page, pageSize }, "", newUrl);
  }
}

export const usePaginationStore = create<PaginationStore>((set, get) => {
  const urlParams = parseUrlParams();

  return {
    currentPage: urlParams.page,
    pageSize: urlParams.pageSize,
    totalItems: 0,
    totalPages: 0,
    syncToUrl: true,

    goToPage: (page: number) => {
      const { totalItems, pageSize, syncToUrl } = get();
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const clampedPage = Math.max(1, Math.min(page, totalPages));

      set({ currentPage: clampedPage });

      if (syncToUrl) {
        syncToUrl(clampedPage, pageSize, "replaceState");
      }
    },

    nextPage: () => {
      const { currentPage, totalItems, pageSize, syncToUrl } = get();
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        set({ currentPage: nextPage });
        if (syncToUrl) {
          syncToUrl(nextPage, pageSize, "replaceState");
        }
      }
    },

    prevPage: () => {
      const { currentPage, syncToUrl, pageSize } = get();
      if (currentPage > 1) {
        const prevPage = currentPage - 1;
        set({ currentPage: prevPage });
        if (syncToUrl) {
          syncToUrl(prevPage, pageSize, "replaceState");
        }
      }
    },

    goToFirst: () => {
      const { syncToUrl, pageSize } = get();
      set({ currentPage: 1 });
      if (syncToUrl) {
        syncToUrl(1, pageSize, "replaceState");
      }
    },

    goToLast: () => {
      const { totalItems, pageSize, syncToUrl } = get();
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      set({ currentPage: totalPages });
      if (syncToUrl) {
        syncToUrl(totalPages, pageSize, "replaceState");
      }
    },

    changePageSize: (size: number) => {
      const { syncToUrl } = get();
      set({ currentPage: 1, pageSize: size });
      if (syncToUrl) {
        syncToUrl(1, size, "replaceState");
      }
    },

    setTotalItems: (count: number) => {
      const { pageSize, currentPage, syncToUrl } = get();
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      const correctedPage = Math.min(currentPage, totalPages);

      set({
        totalItems: count,
        totalPages,
        currentPage: correctedPage,
      });

      if (syncToUrl && correctedPage !== currentPage) {
        syncToUrl(correctedPage, pageSize, "replaceState");
      }
    },

    initFromUrl: () => {
      const { page, pageSize } = parseUrlParams();
      set({ currentPage: page, pageSize });
    },
  };
});

export function setupPopstateListener(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("popstate", (event) => {
    const state = event.state as { page: number; pageSize: number } | null;
    if (state && typeof state.page === "number" && typeof state.pageSize === "number") {
      usePaginationStore.setState({
        currentPage: Math.max(1, state.page),
        pageSize: Math.max(1, state.pageSize),
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get("page") || "1", 10);
      const pageSize = parseInt(params.get("pageSize") || "25", 10);
      usePaginationStore.setState({
        currentPage: Number.isNaN(page) ? 1 : Math.max(1, page),
        pageSize: Number.isNaN(pageSize) ? 25 : Math.max(1, pageSize),
      });
    }
  });
}
