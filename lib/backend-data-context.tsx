"use client";

import { createContext, useContext } from "react";
import type { SubCategoryItem } from "@/types/content";

const BackendDataContext = createContext<SubCategoryItem[]>([]);

export function BackendDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: SubCategoryItem[];
}) {
  return (
    <BackendDataContext.Provider value={data}>
      {children}
    </BackendDataContext.Provider>
  );
}

export function useBackendData() {
  return useContext(BackendDataContext);
}
