"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

type SidebarState = {
  expandedIds: string[];
  mobileOpen: boolean;
  selectedSubCategoryId: string | null;
  selectedSubCategoryItemId: string | null;
  selectedTopicId: string | null;
  toggleExpanded: (id: string) => void;
  setExpanded: (ids: string[]) => void;
  setMobileOpen: (open: boolean) => void;
  setSelectedSubCategoryId: (id: string | null) => void;
  setSelectedSubCategoryItemId: (id: string | null) => void;
  setSelectedTopicId: (id: string | null) => void;
  setNavigationState: (
    subCategoryId: string | null,
    subCategoryItemId: string | null,
    topicId: string | null
  ) => void;
  isExpanded: (id: string) => boolean;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      expandedIds: ["cat-system-design"],
      mobileOpen: false,
      selectedSubCategoryId: null,
      selectedSubCategoryItemId: null,
      selectedTopicId: null,
      toggleExpanded: (id) => {
        const current = get().expandedIds;
        set({
          expandedIds: current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        });
      },
      setExpanded: (ids) => set({ expandedIds: ids }),
      setMobileOpen: (open) => set({ mobileOpen: open }),
      setSelectedSubCategoryId: (id) =>
        set({ selectedSubCategoryId: id, selectedSubCategoryItemId: null, selectedTopicId: null }),
      setSelectedSubCategoryItemId: (id) => set({ selectedSubCategoryItemId: id, selectedTopicId: null }),
      setSelectedTopicId: (id) => set({ selectedTopicId: id }),
      setNavigationState: (subCategoryId, subCategoryItemId, topicId) =>
        set({ selectedSubCategoryId: subCategoryId, selectedSubCategoryItemId: subCategoryItemId, selectedTopicId: topicId }),
      isExpanded: (id) => get().expandedIds.includes(id),
    }),
    {
      name: STORAGE_KEYS.sidebar,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage
      ),
      partialize: (state) => ({ expandedIds: state.expandedIds }),
      skipHydration: true,
    }
  )
);
