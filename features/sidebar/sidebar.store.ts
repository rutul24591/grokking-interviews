"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";

export type SidebarItem = {
  id: string;
  name: string;
  slug?: string;
  children?: SidebarItem[];
};

export type Domain = {
  id: string;
  name: string;
  slug: string;
  categories: Category[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  topics: Topic[];
};

export type Topic = {
  id: string;
  name: string;
  slug: string;
};

type SidebarState = {
  // Expanded state for each level
  expandedDomains: string[];
  expandedCategories: string[];
  expandedSubcategories: string[];

  // Selected item (currently viewing)
  selectedTopic: string | null;

  // Mobile open state
  isMobileOpen: boolean;

  // Actions
  toggleDomain: (domainId: string) => void;
  toggleCategory: (categoryId: string) => void;
  toggleSubcategory: (subcategoryId: string) => void;
  selectTopic: (topicSlug: string | null) => void;
  setMobileOpen: (isOpen: boolean) => void;
  collapseAll: () => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      expandedDomains: [],
      expandedCategories: [],
      expandedSubcategories: [],
      selectedTopic: null,
      isMobileOpen: false,

      toggleDomain: (domainId) =>
        set((state) => ({
          expandedDomains: state.expandedDomains.includes(domainId)
            ? state.expandedDomains.filter((id) => id !== domainId)
            : [...state.expandedDomains, domainId],
        })),

      toggleCategory: (categoryId) =>
        set((state) => ({
          expandedCategories: state.expandedCategories.includes(categoryId)
            ? state.expandedCategories.filter((id) => id !== categoryId)
            : [...state.expandedCategories, categoryId],
        })),

      toggleSubcategory: (subcategoryId) =>
        set((state) => ({
          expandedSubcategories: state.expandedSubcategories.includes(
            subcategoryId
          )
            ? state.expandedSubcategories.filter((id) => id !== subcategoryId)
            : [...state.expandedSubcategories, subcategoryId],
        })),

      selectTopic: (topicSlug) => set({ selectedTopic: topicSlug }),

      setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),

      collapseAll: () =>
        set({
          expandedDomains: [],
          expandedCategories: [],
          expandedSubcategories: [],
        }),
    }),
    {
      name: STORAGE_KEYS.sidebar,
      partialize: (state) => ({
        expandedDomains: state.expandedDomains,
        expandedCategories: state.expandedCategories,
        expandedSubcategories: state.expandedSubcategories,
      }),
    }
  )
);
