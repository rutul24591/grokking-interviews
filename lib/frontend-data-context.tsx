"use client";

import { createContext, useContext } from "react";
import type { SubCategoryItem } from "@/types/content";

const FrontendDataContext = createContext<SubCategoryItem[]>([]);

export function FrontendDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: SubCategoryItem[];
}) {
  return (
    <FrontendDataContext.Provider value={data}>
      {children}
    </FrontendDataContext.Provider>
  );
}

export function useFrontendData() {
  return useContext(FrontendDataContext);
}
