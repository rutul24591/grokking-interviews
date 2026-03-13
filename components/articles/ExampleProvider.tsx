"use client";

import type { ReactNode } from "react";
import { ExampleContext } from "@/components/articles/ExampleContext";
import type { ExampleGroup } from "@/types/examples";

type ExampleProviderProps = {
  examples: ExampleGroup[];
  children: ReactNode;
};

export function ExampleProvider({ examples, children }: ExampleProviderProps) {
  return (
    <ExampleContext.Provider value={{ examples }}>
      {children}
    </ExampleContext.Provider>
  );
}
